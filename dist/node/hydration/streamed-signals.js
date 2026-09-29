const __octaneDev = process.env.NODE_ENV !== "production";
import { documentSignalOwner, enableSignalDocument, installStreamedSignalOwnerActivator } from "../signals/document-owner.js";
import { attachStreamedSignalResult, initializeDocumentSignalOwner } from "../signals/facade.js";
import { registerSignalOwnerDocument } from "../signals/early-values.js";
import { retireSignalOwnerIdentity } from "../signals/owner-context.js";
import { parseNativeSignalManifest } from "../signals/native-read-seeds.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
import { isStreamFrameIdentity, isStreamedRendererFrame, streamFrameIdentityKey } from "../streamed-signals-protocol.js";
import { installStreamedRendererGlobal } from "./stream-delivery.js";
import { createStreamedRegionReceiver } from "./stream-receiver.js";
import { createStreamedResultReceiver } from "./stream-result-receiver.js";
import { installSignalDocumentLifecycle } from "./document-lifecycle.js";
const STREAMED_SIGNAL_SELECTIONS = "__octaneStreamedSignalSelections";
function documentOwner(owner) {
  return "documentOwner" in owner ? owner.documentOwner : owner;
}
function bootstrapStreamedSignalHydration(options) {
  return bootstrapStreamedSignals(options, createStreamedRegionReceiver);
}
function bootstrapStreamedSignalResults(options) {
  return bootstrapStreamedSignals(options, createStreamedResultReceiver);
}
function bootstrapStreamedSignals(options, createReceiver) {
  if (!options.buildId || !options.documentId) {
    throw new TypeError(__octaneDev ? "Streamed signal hydration requires buildId and documentId." : __octaneNoArgError(266));
  }
  const target = options.target ?? globalThis;
  const signalOwner = options.signalOwner ?? documentSignalOwner(document);
  const receiver = createReceiver({
    buildId: options.buildId,
    documentId: options.documentId,
    ownerKey: signalOwner.scopeKey,
    ...options.maxPendingFrames === void 0 ? {} : { maxPendingFrames: options.maxPendingFrames },
    ...options.maxPendingBytes === void 0 ? {} : { maxPendingBytes: options.maxPendingBytes },
    ...options.timeoutMs === void 0 ? {} : { pendingTimeoutMs: options.timeoutMs }
  });
  const early = target[STREAMED_SIGNAL_SELECTIONS];
  if (early === void 0 || early === null || typeof early !== "object" || early.version !== 1 || !Array.isArray(early.identities) || typeof early.register !== "function") {
    receiver.dispose();
    throw new Error(__octaneDev ? "The streamed signal selection bootstrap is missing or incompatible." : __octaneNoArgError(267));
  }
  if (early.overflow === true) {
    receiver.dispose();
    throw new Error(__octaneDev ? "The pre-module streamed signal selection mailbox overflowed." : __octaneNoArgError(268));
  }
  const selections = /* @__PURE__ */ new Map();
  const owners = /* @__PURE__ */ new Map();
  let disposed = false;
  const attach = (selection, owner) => {
    if (selection.detach !== void 0 || selection.identity.instanceKey !== owner.instanceKey)
      return;
    selection.detach = attachStreamedSignalResult(receiver, owner, selection.identity);
  };
  const register = (candidate) => {
    if (disposed)
      return;
    if (!isStreamFrameIdentity(candidate) || candidate.buildId !== options.buildId || candidate.documentId !== options.documentId || candidate.ownerKey !== signalOwner.scopeKey) {
      throw new Error(__octaneDev ? "A streamed signal selection has the wrong authority." : __octaneNoArgError(269));
    }
    const slot = JSON.stringify([candidate.instanceKey, candidate.nodeKey]);
    const previous = selections.get(slot);
    previous?.detach?.();
    receiver.registerSelection(candidate);
    const selection = { identity: candidate };
    selections.set(slot, selection);
    const owner = owners.get(candidate.instanceKey);
    if (owner !== void 0)
      attach(selection, owner);
    else if (candidate.nodeKey.startsWith("g:")) {
      attach(selection, {
        scopeKey: signalOwner.scopeKey,
        documentOwner: signalOwner,
        instanceOwner: signalOwner,
        instanceKey: candidate.instanceKey
      });
    }
  };
  const originalRegister = early.register;
  let uninstallOwnerActivator;
  let initialized = false;
  try {
    uninstallOwnerActivator = installStreamedSignalOwnerActivator((owner) => {
      if (disposed || !("documentOwner" in owner) || documentOwner(owner) !== signalOwner)
        return;
      if (owners.has(owner.instanceKey))
        return;
      owners.set(owner.instanceKey, owner);
      for (const selection of selections.values())
        attach(selection, owner);
    });
    if (options.initialSignals !== void 0) {
      const manifest = parseNativeSignalManifest(JSON.stringify(options.initialSignals));
      if (manifest.version !== 1)
        throw new TypeError(__octaneDev ? "Document initialization requires full initial signal scopes." : __octaneNoArgError(270));
      initializeDocumentSignalOwner(signalOwner, manifest.scopes.find((scope) => scope.scopeKey === signalOwner.scopeKey) ?? {
        version: 1,
        scopeKey: signalOwner.scopeKey,
        entries: []
      });
      initialized = true;
    }
    registerSignalOwnerDocument(signalOwner, document);
    enableSignalDocument();
    early.register = register;
    for (const identity of early.identities)
      register(identity);
    early.identities.length = 0;
  } catch (error) {
    uninstallOwnerActivator?.();
    if (early.register === register)
      early.register = originalRegister;
    for (const selection of selections.values())
      selection.detach?.();
    receiver.dispose();
    if (initialized)
      retireSignalOwnerIdentity(signalOwner);
    throw error;
  }
  const earlyRenderer = target.__octaneStreamedRenderer;
  if (earlyRenderer !== void 0 && earlyRenderer !== null && typeof earlyRenderer === "object" && earlyRenderer.version === 1 && Array.isArray(earlyRenderer.frames)) {
    const current = new Set([...selections.values()].map(({ identity }) => streamFrameIdentityKey(identity)));
    let retained = 0;
    for (const frame of earlyRenderer.frames) {
      if (isStreamedRendererFrame(frame) && frame.channel === "result" && current.has(streamFrameIdentityKey(frame.identity))) {
        void receiver.receive(frame).catch(() => {
        });
      } else {
        earlyRenderer.frames[retained++] = frame;
      }
    }
    earlyRenderer.frames.length = retained;
  }
  let uninstallDelivery;
  try {
    uninstallDelivery = installStreamedRendererGlobal(receiver, target, options);
  } catch (error) {
    uninstallOwnerActivator();
    early.register = originalRegister;
    for (const selection of selections.values())
      selection.detach?.();
    receiver.dispose();
    if (initialized)
      retireSignalOwnerIdentity(signalOwner);
    throw error;
  }
  const installedRenderer = target.__octaneStreamedRenderer;
  const close = (restore) => {
    if (disposed)
      return;
    disposed = true;
    if (early.register === register)
      early.register = restore ? originalRegister : () => {
      };
    uninstallOwnerActivator();
    for (const selection of selections.values())
      selection.detach?.();
    const ownsIngress = target.__octaneStreamedRenderer === installedRenderer;
    uninstallDelivery();
    if (!restore && ownsIngress) {
      target.__octaneStreamedRenderer = { receive() {
      } };
      if (earlyRenderer)
        earlyRenderer.frames.length = 0;
    }
    selections.clear();
    owners.clear();
    receiver.dispose();
  };
  return {
    signalOwner,
    receiver,
    dispose() {
      close(true);
    },
    suspend() {
      close(false);
    }
  };
}
export {
  bootstrapStreamedSignalHydration,
  bootstrapStreamedSignalResults,
  installSignalDocumentLifecycle
};
