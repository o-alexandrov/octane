"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var rpc_exports = {};
__export(rpc_exports, {
  executeServerFunction: () => executeServerFunction,
  executeServerFunctionStream: () => executeServerFunctionStream
});
module.exports = __toCommonJS(rpc_exports);
var devalue = __toESM(require("devalue"), 1);
var import_server_call = require("../server-call.cjs");
var import_rpc_stream = require("./rpc-stream.cjs");
var import_server_rpc_protocol = require("../server-rpc-protocol.cjs");
function serverArguments(body) {
  let args;
  try {
    args = devalue.parse(body);
  } catch (error) {
    throw new import_server_call.InvalidServerFunctionPayloadError(error);
  }
  if (!Array.isArray(args)) throw new import_server_call.InvalidServerFunctionPayloadError();
  return args;
}
async function executeServerFunction(fn, body, context) {
  const args = serverArguments(body);
  const value = await (0, import_server_call.invokeServerFunction)(fn, args, context);
  return devalue.stringify({ value });
}
function executeServerFunctionStream(fn, body, context, limits) {
  const resolvedLimits = (0, import_server_rpc_protocol.serverResultLimits)(limits);
  let args;
  try {
    args = (0, import_server_rpc_protocol.decodeServerArguments)(body);
  } catch (error) {
    throw new import_server_call.InvalidServerFunctionPayloadError(error);
  }
  const cancellation = new AbortController();
  const signal = context === void 0 ? cancellation.signal : AbortSignal.any([context.signal, cancellation.signal]);
  const trusted = context === void 0 ? void 0 : { ...context, signal };
  return (0, import_rpc_stream.createServerResultStream)(
    Promise.resolve().then(() => {
      signal.throwIfAborted();
      return (0, import_server_call.invokeServerFunction)(fn, args, trusted);
    }),
    { ...resolvedLimits, signal, cancel: () => cancellation.abort() }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  executeServerFunction,
  executeServerFunctionStream
});
