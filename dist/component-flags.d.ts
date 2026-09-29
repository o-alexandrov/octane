/** The component owns a load-bearing runtime/SSR boundary range. */
export declare const COMPONENT_FLAG_BOUNDARY: number;
/** Attach an immutable capability bitmask without retaining concrete component identities. */
export declare function markComponentFlags<T extends Function>(component: T, flags: number, name: string, kind?: symbol): T;
/** Test compiler/runtime capability bits on a component from any Octane runtime copy. */
export declare function hasComponentFlags(component: unknown, flags: number): boolean;
