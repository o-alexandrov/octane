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
var query_attempt_observer_exports = {};
__export(query_attempt_observer_exports, {
  captureCurrentServerSignalQueryAttemptObserver: () => captureCurrentServerSignalQueryAttemptObserver,
  hasServerSignalQueryAttemptObserver: () => hasServerSignalQueryAttemptObserver,
  runWithServerSignalQueryAttemptObserver: () => runWithServerSignalQueryAttemptObserver,
  serverSignalQueryAttemptObserver: () => serverSignalQueryAttemptObserver
});
module.exports = __toCommonJS(query_attempt_observer_exports);
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
let CURRENT_OBSERVER;
function runWithServerSignalQueryAttemptObserver(owner, observe, createObservations, callback) {
  const previous = CURRENT_OBSERVER;
  CURRENT_OBSERVER = { owner, observe, createObservations };
  try {
    return callback();
  } finally {
    CURRENT_OBSERVER = previous;
  }
}
function serverSignalQueryAttemptObserver(scopeKey) {
  const context = CURRENT_OBSERVER;
  if (context === void 0)
    return;
  const ownerKey = context.owner.documentOwner.scopeKey;
  if (scopeKey !== ownerKey && scopeKey !== `${ownerKey}:instance:${context.owner.instanceKey}`) {
    return;
  }
  if (typeof context.createObservations !== "function") {
    throw new TypeError(__octaneDev ? "A server signal query observer requires an observation factory." : __octaneNoArgError(192));
  }
  return context;
}
function hasServerSignalQueryAttemptObserver(scopeKey) {
  return serverSignalQueryAttemptObserver(scopeKey) !== void 0;
}
function captureCurrentServerSignalQueryAttemptObserver(scopeKey) {
  const context = serverSignalQueryAttemptObserver(scopeKey);
  if (context === void 0)
    return;
  return (callback) => runWithServerSignalQueryAttemptObserver(context.owner, context.observe, context.createObservations, callback);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  captureCurrentServerSignalQueryAttemptObserver,
  hasServerSignalQueryAttemptObserver,
  runWithServerSignalQueryAttemptObserver,
  serverSignalQueryAttemptObserver
});
