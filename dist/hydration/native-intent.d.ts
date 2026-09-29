import type { EarlyHydrationIntent } from './control-capture.js';
export declare const NATIVE_HYDRATION_CAPTURE_KEY = "__octaneNativeHydrationCapture";
/** @internal Parser-installed features preserve native activation before client opt-in. */
export interface NativeHydrationCapture {
    skip(event: Event): boolean;
    /** The opted parser preserves adjacency even after command custody is discarded. */
    next?: () => number;
    push?: (intent: EarlyHydrationIntent) => void;
}
export declare function getNativeHydrationCapture(document: Document): NativeHydrationCapture | undefined;
/** @internal Native accessors cannot be shadowed by form controls with DOM names. */
export interface NativeHydrationDOM {
    element(value: unknown): value is Element;
    owner(node: Node): Document | null;
    parent(node: Node): Element | null;
    connected(node: Node): boolean;
    kind(node: Node): number;
    contains(container: Element, node: Node): boolean;
    matches(element: Element, selector: string): boolean;
    query(element: Element, selector: string): NodeListOf<Element>;
    closest(element: Element, selector: string): Element | null;
    attribute(element: Element, name: string): string | null;
    children(element: Element): HTMLCollection;
    target(event: Event): Element | null;
}
/** @internal Resolve the container's realm before its named properties can interfere. */
export declare function getNativeHydrationDocument(value: unknown): Document | null;
/** @internal Created only for explicitly enabled native capture, once per document. */
export declare function getNativeHydrationDOM(document: Document): NativeHydrationDOM;
