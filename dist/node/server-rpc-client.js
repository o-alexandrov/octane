import * as devalue from "devalue";
import {
  SERVER_RESULT_CONTENT_TYPE,
  ServerCallUncertainError,
  encodeServerArguments,
  serverResultLimits
} from "./server-rpc-protocol.js";
import { readServerResult } from "./server-rpc-stream-client.js";
import { enqueueServerCall } from "./server-rpc-batch-client.js";
async function __serverRpc(hash, args, options = {}, stream = false, limits) {
  if (options === null || typeof options !== "object" || Object.keys(options).some((key) => key !== "signal") || options.signal !== void 0 && !(options.signal instanceof AbortSignal))
    throw new TypeError("Server function options accept only a local AbortSignal");
  options.signal?.throwIfAborted();
  const resolvedLimits = stream ? serverResultLimits(limits) : void 0;
  const payload = stream ? encodeServerArguments(args) : devalue.stringify(args);
  if (stream) {
    const batched = enqueueServerCall(hash, payload, options, limits);
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
          ...stream ? { Accept: SERVER_RESULT_CONTENT_TYPE } : {}
        },
        body: payload,
        signal
      });
    } catch (cause) {
      throw new ServerCallUncertainError(
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
      throw response.headers.get("Octane-RPC-Outcome") === "rejected" ? error : new ServerCallUncertainError(error);
    }
    if (stream) {
      if (response.headers.get("content-type")?.split(";", 1)[0] !== SERVER_RESULT_CONTENT_TYPE) {
        void response.body?.cancel().catch(() => {
        });
        throw new ServerCallUncertainError(
          new Error("The server does not support the requested result protocol")
        );
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        void response.body?.cancel().catch(() => {
        });
        throw new ServerCallUncertainError(
          new DOMException("Server function timed out", "TimeoutError")
        );
      }
      return await readServerResult(response, { ...resolvedLimits, timeoutMs: remaining, signal });
    }
    let body;
    try {
      body = await response.text();
    } catch (error) {
      throw new ServerCallUncertainError(error);
    }
    if (body === "") {
      throw new ServerCallUncertainError(
        new Error(
          "The server function endpoint returned an empty response. Is the Octane server running?"
        )
      );
    }
    try {
      return devalue.parse(body).value;
    } catch (error) {
      throw new ServerCallUncertainError(error);
    }
  } finally {
    clearTimeout(timer);
  }
}
export {
  __serverRpc
};
