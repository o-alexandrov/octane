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
var control_handoff_exports = {};
__export(control_handoff_exports, {
  BINDING_HANDOFF: () => BINDING_HANDOFF,
  CONTROL_BINDINGS: () => CONTROL_BINDINGS,
  CONTROL_HANDOFF: () => CONTROL_HANDOFF,
  hasSignalControlBinding: () => hasSignalControlBinding
});
module.exports = __toCommonJS(control_handoff_exports);
const BINDING_HANDOFF = /* @__PURE__ */ Symbol.for("octane.binding-handoff");
const CONTROL_HANDOFF = /* @__PURE__ */ Symbol.for("octane.control-handoff");
const CONTROL_BINDINGS = /* @__PURE__ */ new WeakMap();
function hasSignalControlBinding(control, channel) {
  return CONTROL_BINDINGS.get(control)?.has(channel) ?? false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BINDING_HANDOFF,
  CONTROL_BINDINGS,
  CONTROL_HANDOFF,
  hasSignalControlBinding
});
