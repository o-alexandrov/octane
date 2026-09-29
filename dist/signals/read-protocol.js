import { formatClientError } from "../error-codes.client.generated.js";
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
    super(formatClientError(194, read, scopeKey, nodeKey));
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
export {
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
};
