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
var early_values_exports = {};
__export(early_values_exports, {
  claimEarlyHydrationControlCapture: () => claimEarlyHydrationControlCapture,
  clearEarlyHydrationControlRevision: () => clearEarlyHydrationControlRevision,
  hasHydrationControlSignalWriter: () => hasHydrationControlSignalWriter,
  publishHydrationControlSignalValues: () => publishHydrationControlSignalValues,
  readEarlyHydrationControlRevision: () => readEarlyHydrationControlRevision,
  readEarlySignalValue: () => readEarlySignalValue,
  registerHydrationControlSignalWriter: () => registerHydrationControlSignalWriter,
  registerSignalOwnerDocument: () => registerSignalOwnerDocument
});
module.exports = __toCommonJS(early_values_exports);
var import_hydration_markers = require("../hydration-markers.cjs");
const OWNER_DOCUMENTS = /* @__PURE__ */ new WeakMap();
const DOCUMENT_VALUES = /* @__PURE__ */ new WeakMap();
const CONTROL_WRITERS = /* @__PURE__ */ new WeakMap();
const EARLY_CONTROL_REVISIONS = /* @__PURE__ */ new WeakMap();
const CLAIMED_CONTROL_DOCUMENTS = /* @__PURE__ */ new WeakSet();
function rendererOwner(owner) {
  return typeof owner === "object" && owner !== null && "documentOwner" in owner;
}
function ownerObject(owner) {
  return rendererOwner(owner) ? owner.instanceOwner : owner;
}
function valueKey(ownerKey, instanceKey, nodeKey) {
  return JSON.stringify([ownerKey, instanceKey, nodeKey]);
}
function registerSignalOwnerDocument(owner, ownerDocument) {
  OWNER_DOCUMENTS.set(ownerObject(owner), ownerDocument);
  if (rendererOwner(owner)) OWNER_DOCUMENTS.set(owner.documentOwner, ownerDocument);
}
function documentForOwner(owner) {
  return OWNER_DOCUMENTS.get(ownerObject(owner));
}
function bindingKey(owner, binding) {
  const ownerKey = rendererOwner(owner) ? owner.documentOwner.scopeKey : owner.scopeKey;
  const instanceKey = binding.scope === "instance" && rendererOwner(owner) ? owner.instanceKey : "";
  return valueKey(ownerKey, instanceKey, binding.nodeKey);
}
function readEarlySignalValue(owner, binding) {
  const ownerDocument = documentForOwner(owner);
  return ownerDocument === void 0 ? void 0 : DOCUMENT_VALUES.get(ownerDocument)?.get(bindingKey(owner, binding));
}
function parseControlBindings(control) {
  const raw = control.getAttribute(import_hydration_markers.SIGNAL_CONTROL_ATTR);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 3 || parsed[0] !== 1) return null;
    if (typeof parsed[1] !== "string" || !Array.isArray(parsed[2])) return null;
    const bindings = [];
    for (const entry of parsed[2]) {
      if (!Array.isArray(entry) || entry.length !== 3 || typeof entry[0] !== "string" || typeof entry[1] !== "string" || entry[2] !== "value" && entry[2] !== "checked") {
        return null;
      }
      bindings.push(entry);
    }
    return { ownerKey: parsed[1], bindings };
  } catch {
    return null;
  }
}
function controlValue(control, channel) {
  if (channel === "checked") return control.checked;
  if (control.localName === "select" && control.multiple) {
    return Array.from(control.selectedOptions, (option) => option.value);
  }
  return control.value;
}
function publishHydrationControlSignalValues(control, revision) {
  const metadata = parseControlBindings(control);
  if (metadata !== null) {
    let values = DOCUMENT_VALUES.get(control.ownerDocument);
    if (values === void 0) DOCUMENT_VALUES.set(control.ownerDocument, values = /* @__PURE__ */ new Map());
    for (const [instanceKey, nodeKey, channel] of metadata.bindings) {
      const key = valueKey(metadata.ownerKey, instanceKey, nodeKey);
      const previous = values.get(key);
      if (CLAIMED_CONTROL_DOCUMENTS.has(control.ownerDocument) || previous === void 0 || revision >= previous.revision) {
        values.set(key, { revision, value: controlValue(control, channel) });
      }
    }
  }
  const writers = CONTROL_WRITERS.get(control);
  if (writers !== void 0) {
    for (const [channel, write] of writers) write(controlValue(control, channel));
  }
}
function registerHydrationControlSignalWriter(control, channel, write) {
  let writers = CONTROL_WRITERS.get(control);
  if (writers === void 0) CONTROL_WRITERS.set(control, writers = /* @__PURE__ */ new Map());
  writers.set(channel, write);
  return () => {
    if (writers.get(channel) !== write) return;
    writers.delete(channel);
    if (writers.size === 0) CONTROL_WRITERS.delete(control);
  };
}
function hasHydrationControlSignalWriter(control, channel) {
  return CONTROL_WRITERS.get(control)?.has(channel) ?? false;
}
function readEarlyHydrationControlRevision(control) {
  return EARLY_CONTROL_REVISIONS.get(control) ?? 0;
}
function clearEarlyHydrationControlRevision(control) {
  EARLY_CONTROL_REVISIONS.delete(control);
}
function claimEarlyHydrationControlCapture(ownerDocument) {
  CLAIMED_CONTROL_DOCUMENTS.add(ownerDocument);
}
function publishEarlyHydrationControlSignalValues(control, revision) {
  if (CLAIMED_CONTROL_DOCUMENTS.has(control.ownerDocument)) return;
  EARLY_CONTROL_REVISIONS.set(control, revision);
  publishHydrationControlSignalValues(control, revision);
}
if (typeof globalThis !== "undefined") {
  const host = globalThis;
  host.__octanePublishSignalControl = publishEarlyHydrationControlSignalValues;
  const mailbox = host.__octaneEarlySignalControls;
  if (mailbox !== void 0) {
    mailbox.p = publishEarlyHydrationControlSignalValues;
    const queued = mailbox.q.splice(0);
    for (const [control, revision] of queued) {
      publishEarlyHydrationControlSignalValues(control, revision);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  claimEarlyHydrationControlCapture,
  clearEarlyHydrationControlRevision,
  hasHydrationControlSignalWriter,
  publishHydrationControlSignalValues,
  readEarlyHydrationControlRevision,
  readEarlySignalValue,
  registerHydrationControlSignalWriter,
  registerSignalOwnerDocument
});
