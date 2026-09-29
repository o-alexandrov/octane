/**
 * Host-agnostic pieces shared by the `octane/react` client controller and the
 * `octane/react/server` hosted renderer: the public prop/facade types and the
 * §3 transported-child validation. No React DOM, no Octane runtime imports —
 * both entries layer their renderer on top.
 */
import * as React from 'react';
import type { ComponentBody } from '../index.js';
export interface OctaneCompatProps {
    /** Exactly one compiled Octane component element. */
    children: React.ReactElement;
    component?: undefined;
    props?: undefined;
}
/**
 * The value accepted by `<OctaneCompat component={…}>`: any octane-component-
 * shaped function — a compiled `.tsrx` export exactly as the tsrx language
 * tooling types it (`(props) => Octane.JSX.Element`), a plain-TS octane
 * component, or the core `ComponentBody` (its extra scope/extra parameters
 * are absorbed by the `never[]` rest). The return type is deliberately
 * unconstrained: octane invokes the component, React never does, so this type
 * exists to INFER `P` and gate the paired `props` attribute — not to make the
 * value callable from React.
 */
export type OctaneHostedComponent<P = Record<string, never>> = (props: P, ...hostArgs: never[]) => unknown;
/**
 * The typed `component`/`props` authoring form of `<OctaneCompat>`:
 *
 * ```tsx
 * <OctaneCompat component={Island} props={{ id: 42 }} />
 * ```
 *
 * This is the same `{ type, props }` transport the children form extracts
 * from its element — accepted directly, WITHOUT routing the octane component
 * through React's JSX element-creation typing (which correctly rejects octane
 * components as element types). `P` infers from the component's own props
 * parameter, so a wrong, missing, or unknown island prop is a type error at
 * the call site with zero per-island declarations; `props` may be omitted
 * only when the component accepts an empty props object.
 */
export type OctaneCompatComponentProps<P> = {
    /** The compiled Octane component to host — octane invokes it, never React. */
    component: OctaneHostedComponent<P>;
    children?: never;
} & ({} extends P ? {
    props?: NoInfer<P>;
} : {
    props: NoInfer<P>;
});
declare const OCTANE_RENDERED: unique symbol;
/**
 * Opaque branded node type for the JSX-facing view of a compiled Octane
 * component: assignable to `React.ReactNode` so React JSX accepts the child
 * site, but never actually produced at runtime — `OctaneCompat` consumes the
 * child element as a `{ type, props }` transport and React never invokes it.
 */
export type OctaneRenderedNode = React.ReactElement & {
    readonly [OCTANE_RENDERED]: 'octane';
};
/**
 * The React-JSX-facing type of a compiled Octane component. The runtime value
 * is the compiled body; only the declared type differs so `<Island …/>` is
 * valid zero-cast inside `<OctaneCompat>`. Intersects cleanly with
 * `ComponentBody<P>` so one declaration can serve both hosts.
 */
export type OctaneReactComponent<P = Record<string, never>> = (props: P) => OctaneRenderedNode;
export { REACT_CONTEXT_TAG } from '../runtime-tags.js';
/** The client's stable opaque-host sentinel; the server writes real island HTML. */
export declare const OPAQUE_HOST_SENTINEL_COMMENT = "octane-compat-island";
export declare const OPAQUE_HOST_SENTINEL: Readonly<{
    __html: "<!--octane-compat-island-->";
}>;
export interface TransportedChild {
    type: ComponentBody;
    props: Record<string, unknown>;
    /** React key of the transported element — part of island identity (§3/§10). */
    key: string | null;
}
export declare function validateIslandChild(children: React.ReactNode): TransportedChild;
/**
 * Resolve either authoring form to the one island transport both hosted
 * renderers consume. The `component`/`props` form is used verbatim; the
 * children form goes through the §3 element validation. `key` is `null` for
 * the component form — island identity is the React key on `<OctaneCompat>`
 * itself, which React resolves by remounting the wrapper.
 */
export declare function resolveHostedIsland(props: OctaneCompatProps | OctaneCompatComponentProps<unknown>): TransportedChild;
