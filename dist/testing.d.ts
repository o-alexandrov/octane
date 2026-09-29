/**
 * Clamp jsdom's stored scroll position to the range its layout metrics report.
 * Browsers do this for programmatic scroll assignments, but jsdom can retain an
 * out-of-range value because it does not perform layout. Dispatch the native
 * event so components observe the normalized position through their public
 * scroll boundary.
 */
export declare function clampJsdomScrollTop(element: Element): void;
