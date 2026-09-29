/**
 * Experimental host-neutral universal renderer entry.
 *
 * This subpath deliberately has no dependency on Octane's DOM runtime. Native
 * renderer packages can therefore reuse the universal component, hook,
 * scheduler, transport, and object-driver contracts in JS environments that
 * do not provide DOM globals.
 */
export * from './universal-core.js';
export { createSubSlot, subSlot, type SubSlot, type SlotlessSubSlot, type SubSlotOptions, } from './sub-slot.js';
import { type UniversalContext, type UniversalContextValue, type UniversalRenderable } from './universal-core.js';
export interface NativeUniversalContext<T> extends UniversalContext<T> {
    (props: {
        value: T;
        children?: UniversalRenderable | (() => UniversalRenderable);
    }): UniversalContextValue;
}
/** Create a context whose Provider can be lowered without a DOM Scope. */
export declare function createContext<T>(defaultValue: T): NativeUniversalContext<T>;
