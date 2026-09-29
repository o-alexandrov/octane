import { formatClientError } from "../error-codes.client.generated.js";
import { decodeSignalValue, encodeSignalValue } from "./encoding.js";
import { createResourceCellWith } from "./engine.js";
import { SignalStreamError } from "./errors.js";
import {
  ScopedNode,
  CandidateUnsupportedError,
  assertAlive,
  assertWritable,
  errorState,
  idleState,
  invalidateNode,
  isThenable,
  pendingState,
  publishNode,
  pure,
  readyState,
  refreshNode,
  releaseRetention,
  signalBatch,
  untrack,
  untrackCommitted
} from "./graph.js";
import {
  QUERY_REQUEST,
  skip
} from "./types.js";
import {
  captureCurrentServerSignalQueryAttemptObserver,
  hasServerSignalQueryAttemptObserver,
  serverSignalQueryAttemptObserver
} from "./query-attempt-observer.js";
class Request {
  constructor(definition, argument) {
    this.definition = definition;
    this.queryKey = definition.key;
    const encoded = encodeSignalValue(argument);
    this.identity = JSON.stringify([definition.key, encoded]);
    this.argument = decodeSignalValue(encoded);
    Object.freeze(this);
  }
  definition;
  get [QUERY_REQUEST]() {
    return void 0;
  }
  queryKey;
  identity;
  argument;
}
function query(key, load, options) {
  if (typeof key !== "string" || !key.trim() || typeof load !== "function") {
    throw new TypeError(formatClientError(195));
  }
  const kind = options?.kind ?? "promise";
  if (kind !== "promise" && kind !== "stream") throw new TypeError(formatClientError(196));
  const definition = Object.freeze({ key, load, kind });
  const describe = Object.assign((argument) => new Request(definition, argument), {
    queryKey: key,
    kind
  });
  return Object.freeze(describe);
}
function createResource(owner, key, describe) {
  return createResourceCellWith(owner, key, describe, initializeResource, true);
}
function makeAttempt(entry, generation, streamed = false) {
  let resolve;
  const settled = new Promise((done) => {
    resolve = done;
  });
  return {
    entry,
    controller: streamed ? void 0 : new AbortController(),
    iterator: void 0,
    settled,
    generation,
    streamed,
    result: void 0,
    observations: void 0,
    sequence: 0,
    resolve,
    hasYielded: false
  };
}
class RequestEntry {
  constructor(owner, request, seed) {
    this.owner = owner;
    this.request = request;
    this.state = seed ? readyState(seed.value, {
      complete: seed.entry.complete,
      connection: request.definition.kind === "stream" ? "closed" : "none",
      requestKey: request.identity
    }) : pendingState(Promise.resolve(), "none", request.identity);
  }
  owner;
  request;
  consumers = /* @__PURE__ */ new Set();
  state;
  attempt;
  generation = 0;
  get active() {
    return this.attempt !== void 0;
  }
  get attemptGeneration() {
    return this.generation;
  }
  observe(nodeKey) {
    const attempt = this.attempt;
    if (!attempt || attempt.streamed) return;
    const context = serverSignalQueryAttemptObserver(this.owner.scopeKey);
    if (context === void 0) return;
    const observations = attempt.observations ??= context.createObservations();
    observations.observe(context, {
      nodeKey,
      selectionKey: this.request.identity,
      attempt: attempt.generation,
      kind: this.request.definition.kind,
      result: attempt.result,
      isCurrent: () => currentEntry(attempt) === this
    });
    return attempt;
  }
  start(pending) {
    if (this.owner.readBarrier !== void 0) return;
    const generation = ++this.generation;
    this.stopAttempt();
    if (generation !== this.generation || this.owner.readBarrier !== void 0 || this.owner.retired || this.owner.requests?.get(this.request.identity) !== this || !this.consumers.size)
      return;
    const previous = this.state.snapshot;
    const attempt = this.attempt = makeAttempt(this, generation);
    const connection = this.request.definition.kind === "stream" ? "connecting" : "none";
    this.state = !pending && previous.status === "ready" ? readyState(previous.value, {
      refreshing: true,
      connection,
      complete: false,
      requestKey: this.request.identity
    }) : pendingState(attempt.settled, connection, this.request.identity);
    this.deliver();
    let result;
    try {
      result = untrack(
        () => signalBatch(
          () => this.request.definition.load(this.request.argument, {
            signal: attempt.controller.signal,
            ...previous.status === "ready" ? { previous: previous.value } : {}
          })
        )
      );
    } catch (error) {
      failAttempt(attempt, error);
      return;
    }
    if (this.request.definition.kind === "stream") observeStream(attempt, result);
    else {
      if (currentEntry(attempt)) attempt.result = result;
      observePromise(attempt, result);
    }
  }
  startStreamed(identity) {
    if (this.owner.readBarrier !== void 0 || identity.selectionKey !== this.request.identity || identity.attempt < this.generation || this.attempt === void 0 && identity.attempt === this.generation && this.state.snapshot.status !== "pending" || this.owner.retired || !this.consumers.size) {
      return false;
    }
    if (this.attempt?.streamed && this.attempt.generation === identity.attempt) {
      return true;
    }
    this.generation = identity.attempt;
    this.stopAttempt();
    if (this.generation !== identity.attempt || this.owner.readBarrier !== void 0 || this.owner.retired || this.owner.requests?.get(this.request.identity) !== this || !this.consumers.size) {
      return false;
    }
    this.attempt = makeAttempt(this, identity.attempt, true);
    return true;
  }
  acceptStreamed(frame) {
    const attempt = this.attempt;
    if (!attempt?.streamed || attempt.generation !== frame.identity.attempt || frame.sequence !== attempt.sequence || currentEntry(attempt) !== this) {
      return false;
    }
    attempt.sequence++;
    signalBatch(() => {
      if (frame.kind === "open") return;
      if (frame.kind === "value") {
        attempt.hasYielded = true;
        this.state = readyState(decodeSignalValue(frame.value), {
          requestKey: this.request.identity,
          connection: this.request.definition.kind === "stream" ? "open" : "none",
          complete: false
        });
        this.deliver();
        return;
      }
      if (frame.kind === "error") {
        this.state = errorState(
          new SignalStreamError(frame.code),
          this.request.definition.kind === "stream" ? "closed" : "none",
          this.request.identity
        );
        completeAttempt(attempt);
        this.deliver();
        return;
      }
      if (!attempt.hasYielded || this.state.snapshot.status !== "ready") {
        this.state = errorState(
          new Error(formatClientError(197)),
          this.request.definition.kind === "stream" ? "closed" : "none",
          this.request.identity
        );
        completeAttempt(attempt);
        this.deliver();
        return;
      }
      this.state = readyState(this.state.snapshot.value, {
        requestKey: this.request.identity,
        connection: this.request.definition.kind === "stream" ? "closed" : "none",
        complete: true
      });
      completeAttempt(attempt);
      this.deliver();
    });
    return true;
  }
  deliver() {
    for (const consumer of this.consumers) consumer.deliver();
  }
  stopAttempt() {
    const attempt = this.attempt;
    if (!attempt) return;
    this.attempt = void 0;
    attempt.entry = void 0;
    const controller = attempt.controller;
    const iterator = attempt.iterator;
    attempt.controller = void 0;
    attempt.iterator = void 0;
    attempt.result = void 0;
    attempt.observations?.retire();
    attempt.resolve();
    if (controller) untrackCommitted(() => signalBatch(() => controller.abort()));
    if (iterator) closeIterator(iterator);
  }
  remove(consumer) {
    this.consumers.delete(consumer);
    if (this.consumers.size) return;
    if (this.owner.requests?.get(this.request.identity) === this) {
      this.owner.requests?.delete(this.request.identity);
    }
    this.stopAttempt();
  }
}
function currentEntry(attempt) {
  const entry = attempt.entry;
  return entry && !entry.owner.retired && entry.attempt === attempt ? entry : void 0;
}
function completeAttempt(attempt) {
  attempt.observations?.complete();
  const entry = attempt.entry;
  if (entry?.attempt === attempt) entry.attempt = void 0;
  attempt.entry = void 0;
  attempt.controller = void 0;
  attempt.iterator = void 0;
  attempt.result = void 0;
  attempt.resolve();
}
function observePromise(attempt, result) {
  Promise.resolve(result).then(
    (value) => {
      const entry = currentEntry(attempt);
      if (!entry) return;
      signalBatch(() => {
        entry.state = readyState(value, { requestKey: entry.request.identity });
        completeAttempt(attempt);
        entry.deliver();
      });
    },
    (error) => failAttempt(attempt, error)
  );
}
function failAttempt(attempt, error) {
  const entry = currentEntry(attempt);
  if (!entry) return;
  attempt.observations?.fail(error);
  signalBatch(() => {
    const iterator = attempt.iterator;
    entry.state = errorState(
      error,
      entry.request.definition.kind === "stream" ? "closed" : "none",
      entry.request.identity
    );
    completeAttempt(attempt);
    if (iterator) closeIterator(iterator);
    entry.deliver();
  });
}
function ignoreRetiredCloseFailure() {
}
function closeIterator(iterator) {
  try {
    const result = untrackCommitted(() => signalBatch(() => iterator.return?.()));
    Promise.resolve(result).catch(ignoreRetiredCloseFailure);
  } catch {
  }
}
function observeStream(attempt, result) {
  Promise.resolve(result).then(
    (iterable) => {
      if (!currentEntry(attempt)) return;
      let iterator;
      try {
        if (!iterable || typeof iterable[Symbol.asyncIterator] !== "function") {
          throw new TypeError(formatClientError(198));
        }
        iterator = untrack(
          () => signalBatch(() => iterable[Symbol.asyncIterator]())
        );
        if (!iterator || typeof iterator.next !== "function") {
          throw new TypeError(formatClientError(199));
        }
      } catch (error) {
        failAttempt(attempt, error);
        return;
      }
      if (!currentEntry(attempt)) {
        closeIterator(iterator);
        return;
      }
      attempt.iterator = iterator;
      nextStreamStep(attempt);
    },
    (error) => failAttempt(attempt, error)
  );
}
function nextStreamStep(attempt) {
  if (!currentEntry(attempt) || !attempt.iterator) return;
  let step;
  try {
    step = untrack(() => signalBatch(() => attempt.iterator.next()));
  } catch (error) {
    failAttempt(attempt, error);
    return;
  }
  Promise.resolve(step).then(
    (result) => receiveStreamStep(attempt, result),
    (error) => failAttempt(attempt, error)
  );
}
function receiveStreamStep(attempt, result) {
  let entry = currentEntry(attempt);
  if (!entry) return;
  if (!result || typeof result !== "object" && typeof result !== "function") {
    failAttempt(attempt, new TypeError(formatClientError(114)));
    return;
  }
  let done = false;
  let value;
  try {
    untrack(
      () => signalBatch(() => {
        done = Boolean(result.done);
        if (!done) value = result.value;
      })
    );
  } catch (error) {
    failAttempt(attempt, error);
    return;
  }
  entry = currentEntry(attempt);
  if (!entry) return;
  const accepted = entry;
  if (done) {
    if (!attempt.hasYielded || entry.state.snapshot.status !== "ready") {
      failAttempt(attempt, new Error(formatClientError(115)));
      return;
    }
    signalBatch(() => {
      accepted.state = readyState(accepted.state.snapshot.value, {
        connection: "closed",
        complete: true,
        requestKey: accepted.request.identity
      });
      completeAttempt(attempt);
      accepted.deliver();
    });
    return;
  }
  attempt.hasYielded = true;
  signalBatch(() => {
    accepted.state = readyState(value, {
      connection: "open",
      complete: false,
      requestKey: accepted.request.identity
    });
    accepted.deliver();
  });
  const observed = attempt.observations?.publish(value);
  if (observed === void 0) nextStreamStep(attempt);
  else observed.then(() => nextStreamStep(attempt));
}
class ResourceBinding {
  constructor(owner, node, describe, seed, retained = seed) {
    this.owner = owner;
    this.node = node;
    this.describe = describe;
    this.seeded = seed;
    const identity = retained?.entry.request;
    this.retainedRequest = identity ? {
      queryKey: identity.queryKey,
      kind: identity.kind,
      argument: decodeSignalValue(identity.argument)
    } : void 0;
    node.compute = () => {
      const pending = this.pendingObserver;
      this.pendingObserver = void 0;
      return pending === void 0 || hasServerSignalQueryAttemptObserver(this.owner.scopeKey) ? this.compute() : pending(() => this.compute());
    };
    node.retry = (options) => this.retry(options);
  }
  owner;
  node;
  describe;
  selected;
  selectedIdentity;
  retainedRequest;
  seeded;
  describedAttempt;
  observedAttempt;
  pendingObserver;
  pendingPromise;
  resolvePending;
  streamedSelection;
  selectionAuthority = {};
  request() {
    const request = pure(() => this.describe());
    if (request === skip) return request;
    if (!(request instanceof Request)) throw new TypeError(formatClientError(200));
    return request;
  }
  forkCandidate(target) {
    if (this.streamedSelection || this.owner.streams?.selections.has(this.node.key)) {
      throw new CandidateUnsupportedError(formatClientError(201));
    }
    const fork = new ResourceBinding(this.owner, target, this.describe);
    fork.candidate = true;
    fork.retainedRequest = this.retainedRequest;
    return {
      dispose: () => fork.dispose(),
      prepare: () => {
        if (this.streamedSelection || this.owner.streams?.selections.has(this.node.key))
          return { status: "invalid" };
        const entry = fork.selected;
        const attempt = entry?.attempt;
        if (entry) {
          if (attempt?.streamed) return { status: "invalid" };
          const snapshot = entry.state.snapshot;
          if (attempt && (entry.request.definition.kind !== "stream" || snapshot.status !== "ready"))
            return { status: "pending", waiting: target.state?.waiting ?? attempt.settled };
          if (!(snapshot.status === "ready" && (snapshot.complete || entry.request.definition.kind === "stream") || snapshot.status === "error"))
            return { status: "invalid" };
        } else if (target.state?.snapshot.status !== "idle") {
          const state2 = target.state;
          if (state2?.snapshot.status === "error")
            return { status: "error", error: state2.snapshot.error };
          if (state2?.waiting) return { status: "pending", waiting: state2.waiting };
          return { status: "invalid" };
        }
        const state = entry?.state;
        const authority = this.selectionAuthority;
        const forkAuthority = fork.selectionAuthority;
        return {
          status: "ready",
          receipt: {
            validate: () => !this.streamedSelection && !this.owner.streams?.selections.has(this.node.key) && this.selectionAuthority === authority && fork.selectionAuthority === forkAuthority && fork.selected === entry && (entry ? entry.state === state && entry.attempt === attempt && entry.consumers.has(fork) : target.state?.snapshot.status === "idle"),
            publish: () => {
              const previous = this.selected;
              const resolve = this.resolvePending;
              entry?.consumers.add(this);
              entry?.consumers.delete(fork);
              this.selected = entry;
              this.selectedIdentity = fork.selectedIdentity;
              this.retainedRequest = fork.retainedRequest;
              this.describedAttempt = fork.describedAttempt;
              this.observedAttempt = fork.observedAttempt;
              this.selectionAuthority = fork.selectionAuthority;
              this.pendingObserver = void 0;
              this.pendingPromise = void 0;
              this.resolvePending = void 0;
              this.seeded = void 0;
              fork.selected = void 0;
              return () => {
                resolve?.();
                if (previous !== entry && previous !== this.selected) previous?.remove(this);
              };
            }
          }
        };
      }
    };
  }
  compute() {
    let request;
    try {
      const described = this.request();
      if (described === skip) {
        this.detach();
        this.seeded = void 0;
        return idleState();
      }
      request = described;
      const previousDefinition = this.owner.queryDefinitions?.get(request.queryKey);
      if (previousDefinition && (previousDefinition.load !== request.definition.load || previousDefinition.kind !== request.definition.kind)) {
        throw new TypeError(formatClientError(202, request.queryKey));
      }
      (this.owner.queryDefinitions ??= /* @__PURE__ */ new Map()).set(request.queryKey, request.definition);
    } catch (error) {
      if (isThenable(error)) {
        this.pendingObserver = captureCurrentServerSignalQueryAttemptObserver(this.owner.scopeKey);
      }
      this.detach();
      throw error;
    }
    if (this.selected?.request.identity !== request.identity) {
      this.detach();
      assertAlive(this.owner);
      if (this.candidate && this.describe === void 0) {
        throw new TypeError(formatClientError(203));
      }
      this.selectedIdentity = {
        queryKey: request.queryKey,
        kind: request.definition.kind,
        argument: request.argument
      };
      if (this.retainedRequest && (this.retainedRequest.queryKey !== request.queryKey || this.retainedRequest.kind !== request.definition.kind)) {
        this.retainedRequest = void 0;
        releaseRetention(this.node);
      }
      let entry = this.owner.requests?.get(request.identity);
      let start = false;
      if (!entry) {
        const seed = this.seeded && matchesSeed(request, this.seeded.entry) ? this.seeded : void 0;
        entry = new RequestEntry(this.owner, request, seed);
        (this.owner.requests ??= /* @__PURE__ */ new Map()).set(request.identity, entry);
        start = !seed || !seed.entry.complete;
      }
      this.seeded = void 0;
      this.selected = entry;
      entry.consumers.add(this);
      this.owner.trace("select", this.node);
      const streamed = this.candidate ? void 0 : this.owner.streams?.selections.get(this.node.key);
      if (streamed && streamed.selectionKey !== request.identity) {
        this.owner.streams?.discardCompleted(streamed);
      }
      if (streamed?.selectionKey === request.identity && entry.startStreamed(streamed)) {
        this.streamedSelection = streamed;
        this.owner.streams?.selectionReady(this);
        entry.deliver();
      } else if (start) {
        entry.start(entry.state.snapshot.status !== "ready");
      }
    }
    this.observeSelectedAttempt();
    assertAlive(this.owner);
    return this.state();
  }
  state() {
    const entry = this.selected;
    if (this.describedAttempt !== entry.attempt) {
      this.resolvePending?.();
      this.resolvePending = void 0;
      this.pendingPromise = void 0;
      this.describedAttempt = entry.attempt;
    }
    if (entry.state.snapshot.status !== "pending") {
      if (entry.state.snapshot.status === "ready") this.retainedRequest = this.selectedIdentity;
      this.resolvePending?.();
      this.resolvePending = void 0;
      this.pendingPromise = void 0;
      return entry.state;
    }
    if (!this.pendingPromise) {
      this.pendingPromise = new Promise((resolve) => {
        this.resolvePending = resolve;
      });
    }
    return pendingState(
      this.pendingPromise,
      entry.state.snapshot.connection,
      entry.request.identity,
      this.resolvePending
    );
  }
  deliver() {
    if (this.owner.retired || this.node.evaluating) return;
    publishNode(this.node, this.state());
    this.owner.trace("publish", this.node);
  }
  detach() {
    const entry = this.selected;
    if (!this.candidate && this.streamedSelection === this.owner.streams?.selections.get(this.node.key)) {
      this.owner.streams?.selections.delete(this.node.key);
    }
    this.selected = void 0;
    this.selectedIdentity = void 0;
    this.describedAttempt = void 0;
    this.observedAttempt = void 0;
    this.resolvePending?.();
    this.resolvePending = void 0;
    this.pendingPromise = void 0;
    this.streamedSelection = void 0;
    this.selectionAuthority = {};
    entry?.remove(this);
  }
  observeSelectedAttempt() {
    const attempt = this.selected?.attempt;
    if (!attempt || attempt === this.observedAttempt) return;
    if (this.selected.observe(this.node.key) === attempt) this.observedAttempt = attempt;
  }
  get authority() {
    return this.selected ? this.selectionAuthority : void 0;
  }
  isStreamedSelectionReady(identity) {
    return this.streamedSelection === identity && this.selected?.request.identity === identity.selectionKey;
  }
  bindStreamedSelection(identity) {
    assertAlive(this.owner);
    const entry = this.selected;
    if (identity.nodeKey !== this.node.key) return false;
    if (!entry || entry.request.identity !== identity.selectionKey) {
      this.streamedSelection = void 0;
      return true;
    }
    if (!entry.startStreamed(identity)) return false;
    this.streamedSelection = identity;
    entry.deliver();
    return true;
  }
  acceptStreamed(frame) {
    const identity = this.streamedSelection;
    const entry = this.selected;
    if (!identity || !entry || identity.nodeKey !== frame.identity.nodeKey || identity.selectionKey !== frame.identity.selectionKey || identity.selectionGeneration !== frame.identity.selectionGeneration || identity.attempt !== frame.identity.attempt || frame.kind === "open" && frame.resource !== entry.request.definition.kind) {
      return false;
    }
    return entry.acceptStreamed(frame);
  }
  failStreamed(identity, error) {
    const streamed = this.streamedSelection;
    const entry = this.selected;
    if (!streamed || !entry || streamed.nodeKey !== identity.nodeKey || streamed.selectionKey !== identity.selectionKey || streamed.selectionGeneration !== identity.selectionGeneration || streamed.attempt !== identity.attempt || entry.attempt?.generation !== identity.attempt || !entry.attempt.streamed) {
      return false;
    }
    failAttempt(entry.attempt, error);
    return true;
  }
  retry(options) {
    assertAlive(this.owner);
    assertWritable();
    if (!this.selected && this.node.state?.snapshot.status === "idle") return;
    signalBatch(() => {
      const previous = this.selected;
      if (!previous) invalidateNode(this.node);
      refreshNode(this.node);
      if (!this.selected) {
        throw this.node.state?.snapshot.status === "error" ? this.node.state.snapshot.error : new Error(formatClientError(204));
      }
      this.owner.trace("retry", this.node);
      if (this.selected === previous) this.selected.start(options?.pending === true);
      this.observeSelectedAttempt();
    });
  }
  adopt(requestKey, value) {
    assertAlive(this.owner);
    assertWritable();
    const entry = this.selected;
    if (!entry || entry.request.identity !== requestKey) return false;
    const streaming = entry.request.definition.kind === "stream";
    if (!streaming) entry.stopAttempt();
    entry.state = readyState(value, {
      requestKey: entry.request.identity,
      connection: streaming ? entry.state.snapshot.connection : "none",
      complete: streaming ? entry.state.snapshot.complete : true
    });
    entry.deliver();
    return true;
  }
  seedRequest(retained = false) {
    const request = retained ? this.retainedRequest : this.selectedIdentity;
    if (!request) return void 0;
    return {
      queryKey: request.queryKey,
      kind: request.kind,
      argument: encodeSignalValue(request.argument)
    };
  }
  acceptsSeed(seed) {
    const request = this.request();
    return request !== skip && matchesSeed(request, seed);
  }
  dispose() {
    this.detach();
    this.pendingObserver = void 0;
    this.describe = void 0;
    this.seeded = void 0;
    this.retainedRequest = void 0;
    this.streamedSelection = void 0;
  }
}
function matchesSeed(request, seed) {
  return seed.kind === "async" && seed.request?.queryKey === request.queryKey && seed.request.kind === request.definition.kind && JSON.stringify(seed.request.argument) === JSON.stringify(encodeSignalValue(request.argument));
}
function initializeResource(owner, node, describe, seed, retained = seed) {
  return new ResourceBinding(owner, node, describe, seed, retained);
}
export {
  RequestEntry,
  ResourceBinding,
  createResource,
  initializeResource,
  query
};
