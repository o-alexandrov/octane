import { inspectNativeReadSource } from "./native-read-inspection.js";
function createNativeReadRetry(notify) {
  const sources = /* @__PURE__ */ new Map();
  let generation = 0;
  return {
    /** Retry leases have no accepted read revision and expose no values. */
    inspect() {
      return Array.from(sources.keys(), (source) => inspectNativeReadSource(source, null));
    },
    get generation() {
      return generation;
    },
    track(witness) {
      let invalid = witness.mixed;
      for (const [source, version] of witness.reads) {
        if (!sources.has(source)) sources.set(source, source.subscribe(notify));
        if (source.getVersion() !== version) invalid = true;
      }
      if (invalid) notify();
    },
    clear() {
      generation++;
      for (const dispose of sources.values()) dispose();
      sources.clear();
    }
  };
}
export {
  createNativeReadRetry
};
