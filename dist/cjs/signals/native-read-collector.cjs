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
var native_read_collector_exports = {};
__export(native_read_collector_exports, {
  createNativeReadCollector: () => createNativeReadCollector,
  validateNativeReadWitness: () => validateNativeReadWitness
});
module.exports = __toCommonJS(native_read_collector_exports);
var import_read_protocol = require("./read-protocol.cjs");
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
    frame.observer = (0, import_read_protocol.setNativeReadObserver)(next !== null || detachedWitness ? observe : null);
    frame.guard = guarded ? (0, import_read_protocol.beginNativeWriteGuard)() : (0, import_read_protocol.isNativeWriteGuarded)();
    if (allowWrites) (0, import_read_protocol.endNativeWriteGuard)(false);
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
    (0, import_read_protocol.setNativeReadObserver)(frame.observer);
    if (guarded) (0, import_read_protocol.endNativeWriteGuard)(frame.guard);
    frame.owner = null;
    frame.observer = null;
    scopeDepth = token;
  }
  return {
    isDetached() {
      return detachedWitness;
    },
    beginScope(next) {
      if (next === owner && !detachedWitness && (0, import_read_protocol.getNativeReadObserver)() === observe && (0, import_read_protocol.isNativeWriteGuarded)())
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
        (0, import_read_protocol.setNativeReadObserver)(observe);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNativeReadCollector,
  validateNativeReadWitness
});
