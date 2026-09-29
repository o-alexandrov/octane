const __octaneDev = process.env.NODE_ENV !== "production";
import { activeCandidate, candidateWriteCount, deferCandidateInvalidation, recordCandidateUrgentWrite, registerCandidateGraph, registerSignalActionFrameFactory, registerSignalTransitionCoordinatorFactory, withoutSignalCandidate } from "./transition-state.js";
import { SignalActionFrame } from "./transition-action.js";
import { createSignalTransitionCoordinator } from "./transition-coordinator.js";
import { createReactiveSystem } from "alien-signals/system";
import { ScopeDisposedError, SignalCycleError, SignalFrameError, SignalIdleError, SignalWriteError } from "./errors.js";
import { NativeAdoptionMiss, NATIVE_DOM_VALUE, getNativeCandidate, forwardNativeTransitionConsumer, getNativeReadObserver, getNativeAdoptionResolver, isNativeWriteGuarded, reportNativeRead, setNativeAdoptionResolver, setNativeReadObserver } from "./read-protocol.js";
import { SIGNAL_BINDING_READ, SIGNAL_BINDING_SUBSCRIBE, SIGNAL_BINDING_IDENTITY, SIGNAL_HANDLE } from "./types.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
import { CandidateUnsupportedError } from "./transition-state.js";
const ReactiveFlags = {
  None: 0,
  Mutable: 1,
  Watching: 2,
  RecursedCheck: 4,
  Recursed: 8,
  Dirty: 16,
  Pending: 32
};
let activeNode;
let activeOwners;
let trackingCycle = 0;
let executionDepth = 0;
let pureDepth = 0;
let batchDepth = 0;
let flushing = false;
let retirementError;
let historicalReader;
const queued = /* @__PURE__ */ new Set();
const noActivity = {};
const retainedOwners = /* @__PURE__ */ new WeakMap();
const retainedNodes = /* @__PURE__ */ new WeakMap();
const graph = createReactiveSystem({
  update(node) {
    return evaluate(node);
  },
  notify(node) {
    if (node instanceof ScopedNode) {
      node.revision++;
      node.wakeup?.resolve();
      node.wakeup = void 0;
      if (retirementError) {
        releaseRetention(node);
        node.state?.resolveWaiting?.();
        node.state = errorState(retirementError);
        node.flags |= ReactiveFlags.Dirty;
      }
      node.owner.trace("invalidate", node);
      if (node.invalidateAttempt) {
        if (deferCandidateInvalidation) {
          const invalidate = node.invalidateAttempt;
          queued.add(() => {
            if (node.invalidateAttempt === invalidate)
              invalidate();
          });
        } else
          node.invalidateAttempt();
        queued.add(node);
      } else if (node.kind === "async")
        queued.add(node);
    } else {
      queued.add(node);
    }
  },
  // A data scope owns producers, independently of UI subscription count. Keeping
  // these edges also makes dormant compiler witnesses valid without evaluating a
  // user computation from getVersion(). Scope retirement unlinks both directions.
  unwatched() {
  }
});
function isThenable(value) {
  return value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
}
function assertWritable() {
  if (pureDepth || isNativeWriteGuarded())
    throw new SignalWriteError();
}
function setHistoricalReader(read) {
  const previous = historicalReader;
  historicalReader = read;
  return previous;
}
function pure(read) {
  pureDepth++;
  try {
    return read();
  } finally {
    pureDepth--;
  }
}
function untrack(run) {
  const previousNode = activeNode;
  const previousObserver = setNativeReadObserver(null);
  activeNode = void 0;
  try {
    return run();
  } finally {
    activeNode = previousNode;
    setNativeReadObserver(previousObserver);
  }
}
function untrackCommitted(run) {
  return withoutSignalCandidate(() => untrack(run));
}
function startSignalBatch() {
  batchDepth++;
}
function endSignalBatch() {
  if (--batchDepth === 0)
    flush();
}
function signalBatch(run) {
  startSignalBatch();
  try {
    return run();
  } finally {
    endSignalBatch();
  }
}
function flush() {
  if (flushing)
    return;
  flushing = true;
  let firstError;
  let failed = false;
  try {
    for (const work of queued) {
      queued.delete(work);
      try {
        if (typeof work === "function") {
          untrack(work);
        } else if (work instanceof ScopedNode) {
          if (!work.owner.retired)
            refreshNode(work);
        } else {
          runObserver(work);
        }
      } catch (error) {
        if (!failed)
          firstError = error;
        failed = true;
      }
    }
  } finally {
    flushing = false;
  }
  if (failed)
    throw firstError;
}
function readyState(value, activity = noActivity) {
  return {
    snapshot: {
      status: "ready",
      value,
      refreshing: activity.refreshing ?? false,
      connection: activity.connection ?? "none",
      complete: activity.complete ?? true,
      ...activity.requestKey === void 0 ? {} : { requestKey: activity.requestKey }
    }
  };
}
function errorState(error, connection = "none", requestKey) {
  return {
    snapshot: {
      status: "error",
      error,
      refreshing: false,
      connection,
      complete: false,
      ...requestKey === void 0 ? {} : { requestKey }
    }
  };
}
function pendingState(waiting, connection = "none", requestKey, resolveWaiting) {
  return {
    snapshot: {
      status: "pending",
      refreshing: false,
      connection,
      complete: false,
      ...requestKey === void 0 ? {} : { requestKey }
    },
    waiting,
    ...resolveWaiting ? { resolveWaiting } : {}
  };
}
function idleState() {
  return {
    snapshot: {
      status: "idle",
      refreshing: false,
      connection: "none",
      complete: false
    }
  };
}
function sameOwners(a, b) {
  if (a.owners === b.owners)
    return true;
  if ((a.owners?.size ?? 0) !== (b.owners?.size ?? 0))
    return false;
  if (a.owners) {
    for (const owner of a.owners)
      if (!b.owners?.has(owner))
        return false;
  }
  return true;
}
function sameState(a, b) {
  if (!a)
    return false;
  const left = a.snapshot;
  const right = b.snapshot;
  if (left.status !== right.status || left.refreshing !== right.refreshing || left.connection !== right.connection || left.complete !== right.complete || left.requestKey !== right.requestKey) {
    return false;
  }
  if (left.status === "ready" && right.status === "ready") {
    return Object.is(left.value, right.value) && sameOwners(a, b);
  }
  if (left.status === "error" && right.status === "error") {
    return Object.is(left.error, right.error) && sameOwners(a, b);
  }
  return a.waiting === b.waiting && sameOwners(a, b);
}
function withOwners(state, owners) {
  return owners?.size ? { ...state, owners } : state;
}
function recordOwners(node, state) {
  const consumer = activeNode;
  if (!consumer)
    return;
  if (node.owner !== consumer.owner)
    (activeOwners ??= /* @__PURE__ */ new Set()).add(node.owner);
  if (state.owners) {
    for (const owner of state.owners) {
      if (owner !== consumer.owner)
        (activeOwners ??= /* @__PURE__ */ new Set()).add(owner);
    }
  }
}
function releaseRetainedOwners(node) {
  const owners = retainedOwners.get(node);
  if (!owners)
    return;
  retainedOwners.delete(node);
  for (const owner of owners) {
    const nodes = retainedNodes.get(owner);
    nodes?.delete(node);
    if (!nodes?.size)
      retainedNodes.delete(owner);
  }
}
function releaseRetention(node) {
  if (node.lastState?.owners)
    releaseRetainedOwners(node);
  node.last = void 0;
  node.lastState = void 0;
  node.hasLast = false;
}
function retainOwners(node) {
  const owners = node.lastState?.owners;
  if (!owners || retainedOwners.get(node) === owners)
    return;
  releaseRetainedOwners(node);
  retainedOwners.set(node, owners);
  for (const owner of owners) {
    let nodes = retainedNodes.get(owner);
    if (!nodes)
      retainedNodes.set(owner, nodes = /* @__PURE__ */ new Set());
    nodes.add(node);
  }
}
function revokeRetainedValues(owner, error) {
  const nodes = retainedNodes.get(owner);
  if (!nodes)
    return;
  for (const node of nodes) {
    const origins = node.state?.owners;
    let surviving;
    if (origins) {
      for (const origin of origins) {
        if (!origin.retired)
          (surviving ??= /* @__PURE__ */ new Set()).add(origin);
      }
    }
    commitState(node, withOwners(errorState(error), surviving));
    if (node.subs) {
      graph.propagate(node.subs, executionDepth !== 0);
      graph.shallowPropagate(node.subs);
    }
  }
  retainedNodes.delete(owner);
}
function createWakeup() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
class ScopedNode {
  constructor(owner, key, kind) {
    this.owner = owner;
    this.key = key;
    this.kind = kind;
    this.flags = ReactiveFlags.Mutable | ReactiveFlags.Watching | ReactiveFlags.Dirty;
  }
  owner;
  key;
  kind;
  get [SIGNAL_HANDLE]() {
    return true;
  }
  deps;
  depsTail;
  subs;
  subsTail;
  flags;
  revision = 0;
  state;
  compute;
  invalidateAttempt;
  last;
  lastState;
  hasLast = false;
  evaluating = false;
  wakeup;
  nativeSource;
  nativeLatestSource;
  nativeSnapshotSource;
  retry(_options) {
    assertAlive(this.owner);
    throw new TypeError(__octaneDev ? "Only an async signal can be retried." : __octaneNoArgError(163));
  }
  get() {
    return strictValue(readNode(this), this.key);
  }
  [SIGNAL_BINDING_READ]() {
    return readSignalBinding(this);
  }
  [SIGNAL_BINDING_SUBSCRIBE](notify, onRetire) {
    assertAlive(this.owner);
    return attachObserver(this, onRetire === void 0 ? notify : forwardNativeTransitionConsumer(notify, () => this.owner.retired ? onRetire() : notify()), true);
  }
  [SIGNAL_BINDING_IDENTITY]() {
    return { scope: "instance", nodeKey: this.key };
  }
  [NATIVE_DOM_VALUE]() {
    return this.get();
  }
  set(value) {
    assertAlive(this.owner);
    assertWritable();
    if (this.kind !== "signal")
      throw new TypeError(__octaneDev ? "Only a writable signal accepts set()." : __octaneNoArgError(164));
    const candidate = activeCandidate ?? getNativeCandidate();
    if (candidate) {
      candidate.run(() => candidate.write(this, value));
      return;
    }
    signalBatch(() => {
      const previous = strictValue(refreshNode(this), this.key);
      const next = typeof value === "function" ? untrack(() => pure(() => value(previous))) : value;
      const releases = candidateWriteCount ? recordCandidateUrgentWrite(this, value) : void 0;
      try {
        if (!Object.is(previous, next)) {
          publishNode(this, readyState(next));
          this.owner.trace("write", this);
        }
      } finally {
        if (releases)
          for (const release of releases)
            release();
      }
    });
  }
  latest(fallback) {
    const state = readNode(this, "latest");
    if (state.snapshot.status === "ready")
      return state.snapshot.value;
    if (state.snapshot.status === "error" && (state.snapshot.error instanceof ScopeDisposedError || state.snapshot.error instanceof SignalFrameError || state.snapshot.error instanceof NativeAdoptionMiss)) {
      throw state.snapshot.error;
    }
    return fallback;
  }
  snapshot() {
    return Object.freeze(readNode(this, "snapshot").snapshot);
  }
  subscribe(notify) {
    assertAlive(this.owner);
    assertWritable();
    if (typeof notify !== "function")
      throw new TypeError(__octaneDev ? "A signal subscriber must be a function." : __octaneNoArgError(165));
    const state = untrack(() => refreshNode(this));
    return attachObserver(this, notify, false, state);
  }
}
function assertAlive(owner) {
  if (owner.retired)
    throw new ScopeDisposedError(owner.scopeKey);
}
function inspectNativeNode(node, read) {
  const dependencies = [];
  for (let link = node.deps; link; link = link.nextDep) {
    if (link.dep instanceof ScopedNode) {
      dependencies.push({ scopeKey: link.dep.owner.scopeKey, key: link.dep.key });
    }
  }
  return {
    scopeKey: node.owner.scopeKey,
    key: node.key,
    read,
    kind: node.kind,
    status: node.state?.snapshot.status ?? "unevaluated",
    revision: node.revision,
    epoch: node.owner.epoch,
    retired: node.owner.retired,
    historical: false,
    retained: node.hasLast,
    refreshing: node.state?.snapshot.refreshing ?? false,
    connection: node.state?.snapshot.connection ?? "none",
    complete: node.state?.snapshot.complete ?? false,
    dependencies
  };
}
function createNativeSource(node, read) {
  return {
    getVersion: () => activeCandidate && !activeCandidate.observes(node) ? NaN : node.revision,
    subscribe: (notify) => {
      assertAlive(node.owner);
      return attachObserver(node, notify, true);
    },
    serialize: (revision) => node.revision === revision ? node.owner.serializeRead(node, read) : void 0,
    inspect: () => inspectNativeNode(node, read)
  };
}
function readNode(node, read = "value") {
  assertAlive(node.owner);
  const candidate = activeCandidate;
  if (candidate)
    node = candidate.resolve(node);
  const historical = historicalReader?.(node, read);
  if (historical)
    return historical;
  if (!historicalReader && node.owner.seedable) {
    const frame = getNativeAdoptionResolver()?.(node.owner);
    if (frame)
      return frame.run(() => readNode(node, read));
  }
  const state = refreshNode(node);
  const observed = read === "latest" && state.snapshot.status !== "ready" ? node.lastState ?? state : state;
  if (activeNode)
    graph.link(node, activeNode, trackingCycle);
  if (getNativeReadObserver()) {
    const field = read === "value" ? "nativeSource" : read === "latest" ? "nativeLatestSource" : "nativeSnapshotSource";
    const source = node[field] ??= createNativeSource(node, read);
    reportNativeRead(candidate ? candidate.nativeSource(node, read, source) : source, node.revision);
  }
  if (observed.owners)
    for (const owner of observed.owners)
      assertAlive(owner);
  if (activeNode)
    recordOwners(node, observed);
  return observed;
}
function strictValue(state, key = "idle") {
  const snapshot = state.snapshot;
  if (snapshot.status === "ready")
    return snapshot.value;
  if (snapshot.status === "error")
    throw snapshot.error;
  if (snapshot.status === "idle")
    throw new SignalIdleError(key);
  throw state.waiting;
}
function readSignalBinding(handle$) {
  const resolveAdoption = getNativeAdoptionResolver();
  if ((historicalReader || resolveAdoption) && handle$ instanceof ScopedNode && handle$.owner.seedable && (historicalReader || resolveAdoption?.(handle$.owner))) {
    return handle$.get();
  }
  const observer = setNativeReadObserver(null);
  try {
    return handle$.get();
  } finally {
    setNativeReadObserver(observer);
  }
}
function refreshNode(node) {
  assertAlive(node.owner);
  if (node.evaluating)
    throw new SignalCycleError(node.key);
  const guarded = node.kind === "derived";
  if (guarded)
    pureDepth++;
  try {
    let iterations = 0;
    while (true) {
      const flags = node.flags;
      if (flags & ReactiveFlags.Dirty || flags & ReactiveFlags.Pending && (!node.deps || graph.checkDirty(node.deps, node))) {
        if (++iterations > 100)
          throw new SignalCycleError(node.key);
        if (evaluate(node) && node.subs)
          graph.shallowPropagate(node.subs);
        if (node.flags & (ReactiveFlags.Dirty | ReactiveFlags.Pending))
          continue;
      } else {
        node.flags &= ~ReactiveFlags.Pending;
      }
      node.flags &= ~ReactiveFlags.Recursed;
      break;
    }
    return node.state;
  } finally {
    if (guarded)
      pureDepth--;
  }
}
function evaluate(node) {
  if (!node.compute) {
    node.flags = ReactiveFlags.Mutable | ReactiveFlags.Watching;
    return true;
  }
  if (historicalReader || getNativeAdoptionResolver())
    return evaluateLiveNode(node);
  const previousNode = activeNode;
  const previousOwners = activeOwners;
  const previousObserver = setNativeReadObserver(null);
  node.depsTail = void 0;
  node.flags = ReactiveFlags.Mutable | ReactiveFlags.Watching | ReactiveFlags.RecursedCheck;
  node.evaluating = true;
  activeNode = node;
  activeOwners = void 0;
  trackingCycle++;
  executionDepth++;
  let next;
  let owners;
  try {
    next = node.compute(node);
  } catch (error) {
    if (isThenable(error)) {
      const wakeup = node.wakeup ??= createWakeup();
      Promise.resolve(error).then(wakeup.resolve, wakeup.resolve);
      next = pendingState(wakeup.promise);
    } else {
      next = errorState(error);
    }
  } finally {
    executionDepth--;
    owners = activeOwners;
    activeOwners = previousOwners;
    activeNode = previousNode;
    setNativeReadObserver(previousObserver);
    node.evaluating = false;
    node.flags &= ~ReactiveFlags.RecursedCheck;
    const tail = node.depsTail;
    let obsolete = tail ? tail.nextDep : node.deps;
    while (obsolete)
      obsolete = graph.unlink(obsolete, node);
  }
  next = withOwners(next, owners);
  if (next.snapshot.status !== "ready" && node.state?.snapshot.status === "error" && node.state.snapshot.error instanceof ScopeDisposedError) {
    next = withOwners(errorState(node.state.snapshot.error), next.owners);
  }
  if (sameState(node.state, next))
    return false;
  commitState(node, next);
  return true;
}
function evaluateLiveNode(node) {
  const previousReader = setHistoricalReader(void 0);
  const previousAdoption = setNativeAdoptionResolver(null);
  try {
    return evaluate(node);
  } finally {
    setNativeAdoptionResolver(previousAdoption);
    setHistoricalReader(previousReader);
  }
}
function commitState(node, next) {
  const previous = node.state;
  node.state = next;
  node.revision++;
  if (next.snapshot.status === "ready") {
    if (previous?.snapshot.status !== "ready" && node.lastState?.owners)
      releaseRetainedOwners(node);
    node.last = next.snapshot.value;
    node.lastState = next;
    node.hasLast = true;
  } else if (next.snapshot.status === "error" && (next.snapshot.error instanceof ScopeDisposedError || next.snapshot.error instanceof SignalFrameError || next.snapshot.error instanceof NativeAdoptionMiss)) {
    releaseRetention(node);
  } else if (node.lastState?.owners) {
    retainOwners(node);
  }
  if (next.snapshot.status !== "pending") {
    previous?.resolveWaiting?.();
    node.wakeup?.resolve();
    node.wakeup = void 0;
  }
}
function publishNode(node, next) {
  if (node.kind === "async" && node.state?.owners)
    next = withOwners(next, node.state.owners);
  if (sameState(node.state, next))
    return;
  commitState(node, next);
  if (node.subs) {
    graph.propagate(node.subs, executionDepth !== 0);
    graph.shallowPropagate(node.subs);
  }
}
function invalidateNode(node) {
  node.flags |= ReactiveFlags.Dirty;
  node.revision++;
  node.wakeup?.resolve();
  node.wakeup = void 0;
  if (node.subs)
    graph.propagate(node.subs, executionDepth !== 0);
}
function derivedState(node, read) {
  const value = pure(read);
  if (isThenable(value))
    throw new TypeError(__octaneDev ? "derived$ requires a synchronous computation." : __octaneNoArgError(166));
  return derivedValueState(node, value);
}
function derivedValueState(node, value, activity, additionalDependencies) {
  let refreshing = false;
  let complete = true;
  let connection = "none";
  if (activity) {
    refreshing = activity.refreshing;
    complete = activity.complete;
    connection = activity.connection;
  }
  for (let link = node.deps; link && node.depsTail; link = link.nextDep) {
    const dependency = link.dep.state?.snapshot;
    if (dependency) {
      refreshing ||= dependency.refreshing;
      complete &&= dependency.complete;
      if (dependency.connection === "open")
        connection = "open";
      else if (connection !== "open" && dependency.connection === "connecting")
        connection = "connecting";
      else if (connection === "none" && dependency.connection === "closed")
        connection = "closed";
    }
    if (link === node.depsTail)
      break;
  }
  if (additionalDependencies) {
    for (const node2 of additionalDependencies) {
      const dependency = node2.state?.snapshot;
      if (!dependency)
        continue;
      refreshing ||= dependency.refreshing;
      complete &&= dependency.complete;
      if (dependency.connection === "open")
        connection = "open";
      else if (connection !== "open" && dependency.connection === "connecting")
        connection = "connecting";
      else if (connection === "none" && dependency.connection === "closed")
        connection = "closed";
    }
  }
  return readyState(value, { refreshing, complete, connection });
}
class SignalObserver {
  constructor(node, notify, native, previous) {
    this.node = node;
    this.notify = notify;
    this.native = native;
    this.previous = previous;
  }
  node;
  notify;
  native;
  previous;
  deps;
  depsTail;
  flags = ReactiveFlags.Watching;
}
function attachObserver(node, notify, native, state) {
  const observer = new SignalObserver(node, notify, native, state);
  graph.link(node, observer, ++trackingCycle);
  node.owner.observers.add(observer);
  return () => stopObserver(observer);
}
function subscribeNode(node, notify) {
  const state = untrack(() => refreshNode(node));
  return attachObserver(node, notify, true, state);
}
function runObserver(observer) {
  const node = observer.node;
  if (!node || !observer.flags)
    return;
  observer.flags = ReactiveFlags.Watching;
  if (!observer.native) {
    const state = untrack(() => refreshNode(node));
    if (sameState(observer.previous, state))
      return;
    observer.previous = state;
  }
  if (observer.notify)
    untrack(observer.notify);
}
function stopObserver(observer) {
  if (!observer.node)
    return;
  queued.delete(observer);
  observer.flags = ReactiveFlags.None;
  observer.node.owner.observers.delete(observer);
  observer.node = void 0;
  observer.notify = void 0;
  observer.previous = void 0;
  while (observer.deps)
    graph.unlink(observer.deps, observer);
}
function retireGraph(owner, nodes) {
  const previousError = retirementError;
  retirementError = new ScopeDisposedError(owner.scopeKey);
  try {
    for (const observer of owner.observers) {
      if (observer.native && observer.notify)
        queued.add(observer.notify);
      stopObserver(observer);
    }
    revokeRetainedValues(owner, retirementError);
    for (const node of nodes) {
      queued.delete(node);
      node.wakeup?.resolve();
      node.wakeup = void 0;
      node.revision++;
      node.state?.resolveWaiting?.();
      node.state = errorState(retirementError);
      releaseRetention(node);
      node.compute = void 0;
      node.invalidateAttempt = void 0;
      if (node.kind === "async")
        node.retry = ScopedNode.prototype.retry;
      if (node.subs) {
        graph.propagate(node.subs, executionDepth !== 0);
        graph.shallowPropagate(node.subs);
      }
      while (node.deps)
        graph.unlink(node.deps, node);
      while (node.subs)
        graph.unlink(node.subs);
      node.flags = ReactiveFlags.None;
    }
  } finally {
    retirementError = previousError;
  }
}
registerCandidateGraph({
  ScopedNode,
  graph,
  flags: ReactiveFlags,
  historical: () => historicalReader !== void 0,
  link: (from, to) => {
    graph.link(from, to, ++trackingCycle);
  },
  removeQueued: (node) => {
    queued.delete(node);
  },
  assertAlive,
  strictValue,
  refreshNode,
  pure,
  untrack,
  signalBatch,
  publishNode,
  readyState,
  commitState,
  sameState,
  releaseRetainedOwners,
  retainOwners,
  releaseRetention,
  createNativeSource,
  attachObserver
});
registerSignalActionFrameFactory(() => new SignalActionFrame());
registerSignalTransitionCoordinatorFactory(createSignalTransitionCoordinator);
export {
  CandidateUnsupportedError,
  ScopedNode,
  SignalObserver,
  assertAlive,
  assertWritable,
  attachObserver,
  derivedState,
  derivedValueState,
  endSignalBatch,
  errorState,
  idleState,
  inspectNativeNode,
  invalidateNode,
  isThenable,
  pendingState,
  publishNode,
  pure,
  readNode,
  readSignalBinding,
  readyState,
  refreshNode,
  releaseRetention,
  retireGraph,
  sameState,
  setHistoricalReader,
  signalBatch,
  startSignalBatch,
  stopObserver,
  strictValue,
  subscribeNode,
  untrack,
  untrackCommitted
};
