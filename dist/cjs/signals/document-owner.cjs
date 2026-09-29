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
var document_owner_exports = {};
__export(document_owner_exports, {
  documentSignalOwner: () => documentSignalOwner,
  enableSignalDocument: () => enableSignalDocument,
  installStreamedSignalOwnerActivator: () => installStreamedSignalOwnerActivator,
  signalDocumentEnabled: () => signalDocumentEnabled,
  streamedSignalOwnerActivator: () => streamedSignalOwnerActivator
});
module.exports = __toCommonJS(document_owner_exports);
var import_early_values = require("./early-values.cjs");
var import_owner_context = require("./owner-context.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const documentOwners = /* @__PURE__ */ new WeakMap();
let defaultInstalled = false;
let signalDocumentEnabled = false;
let streamedSignalOwnerActivator;
function documentSignalOwner(container) {
  const ownerDocument = container.nodeType === 9 ? container : container.ownerDocument;
  if (ownerDocument === null)
    throw new TypeError(__octaneDev ? "A signal document owner requires a document." : __octaneNoArgError(123));
  let owner = documentOwners.get(ownerDocument);
  if (owner === void 0) {
    owner = Object.freeze({ scopeKey: "octane:document" });
    documentOwners.set(ownerDocument, owner);
  }
  (0, import_early_values.registerSignalOwnerDocument)(owner, ownerDocument);
  return owner;
}
function enableSignalDocument(abi = 1) {
  if (abi !== 1)
    throw new TypeError(__octaneDev ? "Unsupported Octane signal binding ABI." : __octaneNoArgError(74));
  signalDocumentEnabled = true;
  if (defaultInstalled)
    return;
  defaultInstalled = true;
  (0, import_owner_context.installDefaultSignalOwner)(() => typeof document === "undefined" ? null : documentSignalOwner(document));
}
function installStreamedSignalOwnerActivator(activate) {
  if (streamedSignalOwnerActivator !== void 0) {
    throw new Error(__octaneDev ? "A streamed signal hydration owner is already installed." : __octaneNoArgError(124));
  }
  streamedSignalOwnerActivator = activate;
  return () => {
    if (streamedSignalOwnerActivator === activate)
      streamedSignalOwnerActivator = void 0;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  documentSignalOwner,
  enableSignalDocument,
  installStreamedSignalOwnerActivator,
  signalDocumentEnabled,
  streamedSignalOwnerActivator
});
