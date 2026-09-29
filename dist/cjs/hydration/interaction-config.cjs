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
var interaction_config_exports = {};
__export(interaction_config_exports, {
  EARLY_HYDRATION_INTENTS_KEY: () => EARLY_HYDRATION_INTENTS_KEY,
  EARLY_HYDRATION_INTENTS_LIMIT: () => EARLY_HYDRATION_INTENTS_LIMIT,
  HYDRATE_DEFAULT_INTERACTION_EVENTS: () => HYDRATE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_INTERACTION_EVENTS_ATTR: () => HYDRATE_INTERACTION_EVENTS_ATTR,
  HYDRATE_NATIVE_DEFAULT_INTERACTION_EVENTS: () => HYDRATE_NATIVE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_SELECTION_ATTR: () => HYDRATE_SELECTION_ATTR,
  HYDRATE_SUPPORTED_INTERACTION_EVENTS: () => HYDRATE_SUPPORTED_INTERACTION_EVENTS
});
module.exports = __toCommonJS(interaction_config_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EARLY_HYDRATION_INTENTS_KEY,
  EARLY_HYDRATION_INTENTS_LIMIT,
  HYDRATE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_INTERACTION_EVENTS_ATTR,
  HYDRATE_NATIVE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_SELECTION_ATTR,
  HYDRATE_SUPPORTED_INTERACTION_EVENTS
});
