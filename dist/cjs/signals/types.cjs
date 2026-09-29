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
var types_exports = {};
__export(types_exports, {
  QUERY_REQUEST: () => QUERY_REQUEST,
  SIGNAL_BINDING_IDENTITY: () => SIGNAL_BINDING_IDENTITY,
  SIGNAL_BINDING_READ: () => SIGNAL_BINDING_READ,
  SIGNAL_BINDING_SUBSCRIBE: () => SIGNAL_BINDING_SUBSCRIBE,
  SIGNAL_HANDLE: () => SIGNAL_HANDLE,
  SIGNAL_OWNER_RESOLVE: () => SIGNAL_OWNER_RESOLVE,
  skip: () => skip
});
module.exports = __toCommonJS(types_exports);
const SIGNAL_HANDLE = /* @__PURE__ */ Symbol.for("octane.signal-handle");
const SIGNAL_BINDING_READ = /* @__PURE__ */ Symbol.for("octane.signal-binding-read");
const SIGNAL_BINDING_SUBSCRIBE = /* @__PURE__ */ Symbol.for(
  "octane.signal-binding-subscribe"
);
const SIGNAL_BINDING_IDENTITY = /* @__PURE__ */ Symbol.for(
  "octane.signal-binding-identity"
);
const QUERY_REQUEST = /* @__PURE__ */ Symbol.for("octane.query-request");
const SIGNAL_OWNER_RESOLVE = /* @__PURE__ */ Symbol.for("octane.signal-owner-resolve");
const skip = /* @__PURE__ */ Symbol.for("octane.query-skip");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QUERY_REQUEST,
  SIGNAL_BINDING_IDENTITY,
  SIGNAL_BINDING_READ,
  SIGNAL_BINDING_SUBSCRIBE,
  SIGNAL_HANDLE,
  SIGNAL_OWNER_RESOLVE,
  skip
});
