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
export {
  cssStyleValue,
  hyphenateStyleName,
  isUnitlessStyleProp
};
