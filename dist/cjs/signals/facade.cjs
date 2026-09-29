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
var facade_exports = {};
__export(facade_exports, {
  DerivedDescriptor: () => DerivedDescriptor,
  Descriptor: () => Descriptor,
  __derivedScalarAt: () => __derivedScalarAt,
  __signalAt: () => __signalAt,
  __startSignalReads: () => __startSignalReads,
  acceptStreamedSignalResult: () => acceptStreamedSignalResult,
  attachStreamedSignalResult: () => attachStreamedSignalResult,
  bindStreamedSignalSelection: () => bindStreamedSignalSelection,
  createSignalOwnerLifecycle: () => createSignalOwnerLifecycle,
  descriptorKey: () => descriptorKey,
  failStreamedSignalResult: () => failStreamedSignalResult,
  initializeDocumentSignalOwner: () => initializeDocumentSignalOwner,
  isSignalHandle: () => import_handle_protocol2.isSignalHandle,
  isWritableSignal: () => import_handle_protocol2.isWritableSignal,
  readSignalBinding: () => readSignalBinding,
  resolveCurrentSignalHandle: () => resolveCurrentSignalHandle,
  resolveSignalHandleForOwner: () => resolveSignalHandleForOwner,
  resolveSignalHandleForScope: () => resolveSignalHandleForScope,
  signal$: () => signal$,
  signalOptionsKey: () => signalOptionsKey
});
module.exports = __toCommonJS(facade_exports);
var import_engine = require("./engine.cjs");
var import_scalar_computations = require("./scalar-computations.cjs");
var import_errors = require("./errors.cjs");
var import_scope_streams = require("./scope-streams.cjs");
var import_graph = require("./graph.cjs");
var import_early_values = require("./early-values.cjs");
var import_read_protocol = require("./read-protocol.cjs");
var import_handle_protocol = require("./handle-protocol.cjs");
var import_handle_protocol2 = require("./handle-protocol.cjs");
var import_owner_context = require("./owner-context.cjs");
var import_types = require("./types.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const identityScopes = /* @__PURE__ */ new WeakMap();
const scopeOwners = /* @__PURE__ */ new WeakMap();
const retiredIdentities = /* @__PURE__ */ new WeakSet();
const documentInstances = /* @__PURE__ */ new WeakMap();
const instanceDocuments = /* @__PURE__ */ new WeakMap();
const frozenDocuments = /* @__PURE__ */ new WeakMap();
function isScope(owner) {
  return typeof owner.signal$ === "function";
}
function isRendererOwner(owner) {
  return "documentOwner" in owner && "instanceOwner" in owner && typeof owner.instanceKey === "string";
}
function resolveIdentity(identity, scopeKey, owner) {
  if (retiredIdentities.has(identity))
    throw new import_errors.ScopeDisposedError(scopeKey);
  let scope = identityScopes.get(identity);
  if (!scope) {
    scope = (0, import_engine.createScope)({ scopeKey });
    identityScopes.set(identity, scope);
    scopeOwners.set(scope, owner);
    const barrier = frozenDocuments.get(isRendererOwner(owner) ? owner.documentOwner : owner);
    if (barrier !== void 0)
      scope.readBarrier = barrier;
  }
  return scope;
}
function initializeDocumentSignalOwner(owner, seed) {
  if (isScope(owner) || isRendererOwner(owner)) {
    throw new TypeError(__octaneDev ? "Initial document signals require an implicit document owner." : __octaneNoArgError(155));
  }
  if (retiredIdentities.has(owner))
    throw new import_errors.ScopeDisposedError(owner.scopeKey);
  if (identityScopes.has(owner)) {
    throw new Error(__octaneDev ? "Initial document signals must be installed once, before any signal reads or writes." : __octaneNoArgError(156));
  }
  const scope = (0, import_engine.createScope)({ scopeKey: owner.scopeKey, seed });
  const barrier = frozenDocuments.get(owner);
  if (barrier !== void 0)
    scope.readBarrier = barrier;
  identityScopes.set(owner, scope);
  scopeOwners.set(scope, owner);
}
function resolveOwner(owner) {
  if (isScope(owner))
    return owner;
  if (isRendererOwner(owner)) {
    if (!isScope(owner.documentOwner) && retiredIdentities.has(owner.documentOwner)) {
      throw new import_errors.ScopeDisposedError(owner.documentOwner.scopeKey);
    }
    if (isScope(owner.documentOwner) && owner.documentOwner.retired) {
      throw new import_errors.ScopeDisposedError(owner.documentOwner.scopeKey);
    }
    let instances = documentInstances.get(owner.documentOwner);
    if (!instances)
      documentInstances.set(owner.documentOwner, instances = /* @__PURE__ */ new Set());
    instances.add(owner.instanceOwner);
    instanceDocuments.set(owner.instanceOwner, owner.documentOwner);
    const documentKey = owner.documentOwner.scopeKey;
    return resolveIdentity(owner.instanceOwner, `${documentKey}:instance:${owner.instanceKey}`, owner);
  }
  return resolveIdentity(owner, owner.scopeKey, owner);
}
function resolveDescriptorOwner(site, owner) {
  if (isScope(owner))
    owner = scopeOwners.get(owner) ?? owner;
  if (!isRendererOwner(owner))
    return resolveOwner(owner);
  if (site?.startsWith("g:"))
    return resolveOwner(owner.documentOwner);
  if (site?.startsWith("i:")) {
    return resolveOwner(owner);
  }
  return resolveOwner(owner);
}
function existingIdentityScope(identity) {
  if (retiredIdentities.has(identity))
    return;
  const scope = identityScopes.get(identity);
  return scope?.retired ? void 0 : scope;
}
function streamedScope(owner, identity, create) {
  if (isScope(owner)) {
    return !owner.retired && identity.ownerKey === owner.scopeKey ? owner : void 0;
  }
  if (!isRendererOwner(owner))
    return;
  if (identity.ownerKey !== owner.documentOwner.scopeKey || identity.instanceKey !== owner.instanceKey || !identity.nodeKey.startsWith("g:") && !identity.nodeKey.startsWith("i:")) {
    return;
  }
  const documentRetired = isScope(owner.documentOwner) ? owner.documentOwner.retired : retiredIdentities.has(owner.documentOwner);
  if (documentRetired || retiredIdentities.has(owner.instanceOwner))
    return;
  const target = identity.nodeKey.startsWith("g:") ? owner.documentOwner : owner;
  if (create)
    return resolveDescriptorOwner(identity.nodeKey, target);
  if (isScope(target))
    return target.retired ? void 0 : target;
  return existingIdentityScope(isRendererOwner(target) ? target.instanceOwner : target);
}
(0, import_owner_context.installSignalOwnerRetirement)((owner) => {
  if (isScope(owner))
    return;
  const identity = isRendererOwner(owner) ? owner.instanceOwner : owner;
  if (isRendererOwner(owner)) {
    const document = instanceDocuments.get(identity);
    if (document)
      documentInstances.get(document)?.delete(identity);
    instanceDocuments.delete(identity);
  } else {
    const instances = documentInstances.get(identity);
    if (instances) {
      for (const instance of instances) {
        retiredIdentities.add(instance);
        const instanceScope = identityScopes.get(instance);
        if (instanceScope) {
          identityScopes.delete(instance);
          scopeOwners.delete(instanceScope);
          instanceScope.dispose();
        }
        instanceDocuments.delete(instance);
      }
      documentInstances.delete(identity);
    }
  }
  retiredIdentities.add(identity);
  const scope = identityScopes.get(identity);
  if (!scope)
    return;
  identityScopes.delete(identity);
  scopeOwners.delete(scope);
  scope.dispose();
});
function createSignalOwnerLifecycle(owner) {
  if (isRendererOwner(owner))
    throw new TypeError(__octaneDev ? "A document lifecycle requires its document owner." : __octaneNoArgError(157));
  let barrier;
  let release;
  let disposed = false;
  const scopes = () => {
    const result = [];
    const scope = isScope(owner) ? owner : existingIdentityScope(owner);
    if (scope instanceof import_engine.ScopeImpl && !scope.retired)
      result.push(scope);
    for (const instance of documentInstances.get(owner) ?? []) {
      const scope2 = existingIdentityScope(instance);
      if (scope2 instanceof import_engine.ScopeImpl)
        result.push(scope2);
    }
    return result;
  };
  return {
    get retired() {
      return disposed || (isScope(owner) ? owner.retired : retiredIdentities.has(owner));
    },
    freeze() {
      if (this.retired || barrier !== void 0)
        return;
      barrier = new Promise((resolve) => {
        release = resolve;
      });
      frozenDocuments.set(owner, barrier);
      const existing = scopes();
      for (const scope of existing)
        scope.readBarrier = barrier;
      for (const scope of existing)
        scope.suspendReads();
    },
    resume() {
      if (this.retired || barrier === void 0)
        return;
      const existing = scopes();
      barrier = void 0;
      frozenDocuments.delete(owner);
      for (const scope of existing)
        scope.readBarrier = void 0;
      release?.();
      release = void 0;
      for (const scope of existing) {
        if (barrier !== void 0 || this.retired)
          break;
        scope.resumeReads();
      }
    },
    retire() {
      if (disposed)
        return;
      disposed = true;
      frozenDocuments.delete(owner);
      const existing = scopes();
      for (const instance of documentInstances.get(owner) ?? [])
        retiredIdentities.add(instance);
      retiredIdentities.add(owner);
      for (const scope of existing)
        scope.dispose();
      documentInstances.delete(owner);
      release?.();
      release = void 0;
      barrier = void 0;
    }
  };
}
function requireOwner() {
  const owner = (0, import_owner_context.currentSignalOwner)();
  if (!owner) {
    throw new Error(__octaneDev ? "A module signal needs an active signal owner. Render it in an Octane root or use runWithSignalOwner()." : __octaneNoArgError(158));
  }
  return owner;
}
function resolveCurrentSignalHandle(handle$) {
  return resolveSignalHandleForOwner(handle$, requireOwner());
}
function resolveSignalHandleForOwner(handle$, owner) {
  return resolveSignalHandleForScope(handle$, resolveOwner(owner));
}
function resolveSignalHandleForScope(handle$, owner) {
  return import_types.SIGNAL_OWNER_RESOLVE in handle$ ? handle$[import_types.SIGNAL_OWNER_RESOLVE](owner) : handle$;
}
function requireSite(site) {
  if (site)
    return site;
  throw new Error(__octaneDev ? "Module signal identity is assigned by the Octane compiler. Use an explicit key outside compiled code." : __octaneNoArgError(159));
}
class Descriptor {
  constructor(key, kind, create, site) {
    this.key = key;
    this.kind = kind;
    this.create = create;
    this.site = site;
  }
  key;
  kind;
  create;
  site;
  [import_types.SIGNAL_HANDLE] = true;
  cells = /* @__PURE__ */ new WeakMap();
  [import_types.SIGNAL_OWNER_RESOLVE](owner) {
    requireSite(this.site);
    return this.resolvedCell(resolveDescriptorOwner(this.site, owner));
  }
  resolvedCell(target) {
    let cell = this.cells.get(target);
    if (!cell) {
      cell = this.create(target);
      this.cells.set(target, cell);
    }
    return cell;
  }
  resolve() {
    const token = requireOwner();
    const owner = resolveDescriptorOwner(this.site, token);
    requireSite(this.site);
    return this.resolvedCell(owner);
  }
  get() {
    return this.resolve().get();
  }
  [import_read_protocol.NATIVE_DOM_VALUE]() {
    return this.get();
  }
  [import_types.SIGNAL_BINDING_READ]() {
    return (0, import_graph.readSignalBinding)(this.resolve());
  }
  [import_types.SIGNAL_BINDING_SUBSCRIBE](notify, onRetire) {
    const run = (0, import_owner_context.captureSignalOwner)(requireOwner());
    return this.resolve()[import_types.SIGNAL_BINDING_SUBSCRIBE]((0, import_read_protocol.forwardNativeTransitionConsumer)(notify, () => run(notify)), onRetire === void 0 ? void 0 : () => run(onRetire));
  }
  [import_types.SIGNAL_BINDING_IDENTITY]() {
    return {
      scope: this.site?.startsWith("g:") ? "document" : "instance",
      nodeKey: this.key
    };
  }
  latest(fallback) {
    return this.resolve().latest(fallback);
  }
  snapshot() {
    return this.resolve().snapshot();
  }
  subscribe(notify) {
    const token = requireOwner();
    const scope = resolveDescriptorOwner(this.site, token);
    const run = (0, import_owner_context.captureSignalOwner)(token);
    return this[import_types.SIGNAL_OWNER_RESOLVE](scope).subscribe((0, import_read_protocol.forwardNativeTransitionConsumer)(notify, () => run(notify)));
  }
}
class SignalDescriptor extends Descriptor {
  set(value) {
    this.resolve().set(value);
  }
}
class DerivedDescriptor extends Descriptor {
}
function descriptorKey(site, explicit) {
  const key = explicit ?? site;
  if (typeof key !== "string" || !key.trim())
    return "<compiler-assigned-signal>";
  return key;
}
function signalOptionsKey(options) {
  if (options != null && typeof options !== "object") {
    throw new TypeError(__octaneDev ? "Signal declaration options must be an object." : __octaneNoArgError(160));
  }
  const key = options?.key;
  if (key !== void 0 && (typeof key !== "string" || !key.trim())) {
    throw new TypeError(__octaneDev ? "A signal declaration key must be a nonempty string." : __octaneNoArgError(161));
  }
  return key;
}
function __signalAt(site, initial, options) {
  const explicit = signalOptionsKey(options);
  site ??= explicit;
  const key = descriptorKey(site, explicit);
  return new SignalDescriptor(key, "signal", (owner) => {
    const early = (0, import_early_values.readEarlySignalValue)(scopeOwners.get(owner) ?? owner, {
      scope: site?.startsWith("g:") ? "document" : "instance",
      nodeKey: key
    });
    return (0, import_engine.createDeclaredSignalCell)(owner, key, early === void 0 ? initial : early.value, early !== void 0);
  }, site);
}
function signal$(initial, options) {
  return __signalAt(void 0, initial, options);
}
function __derivedScalarAt(site, compute, options) {
  if (typeof compute !== "function")
    throw new TypeError(__octaneDev ? "derived$ requires a function." : __octaneNoArgError(122));
  const explicit = signalOptionsKey(options);
  site ??= explicit;
  const key = descriptorKey(site, explicit);
  return new DerivedDescriptor(key, "derived", (owner) => (0, import_scalar_computations.createDeclaredScalarCell)(owner, key, () => (0, import_owner_context.runWithSignalOwner)(owner, () => compute())), site);
}
function readSignalBinding(handle$) {
  if (!(0, import_handle_protocol.isSignalHandle)(handle$))
    throw new TypeError(__octaneDev ? "A signal binding requires a signal handle." : __octaneNoArgError(162));
  return handle$[import_types.SIGNAL_BINDING_READ]();
}
function __startSignalReads(handles, primitive = false) {
  (0, import_graph.untrack)(() => {
    for (const handle of handles) {
      try {
        const value = handle[import_types.SIGNAL_BINDING_READ]();
        if (primitive && value != null && (typeof value === "object" || typeof value === "function" || typeof value === "symbol"))
          break;
      } catch (error) {
        if (!(0, import_graph.isThenable)(error))
          break;
      }
    }
  });
}
function bindStreamedSignalSelection(owner, identity) {
  const scope = streamedScope(owner, identity, true);
  return scope ? (0, import_engine.bindScopeStreamedSelection)(scope, identity) : false;
}
function acceptStreamedSignalResult(owner, frame) {
  const scope = streamedScope(owner, frame.identity, false);
  return scope ? (0, import_engine.acceptScopeStreamedResult)(scope, frame) : false;
}
function failStreamedSignalResult(owner, identity, code) {
  const scope = streamedScope(owner, identity, false);
  return scope ? (0, import_engine.failScopeStreamedResult)(scope, identity, new import_errors.SignalStreamError(code)) : false;
}
function receiverErrorCode(error) {
  if (error && (typeof error === "object" || typeof error === "function") && typeof error.code === "string") {
    return error.code;
  }
  return "receiver";
}
function attachStreamedSignalResult(receiver, owner, identity) {
  const scope = streamedScope(owner, identity, true);
  if (!(scope instanceof import_engine.ScopeImpl) || !(0, import_engine.bindScopeStreamedSelection)(scope, identity))
    throw new import_errors.SignalStreamError("identity");
  const streams = (0, import_scope_streams.scopeStreams)(scope);
  const fail = (error) => {
    failStreamedSignalResult(owner, identity, receiverErrorCode(error));
  };
  const consumer = {
    accept(frame) {
      if (acceptStreamedSignalResult(owner, frame))
        return;
      if (streams.isPending(frame.identity))
        return false;
      fail(new import_errors.SignalStreamError("identity"));
      throw new import_errors.SignalStreamError("identity");
    },
    retainCompleted(frames) {
      return streams.retainCompleted(identity, frames);
    },
    fail
  };
  try {
    let detach = receiver.attachResult(identity, consumer);
    const stopWaiting = streams.whenReady(identity, () => {
      detach = receiver.attachResult(identity, consumer);
    });
    return () => {
      stopWaiting();
      detach();
    };
  } catch (error) {
    fail(error);
    throw error;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DerivedDescriptor,
  Descriptor,
  __derivedScalarAt,
  __signalAt,
  __startSignalReads,
  acceptStreamedSignalResult,
  attachStreamedSignalResult,
  bindStreamedSignalSelection,
  createSignalOwnerLifecycle,
  descriptorKey,
  failStreamedSignalResult,
  initializeDocumentSignalOwner,
  isSignalHandle,
  isWritableSignal,
  readSignalBinding,
  resolveCurrentSignalHandle,
  resolveSignalHandleForOwner,
  resolveSignalHandleForScope,
  signal$,
  signalOptionsKey
});
