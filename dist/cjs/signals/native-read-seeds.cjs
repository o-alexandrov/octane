"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var native_read_seeds_exports = {};
__export(native_read_seeds_exports, {
  NATIVE_SIGNAL_FRESH_COMMENT: () => NATIVE_SIGNAL_FRESH_COMMENT,
  NATIVE_SIGNAL_SEED_ATTR: () => NATIVE_SIGNAL_SEED_ATTR,
  captureInitialDocumentSignals: () => captureInitialDocumentSignals,
  createNativeAdoptionState: () => createNativeAdoptionState,
  materializeNativeSignalManifest: () => materializeNativeSignalManifest,
  mergeNativeSeedReads: () => mergeNativeSeedReads,
  parseNativeSignalManifest: () => parseNativeSignalManifest,
  rewindNativeSeedReads: () => rewindNativeSeedReads,
  serializeNativeSeedReads: () => serializeNativeSeedReads
});
module.exports = __toCommonJS(native_read_seeds_exports);
var import_error_codes_client_generated = require("../error-codes.client.generated.cjs");
var import_data_encoding = require("../data-encoding.cjs");
const NATIVE_SIGNAL_SEED_ATTR = "data-octane-native-signals";
const NATIVE_SIGNAL_FRESH_COMMENT = "oct-native-fresh:";
function seedEntryKey(entry) {
  return (entry.read ?? "value") + ":" + entry.key;
}
function seedEntrySignature(entry) {
  return JSON.stringify((0, import_data_encoding.snapshotSignalValue)({ ...entry, read: entry.read ?? "value" }));
}
const capturedInitialDocumentSignals = /* @__PURE__ */ new WeakMap();
function captureInitialDocumentSignals(seed, scopeKey) {
  return getInitialDocumentCapture(seed, scopeKey).seed;
}
function getInitialDocumentCapture(seed, scopeKey) {
  const previous = capturedInitialDocumentSignals.get(seed);
  if (previous !== void 0) {
    if (scopeKey !== void 0 && previous.seed.scopeKey !== scopeKey)
      throw new Error((0, import_error_codes_client_generated.formatClientError)(170));
    return previous;
  }
  const captured = (0, import_data_encoding.snapshotSignalValue)(seed);
  if (captured === null || typeof captured !== "object" || captured.version !== 1 || typeof captured.scopeKey !== "string" || !captured.scopeKey.trim() || scopeKey !== void 0 && captured.scopeKey !== scopeKey || !Array.isArray(captured.entries))
    throw new Error((0, import_error_codes_client_generated.formatClientError)(170));
  const entries = /* @__PURE__ */ new Map();
  const signatures = /* @__PURE__ */ new Map();
  for (const entry of captured.entries) {
    const read = entry?.read ?? "value";
    if (entry === null || typeof entry !== "object" || typeof entry.key !== "string" || !entry.key.trim() || !["signal", "derived", "async"].includes(entry.kind) || !["value", "latest", "snapshot"].includes(read) || typeof entry.complete !== "boolean" || !Array.isArray(entry.value) || entry.available !== void 0 && (read !== "latest" || typeof entry.available !== "boolean") || entry.refreshing !== void 0 && typeof entry.refreshing !== "boolean" || entry.connection !== void 0 && !["none", "connecting", "open", "closed"].includes(entry.connection) || entries.has(seedEntryKey(entry)))
      throw new Error((0, import_error_codes_client_generated.formatClientError)(171));
    if (entry.available === false) {
      if (entry.complete || entry.request !== void 0 || entry.value.length !== 1 || entry.value[0] !== "undefined")
        throw new Error((0, import_error_codes_client_generated.formatClientError)(172));
    } else if (entry.kind === "async") {
      const request = entry.request;
      if (request === null || typeof request !== "object" || typeof request.queryKey !== "string" || !request.queryKey.trim() || !["promise", "stream"].includes(request.kind) || !Array.isArray(request.argument))
        throw new Error((0, import_error_codes_client_generated.formatClientError)(173));
      (0, import_data_encoding.decodeSignalValue)(request.argument);
    } else if (entry.request !== void 0) {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(174));
    }
    (0, import_data_encoding.decodeSignalValue)(entry.value);
    const key = seedEntryKey(entry);
    entries.set(key, entry);
    signatures.set(key, seedEntrySignature(entry));
  }
  const result = { seed: captured, entries, signatures };
  capturedInitialDocumentSignals.set(captured, result);
  return result;
}
function mergeNativeSeedReads(previous, next) {
  const target = previous ?? { reads: /* @__PURE__ */ new Map(), mixed: false };
  if (next.mixed) target.mixed = true;
  for (const [source, version] of next.reads) {
    const prior = target.reads.get(source);
    if (prior === void 0) target.reads.set(source, version);
    else if (prior !== version) target.mixed = true;
  }
  return target;
}
function rewindNativeSeedReads(reads, size, mixed) {
  if (reads === null) return;
  let index = 0;
  for (const source of reads.reads.keys()) {
    if (index++ >= size) reads.reads.delete(source);
  }
  reads.mixed = mixed;
}
function serializeNativeSeedReads(reads, initialDocumentSignals) {
  if (reads === null) return void 0;
  if (reads.mixed) throw new Error((0, import_error_codes_client_generated.formatClientError)(175));
  const scopes = /* @__PURE__ */ new Map();
  const claims = /* @__PURE__ */ new Map();
  for (const [source, version] of reads.reads) {
    if (source.getVersion() !== version) throw new Error((0, import_error_codes_client_generated.formatClientError)(176));
    const seeds = source.serialize?.(version);
    if (source.getVersion() !== version) throw new Error((0, import_error_codes_client_generated.formatClientError)(177));
    if (seeds === void 0) {
      if (source.serialize !== void 0) throw new Error((0, import_error_codes_client_generated.formatClientError)(178));
      continue;
    }
    for (const { owner, seed } of seeds) {
      const claimant = claims.get(seed.scopeKey);
      if (claimant !== void 0 && claimant !== owner)
        throw new Error((0, import_error_codes_client_generated.formatClientError)(179, seed.scopeKey));
      claims.set(seed.scopeKey, owner);
      let entries = scopes.get(seed.scopeKey);
      if (entries === void 0) scopes.set(seed.scopeKey, entries = /* @__PURE__ */ new Map());
      for (const entry of seed.entries) {
        const channel = entry.read ?? "value";
        const key = channel + ":" + entry.key;
        const previous = entries.get(key);
        if (previous !== void 0 && JSON.stringify(previous) !== JSON.stringify(entry))
          throw new Error((0, import_error_codes_client_generated.formatClientError)(180, seed.scopeKey, entry.key));
        entries.set(key, entry);
      }
    }
  }
  if (scopes.size === 0) return void 0;
  let references;
  let initialDocumentScopeKey;
  if (initialDocumentSignals !== void 0) {
    const initial = getInitialDocumentCapture(initialDocumentSignals);
    initialDocumentScopeKey = initial.seed.scopeKey;
    const documentEntries = scopes.get(initialDocumentScopeKey);
    if (documentEntries !== void 0) {
      for (const [key, entry] of documentEntries) {
        if (initial.signatures.get(key) === seedEntrySignature(entry)) {
          (references ??= []).push({ key: entry.key, read: entry.read ?? "value" });
          documentEntries.delete(key);
        }
      }
      if (references !== void 0 && documentEntries.size === 0)
        scopes.delete(initialDocumentScopeKey);
    }
  }
  const serializedScopes = Array.from(scopes, ([scopeKey, entries]) => ({
    version: 1,
    scopeKey,
    entries: Array.from(entries.values())
  }));
  if (references !== void 0)
    return {
      version: 2,
      scopes: serializedScopes,
      initialDocument: { scopeKey: initialDocumentScopeKey, entries: references }
    };
  return {
    version: 1,
    scopes: serializedScopes
  };
}
function parseNativeSignalManifest(raw) {
  return validateNativeSignalManifest(JSON.parse(raw));
}
function validateNativeSignalManifest(value) {
  if (value === null || typeof value !== "object" || value.version !== 1 && value.version !== 2 || !Array.isArray(value.scopes))
    throw new Error((0, import_error_codes_client_generated.formatClientError)(181));
  const manifest = value;
  const keys = /* @__PURE__ */ new Set();
  for (const scope of manifest.scopes) {
    if (scope === null || typeof scope !== "object" || scope.version !== 1 || typeof scope.scopeKey !== "string" || scope.scopeKey.length === 0 || !Array.isArray(scope.entries) || keys.has(scope.scopeKey))
      throw new Error((0, import_error_codes_client_generated.formatClientError)(182));
    keys.add(scope.scopeKey);
  }
  if (manifest.version === 2) {
    const document = manifest.initialDocument;
    if (document === null || typeof document !== "object" || typeof document.scopeKey !== "string" || !document.scopeKey.trim() || !Array.isArray(document.entries) || document.entries.length === 0)
      throw new Error((0, import_error_codes_client_generated.formatClientError)(183));
    const references = /* @__PURE__ */ new Set();
    for (const reference of document.entries) {
      if (reference === null || typeof reference !== "object" || typeof reference.key !== "string" || !reference.key.trim() || !["value", "latest", "snapshot"].includes(reference.read) || references.has(seedEntryKey(reference)))
        throw new Error((0, import_error_codes_client_generated.formatClientError)(184));
      references.add(seedEntryKey(reference));
    }
  }
  return manifest;
}
function materializeNativeSignalManifest(manifest, initialDocumentSignals) {
  if (manifest.version === 1) return manifest;
  validateNativeSignalManifest(manifest);
  if (initialDocumentSignals === void 0) throw new Error((0, import_error_codes_client_generated.formatClientError)(185));
  const document = manifest.initialDocument;
  const initial = getInitialDocumentCapture(initialDocumentSignals, document.scopeKey);
  const entries = /* @__PURE__ */ new Map();
  for (const reference of document.entries) {
    const key = seedEntryKey(reference);
    const entry = initial.entries.get(key);
    if (entry === void 0 || entries.has(key)) throw new Error((0, import_error_codes_client_generated.formatClientError)(186));
    entries.set(key, entry);
  }
  for (const scope of manifest.scopes) {
    if (scope.scopeKey !== document.scopeKey) continue;
    for (const entry of scope.entries) {
      const key = seedEntryKey(entry);
      if (entries.has(key)) throw new Error((0, import_error_codes_client_generated.formatClientError)(187));
      entries.set(key, entry);
    }
  }
  return {
    version: 1,
    scopes: [
      ...manifest.scopes.filter((scope) => scope.scopeKey !== document.scopeKey),
      { version: 1, scopeKey: document.scopeKey, entries: Array.from(entries.values()) }
    ]
  };
}
function createNativeAdoptionState(manifest, initialDocumentSignals) {
  const materialized = materializeNativeSignalManifest(manifest, initialDocumentSignals);
  const seeds = new Map(materialized.scopes.map((seed) => [seed.scopeKey, seed]));
  const frames = /* @__PURE__ */ new Map();
  const claims = /* @__PURE__ */ new Map();
  let released = false;
  return {
    resolve(owner) {
      if (released) return void 0;
      const seed = seeds.get(owner.scopeKey);
      if (seed === void 0) return void 0;
      const claimant = claims.get(owner.scopeKey);
      if (claimant !== void 0 && claimant !== owner)
        throw new Error((0, import_error_codes_client_generated.formatClientError)(188, owner.scopeKey));
      let frame = frames.get(owner);
      if (frame === void 0) {
        frame = owner.beginAdoption(seed);
        claims.set(owner.scopeKey, owner);
        frames.set(owner, frame);
      }
      return frame;
    },
    release() {
      if (released) return;
      released = true;
      let failure;
      let failed = false;
      try {
        for (const frame of frames.values()) {
          try {
            frame.release();
          } catch (error) {
            if (!failed) failure = error;
            failed = true;
          }
        }
      } finally {
        frames.clear();
        claims.clear();
        seeds.clear();
      }
      if (failed) throw failure;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NATIVE_SIGNAL_FRESH_COMMENT,
  NATIVE_SIGNAL_SEED_ATTR,
  captureInitialDocumentSignals,
  createNativeAdoptionState,
  materializeNativeSignalManifest,
  mergeNativeSeedReads,
  parseNativeSignalManifest,
  rewindNativeSeedReads,
  serializeNativeSeedReads
});
