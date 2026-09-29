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
var constants_exports = {};
__export(constants_exports, {
  ATTRIBUTE_ALIASES: () => ATTRIBUTE_ALIASES,
  BLOCK_CLOSE: () => BLOCK_CLOSE,
  BLOCK_OPEN: () => BLOCK_OPEN,
  BOOLEAN_ATTR_PROPS: () => BOOLEAN_ATTR_PROPS,
  EMPTY_COMMENT: () => EMPTY_COMMENT,
  EXTERNAL_HYDRATION_PROMISE: () => EXTERNAL_HYDRATION_PROMISE,
  FOR_BLOCK_OPEN_EMPTY: () => FOR_BLOCK_OPEN_EMPTY,
  FOR_BLOCK_OPEN_ITEMS: () => FOR_BLOCK_OPEN_ITEMS,
  HYDRATE_ID_ATTR: () => import_hydration_markers2.HYDRATE_ID_ATTR,
  HYDRATE_ID_COUNT_ATTR: () => import_hydration_markers2.HYDRATE_ID_COUNT_ATTR,
  HYDRATE_INDEPENDENT_ATTR: () => import_hydration_markers2.HYDRATE_INDEPENDENT_ATTR,
  HYDRATE_INPUT_ATTR: () => import_hydration_markers2.HYDRATE_INPUT_ATTR,
  HYDRATE_SEED_ATTR: () => import_hydration_markers2.HYDRATE_SEED_ATTR,
  HYDRATE_STATIC_END: () => HYDRATE_STATIC_END,
  HYDRATE_STATIC_ID_COUNT_PREFIX: () => HYDRATE_STATIC_ID_COUNT_PREFIX,
  HYDRATE_STREAM_TOKEN_ATTR: () => import_stream_protocol2.HYDRATE_STREAM_TOKEN_ATTR,
  HYDRATE_WHEN_ATTR: () => import_hydration_markers2.HYDRATE_WHEN_ATTR,
  HYDRATION_END: () => import_hydration_markers.HYDRATION_END,
  HYDRATION_FOR_EMPTY: () => import_hydration_markers.HYDRATION_FOR_EMPTY,
  HYDRATION_FOR_ITEMS: () => import_hydration_markers.HYDRATION_FOR_ITEMS,
  HYDRATION_RANGE_BOUNDARY: () => HYDRATION_RANGE_BOUNDARY,
  HYDRATION_START: () => import_hydration_markers.HYDRATION_START,
  HYDRATION_TEXT_SEP: () => HYDRATION_TEXT_SEP,
  INDEPENDENT_HYDRATE_MANIFEST_ATTR: () => import_hydration_markers2.INDEPENDENT_HYDRATE_MANIFEST_ATTR,
  MUST_USE_PROPERTY_PROPS: () => MUST_USE_PROPERTY_PROPS,
  POSITIVE_NUMERIC_ATTR_PROPS: () => POSITIVE_NUMERIC_ATTR_PROPS,
  REJECTION_SENTINEL_KEY: () => REJECTION_SENTINEL_KEY,
  SIGNAL_CONTROL_ATTR: () => import_hydration_markers2.SIGNAL_CONTROL_ATTR,
  STREAM_BOUNDARY_ATTR: () => import_stream_protocol3.STREAM_BOUNDARY_ATTR,
  STREAM_RESOURCE_ATTR: () => STREAM_RESOURCE_ATTR,
  STREAM_SCRIPT_ATTR: () => import_stream_protocol4.STREAM_SCRIPT_ATTR,
  STREAM_SEED_ATTR: () => STREAM_SEED_ATTR,
  STREAM_SEED_COMMENT: () => STREAM_SEED_COMMENT,
  STREAM_SEGMENT_ATTR: () => STREAM_SEGMENT_ATTR,
  SUSPENSE_RESOLVED_COMMENT: () => SUSPENSE_RESOLVED_COMMENT,
  SUSPENSE_RESOLVED_NATIVE_ATTR: () => SUSPENSE_RESOLVED_NATIVE_ATTR,
  SUSPENSE_RESOLVED_SEED_ATTR: () => SUSPENSE_RESOLVED_SEED_ATTR,
  SUSPENSE_SCRIPT_ATTR: () => import_stream_protocol.SUSPENSE_SCRIPT_ATTR,
  SUSPENSE_SEED_WIRE_PREFIX: () => SUSPENSE_SEED_WIRE_PREFIX,
  SVG_ONLY_TAGS: () => SVG_ONLY_TAGS,
  UNDEFINED_SENTINEL_KEY: () => UNDEFINED_SENTINEL_KEY,
  VALID_ATTR_NAME: () => VALID_ATTR_NAME,
  VOID_ELEMENTS: () => VOID_ELEMENTS,
  cssStyleValue: () => cssStyleValue,
  isEnumeratedBooleanAttr: () => isEnumeratedBooleanAttr,
  isUnitlessStyleProp: () => isUnitlessStyleProp
});
module.exports = __toCommonJS(constants_exports);
var import_hydration_markers = require("./hydration-markers.cjs");
var import_stream_protocol = require("./stream-protocol.cjs");
var import_stream_protocol2 = require("./stream-protocol.cjs");
var import_hydration_markers2 = require("./hydration-markers.cjs");
var import_stream_protocol3 = require("./stream-protocol.cjs");
var import_stream_protocol4 = require("./stream-protocol.cjs");
var import_dom_tables = require("./dom-tables.cjs");
const BLOCK_OPEN = `<!--${import_hydration_markers.HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${import_hydration_markers.HYDRATION_END}-->`;
const FOR_BLOCK_OPEN_EMPTY = `<!--${import_hydration_markers.HYDRATION_FOR_EMPTY}-->`;
const FOR_BLOCK_OPEN_ITEMS = `<!--${import_hydration_markers.HYDRATION_FOR_ITEMS}-->`;
const EMPTY_COMMENT = "<!---->";
const HYDRATION_TEXT_SEP = " ";
const SUSPENSE_RESOLVED_COMMENT = "oct-suspense:";
const SUSPENSE_RESOLVED_SEED_ATTR = "data-octane-suspense-seeds";
const SUSPENSE_RESOLVED_NATIVE_ATTR = "data-octane-suspense-signals";
const UNDEFINED_SENTINEL_KEY = "__octane_new_undefined__";
const SUSPENSE_SEED_WIRE_PREFIX = "\0octane:ssr-seed:";
const REJECTION_SENTINEL_KEY = "__octane_new_rejection__";
const EXTERNAL_HYDRATION_PROMISE = /* @__PURE__ */ Symbol.for(
  "octane.external-hydration-promise"
);
const HYDRATION_RANGE_BOUNDARY = /* @__PURE__ */ Symbol.for(
  "octane.hydration-range-boundary"
);
const HYDRATE_STATIC_ID_COUNT_PREFIX = "octane-static-hydrate:";
const HYDRATE_STATIC_END = "/octane-static-hydrate";
const STREAM_SEGMENT_ATTR = "data-oct-s";
const STREAM_SEED_ATTR = "data-oct-seed";
const STREAM_RESOURCE_ATTR = "data-oct-fr";
const STREAM_SEED_COMMENT = "oct-seed:";
const VOID_ELEMENTS = import_dom_tables.VOID_ELEMENTS;
const BOOLEAN_ATTR_PROPS = import_dom_tables.BOOLEAN_ATTR_PROPS;
const MUST_USE_PROPERTY_PROPS = import_dom_tables.MUST_USE_PROPERTY_PROPS;
const POSITIVE_NUMERIC_ATTR_PROPS = import_dom_tables.POSITIVE_NUMERIC_ATTR_PROPS;
const VALID_ATTR_NAME = /^[^\s"'>\/=\u0000-\u001F]+$/;
const SVG_ONLY_TAGS = import_dom_tables.SVG_ONLY_TAGS;
const ATTRIBUTE_ALIASES = import_dom_tables.ATTRIBUTE_ALIASES;
const isEnumeratedBooleanAttr = import_dom_tables.isEnumeratedBooleanAttr;
const isUnitlessStyleProp = import_dom_tables.isUnitlessStyleProp;
const cssStyleValue = import_dom_tables.cssStyleValue;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATTRIBUTE_ALIASES,
  BLOCK_CLOSE,
  BLOCK_OPEN,
  BOOLEAN_ATTR_PROPS,
  EMPTY_COMMENT,
  EXTERNAL_HYDRATION_PROMISE,
  FOR_BLOCK_OPEN_EMPTY,
  FOR_BLOCK_OPEN_ITEMS,
  HYDRATE_ID_ATTR,
  HYDRATE_ID_COUNT_ATTR,
  HYDRATE_INDEPENDENT_ATTR,
  HYDRATE_INPUT_ATTR,
  HYDRATE_SEED_ATTR,
  HYDRATE_STATIC_END,
  HYDRATE_STATIC_ID_COUNT_PREFIX,
  HYDRATE_STREAM_TOKEN_ATTR,
  HYDRATE_WHEN_ATTR,
  HYDRATION_END,
  HYDRATION_FOR_EMPTY,
  HYDRATION_FOR_ITEMS,
  HYDRATION_RANGE_BOUNDARY,
  HYDRATION_START,
  HYDRATION_TEXT_SEP,
  INDEPENDENT_HYDRATE_MANIFEST_ATTR,
  MUST_USE_PROPERTY_PROPS,
  POSITIVE_NUMERIC_ATTR_PROPS,
  REJECTION_SENTINEL_KEY,
  SIGNAL_CONTROL_ATTR,
  STREAM_BOUNDARY_ATTR,
  STREAM_RESOURCE_ATTR,
  STREAM_SCRIPT_ATTR,
  STREAM_SEED_ATTR,
  STREAM_SEED_COMMENT,
  STREAM_SEGMENT_ATTR,
  SUSPENSE_RESOLVED_COMMENT,
  SUSPENSE_RESOLVED_NATIVE_ATTR,
  SUSPENSE_RESOLVED_SEED_ATTR,
  SUSPENSE_SCRIPT_ATTR,
  SUSPENSE_SEED_WIRE_PREFIX,
  SVG_ONLY_TAGS,
  UNDEFINED_SENTINEL_KEY,
  VALID_ATTR_NAME,
  VOID_ELEMENTS,
  cssStyleValue,
  isEnumeratedBooleanAttr,
  isUnitlessStyleProp
});
