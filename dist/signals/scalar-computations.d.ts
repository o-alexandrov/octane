import type { DerivedCompute, DerivedSignal, Scope } from './types.js';
export declare function createDeclaredScalarCell<T>(owner: Scope, key: string, compute: DerivedCompute<T>): DerivedSignal<T>;
