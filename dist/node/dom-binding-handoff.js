const __octaneDev = process.env.NODE_ENV !== "production";
import { BINDING_HANDOFF } from "./signals/control-handoff.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const events = /* @__PURE__ */ new WeakMap();
const delivered = /* @__PURE__ */ new WeakMap();
function registerBindingEvent(node, type) {
  let counts = events.get(node);
  if (counts === void 0)
    events.set(node, counts = /* @__PURE__ */ new Map());
  counts.set(type, (counts.get(type) ?? 0) + 1);
  return () => {
    const count = counts.get(type) - 1;
    if (count === 0)
      counts.delete(type);
    else
      counts.set(type, count);
    if (counts.size === 0)
      events.delete(node);
  };
}
function claimBindingHandoff(lease, owner) {
  if (!lease.active() || lease.owner !== void 0)
    throw new Error(__octaneDev ? "A DOM binding hydration lease must be active and have only one root owner." : __octaneNoArgError(277));
  lease.owner = owner;
}
function releaseBindingHandoff(lease) {
  lease.owner = void 0;
}
function hasBindingHandoffEvent(event) {
  for (const node of event.composedPath()) {
    if (events.get(node)?.has(event.type))
      return true;
  }
  return false;
}
function markBindingEvent(event, node, capture) {
  let nodes = delivered.get(event);
  if (nodes === void 0) {
    delivered.set(event, nodes = /* @__PURE__ */ new Map());
    const cleanup = () => {
      if (delivered.get(event) === nodes)
        delivered.delete(event);
    };
    if (event.isTrusted)
      setTimeout(cleanup, 0);
    else
      queueMicrotask(cleanup);
  }
  nodes.set(node, (nodes.get(node) ?? 0) | (capture ? 2 : 1));
}
function consumeBindingEvent(event, node, capture) {
  const nodes = delivered.get(event);
  const flags = nodes?.get(node) ?? 0;
  const bit = capture ? 2 : 1;
  if ((flags & bit) === 0)
    return false;
  if ((flags & ~bit) === 0)
    nodes.delete(node);
  else
    nodes.set(node, flags & ~bit);
  return true;
}
function beginBindingEvent(event) {
  delivered.delete(event);
}
export {
  BINDING_HANDOFF,
  beginBindingEvent,
  claimBindingHandoff,
  consumeBindingEvent,
  hasBindingHandoffEvent,
  markBindingEvent,
  registerBindingEvent,
  releaseBindingHandoff
};
