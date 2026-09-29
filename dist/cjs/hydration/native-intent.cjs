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
var native_intent_exports = {};
__export(native_intent_exports, {
  NATIVE_HYDRATION_CAPTURE_KEY: () => NATIVE_HYDRATION_CAPTURE_KEY,
  getNativeHydrationCapture: () => getNativeHydrationCapture,
  getNativeHydrationDOM: () => getNativeHydrationDOM,
  getNativeHydrationDocument: () => getNativeHydrationDocument
});
module.exports = __toCommonJS(native_intent_exports);
const NATIVE_HYDRATION_CAPTURE_KEY = "__octaneNativeHydrationCapture";
function getNativeHydrationCapture(document) {
  return document[NATIVE_HYDRATION_CAPTURE_KEY];
}
let nativeDOMs;
function nodePrototype(node) {
  let prototype = Object.getPrototypeOf(node);
  while (Object.getOwnPropertyDescriptor(prototype, "ownerDocument") === void 0) {
    prototype = Object.getPrototypeOf(prototype);
  }
  return prototype;
}
function getNativeHydrationDocument(value) {
  if (typeof value !== "object" || value === null) return null;
  try {
    const prototype = nodePrototype(value);
    return Object.getOwnPropertyDescriptor(prototype, "nodeType").get.call(value) === 1 ? Object.getOwnPropertyDescriptor(prototype, "ownerDocument").get.call(value) : null;
  } catch {
    return null;
  }
}
function getNativeHydrationDOM(document) {
  let dom = nativeDOMs?.get(document);
  if (dom !== void 0) return dom;
  const prototype = document.defaultView?.Node.prototype ?? nodePrototype(document);
  const owner = Object.getOwnPropertyDescriptor(prototype, "ownerDocument").get;
  const parent = Object.getOwnPropertyDescriptor(prototype, "parentElement").get;
  const connected = Object.getOwnPropertyDescriptor(prototype, "isConnected").get;
  const kind = Object.getOwnPropertyDescriptor(prototype, "nodeType").get;
  const elementPrototype = (document.defaultView?.Element ?? globalThis.Element).prototype;
  const children = Object.getOwnPropertyDescriptor(elementPrototype, "children").get;
  const element = (value) => {
    try {
      return kind.call(value) === 1;
    } catch {
      return false;
    }
  };
  dom = {
    element,
    owner: (node) => owner.call(node),
    parent: (node) => parent.call(node),
    connected: (node) => connected.call(node),
    kind: (node) => kind.call(node),
    contains: (container, node) => owner.call(node) === document && elementPrototype.contains.call(container, node),
    matches: (node, selector) => elementPrototype.matches.call(node, selector),
    query: (node, selector) => elementPrototype.querySelectorAll.call(node, selector),
    closest: (node, selector) => elementPrototype.closest.call(node, selector),
    attribute: (node, name) => elementPrototype.getAttribute.call(node, name),
    children: (node) => children.call(node),
    target: (event) => {
      if (event.target === null) return null;
      try {
        return kind.call(event.target) === 1 ? event.target : parent.call(event.target);
      } catch {
        return null;
      }
    }
  };
  (nativeDOMs ??= /* @__PURE__ */ new WeakMap()).set(document, dom);
  return dom;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NATIVE_HYDRATION_CAPTURE_KEY,
  getNativeHydrationCapture,
  getNativeHydrationDOM,
  getNativeHydrationDocument
});
