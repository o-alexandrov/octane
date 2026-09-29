/** Development-only ARIA naming diagnostics shared by the DOM and SSR runtimes. */
/** Return whether an authored property belongs to the ARIA naming surface. */
export declare function isAriaAttributeName(name: string): boolean;
/** Unknown lowercase aria-* names aggregate by host; casing errors do not. */
export declare function isUnknownAriaAttribute(name: string): boolean;
/** Build Octane's actionable development diagnostic without changing serialization. */
export declare function ariaAttributeWarning(name: string, tag: string): string | null;
/** Group separately unknown lowercase names into React's singular/plural form. */
export declare function unknownAriaAttributeWarning(names: readonly string[], tag: string): string;
