const __octaneDev = process.env.NODE_ENV !== "production";
import { candidateGraph as bridge } from "./transition-state.js";
import { registerNativeSignalActionExtension } from "./transition-action.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function createNativeReadCandidateSource(candidate) {
  let target = candidate;
  let accepted = false;
  let acceptedVersion = NaN;
  let canonicalVersion = NaN;
  const subscriptions = /* @__PURE__ */ new Set();
  const source = {
    getVersion: () => target === void 0 ? NaN : !accepted ? target.getVersion() : target.getVersion() === canonicalVersion ? acceptedVersion : NaN,
    subscribe(notify) {
      if (target === void 0)
        throw new TypeError(__octaneDev ? "The native read candidate has retired." : __octaneNoArgError(212));
      const subscription = { notify, dispose: target.subscribe(notify) };
      subscriptions.add(subscription);
      return () => {
        if (subscriptions.delete(subscription))
          subscription.dispose();
      };
    },
    serialize(version) {
      return source.getVersion() === version ? target?.serialize?.(accepted ? canonicalVersion : version) : void 0;
    }
  };
  if (candidate.inspect)
    source.inspect = () => target.inspect();
  return {
    source,
    accept(canonical, observedVersion) {
      if (accepted || target === void 0 || target.getVersion() !== observedVersion)
        return false;
      const version = canonical.getVersion();
      const acquired = /* @__PURE__ */ new Map();
      try {
        for (const subscription of subscriptions)
          acquired.set(subscription, canonical.subscribe(subscription.notify));
      } catch (error) {
        for (const dispose of acquired.values())
          dispose();
        throw error;
      }
      acceptedVersion = observedVersion;
      canonicalVersion = version;
      target = canonical;
      accepted = true;
      if (!canonical.inspect)
        delete source.inspect;
      for (const [subscription, dispose] of acquired) {
        subscription.dispose();
        subscription.dispose = dispose;
      }
      return true;
    },
    discard() {
      if (accepted || target === void 0)
        return;
      target = void 0;
      delete source.inspect;
      for (const subscription of subscriptions)
        subscription.dispose();
      subscriptions.clear();
    }
  };
}
let installed = false;
function installNativeSignalActionExtension() {
  if (installed)
    return;
  installed = true;
  registerNativeSignalActionExtension({
    source(entry, read, source) {
      const sources = entry.sources ??= {};
      return (sources[read] ??= createNativeReadCandidateSource(source)).source;
    },
    accept(prepared) {
      for (const { entry, revision } of prepared) {
        if (!entry.sources)
          continue;
        for (const read of ["value", "latest", "snapshot"]) {
          const source = entry.sources[read];
          if (!source)
            continue;
          const field = read === "value" ? "nativeSource" : read === "latest" ? "nativeLatestSource" : "nativeSnapshotSource";
          source.accept(entry.node[field] ??= bridge.createNativeSource(entry.node, read), revision);
        }
      }
    },
    release(entry) {
      if (entry.sources)
        for (const source of Object.values(entry.sources))
          source.discard();
    }
  });
}
export {
  installNativeSignalActionExtension
};
