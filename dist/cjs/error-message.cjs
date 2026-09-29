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
var error_message_exports = {};
__export(error_message_exports, {
  formatDevErrorMessage: () => formatDevErrorMessage,
  formatProdErrorMessage: () => formatProdErrorMessage,
  formatUnknownDevErrorMessage: () => formatUnknownDevErrorMessage
});
module.exports = __toCommonJS(error_message_exports);
const ERROR_DOCS_URL = "https://octanejs.dev/errors/";
const UNPAIRED_SURROGATE = /[\uD800-\uDFFF]/gu;
function encodeErrorArgument(value) {
  return encodeURIComponent(String(value).replace(UNPAIRED_SURROGATE, "\uFFFD"));
}
function formatProdErrorMessage(code, args) {
  let url = ERROR_DOCS_URL + code;
  for (let i = 0; i < args.length; i++) {
    url += `${i === 0 ? "?" : "&"}args[]=${encodeErrorArgument(args[i])}`;
  }
  return `Minified Octane error #${code}; visit ${url} for the full message or use a development build for full errors and additional helpful warnings.`;
}
function formatDevErrorMessage(template, args) {
  let index = 0;
  return template.replace(
    /%s/g,
    () => index < args.length ? String(args[index++]) : "[missing argument]"
  );
}
function formatUnknownDevErrorMessage(code) {
  return `Unknown Octane error code ${code}. The generated error catalog is stale.`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatDevErrorMessage,
  formatProdErrorMessage,
  formatUnknownDevErrorMessage
});
