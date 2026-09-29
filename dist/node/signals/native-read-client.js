const __octaneDev = process.env.NODE_ENV !== "production";
import { createNativeReadCollector, validateNativeReadWitness } from "./native-read-collector.js";
import { NATIVE_TRANSITION_CONSUMER } from "./read-protocol.js";
import { inspectNativeReadWitness } from "./native-read-inspection.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function createNativeReadDriver(host) {
  const consumers = /* @__PURE__ */ new WeakMap();
  const captures = /* @__PURE__ */ new WeakMap();
  const frames = [];
  let depth = 0;
  let publications = null;
  let ownerPublications = null;
  let unpublishedRefs = null;
  let deferredRefs = null;
  function forgetUnpublishedRef(target2) {
    const unpublished = unpublishedRefs?.get(target2);
    if (unpublished === void 0)
      return;
    unpublishedRefs.delete(target2);
    const pending = deferredRefs?.get(unpublished.owner);
    pending?.delete(target2);
    if (pending?.size === 0)
      deferredRefs.delete(unpublished.owner);
  }
  function release(candidate) {
    if (!candidate.active)
      return;
    candidate.active = false;
    const consumer = candidate.consumer;
    consumer.pending.delete(candidate);
    for (const source of candidate.reads.keys()) {
      const subscription = consumer.subscriptions.get(source);
      if (subscription !== void 0 && --subscription.leases === 0) {
        consumer.subscriptions.delete(source);
        subscription.dispose();
      }
    }
    candidate.reads.clear();
  }
  function disposeConsumer(consumer) {
    if (consumer.disposed)
      return;
    consumer.disposed = true;
    host.retire?.(consumer.block);
    if (consumer.committed !== null)
      release(consumer.committed);
    consumer.committed = null;
    for (const candidate of consumer.pending)
      release(candidate);
    consumer.pending.clear();
    consumers.delete(consumer.scope);
  }
  function getConsumer(scope, block) {
    let consumer = consumers.get(scope);
    if (consumer === void 0) {
      consumer = {
        scope,
        block,
        disposed: false,
        notify: () => {
          if (!consumer.disposed && !consumer.block.disposed)
            host.schedule(consumer.block);
        },
        subscriptions: /* @__PURE__ */ new Map(),
        committed: null,
        pending: /* @__PURE__ */ new Set()
      };
      consumers.set(scope, consumer);
      const owned = consumer;
      if (host.prepare !== void 0) {
        Object.assign(owned.notify, {
          [NATIVE_TRANSITION_CONSUMER]: {
            active: () => !owned.disposed && !owned.block.disposed,
            prepare: () => host.prepare(owned.block)
          }
        });
      }
      host.cleanup(scope, () => disposeConsumer(owned));
    }
    return consumer;
  }
  function getCandidate(frame, scope) {
    const candidates = frame.candidates ??= /* @__PURE__ */ new Map();
    let candidate = candidates.get(scope);
    if (candidate === void 0) {
      const consumer = getConsumer(scope, frame.block);
      candidate = { consumer, reads: /* @__PURE__ */ new Map(), mixed: false, active: true };
      consumer.pending.add(candidate);
      candidates.set(scope, candidate);
    }
    return candidate;
  }
  const collector = createNativeReadCollector((owner, source, version) => {
    const frame = frames[depth - 1];
    if (frame === void 0 || frame.block === null)
      return;
    const candidate = getCandidate(frame, owner);
    const previous = candidate.reads.get(source);
    if (previous !== void 0) {
      if (previous !== version)
        candidate.mixed = true;
      return;
    }
    candidate.reads.set(source, version);
    const consumer = candidate.consumer;
    let subscription = consumer.subscriptions.get(source);
    if (subscription === void 0) {
      subscription = { leases: 0, dispose: source.subscribe(consumer.notify) };
      consumer.subscriptions.set(source, subscription);
    }
    subscription.leases++;
  });
  function put(target2, candidate) {
    const consumer = candidate.consumer;
    const previous = target2.get(consumer);
    if (previous !== void 0 && previous !== candidate)
      release(previous);
    target2.set(consumer, candidate);
  }
  function target(capture) {
    let candidates = captures.get(capture);
    if (candidates === void 0)
      captures.set(capture, candidates = /* @__PURE__ */ new Map());
    return candidates;
  }
  function validate(candidates) {
    if (candidates !== null && candidates !== void 0) {
      for (const candidate of candidates.values()) {
        if (candidate.active && !candidate.consumer.disposed && !validateNativeReadWitness(candidate))
          return false;
      }
    }
    return true;
  }
  function accept(candidates) {
    if (candidates === null || candidates === void 0)
      return;
    for (const candidate of candidates.values()) {
      const consumer = candidate.consumer;
      if (!candidate.active || consumer.disposed)
        continue;
      const previous = consumer.committed;
      consumer.pending.delete(candidate);
      consumer.committed = candidate;
      if (previous !== null)
        release(previous);
    }
    candidates.clear();
  }
  return {
    /** Selected-node inspection reads this Scope's existing records only. */
    inspectScope(scope) {
      const consumer = consumers.get(scope);
      if (consumer === void 0 || consumer.disposed)
        return null;
      return {
        block: consumer.block,
        committed: consumer.committed === null ? null : inspectNativeReadWitness(consumer.committed),
        pending: Array.from(consumer.pending, inspectNativeReadWitness)
      };
    },
    /** Receipt stamps exist only for a capture that actually read native data. */
    stampPublication(owner, queues) {
      const publication = { owner, generation: owner.generation };
      (ownerPublications ??= /* @__PURE__ */ new WeakMap()).set(owner, publication);
      const receipts = publications ??= /* @__PURE__ */ new WeakMap();
      for (const queue of queues)
        for (const entry of queue)
          receipts.set(entry, publication);
    },
    hasPublication(owner) {
      return ownerPublications?.has(owner) === true;
    },
    /** Reveals enumerate current refs after their candidate was already accepted. */
    stampQueuedPublication(owner, entry) {
      const publication = ownerPublications?.get(owner);
      if (publication !== void 0)
        publications.set(entry, publication);
    },
    publicationCurrent(entry) {
      const publication = publications?.get(entry);
      return publication === void 0 || !publication.owner.disposed && publication.owner.generation === publication.generation;
    },
    deferRef(entry, target2, ref) {
      const publication = publications?.get(entry);
      if (publication === void 0 || publication.owner.disposed)
        return;
      forgetUnpublishedRef(target2);
      const owner = publication.owner;
      (unpublishedRefs ??= /* @__PURE__ */ new WeakMap()).set(target2, { owner, entry, ref });
      const owners = deferredRefs ??= /* @__PURE__ */ new WeakMap();
      let pending = owners.get(owner);
      if (pending === void 0)
        owners.set(owner, pending = /* @__PURE__ */ new Map());
      pending.set(target2, entry);
    },
    unpublishedRef(target2, ref) {
      const unpublished = unpublishedRefs?.get(target2);
      return unpublished !== void 0 && unpublished.ref === ref;
    },
    forgetUnpublishedRef,
    deferredRefEntries(owner) {
      return deferredRefs?.get(owner);
    },
    clearDeferredRefs(owner) {
      ownerPublications?.delete(owner);
      const pending = deferredRefs?.get(owner);
      if (pending === void 0)
        return;
      for (const target2 of pending.keys())
        forgetUnpublishedRef(target2);
    },
    pruneDeferredRefs(owner) {
      const pending = deferredRefs?.get(owner);
      if (pending === void 0)
        return;
      for (const [target2, entry] of pending) {
        if (host.refDisposed(entry))
          forgetUnpublishedRef(target2);
      }
    },
    replayDeferredRefs: host.replayRefs,
    beginRender(block) {
      const frame = frames[depth++] ??= { block: null, collectorToken: -1, candidates: null };
      frame.block = block;
      frame.collectorToken = collector.beginRender(block);
      frame.candidates = null;
      if (consumers.has(block))
        getCandidate(frame, block);
    },
    endRender(block, completed, suspended) {
      const frame = frames[depth - 1];
      if (frame === void 0 || frame.block !== block)
        return;
      try {
        if (frame.candidates !== null) {
          if (completed) {
            const capture = host.capture();
            if (capture === null)
              throw new Error(__octaneDev ? "A completed native render requires a renderer transaction." : __octaneNoArgError(167));
            const destination = target(capture);
            for (const candidate of frame.candidates.values())
              put(destination, candidate);
          } else {
            for (const candidate of frame.candidates.values()) {
              if (suspended && candidate.active)
                host.suspended(block, candidate);
              release(candidate);
            }
          }
        }
      } finally {
        collector.endRender(frame.collectorToken);
        frame.block = null;
        frame.candidates = null;
        depth--;
      }
    },
    beginScope(scope, block) {
      if (collector.isDetached())
        return collector.beginScope(scope);
      if (host.capture() === null)
        throw new Error(__octaneDev ? "Native reads require a renderer transaction." : __octaneNoArgError(168));
      if (depth === 0 || frames[depth - 1].block !== block)
        this.beginRender(block);
      const frame = frames[depth - 1];
      if (scope !== block && consumers.has(scope))
        getCandidate(frame, scope);
      return collector.beginScope(scope);
    },
    endScope(token) {
      collector.endScope(token);
    },
    pauseLifecycle() {
      return collector.suspend(true);
    },
    resumeLifecycle(token) {
      collector.resume(token, true);
    },
    beginWitness: collector.beginWitness,
    finishWitness: collector.finishWitness,
    replay: collector.replay,
    validateCapture(capture) {
      return validate(captures.get(capture));
    },
    acceptCapture(capture) {
      const candidates = captures.get(capture);
      const native = candidates !== void 0 && candidates.size > 0;
      captures.delete(capture);
      accept(candidates);
      return native;
    },
    spliceCapture(capture, parent) {
      const candidates = captures.get(capture);
      if (candidates === void 0)
        return;
      if (parent === null)
        throw new Error(__octaneDev ? "A native capture must be accepted before publication." : __octaneNoArgError(169));
      captures.delete(capture);
      const destination = target(parent);
      for (const candidate of candidates.values())
        put(destination, candidate);
    },
    discardCapture(capture) {
      const candidates = captures.get(capture);
      if (candidates === void 0)
        return;
      captures.delete(capture);
      for (const candidate of candidates.values())
        release(candidate);
      candidates.clear();
    }
  };
}
export {
  createNativeReadDriver
};
