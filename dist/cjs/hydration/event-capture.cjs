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
var event_capture_exports = {};
__export(event_capture_exports, {
  HYDRATE_SUPPORTED_INTERACTION_EVENTS: () => import_interaction_config2.HYDRATE_SUPPORTED_INTERACTION_EVENTS,
  appendHydrationReplayIntent: () => appendHydrationReplayIntent,
  applyHydrationControlCandidate: () => import_control_capture2.applyHydrationControlCandidate,
  captureHydrationControlCandidate: () => import_control_capture2.captureHydrationControlCandidate,
  captureNativeHydrationIntent: () => captureNativeHydrationIntent,
  consumeHydrationControl: () => import_control_capture2.consumeHydrationControl,
  hydrationEventPathWithin: () => hydrationEventPathWithin,
  hydrationMarkerInteractionStatus: () => hydrationMarkerInteractionStatus,
  initializeHydrationEventCapture: () => initializeHydrationEventCapture,
  initializeIndependentHydrationEventCapture: () => initializeIndependentHydrationEventCapture,
  isHydrationSelectionIntentCurrent: () => isHydrationSelectionIntentCurrent,
  isNativeHydrationIntentCurrent: () => isNativeHydrationIntentCurrent,
  markDelegatedDynamicHydrationIntent: () => markDelegatedDynamicHydrationIntent,
  registerHydrationIntentBoundary: () => registerHydrationIntentBoundary,
  shouldPreventHydrationInteractionDefault: () => shouldPreventHydrationInteractionDefault,
  snapshotHydrationControl: () => import_control_capture2.snapshotHydrationControl,
  takeDelegatedDynamicHydrationIntent: () => takeDelegatedDynamicHydrationIntent,
  takePendingHydrationIntents: () => takePendingHydrationIntents,
  unregisterHydrationIntentBoundary: () => unregisterHydrationIntentBoundary,
  wasEarlyHydrationIntentHandled: () => wasEarlyHydrationIntentHandled
});
module.exports = __toCommonJS(event_capture_exports);
var import_interaction_config = require("./interaction-config.cjs");
var import_hydration_markers = require("../hydration-markers.cjs");
var import_dom_binding_handoff = require("../dom-binding-handoff.cjs");
var import_native_intent = require("./native-intent.cjs");
var import_control_capture = require("./control-capture.cjs");
var import_control_capture2 = require("./control-capture.cjs");
var import_stream_protocol = require("../stream-protocol.cjs");
var import_hydration_markers2 = require("../hydration-markers.cjs");
var import_interaction_config2 = require("./interaction-config.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function isHydrationNode(target) {
  return target !== null && typeof target.nodeType === "number";
}
function isHydrationElement(target) {
  return isHydrationNode(target) && target.nodeType === 1;
}
function shouldPreventHydrationInteractionDefault(event) {
  return event.cancelable && !import_interaction_config.HYDRATE_NATIVE_DEFAULT_INTERACTION_EVENTS.includes(event.type);
}
let independentIntentSequences;
function advanceIndependentIntentSequence(ownerDocument) {
  const sequence = (0, import_native_intent.getNativeHydrationCapture)(ownerDocument)?.next?.() ?? (independentIntentSequences?.get(ownerDocument) ?? 0) + 1;
  (independentIntentSequences ??= /* @__PURE__ */ new WeakMap()).set(ownerDocument, sequence);
  return sequence;
}
function captureHydrationSelectionIntent(event, target, boundary, sequence) {
  const click = event;
  if (event.type !== "click" || click.button !== 0 || click.altKey || click.ctrlKey || click.metaKey || click.shiftKey)
    return;
  const control = target.closest(`button[${import_interaction_config.HYDRATE_SELECTION_ATTR}]`);
  if (control === null || control.type !== "button" || control.closest(`[${import_hydration_markers.HYDRATE_INDEPENDENT_ATTR}]`) !== boundary)
    return;
  const group = control.getAttribute(import_interaction_config.HYDRATE_SELECTION_ATTR);
  if (!group)
    return;
  return { control, boundary, group, sequence };
}
function isHydrationSelectionIntentCurrent(intent) {
  const selection = intent.selection;
  if (selection === void 0)
    return true;
  const { control, boundary, group } = selection;
  return isHydrationElement(intent.event.target) && intent.event.target.isConnected && control.isConnected && boundary.isConnected && control.contains(intent.event.target) && control.type === "button" && control.getAttribute(import_interaction_config.HYDRATE_SELECTION_ATTR) === group && intent.event.target.closest(`[${import_hydration_markers.HYDRATE_INDEPENDENT_ATTR}]`) === boundary;
}
function appendHydrationReplayIntent(queue, intent) {
  const selection = intent.selection;
  const previous = queue[queue.length - 1];
  if (selection !== void 0 && previous?.selection !== void 0 && selection.sequence === previous.selection.sequence + 1 && selection.boundary === previous.selection.boundary && selection.group === previous.selection.group && isHydrationSelectionIntentCurrent(previous)) {
    queue[queue.length - 1] = intent;
  } else {
    queue.push(intent);
  }
}
const HYDRATE_BOUNDARIES = /* @__PURE__ */ new WeakMap();
const HYDRATE_PENDING_INTENTS = /* @__PURE__ */ new WeakMap();
const HYDRATE_DELEGATED_DYNAMIC_MARKERS = /* @__PURE__ */ new WeakSet();
const HYDRATE_HANDLED_INTENT_EVENTS = /* @__PURE__ */ new WeakSet();
const HYDRATE_INTENT_DOCUMENTS = /* @__PURE__ */ new WeakSet();
let independentHydrationDocuments;
function hydrationEventPathWithin(root, target) {
  if (!isHydrationNode(target))
    return null;
  const streamToken = root.getAttribute(import_stream_protocol.HYDRATE_STREAM_TOKEN_ATTR);
  const path = [];
  let node = isHydrationElement(target) ? target : target.parentElement;
  while (node !== root) {
    const parent = node?.parentElement ?? null;
    if (parent === null)
      return null;
    let index = 0;
    let sibling = parent.firstElementChild;
    while (sibling !== null && sibling !== node) {
      if (!(0, import_stream_protocol.isRendererStreamBoundaryTemplate)(sibling, streamToken))
        index++;
      sibling = sibling.nextElementSibling;
    }
    if (sibling === null)
      return null;
    path.push(index);
    node = parent;
  }
  path.reverse();
  return path;
}
function markerStatus(marker, eventType) {
  const boundary = HYDRATE_BOUNDARIES.get(marker);
  if (boundary !== void 0)
    return boundary(eventType);
  return hydrationMarkerInteractionStatus(marker, eventType);
}
function hydrationMarkerInteractionStatus(marker, eventType) {
  const when = marker.getAttribute(import_hydration_markers2.HYDRATE_WHEN_ATTR);
  if (when === null)
    return "hydrated";
  if (when === "never")
    return "never";
  if (when === "dynamic")
    return eventType === "click" ? "handles" : "dormant";
  if (when !== "interaction")
    return "dormant";
  const custom = marker.getAttribute(import_interaction_config.HYDRATE_INTERACTION_EVENTS_ATTR);
  const events = custom === null ? import_interaction_config.HYDRATE_DEFAULT_INTERACTION_EVENTS : custom.split(/\s+/).filter(Boolean);
  return events.includes(eventType) ? "handles" : "dormant";
}
function handleEarlyHydrationIntent(event, capturedSelection) {
  const target = event.target;
  if (!isHydrationElement(target))
    return;
  if ((0, import_native_intent.getNativeHydrationCapture)(target.ownerDocument)?.skip(event)) {
    HYDRATE_HANDLED_INTENT_EVENTS.add(event);
    return;
  }
  if ((event.type === "pointerenter" || event.type === "mouseenter") && independentHydrationDocuments?.has(target.ownerDocument)) {
    const boundary = target.closest(import_hydration_markers2.HYDRATE_MARKER_SELECTOR);
    const pointer = event;
    if (boundary !== null && typeof pointer.clientX === "number" && typeof pointer.clientY === "number") {
      const hit = target.ownerDocument.elementFromPoint?.(pointer.clientX, pointer.clientY);
      const independent2 = hit?.closest(`[${import_hydration_markers.HYDRATE_INDEPENDENT_ATTR}]`);
      if (independent2 && independent2 !== boundary && boundary.contains(independent2)) {
        HYDRATE_HANDLED_INTENT_EVENTS.add(event);
        return;
      }
    }
  }
  const markers = [];
  let marker = target.closest(import_hydration_markers2.HYDRATE_MARKER_SELECTOR);
  let independent = null;
  let matches = false;
  while (marker !== null) {
    markers.push(marker);
    matches ||= markerStatus(marker, event.type) === "handles";
    if (marker.hasAttribute(import_hydration_markers.HYDRATE_INDEPENDENT_ATTR)) {
      independent = marker;
      HYDRATE_HANDLED_INTENT_EVENTS.add(event);
      break;
    }
    marker = marker.parentElement?.closest(import_hydration_markers2.HYDRATE_MARKER_SELECTOR) ?? null;
  }
  if (independent !== null) {
    const link = target.closest("a[href],area[href]");
    if (link !== null && independent.contains(link))
      return;
  }
  if (!matches || markers.length === 0)
    return;
  markers.reverse();
  let candidate = null;
  let candidateBoundary;
  for (let i = 0; i < markers.length; i++) {
    const current = markers[i];
    const status = markerStatus(current, event.type);
    if (status === "hydrated")
      continue;
    if (status === "never")
      return;
    candidate = current;
    candidateBoundary = HYDRATE_BOUNDARIES.get(current);
    break;
  }
  if (candidate === null)
    return;
  for (let i = 0; i < markers.length; i++) {
    const current = markers[i];
    if (current !== candidate && candidate.contains(current) && current.getAttribute(import_hydration_markers2.HYDRATE_WHEN_ATTR) === "dynamic" && !HYDRATE_BOUNDARIES.has(current)) {
      HYDRATE_DELEGATED_DYNAMIC_MARKERS.add(current);
    }
  }
  const path = hydrationEventPathWithin(candidate, event.target);
  if (path === null)
    return;
  const sequence = independent !== null && capturedSelection === void 0 ? advanceIndependentIntentSequence(target.ownerDocument) : 0;
  const selection = candidate === independent ? capturedSelection === void 0 ? captureHydrationSelectionIntent(event, target, candidate, sequence) : capturedSelection : void 0;
  const intent = selection ? { event, path, selection } : { event, path };
  HYDRATE_HANDLED_INTENT_EVENTS.add(event);
  if ((0, import_dom_binding_handoff.hasBindingHandoffEvent)(event)) {
    intent.earlyBinding = true;
    const activate = () => {
      const boundary = HYDRATE_BOUNDARIES.get(candidate);
      if (boundary !== void 0)
        boundary(event.type, intent);
      else {
        const pending = HYDRATE_PENDING_INTENTS.get(candidate) ?? [];
        appendHydrationReplayIntent(pending, intent);
        HYDRATE_PENDING_INTENTS.set(candidate, pending);
      }
    };
    if (event.isTrusted)
      setTimeout(activate, 0);
    else
      queueMicrotask(activate);
    return;
  }
  if (event.bubbles) {
    if (shouldPreventHydrationInteractionDefault(event))
      event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  if (candidateBoundary !== void 0) {
    candidateBoundary(event.type, intent);
  } else {
    const pending = HYDRATE_PENDING_INTENTS.get(candidate) ?? [];
    appendHydrationReplayIntent(pending, intent);
    HYDRATE_PENDING_INTENTS.set(candidate, pending);
  }
}
function captureNativeHydrationIntent(marker, event, isCurrent) {
  if (!isCurrent())
    return;
  const ownerDocument = (0, import_native_intent.getNativeHydrationDocument)(marker);
  if (ownerDocument === null)
    return;
  const dom = (0, import_native_intent.getNativeHydrationDOM)(ownerDocument);
  const streamToken = dom.attribute(marker, import_stream_protocol.HYDRATE_STREAM_TOKEN_ATTR);
  const path = [];
  let node = dom.target(event);
  if (node === null)
    return;
  while (node !== marker) {
    const parent = dom.parent(node);
    if (parent === null)
      return;
    let index = 0;
    let found = false;
    for (const child of dom.children(parent)) {
      if (child === node) {
        found = true;
        break;
      }
      if (!(0, import_stream_protocol.isRendererStreamBoundaryTemplate)(child, streamToken))
        index++;
    }
    if (!found)
      return;
    path.push(index);
    node = parent;
  }
  path.reverse();
  const intent = { event, path, earlyBinding: true, current: isCurrent };
  HYDRATE_HANDLED_INTENT_EVENTS.add(event);
  const activate = () => {
    if (!isCurrent())
      return;
    const boundary = HYDRATE_BOUNDARIES.get(marker);
    if (boundary !== void 0)
      boundary(event.type, intent);
    else {
      const pending = HYDRATE_PENDING_INTENTS.get(marker) ?? [];
      appendHydrationReplayIntent(pending, intent);
      HYDRATE_PENDING_INTENTS.set(marker, pending);
    }
  };
  if (event.isTrusted)
    setTimeout(activate, 0);
  else
    queueMicrotask(activate);
}
function initializeHydrationEventCapture(ownerDocument) {
  const targetDocument = ownerDocument ?? (typeof document === "undefined" ? void 0 : document);
  if (targetDocument === void 0 || HYDRATE_INTENT_DOCUMENTS.has(targetDocument))
    return;
  const host = targetDocument;
  const mailbox = host[import_interaction_config.EARLY_HYDRATION_INTENTS_KEY];
  mailbox?.stop?.();
  (0, import_control_capture.initializeHydrationControlCapture)(targetDocument);
  const queued = mailbox?.q.splice(0);
  const claimed = {
    version: 1,
    q: [],
    claimed: true,
    capture(intent) {
      const capture = (0, import_native_intent.getNativeHydrationCapture)(targetDocument)?.push;
      if (capture !== void 0)
        capture(intent);
      else
        claimed.q.push(intent);
    }
  };
  host[import_interaction_config.EARLY_HYDRATION_INTENTS_KEY] = claimed;
  if (mailbox?.overflow) {
    throw new RangeError(__octaneDev ? "Early independent Hydrate intent queue overflow; reload the document." : __octaneNoArgError(214));
  }
  HYDRATE_INTENT_DOCUMENTS.add(targetDocument);
  for (let i = 0; i < import_interaction_config.HYDRATE_SUPPORTED_INTERACTION_EVENTS.length; i++) {
    targetDocument.addEventListener(import_interaction_config.HYDRATE_SUPPORTED_INTERACTION_EVENTS[i], handleEarlyHydrationIntent, true);
  }
  if (queued !== void 0) {
    for (const entry of queued) {
      const [event, , boundary, , , , control, group] = entry;
      if (entry[8]) {
        claimed.capture(entry);
        continue;
      }
      const sequence = entry[9] ?? advanceIndependentIntentSequence(targetDocument);
      if (!(0, import_control_capture.isEarlyHydrationIntentCurrent)(entry, targetDocument))
        continue;
      const selection = control === void 0 || group === void 0 ? null : { control, boundary, group, sequence };
      if (selection !== null && !isHydrationSelectionIntentCurrent({ event, path: [], selection }))
        continue;
      handleEarlyHydrationIntent(event, selection);
    }
  }
}
function initializeIndependentHydrationEventCapture(ownerDocument) {
  (independentHydrationDocuments ??= /* @__PURE__ */ new WeakSet()).add(ownerDocument);
  initializeHydrationEventCapture(ownerDocument);
}
function registerHydrationIntentBoundary(marker, boundary) {
  HYDRATE_BOUNDARIES.set(marker, boundary);
}
function unregisterHydrationIntentBoundary(marker, boundary) {
  if (HYDRATE_BOUNDARIES.get(marker) === boundary)
    HYDRATE_BOUNDARIES.delete(marker);
}
function takePendingHydrationIntents(marker) {
  const intents = HYDRATE_PENDING_INTENTS.get(marker);
  HYDRATE_PENDING_INTENTS.delete(marker);
  if (intents !== void 0) {
    for (let index = intents.length - 1; index >= 0; index--) {
      if (!isNativeHydrationIntentCurrent(intents[index]))
        intents.splice(index, 1);
    }
  }
  return intents;
}
function isNativeHydrationIntentCurrent(intent) {
  return intent.current?.() !== false;
}
function takeDelegatedDynamicHydrationIntent(marker) {
  return HYDRATE_DELEGATED_DYNAMIC_MARKERS.delete(marker);
}
function wasEarlyHydrationIntentHandled(event) {
  return HYDRATE_HANDLED_INTENT_EVENTS.has(event);
}
function markDelegatedDynamicHydrationIntent(marker) {
  HYDRATE_DELEGATED_DYNAMIC_MARKERS.add(marker);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HYDRATE_SUPPORTED_INTERACTION_EVENTS,
  appendHydrationReplayIntent,
  applyHydrationControlCandidate,
  captureHydrationControlCandidate,
  captureNativeHydrationIntent,
  consumeHydrationControl,
  hydrationEventPathWithin,
  hydrationMarkerInteractionStatus,
  initializeHydrationEventCapture,
  initializeIndependentHydrationEventCapture,
  isHydrationSelectionIntentCurrent,
  isNativeHydrationIntentCurrent,
  markDelegatedDynamicHydrationIntent,
  registerHydrationIntentBoundary,
  shouldPreventHydrationInteractionDefault,
  snapshotHydrationControl,
  takeDelegatedDynamicHydrationIntent,
  takePendingHydrationIntents,
  unregisterHydrationIntentBoundary,
  wasEarlyHydrationIntentHandled
});
