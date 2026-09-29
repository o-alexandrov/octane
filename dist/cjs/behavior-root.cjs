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
var behavior_root_exports = {};
__export(behavior_root_exports, {
  adoptBindings: () => import_dom_bindings.adoptBindings,
  attachBehaviorRoot: () => attachBehaviorRoot,
  captureFormSubmissions: () => import_behavior_form_submissions.captureFormSubmissions,
  mountBindings: () => import_dom_bindings.mountBindings,
  unbound: () => import_dom_bindings.unbound
});
module.exports = __toCommonJS(behavior_root_exports);
var import_dom_bindings = require("./dom-bindings.cjs");
var import_behavior_form_submissions = require("./behavior-form-submissions.cjs");
const documentRegistries = /* @__PURE__ */ new WeakMap();
const DEFAULT_DOM = {
  element: isElement,
  parent: (node) => node.parentElement,
  contains: (container, element, document) => element.ownerDocument === document && (element === container || container.contains(element)),
  matches: (element, selector) => element.matches(selector),
  query: (element, selector) => element.querySelectorAll(selector),
  target: targetElement
};
function registryFor(document) {
  let registry = documentRegistries.get(document);
  if (registry === void 0) {
    registry = { roots: /* @__PURE__ */ new Map(), ranges: /* @__PURE__ */ new Map() };
    documentRegistries.set(document, registry);
  }
  return registry;
}
const CANCELED = /* @__PURE__ */ Symbol("behavior.canceled");
function createReadiness() {
  let resolvePromise;
  let rejectPromise;
  const promise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  void promise.catch(() => void 0);
  const readiness = {
    promise,
    settled: false,
    resolve() {
      if (readiness.settled) return;
      readiness.settled = true;
      resolvePromise();
    },
    reject(reason) {
      if (readiness.settled) return;
      readiness.settled = true;
      rejectPromise(reason);
    }
  };
  return readiness;
}
function createController(document) {
  const Controller = document.defaultView?.AbortController ?? globalThis.AbortController;
  return new Controller();
}
function linkSignal(signal, controller) {
  if (signal.aborted) {
    controller.abort(signal.reason);
    return () => void 0;
  }
  const abort = () => controller.abort(signal.reason);
  signal.addEventListener("abort", abort, { once: true });
  return () => signal.removeEventListener("abort", abort);
}
function waitUntilReady(source, signal) {
  if (signal.aborted) {
    void Promise.resolve(source).then(void 0, () => void 0);
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const complete = () => {
      signal.removeEventListener("abort", complete);
      resolve();
    };
    signal.addEventListener("abort", complete);
    Promise.resolve(source).then(complete, (error) => {
      signal.removeEventListener("abort", complete);
      reject(error);
    });
  });
}
function trackPending(root, promise) {
  root.pending.add(promise);
  const remove = () => root.pending.delete(promise);
  void promise.then(remove, remove);
}
function isElement(value) {
  return typeof value === "object" && value !== null && value.nodeType === 1;
}
function contains(root, element, container = root.container) {
  return root.dom.contains(container, element, root.document);
}
function assertActiveRoot(root) {
  if (root.disposed || root.controller.signal.aborted) {
    throw new Error("Cannot register behavior on a disposed behavior root.");
  }
}
function assertContainedElement(root, element, label) {
  if (!root.dom.element(element) || !contains(root, element)) {
    throw new Error(`${label} must belong to the behavior root container and document.`);
  }
}
function nearestRange(root, element) {
  let current = element;
  while (current !== null) {
    const range = root.registry.ranges.get(current);
    if (range !== void 0 && range.status !== "disposed" && range.status !== "failed") {
      return range;
    }
    if (current === root.container) return void 0;
    current = root.dom.parent(current);
  }
  return void 0;
}
function matchesTarget(record, element) {
  return typeof record.entry.target === "string" ? record.root.dom.matches(element, record.entry.target) : record.entry.target === element;
}
function rangeMatches(record, range) {
  return record.entry.owner === void 0 || range !== void 0 && Object.is(record.entry.owner, range.owner);
}
function dependsOnRange(record, range) {
  if (record.waiting.has(range)) return true;
  if (record.entry.owner === void 0 || !Object.is(record.entry.owner, range.owner) || !contains(record.root, range.element)) {
    return false;
  }
  if (typeof record.entry.target !== "string") {
    return contains(record.root, record.entry.target, range.element) && nearestRange(record.root, record.entry.target) === range;
  }
  if (record.root.dom.matches(range.element, record.entry.target) && nearestRange(record.root, range.element) === range) {
    return true;
  }
  for (const element of record.root.dom.query(range.element, record.entry.target)) {
    if (nearestRange(record.root, element) === range) return true;
  }
  return false;
}
function adoptionContext(adoption, event) {
  const context = {
    signal: adoption.controller.signal,
    ...adoption.range === void 0 ? {} : { range: adoption.range.publicRange },
    ...event === void 0 ? {} : { event }
  };
  return context;
}
function finishPendingAdoption(adoption) {
  if (!adoption.pending) return;
  adoption.pending = false;
  adoption.entry.pendingCount--;
}
function disposeAdoption(adoption) {
  if (adoption.disposed) return;
  adoption.disposed = true;
  finishPendingAdoption(adoption);
  adoption.entry.adoptions.delete(adoption.element);
  adoption.controller.abort();
  for (const unlink of adoption.unlinks) unlink();
  adoption.unlinks.length = 0;
  const cleanup = adoption.cleanup;
  adoption.cleanup = void 0;
  cleanup?.();
}
function flushQueuedEvents(record) {
  if (record.status !== "active" || record.captureDepth) return;
  const queue = record.queue;
  record.flushDepth++;
  try {
    while (record.head < queue.length) {
      const index = record.head;
      const queued = queue[index];
      if (queued.payload === CANCELED || !(queued.valid?.() ?? contains(record.root, queued.element))) {
        record.head = index + 1;
        continue;
      }
      const range = nearestRange(record.root, queued.element);
      if (range !== queued.range || !rangeMatches(record, range)) {
        record.head = index + 1;
        continue;
      }
      if (range?.status === "pending") return;
      let adoption = record.adoptions.get(queued.element);
      if (adoption === void 0) {
        adoption = adoptElement(record, queued.element, range, queued.event);
      }
      if (adoption === void 0 || adoption.pending) return;
      if (record.head !== index || queue[index] !== queued) continue;
      record.head = index + 1;
      if (queued.valid?.() === false) continue;
      record.entry.handleEvent?.(
        queued.event,
        queued.element,
        adoptionContext(adoption, queued.event),
        queued.payload
      );
    }
  } finally {
    record.flushDepth--;
    if (record.flushDepth === 0 && record.head !== 0) {
      const consumed = record.head;
      if (consumed >= queue.length) {
        queue.length = 0;
        record.head = 0;
      } else if (consumed >= queue.length - consumed) {
        queue.splice(0, consumed);
        record.head = 0;
      }
    }
  }
}
function completeBehavior(record) {
  if (record.status !== "active" || !record.scanned) return;
  for (const range of record.waiting) {
    if (range.status === "pending") return;
    record.waiting.delete(range);
  }
  if (record.pendingCount !== 0) return;
  flushQueuedEvents(record);
  if (record.queue.length !== 0) return;
  record.ready.resolve();
}
function failBehavior(record, error) {
  if (record.status === "disposed" || record.status === "failed") return;
  record.status = "failed";
  record.ready.reject(error);
  disposeBehavior(record);
}
function adoptElement(record, element, range, event) {
  if (record.status !== "active" || !contains(record.root, element) || !rangeMatches(record, range)) {
    return void 0;
  }
  if (range?.status === "pending") {
    record.waiting.add(range);
    return void 0;
  }
  const existing = record.adoptions.get(element);
  if (existing !== void 0) return existing;
  const controller = createController(record.root.document);
  const adoption = {
    entry: record,
    element,
    range,
    controller,
    unlinks: [linkSignal(record.controller.signal, controller)],
    cleanup: void 0,
    pending: false,
    disposed: false
  };
  if (range !== void 0) adoption.unlinks.push(linkSignal(range.controller.signal, controller));
  if (controller.signal.aborted) return void 0;
  record.adoptions.set(element, adoption);
  let result;
  try {
    result = record.entry.adopt(element, adoptionContext(adoption, event));
  } catch (error) {
    disposeAdoption(adoption);
    failBehavior(record, error);
    return void 0;
  }
  if (typeof result === "function") {
    if (adoption.disposed || controller.signal.aborted) result();
    else adoption.cleanup = result;
    return adoption;
  }
  if (typeof result === "object" && result !== null && typeof result.then === "function") {
    adoption.pending = true;
    record.pendingCount++;
    const settled = Promise.resolve(result).then(
      (cleanup) => {
        finishPendingAdoption(adoption);
        if (typeof cleanup === "function") {
          if (adoption.disposed || adoption.controller.signal.aborted) cleanup();
          else adoption.cleanup = cleanup;
        }
        if (!adoption.disposed) {
          flushQueuedEvents(record);
          completeBehavior(record);
        }
      },
      (error) => {
        finishPendingAdoption(adoption);
        if (adoption.disposed || record.controller.signal.aborted) return;
        disposeAdoption(adoption);
        failBehavior(record, error);
      }
    );
    const cancelable = waitUntilReady(settled, adoption.controller.signal);
    trackPending(record.root, cancelable);
  }
  return adoption;
}
function reconcileBehavior(record) {
  if (record.status !== "active") return;
  record.waiting.clear();
  for (const [element, adoption] of [...record.adoptions]) {
    const contained = contains(record.root, element);
    const range = contained ? nearestRange(record.root, element) : void 0;
    if (!contained || !matchesTarget(record, element) || !rangeMatches(record, range) || range !== adoption.range || range?.status === "pending") {
      disposeAdoption(adoption);
    }
  }
  let elements;
  if (typeof record.entry.target === "string") {
    elements = Array.from(record.root.dom.query(record.root.container, record.entry.target));
    if (record.root.dom.matches(record.root.container, record.entry.target))
      elements.unshift(record.root.container);
  } else {
    elements = contains(record.root, record.entry.target) ? [record.entry.target] : [];
  }
  for (const element of elements) {
    const range = nearestRange(record.root, element);
    if (!rangeMatches(record, range)) continue;
    if (range?.status === "pending") {
      record.waiting.add(range);
      continue;
    }
    adoptElement(record, element, range);
  }
  record.scanned = true;
  completeBehavior(record);
}
function refreshDocument(registry) {
  registry.capture?.flush();
  for (const root of [...registry.roots.values()]) {
    if (root.disposed) continue;
    for (const record of [...root.behaviors]) reconcileBehavior(record);
  }
}
function ensureObserver(root) {
  if (root.observer !== null || root.disposed) return;
  const Observer = root.document.defaultView?.MutationObserver ?? globalThis.MutationObserver;
  if (Observer === void 0) return;
  root.observer = new Observer(() => {
    if (root.disposed) return;
    for (const record of [...root.behaviors]) reconcileBehavior(record);
  });
  root.observer.observe(root.container, { attributes: true, childList: true, subtree: true });
}
function targetElement(event) {
  const target = event.target;
  if (!target || typeof target.nodeType !== "number") return null;
  return target.nodeType === 1 ? target : target.parentElement ?? null;
}
function handleDelegatedEvent(root, event) {
  if (root.disposed) return;
  if (root.registry.capture?.skip(root, event)) return;
  const target = root.dom.target(event);
  if (target === null || !contains(root, target)) return;
  for (const record of [...root.behaviors]) {
    if (record.status === "disposed" || record.status === "failed" || !record.entry.events?.includes(event.type)) {
      continue;
    }
    let matched = target;
    while (matched !== null && contains(root, matched) && !matchesTarget(record, matched)) {
      if (matched === root.container) {
        matched = null;
        break;
      }
      matched = root.dom.parent(matched);
    }
    if (matched === null || !contains(root, matched)) continue;
    const range = nearestRange(root, matched);
    if (!rangeMatches(record, range)) continue;
    if (record.entry.captureEvent !== void 0) {
      const queued = { event, element: matched, range, payload: CANCELED };
      record.queue.push(queued);
      if (range?.status === "pending") record.waiting.add(range);
      record.captureDepth = (record.captureDepth ?? 0) + 1;
      try {
        const payload = record.entry.captureEvent(event, matched);
        if (!record.controller.signal.aborted && contains(root, matched) && matchesTarget(record, matched) && nearestRange(root, matched) === range)
          queued.payload = payload;
      } catch (error) {
        failBehavior(record, error);
        throw error;
      } finally {
        record.captureDepth--;
      }
      flushQueuedEvents(record);
      continue;
    }
    if (record.status !== "active" || range?.status === "pending") {
      record.queue.push({ event, element: matched, range });
      if (range?.status === "pending") record.waiting.add(range);
      continue;
    }
    const adoption = record.adoptions.get(matched) ?? adoptElement(record, matched, range, event);
    if (adoption === void 0 || adoption.pending || record.queue.length !== 0) {
      record.queue.push({ event, element: matched, range });
      flushQueuedEvents(record);
      continue;
    }
    record.entry.handleEvent?.(event, matched, adoptionContext(adoption, event), void 0);
  }
}
function installListeners(root, events) {
  if (events === void 0) return;
  for (const event of new Set(events)) {
    if (typeof event !== "string" || event.length === 0) {
      throw new Error("Behavior event names must be non-empty strings.");
    }
    if (root.listeners.has(event)) continue;
    const listener = (nativeEvent) => handleDelegatedEvent(root, nativeEvent);
    root.listeners.set(event, listener);
    root.container.addEventListener(event, listener, true);
  }
}
function removeUnusedListeners(root) {
  for (const [event, listener] of root.listeners) {
    let used = false;
    for (const record of root.behaviors) {
      if (record.entry.events?.includes(event)) {
        used = true;
        break;
      }
    }
    if (used) continue;
    root.container.removeEventListener(event, listener, true);
    root.listeners.delete(event);
  }
  if (root.behaviors.size === 0) {
    root.observer?.disconnect();
    root.observer = null;
  }
}
function disposeBehavior(record) {
  if (record.status === "disposed") return;
  record.root.registry.capture?.release(record);
  const failed = record.status === "failed";
  record.status = "disposed";
  record.controller.abort();
  for (const unlink of record.unlinks) unlink();
  record.unlinks.length = 0;
  record.root.behaviors.delete(record);
  if (record.entry.id !== void 0 && record.root.byId.get(record.entry.id) === record) {
    record.root.byId.delete(record.entry.id);
  }
  record.queue.length = 0;
  record.head = 0;
  record.waiting.clear();
  let firstError;
  for (const adoption of [...record.adoptions.values()]) {
    try {
      disposeAdoption(adoption);
    } catch (error) {
      firstError ??= error;
    }
  }
  if (!failed) record.ready.resolve();
  removeUnusedListeners(record.root);
  if (firstError !== void 0) throw firstError;
}
function activateBehavior(record) {
  if (record.status !== "pending" || record.controller.signal.aborted) return;
  record.status = "active";
  reconcileBehavior(record);
}
function registerBehavior(root, entry) {
  assertActiveRoot(root);
  if (entry === null || typeof entry !== "object" || typeof entry.adopt !== "function") {
    throw new Error("A behavior entry requires an adopt(element, context) function.");
  }
  if (typeof entry.target !== "string") {
    assertContainedElement(root, entry.target, "A behavior target");
  } else {
    root.dom.matches(root.container, entry.target);
  }
  if (entry.id !== void 0 && root.byId.has(entry.id)) {
    throw new Error(`A behavior with identity ${JSON.stringify(entry.id)} is already registered.`);
  }
  const dependencies = [];
  for (const id of entry.dependencies ?? []) {
    const dependency = root.byId.get(id);
    if (dependency === void 0) {
      throw new Error(`Behavior dependency ${JSON.stringify(id)} is not registered.`);
    }
    dependencies.push(dependency);
  }
  for (const existing of root.behaviors) {
    if (entry.id !== void 0 && existing.entry.conflicts?.includes(entry.id) || existing.entry.id !== void 0 && entry.conflicts?.includes(existing.entry.id)) {
      throw new Error("The requested behavior conflicts with an existing behavior registration.");
    }
  }
  const controller = createController(root.document);
  const readiness = createReadiness();
  const record = {
    root,
    entry,
    controller,
    ready: readiness,
    status: "pending",
    adoptions: /* @__PURE__ */ new Map(),
    pendingCount: 0,
    waiting: /* @__PURE__ */ new Set(),
    queue: [],
    head: 0,
    flushDepth: 0,
    unlinks: [linkSignal(root.controller.signal, controller)],
    scanned: false
  };
  const registration = {
    ...entry.id === void 0 ? {} : { id: entry.id },
    signal: controller.signal,
    ready: readiness.promise,
    dispose: () => disposeBehavior(record)
  };
  if (entry.signal !== void 0) record.unlinks.push(linkSignal(entry.signal, controller));
  if (controller.signal.aborted) {
    disposeBehavior(record);
    return registration;
  }
  root.behaviors.add(record);
  if (entry.id !== void 0) root.byId.set(entry.id, record);
  controller.signal.addEventListener("abort", () => disposeBehavior(record), { once: true });
  try {
    installListeners(root, entry.events);
    ensureObserver(root);
    root.registry.capture?.flush();
  } catch (error) {
    disposeBehavior(record);
    throw error;
  }
  const blockers = [];
  if (entry.ready !== void 0) blockers.push(entry.ready);
  for (const dependency of dependencies) {
    if (!dependency.ready.settled) blockers.push(dependency.ready.promise);
  }
  if (blockers.length === 0) {
    activateBehavior(record);
  } else {
    const gate = Promise.all(
      blockers.map((blocker) => waitUntilReady(blocker, controller.signal))
    ).then(
      () => activateBehavior(record),
      (error) => {
        if (!controller.signal.aborted) failBehavior(record, error);
      }
    );
    trackPending(root, gate);
  }
  return registration;
}
function disposeRange(record) {
  if (record.status === "disposed") return;
  const failed = record.status === "failed";
  record.status = "disposed";
  record.controller.abort();
  for (const unlink of record.unlinks) unlink();
  record.unlinks.length = 0;
  record.root.ranges.delete(record);
  if (record.root.registry.ranges.get(record.element) === record) {
    record.root.registry.ranges.delete(record.element);
  }
  if (!failed) record.ready.resolve();
  if (!record.root.disposed) refreshDocument(record.root.registry);
}
function registerExternalRange(root, element, options) {
  assertActiveRoot(root);
  assertContainedElement(root, element, "An externally owned range");
  if (options === null || typeof options !== "object" || !("owner" in options)) {
    throw new Error("An external range requires an explicit owner identity.");
  }
  const existing = root.registry.ranges.get(element);
  if (existing !== void 0) {
    if (existing.root === root && Object.is(existing.owner, options.owner) && !options.replace) {
      return existing.publicRange;
    }
    if (!options.replace) {
      throw new Error("External ownership conflict: pass replace: true to hand this range off.");
    }
    if (!options.signal?.aborted) disposeRange(existing);
  }
  const controller = createController(root.document);
  const readiness = createReadiness();
  const record = {
    root,
    element,
    owner: options.owner,
    controller,
    ready: readiness,
    status: options.ready === void 0 ? "ready" : "pending",
    unlinks: [linkSignal(root.controller.signal, controller)],
    publicRange: void 0
  };
  const range = {
    element,
    owner: options.owner,
    signal: controller.signal,
    ready: readiness.promise,
    dispose: () => disposeRange(record)
  };
  record.publicRange = range;
  if (options.signal !== void 0) record.unlinks.push(linkSignal(options.signal, controller));
  if (controller.signal.aborted) {
    disposeRange(record);
    return range;
  }
  root.ranges.add(record);
  root.registry.ranges.set(element, record);
  controller.signal.addEventListener("abort", () => disposeRange(record), { once: true });
  refreshDocument(root.registry);
  if (options.ready === void 0) {
    readiness.resolve();
  } else {
    const gate = waitUntilReady(options.ready, controller.signal).then(
      () => {
        if (record.status !== "pending") return;
        record.status = "ready";
        refreshDocument(root.registry);
        readiness.resolve();
      },
      (error) => {
        if (controller.signal.aborted || record.status !== "pending") return;
        try {
          for (const candidateRoot of [...root.registry.roots.values()]) {
            for (const behavior of [...candidateRoot.behaviors]) {
              if (!dependsOnRange(behavior, record)) continue;
              try {
                failBehavior(behavior, error);
              } catch {
              }
            }
          }
        } finally {
          record.status = "failed";
          readiness.reject(error);
          try {
            disposeRange(record);
          } catch {
          }
        }
      }
    );
    trackPending(root, gate);
  }
  return range;
}
function disposeRoot(root, options = {}) {
  if (root.disposed) return;
  root.registry.capture?.dispose(root);
  const releasedExternalOwnership = root.ranges.size !== 0;
  root.disposed = true;
  root.controller.abort();
  root.unlinkSignal?.();
  root.unlinkSignal = null;
  root.observer?.disconnect();
  root.observer = null;
  let firstError;
  for (const behavior of [...root.behaviors]) {
    try {
      disposeBehavior(behavior);
    } catch (error) {
      firstError ??= error;
    }
  }
  for (const range of [...root.ranges]) {
    try {
      disposeRange(range);
    } catch (error) {
      firstError ??= error;
    }
  }
  for (const [event, listener] of root.listeners) {
    root.container.removeEventListener(event, listener, true);
  }
  root.listeners.clear();
  if (root.registry.roots.get(root.container) === root) {
    root.registry.roots.delete(root.container);
  }
  if (root.registry.roots.size === 0 && root.registry.ranges.size === 0) {
    documentRegistries.delete(root.document);
  }
  if (options.preserveDOM === false) root.container.replaceChildren();
  if (releasedExternalOwnership && root.registry.roots.size !== 0) {
    try {
      refreshDocument(root.registry);
    } catch (error) {
      firstError ??= error;
    }
  }
  if (firstError !== void 0) throw firstError;
}
function attachBehaviorRoot(container, options = {}) {
  const capture = options.formSubmissions;
  const document = capture === void 0 ? isElement(container) ? container.ownerDocument : null : capture.document(container);
  if (document === null) {
    throw new Error("A behavior root requires an element with an owner document.");
  }
  let registry = registryFor(document);
  const existing = registry.roots.get(container);
  if (existing !== void 0) {
    if (!options.replace) {
      throw new Error(
        "This container already has a behavior root; pass replace: true to replace it."
      );
    }
    if (!options.signal?.aborted) {
      disposeRoot(existing);
      registry = registryFor(document);
    }
  }
  const controller = createController(document);
  const record = {
    container,
    document,
    dom: DEFAULT_DOM,
    registry,
    controller,
    behaviors: /* @__PURE__ */ new Set(),
    byId: /* @__PURE__ */ new Map(),
    ranges: /* @__PURE__ */ new Set(),
    pending: /* @__PURE__ */ new Set(),
    listeners: /* @__PURE__ */ new Map(),
    observer: null,
    disposed: false,
    unlinkSignal: null
  };
  const root = {
    container,
    signal: controller.signal,
    get ready() {
      const waiting = [...record.pending];
      for (const range of record.ranges) waiting.push(range.ready.promise);
      for (const behavior of record.behaviors) waiting.push(behavior.ready.promise);
      const ready = Promise.all(waiting).then(() => void 0);
      void ready.catch(() => void 0);
      return ready;
    },
    registerExternalRange: (element, rangeOptions) => registerExternalRange(record, element, rangeOptions),
    registerBehavior: (entry) => registerBehavior(record, entry),
    dispose: (disposeOptions) => disposeRoot(record, disposeOptions)
  };
  if (options.signal !== void 0) record.unlinkSignal = linkSignal(options.signal, controller);
  if (controller.signal.aborted) {
    disposeRoot(record);
  } else {
    registry.roots.set(container, record);
    try {
      capture?.(record, flushQueuedEvents, failBehavior, nearestRange, rangeMatches, CANCELED);
    } catch (error) {
      disposeRoot(record);
      throw error;
    }
    controller.signal.addEventListener("abort", () => disposeRoot(record), { once: true });
    if (controller.signal.aborted) disposeRoot(record);
  }
  return root;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  adoptBindings,
  attachBehaviorRoot,
  captureFormSubmissions,
  mountBindings,
  unbound
});
