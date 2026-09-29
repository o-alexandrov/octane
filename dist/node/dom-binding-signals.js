const __octaneDev = process.env.NODE_ENV !== "production";
import { captureSignalOwner, currentSignalOwner } from "./signals/owner-context.js";
import { forwardNativeTransitionConsumer, setNativeReadObserver } from "./signals/read-protocol.js";
import { SIGNAL_HANDLE, SIGNAL_BINDING_READ, SIGNAL_BINDING_SUBSCRIBE } from "./signals/types.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function __assertBindingSnapshot(read) {
  let observed = false;
  const previous = setNativeReadObserver((source, version) => {
    observed = true;
    previous?.(source, version);
  });
  let value;
  let failed = false;
  let failure;
  try {
    value = read();
  } catch (error) {
    failed = true;
    failure = error;
  } finally {
    setNativeReadObserver(previous);
  }
  if (observed)
    throw Object.assign(new TypeError(__octaneDev ? "Octane DOM bindings: an imported signal accessor performed a live read without a subscription; bind the handle directly or pass an explicit sample through BindingSource." : __octaneNoArgError(308)), { code: "OCTANE_DOM_BINDINGS" });
  if (failed)
    throw failure;
  return value;
}
function __createBindingSignals() {
  const owner = currentSignalOwner();
  const run = owner === null ? (callback) => callback() : captureSignalOwner(owner);
  const isSignal = (value) => value !== null && (typeof value === "object" || typeof value === "function") && value[SIGNAL_HANDLE] === true;
  return {
    isSignal,
    connect(notify) {
      let value;
      let handle;
      let unsubscribe;
      let generation = 0;
      let disposed = false;
      const get = () => disposed ? void 0 : handle ? run(() => handle[SIGNAL_BINDING_READ]()) : value;
      const dispose = () => {
        if (disposed)
          return;
        disposed = true;
        generation++;
        handle = void 0;
        const stop = unsubscribe;
        unsubscribe = void 0;
        stop?.();
      };
      return {
        get,
        dispose,
        preview(next) {
          const nextHandle = isSignal(next) ? next : void 0;
          const ticket = generation;
          const projected = nextHandle ? run(() => nextHandle[SIGNAL_BINDING_READ]()) : next;
          let accepted = false;
          let retired = false;
          let invalid = false;
          let acceptedGeneration = ticket;
          const stopNext = nextHandle && nextHandle !== handle ? run(() => nextHandle[SIGNAL_BINDING_SUBSCRIBE](forwardNativeTransitionConsumer(notify, () => {
            if (retired || disposed)
              return;
            if (!accepted)
              invalid = true;
            else if (generation === acceptedGeneration)
              notify();
          }))) : void 0;
          return {
            value: projected,
            validate: () => !retired && !invalid && !disposed && generation === ticket,
            commit() {
              if (retired || accepted || disposed)
                return;
              accepted = true;
              value = next;
              if (nextHandle === handle)
                return;
              const stop = unsubscribe;
              acceptedGeneration = ++generation;
              handle = nextHandle;
              unsubscribe = stopNext;
              stop?.();
            },
            discard() {
              if (accepted || retired)
                return;
              retired = true;
              stopNext?.();
            }
          };
        },
        read(next) {
          if (disposed)
            return void 0;
          const nextHandle = isSignal(next) ? next : void 0;
          if (nextHandle !== handle) {
            const ticket = ++generation;
            const stop = unsubscribe;
            unsubscribe = void 0;
            handle = void 0;
            stop?.();
            if (disposed)
              return void 0;
            handle = nextHandle;
            if (handle) {
              if (typeof handle[SIGNAL_BINDING_READ] !== "function" || typeof handle[SIGNAL_BINDING_SUBSCRIBE] !== "function")
                throw new TypeError(__octaneDev ? "A DOM binding signal requires the native binding protocol." : __octaneNoArgError(309));
              const stopNext = run(() => handle[SIGNAL_BINDING_SUBSCRIBE](forwardNativeTransitionConsumer(notify, () => {
                if (!disposed && ticket === generation)
                  notify();
              })));
              if (typeof stopNext !== "function")
                throw new TypeError(__octaneDev ? "A DOM binding signal subscription must return cleanup." : __octaneNoArgError(310));
              if (disposed || ticket !== generation)
                stopNext();
              else
                unsubscribe = stopNext;
            }
          }
          value = next;
          return get();
        }
      };
    }
  };
}
export {
  __assertBindingSnapshot,
  __createBindingSignals
};
