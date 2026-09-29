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
var handle_protocol_exports = {};
__export(handle_protocol_exports, {
  isSignalHandle: () => isSignalHandle,
  isWritableSignal: () => isWritableSignal
});
module.exports = __toCommonJS(handle_protocol_exports);
var import_types = require("./types.cjs");
function isSignalHandle(value) {
  return (typeof value === "object" || typeof value === "function") && value !== null && value[import_types.SIGNAL_HANDLE] === true;
}
function isWritableSignal(value) {
  return isSignalHandle(value) && value.kind === "signal" && typeof value.set === "function";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isSignalHandle,
  isWritableSignal
});
