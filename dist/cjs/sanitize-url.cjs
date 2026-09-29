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
var sanitize_url_exports = {};
__export(sanitize_url_exports, {
  BLOCKED_JAVASCRIPT_URL: () => BLOCKED_JAVASCRIPT_URL,
  sanitizeURL: () => sanitizeURL,
  sanitizeURLAttribute: () => sanitizeURLAttribute,
  shouldSanitizeURLAttribute: () => shouldSanitizeURLAttribute
});
module.exports = __toCommonJS(sanitize_url_exports);
const IS_JAVASCRIPT_PROTOCOL = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
const BLOCKED_JAVASCRIPT_URL = "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')";
const RESERVED_HYPHENATED_NATIVE_TAGS = /* @__PURE__ */ new Set([
  "annotation-xml",
  "color-profile",
  "font-face",
  "font-face-src",
  "font-face-uri",
  "font-face-format",
  "font-face-name",
  "missing-glyph"
]);
function sanitizeURL(url) {
  const first = url.charCodeAt(0);
  if (first > 32 && first < 127 && first !== 74 && first !== 106) return url;
  return IS_JAVASCRIPT_PROTOCOL.test(url) ? BLOCKED_JAVASCRIPT_URL : url;
}
function shouldSanitizeURLAttribute(tag, name) {
  tag = tag === void 0 ? void 0 : tag.toLowerCase();
  if (tag !== void 0 && tag.includes("-") && !RESERVED_HYPHENATED_NATIVE_TAGS.has(tag)) {
    return false;
  }
  name = name.toLowerCase();
  return name === "src" || name === "href" || name === "action" || name === "formaction" || name === "xlink:href" || name === "xlinkhref" || name === "data" && tag === "object";
}
function sanitizeURLAttribute(tag, name, value) {
  return shouldSanitizeURLAttribute(tag, name) ? sanitizeURL(value) : value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BLOCKED_JAVASCRIPT_URL,
  sanitizeURL,
  sanitizeURLAttribute,
  shouldSanitizeURLAttribute
});
