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
var engine_exports = {};
__export(engine_exports, {
  ScopeImpl: () => ScopeImpl,
  acceptScopeStreamedResult: () => acceptScopeStreamedResult,
  adoptResourceValue: () => adoptResourceValue,
  bindScopeStreamedSelection: () => bindScopeStreamedSelection,
  createDeclaredSignalCell: () => createDeclaredSignalCell,
  createDerivedCellWith: () => createDerivedCellWith,
  createLocalScope: () => createLocalScope,
  createResourceCellWith: () => createResourceCellWith,
  createScope: () => createScope,
  endSignalBatch: () => import_graph.endSignalBatch,
  failScopeStreamedResult: () => failScopeStreamedResult,
  getResourceSelectionAuthority: () => getResourceSelectionAuthority,
  getSignalScope: () => getSignalScope,
  startSignalBatch: () => import_graph.startSignalBatch
});
module.exports = __toCommonJS(engine_exports);
var import_error_codes_client_generated = require("../error-codes.client.generated.cjs");
var import_encoding = require("./encoding.cjs");
var import_errors = require("./errors.cjs");
var import_scope_streams = require("./scope-streams.cjs");
var import_graph = require("./graph.cjs");
var import_read_protocol = require("./read-protocol.cjs");
let activeFrames;
(0, import_read_protocol.registerNativeBatchHooks)({ startBatch: import_graph.startSignalBatch, endBatch: import_graph.endSignalBatch });
function requireKey(key, label) {
  if (typeof key !== "string" || !key.trim()) {
    throw new TypeError((0, import_error_codes_client_generated.formatClientError)(125, label));
  }
}
function seedKey(key, read = "value") {
  return `${read}:${key}`;
}
function seedState(seed) {
  return (0, import_graph.readyState)(seed.value, {
    complete: seed.entry.complete,
    refreshing: seed.entry.refreshing,
    connection: seed.entry.connection,
    requestKey: seed.entry.request ? JSON.stringify([seed.entry.request.queryKey, seed.entry.request.argument]) : void 0
  });
}
function decodeSeed(scopeKey, seed) {
  seed = (0, import_encoding.snapshotSignalValue)(seed);
  if (!seed || seed.version !== 1 || seed.scopeKey !== scopeKey || !Array.isArray(seed.entries)) {
    throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(126, scopeKey));
  }
  const entries = /* @__PURE__ */ new Map();
  for (const entry of seed.entries) {
    const read = entry?.read ?? "value";
    if (!entry || typeof entry.key !== "string" || !entry.key.trim() || !["signal", "derived", "async"].includes(entry.kind) || typeof entry.complete !== "boolean" || !["value", "latest", "snapshot"].includes(read) || entry.available !== void 0 && (read !== "latest" || typeof entry.available !== "boolean") || entry.refreshing !== void 0 && typeof entry.refreshing !== "boolean" || entry.connection !== void 0 && !["none", "connecting", "open", "closed"].includes(entry.connection) || entries.has(seedKey(entry.key, read))) {
      throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(127));
    }
    const value = (0, import_encoding.decodeSignalValue)(entry.value);
    if (entry.available === false && (value !== void 0 || entry.complete || entry.request !== void 0)) {
      throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(128));
    }
    let request;
    if (entry.kind === "async" && entry.available !== false) {
      if (!entry.request || typeof entry.request.queryKey !== "string" || !entry.request.queryKey.trim() || !["promise", "stream"].includes(entry.request.kind)) {
        throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(129));
      }
      (0, import_encoding.decodeSignalValue)(entry.request.argument);
      request = {
        queryKey: entry.request.queryKey,
        kind: entry.request.kind,
        argument: entry.request.argument
      };
    } else if (entry.request !== void 0) {
      throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(130));
    }
    entries.set(seedKey(entry.key, read), {
      value,
      entry: {
        key: entry.key,
        kind: entry.kind,
        value: entry.value,
        complete: entry.complete,
        ...read !== "value" ? { read } : {},
        ...entry.available === false ? { available: false } : {},
        ...entry.refreshing !== void 0 ? { refreshing: entry.refreshing } : {},
        ...entry.connection !== void 0 ? { connection: entry.connection } : {},
        ...request ? { request } : {}
      }
    });
  }
  return entries;
}
class ScopeImpl {
  constructor(key, options, seedable = true) {
    this.key = key;
    this.seedable = seedable;
    requireKey(key, "scopeKey");
    const traceLimit = options.debug ? options.debug.traceLimit ?? 256 : 0;
    if (!Number.isInteger(traceLimit) || traceLimit < 0 || traceLimit > 1e4) {
      throw new RangeError((0, import_error_codes_client_generated.formatClientError)(131));
    }
    this.traceLimit = traceLimit;
    this.seedEntries = options.seed ? decodeSeed(key, options.seed) : void 0;
  }
  key;
  seedable;
  nodes = /* @__PURE__ */ new Map();
  observers = /* @__PURE__ */ new Set();
  // Optional capabilities allocate on first use. A scope holding only writable
  // and synchronous derived signals, such as every `useSignal$` hook scope,
  // never pays for request, resource, stream, adoption or trace bookkeeping.
  requests = void 0;
  queryDefinitions = void 0;
  resources = void 0;
  streams = void 0;
  derivedBindings = void 0;
  frames = void 0;
  seedEntries;
  traceLimit;
  events = void 0;
  sequence = 0;
  lifetime = 0;
  disposed = false;
  readBarrier;
  /** Internal document lifecycle: mark every owner before cancellation runs user code. */
  suspendReads() {
    if (this.disposed || this.readBarrier === void 0) return;
    this.streams?.suspend();
    if (this.requests) for (const entry of this.requests.values()) entry.stopAttempt();
    if (this.derivedBindings)
      for (const binding of this.derivedBindings.values()) binding.suspend();
  }
  resumeReads() {
    if (this.disposed || this.readBarrier !== void 0) return;
    (0, import_graph.signalBatch)(() => {
      if (this.resources)
        for (const [node, binding] of this.resources) {
          (0, import_graph.refreshNode)(node);
          this.streams?.resume(node, binding);
        }
      if (this.requests)
        for (const entry of this.requests.values()) {
          if (this.readBarrier !== void 0) break;
          if (!entry.active && !entry.state.snapshot.complete && entry.state.snapshot.status !== "error" && entry.consumers.size) {
            entry.start(entry.state.snapshot.status !== "ready");
          }
        }
      if (this.derivedBindings)
        for (const binding of this.derivedBindings.values()) binding.resume();
    });
  }
  get scopeKey() {
    return this.key;
  }
  get epoch() {
    return this.lifetime;
  }
  get retired() {
    return this.disposed;
  }
  createNode(key, kind, allowDuringRead = false) {
    (0, import_graph.assertAlive)(this);
    if (this.seedable && !allowDuringRead) (0, import_graph.assertWritable)();
    requireKey(key, "Signal key");
    if (this.nodes.has(key)) throw new TypeError((0, import_error_codes_client_generated.formatClientError)(132, key));
    const seeds = this.seedEntries;
    if (seeds)
      for (const read of ["value", "latest", "snapshot"]) {
        const seed = seeds.get(seedKey(key, read));
        if (seed && seed.entry.kind !== kind) {
          throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(133, key));
        }
      }
    const node = new import_graph.ScopedNode(this, key, kind);
    this.nodes.set(key, node);
    return node;
  }
  declaredNode(key, kind) {
    (0, import_graph.assertAlive)(this);
    requireKey(key, "Signal key");
    const existing = this.nodes.get(key);
    if (existing) {
      if (existing.kind !== kind) {
        throw new TypeError((0, import_error_codes_client_generated.formatClientError)(134, key, existing.kind));
      }
      return [existing, false];
    }
    return [this.createNode(key, kind, true), true];
  }
  initialSeed(key) {
    const seeds = this.seedEntries;
    return seeds && (seeds.get(seedKey(key)) ?? seeds.get(seedKey(key, "snapshot")));
  }
  retainedSeed(key) {
    const seeds = this.seedEntries;
    if (!seeds) return void 0;
    const seed = seeds.get(seedKey(key, "latest")) ?? this.initialSeed(key);
    return seed?.entry.available === false ? void 0 : seed;
  }
  initializeRetention(node) {
    const seed = this.retainedSeed(node.key);
    if (!seed) return;
    node.lastState = seedState(seed);
    node.last = seed.value;
    node.hasLast = true;
  }
  consumeSeed(key) {
    const seeds = this.seedEntries;
    if (seeds)
      for (const read of ["value", "latest", "snapshot"]) {
        seeds.delete(seedKey(key, read));
      }
  }
  signal$(key, initial) {
    const node = this.createNode(key, "signal");
    const seed = this.initialSeed(key) ?? this.retainedSeed(key);
    node.state = (0, import_graph.readyState)(seed ? seed.value : initial);
    node.lastState = node.state;
    node.last = node.state.snapshot.value;
    node.hasLast = true;
    this.consumeSeed(key);
    return node;
  }
  createSignalDeclaration(key, initial, preferInitial = false) {
    const [node, created] = this.declaredNode(key, "signal");
    if (!created) return node;
    const seed = this.initialSeed(key) ?? this.retainedSeed(key);
    node.state = (0, import_graph.readyState)(seed && !preferInitial ? seed.value : initial);
    node.lastState = node.state;
    node.last = node.state.snapshot.value;
    node.hasLast = true;
    this.consumeSeed(key);
    return node;
  }
  derived$(key, compute) {
    if (typeof compute !== "function") throw new TypeError((0, import_error_codes_client_generated.formatClientError)(122));
    const node = this.createNode(key, "derived");
    node.compute = (target) => (0, import_graph.derivedState)(target, compute);
    this.initializeRetention(node);
    this.consumeSeed(key);
    return node;
  }
  /** Candidate state is private; the ordinary node/binding maps stay untouched. */
  forkCandidate(node, target, frame) {
    if (this.nodes.get(node.key) !== node || this.readBarrier || this.frames?.size) {
      throw new import_graph.CandidateUnsupportedError((0, import_error_codes_client_generated.formatClientError)(135));
    }
    const resource = this.resources?.get(node);
    if (resource) return resource.forkCandidate(target);
    const binding = this.derivedBindings?.get(node);
    if (binding) {
      if (!binding.forkCandidate) {
        throw new import_graph.CandidateUnsupportedError((0, import_error_codes_client_generated.formatClientError)(136));
      }
      return binding.forkCandidate(target, frame);
    }
    target.compute = node.compute;
  }
  createDerivedDeclaration(key, compute, options, Binding) {
    if (typeof compute !== "function") throw new TypeError((0, import_error_codes_client_generated.formatClientError)(122));
    const [node, created] = this.declaredNode(key, "derived");
    if (!created) return node;
    const binding = new Binding(this, node, compute, options);
    (this.derivedBindings ??= /* @__PURE__ */ new Map()).set(node, binding);
    this.initializeRetention(node);
    this.consumeSeed(key);
    return node;
  }
  createResourceDeclaration(key, describe, initialize, unique = false) {
    if (typeof describe !== "function") throw new TypeError((0, import_error_codes_client_generated.formatClientError)(137));
    let node;
    if (unique) node = this.createNode(key, "async");
    else {
      const [declared, created] = this.declaredNode(key, "async");
      if (!created) return declared;
      node = declared;
    }
    const seed = this.initialSeed(key);
    const retained = this.retainedSeed(key);
    this.initializeRetention(node);
    (0, import_graph.signalBatch)(() => {
      const binding = initialize(this, node, describe, seed, retained);
      (this.resources ??= /* @__PURE__ */ new Map()).set(node, binding);
      (0, import_graph.refreshNode)(node);
      this.streams?.flush(node, binding);
    });
    this.consumeSeed(key);
    return node;
  }
  own(handle$) {
    (0, import_graph.assertAlive)(this);
    if (!(handle$ instanceof import_graph.ScopedNode) || handle$.owner !== this) {
      throw new TypeError((0, import_error_codes_client_generated.formatClientError)(138));
    }
    return handle$;
  }
  get(handle$) {
    const node = this.own(handle$);
    return (0, import_graph.strictValue)((0, import_graph.readNode)(node), node.key);
  }
  set(handle$, value) {
    this.own(handle$).set(value);
  }
  isPending(read) {
    (0, import_graph.assertAlive)(this);
    try {
      read();
      return false;
    } catch (error) {
      if ((0, import_graph.isThenable)(error)) return true;
      throw error;
    }
  }
  batch(write) {
    (0, import_graph.assertAlive)(this);
    return (0, import_graph.signalBatch)(write);
  }
  action(write) {
    if (typeof write !== "function") throw new TypeError((0, import_error_codes_client_generated.formatClientError)(139));
    const owner = this;
    return function(...args) {
      return owner.batch(() => write.apply(this, args));
    };
  }
  seedEntry(node, read = "value") {
    const current = node.state?.snapshot;
    if (current?.status === "error" && (current.error instanceof import_errors.ScopeDisposedError || current.error instanceof import_errors.SignalFrameError || current.error instanceof import_read_protocol.NativeAdoptionMiss)) {
      throw current.error;
    }
    const presented = read === "latest" && node.state?.snapshot.status !== "ready" ? node.lastState : node.state;
    if (presented?.owners) for (const owner of presented.owners) (0, import_graph.assertAlive)(owner);
    const snapshot = presented?.snapshot;
    if (snapshot?.status !== "ready") {
      if (read !== "latest") return void 0;
      return {
        key: node.key,
        kind: node.kind,
        read,
        available: false,
        value: ["undefined"],
        complete: false
      };
    }
    const request = this.resources?.get(node)?.seedRequest(read === "latest");
    if (node.kind === "async" && !request) return void 0;
    return {
      key: node.key,
      kind: node.kind,
      ...read !== "value" ? { read } : {},
      value: (0, import_encoding.encodeSignalValue)(snapshot.value),
      complete: snapshot.complete,
      refreshing: snapshot.refreshing,
      connection: snapshot.connection,
      ...request ? { request } : {}
    };
  }
  serialize() {
    (0, import_graph.assertAlive)(this);
    if (!this.seedable) throw new import_errors.SignalSerializationError((0, import_error_codes_client_generated.formatClientError)(140));
    return (0, import_graph.untrack)(() => {
      const entries = [];
      for (const node of this.nodes.values()) {
        (0, import_graph.refreshNode)(node);
        const entry = this.seedEntry(node) ?? this.seedEntry(node, "latest");
        if (entry) entries.push(entry);
      }
      return { version: 1, scopeKey: this.scopeKey, entries };
    });
  }
  /** Serialize an observed ready subgraph, without evaluating anything new. */
  serializeRead(root, read) {
    if (!root.owner.seedable) return [];
    const rootEntry = this.seedEntry(root, read);
    if (!rootEntry) return void 0;
    const owners = /* @__PURE__ */ new Map();
    const keys = /* @__PURE__ */ new Map();
    const seen = /* @__PURE__ */ new Set();
    const pending = [root];
    while (pending.length) {
      const node = pending.pop();
      if (seen.has(node)) continue;
      seen.add(node);
      const owner = node.owner;
      (0, import_graph.assertAlive)(owner);
      if (!owner.seedable) continue;
      const other = keys.get(owner.scopeKey);
      if (other && other !== owner) {
        throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(141));
      }
      keys.set(owner.scopeKey, owner);
      const entry = node === root ? rootEntry : owner.seedEntry(node);
      if (entry) {
        let entries = owners.get(owner);
        if (!entries) owners.set(owner, entries = []);
        entries.push(entry);
      }
      for (let link = node.deps; link; link = link.nextDep) {
        if (link.dep instanceof import_graph.ScopedNode) pending.push(link.dep);
      }
    }
    return [...owners].map(([owner, entries]) => ({
      owner,
      seed: { version: 1, scopeKey: owner.scopeKey, entries }
    }));
  }
  beginAdoption(seed) {
    (0, import_graph.assertAlive)(this);
    if (!this.seedable) throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(142));
    const data = {
      owner: this,
      entries: decodeSeed(this.scopeKey, seed),
      references: 0
    };
    return new AdoptionFrameImpl(data);
  }
  trace(type, node) {
    if (!this.traceLimit) return;
    const event = {
      sequence: ++this.sequence,
      type,
      ...node ? { key: node.key, revision: node.revision } : {}
    };
    const events = this.events ??= [];
    if (events.length === this.traceLimit) {
      events[(event.sequence - 1) % this.traceLimit] = event;
    } else {
      events.push(event);
    }
  }
  inspect() {
    const events = this.events ?? [];
    const traceStart = this.traceLimit && events.length === this.traceLimit ? this.sequence % this.traceLimit : 0;
    return {
      scopeKey: this.scopeKey,
      epoch: this.epoch,
      retired: this.retired,
      activeRequests: this.requests ? [...this.requests.values()].filter((entry) => entry.active).length : 0,
      adoptionLeases: this.frames?.size ?? 0,
      nodes: [...this.nodes.values()].map((node) => {
        const dependencies = [];
        let subscribers = 0;
        for (let link = node.deps; link; link = link.nextDep) {
          if (link.dep instanceof import_graph.ScopedNode) {
            dependencies.push({ scopeKey: link.dep.owner.scopeKey, key: link.dep.key });
          }
        }
        for (let link = node.subs; link; link = link.nextSub) subscribers++;
        return {
          key: node.key,
          kind: node.kind,
          status: node.state?.snapshot.status ?? "unevaluated",
          revision: node.revision,
          subscribers,
          retained: node.hasLast,
          refreshing: node.state?.snapshot.refreshing ?? false,
          connection: node.state?.snapshot.connection ?? "none",
          complete: node.state?.snapshot.complete ?? false,
          dependencies
        };
      }),
      trace: events.map((event, index) => ({
        ...traceStart ? events[(traceStart + index) % events.length] : event
      }))
    };
  }
  dispose() {
    if (this.disposed) return;
    (0, import_graph.assertWritable)();
    (0, import_graph.signalBatch)(() => {
      this.disposed = true;
      this.lifetime++;
      if (this.resources) {
        for (const resource of this.resources.values()) resource.dispose();
        this.resources.clear();
      }
      this.streams?.clear();
      if (this.derivedBindings) {
        for (const binding of this.derivedBindings.values()) binding.dispose();
        this.derivedBindings.clear();
      }
      this.requests?.clear();
      this.queryDefinitions?.clear();
      if (this.frames) for (const frame of this.frames) frame.release();
      (0, import_graph.retireGraph)(this, this.nodes.values());
      this.nodes.clear();
      this.seedEntries?.clear();
      this.trace("retire");
    });
  }
}
class AdoptionFrameImpl {
  constructor(data) {
    this.data = data;
    data.references++;
    (data.owner.frames ??= /* @__PURE__ */ new Set()).add(this);
    data.owner.trace("frame");
  }
  data;
  ended = false;
  sources = /* @__PURE__ */ new Map();
  subscribers = /* @__PURE__ */ new Set();
  get scopeKey() {
    return this.data.owner.scopeKey;
  }
  get released() {
    return this.ended;
  }
  assertActive() {
    (0, import_graph.assertAlive)(this.data.owner);
    if (this.ended) throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(143));
  }
  run(read) {
    this.assertActive();
    const previousFrames = activeFrames;
    activeFrames = new Map(previousFrames);
    activeFrames.set(this.data.owner, this);
    const previousReader = (0, import_graph.setHistoricalReader)(readHistoricalNode);
    const previousGuard = (0, import_read_protocol.beginNativeWriteGuard)();
    try {
      return read();
    } finally {
      (0, import_read_protocol.endNativeWriteGuard)(previousGuard);
      (0, import_graph.setHistoricalReader)(previousReader);
      activeFrames = previousFrames;
    }
  }
  retain() {
    this.assertActive();
    return new AdoptionFrameImpl(this.data);
  }
  read(node, read) {
    this.assertActive();
    const seed = this.data.entries.get(seedKey(node.key, read)) ?? (read === "value" ? void 0 : this.data.entries.get(seedKey(node.key)));
    const sourceKey = seedKey(node.key, read);
    let source = this.sources.get(sourceKey);
    if (!source) {
      source = {
        getVersion: () => this.ended ? 1 : 0,
        subscribe: (notify) => {
          this.assertActive();
          this.subscribers.add(notify);
          return () => this.subscribers.delete(notify);
        },
        inspect: () => {
          const presented = this.ended ? void 0 : this.data.entries.get(sourceKey) ?? (read === "value" ? void 0 : this.data.entries.get(seedKey(node.key)));
          return {
            ...(0, import_graph.inspectNativeNode)(node, read),
            status: presented ? presented.entry.available === false ? "pending" : "ready" : "unevaluated",
            revision: this.ended ? 1 : 0,
            historical: true,
            retained: !!presented && presented.entry.available !== false,
            refreshing: presented?.entry.refreshing ?? false,
            connection: presented?.entry.connection ?? "none",
            complete: presented?.entry.complete ?? false,
            dependencies: []
          };
        }
      };
      this.sources.set(sourceKey, source);
    }
    (0, import_read_protocol.reportNativeRead)(source, 0);
    if (!seed || seed.entry.kind !== node.kind) {
      if ((0, import_read_protocol.getNativeAdoptionResolver)()) throw new import_read_protocol.NativeAdoptionMiss(this.scopeKey, node.key, read);
      throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(144, node.key));
    }
    if (seed.entry.available === false) {
      return {
        snapshot: { status: "pending", refreshing: false, connection: "none", complete: false }
      };
    }
    if (node.kind === "async" && read !== "latest") {
      const binding = this.data.owner.resources?.get(node);
      if (!binding?.acceptsSeed(seed.entry)) {
        throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(145, node.key));
      }
    }
    return seedState(seed);
  }
  release() {
    if (this.ended) return;
    this.ended = true;
    this.data.owner.frames?.delete(this);
    this.sources.clear();
    if (--this.data.references === 0) this.data.entries.clear();
    const callbacks = [...this.subscribers];
    this.subscribers.clear();
    for (const notify of callbacks) (0, import_graph.untrack)(notify);
  }
}
function readHistoricalNode(node, read) {
  const owner = node.owner;
  if (!owner.seedable) return void 0;
  const frame = activeFrames?.get(owner);
  if (!frame) {
    const resolved = (0, import_read_protocol.getNativeAdoptionResolver)()?.(owner);
    if (resolved) return resolved.run(() => (0, import_graph.readNode)(node, read));
    if ((0, import_read_protocol.getNativeAdoptionResolver)()) throw new import_read_protocol.NativeAdoptionMiss(owner.scopeKey, node.key, read);
    throw new import_errors.SignalFrameError((0, import_error_codes_client_generated.formatClientError)(146, owner.scopeKey));
  }
  return frame.read(node, read);
}
function createScope(options) {
  if (!options || typeof options !== "object") throw new TypeError((0, import_error_codes_client_generated.formatClientError)(147));
  return new ScopeImpl(options.scopeKey, options);
}
function createLocalScope(scopeKey) {
  return new ScopeImpl(scopeKey, { scopeKey }, false);
}
function createDeclaredSignalCell(owner, key, initial, preferInitial = false) {
  if (!(owner instanceof ScopeImpl)) throw new TypeError((0, import_error_codes_client_generated.formatClientError)(148));
  return owner.createSignalDeclaration(key, initial, preferInitial);
}
function createDerivedCellWith(owner, key, compute, options, Binding) {
  if (!(owner instanceof ScopeImpl)) throw new TypeError((0, import_error_codes_client_generated.formatClientError)(149));
  return owner.createDerivedDeclaration(key, compute, options, Binding);
}
function createResourceCellWith(owner, key, describe, initialize, unique = false) {
  if (!(owner instanceof ScopeImpl)) throw new TypeError((0, import_error_codes_client_generated.formatClientError)(150));
  return owner.createResourceDeclaration(key, describe, initialize, unique);
}
function adoptResourceValue(handle$, requestKey, value) {
  if (!(handle$ instanceof import_graph.ScopedNode) || !(handle$.owner instanceof ScopeImpl)) return false;
  const binding = handle$.owner.resources?.get(handle$);
  return binding ? binding.adopt(requestKey, value) : false;
}
function getSignalScope(handle$) {
  return handle$ instanceof import_graph.ScopedNode && handle$.owner instanceof ScopeImpl ? handle$.owner : void 0;
}
function getResourceSelectionAuthority(handle$) {
  if (!(handle$ instanceof import_graph.ScopedNode) || !(handle$.owner instanceof ScopeImpl)) return;
  return handle$.owner.resources?.get(handle$)?.authority;
}
function bindScopeStreamedSelection(owner, identity) {
  if (!(owner instanceof ScopeImpl)) return false;
  (0, import_graph.assertAlive)(owner);
  const node = owner.nodes.get(identity.nodeKey);
  if (node && node.kind !== "async") return false;
  return (0, import_scope_streams.scopeStreams)(owner).bind(identity, node);
}
function acceptScopeStreamedResult(owner, frame) {
  if (!(owner instanceof ScopeImpl)) return false;
  (0, import_graph.assertAlive)(owner);
  return owner.streams?.accept(frame) ?? false;
}
function failScopeStreamedResult(owner, identity, error) {
  if (!(owner instanceof ScopeImpl)) return false;
  (0, import_graph.assertAlive)(owner);
  return owner.streams?.fail(identity, error) ?? false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ScopeImpl,
  acceptScopeStreamedResult,
  adoptResourceValue,
  bindScopeStreamedSelection,
  createDeclaredSignalCell,
  createDerivedCellWith,
  createLocalScope,
  createResourceCellWith,
  createScope,
  endSignalBatch,
  failScopeStreamedResult,
  getResourceSelectionAuthority,
  getSignalScope,
  startSignalBatch
});
