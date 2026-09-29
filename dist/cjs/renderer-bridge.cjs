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
var renderer_bridge_exports = {};
__export(renderer_bridge_exports, {
  getRendererHostFlusher: () => getRendererHostFlusher,
  isRendererContext: () => isRendererContext,
  registerClientRendererBridge: () => registerClientRendererBridge,
  registerRendererContext: () => registerRendererContext,
  registerServerRendererContextProvider: () => registerServerRendererContextProvider,
  renderRendererContextProvider: () => renderRendererContextProvider
});
module.exports = __toCommonJS(renderer_bridge_exports);
let clientContextProvider;
let serverContextProvider;
let hostFlusher;
const rendererContexts = /* @__PURE__ */ new WeakSet();
function registerRendererContext(context) {
  rendererContexts.add(context);
}
function isRendererContext(value) {
  return rendererContexts.has(value);
}
function registerClientRendererBridge(contextProvider, flush) {
  clientContextProvider = contextProvider;
  hostFlusher = flush;
}
function registerServerRendererContextProvider(provider) {
  serverContextProvider = provider;
}
function renderRendererContextProvider(context, props, scope) {
  const provider = "block" in scope ? clientContextProvider : serverContextProvider;
  if (provider === void 0) {
    throw new Error("A renderer-local context provider requires an active renderer owner.");
  }
  return provider(context, props, scope);
}
function getRendererHostFlusher() {
  return hostFlusher;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRendererHostFlusher,
  isRendererContext,
  registerClientRendererBridge,
  registerRendererContext,
  registerServerRendererContextProvider,
  renderRendererContextProvider
});
