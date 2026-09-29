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
var rpc_stream_exports = {};
__export(rpc_stream_exports, {
  createServerResultStream: () => createServerResultStream
});
module.exports = __toCommonJS(rpc_stream_exports);
var import_server_rpc_protocol = require("../server-rpc-protocol.cjs");
function createServerResultStream(result, options = {}) {
  const limits = (0, import_server_rpc_protocol.serverResultLimits)(options);
  let sequence = 0;
  let totalBytes = 0;
  let iterator;
  let finished = false;
  let terminal = false;
  let streaming = false;
  let initialized = false;
  let pending = Promise.resolve(result);
  void pending.catch(() => {
  });
  let controller;
  let timer;
  const cleanup = () => {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  };
  const closeIterator = () => {
    try {
      void Promise.resolve(iterator?.return?.()).catch(() => {
      });
    } catch {
    }
    iterator = void 0;
  };
  const write = (frame) => {
    const encoded = (0, import_server_rpc_protocol.encodeServerResultFrame)(sequence, frame);
    if (encoded.byteLength > limits.maxFrameBytes || totalBytes + encoded.byteLength > limits.maxTotalBytes) {
      throw new Error("Server result exceeded its response budget");
    }
    sequence++;
    totalBytes += encoded.byteLength;
    controller.enqueue(encoded);
  };
  const fail = (message) => {
    if (finished) return;
    finished = true;
    pending = void 0;
    cleanup();
    options.cancel?.();
    closeIterator();
    try {
      write({ kind: "error", error: message });
      controller.close();
    } catch (error) {
      controller.error(error);
    }
  };
  const abort = () => fail("Server function was canceled");
  return new ReadableStream(
    {
      start(streamController) {
        controller = streamController;
        timer = setTimeout(() => fail("Server function timed out"), limits.timeoutMs);
        options.signal?.addEventListener("abort", abort, { once: true });
        if (options.signal?.aborted) abort();
      },
      async pull() {
        if (finished) return;
        try {
          if (terminal) {
            write({ kind: "complete" });
            finished = true;
            cleanup();
            controller.close();
            return;
          }
          if (!initialized) {
            const value = await pending;
            pending = void 0;
            if (finished) {
              if (value !== null && typeof value === "object" && Symbol.asyncIterator in value) {
                iterator = value[Symbol.asyncIterator]();
                closeIterator();
              }
              return;
            }
            initialized = true;
            if (value !== null && typeof value === "object" && Symbol.asyncIterator in value) {
              iterator = value[Symbol.asyncIterator]();
              streaming = true;
              write({ kind: "stream" });
              return;
            }
            write({ kind: "value", value });
            terminal = true;
            return;
          }
          if (streaming) {
            const item = await iterator.next();
            if (finished) return;
            if (item.done) {
              iterator = void 0;
              write({ kind: "complete" });
              finished = true;
              cleanup();
              controller.close();
            } else {
              write({ kind: "value", value: item.value });
            }
          }
        } catch {
          fail("Server function failed");
        }
      },
      cancel() {
        if (finished) return;
        finished = true;
        pending = void 0;
        cleanup();
        options.cancel?.();
        closeIterator();
      }
    },
    { highWaterMark: 0 }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createServerResultStream
});
