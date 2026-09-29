import * as React from "react";
import {
  CONTEXT_TAG as OCTANE_CONTEXT_TAG,
  ELEMENT_TAG as OCTANE_ELEMENT_TAG,
  REACT_CONTEXT_TAG
} from "../runtime-tags.js";
const REACT_MEMO_TAG = /* @__PURE__ */ Symbol.for("react.memo");
const REACT_LAZY_TAG = /* @__PURE__ */ Symbol.for("react.lazy");
const REACT_FORWARD_REF_TAG = /* @__PURE__ */ Symbol.for("react.forward_ref");
const EMPTY_PROPS = Object.freeze({});
const EMPTY_CONTEXTS = Object.freeze([]);
function validateContextBridge(source, target) {
  if (typeof source !== "function" || source.$$kind !== OCTANE_CONTEXT_TAG || !("defaultValue" in source)) {
    throw new TypeError("bridgeReactContext() requires a native Octane source context.");
  }
  if (target === null || typeof target !== "object" || target.$$typeof !== REACT_CONTEXT_TAG) {
    throw new TypeError("bridgeReactContext() requires a real React target context.");
  }
}
function bridgeReactContext(source, target) {
  validateContextBridge(source, target);
  return Object.freeze({ source, target });
}
function validateReactContextBridges(contexts) {
  if (contexts === void 0) return EMPTY_CONTEXTS;
  if (!Array.isArray(contexts)) {
    throw new TypeError("<ReactCompat> `contexts` must be an array of context mappings.");
  }
  const targets = contexts.length > 1 ? /* @__PURE__ */ new Set() : null;
  for (const mapping of contexts) {
    if (mapping === null || typeof mapping !== "object") {
      throw new TypeError("<ReactCompat> `contexts` must contain context mappings.");
    }
    const { source, target } = mapping;
    validateContextBridge(source, target);
    if (targets !== null) {
      if (targets.has(target)) {
        throw new TypeError("<ReactCompat> cannot map the same React context more than once.");
      }
      targets.add(target);
    }
  }
  return contexts;
}
function validateComponent(type) {
  if (typeof type === "function") return;
  if (type !== null && typeof type === "object") {
    const tag = type.$$typeof;
    if (tag === REACT_MEMO_TAG || tag === REACT_LAZY_TAG || tag === REACT_FORWARD_REF_TAG) return;
  }
  throw new TypeError(
    "<ReactCompat> expects one React function, class, memo, lazy, or forwardRef component; DOM elements, fragments, and multiple children cannot be the island root."
  );
}
function snapshotProps(props) {
  if (props == null) return EMPTY_PROPS;
  if (typeof props !== "object" || Array.isArray(props)) {
    throw new TypeError("<ReactCompat> island props must be an object.");
  }
  return { ...props };
}
function resolveReactIsland(props) {
  const component = props.component;
  if (component !== void 0) {
    if (props.children !== void 0) {
      throw new TypeError(
        "<ReactCompat> accepts either a `component` prop or one element child, not both."
      );
    }
    validateComponent(component);
    return { type: component, props: snapshotProps(props.props), key: null };
  }
  if (props.props !== void 0) {
    throw new TypeError("<ReactCompat> the `props` prop requires a `component` prop.");
  }
  const child = props.children;
  if (child === null || typeof child !== "object" || child.$$kind !== OCTANE_ELEMENT_TAG) {
    throw new TypeError(
      "<ReactCompat> expects exactly one React component element authored in an Octane template."
    );
  }
  const descriptor = child;
  const type = descriptor.type;
  const childProps = descriptor.props;
  const key = descriptor.key;
  validateComponent(type);
  return {
    type,
    props: snapshotProps(childProps),
    key: key == null ? null : "" + key
  };
}
function createReactIslandElement(child) {
  return React.createElement(
    child.type,
    child.key === null ? child.props : { ...child.props, key: child.key }
  );
}
export {
  bridgeReactContext,
  createReactIslandElement,
  resolveReactIsland,
  validateReactContextBridges
};
