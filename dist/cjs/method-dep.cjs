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
var method_dep_exports = {};
__export(method_dep_exports, {
  __methodDep: () => __methodDep
});
module.exports = __toCommonJS(method_dep_exports);
var import_has_own = require("./has-own.cjs");
const guardedNullReceiver = /* @__PURE__ */ Symbol();
const guardedUndefinedReceiver = /* @__PURE__ */ Symbol();
function __methodDep(receiver, name, guarded = false) {
  if (guarded && receiver == null) {
    return receiver === null ? guardedNullReceiver : guardedUndefinedReceiver;
  }
  if ((typeof receiver !== "object" || receiver === null) && typeof receiver !== "function") {
    return receiver;
  }
  if (guarded) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(receiver, name);
      if (descriptor) return "value" in descriptor ? descriptor.value : receiver;
      return name in receiver ? receiver : void 0;
    } catch {
      return receiver;
    }
  }
  if (import_has_own.hasOwnProp.call(receiver, name)) return receiver[name];
  return name in receiver ? receiver : void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __methodDep
});
