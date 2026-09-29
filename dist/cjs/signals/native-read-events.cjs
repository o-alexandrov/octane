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
var native_read_events_exports = {};
__export(native_read_events_exports, {
  beginNativeEventBatch: () => beginNativeEventBatch,
  endNativeEventBatch: () => endNativeEventBatch
});
module.exports = __toCommonJS(native_read_events_exports);
var import_read_protocol = require("./read-protocol.cjs");
let events = null;
function beginNativeEventBatch(event) {
  const existing = events?.get(event);
  if (existing !== void 0) {
    existing.depth++;
    return existing;
  }
  const hooks = (0, import_read_protocol.beginNativeBatch)();
  if (hooks === null) return null;
  const batch = { hooks, depth: 1, closed: false };
  (events ??= /* @__PURE__ */ new WeakMap()).set(event, batch);
  return batch;
}
function finish(event, batch) {
  if (batch.closed) return;
  batch.closed = true;
  if (events?.get(event) === batch) events.delete(event);
  const hooks = batch.hooks;
  batch.hooks = null;
  (0, import_read_protocol.endNativeBatch)(hooks);
}
function endNativeEventBatch(event, batch, waitsForBubble, onError) {
  if (batch === null || batch.closed || --batch.depth !== 0) return;
  if (!waitsForBubble) {
    finish(event, batch);
    return;
  }
  const fallback = () => {
    if (batch.depth !== 0 || batch.closed) return;
    try {
      finish(event, batch);
    } catch (error) {
      onError(error);
    }
  };
  const target = event.target;
  const checkableChange = event.type === "change" && target?.localName === "input" && (target.type === "checkbox" || target.type === "radio");
  if (checkableChange) setTimeout(fallback, 0);
  else queueMicrotask(fallback);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  beginNativeEventBatch,
  endNativeEventBatch
});
