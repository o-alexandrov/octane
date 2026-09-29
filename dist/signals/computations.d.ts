import { ScopedNode, type GraphOwner, type CandidateProducer, type SignalCandidateFrame } from './graph.js';
import { type DerivedCompute, type DerivedOptions, type DerivedSignal, type Scope } from './types.js';
export declare function createDeclaredDerivedCell<T>(owner: Scope, key: string, compute: DerivedCompute<T>, options?: DerivedOptions): DerivedSignal<T>;
export declare class DerivedBinding<T> {
    readonly owner: Scope & GraphOwner;
    readonly node: ScopedNode<T>;
    private readonly options?;
    private current;
    private compute;
    private frozen;
    private candidate;
    constructor(owner: Scope & GraphOwner, node: ScopedNode<T>, compute: DerivedCompute<T>, options?: DerivedOptions | undefined);
    forkCandidate(target: ScopedNode<T>, frame: SignalCandidateFrame): CandidateProducer;
    private static context;
    private static notify;
    private read;
    private readDependency;
    private static readValue;
    private valid;
    private validDependencies;
    private evaluate;
    private static observePromise;
    private observeIterator;
    private next;
    private static queueNext;
    private static observeStep;
    private accept;
    private fail;
    private finish;
    private invalidate;
    private invalidateGraph;
    private stop;
    /** Stop only unfinished asynchronous reads; settled dependency edges stay live. */
    suspend(): boolean;
    resume(): void;
    dispose(): void;
}
