/**
 * Compose the compiler's module-local head key with the existing root ID
 * namespace. Sibling hydrating roots already require distinct
 * `identifierPrefix` values; carrying that namespace into head ownership lets
 * them hydrate in any order without claiming another root's metadata.
 *
 * The optional hexadecimal root suffix is fixed-width and comment-safe. This
 * runs only for authored head entries (server serialization and the client's
 * one-time adoption), never on the ordinary component/host update path.
 */
export declare function headOwnershipSuffix(identifierPrefix: string): string;
export declare function headOwnershipKey(key: string, identifierPrefix: string): string;
