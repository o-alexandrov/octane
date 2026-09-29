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
var hydration_markers_exports = {};
__export(hydration_markers_exports, {
  HYDRATE_IDLE_TIMEOUT_ATTR: () => HYDRATE_IDLE_TIMEOUT_ATTR,
  HYDRATE_ID_ATTR: () => HYDRATE_ID_ATTR,
  HYDRATE_ID_COUNT_ATTR: () => HYDRATE_ID_COUNT_ATTR,
  HYDRATE_INDEPENDENT_ATTR: () => HYDRATE_INDEPENDENT_ATTR,
  HYDRATE_INPUT_ATTR: () => HYDRATE_INPUT_ATTR,
  HYDRATE_MARKER_SELECTOR: () => HYDRATE_MARKER_SELECTOR,
  HYDRATE_MEDIA_ATTR: () => HYDRATE_MEDIA_ATTR,
  HYDRATE_SEED_ATTR: () => HYDRATE_SEED_ATTR,
  HYDRATE_VISIBLE_MARGIN_ATTR: () => HYDRATE_VISIBLE_MARGIN_ATTR,
  HYDRATE_VISIBLE_THRESHOLD_ATTR: () => HYDRATE_VISIBLE_THRESHOLD_ATTR,
  HYDRATE_WHEN_ATTR: () => HYDRATE_WHEN_ATTR,
  HYDRATION_END: () => HYDRATION_END,
  HYDRATION_FOR_ARM_INDEX: () => HYDRATION_FOR_ARM_INDEX,
  HYDRATION_FOR_EMPTY: () => HYDRATION_FOR_EMPTY,
  HYDRATION_FOR_ITEMS: () => HYDRATION_FOR_ITEMS,
  HYDRATION_FOR_PREFIX: () => HYDRATION_FOR_PREFIX,
  HYDRATION_START: () => HYDRATION_START,
  INDEPENDENT_HYDRATE_MANIFEST_ATTR: () => INDEPENDENT_HYDRATE_MANIFEST_ATTR,
  SIGNAL_CONTROL_ATTR: () => SIGNAL_CONTROL_ATTR,
  formatUseId: () => formatUseId
});
module.exports = __toCommonJS(hydration_markers_exports);
const INDEPENDENT_HYDRATE_MANIFEST_ATTR = "data-octane-independent";
const HYDRATE_INDEPENDENT_ATTR = "data-octane-hydrate-independent";
const HYDRATE_INPUT_ATTR = "data-octane-input";
const SIGNAL_CONTROL_ATTR = "data-octane-signal-control";
const HYDRATE_ID_ATTR = "data-octane-hydrate-id";
const HYDRATE_WHEN_ATTR = "data-octane-hydrate-when";
const HYDRATE_IDLE_TIMEOUT_ATTR = "data-octane-hydrate-timeout";
const HYDRATE_VISIBLE_MARGIN_ATTR = "data-octane-hydrate-root-margin";
const HYDRATE_VISIBLE_THRESHOLD_ATTR = "data-octane-hydrate-threshold";
const HYDRATE_MEDIA_ATTR = "data-octane-hydrate-media";
const HYDRATE_ID_COUNT_ATTR = "data-octane-hydrate-id-count";
const HYDRATE_SEED_ATTR = "data-octane-hydrate-seed";
const HYDRATE_MARKER_SELECTOR = "[data-octane-hydrate-id]";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const HYDRATION_FOR_PREFIX = "[f";
const HYDRATION_FOR_EMPTY = "[f0";
const HYDRATION_FOR_ITEMS = "[f1";
const HYDRATION_FOR_ARM_INDEX = HYDRATION_FOR_PREFIX.length;
function formatUseId(prefix, ordinal) {
  return ":" + prefix + "in-" + ordinal.toString(36) + ":";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HYDRATE_IDLE_TIMEOUT_ATTR,
  HYDRATE_ID_ATTR,
  HYDRATE_ID_COUNT_ATTR,
  HYDRATE_INDEPENDENT_ATTR,
  HYDRATE_INPUT_ATTR,
  HYDRATE_MARKER_SELECTOR,
  HYDRATE_MEDIA_ATTR,
  HYDRATE_SEED_ATTR,
  HYDRATE_VISIBLE_MARGIN_ATTR,
  HYDRATE_VISIBLE_THRESHOLD_ATTR,
  HYDRATE_WHEN_ATTR,
  HYDRATION_END,
  HYDRATION_FOR_ARM_INDEX,
  HYDRATION_FOR_EMPTY,
  HYDRATION_FOR_ITEMS,
  HYDRATION_FOR_PREFIX,
  HYDRATION_START,
  INDEPENDENT_HYDRATE_MANIFEST_ATTR,
  SIGNAL_CONTROL_ATTR,
  formatUseId
});
