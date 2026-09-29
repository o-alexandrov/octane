const visibleType = "visible";
const observerRegistry = /* @__PURE__ */ new Map();
function cleanupObserverEntry(entry) {
  if (entry.elements.size > 0) return;
  entry.observer.disconnect();
  if (observerRegistry.get(entry.key) === entry) {
    observerRegistry.delete(entry.key);
  }
}
// @__NO_SIDE_EFFECTS__
function visible(options = {}) {
  const rootMargin = options.rootMargin ?? "600px";
  const threshold = options.threshold ?? 0;
  return {
    _t: visibleType,
    _p: options,
    _s: ({ element, gate, prefetch }) => {
      const callback = prefetch ?? gate?.resolve;
      if (!callback) return;
      if (!element || typeof IntersectionObserver !== "function") {
        callback();
        return;
      }
      const key = `${rootMargin}|${Array.isArray(threshold) ? threshold.join(",") : String(threshold)}`;
      let entry = observerRegistry.get(key);
      if (!entry) {
        const nextEntry = {
          key,
          elements: /* @__PURE__ */ new Map(),
          observer: new IntersectionObserver(
            (entries) => {
              for (const observerEntry of entries) {
                if (!observerEntry.isIntersecting) continue;
                const callbacks2 = nextEntry.elements.get(observerEntry.target);
                if (!callbacks2) continue;
                callbacks2.forEach((registeredCallback) => registeredCallback());
                nextEntry.elements.delete(observerEntry.target);
                nextEntry.observer.unobserve(observerEntry.target);
                cleanupObserverEntry(nextEntry);
              }
            },
            { rootMargin, threshold }
          )
        };
        observerRegistry.set(key, nextEntry);
        entry = nextEntry;
      }
      let callbacks = entry.elements.get(element);
      if (!callbacks) {
        callbacks = /* @__PURE__ */ new Set();
        entry.elements.set(element, callbacks);
        entry.observer.observe(element);
      }
      callbacks.add(callback);
      return () => {
        const currentCallbacks = entry.elements.get(element);
        currentCallbacks?.delete(callback);
        if (currentCallbacks?.size === 0) {
          entry.elements.delete(element);
          entry.observer.unobserve(element);
        }
        cleanupObserverEntry(entry);
      };
    }
  };
}
export {
  visible
};
