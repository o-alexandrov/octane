/** Pure element-value operations shared without coupling renderer runtime graphs. */
/** Apply component defaults to a newly allocated public element props object. */
export declare function applyElementDefaultProps(type: any, props: any): void;
/** Resolve live lazy-component defaults without mutating or needlessly cloning props. */
export declare function resolveLazyDefaultProps(component: any, props: any): any;
/** Preserve React-compatible slash escaping for flattened mapped children. */
export declare function escapeMappedElementKey(key: string): string;
/** Preserve explicit escaped child keys and implicit base-36 positional keys. */
export declare function childElementKey(child: any, index: number): string;
/** React accepts iterable objects but ignores functions with attached iterators. */
export declare function childrenIterator(children: any): (() => Iterator<any>) | null;
/**
 * The text one renderable `<textarea>` child contributes to its default value.
 * Textarea content is RCDATA: the HTML parser keeps markup and comments inside
 * it as literal text, so neither renderer can place an element or a hydration
 * marker there. Strings and numbers render, the empty values (null, undefined,
 * booleans) render nothing, and arrays or iterables concatenate their items.
 * Any other value goes to `reject`, which throws the renderer's own error.
 */
export declare function textareaChildText(value: unknown, reject: (child: unknown) => never): string;
/** Name a non-text `<textarea>` child for its error message. */
export declare function describeTextareaChild(value: unknown, isElement: (value: unknown) => boolean): string;
