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
