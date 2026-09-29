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
var event_names_exports = {};
__export(event_names_exports, {
  isDelegatedEventProp: () => isDelegatedEventProp
});
module.exports = __toCommonJS(event_names_exports);
const names = "Abort AnimationEnd AnimationIteration AnimationStart AuxClick BeforeInput BeforeToggle Blur Cancel CanPlay CanPlayThrough Change Click Close CompositionEnd CompositionStart CompositionUpdate ContextMenu Copy Cut DoubleClick Drag DragEnd DragEnter DragExit DragLeave DragOver DragStart Drop DurationChange Emptied Encrypted Ended Error Focus GotPointerCapture Input Invalid KeyDown KeyPress KeyUp Load LoadedData LoadedMetadata LoadStart LostPointerCapture MouseDown MouseEnter MouseLeave MouseMove MouseOut MouseOver MouseUp Paste Pause Play Playing PointerCancel PointerDown PointerEnter PointerLeave PointerMove PointerOut PointerOver PointerUp Progress RateChange Reset Resize Scroll ScrollEnd Seeked Seeking Select Stalled Submit Suspend TimeUpdate Toggle TouchCancel TouchEnd TouchMove TouchStart TransitionCancel TransitionEnd TransitionRun TransitionStart VolumeChange Waiting Wheel";
let delegatedEventProps;
function isDelegatedEventProp(name) {
  if (delegatedEventProps === void 0) {
    delegatedEventProps = /* @__PURE__ */ new Set();
    for (const event of names.split(" ")) {
      delegatedEventProps.add("on" + event);
      delegatedEventProps.add("on" + event + "Capture");
    }
  }
  return delegatedEventProps.has(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isDelegatedEventProp
});
