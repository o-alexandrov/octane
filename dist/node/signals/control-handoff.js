const BINDING_HANDOFF = /* @__PURE__ */ Symbol.for("octane.binding-handoff");
const CONTROL_HANDOFF = /* @__PURE__ */ Symbol.for("octane.control-handoff");
const CONTROL_BINDINGS = /* @__PURE__ */ new WeakMap();
function hasSignalControlBinding(control, channel) {
  return CONTROL_BINDINGS.get(control)?.has(channel) ?? false;
}
export {
  BINDING_HANDOFF,
  CONTROL_BINDINGS,
  CONTROL_HANDOFF,
  hasSignalControlBinding
};
