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
var read_protocol_exports = {};
__export(read_protocol_exports, {
  NATIVE_DOM_VALUE: () => NATIVE_DOM_VALUE,
  NATIVE_TRANSITION_CONSUMER: () => NATIVE_TRANSITION_CONSUMER,
  NativeAdoptionMiss: () => NativeAdoptionMiss,
  SIGNAL_DEPENDENT_NODE: () => SIGNAL_DEPENDENT_NODE,
  beginNativeBatch: () => beginNativeBatch,
  beginNativeWriteGuard: () => beginNativeWriteGuard,
  endNativeBatch: () => endNativeBatch,
  endNativeWriteGuard: () => endNativeWriteGuard,
  forwardNativeTransitionConsumer: () => forwardNativeTransitionConsumer,
  getNativeAdoptionResolver: () => getNativeAdoptionResolver,
  getNativeCandidate: () => getNativeCandidate,
  getNativeReadObserver: () => getNativeReadObserver,
  isNativeWriteGuarded: () => isNativeWriteGuarded,
  readNativeDomProps: () => readNativeDomProps,
  readNativeDomStyle: () => readNativeDomStyle,
  readNativeDomValue: () => readNativeDomValue,
  registerNativeActionResolver: () => registerNativeActionResolver,
  registerNativeBatchHooks: () => registerNativeBatchHooks,
  reportNativeRead: () => reportNativeRead,
  runNativeBatch: () => runNativeBatch,
  setNativeAdoptionResolver: () => setNativeAdoptionResolver,
  setNativeCandidateResolver: () => setNativeCandidateResolver,
  setNativeReadObserver: () => setNativeReadObserver
});
module.exports = __toCommonJS(read_protocol_exports);
var import_error_codes_client_generated = require("../error-codes.client.generated.cjs");
const SIGNAL_DEPENDENT_NODE = /* @__PURE__ */ Symbol("octane.signalDependent");
const NATIVE_TRANSITION_CONSUMER = /* @__PURE__ */ Symbol("octane.transitionConsumer");
function forwardNativeTransitionConsumer(notify, wrapped) {
  const consumer = notify[NATIVE_TRANSITION_CONSUMER];
  if (consumer) wrapped[NATIVE_TRANSITION_CONSUMER] = consumer;
  return wrapped;
}
let nativeActionResolver;
let nativeCandidateResolver;
function registerNativeActionResolver(resolver) {
  nativeActionResolver = resolver;
}
function getNativeCandidate() {
  return nativeCandidateResolver === void 0 ? nativeActionResolver?.() : nativeCandidateResolver?.();
}
function setNativeCandidateResolver(resolver) {
  const previous = nativeCandidateResolver;
  nativeCandidateResolver = resolver;
  return previous;
}
let nativeReadObserver = null;
let nativeWriteGuarded = false;
const NATIVE_DOM_VALUE = /* @__PURE__ */ Symbol("octane.nativeDomValue");
function readNativeDomValue(value) {
  return value !== null && typeof value === "object" && NATIVE_DOM_VALUE in value ? value[NATIVE_DOM_VALUE]() : value;
}
function readNativeDomStyle(value) {
  value = readNativeDomValue(value);
  if (value === null || typeof value !== "object") return value;
  const result = /* @__PURE__ */ Object.create(null);
  for (const name in value) result[name] = readNativeDomValue(value[name]);
  return result;
}
function readNativeDomProps(props) {
  return "style" in props ? { ...props, style: readNativeDomStyle(props.style) } : props;
}
let nativeAdoptionResolver = null;
class NativeAdoptionMiss extends Error {
  scopeKey;
  nodeKey;
  read;
  constructor(scopeKey, nodeKey, read = "value") {
    super((0, import_error_codes_client_generated.formatClientError)(194, read, scopeKey, nodeKey));
    this.name = "NativeAdoptionMiss";
    this.scopeKey = scopeKey;
    this.nodeKey = nodeKey;
    this.read = read;
  }
}
function getNativeAdoptionResolver() {
  return nativeAdoptionResolver;
}
function setNativeAdoptionResolver(resolver) {
  const previous = nativeAdoptionResolver;
  nativeAdoptionResolver = resolver;
  return previous;
}
let nativeBatchHooks = null;
function registerNativeBatchHooks(hooks) {
  nativeBatchHooks = hooks;
}
function beginNativeBatch() {
  const hooks = nativeBatchHooks;
  hooks?.startBatch();
  return hooks;
}
function endNativeBatch(hooks) {
  hooks?.endBatch();
}
function runNativeBatch(callback) {
  const hooks = beginNativeBatch();
  try {
    return callback();
  } finally {
    endNativeBatch(hooks);
  }
}
function reportNativeRead(source, version) {
  nativeReadObserver?.(source, version);
}
function getNativeReadObserver() {
  return nativeReadObserver;
}
function setNativeReadObserver(observer) {
  const previous = nativeReadObserver;
  nativeReadObserver = observer;
  return previous;
}
function beginNativeWriteGuard() {
  const previous = nativeWriteGuarded;
  nativeWriteGuarded = true;
  return previous;
}
function endNativeWriteGuard(previous) {
  nativeWriteGuarded = previous;
}
function isNativeWriteGuarded() {
  return nativeWriteGuarded;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NATIVE_DOM_VALUE,
  NATIVE_TRANSITION_CONSUMER,
  NativeAdoptionMiss,
  SIGNAL_DEPENDENT_NODE,
  beginNativeBatch,
  beginNativeWriteGuard,
  endNativeBatch,
  endNativeWriteGuard,
  forwardNativeTransitionConsumer,
  getNativeAdoptionResolver,
  getNativeCandidate,
  getNativeReadObserver,
  isNativeWriteGuarded,
  readNativeDomProps,
  readNativeDomStyle,
  readNativeDomValue,
  registerNativeActionResolver,
  registerNativeBatchHooks,
  reportNativeRead,
  runNativeBatch,
  setNativeAdoptionResolver,
  setNativeCandidateResolver,
  setNativeReadObserver
});
