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
var server_call_exports = {};
__export(server_call_exports, {
  InvalidServerFunctionPayloadError: () => InvalidServerFunctionPayloadError,
  __registerServerFunction: () => __registerServerFunction,
  __serverCall: () => __serverCall,
  __setServerCallContextSource: () => __setServerCallContextSource,
  invokeServerFunction: () => invokeServerFunction
});
module.exports = __toCommonJS(server_call_exports);
const SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("octane.server.function");
const SERVER_CALL_SOURCE = /* @__PURE__ */ Symbol.for("octane.server.call-context");
const globals = globalThis;
class InvalidServerFunctionPayloadError extends Error {
  code = "OCTANE_INVALID_RPC_PAYLOAD";
  constructor(cause) {
    super("Invalid server function arguments", { cause });
    this.name = "InvalidServerFunctionPayloadError";
  }
}
function __setServerCallContextSource(source) {
  globals[SERVER_CALL_SOURCE] = source;
}
function registration(fn) {
  return fn[SERVER_FUNCTION];
}
function __registerServerFunction(fn, contextIndex, target) {
  if (!Number.isSafeInteger(contextIndex) || contextIndex < 0) {
    throw new TypeError("Invalid server function context position");
  }
  const registered = Object.freeze({ fn, contextIndex, target: Object.freeze({ ...target }) });
  const callable = (...args) => {
    let options;
    if (args.length === contextIndex + 1) {
      options = args.pop();
    }
    return __serverCall(callable, args, options);
  };
  Object.defineProperty(callable, SERVER_FUNCTION, { value: registered });
  return callable;
}
async function __serverCall(fn, args, options = {}) {
  const registered = registration(fn);
  if (registered === void 0) {
    throw new TypeError("The server function is not registered");
  }
  if (options === null || typeof options !== "object" || Object.keys(options).some((key) => key !== "signal") || options.signal !== void 0 && !(options.signal instanceof AbortSignal)) {
    throw new TypeError("Server function options accept only a local AbortSignal");
  }
  if (args.length > registered.contextIndex) {
    throw new InvalidServerFunctionPayloadError();
  }
  options.signal?.throwIfAborted();
  const host = globals[SERVER_CALL_SOURCE]?.getStore();
  if (host === void 0) {
    throw new Error("A contextual server function requires an active server request");
  }
  return host.invoke(
    registered.target,
    options,
    (context) => invokeServerFunction(fn, args, context)
  );
}
function invokeServerFunction(fn, args, context) {
  const registered = registration(fn);
  if (registered === void 0) return fn.apply(null, args);
  if (context === void 0) {
    throw new Error("A contextual server function requires trusted request context");
  }
  if (args.length > registered.contextIndex) {
    throw new InvalidServerFunctionPayloadError();
  }
  context.signal.throwIfAborted();
  const input = args.slice();
  while (input.length < registered.contextIndex) input.push(void 0);
  input.push(Object.freeze({ ...context }));
  return registered.fn.apply(null, input);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InvalidServerFunctionPayloadError,
  __registerServerFunction,
  __serverCall,
  __setServerCallContextSource,
  invokeServerFunction
});
