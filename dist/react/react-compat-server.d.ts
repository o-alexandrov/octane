import type { OctaneNode } from '../runtime.js';
import { type ReactCompatClassComponentProps, type ReactCompatComponentProps, type ReactCompatProps } from './react-compat-shared.js';
declare function ReactCompatServer<C extends import('react').ComponentClass<any>>(props: ReactCompatClassComponentProps<C>): OctaneNode;
declare function ReactCompatServer<P>(props: ReactCompatComponentProps<P>): OctaneNode;
declare function ReactCompatServer(props: ReactCompatProps): OctaneNode;
export declare const ReactCompat: typeof ReactCompatServer;
export {};
