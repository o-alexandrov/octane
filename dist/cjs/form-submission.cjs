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
var form_submission_exports = {};
__export(form_submission_exports, {
  EARLY_FORM_SUBMISSIONS_KEY: () => EARLY_FORM_SUBMISSIONS_KEY,
  EARLY_FORM_SUBMISSIONS_LIMIT: () => EARLY_FORM_SUBMISSIONS_LIMIT,
  EARLY_FORM_SUBMISSIONS_TIMEOUT_MS: () => EARLY_FORM_SUBMISSIONS_TIMEOUT_MS,
  FORM_SUBMISSION_ATTR: () => FORM_SUBMISSION_ATTR,
  formSubmissionControl: () => formSubmissionControl,
  getEarlyFormSubmissionMailbox: () => getEarlyFormSubmissionMailbox,
  isEarlyFormSubmissionCurrent: () => isEarlyFormSubmissionCurrent,
  isEarlyFormSubmitActivation: () => isEarlyFormSubmitActivation
});
module.exports = __toCommonJS(form_submission_exports);
var import_hydration_markers = require("./hydration-markers.cjs");
var import_native_intent = require("./hydration/native-intent.cjs");
const FORM_SUBMISSION_ATTR = "data-octane-capture-submit";
const EARLY_FORM_SUBMISSIONS_KEY = "__octaneEarlyFormSubmissions";
const EARLY_FORM_SUBMISSIONS_LIMIT = 256;
const EARLY_FORM_SUBMISSIONS_TIMEOUT_MS = 3e4;
function getEarlyFormSubmissionMailbox(ownerDocument) {
  const candidate = ownerDocument[EARLY_FORM_SUBMISSIONS_KEY];
  return candidate?.version === 1 && Array.isArray(candidate.q) && typeof candidate.captures === "function" && typeof candidate.has === "function" && typeof candidate.flush === "function" && typeof candidate.release === "function" && typeof candidate.stop === "function" ? candidate : void 0;
}
function isEarlyFormSubmissionCurrent(record, ownerDocument) {
  const form = record.form;
  const ElementConstructor = ownerDocument.defaultView?.Element ?? globalThis.Element;
  const dom = (0, import_native_intent.getNativeHydrationDOM)(ownerDocument);
  return record.event.target === form && dom.owner(form) === ownerDocument && dom.connected(form) && dom.parent(form) === record.parent && ElementConstructor.prototype.getAttribute.call(form, FORM_SUBMISSION_ATTR) === record.key && ElementConstructor.prototype.closest.call(form, `[${import_hydration_markers.HYDRATE_INDEPENDENT_ATTR}]`) === record.boundary && (record.boundary === null || ElementConstructor.prototype.getAttribute.call(record.boundary, import_hydration_markers.HYDRATE_ID_ATTR) === record.boundaryId);
}
function formSubmissionControl(target) {
  const ownerDocument = (0, import_native_intent.getNativeHydrationDocument)(target);
  const ElementConstructor = ownerDocument.defaultView?.Element ?? globalThis.Element;
  const control = ElementConstructor.prototype.closest.call(target, "button,input");
  return control !== null && (control.localName === "button" ? control.type === "submit" : control.type === "submit" || control.type === "image") ? control : null;
}
function isEarlyFormSubmitActivation(event) {
  if (event.type !== "click") return false;
  const target = event.target;
  const ownerDocument = (0, import_native_intent.getNativeHydrationDocument)(target);
  if (ownerDocument === null) return false;
  const element = target;
  if (getEarlyFormSubmissionMailbox(ownerDocument) === void 0) return false;
  const form = formSubmissionControl(element)?.form;
  const ElementConstructor = ownerDocument.defaultView?.Element ?? globalThis.Element;
  return form != null && !!ElementConstructor.prototype.getAttribute.call(form, FORM_SUBMISSION_ATTR);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EARLY_FORM_SUBMISSIONS_KEY,
  EARLY_FORM_SUBMISSIONS_LIMIT,
  EARLY_FORM_SUBMISSIONS_TIMEOUT_MS,
  FORM_SUBMISSION_ATTR,
  formSubmissionControl,
  getEarlyFormSubmissionMailbox,
  isEarlyFormSubmissionCurrent,
  isEarlyFormSubmitActivation
});
