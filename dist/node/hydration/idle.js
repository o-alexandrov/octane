const idleType = "idle";
// @__NO_SIDE_EFFECTS__
function idle(options = {}) {
  const timeout = options.timeout ?? 2e3;
  return {
    _t: idleType,
    _p: options,
    _s: ({ gate, prefetch }) => {
      const schedule = globalThis;
      const callback = prefetch ?? gate?.resolve;
      if (!callback) return;
      if (schedule.requestIdleCallback) {
        const handle = schedule.requestIdleCallback(callback, { timeout });
        return () => schedule.cancelIdleCallback?.(handle);
      }
      const timeoutId = globalThis.setTimeout(callback, timeout);
      return () => globalThis.clearTimeout(timeoutId);
    }
  };
}
export {
  idle
};
