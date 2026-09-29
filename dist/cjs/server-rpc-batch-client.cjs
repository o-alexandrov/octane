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
var server_rpc_batch_client_exports = {};
__export(server_rpc_batch_client_exports, {
  SERVER_BATCH_CONTENT_TYPE: () => SERVER_BATCH_CONTENT_TYPE,
  batchServerCalls: () => batchServerCalls,
  enqueueServerCall: () => enqueueServerCall
});
module.exports = __toCommonJS(server_rpc_batch_client_exports);
var import_server_rpc_stream_client = require("./server-rpc-stream-client.cjs");
var import_server_rpc_protocol = require("./server-rpc-protocol.cjs");
const SERVER_BATCH_CONTENT_TYPE = "application/x-octane-rpc-batch+ndjson";
let collecting;
function batchServerCalls(options, callback) {
  (0, import_server_rpc_protocol.validateServerCallBatch)(options);
  const previous = collecting;
  collecting = { options: { ...options }, members: [] };
  try {
    return callback();
  } finally {
    collecting = previous;
  }
}
function enqueueServerCall(hash, body, options, limits) {
  const batch = collecting;
  if (batch === void 0 || limits !== void 0) return void 0;
  if (batch.members.length === 32) {
    collecting = { options: batch.options, members: [] };
    return enqueueServerCall(hash, body, options);
  }
  if (batch.members.length === 0)
    queueMicrotask(() => {
      void dispatch(batch);
    });
  return new Promise((resolve, reject) => {
    const abort = () => {
      if (member.settled) return;
      member.settled = true;
      member.dispose();
      reject(new import_server_rpc_protocol.ServerCallUncertainError(options.signal?.reason));
    };
    const member = {
      hash,
      body,
      signal: options.signal,
      resolve,
      reject,
      settled: false,
      dispose: () => options.signal?.removeEventListener("abort", abort)
    };
    options.signal?.addEventListener("abort", abort, { once: true });
    batch.members.push(member);
    if (options.signal?.aborted) abort();
  });
}
async function dispatch(batch) {
  const members = batch.members.filter((member) => !member.settled);
  if (members.length === 0) return;
  const limits = (0, import_server_rpc_protocol.serverResultLimits)(batch.options);
  const transport = new AbortController();
  let definitiveRejection = false;
  const timer = setTimeout(
    () => transport.abort(new DOMException("Server batch timed out", "TimeoutError")),
    limits.timeoutMs
  );
  try {
    const response = await fetch(
      new URL("/_$_ripple_rpc_$_/" + members[0].hash, globalThis.location.href).href,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: SERVER_BATCH_CONTENT_TYPE },
        body: JSON.stringify([1, members.map((member, id) => [id, member.hash, member.body])]),
        signal: transport.signal
      }
    );
    if (!response.ok || response.headers.get("content-type")?.split(";", 1)[0] !== SERVER_BATCH_CONTENT_TYPE) {
      definitiveRejection = !response.ok && response.headers.get("Octane-RPC-Outcome") === "rejected";
      try {
        void response.body?.cancel().catch(() => {
        });
      } catch {
      }
      throw new Error("Server-call batching was rejected or is unavailable");
    }
    const result = await (0, import_server_rpc_stream_client.readServerResult)(response, { ...limits, signal: transport.signal });
    if (result === null || typeof result !== "object" || !(Symbol.asyncIterator in result)) {
      throw new Error("Invalid server batch result");
    }
    const seen = /* @__PURE__ */ new Set();
    for await (const frame of result) {
      if (!Array.isArray(frame) || frame.length !== 3 || !Number.isSafeInteger(frame[0]) || frame[0] < 0 || frame[0] >= members.length || seen.has(frame[0]) || !["value", "rejected", "uncertain"].includes(frame[1]) || frame[1] !== "value" && typeof frame[2] !== "string") {
        throw new Error("Invalid or duplicate server batch member");
      }
      seen.add(frame[0]);
      const member = members[frame[0]];
      if (member.settled) continue;
      member.settled = true;
      member.dispose();
      if (frame[1] === "value") member.resolve(frame[2]);
      else {
        const error = new Error(frame[2]);
        member.reject(frame[1] === "rejected" ? error : new import_server_rpc_protocol.ServerCallUncertainError(error));
      }
    }
    if (seen.size !== members.length) throw new Error("Server batch ended with missing members");
  } catch (error) {
    for (const member of members) {
      if (member.settled) continue;
      member.settled = true;
      member.dispose();
      member.reject(
        definitiveRejection || error instanceof import_server_rpc_protocol.ServerCallUncertainError ? error : new import_server_rpc_protocol.ServerCallUncertainError(error)
      );
    }
  } finally {
    clearTimeout(timer);
    transport.abort();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SERVER_BATCH_CONTENT_TYPE,
  batchServerCalls,
  enqueueServerCall
});
