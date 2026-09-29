import { createNativeReadCollector } from "./native-read-collector.js";
import {
  mergeNativeSeedReads,
  rewindNativeSeedReads,
  serializeNativeSeedReads
} from "./native-read-seeds.js";
function createNativeServerReadDriver(record, recordFailure) {
  const frames = [];
  const passes = [];
  let depth = 0;
  let passDepth = 0;
  let base = 0;
  const collector = createNativeReadCollector((_owner, source, version) => {
    const frame = frames[depth - 1];
    if (frame === void 0) return;
    const reads = frame.reads ??= { reads: /* @__PURE__ */ new Map(), mixed: false };
    const previous = reads.reads.get(source);
    if (previous === void 0) reads.reads.set(source, version);
    else if (previous !== version) reads.mixed = true;
  });
  function append(reads) {
    if (depth === base) record(reads);
    else frames[depth - 1].reads = mergeNativeSeedReads(frames[depth - 1].reads, reads);
  }
  return {
    merge: mergeNativeSeedReads,
    rewindReads: rewindNativeSeedReads,
    serialize: serializeNativeSeedReads,
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
      rewindNativeSeedReads(checkpoint.reads, checkpoint.size, checkpoint.mixed);
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
export {
  createNativeServerReadDriver
};
