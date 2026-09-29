import type { Block, Scope } from '../runtime.js';
import { type NativeReadWitness } from './native-read-collector.js';
interface NativeReadHost {
    capture(): object | null;
    cleanup(scope: Scope, dispose: () => void): void;
    schedule(block: Block): void;
    /** Candidate admission renders this exact subscribed owner without notifying it. */
    prepare?(block: Block): void;
    retire?(block: Block): void;
    /** Reuse current ref manifests after a superseding root commits. */
    replayRefs(capture: object, owner: PublicationOwner): boolean;
    refDisposed(entry: object): boolean;
    /** Failed reads may outlive a discarded mount while its existing owner retries. */
    suspended(block: Block, reads: NativeReadWitness): void;
}
interface PublicationOwner {
    generation: number;
    disposed: boolean;
}
/**
 * The native adapter owns no DOM queue or parent/child tree. Renderer Scopes
 * own consumers, real Blocks schedule them, and existing captures own each
 * speculative read set until the renderer accepts or discards that attempt.
 */
export declare function createNativeReadDriver(host: NativeReadHost): {
    /** Selected-node inspection reads this Scope's existing records only. */
    inspectScope(scope: Scope): {
        block: Block;
        committed: import("./native-read-inspection.js").NativeReadAttemptInspection | null;
        pending: import("./native-read-inspection.js").NativeReadAttemptInspection[];
    } | null;
    /** Receipt stamps exist only for a capture that actually read native data. */
    stampPublication(owner: PublicationOwner, queues: readonly (readonly object[])[]): void;
    hasPublication(owner: PublicationOwner): boolean;
    /** Reveals enumerate current refs after their candidate was already accepted. */
    stampQueuedPublication(owner: PublicationOwner, entry: object): void;
    publicationCurrent(entry: object): boolean;
    deferRef(entry: object, target: object, ref: unknown): void;
    unpublishedRef(target: object, ref: unknown): boolean;
    forgetUnpublishedRef: (target: object) => void;
    deferredRefEntries(owner: PublicationOwner): ReadonlyMap<object, object> | undefined;
    clearDeferredRefs(owner: PublicationOwner): void;
    pruneDeferredRefs(owner: PublicationOwner): void;
    replayDeferredRefs: (capture: object, owner: PublicationOwner) => boolean;
    beginRender(block: Block): void;
    endRender(block: Block, completed: boolean, suspended: boolean): void;
    beginScope(scope: Scope, block: Block): number;
    endScope(token: number): void;
    pauseLifecycle(): number;
    resumeLifecycle(token: number): void;
    beginWitness: (detached?: boolean) => number;
    finishWitness: (token: number, completed: boolean) => NativeReadWitness | null;
    replay: (witness: NativeReadWitness | null | undefined) => void;
    validateCapture(capture: object): boolean;
    acceptCapture(capture: object): boolean;
    spliceCapture(capture: object, parent: object | null): void;
    discardCapture(capture: object): void;
};
export type NativeReadDriver = ReturnType<typeof createNativeReadDriver>;
export {};
