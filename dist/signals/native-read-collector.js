import {
  beginNativeWriteGuard,
  endNativeWriteGuard,
  getNativeReadObserver,
  isNativeWriteGuarded,
  setNativeReadObserver
} from "./read-protocol.js";
function createNativeReadCollector(onRead) {
  let owner = null;
  let scopeDepth = 0;
  let witnessDepth = 0;
  let witnessBase = 0;
  let detachedWitness = false;
  const scopes = [];
  const witnesses = [];
  const observe = (source, version) => {
    if (owner !== null) onRead(owner, source, version);
    for (let i = witnessBase; i < witnessDepth; i++) {
      const frame = witnesses[i];
      const reads = frame.reads ??= /* @__PURE__ */ new Map();
      const previous = reads.get(source);
      if (previous === void 0) reads.set(source, version);
      else if (previous !== version) frame.mixed = true;
    }
  };
  function enter(next, guarded, allowWrites = false, keepDetached = false) {
    const token = scopeDepth++;
    const frame = scopes[token] ??= {
      owner: null,
      observer: null,
      guard: false,
      witnessBase: 0,
      detached: false
    };
    frame.owner = owner;
    frame.detached = detachedWitness;
    if (!keepDetached) detachedWitness = false;
    if (detachedWitness) next = null;
    frame.observer = setNativeReadObserver(next !== null || detachedWitness ? observe : null);
    frame.guard = guarded ? beginNativeWriteGuard() : isNativeWriteGuarded();
    if (allowWrites) endNativeWriteGuard(false);
    frame.witnessBase = witnessBase;
    if (!detachedWitness && next !== owner) witnessBase = witnessDepth;
    owner = next;
    return token;
  }
  function leave(token, guarded) {
    if (token < 0) return;
    const frame = scopes[token];
    owner = frame.owner;
    witnessBase = frame.witnessBase;
    detachedWitness = frame.detached;
    setNativeReadObserver(frame.observer);
    if (guarded) endNativeWriteGuard(frame.guard);
    frame.owner = null;
    frame.observer = null;
    scopeDepth = token;
  }
  return {
    isDetached() {
      return detachedWitness;
    },
    beginScope(next) {
      if (next === owner && !detachedWitness && getNativeReadObserver() === observe && isNativeWriteGuarded())
        return -1;
      return enter(next, true, false, true);
    },
    endScope(token) {
      leave(token, true);
    },
    /** Own parameters, the component body, and returned-output normalization. */
    beginRender(next = null) {
      const token = enter(next, true);
      witnessBase = witnessDepth;
      return token;
    },
    endRender(token) {
      leave(token, true);
    },
    /** A child Block cannot accidentally add its reads to its parent. */
    suspend(allowWrites = false) {
      const token = enter(null, false, allowWrites);
      witnessBase = witnessDepth;
      return token;
    },
    resume(token, allowWrites = false) {
      leave(token, allowWrites);
    },
    beginWitness(detached = false) {
      if (owner === null && !detached && !detachedWitness) return -1;
      let contextToken = -1;
      if (detached) {
        contextToken = enter(null, true);
        detachedWitness = true;
        witnessBase = witnessDepth;
        setNativeReadObserver(observe);
      }
      const token = witnessDepth++;
      const frame = witnesses[token] ??= { reads: null, mixed: false, contextToken: -1 };
      frame.reads = null;
      frame.mixed = false;
      frame.contextToken = contextToken;
      return token;
    },
    finishWitness(token, completed) {
      if (token < 0) return null;
      const frame = witnesses[token];
      const reads = frame.reads;
      frame.reads = null;
      witnessDepth = token;
      if (frame.contextToken >= 0) leave(frame.contextToken, true);
      frame.contextToken = -1;
      return completed && reads !== null ? { reads, mixed: frame.mixed } : null;
    },
    replay(witness) {
      if (witness === null || witness === void 0) return;
      for (const [source, version] of witness.reads) observe(source, version);
    }
  };
}
function validateNativeReadWitness(witness) {
  if (witness === null || witness === void 0) return true;
  if (witness.mixed) return false;
  for (const [source, version] of witness.reads) {
    if (source.getVersion() !== version) return false;
  }
  return true;
}
export {
  createNativeReadCollector,
  validateNativeReadWitness
};
