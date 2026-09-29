import { decodeSignalValue, encodeSignalValue } from "./data-encoding.js";
const SERVER_RESULT_CONTENT_TYPE = "application/x-octane-rpc+ndjson";
function encodeServerArguments(args) {
  return JSON.stringify([1, encodeSignalValue(args)]);
}
function decodeServerArguments(body) {
  const envelope = JSON.parse(body);
  if (!Array.isArray(envelope) || envelope.length !== 2 || envelope[0] !== 1) {
    throw new Error("Invalid server argument protocol");
  }
  const args = decodeSignalValue(envelope[1]);
  if (!Array.isArray(args)) throw new Error("Invalid server arguments");
  return args;
}
class ServerCallUncertainError extends Error {
  code = "OCTANE_RPC_UNCERTAIN";
  constructor(cause) {
    super(cause instanceof Error ? cause.message : "Server function outcome is uncertain", {
      cause
    });
    this.name = "ServerCallUncertainError";
  }
}
function validateServerCallBatch(options) {
  if (options.kind !== "independent-reads" || !options.authority || !options.document) {
    throw new TypeError(
      "A server-call batch requires independent reads and authority/document keys"
    );
  }
  serverResultLimits(options);
}
function serverResultLimits(limits = {}) {
  const result = {
    maxFrameBytes: limits.maxFrameBytes ?? 1024 * 1024,
    maxTotalBytes: limits.maxTotalBytes ?? 16 * 1024 * 1024,
    timeoutMs: limits.timeoutMs ?? 3e4
  };
  for (const value of Object.values(result)) {
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new RangeError("Server result limits must be positive safe integers");
    }
  }
  if (result.maxFrameBytes > result.maxTotalBytes) {
    throw new RangeError("A server result frame cannot exceed the total response budget");
  }
  return result;
}
function encodeServerResultFrame(sequence, frame) {
  const payload = frame.kind === "value" ? encodeSignalValue(frame.value) : frame.kind === "error" ? frame.error : null;
  return new TextEncoder().encode(JSON.stringify([1, sequence, frame.kind, payload]) + "\n");
}
function decodeServerResultFrame(line, sequence) {
  const frame = JSON.parse(line);
  if (!Array.isArray(frame) || frame.length !== 4 || frame[0] !== 1 || frame[1] !== sequence) {
    throw new Error("Invalid or out-of-order server result frame");
  }
  const [, , kind, payload] = frame;
  if (kind === "value") {
    return { kind, value: decodeSignalValue(payload) };
  }
  if (kind === "error" && typeof payload === "string") return { kind, error: payload };
  if ((kind === "stream" || kind === "complete") && payload === null) return { kind };
  throw new Error("Invalid server result frame");
}
function serverResultReader(reader, limits) {
  let chunk = new Uint8Array(0);
  let offset = 0;
  let sequence = 0;
  let totalBytes = 0;
  return async () => {
    const parts = [];
    let bytes = 0;
    while (true) {
      if (offset === chunk.length) {
        const next = await reader.read();
        if (next.done) throw new Error("Server result ended without a terminal frame");
        chunk = next.value;
        offset = 0;
      }
      const newline = chunk.indexOf(10, offset);
      const end = newline === -1 ? chunk.length : newline + 1;
      const part = chunk.subarray(offset, end);
      bytes += part.length;
      totalBytes += part.length;
      if (bytes > limits.maxFrameBytes || totalBytes > limits.maxTotalBytes) {
        throw new Error("Server result exceeded its response budget");
      }
      parts.push(part);
      offset = end;
      if (newline !== -1) {
        const decoder = new TextDecoder("utf-8", { fatal: true });
        const text = parts.map((value) => decoder.decode(value, { stream: true }));
        text.push(decoder.decode());
        return decodeServerResultFrame(text.join(""), sequence++);
      }
    }
  };
}
export {
  SERVER_RESULT_CONTENT_TYPE,
  ServerCallUncertainError,
  decodeServerArguments,
  decodeServerResultFrame,
  encodeServerArguments,
  encodeServerResultFrame,
  serverResultLimits,
  serverResultReader,
  validateServerCallBatch
};
