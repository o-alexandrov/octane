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
export {
  captureCurrentServerSignalQueryAttemptObserver,
  hasServerSignalQueryAttemptObserver,
  runWithServerSignalQueryAttemptObserver,
  serverSignalQueryAttemptObserver
};
