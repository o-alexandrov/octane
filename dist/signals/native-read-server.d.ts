import { type NativeReadWitness } from './native-read-collector.js';
import { mergeNativeSeedReads, rewindNativeSeedReads, serializeNativeSeedReads, type NativeSeedReads } from './native-read-seeds.js';
interface ServerFrame {
    collectorToken: number;
    reads: NativeSeedReads | null;
}
/** Failed server branches cannot contribute seeds for markup they did not emit. */
export declare function createNativeServerReadDriver(record: (reads: NativeReadWitness) => void, recordFailure: () => void): {
    merge: typeof mergeNativeSeedReads;
    rewindReads: typeof rewindNativeSeedReads;
    serialize: typeof serializeNativeSeedReads;
    isDetached: () => boolean;
    pauseLifecycle: () => number;
    resumeLifecycle: (token: number) => void;
    checkpoint(): {
        frame: ServerFrame;
        reads: NativeSeedReads | null;
        size: number;
        mixed: boolean;
    } | null;
    rewind(checkpoint: {
        frame: ServerFrame;
        reads: NativeSeedReads | null;
        size: number;
        mixed: boolean;
    }): void;
    beginPass(): number;
    endPass(token: number): void;
    beginScope(owner: object): number;
    endScope(token: number, completed: boolean): void;
    /** A renderer boundary may emit its successful body in a later segment. */
    beginCapture(): number;
    finishCapture(token: number, merge: boolean): NativeSeedReads | null;
    append: (reads: NativeReadWitness) => void;
    beginWitness: (detached?: boolean) => number;
    finishWitness: (token: number, completed: boolean) => NativeReadWitness | null;
    replay: (witness: NativeReadWitness | null | undefined) => void;
};
export {};
