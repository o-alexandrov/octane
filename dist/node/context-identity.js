const CONTEXT_IDENTITIES = /* @__PURE__ */ Symbol.for("octane.contextIdentities");
function registerContext(context) {
  let identities = globalThis[CONTEXT_IDENTITIES];
  if (identities == null) {
    identities = /* @__PURE__ */ new WeakSet();
    globalThis[CONTEXT_IDENTITIES] = identities;
  }
  identities.add(context);
}
function isContext(value) {
  if (typeof value !== "function") return false;
  const identities = globalThis[CONTEXT_IDENTITIES];
  return identities != null && identities.has(value) === true;
}
function defineRemovedContextMembers(context) {
  let consumerWarned = false;
  Object.defineProperties(context, {
    Consumer: {
      configurable: true,
      get() {
        if (!consumerWarned) {
          consumerWarned = true;
          console.error(
            "Octane has no Context.Consumer. Read the context directly with use(Context) or useContext(Context) in the child component \u2014 Octane hooks are call-site keyed, so the read is legal behind any condition the render-prop form was working around."
          );
        }
        return void 0;
      }
    },
    Provider: {
      configurable: true,
      get() {
        const error = new Error(
          "[OCTANE_CONTEXT_PROVIDER] Context.Provider was removed. Render the context itself as the provider: <Context value={...}>...</Context>."
        );
        error.code = "OCTANE_CONTEXT_PROVIDER";
        throw error;
      }
    }
  });
}
export {
  defineRemovedContextMembers,
  isContext,
  registerContext
};
