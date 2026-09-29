import { isStreamedRendererFrame, streamFrameIdentityKey } from "../streamed-signals-protocol.js";
import { StreamedReceiverError } from "./stream-result-receiver.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const STREAMED_RENDERER_RECEIVER = "__octaneStreamedRenderer";
const DEFAULT_MAX_FRAME_BYTES = 4 * 1024 * 1024;
const DEFAULT_MAX_TOTAL_BYTES = 64 * 1024 * 1024;
const DEFAULT_PENDING_BYTES = 16 * 1024 * 1024;
const DEFAULT_PENDING_FRAMES = 64;
const DEFAULT_TIMEOUT_MS = 3e4;
function positiveLimit(value, fallback) {
  const limit = value ?? fallback;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new RangeError(process.env.NODE_ENV !== "production" ? "Streamed renderer response limits must be positive safe integers." : __octaneNoArgError(222));
  }
  return limit;
}
function createDelivery(receiver, options, delivered) {
  const maxFrameBytes = positiveLimit(options.maxFrameBytes, DEFAULT_MAX_FRAME_BYTES);
  const maxPendingBytes = positiveLimit(options.maxPendingBytes, DEFAULT_PENDING_BYTES);
  const maxPendingFrames = positiveLimit(options.maxPendingFrames, DEFAULT_PENDING_FRAMES);
  const timeoutMs = positiveLimit(options.timeoutMs, DEFAULT_TIMEOUT_MS);
  const tails = /* @__PURE__ */ new Map();
  const pending = /* @__PURE__ */ new Set();
  const aborters = /* @__PURE__ */ new Set();
  const waiters = /* @__PURE__ */ new Set();
  let pendingBytes = 0;
  let closed;
  const notify = () => {
    for (const wake of waiters)
      wake();
    waiters.clear();
  };
  function validateSize(bytes) {
    if (bytes > maxFrameBytes || bytes > maxPendingBytes)
      throw new StreamedReceiverError("overflow", process.env.NODE_ENV !== "production" ? "A streamed renderer frame exceeded its byte budget." : __octaneNoArgError(223));
  }
  return {
    async room(bytes) {
      validateSize(bytes);
      while (pending.size >= maxPendingFrames || pendingBytes + bytes > maxPendingBytes) {
        if (closed !== void 0)
          throw closed;
        await new Promise((resolve) => waiters.add(resolve));
      }
      if (closed !== void 0)
        throw closed;
    },
    enqueue(frame, bytes) {
      if (closed !== void 0)
        return Promise.reject(closed);
      try {
        validateSize(bytes);
        if (pending.size >= maxPendingFrames || pendingBytes + bytes > maxPendingBytes)
          throw new StreamedReceiverError("overflow", process.env.NODE_ENV !== "production" ? "Streamed renderer delivery exceeded its pending budget." : __octaneNoArgError(224));
      } catch (error) {
        receiver.failSelection(frame.identity, error);
        throw error;
      }
      const key = JSON.stringify([streamFrameIdentityKey(frame.identity), frame.channel]);
      const previous = tails.get(key) ?? Promise.resolve();
      let canceled;
      let abort;
      const cancellation = new Promise((_, reject) => {
        abort = (error) => {
          canceled = error;
          try {
            receiver.failSelection(frame.identity, error);
          } catch {
          }
          reject(error);
        };
        aborters.add(abort);
      });
      const timer = setTimeout(() => abort(new StreamedReceiverError("timeout", process.env.NODE_ENV !== "production" ? "Streamed renderer delivery timed out." : __octaneNoArgError(225))), timeoutMs);
      const work = previous.catch(() => {
      }).then(() => {
        if (canceled !== void 0)
          throw canceled;
        return receiver.receive(frame);
      });
      const delivery = Promise.race([work, cancellation]).then((disposition) => {
        if (canceled !== void 0)
          throw canceled;
        delivered?.(frame, disposition);
      }).catch((cause) => {
        const error = cause instanceof StreamedReceiverError ? cause : new StreamedReceiverError("protocol", process.env.NODE_ENV !== "production" ? "Streamed renderer delivery failed." : __octaneNoArgError(226));
        try {
          receiver.failSelection(frame.identity, error);
        } catch {
        }
        throw error;
      }).finally(() => {
        clearTimeout(timer);
        aborters.delete(abort);
        pending.delete(delivery);
        pendingBytes -= bytes;
        if (tails.get(key) === delivery)
          tails.delete(key);
        notify();
      });
      pending.add(delivery);
      pendingBytes += bytes;
      tails.set(key, delivery);
      void delivery.catch(() => {
      });
      return delivery;
    },
    async drain() {
      while (pending.size !== 0)
        await Promise.allSettled([...pending]);
    },
    close(error) {
      if (closed !== void 0)
        return;
      closed = error;
      for (const abort of aborters)
        abort(error);
      notify();
    }
  };
}
function installStreamedRendererGlobal(receiver, target = globalThis, options = {}) {
  const previous = Object.getOwnPropertyDescriptor(target, STREAMED_RENDERER_RECEIVER);
  const early = previous?.value;
  if (previous !== void 0 && (early === null || typeof early !== "object" || early.version !== 1 || !Array.isArray(early.frames) || typeof early.receive !== "function")) {
    throw new Error(process.env.NODE_ENV !== "production" ? "An Octane streamed renderer receiver is already installed in this realm." : __octaneNoArgError(227));
  }
  if (early?.overflow === true) {
    throw new Error(process.env.NODE_ENV !== "production" ? "The pre-module streamed renderer mailbox overflowed." : __octaneNoArgError(228));
  }
  const maxOpenResults = positiveLimit(options.maxPendingFrames, DEFAULT_PENDING_FRAMES);
  const resultTimeoutMs = positiveLimit(options.timeoutMs, DEFAULT_TIMEOUT_MS);
  const openResults = /* @__PURE__ */ new Map();
  function forgetResult(identity) {
    const key = streamFrameIdentityKey(identity);
    const result = openResults.get(key);
    if (result === void 0)
      return;
    clearTimeout(result.timer);
    openResults.delete(key);
  }
  const delivery = createDelivery(receiver, options, (frame, disposition) => {
    if (disposition === "stale" || frame.channel !== "result")
      return;
    if (frame.kind === "complete" || frame.kind === "error") {
      forgetResult(frame.identity);
    } else {
      const key = streamFrameIdentityKey(frame.identity);
      const previous2 = openResults.get(key);
      if (previous2 !== void 0)
        clearTimeout(previous2.timer);
      else if (openResults.size >= maxOpenResults)
        throw new StreamedReceiverError("overflow", process.env.NODE_ENV !== "production" ? "Streamed renderer exceeded its open result budget." : __octaneNoArgError(229));
      const timer = setTimeout(() => {
        forgetResult(frame.identity);
        try {
          receiver.failSelection(frame.identity, new StreamedReceiverError("timeout", process.env.NODE_ENV !== "production" ? "Streamed renderer result timed out." : __octaneNoArgError(230)));
        } catch {
        }
      }, resultTimeoutMs);
      openResults.set(key, { identity: frame.identity, timer });
    }
  });
  let removed = false;
  const entrypoint = Object.freeze({
    receive(frame) {
      if (removed)
        return;
      if (!isStreamedRendererFrame(frame)) {
        void receiver.receive(frame).catch(() => {
        });
        return;
      }
      try {
        void delivery.enqueue(frame, new TextEncoder().encode(JSON.stringify(frame)).byteLength).catch(() => forgetResult(frame.identity));
      } catch {
        forgetResult(frame.identity);
      }
    }
  });
  Object.defineProperty(target, STREAMED_RENDERER_RECEIVER, {
    value: entrypoint,
    configurable: true
  });
  if (early !== void 0) {
    for (const frame of early.frames)
      entrypoint.receive(frame);
    early.frames.length = 0;
  }
  return () => {
    removed = true;
    const error = new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "Streamed renderer entrypoint was removed." : __octaneNoArgError(231));
    delivery.close(error);
    for (const { identity, timer } of openResults.values()) {
      clearTimeout(timer);
      try {
        receiver.failSelection(identity, error);
      } catch {
      }
    }
    openResults.clear();
    if (target[STREAMED_RENDERER_RECEIVER] !== entrypoint)
      return;
    delete target[STREAMED_RENDERER_RECEIVER];
  };
}
async function readStreamedRendererResponse(response, receiver, options = {}) {
  if (response.body === null)
    throw new Error(process.env.NODE_ENV !== "production" ? "The streamed renderer response has no body." : __octaneNoArgError(232));
  const maxFrameBytes = positiveLimit(options.maxFrameBytes, DEFAULT_MAX_FRAME_BYTES);
  const maxTotalBytes = positiveLimit(options.maxTotalBytes, DEFAULT_MAX_TOTAL_BYTES);
  const timeoutMs = positiveLimit(options.timeoutMs, DEFAULT_TIMEOUT_MS);
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const openResults = /* @__PURE__ */ new Map();
  const delivery = createDelivery(receiver, options, (frame, disposition) => {
    if (disposition === "stale" || frame.channel !== "result")
      return;
    const key = streamFrameIdentityKey(frame.identity);
    if (frame.kind === "open")
      openResults.set(key, frame.identity);
    else if (frame.kind === "complete" || frame.kind === "error")
      openResults.delete(key);
  });
  let frameParts = [];
  let frameBytes = 0;
  let totalBytes = 0;
  let finished = false;
  let failure;
  function failOpenResults(error) {
    let failed = false;
    for (const identity of openResults.values())
      failed = receiver.failSelection(identity, error) || failed;
    openResults.clear();
    return failed;
  }
  const acceptLine = async () => {
    if (frameBytes === 0)
      return;
    const bytes = frameParts.length === 1 ? frameParts[0] : (() => {
      const joined = new Uint8Array(frameBytes);
      let offset = 0;
      for (const part of frameParts) {
        joined.set(part, offset);
        offset += part.byteLength;
      }
      return joined;
    })();
    const frame = JSON.parse(decoder.decode(bytes));
    if (!isStreamedRendererFrame(frame))
      throw new StreamedReceiverError("protocol", process.env.NODE_ENV !== "production" ? "Malformed streamed renderer frame." : __octaneNoArgError(233));
    await delivery.room(frameBytes);
    void delivery.enqueue(frame, frameBytes).catch((error) => {
      failure ??= error;
    });
  };
  const abort = () => {
    failure ??= new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "Streamed renderer response was canceled." : __octaneNoArgError(234));
    delivery.close(failure);
    failOpenResults(failure);
    void reader.cancel(options.signal?.reason).catch(() => {
    });
  };
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted)
    abort();
  try {
    for (; ; ) {
      if (failure !== void 0 && options.signal?.aborted)
        throw failure;
      options.signal?.throwIfAborted();
      const timer = setTimeout(() => {
        failure ??= new StreamedReceiverError("timeout", process.env.NODE_ENV !== "production" ? "Streamed renderer response timed out." : __octaneNoArgError(235));
        abort();
      }, timeoutMs);
      let next;
      try {
        next = await reader.read();
      } finally {
        clearTimeout(timer);
      }
      if (next.done)
        break;
      totalBytes += next.value.byteLength;
      if (totalBytes > maxTotalBytes) {
        throw new Error(process.env.NODE_ENV !== "production" ? "The streamed renderer response exceeded its total byte budget." : __octaneNoArgError(236));
      }
      let start = 0;
      for (let index = 0; index < next.value.byteLength; index++) {
        if (next.value[index] !== 10)
          continue;
        const part = next.value.subarray(start, index);
        if (part.byteLength > 0)
          frameParts.push(part);
        frameBytes += part.byteLength;
        if (frameBytes > maxFrameBytes) {
          throw new Error(process.env.NODE_ENV !== "production" ? "A streamed renderer frame exceeded its byte budget." : __octaneNoArgError(223));
        }
        await acceptLine();
        frameParts = [];
        frameBytes = 0;
        start = index + 1;
      }
      const tail = next.value.subarray(start);
      if (tail.byteLength > 0)
        frameParts.push(tail);
      frameBytes += tail.byteLength;
      if (frameBytes > maxFrameBytes) {
        throw new Error(process.env.NODE_ENV !== "production" ? "A streamed renderer frame exceeded its byte budget." : __octaneNoArgError(223));
      }
    }
    if (frameBytes !== 0)
      throw new Error(process.env.NODE_ENV !== "production" ? "The streamed renderer response ended mid-frame." : __octaneNoArgError(237));
    await delivery.drain();
    const terminalError = new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "The streamed renderer response ended before a result terminal." : __octaneNoArgError(238));
    if (failOpenResults(terminalError))
      failure ??= terminalError;
    if (failure !== void 0)
      throw failure;
    finished = true;
  } catch (cause) {
    const error = cause instanceof StreamedReceiverError ? cause : new StreamedReceiverError("protocol", cause instanceof Error ? cause.message : process.env.NODE_ENV !== "production" ? "Streamed renderer response failed." : __octaneNoArgError(239));
    delivery.close(error);
    failOpenResults(error);
    throw error;
  } finally {
    options.signal?.removeEventListener("abort", abort);
    if (!finished) {
      try {
        void reader.cancel().catch(() => {
        });
      } catch {
      }
    }
    reader.releaseLock();
  }
}
export {
  STREAMED_RENDERER_RECEIVER,
  installStreamedRendererGlobal,
  readStreamedRendererResponse
};
