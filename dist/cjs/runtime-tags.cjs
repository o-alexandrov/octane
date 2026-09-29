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
var runtime_tags_exports = {};
__export(runtime_tags_exports, {
  ACTIVITY_TAG: () => ACTIVITY_TAG,
  CHILDREN_BLOCK_TAG: () => CHILDREN_BLOCK_TAG,
  CONTEXT_TAG: () => CONTEXT_TAG,
  ELEMENT_TAG: () => ELEMENT_TAG,
  FRAGMENT_TAG: () => FRAGMENT_TAG,
  LAZY_COMPONENT_TAG: () => LAZY_COMPONENT_TAG,
  PORTAL_TAG: () => PORTAL_TAG,
  REACT_CONTEXT_TAG: () => REACT_CONTEXT_TAG,
  RENDERER_REGION_OWNER_TAG: () => RENDERER_REGION_OWNER_TAG,
  SUSPENSE_TAG: () => SUSPENSE_TAG
});
module.exports = __toCommonJS(runtime_tags_exports);
const ELEMENT_TAG = /* @__PURE__ */ Symbol.for("octane.element");
const PORTAL_TAG = /* @__PURE__ */ Symbol.for("octane.portal");
const FRAGMENT_TAG = /* @__PURE__ */ Symbol.for("octane.Fragment");
const ACTIVITY_TAG = /* @__PURE__ */ Symbol.for("octane.Activity");
const CONTEXT_TAG = /* @__PURE__ */ Symbol.for("octane.context");
const LAZY_COMPONENT_TAG = /* @__PURE__ */ Symbol.for("octane.lazy");
const SUSPENSE_TAG = /* @__PURE__ */ Symbol.for("octane.suspense");
const CHILDREN_BLOCK_TAG = /* @__PURE__ */ Symbol.for("octane.childrenBlock");
const RENDERER_REGION_OWNER_TAG = /* @__PURE__ */ Symbol.for("octane.renderer-region.owner");
const REACT_CONTEXT_TAG = /* @__PURE__ */ Symbol.for("react.context");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ACTIVITY_TAG,
  CHILDREN_BLOCK_TAG,
  CONTEXT_TAG,
  ELEMENT_TAG,
  FRAGMENT_TAG,
  LAZY_COMPONENT_TAG,
  PORTAL_TAG,
  REACT_CONTEXT_TAG,
  RENDERER_REGION_OWNER_TAG,
  SUSPENSE_TAG
});
