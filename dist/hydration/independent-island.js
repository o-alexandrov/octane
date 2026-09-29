import { decodeSignalValue } from "../data-encoding.js";
import { captureInitialDocumentSignals } from "../signals/native-read-seeds.js";
import { HYDRATE_ID_ATTR, HYDRATE_IDLE_TIMEOUT_ATTR, HYDRATE_MEDIA_ATTR, HYDRATE_VISIBLE_MARGIN_ATTR, HYDRATE_VISIBLE_THRESHOLD_ATTR, HYDRATE_WHEN_ATTR, HYDRATE_INDEPENDENT_ATTR, INDEPENDENT_HYDRATE_MANIFEST_ATTR } from "../hydration-markers.js";
import { isIndependentHydrateManifest } from "../independent-hydration-protocol.js";
import { appendHydrationReplayIntent, hydrationMarkerInteractionStatus, initializeIndependentHydrationEventCapture, isHydrationSelectionIntentCurrent, isNativeHydrationIntentCurrent, registerHydrationIntentBoundary, takePendingHydrationIntents, unregisterHydrationIntentBoundary } from "./event-capture.js";
import { idle } from "./idle.js";
import { media } from "./media.js";
import { visible } from "./visible.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function automaticStrategy(element, when) {
  if (when === "idle") {
    const timeout = element.getAttribute(HYDRATE_IDLE_TIMEOUT_ATTR);
    return idle(timeout === null ? {} : { timeout: Number(timeout) });
  }
  if (when === "visible") {
    const rootMargin = element.getAttribute(HYDRATE_VISIBLE_MARGIN_ATTR);
    const threshold = element.getAttribute(HYDRATE_VISIBLE_THRESHOLD_ATTR);
    return visible({
      ...rootMargin === null ? {} : { rootMargin },
      ...threshold === null ? {} : { threshold: threshold.split(",").map(Number) }
    });
  }
  if (when === "media")
    return media(element.getAttribute(HYDRATE_MEDIA_ATTR) ?? "");
  return null;
}
function registerIndependentHydrationIsland(element, manifest, registration) {
  if (!isIndependentHydrateManifest(manifest)) {
    throw new TypeError(process.env.NODE_ENV !== "production" ? "Invalid independent Hydrate manifest." : __octaneNoArgError(215));
  }
  if (element.getAttribute(HYDRATE_ID_ATTR) !== manifest.boundaryId) {
    throw new Error(process.env.NODE_ENV !== "production" ? "Independent Hydrate boundary identity mismatch." : __octaneNoArgError(216));
  }
  const { load, loadStyles, signalOwner, onError } = registration;
  let initialDocumentSignals = registration.initialDocumentSignals === void 0 ? void 0 : captureInitialDocumentSignals(registration.initialDocumentSignals, (signalOwner?.documentOwner ?? signalOwner)?.scopeKey ?? "octane:document");
  element.setAttribute(HYDRATE_INDEPENDENT_ATTR, "");
  initializeIndependentHydrationEventCapture(element.ownerDocument);
  let generation = 0;
  let active = false;
  let hydrated = false;
  let replayReady = false;
  let disposed = false;
  let paused = false;
  let root;
  const intents = takePendingHydrationIntents(element) ?? [];
  const when = element.getAttribute(HYDRATE_WHEN_ATTR);
  const strategy = automaticStrategy(element, when);
  let triggered = when === "load";
  let disarm;
  const fire = () => {
    triggered = true;
    disarm?.();
    disarm = void 0;
    activate();
  };
  const arm = () => {
    if (triggered || disarm !== void 0 || strategy?._s === void 0)
      return;
    const cleanup = strategy._s({
      element,
      gate: { resolved: false, resolve: fire }
    });
    if (triggered)
      cleanup?.();
    else
      disarm = cleanup ?? (() => {
      });
  };
  const unarm = () => {
    disarm?.();
    disarm = void 0;
  };
  const activate = () => {
    if (disposed || paused || active || hydrated)
      return;
    active = true;
    const attempt = ++generation;
    void Promise.resolve().then(() => {
      if (!disposed && generation === attempt)
        return loadStyles(manifest.styles);
    }).then(() => {
      if (!disposed && generation === attempt)
        return load();
    }).then((module) => {
      if (disposed || generation !== attempt || module === void 0)
        return;
      const candidate = module[manifest.exportName];
      if (typeof candidate !== "function") {
        throw new TypeError(process.env.NODE_ENV !== "production" ? "Independent Hydrate activation export is not a function." : __octaneNoArgError(217));
      }
      const replays = intents.splice(0);
      const nativeAuthority = replays.length !== 0 && replays.every((intent) => intent.current !== void 0);
      for (let index = replays.length - 1; index >= 0; index--) {
        if (!isHydrationSelectionIntentCurrent(replays[index]) || !isNativeHydrationIntentCurrent(replays[index]))
          replays.splice(index, 1);
      }
      if (nativeAuthority && replays.length === 0 && !triggered) {
        active = false;
        return;
      }
      replayReady = true;
      return candidate({
        element,
        manifest,
        captures: manifest.captures.map((value) => decodeSignalValue(value)),
        intents: replays,
        ...signalOwner === void 0 ? {} : { signalOwner },
        ...initialDocumentSignals === void 0 ? {} : { initialDocumentSignals }
      });
    }).then((value) => {
      if (disposed || generation !== attempt) {
        if (value && typeof value === "object")
          value.unmount();
        return;
      }
      if (!active)
        return;
      if (value && typeof value === "object")
        root = value;
      hydrated = true;
      active = false;
    }).catch((error) => {
      if (disposed || generation !== attempt)
        return;
      active = false;
      replayReady = false;
      onError?.(error);
    });
  };
  const boundary = (eventType, intent) => {
    if (hydrated || replayReady)
      return "hydrated";
    if (disposed)
      return "never";
    const status = hydrationMarkerInteractionStatus(element, eventType);
    if (status === "never")
      return status;
    if (intent !== void 0) {
      appendHydrationReplayIntent(intents, intent);
      activate();
    }
    return status;
  };
  registerHydrationIntentBoundary(element, boundary);
  arm();
  if (intents.length !== 0 || triggered)
    activate();
  return Object.assign(() => {
    if (disposed)
      return;
    disposed = true;
    generation++;
    initialDocumentSignals = void 0;
    unarm();
    unregisterHydrationIntentBoundary(element, boundary);
    const activatedRoot = root;
    root = void 0;
    activatedRoot?.unmount();
  }, {
    pause() {
      if (disposed || paused)
        return;
      paused = true;
      unarm();
      if (!replayReady) {
        generation++;
        active = false;
      }
    },
    resume() {
      if (disposed || !paused)
        return;
      paused = false;
      arm();
      if (intents.length || triggered)
        activate();
    }
  });
}
function bootstrapIndependentHydration(root, options) {
  const { buildId, loadModule, loadStyles, signalOwner, onError } = options;
  let initialDocumentSignals = options.initialDocumentSignals === void 0 ? void 0 : captureInitialDocumentSignals(options.initialDocumentSignals, (signalOwner?.documentOwner ?? signalOwner)?.scopeKey ?? "octane:document");
  const cleanups = /* @__PURE__ */ new Map();
  const selector = `script[type="application/json"][${INDEPENDENT_HYDRATE_MANIFEST_ATTR}]`;
  const ownerDocument = root.nodeType === 9 ? root : root.ownerDocument;
  initializeIndependentHydrationEventCapture(ownerDocument);
  let disposed = false;
  let paused = false;
  const register = (sidecar, documentComplete = false) => {
    if (disposed || paused || !root.contains(sidecar) || !documentComplete && !sidecar.textContent)
      return;
    try {
      let manifest;
      try {
        manifest = JSON.parse(sidecar.textContent || "null");
      } catch (error) {
        if (!documentComplete && ownerDocument.readyState === "loading")
          return;
        throw error;
      }
      if (!isIndependentHydrateManifest(manifest)) {
        throw new TypeError(process.env.NODE_ENV !== "production" ? "Invalid independent Hydrate sidecar." : __octaneNoArgError(218));
      }
      if (buildId !== void 0 && manifest.buildId !== buildId) {
        throw new Error(process.env.NODE_ENV !== "production" ? "Independent Hydrate build identity mismatch." : __octaneNoArgError(219));
      }
      const element = sidecar.parentElement;
      if (element === null)
        throw new Error(process.env.NODE_ENV !== "production" ? "Independent Hydrate sidecar has no boundary." : __octaneNoArgError(220));
      if (cleanups.has(element))
        throw new Error(process.env.NODE_ENV !== "production" ? "Independent Hydrate boundary already registered." : __octaneNoArgError(221));
      cleanups.set(element, registerIndependentHydrationIsland(element, manifest, {
        load: () => loadModule(manifest.moduleId),
        loadStyles,
        ...signalOwner === void 0 ? {} : { signalOwner },
        ...initialDocumentSignals === void 0 ? {} : { initialDocumentSignals },
        ...onError === void 0 ? {} : { onError }
      }));
      sidecar.remove();
    } catch (error) {
      onError?.(error);
    }
  };
  const scan = (node) => {
    if (node.nodeType !== 1)
      return;
    const element = node;
    if (element.matches(selector))
      register(element);
    else
      for (const sidecar of element.querySelectorAll(selector))
        register(sidecar);
  };
  const observer = new (ownerDocument.defaultView?.MutationObserver ?? MutationObserver)((records) => {
    if (disposed || paused)
      return;
    let removedBoundary = false;
    for (const record of records) {
      if (record.type === "characterData") {
        const parent = record.target.parentElement;
        if (parent?.matches(selector))
          register(parent);
        continue;
      }
      if (record.target.nodeType === 1 && record.target.matches(selector)) {
        register(record.target);
      }
      for (const node of record.addedNodes)
        scan(node);
      for (const node of record.removedNodes) {
        if (node.nodeType === 1 && !node.matches(selector))
          removedBoundary = true;
      }
    }
    if (removedBoundary) {
      for (const [element, cleanup] of cleanups) {
        if (root.contains(element))
          continue;
        cleanups.delete(element);
        cleanup();
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true });
  const complete = () => {
    for (const sidecar of root.querySelectorAll(selector))
      register(sidecar, true);
  };
  if (ownerDocument.readyState === "loading") {
    ownerDocument.addEventListener("DOMContentLoaded", complete, { once: true });
  }
  for (const sidecar of root.querySelectorAll(selector))
    register(sidecar);
  return Object.assign(() => {
    if (disposed)
      return;
    disposed = true;
    initialDocumentSignals = void 0;
    observer.disconnect();
    ownerDocument.removeEventListener("DOMContentLoaded", complete);
    for (const cleanup of cleanups.values())
      cleanup();
    cleanups.clear();
  }, {
    pause() {
      if (disposed || paused)
        return;
      paused = true;
      observer.disconnect();
      for (const cleanup of cleanups.values())
        cleanup.pause();
    },
    resume() {
      if (disposed || !paused)
        return;
      paused = false;
      for (const [element, cleanup] of cleanups) {
        if (root.contains(element))
          cleanup.resume();
        else {
          cleanup();
          cleanups.delete(element);
        }
      }
      observer.observe(root, { childList: true, subtree: true, characterData: true });
      for (const sidecar of root.querySelectorAll(selector))
        register(sidecar, ownerDocument.readyState !== "loading");
    }
  });
}
export {
  bootstrapIndependentHydration,
  registerIndependentHydrationIsland
};
