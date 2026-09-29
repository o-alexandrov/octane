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
var native_read_retry_exports = {};
__export(native_read_retry_exports, {
  createNativeReadRetry: () => createNativeReadRetry
});
module.exports = __toCommonJS(native_read_retry_exports);
var import_native_read_inspection = require("./native-read-inspection.cjs");
function createNativeReadRetry(notify) {
  const sources = /* @__PURE__ */ new Map();
  let generation = 0;
  return {
    /** Retry leases have no accepted read revision and expose no values. */
    inspect() {
      return Array.from(sources.keys(), (source) => (0, import_native_read_inspection.inspectNativeReadSource)(source, null));
    },
    get generation() {
      return generation;
    },
    track(witness) {
      let invalid = witness.mixed;
      for (const [source, version] of witness.reads) {
        if (!sources.has(source)) sources.set(source, source.subscribe(notify));
        if (source.getVersion() !== version) invalid = true;
      }
      if (invalid) notify();
    },
    clear() {
      generation++;
      for (const dispose of sources.values()) dispose();
      sources.clear();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNativeReadRetry
});
