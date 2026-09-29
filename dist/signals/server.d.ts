/** Server twin selected by the native-read compiler for octane/signals/client. */
export * from './index.js';
import type { WritableSignal } from './types.js';
/** Local server state is recreated on a new pass and never enters shared seeds. */
export declare function useSignal$<T>(initial: T | (() => T), slot?: symbol): WritableSignal<T>;
