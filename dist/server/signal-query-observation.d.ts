import type { ServerSignalQueryAttemptObservations } from '../signals/query-attempt-observer.js';
/** Allocate server mirrors only for an observed attempt, not ordinary browser requests. */
export declare function createServerSignalQueryAttemptObservations(): ServerSignalQueryAttemptObservations;
