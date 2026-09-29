import type { SignalBindingIdentity, SignalOwner } from './types.js';
type ControlChannel = 'value' | 'checked';
type EarlyValue = {
    revision: number;
    value: unknown;
};
type ControlWriter = (value: unknown) => void;
/** @internal Associate an engine-free signal owner with its browser document. */
export declare function registerSignalOwnerDocument(owner: SignalOwner, ownerDocument: Document): void;
/** @internal Read the last pre-activation edit before creating a writable cell. */
export declare function readEarlySignalValue(owner: SignalOwner, binding: SignalBindingIdentity): EarlyValue | undefined;
/** @internal Publish a native edit into both the pre-module buffer and any live binding. */
export declare function publishHydrationControlSignalValues(control: Element, revision: number): void;
/** @internal Let candidate application update the already-live writable cell directly. */
export declare function registerHydrationControlSignalWriter(control: Element, channel: ControlChannel, write: ControlWriter): () => void;
/** @internal A writable binding already provides this control's native input handler. */
export declare function hasHydrationControlSignalWriter(control: Element, channel: ControlChannel): boolean;
/** @internal Carry edit authority across module handoff, even after editing back to SSR. */
export declare function readEarlyHydrationControlRevision(control: Element): number;
/** @internal Retire the imported revision only after exact control-state adoption. */
export declare function clearEarlyHydrationControlRevision(control: Element): void;
/** @internal Module capture replaces the inline writer for this document. */
export declare function claimEarlyHydrationControlCapture(ownerDocument: Document): void;
export {};
