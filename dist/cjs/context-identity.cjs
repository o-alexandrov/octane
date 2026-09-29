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
var context_identity_exports = {};
__export(context_identity_exports, {
  defineRemovedContextMembers: () => defineRemovedContextMembers,
  isContext: () => isContext,
  registerContext: () => registerContext
});
module.exports = __toCommonJS(context_identity_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineRemovedContextMembers,
  isContext,
  registerContext
});
