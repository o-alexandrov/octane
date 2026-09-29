/** Development-only authoring guidance for public client and server resource hints. */
type ResourceHintName = 'prefetchDNS' | 'preconnect' | 'preload' | 'preloadModule' | 'preinit' | 'preinitModule';
export declare function resourceHintWarning(name: ResourceHintName, href: unknown, options: unknown, hasOptions?: boolean): string | null;
export {};
