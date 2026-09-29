const HOST_ROOT_TAG = 3;
let fiberKey = null;
let providerWalks = 0;
function __hostContextFiberWalks() {
  return providerWalks;
}
let adapterEnabled = true;
function __setHostFiberAdapterEnabled(enabled) {
  adapterEnabled = enabled;
}
function findStampedFiber(node) {
  const record = node;
  if (fiberKey !== null && record[fiberKey] !== void 0) return record[fiberKey];
  for (const key of Object.keys(record)) {
    if (key.startsWith("__reactFiber$")) {
      fiberKey = key;
      return record[key];
    }
  }
  return null;
}
function onCurrentTree(fiber) {
  let top = fiber;
  while (top.return !== null && top.return !== void 0) top = top.return;
  return top.tag === HOST_ROOT_TAG && top.stateNode != null && top.stateNode.current === top;
}
function resolveCurrentFiber(stamped) {
  if (stamped == null) return null;
  if (onCurrentTree(stamped)) return stamped;
  const alternate = stamped.alternate;
  if (alternate != null && onCurrentTree(alternate)) return alternate;
  return null;
}
const NOT_FOUND = { found: false, value: void 0 };
function readNearestProviderValue(host, reactContext) {
  if (!adapterEnabled) return NOT_FOUND;
  providerWalks++;
  try {
    const current = resolveCurrentFiber(findStampedFiber(host));
    if (current === null) return NOT_FOUND;
    const provider = reactContext.Provider;
    for (let fiber = current; fiber != null; fiber = fiber.return) {
      const type = fiber.type;
      if (type === reactContext || provider !== void 0 && type === provider) {
        return { found: true, value: fiber.memoizedProps?.value };
      }
    }
    return NOT_FOUND;
  } catch {
    return NOT_FOUND;
  }
}
export {
  __hostContextFiberWalks,
  __setHostFiberAdapterEnabled,
  readNearestProviderValue
};
