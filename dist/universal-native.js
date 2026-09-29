export * from "./universal-core.js";
import {
  createSubSlot,
  subSlot
} from "./sub-slot.js";
import {
  universalContext
} from "./universal-core.js";
import { registerRendererContext, renderRendererContextProvider } from "./renderer-bridge.js";
import { CONTEXT_TAG } from "./runtime-tags.js";
import { registerContext } from "./context-identity.js";
// @__NO_SIDE_EFFECTS__
function createContext(defaultValue) {
  const context = ((props, scope) => scope === void 0 ? universalContext(context, props.value, props.children) : renderRendererContextProvider(context, props, scope));
  Object.defineProperties(context, {
    $$kind: { value: CONTEXT_TAG, enumerable: true },
    defaultValue: { value: defaultValue, enumerable: true },
    $$version: { value: 0, enumerable: true, writable: true }
  });
  registerRendererContext(context);
  registerContext(context);
  return context;
}
export {
  createContext,
  createSubSlot,
  subSlot
};
