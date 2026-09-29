import { hasOwnProp } from "./has-own.js";
const OCTANE_COMPONENT_FLAGS = /* @__PURE__ */ Symbol.for("octane.flags.component");
const COMPONENT_FLAG_BOUNDARY = 1 << 0;
function markComponentFlags(component, flags, name, kind) {
  Object.defineProperty(component, OCTANE_COMPONENT_FLAGS, { value: flags });
  Object.defineProperty(component, "name", { value: name, configurable: true });
  if (kind !== void 0) {
    Object.defineProperty(component, kind, {
      get() {
        return this === component;
      }
    });
  }
  return component;
}
function hasComponentFlags(component, flags) {
  return typeof component === "function" && hasOwnProp.call(component, OCTANE_COMPONENT_FLAGS) && (component[OCTANE_COMPONENT_FLAGS] & flags) === flags;
}
export {
  COMPONENT_FLAG_BOUNDARY,
  hasComponentFlags,
  markComponentFlags
};
