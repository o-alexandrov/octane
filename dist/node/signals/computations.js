import { formatClientError } from "../error-codes.client.generated.js";
import { createDerivedCellWith } from "./engine.js";
import {
  ScopedNode,
  CandidateUnsupportedError,
  assertAlive,
  attachObserver,
  derivedValueState,
  errorState,
  invalidateNode,
  isThenable,
  pendingState,
  publishNode,
  readNode,
  refreshNode,
  readyState,
  signalBatch,
  subscribeNode,
  untrack,
  untrackCommitted
} from "./graph.js";
import { SIGNAL_DEPENDENT_NODE } from "./read-protocol.js";
import {
  SIGNAL_OWNER_RESOLVE
} from "./types.js";
function createDeclaredDerivedCell(owner, key, compute, options) {
  return createDerivedCellWith(owner, key, compute, options, DerivedBinding);
}
function attempt(binding) {
  let resolve;
  const waiting = new Promise((done) => {
    resolve = done;
  });
  return {
    active: true,
    binding,
    controller: void 0,
    iterator: void 0,
    dependencies: /* @__PURE__ */ new Map(),
    waiting,
    resolve,
    hasYielded: false,
    owners: /* @__PURE__ */ new Set(),
    cancelWaiting: void 0,
    cancelRead: void 0
  };
}
function ignoreRetiredCloseFailure() {
}
function closeIterator(iterator) {
  try {
    Promise.resolve(untrackCommitted(() => iterator.return?.())).catch(ignoreRetiredCloseFailure);
  } catch {
  }
}
function asyncIterator(value) {
  if (typeof value !== "object" && typeof value !== "function" || value === null) return;
  const factory = value[Symbol.asyncIterator];
  return typeof factory === "function" ? () => factory.call(value) : void 0;
}
function resolveHandle(handle$, owner) {
  const resolved = SIGNAL_OWNER_RESOLVE in handle$ ? handle$[SIGNAL_OWNER_RESOLVE](owner) : handle$;
  if (!(resolved instanceof ScopedNode)) {
    throw new TypeError(formatClientError(109));
  }
  return resolved;
}
class DerivedBinding {
  constructor(owner, node, compute, options) {
    this.owner = owner;
    this.node = node;
    this.options = options;
    this.compute = compute;
    node.compute = () => this.evaluate();
  }
  owner;
  node;
  options;
  current;
  compute;
  frozen = false;
  candidate;
  forkCandidate(target, frame) {
    if (this.frozen || this.owner.readBarrier || !this.compute) {
      throw new CandidateUnsupportedError(formatClientError(110));
    }
    const fork = new DerivedBinding(this.owner, target, this.compute, this.options);
    fork.candidate = frame;
    return {
      dispose: () => fork.dispose(),
      dependencies: () => fork.current?.dependencies.keys() ?? [],
      prepare: () => {
        const state = target.state;
        if (state?.snapshot.status !== "ready" && state?.snapshot.status !== "error")
          return state?.waiting ? { status: "pending", waiting: state.waiting } : { status: "invalid" };
        const current = fork.current;
        const previous = this.current;
        return {
          status: "ready",
          receipt: {
            validate: () => !this.owner.retired && this.owner.readBarrier === void 0 && this.compute !== void 0 && this.current === previous && fork.current === current && target.state === state && (!current || current.binding === fork && fork.validDependencies(current)),
            publish: () => {
              this.current = current;
              if (current) current.binding = this;
              this.node.invalidateAttempt = current ? () => this.invalidateGraph() : void 0;
              fork.current = void 0;
              fork.candidate = void 0;
              target.invalidateAttempt = void 0;
              return () => {
                if (previous !== this.current) this.stop(previous);
              };
            },
            accept: () => {
              if (!current) return;
              const dependencies = [...current.dependencies.values()];
              const releases = [];
              current.dependencies.clear();
              for (const dependency of dependencies) {
                releases.push(dependency.unsubscribe);
                dependency.node = frame.canonical(dependency.node);
                dependency.revision = dependency.node.revision;
                dependency.unsubscribe = attachObserver(
                  dependency.node,
                  DerivedBinding.notify(current),
                  true
                );
                current.dependencies.set(dependency.node, dependency);
              }
              for (const release of releases) release();
            }
          }
        };
      }
    };
  }
  static context(current) {
    return {
      get signal() {
        if (!current.active) return AbortSignal.abort();
        return (current.controller ??= new AbortController()).signal;
      },
      read(handle$) {
        return current.binding ? current.binding.read(current, handle$) : Promise.reject(new Error(formatClientError(111)));
      }
    };
  }
  static notify(current) {
    const notify = () => current.binding?.invalidate(current);
    notify[SIGNAL_DEPENDENT_NODE] = current.binding.node;
    return notify;
  }
  read(current, handle$) {
    if (!current.active) return Promise.reject(new Error(formatClientError(111)));
    try {
      return DerivedBinding.readValue(current, this.readDependency(current, handle$));
    } catch (error) {
      return Promise.reject(error);
    }
  }
  readDependency(current, handle$) {
    const dependency = this.candidate ? this.candidate.run(() => this.candidate.resolve(resolveHandle(handle$, this.owner))) : resolveHandle(handle$, this.owner);
    if (dependency === this.node) {
      throw new TypeError(formatClientError(112));
    }
    assertAlive(dependency.owner);
    let lease = current.dependencies.get(dependency);
    if (!lease) {
      const unsubscribe = subscribeNode(dependency, DerivedBinding.notify(current));
      const revision = dependency.revision;
      lease = { node: dependency, revision, unsubscribe };
      current.dependencies.set(dependency, lease);
    }
    return lease;
  }
  static async readValue(current, dependency) {
    while (current.active) {
      const state = untrack(
        () => current.binding.candidate ? current.binding.candidate.run(() => readNode(dependency.node)) : readNode(dependency.node)
      );
      if (!current.active) break;
      if (state.snapshot.status === "ready") {
        if (dependency.node.owner !== current.binding.owner)
          current.owners.add(dependency.node.owner);
        if (state.owners) {
          for (const owner of state.owners)
            if (owner !== current.binding.owner) current.owners.add(owner);
        }
        return state.snapshot.value;
      }
      if (state.snapshot.status === "error") throw state.snapshot.error;
      if (state.snapshot.status === "idle") {
        throw new Error(formatClientError(113, dependency.node.key));
      }
      current.cancelWaiting ??= new Promise((resolve) => {
        current.cancelRead = resolve;
      });
      await Promise.race([state.waiting, current.cancelWaiting]);
    }
    throw new Error(formatClientError(111));
  }
  valid(current) {
    if (!current.active || this.current !== current || this.owner.retired || this.owner.readBarrier !== void 0)
      return false;
    return this.validDependencies(current);
  }
  validDependencies(current) {
    for (const dependency of current.dependencies.values()) {
      if (dependency.node.owner.retired || dependency.node.revision !== dependency.revision) {
        return false;
      }
    }
    return true;
  }
  evaluate() {
    if (this.owner.readBarrier !== void 0) {
      this.frozen = true;
      return this.node.state?.snapshot.status === "ready" ? this.node.state : pendingState(this.owner.readBarrier);
    }
    this.stop(this.current);
    this.current = void 0;
    this.node.invalidateAttempt = void 0;
    const compute = this.compute;
    let current = compute.length ? attempt(this) : void 0;
    let result;
    try {
      result = current ? compute(DerivedBinding.context(current)) : compute();
    } catch (error) {
      this.stop(current);
      if (isThenable(error)) throw error;
      return errorState(error);
    }
    if (this.options?.sync) {
      this.stop(current, false);
      return derivedValueState(this.node, result);
    }
    let iteratorFactory;
    let thenable = false;
    try {
      iteratorFactory = asyncIterator(result);
      thenable = isThenable(result);
    } catch (error) {
      this.stop(current);
      return errorState(error);
    }
    if (!thenable && !iteratorFactory) {
      this.stop(current, false);
      return derivedValueState(this.node, result);
    }
    current ??= attempt(this);
    this.current = current;
    this.node.invalidateAttempt = () => this.invalidateGraph();
    if (iteratorFactory) this.observeIterator(current, iteratorFactory);
    else DerivedBinding.observePromise(current, result);
    return pendingState(
      current.waiting,
      iteratorFactory ? "connecting" : "none",
      void 0,
      current.resolve
    );
  }
  static observePromise(current, result) {
    Promise.resolve(result).then(
      (value) => {
        const binding = current.binding;
        if (!binding?.valid(current)) return;
        let iteratorFactory;
        try {
          iteratorFactory = asyncIterator(value);
        } catch (error) {
          binding.fail(current, error);
          return;
        }
        if (iteratorFactory) {
          signalBatch(
            () => publishNode(
              binding.node,
              pendingState(current.waiting, "connecting", void 0, current.resolve)
            )
          );
          binding.observeIterator(current, iteratorFactory);
          return;
        }
        binding.accept(current, readyState(value));
      },
      (error) => current.binding?.fail(current, error)
    );
  }
  observeIterator(current, iteratorFactory) {
    try {
      const iterator = untrack(iteratorFactory);
      if (!this.valid(current)) {
        closeIterator(iterator);
        return;
      }
      current.iterator = iterator;
    } catch (error) {
      this.fail(current, error);
      return;
    }
    this.next(current);
  }
  next(current) {
    if (!this.valid(current) || !current.iterator) return;
    let step;
    try {
      step = untrack(() => current.iterator.next());
    } catch (error) {
      this.fail(current, error);
      return;
    }
    DerivedBinding.observeStep(current, step);
  }
  static queueNext(current) {
    queueMicrotask(() => current.binding?.next(current));
  }
  static observeStep(current, step) {
    Promise.resolve(step).then(
      (result) => {
        const binding = current.binding;
        if (!binding?.valid(current)) return;
        if (!result || typeof result !== "object" && typeof result !== "function") {
          binding.fail(current, new TypeError(formatClientError(114)));
          return;
        }
        if (result.done) {
          if (!current.hasYielded) {
            binding.fail(current, new Error(formatClientError(115)));
            return;
          }
          const snapshot = binding.node.state?.snapshot;
          if (snapshot?.status === "ready") {
            binding.accept(
              current,
              readyState(snapshot.value, { connection: "closed", complete: true })
            );
          }
          return;
        }
        current.hasYielded = true;
        binding.accept(
          current,
          readyState(result.value, { connection: "open", complete: false }),
          false
        );
        DerivedBinding.queueNext(current);
      },
      (error) => current.binding?.fail(current, error)
    );
  }
  accept(current, state, complete = true) {
    if (!this.valid(current)) {
      this.invalidate(current);
      return;
    }
    if (state.snapshot.status === "ready") {
      state = derivedValueState(
        this.node,
        state.snapshot.value,
        state.snapshot,
        current.dependencies.size ? current.dependencies.keys() : void 0
      );
    }
    const previousOwners = this.node.state?.owners;
    if (previousOwners) for (const owner of previousOwners) current.owners.add(owner);
    const published = current.owners.size ? { ...state, owners: current.owners } : state;
    signalBatch(() => publishNode(this.node, published));
    if (complete) this.finish(current);
  }
  fail(current, error) {
    if (!this.valid(current)) return;
    signalBatch(
      () => publishNode(this.node, errorState(error, current.iterator ? "closed" : "none"))
    );
    this.finish(current);
  }
  finish(current) {
    if (this.current !== current) return;
    current.active = false;
    current.controller = void 0;
    current.iterator = void 0;
    current.cancelRead?.();
    current.cancelWaiting = void 0;
    current.cancelRead = void 0;
    current.resolve();
  }
  invalidate(current) {
    if (this.current !== current || this.owner.retired) return;
    this.stop(current);
    this.current = void 0;
    signalBatch(() => {
      invalidateNode(this.node);
      refreshNode(this.node);
    });
  }
  invalidateGraph() {
    const current = this.current;
    if (!current) return;
    this.stop(current);
    if (this.current === current) this.current = void 0;
  }
  stop(current, cancel = true) {
    if (!current) return;
    const active = current.active;
    const controller = current.controller;
    const iterator = current.iterator;
    current.active = false;
    current.binding = void 0;
    current.controller = void 0;
    current.iterator = void 0;
    current.owners = void 0;
    for (const dependency of current.dependencies.values()) dependency.unsubscribe();
    current.dependencies.clear();
    current.cancelRead?.();
    current.cancelWaiting = void 0;
    current.cancelRead = void 0;
    current.resolve();
    if (!cancel || !active) return;
    if (controller) untrackCommitted(() => controller.abort());
    if (iterator) closeIterator(iterator);
  }
  /** Stop only unfinished asynchronous reads; settled dependency edges stay live. */
  suspend() {
    if (!this.current?.active) return false;
    this.frozen = true;
    const current = this.current;
    this.current = void 0;
    this.node.invalidateAttempt = void 0;
    if (this.node.state?.snapshot.status !== "ready") {
      this.node.state = pendingState(this.owner.readBarrier);
    }
    this.stop(current);
    return true;
  }
  resume() {
    if (!this.frozen || this.owner.retired || this.owner.readBarrier !== void 0 || !this.compute)
      return;
    this.frozen = false;
    invalidateNode(this.node);
    refreshNode(this.node);
  }
  dispose() {
    this.stop(this.current);
    this.current = void 0;
    this.compute = void 0;
    this.candidate = void 0;
    this.node.invalidateAttempt = void 0;
  }
}
export {
  DerivedBinding,
  createDeclaredDerivedCell
};
