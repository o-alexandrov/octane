const __octaneDev = process.env.NODE_ENV !== "production";
import { decodeSignalValue, encodeSignalValue } from "./data-encoding.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function plainRecord(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null)
    return false;
  return Reflect.ownKeys(value).every((key2) => {
    if (typeof key2 !== "string")
      return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key2);
    return descriptor.enumerable && "value" in descriptor;
  });
}
function key(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 1024;
}
function uniqueKeys(value) {
  return Array.isArray(value) && value.every(key) && new Set(value).size === value.length;
}
function captures(value, count) {
  if (!Array.isArray(value) || value.length !== count)
    return false;
  try {
    for (const capture of value)
      decodeSignalValue(capture);
    return true;
  } catch {
    return false;
  }
}
function isIndependentHydrateManifest(value) {
  if (!plainRecord(value))
    return false;
  const allowed = /* @__PURE__ */ new Set([
    "version",
    "buildId",
    "boundaryId",
    "moduleId",
    "exportName",
    "captureSchema",
    "captures",
    "hookSeed",
    "idSeed",
    "signalSites",
    "styles",
    "parentDependencies"
  ]);
  if (!Object.keys(value).every((name) => allowed.has(name)))
    return false;
  if (value.version !== 1 || !key(value.buildId) || !key(value.boundaryId) || !key(value.moduleId) || !key(value.exportName) || !Number.isSafeInteger(value.hookSeed) || value.hookSeed < 0 || !Number.isSafeInteger(value.idSeed) || value.idSeed < 0 || value.parentDependencies !== false || !uniqueKeys(value.signalSites) || !uniqueKeys(value.styles) || !Array.isArray(value.captureSchema)) {
    return false;
  }
  const names = /* @__PURE__ */ new Set();
  for (const capture of value.captureSchema) {
    if (!plainRecord(capture) || Object.keys(capture).length !== 2 || !key(capture.name) || capture.type !== "json" || names.has(capture.name)) {
      return false;
    }
    names.add(capture.name);
  }
  return captures(value.captures, value.captureSchema.length);
}
function createIndependentHydrateManifest(template, values, instanceBoundaryId, buildId, build) {
  const manifest = {
    ...template,
    buildId,
    boundaryId: instanceBoundaryId,
    moduleId: build.moduleId,
    captures: values.map((value) => encodeSignalValue(value)),
    styles: build.styles
  };
  if (!isIndependentHydrateManifest(manifest)) {
    throw new TypeError(__octaneDev ? "Invalid independent Hydrate manifest inputs." : __octaneNoArgError(331));
  }
  return Object.freeze(manifest);
}
function serializeIndependentHydrateManifest(manifest) {
  if (!isIndependentHydrateManifest(manifest)) {
    throw new TypeError(__octaneDev ? "Invalid independent Hydrate manifest." : __octaneNoArgError(215));
  }
  return JSON.stringify(manifest).replace(/&/g, "\\u0026").replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
export {
  createIndependentHydrateManifest,
  isIndependentHydrateManifest,
  serializeIndependentHydrateManifest
};
