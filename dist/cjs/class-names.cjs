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
var class_names_exports = {};
__export(class_names_exports, {
  normalizeClass: () => normalizeClass
});
module.exports = __toCommonJS(class_names_exports);
function normalizeClass(value) {
  if (typeof value === "string") return value;
  if (typeof value !== "object") {
    return typeof value === "number" && value ? "" + value : "";
  }
  if (value === null) return "";
  let str = "";
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (item) {
        const inner = normalizeClass(item);
        if (inner) str = str ? str + " " + inner : inner;
      }
    }
  } else {
    for (const k in value) {
      if (value[k]) str = str ? str + " " + k : k;
    }
  }
  return str;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  normalizeClass
});
