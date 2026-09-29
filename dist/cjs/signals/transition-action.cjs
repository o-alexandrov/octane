"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var transition_action_exports = {};
__export(transition_action_exports, {
  SignalActionFrame: () => SignalActionFrame,
  registerNativeSignalActionExtension: () => registerNativeSignalActionExtension
});
module.exports = __toCommonJS(transition_action_exports);
var import_errors = require("./errors.cjs");
var import_read_protocol = require("./read-protocol.cjs");
var import_transition_state = require("./transition-state.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
let nativeExtension;
function registerNativeSignalActionExtension(extension) {
  nativeExtension = extension;
}
function isThenable(value) {
  return value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function";
}
function clearPreparationWake(watch) {
  watch.notify = void 0;
  watch.validate = void 0;
  watch.token = void 0;
}
function queuePreparationWake(watch, invalid = false) {
  if (!watch.notify)
    return;
  watch.invalid ||= invalid;
  if (watch.queued)
    return;
  watch.queued = true;
  queueMicrotask(() => {
    const notify = watch.notify;
    if (!notify)
      return;
    const token = watch.token;
    const kind = watch.invalid || !watch.validate?.() ? "invalid" : "retry";
    clearPreparationWake(watch);
    notify({ kind, token });
  });
}
function settlePreparationWake(watch) {
  queuePreparationWake(watch);
}
class SignalActionFrame {
  entries;
  originals;
  generation = 0;
  active = true;
  preparationToken;
  preparationWatch;
  demand;
  run(callback) {
    if (!this.active)
      throw new TypeError(__octaneDev ? "The signal candidate has retired." : __octaneNoArgError(203));
    if (import_transition_state.activeCandidate && import_transition_state.activeCandidate !== this) {
      throw new import_transition_state.CandidateUnsupportedError(__octaneDev ? "Nested signal candidates are not supported." : __octaneNoArgError(206));
    }
    const previous = (0, import_transition_state.swapActiveSignalCandidate)(this);
    try {
      return callback();
    } finally {
      (0, import_transition_state.swapActiveSignalCandidate)(previous);
    }
  }
  resolve(node) {
    if (!this.active)
      throw new TypeError(__octaneDev ? "The signal candidate has retired." : __octaneNoArgError(203));
    const original = this.originals?.get(node);
    if (original) {
      this.demand?.add(original);
      return node;
    }
    this.demand?.add(node);
    const existing = this.entries?.get(node);
    if (existing)
      return existing.target;
    if (import_transition_state.candidateGraph.historical() || node.owner.readBarrier || !node.owner.forkCandidate) {
      throw new import_transition_state.CandidateUnsupportedError(__octaneDev ? "Only live candidate-capable owners are supported." : __octaneNoArgError(207));
    }
    import_transition_state.candidateGraph.assertAlive(node.owner);
    this.invalidatePreparation();
    const target = new import_transition_state.candidateGraph.ScopedNode(node.owner, node.key, node.kind);
    target.state = node.state;
    target.last = node.last;
    target.lastState = node.lastState;
    target.hasLast = node.hasLast;
    const entry = {
      node,
      target,
      revision: node.revision,
      epoch: node.owner.epoch,
      stop: import_transition_state.candidateGraph.attachObserver(node, () => {
        if (node.owner.retired)
          this.discard();
        else
          this.invalidatePreparation();
      }, true)
    };
    (this.entries ??= /* @__PURE__ */ new Map()).set(node, entry);
    (this.originals ??= /* @__PURE__ */ new Map()).set(target, node);
    try {
      entry.producer = node.owner.forkCandidate(node, target, this);
      const compute = target.compute;
      if (compute)
        target.compute = () => this.run(() => compute(target));
    } catch (error) {
      this.discard();
      throw error;
    }
    return target;
  }
  write(node, value) {
    if (!this.validate())
      throw new TypeError(__octaneDev ? "Rebase the signal candidate before writing." : __octaneNoArgError(208));
    const target = this.resolve(node);
    const current = import_transition_state.candidateGraph.strictValue(import_transition_state.candidateGraph.refreshNode(target), node.key);
    let previous = current;
    const writers = import_transition_state.candidateWriters?.get(node);
    if (typeof value === "function")
      for (const writer of writers ?? []) {
        if (writer === this)
          continue;
        const pending = writer.entries.get(node);
        previous = import_transition_state.candidateGraph.strictValue(import_transition_state.candidateGraph.refreshNode(pending.target), node.key);
        for (const operation of pending.urgentOperations ?? [])
          previous = import_transition_state.candidateGraph.untrack(() => import_transition_state.candidateGraph.pure(() => operation(previous)));
      }
    const next = typeof value === "function" ? import_transition_state.candidateGraph.untrack(() => import_transition_state.candidateGraph.pure(() => value(previous))) : value;
    let releases;
    for (const writer of writers ?? []) {
      if (writer === this)
        continue;
      const release = writer.replaceWrite(node);
      if (release)
        (releases ??= []).push(release);
    }
    try {
      if (Object.is(current, next))
        return;
      const entry = this.entries.get(node);
      if (!entry.written) {
        (0, import_transition_state.addCandidateWriter)(node, this);
        entry.written = true;
      }
      this.generation++;
      this.invalidatePreparation();
      import_transition_state.candidateGraph.signalBatch(() => import_transition_state.candidateGraph.publishNode(target, import_transition_state.candidateGraph.readyState(next)));
    } finally {
      if (releases)
        this.committed(() => {
          for (const release of releases)
            release();
        });
    }
  }
  /** Only observed candidates allocate forwarding sources; ordinary reads keep their identity. */
  nativeSource(target, read, source) {
    if (!nativeExtension)
      throw new import_transition_state.CandidateUnsupportedError(__octaneDev ? "Native signal presentation is not installed." : __octaneNoArgError(209));
    return nativeExtension.source(this.entries.get(this.originals.get(target)), read, source);
  }
  validate() {
    if (!this.active)
      return false;
    for (const entry of this.entries?.values() ?? []) {
      if (entry.withdrawn || entry.urgentOperations !== void 0 || entry.node.owner.retired || entry.epoch !== entry.node.owner.epoch || entry.node.owner.readBarrier || entry.node.kind !== "derived" && entry.revision !== entry.node.revision)
        return false;
    }
    return true;
  }
  hasWrites() {
    for (const entry of this.entries?.values() ?? [])
      if (entry.written)
        return true;
    return false;
  }
  /** Follow existing graph edges, never the document or a global consumer registry. */
  consumers() {
    const consumers = /* @__PURE__ */ new Set();
    const visited = /* @__PURE__ */ new Set();
    for (const entry of this.entries?.values() ?? [])
      if (entry.written)
        visited.add(entry.node);
    for (const node of visited) {
      for (let link = node.subs; link; link = link.nextSub) {
        const subscriber = link.sub;
        if (subscriber instanceof import_transition_state.candidateGraph.ScopedNode)
          visited.add(subscriber);
        else {
          const notify = subscriber.notify;
          const dependent = notify?.[import_read_protocol.SIGNAL_DEPENDENT_NODE];
          if (dependent)
            visited.add(dependent);
          const consumer = notify?.[import_read_protocol.NATIVE_TRANSITION_CONSUMER];
          if (consumer?.active())
            consumers.add(consumer);
        }
      }
    }
    return [...consumers];
  }
  /** Canonical memo witnesses cannot justify skipping a private forward read. */
  observes(node) {
    return this.originals?.has(node) ?? false;
  }
  canonical(node) {
    return this.originals?.get(node) ?? node;
  }
  /** Record intent without evaluating the forward graph in an urgent setter. */
  recordUrgentWrite(node, value) {
    if (typeof value !== "function")
      return this.replaceWrite(node);
    const entry = this.entries?.get(node);
    if (!this.active || !entry?.written)
      return;
    this.generation++;
    this.invalidatePreparation();
    (entry.urgentOperations ??= []).push(value);
  }
  replaceWrite(node) {
    const entry = this.entries?.get(node);
    if (!this.active || !entry?.written)
      return;
    this.generation++;
    this.invalidatePreparation();
    entry.withdrawn = true;
    entry.urgentOperations = void 0;
    this.forgetWrite(entry);
    if (this.hasWrites())
      return;
    this.active = false;
    return () => this.release();
  }
  forgetWrite(entry) {
    if (!entry.written)
      return;
    entry.written = false;
    (0, import_transition_state.removeCandidateWriter)(entry.node, this);
  }
  /** Urgent writes win their own cells without restarting unaffected producer leases. */
  rebase() {
    if (!this.active)
      throw new TypeError(__octaneDev ? "The signal candidate has retired." : __octaneNoArgError(203));
    const hadWrites = this.hasWrites();
    this.generation++;
    this.invalidatePreparation();
    import_transition_state.candidateGraph.signalBatch(() => {
      for (const entry of this.entries?.values() ?? []) {
        import_transition_state.candidateGraph.assertAlive(entry.node.owner);
        if (entry.epoch !== entry.node.owner.epoch || entry.node.owner.readBarrier) {
          throw new TypeError(__octaneDev ? "The candidate owner changed lifetime." : __octaneNoArgError(210));
        }
        const operations = entry.urgentOperations;
        if (!entry.withdrawn && !operations && entry.revision === entry.node.revision)
          continue;
        entry.revision = entry.node.revision;
        if (entry.node.kind === "signal") {
          let state = entry.node.state;
          if (operations) {
            let value = import_transition_state.candidateGraph.strictValue(import_transition_state.candidateGraph.refreshNode(entry.target), entry.node.key);
            for (const operation of operations)
              value = this.run(() => import_transition_state.candidateGraph.untrack(() => import_transition_state.candidateGraph.pure(() => operation(value))));
            if (!Object.is(value, import_transition_state.candidateGraph.strictValue(state, entry.node.key)))
              state = import_transition_state.candidateGraph.readyState(value);
            else
              this.forgetWrite(entry);
          } else
            this.forgetWrite(entry);
          entry.withdrawn = false;
          entry.urgentOperations = void 0;
          import_transition_state.candidateGraph.publishNode(entry.target, state);
        }
      }
    });
    if (hadWrites && !this.hasWrites())
      this.discard();
  }
  prepare(reads = []) {
    if (this.preparationWatch)
      clearPreparationWake(this.preparationWatch);
    this.preparationWatch = void 0;
    this.preparationToken = void 0;
    const token = {};
    if (!this.validate())
      return { status: "invalid", token, reason: "stale" };
    const generation = this.generation;
    let waiting;
    let failed = false;
    let failure;
    let invalid;
    const observeFailure = (error, handled = false) => {
      if (error instanceof import_transition_state.CandidateUnsupportedError)
        invalid = "unsupported";
      else if (error instanceof import_errors.ScopeDisposedError || error instanceof import_errors.SignalFrameError || error instanceof import_read_protocol.NativeAdoptionMiss)
        invalid ??= "stale";
      else if (!handled) {
        try {
          if (isThenable(error)) {
            (waiting ??= /* @__PURE__ */ new Set()).add(error);
            return;
          }
        } catch (inspectionError) {
          error = inspectionError;
        }
        if (!failed)
          failure = error;
        failed = true;
      }
    };
    const demand = reads.length ? /* @__PURE__ */ new Set() : void 0;
    this.demand = demand;
    for (const read of reads) {
      try {
        this.run(() => import_transition_state.candidateGraph.pure(read));
      } catch (error) {
        observeFailure(error);
      }
    }
    this.demand = void 0;
    if (demand)
      this.pruneDemand(demand);
    const prepared = [];
    for (const entry of this.entries?.values() ?? []) {
      let state;
      let producer;
      try {
        state = this.run(() => import_transition_state.candidateGraph.refreshNode(entry.target));
        const outcome = entry.producer?.prepare();
        if (outcome?.status === "pending")
          (waiting ??= /* @__PURE__ */ new Set()).add(outcome.waiting);
        else if (outcome?.status === "error")
          observeFailure(outcome.error);
        else if (outcome?.status === "invalid")
          invalid ??= "unsupported";
        else if (outcome?.status === "ready")
          producer = outcome.receipt;
      } catch (error) {
        observeFailure(error);
        continue;
      }
      if (state.snapshot.status === "pending" && state.waiting)
        (waiting ??= /* @__PURE__ */ new Set()).add(state.waiting);
      else if (state.snapshot.status === "error")
        observeFailure(state.snapshot.error, reads.length > 0 || producer !== void 0);
      else if (state.snapshot.status === "idle" && !producer)
        invalid ??= "unsupported";
      prepared.push({
        entry,
        state,
        last: entry.target.last,
        lastState: entry.target.lastState,
        hasLast: entry.target.hasLast,
        revision: entry.target.revision,
        producer
      });
    }
    if (invalid)
      return { status: "invalid", token, reason: invalid };
    if (!this.validate() || generation !== this.generation)
      return { status: "invalid", token, reason: "stale" };
    this.preparationToken = token;
    if (failed)
      return { status: "error", token, error: failure };
    if (waiting?.size)
      return { status: "pending", token, wakeables: [...waiting] };
    return {
      status: "ready",
      token,
      receipt: {
        publish: (accepted) => {
          if (!this.validate() || token !== this.preparationToken || generation !== this.generation || prepared.some(({ entry, state, last, lastState, hasLast, revision, producer }) => {
            if (entry.target.revision !== revision || !Object.is(entry.target.last, last) || entry.target.lastState !== lastState || entry.target.hasLast !== hasLast)
              return true;
            if (state.owners) {
              for (const owner of state.owners)
                if (owner.retired)
                  return true;
            }
            if (lastState?.owners && lastState.owners !== state.owners) {
              for (const owner of lastState.owners)
                if (owner.retired)
                  return true;
            }
            return producer !== void 0 && !producer.validate();
          }))
            return false;
          const releases = [];
          const changed = [];
          this.committed(() => import_transition_state.candidateGraph.signalBatch(() => {
            for (const { entry } of prepared)
              entry.node.flags |= import_transition_state.candidateGraph.flags.Dirty;
            for (const { entry, state, last, lastState, hasLast, producer } of prepared) {
              const { node, target } = entry;
              if (producer)
                releases.push(producer.publish());
              while (node.deps)
                import_transition_state.candidateGraph.graph.unlink(node.deps, node);
              for (let link = target.deps; link; link = link.nextDep) {
                const original = this.originals.get(link.dep);
                if (!original)
                  throw new TypeError(__octaneDev ? "Candidate dependency escaped its frame." : __octaneNoArgError(211));
                import_transition_state.candidateGraph.link(original, node);
              }
              const currentChanged = node.state?.snapshot !== state.snapshot || !import_transition_state.candidateGraph.sameState(node.state, state);
              const retainedChanged = node.hasLast !== hasLast || !Object.is(node.last, last) || (lastState ? !import_transition_state.candidateGraph.sameState(node.lastState, lastState) : node.lastState !== void 0);
              if (currentChanged)
                import_transition_state.candidateGraph.commitState(node, state);
              if (node.lastState?.owners !== lastState?.owners)
                import_transition_state.candidateGraph.releaseRetainedOwners(node);
              node.last = last;
              node.lastState = lastState;
              node.hasLast = hasLast;
              if (state.snapshot.status !== "ready")
                import_transition_state.candidateGraph.retainOwners(node);
              if (!currentChanged && retainedChanged)
                node.revision++;
              if (currentChanged || retainedChanged)
                changed.push(node);
            }
            this.active = false;
            const previous = (0, import_transition_state.swapCandidateInvalidation)(true);
            try {
              for (const node of changed) {
                if (node.subs) {
                  import_transition_state.candidateGraph.graph.propagate(node.subs, false);
                  import_transition_state.candidateGraph.graph.shallowPropagate(node.subs);
                }
              }
            } finally {
              (0, import_transition_state.swapCandidateInvalidation)(previous);
            }
            for (const { entry } of prepared) {
              entry.node.flags = import_transition_state.candidateGraph.flags.Mutable | import_transition_state.candidateGraph.flags.Watching;
            }
            try {
              for (const { producer } of prepared)
                producer?.accept?.();
              nativeExtension?.accept(prepared);
              accepted?.();
            } finally {
              this.release();
              for (const release of releases)
                release();
            }
          }));
          return true;
        }
      }
    };
  }
  watchPreparation(outcome, notify) {
    if (this.preparationWatch)
      clearPreparationWake(this.preparationWatch);
    this.preparationWatch = void 0;
    if (outcome.status !== "pending")
      return () => {
      };
    const token = outcome.token;
    const watch = {
      notify,
      token,
      queued: false,
      invalid: false,
      validate: () => token === this.preparationToken && this.validate()
    };
    this.preparationWatch = watch;
    if (!watch.validate())
      queuePreparationWake(watch, true);
    else
      for (const waiting of outcome.wakeables) {
        const settled = settlePreparationWake.bind(null, watch);
        Promise.resolve(waiting).then(settled, settled);
      }
    return () => clearPreparationWake(watch);
  }
  invalidatePreparation() {
    this.preparationToken = void 0;
    const watch = this.preparationWatch;
    this.preparationWatch = void 0;
    if (watch) {
      watch.validate = void 0;
      queuePreparationWake(watch, true);
    }
  }
  pruneDemand(demand) {
    for (const entry of this.entries?.values() ?? [])
      if (entry.written)
        demand.add(entry.node);
    for (const node of demand) {
      const entry = this.entries?.get(node);
      for (let link = entry?.target.deps; link; link = link.nextDep) {
        const original = this.originals?.get(link.dep);
        if (original)
          demand.add(original);
      }
      for (const dependency of entry?.producer?.dependencies?.() ?? []) {
        demand.add(this.canonical(dependency));
      }
    }
    let removed;
    for (const entry of this.entries?.values() ?? []) {
      if (demand.has(entry.node))
        continue;
      this.entries.delete(entry.node);
      this.originals.delete(entry.target);
      this.releaseEntry(entry);
      (removed ??= []).push(entry);
    }
    if (removed)
      this.committed(() => {
        for (const entry of removed)
          entry.producer?.dispose();
      });
  }
  discard() {
    if (!this.active)
      return;
    this.active = false;
    this.generation++;
    this.invalidatePreparation();
    this.release();
  }
  release() {
    if (this.preparationWatch)
      clearPreparationWake(this.preparationWatch);
    this.preparationWatch = void 0;
    this.preparationToken = void 0;
    const entries = this.entries;
    this.entries = void 0;
    this.originals = void 0;
    this.demand = void 0;
    for (const entry of entries?.values() ?? [])
      this.releaseEntry(entry);
    this.committed(() => {
      for (const entry of entries?.values() ?? [])
        entry.producer?.dispose();
    });
  }
  releaseEntry(entry) {
    nativeExtension?.release(entry);
    this.forgetWrite(entry);
    entry.urgentOperations = void 0;
    entry.stop();
    import_transition_state.candidateGraph.removeQueued(entry.target);
    while (entry.target.deps)
      import_transition_state.candidateGraph.graph.unlink(entry.target.deps, entry.target);
    while (entry.target.subs)
      import_transition_state.candidateGraph.graph.unlink(entry.target.subs);
    import_transition_state.candidateGraph.releaseRetention(entry.target);
    entry.target.compute = void 0;
  }
  committed(callback) {
    return (0, import_transition_state.withoutSignalCandidate)(callback);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SignalActionFrame,
  registerNativeSignalActionExtension
});
