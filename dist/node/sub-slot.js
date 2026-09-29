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
export {
  createSubSlot,
  subSlot
};
