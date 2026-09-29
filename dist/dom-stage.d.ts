export declare class DOMStage {
    private captureGuard?;
    private views;
    private children;
    private links;
    private projections;
    private parents;
    private values;
    private states;
    private styles;
    private documents;
    private fresh;
    private actions;
    private ended;
    constructor(captureGuard?: (() => (() => boolean) | undefined) | undefined);
    /** Mark an actual creation/clone result, never an arbitrary detached node. */
    created<T extends Node>(node: T): T;
    view<T extends Node | null | undefined>(node: T): T;
    /** Lifecycle work is interleaved with host writes, especially before removal. */
    enqueue(action: () => void, durable?: boolean): void;
    commit(): void;
    private release;
    private isFresh;
    private childList;
    private childNodes;
    private child;
    private parent;
    private siblings;
    private root;
    private contains;
    private collection;
    private inertDocument;
    /** Native reflection/coercion runs in a document with no custom registry. */
    private state;
    /** Cold selector/form reads use an inert projection and map results back. */
    private projection;
    private textContent;
    get(node: Node, key: PropertyKey): unknown;
    private value;
    set(node: Node, key: PropertyKey, value: unknown): void;
    private setFormProperty;
    private style;
    private classList;
    private write;
    private remove;
    private insert;
    private replaceChildren;
    /** Clear a shared-parent range once while retaining both live anchors. */
    clearBetween(start: Node, end: Node): void;
    private nodes;
    private call;
}
