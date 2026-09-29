/**
 * Shared React-island transport. This module imports neither renderer runtime,
 * so the client and server adapters can validate the same authored boundary.
 */
import * as React from 'react';
import type { Context, OctaneNode } from '../runtime.js';
import type { Context as ServerContext } from '../runtime.server.js';
/** One native Octane context delivered through a real React context provider. */
export interface ReactContextBridge<T> {
    readonly source: Context<T> | ServerContext<T>;
    readonly target: React.Context<T>;
}
interface ReactCompatContextProps {
    /** Keep the ordered context identities stable for this boundary's lifetime. */
    contexts?: readonly ReactContextBridge<any>[];
}
export interface ReactCompatProps extends ReactCompatContextProps {
    /** Exactly one React component element authored in the Octane template. */
    children: OctaneNode;
    component?: never;
    props?: never;
}
/** React owns function, class, memo, lazy, and forwarded-ref components. */
export type ReactHostedComponent<P = Record<string, never>> = React.ComponentType<P> | React.ExoticComponent<P>;
/** Infer island props from the React component, including refs declared in its props. */
export type ReactCompatComponentProps<P> = ReactCompatContextProps & {
    component: ReactHostedComponent<P>;
    children?: never;
} & ({} extends P ? {
    props?: NoInfer<P>;
} : {
    props: NoInfer<P>;
});
/** React class refs target the instance, not a field in the class's props. */
export type ReactCompatClassComponentProps<C extends React.ComponentClass<any>> = ReactCompatContextProps & {
    component: C;
    children?: never;
} & ({} extends React.ComponentPropsWithRef<C> ? {
    props?: NoInfer<React.ComponentPropsWithRef<C>>;
} : {
    props: NoInfer<React.ComponentPropsWithRef<C>>;
});
export interface TransportedReactChild {
    readonly type: ReactHostedComponent<any>;
    readonly props: Record<string, unknown>;
    readonly key: string | null;
}
/**
 * Map context identities once; values remain scoped to the enclosing Octane
 * provider. The mapping never reads or changes React's renderer-owned values.
 */
export declare function bridgeReactContext<T>(source: Context<T> | ServerContext<T>, target: React.Context<NoInfer<T>>): ReactContextBridge<T>;
/** Validate raw JavaScript input too; duplicate targets have no clear precedence. */
export declare function validateReactContextBridges(contexts: readonly ReactContextBridge<any>[] | undefined): readonly ReactContextBridge<any>[];
/** Resolve both authoring forms without invoking either renderer's component. */
export declare function resolveReactIsland(props: ReactCompatProps | ReactCompatComponentProps<unknown>): TransportedReactChild;
/** Keep React's key normalization and React 19 ref ownership at element creation. */
export declare function createReactIslandElement(child: TransportedReactChild): React.ReactElement;
export {};
