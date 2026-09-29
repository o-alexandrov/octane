import { formatClientError } from "../error-codes.client.generated.js";
import {
  adoptResourceValue,
  createDeclaredSignalCell,
  getResourceSelectionAuthority,
  getSignalScope
} from "./engine.js";
import { createDeclaredDerivedCell } from "./computations.js";
import { resolveCurrentSignalHandle, resolveSignalHandleForOwner } from "./facade.js";
import {
  ScopedNode,
  assertWritable,
  isThenable,
  pure,
  signalBatch,
  subscribeNode,
  untrack
} from "./graph.js";
import { captureSignalOwner, currentSignalOwner, runWithSignalOwner } from "./owner-context.js";
import { forwardNativeTransitionConsumer } from "./read-protocol.js";
import {
  SIGNAL_HANDLE,
  SIGNAL_BINDING_READ,
  SIGNAL_BINDING_SUBSCRIBE,
  SIGNAL_BINDING_IDENTITY,
  SIGNAL_OWNER_RESOLVE
} from "./types.js";
const uncertainReceipts = /* @__PURE__ */ new WeakSet();
const noAuthority = /* @__PURE__ */ Symbol();
let activeOperation;
let excludedOperation;
const managers = /* @__PURE__ */ new WeakMap();
class OptimisticManager {
  constructor(source) {
    this.source = source;
    const owner = getSignalScope(source);
    if (!owner) throw new TypeError(formatClientError(81));
    this.owner = owner;
    this.version$ = createDeclaredSignalCell(
      this.owner,
      `@octane/optimistic-version/${source.key}`,
      0
    );
    this.view$ = createDeclaredDerivedCell(this.owner, `@octane/optimistic/${source.key}`, () => {
      this.version$.get();
      return this.read();
    });
  }
  source;
  compareAuthority;
  owner;
  version$;
  view$;
  overlays = [];
  read(exclude) {
    const snapshot = this.source.snapshot();
    const selectionAuthority = getResourceSelectionAuthority(this.source);
    for (let index = this.overlays.length - 1; index >= 0; index--) {
      const overlay = this.overlays[index];
      if (overlay.operation !== exclude && overlay.requestKey === snapshot.requestKey && overlay.selectionAuthority === selectionAuthority) {
        return overlay.value;
      }
    }
    return this.source.get();
  }
  latest(fallback, exclude) {
    const snapshot = this.source.snapshot();
    const selectionAuthority = getResourceSelectionAuthority(this.source);
    for (let index = this.overlays.length - 1; index >= 0; index--) {
      const overlay = this.overlays[index];
      if (overlay.operation !== exclude && overlay.requestKey === snapshot.requestKey && overlay.selectionAuthority === selectionAuthority) {
        return overlay.value;
      }
    }
    return this.source.latest(fallback);
  }
  snapshot(exclude) {
    const snapshot = this.source.snapshot();
    const selectionAuthority = getResourceSelectionAuthority(this.source);
    for (let index = this.overlays.length - 1; index >= 0; index--) {
      const overlay = this.overlays[index];
      if (overlay.operation !== exclude && overlay.requestKey === snapshot.requestKey && overlay.selectionAuthority === selectionAuthority) {
        return Object.freeze({
          status: "ready",
          value: overlay.value,
          refreshing: snapshot.refreshing,
          connection: snapshot.connection,
          complete: snapshot.complete,
          ...snapshot.requestKey === void 0 ? {} : { requestKey: snapshot.requestKey }
        });
      }
    }
    return snapshot;
  }
  apply(operation, value) {
    assertWritable();
    if (operation.status !== "pending") {
      throw new Error(formatClientError(82, operation.id));
    }
    let overlay = operation.targets.get(this);
    const snapshot = this.source.snapshot();
    if (!overlay && snapshot.status !== "ready") {
      throw new Error(formatClientError(83));
    }
    const previous = this.read();
    const next = typeof value === "function" ? untrack(() => pure(() => value(previous))) : value;
    if (!overlay) {
      overlay = {
        operation,
        requestKey: snapshot.requestKey,
        selectionAuthority: getResourceSelectionAuthority(this.source),
        value: next
      };
      this.overlays.push(overlay);
      operation.targets.set(this, overlay);
    } else {
      overlay.value = next;
    }
    this.publish();
    return overlay;
  }
  remove(operation) {
    const index = this.overlays.findIndex((overlay) => overlay.operation === operation);
    if (index < 0) return;
    this.overlays.splice(index, 1);
    if (!this.owner.retired) this.publish();
  }
  adopt(overlay, value) {
    assertWritable();
    const snapshot = this.source.snapshot();
    if (snapshot.requestKey !== overlay.requestKey || getResourceSelectionAuthority(this.source) !== overlay.selectionAuthority) {
      throw new Error(formatClientError(84));
    }
    if (this.source.kind !== "async" && this.source.kind !== "signal") {
      throw new TypeError(formatClientError(85));
    }
    if (this.compareAuthority) {
      const current = this.source.latest(noAuthority);
      if (current === noAuthority) {
        throw new Error(formatClientError(86));
      }
      const order = untrack(() => pure(() => this.compareAuthority(value, current)));
      if (!Number.isFinite(order)) {
        throw new TypeError(formatClientError(87));
      }
      if (order <= 0) {
        this.remove(overlay.operation);
        return;
      }
    }
    if (this.source.kind === "async") {
      if (!adoptResourceValue(this.source, overlay.requestKey, value)) {
        throw new Error(formatClientError(88));
      }
    } else {
      this.source.set(value);
    }
    this.remove(overlay.operation);
  }
  publish() {
    this.version$.set((version) => version + 1);
  }
}
function managerFor(source$, owner, compareAuthority) {
  const resolved = owner ? resolveSignalHandleForOwner(source$, owner) : resolveCurrentSignalHandle(source$);
  if (!(resolved instanceof ScopedNode)) {
    throw new TypeError(formatClientError(89));
  }
  let manager = managers.get(resolved);
  if (!manager) {
    manager = new OptimisticManager(resolved);
    managers.set(resolved, manager);
  }
  if (compareAuthority && manager.compareAuthority !== compareAuthority) {
    if (manager.compareAuthority) {
      throw new Error(formatClientError(90));
    }
    manager.compareAuthority = compareAuthority;
  }
  return manager;
}
class OptimisticDescriptor {
  constructor(source$, compareAuthority) {
    this.source$ = source$;
    this.compareAuthority = compareAuthority;
    this.key = `optimistic:${source$.key}`;
  }
  source$;
  compareAuthority;
  [SIGNAL_HANDLE] = true;
  kind = "signal";
  key;
  [SIGNAL_OWNER_RESOLVE](owner) {
    return this.manager(owner).view$;
  }
  manager(owner) {
    return managerFor(this.source$, owner, this.compareAuthority);
  }
  get() {
    const manager = this.manager(activeOperation?.owner ?? void 0);
    return excludedOperation ? manager.read(excludedOperation) : manager.view$.get();
  }
  [SIGNAL_BINDING_READ]() {
    return this.manager().view$[SIGNAL_BINDING_READ]();
  }
  [SIGNAL_BINDING_SUBSCRIBE](notify, onRetire) {
    const owner = currentSignalOwner();
    if (!owner) throw new Error(formatClientError(91));
    const run = captureSignalOwner(owner);
    return this.manager().view$[SIGNAL_BINDING_SUBSCRIBE](
      forwardNativeTransitionConsumer(notify, () => run(notify)),
      onRetire === void 0 ? void 0 : () => run(onRetire)
    );
  }
  [SIGNAL_BINDING_IDENTITY]() {
    return this.source$[SIGNAL_BINDING_IDENTITY]();
  }
  latest(fallback) {
    return this.manager().latest(fallback, excludedOperation);
  }
  snapshot() {
    const manager = this.manager();
    return excludedOperation ? manager.snapshot(excludedOperation) : manager.view$.snapshot();
  }
  subscribe(notify) {
    const owner = currentSignalOwner();
    if (!owner) throw new Error(formatClientError(91));
    const run = captureSignalOwner(owner);
    return this.manager().view$.subscribe(
      forwardNativeTransitionConsumer(notify, () => run(notify))
    );
  }
  set(value) {
    if (!activeOperation) {
      throw new Error(formatClientError(92));
    }
    this.apply(activeOperation, value);
  }
  apply(operation, value) {
    const manager = this.manager(operation.owner ?? void 0);
    operation.bind(this, manager);
    manager.apply(operation, value);
  }
}
class ActionUncertainError extends Error {
  constructor(operationId2, options) {
    super(formatClientError(93, operationId2), options);
    this.operationId = operationId2;
    this.name = "ActionUncertainError";
  }
  operationId;
  code = "OCTANE_ACTION_UNCERTAIN";
}
function operationId(key) {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID !== "function") {
    throw new Error(formatClientError(94));
  }
  return `${key}:${randomUUID.call(globalThis.crypto)}`;
}
function transportIsUncertain(error) {
  return (typeof error === "object" || typeof error === "function") && error !== null && error.code === "OCTANE_RPC_UNCERTAIN";
}
class Operation {
  constructor(key) {
    this.key = key;
    this.id = operationId(key);
  }
  key;
  id;
  owner = currentSignalOwner();
  status = "pending";
  targets = /* @__PURE__ */ new Map();
  waits;
  descriptors = /* @__PURE__ */ new Map();
  set(signal$, value) {
    if (!(signal$ instanceof OptimisticDescriptor)) {
      throw new TypeError(formatClientError(95));
    }
    const manager = this.descriptors.get(signal$);
    if (manager) {
      manager.apply(this, value);
      return;
    }
    signal$.apply(this, value);
  }
  bind(descriptor, manager) {
    this.descriptors.set(
      descriptor,
      manager
    );
  }
  adopt(value) {
    if (this.status !== "pending" && this.status !== "uncertain")
      throw new Error(formatClientError(96, this.id));
    if (this.targets.size !== 1) {
      throw new Error(formatClientError(97));
    }
    const [manager, overlay] = this.targets.entries().next().value;
    manager.adopt(overlay, value);
    this.targets.delete(manager);
    this.descriptors.clear();
    this.status = "confirmed";
    this.notifyWaits();
  }
  uncertain() {
    if (this.status !== "pending") throw new Error(formatClientError(96, this.id));
    this.status = "uncertain";
    this.notifyWaits();
    const receipt = Object.freeze({ status: "uncertain", operationId: this.id });
    uncertainReceipts.add(receipt);
    return receipt;
  }
  until(read, options) {
    if (this.status !== "pending") return Promise.reject(new Error(formatClientError(98)));
    if (typeof read !== "function") return Promise.reject(new TypeError(formatClientError(99)));
    const timeout = options?.timeout;
    if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
      return Promise.reject(new RangeError(formatClientError(100)));
    }
    const managers2 = [...this.targets.keys()];
    if (!managers2.length) {
      return Promise.reject(new Error(formatClientError(101)));
    }
    return new Promise((resolve, reject) => {
      let ended = false;
      let timer;
      const stops = [];
      const finish = (error) => {
        if (ended) return;
        ended = true;
        if (timer !== void 0) clearTimeout(timer);
        for (const stop of stops) stop();
        this.waits?.delete(check);
        if (error === void 0) resolve();
        else reject(error);
      };
      const check = () => {
        if (ended) return;
        if (this.status !== "pending") {
          finish(
            this.status === "confirmed" ? void 0 : new Error(formatClientError(102, this.status))
          );
          return;
        }
        if (managers2.some((manager) => manager.owner.retired)) {
          finish(new Error(formatClientError(103)));
          return;
        }
        const previous = excludedOperation;
        excludedOperation = this;
        try {
          for (const [manager, overlay] of this.targets) {
            if (manager.source.snapshot().requestKey !== overlay.requestKey || getResourceSelectionAuthority(manager.source) !== overlay.selectionAuthority) {
              finish(new Error(formatClientError(104)));
              return;
            }
          }
          if (runWithSignalOwner(managers2[0].owner, read)) finish();
        } catch (error) {
          if (!isThenable(error)) finish(error);
        } finally {
          excludedOperation = previous;
        }
      };
      (this.waits ??= /* @__PURE__ */ new Set()).add(check);
      for (const manager of managers2) stops.push(subscribeNode(manager.source, check));
      if (timeout !== void 0) {
        timer = setTimeout(() => finish(new Error(formatClientError(105))), timeout);
      }
      check();
    });
  }
  confirm() {
    if (this.status !== "pending") return;
    this.status = "confirmed";
    this.clear();
    this.notifyWaits();
  }
  reject() {
    if (this.status !== "pending" && this.status !== "uncertain") return;
    assertWritable();
    this.status = "rejected";
    this.clear();
    this.notifyWaits();
  }
  notifyWaits() {
    if (this.waits) for (const check of this.waits) check();
  }
  clear() {
    for (const manager of this.targets.keys()) manager.remove(this);
    this.targets.clear();
    this.descriptors.clear();
  }
}
function optimistic$(source$, options) {
  if (!source$ || typeof source$.get !== "function") {
    throw new TypeError(formatClientError(106));
  }
  if (options?.compareAuthority !== void 0 && typeof options.compareAuthority !== "function") {
    throw new TypeError(formatClientError(107));
  }
  return new OptimisticDescriptor(source$, options?.compareAuthority);
}
function action$(keyOrHandler, handler) {
  const key = typeof keyOrHandler === "string" ? keyOrHandler : "action";
  const execute = typeof keyOrHandler === "function" ? keyOrHandler : handler;
  if (!key.trim() || typeof execute !== "function") {
    throw new TypeError(formatClientError(108));
  }
  return function(...args) {
    const operation = new Operation(key);
    const previous = activeOperation;
    activeOperation = operation;
    let result;
    try {
      result = signalBatch(() => execute.call(this, operation, ...args));
    } catch (error) {
      activeOperation = previous;
      if (transportIsUncertain(error)) {
        operation.uncertain();
        throw new ActionUncertainError(operation.id, { cause: error });
      }
      operation.reject();
      throw error;
    }
    activeOperation = previous;
    let asyncResult;
    try {
      asyncResult = isThenable(result);
    } catch (error) {
      operation.reject();
      throw error;
    }
    if (!asyncResult) {
      if (!isActionUncertain(result)) operation.confirm();
      return result;
    }
    return Promise.resolve(result).then(
      (value) => {
        if (!isActionUncertain(value)) operation.confirm();
        return value;
      },
      (error) => {
        if (transportIsUncertain(error)) {
          operation.uncertain();
          throw new ActionUncertainError(operation.id, { cause: error });
        }
        operation.reject();
        throw error;
      }
    );
  };
}
function isActionUncertain(value) {
  return value instanceof ActionUncertainError || (typeof value === "object" || typeof value === "function") && value !== null && uncertainReceipts.has(value);
}
export {
  ActionUncertainError,
  action$,
  isActionUncertain,
  optimistic$
};
