import { type NativeBatchHooks } from './read-protocol.js';
interface NativeEventBatch {
    hooks: NativeBatchHooks | null;
    depth: number;
    closed: boolean;
}
/** One graph batch covers the delegated handlers of one native event. */
export declare function beginNativeEventBatch(event: Event): NativeEventBatch | null;
export declare function endNativeEventBatch(event: Event, batch: NativeEventBatch | null, waitsForBubble: boolean, onError: (error: unknown) => void): void;
export {};
