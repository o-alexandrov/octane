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
var host_property_diagnostics_exports = {};
__export(host_property_diagnostics_exports, {
  booleanAttributeStringWarning: () => booleanAttributeStringWarning,
  emptyResourceUrlWarning: () => emptyResourceUrlWarning,
  hostPropertyWarning: () => hostPropertyWarning,
  invalidHostPropertiesWarning: () => invalidHostPropertiesWarning,
  unsupportedAttributeCoercionWarning: () => unsupportedAttributeCoercionWarning
});
module.exports = __toCommonJS(host_property_diagnostics_exports);
var import_constants = require("./constants.cjs");
const KNOWN_CAMELCASE_PROPERTIES = /* @__PURE__ */ new Set([
  "autoCapitalize",
  "autoComplete",
  "autoCorrect",
  "autoFocus",
  "autoPlay",
  "allowFullScreen",
  "charSet",
  "className",
  "contentEditable",
  "dangerouslySetInnerHTML",
  "defaultChecked",
  "defaultValue",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "encType",
  "enterKeyHint",
  "fetchPriority",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "imageSizes",
  "imageSrcSet",
  "inputMode",
  "itemID",
  "itemProp",
  "itemRef",
  "itemScope",
  "itemType",
  "maxLength",
  "minLength",
  "noModule",
  "noValidate",
  "playsInline",
  "readOnly",
  "referrerPolicy",
  "spellCheck",
  "srcDoc",
  "srcLang",
  "srcSet",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "suppressNativeChangeWarning",
  "tabIndex",
  "viewBox"
]);
const KNOWN_PROPERTY_SPELLINGS = /* @__PURE__ */ new Map();
for (const name of KNOWN_CAMELCASE_PROPERTIES)
  KNOWN_PROPERTY_SPELLINGS.set(name.toLowerCase(), name);
for (const [name, alias] of import_constants.ATTRIBUTE_ALIASES) {
  KNOWN_PROPERTY_SPELLINGS.set(name.toLowerCase(), name);
  KNOWN_PROPERTY_SPELLINGS.set(alias.toLowerCase(), name);
}
const KNOWN_SVG_PROPERTY_SPELLINGS = /* @__PURE__ */ new Map();
for (const name of [
  "allowReorder",
  "attributeName",
  "attributeType",
  "autoReverse",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "contentScriptType",
  "contentStyleType",
  "diffuseConstant",
  "edgeMode",
  "externalResourcesRequired",
  "filterRes",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
]) {
  KNOWN_SVG_PROPERTY_SPELLINGS.set(name.toLowerCase(), name);
}
const NON_NATIVE_LOWERCASE_PROPERTIES = /* @__PURE__ */ new Set([
  "autoFocus",
  "defaultValue",
  "defaultChecked",
  "dangerouslySetInnerHTML",
  "className",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "suppressNativeChangeWarning",
  "__octaneNativeChangeDiagnostic",
  "acceptCharset",
  "htmlFor",
  "httpEquiv",
  "viewBox"
]);
function hostPropertyWarning(name, value, tag, isSvg = false) {
  const lower = name.toLowerCase();
  if (name === "for" && tag === "label") return null;
  if (lower === "innerhtml") {
    return "Directly setting property `innerHTML` is not permitted. Use `dangerouslySetInnerHTML={{ __html: value }}` instead.";
  }
  if (lower === "is" && value != null && typeof value !== "string") {
    return `Received a \`${typeof value}\` for a string attribute \`is\`. If this is expected, cast the value to a string.`;
  }
  if (name.length > 2 && name[0] === "o" && name[1] === "n" && typeof value === "string") {
    return `Unknown event handler property \`${name}\`. It will be ignored.`;
  }
  if (name.startsWith("aria-") || /^aria[A-Z]/.test(name) || name.startsWith("data-")) return null;
  const known = KNOWN_PROPERTY_SPELLINGS.get(lower) ?? (isSvg ? KNOWN_SVG_PROPERTY_SPELLINGS.get(lower) : void 0);
  if (known !== void 0) {
    if (!isSvg && name === lower && // Hyphenated/namespaced presentation aliases belong to SVG, not HTML.
    !name.includes("-") && !name.includes(":") && !NON_NATIVE_LOWERCASE_PROPERTIES.has(known) && (import_constants.ATTRIBUTE_ALIASES.get(known) ?? lower) === lower)
      return null;
    if (isSvg && import_constants.ATTRIBUTE_ALIASES.get(known) === name) return null;
    return name !== known ? `Invalid DOM property \`${name}\`. Did you mean \`${known}\`?` : null;
  }
  if (name !== lower && !name.includes(":")) {
    return `Octane does not recognize the \`${name}\` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase \`${lower}\` instead. If you accidentally passed it from a parent component, remove it from the DOM element.`;
  }
  return null;
}
function booleanAttributeStringWarning(name, value) {
  if (value !== "false" && value !== "true" || !import_constants.BOOLEAN_ATTR_PROPS.has(name.toLowerCase())) {
    return null;
  }
  return `Received the string \`${value}\` for the boolean attribute \`${name}\`. ` + (value === "false" ? "The browser will interpret it as a truthy value. " : 'Although this works, it will not work as expected if you pass the string "false". ') + `Did you mean ${name}={${value}}?`;
}
function invalidHostPropertiesWarning(names, tag) {
  const quoted = names.map((name) => `\`${name}\``).join(", ");
  return names.length === 1 ? `Invalid value for prop ${quoted} on <${tag}> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM.` : `Invalid values for props ${quoted} on <${tag}> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM.`;
}
function emptyResourceUrlWarning(name) {
  return `An empty string was passed to the \`${name}\` attribute. This may cause the browser to download the whole page again. Pass null instead of an empty string.`;
}
function unsupportedAttributeCoercionWarning(name, value) {
  const type = typeof value === "symbol" ? "Symbol" : value.constructor?.name || typeof value;
  return `The provided \`${name}\` attribute is an unsupported type ${type}. Coerce it to a string before passing it to a DOM element.`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  booleanAttributeStringWarning,
  emptyResourceUrlWarning,
  hostPropertyWarning,
  invalidHostPropertiesWarning,
  unsupportedAttributeCoercionWarning
});
