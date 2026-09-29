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
var server_rpc_stream_client_exports = {};
__export(server_rpc_stream_client_exports, {
  readServerResult: () => readServerResult
});
module.exports = __toCommonJS(server_rpc_stream_client_exports);
var import_server_rpc_protocol = require("./server-rpc-protocol.cjs");
async function readServerResult(response, options = {}) {
  if (response.body === null)
    throw new import_server_rpc_protocol.ServerCallUncertainError(new Error("Server function returned an empty response"));
  const limits = (0, import_server_rpc_protocol.serverResultLimits)(options);
  const reader = response.body.getReader();
  const read = (0, import_server_rpc_protocol.serverResultReader)(reader, limits);
  let finished = false;
  let failure;
  const cleanup = () => {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  };
  const close = async () => {
    if (finished) return;
    finished = true;
    cleanup();
    try {
      void reader.cancel().catch(() => {
      });
    } catch {
    }
    reader.releaseLock();
  };
  const abort = () => {
    failure = new import_server_rpc_protocol.ServerCallUncertainError(
      options.signal?.reason ?? new DOMException("Server function canceled", "AbortError")
    );
    void close();
  };
  const timer = setTimeout(() => {
    failure = new import_server_rpc_protocol.ServerCallUncertainError(
      new DOMException("Server function timed out", "TimeoutError")
    );
    void close();
  }, limits.timeoutMs);
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) abort();
  const next = async () => {
    if (failure !== void 0) throw failure;
    try {
      const frame = await read();
      if (failure !== void 0) throw failure;
      if (frame.kind === "error") throw new Error(frame.error);
      return frame;
    } catch (error) {
      await close();
      throw failure ?? new import_server_rpc_protocol.ServerCallUncertainError(error);
    }
  };
  try {
    const first = await next();
    if (first.kind === "value") {
      if ((await next()).kind !== "complete") throw new Error("Invalid one-shot server result");
      await close();
      return first.value;
    }
    if (first.kind !== "stream") throw new Error("Invalid server result opening frame");
    let claimed = false;
    return {
      [Symbol.asyncIterator]() {
        if (claimed) throw new Error("A server result stream supports one consumer");
        claimed = true;
        let pulls = Promise.resolve();
        const pull = async () => {
          if (failure !== void 0) throw failure;
          if (finished) return { done: true, value: void 0 };
          const frame = await next();
          if (frame.kind === "value") return { done: false, value: frame.value };
          await close();
          if (frame.kind !== "complete") throw new Error("Invalid server result continuation");
          return { done: true, value: void 0 };
        };
        return {
          next() {
            const result = pulls.then(pull, pull);
            pulls = result;
            return result;
          },
          async return() {
            await close();
            return { done: true, value: void 0 };
          }
        };
      }
    };
  } catch (error) {
    await close();
    throw error instanceof import_server_rpc_protocol.ServerCallUncertainError ? error : new import_server_rpc_protocol.ServerCallUncertainError(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  readServerResult
});
