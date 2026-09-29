import {
  encodeServerResultFrame,
  serverResultLimits
} from "../server-rpc-protocol.js";
function createServerResultStream(result, options = {}) {
  const limits = serverResultLimits(options);
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
    const encoded = encodeServerResultFrame(sequence, frame);
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
export {
  createServerResultStream
};
