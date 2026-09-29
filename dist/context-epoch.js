const EPOCH_CELL = globalThis[/* @__PURE__ */ Symbol.for("octane.contextEpoch")] ??= {
  value: 0
};
function contextEpochNow() {
  return EPOCH_CELL.value;
}
function bumpContextEpoch() {
  EPOCH_CELL.value++;
}
export {
  bumpContextEpoch,
  contextEpochNow
};
