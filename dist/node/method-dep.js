import { hasOwnProp } from "./has-own.js";
const guardedNullReceiver = /* @__PURE__ */ Symbol();
const guardedUndefinedReceiver = /* @__PURE__ */ Symbol();
function __methodDep(receiver, name, guarded = false) {
  if (guarded && receiver == null) {
    return receiver === null ? guardedNullReceiver : guardedUndefinedReceiver;
  }
  if ((typeof receiver !== "object" || receiver === null) && typeof receiver !== "function") {
    return receiver;
  }
  if (guarded) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(receiver, name);
      if (descriptor) return "value" in descriptor ? descriptor.value : receiver;
      return name in receiver ? receiver : void 0;
    } catch {
      return receiver;
    }
  }
  if (hasOwnProp.call(receiver, name)) return receiver[name];
  return name in receiver ? receiver : void 0;
}
export {
  __methodDep
};
