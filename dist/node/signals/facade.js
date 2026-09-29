const __octaneDev = process.env.NODE_ENV !== "production";
import { acceptScopeStreamedResult, bindScopeStreamedSelection, createDeclaredSignalCell, createScope, failScopeStreamedResult, ScopeImpl } from "./engine.js";
import { createDeclaredScalarCell } from "./scalar-computations.js";
import { ScopeDisposedError, SignalStreamError } from "./errors.js";
import { scopeStreams } from "./scope-streams.js";
import { isThenable, readSignalBinding as readBinding, untrack } from "./graph.js";
import { readEarlySignalValue } from "./early-values.js";
import { NATIVE_DOM_VALUE, forwardNativeTransitionConsumer } from "./read-protocol.js";
import { isSignalHandle } from "./handle-protocol.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
import { isSignalHandle as isSignalHandle2, isWritableSignal } from "./handle-protocol.js";
import { captureSignalOwner, currentSignalOwner, installSignalOwnerRetirement, runWithSignalOwner } from "./owner-context.js";
import { SIGNAL_HANDLE, SIGNAL_BINDING_IDENTITY, SIGNAL_BINDING_READ, SIGNAL_BINDING_SUBSCRIBE, SIGNAL_OWNER_RESOLVE } from "./types.js";
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
    throw new ScopeDisposedError(scopeKey);
  let scope = identityScopes.get(identity);
  if (!scope) {
    scope = createScope({ scopeKey });
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
    throw new ScopeDisposedError(owner.scopeKey);
  if (identityScopes.has(owner)) {
    throw new Error(__octaneDev ? "Initial document signals must be installed once, before any signal reads or writes." : __octaneNoArgError(156));
  }
  const scope = createScope({ scopeKey: owner.scopeKey, seed });
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
      throw new ScopeDisposedError(owner.documentOwner.scopeKey);
    }
    if (isScope(owner.documentOwner) && owner.documentOwner.retired) {
      throw new ScopeDisposedError(owner.documentOwner.scopeKey);
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
installSignalOwnerRetirement((owner) => {
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
    if (scope instanceof ScopeImpl && !scope.retired)
      result.push(scope);
    for (const instance of documentInstances.get(owner) ?? []) {
      const scope2 = existingIdentityScope(instance);
      if (scope2 instanceof ScopeImpl)
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
  const owner = currentSignalOwner();
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
  return SIGNAL_OWNER_RESOLVE in handle$ ? handle$[SIGNAL_OWNER_RESOLVE](owner) : handle$;
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
  [SIGNAL_HANDLE] = true;
  cells = /* @__PURE__ */ new WeakMap();
  [SIGNAL_OWNER_RESOLVE](owner) {
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
  [NATIVE_DOM_VALUE]() {
    return this.get();
  }
  [SIGNAL_BINDING_READ]() {
    return readBinding(this.resolve());
  }
  [SIGNAL_BINDING_SUBSCRIBE](notify, onRetire) {
    const run = captureSignalOwner(requireOwner());
    return this.resolve()[SIGNAL_BINDING_SUBSCRIBE](forwardNativeTransitionConsumer(notify, () => run(notify)), onRetire === void 0 ? void 0 : () => run(onRetire));
  }
  [SIGNAL_BINDING_IDENTITY]() {
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
    const run = captureSignalOwner(token);
    return this[SIGNAL_OWNER_RESOLVE](scope).subscribe(forwardNativeTransitionConsumer(notify, () => run(notify)));
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
    const early = readEarlySignalValue(scopeOwners.get(owner) ?? owner, {
      scope: site?.startsWith("g:") ? "document" : "instance",
      nodeKey: key
    });
    return createDeclaredSignalCell(owner, key, early === void 0 ? initial : early.value, early !== void 0);
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
  return new DerivedDescriptor(key, "derived", (owner) => createDeclaredScalarCell(owner, key, () => runWithSignalOwner(owner, () => compute())), site);
}
function readSignalBinding(handle$) {
  if (!isSignalHandle(handle$))
    throw new TypeError(__octaneDev ? "A signal binding requires a signal handle." : __octaneNoArgError(162));
  return handle$[SIGNAL_BINDING_READ]();
}
function __startSignalReads(handles, primitive = false) {
  untrack(() => {
    for (const handle of handles) {
      try {
        const value = handle[SIGNAL_BINDING_READ]();
        if (primitive && value != null && (typeof value === "object" || typeof value === "function" || typeof value === "symbol"))
          break;
      } catch (error) {
        if (!isThenable(error))
          break;
      }
    }
  });
}
function bindStreamedSignalSelection(owner, identity) {
  const scope = streamedScope(owner, identity, true);
  return scope ? bindScopeStreamedSelection(scope, identity) : false;
}
function acceptStreamedSignalResult(owner, frame) {
  const scope = streamedScope(owner, frame.identity, false);
  return scope ? acceptScopeStreamedResult(scope, frame) : false;
}
function failStreamedSignalResult(owner, identity, code) {
  const scope = streamedScope(owner, identity, false);
  return scope ? failScopeStreamedResult(scope, identity, new SignalStreamError(code)) : false;
}
function receiverErrorCode(error) {
  if (error && (typeof error === "object" || typeof error === "function") && typeof error.code === "string") {
    return error.code;
  }
  return "receiver";
}
function attachStreamedSignalResult(receiver, owner, identity) {
  const scope = streamedScope(owner, identity, true);
  if (!(scope instanceof ScopeImpl) || !bindScopeStreamedSelection(scope, identity))
    throw new SignalStreamError("identity");
  const streams = scopeStreams(scope);
  const fail = (error) => {
    failStreamedSignalResult(owner, identity, receiverErrorCode(error));
  };
  const consumer = {
    accept(frame) {
      if (acceptStreamedSignalResult(owner, frame))
        return;
      if (streams.isPending(frame.identity))
        return false;
      fail(new SignalStreamError("identity"));
      throw new SignalStreamError("identity");
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
export {
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
  isSignalHandle2 as isSignalHandle,
  isWritableSignal,
  readSignalBinding,
  resolveCurrentSignalHandle,
  resolveSignalHandleForOwner,
  resolveSignalHandleForScope,
  signal$,
  signalOptionsKey
};
