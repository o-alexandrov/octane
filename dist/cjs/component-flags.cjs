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
var component_flags_exports = {};
__export(component_flags_exports, {
  COMPONENT_FLAG_BOUNDARY: () => COMPONENT_FLAG_BOUNDARY,
  hasComponentFlags: () => hasComponentFlags,
  markComponentFlags: () => markComponentFlags
});
module.exports = __toCommonJS(component_flags_exports);
var import_has_own = require("./has-own.cjs");
const OCTANE_COMPONENT_FLAGS = /* @__PURE__ */ Symbol.for("octane.flags.component");
const COMPONENT_FLAG_BOUNDARY = 1 << 0;
function markComponentFlags(component, flags, name, kind) {
  Object.defineProperty(component, OCTANE_COMPONENT_FLAGS, { value: flags });
  Object.defineProperty(component, "name", { value: name, configurable: true });
  if (kind !== void 0) {
    Object.defineProperty(component, kind, {
      get() {
        return this === component;
      }
    });
  }
  return component;
}
function hasComponentFlags(component, flags) {
  return typeof component === "function" && import_has_own.hasOwnProp.call(component, OCTANE_COMPONENT_FLAGS) && (component[OCTANE_COMPONENT_FLAGS] & flags) === flags;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COMPONENT_FLAG_BOUNDARY,
  hasComponentFlags,
  markComponentFlags
});
