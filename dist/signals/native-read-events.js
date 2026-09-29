import { beginNativeBatch, endNativeBatch } from "./read-protocol.js";
let events = null;
function beginNativeEventBatch(event) {
  const existing = events?.get(event);
  if (existing !== void 0) {
    existing.depth++;
    return existing;
  }
  const hooks = beginNativeBatch();
  if (hooks === null) return null;
  const batch = { hooks, depth: 1, closed: false };
  (events ??= /* @__PURE__ */ new WeakMap()).set(event, batch);
  return batch;
}
function finish(event, batch) {
  if (batch.closed) return;
  batch.closed = true;
  if (events?.get(event) === batch) events.delete(event);
  const hooks = batch.hooks;
  batch.hooks = null;
  endNativeBatch(hooks);
}
function endNativeEventBatch(event, batch, waitsForBubble, onError) {
  if (batch === null || batch.closed || --batch.depth !== 0) return;
  if (!waitsForBubble) {
    finish(event, batch);
    return;
  }
  const fallback = () => {
    if (batch.depth !== 0 || batch.closed) return;
    try {
      finish(event, batch);
    } catch (error) {
      onError(error);
    }
  };
  const target = event.target;
  const checkableChange = event.type === "change" && target?.localName === "input" && (target.type === "checkbox" || target.type === "radio");
  if (checkableChange) setTimeout(fallback, 0);
  else queueMicrotask(fallback);
}
export {
  beginNativeEventBatch,
  endNativeEventBatch
};
