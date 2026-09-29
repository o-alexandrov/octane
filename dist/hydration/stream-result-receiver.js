import { decodeStreamedRendererFrame, isStreamedRendererFrame, sameStreamFrameIdentity } from "../streamed-signals-protocol.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
class StreamedReceiverError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "StreamedReceiverError";
  }
  code;
}
function retainCompletedResult(result) {
  if (result.frames.at(-1)?.kind === "complete" && result.consumer?.retainCompleted?.(result.frames) === true) {
    result.frames = [];
    result.frameSizes.length = 0;
    result.bytes = 0;
  }
}
const DEFAULT_PENDING_FRAMES = 64;
const DEFAULT_PENDING_BYTES = 1024 * 1024;
const DEFAULT_PENDING_TIMEOUT = 3e4;
function counter(value, fallback) {
  const result = value ?? fallback;
  if (!Number.isSafeInteger(result) || result <= 0) {
    throw new RangeError(process.env.NODE_ENV !== "production" ? "Stream receiver limits must be positive safe integers." : __octaneNoArgError(251));
  }
  return result;
}
function slotKey(identity) {
  return JSON.stringify([identity.instanceKey, identity.nodeKey]);
}
function frameBytes(frame) {
  return new TextEncoder().encode(JSON.stringify(frame)).byteLength;
}
function createStreamedResultReceiver(options) {
  return createStreamedResultReceiverState(options).receiver;
}
function createStreamedResultReceiverState(options, commitPlacement) {
  const maxFrames = counter(options.maxPendingFrames, DEFAULT_PENDING_FRAMES);
  const maxBytes = counter(options.maxPendingBytes, DEFAULT_PENDING_BYTES);
  const timeoutMs = counter(options.pendingTimeoutMs, DEFAULT_PENDING_TIMEOUT);
  const selections = /* @__PURE__ */ new Map();
  let disposed = false;
  const report = (error, state) => {
    if (state !== void 0) {
      if (state.failure !== void 0)
        return;
      state.failure = error;
      state.pendingPlacement?.cancel();
      if (!state.result.terminal) {
        state.result.failure = error;
        try {
          state.result.consumer?.fail(error);
        } catch {
        }
        state.result.frames.length = 0;
        state.result.frameSizes.length = 0;
        state.result.bytes = 0;
      }
      if (state.result.timer !== void 0)
        clearTimeout(state.result.timer);
      state.result.terminal = true;
    }
    options.onError?.(error);
  };
  const current = (identity) => {
    if (identity.buildId !== options.buildId || identity.documentId !== options.documentId || identity.ownerKey !== options.ownerKey) {
      return;
    }
    const state = selections.get(slotKey(identity));
    return state !== void 0 && sameStreamFrameIdentity(state.identity, identity) ? state : void 0;
  };
  const isCurrent = (state, identity) => !disposed && state.failure === void 0 && current(identity) === state;
  const renewResultTimeout = (state) => {
    if (state.result.timer !== void 0)
      clearTimeout(state.result.timer);
    state.result.timer = setTimeout(() => {
      report(new StreamedReceiverError("timeout", process.env.NODE_ENV !== "production" ? "Streamed result timed out." : __octaneNoArgError(252)), state);
    }, timeoutMs);
  };
  const registerSelection = (identity, contentRevision = 0) => {
    if (!isStreamedRendererFrame({
      identity,
      sequence: 0,
      channel: "result",
      kind: "complete"
    })) {
      throw new StreamedReceiverError("identity", process.env.NODE_ENV !== "production" ? "Invalid streamed selection identity." : __octaneNoArgError(253));
    }
    if (identity.buildId !== options.buildId || identity.documentId !== options.documentId || identity.ownerKey !== options.ownerKey || !Number.isSafeInteger(contentRevision) || contentRevision < 0) {
      throw new StreamedReceiverError("identity", process.env.NODE_ENV !== "production" ? "Streamed selection has the wrong authority." : __octaneNoArgError(254));
    }
    const key = slotKey(identity);
    const previous = selections.get(key);
    if (previous !== void 0) {
      previous.pendingPlacement?.cancel();
      if (previous.result.timer !== void 0)
        clearTimeout(previous.result.timer);
      previous.historical?.release();
    }
    const state = {
      identity,
      result: {
        sequence: 0,
        opened: false,
        values: 0,
        terminal: false,
        frames: [],
        frameSizes: [],
        bytes: 0
      },
      placementSequence: 0,
      contentRevision
    };
    selections.set(key, state);
    renewResultTimeout(state);
  };
  const attachResult = (identity, consumer) => {
    const state = current(identity);
    if (state === void 0) {
      throw new StreamedReceiverError("identity", process.env.NODE_ENV !== "production" ? "Cannot attach a result to a stale selection." : __octaneNoArgError(255));
    }
    if (state.result.consumer !== void 0 && state.result.consumer !== consumer) {
      throw new StreamedReceiverError("identity", process.env.NODE_ENV !== "production" ? "A streamed result already has a consumer." : __octaneNoArgError(256));
    }
    state.result.consumer = consumer;
    if (state.result.failure !== void 0) {
      consumer.fail(state.result.failure);
      return () => {
        if (state.result.consumer === consumer)
          state.result.consumer = void 0;
      };
    }
    let accepted = 0;
    try {
      for (const frame of state.result.frames) {
        if (consumer.accept(frame) === false)
          break;
        accepted++;
      }
    } finally {
      if (accepted === state.result.frames.length)
        state.result.bytes = 0;
      else {
        for (let index = 0; index < accepted; index++) {
          state.result.bytes -= state.result.frameSizes[index];
        }
      }
      state.result.frames.splice(0, accepted);
      state.result.frameSizes.splice(0, accepted);
    }
    retainCompletedResult(state.result);
    return () => {
      if (state.result.consumer === consumer)
        state.result.consumer = void 0;
    };
  };
  const receiveResult = (state, frame) => {
    const result = state.result;
    if (result.terminal || frame.sequence !== result.sequence) {
      throw new StreamedReceiverError("sequence", process.env.NODE_ENV !== "production" ? "Invalid or duplicate streamed result sequence." : __octaneNoArgError(257));
    }
    result.sequence++;
    if (!result.opened) {
      if (frame.kind !== "open") {
        throw new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "A streamed result must begin with open." : __octaneNoArgError(258));
      }
      result.opened = true;
      result.resource = frame.resource;
    } else if (frame.kind === "open") {
      throw new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "A streamed result cannot open twice." : __octaneNoArgError(259));
    } else if (frame.kind === "value") {
      result.values++;
      if (result.resource === "promise" && result.values > 1) {
        throw new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "A promise result emitted more than one value." : __octaneNoArgError(260));
      }
    } else {
      if (frame.kind === "complete" && result.resource === "promise" && result.values !== 1) {
        throw new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "A promise result completed without one value." : __octaneNoArgError(261));
      }
    }
    if (result.consumer === void 0 || result.frames.length !== 0 || result.consumer.accept(frame) === false) {
      const bytes = frameBytes(frame);
      if (result.frames.length + 1 > maxFrames || result.bytes + bytes > maxBytes) {
        throw new StreamedReceiverError("overflow", process.env.NODE_ENV !== "production" ? "Streamed result mailbox exceeded its bound." : __octaneNoArgError(262));
      }
      result.frames.push(frame);
      result.frameSizes.push(bytes);
      result.bytes += bytes;
    }
    if (frame.kind === "complete" || frame.kind === "error") {
      result.terminal = true;
      if (result.timer !== void 0)
        clearTimeout(result.timer);
    } else if (!result.terminal && isCurrent(state, frame.identity))
      renewResultTimeout(state);
    if (frame.kind === "complete")
      retainCompletedResult(result);
    return "accepted";
  };
  const receivePlacement = async (state, frame) => {
    if (frame.sequence !== state.placementSequence) {
      throw new StreamedReceiverError("sequence", process.env.NODE_ENV !== "production" ? "Invalid or duplicate placement sequence." : __octaneNoArgError(263));
    }
    state.placementSequence++;
    const registration = state.region;
    if (registration === void 0 || registration.isActive())
      return "stale";
    if (frame.contentRevision <= state.contentRevision)
      return "stale";
    if (frame.mode === "delta" && frame.baseRevision !== state.contentRevision)
      return "stale";
    return commitPlacement?.(state, frame, isCurrent) ?? "stale";
  };
  const receive = async (value) => {
    if (disposed)
      return "stale";
    if (!isStreamedRendererFrame(value)) {
      const error = new StreamedReceiverError("protocol", process.env.NODE_ENV !== "production" ? "Malformed streamed renderer frame." : __octaneNoArgError(233));
      report(error);
      throw error;
    }
    const frame = value;
    const state = current(frame.identity);
    if (state === void 0 || state.failure !== void 0)
      return "stale";
    try {
      return frame.channel === "result" ? receiveResult(state, frame) : await receivePlacement(state, frame);
    } catch (error) {
      if (disposed || current(frame.identity) !== state)
        return "stale";
      const receiverError = error instanceof StreamedReceiverError ? error : new StreamedReceiverError("protocol", process.env.NODE_ENV !== "production" ? "Streamed renderer frame failed." : __octaneNoArgError(264));
      report(receiverError, state);
      throw receiverError;
    }
  };
  const receiver = {
    registerSelection,
    attachResult,
    receive,
    receiveJson(json) {
      return receive(decodeStreamedRendererFrame(json));
    },
    failSelection(identity, error) {
      if (disposed)
        return false;
      const state = current(identity);
      if (state === void 0 || state.failure !== void 0)
        return false;
      report(error, state);
      return true;
    },
    dispose() {
      if (disposed)
        return;
      disposed = true;
      for (const state of selections.values()) {
        try {
          report(new StreamedReceiverError("terminal", process.env.NODE_ENV !== "production" ? "Streamed receiver was disposed." : __octaneNoArgError(265)), state);
        } catch {
        } finally {
          state.historical?.release();
        }
      }
      selections.clear();
    }
  };
  return { receiver, current };
}
export {
  StreamedReceiverError,
  createStreamedResultReceiver,
  createStreamedResultReceiverState
};
