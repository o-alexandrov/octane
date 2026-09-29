/**
 * `octane/react/server` — the hosted SERVER implementation of `OctaneCompat`
 * (react-hosted-octane-compat-plan.md §9.1–§9.2). Use it wherever React runs
 * on the server (Fizz streaming or `renderToString`); the client entry
 * (`octane/react`) hydrates its output.
 *
 * Per island, one synchronous hosted Octane attempt runs INSIDE the React
 * component render against a session that persists across that island's Fizz
 * retries (keyed on the Fizz-stable transported props identity):
 *
 * - React context reads inside the island call `React.use(context)` directly —
 *   no Fiber, registry, or subscription machinery exists on the server (§6.4).
 * - An unhandled island suspension is delegated to `React.use(stratum)`, where
 *   the stratum is an identity-stable, status-stamped aggregate recorded into
 *   the session — Fizz's positional replay state can therefore never loop on a
 *   fresh Octane pass, parallel-use strata cost one replay each, and settled
 *   strata unwrap synchronously (Phase 0 evidence, §9.1).
 * - Unhandled island errors throw out of the component into Fizz's nearest
 *   boundary/error handling; React error boundaries do not catch server errors.
 * - Scoped island CSS is emitted as React 19 style resources (stable
 *   per-hash `href`, `precedence="octane"`), so Fizz hoists and deduplicates
 *   across islands; hoisted `<title>/<meta>/<link>` output is REJECTED in v1
 *   with a targeted diagnostic (§9.2).
 * - The island HTML is written through `dangerouslySetInnerHTML` on the host
 *   element with `suppressHydrationWarning`; the client's stable opaque
 *   sentinel keeps React from ever touching the descendants (§9.3).
 */
export { ReactCompat } from './react-compat-server.js';
export { bridgeReactContext } from './react-compat-shared.js';
export type { ReactCompatProps, ReactCompatComponentProps, ReactCompatClassComponentProps, ReactHostedComponent, ReactContextBridge, } from './react-compat-shared.js';
import * as React from 'react';
import { type OctaneCompatComponentProps, type OctaneCompatProps } from './shared.js';
export type { OctaneCompatComponentProps, OctaneCompatProps, OctaneHostedComponent, OctaneReactComponent, OctaneRenderedNode, } from './shared.js';
export declare function OctaneCompat<P>(props: OctaneCompatComponentProps<P>): React.ReactNode;
export declare function OctaneCompat(props: OctaneCompatProps): React.ReactNode;
