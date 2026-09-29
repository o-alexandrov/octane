import { type Scope } from './runtime.js';
import { type RendererRegion, type UniversalBoundaryMetadata, type UniversalComponent, type UniversalRoot } from './universal-core.js';
declare const UNIVERSAL_BOUNDARY: unique symbol;
interface HostBoundaryProps {
    root: UniversalRoot;
    component?: UniversalComponent<any>;
    props?: any;
    /** Compiler-owned `children` form used by statically declared boundaries. */
    children?: RendererRegion;
}
/** Coordinate real mixed-renderer owners without charging DOM-only roots. */
export declare function registerUniversalHostBridge(): void;
export declare function createUniversalHostBoundary(renderer: string): ((props: HostBoundaryProps, scope: Scope) => void) & {
    readonly [UNIVERSAL_BOUNDARY]: UniversalBoundaryMetadata;
};
export {};
