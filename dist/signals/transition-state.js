import { setNativeCandidateResolver } from "./read-protocol.js";
let candidateGraph;
function registerCandidateGraph(graph) {
  candidateGraph = graph;
}
let createSignalActionFrame;
function registerSignalActionFrameFactory(factory) {
  createSignalActionFrame = factory;
}
let createSignalTransitionCoordinator;
function registerSignalTransitionCoordinatorFactory(factory) {
  createSignalTransitionCoordinator = factory;
}
function withoutSignalCandidate(callback) {
  const previous = activeCandidate;
  const resolver = setNativeCandidateResolver(null);
  activeCandidate = void 0;
  try {
    return callback();
  } finally {
    activeCandidate = previous;
    setNativeCandidateResolver(resolver);
  }
}
class CandidateUnsupportedError extends TypeError {
}
let activeCandidate;
function swapActiveSignalCandidate(frame) {
  const previous = activeCandidate;
  activeCandidate = frame;
  return previous;
}
let deferCandidateInvalidation = false;
function swapCandidateInvalidation(defer) {
  const previous = deferCandidateInvalidation;
  deferCandidateInvalidation = defer;
  return previous;
}
let candidateWriteCount = 0;
let candidateWriters;
function addCandidateWriter(node, frame) {
  candidateWriteCount++;
  candidateWriters ??= /* @__PURE__ */ new WeakMap();
  let writers = candidateWriters.get(node);
  if (!writers) candidateWriters.set(node, writers = /* @__PURE__ */ new Set());
  writers.add(frame);
}
function removeCandidateWriter(node, frame) {
  const writers = candidateWriters.get(node);
  writers.delete(frame);
  if (writers.size === 0) candidateWriters.delete(node);
  if (--candidateWriteCount === 0) candidateWriters = void 0;
}
function recordCandidateUrgentWrite(node, value) {
  let releases;
  const writers = candidateWriters?.get(node);
  if (writers)
    for (const frame of writers) {
      const release = frame.recordUrgentWrite(node, value);
      if (release) (releases ??= []).push(release);
    }
  return releases;
}
export {
  CandidateUnsupportedError,
  activeCandidate,
  addCandidateWriter,
  candidateGraph,
  candidateWriteCount,
  candidateWriters,
  createSignalActionFrame,
  createSignalTransitionCoordinator,
  deferCandidateInvalidation,
  recordCandidateUrgentWrite,
  registerCandidateGraph,
  registerSignalActionFrameFactory,
  registerSignalTransitionCoordinatorFactory,
  removeCandidateWriter,
  swapActiveSignalCandidate,
  swapCandidateInvalidation,
  withoutSignalCandidate
};
