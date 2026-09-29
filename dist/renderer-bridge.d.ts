/**
 * Optional renderer coordination without importing either renderer runtime.
 *
 * Native-only and DOM-only applications must never retain the opposite runtime
 * merely because another renderer can participate in the same application.
 */
export type RendererHostFlusher = <T>(run: () => T) => T;
type RendererContextProvider = (context: unknown, props: {
    value: unknown;
    children?: unknown;
}, scope: object) => unknown;
/** Brand renderer-local contexts without observing authored function properties. */
export declare function registerRendererContext(context: Function): void;
/** Recognize only renderer-local Providers at a dynamic JSX descriptor boundary. */
export declare function isRendererContext(value: Function): boolean;
/** Install the client adapters only after a real DOM root becomes active. */
export declare function registerClientRendererBridge(contextProvider: RendererContextProvider, flush: RendererHostFlusher): void;
/** Server rendering can coexist with the client runtime in the same process. */
export declare function registerServerRendererContextProvider(provider: RendererContextProvider): void;
/** Render a renderer-local context through the owner matching its actual scope. */
export declare function renderRendererContextProvider(context: unknown, props: {
    value: unknown;
    children?: unknown;
}, scope: object): unknown;
/** Read the optional owner scheduler without importing the DOM runtime. */
export declare function getRendererHostFlusher(): RendererHostFlusher | undefined;
export {};
