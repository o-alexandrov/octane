/**
 * Shared React-shaped form authoring diagnostics. Callers provide the final
 * native-host prop snapshot so source evaluation and observable DOM behavior
 * stay untouched; both runtimes invoke this helper only from DEV-only paths.
 */
export interface FormAuthoringDiagnostic {
    kind: string;
    message: string;
}
export declare function formAuthoringDiagnostics(tag: string, props: Record<string, unknown>, children?: unknown): FormAuthoringDiagnostic[];
