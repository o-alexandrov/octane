import { documentSignalOwner } from "../signals/document-owner.js";
import { createSignalOwnerLifecycle } from "../signals/facade.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function installSignalDocumentLifecycle(options) {
  const document = options.document;
  const view = document.defaultView;
  if (!view || !options.buildId || !options.documentId) {
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A signal document lifecycle requires a live document and build identity." : __octaneNoArgError(213));
  }
  const signalOwner = options.signalOwner ?? documentSignalOwner(document);
  const owner = createSignalOwnerLifecycle(signalOwner);
  let frozen = false;
  let disposed = false;
  let waiting;
  let wake;
  const compatible = () => {
    if (owner.retired || view.document !== document)
      return false;
    try {
      if (options.readIdentity !== void 0) {
        const identity = options.readIdentity();
        return identity?.buildId === options.buildId && identity.documentId === options.documentId;
      }
      const data = JSON.parse(document.getElementById("__octane_data")?.textContent || "null");
      return data?.clientBuild?.version === 1 && data.clientBuild.buildId === options.buildId && data.streamedSignals?.buildId === options.buildId && data.streamedSignals.documentId === options.documentId;
    } catch {
      return false;
    }
  };
  const dispose = () => {
    if (disposed)
      return;
    disposed = true;
    view.removeEventListener("pagehide", hide);
    view.removeEventListener("pageshow", show);
    owner.retire();
    options.streamedHydration?.suspend();
    options.independentHydration?.();
    wake?.(false);
    wake = void 0;
  };
  const hide = (event) => {
    if (!event.persisted) {
      dispose();
      return;
    }
    if (disposed || frozen)
      return;
    frozen = true;
    waiting = new Promise((resolve) => {
      wake = resolve;
    });
    owner.freeze();
    options.streamedHydration?.suspend();
    options.independentHydration?.pause();
  };
  const show = (event) => {
    if (!event.persisted || disposed || !frozen)
      return;
    if (!compatible()) {
      dispose();
      (options.onMismatch ?? (() => view.location.reload()))();
      return;
    }
    frozen = false;
    owner.resume();
    if (disposed || frozen)
      return;
    options.independentHydration?.resume();
    wake?.(true);
    wake = void 0;
    waiting = void 0;
  };
  view.addEventListener("pagehide", hide);
  view.addEventListener("pageshow", show);
  return {
    signalOwner,
    whenActive() {
      return disposed ? Promise.resolve(false) : waiting ?? Promise.resolve(true);
    },
    dispose
  };
}
export {
  installSignalDocumentLifecycle
};
