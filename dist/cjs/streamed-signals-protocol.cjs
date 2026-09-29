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
var streamed_signals_protocol_exports = {};
__export(streamed_signals_protocol_exports, {
  decodeStreamedRendererFrame: () => decodeStreamedRendererFrame,
  encodeStreamedRendererFrameForScript: () => encodeStreamedRendererFrameForScript,
  isStreamFrameIdentity: () => isStreamFrameIdentity,
  isStreamedRendererFrame: () => isStreamedRendererFrame,
  sameStreamFrameIdentity: () => sameStreamFrameIdentity,
  streamFrameIdentityKey: () => streamFrameIdentityKey
});
module.exports = __toCommonJS(streamed_signals_protocol_exports);
function isRecord(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor.enumerable || !("value" in descriptor)) return false;
  }
  return true;
}
function isKey(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 1024;
}
function isCounter(value) {
  return Number.isSafeInteger(value) && value >= 0;
}
function hasOnly(record, allowed) {
  return Object.keys(record).every((key) => allowed.has(key));
}
const IDENTITY_KEYS = /* @__PURE__ */ new Set([
  "protocol",
  "buildId",
  "documentId",
  "ownerKey",
  "instanceKey",
  "nodeKey",
  "selectionKey",
  "selectionGeneration",
  "attempt"
]);
function isStreamFrameIdentity(value) {
  if (!isRecord(value) || !hasOnly(value, IDENTITY_KEYS)) return false;
  return value.protocol === 1 && isKey(value.buildId) && isKey(value.documentId) && isKey(value.ownerKey) && isKey(value.instanceKey) && isKey(value.nodeKey) && isKey(value.selectionKey) && isCounter(value.selectionGeneration) && isCounter(value.attempt);
}
function isEncodedSignalValue(value, depth = 0) {
  if (depth > 100 || !Array.isArray(value) || typeof value[0] !== "string") return false;
  const tag = value[0];
  if (tag === "undefined" || tag === "null") return value.length === 1;
  if (value.length !== 2) return false;
  if (tag === "boolean") return typeof value[1] === "boolean";
  if (tag === "string") return typeof value[1] === "string";
  if (tag === "number") {
    return value[1] === "-0" || typeof value[1] === "number" && Number.isFinite(value[1]) && !Object.is(value[1], -0);
  }
  if (tag === "array") {
    return Array.isArray(value[1]) && value[1].every((item) => isEncodedSignalValue(item, depth + 1));
  }
  if (tag !== "object" || !Array.isArray(value[1])) return false;
  let previous;
  for (const entry of value[1]) {
    if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || previous !== void 0 && entry[0] <= previous || !isEncodedSignalValue(entry[1], depth + 1)) {
      return false;
    }
    previous = entry[0];
  }
  return true;
}
function isHistoricalFrame(value) {
  return isRecord(value) && value.version === 1 && isKey(value.scopeKey) && Array.isArray(value.entries);
}
const RESULT_BASE_KEYS = /* @__PURE__ */ new Set(["identity", "sequence", "channel", "kind"]);
function isStreamedRendererFrame(value) {
  if (!isRecord(value) || !isStreamFrameIdentity(value.identity) || !isCounter(value.sequence)) {
    return false;
  }
  if (value.channel === "result") {
    if (value.kind === "open") {
      return hasOnly(value, /* @__PURE__ */ new Set([...RESULT_BASE_KEYS, "resource"])) && (value.resource === "promise" || value.resource === "stream");
    }
    if (value.kind === "value") {
      return hasOnly(value, /* @__PURE__ */ new Set([...RESULT_BASE_KEYS, "value"])) && isEncodedSignalValue(value.value);
    }
    if (value.kind === "error") {
      return hasOnly(value, /* @__PURE__ */ new Set([...RESULT_BASE_KEYS, "code"])) && isKey(value.code);
    }
    return value.kind === "complete" && hasOnly(value, RESULT_BASE_KEYS);
  }
  if (value.channel !== "placement" || value.kind !== "html") return false;
  const allowed = /* @__PURE__ */ new Set([
    "identity",
    "sequence",
    "channel",
    "kind",
    "contentRevision",
    "baseRevision",
    "mode",
    "html",
    "historicalFrame",
    "styles"
  ]);
  if (!hasOnly(value, allowed) || !isCounter(value.contentRevision) || value.mode !== "full" && value.mode !== "delta" || typeof value.html !== "string" || !isHistoricalFrame(value.historicalFrame) || !Array.isArray(value.styles) || !value.styles.every(isKey) || new Set(value.styles).size !== value.styles.length) {
    return false;
  }
  if (value.mode === "delta") return isCounter(value.baseRevision);
  return value.baseRevision === void 0 || isCounter(value.baseRevision);
}
function decodeStreamedRendererFrame(json) {
  const value = JSON.parse(json);
  if (!isStreamedRendererFrame(value)) throw new Error("Invalid Octane streamed renderer frame.");
  return value;
}
function encodeStreamedRendererFrameForScript(frame) {
  if (!isStreamedRendererFrame(frame)) throw new Error("Invalid Octane streamed renderer frame.");
  return JSON.stringify(frame).replace(/&/g, "\\u0026").replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function sameStreamFrameIdentity(a, b) {
  return a.protocol === b.protocol && a.buildId === b.buildId && a.documentId === b.documentId && a.ownerKey === b.ownerKey && a.instanceKey === b.instanceKey && a.nodeKey === b.nodeKey && a.selectionKey === b.selectionKey && a.selectionGeneration === b.selectionGeneration && a.attempt === b.attempt;
}
function streamFrameIdentityKey(identity) {
  return JSON.stringify([
    identity.protocol,
    identity.buildId,
    identity.documentId,
    identity.ownerKey,
    identity.instanceKey,
    identity.nodeKey,
    identity.selectionKey,
    identity.selectionGeneration,
    identity.attempt
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decodeStreamedRendererFrame,
  encodeStreamedRendererFrameForScript,
  isStreamFrameIdentity,
  isStreamedRendererFrame,
  sameStreamFrameIdentity,
  streamFrameIdentityKey
});
