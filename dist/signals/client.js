export * from "./index.js";
import { nativeLocalHook } from "../runtime.js";
import { createLocalScope } from "./engine.js";
function disposeLocalSignal(cell) {
  cell.scope.dispose();
}
function useSignal$(initial, slot) {
  const cell = nativeLocalHook(
    "useSignal$",
    () => {
      const value = typeof initial === "function" ? initial() : initial;
      const scope = createLocalScope("octane/useSignal$");
      return { scope, signal$: scope.signal$("value", value) };
    },
    disposeLocalSignal,
    slot
  );
  return cell.signal$;
}
export {
  useSignal$
};
