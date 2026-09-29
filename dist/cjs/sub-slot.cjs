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
var sub_slot_exports = {};
__export(sub_slot_exports, {
  createSubSlot: () => createSubSlot,
  subSlot: () => subSlot
});
module.exports = __toCommonJS(sub_slot_exports);
function createSubSlot(options = {}) {
  const childSlots = /* @__PURE__ */ new Map();
  const slotlessSlots = options.slotlessPrefix === void 0 ? null : /* @__PURE__ */ new Map();
  const parentPrefix = options.parentPrefix ?? "";
  const tagPrefix = options.tagPrefix ?? ":";
  const parentDescriptionFallback = options.parentDescriptionFallback ?? "";
  const includeParentDescription = options.includeParentDescription !== false;
  const makeSymbol = options.global === false ? Symbol : Symbol.for;
  const makeSlotlessSymbol = options.slotlessGlobal === false || options.slotlessGlobal === void 0 && options.global === false ? Symbol : Symbol.for;
  return (slot, tag) => {
    if (slot === void 0) {
      if (slotlessSlots === null) return void 0;
      let child2 = slotlessSlots.get(tag);
      if (child2 === void 0) {
        child2 = makeSlotlessSymbol(options.slotlessPrefix + tag);
        slotlessSlots.set(tag, child2);
      }
      return child2;
    }
    let byTag = childSlots.get(slot);
    if (byTag === void 0) childSlots.set(slot, byTag = /* @__PURE__ */ new Map());
    let child = byTag.get(tag);
    if (child === void 0) {
      const parentDescription = includeParentDescription ? slot.description ?? parentDescriptionFallback : "";
      child = makeSymbol(parentPrefix + parentDescription + tagPrefix + tag);
      byTag.set(tag, child);
    }
    return child;
  };
}
const subSlot = createSubSlot();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSubSlot,
  subSlot
});
