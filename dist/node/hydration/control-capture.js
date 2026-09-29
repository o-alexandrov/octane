import {
  HYDRATE_ID_ATTR,
  HYDRATE_INDEPENDENT_ATTR,
  HYDRATE_INPUT_ATTR,
  HYDRATE_MARKER_SELECTOR,
  HYDRATE_WHEN_ATTR
} from "../hydration-markers.js";
import {
  EARLY_HYDRATION_INTENTS_KEY,
  HYDRATE_INTERACTION_EVENTS_ATTR
} from "./interaction-config.js";
import {
  claimEarlyHydrationControlCapture,
  clearEarlyHydrationControlRevision,
  publishHydrationControlSignalValues,
  readEarlyHydrationControlRevision
} from "../signals/early-values.js";
const HYDRATE_CONTROL_DOCUMENTS = /* @__PURE__ */ new WeakSet();
function isEarlyHydrationIntentCurrent([event, target, boundary, id, when, events, , , formSubmission], ownerDocument) {
  if (formSubmission) return false;
  return event.target === target && target.isConnected && boundary.isConnected && target.ownerDocument === ownerDocument && boundary.ownerDocument === ownerDocument && target.closest(`[${HYDRATE_INDEPENDENT_ATTR}]`) === boundary && boundary.getAttribute(HYDRATE_ID_ATTR) === id && boundary.getAttribute(HYDRATE_WHEN_ATTR) === when && boundary.getAttribute(HYDRATE_INTERACTION_EVENTS_ATTR) === events;
}
function isHydrationElement(target) {
  return target !== null && target.nodeType === 1;
}
const HYDRATE_CONTROL_RECORDS = /* @__PURE__ */ new WeakMap();
function hydrationControl(target) {
  if (!isHydrationElement(target)) return null;
  const tag = target.localName;
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable ? target : null;
}
function hydrationControlRecord(control) {
  let record = HYDRATE_CONTROL_RECORDS.get(control);
  if (record === void 0) {
    const revision = readEarlyHydrationControlRevision(control);
    record = { editRevision: revision, selectionRevision: 0, revision, composing: false };
    HYDRATE_CONTROL_RECORDS.set(control, record);
  }
  return record;
}
function recordHydrationControlEvent(event) {
  const control = hydrationControl(event.target);
  if (control === null) return;
  const record = hydrationControlRecord(control);
  switch (event.type) {
    case "input":
      record.editRevision++;
      record.revision++;
      publishHydrationControlSignalValues(control, record.revision);
      break;
    case "compositionstart":
      record.composing = true;
      record.revision++;
      break;
    case "compositionupdate":
      record.revision++;
      break;
    case "compositionend":
      record.composing = false;
      record.revision++;
      break;
    case "focusin":
    case "focusout":
      record.revision++;
  }
}
function recordHydrationSelection(event) {
  const ownerDocument = event.currentTarget;
  const control = hydrationControl(ownerDocument.activeElement);
  if (control === null) return;
  const record = hydrationControlRecord(control);
  record.selectionRevision++;
  record.revision++;
}
function snapshotHydrationControl(control) {
  if (hydrationControl(control) === null) return null;
  const record = HYDRATE_CONTROL_RECORDS.get(control);
  const earlyRevision = record === void 0 ? readEarlyHydrationControlRevision(control) : 0;
  const input = control;
  let value;
  let checked;
  let selectedValues;
  let selectionStart = null;
  let selectionEnd = null;
  let selectionDirection = null;
  if (control.localName === "select") {
    const select = input;
    value = select.value;
    if (select.multiple)
      selectedValues = Array.from(select.selectedOptions, (option) => option.value);
  } else if (control.isContentEditable) {
    value = control.textContent ?? "";
  } else {
    value = input.value;
    if (control.localName === "input") checked = input.checked;
    try {
      selectionStart = input.selectionStart;
      selectionEnd = input.selectionEnd;
      selectionDirection = input.selectionDirection;
    } catch {
    }
  }
  return {
    editRevision: record?.editRevision ?? earlyRevision,
    selectionRevision: record?.selectionRevision ?? 0,
    revision: record?.revision ?? earlyRevision,
    value,
    ...checked === void 0 ? {} : { checked },
    ...selectedValues === void 0 ? {} : { selectedValues },
    selectionStart,
    selectionEnd,
    selectionDirection,
    focused: control.ownerDocument.activeElement === control,
    composing: record?.composing ?? false
  };
}
function isRestoredHydrationTextarea(control, value) {
  if (control.localName !== "textarea" || typeof value !== "string" || HYDRATE_CONTROL_RECORDS.get(control)?.composing === true)
    return false;
  const textarea = control;
  const baseline = textarea.defaultValue.replace(/\r\n?/g, "\n");
  return value.replace(/\r\n?/g, "\n") === baseline && textarea.value !== baseline;
}
function captureHydrationControlCandidate(control) {
  const snapshot = snapshotHydrationControl(control);
  if (snapshot === null) return null;
  initializeHydrationControlCapture(control.ownerDocument);
  return {
    control,
    bindingId: control.getAttribute(HYDRATE_INPUT_ATTR),
    boundaryId: control.closest(HYDRATE_MARKER_SELECTOR)?.getAttribute(HYDRATE_ID_ATTR) ?? null,
    snapshot
  };
}
function sameHydrationControlValue(left, right) {
  if (left.value !== right.value || left.checked !== right.checked) return false;
  const a = left.selectedValues;
  const b = right.selectedValues;
  if (a === void 0 || b === void 0) return a === b;
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index++) if (a[index] !== b[index]) return false;
  return true;
}
function applyHydrationControlCandidate(candidate, value) {
  const control = candidate.control;
  if (!control.isConnected || control.getAttribute(HYDRATE_INPUT_ATTR) !== candidate.bindingId || (control.closest(HYDRATE_MARKER_SELECTOR)?.getAttribute(HYDRATE_ID_ATTR) ?? null) !== candidate.boundaryId) {
    return false;
  }
  const current = snapshotHydrationControl(control);
  if (current === null || current.revision !== candidate.snapshot.revision || current.editRevision !== candidate.snapshot.editRevision || current.composing || !sameHydrationControlValue(current, candidate.snapshot)) {
    return false;
  }
  if (control.localName === "select") {
    const select = control;
    if (select.multiple && value.selectedValues !== void 0) {
      const selected = new Set(value.selectedValues);
      for (const option of select.options) option.selected = selected.has(option.value);
    } else if (value.value !== void 0) {
      select.value = value.value;
    } else {
      return false;
    }
  } else if (control.isContentEditable) {
    if (value.value === void 0) return false;
    control.textContent = value.value;
  } else {
    const input = control;
    if (value.value !== void 0) input.value = value.value;
    else if (control.localName !== "input" || value.checked === void 0) return false;
    if (control.localName === "input" && value.checked !== void 0) {
      input.checked = value.checked;
    }
  }
  if (current.focused && current.selectionStart !== null && current.selectionEnd !== null && control.localName !== "select" && !control.isContentEditable) {
    try {
      control.setSelectionRange(
        current.selectionStart,
        current.selectionEnd,
        current.selectionDirection ?? void 0
      );
    } catch {
    }
  }
  const record = hydrationControlRecord(control);
  record.editRevision++;
  record.revision++;
  publishHydrationControlSignalValues(control, record.revision);
  return true;
}
function consumeHydrationControl(control, revision) {
  initializeHydrationControlCapture(control.ownerDocument);
  const record = hydrationControlRecord(control);
  if (record.revision !== revision) return false;
  record.editRevision = 0;
  record.selectionRevision = 0;
  clearEarlyHydrationControlRevision(control);
  return true;
}
function initializeHydrationControlCapture(ownerDocument) {
  const targetDocument = ownerDocument ?? (typeof document === "undefined" ? void 0 : document);
  if (targetDocument === void 0 || HYDRATE_CONTROL_DOCUMENTS.has(targetDocument)) return;
  HYDRATE_CONTROL_DOCUMENTS.add(targetDocument);
  const mailbox = targetDocument[EARLY_HYDRATION_INTENTS_KEY];
  const target = typeof mailbox?.stop === "function" ? targetDocument.defaultView ?? targetDocument : targetDocument;
  const record = target === targetDocument ? recordHydrationControlEvent : (event) => {
    if (event.target?.ownerDocument === targetDocument)
      recordHydrationControlEvent(event);
  };
  for (const event of [
    "input",
    "compositionstart",
    "compositionupdate",
    "compositionend",
    "focusin",
    "focusout"
  ]) {
    target.addEventListener(event, record, true);
  }
  targetDocument.addEventListener("selectionchange", recordHydrationSelection, true);
  claimEarlyHydrationControlCapture(targetDocument);
  for (const intent of mailbox?.q ?? []) {
    const [event] = intent;
    const control = hydrationControl(event.target);
    if (control === null || !isEarlyHydrationIntentCurrent(intent, targetDocument)) continue;
    if (event.type === "input" && readEarlyHydrationControlRevision(control) > 0) continue;
    recordHydrationControlEvent(event);
  }
}
export {
  applyHydrationControlCandidate,
  captureHydrationControlCandidate,
  consumeHydrationControl,
  initializeHydrationControlCapture,
  isEarlyHydrationIntentCurrent,
  isRestoredHydrationTextarea,
  snapshotHydrationControl
};
