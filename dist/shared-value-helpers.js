function applyElementDefaultProps(type, props) {
  const defaults = type?.defaultProps;
  if (defaults == null) return;
  for (const name in defaults) {
    if (props[name] === void 0) props[name] = defaults[name];
  }
}
function resolveLazyDefaultProps(component, props) {
  const defaults = component.defaultProps;
  if (defaults == null || typeof defaults !== "object") return props;
  let resolved = props;
  for (const key of Object.keys(defaults)) {
    if (props == null || props[key] === void 0) {
      if (resolved === props) resolved = props == null ? {} : { ...props };
      resolved[key] = defaults[key];
    }
  }
  return resolved;
}
function escapeElementKey(key) {
  return "$" + key.replace(/[=:]/g, (match) => match === "=" ? "=0" : "=2");
}
function escapeMappedElementKey(key) {
  return key.replace(/\/+/g, "$&/");
}
function childElementKey(child, index) {
  return child != null && typeof child === "object" && child.key != null ? escapeElementKey("" + child.key) : index.toString(36);
}
function childrenIterator(children) {
  if (children == null || typeof children !== "object") return null;
  const iterator = typeof Symbol === "function" && children[Symbol.iterator] || children["@@iterator"];
  return typeof iterator === "function" ? iterator : null;
}
export {
  applyElementDefaultProps,
  childElementKey,
  childrenIterator,
  escapeMappedElementKey,
  resolveLazyDefaultProps
};
