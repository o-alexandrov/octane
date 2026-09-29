export { ReactCompat } from './react-compat.js';
export { bridgeReactContext } from './react-compat-shared.js';
export type { ReactCompatProps, ReactCompatComponentProps, ReactCompatClassComponentProps, ReactHostedComponent, ReactContextBridge, } from './react-compat-shared.js';
/**
 * `octane/react` — both directions of DOM interoperability. ReactCompat hosts
 * real React components inside Octane (docs/react-compat.md). OctaneCompat
 * hosts a compiled Octane subtree inside a real React 19 tree:
 *
 * ```tsx
 * import { OctaneCompat } from 'octane/react';
 *
 * <OctaneCompat>
 * 	<OctaneComponentTree account={account} />
 * </OctaneCompat>
 * ```
 *
 * Architecture (docs/react-hosted-octane-compat-plan.md): React owns the
 * wrapper Fiber and one host element; a private hosted Octane root owns every
 * descendant. The hosted root binds a React implementation of the existing
 * `RendererRegionOwnerBridge` (`bindRendererRegionOwner`), so local Octane
 * `@try`/Suspense/error boundaries always get first chance and only a throw
 * that reaches the hosted root escapes to the nearest REACT Suspense or error
 * boundary. Events stay native and delegated at the island host — React
 * ancestors observe real capture/bubble order, targets, and
 * `stopPropagation()`/`preventDefault()`.
 *
 * Transparent React context (Phase 2): an island's ordinary `use()`/
 * `useContext()` accepts a REAL React 19 context object. The owner resolves
 * it to a root-local Octane mirror, bootstraps the committed nearest-provider
 * value from the host Fiber ONCE (see ./fiber-adapter.ts — the only
 * Fiber-touching module), and subscribes by replaying `React.use(context)`
 * for every registered entry in the wrapper render; committed snapshots
 * publish in the layout phase with mirror version bumps. When the adapter
 * cannot serve a read (unavailable, unknown Fiber shape, or a providerless
 * read whose default only React may supply), the §6.3 HostContextRequest
 * handshake retries with the authoritative value before paint.
 *
 * The explicit `octane/react/server` entry renders either direction on the
 * server; these client adapters hydrate its opaque hosts. Hosted roots pay
 * normal createRoot delegation costs (benchmarks/react-hosted-islands and
 * benchmarks/octane-hosted-react).
 */
import * as React from 'react';
import { type OctaneCompatComponentProps, type OctaneCompatProps } from './shared.js';
export type { OctaneCompatComponentProps, OctaneCompatProps, OctaneHostedComponent, OctaneReactComponent, OctaneRenderedNode, } from './shared.js';
export { __hostContextFiberWalks } from './fiber-adapter.js';
/**
 * Host exactly one compiled Octane component inside a React tree, in either
 * authoring form:
 *
 * - `component`/`props` (typed): `<OctaneCompat component={Island} props={…}/>`
 *   passes the island transport directly — island prop types flow from the
 *   component's own octane-typed signature, so a wrong prop is a type error at
 *   the call site.
 * - element child: `<OctaneCompat><Island …/></OctaneCompat>` — the child
 *   element is consumed as a `{ type, props }` transport; React never invokes
 *   it.
 *
 * The island's `ref` prop (React 19 places `ref` in props) passes through to
 * the island as an ordinary Octane ref prop. Surrounding React Suspense
 * boundaries, error boundaries, and event ancestors are the integration
 * surface; there is nothing to register.
 */
export declare function OctaneCompat<P>(props: OctaneCompatComponentProps<P>): React.ReactNode;
export declare function OctaneCompat(props: OctaneCompatProps): React.ReactNode;
