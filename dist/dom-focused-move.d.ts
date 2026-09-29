/**
 * Move native presentation without detaching active editing when possible.
 * Both the general renderer and renderer-free keyed views use this leaf; callers
 * retain their own focus/selection capture and commit lifetime.
 */
export declare function moveNativeNodeBefore(parent: Node, node: Node, anchor: Node | null, focused: Element | null, contentEditable: boolean): void;
