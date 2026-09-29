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
var streamed_region_exports = {};
__export(streamed_region_exports, {
  createStreamedRegionPlacementFrame: () => createStreamedRegionPlacementFrame
});
module.exports = __toCommonJS(streamed_region_exports);
var import_native_read_seeds = require("../signals/native-read-seeds.cjs");
var import_streamed_signals_protocol = require("../streamed-signals-protocol.cjs");
function createStreamedRegionPlacementFrame(identity, rendered, options) {
  const scopes = rendered.signals === void 0 ? void 0 : (0, import_native_read_seeds.materializeNativeSignalManifest)(rendered.signals, options.initialDocumentSignals).scopes;
  if (scopes?.length !== 1 || scopes[0].scopeKey !== identity.ownerKey) {
    throw new TypeError("A streamed region requires the exact historical signal owner.");
  }
  if (rendered.head) {
    throw new TypeError("A streamed region cannot replace document head metadata.");
  }
  const frame = {
    identity: { ...identity },
    sequence: options.sequence,
    channel: "placement",
    kind: "html",
    contentRevision: options.contentRevision,
    mode: "full",
    // Scoped CSS is part of the same atomic candidate and precedes its users.
    // The outer pair belongs to the receiver, not to the component's layout.
    html: "<!--[-->" + rendered.css + rendered.html + "<!--]-->",
    historicalFrame: scopes[0],
    styles: options.styles === void 0 ? [] : [...options.styles]
  };
  if (!(0, import_streamed_signals_protocol.isStreamedRendererFrame)(frame)) throw new TypeError("Invalid streamed region snapshot.");
  return frame;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createStreamedRegionPlacementFrame
});
