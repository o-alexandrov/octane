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
var server_rpc_client_exports = {};
__export(server_rpc_client_exports, {
  __serverRpc: () => __serverRpc
});
module.exports = __toCommonJS(server_rpc_client_exports);
var devalue = __toESM(require("devalue"), 1);
var import_server_rpc_protocol = require("./server-rpc-protocol.cjs");
var import_server_rpc_stream_client = require("./server-rpc-stream-client.cjs");
var import_server_rpc_batch_client = require("./server-rpc-batch-client.cjs");
async function __serverRpc(hash, args, options = {}, stream = false, limits) {
  if (options === null || typeof options !== "object" || Object.keys(options).some((key) => key !== "signal") || options.signal !== void 0 && !(options.signal instanceof AbortSignal))
    throw new TypeError("Server function options accept only a local AbortSignal");
  options.signal?.throwIfAborted();
  const resolvedLimits = stream ? (0, import_server_rpc_protocol.serverResultLimits)(limits) : void 0;
  const payload = stream ? (0, import_server_rpc_protocol.encodeServerArguments)(args) : devalue.stringify(args);
  if (stream) {
    const batched = (0, import_server_rpc_batch_client.enqueueServerCall)(hash, payload, options, limits);
    if (batched !== void 0) return batched;
  }
  const deadline = resolvedLimits === void 0 ? void 0 : Date.now() + resolvedLimits.timeoutMs;
  const cancellation = resolvedLimits === void 0 ? void 0 : new AbortController();
  const timer = resolvedLimits === void 0 ? void 0 : setTimeout(() => {
    cancellation.abort(new DOMException("Server function timed out", "TimeoutError"));
  }, resolvedLimits.timeoutMs);
  const signal = cancellation === void 0 ? options.signal : options.signal === void 0 ? cancellation.signal : AbortSignal.any([options.signal, cancellation.signal]);
  try {
    let response;
    try {
      response = await fetch(new URL("/_$_ripple_rpc_$_/" + hash, globalThis.location.href).href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...stream ? { Accept: import_server_rpc_protocol.SERVER_RESULT_CONTENT_TYPE } : {}
        },
        body: payload,
        signal
      });
    } catch (cause) {
      throw new import_server_rpc_protocol.ServerCallUncertainError(
        new Error("An error occurred while trying to call the Octane server function.", { cause })
      );
    }
    if (!response.ok) {
      let message = `Server function call failed with status ${response.status}`;
      let body2 = "";
      if (stream) {
        try {
          void response.body?.cancel().catch(() => {
          });
        } catch {
        }
      } else {
        body2 = await response.text().catch(() => "");
      }
      if (body2) {
        try {
          const parsed = JSON.parse(body2);
          message = typeof parsed?.error === "string" && parsed.error ? parsed.error : body2;
        } catch {
          message = body2;
        }
      }
      const error = Object.assign(new Error(message), { status: response.status });
      throw response.headers.get("Octane-RPC-Outcome") === "rejected" ? error : new import_server_rpc_protocol.ServerCallUncertainError(error);
    }
    if (stream) {
      if (response.headers.get("content-type")?.split(";", 1)[0] !== import_server_rpc_protocol.SERVER_RESULT_CONTENT_TYPE) {
        void response.body?.cancel().catch(() => {
        });
        throw new import_server_rpc_protocol.ServerCallUncertainError(
          new Error("The server does not support the requested result protocol")
        );
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        void response.body?.cancel().catch(() => {
        });
        throw new import_server_rpc_protocol.ServerCallUncertainError(
          new DOMException("Server function timed out", "TimeoutError")
        );
      }
      return await (0, import_server_rpc_stream_client.readServerResult)(response, { ...resolvedLimits, timeoutMs: remaining, signal });
    }
    let body;
    try {
      body = await response.text();
    } catch (error) {
      throw new import_server_rpc_protocol.ServerCallUncertainError(error);
    }
    if (body === "") {
      throw new import_server_rpc_protocol.ServerCallUncertainError(
        new Error(
          "The server function endpoint returned an empty response. Is the Octane server running?"
        )
      );
    }
    try {
      return devalue.parse(body).value;
    } catch (error) {
      throw new import_server_rpc_protocol.ServerCallUncertainError(error);
    }
  } finally {
    clearTimeout(timer);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __serverRpc
});
