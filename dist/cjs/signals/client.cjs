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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var client_exports = {};
__export(client_exports, {
  useSignal$: () => useSignal$
});
module.exports = __toCommonJS(client_exports);
__reExport(client_exports, require("./index.cjs"), module.exports);
var import_runtime = require("../runtime.cjs");
var import_engine = require("./engine.cjs");
function disposeLocalSignal(cell) {
  cell.scope.dispose();
}
function useSignal$(initial, slot) {
  const cell = (0, import_runtime.nativeLocalHook)(
    "useSignal$",
    () => {
      const value = typeof initial === "function" ? initial() : initial;
      const scope = (0, import_engine.createLocalScope)("octane/useSignal$");
      return { scope, signal$: scope.signal$("value", value) };
    },
    disposeLocalSignal,
    slot
  );
  return cell.signal$;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSignal$,
  ...require("./index.cjs")
});
