export declare function registerContext(context: Function): void;
export declare function isContext(value: unknown): boolean;
/**
 * Development-only diagnostics for the React context members Octane removed.
 * Every call site sits behind the production-build guard, so production
 * bundles retain neither the call nor this function.
 *
 * - `Consumer` (never supported): warns once per context and returns
 *   `undefined`, so feature probes (`Ctx.Consumer || fallback`) behave as in
 *   production.
 * - `Provider` (removed in favor of `<Ctx value>`): throws. The compiler rejects
 *   `<Ctx.Provider>` only when the context is created in the same module; an
 *   imported context would otherwise fail later with an opaque
 *   "element type is invalid" (client) or "comp is not a function" (server).
 */
export declare function defineRemovedContextMembers(context: Function): void;
