const HYDRATE_INTERACTION_EVENTS_ATTR = "data-octane-hydrate-interaction-events";
const HYDRATE_SELECTION_ATTR = "data-octane-hydrate-selection";
const EARLY_HYDRATION_INTENTS_KEY = "__octaneEarlyHydrationIntents";
const EARLY_HYDRATION_INTENTS_LIMIT = 256;
const HYDRATE_SUPPORTED_INTERACTION_EVENTS = [
  "auxclick",
  "beforeinput",
  "click",
  "compositionend",
  "compositionstart",
  "compositionupdate",
  "contextmenu",
  "dblclick",
  "focusin",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mouseenter",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointerenter",
  "pointerover",
  "pointerup",
  "touchend",
  "touchstart"
];
const HYDRATE_NATIVE_DEFAULT_INTERACTION_EVENTS = [
  "beforeinput",
  "compositionend",
  "compositionstart",
  "compositionupdate",
  "input",
  "mousedown",
  "pointerdown",
  "touchend",
  "touchstart"
];
const HYDRATE_DEFAULT_INTERACTION_EVENTS = [
  "pointerenter",
  "focusin",
  "pointerdown",
  "touchstart",
  "touchend",
  "beforeinput",
  "input",
  "compositionstart",
  "compositionupdate",
  "compositionend",
  "click"
];
export {
  EARLY_HYDRATION_INTENTS_KEY,
  EARLY_HYDRATION_INTENTS_LIMIT,
  HYDRATE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_INTERACTION_EVENTS_ATTR,
  HYDRATE_NATIVE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_SELECTION_ATTR,
  HYDRATE_SUPPORTED_INTERACTION_EVENTS
};
