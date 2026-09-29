import * as React from "react";
import { REACT_CONTEXT_TAG } from "../runtime-tags.js";
const OPAQUE_HOST_SENTINEL_COMMENT = "octane-compat-island";
const OPAQUE_HOST_SENTINEL = Object.freeze({
  __html: `<!--${OPAQUE_HOST_SENTINEL_COMMENT}-->`
});
function describeChildType(type) {
  if (typeof type === "string") return `the DOM element <${type}>`;
  if (type === React.Fragment) return "a Fragment";
  if (typeof type === "function")
    return `the component ${type.name || "(anonymous)"}`;
  return "an exotic React element";
}
function assertNotClassComponent(type) {
  if (process.env.NODE_ENV !== "production") {
    if (type.prototype?.isReactComponent) {
      throw new Error(
        `<OctaneCompat> cannot host ${describeChildType(type)}: class components are React-only; pass one compiled Octane component.`
      );
    }
  }
}
function validateIslandChild(children) {
  if (React.Children.count(children) !== 1) {
    throw new Error(
      `<OctaneCompat> expects exactly one Octane component element child; received ${React.Children.count(children)} children.`
    );
  }
  if (!React.isValidElement(children)) {
    throw new Error("<OctaneCompat> expects an Octane component element, not a plain renderable.");
  }
  const type = children.type;
  if (typeof type !== "function") {
    throw new Error(
      `<OctaneCompat> cannot host ${describeChildType(type)}; pass one compiled Octane component. (memo/forwardRef/lazy wrappers are React-only element types \u2014 use Octane memo()/lazy() inside the island instead.)`
    );
  }
  assertNotClassComponent(type);
  return {
    type,
    props: children.props ?? {},
    key: children.key ?? null
  };
}
const EMPTY_HOSTED_PROPS = Object.freeze({});
function resolveHostedIsland(props) {
  const component = props.component;
  if (component === void 0) {
    return validateIslandChild(props.children);
  }
  if (props.children !== void 0) {
    throw new Error(
      "<OctaneCompat> accepts either a `component` prop or one element child, not both."
    );
  }
  if (typeof component !== "function") {
    throw new Error(
      `<OctaneCompat> \`component\` must be a compiled Octane component function; received ${component === null ? "null" : typeof component}.`
    );
  }
  assertNotClassComponent(component);
  return {
    type: component,
    props: props.props ?? EMPTY_HOSTED_PROPS,
    key: null
  };
}
export {
  OPAQUE_HOST_SENTINEL,
  OPAQUE_HOST_SENTINEL_COMMENT,
  REACT_CONTEXT_TAG,
  resolveHostedIsland,
  validateIslandChild
};
