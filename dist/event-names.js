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
export {
  isDelegatedEventProp
};
