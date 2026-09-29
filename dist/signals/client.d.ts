/** Optional component hooks for the native-read DOM compiler mode. */
export * from './index.js';
import type { WritableSignal } from './types.js';
/** A writable signal owned by this compiler-assigned component hook slot. */
export declare function useSignal$<T>(initial: T | (() => T), slot?: symbol): WritableSignal<T>;
