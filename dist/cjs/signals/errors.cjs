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
var errors_exports = {};
__export(errors_exports, {
  ScopeDisposedError: () => ScopeDisposedError,
  SignalCycleError: () => SignalCycleError,
  SignalFrameError: () => SignalFrameError,
  SignalIdleError: () => SignalIdleError,
  SignalSerializationError: () => SignalSerializationError,
  SignalStreamError: () => SignalStreamError,
  SignalWriteError: () => SignalWriteError
});
module.exports = __toCommonJS(errors_exports);
var import_error_codes_client_generated = require("../error-codes.client.generated.cjs");
class ScopeDisposedError extends Error {
  constructor(scopeKey) {
    super((0, import_error_codes_client_generated.formatClientError)(151, scopeKey));
    this.name = "ScopeDisposedError";
  }
}
class SignalWriteError extends Error {
  constructor() {
    super((0, import_error_codes_client_generated.formatClientError)(152));
    this.name = "SignalWriteError";
  }
}
class SignalCycleError extends Error {
  constructor(key) {
    super((0, import_error_codes_client_generated.formatClientError)(153, key));
    this.name = "SignalCycleError";
  }
}
class SignalIdleError extends Error {
  constructor(key) {
    super((0, import_error_codes_client_generated.formatClientError)(113, key));
    this.name = "SignalIdleError";
  }
}
class SignalFrameError extends Error {
  constructor(message) {
    super(message);
    this.name = "SignalFrameError";
  }
}
class SignalStreamError extends Error {
  code;
  constructor(code) {
    super((0, import_error_codes_client_generated.formatClientError)(154, code));
    this.code = code;
    this.name = "SignalStreamError";
  }
}
class SignalSerializationError extends Error {
  constructor(message) {
    super(message);
    this.name = "SignalSerializationError";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ScopeDisposedError,
  SignalCycleError,
  SignalFrameError,
  SignalIdleError,
  SignalSerializationError,
  SignalStreamError,
  SignalWriteError
});
