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
var derived_facade_exports = {};
__export(derived_facade_exports, {
  __derivedAt: () => __derivedAt,
  derived$: () => derived$
});
module.exports = __toCommonJS(derived_facade_exports);
var import_computations = require("./computations.cjs");
var import_facade = require("./facade.cjs");
var import_owner_context = require("./owner-context.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function __derivedAt(site, compute, options) {
  if (typeof compute !== "function")
    throw new TypeError(__octaneDev ? "derived$ requires a function." : __octaneNoArgError(122));
  const explicit = (0, import_facade.signalOptionsKey)(options);
  site ??= explicit;
  const key = (0, import_facade.descriptorKey)(site, explicit);
  return new import_facade.DerivedDescriptor(key, "derived", (owner) => {
    const wrapped = compute.length ? (context) => (0, import_owner_context.runWithSignalOwner)(owner, () => compute(context)) : () => (0, import_owner_context.runWithSignalOwner)(owner, () => compute());
    return (0, import_computations.createDeclaredDerivedCell)(owner, key, wrapped, options);
  }, site);
}
function derived$(compute, options) {
  return __derivedAt(void 0, compute, options);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __derivedAt,
  derived$
});
