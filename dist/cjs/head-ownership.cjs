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
var head_ownership_exports = {};
__export(head_ownership_exports, {
  headOwnershipKey: () => headOwnershipKey,
  headOwnershipSuffix: () => headOwnershipSuffix
});
module.exports = __toCommonJS(head_ownership_exports);
function headOwnershipSuffix(identifierPrefix) {
  if (identifierPrefix === "") return "";
  let left = 2166136261;
  let right = 2654435769;
  for (let i = 0; i < identifierPrefix.length; i++) {
    const code = identifierPrefix.charCodeAt(i);
    left = Math.imul(left ^ code, 16777619);
    right = Math.imul(right ^ code, 2246822507);
    right = right << 13 | right >>> 19;
  }
  left ^= left >>> 16;
  left = Math.imul(left, 2246822507);
  left ^= left >>> 13;
  left = Math.imul(left, 3266489909);
  left ^= left >>> 16;
  right ^= identifierPrefix.length;
  right ^= right >>> 16;
  right = Math.imul(right, 2246822507);
  right ^= right >>> 13;
  right = Math.imul(right, 3266489909);
  right ^= right >>> 16;
  return "-" + (left >>> 0).toString(16).padStart(8, "0") + (right >>> 0).toString(16).padStart(8, "0");
}
function headOwnershipKey(key, identifierPrefix) {
  const suffix = headOwnershipSuffix(identifierPrefix);
  return suffix === "" ? key : key + suffix;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  headOwnershipKey,
  headOwnershipSuffix
});
