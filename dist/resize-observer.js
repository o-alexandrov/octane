let queuedCallbacks = null;
let postTask;
function drainCallbacks() {
  const callbacks = queuedCallbacks;
  queuedCallbacks = null;
  if (callbacks === null) return;
  for (const callback of callbacks) {
    try {
      callback();
    } catch (error) {
      if (typeof reportError === "function") reportError(error);
      else
        setTimeout(() => {
          throw error;
        }, 0);
    }
  }
}
function enqueue(callback) {
  if (queuedCallbacks !== null) {
    queuedCallbacks.add(callback);
    return;
  }
  queuedCallbacks = /* @__PURE__ */ new Set([callback]);
  if (postTask === void 0) {
    if (typeof MessageChannel === "undefined") {
      postTask = () => {
        setTimeout(drainCallbacks, 0);
      };
    } else {
      const channel = new MessageChannel();
      channel.port1.onmessage = drainCallbacks;
      postTask = () => channel.port2.postMessage(null);
    }
  }
  postTask();
}
function createResizeObserver(callback, ResizeObserverCtor = ResizeObserver) {
  if (typeof callback !== "function")
    throw new TypeError("ResizeObserver callback must be a function");
  const entries = /* @__PURE__ */ new Map();
  const boxes = /* @__PURE__ */ new Map();
  let pending = false;
  const deliver = () => {
    if (!pending) return;
    pending = false;
    const batch = Array.from(entries.values());
    entries.clear();
    Reflect.apply(callback, observer, [batch, observer]);
  };
  const observer = new ResizeObserverCtor((batch) => {
    pending = true;
    for (const entry of batch) entries.set(entry.target, entry);
    enqueue(deliver);
  });
  const observe = observer.observe;
  const unobserve = observer.unobserve;
  const disconnect = observer.disconnect;
  const discard = (target) => {
    if (entries.delete(target) && entries.size === 0) {
      pending = false;
      queuedCallbacks?.delete(deliver);
    }
  };
  observer.observe = function(target, options) {
    let box = "content-box";
    let nativeOptions = options;
    if (options !== null && (typeof options === "object" || typeof options === "function")) {
      nativeOptions = {
        get box() {
          const value = options.box;
          if (value === void 0) return void 0;
          box = `${value}`;
          return box;
        }
      };
    }
    observe.call(this, target, nativeOptions);
    if (this !== observer) return;
    if (boxes.get(target) !== box) discard(target);
    boxes.set(target, box);
  };
  observer.unobserve = function(target) {
    unobserve.call(this, target);
    if (this !== observer) return;
    boxes.delete(target);
    discard(target);
    if (boxes.size === 0 && entries.size === 0) {
      pending = false;
      queuedCallbacks?.delete(deliver);
    }
  };
  observer.disconnect = function() {
    disconnect.call(this);
    if (this !== observer) return;
    boxes.clear();
    entries.clear();
    pending = false;
    queuedCallbacks?.delete(deliver);
  };
  return observer;
}
export {
  createResizeObserver
};
