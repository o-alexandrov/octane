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
var style_values_exports = {};
__export(style_values_exports, {
  cssStyleValue: () => cssStyleValue,
  hyphenateStyleName: () => hyphenateStyleName,
  isUnitlessStyleProp: () => isUnitlessStyleProp
});
module.exports = __toCommonJS(style_values_exports);
const UNITLESS_STYLE_PROPS = /* @__PURE__ */ new Set();
for (const base of [
  "animationIterationCount",
  "aspectRatio",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridArea",
  "gridRow",
  "gridRowEnd",
  "gridRowSpan",
  "gridRowStart",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnSpan",
  "gridColumnStart",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth"
]) {
  const c = base.toLowerCase();
  UNITLESS_STYLE_PROPS.add(c);
  UNITLESS_STYLE_PROPS.add("webkit" + c);
  UNITLESS_STYLE_PROPS.add("ms" + c);
  UNITLESS_STYLE_PROPS.add("moz" + c);
  UNITLESS_STYLE_PROPS.add("o" + c);
}
const unitlessStylePropCache = /* @__PURE__ */ new Map();
function isUnitlessStyleProp(name) {
  const cached = unitlessStylePropCache.get(name);
  if (cached !== void 0) return cached;
  const result = UNITLESS_STYLE_PROPS.has(name.replaceAll("-", "").toLowerCase());
  unitlessStylePropCache.set(name, result);
  return result;
}
function cssStyleValue(name, value) {
  if (typeof value === "number" && value !== 0 && name.charCodeAt(0) !== 45 && !isUnitlessStyleProp(name)) {
    return value + "px";
  }
  return typeof value === "string" ? value.trim() : "" + value;
}
function hyphenateStyleName(name) {
  if (name === "cssFloat") return "float";
  if (name.charCodeAt(0) === 45) return name;
  let hasUpper = false;
  for (let i = 0; i < name.length; i++) {
    const c = name.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      hasUpper = true;
      break;
    }
  }
  if (!hasUpper) return name;
  let out = "";
  for (let i = 0; i < name.length; i++) {
    const c = name.charCodeAt(i);
    if (c >= 65 && c <= 90) out += "-" + String.fromCharCode(c + 32);
    else out += name[i];
  }
  if (out.charCodeAt(0) === 109 && out.charCodeAt(1) === 115 && out.charCodeAt(2) === 45) {
    out = "-" + out;
  }
  return out;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cssStyleValue,
  hyphenateStyleName,
  isUnitlessStyleProp
});
