/** Development-only host-name/value diagnostics shared by DOM and SSR. */
export declare function hostPropertyWarning(name: string, value: unknown, tag?: string, isSvg?: boolean): string | null;
/** React-style guidance for ambiguous string values on native boolean props. */
export declare function booleanAttributeStringWarning(name: string, value: unknown): string | null;
/** Group function/symbol host values into one singular/plural diagnostic. */
export declare function invalidHostPropertiesWarning(names: readonly string[], tag: string): string;
/** Explain why empty image/object/stylesheet URLs cannot safely be emitted. */
export declare function emptyResourceUrlWarning(name: string): string;
/** Explain an attribute coercion failure without replacing its exception. */
export declare function unsupportedAttributeCoercionWarning(name: string, value: unknown): string;
