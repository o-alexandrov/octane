import { SIGNAL_HANDLE } from "./types.js";
function isSignalHandle(value) {
  return (typeof value === "object" || typeof value === "function") && value !== null && value[SIGNAL_HANDLE] === true;
}
function isWritableSignal(value) {
  return isSignalHandle(value) && value.kind === "signal" && typeof value.set === "function";
}
export {
  isSignalHandle,
  isWritableSignal
};
