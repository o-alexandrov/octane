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
export {
  getRendererHostFlusher,
  isRendererContext,
  registerClientRendererBridge,
  registerRendererContext,
  registerServerRendererContextProvider,
  renderRendererContextProvider
};
