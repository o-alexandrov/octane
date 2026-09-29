import { registerSignalOwnerDocument } from "./early-values.js";
import { installDefaultSignalOwner } from "./owner-context.js";
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
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A signal document owner requires a document." : __octaneNoArgError(123));
  let owner = documentOwners.get(ownerDocument);
  if (owner === void 0) {
    owner = Object.freeze({ scopeKey: "octane:document" });
    documentOwners.set(ownerDocument, owner);
  }
  registerSignalOwnerDocument(owner, ownerDocument);
  return owner;
}
function enableSignalDocument(abi = 1) {
  if (abi !== 1)
    throw new TypeError(process.env.NODE_ENV !== "production" ? "Unsupported Octane signal binding ABI." : __octaneNoArgError(74));
  signalDocumentEnabled = true;
  if (defaultInstalled)
    return;
  defaultInstalled = true;
  installDefaultSignalOwner(() => typeof document === "undefined" ? null : documentSignalOwner(document));
}
function installStreamedSignalOwnerActivator(activate) {
  if (streamedSignalOwnerActivator !== void 0) {
    throw new Error(process.env.NODE_ENV !== "production" ? "A streamed signal hydration owner is already installed." : __octaneNoArgError(124));
  }
  streamedSignalOwnerActivator = activate;
  return () => {
    if (streamedSignalOwnerActivator === activate)
      streamedSignalOwnerActivator = void 0;
  };
}
export {
  documentSignalOwner,
  enableSignalDocument,
  installStreamedSignalOwnerActivator,
  signalDocumentEnabled,
  streamedSignalOwnerActivator
};
