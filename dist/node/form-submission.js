import { HYDRATE_ID_ATTR, HYDRATE_INDEPENDENT_ATTR } from "./hydration-markers.js";
import { getNativeHydrationDocument, getNativeHydrationDOM } from "./hydration/native-intent.js";
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
  const dom = getNativeHydrationDOM(ownerDocument);
  return record.event.target === form && dom.owner(form) === ownerDocument && dom.connected(form) && dom.parent(form) === record.parent && ElementConstructor.prototype.getAttribute.call(form, FORM_SUBMISSION_ATTR) === record.key && ElementConstructor.prototype.closest.call(form, `[${HYDRATE_INDEPENDENT_ATTR}]`) === record.boundary && (record.boundary === null || ElementConstructor.prototype.getAttribute.call(record.boundary, HYDRATE_ID_ATTR) === record.boundaryId);
}
function formSubmissionControl(target) {
  const ownerDocument = getNativeHydrationDocument(target);
  const ElementConstructor = ownerDocument.defaultView?.Element ?? globalThis.Element;
  const control = ElementConstructor.prototype.closest.call(target, "button,input");
  return control !== null && (control.localName === "button" ? control.type === "submit" : control.type === "submit" || control.type === "image") ? control : null;
}
function isEarlyFormSubmitActivation(event) {
  if (event.type !== "click") return false;
  const target = event.target;
  const ownerDocument = getNativeHydrationDocument(target);
  if (ownerDocument === null) return false;
  const element = target;
  if (getEarlyFormSubmissionMailbox(ownerDocument) === void 0) return false;
  const form = formSubmissionControl(element)?.form;
  const ElementConstructor = ownerDocument.defaultView?.Element ?? globalThis.Element;
  return form != null && !!ElementConstructor.prototype.getAttribute.call(form, FORM_SUBMISSION_ATTR);
}
export {
  EARLY_FORM_SUBMISSIONS_KEY,
  EARLY_FORM_SUBMISSIONS_LIMIT,
  EARLY_FORM_SUBMISSIONS_TIMEOUT_MS,
  FORM_SUBMISSION_ATTR,
  formSubmissionControl,
  getEarlyFormSubmissionMailbox,
  isEarlyFormSubmissionCurrent,
  isEarlyFormSubmitActivation
};
