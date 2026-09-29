import {
  serverResultLimits,
  serverResultReader,
  ServerCallUncertainError
} from "./server-rpc-protocol.js";
async function readServerResult(response, options = {}) {
  if (response.body === null)
    throw new ServerCallUncertainError(new Error("Server function returned an empty response"));
  const limits = serverResultLimits(options);
  const reader = response.body.getReader();
  const read = serverResultReader(reader, limits);
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
    failure = new ServerCallUncertainError(
      options.signal?.reason ?? new DOMException("Server function canceled", "AbortError")
    );
    void close();
  };
  const timer = setTimeout(() => {
    failure = new ServerCallUncertainError(
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
      throw failure ?? new ServerCallUncertainError(error);
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
    throw error instanceof ServerCallUncertainError ? error : new ServerCallUncertainError(error);
  }
}
export {
  readServerResult
};
