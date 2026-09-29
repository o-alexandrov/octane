/** React-owned structure shared by client rendering and buffered React SSR. */
import * as React from 'react';
export interface ReactCompatObserver {
    pending(visibility: ReactCompatVisibility): void;
    ready(): void;
    error(error: unknown): void;
}
export interface ReactCompatContextValue {
    readonly context: React.Context<any>;
    readonly value: unknown;
}
export type ReactCompatVisibility = 'visible' | 'suspense' | 'activity';
export declare function isReactCompatErrorBoundary(value: unknown): boolean;
export declare function createReactCompatTree(child: React.ReactElement, contexts: readonly ReactCompatContextValue[], observer: ReactCompatObserver | null, visibility?: ReactCompatVisibility): React.ReactElement;
