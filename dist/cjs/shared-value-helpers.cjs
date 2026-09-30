"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var shared_value_helpers_exports = {};
__export(shared_value_helpers_exports, {
  applyElementDefaultProps: () => applyElementDefaultProps,
  childElementKey: () => childElementKey,
  childrenIterator: () => childrenIterator,
  describeTextareaChild: () => describeTextareaChild,
  escapeMappedElementKey: () => escapeMappedElementKey,
  resolveLazyDefaultProps: () => resolveLazyDefaultProps,
  textareaChildText: () => textareaChildText
});
module.exports = __toCommonJS(shared_value_helpers_exports);
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
function textareaChildText(value, reject) {
  if (value == null || typeof value === "boolean") return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint") return "" + value;
  let items;
  if (Array.isArray(value)) items = value;
  else {
    const iterator = childrenIterator(value);
    if (iterator === null) return reject(value);
    items = { [Symbol.iterator]: () => iterator.call(value) };
  }
  let text = "";
  for (const item of items) text += textareaChildText(item, reject);
  return text;
}
function describeTextareaChild(value, isElement) {
  return isElement(value) ? "an element" : typeof value === "object" ? "an object" : "a " + typeof value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyElementDefaultProps,
  childElementKey,
  childrenIterator,
  describeTextareaChild,
  escapeMappedElementKey,
  resolveLazyDefaultProps,
  textareaChildText
});
