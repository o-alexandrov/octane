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
var behavior_form_submissions_exports = {};
__export(behavior_form_submissions_exports, {
  captureFormSubmissions: () => captureFormSubmissions
});
module.exports = __toCommonJS(behavior_form_submissions_exports);
var import_form_submission = require("./form-submission.cjs");
var import_hydration_markers = require("./hydration-markers.cjs");
var import_interaction_config = require("./hydration/interaction-config.cjs");
var import_event_capture = require("./hydration/event-capture.cjs");
var import_native_intent = require("./hydration/native-intent.cjs");
let earlySubmissionRanges;
let earlySubmissionRoots;
let controllers;
function captureFormSubmissions() {
  const capture = (root, flush, fail, range, matches, canceled) => {
    root.dom = (0, import_native_intent.getNativeHydrationDOM)(root.document);
    const mailbox = (0, import_form_submission.getEarlyFormSubmissionMailbox)(root.document);
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
  capture.document = import_native_intent.getNativeHydrationDocument;
  return capture;
}
function installFormSubmissionActivation(document, mailbox) {
  let feature = (0, import_native_intent.getNativeHydrationCapture)(document);
  if (feature?.push !== void 0) return;
  if (feature === void 0) {
    feature = { skip: import_form_submission.isEarlyFormSubmitActivation };
    document[import_native_intent.NATIVE_HYDRATION_CAPTURE_KEY] = feature;
  }
  const seen = /* @__PURE__ */ new WeakSet();
  const elementPrototype = formSubmissionElementPrototype(document);
  const dom = (0, import_native_intent.getNativeHydrationDOM)(document);
  const queued = (packet) => {
    const [event, form, boundary, id, when, events] = packet;
    if (!packet[8] || seen.has(event)) return;
    seen.add(event);
    const record = mailbox.q.find((submission) => submission.event === event);
    const parent = record === void 0 ? dom.parent(form) : record.parent;
    const key = record?.key ?? elementPrototype.getAttribute.call(form, import_form_submission.FORM_SUBMISSION_ATTR);
    const current = () => !record?.discarded && (record?.valid?.() ?? true) && mailbox.captures(form) && event.target === form && dom.connected(form) && dom.connected(boundary) && dom.owner(form) === document && dom.owner(boundary) === document && dom.parent(form) === parent && elementPrototype.getAttribute.call(form, import_form_submission.FORM_SUBMISSION_ATTR) === key && elementPrototype.closest.call(form, `[${import_hydration_markers.HYDRATE_INDEPENDENT_ATTR}]`) === boundary && elementPrototype.getAttribute.call(boundary, import_hydration_markers.HYDRATE_ID_ATTR) === id && (when === "interaction" || when === "dynamic") && elementPrototype.getAttribute.call(boundary, import_hydration_markers.HYDRATE_WHEN_ATTR) === when && elementPrototype.getAttribute.call(boundary, import_interaction_config.HYDRATE_INTERACTION_EVENTS_ATTR) === events;
    (0, import_event_capture.captureNativeHydrationIntent)(boundary, event, current);
  };
  feature.push = queued;
  (0, import_event_capture.initializeHydrationEventCapture)(document);
  const host = document;
  const intents = host[import_interaction_config.EARLY_HYDRATION_INTENTS_KEY];
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
  return (0, import_native_intent.getNativeHydrationDOM)(root.document).contains(root.container, form);
}
function matchesFormSubmissionTarget(record, form) {
  return typeof record.entry.target === "string" ? formSubmissionElementPrototype(record.root.document).matches.call(form, record.entry.target) : record.entry.target === form;
}
function receiveEarlyFormSubmission(document, registry, mailbox, submission, enabledRoots, services) {
  if (submission.snapshot === void 0) return false;
  if (!(0, import_form_submission.isEarlyFormSubmissionCurrent)(submission, document)) return true;
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
    rangeElement = (0, import_native_intent.getNativeHydrationDOM)(document).parent(rangeElement);
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
      const valid = !submission.discarded && !record.controller.signal.aborted && !record.root.controller.signal.aborted && mailbox.captures(submission.form) && containsFormSubmission(record.root, submission.form) && (0, import_form_submission.isEarlyFormSubmissionCurrent)(submission, document) && services.range(record.root, submission.form) === range;
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
    if (!record.controller.signal.aborted && containsFormSubmission(record.root, submission.form) && matchesFormSubmissionTarget(record, submission.form) && services.range(record.root, submission.form) === range && (0, import_form_submission.isEarlyFormSubmissionCurrent)(submission, document))
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
  const mailbox = (0, import_form_submission.getEarlyFormSubmissionMailbox)(record.root.document);
  if (mailbox === void 0) return;
  const elementPrototype = formSubmissionElementPrototype(record.root.document);
  for (const form of elementPrototype.querySelectorAll.call(
    record.root.container,
    `form[${import_form_submission.FORM_SUBMISSION_ATTR}]`
  )) {
    if (elementPrototype.getAttribute.call(form, import_form_submission.FORM_SUBMISSION_ATTR) === record.entry.id && matchesFormSubmissionTarget(record, form) && services.matches(record, services.range(record.root, form)) && !hasNestedSubmissionOwner(record.root, form))
      mailbox.release(form);
  }
  if (elementPrototype.matches.call(record.root.container, "form") && elementPrototype.getAttribute.call(record.root.container, import_form_submission.FORM_SUBMISSION_ATTR) === record.entry.id && matchesFormSubmissionTarget(record, record.root.container) && services.matches(record, services.range(record.root, record.root.container)) && !hasNestedSubmissionOwner(record.root, record.root.container))
    mailbox.release(record.root.container);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  captureFormSubmissions
});
