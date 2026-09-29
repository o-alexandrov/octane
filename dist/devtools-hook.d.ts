import type { NativeReadAttemptInspection, NativeReadObservation } from './signals/native-read-inspection.js';
export declare const DEVTOOLS_HOOK_VERSION = 3;
/** The subset of a runtime Scope/Block the walker reads. */
export interface DevtoolsScopeLike {
    kind?: string;
    body?: unknown;
    hooks: Map<symbol | number, any> | null;
    effectSlots: any[] | null;
    children: Array<{
        key: symbol | string | number;
        scope: DevtoolsScopeLike;
    }> | null;
    $$ctxValues?: Map<any, any> | null;
    disposed?: boolean;
}
export interface DevtoolsTreeNode {
    id: number;
    name: string;
    kind: string;
    children: DevtoolsTreeNode[];
}
export type DevtoolsHookKind = 'state' | 'reducer' | 'ref' | 'memo-or-callback' | 'other';
export interface DevtoolsHookCell {
    kind: DevtoolsHookKind;
    value: unknown;
}
export interface DevtoolsNodeDetail {
    id: number;
    name: string;
    hooks: DevtoolsHookCell[];
    context: Array<{
        name: string;
        value: unknown;
    }>;
    effectCount: number;
    nativeReads?: DevtoolsNativeReadOwner;
}
export interface DevtoolsNativeReadOwner {
    /** The actual schedulable renderer Block; a lightweight Scope may share it. */
    ownerId: number;
    committed: NativeReadAttemptInspection | null;
    pending: readonly NativeReadAttemptInspection[];
    retry: readonly NativeReadObservation[];
}
export interface DevtoolsNativeReadInspection extends Omit<DevtoolsNativeReadOwner, 'ownerId'> {
    block: DevtoolsScopeLike;
}
export type DevtoolsBoundaryState = 'init' | 'catch' | 'resolved' | 'pending';
export interface DevtoolsBoundary {
    id: number;
    branch: number;
    state: DevtoolsBoundaryState;
    hasResolved: boolean;
    label: string;
}
export interface DevtoolsTransitionState {
    pendingCount: number;
    boundaries: DevtoolsBoundary[];
}
export interface OctaneDevtoolsHook {
    version: number;
    getTree(): DevtoolsTreeNode[];
    inspect(id: number): DevtoolsNodeDetail | null;
    subscribe(listener: () => void): () => void;
    getTransitionState(): DevtoolsTransitionState;
}
declare let childWalker: ((scope: DevtoolsScopeLike, visit: (child: DevtoolsScopeLike) => void) => void) | null;
declare let nativeReadInspector: ((scope: DevtoolsScopeLike) => DevtoolsNativeReadInspection | null) | null;
declare global {
    var __OCTANE_DEVTOOLS__: OctaneDevtoolsHook | undefined;
}
export declare function installDevtoolsGlobal(): void;
export declare function __devtoolsSetNameResolver(fn: (block: any) => string): void;
export declare function __devtoolsSetChildWalker(walk: typeof childWalker): void;
export declare function __devtoolsSetNativeReadInspector(inspect: typeof nativeReadInspector): void;
export declare function __devtoolsRegisterRoot(root: DevtoolsScopeLike): void;
export declare function __devtoolsUnregisterRoot(root: DevtoolsScopeLike): void;
export declare function __devtoolsNotifyFlush(): void;
export declare function __devtoolsSetTransitionCount(count: number): void;
export declare function __devtoolsSetBoundaryState(slot: object, branch: number, hasResolved: boolean, label: string): void;
export declare function __devtoolsClearBoundary(slot: object): void;
export {};
