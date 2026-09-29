import { type OctaneNode } from '../index.js';
import { type ReactCompatComponentProps, type ReactCompatClassComponentProps, type ReactCompatProps } from './react-compat-shared.js';
declare function ReactCompatImpl<C extends import('react').ComponentClass<any>>(props: ReactCompatClassComponentProps<C>): OctaneNode;
declare function ReactCompatImpl<P>(props: ReactCompatComponentProps<P>): OctaneNode;
declare function ReactCompatImpl(props: ReactCompatProps): OctaneNode;
/** Host one React component under Octane, with real React hooks and events. */
export declare const ReactCompat: typeof ReactCompatImpl;
export {};
