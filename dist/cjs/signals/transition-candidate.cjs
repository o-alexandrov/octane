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
var transition_candidate_exports = {};
__export(transition_candidate_exports, {
  installNativeSignalActionExtension: () => installNativeSignalActionExtension
});
module.exports = __toCommonJS(transition_candidate_exports);
var import_transition_state = require("./transition-state.cjs");
var import_transition_action = require("./transition-action.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
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
  (0, import_transition_action.registerNativeSignalActionExtension)({
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
          source.accept(entry.node[field] ??= import_transition_state.candidateGraph.createNativeSource(entry.node, read), revision);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  installNativeSignalActionExtension
});
