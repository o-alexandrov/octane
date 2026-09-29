import { type ServerResultLimits } from '../server-rpc-protocol.js';
/**
 * One invocation, one bounded result channel. next() is demand-driven: a slow
 * reader cannot make a generator produce an unbounded server-side mailbox.
 */
export declare function createServerResultStream(result: unknown, options?: ServerResultLimits & {
    signal?: AbortSignal;
    cancel?: () => void;
}): ReadableStream<Uint8Array>;
