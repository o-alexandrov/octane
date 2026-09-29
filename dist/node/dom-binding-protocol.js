const __octaneDev = process.env.NODE_ENV !== "production";
import { HYDRATION_FOR_ARM_INDEX, HYDRATION_FOR_EMPTY, HYDRATION_FOR_ITEMS, HYDRATION_FOR_PREFIX, HYDRATION_START } from "./hydration-markers.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const BINDING_OPEN_PREFIX = HYDRATION_START + "b;";
const BINDING_RECEIPT = ";b;";
const BINDING_FOR_EMPTY_PREFIX = HYDRATION_FOR_EMPTY + BINDING_RECEIPT;
const BINDING_FOR_ITEMS_PREFIX = HYDRATION_FOR_ITEMS + BINDING_RECEIPT;
const BINDING_FOR_ID_START = BINDING_FOR_EMPTY_PREFIX.length;
const BINDING_ID_START = BINDING_OPEN_PREFIX.length;
const BINDING_ROOT_SITE = "root";
const BINDING_ROOT_SUFFIX = ";" + BINDING_ROOT_SITE;
function bindingRootMarker(id) {
  return BINDING_OPEN_PREFIX + id + BINDING_ROOT_SUFFIX;
}
function encodeBindingKey(key) {
  if (typeof key === "string")
    return "s:" + JSON.stringify(key).replace(/-/g, "\\u002d").replace(/</g, "\\u003c");
  if (typeof key === "number" && Number.isFinite(key))
    return "n:" + String(key);
  throw new TypeError(__octaneDev ? "A DOM presentation key must be a string or finite number." : __octaneNoArgError(306));
}
function decodeBindingKey(encoded) {
  let key;
  try {
    key = JSON.parse(encoded.slice(2));
  } catch {
    throw new TypeError(__octaneDev ? "A DOM presentation key has invalid serialized identity." : __octaneNoArgError(307));
  }
  if (encoded.startsWith("s:") && typeof key === "string" || encoded.startsWith("n:") && typeof key === "number" && Number.isFinite(key)) {
    if (encodeBindingKey(key) === encoded)
      return key;
  }
  throw new TypeError(__octaneDev ? "A DOM presentation key has invalid serialized identity." : __octaneNoArgError(307));
}
function parseBindingMarker(data) {
  if (data.startsWith(BINDING_FOR_EMPTY_PREFIX) || data.startsWith(BINDING_FOR_ITEMS_PREFIX)) {
    const separator = data.indexOf(";", BINDING_FOR_ID_START);
    if (separator <= BINDING_FOR_ID_START || separator === data.length - 1)
      return null;
    return {
      id: data.slice(BINDING_FOR_ID_START, separator),
      site: data.slice(separator + 1),
      kind: "for",
      arm: data.charCodeAt(HYDRATION_FOR_ARM_INDEX) - 48
    };
  }
  if (!data.startsWith(BINDING_OPEN_PREFIX))
    return null;
  const idEnd = data.indexOf(";", BINDING_ID_START);
  if (idEnd <= BINDING_ID_START || idEnd === data.length - 1)
    return null;
  const id = data.slice(BINDING_ID_START, idEnd);
  if (data.slice(idEnd + 1) === BINDING_ROOT_SITE)
    return { id, site: BINDING_ROOT_SITE, kind: "root" };
  const siteEnd = data.indexOf(";", idEnd + 1);
  if (siteEnd <= idEnd + 1 || siteEnd === data.length - 1)
    return null;
  const site = data.slice(idEnd + 1, siteEnd);
  const kind = data.slice(siteEnd + 1);
  if (kind === "t")
    return { id, site, kind: "text" };
  if (kind === "v")
    return { id, site, kind: "view" };
  if (kind === "s")
    return { id, site, kind: "slot" };
  if (kind === "o")
    return { id, site, kind: "opaque" };
  if (kind.startsWith("k;")) {
    const key = kind.slice(2);
    try {
      decodeBindingKey(key);
    } catch {
      return null;
    }
    return { id, site, kind: "item", key };
  }
  if (/^(?:-1|0|[1-9]\d*)$/.test(kind)) {
    const arm = Number(kind);
    if (Number.isSafeInteger(arm))
      return { id, site, kind: "if", arm };
  }
  return null;
}
function isBindingOpenComment(data) {
  const list = data.startsWith(BINDING_FOR_EMPTY_PREFIX) || data.startsWith(BINDING_FOR_ITEMS_PREFIX);
  if (!list && !data.startsWith(BINDING_OPEN_PREFIX))
    return false;
  const idStart = list ? BINDING_FOR_ID_START : BINDING_ID_START;
  const idEnd = data.indexOf(";", idStart);
  if (idEnd <= idStart || idEnd === data.length - 1)
    return false;
  if (list)
    return data.indexOf(";", idEnd + 1) === -1;
  if (data.length - idEnd === BINDING_ROOT_SUFFIX.length && data.endsWith(BINDING_ROOT_SUFFIX))
    return true;
  const siteEnd = data.indexOf(";", idEnd + 1);
  if (siteEnd <= idEnd + 1 || siteEnd === data.length - 1)
    return false;
  const tail = siteEnd + 1;
  if (data.length === tail + 1) {
    const code = data.charCodeAt(tail);
    return code === 116 || code === 118 || code === 115 || code === 111 || code >= 48 && code <= 57;
  }
  if (data.charCodeAt(tail) === 107 && data.charCodeAt(tail + 1) === 59)
    return (data.charCodeAt(tail + 2) === 115 || data.charCodeAt(tail + 2) === 110) && data.charCodeAt(tail + 3) === 58 && data.length > tail + 4;
  if (data.length === tail + 2 && data.endsWith("-1"))
    return true;
  if (data.charCodeAt(tail) < 49 || data.charCodeAt(tail) > 57)
    return false;
  for (let index = tail + 1; index < data.length; index++) {
    const code = data.charCodeAt(index);
    if (code < 48 || code > 57)
      return false;
  }
  return true;
}
function isForBindingOpenComment(data) {
  return data.startsWith(HYDRATION_FOR_PREFIX) && isBindingOpenComment(data);
}
export {
  BINDING_OPEN_PREFIX,
  bindingRootMarker,
  decodeBindingKey,
  encodeBindingKey,
  isBindingOpenComment,
  isForBindingOpenComment,
  parseBindingMarker
};
