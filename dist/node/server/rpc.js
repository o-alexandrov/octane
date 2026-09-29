import * as devalue from "devalue";
import {
  InvalidServerFunctionPayloadError,
  invokeServerFunction
} from "../server-call.js";
import { createServerResultStream } from "./rpc-stream.js";
import {
  decodeServerArguments,
  serverResultLimits
} from "../server-rpc-protocol.js";
function serverArguments(body) {
  let args;
  try {
    args = devalue.parse(body);
  } catch (error) {
    throw new InvalidServerFunctionPayloadError(error);
  }
  if (!Array.isArray(args)) throw new InvalidServerFunctionPayloadError();
  return args;
}
async function executeServerFunction(fn, body, context) {
  const args = serverArguments(body);
  const value = await invokeServerFunction(fn, args, context);
  return devalue.stringify({ value });
}
function executeServerFunctionStream(fn, body, context, limits) {
  const resolvedLimits = serverResultLimits(limits);
  let args;
  try {
    args = decodeServerArguments(body);
  } catch (error) {
    throw new InvalidServerFunctionPayloadError(error);
  }
  const cancellation = new AbortController();
  const signal = context === void 0 ? cancellation.signal : AbortSignal.any([context.signal, cancellation.signal]);
  const trusted = context === void 0 ? void 0 : { ...context, signal };
  return createServerResultStream(
    Promise.resolve().then(() => {
      signal.throwIfAborted();
      return invokeServerFunction(fn, args, trusted);
    }),
    { ...resolvedLimits, signal, cancel: () => cancellation.abort() }
  );
}
export {
  executeServerFunction,
  executeServerFunctionStream
};
