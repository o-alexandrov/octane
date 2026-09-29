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
var native_read_server_exports = {};
__export(native_read_server_exports, {
  createNativeServerReadDriver: () => createNativeServerReadDriver
});
module.exports = __toCommonJS(native_read_server_exports);
var import_native_read_collector = require("./native-read-collector.cjs");
var import_native_read_seeds = require("./native-read-seeds.cjs");
function createNativeServerReadDriver(record, recordFailure) {
  const frames = [];
  const passes = [];
  let depth = 0;
  let passDepth = 0;
  let base = 0;
  const collector = (0, import_native_read_collector.createNativeReadCollector)((_owner, source, version) => {
    const frame = frames[depth - 1];
    if (frame === void 0) return;
    const reads = frame.reads ??= { reads: /* @__PURE__ */ new Map(), mixed: false };
    const previous = reads.reads.get(source);
    if (previous === void 0) reads.reads.set(source, version);
    else if (previous !== version) reads.mixed = true;
  });
  function append(reads) {
    if (depth === base) record(reads);
    else frames[depth - 1].reads = (0, import_native_read_seeds.mergeNativeSeedReads)(frames[depth - 1].reads, reads);
  }
  return {
    merge: import_native_read_seeds.mergeNativeSeedReads,
    rewindReads: import_native_read_seeds.rewindNativeSeedReads,
    serialize: import_native_read_seeds.serializeNativeSeedReads,
    isDetached: collector.isDetached,
    pauseLifecycle: () => collector.suspend(true),
    resumeLifecycle: (token) => collector.resume(token, true),
    checkpoint() {
      if (depth === base) return null;
      const frame = frames[depth - 1];
      const reads = frame.reads;
      return { frame, reads, size: reads?.reads.size ?? 0, mixed: reads?.mixed ?? false };
    },
    rewind(checkpoint) {
      checkpoint.frame.reads = checkpoint.reads;
      (0, import_native_read_seeds.rewindNativeSeedReads)(checkpoint.reads, checkpoint.size, checkpoint.mixed);
    },
    beginPass() {
      const token = passDepth++;
      const pass = passes[token] ??= { base: 0, collectorToken: -1 };
      pass.base = base;
      pass.collectorToken = collector.beginRender();
      base = depth;
      return token;
    },
    endPass(token) {
      const pass = passes[token];
      base = pass.base;
      passDepth = token;
      collector.endRender(pass.collectorToken);
    },
    beginScope(owner) {
      const token = depth++;
      const frame = frames[token] ??= { collectorToken: -1, reads: null };
      frame.reads = null;
      frame.collectorToken = collector.beginScope(owner);
      return token;
    },
    endScope(token, completed) {
      const frame = frames[token];
      const reads = frame.reads;
      frame.reads = null;
      depth = token;
      try {
        if (completed && reads !== null) append(reads);
        else if (!completed && reads !== null) recordFailure();
      } finally {
        collector.endScope(frame.collectorToken);
      }
    },
    /** A renderer boundary may emit its successful body in a later segment. */
    beginCapture() {
      const token = depth++;
      const frame = frames[token] ??= { collectorToken: -1, reads: null };
      frame.collectorToken = -1;
      frame.reads = null;
      return token;
    },
    finishCapture(token, merge) {
      const frame = frames[token];
      const reads = frame.reads;
      frame.reads = null;
      depth = token;
      if (merge && reads !== null) append(reads);
      return reads;
    },
    append,
    beginWitness: collector.beginWitness,
    finishWitness: collector.finishWitness,
    replay: collector.replay
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNativeServerReadDriver
});
