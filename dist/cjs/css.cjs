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
var css_exports = {};
__export(css_exports, {
  VIEW_TRANSITION_SCOPE_CSS: () => VIEW_TRANSITION_SCOPE_CSS,
  VIEW_TRANSITION_SCOPE_STYLE_ID: () => VIEW_TRANSITION_SCOPE_STYLE_ID,
  devWarnStyleCoercion: () => devWarnStyleCoercion,
  devWarnStyleProperty: () => devWarnStyleProperty,
  mergeClass: () => mergeClass,
  normalizeClass: () => import_class_names.normalizeClass,
  styleName: () => styleName
});
module.exports = __toCommonJS(css_exports);
var import_class_names = require("./class-names.cjs");
var import_style_values = require("./style-values.cjs");
function mergeClass(left, right) {
  const a = (0, import_class_names.normalizeClass)(left);
  const b = (0, import_class_names.normalizeClass)(right);
  if (!a) return b;
  if (!b) return a;
  return a + " " + b;
}
const styleNameCache = /* @__PURE__ */ new Map();
function styleName(name) {
  const cached = styleNameCache.get(name);
  if (cached !== void 0) return cached;
  const result = (0, import_style_values.hyphenateStyleName)(name);
  styleNameCache.set(name, result);
  return result;
}
let warnedStyleNames = null;
let warnedStyleValues = null;
let warnedStyleNaN = 0;
let warnedStyleInfinity = 0;
function devWarnStyleProperty(name, value, server) {
  const type = typeof value;
  if (name.charCodeAt(0) === 45 && name.charCodeAt(1) === 45) return;
  let prefixLength = 0;
  if (name.startsWith("webkit")) prefixLength = 6;
  else if (name.startsWith("moz")) prefixLength = 3;
  else if (name.charCodeAt(0) === 111) prefixLength = 1;
  const following = name.charCodeAt(prefixLength);
  if (prefixLength !== 0 && following >= 65 && following <= 90) {
    const key = (server ? "s:" : "c:") + name;
    const warned = warnedStyleNames ??= /* @__PURE__ */ new Set();
    if (!warned.has(key)) {
      warned.add(key);
      console.error(
        `Unsupported vendor-prefixed style property ${name}. Did you mean ${name.charAt(0).toUpperCase()}${name.slice(1)}?`
      );
    }
  } else if (type === "string") {
    const text = value;
    if (text.trimEnd().endsWith(";")) {
      const key = (server ? "s:" : "c:") + text;
      const warned = warnedStyleValues ??= /* @__PURE__ */ new Set();
      if (!warned.has(key)) {
        warned.add(key);
        console.error(
          `Style property values shouldn't contain a semicolon. Try "${name}: ${text.slice(0, text.lastIndexOf(";"))}" instead.`
        );
      }
    }
  }
  if (type !== "number") return;
  const surface = server ? 2 : 1;
  if (Number.isNaN(value)) {
    if ((warnedStyleNaN & surface) !== 0) return;
    warnedStyleNaN |= surface;
    console.error(`\`NaN\` is an invalid value for the \`${name}\` css style property.`);
  } else if (!Number.isFinite(value)) {
    if ((warnedStyleInfinity & surface) !== 0) return;
    warnedStyleInfinity |= surface;
    console.error(`\`Infinity\` is an invalid value for the \`${name}\` css style property.`);
  }
}
function devWarnStyleCoercion(name, value) {
  const valueType = typeof value === "symbol" ? "Symbol" : value.constructor?.name || "Object";
  console.error(
    `The provided \`${name}\` CSS property is an unsupported type ${valueType}. This value must be coerced to a string before using it here.`
  );
}
const VIEW_TRANSITION_SCOPE_STYLE_ID = "octane-view-transition-scope";
const VIEW_TRANSITION_SCOPE_CSS = '[vt-scope="element"]{view-transition-scope:all!important}';
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VIEW_TRANSITION_SCOPE_CSS,
  VIEW_TRANSITION_SCOPE_STYLE_ID,
  devWarnStyleCoercion,
  devWarnStyleProperty,
  mergeClass,
  normalizeClass,
  styleName
});
