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
var owner_context_exports = {};
__export(owner_context_exports, {
  activeSignalOwnerEnvironment: () => installedEnvironment,
  activeSynchronousSignalOwner: () => synchronousOwner,
  captureSignalOwner: () => captureSignalOwner,
  currentExplicitSignalOwner: () => currentExplicitSignalOwner,
  currentSignalOwner: () => currentSignalOwner,
  enterSynchronousSignalOwner: () => enterSynchronousSignalOwner,
  installDefaultSignalOwner: () => installDefaultSignalOwner,
  installSignalOwnerEnvironment: () => installSignalOwnerEnvironment,
  installSignalOwnerRetirement: () => installSignalOwnerRetirement,
  restoreSynchronousSignalOwner: () => restoreSynchronousSignalOwner,
  retireSignalOwnerIdentity: () => retireSignalOwnerIdentity,
  runWithSignalOwner: () => runWithSignalOwner
});
module.exports = __toCommonJS(owner_context_exports);
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
let installedEnvironment;
let synchronousOwner = null;
let defaultOwner;
let retireOwner;
function installSignalOwnerEnvironment(environment) {
  if (!environment || typeof environment.current !== "function" || typeof environment.run !== "function" || typeof environment.capture !== "function") {
    throw new TypeError(__octaneDev ? "A signal owner environment requires current, run, and capture." : __octaneNoArgError(189));
  }
  const previous = installedEnvironment;
  installedEnvironment = environment;
  return () => {
    if (installedEnvironment === environment)
      installedEnvironment = previous;
  };
}
function currentSignalOwner() {
  if (installedEnvironment !== void 0)
    return installedEnvironment.current() ?? synchronousOwner;
  return synchronousOwner ?? defaultOwner?.() ?? null;
}
function currentExplicitSignalOwner() {
  return installedEnvironment?.current() ?? synchronousOwner;
}
function installDefaultSignalOwner(current) {
  if (typeof current !== "function")
    throw new TypeError(__octaneDev ? "A default signal owner requires a provider." : __octaneNoArgError(190));
  const previous = defaultOwner;
  defaultOwner = current;
  return () => {
    if (defaultOwner === current)
      defaultOwner = previous;
  };
}
function runWithSignalOwner(owner, callback) {
  if (typeof callback !== "function")
    throw new TypeError(__octaneDev ? "A signal owner callback is required." : __octaneNoArgError(191));
  if (installedEnvironment)
    return installedEnvironment.run(owner, callback);
  const previous = synchronousOwner;
  synchronousOwner = owner;
  try {
    return callback();
  } finally {
    synchronousOwner = previous;
  }
}
function enterSynchronousSignalOwner(owner) {
  if (installedEnvironment !== void 0)
    return void 0;
  const previous = synchronousOwner;
  synchronousOwner = owner;
  return previous;
}
function restoreSynchronousSignalOwner(previous) {
  synchronousOwner = previous;
}
function captureSignalOwner(owner) {
  return installedEnvironment?.capture(owner) ?? ((callback) => runWithSignalOwner(owner, callback));
}
function retireSignalOwnerIdentity(owner) {
  retireOwner?.(owner);
}
function installSignalOwnerRetirement(retire) {
  const previous = retireOwner;
  retireOwner = retire;
  return () => {
    if (retireOwner === retire)
      retireOwner = previous;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activeSignalOwnerEnvironment,
  activeSynchronousSignalOwner,
  captureSignalOwner,
  currentExplicitSignalOwner,
  currentSignalOwner,
  enterSynchronousSignalOwner,
  installDefaultSignalOwner,
  installSignalOwnerEnvironment,
  installSignalOwnerRetirement,
  restoreSynchronousSignalOwner,
  retireSignalOwnerIdentity,
  runWithSignalOwner
});
