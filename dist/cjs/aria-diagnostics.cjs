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
var aria_diagnostics_exports = {};
__export(aria_diagnostics_exports, {
  ariaAttributeWarning: () => ariaAttributeWarning,
  isAriaAttributeName: () => isAriaAttributeName,
  isUnknownAriaAttribute: () => isUnknownAriaAttribute,
  unknownAriaAttributeWarning: () => unknownAriaAttributeWarning
});
module.exports = __toCommonJS(aria_diagnostics_exports);
const VALID_ARIA_ATTRIBUTES = /* @__PURE__ */ new Set([
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext"
]);
function isAriaAttributeName(name) {
  if (name === "aria") return true;
  if (name.length < 5 || name.slice(0, 4) !== "aria") return false;
  const next = name.charCodeAt(4);
  return next === 45 || next >= 65 && next <= 90;
}
function isUnknownAriaAttribute(name) {
  return name.startsWith("aria-") && !VALID_ARIA_ATTRIBUTES.has(name.toLowerCase());
}
function ariaAttributeWarning(name, tag) {
  if (name === "aria") {
    return "The `aria` attribute is reserved for future use. Pass individual `aria-*` attributes instead.";
  }
  if (name.length < 5 || name.slice(0, 4) !== "aria") return null;
  if (name.charCodeAt(4) === 45) {
    const lowercase = name.toLowerCase();
    if (VALID_ARIA_ATTRIBUTES.has(lowercase)) {
      return name === lowercase ? null : `Unknown ARIA attribute \`${name}\`. Did you mean \`${lowercase}\`?`;
    }
    return `Invalid aria prop \`${name}\` on <${tag}> tag. ARIA attributes must use valid, lowercase aria-* names.`;
  }
  const next = name.charCodeAt(4);
  if (next < 65 || next > 90) return null;
  const correctName = "aria-" + name.slice(4).toLowerCase();
  return VALID_ARIA_ATTRIBUTES.has(correctName) ? `Invalid ARIA attribute \`${name}\`. Did you mean \`${correctName}\`?` : `Invalid ARIA attribute \`${name}\`. ARIA attributes follow the pattern aria-* and must be lowercase.`;
}
function unknownAriaAttributeWarning(names, tag) {
  const noun = names.length === 1 ? "prop" : "props";
  const quoted = names.map((name) => `\`${name}\``).join(", ");
  return `Invalid aria ${noun} ${quoted} on <${tag}> tag. ARIA attributes must use valid, lowercase aria-* names.`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ariaAttributeWarning,
  isAriaAttributeName,
  isUnknownAriaAttribute,
  unknownAriaAttributeWarning
});
