import {
  FORM_SUBMISSION_ATTR,
  getEarlyFormSubmissionMailbox,
  isEarlyFormSubmissionCurrent,
  isEarlyFormSubmitActivation
} from "./form-submission.js";
import {
  HYDRATE_ID_ATTR,
  HYDRATE_INDEPENDENT_ATTR,
  HYDRATE_WHEN_ATTR
} from "./hydration-markers.js";
import {
  EARLY_HYDRATION_INTENTS_KEY,
  HYDRATE_INTERACTION_EVENTS_ATTR
} from "./hydration/interaction-config.js";
import {
  captureNativeHydrationIntent,
  initializeHydrationEventCapture
} from "./hydration/event-capture.js";
import {
  getNativeHydrationCapture,
  getNativeHydrationDocument,
  getNativeHydrationDOM,
  NATIVE_HYDRATION_CAPTURE_KEY
} from "./hydration/native-intent.js";
let earlySubmissionRanges;
let earlySubmissionRoots;
let controllers;
function captureFormSubmissions() {
  const capture = (root, flush, fail, range, matches, canceled) => {
    root.dom = getNativeHydrationDOM(root.document);
    const mailbox = getEarlyFormSubmissionMailbox(root.document);
    if (mailbox === void 0) return;
    const services = { flush, fail, range, matches, canceled };
    installFormSubmissionActivation(root.document, mailbox);
    let controller = controllers?.get(root.registry);
    if (controller === void 0) {
      controller = createSubmissionController(root, mailbox, services);
      (controllers ??= /* @__PURE__ */ new WeakMap()).set(root.registry, controller);
      root.registry.capture = controller;
    }
    controller.enabledRoots.add(root);
    controller.flush();
  };
  capture.document = getNativeHydrationDocument;
  return capture;
}
function installFormSubmissionActivation(document, mailbox) {
  let feature = getNativeHydrationCapture(document);
  if (feature?.push !== void 0) return;
  if (feature === void 0) {
    feature = { skip: isEarlyFormSubmitActivation };
    document[NATIVE_HYDRATION_CAPTURE_KEY] = feature;
  }
  const seen = /* @__PURE__ */ new WeakSet();
  const elementPrototype = formSubmissionElementPrototype(document);
  const dom = getNativeHydrationDOM(document);
  const queued = (packet) => {
    const [event, form, boundary, id, when, events] = packet;
    if (!packet[8] || seen.has(event)) return;
    seen.add(event);
    const record = mailbox.q.find((submission) => submission.event === event);
    const parent = record === void 0 ? dom.parent(form) : record.parent;
    const key = record?.key ?? elementPrototype.getAttribute.call(form, FORM_SUBMISSION_ATTR);
    const current = () => !record?.discarded && (record?.valid?.() ?? true) && mailbox.captures(form) && event.target === form && dom.connected(form) && dom.connected(boundary) && dom.owner(form) === document && dom.owner(boundary) === document && dom.parent(form) === parent && elementPrototype.getAttribute.call(form, FORM_SUBMISSION_ATTR) === key && elementPrototype.closest.call(form, `[${HYDRATE_INDEPENDENT_ATTR}]`) === boundary && elementPrototype.getAttribute.call(boundary, HYDRATE_ID_ATTR) === id && (when === "interaction" || when === "dynamic") && elementPrototype.getAttribute.call(boundary, HYDRATE_WHEN_ATTR) === when && elementPrototype.getAttribute.call(boundary, HYDRATE_INTERACTION_EVENTS_ATTR) === events;
    captureNativeHydrationIntent(boundary, event, current);
  };
  feature.push = queued;
  initializeHydrationEventCapture(document);
  const host = document;
  const intents = host[EARLY_HYDRATION_INTENTS_KEY];
  for (const packet of intents?.q.splice(0) ?? []) queued(packet);
  for (const submission of mailbox.q) {
    if (seen.has(submission.event) || submission.boundary === null || submission.boundaryId === null)
      continue;
    intents?.capture?.([
      submission.event,
      submission.form,
      submission.boundary,
      submission.boundaryId,
      submission.boundaryWhen,
      submission.boundaryEvents,
      void 0,
      void 0,
      true,
      submission.sequence
    ]);
  }
}
function createSubmissionController(root, mailbox, services) {
  const registry = root.registry;
  const document = root.document;
  const enabledRoots = /* @__PURE__ */ new Set();
  const receive = (submission) => receiveEarlyFormSubmission(document, registry, mailbox, submission, enabledRoots, services);
  const controller = {
    enabledRoots,
    flush: () => mailbox.flush(),
    skip: (owner, event) => enabledRoots.has(owner) && mailbox.has(event),
    release: (entry) => {
      if (enabledRoots.has(entry.root)) releaseBehaviorSubmissions(entry, services);
    },
    dispose: (owner) => {
      if (registry.roots.get(owner.container) !== owner) return;
      if (enabledRoots.has(owner)) {
        for (const entry of owner.behaviors) releaseBehaviorSubmissions(entry, services);
      }
      for (const submission of [...mailbox.q]) {
        if (containsFormSubmission(owner, submission.form) && !hasNestedSubmissionOwner(owner, submission.form))
          mailbox.release(submission.form);
      }
      enabledRoots.delete(owner);
      if (enabledRoots.size === 0) {
        if (mailbox.receive === receive) mailbox.receive = void 0;
        if (registry.capture === controller) registry.capture = void 0;
        controllers?.delete(registry);
      }
    }
  };
  mailbox.receive = receive;
  return controller;
}
function formSubmissionElementPrototype(document) {
  return (document.defaultView?.Element ?? globalThis.Element).prototype;
}
function containsFormSubmission(root, form) {
  return getNativeHydrationDOM(root.document).contains(root.container, form);
}
function matchesFormSubmissionTarget(record, form) {
  return typeof record.entry.target === "string" ? formSubmissionElementPrototype(record.root.document).matches.call(form, record.entry.target) : record.entry.target === form;
}
function receiveEarlyFormSubmission(document, registry, mailbox, submission, enabledRoots, services) {
  if (submission.snapshot === void 0) return false;
  if (!isEarlyFormSubmissionCurrent(submission, document)) return true;
  const previousRoot = earlySubmissionRoots?.get(submission);
  if (previousRoot !== void 0 && (previousRoot.disposed || previousRoot.controller.signal.aborted || !containsFormSubmission(previousRoot, submission.form))) {
    submission.discarded = true;
    return true;
  }
  let rangeElement = submission.form;
  let acceptedRange;
  while (rangeElement !== null) {
    acceptedRange = registry.ranges.get(rangeElement);
    if (acceptedRange !== void 0) break;
    rangeElement = getNativeHydrationDOM(document).parent(rangeElement);
  }
  const previousRange = earlySubmissionRanges?.get(submission);
  if (previousRange !== void 0 && previousRange !== acceptedRange) {
    submission.discarded = true;
    return true;
  }
  if (acceptedRange !== void 0 && previousRange === void 0)
    (earlySubmissionRanges ??= /* @__PURE__ */ new WeakMap()).set(submission, acceptedRange);
  let ownerRoot;
  for (const root of registry.roots.values()) {
    if (root.disposed || !containsFormSubmission(root, submission.form)) continue;
    if (ownerRoot === void 0 || formSubmissionElementPrototype(document).contains.call(ownerRoot.container, root.container))
      ownerRoot = root;
  }
  if (ownerRoot !== void 0 && previousRoot === void 0)
    (earlySubmissionRoots ??= /* @__PURE__ */ new WeakMap()).set(submission, ownerRoot);
  const record = ownerRoot !== void 0 && enabledRoots.has(ownerRoot) ? ownerRoot.byId.get(submission.key) : void 0;
  if (record === void 0 || record.controller.signal.aborted || !record.entry.events?.includes("submit") || record.entry.captureEvent === void 0 || !matchesFormSubmissionTarget(record, submission.form) || !services.matches(record, services.range(record.root, submission.form)))
    return false;
  const range = services.range(record.root, submission.form);
  const queued = {
    event: submission.event,
    element: submission.form,
    range,
    payload: services.canceled,
    valid: () => {
      const valid = !submission.discarded && !record.controller.signal.aborted && !record.root.controller.signal.aborted && mailbox.captures(submission.form) && containsFormSubmission(record.root, submission.form) && isEarlyFormSubmissionCurrent(submission, document) && services.range(record.root, submission.form) === range;
      if (!valid) submission.discarded = true;
      return valid;
    }
  };
  submission.valid = queued.valid;
  record.queue.push(queued);
  if (range?.status === "pending") record.waiting.add(range);
  record.captureDepth = (record.captureDepth ?? 0) + 1;
  try {
    const payload = record.entry.captureEvent(
      submission.event,
      submission.form,
      submission.snapshot
    );
    if (!record.controller.signal.aborted && containsFormSubmission(record.root, submission.form) && matchesFormSubmissionTarget(record, submission.form) && services.range(record.root, submission.form) === range && isEarlyFormSubmissionCurrent(submission, document))
      queued.payload = payload;
  } catch (error) {
    services.fail(record, error);
    throw error;
  } finally {
    record.captureDepth--;
  }
  submission.snapshot = void 0;
  if (queued.payload === services.canceled) submission.discarded = true;
  services.flush(record);
  return true;
}
function hasNestedSubmissionOwner(root, form) {
  for (const nested of root.registry.roots.values()) {
    if (nested === root || nested.disposed || !formSubmissionElementPrototype(root.document).contains.call(
      root.container,
      nested.container
    ) || !containsFormSubmission(nested, form))
      continue;
    return true;
  }
  return false;
}
function releaseBehaviorSubmissions(record, services) {
  if (record.entry.id === void 0 || !record.entry.events?.includes("submit") || record.entry.captureEvent === void 0)
    return;
  const mailbox = getEarlyFormSubmissionMailbox(record.root.document);
  if (mailbox === void 0) return;
  const elementPrototype = formSubmissionElementPrototype(record.root.document);
  for (const form of elementPrototype.querySelectorAll.call(
    record.root.container,
    `form[${FORM_SUBMISSION_ATTR}]`
  )) {
    if (elementPrototype.getAttribute.call(form, FORM_SUBMISSION_ATTR) === record.entry.id && matchesFormSubmissionTarget(record, form) && services.matches(record, services.range(record.root, form)) && !hasNestedSubmissionOwner(record.root, form))
      mailbox.release(form);
  }
  if (elementPrototype.matches.call(record.root.container, "form") && elementPrototype.getAttribute.call(record.root.container, FORM_SUBMISSION_ATTR) === record.entry.id && matchesFormSubmissionTarget(record, record.root.container) && services.matches(record, services.range(record.root, record.root.container)) && !hasNestedSubmissionOwner(record.root, record.root.container))
    mailbox.release(record.root.container);
}
export {
  captureFormSubmissions
};
