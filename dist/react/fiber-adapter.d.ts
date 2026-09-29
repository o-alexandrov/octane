/**
 * The ONE module in `octane/react` that touches React Fiber internals
 * (docs/react-hosted-octane-compat-plan.md §6.1, §12):
 *
 *  - discover the `__reactFiber$<suffix>` stamp ReactDOM 19 places on host
 *    nodes (the only host→Fiber channel in 19.2 — the DevTools
 *    `findFiberByHostInstance` injection entry was removed);
 *  - resolve the committed Fiber when the stamp is the stale alternate, via
 *    the HostRoot's `current` pointer;
 *  - walk `return` for the nearest provider of a given React context and read
 *    its committed `memoizedProps.value`.
 *
 * Fiber access is BOOTSTRAP-ONLY and fidelity-only: it never subscribes (the
 * wrapper's `React.use(context)` reads are the propagation mechanism), and
 * every failure — unknown stamp, unresolvable current tree, missing provider,
 * or a future Fiber shape change — degrades to `found: false`, which the
 * controller answers with the public `HostContextRequest` retry handshake
 * (§6.3). No `context._currentValue` fallback, ever: it is renderer-global
 * and has no nearest-provider semantics.
 */
/** @internal Structural counter for the bench harness and tests. */
export declare function __hostContextFiberWalks(): number;
/** @internal Test-only override — never used by production code paths. */
export declare function __setHostFiberAdapterEnabled(enabled: boolean): void;
export interface ProviderReadResult {
    /** False when no provider exists above the host OR the adapter failed. */
    found: boolean;
    /** The committed provider value — may legitimately be `undefined` with `found` true. */
    value: unknown;
}
/**
 * One-time bootstrap read (§6.2 steps 4–5): the nearest committed provider
 * value for `reactContext` above `host`. Every internal failure degrades to
 * `found: false` — reduced fidelity (one handshake retry), never
 * incorrectness.
 */
export declare function readNearestProviderValue(host: Element, reactContext: object): ProviderReadResult;
