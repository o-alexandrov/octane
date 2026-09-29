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
var transition_state_exports = {};
__export(transition_state_exports, {
  CandidateUnsupportedError: () => CandidateUnsupportedError,
  activeCandidate: () => activeCandidate,
  addCandidateWriter: () => addCandidateWriter,
  candidateGraph: () => candidateGraph,
  candidateWriteCount: () => candidateWriteCount,
  candidateWriters: () => candidateWriters,
  createSignalActionFrame: () => createSignalActionFrame,
  createSignalTransitionCoordinator: () => createSignalTransitionCoordinator,
  deferCandidateInvalidation: () => deferCandidateInvalidation,
  recordCandidateUrgentWrite: () => recordCandidateUrgentWrite,
  registerCandidateGraph: () => registerCandidateGraph,
  registerSignalActionFrameFactory: () => registerSignalActionFrameFactory,
  registerSignalTransitionCoordinatorFactory: () => registerSignalTransitionCoordinatorFactory,
  removeCandidateWriter: () => removeCandidateWriter,
  swapActiveSignalCandidate: () => swapActiveSignalCandidate,
  swapCandidateInvalidation: () => swapCandidateInvalidation,
  withoutSignalCandidate: () => withoutSignalCandidate
});
module.exports = __toCommonJS(transition_state_exports);
var import_read_protocol = require("./read-protocol.cjs");
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
  const resolver = (0, import_read_protocol.setNativeCandidateResolver)(null);
  activeCandidate = void 0;
  try {
    return callback();
  } finally {
    activeCandidate = previous;
    (0, import_read_protocol.setNativeCandidateResolver)(resolver);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
