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
var data_encoding_exports = {};
__export(data_encoding_exports, {
  decodeSignalValue: () => decodeSignalValue,
  encodeSignalValue: () => encodeSignalValue,
  snapshotSignalValue: () => snapshotSignalValue
});
module.exports = __toCommonJS(data_encoding_exports);
var import_errors = require("./signals/errors.cjs");
function unsupported() {
  throw new import_errors.SignalSerializationError(
    "Signal request arguments and seeds require acyclic plain data: undefined, null, booleans, finite numbers, strings, dense arrays, and plain objects with enumerable string data properties."
  );
}
function encodeSignalValue(value, ancestors = /* @__PURE__ */ new Set()) {
  if (value === void 0) return ["undefined"];
  if (value === null) return ["null"];
  if (typeof value === "boolean") return ["boolean", value];
  if (typeof value === "string") return ["string", value];
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return unsupported();
    return ["number", Object.is(value, -0) ? "-0" : value];
  }
  if (typeof value !== "object" || ancestors.has(value)) return unsupported();
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) {
    return unsupported();
  }
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      const keys2 = Reflect.ownKeys(value);
      if (keys2.length !== value.length + 1) return unsupported();
      const items = [];
      for (let i = 0; i < value.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
        if (!descriptor || !descriptor.enumerable || !("value" in descriptor)) return unsupported();
        items.push(encodeSignalValue(descriptor.value, ancestors));
      }
      return ["array", items];
    }
    const keys = Reflect.ownKeys(value);
    if (keys.some((key) => typeof key !== "string")) return unsupported();
    const entries = [];
    for (const key of keys.sort()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !("value" in descriptor)) return unsupported();
      entries.push([key, encodeSignalValue(descriptor.value, ancestors)]);
    }
    return ["object", entries];
  } finally {
    ancestors.delete(value);
  }
}
function snapshotSignalValue(value, ancestors = /* @__PURE__ */ new Set()) {
  if (value === void 0 || value === null || typeof value === "boolean" || typeof value === "string")
    return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : unsupported();
  if (typeof value !== "object" || ancestors.has(value)) return unsupported();
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) {
    return unsupported();
  }
  ancestors.add(value);
  try {
    const keys = Reflect.ownKeys(value);
    if (Array.isArray(value)) {
      if (keys.length !== value.length + 1) return unsupported();
      const items = [];
      for (let i = 0; i < value.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
        if (!descriptor || !descriptor.enumerable || !("value" in descriptor)) return unsupported();
        items.push(snapshotSignalValue(descriptor.value, ancestors));
      }
      return Object.freeze(items);
    }
    if (keys.some((key) => typeof key !== "string")) return unsupported();
    const object = {};
    for (const key of keys.sort()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable || !("value" in descriptor)) return unsupported();
      Object.defineProperty(object, key, {
        value: snapshotSignalValue(descriptor.value, ancestors),
        enumerable: true
      });
    }
    return Object.freeze(object);
  } finally {
    ancestors.delete(value);
  }
}
function decodeSignalValue(encoded) {
  if (!Array.isArray(encoded)) return unsupported();
  const [tag, value] = encoded;
  switch (tag) {
    case "undefined":
      if (encoded.length !== 1) return unsupported();
      return void 0;
    case "null":
      if (encoded.length !== 1) return unsupported();
      return null;
    case "boolean":
      if (encoded.length !== 2 || typeof value !== "boolean") return unsupported();
      return value;
    case "number":
      if (encoded.length !== 2) return unsupported();
      if (value === "-0") return -0;
      if (typeof value !== "number" || !Number.isFinite(value) || Object.is(value, -0)) {
        return unsupported();
      }
      return value;
    case "string":
      if (encoded.length !== 2 || typeof value !== "string") return unsupported();
      return value;
    case "array":
      if (encoded.length !== 2 || !Array.isArray(value)) return unsupported();
      return Object.freeze(value.map((item) => decodeSignalValue(item)));
    case "object": {
      if (encoded.length !== 2 || !Array.isArray(value)) return unsupported();
      const object = {};
      let previous;
      for (const entry of value) {
        if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || previous !== void 0 && entry[0] <= previous) {
          return unsupported();
        }
        previous = entry[0];
        Object.defineProperty(object, entry[0], {
          value: decodeSignalValue(entry[1]),
          enumerable: true
        });
      }
      return Object.freeze(object);
    }
    default:
      return unsupported();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decodeSignalValue,
  encodeSignalValue,
  snapshotSignalValue
});
