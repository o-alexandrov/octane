import { formatServerError } from "../error-codes.server.generated.js";
import { encodeSignalValue } from "../data-encoding.js";
import { STREAM_SCRIPT_ATTR } from "../stream-protocol.js";
import {
  encodeStreamedRendererFrameForScript,
  isStreamFrameIdentity,
  isStreamedRendererFrame
} from "../streamed-signals-protocol.js";
import { createServerSignalQueryAttemptObservations } from "./signal-query-observation.js";
const DEFAULT_MAX_FRAME_BYTES = 4 * 1024 * 1024;
const DEFAULT_MAX_TOTAL_BYTES = 64 * 1024 * 1024;
const DEFAULT_TIMEOUT = 3e4;
function positiveLimit(value, fallback) {
  const limit = value ?? fallback;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new RangeError("Streamed renderer limits must be positive safe integers.");
  }
  return limit;
}
function limits(options) {
  return {
    maxFrameBytes: positiveLimit(options.maxFrameBytes, DEFAULT_MAX_FRAME_BYTES),
    maxTotalBytes: positiveLimit(options.maxTotalBytes, DEFAULT_MAX_TOTAL_BYTES),
    timeoutMs: positiveLimit(options.timeoutMs, DEFAULT_TIMEOUT)
  };
}
function isAsyncIterable(value) {
  return value !== null && (typeof value === "object" || typeof value === "function") && typeof value[Symbol.asyncIterator] === "function";
}
const CANCELLED = /* @__PURE__ */ Symbol("octane.streamedSignalResultCancelled");
function createStreamedSignalResultFrames(identity, result, options = {}) {
  let cancelled = false;
  let reject;
  const waits = {
    wait(value) {
      if (cancelled) return Promise.reject(CANCELLED);
      return new Promise((resolve, fail) => {
        reject = fail;
        Promise.resolve(value).then(resolve, fail);
      });
    },
    interrupt(reason) {
      const fail = reject;
      reject = void 0;
      fail?.(reason);
    }
  };
  const frames = produceStreamedSignalResultFrames(identity, result, options, waits);
  const returnFrames = frames.return;
  frames.return = (value) => {
    cancelled = true;
    waits.interrupt(CANCELLED);
    return returnFrames.call(frames, value);
  };
  return frames;
}
async function* produceStreamedSignalResultFrames(identity, result, options, waits) {
  if (!isStreamFrameIdentity(identity)) throw new TypeError("Invalid streamed signal identity.");
  let sequence = 0;
  let resource = "promise";
  let iterator;
  const run = options.run ?? ((callback) => callback());
  const signal = options.signal;
  const abort = () => waits.interrupt(signal.reason);
  signal?.addEventListener("abort", abort, { once: true });
  try {
    signal?.throwIfAborted();
    const resolved = await waits.wait(result);
    signal?.throwIfAborted();
    if (isAsyncIterable(resolved)) {
      resource = "stream";
      iterator = run(() => resolved[Symbol.asyncIterator]());
      yield { identity, sequence: sequence++, channel: "result", kind: "open", resource: "stream" };
      for (; ; ) {
        signal?.throwIfAborted();
        const next = await waits.wait(run(() => iterator.next()));
        signal?.throwIfAborted();
        if (next.done) break;
        yield {
          identity,
          sequence: sequence++,
          channel: "result",
          kind: "value",
          value: encodeSignalValue(next.value)
        };
      }
      iterator = void 0;
    } else {
      yield {
        identity,
        sequence: sequence++,
        channel: "result",
        kind: "open",
        resource: "promise"
      };
      yield {
        identity,
        sequence: sequence++,
        channel: "result",
        kind: "value",
        value: encodeSignalValue(resolved)
      };
    }
    yield { identity, sequence, channel: "result", kind: "complete" };
  } catch (error) {
    if (error === CANCELLED) return;
    if (sequence === 0) {
      yield { identity, sequence: sequence++, channel: "result", kind: "open", resource };
    }
    yield { identity, sequence, channel: "result", kind: "error", code: "SERVER_RESULT_FAILED" };
  } finally {
    signal?.removeEventListener("abort", abort);
    if (iterator !== void 0) {
      try {
        await run(() => iterator.return?.());
      } catch {
      }
    }
  }
}
function line(frame) {
  if (!isStreamedRendererFrame(frame)) throw new TypeError("Invalid streamed renderer frame.");
  return new TextEncoder().encode(JSON.stringify(frame) + "\n");
}
function createStreamedRendererFrameStream(frames, options = {}) {
  const budget = limits(options);
  const iterator = frames[Symbol.asyncIterator]();
  let totalBytes = 0;
  let finished = false;
  let controller;
  let timer;
  const cleanup = () => {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  };
  const closeIterator = () => {
    try {
      void Promise.resolve(iterator.return?.(void 0)).catch(() => {
      });
    } catch {
    }
  };
  const fail = (error) => {
    if (finished) return;
    finished = true;
    cleanup();
    closeIterator();
    controller?.error(error);
  };
  const abort = () => fail(options.signal?.reason ?? new DOMException("Aborted", "AbortError"));
  return new ReadableStream(
    {
      start(streamController) {
        controller = streamController;
        options.signal?.addEventListener("abort", abort, { once: true });
        if (options.signal?.aborted) abort();
      },
      async pull() {
        if (finished) return;
        timer = setTimeout(() => fail(new Error(formatServerError(235))), budget.timeoutMs);
        try {
          const next = await iterator.next();
          clearTimeout(timer);
          if (finished) return;
          if (next.done) {
            finished = true;
            cleanup();
            controller.close();
            return;
          }
          const encoded = line(next.value);
          if (encoded.byteLength > budget.maxFrameBytes || totalBytes + encoded.byteLength > budget.maxTotalBytes) {
            throw new Error("Streamed renderer response exceeded its byte budget.");
          }
          totalBytes += encoded.byteLength;
          controller.enqueue(encoded);
        } catch (error) {
          fail(error);
        }
      },
      cancel() {
        if (finished) return;
        finished = true;
        cleanup();
        closeIterator();
      }
    },
    { highWaterMark: 0 }
  );
}
function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function byteLength(value) {
  return typeof globalThis.Buffer === "function" ? globalThis.Buffer.byteLength(value, "utf8") : new TextEncoder().encode(value).byteLength;
}
function streamedRendererFrameScript(frame, nonce) {
  const encoded = encodeStreamedRendererFrameForScript(frame);
  return `<script ${STREAM_SCRIPT_ATTR}${nonce === void 0 ? "" : ` nonce="${escapeAttribute(nonce)}"`}>globalThis.__octaneStreamedRenderer.receive(${encoded});</script>`;
}
function streamedSignalSelectionScript(identity, nonce) {
  if (!isStreamFrameIdentity(identity)) throw new TypeError("Invalid streamed signal identity.");
  const encoded = JSON.stringify(identity).replace(/&/g, "\\u0026").replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return `<script ${STREAM_SCRIPT_ATTR}${nonce === void 0 ? "" : ` nonce="${escapeAttribute(nonce)}"`}>(function(g){var k="__octaneStreamedRenderer",e=g[k];if(!e){var q=[];g[k]={version:1,frames:q,receive:function(f){if(q.length>=512){this.overflow=true;return;}q.push(f);}};}var z="__octaneStreamedSignalSelections",v=g[z];if(!v){var a=[];v=g[z]={version:1,identities:a,register:function(i){if(a.length>=256){this.overflow=true;return;}a.push(i);}};}v.register(${encoded});})(globalThis);</script>`;
}
function createStreamedSignalInjection(identity, result, options = {}) {
  return createSignalInjection(identity, result, options, "Streamed renderer injection timed out.");
}
function createSignalInjection(identity, result, options, timeoutMessage) {
  const budget = limits(options);
  const iterator = createStreamedSignalResultFrames(identity, result, options)[Symbol.asyncIterator]();
  let queued = options.announceSelection ? streamedSignalSelectionScript(identity, options.nonce) : "";
  let pending = false;
  let awaitingAcceptance = false;
  let queuedBytes = queued === "" ? 0 : byteLength(queued);
  let finished = false;
  let subscribed = false;
  let totalBytes = 0;
  let notify;
  let resolveDone;
  let rejectDone;
  const done = new Promise((resolve, reject) => {
    resolveDone = resolve;
    rejectDone = reject;
  });
  let timer;
  const cleanup = () => {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  };
  const closeIterator = () => {
    try {
      void Promise.resolve(iterator.return?.(void 0)).catch(() => {
      });
    } catch {
    }
  };
  const fail = (error) => {
    if (finished) return;
    finished = true;
    cleanup();
    closeIterator();
    rejectDone(error);
  };
  const pump = () => {
    if (!subscribed || pending || awaitingAcceptance || queued !== "" || finished) return;
    pending = true;
    timer = setTimeout(() => fail(new Error(timeoutMessage)), budget.timeoutMs);
    void iterator.next().then(
      (next) => {
        pending = false;
        clearTimeout(timer);
        if (finished) return;
        if (next.done) {
          finished = true;
          cleanup();
          resolveDone();
          return;
        }
        const html = streamedRendererFrameScript(next.value, options.nonce);
        const bytes = byteLength(html);
        if (bytes > budget.maxFrameBytes || totalBytes + bytes > budget.maxTotalBytes) {
          fail(new Error("Streamed renderer injection exceeded its byte budget."));
          return;
        }
        totalBytes += bytes;
        queued = html;
        queuedBytes = bytes;
        notify?.();
      },
      (error) => {
        pending = false;
        fail(error);
      }
    );
  };
  const abort = () => {
    fail(options.signal?.reason ?? new DOMException("Aborted", "AbortError"));
  };
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) abort();
  return {
    streamedRenderer: true,
    get queuedBytes() {
      return queuedBytes;
    },
    take() {
      const html = queued;
      queued = "";
      if (html !== "") awaitingAcceptance = true;
      return html;
    },
    subscribe(callback) {
      notify = callback;
      subscribed = true;
      pump();
      return () => {
        if (notify === callback) notify = void 0;
      };
    },
    accepted() {
      awaitingAcceptance = false;
      pump();
    },
    cancel: fail,
    done,
    renderComplete() {
      pump();
    }
  };
}
function createAutomaticStreamedSignalInjection(options, external) {
  if (!options.buildId || !options.documentId) {
    throw new TypeError("Automatic streamed signals require buildId and documentId.");
  }
  const budget = limits(options);
  const selectionGeneration = options.selectionGeneration ?? 0;
  if (!Number.isSafeInteger(selectionGeneration) || selectionGeneration < 0) {
    throw new RangeError("selectionGeneration must be a nonnegative safe integer.");
  }
  const children = /* @__PURE__ */ new Set();
  const ready = /* @__PURE__ */ new Set();
  const observedAttempts = /* @__PURE__ */ new Set();
  let initialSelections = [];
  let queued = "";
  let active;
  let awaitingAcceptance = false;
  let hasSignalAttempts = false;
  let pumping = false;
  let subscribed = false;
  let renderComplete = false;
  let finished = false;
  let totalBytes = 0;
  let notify;
  let resolveDone;
  let rejectDone;
  const done = new Promise((resolve, reject) => {
    resolveDone = resolve;
    rejectDone = reject;
  });
  const cleanupChild = (child) => {
    if (!children.delete(child)) return;
    ready.delete(child);
    try {
      child.unsubscribe();
    } catch {
    }
    try {
      child.release();
    } catch {
    }
  };
  const fail = (error) => {
    if (finished) return;
    finished = true;
    for (const child of children) {
      try {
        child.source.cancel?.(error);
      } catch {
      }
      cleanupChild(child);
    }
    rejectDone(error);
  };
  const maybeDone = () => {
    if (finished || !renderComplete || active !== void 0 || awaitingAcceptance || queued !== "" || children.size !== 0)
      return;
    finished = true;
    resolveDone();
  };
  const takeInitialSelections = () => {
    const selections = initialSelections;
    initialSelections = void 0;
    let html = "";
    for (const { identity, attempt } of selections ?? []) {
      if (attempt.signal.aborted) continue;
      const script = streamedSignalSelectionScript(identity, options.nonce);
      const bytes = byteLength(script);
      if (bytes > budget.maxFrameBytes || totalBytes + bytes > budget.maxTotalBytes) {
        const error = new Error("Automatic streamed signals exceeded their byte budget.");
        fail(error);
        throw error;
      }
      totalBytes += bytes;
      html += script;
    }
    return html;
  };
  const pump = () => {
    if (pumping || !subscribed || finished || active !== void 0 || awaitingAcceptance || queued !== "")
      return;
    pumping = true;
    try {
      if (initialSelections !== void 0) {
        try {
          queued = takeInitialSelections();
        } catch {
          return;
        }
        if (queued !== "") notify?.();
      }
      for (const child of ready) {
        if (finished || active !== void 0 || awaitingAcceptance || queued !== "") return;
        ready.delete(child);
        const html = child.source.take();
        if (finished) return;
        if (html === "") {
          if (child.done && (child.attempt !== void 0 || renderComplete)) cleanupChild(child);
          continue;
        }
        const bytes = child.attempt === void 0 ? byteLength(html) : child.source.queuedBytes;
        if (bytes > budget.maxFrameBytes || totalBytes + bytes > budget.maxTotalBytes) {
          fail(new Error("Automatic streamed signals exceeded their byte budget."));
          return;
        }
        totalBytes += bytes;
        active = child;
        queued = html;
        notify?.();
      }
      maybeDone();
    } finally {
      pumping = false;
    }
  };
  const addChild = (source, release, attempt) => {
    const child = {
      source,
      release,
      unsubscribe: () => {
      },
      ...attempt === void 0 ? {} : { attempt },
      done: false
    };
    children.add(child);
    const available = () => {
      if (finished || !children.has(child)) return;
      ready.add(child);
      pump();
    };
    ready.add(child);
    child.unsubscribe = source.subscribe(available);
    source.done.then(
      () => {
        child.done = true;
        available();
      },
      (error) => {
        if (child.attempt !== void 0 && !child.attempt.isCurrent()) {
          child.done = true;
          available();
        } else fail(error);
      }
    );
  };
  if (external !== void 0) addChild(external, () => {
  });
  return {
    takeInitialSelections,
    createSignalAttemptObservations: createServerSignalQueryAttemptObservations,
    get streamedRenderer() {
      return external?.streamedRenderer === true || hasSignalAttempts ? true : void 0;
    },
    observeSignalAttempt(attempt, run) {
      if (finished || !attempt.isCurrent()) {
        attempt.release();
        return;
      }
      const attemptKey = JSON.stringify([
        attempt.ownerKey,
        attempt.instanceKey,
        attempt.nodeKey,
        attempt.selectionKey,
        attempt.attempt
      ]);
      if (observedAttempts.has(attemptKey)) {
        attempt.release();
        return;
      }
      observedAttempts.add(attemptKey);
      if (children.size >= 256) {
        attempt.release();
        return;
      }
      hasSignalAttempts = true;
      const identity = {
        protocol: 1,
        buildId: options.buildId,
        documentId: options.documentId,
        ownerKey: attempt.ownerKey,
        instanceKey: attempt.instanceKey,
        nodeKey: attempt.nodeKey,
        selectionKey: attempt.selectionKey,
        selectionGeneration,
        attempt: attempt.attempt
      };
      initialSelections?.push({ identity, attempt });
      const source = createSignalInjection(
        identity,
        attempt.result,
        {
          signal: attempt.signal,
          run,
          nonce: options.nonce,
          announceSelection: initialSelections === void 0,
          maxFrameBytes: budget.maxFrameBytes,
          maxTotalBytes: budget.maxTotalBytes,
          timeoutMs: budget.timeoutMs
        },
        "Automatic streamed signals timed out."
      );
      addChild(source, attempt.release, attempt);
      pump();
    },
    take() {
      const html = queued;
      queued = "";
      if (html !== "") awaitingAcceptance = true;
      return html;
    },
    subscribe(callback) {
      notify = callback;
      subscribed = true;
      pump();
      return () => {
        if (notify === callback) notify = void 0;
      };
    },
    accepted() {
      const child = active;
      child?.source.accepted?.();
      if (child !== void 0 && children.has(child)) ready.add(child);
      active = void 0;
      awaitingAcceptance = false;
      pump();
    },
    cancel: fail,
    done,
    renderComplete() {
      renderComplete = true;
      external?.renderComplete?.();
      for (const child of children) {
        if (child.attempt !== void 0) child.source.renderComplete?.();
        if (child.done) ready.add(child);
      }
      pump();
      maybeDone();
    }
  };
}
export {
  createAutomaticStreamedSignalInjection,
  createStreamedRendererFrameStream,
  createStreamedSignalInjection,
  createStreamedSignalResultFrames,
  streamedRendererFrameScript
};
