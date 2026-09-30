"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var runtime_server_exports = {};
__export(runtime_server_exports, {
  Activity: () => Activity,
  Children: () => Children,
  EXTERNAL_HYDRATION_PROMISE: () => import_constants.EXTERNAL_HYDRATION_PROMISE,
  ErrorBoundary: () => ErrorBoundary,
  Fragment: () => Fragment,
  HYDRATION_RANGE_BOUNDARY: () => import_constants.HYDRATION_RANGE_BOUNDARY,
  Hydrate: () => Hydrate2,
  Suspense: () => Suspense,
  ViewTransition: () => ViewTransition,
  __useLinkedStateWithGetter: () => __useLinkedStateWithGetter,
  __useReducerWithGetter: () => __useReducerWithGetter,
  __useStateWithGetter: () => __useStateWithGetter,
  addTransitionType: () => addTransitionType,
  beginNativeReadScope: () => beginNativeReadScope,
  beginNativeReadWitness: () => beginNativeReadWitness,
  bindPresentationView: () => bindPresentationView,
  callWithReceiver: () => callWithReceiver,
  cloneElement: () => cloneElement,
  createContext: () => createContext,
  createElement: () => createElement,
  createElementAt: () => createElementAt,
  createElementFromConfig: () => createElementFromConfig,
  createHostedServerSession: () => createHostedServerSession,
  createPortal: () => createPortal,
  createScopedElement: () => createScopedElement,
  createScopedValue: () => createScopedValue,
  descriptorChildren: () => descriptorChildren,
  enableNativeReadCollection: () => enableNativeReadCollection,
  enableServerSignalBindings: () => enableServerSignalBindings,
  encodeAsyncIdentityString: () => encodeAsyncIdentityString,
  endNativeReadScope: () => endNativeReadScope,
  escapeAttr: () => escapeAttr,
  escapeHtml: () => escapeHtml,
  finishNativeReadWitness: () => finishNativeReadWitness,
  flushSync: () => flushSync,
  getServerRenderResourceContext: () => getServerRenderResourceContext,
  getSsrSuspenseTimeout: () => getSsrSuspenseTimeout,
  hookSlots: () => hookSlots,
  injectStyle: () => injectStyle,
  invokeManualHook: () => invokeManualHook,
  isChildrenBlock: () => isChildrenBlock,
  isRenderCall: () => isRenderCall,
  isValidElement: () => isValidElement,
  lazy: () => lazy,
  manualHook: () => manualHook,
  mapSlot: () => mapSlot,
  markChildrenBlock: () => markChildrenBlock,
  markWarm: () => markWarm,
  memo: () => memo,
  namespaceHead: () => namespaceHead,
  namespaceHeadElement: () => namespaceHeadElement,
  nativeCreateScopedElement: () => nativeCreateScopedElement,
  nativeCreateScopedValue: () => nativeCreateScopedValue,
  nativeLocalHook: () => nativeLocalHook,
  nativePuMemo: () => nativePuMemo,
  nativeWarmMemo: () => nativeWarmMemo,
  normalizeClass: () => import_css.normalizeClass,
  positionalChildren: () => positionalChildren,
  preconnect: () => preconnect,
  prefetchDNS: () => prefetchDNS,
  preinit: () => preinit,
  preinitModule: () => preinitModule,
  preload: () => preload,
  preloadModule: () => preloadModule,
  prerender: () => prerender,
  prerenderToNodeStream: () => prerenderToNodeStream,
  puBatch: () => puBatch,
  puMemo: () => puMemo,
  readNativeDomProps: () => import_read_protocol.readNativeDomProps,
  readNativeDomStyle: () => import_read_protocol.readNativeDomStyle,
  renderHostedAttempt: () => renderHostedAttempt,
  renderToPipeableStream: () => renderToPipeableStream,
  renderToReadableStream: () => renderToReadableStream,
  renderToStaticMarkup: () => renderToStaticMarkup,
  renderToString: () => renderToString,
  replayNativeReadWitness: () => replayNativeReadWitness,
  requestFormReset: () => requestFormReset,
  setSsrSuspenseTimeout: () => setSsrSuspenseTimeout,
  ssrActivity: () => ssrActivity,
  ssrArm: () => ssrArm,
  ssrAttr: () => ssrAttr,
  ssrAttrs: () => ssrAttrs,
  ssrBindingBlock: () => ssrBindingBlock,
  ssrBindingChild: () => ssrBindingChild,
  ssrBindingClass: () => ssrBindingClass,
  ssrBindingHtml: () => ssrBindingHtml,
  ssrBindingKey: () => ssrBindingKey,
  ssrBlock: () => ssrBlock,
  ssrCheckedAttr: () => ssrCheckedAttr,
  ssrChild: () => ssrChild,
  ssrChildPre: () => ssrChildPre,
  ssrChildText: () => ssrChildText,
  ssrChildTextPre: () => ssrChildTextPre,
  ssrChildrenSources: () => ssrChildrenSources,
  ssrClass: () => ssrClass,
  ssrComponent: () => ssrComponent,
  ssrComponentNS: () => ssrComponentNS,
  ssrControl: () => ssrControl,
  ssrElement: () => ssrElement,
  ssrForBlock: () => ssrForBlock,
  ssrForItem: () => ssrForItem,
  ssrFormAuthoringDiagnostics: () => ssrFormAuthoringDiagnostics,
  ssrFragmentMarker: () => ssrFragmentMarker,
  ssrHeadEl: () => ssrHeadEl,
  ssrHtml: () => ssrHtml,
  ssrInNamespace: () => ssrInNamespace,
  ssrInnerHtml: () => ssrInnerHtml,
  ssrInputAttrs: () => ssrInputAttrs,
  ssrIsSuspense: () => ssrIsSuspense,
  ssrNestingText: () => ssrNestingText,
  ssrOption: () => ssrOption,
  ssrOptionValueSources: () => ssrOptionValueSources,
  ssrPortal: () => ssrPortal,
  ssrScriptInnerHtml: () => ssrScriptInnerHtml,
  ssrScriptResource: () => ssrScriptResource,
  ssrSelectAttrs: () => ssrSelectAttrs,
  ssrSelectScope: () => ssrSelectScope,
  ssrSelectScopeSources: () => ssrSelectScopeSources,
  ssrSignalControlAttrs: () => ssrSignalControlAttrs,
  ssrSignalControlValue: () => ssrSignalControlValue,
  ssrSignalValue: () => ssrSignalValue,
  ssrSnapshotSpread: () => ssrSnapshotSpread,
  ssrSpread: () => ssrSpread,
  ssrSpreadContent: () => ssrSpreadContent,
  ssrStyle: () => ssrStyle,
  ssrStyleResource: () => ssrStyleResource,
  ssrStylesheetResource: () => ssrStylesheetResource,
  ssrText: () => ssrText,
  ssrTextPre: () => ssrTextPre,
  ssrTextSlot: () => ssrTextSlot,
  ssrTextareaText: () => ssrTextareaText,
  ssrTextareaValue: () => ssrTextareaValue,
  ssrTextareaValueSources: () => ssrTextareaValueSources,
  ssrTry: () => ssrTry,
  ssrValueAttr: () => ssrValueAttr,
  ssrVoidContent: () => ssrVoidContent,
  startTransition: () => startTransition,
  styleMap: () => styleMap,
  touchStyleMap: () => touchStyleMap,
  trustHTML: () => import_trusted_html.trustHTML,
  use: () => use,
  useActionState: () => useActionState,
  useCallback: () => useCallback,
  useContext: () => useContext,
  useDebugValue: () => useDebugValue,
  useDeferredValue: () => useDeferredValue,
  useEffect: () => useEffect,
  useEffectEvent: () => useEffectEvent,
  useFormStatus: () => useFormStatus,
  useId: () => useId,
  useImperativeHandle: () => useImperativeHandle,
  useInsertionEffect: () => useInsertionEffect,
  useLayoutEffect: () => useLayoutEffect,
  useLinkedState: () => useLinkedState,
  useMemo: () => useMemo,
  useOptimistic: () => useOptimistic,
  useReducer: () => useReducer,
  useRef: () => useRef,
  useState: () => useState,
  useSyncExternalStore: () => useSyncExternalStore,
  useTransition: () => useTransition,
  validateNativeReadWitness: () => import_native_read_collector.validateNativeReadWitness,
  warmChild: () => warmChild,
  warmMemo: () => warmMemo,
  withSlot: () => withSlot
});
module.exports = __toCommonJS(runtime_server_exports);
var import_trusted_html = require("./trusted-html.cjs");
var import_read_protocol = require("./signals/read-protocol.cjs");
var import_hook_slot_cache = require("./hook-slot-cache.cjs");
var import_dom_binding_protocol = require("./dom-binding-protocol.cjs");
var import_hydration_markers = require("./hydration-markers.cjs");
var import_runtime_tags = require("./runtime-tags.cjs");
var import_constants = require("./constants.cjs");
var import_independent_hydration_protocol = require("./independent-hydration-protocol.cjs");
var import_has_own = require("./has-own.cjs");
var import_head_ownership = require("./head-ownership.cjs");
var import_resource_hint_diagnostics = require("./resource-hint-diagnostics.cjs");
var import_aria_diagnostics = require("./aria-diagnostics.cjs");
var import_host_property_diagnostics = require("./host-property-diagnostics.cjs");
var import_hydration_markers2 = require("./hydration-markers.cjs");
var import_early_signals = require("./server/early-signals.cjs");
var import_shared_value_helpers = require("./shared-value-helpers.cjs");
var import_css = require("./css.cjs");
var import_html_tree_validation = require("./html-tree-validation.cjs");
var import_sanitize_url = require("./sanitize-url.cjs");
var import_component_flags = require("./component-flags.cjs");
var import_error_codes_server_generated = require("./error-codes.server.generated.cjs");
var import_form_diagnostics = require("./form-diagnostics.cjs");
var import_renderer_bridge = require("./renderer-bridge.cjs");
var import_context_identity = require("./context-identity.cjs");
var import_native_read_collector = require("./signals/native-read-collector.cjs");
var import_native_read_server = require("./signals/native-read-server.cjs");
var import_native_read_seeds = require("./signals/native-read-seeds.cjs");
var import_owner_context = require("./signals/owner-context.cjs");
var import_query_attempt_observer = require("./signals/query-attempt-observer.cjs");
var import_types = require("./signals/types.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function isSignalHandle(value) {
  return (typeof value === "object" || typeof value === "function") && value !== null && value[import_types.SIGNAL_HANDLE] === true;
}
function readSignalBinding(handle) {
  if (RESOLVED !== null && !SERVER_SIGNAL_OWNER_ACTIVE) {
    return withServerSignalBinding(() => handle.get());
  }
  return handle.get();
}
function withServerSignalBinding(read) {
  ensureServerSignalOwner();
  const owner = serverSignalOwner(FRAME);
  const injection = RESOLVED.resourceOptions?.injection;
  return (0, import_owner_context.runWithSignalOwner)(
    owner,
    () => injection?.observeSignalAttempt === void 0 ? read() : (0, import_query_attempt_observer.runWithServerSignalQueryAttemptObserver)(
      owner,
      (attempt) => injection.observeSignalAttempt(attempt, (0, import_owner_context.captureSignalOwner)(owner)),
      injection.createSignalAttemptObservations,
      read
    )
  );
}
function isWritableSignal(value) {
  return isSignalHandle(value) && value.kind === "signal" && typeof value.set === "function";
}
function ssrSignalValue(value) {
  return isSignalHandle(value) ? readSignalBinding(value) : value;
}
const SSR_SIGNAL_CONTROL = /* @__PURE__ */ Symbol("octane.ssr-signal-control");
function isSsrSignalControlValue(value) {
  return typeof value === "object" && value !== null && value[SSR_SIGNAL_CONTROL] === true;
}
function unwrapSsrSignalControlValue(value) {
  return isSsrSignalControlValue(value) ? value.value : value;
}
function ssrSignalControlValue(value, site) {
  if (!isWritableSignal(value)) return ssrSignalValue(value);
  if (RESOLVED !== null && !SERVER_SIGNAL_OWNER_ACTIVE) {
    return withServerSignalBinding(() => serverSignalControlValue(value, site));
  }
  return serverSignalControlValue(value, site);
}
function serverSignalControlValue(value, site) {
  const owner = (0, import_owner_context.currentSignalOwner)();
  if (owner === null || !("documentOwner" in owner)) return value.get();
  if (RESOLVED !== null) RESOLVED.hasSignalControls = true;
  return {
    [SSR_SIGNAL_CONTROL]: true,
    value: value.get(),
    site,
    owner,
    binding: value[import_types.SIGNAL_BINDING_IDENTITY]()
  };
}
const NATIVE_ARRAY_MAP = Array.prototype.map;
const NATIVE_REFLECT_APPLY = Reflect.apply;
const NATIVE_ARRAY_SPECIES_GETTER = Object.getOwnPropertyDescriptor(Array, Symbol.species)?.get;
function mapSlot(receiver, method, callback) {
  if (arguments.length === 3) {
    let mapped = NATIVE_REFLECT_APPLY(method, receiver, [callback]);
    if (Array.isArray(mapped)) {
      let packed = null;
      for (let index = 0; index < mapped.length; index++) {
        if (!(index in mapped)) {
          packed = [];
          break;
        }
      }
      if (packed !== null) {
        for (let index = 0; index < mapped.length; index++) {
          if (index in mapped) packed.push(mapped[index]);
        }
        mapped = packed;
      }
    }
    return mapped;
  }
  if (!Array.isArray(receiver) || Object.getPrototypeOf(receiver) !== Array.prototype || method !== NATIVE_ARRAY_MAP || import_has_own.hasOwnProp.call(receiver, "constructor") || Object.getOwnPropertyDescriptor(Array.prototype, "constructor")?.value !== Array || Object.getOwnPropertyDescriptor(Array, Symbol.species)?.get !== NATIVE_ARRAY_SPECIES_GETTER) {
    return false;
  }
  for (let index = 0; index < receiver.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(receiver, index);
    if (descriptor === void 0 || descriptor.get !== void 0) return false;
  }
  return true;
}
const SVG_ONLY_LOWERCASE_TAGS = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Array.from(import_constants.SVG_ONLY_TAGS, (tag) => tag.toLowerCase())
);
let CURRENT_SCOPE = null;
let NATIVE_READ_COLLECTOR = null;
let NATIVE_SERVER_PASS = -1;
let NATIVE_SERVER_READS = null;
let NATIVE_SERVER_FAILURES = 0;
let NATIVE_LOCAL_HOOK_DISPOSES = null;
function enableNativeReadCollection(abi = 1) {
  if (abi !== 1) throw new Error((0, import_error_codes_server_generated.formatServerError)(58));
  ensureNativeServerReadCollector();
}
function beginNativeReadScope(scope, abi = 1) {
  if (abi !== 1) throw new Error((0, import_error_codes_server_generated.formatServerError)(58));
  const owner = scope ?? CURRENT_SCOPE;
  if (owner === null) return -1;
  ensureNativeServerReadCollector();
  return beginActiveNativeReadScope(owner);
}
function beginActiveNativeReadScope(owner) {
  const collector = NATIVE_READ_COLLECTOR;
  if (NATIVE_SERVER_PASS < 0 && !collector.isDetached()) NATIVE_SERVER_PASS = collector.beginPass();
  return collector.beginScope(owner);
}
function ensureNativeServerReadCollector() {
  return NATIVE_READ_COLLECTOR ??= (0, import_native_read_server.createNativeServerReadDriver)(
    (reads) => {
      NATIVE_SERVER_READS = (0, import_native_read_seeds.mergeNativeSeedReads)(NATIVE_SERVER_READS, reads);
    },
    () => {
      NATIVE_SERVER_FAILURES++;
    }
  );
}
function finishNativeSeedCapture(token, previous, merge) {
  if (token >= 0) return NATIVE_READ_COLLECTOR.finishCapture(token, merge);
  const reads = NATIVE_SERVER_READS;
  NATIVE_SERVER_READS = previous;
  if (merge && reads !== null) NATIVE_SERVER_READS = NATIVE_READ_COLLECTOR.merge(previous, reads);
  return reads;
}
function appendNativeSeedReads(reads) {
  if (reads !== null) NATIVE_READ_COLLECTOR.append(reads);
}
function endNativeReadScope(token, completed) {
  if (token >= 0) NATIVE_READ_COLLECTOR.endScope(token, completed);
}
function beginNativeReadWitness(detached = false) {
  return detached ? ensureNativeServerReadCollector().beginWitness(true) : NATIVE_READ_COLLECTOR?.beginWitness() ?? -1;
}
function finishNativeReadWitness(token, completed) {
  return token < 0 ? null : NATIVE_READ_COLLECTOR.finishWitness(token, completed);
}
function replayNativeReadWitness(witness) {
  NATIVE_READ_COLLECTOR?.replay(witness);
}
const ACTIVE_PU_WARM_PLANS = [];
let CURRENT_PU_WARM_CLAIMS = null;
let ID_COUNTER = 0;
let ID_PREFIX = "";
let SIGNAL_INSTANCE_PREFIX = "";
let SIGNAL_COMPONENT_INSTANCE_KEY = "";
let SERVER_SIGNAL_OWNER_ACTIVE = false;
let SIGNAL_CONTROL_SITE = "";
const EMPTY_SIGNAL_LIST_KEYS = [];
let SIGNAL_LIST_KEYS = null;
function newStyleCollector() {
  const collector = /* @__PURE__ */ new Map();
  collector.replay = null;
  return collector;
}
let CSS = null;
let REGISTERED_STYLES;
let NONCE_ATTR = "";
let MARKERS = true;
let PERMANENT_STATIC_HYDRATE_DEPTH = 0;
function headHtmlWithSheets(buf) {
  let out = buf.charset + buf.viewport + buf.html;
  if (buf.hintHtml !== null) for (const tag of buf.hintHtml.values()) out += tag;
  if (buf.sheets !== null && buf.sheets.size > 0) {
    const groups = /* @__PURE__ */ new Map();
    for (const entry of buf.sheets.values())
      groups.set(entry.precedence, (groups.get(entry.precedence) ?? "") + entry.html);
    for (const group of groups.values()) out += group;
  }
  return out;
}
let HEAD = null;
let FALLBACK_HOIST_DEPTH = 0;
let SUSPENDED = null;
let RESOLVED = null;
let SERIAL = null;
let FRAME = null;
let DEFERRED = null;
let CURRENT_COMP = null;
let CURRENT_PROPS = null;
let CURRENT_PARENT_SCOPE = null;
let ASYNC_SCOPE = "";
let CURRENT_SSR_ELEMENT = null;
let SSR_NESTING_WARNINGS = null;
let DEV_SSR_ATTRIBUTE_WARNINGS = null;
let DEV_SSR_CUSTOM_HOST_DEPTH = 0;
function framePath(f) {
  if (f.path !== null) return f.path;
  const p = f.parent === null ? "" : framePath(f.parent) + "/" + f.seg;
  f.path = p;
  return p;
}
function asyncFramePath(frame) {
  return (frame === null ? "" : framePath(frame)) + ASYNC_SCOPE;
}
const SCOPED_COUNTS_ARRAY_LIMIT = 8;
function nextScopedCount(frame, slot, key) {
  let counts = frame[slot];
  if (counts === null) {
    frame[slot] = [key, 1];
    return 0;
  }
  if (!Array.isArray(counts)) {
    const next = counts.get(key) ?? 0;
    counts.set(key, next + 1);
    return next;
  }
  for (let i = 0; i < counts.length; i += 2) {
    if (counts[i] === key) {
      const next = counts[i + 1];
      counts[i + 1] = next + 1;
      return next;
    }
  }
  if (counts.length === SCOPED_COUNTS_ARRAY_LIMIT * 2) {
    const promoted = /* @__PURE__ */ new Map();
    for (let i = 0; i < counts.length; i += 2) {
      promoted.set(counts[i], counts[i + 1]);
    }
    promoted.set(key, 1);
    frame[slot] = promoted;
    return 0;
  }
  counts.push(key, 1);
  return 0;
}
function scopeSuffix(frame) {
  const scope = ASYNC_SCOPE;
  if (__octaneDev && !scope.startsWith(frame.asyncScope)) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(65));
  }
  return scope.slice(frame.asyncScope.length);
}
function nextFrameOccurrence(frame, base) {
  const scopedBase = ASYNC_SCOPE === frame.asyncScope ? base : scopeSuffix(frame) + "\0" + base;
  return nextScopedCount(frame, "occ", scopedBase);
}
function nextChildSegment(frame) {
  if (ASYNC_SCOPE === frame.asyncScope) return frame.nextChild++;
  return nextScopedCount(frame, "scopedChildren", scopeSuffix(frame));
}
function ssrScope(parent) {
  return { parent, $$ctxValues: null };
}
function parserNamespacesForTag(tag, inherited) {
  const semanticTag = tag.toLowerCase();
  const namespace = semanticTag === "svg" ? "svg" : semanticTag === "math" ? "mathml" : inherited === "html" && SVG_ONLY_LOWERCASE_TAGS.has(semanticTag) ? "svg" : inherited;
  const childrenNamespace = semanticTag === "foreignobject" ? "html" : semanticTag === "svg" ? "svg" : semanticTag === "math" ? "mathml" : inherited === "html" && SVG_ONLY_LOWERCASE_TAGS.has(semanticTag) ? "svg" : inherited;
  return { namespace, childrenNamespace };
}
function ssrElementNamespaces(tag, parent) {
  return parserNamespacesForTag(tag, parent?.childrenNamespace ?? FRAME?.namespace ?? "html");
}
function reportInvalidHtmlNesting(message) {
  const warning = "Octane SSR invalid HTML nesting: " + message + "\n\nThe browser will repair this HTML before hydration. This can shift content and cause a hydration mismatch.";
  let seen = SSR_NESTING_WARNINGS;
  if (seen === null) return;
  if (seen === void 0) {
    seen = /* @__PURE__ */ new Set();
    SSR_NESTING_WARNINGS = seen;
    if (RESOLVED !== null) RESOLVED.nestingWarnings = seen;
  }
  if (seen.has(warning)) return;
  seen.add(warning);
  console.error(warning);
}
function withSsrElementContext(tag, location, render, forcedNamespace, htmlIntegrationPoint) {
  const parent = CURRENT_SSR_ELEMENT;
  const { namespace, childrenNamespace: inheritedChildrenNamespace } = forcedNamespace === void 0 ? ssrElementNamespaces(tag, parent) : { namespace: forcedNamespace, childrenNamespace: forcedNamespace };
  const childrenNamespace = htmlIntegrationPoint === true ? "html" : inheritedChildrenNamespace;
  const semanticTag = tag.toLowerCase();
  const element = {
    tag: semanticTag,
    parent,
    namespace,
    childrenNamespace,
    location
  };
  if (__octaneDev && SSR_NESTING_WARNINGS !== null && namespace === "html" && parent?.namespace === "html") {
    const parentMessage = (0, import_html_tree_validation.invalidHtmlNestingWithParent)(
      semanticTag,
      parent.tag,
      location,
      parent.location
    );
    if (parentMessage !== null) reportInvalidHtmlNesting(parentMessage);
    let ancestor = parent.parent;
    const ancestors = [parent.tag];
    while (ancestor !== null && ancestor.namespace === "html") {
      ancestors.push(ancestor.tag);
      const ancestorMessage = (0, import_html_tree_validation.invalidHtmlNestingWithAncestor)(
        semanticTag,
        ancestors,
        location,
        ancestor.location
      );
      if (ancestorMessage !== null) reportInvalidHtmlNesting(ancestorMessage);
      ancestor = ancestor.parent;
    }
  }
  CURRENT_SSR_ELEMENT = element;
  try {
    return render();
  } finally {
    CURRENT_SSR_ELEMENT = parent;
  }
}
function ssrElement(tag, location, render, htmlIntegrationPoint) {
  if (!__octaneDev || SSR_NESTING_WARNINGS === null) return render();
  return withSsrElementContext(tag, location, render, void 0, htmlIntegrationPoint);
}
function ssrNestingText(value) {
  const text = ssrText(value);
  if (__octaneDev && text !== "") {
    const parent = CURRENT_SSR_ELEMENT;
    if (parent !== null && parent.namespace === "html" && SSR_NESTING_WARNINGS !== null) {
      const message = (0, import_html_tree_validation.invalidHtmlTextNesting)(text, parent.tag, parent.location);
      if (message !== null) reportInvalidHtmlNesting(message);
    }
  }
  return text;
}
const NOOP = () => {
};
const Fragment = import_runtime_tags.FRAGMENT_TAG;
const Activity = import_runtime_tags.ACTIVITY_TAG;
const SCOPED_ELEMENT_PROPS = /* @__PURE__ */ new WeakSet();
const SCOPED_CHILDREN_RESOLVER = /* @__PURE__ */ Symbol("octane.scopedChildrenResolver");
const SCOPED_VALUE_RESOLVER = /* @__PURE__ */ Symbol("octane.scopedValueResolver");
function getScopedChildren() {
  return this[SCOPED_CHILDREN_RESOLVER]();
}
const SCOPED_CHILDREN_PROPERTY = { configurable: true, enumerable: true, get: getScopedChildren };
function setScopedChildrenResolver(target, resolve) {
  Object.defineProperty(target, SCOPED_CHILDREN_RESOLVER, { value: resolve });
}
const SCOPED_VALUE_PROPERTIES = {
  type: {
    configurable: true,
    enumerable: true,
    get() {
      return this[SCOPED_VALUE_RESOLVER]().type;
    }
  },
  props: {
    configurable: true,
    enumerable: true,
    get() {
      return this[SCOPED_VALUE_RESOLVER]().props;
    }
  },
  key: {
    configurable: true,
    enumerable: true,
    get() {
      return this[SCOPED_VALUE_RESOLVER]().key;
    }
  },
  ref: {
    configurable: true,
    enumerable: true,
    get() {
      return this[SCOPED_VALUE_RESOLVER]().ref;
    }
  },
  children: {
    configurable: true,
    enumerable: true,
    get() {
      return this[SCOPED_VALUE_RESOLVER]().children;
    }
  },
  __octaneInvocationSite: {
    configurable: true,
    enumerable: false,
    get() {
      return this[SCOPED_VALUE_RESOLVER]().__octaneInvocationSite;
    }
  }
};
function restoreWritableScopedChildren(props, name, value) {
  const inherited = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(props), name);
  if (inherited?.get === void 0 && inherited?.set === void 0) return false;
  Object.defineProperty(props, "children", {
    configurable: true,
    enumerable: true,
    writable: true,
    value
  });
  return true;
}
function copyScopedElementConfig(type, config) {
  if (config != null && import_has_own.hasOwnProp.call(config, "__proto__") || import_has_own.hasOwnProp.call(Object.prototype, "children")) {
    const props2 = copyElementConfig(config);
    (0, import_shared_value_helpers.applyElementDefaultProps)(type, props2);
    Object.defineProperty(props2, "children", SCOPED_CHILDREN_PROPERTY);
    return props2;
  }
  const props = {};
  let copiedChildren;
  let hasChildren = false;
  let childrenAreWritable = false;
  if (config != null) {
    for (const name in config) {
      if (name === "key" || !import_has_own.hasOwnProp.call(config, name)) continue;
      if (name === "children") {
        copiedChildren = config[name];
        Object.defineProperty(props, "children", SCOPED_CHILDREN_PROPERTY);
        hasChildren = true;
      } else {
        const value = config[name];
        if (hasChildren && !childrenAreWritable && !import_has_own.hasOwnProp.call(props, name) && restoreWritableScopedChildren(props, name, copiedChildren)) {
          childrenAreWritable = true;
        }
        props[name] = value;
      }
    }
  }
  const defaults = type?.defaultProps;
  if (defaults != null) {
    for (const name in defaults) {
      if (name === "children") {
        if ((childrenAreWritable ? props.children : hasChildren ? copiedChildren : props.children) === void 0) {
          const defaultChildren = defaults[name];
          copiedChildren = defaultChildren;
          if (childrenAreWritable) {
            props.children = defaultChildren;
          } else if (!hasChildren) {
            if (Object.getPrototypeOf(props) !== Object.prototype || Object.getOwnPropertyDescriptor(Object.prototype, "children") !== void 0) {
              props.children = defaultChildren;
            } else {
              Object.defineProperty(props, "children", SCOPED_CHILDREN_PROPERTY);
              hasChildren = true;
            }
          }
        }
      } else {
        if (hasChildren && !childrenAreWritable && !import_has_own.hasOwnProp.call(props, name) && restoreWritableScopedChildren(props, name, copiedChildren)) {
          childrenAreWritable = true;
        }
        if (props[name] === void 0) props[name] = defaults[name];
      }
    }
  }
  if (childrenAreWritable || !hasChildren)
    Object.defineProperty(props, "children", SCOPED_CHILDREN_PROPERTY);
  return props;
}
function hasElementConfigKey(config) {
  if (config == null || typeof config !== "object" && typeof config !== "function") return false;
  if (import_has_own.hasOwnProp.call(config, "key")) {
    const own = Object.getOwnPropertyDescriptor(config, "key");
    if (own?.get != null && own.get.isReactWarning) return false;
  }
  return config.key !== void 0;
}
function copyElementConfig(config) {
  const props = {};
  if (config == null) return props;
  for (const name in config) {
    if (name !== "key" && import_has_own.hasOwnProp.call(config, name)) {
      props[name] = config[name];
    }
  }
  return props;
}
function finalizeElementDescriptor(descriptor) {
  if (__octaneDev) {
    Object.freeze(descriptor.props);
    Object.freeze(descriptor);
  }
  return descriptor;
}
function createNativeServerScopedResolver(read) {
  let resolved = false;
  let resolvedScope = null;
  let resolvedWitness;
  let resolvedValue;
  return () => {
    const scope = CURRENT_SCOPE;
    const token = beginNativeReadScope(void 0);
    let completed = false;
    try {
      if (!resolved || resolvedScope !== scope || token >= 0 && resolvedWitness === void 0 || !(0, import_native_read_collector.validateNativeReadWitness)(resolvedWitness)) {
        const witnessToken = beginNativeReadWitness();
        let readCompleted = false;
        let next;
        let nextWitness;
        try {
          next = read();
          readCompleted = true;
        } finally {
          nextWitness = finishNativeReadWitness(witnessToken, readCompleted);
        }
        resolvedScope = scope;
        resolvedWitness = token < 0 ? void 0 : nextWitness;
        resolvedValue = next;
        resolved = true;
      } else if (token >= 0) {
        replayNativeReadWitness(resolvedWitness);
      }
      completed = true;
      return resolvedValue;
    } finally {
      endNativeReadScope(token, completed);
    }
  };
}
function createScopedValue(readElement) {
  let resolved;
  let resolvedScope = null;
  const resolve = () => {
    const scope = CURRENT_SCOPE;
    if (resolved === void 0 || resolvedScope !== scope) {
      const next = readElement();
      resolvedScope = scope;
      resolved = next;
    }
    return resolved;
  };
  return scopedValueDescriptor(resolve);
}
function isRenderCall(scope) {
  return scope === CURRENT_SCOPE && scope !== null;
}
function nativeCreateScopedValue(readElement) {
  return scopedValueDescriptor(createNativeServerScopedResolver(readElement));
}
function scopedValueDescriptor(resolve) {
  const descriptor = { $$kind: import_runtime_tags.ELEMENT_TAG };
  Object.defineProperty(descriptor, SCOPED_VALUE_RESOLVER, { value: resolve });
  Object.defineProperty(descriptor, "type", SCOPED_VALUE_PROPERTIES.type);
  Object.defineProperty(descriptor, "props", SCOPED_VALUE_PROPERTIES.props);
  Object.defineProperty(descriptor, "key", SCOPED_VALUE_PROPERTIES.key);
  Object.defineProperty(descriptor, "ref", SCOPED_VALUE_PROPERTIES.ref);
  Object.defineProperty(descriptor, "children", SCOPED_VALUE_PROPERTIES.children);
  Object.defineProperty(
    descriptor,
    "__octaneInvocationSite",
    SCOPED_VALUE_PROPERTIES.__octaneInvocationSite
  );
  if (__octaneDev) Object.freeze(descriptor);
  return descriptor;
}
function createScopedElement(type, props, readChildren, invocationSite) {
  const src = props ?? null;
  const key = hasElementConfigKey(src) ? "" + src.key : null;
  const copiedProps = copyScopedElementConfig(type, src);
  let resolved = false;
  let resolvedScope = null;
  let resolvedChildren;
  const children = () => {
    const scope = CURRENT_SCOPE;
    if (!resolved || resolvedScope !== scope) {
      const nextChildren = readChildren();
      resolvedScope = scope;
      resolvedChildren = nextChildren;
      resolved = true;
    }
    return resolvedChildren;
  };
  return scopedElementDescriptor(type, copiedProps, key, children, invocationSite);
}
function nativeCreateScopedElement(type, props, readChildren, invocationSite) {
  const src = props ?? null;
  const key = hasElementConfigKey(src) ? "" + src.key : null;
  const copiedProps = copyScopedElementConfig(type, src);
  return scopedElementDescriptor(
    type,
    copiedProps,
    key,
    createNativeServerScopedResolver(readChildren),
    invocationSite
  );
}
function scopedElementDescriptor(type, copiedProps, key, children, invocationSite) {
  setScopedChildrenResolver(copiedProps, children);
  SCOPED_ELEMENT_PROPS.add(copiedProps);
  const descriptor = {
    $$kind: import_runtime_tags.ELEMENT_TAG,
    type,
    props: copiedProps,
    key,
    ref: copiedProps.ref !== void 0 ? copiedProps.ref : null
  };
  if (invocationSite !== void 0) descriptor.__octaneInvocationSite = invocationSite;
  Object.defineProperty(descriptor, "children", SCOPED_CHILDREN_PROPERTY);
  setScopedChildrenResolver(descriptor, children);
  return finalizeElementDescriptor(descriptor);
}
function createElement(type, props, ...children) {
  return createElementFromConfig(void 0, type, props, children);
}
function createElementAt(invocationSite, type, props, ...children) {
  return createElementFromConfig(invocationSite, type, props, children);
}
function createElementFromConfig(invocationSite, type, props, children) {
  if (typeof type === "function" && (0, import_renderer_bridge.isRendererContext)(type)) {
    (0, import_renderer_bridge.registerServerRendererContextProvider)(renderServerContextProvider);
  }
  const src = props ?? null;
  const key = hasElementConfigKey(src) ? "" + src.key : null;
  const hasPositional = children !== void 0 && children.length > 0;
  let kids = hasPositional ? children.length === 1 ? children[0] : children : src?.children;
  if (children !== void 0 && children.length > 1) {
    POSITIONAL_CHILDREN.add(children);
    if (__octaneDev) Object.freeze(children);
  }
  const p = copyElementConfig(src);
  if (hasPositional) p.children = kids;
  (0, import_shared_value_helpers.applyElementDefaultProps)(type, p);
  kids = p.children;
  const descriptor = {
    $$kind: import_runtime_tags.ELEMENT_TAG,
    type,
    props: p,
    key,
    ref: p.ref !== void 0 ? p.ref : null,
    children: kids ?? null
  };
  if (invocationSite !== void 0) descriptor.__octaneInvocationSite = invocationSite;
  return finalizeElementDescriptor(descriptor);
}
const POSITIONAL_CHILDREN = /* @__PURE__ */ new WeakSet();
function positionalChildren(children) {
  POSITIONAL_CHILDREN.add(children);
  return children;
}
function isElementDescriptor(v) {
  return v != null && v.$$kind === import_runtime_tags.ELEMENT_TAG;
}
function isFragmentDescriptor(value) {
  return isElementDescriptor(value) && value.type === Fragment;
}
function fragmentDescriptorChildren(value) {
  const children = value.children;
  if (children == null) return [];
  return Array.isArray(children) ? children : [children];
}
function fragmentRefDescriptor(value) {
  return {
    $$kind: import_runtime_tags.ELEMENT_TAG,
    type: renderFragmentRefDescriptor,
    props: value,
    key: value.key,
    ref: null,
    children: null
  };
}
function renderFragmentRefDescriptor(descriptor, scope) {
  return ssrHtml(
    ssrFragmentMarker(true, descriptor.ref) + ssrChild(descriptor.children, scope) + ssrFragmentMarker(false)
  );
}
function ssrDeoptWrapperKind(value) {
  return POSITIONAL_CHILDREN.has(value) ? "fragment" : "array";
}
function ssrDeoptKey(item, index) {
  return isElementDescriptor(item) && item.key != null ? item.key : index;
}
function scopedSsrDeoptKey(path, item, index, key) {
  const explicit = isElementDescriptor(item) && item.key != null;
  if (path.length === 0) return explicit ? "k" + String(key) : index;
  return JSON.stringify([path, explicit ? "key" : "index", explicit ? String(key) : index]);
}
const SSR_DEOPT_KEY_STRINGIFY = JSON.stringify;
function nestedImplicitSsrKeyPrefix(path) {
  if (JSON.stringify !== SSR_DEOPT_KEY_STRINGIFY || "toJSON" in path) return null;
  for (let i = 0; i < path.length; i++) {
    const type = typeof path[i];
    if (type !== "string" && type !== "number") return null;
  }
  return "[" + JSON.stringify(path) + ',"index",';
}
function appendNestedSsrDeoptKey(outKeys, path, item, index, key, implicitPrefix) {
  const explicit = isElementDescriptor(item) && item.key != null;
  if (!explicit) {
    if (implicitPrefix === void 0) implicitPrefix = nestedImplicitSsrKeyPrefix(path);
    if (implicitPrefix !== null && JSON.stringify === SSR_DEOPT_KEY_STRINGIFY && !("toJSON" in path)) {
      outKeys.push(implicitPrefix + index + "]");
      return implicitPrefix;
    }
  }
  outKeys.push(JSON.stringify([path, explicit ? "key" : "index", explicit ? String(key) : index]));
  return implicitPrefix;
}
function flattenSsrChildContainer(outItems, outKeys, children, kind, path) {
  const count = children.length;
  let implicitPrefix;
  for (let i = 0; i < count; i++) {
    const item = children[i];
    if (isFragmentDescriptor(item)) {
      if (item.ref != null || import_has_own.hasOwnProp.call(item.props, "ref")) {
        outItems.push(fragmentRefDescriptor(item));
        if (path.length === 0 || count === 1) {
          outKeys.push(scopedSsrDeoptKey(path, item, i, ssrDeoptKey(item, i)));
        } else {
          implicitPrefix = appendNestedSsrDeoptKey(
            outKeys,
            path,
            item,
            i,
            ssrDeoptKey(item, i),
            implicitPrefix
          );
        }
        continue;
      }
      const nested = fragmentDescriptorChildren(item);
      if (item.key != null) {
        flattenSsrChildContainer(outItems, outKeys, nested, "fragment", [
          ...path,
          "keyed-fragment",
          item.key
        ]);
      } else {
        const nestedPath = kind === "fragment" ? [...path, "wrapper", count === 1 ? 0 : i] : count === 1 ? path : [...path, "position", i, "fragment"];
        flattenSsrChildContainer(outItems, outKeys, nested, "fragment", nestedPath);
      }
      continue;
    }
    if (Array.isArray(item)) {
      const nestedKind = ssrDeoptWrapperKind(item);
      const nestedPath = nestedKind === kind ? [...path, "wrapper", count === 1 ? 0 : i] : count === 1 ? path : [...path, "position", i, nestedKind];
      flattenSsrChildContainer(outItems, outKeys, item, nestedKind, nestedPath);
      continue;
    }
    outItems.push(item);
    if (path.length === 0 || count === 1) {
      outKeys.push(scopedSsrDeoptKey(path, item, i, ssrDeoptKey(item, i)));
    } else {
      implicitPrefix = appendNestedSsrDeoptKey(
        outKeys,
        path,
        item,
        i,
        ssrDeoptKey(item, i),
        implicitPrefix
      );
    }
  }
}
function prepareSsrDeoptList(value, includeKeyedSingle) {
  if (isFragmentDescriptor(value)) {
    if (value.ref != null || import_has_own.hasOwnProp.call(value.props, "ref")) {
      return {
        items: [fragmentRefDescriptor(value)],
        keys: [scopedSsrDeoptKey([], value, 0, value.key ?? 0)]
      };
    }
    const items = [];
    const keys = [];
    const path = value.key == null ? [] : ["keyed-fragment", value.key];
    flattenSsrChildContainer(items, keys, fragmentDescriptorChildren(value), "fragment", path);
    return { items, keys };
  }
  if (Array.isArray(value)) {
    const items = [];
    const keys = [];
    flattenSsrChildContainer(items, keys, value, ssrDeoptWrapperKind(value), []);
    return { items, keys };
  }
  if (includeKeyedSingle && isElementDescriptor(value) && value.key != null) {
    return { items: [value], keys: [scopedSsrDeoptKey([], value, 0, value.key)] };
  }
  return null;
}
function isValidElement(v) {
  return isElementDescriptor(v);
}
function cloneElement(element, config, ...children) {
  if (!isElementDescriptor(element)) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(4));
  }
  let scopedChildren;
  let scopedResolver;
  let props;
  if (SCOPED_ELEMENT_PROPS.has(element.props)) {
    scopedChildren = Object.getOwnPropertyDescriptor(element, "children").get;
    if (scopedChildren === getScopedChildren) {
      scopedResolver = element[SCOPED_CHILDREN_RESOLVER];
    } else if (scopedChildren === SCOPED_VALUE_PROPERTIES.children.get) {
      const get = scopedChildren;
      scopedChildren = () => get.call(element);
    }
    props = {};
    for (const name in element.props) {
      if (name !== "key" && name !== "children" && import_has_own.hasOwnProp.call(element.props, name)) {
        props[name] = element.props[name];
      }
    }
  } else {
    props = copyElementConfig(element.props);
  }
  let key = element.key;
  let replacedChildren = false;
  if (config != null) {
    if (hasElementConfigKey(config)) key = "" + config.key;
    for (const name in config) {
      if (name === "key") continue;
      if (name === "ref" && config.ref === void 0) continue;
      if (import_has_own.hasOwnProp.call(config, name)) {
        props[name] = config[name];
        if (name === "children") replacedChildren = true;
      }
    }
  }
  const n = children.length;
  let kids;
  let preserveScopedChildren = false;
  if (n === 1) {
    kids = children[0];
  } else if (n > 1) {
    kids = children;
  } else if (scopedChildren !== void 0 && !replacedChildren) {
    Object.defineProperty(
      props,
      "children",
      scopedResolver === void 0 ? { configurable: true, enumerable: true, get: scopedChildren } : SCOPED_CHILDREN_PROPERTY
    );
    if (scopedResolver !== void 0) setScopedChildrenResolver(props, scopedResolver);
    SCOPED_ELEMENT_PROPS.add(props);
    preserveScopedChildren = true;
    kids = null;
  } else {
    kids = "children" in props ? props.children : element.children;
  }
  if (n > 0) props.children = kids;
  let descriptor;
  if (preserveScopedChildren) {
    descriptor = {
      $$kind: import_runtime_tags.ELEMENT_TAG,
      type: element.type,
      props,
      key,
      ref: props.ref !== void 0 ? props.ref : null
    };
    Object.defineProperty(
      descriptor,
      "children",
      scopedResolver === void 0 ? { configurable: true, enumerable: true, get: scopedChildren } : SCOPED_CHILDREN_PROPERTY
    );
    if (scopedResolver !== void 0) setScopedChildrenResolver(descriptor, scopedResolver);
  } else {
    descriptor = {
      $$kind: import_runtime_tags.ELEMENT_TAG,
      type: element.type,
      props,
      key,
      ref: props.ref !== void 0 ? props.ref : null,
      children: kids ?? null
    };
  }
  if (element.__octaneInvocationSite !== void 0)
    descriptor.__octaneInvocationSite = element.__octaneInvocationSite;
  return finalizeElementDescriptor(descriptor);
}
function cloneAndReplaceElementKey(element, key) {
  const scopedChildren = SCOPED_ELEMENT_PROPS.has(element.props);
  let descriptor;
  if (scopedChildren) {
    const get = Object.getOwnPropertyDescriptor(element, "children").get;
    const copiedGetter = get === SCOPED_VALUE_PROPERTIES.children.get ? () => get.call(element) : get;
    descriptor = {
      $$kind: import_runtime_tags.ELEMENT_TAG,
      type: element.type,
      props: element.props,
      key,
      ref: element.ref
    };
    Object.defineProperty(
      descriptor,
      "children",
      get === getScopedChildren ? SCOPED_CHILDREN_PROPERTY : { configurable: true, enumerable: true, get: copiedGetter }
    );
    if (get === getScopedChildren) {
      setScopedChildrenResolver(
        descriptor,
        element[SCOPED_CHILDREN_RESOLVER]
      );
    }
  } else {
    descriptor = {
      $$kind: import_runtime_tags.ELEMENT_TAG,
      type: element.type,
      props: element.props,
      key,
      ref: element.ref,
      children: element.children
    };
  }
  return finalizeElementDescriptor(descriptor);
}
function iterableChildArray(value) {
  if (value == null || typeof value === "string" || Array.isArray(value) || isElementDescriptor(value))
    return null;
  const iterator = (0, import_shared_value_helpers.childrenIterator)(value);
  if (iterator === null) return null;
  const out = [];
  const cursor = iterator.call(value);
  let step;
  while (!(step = cursor.next()).done) out.push(step.value);
  return out;
}
function resolveChildrenThenable(thenable) {
  if (FRAME !== null) return use(thenable);
  if (thenable.status === void 0) {
    thenable.status = "pending";
    thenable.then(
      (value) => {
        if (thenable.status === "pending") {
          thenable.status = "fulfilled";
          thenable.value = value;
        }
      },
      (reason) => {
        if (thenable.status === "pending") {
          thenable.status = "rejected";
          thenable.reason = reason;
        }
      }
    );
  }
  if (thenable.status === "fulfilled") return thenable.value;
  if (thenable.status === "rejected") throw thenable.reason;
  throw thenable;
}
function describeObjectForError(value) {
  let rendered;
  try {
    rendered = String(value);
  } catch {
    return "object with keys {" + Object.keys(value).join(", ") + "}";
  }
  return rendered === "[object Object]" ? "object with keys {" + Object.keys(value).join(", ") + "}" : rendered;
}
function invalidChildError(child) {
  const found = describeObjectForError(child);
  return new Error((0, import_error_codes_server_generated.formatServerError)(3, found));
}
function mapIntoChildren(children, out, escapedPrefix, nameSoFar, callback) {
  let type = typeof children;
  if (type === "undefined" || type === "boolean") {
    children = null;
    type = "object";
  }
  const isLeaf = children === null || type === "string" || type === "number" || type === "bigint" || isElementDescriptor(children) || children != null && children.$$kind === import_runtime_tags.PORTAL_TAG;
  if (isLeaf) {
    const child = children;
    let mapped = callback(child);
    const childKey = nameSoFar === "" ? "." + (0, import_shared_value_helpers.childElementKey)(child, 0) : nameSoFar;
    if (Array.isArray(mapped)) {
      mapIntoChildren(mapped, out, (0, import_shared_value_helpers.escapeMappedElementKey)(childKey) + "/", "", (value) => value);
    } else if (mapped != null) {
      if (isElementDescriptor(mapped)) {
        const mappedKey = mapped.key;
        mapped = cloneAndReplaceElementKey(
          mapped,
          escapedPrefix + (mappedKey != null && (!child || child.key !== mappedKey) ? (0, import_shared_value_helpers.escapeMappedElementKey)("" + mappedKey) + "/" : "") + childKey
        );
      }
      out.push(mapped);
    }
    return 1;
  }
  let count = 0;
  const nextPrefix = nameSoFar === "" ? "." : nameSoFar + ":";
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      count += mapIntoChildren(
        child,
        out,
        escapedPrefix,
        nextPrefix + (0, import_shared_value_helpers.childElementKey)(child, i),
        callback
      );
    }
    return count;
  }
  const iterator = (0, import_shared_value_helpers.childrenIterator)(children);
  if (iterator !== null) {
    const cursor = iterator.call(children);
    let step;
    let i = 0;
    while (!(step = cursor.next()).done) {
      const child = step.value;
      count += mapIntoChildren(
        child,
        out,
        escapedPrefix,
        nextPrefix + (0, import_shared_value_helpers.childElementKey)(child, i++),
        callback
      );
    }
    return count;
  }
  if (type === "object") {
    if (typeof children.then === "function") {
      return mapIntoChildren(
        resolveChildrenThenable(children),
        out,
        escapedPrefix,
        nameSoFar,
        callback
      );
    }
    throw invalidChildError(children);
  }
  return 0;
}
const Children = {
  forEach(children, fn, context) {
    if (children == null) return;
    let index = 0;
    mapIntoChildren(children, [], "", "", (child) => {
      fn.call(context, child, index++);
      return null;
    });
  },
  map(children, fn, context) {
    if (children == null) return children;
    const out = [];
    let index = 0;
    mapIntoChildren(children, out, "", "", (child) => fn.call(context, child, index++));
    return out;
  },
  count(children) {
    if (children == null) return 0;
    return mapIntoChildren(children, [], "", "", () => null);
  },
  toArray(children) {
    const out = [];
    if (children != null) mapIntoChildren(children, out, "", "", (child) => child);
    return out;
  },
  only(children) {
    if (!isElementDescriptor(children)) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(2));
    }
    return children;
  }
};
function createPortal(body, target, props = void 0) {
  const key = typeof props === "string" || typeof props === "number" ? String(props) : null;
  return { $$kind: import_runtime_tags.PORTAL_TAG, body, target, key, props: key === null ? props : void 0 };
}
const HTML_ESCAPE_RE = /[&<>]/;
const SERVER_HTML = /* @__PURE__ */ Symbol.for("octane.serverHtml");
class ServerHtml {
  [SERVER_HTML];
  constructor(html) {
    this[SERVER_HTML] = html;
  }
  toString() {
    return this[SERVER_HTML];
  }
}
class RawServerHtml {
  constructor(html) {
    this.html = html;
  }
  html;
  get [SERVER_HTML]() {
    VT_SSR_HAS_RAW_HTML = true;
    return this.html;
  }
  toString() {
    return this[SERVER_HTML];
  }
}
function ssrHtml(html) {
  if (typeof html !== "string") return html;
  if (!VT_SSR_HAS_RAW_HTML) return new ServerHtml(html);
  if (CURRENT_SCOPE === null) VT_SSR_HAS_RAW_HTML = false;
  return new RawServerHtml(html);
}
const BINDING_HTML_ROOT = /* @__PURE__ */ Symbol.for("octane.binding.html");
function ssrBindingHtml(html, id) {
  const output = new ServerHtml(html);
  output[BINDING_HTML_ROOT] = (0, import_dom_binding_protocol.bindingRootMarker)(id);
  return output;
}
function bindPresentationView(view, _id) {
  return (0, import_component_flags.markComponentFlags)(view, import_component_flags.COMPONENT_FLAG_BOUNDARY, view.name);
}
function serverComponentOutput(out, scope) {
  if (out == null) return "";
  if (typeof out === "string") return escapeHtml(out);
  if (typeof out === "object" && SERVER_HTML in out) return out[SERVER_HTML];
  return ssrChild(out, scope);
}
function escapeHtml(v) {
  const s = typeof v === "string" ? v : String(v);
  const needsEscape = s.length < 32 ? HTML_ESCAPE_RE.test(s) : s.indexOf("&") !== -1 || s.indexOf("<") !== -1 || s.indexOf(">") !== -1;
  if (!needsEscape) return s;
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
const ATTR_ESCAPE_RE = /[&"]/;
function escapeAttr(v) {
  const s = typeof v === "string" ? v : String(v);
  if (!ATTR_ESCAPE_RE.test(s)) return s;
  return s.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}
let DANGER_HTML_CHILD_PROBE = 0;
function probingDangerHtmlChild(value) {
  if (DANGER_HTML_CHILD_PROBE === 0) return false;
  if (value !== null && value !== void 0) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(5));
  }
  return true;
}
function ssrText(v) {
  if (probingDangerHtmlChild(v)) return "";
  if (v == null || v === false) return "";
  return escapeHtml(v);
}
function ssrTextSlot(text) {
  return text === "" ? import_constants.EMPTY_COMMENT : text;
}
function ssrTextPre(v) {
  const s = ssrText(v);
  return s.charCodeAt(0) === 10 ? "\n" + s : s;
}
function ssrComponentDescriptor(d, scope) {
  if (SCOPED_ELEMENT_PROPS.has(d.props)) {
    return ssrComponent(
      scope,
      d.type,
      d.props,
      void 0,
      d.key ?? void 0,
      void 0,
      d.__octaneInvocationSite
    );
  }
  const children = d.children;
  if (children == null || children === d.props?.children) {
    return ssrComponent(
      scope,
      d.type,
      d.props,
      void 0,
      d.key ?? void 0,
      void 0,
      d.__octaneInvocationSite
    );
  }
  return ssrComponent(
    scope,
    d.type,
    { ...d.props, children },
    void 0,
    d.key ?? void 0,
    void 0,
    d.__octaneInvocationSite
  );
}
function ssrChild(v, scope) {
  if (isSignalHandle(v)) {
    v = readSignalBinding(v);
  }
  if (probingDangerHtmlChild(v)) return "";
  return ssrChildValue(v, scope, true);
}
function ssrBindingChild(value, scope, marker) {
  const html = ssrChild(value, scope);
  if (!MARKERS) return html;
  const openingEnd = html.indexOf("-->");
  const framed = html.startsWith(import_constants.BLOCK_OPEN) || html.startsWith("<!--") && openingEnd !== -1 && (0, import_dom_binding_protocol.isBindingOpenComment)(html.slice(4, openingEnd));
  const content = framed && html.endsWith(import_constants.BLOCK_CLOSE) ? html.slice(openingEnd + 3, -import_constants.BLOCK_CLOSE.length) : html;
  return ssrBindingBlock(content, marker);
}
function ssrChildValue(v, scope, includeKeyedSingle, selfMarkItem = false) {
  if (v !== null && typeof v === "object" && SERVER_HTML in v) {
    return v[SERVER_HTML];
  }
  if (v == null || v === false || v === true) return ssrBlock("");
  if ((typeof v === "object" || typeof v === "function") && (v.$$kind === import_runtime_tags.CONTEXT_TAG || typeof v.then === "function")) {
    return ssrChildValue(
      use(v),
      scope,
      includeKeyedSingle
    );
  }
  const iterable = iterableChildArray(v);
  if (iterable !== null) v = iterable;
  const preparedList = prepareSsrDeoptList(v, includeKeyedSingle);
  if (preparedList !== null) {
    return withAsyncListScope("child", () => {
      let out = "";
      for (let i = 0; i < preparedList.items.length; i++) {
        const item = preparedList.items[i];
        const key = preparedList.keys[i];
        out += withSsrDeoptItem(key, i, () => ssrChildValue(item, scope, false, true));
      }
      return ssrBlock(out);
    });
  }
  if (typeof v === "function")
    return ssrComponent(scope, v, {}, void 0, void 0, true);
  if (typeof v === "object") {
    if (v.$$kind === import_runtime_tags.ELEMENT_TAG) {
      const d = v;
      const render = () => {
        if (typeof d.type === "string") {
          const type = d.type;
          const props = d.props;
          const children = d.children;
          const html = ssrHostElement(type, props, children, scope);
          return selfMarkItem && serverHostHasPrimitiveChildren(children) ? html : ssrBlock(html);
        }
        return ssrComponentDescriptor(d, scope);
      };
      const renderType = () => withAsyncIdentity("child-type", d.type, render);
      return d.key != null ? withAsyncIdentity("child-key", d.key, renderType, true) : renderType();
    }
    if (v.$$kind === import_runtime_tags.PORTAL_TAG) return ssrBlock(ssrPortal());
    throw invalidChildError(v);
  }
  return ssrBlock(escapeHtml(v));
}
function ssrChildText(v, scope) {
  if (probingDangerHtmlChild(v)) return "";
  if (v == null || v === false || v === true) return "";
  if (typeof v === "object" || typeof v === "function") return ssrChild(v, scope);
  return escapeHtml(v);
}
function ssrChildTextPre(v, scope) {
  const content = ssrChildText(v, scope);
  return content.charCodeAt(0) === 10 ? "\n" + content : content;
}
function rejectTextareaChild(child) {
  throw new Error((0, import_error_codes_server_generated.formatServerError)(336, (0, import_shared_value_helpers.describeTextareaChild)(child, isElementDescriptor)));
}
function ssrTextareaText(parts, textHoles) {
  let probing = false;
  for (const part of parts) if (probingDangerHtmlChild(part)) probing = true;
  if (probing) return "";
  let text = "";
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (isSignalHandle(part)) part = readSignalBinding(part);
    text += textHoles !== void 0 && textHoles.charCodeAt(i) === 116 ? part == null || part === false ? "" : String(part) : (0, import_shared_value_helpers.textareaChildText)(part, rejectTextareaChild);
  }
  const escaped = escapeHtml(text);
  return escaped.charCodeAt(0) === 10 ? "\n" + escaped : escaped;
}
function ssrChildPre(v, scope) {
  const content = ssrChild(v, scope);
  return content.charCodeAt(0) === 10 ? "\n" + content : content;
}
function ssrHostElement(tag, props, children, scope, rawInner) {
  if (!VALID_TAG_NAME.test(tag)) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(30, tag));
  }
  const semanticTag = tag.toLowerCase();
  const parentElement = CURRENT_SSR_ELEMENT;
  const { namespace, childrenNamespace } = ssrElementNamespaces(semanticTag, parentElement);
  CURRENT_SSR_ELEMENT = {
    tag: semanticTag,
    parent: parentElement,
    namespace,
    childrenNamespace,
    location: void 0
  };
  try {
    const iterable = iterableChildArray(children);
    const iterableChildren = iterable !== null;
    if (iterable !== null) children = iterable;
    let attrs = "";
    let innerHTMLValue = void 0;
    let hasInnerHTMLProp = false;
    const isCtlTag = semanticTag === "input" || semanticTag === "textarea" || semanticTag === "select";
    if (props != null) {
      if (__octaneDev) {
        devValidateSsrAriaProps(props, semanticTag, namespace);
        devValidateSsrHostProps(props, semanticTag, namespace);
        devValidateSsrFormProps(semanticTag, props, children);
      }
      for (const k in props) {
        const val = props[k];
        if (k === "dangerouslySetInnerHTML") {
          hasInnerHTMLProp = true;
          innerHTMLValue = val;
          continue;
        }
        if (isCtlTag && (k === "value" || k === "defaultValue" || semanticTag === "input" && (k === "checked" || k === "defaultChecked"))) {
          continue;
        }
        attrs += ssrAttrEntry(k, val, semanticTag, namespace);
      }
      if (semanticTag === "input") {
        attrs += ssrValueAttr(props.value != null ? props.value : props.defaultValue);
        attrs += ssrCheckedAttr(props.checked != null ? props.checked : props.defaultChecked);
      }
    }
    const hasChildren = rawInner !== void 0 ? rawInner !== "" : children != null && children !== false && children !== true && children !== "";
    if (hasInnerHTMLProp && innerHTMLValue != null && (typeof innerHTMLValue !== "object" || !("__html" in innerHTMLValue))) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(6));
    }
    const hasDangerHTML = hasInnerHTMLProp && innerHTMLValue != null;
    if (hasDangerHTML && (children != null || rawInner !== void 0 && rawInner !== "")) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(5));
    }
    if (semanticTag === "textarea" && props != null && (props.value != null || props.defaultValue != null)) {
      if (hasChildren && props.value == null) {
        throw new Error((0, import_error_codes_server_generated.formatServerError)(31));
      }
      const inner2 = ssrTextareaValue(props.value != null ? props.value : props.defaultValue);
      return "<" + tag + attrs + ">" + inner2 + "</" + tag + ">";
    }
    if (import_constants.VOID_ELEMENTS.has(semanticTag) && hasDangerHTML) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(7, semanticTag));
    }
    if (import_constants.VOID_ELEMENTS.has(semanticTag) && !hasChildren) {
      return "<" + tag + attrs + "/>";
    }
    let inner = "";
    if (hasDangerHTML) {
      VT_SSR_HAS_RAW_HTML = true;
      const html = innerHTMLValue.__html;
      const raw = html == null ? "" : String(html);
      inner = semanticTag === "script" ? escapeEntireInlineScriptContent(raw) : semanticTag === "style" ? escapeEntireInlineStyleContent(raw) : raw;
    } else if (rawInner !== void 0) {
      inner = rawInner;
    } else if (hasChildren && semanticTag === "textarea" && namespace === "html") {
      inner = escapeHtml((0, import_shared_value_helpers.textareaChildText)(children, rejectTextareaChild));
    } else if (hasChildren) {
      const rawText = semanticTag === "script" || semanticTag === "style" ? scriptDescriptorText(children) : null;
      if (rawText !== null) {
        inner = semanticTag === "script" ? escapeEntireInlineScriptContent(rawText) : escapeEntireInlineStyleContent(rawText);
      } else {
        const build = () => ssrInNamespace(
          childrenNamespace,
          () => iterableChildren || serverDescNeedsBlocks(children) ? ssrDeoptBlockChildren(children, scope) : ssrDescriptorContent(children, scope)
        );
        inner = semanticTag === "select" && props != null && (props.value != null || props.defaultValue != null) ? ssrSelectScope(props.value, props.defaultValue, !!props.multiple, build) : build();
      }
    }
    if (semanticTag === "option") {
      return ssrOption(
        props != null && props.value != null ? props.value : void 0,
        attrs,
        inner
      );
    }
    if ((semanticTag === "pre" || semanticTag === "textarea" || semanticTag === "listing") && inner.charCodeAt(0) === 10) {
      inner = "\n" + inner;
    }
    return "<" + tag + attrs + ">" + inner + "</" + tag + ">";
  } finally {
    CURRENT_SSR_ELEMENT = parentElement;
  }
}
function ssrDeoptBlockChildren(children, scope) {
  const iterable = iterableChildArray(children);
  if (iterable !== null) children = iterable;
  const preparedList = prepareSsrDeoptList(children, true);
  if (preparedList !== null) {
    return withAsyncListScope("host-child", () => {
      let out = "";
      for (let i = 0; i < preparedList.items.length; i++) {
        const item = preparedList.items[i];
        const key = preparedList.keys[i];
        out += withSsrDeoptItem(key, i, () => {
          return serverDescNeedsBlocks(item) ? ssrChildValue(item, scope, false) : ssrDeoptItemContent(item, scope);
        });
      }
      return ssrBlock(out);
    });
  }
  return ssrChild(children, scope);
}
function serverDescNeedsBlocks(v) {
  if (typeof v === "function") return true;
  if (v == null || typeof v !== "object") return false;
  if (v.$$kind === import_runtime_tags.CONTEXT_TAG || typeof v.then === "function") return true;
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) if (serverDescNeedsBlocks(v[i])) return true;
    return false;
  }
  if (!isElementDescriptor(v) && (0, import_shared_value_helpers.childrenIterator)(v) !== null) return true;
  const d = v;
  if (d.$$kind === import_runtime_tags.ELEMENT_TAG) {
    if (d.type === Fragment || d.type === Activity) return true;
    return typeof d.type === "function" || serverDescNeedsBlocks(d.children);
  }
  return false;
}
function scriptDescriptorText(v) {
  if (v == null || v === false || v === true || v === "") return "";
  if (Array.isArray(v)) {
    let out = "";
    for (let i = 0; i < v.length; i++) {
      const part = scriptDescriptorText(v[i]);
      if (part === null) return null;
      out += part;
    }
    return out;
  }
  if (typeof v === "object" || typeof v === "function") return null;
  return String(v);
}
function serverHostHasPrimitiveChildren(children) {
  return children === null || typeof children !== "object" && typeof children !== "function";
}
function ssrDeoptItemContent(value, scope) {
  if (value !== null && typeof value === "object" && value.$$kind === import_runtime_tags.ELEMENT_TAG) {
    const descriptor = value;
    if (typeof descriptor.type === "string") {
      const type = descriptor.type;
      const props = descriptor.props;
      const children = descriptor.children;
      const html = ssrHostElement(type, props, children, scope);
      return serverHostHasPrimitiveChildren(children) ? html : ssrBlock(html);
    }
  }
  return ssrBlock(ssrDescriptorContent(value, scope));
}
function ssrDescriptorContent(v, scope) {
  if (v == null || v === false || v === true || v === "") return "";
  if (typeof v === "object" && SERVER_HTML in v) return v[SERVER_HTML];
  if (Array.isArray(v)) {
    let out = "";
    for (let i = 0; i < v.length; i++) out += ssrDescriptorContent(v[i], scope);
    return out;
  }
  if (typeof v === "object" && v.$$kind === import_runtime_tags.ELEMENT_TAG) {
    const d = v;
    if (typeof d.type === "string") return ssrHostElement(d.type, d.props, d.children, scope);
    return ssrComponentDescriptor(d, scope);
  }
  if (typeof v === "function") {
    return ssrComponent(scope, v, {}, void 0, void 0, isChildrenBlock(v));
  }
  if (typeof v === "object") throw invalidChildError(v);
  return escapeHtml(v);
}
function ssrBlock(content) {
  return MARKERS ? import_constants.BLOCK_OPEN + content + import_constants.BLOCK_CLOSE : String(content);
}
function ssrBindingBlock(content, marker) {
  return MARKERS ? "<!--" + marker + "-->" + content + import_constants.BLOCK_CLOSE : String(content);
}
function ssrBindingKey(key, seen) {
  const encoded = (0, import_dom_binding_protocol.encodeBindingKey)(key);
  if (seen.has(encoded)) throw new TypeError((0, import_error_codes_server_generated.formatServerError)(73));
  seen.add(encoded);
  return encoded;
}
function ssrBindingClass(receipt, values) {
  const snapshot = [(0, import_css.normalizeClass)(values[0]), values[1].map(import_css.normalizeClass)];
  const classes = [snapshot[0], ...snapshot[1]].filter(Boolean).join(" ");
  return ' class="' + escapeAttr(classes) + '" ' + receipt + '="' + escapeAttr(JSON.stringify(snapshot)) + '"';
}
function ssrFragmentMarker(open, _ref) {
  return MARKERS ? open ? "<!--frag-->" : "<!--/frag-->" : "";
}
function ssrActivity(mode, render) {
  return ssrBlock(mode === "hidden" ? "" : render());
}
function renderActivityDescriptor(props, scope) {
  return ssrHtml(ssrActivity(props.mode ?? "visible", () => ssrChild(props.children, scope)));
}
function ssrForBlock(content, hasItems) {
  return MARKERS ? (hasItems ? import_constants.FOR_BLOCK_OPEN_ITEMS : import_constants.FOR_BLOCK_OPEN_EMPTY) + content + import_constants.BLOCK_CLOSE : String(content);
}
const ASCII_ASYNC_IDENTITY_UNITS = [];
for (let code = 0; code < 128; code++) {
  ASCII_ASYNC_IDENTITY_UNITS.push(code.toString(16).padStart(4, "0"));
}
function encodeAsyncIdentityString(value) {
  let encoded = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    encoded += code < 128 ? ASCII_ASYNC_IDENTITY_UNITS[code] : code.toString(16).padStart(4, "0");
  }
  return encoded;
}
function asyncIdentityKey(value, objectIs, positionFallback) {
  switch (typeof value) {
    case "string": {
      if (value.length > 64 && RESOLVED !== null) {
        const ids = RESOLVED.asyncIdentities;
        let id = ids.get(value);
        if (id === void 0) {
          id = RESOLVED.nextAsyncIdentity++;
          ids.set(value, id);
        }
        return "t" + id.toString(36);
      }
      return "s" + encodeAsyncIdentityString(value);
    }
    case "number":
      return "n" + (objectIs && Object.is(value, -0) ? "-0" : String(value));
    case "bigint":
      return "i" + String(value);
    case "boolean":
      return value ? "b1" : "b0";
    case "undefined":
      return "u";
    case "symbol":
    case "function":
    case "object": {
      if (value === null) return "l";
      const ids = RESOLVED?.asyncIdentities;
      if (ids === void 0) return "o" + encodeAsyncIdentityString(String(value));
      let id = ids.get(value);
      if (id === void 0) {
        id = positionFallback === void 0 ? void 0 : RESOLVED.asyncPositionIdentities.get(positionFallback);
        if (id === void 0) id = RESOLVED.nextAsyncIdentity++;
        ids.set(value, id);
      }
      if (positionFallback !== void 0)
        RESOLVED.asyncPositionIdentities.set(positionFallback, id);
      return "o" + id.toString(36);
    }
  }
}
function withAsyncIdentity(siteKey, identity, fn, objectIs = false, positionFallback) {
  const prev = ASYNC_SCOPE;
  const position = prev + "|@" + siteKey;
  ASYNC_SCOPE = position + ":" + asyncIdentityKey(identity, objectIs, positionFallback);
  try {
    return fn();
  } finally {
    ASYNC_SCOPE = prev;
  }
}
function withAsyncListScope(kind, fn) {
  const frame = FRAME;
  const occurrence = frame === null ? 0 : nextFrameOccurrence(frame, "@list:" + kind);
  return withAsyncIdentity("list:" + kind, occurrence, fn);
}
function withSsrDeoptItem(key, index, fn) {
  const previousScope = ASYNC_SCOPE;
  const previousSignalKeys = SIGNAL_LIST_KEYS;
  ASYNC_SCOPE = previousScope + "|@item:" + asyncIdentityKey(key, false);
  if (SERVER_SIGNAL_BINDINGS_POTENTIAL) {
    SIGNAL_LIST_KEYS = {
      parent: previousSignalKeys,
      key,
      mapped: false,
      signalSite: void 0,
      position: index,
      values: null
    };
  }
  try {
    return fn();
  } finally {
    ASYNC_SCOPE = previousScope;
    SIGNAL_LIST_KEYS = previousSignalKeys;
  }
}
function ssrControl(siteKey, fn) {
  const frame = FRAME;
  const occurrence = frame === null ? 0 : nextFrameOccurrence(frame, "@control:" + siteKey);
  const previousSignalControl = SIGNAL_CONTROL_SITE;
  SIGNAL_CONTROL_SITE = siteKey;
  try {
    return withAsyncIdentity("control:" + siteKey, occurrence, fn);
  } finally {
    SIGNAL_CONTROL_SITE = previousSignalControl;
  }
}
function enterAsyncArm(armKey, mapped = false, signalSite) {
  const previous = ASYNC_SCOPE;
  const frame = FRAME;
  const occurrence = frame === null ? 0 : nextFrameOccurrence(frame, "@arm-position:");
  const fallbackPosition = armKey !== null && (typeof armKey === "object" || typeof armKey === "function" || typeof armKey === "symbol") ? previous + "|@arm-position:" + occurrence : void 0;
  if (SERVER_SIGNAL_BINDINGS_POTENTIAL && SIGNAL_CONTROL_SITE.charCodeAt(0) === 102) {
    SIGNAL_LIST_KEYS = {
      parent: SIGNAL_LIST_KEYS,
      key: armKey,
      mapped,
      signalSite,
      position: occurrence,
      values: null
    };
  }
  ASYNC_SCOPE = previous + "|@arm:" + asyncIdentityKey(armKey, false, fallbackPosition);
}
function ssrArm(armKey, fn) {
  const previous = ASYNC_SCOPE;
  const previousSignalKeys = SIGNAL_LIST_KEYS;
  try {
    enterAsyncArm(armKey);
    return fn();
  } finally {
    ASYNC_SCOPE = previous;
    SIGNAL_LIST_KEYS = previousSignalKeys;
  }
}
function ssrForItem(armKey, fn, item, index, scope, block, mapped = false, signalSite) {
  const previous = ASYNC_SCOPE;
  const previousSignalKeys = SIGNAL_LIST_KEYS;
  const previousSignalOwnerActive = SERVER_SIGNAL_OWNER_ACTIVE;
  let previousOwner;
  try {
    enterAsyncArm(armKey, mapped, signalSite);
    const owner = signalSite !== void 0 && RESOLVED !== null && (SERVER_SIGNAL_BINDINGS_ENABLED || RESOLVED.signalOwner !== void 0) ? serverSignalOwner(FRAME, serverStructuralSignalInstanceKey(signalSite, void 0)) : void 0;
    let html;
    if (owner === void 0) {
      html = index === void 0 ? fn(item, scope) : fn(item, index, scope);
    } else {
      SERVER_SIGNAL_OWNER_ACTIVE = true;
      const injection = RESOLVED?.resourceOptions?.injection;
      if (injection?.observeSignalAttempt !== void 0 || (previousOwner = (0, import_owner_context.enterSynchronousSignalOwner)(owner)) === void 0) {
        html = invokeServerSignalForItem(owner, fn, item, index, scope);
      } else {
        html = index === void 0 ? fn(item, scope) : fn(item, index, scope);
      }
    }
    return block ? ssrBlock(html) : html;
  } finally {
    if (previousOwner !== void 0) (0, import_owner_context.restoreSynchronousSignalOwner)(previousOwner);
    SERVER_SIGNAL_OWNER_ACTIVE = previousSignalOwnerActive;
    ASYNC_SCOPE = previous;
    SIGNAL_LIST_KEYS = previousSignalKeys;
  }
}
function invokeServerSignalForItem(owner, fn, item, index, scope) {
  const invoke = () => index === void 0 ? fn(item, scope) : fn(item, index, scope);
  const injection = RESOLVED?.resourceOptions?.injection;
  return (0, import_owner_context.runWithSignalOwner)(
    owner,
    () => injection?.observeSignalAttempt === void 0 ? invoke() : (0, import_query_attempt_observer.runWithServerSignalQueryAttemptObserver)(
      owner,
      (attempt) => injection.observeSignalAttempt(attempt, (0, import_owner_context.captureSignalOwner)(owner)),
      injection.createSignalAttemptObservations,
      invoke
    )
  );
}
function ssrPortal() {
  return import_constants.EMPTY_COMMENT;
}
function resolveAttributeNamespace(namespace) {
  return namespace === "opaque" ? FRAME?.namespace ?? "html" : namespace;
}
function devWarnSsrAttributeOnce(name, message) {
  if (SSR_NESTING_WARNINGS === null) return;
  const warned = DEV_SSR_ATTRIBUTE_WARNINGS ??= /* @__PURE__ */ new Set();
  if (warned.has(name)) return;
  warned.add(name);
  console.error(message);
}
function devValidateSsrAriaProps(props, tag, namespace) {
  if (SSR_NESTING_WARNINGS === null || tag === void 0 || resolveAttributeNamespace(namespace) === "html" && tag.indexOf("-") !== -1) {
    return;
  }
  const names = Symbol.iterator in props ? props : Object.keys(props);
  let unknown;
  for (const name of names) {
    if (!(0, import_aria_diagnostics.isAriaAttributeName)(name)) continue;
    const warning = (0, import_aria_diagnostics.ariaAttributeWarning)(name, tag);
    if (warning === null) continue;
    if (!(0, import_aria_diagnostics.isUnknownAriaAttribute)(name)) {
      devWarnSsrAttributeOnce(name, warning);
      continue;
    }
    if (DEV_SSR_ATTRIBUTE_WARNINGS?.has(name)) continue;
    (DEV_SSR_ATTRIBUTE_WARNINGS ??= /* @__PURE__ */ new Set()).add(name);
    (unknown ??= []).push(name);
  }
  if (unknown !== void 0) {
    console.error((0, import_aria_diagnostics.unknownAriaAttributeWarning)(unknown, tag));
  }
}
function devValidateSsrHostProps(props, tag, namespace) {
  if (SSR_NESTING_WARNINGS === null || tag === void 0 || resolveAttributeNamespace(namespace) === "html" && tag.indexOf("-") !== -1) {
    return;
  }
  const entries = Symbol.iterator in props ? props : Object.entries(props);
  const snapshot = Array.isArray(entries) ? entries : [...entries];
  if (snapshot.some(([name, value]) => name === "is" && typeof value === "string")) return;
  let invalid;
  for (const [name, value] of snapshot) {
    if (name === "key" || name === "ref" || name === "children" || name === "class" || name === "className" || name === "style" || name === "dangerouslySetInnerHTML" || (0, import_aria_diagnostics.isAriaAttributeName)(name)) {
      continue;
    }
    if (name.length > 2 && name[0] === "o" && name[1] === "n") {
      if (typeof value === "string") {
        const warning2 = (0, import_host_property_diagnostics.hostPropertyWarning)(name, value);
        if (warning2 !== null) devWarnSsrAttributeOnce(name, warning2);
      }
      continue;
    }
    const warning = (0, import_host_property_diagnostics.hostPropertyWarning)(
      name,
      value,
      tag,
      resolveAttributeNamespace(namespace) === "svg"
    );
    if (warning !== null) {
      devWarnSsrAttributeOnce(name, warning);
      continue;
    }
    if (typeof value !== "function" && typeof value !== "symbol") continue;
    if (typeof value === "function" && (tag === "form" && name === "action" || (tag === "button" || tag === "input") && (name === "formAction" || name === "formaction"))) {
      continue;
    }
    if (DEV_SSR_ATTRIBUTE_WARNINGS?.has(name)) continue;
    (DEV_SSR_ATTRIBUTE_WARNINGS ??= /* @__PURE__ */ new Set()).add(name);
    (invalid ??= []).push(name);
  }
  if (invalid !== void 0) console.error((0, import_host_property_diagnostics.invalidHostPropertiesWarning)(invalid, tag));
}
function ssrAttr(name, v, tag, namespace = "html") {
  const dev = __octaneDev;
  namespace = resolveAttributeNamespace(namespace);
  const isCustomTag = namespace === "html" && tag !== void 0 && tag.indexOf("-") !== -1;
  if (dev && !isCustomTag && tag !== void 0 && DEV_SSR_CUSTOM_HOST_DEPTH === 0) {
    const warning = (0, import_aria_diagnostics.isAriaAttributeName)(name) ? (0, import_aria_diagnostics.ariaAttributeWarning)(name, tag) : (0, import_host_property_diagnostics.hostPropertyWarning)(
      name === "formaction" && v === null && (tag === "button" || tag === "input") ? "formAction" : name,
      v,
      tag,
      namespace === "svg"
    );
    if (warning !== null) devWarnSsrAttributeOnce(name, warning);
  }
  if (!isCustomTag) {
    if (name === "autoFocus") {
      return v && typeof v !== "function" && typeof v !== "symbol" ? ' autofocus=""' : "";
    }
    const alias = import_constants.ATTRIBUTE_ALIASES.get(name);
    if (alias !== void 0) name = alias;
    else if (dev && (tag === "button" || tag === "input") && name === "formAction") {
      name = "formaction";
    }
  }
  if (name === "class") {
    if (v == null || v === false) return "";
    const classes = (0, import_css.normalizeClass)(v);
    if (REGISTERED_STYLES !== void 0 && CSS !== null) collectClassStyles(classes, CSS);
    return ' class="' + escapeAttr(classes) + '"';
  }
  if (name.charCodeAt(0) === 97 && name.startsWith("aria-")) {
    if (v == null || typeof v === "function" || typeof v === "symbol") return "";
    return " " + name + '="' + escapeAttr(String(v)) + '"';
  }
  if (name === "innerText" || name === "textContent" || name === "suppressContentEditableWarning" || name === "suppressHydrationWarning" || name === "suppressNativeChangeWarning" || name === "__octaneNativeChangeDiagnostic")
    return "";
  const t = typeof v;
  if (t === "boolean" && (0, import_constants.isEnumeratedBooleanAttr)(name)) {
    return " " + name + '="' + v + '"';
  }
  if (t === "boolean" && name.startsWith("data-")) {
    return " " + name + '="' + v + '"';
  }
  if (t === "function" || t === "symbol") {
    if (t === "function" && (tag === "form" && name === "action" || (tag === "button" || tag === "input") && name === "formaction")) {
      return "";
    }
    if (dev && !isCustomTag && tag !== void 0) {
      if (t === "function" && name.length > 2 && name.charCodeAt(0) === 111 && name.charCodeAt(1) === 110) {
        devWarnSsrAttributeOnce(
          name,
          `Unknown event handler property \`${name}\` was dropped \u2014 did you mean \`on${name.charAt(2).toUpperCase()}${name.slice(3)}\`? (lowercase on* attributes never write; octane delegates camelCase handlers natively)`
        );
      } else {
        devWarnSsrAttributeOnce(
          name,
          `Invalid value for prop \`${name}\` on <${tag}> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM.`
        );
      }
    }
    return "";
  }
  if (!isCustomTag) {
    if (name.length > 2 && name.charCodeAt(0) === 111 && name.charCodeAt(1) === 110) {
      return "";
    }
    const lower = name.toLowerCase();
    if (import_constants.BOOLEAN_ATTR_PROPS.has(lower)) {
      if (dev && tag !== void 0) {
        const warning = (0, import_host_property_diagnostics.booleanAttributeStringWarning)(name, v);
        if (warning !== null) devWarnSsrAttributeOnce(name, warning);
      }
      return v ? " " + lower + '=""' : "";
    }
    if (t === "boolean" && (lower === "download" || lower === "capture")) {
      return v ? " " + lower + '=""' : "";
    }
    if (import_constants.MUST_USE_PROPERTY_PROPS.has(lower)) {
      return v ? " " + lower + '=""' : "";
    }
    if (t === "boolean") {
      if (dev && tag !== void 0) {
        devWarnSsrAttributeOnce(
          name,
          `Received \`${v}\` for a non-boolean attribute \`${name}\`. ` + (v === true ? `If you want to write it to the DOM, pass a string instead: ${name}="true" or ${name}={value.toString()}.` : `If you used to conditionally omit it with ${name}={condition && value}, pass ${name}={condition ? value : undefined} instead.`)
        );
      }
      return "";
    }
    if (import_constants.POSITIVE_NUMERIC_ATTR_PROPS.has(lower) && !(Number(v) >= 1)) return "";
    if ((lower === "rowspan" || lower === "start") && Number.isNaN(Number(v))) return "";
  }
  if (v == null || v === false) return "";
  if (dev && !isCustomTag && tag !== void 0 && t === "object" && v.toString === Object.prototype.toString) {
    devWarnSsrAttributeOnce(
      name,
      `The provided \`${name}\` attribute is an object; it will stringify to "[object Object]". Pass a string (or a value with a meaningful toString) instead.`
    );
  }
  if (dev && !isCustomTag && tag !== void 0 && t === "number" && Number.isNaN(v)) {
    devWarnSsrAttributeOnce(
      name,
      `Received NaN for the \`${name}\` attribute. If this is expected, cast the value to a string.`
    );
  }
  let s;
  if (dev && !isCustomTag && tag !== void 0) {
    try {
      s = v === true ? "" : String(v);
    } catch (error) {
      devWarnSsrAttributeOnce(name, (0, import_host_property_diagnostics.unsupportedAttributeCoercionWarning)(name, v));
      throw error;
    }
  } else {
    s = v === true ? "" : String(v);
  }
  if (s === "" && (name === "src" || name === "href" && tag !== void 0 && tag !== "a" && tag !== "area" || name === "data" && tag === "object")) {
    if (dev && !isCustomTag && tag !== void 0) {
      devWarnSsrAttributeOnce("empty:" + name, (0, import_host_property_diagnostics.emptyResourceUrlWarning)(name));
    }
    return "";
  }
  if (v === true) return " " + name;
  return " " + name + '="' + escapeAttr((0, import_sanitize_url.sanitizeURLAttribute)(tag, name, s)) + '"';
}
function styleObjectToCss(obj) {
  const dev = __octaneDev;
  let out = "";
  for (const k in obj) {
    const val = obj[k];
    if (val == null || typeof val === "boolean") continue;
    let serialized;
    if (dev && SSR_NESTING_WARNINGS !== null) {
      (0, import_css.devWarnStyleProperty)(k, val, true);
      try {
        serialized = (0, import_constants.cssStyleValue)(k, val);
      } catch (error) {
        (0, import_css.devWarnStyleCoercion)(k, val);
        throw error;
      }
    } else {
      serialized = (0, import_constants.cssStyleValue)(k, val);
    }
    if (serialized === "") continue;
    out += (0, import_css.styleName)(k) + ":" + serialized + ";";
  }
  return out;
}
function ssrStyle(v) {
  if (v == null || v === false || v === "") return "";
  const css = typeof v === "string" ? v : styleObjectToCss(v);
  if (!css) return "";
  return ' style="' + escapeAttr(css) + '"';
}
const VALID_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9:._-]*$/;
function ssrAttrEntry(k, v, tag, namespace = "html") {
  namespace = resolveAttributeNamespace(namespace);
  if (k === "key" || k === "ref" || k === "children") return "";
  if (k === "suppressHydrationWarning" || k === "suppressContentEditableWarning" || k === "suppressNativeChangeWarning" || k === "__octaneNativeChangeDiagnostic")
    return "";
  if (k.length > 2 && k[0] === "o" && k[1] === "n" && k[2] >= "A" && k[2] <= "Z") return "";
  if (k === "style") return ssrStyle(v);
  if (k === "className" || k === "class") return ssrAttr("class", v, tag, namespace);
  if (import_constants.VALID_ATTR_NAME.test(k)) return ssrAttr(k, v, tag, namespace);
  return "";
}
function normalizeSsrAttributeName(name, tag, namespace) {
  namespace = resolveAttributeNamespace(namespace);
  if (name === "className") return "class";
  const isCustom = namespace === "html" && tag !== void 0 && tag.indexOf("-") !== -1;
  if (!isCustom) return import_constants.ATTRIBUTE_ALIASES.get(name) ?? name;
  return name;
}
function isAggregatedFormAttribute(tag, name) {
  if (name === "value" || name === "defaultValue") {
    return tag === "input" || tag === "textarea" || tag === "select";
  }
  if (tag === "input" && (name === "checked" || name === "defaultChecked")) return true;
  return tag === "select" && name === "multiple";
}
function ssrAttrs(sources, tag, namespace = "html", skipFormControls = false, readStyle) {
  const dev = __octaneDev;
  namespace = resolveAttributeNamespace(namespace);
  const props = /* @__PURE__ */ new Map();
  let classMerges = null;
  let sourceOrder = 0;
  function record(rawName, value) {
    if (typeof rawName !== "string") return;
    const order = sourceOrder++;
    const previous = props.get(rawName);
    if (previous !== void 0) {
      previous.value = value;
      previous.lastOrder = order;
    } else {
      props.set(rawName, { name: rawName, value, firstOrder: order, lastOrder: order });
    }
  }
  for (const [isSpread, sourceOrName, directValue, merge] of sources) {
    if (!isSpread) {
      if (merge === true && typeof sourceOrName === "string" && (sourceOrName === "class" || sourceOrName === "className")) {
        (classMerges ??= []).push({
          rawName: sourceOrName,
          value: directValue,
          order: sourceOrder++
        });
        continue;
      }
      record(sourceOrName, directValue);
      continue;
    }
    const source = sourceOrName;
    if (source == null || typeof source !== "object" && typeof source !== "function") {
      continue;
    }
    for (const name of Object.keys(Object(source))) {
      record(name, source[name]);
    }
  }
  if (!dev && classMerges === null) {
    let canonical = true;
    for (const name of props.keys()) {
      if (normalizeSsrAttributeName(name, tag, namespace) !== name || namespace === "html" && name.toLowerCase() !== name) {
        canonical = false;
        break;
      }
    }
    if (canonical) {
      let out2 = "";
      for (const { name: rawName, value } of props.values()) {
        if (rawName === "dangerouslySetInnerHTML" || skipFormControls && isAggregatedFormAttribute(tag, rawName))
          continue;
        out2 += ssrAttrEntry(
          rawName,
          readStyle !== void 0 && rawName === "style" ? readStyle(value) : value,
          tag,
          namespace
        );
      }
      return out2;
    }
  }
  const resolved = /* @__PURE__ */ new Map();
  let needsWinningOrderSort = false;
  for (const writer of props.values()) {
    const { name: rawName, lastOrder } = writer;
    if (rawName === "key" || rawName === "ref" || rawName === "children" || rawName === "dangerouslySetInnerHTML" || rawName === "suppressHydrationWarning" || rawName === "suppressContentEditableWarning" || rawName === "suppressNativeChangeWarning" || rawName === "__octaneNativeChangeDiagnostic")
      continue;
    if (skipFormControls && isAggregatedFormAttribute(tag, rawName)) continue;
    if (rawName.length > 2 && rawName[0] === "o" && rawName[1] === "n") {
      const c = rawName.charCodeAt(2);
      if (c >= 65 && c <= 90) continue;
    }
    const name = normalizeSsrAttributeName(rawName, tag, namespace);
    if (!import_constants.VALID_ATTR_NAME.test(name)) continue;
    const identity = namespace === "html" ? name.toLowerCase() : name;
    const previous = resolved.get(identity);
    if (previous !== void 0) {
      if (previous.lastOrder >= lastOrder) continue;
      needsWinningOrderSort = true;
    }
    writer.name = dev && (rawName === "tabIndex" || rawName === "htmlFor") ? rawName : name;
    resolved.set(identity, writer);
  }
  if (classMerges !== null) {
    for (const extra of classMerges) {
      const previous = resolved.get("class");
      if (previous !== void 0) {
        previous.value = (0, import_css.mergeClass)(previous.value, extra.value);
        previous.lastOrder = extra.order;
      } else {
        resolved.set("class", {
          name: "class",
          value: extra.value,
          firstOrder: extra.order,
          lastOrder: extra.order
        });
      }
    }
  }
  const style = resolved.get("style");
  if (readStyle !== void 0 && style !== void 0) style.value = readStyle(style.value);
  let out = "";
  const ordered = dev || needsWinningOrderSort ? [...resolved.values()] : resolved.values();
  if (needsWinningOrderSort) ordered.sort((a, b) => a.firstOrder - b.firstOrder);
  if (dev) {
    devValidateSsrAriaProps(
      ordered.map(({ name }) => name),
      tag,
      namespace
    );
    devValidateSsrHostProps(
      ordered.map(({ name, value }) => [name, value]),
      tag,
      namespace
    );
    if (tag === "form" || tag === "button" || tag === "input") {
      const formProps = /* @__PURE__ */ Object.create(null);
      for (const { name, value } of ordered) formProps[name] = value;
      const action = tag === "form" ? formProps.action : formProps.formAction ?? formProps.formaction;
      if (typeof action === "function") devValidateSsrFormProps(tag, formProps);
    }
  }
  if (dev && ordered.some(({ name, value }) => name === "is" && typeof value === "string")) {
    DEV_SSR_CUSTOM_HOST_DEPTH++;
    try {
      for (const { name, value } of ordered) out += ssrAttrEntry(name, value, tag, namespace);
    } finally {
      DEV_SSR_CUSTOM_HOST_DEPTH--;
    }
  } else {
    for (const { name, value } of ordered) {
      out += ssrAttrEntry(name, value, tag, namespace);
    }
  }
  return out;
}
function ssrClass(sources) {
  let found = false;
  let value;
  for (const [isSpread, source] of sources) {
    if (!isSpread) {
      found = true;
      value = source;
      continue;
    }
    if (source == null || typeof source !== "object" && typeof source !== "function") continue;
    for (const key of Object.keys(Object(source))) {
      if (key === "class" || key === "className") {
        found = true;
        value = source[key];
      }
    }
  }
  return found ? ssrAttr("class", value) : "";
}
function ssrSnapshotSpread(obj, controlSite, deferStyle = false) {
  if (obj == null) return null;
  const source = Object(obj);
  const snapshot = /* @__PURE__ */ Object.create(null);
  for (const key of Reflect.ownKeys(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
    let value = source[key];
    if (typeof key !== "string") continue;
    if (key === "style" && deferStyle) {
      snapshot[key] = value;
      continue;
    }
    if (controlSite !== void 0 && (key === "value" || key === "checked") && isWritableSignal(value)) {
      value = ssrSignalControlValue(value, controlSite);
    } else if (isSignalHandle(value)) value = readSignalBinding(value);
    else if (key === "style" && value !== null && typeof value === "object") {
      let style;
      for (const name of Object.keys(value)) {
        const current = value[name];
        if (!isSignalHandle(current)) continue;
        style ??= { ...value };
        style[name] = readSignalBinding(current);
      }
      if (style !== void 0) value = style;
    }
    snapshot[key] = value;
  }
  return snapshot;
}
function ssrSpread(obj, tag, skipClass = false, namespace = "html", skipFormControls = false) {
  namespace = resolveAttributeNamespace(namespace);
  if (obj == null) return "";
  if (__octaneDev) {
    devValidateSsrAriaProps(Object(obj), tag, namespace);
    devValidateSsrHostProps(Object(obj), tag, namespace);
  }
  let out = "";
  for (const k of Object.keys(Object(obj))) {
    if (skipClass && (k === "class" || k === "className")) continue;
    if (skipFormControls && (k === "value" || k === "defaultValue") && (tag === "input" || tag === "textarea" || tag === "select"))
      continue;
    if (skipFormControls && tag === "input" && (k === "checked" || k === "defaultChecked"))
      continue;
    if (skipFormControls && tag === "select" && k === "multiple") continue;
    if (k === "dangerouslySetInnerHTML") continue;
    out += ssrAttrEntry(k, obj[k], tag, namespace);
  }
  return out;
}
function ssrInnerHtml(sources, renderChildren, definitelyHasChildren = false, childrenSources = []) {
  for (let i = sources.length - 1; i >= 0; i--) {
    const [present, value] = sources[i];
    if (!present) continue;
    if (value == null) return void 0;
    if (typeof value !== "object" || !("__html" in value)) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(6));
    }
    let childValue;
    let hasChildSource = false;
    for (let childI = childrenSources.length - 1; childI >= 0; childI--) {
      if (!childrenSources[childI][0]) continue;
      hasChildSource = true;
      childValue = childrenSources[childI][1];
      break;
    }
    if (definitelyHasChildren || hasChildSource && childValue != null) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(5));
    }
    if (renderChildren !== void 0) {
      DANGER_HTML_CHILD_PROBE++;
      try {
        renderChildren();
      } finally {
        DANGER_HTML_CHILD_PROBE--;
      }
    }
    const html = value.__html;
    VT_SSR_HAS_RAW_HTML = true;
    return html == null ? "" : String(html);
  }
  return void 0;
}
const INLINE_STYLE_TOKEN = /(<\/|<)(s)(tyle)/gi;
function escapeEntireInlineStyleContent(value) {
  return value.replace(
    INLINE_STYLE_TOKEN,
    (_match, prefix, s, suffix) => `${prefix}${s === "s" ? "\\73 " : "\\53 "}${suffix}`
  );
}
const INLINE_SCRIPT_TOKEN = /(<\/|<)(s)(cript)/gi;
function escapeEntireInlineScriptContent(value) {
  return value.replace(
    INLINE_SCRIPT_TOKEN,
    (_match, prefix, s, suffix) => `${prefix}${s === "s" ? "\\u0073" : "\\u0053"}${suffix}`
  );
}
function ssrScriptInnerHtml(sources, renderChildren, definitelyHasChildren = false, childrenSources = []) {
  const html = ssrInnerHtml(sources, renderChildren, definitelyHasChildren, childrenSources);
  return html === void 0 ? void 0 : escapeEntireInlineScriptContent(html);
}
function finalPresentSource(sources) {
  for (let i = sources.length - 1; i >= 0; i--) {
    if (sources[i][0]) return [true, sources[i][1]];
  }
  return [false, void 0];
}
function ssrChildrenSources(sources, renderFallback, scope, textarea = false) {
  const child = finalPresentSource(sources);
  if (!child[0]) return renderFallback();
  return textarea ? ssrTextareaText([child[1]]) : ssrChildText(child[1], scope);
}
function ssrSpreadContent(snapshot, scope) {
  if (snapshot === null) return "";
  const html = snapshot.dangerouslySetInnerHTML;
  const child = snapshot.children;
  if (html != null) {
    if (typeof html !== "object" || !("__html" in html)) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(6));
    }
    if (child != null) throw new Error((0, import_error_codes_server_generated.formatServerError)(5));
    const value = html.__html;
    VT_SSR_HAS_RAW_HTML = true;
    return value == null ? "" : String(value);
  }
  return child === void 0 ? "" : ssrChildText(child, scope);
}
function ssrVoidContent(tag, dangerSources, childrenSources) {
  const danger = finalPresentSource(dangerSources);
  const children = finalPresentSource(childrenSources);
  if (danger[0] && danger[1] != null || children[0] && children[1] != null) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(8, tag));
  }
  return "";
}
function devValidateSsrFormProps(tag, props, children) {
  if (!__octaneDev || SSR_NESTING_WARNINGS === null || CURRENT_SSR_ELEMENT === null || tag !== "input" && tag !== "textarea" && tag !== "select" && tag !== "option" && tag !== "form" && tag !== "button") {
    return;
  }
  for (const warning of (0, import_form_diagnostics.formAuthoringDiagnostics)(tag, props, children)) {
    console.error(warning.message);
  }
}
function ssrFormAuthoringDiagnostics(tag, sources) {
  if (__octaneDev && SSR_NESTING_WARNINGS !== null) {
    const props = /* @__PURE__ */ Object.create(null);
    for (const [name, value] of sources) props[name] = value;
    devValidateSsrFormProps(tag, props);
  }
  return "";
}
function ssrValueAttr(v) {
  v = unwrapSsrSignalControlValue(v);
  if (v == null || typeof v === "function" || typeof v === "symbol") return "";
  return ' value="' + escapeAttr(typeof v === "string" ? v : String(v)) + '"';
}
function ssrCheckedAttr(v) {
  v = unwrapSsrSignalControlValue(v);
  return v == null || !v ? "" : " checked";
}
function ssrInputAttrs(sources) {
  const props = resolveFormControlSources(sources);
  if (__octaneDev) {
    devValidateSsrFormProps("input", {
      value: unwrapSsrSignalControlValue(props.value),
      defaultValue: unwrapSsrSignalControlValue(props.defaultValue),
      checked: unwrapSsrSignalControlValue(props.checked),
      defaultChecked: unwrapSsrSignalControlValue(props.defaultChecked)
    });
  }
  return ssrValueAttr(props.value ?? props.defaultValue) + ssrCheckedAttr(props.checked ?? props.defaultChecked);
}
function ssrSignalControlAttrs(sources) {
  const props = resolveFormControlSources(sources);
  const controls = [];
  let ownerKey;
  const record = (value, channel) => {
    if (!isSsrSignalControlValue(value)) return;
    const documentKey = value.owner.documentOwner.scopeKey;
    if (ownerKey !== void 0 && ownerKey !== documentKey) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(68));
    }
    ownerKey = documentKey;
    controls.push([
      value.binding.scope === "document" ? "" : value.owner.instanceKey,
      value.binding.nodeKey,
      channel
    ]);
  };
  record(props.value, "value");
  record(props.checked, "checked");
  if (controls.length === 0) return "";
  return " " + import_constants.SIGNAL_CONTROL_ATTR + '="' + escapeAttr(JSON.stringify([1, ownerKey, controls])) + '"';
}
function resolveFormControlSources(sources) {
  const resolved = {
    value: void 0,
    defaultValue: void 0,
    checked: void 0,
    defaultChecked: void 0,
    multiple: void 0,
    hasValue: false,
    hasDefaultValue: false,
    hasMultiple: false
  };
  for (const [isSpread, sourceOrName, directValue] of sources) {
    if (isSpread) {
      const source = sourceOrName;
      if (source == null || typeof source !== "object" && typeof source !== "function") {
        continue;
      }
      for (const name of Object.keys(Object(source))) {
        const next = source[name];
        if (name === "value") {
          resolved.hasValue = true;
          resolved.value = next;
        } else if (name === "defaultValue") {
          resolved.hasDefaultValue = true;
          resolved.defaultValue = next;
        } else if (name === "checked") resolved.checked = next;
        else if (name === "defaultChecked") resolved.defaultChecked = next;
        else if (name === "multiple") {
          resolved.hasMultiple = true;
          resolved.multiple = next;
        }
      }
      continue;
    }
    if (sourceOrName === "value") {
      resolved.hasValue = true;
      resolved.value = directValue;
    } else if (sourceOrName === "defaultValue") {
      resolved.hasDefaultValue = true;
      resolved.defaultValue = directValue;
    } else if (sourceOrName === "checked") resolved.checked = directValue;
    else if (sourceOrName === "defaultChecked") resolved.defaultChecked = directValue;
    else if (sourceOrName === "multiple") {
      resolved.hasMultiple = true;
      resolved.multiple = directValue;
    }
  }
  return resolved;
}
function ssrTextareaValue(v) {
  v = unwrapSsrSignalControlValue(v);
  if (v == null) return "";
  const s = escapeHtml(typeof v === "string" ? v : String(v));
  return s.charCodeAt(0) === 10 ? "\n" + s : s;
}
function ssrTextareaValueSources(sources) {
  const props = resolveFormControlSources(sources);
  if (__octaneDev) {
    devValidateSsrFormProps("textarea", {
      value: unwrapSsrSignalControlValue(props.value),
      defaultValue: unwrapSsrSignalControlValue(props.defaultValue)
    });
  }
  const value = props.value ?? props.defaultValue;
  return value == null ? void 0 : ssrTextareaValue(value);
}
function ssrSelectAttrs(sources) {
  const props = resolveFormControlSources(sources);
  return props.hasMultiple ? ssrAttr("multiple", props.multiple, "select") : "";
}
const SELECT_STACK = [];
function ssrSelectScope(value, defaultValue, multiple, children) {
  value = unwrapSsrSignalControlValue(value);
  defaultValue = unwrapSsrSignalControlValue(defaultValue);
  if (__octaneDev) {
    devValidateSsrFormProps("select", { value, defaultValue, multiple });
  }
  const v = value != null ? value : defaultValue;
  let frame;
  if (v == null) {
    frame = { single: null, multi: null };
  } else if (multiple) {
    frame = Array.isArray(v) ? { single: null, multi: new Set(v.map((x) => String(x))) } : { single: null, multi: null };
  } else {
    frame = Array.isArray(v) ? { single: null, multi: null } : { single: String(v), multi: null };
  }
  SELECT_STACK.push(frame);
  try {
    return children();
  } finally {
    SELECT_STACK.pop();
  }
}
function ssrSelectScopeSources(sources, children) {
  const props = resolveFormControlSources(sources);
  return ssrSelectScope(props.value, props.defaultValue, props.multiple, children);
}
function unescapeOptionText(s) {
  if (s.indexOf("&") === -1) return s;
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ssrOptionValueSources(sources) {
  let value;
  for (const [isSpread, sourceOrName, directValue] of sources) {
    if (!isSpread) {
      if (sourceOrName === "value") value = directValue;
      continue;
    }
    const source = sourceOrName;
    if (source == null || typeof source !== "object" && typeof source !== "function") {
      continue;
    }
    if (Object.prototype.propertyIsEnumerable.call(Object(source), "value")) {
      value = source.value;
    }
  }
  return value;
}
function ssrOption(value, attrs, content, complexAuthoredChildren = false) {
  if (__octaneDev && SSR_NESTING_WARNINGS !== null) {
    if (/(?:^|\s)selected(?:\s|=|$)/i.test(attrs)) {
      devValidateSsrFormProps("option", { value, selected: true });
    }
    if (value == null && complexAuthoredChildren) {
      devValidateSsrFormProps("option", { value }, {});
    }
  }
  return "<option" + attrs + ssrOptionSelected(value, content) + ">" + content + "</option>";
}
function ssrOptionSelected(value, content) {
  if (SELECT_STACK.length === 0) return "";
  const scope = SELECT_STACK[SELECT_STACK.length - 1];
  if (scope.single === null && scope.multi === null) return "";
  let key;
  if (value != null) {
    key = String(value);
  } else {
    if (content.indexOf("<") !== -1) return "";
    key = unescapeOptionText(content);
  }
  if (scope.multi !== null) return scope.multi.has(key) ? " selected" : "";
  return scope.single === key ? " selected" : "";
}
let nextHookSlot = 0;
function hookSlots(count) {
  const base = nextHookSlot;
  nextHookSlot += count;
  return base;
}
let HOOK_PASS = null;
const HOOK_SLOT_PATH = [];
const NO_SLOT = "@state";
function resolveHookSlot(slot) {
  const own = typeof slot === "symbol" || typeof slot === "string" || typeof slot === "number" ? slot : void 0;
  const depth = HOOK_SLOT_PATH.length;
  if (depth === 0) return own ?? NO_SLOT;
  if (own === void 0 && depth === 1) return HOOK_SLOT_PATH[0];
  return (0, import_hook_slot_cache.resolveHookPath)(HOOK_SLOT_PATH, own, false, true);
}
const MAX_RENDER_PHASE_PASSES = 25;
function basicStateReducer(s, a) {
  return typeof a === "function" ? a(s) : a;
}
function hookPosition(slot) {
  const hp = HOOK_PASS;
  if (hp === null) return null;
  const key = resolveHookSlot(slot);
  const occ = hp.occ ??= /* @__PURE__ */ new Map();
  const index = occ.get(key) ?? 0;
  occ.set(key, index + 1);
  const hooks = hp.hooks ??= /* @__PURE__ */ new Map();
  let list = hooks.get(key);
  if (list === void 0) hooks.set(key, list = []);
  return { hp, list, index };
}
function nativeLocalHook(name, initialize, dispose, slot) {
  if (CURRENT_SCOPE === null || HOOK_PASS === null) throw new Error((0, import_error_codes_server_generated.formatServerError)(59, name));
  const { list, index } = hookPosition(slot);
  let record = list[index];
  if (record === void 0) {
    const value = initialize();
    list[index] = record = { nativeValue: value };
    (NATIVE_LOCAL_HOOK_DISPOSES ??= []).push(() => dispose(value));
  }
  return record.nativeValue;
}
function stateHook(reducer, create, slot, withGetter = false) {
  const hp = HOOK_PASS;
  if (hp === null) {
    const value = create();
    return withGetter ? [value, NOOP, () => value] : [value, NOOP];
  }
  const position = hookPosition(slot);
  const { list, index: n } = position;
  let rec = list[n];
  if (rec === void 0) {
    const value = create();
    if (withGetter) {
      const r = {
        value,
        pendingValue: value,
        queue: [],
        reducer,
        dispatch: (action) => {
          if (hp !== HOOK_PASS) return;
          r.queue.push(action);
          r.pendingValue = r.reducer(r.pendingValue, action);
          hp.update = true;
        }
      };
      list[n] = rec = r;
    } else {
      const r = {
        value,
        queue: [],
        dispatch: (action) => {
          if (hp !== HOOK_PASS) return;
          r.queue.push(action);
          hp.update = true;
        }
      };
      list[n] = rec = r;
    }
  } else if (rec.queue.length > 0) {
    if (withGetter) {
      const getterRec2 = rec;
      if (getterRec2.reducer === reducer) {
        rec.value = getterRec2.pendingValue;
      } else {
        let value = rec.value;
        const queue = rec.queue;
        for (let i = 0; i < queue.length; i++) value = reducer(value, queue[i]);
        rec.value = value;
        getterRec2.pendingValue = value;
      }
      rec.queue = [];
    } else {
      let value = rec.value;
      const queue = rec.queue;
      for (let i = 0; i < queue.length; i++) value = reducer(value, queue[i]);
      rec.queue = [];
      rec.value = value;
    }
  }
  if (!withGetter) return [rec.value, rec.dispatch];
  const getterRec = rec;
  getterRec.reducer = reducer;
  const getter = getterRec.getter ??= () => getterRec.pendingValue;
  return [rec.value, rec.dispatch, getter];
}
const EMPTY_SNAPSHOT_MAP = /* @__PURE__ */ new Map();
const EMPTY_SNAPSHOT_SET = /* @__PURE__ */ new Set();
const EMPTY_SNAPSHOT_LIST = Object.freeze([]);
function snapshotMap(map) {
  return map == null ? null : map.size === 0 ? EMPTY_SNAPSHOT_MAP : new Map(map);
}
function snapshotSet(set) {
  return set == null ? null : set.size === 0 ? EMPTY_SNAPSHOT_SET : new Set(set);
}
function snapshotList(list) {
  return list == null || list.length === 0 ? EMPTY_SNAPSHOT_LIST : list.slice();
}
function snapshotStyles(css) {
  if (css === null || css.size === 0) return snapshotMap(css);
  return css.replay ??= snapshotMap(css);
}
const EMPTY_HEAD_REPLAY = {
  hints: EMPTY_SNAPSHOT_SET,
  sheets: null,
  hintHtml: null,
  preloadXfer: null
};
function snapshotHeadCollections(head) {
  if (head === null) return null;
  if (head.replay !== null) return head.replay;
  if (head.hints.size === 0 && head.sheets === null && head.hintHtml === null && head.preloadXfer === null)
    return EMPTY_HEAD_REPLAY;
  return head.replay = {
    hints: snapshotSet(head.hints),
    sheets: snapshotMap(head.sheets),
    hintHtml: snapshotMap(head.hintHtml),
    preloadXfer: snapshotMap(head.preloadXfer)
  };
}
function snapshotVtStack() {
  return VT_SSR_STACK.length === 0 ? EMPTY_SNAPSHOT_LIST : VT_SSR_STACK.map((candidate) => ({ candidate, consumed: candidate.consumed }));
}
function snapshotScopedCounts(counts) {
  if (counts == null) return null;
  if (Array.isArray(counts)) {
    return counts.length === 0 ? EMPTY_SNAPSHOT_LIST : counts.slice();
  }
  return snapshotMap(counts);
}
function restoreScopedCounts(snapshot) {
  if (snapshot === null) return null;
  return Array.isArray(snapshot) ? snapshot.slice() : new Map(snapshot);
}
function captureComponentReplayState(scope, frame) {
  const css = CSS;
  const head = HEAD;
  const headCollections = snapshotHeadCollections(head);
  const serial = SERIAL;
  const susp = SUSPENDED;
  const jobs = DEFERRED;
  const stream = STREAM;
  return {
    id: ID_COUNTER,
    native: NATIVE_READ_COLLECTOR?.checkpoint() ?? null,
    nativeReads: NATIVE_SERVER_READS,
    nativeReadCount: NATIVE_SERVER_READS?.reads.size ?? 0,
    nativeMixed: NATIVE_SERVER_READS?.mixed ?? false,
    nativeFailures: NATIVE_SERVER_FAILURES,
    css,
    cssEntries: snapshotStyles(css),
    head,
    headLength: head !== null ? head.html.length : 0,
    headCharsetLength: head !== null ? head.charset.length : 0,
    headViewportLength: head !== null ? head.viewport.length : 0,
    headHints: headCollections?.hints ?? null,
    headSheets: headCollections?.sheets ?? null,
    headHintHtml: headCollections?.hintHtml ?? null,
    headXfer: headCollections?.preloadXfer ?? null,
    serial,
    serialLength: serial !== null ? serial.length : 0,
    susp,
    suspLength: susp !== null ? susp.length : 0,
    jobs,
    jobsLength: jobs !== null ? jobs.length : 0,
    context: scope.$$ctxValues,
    vtTrySeq: VT_SSR_TRY_SEQ,
    vtHasCandidates: VT_SSR_HAS_CANDIDATES,
    vtStack: snapshotVtStack(),
    stream,
    streamNextId: stream?.nextId ?? 0,
    streamActiveTryKeys: snapshotList(stream?.activeTryKeys),
    streamActiveOwnerKeys: snapshotList(stream?.activeOwnerKeys),
    streamPassBoundaryCount: stream?.activePassBoundaryKeys?.size ?? 0,
    asyncScope: ASYNC_SCOPE,
    streamReplayCheckpoint: stream?.replay?.length ?? 0,
    frameDeferred: frame?.deferred ?? false,
    frameNextChild: frame?.nextChild ?? 0,
    frameScopedChildren: snapshotScopedCounts(frame?.scopedChildren),
    frameOccurrences: snapshotScopedCounts(frame?.occ)
  };
}
function rewindComponentReplayState(snapshot, scope, frame) {
  ID_COUNTER = snapshot.id;
  if (snapshot.native !== null) NATIVE_READ_COLLECTOR.rewind(snapshot.native);
  NATIVE_SERVER_READS = snapshot.nativeReads;
  NATIVE_READ_COLLECTOR?.rewindReads(
    NATIVE_SERVER_READS,
    snapshot.nativeReadCount,
    snapshot.nativeMixed
  );
  NATIVE_SERVER_FAILURES = snapshot.nativeFailures;
  ASYNC_SCOPE = snapshot.asyncScope;
  if (snapshot.css !== null && snapshot.cssEntries !== null) {
    snapshot.css.replay = null;
    snapshot.css.clear();
    for (const [hash, sheet] of snapshot.cssEntries) snapshot.css.set(hash, sheet);
  }
  if (snapshot.head !== null && snapshot.headHints !== null) {
    snapshot.head.replay = null;
    snapshot.head.html = snapshot.head.html.slice(0, snapshot.headLength);
    snapshot.head.charset = snapshot.head.charset.slice(0, snapshot.headCharsetLength);
    snapshot.head.viewport = snapshot.head.viewport.slice(0, snapshot.headViewportLength);
    snapshot.head.hints.clear();
    for (const key of snapshot.headHints) snapshot.head.hints.add(key);
    if (snapshot.headSheets === null) snapshot.head.sheets = null;
    else {
      const sheets = snapshot.head.sheets ??= /* @__PURE__ */ new Map();
      sheets.clear();
      for (const [href, entry] of snapshot.headSheets) sheets.set(href, entry);
    }
    if (snapshot.headHintHtml === null) snapshot.head.hintHtml = null;
    else {
      const hintHtml = snapshot.head.hintHtml ??= /* @__PURE__ */ new Map();
      hintHtml.clear();
      for (const [k, v] of snapshot.headHintHtml) hintHtml.set(k, v);
    }
    if (snapshot.headXfer === null) snapshot.head.preloadXfer = null;
    else {
      const xfer = snapshot.head.preloadXfer ??= /* @__PURE__ */ new Map();
      xfer.clear();
      for (const [k, v] of snapshot.headXfer) xfer.set(k, v);
    }
  }
  if (snapshot.serial !== null) snapshot.serial.length = snapshot.serialLength;
  if (snapshot.susp !== null) snapshot.susp.length = snapshot.suspLength;
  if (snapshot.jobs !== null) snapshot.jobs.length = snapshot.jobsLength;
  VT_SSR_TRY_SEQ = snapshot.vtTrySeq;
  VT_SSR_HAS_CANDIDATES = snapshot.vtHasCandidates;
  VT_SSR_STACK.length = 0;
  for (const entry of snapshot.vtStack) {
    entry.candidate.consumed = entry.consumed;
    VT_SSR_STACK.push(entry.candidate);
  }
  const stream = snapshot.stream;
  if (stream !== null) {
    stream.nextId = snapshot.streamNextId;
    if (stream.activePassBoundaryKeys !== null) {
      let index = 0;
      for (const key of stream.activePassBoundaryKeys) {
        if (index++ >= snapshot.streamPassBoundaryCount) stream.activePassBoundaryKeys.delete(key);
      }
    }
    stream.activeTryKeys.length = 0;
    stream.activeTryKeys.push(...snapshot.streamActiveTryKeys);
    stream.activeOwnerKeys.length = 0;
    stream.activeOwnerKeys.push(...snapshot.streamActiveOwnerKeys);
    rewindStreamBoundaryReplay(stream, snapshot.streamReplayCheckpoint);
  }
  scope.$$ctxValues = snapshot.context;
  if (frame !== null) {
    frame.deferred = snapshot.frameDeferred;
    frame.nextChild = snapshot.frameNextChild;
    frame.scopedChildren = restoreScopedCounts(snapshot.frameScopedChildren);
    frame.occ = restoreScopedCounts(snapshot.frameOccurrences);
  }
}
function replayUpdatedComponentBody(comp, props, scope, frame, hp, snapshot, warmPlanCheckpoint) {
  let passes = 1;
  let out;
  do {
    if (++passes > MAX_RENDER_PHASE_PASSES) {
      throw new Error((0, import_error_codes_server_generated.formatServerError)(9));
    }
    hp.update = false;
    hp.occ = null;
    rewindComponentReplayState(snapshot, scope, frame);
    ACTIVE_PU_WARM_PLANS.length = warmPlanCheckpoint;
    out = invokeServerSignalComponent(comp, props, scope, serverSignalOwner(frame));
  } while (hp.update);
  return out;
}
function signalIdentityToken(value, position) {
  if (value === null) return "null";
  const kind = typeof value;
  return kind === "string" || kind === "number" || kind === "bigint" || kind === "boolean" ? kind.charCodeAt(0).toString(36) + ":" + String(value) : kind === "undefined" ? "u:" : { value, position };
}
function signalIdentityKey(token, base, site, parents, componentKey) {
  if (typeof token === "string") return token;
  const resolved = RESOLVED;
  const namespace = base + JSON.stringify([site ?? "legacy", parents, componentKey]);
  const namespaces = resolved.signalIdentityKeys ??= /* @__PURE__ */ new Map();
  let keys = namespaces.get(namespace);
  if (keys === void 0) {
    keys = { ids: /* @__PURE__ */ new Map(), used: /* @__PURE__ */ new Set(), next: 0 };
    namespaces.set(namespace, keys);
  }
  const value = asyncIdentityKey(token.value, false);
  let id = keys.ids.get(value);
  if (id === void 0) {
    id = token.position;
    if (id === void 0 || keys.used.has(id)) {
      while (keys.used.has(keys.next)) keys.next++;
      id = keys.next++;
    }
    keys.used.add(id);
    keys.ids.set(value, id);
  }
  return "o:" + id.toString(36);
}
function serverSignalSegmentKey(base, invocationSite, listKeys, key) {
  const tokens = resolveServerSignalListKeys(listKeys);
  let itemKeys = tokens;
  for (const token of tokens) {
    if (typeof token === "string") continue;
    const values = [];
    for (const entry of tokens) {
      values.push(signalIdentityKey(entry, base, invocationSite, values, false));
    }
    itemKeys = values;
    break;
  }
  return base + JSON.stringify([
    invocationSite ?? "legacy",
    itemKeys,
    key != null ? signalIdentityKey(signalIdentityToken(key), base, invocationSite, itemKeys, true) : ""
  ]);
}
function serverStructuralSignalInstanceKey(invocationSite, key) {
  return serverSignalSegmentKey(
    resolveServerSignalInstanceKey(SIGNAL_COMPONENT_INSTANCE_KEY),
    invocationSite,
    SIGNAL_LIST_KEYS,
    key
  );
}
function resolveServerSignalListKeys(keys) {
  if (keys === null) return EMPTY_SIGNAL_LIST_KEYS;
  if (keys.values !== null) return keys.values;
  const pending = [];
  let parent = keys;
  while (parent !== null && parent.values === null) {
    pending.push(parent);
    parent = parent.parent;
  }
  let values = parent?.values ?? EMPTY_SIGNAL_LIST_KEYS;
  for (let index = pending.length - 1; index >= 0; index--) {
    const entry = pending[index];
    values = [
      ...values,
      signalIdentityToken(entry.mapped ? "k" + String(entry.key) : entry.key, entry.position)
    ];
    entry.values = values;
  }
  return values;
}
function resolveServerSignalInstanceKey(identity) {
  if (typeof identity === "string") return identity;
  if (identity.signalInstanceKey !== void 0) return identity.signalInstanceKey;
  const pending = [];
  while (typeof identity !== "string") {
    if (identity.signalInstanceKey !== void 0) {
      identity = identity.signalInstanceKey;
      break;
    }
    pending.push(identity);
    identity = identity.signalParentKey;
  }
  for (let index = pending.length - 1; index >= 0; index--) {
    const frame = pending[index];
    identity = serverSignalSegmentKey(
      identity,
      frame.signalInvocationSite,
      frame.signalListKeys ?? null,
      frame.signalKey
    );
    frame.signalInstanceKey = identity;
  }
  return identity;
}
function serverSignalOwner(_frame, rowInstanceKey) {
  const resolved = RESOLVED;
  if (resolved !== null && SERVER_SIGNAL_BINDINGS_ENABLED && resolved.signalOwner === void 0) {
    ensureServerSignalOwner();
  }
  if (resolved === null || resolved.signalOwner === void 0 || resolved.signalInstances === void 0)
    return;
  if (rowInstanceKey === void 0 && SIGNAL_LIST_KEYS?.signalSite !== void 0) {
    rowInstanceKey = serverStructuralSignalInstanceKey(SIGNAL_LIST_KEYS.signalSite, void 0);
  }
  const instanceKey = (rowInstanceKey ?? resolveServerSignalInstanceKey(SIGNAL_COMPONENT_INSTANCE_KEY)) || JSON.stringify([SIGNAL_INSTANCE_PREFIX, "root"]);
  let owner = resolved.signalInstances.get(instanceKey);
  if (owner === void 0) {
    owner = Object.freeze({
      scopeKey: resolved.signalOwner.scopeKey,
      documentOwner: resolved.signalOwner,
      instanceOwner: Object.freeze({}),
      instanceKey
    });
    resolved.signalInstances.set(instanceKey, owner);
  }
  return owner;
}
function ensureServerSignalOwner() {
  const resolved = RESOLVED;
  if (resolved.signalOwner !== void 0 && resolved.signalInstances !== void 0) return;
  const ambient = (0, import_owner_context.currentSignalOwner)();
  resolved.signalOwner = ambient === null ? Object.freeze({ scopeKey: "octane:document" }) : isRendererSignalOwner(ambient) ? ambient.documentOwner : ambient;
  resolved.ownedSignalOwner = ambient === null;
  resolved.signalInstances = /* @__PURE__ */ new Map();
}
function invokeServerSignalComponent(comp, props, scope, owner) {
  if (owner === void 0) return comp(props ?? {}, scope, void 0);
  const invoke = () => {
    const previous = SERVER_SIGNAL_OWNER_ACTIVE;
    SERVER_SIGNAL_OWNER_ACTIVE = true;
    try {
      return comp(props ?? {}, scope, void 0);
    } finally {
      SERVER_SIGNAL_OWNER_ACTIVE = previous;
    }
  };
  const injection = RESOLVED?.resourceOptions?.injection;
  const observe = injection?.observeSignalAttempt;
  return (0, import_owner_context.runWithSignalOwner)(
    owner,
    () => observe === void 0 ? invoke() : (0, import_query_attempt_observer.runWithServerSignalQueryAttemptObserver)(
      owner,
      (attempt) => observe(attempt, (0, import_owner_context.captureSignalOwner)(owner)),
      injection.createSignalAttemptObservations,
      invoke
    )
  );
}
function invokeComponentBody(comp, props, scope, frame) {
  const prevHP = HOOK_PASS;
  const hp = { hooks: null, occ: null, update: false };
  const snapshot = captureComponentReplayState(scope, frame);
  const warmPlanCheckpoint = ACTIVE_PU_WARM_PLANS.length;
  HOOK_PASS = hp;
  try {
    ACTIVE_PU_WARM_PLANS.length = warmPlanCheckpoint;
    let out = invokeServerSignalComponent(comp, props, scope, serverSignalOwner(frame));
    if (hp.update) {
      out = replayUpdatedComponentBody(comp, props, scope, frame, hp, snapshot, warmPlanCheckpoint);
    }
    return out;
  } catch (error) {
    throw normalizeThrownServerThenable(error);
  } finally {
    ACTIVE_PU_WARM_PLANS.length = warmPlanCheckpoint;
    HOOK_PASS = prevHP;
  }
}
function captureServerComponentContext() {
  return {
    scope: CURRENT_SCOPE,
    frame: FRAME,
    comp: CURRENT_COMP,
    props: CURRENT_PROPS,
    parent: CURRENT_PARENT_SCOPE,
    asyncScope: ASYNC_SCOPE,
    signalInstance: SIGNAL_COMPONENT_INSTANCE_KEY,
    signalOwnerActive: SERVER_SIGNAL_OWNER_ACTIVE,
    signalControl: SIGNAL_CONTROL_SITE,
    signalListKeys: SIGNAL_LIST_KEYS,
    owner: void 0,
    previousOwner: void 0
  };
}
function renderComponentFramed(comp, props, parent, frame, inherit, instanceKey, bindingMarker) {
  const previous = captureServerComponentContext();
  const parentScope = parent ?? previous.scope;
  const scope = ssrScope(parentScope);
  CURRENT_SCOPE = scope;
  FRAME = frame;
  CURRENT_COMP = comp;
  CURRENT_PROPS = props;
  CURRENT_PARENT_SCOPE = parentScope;
  ASYNC_SCOPE = frame.asyncScope;
  if (instanceKey !== void 0) SIGNAL_COMPONENT_INSTANCE_KEY = instanceKey;
  SIGNAL_CONTROL_SITE = "";
  SIGNAL_LIST_KEYS = null;
  const nativeToken = NATIVE_READ_COLLECTOR === null ? -1 : beginActiveNativeReadScope(scope);
  let nativeCompleted = false;
  try {
    const previousHookPass = HOOK_PASS;
    const hookPass = { hooks: null, occ: null, update: false };
    const replaySnapshot = captureComponentReplayState(scope, frame);
    const warmPlanCheckpoint = ACTIVE_PU_WARM_PLANS.length;
    let out;
    HOOK_PASS = hookPass;
    try {
      ACTIVE_PU_WARM_PLANS.length = warmPlanCheckpoint;
      previous.owner = serverSignalOwner(frame);
      if (previous.owner === void 0) {
        out = comp(props ?? {}, scope, void 0);
      } else if (RESOLVED?.resourceOptions?.injection?.observeSignalAttempt !== void 0 || (previous.previousOwner = (0, import_owner_context.enterSynchronousSignalOwner)(previous.owner)) === void 0) {
        out = invokeServerSignalComponent(comp, props, scope, previous.owner);
      } else {
        try {
          SERVER_SIGNAL_OWNER_ACTIVE = true;
          out = comp(props ?? {}, scope, void 0);
        } finally {
          SERVER_SIGNAL_OWNER_ACTIVE = previous.signalOwnerActive;
          (0, import_owner_context.restoreSynchronousSignalOwner)(previous.previousOwner);
        }
      }
      if (hookPass.update) {
        out = replayUpdatedComponentBody(
          comp,
          props,
          scope,
          frame,
          hookPass,
          replaySnapshot,
          warmPlanCheckpoint
        );
      }
    } finally {
      ACTIVE_PU_WARM_PLANS.length = warmPlanCheckpoint;
      HOOK_PASS = previousHookPass;
    }
    const inner = serverComponentOutput(out, scope);
    nativeCompleted = true;
    if (!MARKERS || inherit) return inner;
    const marker = bindingMarker ?? (out !== null && typeof out === "object" ? out[BINDING_HTML_ROOT] : void 0);
    return (marker === void 0 ? import_constants.BLOCK_OPEN : "<!--" + marker + "-->") + inner + import_constants.BLOCK_CLOSE;
  } catch (error) {
    throw normalizeThrownServerThenable(error);
  } finally {
    if (nativeToken >= 0) NATIVE_READ_COLLECTOR.endScope(nativeToken, nativeCompleted);
    CURRENT_SCOPE = previous.scope;
    FRAME = previous.frame;
    CURRENT_COMP = previous.comp;
    CURRENT_PROPS = previous.props;
    CURRENT_PARENT_SCOPE = previous.parent;
    ASYNC_SCOPE = previous.asyncScope;
    SIGNAL_COMPONENT_INSTANCE_KEY = previous.signalInstance;
    SERVER_SIGNAL_OWNER_ACTIVE = previous.signalOwnerActive;
    SIGNAL_CONTROL_SITE = previous.signalControl;
    SIGNAL_LIST_KEYS = previous.signalListKeys;
  }
}
function ssrComponent(parent, comp, props, inherit, key, identityScoped, invocationSite, bindingMarker) {
  const activity = comp === Activity;
  if (activity && key === void 0) key = props?.key;
  let signalInstanceKey = SERVER_SIGNAL_BINDINGS_ENABLED && RESOLVED !== null ? serverStructuralSignalInstanceKey(invocationSite, key) : void 0;
  const previousIdentityScope = ASYNC_SCOPE;
  if (identityScoped !== true) {
    ASYNC_SCOPE = previousIdentityScope + "|@component-type:" + asyncIdentityKey(comp, false);
    if (key != null) ASYNC_SCOPE += "|@component-key:" + asyncIdentityKey(key, true);
  }
  try {
    const explicitNamespace = NEXT_COMPONENT_NAMESPACE;
    NEXT_COMPONENT_NAMESPACE = null;
    if (activity) {
      comp = renderActivityDescriptor;
      inherit = false;
    }
    if (inherit === true && (0, import_component_flags.hasComponentFlags)(comp, import_component_flags.COMPONENT_FLAG_BOUNDARY)) inherit = false;
    if (typeof comp === "string") {
      const tag = comp;
      const inheritedNamespace = explicitNamespace ?? FRAME?.namespace ?? "html";
      const childNamespace = parserNamespacesForTag(
        tag.toLowerCase(),
        inheritedNamespace
      ).childrenNamespace;
      return ssrInNamespace(childNamespace, () => {
        const kids = props?.children;
        if (typeof kids === "function") {
          const out = kids(void 0, parent);
          const inner = serverComponentOutput(out, parent);
          const html2 = ssrHostElement(tag, props, null, parent, inner);
          return inherit ? html2 : ssrBlock(html2);
        }
        const html = ssrHostElement(tag, props, kids, parent);
        return inherit ? html : ssrBlock(html);
      });
    }
    const pf = FRAME;
    const seg = pf === null ? 0 : nextChildSegment(pf);
    const namespace = explicitNamespace ?? pf?.namespace;
    const potentialSignalKey = signalInstanceKey === void 0 && SERVER_SIGNAL_BINDINGS_POTENTIAL;
    const frame = potentialSignalKey ? {
      parent: pf,
      seg,
      nextChild: 0,
      scopedChildren: null,
      occ: null,
      path: null,
      deferred: false,
      asyncScope: ASYNC_SCOPE,
      namespace,
      signalParentKey: SIGNAL_COMPONENT_INSTANCE_KEY,
      signalInvocationSite: invocationSite,
      signalListKeys: SIGNAL_LIST_KEYS,
      signalKey: key,
      signalInstanceKey: void 0
    } : {
      parent: pf,
      seg,
      nextChild: 0,
      scopedChildren: null,
      occ: null,
      path: null,
      deferred: false,
      asyncScope: ASYNC_SCOPE,
      namespace
    };
    if (potentialSignalKey) signalInstanceKey = frame;
    return renderComponentFramed(
      comp,
      props,
      parent,
      frame,
      inherit,
      signalInstanceKey,
      bindingMarker
    );
  } finally {
    if (identityScoped !== true) ASYNC_SCOPE = previousIdentityScope;
  }
}
let NEXT_COMPONENT_NAMESPACE = null;
function ssrComponentNS(parent, comp, props, namespace, inherit, key, invocationSite, bindingMarker) {
  const previous = NEXT_COMPONENT_NAMESPACE;
  NEXT_COMPONENT_NAMESPACE = namespace;
  try {
    return ssrComponent(
      parent,
      comp,
      props,
      inherit,
      key,
      void 0,
      invocationSite,
      bindingMarker
    );
  } finally {
    NEXT_COMPONENT_NAMESPACE = previous;
  }
}
function ssrInNamespace(namespace, render) {
  const frame = FRAME;
  if (frame === null) return render();
  const previous = frame.namespace;
  frame.namespace = namespace;
  try {
    return render();
  } finally {
    frame.namespace = previous;
  }
}
function ssrChildrenHtml(children, scope) {
  if (typeof children === "function")
    return serverComponentOutput(children(void 0, scope), scope);
  return ssrChild(children, scope);
}
function streamTokenForPendingHtml(html) {
  const stream = STREAM;
  return stream !== null && html.includes(import_constants.STREAM_BOUNDARY_ATTR + '="' + stream.token + "-") ? stream.token : null;
}
function ssrIndependentHydrateSidecar(props, instanceId) {
  const independent = props.__independent;
  if (independent === void 0) return "";
  const when = typeof props.when === "function" ? "dynamic" : props.when?._t;
  if (when === "dynamic" || when === "condition") {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(80, when));
  }
  const registry = RESOLVED?.resourceOptions?.independentHydration;
  if (registry === void 0) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(69));
  }
  const build = registry.resolve(independent.manifestTemplate.boundaryId);
  if (build === void 0) {
    throw new Error((0, import_error_codes_server_generated.formatServerError)(70));
  }
  const manifest = (0, import_independent_hydration_protocol.createIndependentHydrateManifest)(
    independent.manifestTemplate,
    independent.captures,
    instanceId,
    registry.buildId,
    build
  );
  return '<script type="application/json" ' + import_constants.INDEPENDENT_HYDRATE_MANIFEST_ATTR + NONCE_ATTR + ">" + (0, import_independent_hydration_protocol.serializeIndependentHydrateManifest)(manifest) + "</script>";
}
function withServerIndependentIdentity(prefix, idSeed, render) {
  const previous = SIGNAL_INSTANCE_PREFIX;
  const previousInstance = SIGNAL_COMPONENT_INSTANCE_KEY;
  const previousControl = SIGNAL_CONTROL_SITE;
  const previousListKeys = SIGNAL_LIST_KEYS;
  const previousIdPrefix = ID_PREFIX;
  const previousIdCounter = ID_COUNTER;
  SIGNAL_INSTANCE_PREFIX = prefix;
  SIGNAL_COMPONENT_INSTANCE_KEY = JSON.stringify([prefix, "root"]);
  SIGNAL_CONTROL_SITE = "";
  SIGNAL_LIST_KEYS = null;
  ID_PREFIX = prefix + "-";
  ID_COUNTER = idSeed;
  try {
    return render();
  } finally {
    SIGNAL_INSTANCE_PREFIX = previous;
    SIGNAL_COMPONENT_INSTANCE_KEY = previousInstance;
    SIGNAL_CONTROL_SITE = previousControl;
    SIGNAL_LIST_KEYS = previousListKeys;
    ID_PREFIX = previousIdPrefix;
    ID_COUNTER = previousIdCounter + ID_COUNTER - idSeed;
  }
}
function ssrIndependentStrategyAttrs(strategy) {
  const params = strategy._p;
  if (strategy._t === "media") return ssrAttr(import_hydration_markers2.HYDRATE_MEDIA_ATTR, params, "div");
  if (params === null || typeof params !== "object") return "";
  if (strategy._t === "idle") {
    const { timeout } = params;
    return timeout === void 0 ? "" : ssrAttr(import_hydration_markers2.HYDRATE_IDLE_TIMEOUT_ATTR, timeout, "div");
  }
  if (strategy._t !== "visible") return "";
  const { rootMargin, threshold } = params;
  return (rootMargin === void 0 ? "" : ssrAttr(import_hydration_markers2.HYDRATE_VISIBLE_MARGIN_ATTR, rootMargin, "div")) + (threshold === void 0 ? "" : ssrAttr(
    import_hydration_markers2.HYDRATE_VISIBLE_THRESHOLD_ATTR,
    Array.isArray(threshold) ? threshold.join(",") : threshold,
    "div"
  ));
}
function ssrHydrateAttrs(id, when, idCount, permanentStaticAncestor = false, streamToken = null, independent = false) {
  const direct = typeof when !== "function" && when !== null ? when : null;
  let attrs = ssrAttr(import_constants.HYDRATE_ID_ATTR, id, "div") + ssrAttr(
    import_constants.HYDRATE_WHEN_ATTR,
    permanentStaticAncestor ? "never" : direct?._t ?? "dynamic",
    "div"
  ) + ssrAttr(import_constants.HYDRATE_ID_COUNT_ATTR, idCount, "div");
  if (streamToken !== null) attrs += ssrAttr(import_constants.HYDRATE_STREAM_TOKEN_ATTR, streamToken, "div");
  if (permanentStaticAncestor) return attrs;
  if (independent && direct !== null) attrs += ssrIndependentStrategyAttrs(direct);
  const strategyAttrs = direct?._a?.();
  if (strategyAttrs === void 0) return attrs;
  for (const name of Object.keys(strategyAttrs)) {
    if (name === import_constants.HYDRATE_ID_ATTR || name === import_constants.HYDRATE_WHEN_ATTR || name === import_constants.HYDRATE_ID_COUNT_ATTR || name === import_constants.HYDRATE_STREAM_TOKEN_ATTR || name === import_constants.HYDRATE_SEED_ATTR || name === import_native_read_seeds.NATIVE_SIGNAL_SEED_ATTR || !import_constants.VALID_ATTR_NAME.test(name))
      continue;
    attrs += ssrAttr(name, strategyAttrs[name], "div");
  }
  return attrs;
}
const PermanentStaticHydrate = /* @__PURE__ */ (0, import_component_flags.markComponentFlags)(
  function PermanentStaticHydrate2(props, scope) {
    useId();
    const inheritedPermanentStatic = PERMANENT_STATIC_HYDRATE_DEPTH !== 0;
    const nativeCapture = NATIVE_READ_COLLECTOR?.beginCapture() ?? -1;
    const previousNativeReads = NATIVE_SERVER_READS;
    if (nativeCapture < 0) NATIVE_SERVER_READS = null;
    PERMANENT_STATIC_HYDRATE_DEPTH++;
    try {
      if (inheritedPermanentStatic || !MARKERS)
        return ssrHtml(ssrChildrenHtml(props.children, scope));
      const childIdStart = ID_COUNTER;
      const serialStart = SERIAL?.length ?? 0;
      const children = ssrBlock(
        ssrTry(
          scope,
          "jsx-static-hydrate",
          (_arg, childScope) => ssrChildrenHtml(props.children, childScope),
          null,
          null
        )
      );
      const idCount = ID_COUNTER - childIdStart;
      if (SERIAL !== null) SERIAL.splice(serialStart);
      const streamToken = streamTokenForPendingHtml(children);
      const markerToken = streamToken === null ? "" : streamToken + ":";
      const endToken = streamToken === null ? "" : ":" + streamToken;
      return ssrHtml(
        `<!--${import_constants.HYDRATE_STATIC_ID_COUNT_PREFIX}${markerToken}${idCount}-->` + children + `<!--${import_constants.HYDRATE_STATIC_END}${endToken}-->`
      );
    } finally {
      finishNativeSeedCapture(nativeCapture, previousNativeReads, false);
      PERMANENT_STATIC_HYDRATE_DEPTH--;
    }
  },
  import_component_flags.COMPONENT_FLAG_BOUNDARY,
  "PermanentStaticHydrate"
);
const hydrate = /* @__PURE__ */ (0, import_component_flags.markComponentFlags)(
  function Hydrate(rawProps, scope) {
    const props = rawProps;
    const id = useId();
    return ssrHtml(
      withSsrElementContext(
        "div",
        void 0,
        () => ssrInNamespace("html", () => {
          if (!MARKERS) {
            return "<div>" + ssrChildrenHtml(props.children, scope) + "</div>";
          }
          const childIdStart = ID_COUNTER;
          const serialStart = SERIAL?.length ?? 0;
          const nativeCapture = NATIVE_READ_COLLECTOR?.beginCapture() ?? -1;
          const previousNativeReads = NATIVE_SERVER_READS;
          if (nativeCapture < 0) NATIVE_SERVER_READS = null;
          let children;
          let nativeReads = null;
          try {
            const renderChildren = () => ssrBlock(
              ssrTry(
                scope,
                "jsx-hydrate",
                (_arg, childScope) => ssrChildrenHtml(props.children, childScope),
                null,
                null,
                "html"
              )
            );
            children = props.__independent === void 0 ? renderChildren() : withServerIndependentIdentity(
              id,
              props.__independent.manifestTemplate.idSeed,
              renderChildren
            );
          } finally {
            nativeReads = finishNativeSeedCapture(nativeCapture, previousNativeReads, false);
          }
          const idCount = ID_COUNTER - childIdStart;
          const childSeeds = SERIAL === null ? [] : SERIAL.splice(serialStart);
          const permanentStaticAncestor = PERMANENT_STATIC_HYDRATE_DEPTH !== 0;
          const attrs = ssrHydrateAttrs(
            id,
            props.when,
            idCount,
            permanentStaticAncestor,
            streamTokenForPendingHtml(children),
            props.__independent !== void 0
          );
          const seedJson = permanentStaticAncestor || childSeeds.length === 0 ? null : serializeSuspenseSeedJson(childSeeds);
          const seedSidecar = seedJson === null || seedJson === "[]" ? "" : '<script type="application/json" ' + import_constants.HYDRATE_SEED_ATTR + NONCE_ATTR + ">" + seedJson + "</script>";
          const nativeSeeds = permanentStaticAncestor ? void 0 : NATIVE_READ_COLLECTOR?.serialize(nativeReads, RESOLVED?.initialDocumentSignals);
          const nativeSidecar = nativeSeeds === void 0 ? "" : serializeNativeSignalSeeds(nativeSeeds, NONCE_ATTR);
          const independentSidecar = permanentStaticAncestor ? "" : ssrIndependentHydrateSidecar(props, id);
          return "<div" + attrs + (props.__independent === void 0 ? "" : " " + import_constants.HYDRATE_INDEPENDENT_ATTR + '=""') + ">" + children + seedSidecar + nativeSidecar + independentSidecar + "</div>";
        }),
        "html"
      )
    );
  },
  import_component_flags.COMPONENT_FLAG_BOUNDARY,
  "Hydrate"
);
function initializeHydrateComponent() {
  Object.defineProperty(hydrate, "__octanePermanentStatic", { value: PermanentStaticHydrate });
  return hydrate;
}
const Hydrate2 = /* @__PURE__ */ initializeHydrateComponent();
const Suspense = /* @__PURE__ */ (0, import_component_flags.markComponentFlags)(
  function Suspense2(props, scope) {
    return ssrHtml(
      ssrTry(
        scope,
        "jsx-suspense",
        (_arg, s) => ssrChildrenHtml(props.children, s),
        (_arg, s) => ssrChild(props.fallback, s),
        null,
        FRAME?.namespace ?? "html",
        false,
        true
      )
    );
  },
  import_component_flags.COMPONENT_FLAG_BOUNDARY,
  "Suspense",
  import_runtime_tags.SUSPENSE_TAG
);
let VT_SSR_TRY_SEQ = 0;
let VT_SSR_HAS_CANDIDATES = false;
let VT_SSR_HAS_RAW_HTML = false;
const VT_SSR_STACK = [];
function vtSsrResolve(props, kind) {
  const value = props[kind];
  const resolved = typeof value === "string" ? value : value?.default;
  if (resolved != null) return resolved;
  const fallback = props.default;
  return (typeof fallback === "string" ? fallback : fallback?.default) ?? "auto";
}
function vtSsrOpenTagEnd(html, from) {
  let quote = 0;
  for (let index = from; index < html.length; index++) {
    const code = html.charCodeAt(index);
    if (quote !== 0) {
      if (code === quote) quote = 0;
    } else if (code === 34 || code === 39) {
      quote = code;
    } else if (code === 62) {
      return index;
    }
  }
  return -1;
}
function vtSsrMapTags(html, visit, visitText, visitAllElements = false, rootOnly = false) {
  let depth = 0;
  let from = 0;
  let copied = 0;
  let out = "";
  while (from < html.length) {
    const start = html.indexOf("<", from);
    if (visitText && (!rootOnly || depth === 0))
      visitText(html.slice(from, start < 0 ? html.length : start), depth);
    if (start < 0) break;
    if (html.startsWith("<!--", start)) {
      const end2 = html.indexOf("-->", start + 4);
      if (end2 < 0) break;
      from = end2 + 3;
      continue;
    }
    const closing = html[start + 1] === "/";
    const nameStart = start + (closing ? 2 : 1);
    const initial = html.charCodeAt(nameStart);
    if (!(initial >= 65 && initial <= 90 || initial >= 97 && initial <= 122)) {
      from = start + 1;
      continue;
    }
    let nameEnd = nameStart + 1;
    while (nameEnd < html.length) {
      const code = html.charCodeAt(nameEnd);
      if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 58 || code === 45))
        break;
      nameEnd++;
    }
    const tag = html.slice(nameStart, nameEnd).toLowerCase();
    const end = vtSsrOpenTagEnd(html, nameStart + tag.length);
    if (end < 0) break;
    from = end + 1;
    if (closing) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    const inert = tag === "template" || tag === "script" || tag === "style" || tag === "title";
    const isVoid = import_constants.VOID_ELEMENTS.has(tag) || html[end - 1] === "/";
    if ((!rootOnly || depth === 0) && (visitAllElements || !inert && tag !== "link" && tag !== "meta" && tag !== "base" && tag !== "option")) {
      const open = html.slice(start, end + 1);
      const next = visit(open, depth, tag);
      if (next !== open) {
        out += html.slice(copied, start) + next;
        copied = end + 1;
      }
    }
    if (inert) {
      const close = new RegExp("</" + tag + "[\\t\\n\\f\\r ]*>", "gi");
      close.lastIndex = from;
      from = close.exec(html) === null ? html.length : close.lastIndex;
      continue;
    }
    if (!isVoid) depth++;
  }
  return copied === 0 ? html : out + html.slice(copied);
}
function vtSsrInject(open, attrs) {
  let existing;
  if (/vt-/i.test(open)) {
    existing = /* @__PURE__ */ new Set();
    vtSsrAttributes(open, (name) => {
      existing.add(name);
    });
  }
  let inject = "";
  for (const [name, value] of attrs) {
    if (!existing?.has(name)) inject += " " + name + '="' + escapeAttr(value) + '"';
  }
  if (inject === "") return open;
  const insertion = open[open.length - 2] === "/" ? open.length - 2 : open.length - 1;
  return open.slice(0, insertion) + inject + open.slice(insertion);
}
function vtSsrAnnotate(html, attrs) {
  let index = 0;
  return vtSsrMapTags(
    html,
    (open, depth) => {
      if (depth !== 0) return open;
      const suffix = index++;
      return vtSsrInject(
        open,
        suffix === 0 ? attrs : attrs.map(([name, value]) => [name, name === "vt-name" ? value + "-" + suffix : value])
      );
    },
    void 0,
    false,
    true
  );
}
function vtSsrSpace(code) {
  return code === 32 || code === 9 || code === 10 || code === 12 || code === 13;
}
function vtSsrAttributes(open, visit) {
  let i = 1;
  while (i < open.length && !vtSsrSpace(open.charCodeAt(i)) && open[i] !== "/" && open[i] !== ">")
    i++;
  while (i < open.length) {
    while (vtSsrSpace(open.charCodeAt(i))) i++;
    if (i >= open.length || open[i] === ">" || open[i] === "/") break;
    const start = i;
    while (i < open.length && !vtSsrSpace(open.charCodeAt(i)) && open[i] !== "=" && open[i] !== "/" && open[i] !== ">")
      i++;
    const nameEnd = i;
    const name = open.slice(start, i).toLowerCase();
    while (vtSsrSpace(open.charCodeAt(i))) i++;
    if (open[i] !== "=") {
      if (visit(name, nameEnd, nameEnd, "", start, nameEnd)) return;
      continue;
    }
    i++;
    while (vtSsrSpace(open.charCodeAt(i))) i++;
    const quote = open[i] === '"' || open[i] === "'" ? open[i++] : "";
    const valueStart = i;
    if (quote) {
      const closing = open.indexOf(quote, i);
      i = closing < 0 ? open.length : closing;
    } else {
      while (i < open.length && !vtSsrSpace(open.charCodeAt(i)) && open[i] !== ">") i++;
    }
    const valueEnd = i;
    if (quote) i++;
    if (visit(name, valueStart, valueEnd, quote, start, nameEnd)) return;
  }
}
function vtSsrAttribute(open, wanted) {
  let result = null;
  vtSsrAttributes(open, (name, start, end, quote, nameStart, nameEnd) => {
    if (name !== wanted) return;
    result = { start, end, quote, nameStart, nameEnd };
    return true;
  });
  return result;
}
function vtSsrAnnotateScope(html) {
  let roots = 0;
  let sentinel = false;
  let text = false;
  vtSsrMapTags(
    html,
    (open, depth, tag) => {
      if (depth === 0) {
        if (tag === "template" && vtSsrAttribute(open, import_constants.STREAM_BOUNDARY_ATTR) !== null)
          sentinel = true;
        else roots++;
      }
      return open;
    },
    (value, depth) => {
      if (depth === 0 && /\S/.test(value)) text = true;
    },
    true,
    true
  );
  const valid = roots === 1 && !sentinel && !text;
  if (valid) injectStyle(import_css.VIEW_TRANSITION_SCOPE_STYLE_ID, import_css.VIEW_TRANSITION_SCOPE_CSS);
  return vtSsrMapTags(
    html,
    (open) => vtSsrInject(open, [["vt-scope", valid ? "element" : "none"]]),
    void 0,
    true,
    true
  );
}
function vtSsrClaimArm(html, kind) {
  if (!VT_SSR_HAS_CANDIDATES) return html;
  const active = [];
  const eventName = "vt-" + kind;
  const candidateName = eventName + "-x";
  const relayName = "vt-parent-" + kind + "-x";
  return vtSsrMapTags(html, (open, depth) => {
    let candidate;
    let candidateEnd = -1;
    let event;
    let eventStart = Infinity;
    let relay;
    let relayEnd = -1;
    if (/vt-/i.test(open))
      vtSsrAttributes(open, (name, start, end, _quote, nameStart, nameEnd) => {
        if (name === candidateName && candidate === void 0) {
          candidate = open.slice(start, end);
          candidateEnd = nameEnd;
        } else if (name === eventName && event === void 0) {
          event = open.slice(start, end);
          eventStart = nameStart;
        } else if (name === relayName && relay === void 0) {
          relay = open.slice(start, end);
          relayEnd = nameEnd;
        }
      });
    let claimEnd = -1;
    if (depth === 0 && candidate !== void 0 && candidate !== "none") {
      claimEnd = candidateEnd;
      if (candidateEnd < eventStart) event = candidate;
    }
    const parentActive = depth > 0 && active[depth - 1];
    if (parentActive && relay !== void 0 && relay !== "none" && relay !== "auto") {
      claimEnd = relayEnd;
    }
    active[depth] = event !== void 0 && event !== "none" || parentActive && (relay === void 0 || relay !== "none");
    return claimEnd < 0 ? open : open.slice(0, claimEnd - 2) + open.slice(claimEnd);
  });
}
const VT_SSR_STRIP = / vt-(?:parent-)?(?:enter|exit)-x="[^"]*"(?=[^<>"]*(?:"[^"]*"[^<>"]*)*>)/gi;
const VT_SSR_OPAQUE = /<!--|<(script|style|title|template)(?=[\t\n\f\r />])/gi;
const VT_SSR_CANDIDATE = /vt-(?:parent-)?(?:enter|exit)-x/i;
function vtSsrStrip(html, rawHtml) {
  if (!rawHtml) {
    let lower = html.indexOf('-x="');
    let upper = html.indexOf('-X="');
    if (lower < 0 && upper < 0) return html;
    const advance = (from2) => {
      if (lower >= 0 && lower < from2) lower = html.indexOf('-x="', from2);
      if (upper >= 0 && upper < from2) upper = html.indexOf('-X="', from2);
      return lower < 0 ? upper : upper < 0 ? lower : Math.min(lower, upper);
    };
    let candidate = advance(0);
    let from = 0;
    let copied = 0;
    let out = "";
    VT_SSR_OPAQUE.lastIndex = 0;
    let opaque;
    while ((opaque = VT_SSR_OPAQUE.exec(html)) !== null) {
      const start = opaque.index;
      const attr = html.slice(from, start).lastIndexOf('="');
      if (attr >= 0 && html.indexOf('"', from + attr + 2) > start) {
        rawHtml = true;
        break;
      }
      if (candidate < start) {
        const part = html.slice(from, start);
        const next = part.replace(VT_SSR_STRIP, "");
        if (next !== part) {
          out += html.slice(copied, from) + next;
          copied = start;
        }
        candidate = advance(start);
        if (candidate < 0) return copied === 0 ? html : out + html.slice(copied);
      }
      const tag = opaque[1];
      let end;
      if (tag === void 0) {
        const close = html.indexOf("-->", start + 4);
        end = close < 0 ? html.length : close + 3;
      } else {
        const openingEnd = vtSsrOpenTagEnd(html, start + tag.length + 1) + 1;
        const close = html.indexOf("</" + tag + ">", openingEnd);
        if (close >= 0) end = close + tag.length + 3;
        else {
          const closing = new RegExp("</" + tag + "[\\t\\n\\f\\r ]*>", "gi");
          closing.lastIndex = openingEnd;
          end = closing.exec(html) === null ? html.length : closing.lastIndex;
        }
      }
      if (candidate < end) {
        candidate = advance(end);
        if (candidate < 0) return copied === 0 ? html : out + html.slice(copied);
      }
      from = VT_SSR_OPAQUE.lastIndex = end;
    }
    if (!rawHtml)
      return out + html.slice(copied, from) + html.slice(from).replace(VT_SSR_STRIP, "");
  }
  if (!VT_SSR_CANDIDATE.test(html)) return html;
  return vtSsrMapTags(html, (open) => {
    if (!VT_SSR_CANDIDATE.test(open)) return open;
    let out = "";
    let copied = 0;
    vtSsrAttributes(open, (name, _start, end, quote, nameStart) => {
      if (name === "vt-enter-x" || name === "vt-exit-x" || name === "vt-parent-enter-x" || name === "vt-parent-exit-x") {
        const start = vtSsrSpace(open.charCodeAt(nameStart - 1)) ? nameStart - 1 : nameStart;
        out += open.slice(copied, start);
        copied = end + (quote ? 1 : 0);
      }
    });
    return copied === 0 ? open : out + open.slice(copied);
  });
}
const ViewTransition = /* @__PURE__ */ (0, import_component_flags.markComponentFlags)(
  function ViewTransition2(props, scope) {
    VT_SSR_HAS_CANDIDATES = true;
    const explicit = typeof props.name === "string" && props.name !== "auto";
    const frame = FRAME;
    const cand = {
      elementScope: props.scope === "element",
      name: explicit ? props.name : "_O" + ID_PREFIX + (STREAM !== null ? STREAM.token + "-" : "") + (frame !== null ? framePath(frame).replace(/\//g, "-") : "") + "_",
      share: vtSsrResolve(props, "share"),
      update: vtSsrResolve(props, "update"),
      consumed: false
    };
    VT_SSR_STACK.push(cand);
    const seqBefore = VT_SSR_TRY_SEQ;
    let inner;
    try {
      inner = ssrChildrenHtml(props.children, scope);
    } finally {
      VT_SSR_STACK.pop();
    }
    const named = explicit || props.scope !== "element" && VT_SSR_TRY_SEQ !== seqBefore;
    const attrs = [];
    if (named) attrs.push(["vt-name", cand.name]);
    attrs.push(["vt-update", cand.update]);
    attrs.push(["vt-enter-x", vtSsrResolve(props, "enter")]);
    attrs.push(["vt-exit-x", vtSsrResolve(props, "exit")]);
    if (named) attrs.push(["vt-share", VT_SSR_TRY_SEQ !== seqBefore ? cand.update : cand.share]);
    for (const kind of ["Enter", "Exit"]) {
      const prop = props["parent" + kind];
      const value = prop === void 0 ? void 0 : vtSsrResolve(props, "parent" + kind);
      const handler = props["onParent" + kind];
      attrs.push(["vt-parent-" + kind.toLowerCase() + "-x", value ?? (handler ? "auto" : "none")]);
    }
    const annotated = vtSsrAnnotate(inner, attrs);
    return ssrHtml(ssrBlock(props.scope === "element" ? vtSsrAnnotateScope(annotated) : annotated));
  },
  import_component_flags.COMPONENT_FLAG_BOUNDARY,
  "ViewTransition"
);
function addTransitionType(_type) {
}
const ErrorBoundary = /* @__PURE__ */ (0, import_component_flags.markComponentFlags)(
  function ErrorBoundary2(props, scope) {
    return ssrHtml(
      ssrBlock(
        (() => {
          try {
            return withAsyncIdentity(
              "error-boundary",
              "content",
              () => ssrBlock(ssrChildrenHtml(props.children, scope))
            );
          } catch (e) {
            e = normalizeThrownServerThenable(e);
            if (ssrIsSuspense(e)) throw e;
            const fb = typeof props.fallback === "function" ? props.fallback(e, NOOP) : props.fallback;
            return withAsyncIdentity(
              "error-boundary",
              "catch",
              () => ssrBlock(ssrChild(fb, scope))
            );
          }
        })()
      )
    );
  },
  import_component_flags.COMPONENT_FLAG_BOUNDARY,
  "ErrorBoundary"
);
function createContext(defaultValue) {
  const ctx = function ProviderBody(props, scope) {
    return ssrHtml(renderServerContextProvider(ctx, props, scope));
  };
  ctx.$$kind = import_runtime_tags.CONTEXT_TAG;
  ctx.defaultValue = defaultValue;
  (0, import_context_identity.registerContext)(ctx);
  if (__octaneDev) {
    (0, import_context_identity.defineRemovedContextMembers)(ctx);
  }
  return ctx;
}
function renderServerContextProvider(context, props, renderScope) {
  const scope = renderScope;
  if (scope.$$ctxValues === null) scope.$$ctxValues = /* @__PURE__ */ new Map();
  scope.$$ctxValues.set(context, props.value);
  const children = props.children;
  if (children == null) return "";
  return ssrHtml(ssrChildrenHtml(children, scope));
}
function readContext(ctx) {
  for (let s = CURRENT_SCOPE; s !== null; s = s.parent) {
    if (s.$$ctxValues !== null && s.$$ctxValues.has(ctx)) return s.$$ctxValues.get(ctx);
  }
  return ctx.defaultValue;
}
function useContext(ctx) {
  if (ctx && ctx.$$kind === import_runtime_tags.CONTEXT_TAG) return readContext(ctx);
  return readHostedForeignContext(ctx, "useContext");
}
const SSR_SUSPENSE = /* @__PURE__ */ Symbol("octane.ssr.suspense");
function ssrIsSuspense(err) {
  return err === SSR_SUSPENSE;
}
function normalizeThrownServerThenable(error) {
  if (error === null || typeof error !== "object") return error;
  try {
    if (typeof error.then !== "function") return error;
  } catch {
    return error;
  }
  if (SUSPENDED !== null) {
    SUSPENDED.push({ promise: error, key: "|throw#" + PU_ID++ });
  }
  const frame = FRAME;
  if (DEFERRED !== null && CURRENT_COMP !== null && frame !== null && !frame.deferred) {
    frame.deferred = true;
    DEFERRED.push({
      comp: CURRENT_COMP,
      props: CURRENT_PROPS,
      parentScope: CURRENT_PARENT_SCOPE,
      frame,
      signalInstanceKey: SIGNAL_COMPONENT_INSTANCE_KEY
    });
  }
  return SSR_SUSPENSE;
}
const HYDRATION_REJECTION_SEED = /* @__PURE__ */ Symbol("octane.ssr.hydration-rejection-seed");
const HYDRATION_SITE_EVENT = /* @__PURE__ */ Symbol("octane.ssr.hydration-site");
function reasonSnapshot(value, state = { active: /* @__PURE__ */ new WeakSet(), nodes: 0 }, depth = 0) {
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "undefined")
    return value;
  if (typeof value === "number") {
    return Number.isFinite(value) && !Object.is(value, -0) ? value : String(value);
  }
  if (typeof value === "bigint") return String(value);
  if (typeof value === "symbol") return "[symbol]";
  if (typeof value === "function") return "[function]";
  if (depth >= 20 || state.nodes++ >= 512) return "[truncated]";
  if (state.active.has(value)) return "[Circular]";
  state.active.add(value);
  try {
    let isArray;
    try {
      isArray = Array.isArray(value);
    } catch {
      return "[unavailable]";
    }
    if (isArray) {
      const arrayValue = value;
      let length2 = 0;
      try {
        length2 = Math.min(arrayValue.length, 512);
      } catch {
        return "[unavailable]";
      }
      const out2 = new Array(length2);
      for (let i = 0; i < length2; i++) {
        try {
          if (import_has_own.hasOwnProp.call(arrayValue, i)) {
            out2[i] = reasonSnapshot(arrayValue[i], state, depth + 1);
          }
        } catch {
          out2[i] = "[unavailable]";
        }
      }
      return out2;
    }
    const out = /* @__PURE__ */ Object.create(null);
    let keys;
    try {
      keys = Object.keys(value);
    } catch {
      return "[unavailable]";
    }
    const length = Math.min(keys.length, 512);
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      try {
        out[key] = reasonSnapshot(value[key], state, depth + 1);
      } catch {
        out[key] = "[unavailable]";
      }
    }
    if (keys.length > length) out.__octane_truncated__ = true;
    return out;
  } finally {
    state.active.delete(value);
  }
}
function isErrorReason(reason) {
  try {
    if (reason instanceof Error) return true;
    if (reason === null || typeof reason !== "object") return false;
    const tag = Object.prototype.toString.call(reason);
    return tag === "[object Error]" || tag === "[object DOMException]";
  } catch {
    return false;
  }
}
function hydrationRejectionPayload(reason) {
  try {
    return hydrationRejectionPayloadUnsafe(reason);
  } catch {
    return { kind: "fallback", message: (0, import_error_codes_server_generated.formatServerError)(23) };
  }
}
function hydrationRejectionPayloadUnsafe(reason) {
  if (typeof reason === "number" && (!Number.isFinite(reason) || Object.is(reason, -0))) {
    return {
      kind: "number",
      value: Number.isNaN(reason) ? "NaN" : Object.is(reason, -0) ? "-0" : reason === Infinity ? "Infinity" : "-Infinity"
    };
  }
  if (typeof reason === "bigint") return { kind: "bigint", value: String(reason) };
  if (typeof reason === "symbol") return { kind: "symbol", value: reason.description ?? "" };
  if (isErrorReason(reason)) {
    let name = "Error";
    let message = (0, import_error_codes_server_generated.formatServerError)(23);
    try {
      const candidate = reason.name;
      if (typeof candidate === "string") name = candidate;
    } catch {
    }
    try {
      const candidate = reason.message;
      if (typeof candidate === "string") message = candidate;
    } catch {
    }
    const fields = /* @__PURE__ */ Object.create(null);
    let keys = [];
    try {
      keys = Object.keys(reason);
    } catch {
    }
    const length = Math.min(keys.length, 512);
    const snapshotState = { active: /* @__PURE__ */ new WeakSet(), nodes: 0 };
    snapshotState.active.add(reason);
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      if (key === "name" || key === "message" || key === "stack") continue;
      try {
        fields[key] = reasonSnapshot(reason[key], snapshotState);
      } catch {
        fields[key] = "[unavailable]";
      }
    }
    if (keys.length > length) fields.__octane_truncated__ = true;
    return { kind: "error", name, message, fields };
  }
  if (typeof reason === "function") {
    return { kind: "fallback", message: (0, import_error_codes_server_generated.formatServerError)(45) };
  }
  return { kind: "value", value: reasonSnapshot(reason) };
}
function hydrationRejectionSeed(reason) {
  return { [HYDRATION_REJECTION_SEED]: hydrationRejectionPayload(reason) };
}
function isHydrationRejectionSeed(value) {
  return value !== null && typeof value === "object" && import_has_own.hasOwnProp.call(value, HYDRATION_REJECTION_SEED);
}
function recordHydrationSeed(serial, value, directSite) {
  if (serial === null) return;
  serial.push(
    directSite === void 0 ? value : {
      [HYDRATION_SITE_EVENT]: directSite,
      value
    }
  );
}
function recordSkippedHydrationSite(serial, directSite) {
  if (directSite !== void 0) recordHydrationSeed(serial, HYDRATION_SITE_EVENT, directSite);
}
function recordHydrationRejection(serial, reason, directSite) {
  recordHydrationSeed(serial, hydrationRejectionSeed(reason), directSite);
}
function hasExternalHydrationOwner(thenable) {
  try {
    return thenable[import_constants.EXTERNAL_HYDRATION_PROMISE] === true;
  } catch {
    return false;
  }
}
function use(usable, siteKey, directSite) {
  if (__octaneDev && devMemoComputeDepth !== 0) {
    console.error(
      "Do not call use() inside a useMemo() factory. Cached factories can skip context or promise reads; call use() before useMemo() and memoize the returned value instead."
    );
  }
  if (usable && usable.$$kind === import_runtime_tags.CONTEXT_TAG) {
    recordSkippedHydrationSite(SERIAL, directSite);
    return readContext(usable);
  }
  const externalOwner = hasExternalHydrationOwner(usable);
  const serial = externalOwner ? null : SERIAL;
  if (externalOwner) recordSkippedHydrationSite(SERIAL, directSite);
  if (usable == null || typeof usable.then !== "function") {
    if (!externalOwner) recordSkippedHydrationSite(SERIAL, directSite);
    return readHostedForeignContext(usable, "use");
  }
  const base = siteKey === void 0 ? "@" : typeof siteKey === "symbol" ? siteKey.toString() : String(siteKey);
  const frame = FRAME;
  let n = 0;
  let prefix = ASYNC_SCOPE;
  if (frame !== null) {
    n = nextFrameOccurrence(frame, base);
    prefix = asyncFramePath(frame);
  }
  const key = prefix + "|" + base + "#" + n;
  if (RESOLVED !== null) {
    const entryT = RESOLVED.pu.resolvedT.get(usable);
    if (entryT !== void 0) {
      RESOLVED.pu.touched?.add(usable);
      if ("reason" in entryT) {
        recordHydrationRejection(serial, entryT.reason, directSite);
        throw entryT.reason;
      }
      recordHydrationSeed(serial, entryT.value, directSite);
      return entryT.value;
    }
  }
  const resolved = RESOLVED;
  if (resolved !== null && resolved.has(key)) {
    const entry = resolved.get(key);
    const thenable = usable;
    if (entry.thenable !== thenable) {
      try {
        thenable.then(NOOP, NOOP);
      } catch {
      }
    }
    if ("reason" in entry) {
      recordHydrationRejection(serial, entry.reason, directSite);
      throw entry.reason;
    }
    recordHydrationSeed(serial, entry.value, directSite);
    return entry.value;
  }
  const instrumented = usable;
  let status = instrumented.status;
  const wasUninstrumented = status === void 0;
  if (status === "fulfilled") {
    recordHydrationSeed(serial, instrumented.value, directSite);
    return instrumented.value;
  }
  if (status === "rejected") {
    recordHydrationRejection(serial, instrumented.reason, directSite);
    throw instrumented.reason;
  }
  if (wasUninstrumented) {
    instrumented.status = "pending";
    instrumented.then(
      (value) => {
        if (instrumented.status === "pending") {
          instrumented.status = "fulfilled";
          instrumented.value = value;
        }
      },
      (reason) => {
        if (instrumented.status === "pending") {
          instrumented.status = "rejected";
          instrumented.reason = reason;
        }
      }
    );
    status = instrumented.status;
    if (status === "fulfilled") {
      recordHydrationSeed(serial, instrumented.value, directSite);
      return instrumented.value;
    }
    if (status === "rejected") {
      recordHydrationRejection(serial, instrumented.reason, directSite);
      throw instrumented.reason;
    }
  }
  if (!wasUninstrumented && typeof status === "string") {
    instrumented.then(NOOP, NOOP);
    status = instrumented.status;
    if (status === "fulfilled") {
      recordHydrationSeed(serial, instrumented.value, directSite);
      return instrumented.value;
    }
    if (status === "rejected") {
      recordHydrationRejection(serial, instrumented.reason, directSite);
      throw instrumented.reason;
    }
  }
  if (SUSPENDED !== null) SUSPENDED.push({ promise: usable, key });
  if (DEFERRED !== null && CURRENT_COMP !== null && frame !== null && !frame.deferred) {
    frame.deferred = true;
    DEFERRED.push({
      comp: CURRENT_COMP,
      props: CURRENT_PROPS,
      parentScope: CURRENT_PARENT_SCOPE,
      frame,
      signalInstanceKey: SIGNAL_COMPONENT_INSTANCE_KEY
    });
  }
  throw SSR_SUSPENSE;
}
function serverDepsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
  return true;
}
let PU_ID = 0;
function puMemo(fn, deps, siteKey, native) {
  const res = RESOLVED;
  if (res === null) return fn();
  const resolvedSiteKey = siteKey === void 0 ? void 0 : resolveHookSlot(siteKey);
  const base = resolvedSiteKey === void 0 ? "@pu" : typeof resolvedSiteKey === "symbol" ? resolvedSiteKey.toString() : String(resolvedSiteKey);
  const frame = FRAME;
  let n = 0;
  let prefix = ASYNC_SCOPE;
  if (frame !== null) {
    n = nextFrameOccurrence(frame, base);
    prefix = asyncFramePath(frame);
  }
  const key = prefix + "|" + base + "#" + n;
  const hit = res.pu.created.get(key);
  if (hit !== void 0 && serverDepsEqual(hit.deps, deps) && (native === void 0 || native.accept(hit))) {
    if (native !== void 0) native.replay(hit);
    return hit.value;
  }
  if (siteKey !== void 0) {
    const wlist = res.pu.warm.get(siteKey);
    if (wlist !== void 0) {
      for (let i = 0; i < wlist.length; i++) {
        const warmed = wlist[i];
        if (serverDepsEqual(warmed.deps, deps)) {
          if (!warmed.available || native !== void 0 && !native.accept(warmed)) continue;
          warmed.available = false;
          const value = warmed.value;
          const creation2 = {
            deps,
            value,
            site: resolvedSiteKey,
            frame
          };
          if (native !== void 0) {
            creation2.nativeWitness = warmed.nativeWitness;
            native.replay(creation2);
          }
          res.pu.created.set(key, creation2);
          return value;
        }
      }
    }
  }
  const creation = native === void 0 ? { deps, value: fn(), site: resolvedSiteKey, frame } : native.create(fn, deps, resolvedSiteKey, frame);
  res.pu.created.set(key, creation);
  return creation.value;
}
function nativeServerMemoEvidenceValid(entry) {
  return entry.nativeWitness !== void 0 && (0, import_native_read_collector.validateNativeReadWitness)(entry.nativeWitness);
}
function replayNativeServerMemo(entry) {
  replayNativeReadWitness(entry.nativeWitness);
}
function createNativeServerMemo(compute, deps, site, frame) {
  const token = beginNativeReadWitness();
  let completed = false;
  let value;
  let nativeWitness;
  try {
    value = compute();
    completed = true;
  } finally {
    nativeWitness = finishNativeReadWitness(token, completed);
  }
  return { deps, value, site, frame, nativeWitness };
}
const NATIVE_SERVER_MEMO_MODE = {
  accept: nativeServerMemoEvidenceValid,
  replay: replayNativeServerMemo,
  create: createNativeServerMemo
};
function nativePuMemo(fn, deps, siteKey) {
  return puMemo(fn, deps, siteKey, NATIVE_SERVER_MEMO_MODE);
}
function puBatch(thenables, warm) {
  if (thenables.length === 0) {
    if (warm !== void 0) ACTIVE_PU_WARM_PLANS.push(warm);
    return;
  }
  const res = RESOLVED;
  const pu = res !== null ? res.pu : null;
  const disabled = pu !== null && pu.batchDisabled === true;
  let pending = false;
  for (let i = 0; i < thenables.length; i++) {
    const t = thenables[i];
    if (t == null || typeof t.then !== "function") continue;
    if (pu !== null && pu.resolvedT.has(t)) {
      pu.touched?.add(t);
      continue;
    }
    const instrumented = t;
    let status = instrumented.status;
    const wasUninstrumented = status === void 0;
    if (wasUninstrumented) {
      instrumented.status = "pending";
      instrumented.then(
        (value) => {
          if (instrumented.status === "pending") {
            instrumented.status = "fulfilled";
            instrumented.value = value;
          }
        },
        (reason) => {
          if (instrumented.status === "pending") {
            instrumented.status = "rejected";
            instrumented.reason = reason;
          }
        }
      );
      status = instrumented.status;
    }
    if (!wasUninstrumented && typeof status === "string" && status !== "fulfilled" && status !== "rejected") {
      instrumented.then(NOOP, NOOP);
      status = instrumented.status;
    }
    if (status === "fulfilled") {
      pu?.resolvedT.set(t, { value: instrumented.value });
      continue;
    }
    if (status === "rejected") {
      pu?.resolvedT.set(t, { reason: instrumented.reason });
      continue;
    }
    pending = true;
    if (!disabled && SUSPENDED !== null) SUSPENDED.push({ promise: t, key: "|pu#" + PU_ID++ });
  }
  if (!pending || disabled) return;
  if (ACTIVE_PU_WARM_PLANS.length !== 0 || warm !== void 0) {
    const previousClaims = CURRENT_PU_WARM_CLAIMS;
    CURRENT_PU_WARM_CLAIMS = /* @__PURE__ */ new Set();
    try {
      for (let i = 0; i < ACTIVE_PU_WARM_PLANS.length; i++) {
        CURRENT_PU_WARM_CLAIMS = /* @__PURE__ */ new Set();
        try {
          ACTIVE_PU_WARM_PLANS[i]();
        } catch {
        }
      }
      if (warm !== void 0) {
        CURRENT_PU_WARM_CLAIMS = /* @__PURE__ */ new Set();
        try {
          warm();
        } catch {
        }
      }
    } finally {
      CURRENT_PU_WARM_CLAIMS = previousClaims;
    }
  }
  const frame = FRAME;
  if (DEFERRED !== null && CURRENT_COMP !== null && frame !== null && !frame.deferred) {
    frame.deferred = true;
    DEFERRED.push({
      comp: CURRENT_COMP,
      props: CURRENT_PROPS,
      parentScope: CURRENT_PARENT_SCOPE,
      frame,
      signalInstanceKey: SIGNAL_COMPONENT_INSTANCE_KEY
    });
  }
  throw SSR_SUSPENSE;
}
let WARM_DEPTH = 0;
const WARM_DEPTH_CAP = 64;
function warmMemo(compute, deps, slot, native) {
  const res = RESOLVED;
  if (res === null) return void 0;
  const warm = res.pu.warm;
  let list = warm.get(slot);
  if (list !== void 0) {
    for (let i = 0; i < list.length; i++) {
      const entry2 = list[i];
      if (!serverDepsEqual(entry2.deps, deps) || CURRENT_PU_WARM_CLAIMS?.has(entry2) || native !== void 0 && !native.accept(entry2))
        continue;
      CURRENT_PU_WARM_CLAIMS?.add(entry2);
      return entry2.value;
    }
  }
  let activeCreation;
  for (const created of res.pu.created.values()) {
    if (created.site === slot && serverDepsEqual(created.deps, deps) && !CURRENT_PU_WARM_CLAIMS?.has(created) && (native === void 0 || native.accept(created))) {
      activeCreation = created;
      break;
    }
  }
  if (activeCreation !== void 0) {
    CURRENT_PU_WARM_CLAIMS?.add(activeCreation);
    if (list === void 0) {
      list = [];
      warm.set(slot, list);
    }
    const entry2 = { deps, value: activeCreation.value, available: false };
    if (native !== void 0) entry2.nativeWitness = activeCreation.nativeWitness;
    list.push(entry2);
    CURRENT_PU_WARM_CLAIMS?.add(entry2);
    return activeCreation.value;
  }
  let entry;
  try {
    entry = native === void 0 ? { deps, value: compute(), available: true } : native.create(compute, deps);
  } catch {
    return void 0;
  }
  const value = entry.value;
  if (list === void 0) {
    list = [];
    warm.set(slot, list);
  }
  list.push(entry);
  CURRENT_PU_WARM_CLAIMS?.add(entry);
  if (value != null && typeof value.then === "function" && !res.pu.resolvedT.has(value)) {
    if (SUSPENDED !== null)
      SUSPENDED.push({ promise: value, key: "|pu#" + PU_ID++ });
  }
  return value;
}
function createNativeServerWarm(compute, deps) {
  const token = beginNativeReadWitness(true);
  let completed = false;
  let value;
  let nativeWitness;
  try {
    value = compute();
    completed = true;
  } finally {
    nativeWitness = finishNativeReadWitness(token, completed);
  }
  return { deps, value, available: true, nativeWitness };
}
const NATIVE_SERVER_WARM_MODE = {
  accept: nativeServerMemoEvidenceValid,
  create: createNativeServerWarm
};
function nativeWarmMemo(compute, deps, slot) {
  return warmMemo(compute, deps, slot, NATIVE_SERVER_WARM_MODE);
}
function warmChild(comp, props) {
  if (comp == null) return;
  const plan = comp.__warm;
  if (typeof plan !== "function") return;
  if (WARM_DEPTH >= WARM_DEPTH_CAP) return;
  WARM_DEPTH++;
  try {
    plan(props);
  } catch {
  } finally {
    WARM_DEPTH--;
  }
}
let LAZY_ID = 0;
function resolveLazyModule(mod) {
  let comp = mod;
  if (mod != null) {
    const defaultExport = mod.default;
    if (defaultExport !== void 0) comp = defaultExport;
  }
  if (typeof comp !== "function" || comp[import_runtime_tags.LAZY_COMPONENT_TAG] === true) {
    throw new Error(
      (0, import_error_codes_server_generated.formatServerError)(
        10,
        comp?.[import_runtime_tags.LAZY_COMPONENT_TAG] === true ? "lazy component" : typeof comp
      )
    );
  }
  return comp;
}
function lazy(load) {
  let status = "uninitialized";
  let result = null;
  let promise = null;
  const key = "|lazy#" + LAZY_ID++;
  let displayName;
  let resolvedName = "Lazy";
  const callResolved = (props, scope, extra) => {
    const comp = resolveLazyModule(result);
    resolvedName = comp.displayName || comp.name || "Lazy";
    return comp((0, import_shared_value_helpers.resolveLazyDefaultProps)(comp, props), scope, extra);
  };
  const lazyWrapper = (props, scope, extra) => {
    if (status === "fulfilled") {
      return callResolved(props, scope, extra);
    }
    if (status === "rejected") throw result;
    if (status === "uninitialized") {
      try {
        const loaded = load();
        promise = loaded;
        loaded.then(
          (mod) => {
            if (status === "uninitialized" || status === "pending") {
              status = "fulfilled";
              result = mod;
            }
          },
          (err) => {
            if (status === "uninitialized" || status === "pending") {
              status = "rejected";
              result = err;
            }
          }
        );
      } catch (error) {
        if (status === "uninitialized") promise = null;
        throw error;
      }
      if (status === "uninitialized") status = "pending";
      const settledStatus = status;
      if (settledStatus === "fulfilled") {
        return callResolved(props, scope, extra);
      }
      if (settledStatus === "rejected") throw result;
    }
    if (SUSPENDED !== null) SUSPENDED.push({ promise, key });
    const frame = FRAME;
    if (DEFERRED !== null && CURRENT_COMP !== null && frame !== null && !frame.deferred) {
      frame.deferred = true;
      DEFERRED.push({
        comp: CURRENT_COMP,
        props: CURRENT_PROPS,
        parentScope: CURRENT_PARENT_SCOPE,
        frame,
        signalInstanceKey: SIGNAL_COMPONENT_INSTANCE_KEY
      });
    }
    throw SSR_SUSPENSE;
  };
  Object.defineProperty(lazyWrapper, import_runtime_tags.LAZY_COMPONENT_TAG, {
    get() {
      return this === lazyWrapper;
    }
  });
  Object.defineProperty(lazyWrapper, "displayName", {
    configurable: true,
    get: () => displayName ?? resolvedName,
    set: (value) => {
      displayName = value;
    }
  });
  return lazyWrapper;
}
function useState(initial, slot) {
  if (slot === void 0 && typeof initial === "symbol" && arguments.length === 1 && (HOOK_SLOT_PATH.length === 0 || MANUAL_HOOK_DRIVER?.active === true)) {
    slot = initial;
    initial = void 0;
  }
  return stateHook(
    basicStateReducer,
    () => typeof initial === "function" ? initial() : initial,
    slot
  );
}
function __useStateWithGetter(initial, slot) {
  if (slot === void 0 && typeof initial === "symbol" && arguments.length === 1 && (HOOK_SLOT_PATH.length === 0 || MANUAL_HOOK_DRIVER?.active === true)) {
    slot = initial;
    initial = void 0;
  }
  return stateHook(
    basicStateReducer,
    () => typeof initial === "function" ? initial() : initial,
    slot,
    true
  );
}
function linkedStateHook(source, reconcile, optionsOrSlot, maybeSlot, withGetter) {
  const options = optionsOrSlot !== null && typeof optionsOrSlot === "object" ? optionsOrSlot : void 0;
  const slot = maybeSlot ?? (options === void 0 ? optionsOrSlot : void 0);
  const hp = HOOK_PASS;
  if (hp === null) {
    const value = reconcile(source, void 0);
    return withGetter ? [value, NOOP, () => value] : [value, NOOP];
  }
  const position = hookPosition(slot);
  const { list, index } = position;
  let record = list[index];
  const sourceEqual = options?.sourceEqual ?? Object.is;
  const valueEqual = options?.valueEqual ?? Object.is;
  if (record === void 0) {
    const initial = reconcile(source, void 0);
    const current = {
      source,
      value: initial,
      pendingValue: initial,
      queue: [],
      valueEqual,
      dispatch(action) {
        if (hp !== HOOK_PASS) return;
        const previous = current.pendingValue;
        const next = typeof action === "function" ? action(previous) : action;
        if (current.valueEqual(previous, next)) return;
        current.pendingValue = next;
        current.queue.push(next);
        hp.update = true;
      }
    };
    list[index] = record = current;
  } else {
    if (record.queue.length !== 0) {
      record.value = record.pendingValue;
      record.queue.length = 0;
    }
    record.valueEqual = valueEqual;
    if (!sourceEqual(record.source, source)) {
      const previous = { source: record.source, value: record.value };
      const next = reconcile(source, previous);
      record.value = valueEqual(record.value, next) ? record.value : next;
      record.pendingValue = record.value;
      record.source = source;
    }
  }
  if (!withGetter) return [record.value, record.dispatch];
  const getter = record.getter ??= () => record.pendingValue;
  return [record.value, record.dispatch, getter];
}
function useLinkedState(source, reconcile, optionsOrSlot, maybeSlot) {
  return linkedStateHook(source, reconcile, optionsOrSlot, maybeSlot, false);
}
function __useLinkedStateWithGetter(source, reconcile, optionsOrSlot, maybeSlot) {
  return linkedStateHook(source, reconcile, optionsOrSlot, maybeSlot, true);
}
function useReducer(reducer, initialArg, initOrSlot, maybeSlot) {
  const init = typeof initOrSlot === "function" ? initOrSlot : void 0;
  const slot = maybeSlot !== void 0 ? maybeSlot : initOrSlot;
  return stateHook(
    reducer,
    () => init ? init(initialArg) : initialArg,
    slot
  );
}
function __useReducerWithGetter(reducer, initialArg, initOrSlot, maybeSlot) {
  const init = typeof initOrSlot === "function" ? initOrSlot : void 0;
  const slot = maybeSlot !== void 0 ? maybeSlot : initOrSlot;
  return stateHook(
    reducer,
    () => init ? init(initialArg) : initialArg,
    slot,
    true
  );
}
function useEffect() {
}
const useLayoutEffect = useEffect;
const useInsertionEffect = useEffect;
function useImperativeHandle() {
}
let devMemoComputeDepth = 0;
function memoHookValue(input, compute, depsOrSlot, maybeSlot) {
  const deps = Array.isArray(depsOrSlot) ? depsOrSlot : null;
  const slot = maybeSlot ?? (Array.isArray(depsOrSlot) || depsOrSlot === null ? void 0 : depsOrSlot);
  if (deps === null) return compute ? input() : input;
  const position = hookPosition(slot);
  if (position === null)
    return compute ? input(...deps) : input;
  let rec = position.list[position.index];
  if (rec === void 0) {
    rec = {
      value: compute ? input(...deps) : input,
      deps: deps.slice()
    };
    position.list[position.index] = rec;
  } else if (!serverDepsEqual(rec.deps, deps)) {
    rec.value = compute ? input(...deps) : input;
    rec.deps = deps.slice();
  }
  return rec.value;
}
function useMemo(compute, depsOrSlot, maybeSlot) {
  if (__octaneDev) {
    devMemoComputeDepth++;
    try {
      return memoHookValue(compute, true, depsOrSlot, maybeSlot);
    } finally {
      devMemoComputeDepth--;
    }
  }
  return memoHookValue(compute, true, depsOrSlot, maybeSlot);
}
function useCallback(fn, depsOrSlot, maybeSlot) {
  return memoHookValue(fn, false, depsOrSlot, maybeSlot);
}
function useRef(initial, slot) {
  if (slot === void 0 && typeof initial === "symbol" && arguments.length === 1 && (HOOK_SLOT_PATH.length === 0 || MANUAL_HOOK_DRIVER?.active === true)) {
    slot = initial;
    initial = void 0;
  }
  const position = hookPosition(slot);
  if (position === null) return { current: initial };
  let rec = position.list[position.index];
  if (rec === void 0) {
    rec = { ref: { current: initial } };
    position.list[position.index] = rec;
  }
  return rec.ref;
}
function useDebugValue(_value, _format) {
}
function requestFormReset(_form) {
}
function useId() {
  return (0, import_hydration_markers.formatUseId)(ID_PREFIX, ID_COUNTER++);
}
function throwOnServerEffectEventCall() {
  throw new Error((0, import_error_codes_server_generated.formatServerError)(11));
}
function useEffectEvent(_fn) {
  return throwOnServerEffectEventCall;
}
function useTransition() {
  return [false, NOOP];
}
function useDeferredValue(value, initialValueOrSlot = void 0, _slot) {
  return arguments.length >= 3 ? initialValueOrSlot : value;
}
function useSyncExternalStore(_subscribe, getSnapshot, serverSnapshotOrSlot = void 0, _slot) {
  const getServerSnapshot = arguments.length >= 4 ? serverSnapshotOrSlot : void 0;
  return getServerSnapshot ? getServerSnapshot() : getSnapshot();
}
function useActionState(_action, initialState) {
  return [initialState, NOOP, false];
}
function useFormStatus() {
  return { pending: false, data: null, method: null, action: null };
}
function useOptimistic(passthrough) {
  return [passthrough, NOOP];
}
const MEMO_OWNER = /* @__PURE__ */ Symbol("memoOwner");
const MEMO_MARKER_DESCRIPTOR = {
  get() {
    return this === this[MEMO_OWNER];
  }
};
const MEMO_DEFAULT_PROPS_DESCRIPTOR = {
  configurable: true,
  // Static hoisters must copy `type` along with this accessor.
  get() {
    return this.type.defaultProps;
  },
  set(value) {
    this.type.defaultProps = value;
  }
};
function memo(component) {
  const memoWrapper = (props, scope, extra) => component(props, scope, extra);
  Object.defineProperty(memoWrapper, MEMO_OWNER, { value: memoWrapper });
  Object.defineProperty(memoWrapper, "type", { value: component });
  Object.defineProperty(memoWrapper, "displayName", {
    configurable: true,
    writable: true,
    value: component.displayName || component.name || "Memo"
  });
  Object.defineProperty(memoWrapper, "__memo", MEMO_MARKER_DESCRIPTOR);
  Object.defineProperty(memoWrapper, "defaultProps", MEMO_DEFAULT_PROPS_DESCRIPTOR);
  return memoWrapper;
}
function markWarm(component, plan) {
  Object.defineProperty(component, "__warm", {
    configurable: true,
    get() {
      return this === component ? plan : void 0;
    }
  });
  return component;
}
let MANUAL_HOOK_DRIVER = null;
function invokeManualHook(fn, receiver, args) {
  const driver = MANUAL_HOOK_DRIVER ??= {
    pending: HOOK_SLOT_PATH[HOOK_SLOT_PATH.length - 1],
    active: false
  };
  const pending = driver.pending;
  const active = driver.active;
  driver.pending = void 0;
  driver.active = true;
  try {
    if (pending === void 0) return Reflect.apply(fn, receiver, args);
    switch (args.length) {
      case 0:
        return fn.call(receiver, pending);
      case 1:
        return fn.call(receiver, args[0], pending);
      case 2:
        return fn.call(receiver, args[0], args[1], pending);
      case 3:
        return fn.call(receiver, args[0], args[1], args[2], pending);
      case 4:
        return fn.call(receiver, args[0], args[1], args[2], args[3], pending);
      default: {
        const forwarded = new Array(args.length + 1);
        for (let index = 0; index < args.length; index++) forwarded[index] = args[index];
        forwarded[args.length] = pending;
        return fn.apply(receiver, forwarded);
      }
    }
  } finally {
    driver.pending = pending;
    driver.active = active;
  }
}
function manualHook(fn, name) {
  function provider() {
    return invokeManualHook(fn, this, arguments);
  }
  Object.defineProperty(provider, "name", { value: name ?? fn.name, configurable: true });
  Object.defineProperty(provider, "length", { value: fn.length, configurable: true });
  return provider;
}
function callWithReceiver(fn, receiver, ...args) {
  return NATIVE_REFLECT_APPLY(fn, receiver, args);
}
function withSlot(sym, fn, ...args) {
  const driver = MANUAL_HOOK_DRIVER;
  const pending = driver?.pending;
  const active = driver?.active ?? false;
  if (driver !== null) {
    driver.pending = sym;
    driver.active = false;
  }
  HOOK_SLOT_PATH.push(sym);
  try {
    return fn(...args);
  } finally {
    HOOK_SLOT_PATH.pop();
    if (MANUAL_HOOK_DRIVER !== null) {
      MANUAL_HOOK_DRIVER.pending = driver === null ? HOOK_SLOT_PATH[HOOK_SLOT_PATH.length - 1] : pending;
      MANUAL_HOOK_DRIVER.active = active;
    }
  }
}
function startTransition(fn) {
  fn();
}
function flushSync(fn) {
  return fn();
}
function markChildrenBlock(fn) {
  if (typeof fn === "function") {
    fn[import_runtime_tags.CHILDREN_BLOCK_TAG] = true;
  }
  return fn;
}
function descriptorChildren(component) {
  return component;
}
function isChildrenBlock(value) {
  return typeof value === "function" && value[import_runtime_tags.CHILDREN_BLOCK_TAG] === true;
}
function injectStyle(id, css, nonce) {
  if (CSS !== null) {
    const previous = CSS.get(id);
    if (previous !== void 0 && previous.css === css && previous.nonce === nonce) return;
    if (previous === void 0) {
      const applied = REGISTERED_STYLES?.get(id)?.applied;
      if (applied != null) {
        for (const hash of applied) {
          if (hash === id || CSS.has(hash)) continue;
          const dependency = REGISTERED_STYLES.get(hash);
          if (dependency !== void 0) injectStyle(hash, dependency.css);
        }
      }
    }
    CSS.replay = null;
    CSS.set(id, nonce === void 0 ? { css } : { css, nonce });
  }
}
function styleMap(id, css, map, applied = []) {
  if (id !== null && css !== null) {
    const classes = applied.length === 0 ? id : map.$class;
    const previous = REGISTERED_STYLES?.get(id);
    if (previous === void 0 || previous.css !== css || previous.classes !== classes) {
      (REGISTERED_STYLES ??= /* @__PURE__ */ new Map()).set(id, {
        id,
        css,
        classes,
        applied: classes === id ? null : classes.split(" ")
      });
    }
  }
  let touching = false;
  const touch = () => {
    if (CSS === null || touching) return;
    touching = true;
    try {
      for (const dependency of applied) touchStyleMap(dependency);
      if (id !== null && css !== null) injectStyle(id, css);
    } finally {
      touching = false;
    }
  };
  return new Proxy(map, {
    get(target, key, receiver) {
      touch();
      return Reflect.get(target, key, receiver);
    }
  });
}
function classWhitespace(code) {
  return code === 32 || code === 9 || code === 10 || code === 12 || code === 13;
}
function collectClassStyles(classes, collector) {
  let start = classes.indexOf("tsrx-");
  if (start === 0 && collector.has(classes)) return;
  while (start !== -1) {
    let end = start + 5;
    if (start === 0 || classWhitespace(classes.charCodeAt(start - 1))) {
      while (end < classes.length && !classWhitespace(classes.charCodeAt(end))) end++;
      const hash = classes.slice(start, end);
      if (!collector.has(hash)) {
        const style = REGISTERED_STYLES.get(hash);
        if (style !== void 0) injectStyle(style.id, style.css);
      }
    }
    start = classes.indexOf("tsrx-", end);
  }
}
function touchStyleMap(map) {
  if (map !== null && typeof map === "object") void map.$class;
}
const HEAD_VOID_ELEMENTS = /* @__PURE__ */ new Set(["meta", "link", "base"]);
function ssrHeadEl(key, tag, attrs, text) {
  if (HEAD === null || FALLBACK_HOIST_DEPTH !== 0) return "";
  const rootSuffix = HEAD.rootSuffix;
  const ownershipKey = MARKERS ? rootSuffix === "" ? key : key + rootSuffix : "";
  let s = (MARKERS ? "<!--" + ownershipKey + "-->" : "") + "<" + tag;
  if (attrs !== null) {
    for (const k in attrs) {
      s += ssrAttrEntry(k, attrs[k], tag, "html");
    }
  }
  if (HEAD_VOID_ELEMENTS.has(tag)) {
    s += ">";
  } else {
    s += ">" + (text == null ? "" : escapeHtml(text)) + "</" + tag + ">";
  }
  if (MARKERS) s += "<!--/" + ownershipKey + "-->";
  if (tag === "meta" && attrs !== null) {
    if (attrs.charSet !== void 0 || attrs.charset !== void 0) {
      HEAD.charset += s;
      return "";
    }
    if (attrs.name === "viewport") {
      HEAD.viewport += s;
      return "";
    }
  }
  HEAD.html += s;
  return "";
}
function namespaceHead(props) {
  if ((FRAME?.namespace ?? "html") !== "html") {
    return createElement(props.tag, props.attrs, props.text);
  }
  let headAttrs = null;
  if (props.attrs !== null) {
    headAttrs = {};
    for (const key in props.attrs) {
      if (key === "key" || key === "ref" || key === "class" || key === "className") continue;
      headAttrs[key] = props.attrs[key];
    }
  }
  ssrHeadEl(props.headKey, props.tag, headAttrs, props.text);
  return null;
}
function namespaceHeadElement(headKey, tag, attrs, text, authoredKey) {
  const key = authoredKey !== void 0 ? authoredKey : attrs?.key;
  const config = { headKey, tag, attrs, text };
  if (key !== void 0) config.key = key;
  return createElement(namespaceHead, config);
}
function spliceHead(body, head, documentRoot = isDocumentRoot(body)) {
  if (!documentRoot && (head === "" || !isLeadingHeadRoot(body)))
    return head === "" ? body : head + body;
  const headClose = documentRoot ? body.indexOf("</head>") : findFragmentHeadClose(body, documentHeadInsertionPoint(body));
  if (headClose !== -1) return body.slice(0, headClose) + head + body.slice(headClose);
  if (!documentRoot) return head + body;
  const openingEnd = documentTagEnd(body, body.indexOf("<html") + 5);
  if (openingEnd !== -1)
    return body.slice(0, openingEnd) + "<head>" + head + "</head>" + body.slice(openingEnd);
  if (head === "") return body;
  return head + body;
}
function renderEntryValue(props, scope) {
  return ssrHtml(ssrChild(props.value, scope));
}
const MAX_SUSPENSE_PASSES = 50;
let SUSPENSE_TIMEOUT_MS = 1e4;
function setSsrSuspenseTimeout(ms) {
  SUSPENSE_TIMEOUT_MS = ms;
}
function getSsrSuspenseTimeout() {
  return SUSPENSE_TIMEOUT_MS;
}
function serializeSuspenseSeedJson(values) {
  let wireValues = null;
  let rejections = null;
  let sites = null;
  let hasSeededSite = false;
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    if (value !== null && typeof value === "object" && import_has_own.hasOwnProp.call(value, HYDRATION_SITE_EVENT)) {
      wireValues ??= values.slice(0, i);
      sites ??= [];
      const event = value;
      value = event.value;
      if (value === HYDRATION_SITE_EVENT) {
        sites.push([event[HYDRATION_SITE_EVENT], -1]);
        continue;
      }
      hasSeededSite = true;
      sites.push([event[HYDRATION_SITE_EVENT], wireValues.length]);
    }
    if (isHydrationRejectionSeed(value)) {
      wireValues ??= values.slice(0, i);
      rejections ??= [];
      rejections.push([wireValues.length, value[HYDRATION_REJECTION_SEED]]);
      wireValues.push(null);
    } else if (wireValues !== null) {
      wireValues.push(value);
    }
  }
  const actualValues = wireValues ?? values;
  const payload = rejections === null && !hasSeededSite ? actualValues : {
    [import_constants.REJECTION_SENTINEL_KEY]: {
      version: 1,
      values: actualValues,
      rejections: rejections ?? [],
      ...hasSeededSite ? { sites } : {}
    }
  };
  const undefinedWire = import_constants.SUSPENSE_SEED_WIRE_PREFIX + "u";
  const escapedStringWire = import_constants.SUSPENSE_SEED_WIRE_PREFIX + "s";
  return JSON.stringify(payload, (_key, value) => {
    if (value === void 0) return undefinedWire;
    if (typeof value === "string" && value.startsWith(import_constants.SUSPENSE_SEED_WIRE_PREFIX)) {
      return escapedStringWire + value;
    }
    return value;
  }).replace(/</g, "\\u003c");
}
function serializeSuspenseSeeds(values, nonceAttr, attr = import_constants.SUSPENSE_SCRIPT_ATTR) {
  const json = serializeSuspenseSeedJson(values);
  if (json === "[]") return "";
  return '<script type="application/json" ' + attr + nonceAttr + ">" + json + "</script>";
}
function serializeNativeSignalSeeds(signals, nonceAttr, attr = import_native_read_seeds.NATIVE_SIGNAL_SEED_ATTR) {
  const json = JSON.stringify(signals).replace(/</g, "\\u003c");
  return '<script type="application/json" ' + attr + nonceAttr + ">" + json + "</script>";
}
let SERVER_SIGNAL_BINDINGS_ENABLED = false;
let SERVER_SIGNAL_BINDINGS_POTENTIAL = false;
function enableServerSignalBindings(abi = 1, potentialOnly = false) {
  if (abi !== 1) throw new TypeError((0, import_error_codes_server_generated.formatServerError)(71));
  SERVER_SIGNAL_BINDINGS_POTENTIAL = true;
  if (!potentialOnly) SERVER_SIGNAL_BINDINGS_ENABLED = true;
}
function isRendererSignalOwner(owner) {
  return "documentOwner" in owner;
}
function newResolvedMap(resourceOptions) {
  const m = /* @__PURE__ */ new Map();
  if (resourceOptions !== void 0) m.resourceOptions = resourceOptions;
  if (SERVER_SIGNAL_BINDINGS_ENABLED || resourceOptions?.signalOwner !== void 0 || resourceOptions?.initialDocumentSignals !== void 0) {
    const ambient = (0, import_owner_context.currentSignalOwner)();
    const configured = resourceOptions?.signalOwner ?? ambient;
    m.signalOwner = configured === void 0 || configured === null ? Object.freeze({ scopeKey: "octane:document" }) : isRendererSignalOwner(configured) ? configured.documentOwner : configured;
    m.ownedSignalOwner = configured === void 0 || configured === null;
    m.signalInstances = /* @__PURE__ */ new Map();
  }
  if (resourceOptions?.initialDocumentSignals !== void 0)
    m.initialDocumentSignals = (0, import_native_read_seeds.captureInitialDocumentSignals)(
      resourceOptions.initialDocumentSignals,
      m.signalOwner.scopeKey
    );
  m.asyncIdentities = /* @__PURE__ */ new Map();
  m.asyncPositionIdentities = /* @__PURE__ */ new Map();
  m.nextAsyncIdentity = 0;
  m.pu = { created: /* @__PURE__ */ new Map(), resolvedT: /* @__PURE__ */ new Map(), warm: /* @__PURE__ */ new Map() };
  return m;
}
function getServerRenderResourceContext() {
  const resolved = RESOLVED;
  if (resolved === null || resolved.resourceOptions === void 0) return null;
  if (resolved.resources !== void 0) return resolved.resources;
  const options = resolved.resourceOptions;
  const resources = {
    signal: options?.signal,
    nonce: options?.nonce,
    timeoutMs: options?.timeoutMs ?? SUSPENSE_TIMEOUT_MS,
    finished: false,
    cleanups: /* @__PURE__ */ new Map(),
    registerCleanup(cleanup) {
      if (resources.finished) {
        cleanup();
        return NOOP;
      }
      const release = () => {
        resources.cleanups.delete(release);
      };
      resources.cleanups.set(release, cleanup);
      return release;
    }
  };
  resolved.resources = resources;
  return resources;
}
function releaseServerRenderResources(resolved) {
  const settlements = resolved.streamSettlements;
  if (settlements !== void 0) {
    resolved.streamSettlements = void 0;
    settlements.resolved = null;
    settlements.wake = null;
    for (const recorder of settlements.pending.values()) recorder.keys = null;
    settlements.pending.clear();
  }
  const resources = resolved.resources;
  resolved.resourceOptions = void 0;
  resolved.initialDocumentSignals = void 0;
  if (resolved.signalInstances !== void 0) {
    for (const owner of resolved.signalInstances.values()) (0, import_owner_context.retireSignalOwnerIdentity)(owner);
    resolved.signalInstances.clear();
  }
  resolved.signalIdentityKeys?.clear();
  if (resolved.ownedSignalOwner && resolved.signalOwner !== void 0) {
    (0, import_owner_context.retireSignalOwnerIdentity)(resolved.signalOwner);
  }
  if (resources !== void 0) resolved.resources = void 0;
  if (resources === void 0 || resources.finished) return;
  resources.finished = true;
  let failure;
  for (const [release, cleanup] of resources.cleanups) {
    resources.cleanups.delete(release);
    try {
      cleanup();
    } catch (error) {
      failure ??= { error };
    }
  }
  if (failure !== void 0) throw failure.error;
}
function saveAmbient() {
  return {
    scope: CURRENT_SCOPE,
    nativePass: NATIVE_SERVER_PASS,
    nativeReads: NATIVE_SERVER_READS,
    nativeFailures: NATIVE_SERVER_FAILURES,
    nativeLocalDisposes: NATIVE_LOCAL_HOOK_DISPOSES,
    warmPlans: ACTIVE_PU_WARM_PLANS.slice(),
    warmClaims: CURRENT_PU_WARM_CLAIMS,
    id: ID_COUNTER,
    idPrefix: ID_PREFIX,
    signalInstancePrefix: SIGNAL_INSTANCE_PREFIX,
    signalComponentInstanceKey: SIGNAL_COMPONENT_INSTANCE_KEY,
    signalOwnerActive: SERVER_SIGNAL_OWNER_ACTIVE,
    signalControlSite: SIGNAL_CONTROL_SITE,
    signalListKeys: SIGNAL_LIST_KEYS,
    css: CSS,
    nonceAttr: NONCE_ATTR,
    markers: MARKERS,
    permanentStaticHydrateDepth: PERMANENT_STATIC_HYDRATE_DEPTH,
    head: HEAD,
    fallbackHoistDepth: FALLBACK_HOIST_DEPTH,
    susp: SUSPENDED,
    res: RESOLVED,
    serial: SERIAL,
    frame: FRAME,
    deferred: DEFERRED,
    comp: CURRENT_COMP,
    props: CURRENT_PROPS,
    parentScope: CURRENT_PARENT_SCOPE,
    asyncScope: ASYNC_SCOPE,
    ssrElement: CURRENT_SSR_ELEMENT,
    nestingWarnings: SSR_NESTING_WARNINGS,
    vtTrySeq: VT_SSR_TRY_SEQ,
    vtHasCandidates: VT_SSR_HAS_CANDIDATES,
    vtHasRawHtml: VT_SSR_HAS_RAW_HTML,
    vtStack: snapshotVtStack()
  };
}
function restoreAmbient(a) {
  let disposalError;
  if (NATIVE_LOCAL_HOOK_DISPOSES !== null) {
    const disposes = NATIVE_LOCAL_HOOK_DISPOSES;
    NATIVE_LOCAL_HOOK_DISPOSES = null;
    const collector = NATIVE_READ_COLLECTOR;
    const token = collector?.pauseLifecycle() ?? -1;
    try {
      for (let i = disposes.length - 1; i >= 0; i--) {
        try {
          disposes[i]();
        } catch (error) {
          disposalError ??= { value: error };
        }
      }
    } finally {
      if (token >= 0) collector.resumeLifecycle(token);
    }
  }
  if (NATIVE_SERVER_PASS >= 0) NATIVE_READ_COLLECTOR.endPass(NATIVE_SERVER_PASS);
  NATIVE_SERVER_PASS = a.nativePass;
  NATIVE_SERVER_READS = a.nativeReads;
  NATIVE_SERVER_FAILURES = a.nativeFailures;
  NATIVE_LOCAL_HOOK_DISPOSES = a.nativeLocalDisposes;
  CURRENT_SCOPE = a.scope;
  ACTIVE_PU_WARM_PLANS.length = 0;
  ACTIVE_PU_WARM_PLANS.push(...a.warmPlans);
  CURRENT_PU_WARM_CLAIMS = a.warmClaims;
  ID_COUNTER = a.id;
  ID_PREFIX = a.idPrefix;
  SIGNAL_INSTANCE_PREFIX = a.signalInstancePrefix;
  SIGNAL_COMPONENT_INSTANCE_KEY = a.signalComponentInstanceKey;
  SERVER_SIGNAL_OWNER_ACTIVE = a.signalOwnerActive;
  SIGNAL_CONTROL_SITE = a.signalControlSite;
  SIGNAL_LIST_KEYS = a.signalListKeys;
  CSS = a.css;
  NONCE_ATTR = a.nonceAttr;
  MARKERS = a.markers;
  PERMANENT_STATIC_HYDRATE_DEPTH = a.permanentStaticHydrateDepth;
  HEAD = a.head;
  FALLBACK_HOIST_DEPTH = a.fallbackHoistDepth;
  SUSPENDED = a.susp;
  RESOLVED = a.res;
  SERIAL = a.serial;
  FRAME = a.frame;
  DEFERRED = a.deferred;
  CURRENT_COMP = a.comp;
  CURRENT_PROPS = a.props;
  CURRENT_PARENT_SCOPE = a.parentScope;
  ASYNC_SCOPE = a.asyncScope;
  CURRENT_SSR_ELEMENT = a.ssrElement;
  SSR_NESTING_WARNINGS = a.nestingWarnings;
  VT_SSR_TRY_SEQ = a.vtTrySeq;
  VT_SSR_HAS_CANDIDATES = a.vtHasCandidates;
  VT_SSR_HAS_RAW_HTML = a.vtHasRawHtml;
  VT_SSR_STACK.length = 0;
  for (const snapshot of a.vtStack) {
    snapshot.candidate.consumed = snapshot.consumed;
    VT_SSR_STACK.push(snapshot.candidate);
  }
  if (disposalError !== void 0) throw disposalError.value;
}
function nonceAttrOf(options) {
  return options?.nonce ? ' nonce="' + escapeAttr(options.nonce) + '"' : "";
}
function runFullFramedPass(component, props, resolved, nonceAttr = "", identifierPrefix = "", markers = true) {
  const saved = saveAmbient();
  NATIVE_SERVER_PASS = NATIVE_READ_COLLECTOR?.beginPass() ?? -1;
  NATIVE_SERVER_READS = null;
  NATIVE_SERVER_FAILURES = 0;
  NATIVE_LOCAL_HOOK_DISPOSES = null;
  ACTIVE_PU_WARM_PLANS.length = 0;
  CURRENT_PU_WARM_CLAIMS = null;
  ID_COUNTER = 0;
  ID_PREFIX = identifierPrefix;
  SIGNAL_INSTANCE_PREFIX = identifierPrefix;
  SIGNAL_COMPONENT_INSTANCE_KEY = JSON.stringify([identifierPrefix, "root"]);
  SERVER_SIGNAL_OWNER_ACTIVE = false;
  SIGNAL_CONTROL_SITE = "";
  SIGNAL_LIST_KEYS = null;
  NONCE_ATTR = nonceAttr;
  ASYNC_SCOPE = "";
  MARKERS = markers;
  PERMANENT_STATIC_HYDRATE_DEPTH = 0;
  VT_SSR_TRY_SEQ = 0;
  VT_SSR_HAS_CANDIDATES = false;
  VT_SSR_HAS_RAW_HTML = false;
  VT_SSR_STACK.length = 0;
  const cssMap = CSS = newStyleCollector();
  const headBuf = HEAD = {
    replay: null,
    html: "",
    charset: "",
    viewport: "",
    hints: /* @__PURE__ */ new Set(),
    sheets: null,
    hintHtml: null,
    preloadXfer: null,
    rootSuffix: markers ? (0, import_head_ownership.headOwnershipSuffix)(identifierPrefix) : ""
  };
  FALLBACK_HOIST_DEPTH = 0;
  const suspended = SUSPENDED = [];
  const serial = SERIAL = [];
  const deferred = DEFERRED = [];
  RESOLVED = resolved;
  CURRENT_SSR_ELEMENT = null;
  SSR_NESTING_WARNINGS = resolved.nestingWarnings;
  const root = ssrScope(null);
  CURRENT_SCOPE = root;
  FRAME = {
    parent: null,
    seg: 0,
    nextChild: 0,
    scopedChildren: null,
    occ: null,
    path: "",
    deferred: false,
    asyncScope: "",
    namespace: void 0
  };
  CURRENT_COMP = component;
  CURRENT_PROPS = props;
  CURRENT_PARENT_SCOPE = null;
  let body = "";
  let vtCandidates = false;
  let rawHtml = false;
  let rootSuspended = false;
  let signals;
  let nativePassCompleted = false;
  const nativeToken = NATIVE_READ_COLLECTOR === null ? -1 : beginActiveNativeReadScope(root);
  try {
    const out = invokeComponentBody(component, props, root, FRAME);
    body = serverComponentOutput(out, root);
    if (markers && out !== null && typeof out === "object") {
      const marker = out[BINDING_HTML_ROOT];
      if (marker !== void 0) body = ssrBindingBlock(body, marker);
    }
    nativePassCompleted = true;
  } catch (err) {
    err = normalizeThrownServerThenable(err);
    if (!ssrIsSuspense(err)) throw err;
    rootSuspended = true;
  } finally {
    vtCandidates = VT_SSR_HAS_CANDIDATES;
    rawHtml = VT_SSR_HAS_RAW_HTML;
    try {
      if (nativeToken >= 0) NATIVE_READ_COLLECTOR.endScope(nativeToken, nativePassCompleted);
      if (markers && nativePassCompleted)
        signals = NATIVE_READ_COLLECTOR?.serialize(
          NATIVE_SERVER_READS,
          RESOLVED?.initialDocumentSignals
        );
    } finally {
      try {
        restoreAmbient(saved);
      } finally {
        cssMap.replay = null;
        headBuf.replay = null;
      }
    }
  }
  if (resolved.bufferedErrors !== void 0) {
    for (const report of resolved.bufferedErrors.values()) {
      if (!report.reported) {
        report.reported = true;
        resolved.resourceOptions?.onError?.(report.error);
      }
    }
  }
  let css = "";
  for (const [hash, sheet] of cssMap) {
    css += '<style data-octane="' + hash + '"' + (sheet.nonce === void 0 ? nonceAttr : ' nonce="' + escapeAttr(sheet.nonce) + '"') + ">" + escapeEntireInlineStyleContent(sheet.css) + "</style>";
  }
  const result = {
    body,
    head: headHtmlWithSheets(headBuf),
    css,
    serial,
    suspended,
    deferred,
    rootSuspended,
    vtCandidates,
    rawHtml,
    cssEntries: cssMap,
    sheets: headBuf.sheets,
    hasSignalControls: resolved.hasSignalControls === true
  };
  if (signals !== void 0) result.signals = signals;
  return result;
}
function runDiscoveryRound(jobs, resolved, identifierPrefix) {
  const saved = saveAmbient();
  NATIVE_SERVER_PASS = NATIVE_READ_COLLECTOR?.beginPass() ?? -1;
  NATIVE_SERVER_READS = null;
  NATIVE_SERVER_FAILURES = 0;
  NATIVE_LOCAL_HOOK_DISPOSES = null;
  ACTIVE_PU_WARM_PLANS.length = 0;
  CURRENT_PU_WARM_CLAIMS = null;
  ID_COUNTER = 0;
  ID_PREFIX = identifierPrefix;
  SIGNAL_INSTANCE_PREFIX = identifierPrefix;
  SIGNAL_COMPONENT_INSTANCE_KEY = JSON.stringify([identifierPrefix, "root"]);
  SERVER_SIGNAL_OWNER_ACTIVE = false;
  SIGNAL_CONTROL_SITE = "";
  SIGNAL_LIST_KEYS = null;
  NONCE_ATTR = "";
  ASYNC_SCOPE = "";
  MARKERS = true;
  PERMANENT_STATIC_HYDRATE_DEPTH = 0;
  VT_SSR_TRY_SEQ = 0;
  VT_SSR_HAS_CANDIDATES = false;
  VT_SSR_HAS_RAW_HTML = false;
  VT_SSR_STACK.length = 0;
  CSS = newStyleCollector();
  HEAD = {
    replay: null,
    html: "",
    charset: "",
    viewport: "",
    hints: /* @__PURE__ */ new Set(),
    sheets: null,
    hintHtml: null,
    preloadXfer: null,
    rootSuffix: (0, import_head_ownership.headOwnershipSuffix)(identifierPrefix)
  };
  FALLBACK_HOIST_DEPTH = 0;
  const suspended = SUSPENDED = [];
  SERIAL = [];
  const deferred = DEFERRED = [];
  RESOLVED = resolved;
  CURRENT_SSR_ELEMENT = null;
  SSR_NESTING_WARNINGS = null;
  FRAME = null;
  CURRENT_COMP = null;
  CURRENT_PROPS = null;
  CURRENT_PARENT_SCOPE = null;
  try {
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const frame = {
        parent: job.frame.parent,
        seg: job.frame.seg,
        nextChild: 0,
        scopedChildren: null,
        occ: null,
        path: null,
        deferred: false,
        asyncScope: job.frame.asyncScope,
        namespace: void 0
      };
      try {
        renderComponentFramed(
          job.comp,
          job.props,
          job.parentScope,
          frame,
          void 0,
          job.signalInstanceKey
        );
      } catch (err) {
        if (!ssrIsSuspense(err)) continue;
      }
    }
  } finally {
    restoreAmbient(saved);
  }
  return { suspended, deferred };
}
async function raceSettleGuards(work, timeoutMs, signal) {
  const racers = [work];
  let timer;
  let removeAbort;
  if (timeoutMs > 0) {
    racers.push(
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error((0, import_error_codes_server_generated.formatServerError)(32, timeoutMs))), timeoutMs);
        timer?.unref?.();
      })
    );
  }
  if (signal) {
    racers.push(
      new Promise((_, reject) => {
        const onAbort = () => reject(signal.reason);
        signal.addEventListener("abort", onAbort, { once: true });
        removeAbort = () => signal.removeEventListener("abort", onAbort);
      })
    );
  }
  try {
    await (racers.length === 1 ? work : Promise.race(racers));
  } finally {
    clearTimeout(timer);
    removeAbort?.();
  }
}
function isThrownKey(key) {
  return key.charCodeAt(0) === 124 && key.startsWith("|throw#");
}
function isThrownWave(suspended) {
  for (const { key } of suspended) if (!isThrownKey(key)) return false;
  return true;
}
function isStalledWave(suspended, resolved) {
  const seen = resolved.settledThrows;
  if (seen === void 0) return false;
  for (const { promise, key } of suspended) {
    if (!isThrownKey(key) || !seen.has(promise)) return false;
  }
  return true;
}
const STALLED_RETRY_MAX_DELAY_MS = 100;
function nextStalledRetryDelay(stall, timeoutMs, width) {
  if (stall.waves === 0 || width < stall.width) {
    stall.waves = 0;
    stall.since = Date.now();
    stall.width = width;
  }
  const waves = ++stall.waves;
  const remainingMs = timeoutMs > 0 ? stall.since + timeoutMs - Date.now() : Number.POSITIVE_INFINITY;
  if (remainingMs <= 0) return -1;
  return Math.min(2 ** (waves - 1), STALLED_RETRY_MAX_DELAY_MS, remainingMs);
}
async function settleSuspended(suspended, resolved, timeoutMs, signal) {
  const pu = resolved.pu;
  pu.recreate ??= { strikes: 0, prevCreated: pu.created.size };
  const settleAll = Promise.all(
    suspended.map(async ({ promise, key }) => {
      if (resolved.has(key)) return;
      const isPu = key.charCodeAt(0) === 124 && key.startsWith("|pu#");
      try {
        const outcome = { value: await promise, thenable: promise };
        resolved.set(key, outcome);
        if (isPu) pu.resolvedT.set(promise, outcome);
      } catch (reason) {
        const outcome = { reason, thenable: promise };
        resolved.set(key, outcome);
        if (isPu) pu.resolvedT.set(promise, outcome);
      }
      if (isThrownKey(key)) (resolved.settledThrows ??= /* @__PURE__ */ new Set()).add(promise);
    })
  );
  await raceSettleGuards(settleAll, timeoutMs, signal);
}
const yieldMacrotask = typeof setImmediate === "function" ? () => new Promise((resolve) => setImmediate(resolve)) : () => new Promise((resolve) => setTimeout(resolve, 0));
function waveLanded(suspended, settlements) {
  if (settlements.landed.size === 0) return false;
  for (const { promise } of suspended) if (settlements.landed.has(promise)) return true;
  return false;
}
async function recordStreamSettlement(settlements, recorder) {
  let outcome;
  try {
    outcome = { value: await recorder.promise, thenable: recorder.promise };
  } catch (reason) {
    outcome = { reason, thenable: recorder.promise };
  }
  const resolved = settlements.resolved;
  if (resolved === null) return;
  if (!resolved.has(recorder.key)) resolved.set(recorder.key, outcome);
  if (recorder.keys !== null) {
    for (const key of recorder.keys) {
      if (!resolved.has(key)) resolved.set(key, outcome);
    }
    recorder.keys = null;
  }
  if (recorder.batch && !resolved.pu.resolvedT.has(recorder.promise)) {
    resolved.pu.resolvedT.set(recorder.promise, outcome);
  }
  if (recorder.thrown) (resolved.settledThrows ??= /* @__PURE__ */ new Set()).add(recorder.promise);
  if (!recorder.thrown || !recorder.settledBefore) settlements.landed.add(recorder.promise);
  settlements.pending.delete(recorder.promise);
  if (recorder.wave === settlements.wave) settlements.wake?.();
}
async function settleFirstOfWave(suspended, resolved, timeoutMs, signal, stall) {
  const pu = resolved.pu;
  pu.recreate ??= { strikes: 0, prevCreated: pu.created.size };
  const settlements = resolved.streamSettlements ??= {
    resolved,
    pending: /* @__PURE__ */ new Map(),
    wave: 0,
    wake: null,
    landed: /* @__PURE__ */ new Set()
  };
  const wave = ++settlements.wave;
  let waiting = false;
  let stale = 0;
  for (const { promise, key } of suspended) {
    if (resolved.has(key)) continue;
    let recorder = settlements.pending.get(promise);
    if (recorder === void 0) {
      const thrown = isThrownKey(key);
      recorder = {
        promise,
        key,
        keys: null,
        batch: key.startsWith("|pu#"),
        wave,
        thrown,
        settledBefore: thrown && resolved.settledThrows?.has(promise) === true && !settlements.landed.has(promise)
      };
      settlements.pending.set(promise, recorder);
      void recordStreamSettlement(settlements, recorder);
    } else {
      if (key !== recorder.key) (recorder.keys ??= /* @__PURE__ */ new Set()).add(key);
      if (key.startsWith("|pu#")) recorder.batch = true;
      if (recorder.thrown && !isThrownKey(key)) recorder.thrown = false;
      recorder.wave = wave;
    }
    if (recorder.thrown && recorder.settledBefore) stale++;
    waiting = true;
  }
  if (!waiting) {
    stall.waves = 0;
    return false;
  }
  const first = new Promise((resolve) => {
    settlements.wake = resolve;
  });
  try {
    await raceSettleGuards(first, timeoutMs, signal);
  } finally {
    settlements.wake = null;
  }
  await yieldMacrotask();
  let size = resolved.size;
  for (; ; ) {
    await Promise.resolve();
    await Promise.resolve();
    if (resolved.size === size) break;
    size = resolved.size;
  }
  signal?.throwIfAborted();
  if (waveLanded(suspended, settlements)) {
    stall.waves = 0;
    return false;
  }
  const delayMs = nextStalledRetryDelay(stall, timeoutMs, stale);
  if (delayMs < 0) throw new Error((0, import_error_codes_server_generated.formatServerError)(332, timeoutMs));
  let timer;
  const progress = new Promise((resolve) => {
    timer = setTimeout(resolve, delayMs);
    settlements.wake = () => {
      if (waveLanded(suspended, settlements)) resolve();
    };
  });
  try {
    await raceSettleGuards(progress, 0, signal);
  } finally {
    clearTimeout(timer);
    settlements.wake = null;
  }
  if (waveLanded(suspended, settlements)) {
    stall.waves = 0;
    return false;
  }
  return true;
}
function observeSuspenseWave(resolved, settled, next, boundaryProgress) {
  const pu = resolved.pu;
  if (pu.batchDisabled === true) {
    pu.touched = void 0;
    return false;
  }
  let state = pu.recreate;
  if (state === void 0) state = pu.recreate = { strikes: 0, prevCreated: -1 };
  const createdGrew = pu.created.size !== state.prevCreated;
  state.prevCreated = pu.created.size;
  const touched = pu.touched;
  pu.touched = void 0;
  const reset = () => {
    state.strikes = 0;
    return false;
  };
  if (boundaryProgress || createdGrew) return reset();
  let prevPu = null;
  for (const { promise, key } of settled) {
    if (key.charCodeAt(0) === 124 && key.startsWith("|pu#")) {
      (prevPu ??= /* @__PURE__ */ new Set()).add(promise);
    } else if (resolved.has(key)) {
      return reset();
    }
  }
  if (prevPu === null) return reset();
  let sawFresh = false;
  for (const { promise, key } of next) {
    if (key.charCodeAt(0) !== 124 || !key.startsWith("|pu#")) continue;
    if (prevPu.has(promise) || pu.resolvedT.has(promise)) continue;
    sawFresh = true;
    break;
  }
  if (!sawFresh) return reset();
  if (touched !== void 0) {
    for (const promise of prevPu) {
      if (touched.has(promise)) return reset();
    }
  }
  if (++state.strikes < 2) {
    pu.touched = /* @__PURE__ */ new Set();
    return false;
  }
  pu.batchDisabled = true;
  for (const { promise } of next) Promise.resolve(promise).then(NOOP, NOOP);
  if (__octaneDev) {
    console.error(
      "octane SSR: use() thenables appear to be re-created on every render pass \u2014 promises created during an ancestor render and passed down (e.g. via props) get a fresh identity each pass, so their boundaries can never resolve by identity. Create the promise at its use() site, or hoist the creation out of render (the compiler caches analyzable inline creations automatically). Falling back to per-site replay for the rest of this render."
    );
  }
  return true;
}
async function runBuffered(component, props, options, nonceAttr, resolved) {
  const timeoutMs = options?.timeoutMs ?? SUSPENSE_TIMEOUT_MS;
  const signal = options?.signal;
  const identifierPrefix = options?.identifierPrefix ?? "";
  let attempt = 0;
  let lastSettled = null;
  const stall = { waves: 0, since: 0, width: 0 };
  for (; ; ) {
    signal?.throwIfAborted();
    let pass;
    try {
      pass = withStream(
        null,
        () => runFullFramedPass(component, props, resolved, nonceAttr, identifierPrefix)
      );
    } catch (err) {
      options?.onError?.(err);
      throw err;
    }
    if (pass.suspended.length === 0) return pass;
    if (lastSettled !== null && observeSuspenseWave(resolved, lastSettled, pass.suspended, false)) {
      continue;
    }
    let jobs = pass.deferred;
    let pending = pass.suspended;
    for (; ; ) {
      const stalled = isStalledWave(pending, resolved);
      if (!stalled && ++attempt > MAX_SUSPENSE_PASSES) {
        const err = new Error(
          isThrownWave(pending) ? (0, import_error_codes_server_generated.formatServerError)(333, MAX_SUSPENSE_PASSES) : (0, import_error_codes_server_generated.formatServerError)(47, MAX_SUSPENSE_PASSES)
        );
        options?.onError?.(err);
        throw err;
      }
      await settleSuspended(pending, resolved, timeoutMs, signal);
      if (stalled) {
        const delayMs = nextStalledRetryDelay(stall, timeoutMs, pending.length);
        if (delayMs < 0) {
          const err = new Error((0, import_error_codes_server_generated.formatServerError)(332, timeoutMs));
          options?.onError?.(err);
          throw err;
        }
        await raceSettleGuards(new Promise((resolve) => setTimeout(resolve, delayMs)), 0, signal);
      } else {
        stall.waves = 0;
      }
      lastSettled = pending;
      if (jobs.length === 0 || !jobs.every((j) => j.frame.parent !== null)) break;
      const round = withStream(null, () => runDiscoveryRound(jobs, resolved, identifierPrefix));
      if (round.suspended.length === 0) break;
      pending = round.suspended;
      jobs = round.deferred;
    }
    if (resolved.pu.touched !== void 0) resolved.pu.touched = /* @__PURE__ */ new Set();
  }
}
function passToResult(pass, nonceAttr, separateHead = false, independentHydration = false, externalSignalBootstrap = false) {
  let body = pass.body;
  if (pass.serial.length > 0) body += serializeSuspenseSeeds(pass.serial, nonceAttr);
  if (pass.signals !== void 0) body += serializeNativeSignalSeeds(pass.signals, nonceAttr);
  if (!externalSignalBootstrap && (pass.hasSignalControls || independentHydration)) {
    body += "<script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">" + (0, import_early_signals.streamedSignalBootstrapJs)(independentHydration) + "</script>";
  }
  let result;
  if (separateHead) {
    result = {
      html: pass.vtCandidates ? vtSsrStrip(body, pass.rawHtml) : body,
      css: pass.css,
      head: pass.vtCandidates ? vtSsrStrip(pass.head, pass.rawHtml) : pass.head
    };
  } else {
    const html = spliceHead(body, pass.head);
    result = { html: pass.vtCandidates ? vtSsrStrip(html, pass.rawHtml) : html, css: pass.css };
  }
  if (pass.signals !== void 0) result.signals = pass.signals;
  return result;
}
async function collectBufferedInjection(injection, signal) {
  let revision = 0;
  let wake;
  let settled = false;
  let failed = false;
  let failure;
  const notify = () => {
    revision++;
    const resume = wake;
    wake = void 0;
    resume?.();
  };
  const unsubscribe = injection.subscribe(notify);
  signal?.addEventListener("abort", notify, { once: true });
  injection.done.then(
    () => {
      settled = true;
      notify();
    },
    (error) => {
      failed = true;
      failure = error;
      settled = true;
      notify();
    }
  );
  let html = "";
  try {
    injection.renderComplete?.();
    for (; ; ) {
      signal?.throwIfAborted();
      const chunk = injection.take();
      if (chunk !== "") {
        html += chunk;
        injection.accepted?.();
        continue;
      }
      if (settled) {
        if (failed) throw failure;
        return html;
      }
      const observed = revision;
      await new Promise((resolve) => {
        wake = resolve;
        if (settled || revision !== observed) {
          wake = void 0;
          resolve();
        }
      });
    }
  } finally {
    unsubscribe();
    signal?.removeEventListener("abort", notify);
  }
}
function insertBufferedInjection(pass, injection) {
  if (injection === "") return;
  const tailStart = documentTailStart(pass.body);
  pass.body = tailStart === -1 ? pass.body + injection : pass.body.slice(0, tailStart) + injection + pass.body.slice(tailStart);
}
async function prerender(entryComponent, props, options) {
  const component = typeof entryComponent === "function" ? entryComponent : renderEntryValue;
  if (typeof entryComponent !== "function") {
    options ??= props;
    props = { value: entryComponent };
  }
  const preparedOptions = needsAutomaticSignalInjection(options) ? await prepareAutomaticSignalInjection(options) : options;
  const injection = preparedOptions?.injection;
  const cancelRender = injection === void 0 ? void 0 : new AbortController();
  injection?.done.then(NOOP, (error) => cancelRender.abort(error));
  const renderOptions = cancelRender === void 0 ? preparedOptions : {
    ...preparedOptions,
    signal: preparedOptions?.signal === void 0 ? cancelRender.signal : AbortSignal.any([preparedOptions.signal, cancelRender.signal])
  };
  const nonceAttr = nonceAttrOf(renderOptions);
  const resolved = newResolvedMap(renderOptions ?? null);
  try {
    const pass = await runBuffered(component, props, renderOptions, nonceAttr, resolved);
    if (injection !== void 0) {
      try {
        insertBufferedInjection(
          pass,
          await collectBufferedInjection(injection, renderOptions?.signal)
        );
      } catch (error) {
        renderOptions?.onError?.(error);
        throw error;
      }
    }
    return passToResult(
      pass,
      nonceAttr,
      renderOptions?.headChannel === "separate",
      renderOptions?.independentHydration !== void 0,
      renderOptions?.earlySignalBootstrap === "external"
    );
  } catch (error) {
    try {
      injection?.cancel?.(error);
    } catch {
    }
    throw error;
  } finally {
    releaseServerRenderResources(resolved);
  }
}
async function prerenderToNodeStream(entryComponent, props, options) {
  if (typeof entryComponent !== "function" && options === void 0) {
    options = props;
    props = void 0;
  }
  let resolved = options;
  if (options?.headChannel === "separate") {
    if (__octaneDev) {
      console.error(
        "prerenderToNodeStream() streams one document and has no separate head channel; headChannel: 'separate' was ignored. Use prerender() for a split head."
      );
    }
    resolved = { ...options, headChannel: void 0 };
  }
  const result = await prerender(entryComponent, props, resolved);
  const getBuiltin = globalThis.process?.getBuiltinModule;
  if (getBuiltin === void 0) throw new Error((0, import_error_codes_server_generated.formatServerError)(57));
  const { Readable } = getBuiltin("node:stream");
  const chunks = [];
  const encoder = new TextEncoder();
  if (result.css !== "") chunks.push(encoder.encode(result.css));
  chunks.push(encoder.encode(result.html));
  return { prelude: Readable.from(chunks, { objectMode: false }) };
}
let HOSTED_FOREIGN_CONTEXT_READER = null;
function readHostedForeignContext(usable, api) {
  if (usable !== null && typeof usable === "object" && HOSTED_FOREIGN_CONTEXT_READER !== null) {
    return HOSTED_FOREIGN_CONTEXT_READER(usable);
  }
  throw new Error((0, import_error_codes_server_generated.formatServerError)(12, api));
}
function createHostedServerSession() {
  return { resolved: newResolvedMap(), strata: [] };
}
function recordHostedStratum(suspended, resolved) {
  const pu = resolved.pu;
  const recorders = suspended.map(
    ({ promise, key }) => (async () => {
      const isPu = key.startsWith("|pu#");
      try {
        const value = await promise;
        const outcome = { value, thenable: promise };
        if (!resolved.has(key)) resolved.set(key, outcome);
        if (isPu && !pu.resolvedT.has(promise)) pu.resolvedT.set(promise, outcome);
      } catch (reason) {
        const outcome = { reason, thenable: promise };
        if (!resolved.has(key)) resolved.set(key, outcome);
        if (isPu && !pu.resolvedT.has(promise)) pu.resolvedT.set(promise, outcome);
      }
    })()
  );
  const aggregate = Promise.all(recorders).then(() => {
    aggregate.status = "fulfilled";
    aggregate.value = void 0;
  });
  aggregate.status = "pending";
  return aggregate;
}
function renderHostedAttempt(session, component, props, options) {
  const nonceAttr = nonceAttrOf(options);
  const previousReader = HOSTED_FOREIGN_CONTEXT_READER;
  HOSTED_FOREIGN_CONTEXT_READER = options?.readForeignContext ?? null;
  let pass;
  try {
    pass = withStream(
      null,
      () => runFullFramedPass(
        component,
        props,
        session.resolved,
        nonceAttr,
        options?.identifierPrefix ?? ""
      )
    );
  } finally {
    HOSTED_FOREIGN_CONTEXT_READER = previousReader;
  }
  if (pass.rootSuspended) {
    const stratum = recordHostedStratum(pass.suspended, session.resolved);
    session.strata.push(stratum);
    return { status: "suspended", stratum };
  }
  let body = pass.body;
  if (pass.serial.length > 0) body += serializeSuspenseSeeds(pass.serial, nonceAttr);
  if (pass.signals !== void 0) body += serializeNativeSignalSeeds(pass.signals, nonceAttr);
  if (pass.vtCandidates) body = vtSsrStrip(body, pass.rawHtml);
  return { status: "complete", html: body, head: pass.head, cssEntries: pass.cssEntries };
}
function renderToString(entryComponent, props, options) {
  const component = typeof entryComponent === "function" ? entryComponent : renderEntryValue;
  if (typeof entryComponent !== "function") {
    options ??= props;
    props = { value: entryComponent };
  }
  options?.signal?.throwIfAborted();
  const nonceAttr = nonceAttrOf(options);
  const resolved = newResolvedMap(options ?? null);
  let pass;
  try {
    pass = withStream(
      null,
      () => runFullFramedPass(component, props, resolved, nonceAttr, options?.identifierPrefix ?? "")
    );
    if (pass.rootSuspended) throw new Error((0, import_error_codes_server_generated.formatServerError)(60));
  } catch (err) {
    options?.onError?.(err);
    throw err;
  } finally {
    releaseServerRenderResources(resolved);
  }
  return passToResult(
    pass,
    nonceAttr,
    options?.headChannel === "separate",
    options?.independentHydration !== void 0,
    options?.earlySignalBootstrap === "external"
  );
}
function renderToStaticMarkup(entryComponent, props, options) {
  const component = typeof entryComponent === "function" ? entryComponent : renderEntryValue;
  if (typeof entryComponent !== "function") {
    options ??= props;
    props = { value: entryComponent };
  }
  options?.signal?.throwIfAborted();
  const nonceAttr = nonceAttrOf(options);
  const resolved = newResolvedMap(options ?? null);
  let pass;
  try {
    pass = withStream(
      null,
      () => runFullFramedPass(
        component,
        props,
        resolved,
        nonceAttr,
        options?.identifierPrefix ?? "",
        false
      )
    );
    if (pass.rootSuspended) throw new Error((0, import_error_codes_server_generated.formatServerError)(60));
  } catch (err) {
    options?.onError?.(err);
    throw err;
  } finally {
    releaseServerRenderResources(resolved);
  }
  if (options?.headChannel === "separate") {
    return {
      html: pass.vtCandidates ? vtSsrStrip(pass.body, pass.rawHtml) : pass.body,
      css: pass.css,
      head: pass.vtCandidates ? vtSsrStrip(pass.head, pass.rawHtml) : pass.head
    };
  }
  const html = spliceHead(pass.body, pass.head);
  return { html: pass.vtCandidates ? vtSsrStrip(html, pass.rawHtml) : html, css: pass.css };
}
function hasPendingStreamBoundary(stream) {
  for (const boundary of stream.boundaries.values()) {
    if (boundary.state === "pending") return true;
  }
  return false;
}
function recordStreamBoundaryMutation(stream, key) {
  if (stream.replay === null) return;
  const boundary = stream.boundaries.get(key);
  stream.replay.push({
    key,
    boundary,
    value: boundary === void 0 ? void 0 : { ...boundary }
  });
}
function rewindStreamBoundaryReplay(stream, checkpoint) {
  const replay = stream.replay;
  if (replay === null) return;
  let restoredDeletion = false;
  while (replay.length > checkpoint) {
    const saved = replay.pop();
    if (saved.boundary === void 0) {
      stream.boundaries.delete(saved.key);
    } else {
      const boundary = saved.boundary;
      const value = saved.value;
      Object.assign(boundary, value);
      boundary.error = value.error;
      boundary.errorReported = value.errorReported;
      boundary.errorFlushed = value.errorFlushed;
      if (!stream.boundaries.has(saved.key)) restoredDeletion = true;
      stream.boundaries.set(saved.key, boundary);
    }
  }
  if (restoredDeletion) {
    const ordered = [...stream.boundaries].sort((a, b) => a[1].order - b[1].order);
    stream.boundaries.clear();
    for (const [key, boundary] of ordered) stream.boundaries.set(key, boundary);
  }
}
function recordStreamBoundaryOwners(stream, owners) {
  for (const owner of owners) stream.boundaryOwnerKeys.add(owner);
}
let STREAM_REALM_SALT = null;
function streamRealmSalt() {
  if (STREAM_REALM_SALT !== null) return STREAM_REALM_SALT;
  const crypto = globalThis.crypto;
  const entropy = crypto?.randomUUID?.().replace(/-/g, "") ?? Date.now().toString(36) + Math.random().toString(36).slice(2);
  return STREAM_REALM_SALT = entropy.replace(/[^a-zA-Z0-9_-]/g, "");
}
let NEXT_STREAM_TOKEN = 0;
function createStreamToken() {
  return "os" + streamRealmSalt() + "-" + (NEXT_STREAM_TOKEN++).toString(36);
}
let STREAM = null;
function pruneUnrepresentedStreamDescendants(stream, ownerKey, ownerHtml) {
  if (!stream.boundaryOwnerKeys.has(ownerKey)) return;
  let removed = true;
  while (removed) {
    removed = false;
    for (const [childKey, child] of stream.boundaries) {
      if (childKey === ownerKey) continue;
      let nearestOwner = null;
      for (let i = child.owners.length - 1; i >= 0; i--) {
        const candidate = child.owners[i];
        if (candidate === ownerKey || stream.boundaries.has(candidate)) {
          nearestOwner = candidate;
          break;
        }
      }
      if (nearestOwner !== ownerKey) continue;
      if (ownerHtml.includes(import_constants.STREAM_BOUNDARY_ATTR + '="' + child.id + '"')) continue;
      recordStreamBoundaryMutation(stream, childKey);
      stream.boundaries.delete(childKey);
      removed = true;
    }
  }
}
function pruneStreamBoundariesAbsentFromShell(stream, shellBoundaryKeys) {
  for (const key of stream.boundaries.keys()) {
    if (!shellBoundaryKeys.has(key)) stream.boundaries.delete(key);
  }
}
function ssrTry(scope, siteKey, tryFn, pendFn, catchFn, namespace = FRAME?.namespace ?? "html", propagateSuspense = false, recoverErrors = false) {
  VT_SSR_TRY_SEQ++;
  let vtOuter = null;
  if (VT_SSR_STACK.length > 0) {
    const top = VT_SSR_STACK[VT_SSR_STACK.length - 1];
    if (!top.consumed && !top.elementScope) {
      top.consumed = true;
      vtOuter = top;
    }
  }
  const stream = STREAM;
  const frame = FRAME;
  const base = "@try:" + siteKey;
  let occurrence = 0;
  if (frame !== null) {
    occurrence = nextFrameOccurrence(frame, base);
  }
  const key = asyncFramePath(frame) + "|" + base + "#" + occurrence;
  const outerAsyncScope = ASYNC_SCOPE;
  const armScope = outerAsyncScope + "|@arm:" + siteKey + "#" + occurrence.toString(36) + ":";
  let entry;
  const serialStart = SERIAL?.length ?? 0;
  let ancestorKeys = EMPTY_SNAPSHOT_LIST;
  let ownerKeys = EMPTY_SNAPSHOT_LIST;
  if (stream !== null) {
    stream.activePassBoundaryKeys?.add(key);
    ancestorKeys = snapshotList(stream.activeTryKeys);
    ownerKeys = snapshotList(stream.activeOwnerKeys);
    entry = stream.boundaries.get(key);
    if (entry !== void 0) {
      recordStreamBoundaryMutation(stream, key);
      if (ownerKeys.length !== 0) recordStreamBoundaryOwners(stream, ownerKeys);
      entry.namespace = namespace;
    }
    if (entry !== void 0 && entry.state === "pending") {
      entry.ancestors = ancestorKeys;
      entry.owners = ownerKeys;
    }
  }
  const withArmScope = (arm, fn) => {
    const prev = ASYNC_SCOPE;
    ASYNC_SCOPE = armScope + arm;
    try {
      return fn();
    } finally {
      ASYNC_SCOPE = prev;
    }
  };
  const withContentArm = (fn) => withArmScope("content", () => {
    if (stream === null) return fn();
    stream.activeTryKeys.push(key);
    stream.activeOwnerKeys.push(key);
    try {
      return fn();
    } finally {
      stream.activeOwnerKeys.pop();
      stream.activeTryKeys.pop();
    }
  });
  const withPendingArm = (fn) => {
    return withArmScope("pending", () => {
      FALLBACK_HOIST_DEPTH++;
      try {
        if (stream === null) return fn();
        stream.activeOwnerKeys.push(key);
        try {
          return fn();
        } finally {
          stream.activeOwnerKeys.pop();
        }
      } finally {
        FALLBACK_HOIST_DEPTH--;
      }
    });
  };
  const withCatchArm = (fn) => withArmScope("catch", () => {
    if (stream === null) return fn();
    stream.activeTryKeys.push(key);
    stream.activeOwnerKeys.push(key);
    try {
      return fn();
    } finally {
      stream.activeOwnerKeys.pop();
      stream.activeTryKeys.pop();
    }
  });
  const outerIdPrefix = ID_PREFIX;
  const outerIdCounter = ID_COUNTER;
  let boundaryIds = false;
  const enterBoundaryIds = (next) => {
    if (entry === void 0) return;
    ID_PREFIX = outerIdPrefix + "b" + entry.id + "-";
    ID_COUNTER = next;
    boundaryIds = true;
  };
  const restoreOuterIds = () => {
    ID_PREFIX = outerIdPrefix;
    ID_COUNTER = outerIdCounter;
    boundaryIds = false;
  };
  if (entry !== void 0) enterBoundaryIds(0);
  let nativeFresh = false;
  const nativeFailureStart = NATIVE_SERVER_FAILURES;
  const nativeFreshArm = (inner) => {
    if (!MARKERS || !nativeFresh) return inner;
    if (SERIAL !== null) SERIAL.length = serialStart;
    const idCount = Math.max(0, ID_COUNTER - (boundaryIds ? 0 : outerIdCounter));
    return "<!--" + import_native_read_seeds.NATIVE_SIGNAL_FRESH_COMMENT + idCount + "-->" + inner;
  };
  const pendingForm = () => {
    const renderFallback = () => {
      const nativeCapture = NATIVE_READ_COLLECTOR?.beginCapture() ?? -1;
      const previousNativeReads = NATIVE_SERVER_READS;
      if (nativeCapture < 0) NATIVE_SERVER_READS = null;
      let completed = false;
      try {
        const fallback2 = withPendingArm(
          () => pendFn !== null ? vtSsrClaimArm(ssrBlock(pendFn(void 0, scope)), "exit") : ""
        );
        completed = true;
        return fallback2;
      } finally {
        finishNativeSeedCapture(
          nativeCapture,
          previousNativeReads,
          completed && entry === void 0 && !nativeFresh
        );
      }
    };
    let fallback;
    if (entry !== void 0 && entry.state === "done") {
      const suspendedStart = SUSPENDED?.length ?? 0;
      const nativeCapture = NATIVE_READ_COLLECTOR?.beginCapture() ?? -1;
      const previousNativeReads = NATIVE_SERVER_READS;
      if (nativeCapture < 0) NATIVE_SERVER_READS = null;
      const deferredStart = DEFERRED?.length ?? 0;
      const serialStart2 = SERIAL?.length ?? 0;
      const css = CSS;
      const cssSnapshot = snapshotStyles(css);
      const head = HEAD;
      const headCollections = snapshotHeadCollections(head);
      const headHtml = head?.html;
      const headCharset = head?.charset;
      const headViewport = head?.viewport;
      const headHints = headCollections?.hints ?? null;
      const headSheets = headCollections?.sheets ?? null;
      const headHintHtml = headCollections?.hintHtml ?? null;
      const headXfer = headCollections?.preloadXfer ?? null;
      const vtTrySeq = VT_SSR_TRY_SEQ;
      const vtHasCandidates = VT_SSR_HAS_CANDIDATES;
      const vtStack = snapshotVtStack();
      try {
        fallback = withStream(null, renderFallback);
      } catch (error) {
        error = normalizeThrownServerThenable(error);
        if (!ssrIsSuspense(error)) throw error;
        fallback = "";
      } finally {
        finishNativeSeedCapture(nativeCapture, previousNativeReads, false);
        if (SUSPENDED !== null) SUSPENDED.length = suspendedStart;
        if (DEFERRED !== null) DEFERRED.length = deferredStart;
        if (SERIAL !== null) SERIAL.length = serialStart2;
        if (css !== null && cssSnapshot !== null) {
          css.replay = null;
          css.clear();
          for (const [hash, sheet] of cssSnapshot) css.set(hash, sheet);
        }
        if (head !== null && headHints !== null) {
          head.replay = null;
          head.html = headHtml;
          head.charset = headCharset;
          head.viewport = headViewport;
          head.hints.clear();
          for (const hint of headHints) head.hints.add(hint);
          if (headSheets === null) head.sheets = null;
          else {
            const sheets = head.sheets ??= /* @__PURE__ */ new Map();
            sheets.clear();
            for (const [href, entry2] of headSheets) sheets.set(href, entry2);
          }
          if (headHintHtml === null) head.hintHtml = null;
          else {
            const hintHtml = head.hintHtml ??= /* @__PURE__ */ new Map();
            hintHtml.clear();
            for (const [k, v] of headHintHtml) hintHtml.set(k, v);
          }
          if (headXfer === null) head.preloadXfer = null;
          else {
            const xfer = head.preloadXfer ??= /* @__PURE__ */ new Map();
            xfer.clear();
            for (const [k, v] of headXfer) xfer.set(k, v);
          }
        }
        VT_SSR_TRY_SEQ = vtTrySeq;
        VT_SSR_HAS_CANDIDATES = vtHasCandidates;
        VT_SSR_STACK.length = 0;
        for (const snapshot of vtStack) {
          snapshot.candidate.consumed = snapshot.consumed;
          VT_SSR_STACK.push(snapshot.candidate);
        }
      }
    } else {
      fallback = renderFallback();
    }
    if (entry !== void 0) {
      return ssrBlock(
        "<template " + import_constants.STREAM_BOUNDARY_ATTR + '="' + entry.id + '"></template>' + fallback
      );
    }
    return ssrBlock(nativeFreshArm(pendFn !== null ? fallback : ""));
  };
  try {
    try {
      const nativeCapture = NATIVE_READ_COLLECTOR?.beginCapture() ?? -1;
      const previousNativeReads = NATIVE_SERVER_READS;
      if (nativeCapture < 0) NATIVE_SERVER_READS = null;
      let nativeReads = null;
      let inner;
      try {
        inner = vtSsrClaimArm(ssrBlock(withContentArm(() => tryFn(void 0, scope))), "enter");
      } finally {
        nativeReads = finishNativeSeedCapture(nativeCapture, previousNativeReads, false);
      }
      if (entry !== void 0) {
        if (entry.state === "pending") {
          if (!entry.serverOwnedStatic)
            entry.signals = NATIVE_READ_COLLECTOR?.serialize(
              nativeReads,
              RESOLVED?.initialDocumentSignals
            );
          entry.state = "done";
          entry.rawHtml = VT_SSR_HAS_RAW_HTML;
          entry.html = vtOuter !== null ? vtSsrAnnotate(inner, [
            ["vt-name", vtOuter.name],
            ["vt-update", vtOuter.update],
            ["vt-share", vtOuter.update]
          ]) : inner;
          if (SERIAL !== null) {
            if (!entry.serverOwnedStatic) entry.seeds = SERIAL.slice(serialStart);
            SERIAL.length = serialStart;
          }
          pruneUnrepresentedStreamDescendants(stream, key, entry.html);
        } else if (SERIAL !== null) {
          SERIAL.length = serialStart;
        }
        ID_COUNTER = entry.pendingIdOffset;
        return pendingForm();
      }
      appendNativeSeedReads(nativeReads);
      if (MARKERS && pendFn !== null) {
        const idCount = ID_COUNTER - outerIdCounter;
        const seeds = SERIAL === null ? [] : SERIAL.splice(serialStart);
        const native = NATIVE_READ_COLLECTOR?.serialize(
          nativeReads,
          RESOLVED?.initialDocumentSignals
        );
        return ssrBlock(
          `<!--${import_constants.SUSPENSE_RESOLVED_COMMENT}${idCount}-->` + (seeds.length === 0 ? "" : serializeSuspenseSeeds(seeds, NONCE_ATTR, import_constants.SUSPENSE_RESOLVED_SEED_ATTR)) + (native === void 0 ? "" : serializeNativeSignalSeeds(native, NONCE_ATTR, import_constants.SUSPENSE_RESOLVED_NATIVE_ATTR)) + inner
        );
      }
      return ssrBlock(inner);
    } catch (e) {
      nativeFresh = NATIVE_SERVER_FAILURES !== nativeFailureStart;
      e = normalizeThrownServerThenable(e);
      if (ssrIsSuspense(e)) {
        if (propagateSuspense) throw e;
        if (stream !== null) {
          if (SERIAL !== null) SERIAL.length = serialStart;
          if (entry === void 0) {
            const pendingIdOffset = Math.max(0, ID_COUNTER - outerIdCounter);
            restoreOuterIds();
            const order = stream.nextId++;
            entry = {
              id: stream.token + "-" + order.toString(36),
              order,
              state: "pending",
              serverOwnedStatic: PERMANENT_STATIC_HYDRATE_DEPTH !== 0,
              html: "",
              rawHtml: false,
              seeds: [],
              pendingIdOffset,
              namespace,
              ancestors: ancestorKeys,
              owners: ownerKeys
            };
            recordStreamBoundaryMutation(stream, key);
            stream.boundaries.set(key, entry);
            if (ownerKeys.length !== 0) recordStreamBoundaryOwners(stream, ownerKeys);
            enterBoundaryIds(pendingIdOffset);
          } else {
            ID_COUNTER = entry.pendingIdOffset;
          }
        }
        return pendingForm();
      }
      if (catchFn !== null) {
        const caughtSeeds = entry !== void 0 && !entry.serverOwnedStatic && SERIAL !== null ? SERIAL.slice(serialStart) : [];
        if (entry !== void 0 && SERIAL !== null) SERIAL.length = serialStart;
        const nativeCapture = NATIVE_READ_COLLECTOR?.beginCapture() ?? -1;
        const previousNativeReads = NATIVE_SERVER_READS;
        if (nativeCapture < 0) NATIVE_SERVER_READS = null;
        let catchReads = null;
        let inner;
        try {
          inner = ssrBlock(withCatchArm(() => catchFn(e, scope, NOOP)));
        } finally {
          catchReads = finishNativeSeedCapture(nativeCapture, previousNativeReads, false);
        }
        inner = nativeFreshArm(inner);
        if (entry !== void 0) {
          if (entry.state !== "done") {
            if (!entry.serverOwnedStatic && !nativeFresh)
              entry.signals = NATIVE_READ_COLLECTOR?.serialize(
                catchReads,
                RESOLVED?.initialDocumentSignals
              );
            if (SERIAL !== null) {
              if (!entry.serverOwnedStatic) {
                caughtSeeds.push(...SERIAL.slice(serialStart));
              }
              SERIAL.length = serialStart;
            }
            entry.state = "done";
            entry.html = inner;
            entry.rawHtml = VT_SSR_HAS_RAW_HTML;
            entry.seeds = nativeFresh ? [] : caughtSeeds;
            pruneUnrepresentedStreamDescendants(stream, key, entry.html);
          } else if (SERIAL !== null) {
            SERIAL.length = serialStart;
          }
          ID_COUNTER = entry.pendingIdOffset;
          return pendingForm();
        }
        if (!nativeFresh) appendNativeSeedReads(catchReads);
        return ssrBlock(inner);
      }
      if (stream !== null) {
        if (SERIAL !== null) SERIAL.length = serialStart;
        if (entry === void 0 && PERMANENT_STATIC_HYDRATE_DEPTH !== 0) throw e;
        if (entry === void 0) {
          const pendingIdOffset = Math.max(0, ID_COUNTER - outerIdCounter);
          restoreOuterIds();
          const order = stream.nextId++;
          entry = {
            id: stream.token + "-" + order.toString(36),
            order,
            state: "errored",
            serverOwnedStatic: false,
            error: e,
            html: "",
            rawHtml: false,
            seeds: [],
            pendingIdOffset,
            namespace,
            ancestors: ancestorKeys,
            owners: ownerKeys
          };
          recordStreamBoundaryMutation(stream, key);
          stream.boundaries.set(key, entry);
          if (ownerKeys.length !== 0) recordStreamBoundaryOwners(stream, ownerKeys);
          enterBoundaryIds(pendingIdOffset);
        } else if (entry.state === "pending") {
          entry.state = "errored";
          entry.error = e;
          ID_COUNTER = entry.pendingIdOffset;
        } else if (entry.state === "errored") {
          ID_COUNTER = entry.pendingIdOffset;
        } else {
          throw e;
        }
        const fallback = pendingForm();
        pruneUnrepresentedStreamDescendants(stream, key, fallback);
        return fallback;
      }
      if (recoverErrors && pendFn !== null && PERMANENT_STATIC_HYDRATE_DEPTH === 0) {
        if (SERIAL !== null) SERIAL.length = serialStart;
        const reports = RESOLVED?.bufferedErrors ?? (RESOLVED.bufferedErrors = /* @__PURE__ */ new Map());
        if (!reports.has(key)) reports.set(key, { error: e, reported: false });
        nativeFresh = true;
        return pendingForm();
      }
      throw e;
    }
  } finally {
    ASYNC_SCOPE = outerAsyncScope;
    if (boundaryIds) restoreOuterIds();
  }
}
let STREAM_RUNTIME_JS;
function streamRuntimeJs() {
  return STREAM_RUNTIME_JS ??= '(function(){if(window.$OCTRC)return;var d=document;var S=window.$OCTS=window.$OCTS||{},E;var M=function(v,c){if(v===c)return 1;if(!v||v.charAt(0)!==c)return 0;var s=v.slice(1),n=+s;return n>=2&&Number.isSafeInteger(n)&&String(n)===s;};var P=function(s){var q=s.firstElementChild;if(q&&q.localName==="script"&&q.hasAttribute("' + import_constants.STREAM_SCRIPT_ATTR + `")){var z=d.createElement("template");try{z.innerHTML=JSON.parse(q.textContent);return z.content;}catch(e){return null;}}return s;};var C=function(c,nc){if(!nc)return c;var n=c.firstElementChild;while(n&&n.localName==="script")n=n.nextElementSibling;return n;};window.$OCTRC=function(id,nc){var t=d.querySelector('template[` + import_constants.STREAM_BOUNDARY_ATTR + `="'+id+'"]');var s=d.querySelector('[` + import_constants.STREAM_SEGMENT_ATTR + `="'+id+'"]');if(!s)return;if(!t){s.remove();return;}var c=P(s);if(!c)return;var sd=c.querySelector("script[` + import_constants.STREAM_SEED_ATTR + ']");if(sd){S[id]=sd.textContent;sd.parentNode.removeChild(sd);}var ns=c.firstElementChild;while(ns&&!(ns.localName==="script"&&ns.hasAttribute("' + import_native_read_seeds.NATIVE_SIGNAL_SEED_ATTR + '")))ns=ns.nextElementSibling;if(ns){S[id+"$signals"]=ns.textContent;ns.parentNode.removeChild(ns);}c=C(c,nc);if(!c)return;var n=t.nextSibling,depth=1;while(n){var x=n.nextSibling,v=n.nodeType===8?n.data:null;if(M(v,"["))depth++;else if(M(v,"]")){depth--;if(depth===0)break;}n.parentNode.removeChild(n);n=x;}var p=t.parentNode;while(c.firstChild)p.insertBefore(c.firstChild,n);p.replaceChild(d.createComment("' + import_constants.STREAM_SEED_COMMENT + `"+id),t);s.parentNode.removeChild(s);if(E){var errors=E;E=undefined;for(var i=0;i<errors.length;i++)X(errors[i][0],errors[i][1]);}};window.$OCTRC.marker=M;window.$OCTRC.parse=P;window.$OCTRC.content=C;var X=window.$OCTRX=function(id,so){var t=d.querySelector('template[` + import_constants.STREAM_BOUNDARY_ATTR + `="'+id+'"]');if(t){if(so)t.remove();else t.setAttribute("data-oct-err","");}else(E||(E=[])).push([id,so]);};window.$OCTRH=function(id){var c=d.querySelector('[` + import_constants.STREAM_RESOURCE_ATTR + `="'+id+'"]');if(!c)return;var n;while((n=c.firstElementChild)){c.removeChild(n);if(window.$OCTFR){window.$OCTFR(n);continue;}var p=n.getAttribute("data-precedence"),g=d.head.querySelectorAll("link[data-precedence],style[data-precedence]"),t=g.length?g[g.length-1]:null,x=null;for(var i=0;i<g.length;i++)if(g[i].getAttribute("data-precedence")===p)x=g[i];if(x)x.after(n);else if(t)t.after(n);else d.head.appendChild(n);}c.remove();};})();`;
}
let STREAM_VIEW_TRANSITION_RUNTIME_JS;
function streamViewTransitionRuntimeJs() {
  return STREAM_VIEW_TRANSITION_RUNTIME_JS ??= `(function(){
var w=window,d=document;
if(w.$OCTVT)return;
w.$OCTVT=true;
var reveal=w.$OCTRC,queue=[],scheduled=false,callbackOnly=new WeakSet(),ready=new WeakSet(),waitReady=new WeakSet(),waitFinish=new WeakSet();
w.$OCTRC=function(id,nc){
 if(typeof d.startViewTransition!=="function"&&typeof Element.prototype.startViewTransition!=="function"){reveal(id,nc);return;}
 queue.push([id,nc]);later();
};
function later(){if(queue.length&&!scheduled){scheduled=true;queueMicrotask(function(){scheduled=false;drain();});}}
function watch(handle,untilReady){
 var watched=untilReady?waitReady:waitFinish;
 if(watched.has(handle))return;
 watched.add(handle);
 if(untilReady)handle.ready.then(function(){ready.add(handle);later();},function(){watch(handle,false);});
 else handle.finished.then(later,later);
}
function ownerOf(t){
 var scope=t.closest("[vt-scope]");
 return scope?(scope.getAttribute("vt-scope")==="element"?scope:null):d;
}
function blocked(owner){
 var handle=d.__octaneViewTransition,blocked=false;
 if(handle&&!(owner&&owner!==d&&ready.has(handle))){watch(handle,!!owner&&owner!==d);blocked=true;}
 var scopes=d.__octaneViewTransitionScopes;
 if(scopes)scopes.forEach(function(active,element){
  if(!owner||owner===d||owner===element||owner.contains(element)){watch(active,false);blocked=true;}
  else if(element.contains(owner)&&!ready.has(active)){watch(active,true);blocked=true;}
 });
 return blocked;
}
function drain(){
 if(!queue.length)return;
 var selected=[],pending=[],groups=[],owners=new Map();
 for(var i=0;i<queue.length;i++){
  var item=queue[i],t=d.querySelector('template[${import_constants.STREAM_BOUNDARY_ATTR}="'+item[0]+'"]'),owner=t?ownerOf(t):null;
  if(blocked(owner)){pending.push(item);continue;}
  selected.push(item);
  var group=owners.get(owner);
  if(!group){group={owner:owner,items:[],restore:[],changed:new Set(),prepared:[],arrived:false};owners.set(owner,group);groups.push(group);}
  group.items.push(item);
 }
 queue=pending;
 if(!selected.length)return;
 var committed=false,animated=false,images=[],resourceWait;
 function commit(){
  if(committed)return resourceWait;
  committed=true;for(var i=0;i<selected.length;i++)reveal(selected[i][0],selected[i][1]);
  if(!animated)return;
  var blockers=[],cleanups=[];
  d.documentElement.clientHeight;
  if(d.fonts&&d.fonts.status!=="loaded")blockers.push(d.fonts.ready);
  for(var i=0;i<images.length;i++){
   var img=images[i],bounds=img.getBoundingClientRect();
   if(!img.complete&&bounds.bottom>0&&bounds.right>0&&bounds.top<w.innerHeight&&bounds.left<w.innerWidth){
    blockers.push(new Promise(function(resolve){
     var image=img;image.addEventListener("load",resolve);image.addEventListener("error",resolve);
     cleanups.push(function(){image.removeEventListener("load",resolve);image.removeEventListener("error",resolve);});
    }));
   }
  }
  images.length=0;
  if(blockers.length)resourceWait=new Promise(function(resolve){
   var timer=setTimeout(done,500),settled=false;
   function done(){if(settled)return;settled=true;clearTimeout(timer);for(var i=0;i<cleanups.length;i++)cleanups[i]();cleanups.length=0;resolve();}
   Promise.all(blockers).then(done,done);
  });
  return resourceWait;
 }
 function reset(group){
  var restore=group.restore;
  for(var i=restore.length-1;i>=0;i--){
   var entry=restore[i],el=entry[0],style=el.style;
   if(style.getPropertyValue("view-transition-name")===entry[5]&&style.getPropertyPriority("view-transition-name")===entry[8]){
    if(entry[1])style.setProperty("view-transition-name",entry[1],entry[2]);
    else style.removeProperty("view-transition-name");
   }
   if(style.getPropertyValue("view-transition-class")===entry[6]&&style.getPropertyPriority("view-transition-class")===entry[9]){
    if(entry[3])style.setProperty("view-transition-class",entry[3],entry[4]);
    else style.removeProperty("view-transition-class");
   }
   if(!style.length&&!entry[7])el.removeAttribute("style");
  }
  restore.length=0;group.changed.clear();
 }
 function prepare(group){
  var owner=group.owner,restore=group.restore,changed=group.changed,appearing=new Map();
  if(!owner||typeof owner.startViewTransition!=="function")return;
  function owns(el,content){
   for(var node=el;node&&node.nodeType===1;node=node.parentElement){
    if(node===owner)return true;
    if(node.getAttribute("vt-scope")==="element")return false;
    if(node===content)return true;
   }
   return owner===d;
  }
  function apply(el,attr,content){
   var cls=el.getAttribute(attr);
   if(!cls||cls==="none"||changed.has(el)||!owns(el,content))return;
   var style=el.style;
   if(!style)return;
   var explicit=el.getAttribute("vt-name"),name=explicit||("_OT_"+restore.length+"_");
   var entry=[el,style.getPropertyValue("view-transition-name"),style.getPropertyPriority("view-transition-name"),style.getPropertyValue("view-transition-class"),style.getPropertyPriority("view-transition-class"),"","",el.hasAttribute("style")];
   if(el!==owner||explicit)style.setProperty("view-transition-name",w.CSS.escape(name));
   if(cls!=="auto")style.setProperty("view-transition-class",cls);
   entry[5]=style.getPropertyValue("view-transition-name");entry[6]=style.getPropertyValue("view-transition-class");
   entry[8]=style.getPropertyPriority("view-transition-name");entry[9]=style.getPropertyPriority("view-transition-class");
   restore.push(entry);changed.add(el);
  }
  function descendants(el,attr,content){
   var nodes=el.querySelectorAll("["+attr+"]");
   for(var i=0;i<nodes.length;i++)apply(nodes[i],attr,content);
  }
  for(var k=0;k<group.items.length;k++){
   var id=group.items[k][0],nc=group.items[k][1];
   var t=d.querySelector('template[${import_constants.STREAM_BOUNDARY_ATTR}="'+id+'"]');
   var s=d.querySelector('[${import_constants.STREAM_SEGMENT_ATTR}="'+id+'"]');
   if(!t||!s)continue;
   var parent=t.parentNode,rect=parent.getBoundingClientRect();
   if(!rect.width&&!rect.height&&!rect.left&&!rect.top)continue;
   var parsed=reveal.parse(s);
   if(!parsed)continue;
   if(parsed!==s)s.replaceChildren(parsed);
   var content=reveal.content(s,nc);
   if(!content)continue;
   group.prepared.push([t,content,parent]);
   var matches=content.querySelectorAll("[vt-share]");
   for(var i=0;i<matches.length;i++)if(matches[i].getAttribute("vt-share")!=="none"&&owns(matches[i],content))appearing.set(matches[i].getAttribute("vt-name"),matches[i]);
   var pendingImages=content.querySelectorAll('img[src]:not([loading="lazy"])');
   for(var i=0;i<pendingImages.length;i++)if(owns(pendingImages[i],content))images.push(pendingImages[i]);
  }
  function pair(el){
   if(!owns(el))return false;
   var other=appearing.get(el.getAttribute("vt-name"));
   if(other&&el.getAttribute("vt-share")&&el.getAttribute("vt-share")!=="none"){
    apply(el,"vt-share");apply(other,"vt-share",other.closest('[${import_constants.STREAM_SEGMENT_ATTR}]'));appearing.delete(el.getAttribute("vt-name"));return true;
   }
   return false;
  }
  for(var k=0;k<group.prepared.length;k++){
   var t=group.prepared[k][0],content=group.prepared[k][1],parent=group.prepared[k][2];
   var node=t.nextSibling,depth=1;
   while(node){
    if(node.nodeType===8){
     var v=node.data;
     if(reveal.marker(v,"["))depth++;else if(reveal.marker(v,"]")&&!--depth)break;
    }else if(node.nodeType===1){
     if(!pair(node))apply(node,"vt-exit");
     matches=node.querySelectorAll("[vt-share]");for(var j=0;j<matches.length;j++)pair(matches[j]);
     descendants(node,"vt-parent-exit");
    }
    node=node.nextSibling;
   }
   for(var el=content.firstElementChild;el;el=el.nextElementSibling){apply(el,"vt-enter",content);descendants(el,"vt-parent-enter",content);}
   do{
    for(var sibling=parent.firstElementChild;sibling;sibling=sibling.nextElementSibling)apply(sibling,"vt-update");
    if(parent===owner)break;
    parent=parent.parentNode;
   }while(parent&&parent.nodeType===1&&parent.getAttribute("vt-update")!=="none");
  }
  if(owner!==d&&group.prepared.length)apply(owner,"vt-update");
 }
 var captures=[],documentGroup=null,elementsToEnter=0,remaining=0,resolveGate,rejectGate;
 var gate=new Promise(function(resolve,reject){resolveGate=resolve;rejectGate=reject;});
 gate.catch(function(){});
 for(var i=0;i<groups.length;i++){
  try{prepare(groups[i]);}catch(error){reset(groups[i]);}
  if(groups[i].restore.length){captures.push(groups[i]);if(groups[i].owner===d)documentGroup=groups[i];else elementsToEnter++;}
 }
 remaining=captures.length;animated=remaining>0;
 if(!remaining){images.length=0;commit();later();return;}
 function arrive(group){
  if(group.arrived)return gate;
  group.arrived=true;remaining--;
  if(group.owner!==d&&!--elementsToEnter&&documentGroup)start(documentGroup);
  if(!remaining){try{Promise.resolve(commit()).then(resolveGate,rejectGate);}catch(error){rejectGate(error);}}
  return gate;
 }
 function start(group){
  if(group.started)return;group.started=true;
  var owner=group.owner,transition,startNative=owner.startViewTransition,update=function(){return arrive(group);};
  try{
   if(callbackOnly.has(startNative))transition=startNative.call(owner,update);
   else{
    try{transition=startNative.call(owner,{update:update,types:[]});}
    catch(error){
     if(!(error instanceof TypeError))throw error;
     transition=startNative.call(owner,update);callbackOnly.add(startNative);
    }
   }
   if(owner===d)d.__octaneViewTransition=transition;
   else (d.__octaneViewTransitionScopes||(d.__octaneViewTransitionScopes=new Map())).set(owner,transition);
   transition.ready.then(function(){ready.add(transition);reset(group);later();},function(){reset(group);});
   function complete(){
    reset(group);
    if(owner===d){if(d.__octaneViewTransition===transition)d.__octaneViewTransition=null;}
    else{var scopes=d.__octaneViewTransitionScopes;if(scopes&&scopes.get(owner)===transition)scopes.delete(owner);}
    drain();
   }
   transition.finished.then(complete,complete);
  }catch(error){reset(group);arrive(group);if(!error||(error.name!=="AbortError"&&error.name!=="InvalidStateError"))console.error(error);}
 }
 for(var i=0;i<captures.length;i++)if(captures[i].owner!==d)start(captures[i]);
 if(!elementsToEnter&&documentGroup&&!documentGroup.arrived)start(documentGroup);
}
})();`;
}
function needsAutomaticSignalInjection(options) {
  return options?.streamedSignals !== void 0 && options?.injection?.observeSignalAttempt === void 0;
}
async function prepareAutomaticSignalInjection(options) {
  const config = options.streamedSignals;
  const { createAutomaticStreamedSignalInjection } = await import("./server/streamed-signals.js");
  return {
    ...options,
    injection: createAutomaticStreamedSignalInjection(
      { ...config, nonce: options.nonce },
      options.injection
    )
  };
}
function withStream(stream, fn) {
  const prev = STREAM;
  STREAM = stream;
  try {
    return fn();
  } finally {
    STREAM = prev;
  }
}
const DOCUMENT_TAIL_RE = /^<\/body>(?:\s|<!--[^]*?-->)*<\/html>(?:\s|<!--[^]*?-->)*$/;
function documentTailStart(body) {
  const index = body.lastIndexOf("</body>");
  if (index === -1) return -1;
  return DOCUMENT_TAIL_RE.test(body.slice(index)) ? index : -1;
}
function isDocumentRoot(body) {
  let i = 0;
  while (body.startsWith("<!--[-->", i)) i += 8;
  if (!body.startsWith("<html", i)) return false;
  const next = body.charCodeAt(i + 5);
  return next === 62 || next === 32 || next === 9 || next === 10 || next === 13;
}
function isLeadingHeadRoot(body) {
  let i = 0;
  while (body.startsWith("<!--[-->", i)) i += 8;
  if (!body.startsWith("<head", i)) return false;
  const next = body.charCodeAt(i + 5);
  return next === 62 || next === 32 || next === 9 || next === 10 || next === 13;
}
function documentHeadInsertionPoint(body) {
  let searchFrom = 0;
  for (; ; ) {
    const start = body.indexOf("<head", searchFrom);
    if (start === -1) return -1;
    const next = body.charCodeAt(start + 5);
    if (next === 62) return start + 6;
    if (next === 32 || next === 9 || next === 10 || next === 13) {
      return documentTagEnd(body, start + 6);
    }
    searchFrom = start + 5;
  }
}
function documentTagEnd(body, from) {
  let quote = 0;
  for (let i = from; i < body.length; i++) {
    const code = body.charCodeAt(i);
    if (quote !== 0) {
      if (code === quote) quote = 0;
    } else if (code === 34 || code === 39) quote = code;
    else if (code === 62) return i + 1;
  }
  return -1;
}
function findFragmentHeadClose(body, from) {
  while (from !== -1) {
    const start = body.indexOf("<", from);
    if (start === -1) return -1;
    if (body.startsWith("<!--", start)) {
      const end2 = body.indexOf("-->", start + 4);
      if (end2 === -1) return -1;
      from = end2 + 3;
      continue;
    }
    if (body.startsWith("</head>", start)) return start;
    const end = documentTagEnd(body, start + 1);
    if (end === -1) return -1;
    let rawClose = null;
    if (body.startsWith("<script", start)) {
      const next = body.charCodeAt(start + 7);
      if (next === 62 || next === 32 || next === 9 || next === 10 || next === 13)
        rawClose = "</script>";
    } else if (body.startsWith("<style", start)) {
      const next = body.charCodeAt(start + 6);
      if (next === 62 || next === 32 || next === 9 || next === 10 || next === 13)
        rawClose = "</style>";
    }
    if (rawClose !== null) {
      const rawEnd = body.indexOf(rawClose, end);
      if (rawEnd === -1) return -1;
      from = rawEnd + rawClose.length;
    } else from = end;
  }
  return -1;
}
function segmentChunk(b, nonceAttr) {
  let seedScript = "";
  if (b.seeds.length > 0) {
    const json = serializeSuspenseSeedJson(b.seeds);
    if (json !== "[]") {
      seedScript = '<script type="application/json" ' + import_constants.STREAM_SEED_ATTR + nonceAttr + ">" + json + "</script>";
    }
  }
  if (b.signals !== void 0) seedScript += serializeNativeSignalSeeds(b.signals, nonceAttr);
  const html = vtSsrStrip(b.html, b.rawHtml);
  const content = b.namespace === "svg" ? seedScript + "<svg>" + html + "</svg>" : b.namespace === "mathml" ? seedScript + "<math>" + html + "</math>" : seedScript + html;
  const hasNamespaceCarrier = b.namespace === "html" ? "" : ",1";
  const payload = JSON.stringify(content).replace(/<(?=\/?script)/gi, "\\u003c");
  return "<div hidden " + import_constants.STREAM_SEGMENT_ATTR + '="' + escapeAttr(b.id) + '"><script type="application/json" ' + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">" + payload + "</script></div><script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">$OCTRC(" + JSON.stringify(b.id).replace(/</g, "\\u003c") + hasNamespaceCarrier + ")</script>";
}
function floatResourceChunk(tags, carrierId, nonceAttr) {
  return "<div hidden " + import_constants.STREAM_RESOURCE_ATTR + '="' + escapeAttr(carrierId) + '">' + tags + "</div><script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">$OCTRH(" + JSON.stringify(carrierId).replace(/</g, "\\u003c") + ")</script>";
}
function boundaryErrorChunk(b, nonceAttr) {
  const serverOwnedStatic = b.serverOwnedStatic ? ",1" : "";
  return "<script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">$OCTRX(" + JSON.stringify(b.id).replace(/</g, "\\u003c") + serverOwnedStatic + ")</script>";
}
function createInjectionCanceler(injection) {
  if (injection === void 0) return NOOP;
  let cancelled = false;
  return (error) => {
    if (cancelled) return;
    cancelled = true;
    try {
      injection.cancel?.(error);
    } catch {
    }
  };
}
async function runStream(component, props, options, sink, resolved, cancelInjection) {
  const timeoutMs = options?.timeoutMs ?? SUSPENSE_TIMEOUT_MS;
  const signal = options?.signal;
  const nonceAttr = nonceAttrOf(options);
  const identifierPrefix = options?.identifierPrefix ?? "";
  const stream = {
    boundaries: /* @__PURE__ */ new Map(),
    boundaryOwnerKeys: /* @__PURE__ */ new Set(),
    nextId: 0,
    token: createStreamToken(),
    activePassBoundaryKeys: null,
    activeTryKeys: [],
    activeOwnerKeys: [],
    replay: null
  };
  const renderFullPass = () => {
    const boundaryKeys = /* @__PURE__ */ new Set();
    resolved.streamSettlements?.landed.clear();
    const previousBoundaryKeys = stream.activePassBoundaryKeys;
    const previousReplay = stream.replay;
    stream.activePassBoundaryKeys = boundaryKeys;
    stream.replay = [];
    try {
      return {
        pass: withStream(
          stream,
          () => runFullFramedPass(component, props, resolved, nonceAttr, identifierPrefix)
        ),
        boundaryKeys
      };
    } finally {
      stream.activePassBoundaryKeys = previousBoundaryKeys;
      stream.replay = previousReplay;
    }
  };
  const injection = options?.injection;
  if (injection !== void 0) injection.done.then(NOOP, NOOP);
  let injectionCompleted = false;
  const completeInjection = injection === void 0 ? NOOP : () => {
    if (injectionCompleted) return;
    injectionCompleted = true;
    injection.renderComplete?.();
  };
  let injectionUnsubscribe;
  let injectionFailure;
  let injectionFailed = false;
  const unacceptedInjection = injection === void 0 ? void 0 : [];
  const rememberUnaccepted = injection === void 0 ? NOOP : (chunk) => {
    unacceptedInjection.push(chunk);
  };
  let signalInjectionFailure;
  const failInjection = (err) => {
    if (signal?.aborted && err === signal.reason) return;
    if (injectionFailed) return;
    injectionFailed = true;
    injectionFailure = err;
    signalInjectionFailure?.();
  };
  let writeChain = injection === void 0 ? null : Promise.resolve();
  const write = injection === void 0 ? (chunk, terminal) => sink.write(chunk, terminal) : (chunk, terminal, onUnaccepted) => {
    const operation = writeChain.then(() => sink.write(chunk, terminal, onUnaccepted));
    writeChain = operation.then(NOOP, NOOP);
    return operation;
  };
  const drainInjection = () => {
    if (injection === void 0 || injectionFailed) return;
    let html;
    try {
      html = injection.take();
    } catch (err) {
      failInjection(err);
      return;
    }
    if (!html) return;
    const written = write(html, false, rememberUnaccepted);
    if (written === void 0) {
      injection.accepted?.();
      return;
    }
    return written.then(() => {
      injection.accepted?.();
    });
  };
  const recoveryInjection = injection === void 0 ? void 0 : async (error) => {
    let queued = "";
    if (!injectionFailed) {
      try {
        queued = injection.take();
      } catch {
      }
    }
    cancelInjection(error);
    if (signal?.aborted) {
      await writeChain;
      for (const html of unacceptedInjection) {
        const replay = write(html, "recovery");
        if (replay !== void 0) await replay;
      }
      unacceptedInjection.length = 0;
    }
    if (queued !== "" && signal?.aborted) {
      const replay = write(queued, "recovery");
      if (replay !== void 0) await replay;
      return "";
    }
    return queued;
  };
  const notifyInjection = () => {
    const drained = drainInjection();
    if (drained !== void 0) drained.catch(failInjection);
  };
  const waitForInjectionDone = () => new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", onAbort);
      signalInjectionFailure = void 0;
      fn();
    };
    const onAbort = () => finish(() => reject(signal.reason));
    signalInjectionFailure = () => finish(() => reject(injectionFailure));
    if (injectionFailed) return finish(() => reject(injectionFailure));
    if (signal?.aborted) return onAbort();
    signal?.addEventListener("abort", onAbort, { once: true });
    injection.done.then(
      () => finish(resolve),
      (err) => finish(() => reject(err))
    );
  });
  const emittedCss = /* @__PURE__ */ new Set();
  const flushedSheets = /* @__PURE__ */ new Set();
  let resourceChunkSeq = 0;
  const flushedSegments = /* @__PURE__ */ new Set();
  const observedDone = /* @__PURE__ */ new Set();
  const reachableDoneSegments = () => {
    const done = [];
    const reachable = new Set(flushedSegments);
    for (; ; ) {
      const next = [];
      for (const boundary of stream.boundaries.values()) {
        if (boundary.state !== "done" || reachable.has(boundary.id)) continue;
        let visible = true;
        for (let i = boundary.ancestors.length - 1; i >= 0; i--) {
          const ancestor = stream.boundaries.get(boundary.ancestors[i]);
          if (ancestor !== void 0) {
            visible = reachable.has(ancestor.id);
            break;
          }
        }
        if (visible) next.push(boundary);
      }
      next.sort((a, b) => a.order - b.order);
      if (next.length === 0) return done;
      for (const boundary of next) {
        done.push(boundary);
        reachable.add(boundary.id);
      }
    }
  };
  const reportRecoverableBoundaryErrors = () => {
    for (const boundary of stream.boundaries.values()) {
      if (boundary.state !== "errored" || boundary.errorReported) continue;
      boundary.errorReported = true;
      options?.onError?.(boundary.error);
    }
  };
  const reachableErroredBoundaries = () => {
    const errors = [];
    for (const boundary of stream.boundaries.values()) {
      if (boundary.state !== "errored" || boundary.errorFlushed) continue;
      let visible = true;
      for (let i = boundary.ancestors.length - 1; i >= 0; i--) {
        const ancestor = stream.boundaries.get(boundary.ancestors[i]);
        if (ancestor !== void 0) {
          visible = flushedSegments.has(ancestor.id);
          break;
        }
      }
      if (visible) errors.push(boundary);
    }
    return errors.sort((a, b) => a.order - b.order);
  };
  const flushRecoverableBoundaryErrors = () => {
    const errors = reachableErroredBoundaries();
    if (errors.length === 0) return;
    let chunk = "";
    for (const boundary of errors) chunk += boundaryErrorChunk(boundary, nonceAttr);
    const errorWrite = write(chunk);
    const markFlushed = () => {
      for (const boundary of errors) boundary.errorFlushed = true;
    };
    if (errorWrite === void 0) {
      markFlushed();
      return;
    }
    return errorWrite.then(markFlushed);
  };
  let pass;
  let shellBoundaryKeys;
  let preShellSuspended = [];
  let retryWithoutSettling = false;
  const stall = { waves: 0, since: 0, width: 0 };
  try {
    signal?.throwIfAborted();
    ({ pass, boundaryKeys: shellBoundaryKeys } = renderFullPass());
    preShellSuspended = pass.suspended;
    signal?.throwIfAborted();
    let rootAttempts = 0;
    while (pass.rootSuspended) {
      if (pass.suspended.length === 0) {
        throw new Error((0, import_error_codes_server_generated.formatServerError)(34));
      }
      if (++rootAttempts > MAX_SUSPENSE_PASSES) {
        throw new Error(
          isThrownWave(pass.suspended) ? (0, import_error_codes_server_generated.formatServerError)(335, MAX_SUSPENSE_PASSES) : (0, import_error_codes_server_generated.formatServerError)(35, MAX_SUSPENSE_PASSES)
        );
      }
      const settledWave = pass.suspended;
      if (!retryWithoutSettling && await settleFirstOfWave(settledWave, resolved, timeoutMs, signal, stall)) {
        rootAttempts--;
      }
      ({ pass, boundaryKeys: shellBoundaryKeys } = renderFullPass());
      preShellSuspended = pass.suspended;
      retryWithoutSettling = observeSuspenseWave(resolved, settledWave, pass.suspended, false);
      signal?.throwIfAborted();
    }
    stall.waves = 0;
    pruneStreamBoundariesAbsentFromShell(stream, shellBoundaryKeys);
  } catch (err) {
    try {
      completeInjection();
    } catch {
    }
    const reports = signal?.aborted ? Math.max(1, preShellSuspended.length) : 1;
    for (let i = 0; i < reports; i++) options?.onError?.(err);
    sink.shellError(err);
    return;
  }
  try {
    reportRecoverableBoundaryErrors();
  } catch (err) {
    try {
      completeInjection();
    } catch {
    }
    throw err;
  }
  if (pass.sheets !== null) for (const key of pass.sheets.keys()) flushedSheets.add(key);
  let leadingStyles = "";
  for (const [hash, sheet] of pass.cssEntries) {
    emittedCss.add(hash);
    leadingStyles += '<style data-octane="' + hash + '"' + (sheet.nonce === void 0 ? nonceAttr : ' nonce="' + escapeAttr(sheet.nonce) + '"') + ">" + escapeEntireInlineStyleContent(sheet.css) + "</style>";
  }
  const separateHead = options?.headChannel === "separate";
  if (separateHead) {
    try {
      options?.onHeadReady?.(pass.vtCandidates ? vtSsrStrip(pass.head, pass.rawHtml) : pass.head);
    } catch (err) {
      try {
        completeInjection();
      } catch {
      }
      throw err;
    }
  }
  const shellHead = separateHead ? "" : pass.head;
  const documentRoot = isDocumentRoot(pass.body);
  let shell = documentRoot ? "<!DOCTYPE html>" : "";
  let heldDocumentTail = "";
  if (injection !== void 0 && documentRoot) {
    const tailStart = documentTailStart(pass.body);
    if (tailStart !== -1) {
      heldDocumentTail = pass.body.slice(tailStart);
      const bodyHtml = spliceHead(pass.body.slice(0, tailStart), "");
      const headInsert = documentHeadInsertionPoint(bodyHtml);
      shell += headInsert !== -1 ? bodyHtml.slice(0, headInsert) + leadingStyles + shellHead + bodyHtml.slice(headInsert) : leadingStyles + shellHead + bodyHtml;
    } else {
      shell += spliceHead(pass.body, leadingStyles + shellHead);
    }
  } else {
    const shellPrefix = leadingStyles + shellHead;
    shell += documentRoot ? spliceHead(pass.body, shellPrefix, true) : shellPrefix === "" ? pass.body : spliceHead(pass.body, shellPrefix, false);
  }
  if (pass.serial.length > 0) shell += serializeSuspenseSeeds(pass.serial, nonceAttr);
  if (pass.signals !== void 0) shell += serializeNativeSignalSeeds(pass.signals, nonceAttr);
  if (options?.earlySignalBootstrap !== "external" && (injection?.streamedRenderer === true || pass.hasSignalControls || options?.independentHydration !== void 0)) {
    shell += "<script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">" + (0, import_early_signals.streamedSignalBootstrapJs)(options?.independentHydration !== void 0) + "</script>";
  }
  if (injection?.takeInitialSelections !== void 0) shell += injection.takeInitialSelections();
  const anyPending = stream.boundaries.size > 0;
  let sentViewTransitions = pass.vtCandidates;
  if (anyPending)
    shell += "<script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">" + streamRuntimeJs() + (sentViewTransitions ? streamViewTransitionRuntimeJs() : "") + "</script>";
  try {
    if (injection?.streamedRenderer === true || pass.hasSignalControls || options?.independentHydration !== void 0) {
      options?.onEarlyHydrationReady?.();
    }
    const shellWrite = write(pass.vtCandidates ? vtSsrStrip(shell, pass.rawHtml) : shell);
    if (shellWrite !== void 0) await shellWrite;
  } catch (err) {
    try {
      completeInjection();
    } catch {
    }
    options?.onError?.(err);
    sink.shellError(err);
    return;
  }
  try {
    sink.shellReady();
  } catch (err) {
    try {
      completeInjection();
    } catch {
    }
    throw err;
  }
  if (injection !== void 0) {
    try {
      injectionUnsubscribe = injection.subscribe(notifyInjection);
    } catch (err) {
      failInjection(err);
    }
    notifyInjection();
  }
  let suspended = pass.suspended;
  let attempt = 0;
  try {
    const initiallyDone = reachableDoneSegments();
    if (initiallyDone.length > 0) {
      let chunk = "";
      for (const boundary of initiallyDone) chunk += segmentChunk(boundary, nonceAttr);
      const segmentWrite = write(pass.vtCandidates ? vtSsrStrip(chunk, pass.rawHtml) : chunk);
      if (segmentWrite !== void 0) await segmentWrite;
      for (const boundary of initiallyDone) {
        flushedSegments.add(boundary.id);
        observedDone.add(boundary.id);
      }
    }
    const initialErrorWrite = flushRecoverableBoundaryErrors();
    if (initialErrorWrite !== void 0) await initialErrorWrite;
    while (hasPendingStreamBoundary(stream)) {
      signal?.throwIfAborted();
      if (suspended.length === 0) {
        throw new Error((0, import_error_codes_server_generated.formatServerError)(36));
      }
      if (++attempt > MAX_SUSPENSE_PASSES) {
        throw new Error(
          isThrownWave(suspended) ? (0, import_error_codes_server_generated.formatServerError)(334, MAX_SUSPENSE_PASSES) : (0, import_error_codes_server_generated.formatServerError)(48, MAX_SUSPENSE_PASSES)
        );
      }
      const settledWave = suspended;
      if (!retryWithoutSettling && await settleFirstOfWave(settledWave, resolved, timeoutMs, signal, stall)) {
        attempt--;
      }
      pass = renderFullPass().pass;
      suspended = pass.suspended;
      reportRecoverableBoundaryErrors();
      let chunk = "";
      for (const [hash, sheet] of pass.cssEntries) {
        if (emittedCss.has(hash)) continue;
        emittedCss.add(hash);
        chunk += '<style data-octane="' + hash + '"' + (sheet.nonce === void 0 ? nonceAttr : ' nonce="' + escapeAttr(sheet.nonce) + '"') + ">" + escapeEntireInlineStyleContent(sheet.css) + "</style>";
      }
      if (pass.sheets !== null) {
        let resourceTags = "";
        for (const [key, entry] of pass.sheets) {
          if (flushedSheets.has(key)) continue;
          flushedSheets.add(key);
          resourceTags += entry.html;
        }
        if (resourceTags !== "") {
          chunk += floatResourceChunk(
            resourceTags,
            stream.token + "-r" + resourceChunkSeq++,
            nonceAttr
          );
        }
      }
      let madeProgress = false;
      for (const boundary of stream.boundaries.values()) {
        if (boundary.state === "done" && !observedDone.has(boundary.id)) {
          observedDone.add(boundary.id);
          madeProgress = true;
        }
      }
      if (madeProgress) {
        attempt = 0;
        stall.waves = 0;
      }
      retryWithoutSettling = observeSuspenseWave(resolved, settledWave, suspended, madeProgress);
      const done = reachableDoneSegments();
      if (!sentViewTransitions && pass.vtCandidates && done.length > 0) {
        sentViewTransitions = true;
        chunk += "<script " + import_constants.STREAM_SCRIPT_ATTR + nonceAttr + ">" + streamViewTransitionRuntimeJs() + "</script>";
      }
      for (const b of done) chunk += segmentChunk(b, nonceAttr);
      if (chunk !== "") {
        const segmentWrite = write(pass.vtCandidates ? vtSsrStrip(chunk, pass.rawHtml) : chunk);
        if (segmentWrite !== void 0) await segmentWrite;
        for (const b of done) flushedSegments.add(b.id);
      }
      const errorWrite = flushRecoverableBoundaryErrors();
      if (errorWrite !== void 0) await errorWrite;
    }
  } catch (err) {
    let pendingBoundaryCount = 0;
    for (const boundary of stream.boundaries.values()) {
      if (boundary.state === "pending" && !flushedSegments.has(boundary.id)) pendingBoundaryCount++;
    }
    const reports = signal?.aborted ? Math.max(1, pendingBoundaryCount) : 1;
    for (let i = 0; i < reports; i++) options?.onError?.(err);
    if (injection !== void 0) {
      injectionUnsubscribe?.();
      injectionUnsubscribe = void 0;
      try {
        completeInjection();
      } catch {
      }
    }
    let tail = "";
    if (recoveryInjection !== void 0) {
      try {
        tail = await recoveryInjection(err);
      } catch {
      }
    }
    for (const b of stream.boundaries.values()) {
      if (!flushedSegments.has(b.id) && !b.errorFlushed) tail += boundaryErrorChunk(b, nonceAttr);
    }
    if (heldDocumentTail !== "") tail += heldDocumentTail;
    if (tail !== "") {
      try {
        const terminalWrite = write(tail, true);
        if (terminalWrite !== void 0) await terminalWrite;
      } catch {
      }
    }
    sink.fatal(err);
    return;
  }
  if (injection !== void 0) {
    try {
      completeInjection();
    } catch (err) {
      failInjection(err);
    }
    try {
      await waitForInjectionDone();
      const finalDrain = drainInjection();
      if (finalDrain !== void 0) await finalDrain;
      await writeChain;
      if (injectionFailed) throw injectionFailure;
      if (heldDocumentTail !== "") {
        const tailChunk = heldDocumentTail;
        heldDocumentTail = "";
        const tailWrite = write(tailChunk, false, (unaccepted) => {
          heldDocumentTail = unaccepted;
        });
        if (tailWrite !== void 0) await tailWrite;
      }
    } catch (err) {
      options?.onError?.(err);
      injectionUnsubscribe?.();
      injectionUnsubscribe = void 0;
      let terminal = "";
      try {
        terminal = await recoveryInjection(err);
      } catch {
      }
      terminal += heldDocumentTail;
      if (terminal !== "") {
        try {
          const terminalWrite = write(terminal, true);
          if (terminalWrite !== void 0) await terminalWrite;
        } catch {
        }
      }
      sink.fatal(err);
      return;
    }
    injectionUnsubscribe?.();
  }
  sink.allReady();
}
function renderToPipeableStream(entryComponent, props, options) {
  const component = typeof entryComponent === "function" ? entryComponent : renderEntryValue;
  if (typeof entryComponent !== "function") {
    options ??= props;
    props = { value: entryComponent };
  }
  const controller = new AbortController();
  let removeOuterAbort;
  if (options?.signal) {
    const outer = options.signal;
    if (outer.aborted) controller.abort(outer.reason);
    else {
      const onAbort = () => controller.abort(outer.reason);
      outer.addEventListener("abort", onAbort, { once: true });
      removeOuterAbort = () => outer.removeEventListener("abort", onAbort);
    }
  }
  let destination = null;
  const buffered = [];
  let ended = false;
  let closed = false;
  let endCalled = false;
  let pipeCalled = false;
  let writeGate = null;
  let shellFailure = null;
  const destinationFailure = (reason) => {
    if (closed) return;
    closed = true;
    const error = reason ?? new Error((0, import_error_codes_server_generated.formatServerError)(38));
    if (ended) options?.onError?.(error);
    if (!controller.signal.aborted) {
      controller.abort(error);
    }
  };
  const finishEnd = () => {
    if (!ended || destination === null || writeGate !== null || endCalled || closed) return;
    endCalled = true;
    try {
      if (shellFailure !== null && destination.destroy !== void 0) {
        closed = true;
        destination.destroy(shellFailure.error);
        return;
      }
      destination.end();
    } catch (err) {
      destinationFailure(err);
    }
  };
  const waitForDrain = (dest, allowAborted = false) => {
    if (allowAborted && closed) return Promise.reject(new Error((0, import_error_codes_server_generated.formatServerError)(38)));
    if (dest.once === void 0) {
      return Promise.reject(new TypeError((0, import_error_codes_server_generated.formatServerError)(39)));
    }
    return new Promise((resolve, reject) => {
      let settled = false;
      const remove = (event, listener) => {
        if (dest.off !== void 0) dest.off(event, listener);
        else dest.removeListener?.(event, listener);
      };
      const cleanup = () => {
        remove("drain", onDrain);
        remove("error", onError);
        remove("close", onClose);
        controller.signal.removeEventListener("abort", onAbort);
      };
      const finish = (fn) => {
        if (settled) return;
        settled = true;
        cleanup();
        fn();
      };
      const onDrain = () => finish(resolve);
      const onError = (err) => finish(() => {
        destinationFailure(err);
        reject(err);
      });
      const onClose = () => finish(() => {
        const err = new Error((0, import_error_codes_server_generated.formatServerError)(38));
        if (!endCalled) destinationFailure(err);
        reject(err);
      });
      const onAbort = () => finish(() => reject(controller.signal.reason));
      dest.once("drain", onDrain);
      dest.once("error", onError);
      dest.once("close", onClose);
      if (!allowAborted) {
        if (controller.signal.aborted) onAbort();
        else controller.signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  };
  const writeNow = (chunk, terminal, onUnaccepted) => {
    const dest = destination;
    if (closed) return Promise.reject(new Error((0, import_error_codes_server_generated.formatServerError)(40)));
    if (terminal === false && controller.signal.aborted) {
      onUnaccepted?.(chunk);
      return Promise.reject(controller.signal.reason);
    }
    let accepted;
    try {
      accepted = dest.write(chunk);
    } catch (err) {
      destinationFailure(err);
      return Promise.reject(err);
    }
    return accepted === false && terminal !== true ? waitForDrain(dest, terminal === "recovery") : void 0;
  };
  const trackWrite = (operation) => {
    const gate = operation.then(
      () => {
      },
      () => {
      }
    );
    writeGate = gate;
    gate.then(() => {
      if (writeGate === gate) {
        writeGate = null;
        finishEnd();
      }
    });
    operation.catch((err) => {
      if (!controller.signal.aborted) destinationFailure(err);
    });
    return operation;
  };
  const queueWrite = (chunk, terminal = false, onUnaccepted) => {
    if (destination === null) {
      buffered.push(
        onUnaccepted === void 0 ? { chunk, terminal } : { chunk, terminal, onUnaccepted }
      );
      return;
    }
    if (writeGate !== null) {
      const operation2 = writeGate.then(() => writeNow(chunk, terminal, onUnaccepted));
      return trackWrite(operation2);
    }
    const operation = writeNow(chunk, terminal, onUnaccepted);
    return operation === void 0 ? void 0 : trackWrite(operation);
  };
  const flushEnd = () => {
    if (ended) return;
    ended = true;
    removeOuterAbort?.();
    finishEnd();
  };
  let started = false;
  const beginRender = (preparedOptions) => {
    const renderOptions = { ...preparedOptions, signal: controller.signal };
    const cancelInjection = createInjectionCanceler(renderOptions.injection);
    let resolved;
    try {
      resolved = newResolvedMap(renderOptions);
    } catch (err) {
      cancelInjection(err);
      shellFailure = { error: err };
      try {
        options?.onError?.(err);
      } finally {
        try {
          options?.onShellError?.(err);
        } finally {
          flushEnd();
        }
      }
      return;
    }
    void runStream(
      component,
      props,
      renderOptions,
      {
        write(chunk, terminal, onUnaccepted) {
          return queueWrite(chunk, terminal, onUnaccepted);
        },
        shellReady() {
          options?.onShellReady?.();
        },
        shellError(err) {
          cancelInjection(err);
          releaseServerRenderResources(resolved);
          shellFailure = { error: err };
          options?.onShellError?.(err);
          flushEnd();
        },
        allReady() {
          releaseServerRenderResources(resolved);
          options?.onAllReady?.();
          flushEnd();
        },
        fatal(err) {
          cancelInjection(err);
          releaseServerRenderResources(resolved);
          options?.onAllReady?.();
          flushEnd();
        }
      },
      resolved,
      cancelInjection
    ).catch((err) => {
      cancelInjection(err);
      releaseServerRenderResources(resolved);
      options?.onError?.(err);
      flushEnd();
    });
  };
  const startRender = () => {
    if (started) return;
    started = true;
    if (needsAutomaticSignalInjection(options)) {
      void prepareAutomaticSignalInjection(options).then(beginRender, (error) => {
        shellFailure = { error };
        options?.onShellError?.(error);
        options?.onError?.(error);
        flushEnd();
      });
    } else beginRender(options);
  };
  queueMicrotask(startRender);
  return {
    pipe(dest) {
      if (pipeCalled) throw new Error((0, import_error_codes_server_generated.formatServerError)(41));
      pipeCalled = true;
      startRender();
      const nodeDest = dest;
      destination = nodeDest;
      if (nodeDest.once !== void 0) {
        nodeDest.once("error", (err) => destinationFailure(err));
        nodeDest.once("close", () => {
          if (!endCalled) destinationFailure(new Error((0, import_error_codes_server_generated.formatServerError)(38)));
        });
      }
      for (const item of buffered) {
        queueWrite(
          item.chunk,
          item.terminal === "recovery" ? "recovery" : item.terminal || controller.signal.aborted,
          item.onUnaccepted
        );
      }
      buffered.length = 0;
      finishEnd();
      return dest;
    },
    abort(reason) {
      if (!ended) controller.abort(reason ?? new Error((0, import_error_codes_server_generated.formatServerError)(42)));
    }
  };
}
function renderToReadableStream(entryComponent, props, options) {
  const component = typeof entryComponent === "function" ? entryComponent : renderEntryValue;
  if (typeof entryComponent !== "function") {
    options ??= props;
    props = { value: entryComponent };
  }
  if (needsAutomaticSignalInjection(options)) {
    return prepareAutomaticSignalInjection(options).then(
      (prepared) => renderToReadableStream(component, props, prepared)
    );
  }
  return new Promise((resolveShell, rejectShell) => {
    const encoder = new TextEncoder();
    const renderController = new AbortController();
    let removeOuterAbort;
    if (options?.signal) {
      const outer = options.signal;
      if (outer.aborted) renderController.abort(outer.reason);
      else {
        const onAbort = () => renderController.abort(outer.reason);
        outer.addEventListener("abort", onAbort, { once: true });
        removeOuterAbort = () => outer.removeEventListener("abort", onAbort);
      }
    }
    let readableController;
    let wakeDemand = null;
    let consumerCancelled = false;
    let cancelReason;
    let closed = false;
    let allReadyResolve;
    let allReadyReject;
    const allReady = new Promise((res, rej) => {
      allReadyResolve = res;
      allReadyReject = rej;
    });
    allReady.catch(() => {
    });
    const wakeWriter = () => {
      const wake = wakeDemand;
      wakeDemand = null;
      wake?.();
    };
    const stream = new ReadableStream({
      start(c) {
        readableController = c;
      },
      pull() {
        wakeWriter();
      },
      cancel(reason) {
        if (closed) return;
        consumerCancelled = true;
        cancelReason = reason ?? new Error((0, import_error_codes_server_generated.formatServerError)(43));
        removeOuterAbort?.();
        renderController.abort(cancelReason);
        wakeWriter();
      }
    });
    stream.allReady = allReady;
    let shellDone = false;
    let terminal = false;
    let released = false;
    let callbackFailure;
    const waitForDemand = (allowAborted = false) => new Promise((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        renderController.signal.removeEventListener("abort", onAbort);
      };
      const finish = (fn) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (wakeDemand === onDemand) wakeDemand = null;
        fn();
      };
      const onDemand = () => finish(resolve);
      const onAbort = () => finish(() => reject(renderController.signal.reason));
      wakeDemand = onDemand;
      if (!allowAborted) {
        if (renderController.signal.aborted) onAbort();
        else renderController.signal.addEventListener("abort", onAbort, { once: true });
      }
    });
    const writeReadable = (chunk, terminal2 = false, onUnaccepted) => {
      if (closed || consumerCancelled) {
        return Promise.reject(cancelReason ?? new Error((0, import_error_codes_server_generated.formatServerError)(44)));
      }
      if (terminal2 === false && renderController.signal.aborted) {
        onUnaccepted?.(chunk);
        return Promise.reject(renderController.signal.reason);
      }
      const bytes = encoder.encode(chunk);
      if (terminal2 === true) {
        readableController.enqueue(bytes);
        return;
      }
      if ((readableController.desiredSize ?? 0) > 0) {
        readableController.enqueue(bytes);
        return;
      }
      return (async () => {
        try {
          while ((readableController.desiredSize ?? 0) <= 0) {
            await waitForDemand(terminal2 === "recovery");
            if (closed || consumerCancelled) {
              throw cancelReason ?? new Error((0, import_error_codes_server_generated.formatServerError)(44));
            }
          }
          readableController.enqueue(bytes);
        } catch (err) {
          if (!consumerCancelled && renderController.signal.aborted) onUnaccepted?.(chunk);
          throw err;
        }
      })();
    };
    const closeReadable = () => {
      if (closed || consumerCancelled) return;
      closed = true;
      removeOuterAbort?.();
      wakeWriter();
      try {
        readableController.close();
      } catch {
      }
    };
    const renderOptions = { ...options, signal: renderController.signal };
    if (options?.onError !== void 0) {
      renderOptions.onError = (error) => {
        try {
          options.onError(error);
        } catch (err) {
          callbackFailure ??= { error: err };
        }
      };
    }
    const cancelInjection = createInjectionCanceler(renderOptions.injection);
    let resolved;
    const release = () => {
      if (released) return;
      released = true;
      if (resolved !== void 0) releaseServerRenderResources(resolved);
    };
    const settleFailure = (error) => {
      if (terminal) return;
      terminal = true;
      cancelInjection(error);
      try {
        release();
      } catch (err) {
        error = err;
      }
      const reason = callbackFailure === void 0 ? error : callbackFailure.error;
      if (!shellDone) rejectShell(reason);
      allReadyReject(reason);
      closeReadable();
    };
    try {
      resolved = newResolvedMap(renderOptions);
    } catch (err) {
      renderOptions.onError?.(err);
      try {
        options?.onShellError?.(err);
      } catch (callbackError) {
        settleFailure(callbackError);
        return;
      }
      settleFailure(err);
      return;
    }
    runStream(
      component,
      props,
      renderOptions,
      {
        write(chunk, terminal2, onUnaccepted) {
          return writeReadable(chunk, terminal2, onUnaccepted);
        },
        shellReady() {
          options?.onShellReady?.();
          shellDone = true;
          resolveShell(stream);
        },
        shellError(err) {
          try {
            release();
            options?.onShellError?.(err);
          } catch (callbackError) {
            settleFailure(callbackError);
            return;
          }
          settleFailure(err);
        },
        allReady() {
          if (terminal) return;
          try {
            release();
            options?.onAllReady?.();
          } catch (err) {
            renderOptions.onError?.(err);
            settleFailure(err);
            return;
          }
          terminal = true;
          if (callbackFailure === void 0) allReadyResolve();
          else allReadyReject(callbackFailure.error);
          closeReadable();
        },
        fatal(err) {
          settleFailure(err);
        }
      },
      resolved,
      cancelInjection
    ).catch((err) => {
      renderOptions.onError?.(err);
      settleFailure(err);
    });
  });
}
function emitHeadHint(key, html) {
  if (HEAD === null) return;
  if (HEAD.hints.has(key)) return;
  HEAD.replay = null;
  HEAD.hints.add(key);
  (HEAD.hintHtml ??= /* @__PURE__ */ new Map()).set(key, html);
}
const KNOWN_HINT_OPTIONS = /* @__PURE__ */ new Set([
  "as",
  "crossOrigin",
  "integrity",
  "nonce",
  "type",
  "fetchPriority",
  "referrerPolicy",
  "imageSrcSet",
  "imageSizes",
  "media"
]);
function hintAttrs(opts, skipAs, tag) {
  let out = "";
  if (opts == null) return out;
  for (const k in opts) {
    if (!KNOWN_HINT_OPTIONS.has(k)) continue;
    if (skipAs && k === "as") continue;
    const v = opts[k];
    if (v == null || v === false) continue;
    const name = k === "crossOrigin" ? "crossorigin" : k.toLowerCase();
    if (v === true) {
      out += " " + name;
    } else {
      const value = typeof v === "string" ? v : String(v);
      out += " " + name + '="' + escapeAttr((0, import_sanitize_url.sanitizeURLAttribute)(tag, name, value)) + '"';
    }
  }
  return out;
}
function coerceHintHref(href) {
  return typeof href === "string" && href !== "" ? href : null;
}
function preload(href, options) {
  if (__octaneDev) {
    const warning = (0, import_resource_hint_diagnostics.resourceHintWarning)("preload", href, options);
    if (warning !== null) console.error(warning);
  }
  const value = coerceHintHref(href);
  if (value === null) return;
  if (options === null || typeof options !== "object" || !options.as || typeof options.as !== "string")
    return;
  const as = options.as;
  if (as === "font") options = { ...options, crossOrigin: "" };
  if (HEAD !== null) {
    if (as === "style" && HEAD.hints.has("sheet:" + value)) {
      const existing = HEAD.sheets?.get(value);
      if (existing === void 0 || !existing.html.startsWith("<style")) return;
      if (__octaneDev && HEAD.hints.has("dev-inline-style:" + value)) {
        console.error(
          'A <style> resource with href "' + value + '" follows a stylesheet preload for the same href. Inline styles cannot consume a stylesheet preload; remove the preload or use a stylesheet link.'
        );
      }
    }
    if (as === "script" && (HEAD.hints.has("script:" + value) || HEAD.hints.has("module:" + value)))
      return;
    if (as === "style" || as === "script") {
      let subset = null;
      for (const k of ["crossOrigin", "integrity", "nonce", "fetchPriority", "referrerPolicy"]) {
        const v = options[k];
        if (v != null) (subset ??= {})[k] = v;
      }
      if (subset !== null) {
        HEAD.replay = null;
        (HEAD.preloadXfer ??= /* @__PURE__ */ new Map()).set(as + ":" + value, subset);
      }
    }
  }
  const imageSrcSet = as === "image" ? options.imageSrcSet : void 0;
  const key = typeof imageSrcSet === "string" && imageSrcSet !== "" ? "preload:image:" + imageSrcSet + "::" + String(options.imageSizes ?? "") : "preload:" + as + ":" + value;
  const safeHref = (0, import_sanitize_url.sanitizeURL)(value);
  const omitHref = typeof imageSrcSet === "string" && imageSrcSet !== "";
  emitHeadHint(
    key,
    '<link rel="preload"' + (omitHref ? "" : ' href="' + escapeAttr(safeHref) + '"') + hintAttrs(options, false, "link") + ' data-oct-hint="' + escapeAttr(key) + '">'
  );
}
function preinit(href, options) {
  if (__octaneDev) {
    const warning = (0, import_resource_hint_diagnostics.resourceHintWarning)("preinit", href, options);
    if (warning !== null) console.error(warning);
  }
  const value = coerceHintHref(href);
  if (value === null) return;
  if (options === null || typeof options !== "object") return;
  const as = options?.as;
  if (as !== "style" && as !== "script") return;
  let seeded = null;
  if (HEAD !== null) {
    HEAD.replay = null;
    const xfer = HEAD.preloadXfer?.get(as + ":" + value);
    if (xfer !== void 0) {
      seeded = xfer;
      HEAD.preloadXfer.delete(as + ":" + value);
    }
    HEAD.hintHtml?.delete("preload:" + as + ":" + value);
    HEAD.hints.delete("preload:" + as + ":" + value);
  }
  if (as === "style") {
    ssrStylesheetResource({
      ...seeded,
      ...options,
      as: void 0,
      href: value,
      precedence: options.precedence ?? "default"
    });
  } else {
    ssrScriptResource({ ...seeded, ...options, as: void 0, href: void 0, src: value });
  }
}
function preconnect(href, options) {
  if (__octaneDev) {
    const warning = (0, import_resource_hint_diagnostics.resourceHintWarning)("preconnect", href, options);
    if (warning !== null) console.error(warning);
  }
  const value = coerceHintHref(href);
  if (value === null) return;
  if (options !== null && typeof options !== "object") options = void 0;
  else if (options?.crossOrigin !== void 0 && typeof options.crossOrigin !== "string") {
    options = void 0;
  }
  const corsMode = options?.crossOrigin == null ? "<none>" : String(options.crossOrigin);
  const key = "preconnect:" + corsMode + ":" + value;
  const safeHref = (0, import_sanitize_url.sanitizeURL)(value);
  emitHeadHint(
    key,
    '<link rel="preconnect" href="' + escapeAttr(safeHref) + '"' + hintAttrs(options, false, "link") + ' data-oct-hint="' + escapeAttr(key) + '">'
  );
}
function prefetchDNS(href) {
  if (__octaneDev) {
    const warning = (0, import_resource_hint_diagnostics.resourceHintWarning)("prefetchDNS", href, arguments[1], arguments.length > 1);
    if (warning !== null) console.error(warning);
  }
  const value = coerceHintHref(href);
  if (value === null) return;
  const key = "dns-prefetch:" + value;
  const safeHref = (0, import_sanitize_url.sanitizeURL)(value);
  emitHeadHint(
    key,
    '<link rel="dns-prefetch" href="' + escapeAttr(safeHref) + '" data-oct-hint="' + escapeAttr(key) + '">'
  );
}
function resourceAttrs(attrs, tag) {
  let out = "";
  for (const k in attrs) {
    if (k === "precedence" || k === "href" || k === "src" || k === "rel" || k === "async") continue;
    const v = attrs[k];
    if (v == null || v === false || typeof v === "function") continue;
    const name = k === "crossOrigin" ? "crossorigin" : k.toLowerCase();
    if (v === true) out += " " + name;
    else out += " " + name + '="' + escapeAttr((0, import_sanitize_url.sanitizeURLAttribute)(tag, name, String(v))) + '"';
  }
  return out;
}
function ssrStylesheetResource(attrs, invalidReason) {
  if (__octaneDev && invalidReason !== void 0) {
    let conflict;
    if (invalidReason === "missing-href") {
      conflict = "requires a non-empty string `href`";
    } else if (invalidReason === "empty-href") {
      conflict = "has an empty `href`; a stylesheet resource requires a non-empty string `href`";
    } else {
      const props = invalidReason === "onLoad+onError" ? "`onLoad` and `onError`" : "`" + invalidReason + "`";
      conflict = "also has " + props + ", which requires an independently managed stylesheet";
    }
    console.error(
      'A <link rel="stylesheet"> with `precedence` ' + conflict + ". It will not be hoisted or deduplicated; remove the conflicting prop or `precedence`."
    );
    return "";
  }
  if (HEAD === null || attrs == null) return "";
  const href = attrs.href;
  if (typeof href !== "string" || href === "") return "";
  const key = "sheet:" + href;
  if (HEAD.hints.has(key)) return "";
  HEAD.replay = null;
  HEAD.hints.add(key);
  const precedence = attrs.precedence == null ? "" : String(attrs.precedence);
  const tag = '<link rel="stylesheet" href="' + escapeAttr((0, import_sanitize_url.sanitizeURL)(href)) + '" data-precedence="' + escapeAttr(precedence) + '"' + resourceAttrs(attrs, "link") + ">";
  HEAD.replay = null;
  const sheets = HEAD.sheets ??= /* @__PURE__ */ new Map();
  sheets.set(href, { precedence, html: tag });
  return "";
}
function ssrStyleResource(attrs, css, development) {
  if (HEAD === null || attrs == null) return "";
  const href = attrs.href;
  if (typeof href !== "string" || href === "") return "";
  if (__octaneDev && development === true && /\s/.test(href)) {
    console.error(
      'A <style> resource href must not contain whitespace because it identifies the style during hydration; received "' + href + '".'
    );
  }
  if (/<\/style/i.test(css)) {
    if (__octaneDev) {
      console.error(
        'octane SSR: a <style href precedence> resource contains "</style" and cannot be serialized safely; the resource was skipped. Load it as a stylesheet link instead.'
      );
    }
    return "";
  }
  const key = "sheet:" + href;
  if (HEAD.hints.has(key)) return "";
  if (__octaneDev && development === true) {
    if (HEAD.hints.has("preload:style:" + href)) {
      console.error(
        'A <style> resource with href "' + href + '" follows a stylesheet preload for the same href. Inline styles cannot consume a stylesheet preload; remove the preload or use a stylesheet link.'
      );
    }
    HEAD.hints.add("dev-inline-style:" + href);
  }
  HEAD.replay = null;
  HEAD.hints.add(key);
  const precedence = attrs.precedence == null ? "" : String(attrs.precedence);
  const tag = '<style data-precedence="' + escapeAttr(precedence) + '" data-href="' + escapeAttr(href) + '"' + resourceAttrs(attrs, "link") + ">" + css + "</style>";
  HEAD.replay = null;
  const sheets = HEAD.sheets ??= /* @__PURE__ */ new Map();
  sheets.set(href, { precedence, html: tag });
  return "";
}
function ssrScriptResource(attrs) {
  if (HEAD === null || attrs == null) return "";
  const src = attrs.src;
  if (typeof src !== "string" || src === "") return "";
  const key = "script:" + src;
  if (HEAD.hints.has(key) || HEAD.hints.has("module:" + src)) return "";
  HEAD.replay = null;
  HEAD.hints.add(key);
  HEAD.html += '<script src="' + escapeAttr((0, import_sanitize_url.sanitizeURL)(src)) + '" async data-oct-res=""' + resourceAttrs(attrs, "script") + "></script>";
  return "";
}
function preloadModule(href, options) {
  if (__octaneDev) {
    const warning = (0, import_resource_hint_diagnostics.resourceHintWarning)("preloadModule", href, options);
    if (warning !== null) console.error(warning);
  }
  const value = coerceHintHref(href);
  if (value === null) return;
  if (options === null || typeof options !== "object") options = void 0;
  else if ("as" in options && typeof options.as !== "string") {
    options = { ...options, as: void 0 };
  }
  if (HEAD !== null && (HEAD.hints.has("module:" + value) || HEAD.hints.has("script:" + value)))
    return;
  const key = "modulepreload:" + value;
  const safeHref = (0, import_sanitize_url.sanitizeURL)(value);
  emitHeadHint(
    key,
    '<link rel="modulepreload" href="' + escapeAttr(safeHref) + '"' + hintAttrs(options, false, "link") + ' data-oct-hint="' + escapeAttr(key) + '">'
  );
}
function preinitModule(href, options) {
  if (__octaneDev) {
    const warning = (0, import_resource_hint_diagnostics.resourceHintWarning)("preinitModule", href, options);
    if (warning !== null) console.error(warning);
  }
  const value = coerceHintHref(href);
  if (value === null) return;
  if (options != null && typeof options !== "object") return;
  if ((options?.as ?? "script") !== "script") return;
  if (HEAD !== null && HEAD.hints.has("script:" + value)) return;
  const key = "module:" + value;
  const safeHref = (0, import_sanitize_url.sanitizeURL)(value);
  emitHeadHint(
    key,
    '<script type="module" src="' + escapeAttr(safeHref) + '" async' + hintAttrs(options, true, "script") + ' data-oct-hint="' + escapeAttr(key) + '"></script>'
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Activity,
  Children,
  EXTERNAL_HYDRATION_PROMISE,
  ErrorBoundary,
  Fragment,
  HYDRATION_RANGE_BOUNDARY,
  Hydrate,
  Suspense,
  ViewTransition,
  __useLinkedStateWithGetter,
  __useReducerWithGetter,
  __useStateWithGetter,
  addTransitionType,
  beginNativeReadScope,
  beginNativeReadWitness,
  bindPresentationView,
  callWithReceiver,
  cloneElement,
  createContext,
  createElement,
  createElementAt,
  createElementFromConfig,
  createHostedServerSession,
  createPortal,
  createScopedElement,
  createScopedValue,
  descriptorChildren,
  enableNativeReadCollection,
  enableServerSignalBindings,
  encodeAsyncIdentityString,
  endNativeReadScope,
  escapeAttr,
  escapeHtml,
  finishNativeReadWitness,
  flushSync,
  getServerRenderResourceContext,
  getSsrSuspenseTimeout,
  hookSlots,
  injectStyle,
  invokeManualHook,
  isChildrenBlock,
  isRenderCall,
  isValidElement,
  lazy,
  manualHook,
  mapSlot,
  markChildrenBlock,
  markWarm,
  memo,
  namespaceHead,
  namespaceHeadElement,
  nativeCreateScopedElement,
  nativeCreateScopedValue,
  nativeLocalHook,
  nativePuMemo,
  nativeWarmMemo,
  normalizeClass,
  positionalChildren,
  preconnect,
  prefetchDNS,
  preinit,
  preinitModule,
  preload,
  preloadModule,
  prerender,
  prerenderToNodeStream,
  puBatch,
  puMemo,
  readNativeDomProps,
  readNativeDomStyle,
  renderHostedAttempt,
  renderToPipeableStream,
  renderToReadableStream,
  renderToStaticMarkup,
  renderToString,
  replayNativeReadWitness,
  requestFormReset,
  setSsrSuspenseTimeout,
  ssrActivity,
  ssrArm,
  ssrAttr,
  ssrAttrs,
  ssrBindingBlock,
  ssrBindingChild,
  ssrBindingClass,
  ssrBindingHtml,
  ssrBindingKey,
  ssrBlock,
  ssrCheckedAttr,
  ssrChild,
  ssrChildPre,
  ssrChildText,
  ssrChildTextPre,
  ssrChildrenSources,
  ssrClass,
  ssrComponent,
  ssrComponentNS,
  ssrControl,
  ssrElement,
  ssrForBlock,
  ssrForItem,
  ssrFormAuthoringDiagnostics,
  ssrFragmentMarker,
  ssrHeadEl,
  ssrHtml,
  ssrInNamespace,
  ssrInnerHtml,
  ssrInputAttrs,
  ssrIsSuspense,
  ssrNestingText,
  ssrOption,
  ssrOptionValueSources,
  ssrPortal,
  ssrScriptInnerHtml,
  ssrScriptResource,
  ssrSelectAttrs,
  ssrSelectScope,
  ssrSelectScopeSources,
  ssrSignalControlAttrs,
  ssrSignalControlValue,
  ssrSignalValue,
  ssrSnapshotSpread,
  ssrSpread,
  ssrSpreadContent,
  ssrStyle,
  ssrStyleResource,
  ssrStylesheetResource,
  ssrText,
  ssrTextPre,
  ssrTextSlot,
  ssrTextareaText,
  ssrTextareaValue,
  ssrTextareaValueSources,
  ssrTry,
  ssrValueAttr,
  ssrVoidContent,
  startTransition,
  styleMap,
  touchStyleMap,
  trustHTML,
  use,
  useActionState,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useFormStatus,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useLinkedState,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  validateNativeReadWitness,
  warmChild,
  warmMemo,
  withSlot
});
