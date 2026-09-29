import { type ServerResultLimits } from './server-rpc-protocol.js';
/** A single-consumer result; iterator.return() cancels only this invocation. */
export declare function readServerResult(response: Response, options?: ServerResultLimits & {
    signal?: AbortSignal;
}): Promise<unknown>;
