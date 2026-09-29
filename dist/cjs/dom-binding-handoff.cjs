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
var dom_binding_handoff_exports = {};
__export(dom_binding_handoff_exports, {
  BINDING_HANDOFF: () => import_control_handoff.BINDING_HANDOFF,
  beginBindingEvent: () => beginBindingEvent,
  claimBindingHandoff: () => claimBindingHandoff,
  consumeBindingEvent: () => consumeBindingEvent,
  hasBindingHandoffEvent: () => hasBindingHandoffEvent,
  markBindingEvent: () => markBindingEvent,
  registerBindingEvent: () => registerBindingEvent,
  releaseBindingHandoff: () => releaseBindingHandoff
});
module.exports = __toCommonJS(dom_binding_handoff_exports);
var import_control_handoff = require("./signals/control-handoff.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const events = /* @__PURE__ */ new WeakMap();
const delivered = /* @__PURE__ */ new WeakMap();
function registerBindingEvent(node, type) {
  let counts = events.get(node);
  if (counts === void 0)
    events.set(node, counts = /* @__PURE__ */ new Map());
  counts.set(type, (counts.get(type) ?? 0) + 1);
  return () => {
    const count = counts.get(type) - 1;
    if (count === 0)
      counts.delete(type);
    else
      counts.set(type, count);
    if (counts.size === 0)
      events.delete(node);
  };
}
function claimBindingHandoff(lease, owner) {
  if (!lease.active() || lease.owner !== void 0)
    throw new Error(__octaneDev ? "A DOM binding hydration lease must be active and have only one root owner." : __octaneNoArgError(277));
  lease.owner = owner;
}
function releaseBindingHandoff(lease) {
  lease.owner = void 0;
}
function hasBindingHandoffEvent(event) {
  for (const node of event.composedPath()) {
    if (events.get(node)?.has(event.type))
      return true;
  }
  return false;
}
function markBindingEvent(event, node, capture) {
  let nodes = delivered.get(event);
  if (nodes === void 0) {
    delivered.set(event, nodes = /* @__PURE__ */ new Map());
    const cleanup = () => {
      if (delivered.get(event) === nodes)
        delivered.delete(event);
    };
    if (event.isTrusted)
      setTimeout(cleanup, 0);
    else
      queueMicrotask(cleanup);
  }
  nodes.set(node, (nodes.get(node) ?? 0) | (capture ? 2 : 1));
}
function consumeBindingEvent(event, node, capture) {
  const nodes = delivered.get(event);
  const flags = nodes?.get(node) ?? 0;
  const bit = capture ? 2 : 1;
  if ((flags & bit) === 0)
    return false;
  if ((flags & ~bit) === 0)
    nodes.delete(node);
  else
    nodes.set(node, flags & ~bit);
  return true;
}
function beginBindingEvent(event) {
  delivered.delete(event);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BINDING_HANDOFF,
  beginBindingEvent,
  claimBindingHandoff,
  consumeBindingEvent,
  hasBindingHandoffEvent,
  markBindingEvent,
  registerBindingEvent,
  releaseBindingHandoff
});
