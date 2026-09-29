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
var stream_protocol_exports = {};
__export(stream_protocol_exports, {
  HYDRATE_STREAM_TOKEN_ATTR: () => HYDRATE_STREAM_TOKEN_ATTR,
  STREAM_BOUNDARY_ATTR: () => STREAM_BOUNDARY_ATTR,
  STREAM_SCRIPT_ATTR: () => STREAM_SCRIPT_ATTR,
  SUSPENSE_SCRIPT_ATTR: () => SUSPENSE_SCRIPT_ATTR,
  getLeadingHydrationListRange: () => getLeadingHydrationListRange,
  isRendererStreamBoundaryTemplate: () => isRendererStreamBoundaryTemplate,
  isRendererStreamToken: () => isRendererStreamToken,
  rendererRangeClose: () => rendererRangeClose,
  streamTokenFromBoundaryId: () => streamTokenFromBoundaryId
});
module.exports = __toCommonJS(stream_protocol_exports);
var import_dom_binding_protocol = require("./dom-binding-protocol.cjs");
var import_hydration_markers = require("./hydration-markers.cjs");
const STREAM_BOUNDARY_ATTR = "data-oct-b";
const SUSPENSE_SCRIPT_ATTR = "data-octane-suspense";
const STREAM_SCRIPT_ATTR = "data-octane-stream";
const HYDRATE_STREAM_TOKEN_ATTR = "data-octane-stream-token";
function hydrationMarkerMultiplicity(data, open) {
  const marker = open ? import_hydration_markers.HYDRATION_START : import_hydration_markers.HYDRATION_END;
  if (data === marker) return 1;
  if (open && (data === import_hydration_markers.HYDRATION_FOR_EMPTY || data === import_hydration_markers.HYDRATION_FOR_ITEMS)) return 1;
  if (open && (data.startsWith(import_dom_binding_protocol.BINDING_OPEN_PREFIX) || data.startsWith(import_hydration_markers.HYDRATION_FOR_PREFIX)) && (0, import_dom_binding_protocol.isBindingOpenComment)(data))
    return 1;
  if (data.length < 2 || data.charCodeAt(0) !== marker.charCodeAt(0)) return 0;
  const first = data.charCodeAt(1);
  if (first < 49 || first > 57) return 0;
  let value = first - 48;
  for (let i = 2; i < data.length; i++) {
    const digit = data.charCodeAt(i) - 48;
    if (digit < 0 || digit > 9) return 0;
    value = value * 10 + digit;
    if (!Number.isSafeInteger(value)) return 0;
  }
  return value >= 2 ? value : 0;
}
function isHydrationOpen(node) {
  return node !== null && node.nodeType === 8 && hydrationMarkerMultiplicity(node.data, true) !== 0;
}
function rendererRangeClose(open) {
  if (!isHydrationOpen(open)) return null;
  let depth = 0;
  let node = open.nextSibling;
  while (node !== null) {
    if (node.nodeType === 8) {
      const data = node.data;
      if (hydrationMarkerMultiplicity(data, true) !== 0) {
        depth++;
      } else if (hydrationMarkerMultiplicity(data, false) !== 0) {
        if (depth === 0) return node;
        depth--;
      }
    }
    node = node.nextSibling;
  }
  return null;
}
function getLeadingHydrationListRange(host) {
  let start = host.firstChild;
  let enclosingEnd = null;
  while (start !== null && start.nodeType === 8) {
    const data = start.data;
    const list = data === import_hydration_markers.HYDRATION_FOR_EMPTY || data === import_hydration_markers.HYDRATION_FOR_ITEMS || (0, import_dom_binding_protocol.isForBindingOpenComment)(data);
    const wrapperMultiplicity = data === import_hydration_markers.HYDRATION_START ? 1 : data.charCodeAt(1) >= 49 && data.charCodeAt(1) <= 57 ? hydrationMarkerMultiplicity(data, true) : 0;
    if (!list && wrapperMultiplicity === 0) return null;
    const end = rendererRangeClose(start);
    if (end === null || enclosingEnd !== null && (end.compareDocumentPosition(enclosingEnd) & 4) === 0)
      return null;
    if (hydrationMarkerMultiplicity(end.data, false) !== (list ? 1 : wrapperMultiplicity))
      return null;
    if (list) {
      const suffix = data.slice(import_hydration_markers.HYDRATION_FOR_EMPTY.length);
      return {
        start,
        end,
        emptyMarker: import_hydration_markers.HYDRATION_FOR_EMPTY + suffix,
        itemsMarker: import_hydration_markers.HYDRATION_FOR_ITEMS + suffix
      };
    }
    enclosingEnd = end;
    start = start.nextSibling;
  }
  return null;
}
function isRendererStreamToken(token) {
  return token !== null && /^os[a-zA-Z0-9_-]+-[0-9a-z]+$/.test(token);
}
function streamTokenFromBoundaryId(id) {
  if (id === null) return null;
  const separator = id.lastIndexOf("-");
  if (separator <= 2 || separator === id.length - 1) return null;
  const token = id.slice(0, separator);
  const order = id.slice(separator + 1);
  if (!isRendererStreamToken(token)) return null;
  if (!/^(?:0|[1-9a-z][0-9a-z]*)$/.test(order)) return null;
  return token;
}
function isRendererStreamBoundaryTemplate(node, expectedToken) {
  if (node.localName !== "template") return false;
  const id = node.getAttribute(STREAM_BOUNDARY_ATTR);
  const token = streamTokenFromBoundaryId(id);
  if (token === null || expectedToken !== void 0 && token !== expectedToken) return false;
  const open = node.previousSibling;
  return isHydrationOpen(open) && open.nextSibling === node && rendererRangeClose(open) !== null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HYDRATE_STREAM_TOKEN_ATTR,
  STREAM_BOUNDARY_ATTR,
  STREAM_SCRIPT_ATTR,
  SUSPENSE_SCRIPT_ATTR,
  getLeadingHydrationListRange,
  isRendererStreamBoundaryTemplate,
  isRendererStreamToken,
  rendererRangeClose,
  streamTokenFromBoundaryId
});
