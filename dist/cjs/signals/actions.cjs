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
var actions_exports = {};
__export(actions_exports, {
  ActionUncertainError: () => ActionUncertainError,
  action$: () => action$,
  isActionUncertain: () => isActionUncertain,
  optimistic$: () => optimistic$
});
module.exports = __toCommonJS(actions_exports);
var import_error_codes_client_generated = require("../error-codes.client.generated.cjs");
var import_engine = require("./engine.cjs");
var import_computations = require("./computations.cjs");
var import_facade = require("./facade.cjs");
var import_graph = require("./graph.cjs");
var import_owner_context = require("./owner-context.cjs");
var import_read_protocol = require("./read-protocol.cjs");
var import_types = require("./types.cjs");
const uncertainReceipts = /* @__PURE__ */ new WeakSet();
const noAuthority = /* @__PURE__ */ Symbol();
let activeOperation;
let excludedOperation;
const managers = /* @__PURE__ */ new WeakMap();
class OptimisticManager {
  constructor(source) {
    this.source = source;
    const owner = (0, import_engine.getSignalScope)(source);
    if (!owner) throw new TypeError((0, import_error_codes_client_generated.formatClientError)(81));
    this.owner = owner;
    this.version$ = (0, import_engine.createDeclaredSignalCell)(
      this.owner,
      `@octane/optimistic-version/${source.key}`,
      0
    );
    this.view$ = (0, import_computations.createDeclaredDerivedCell)(this.owner, `@octane/optimistic/${source.key}`, () => {
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
    const selectionAuthority = (0, import_engine.getResourceSelectionAuthority)(this.source);
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
    const selectionAuthority = (0, import_engine.getResourceSelectionAuthority)(this.source);
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
    const selectionAuthority = (0, import_engine.getResourceSelectionAuthority)(this.source);
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
    (0, import_graph.assertWritable)();
    if (operation.status !== "pending") {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(82, operation.id));
    }
    let overlay = operation.targets.get(this);
    const snapshot = this.source.snapshot();
    if (!overlay && snapshot.status !== "ready") {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(83));
    }
    const previous = this.read();
    const next = typeof value === "function" ? (0, import_graph.untrack)(() => (0, import_graph.pure)(() => value(previous))) : value;
    if (!overlay) {
      overlay = {
        operation,
        requestKey: snapshot.requestKey,
        selectionAuthority: (0, import_engine.getResourceSelectionAuthority)(this.source),
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
    (0, import_graph.assertWritable)();
    const snapshot = this.source.snapshot();
    if (snapshot.requestKey !== overlay.requestKey || (0, import_engine.getResourceSelectionAuthority)(this.source) !== overlay.selectionAuthority) {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(84));
    }
    if (this.source.kind !== "async" && this.source.kind !== "signal") {
      throw new TypeError((0, import_error_codes_client_generated.formatClientError)(85));
    }
    if (this.compareAuthority) {
      const current = this.source.latest(noAuthority);
      if (current === noAuthority) {
        throw new Error((0, import_error_codes_client_generated.formatClientError)(86));
      }
      const order = (0, import_graph.untrack)(() => (0, import_graph.pure)(() => this.compareAuthority(value, current)));
      if (!Number.isFinite(order)) {
        throw new TypeError((0, import_error_codes_client_generated.formatClientError)(87));
      }
      if (order <= 0) {
        this.remove(overlay.operation);
        return;
      }
    }
    if (this.source.kind === "async") {
      if (!(0, import_engine.adoptResourceValue)(this.source, overlay.requestKey, value)) {
        throw new Error((0, import_error_codes_client_generated.formatClientError)(88));
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
  const resolved = owner ? (0, import_facade.resolveSignalHandleForOwner)(source$, owner) : (0, import_facade.resolveCurrentSignalHandle)(source$);
  if (!(resolved instanceof import_graph.ScopedNode)) {
    throw new TypeError((0, import_error_codes_client_generated.formatClientError)(89));
  }
  let manager = managers.get(resolved);
  if (!manager) {
    manager = new OptimisticManager(resolved);
    managers.set(resolved, manager);
  }
  if (compareAuthority && manager.compareAuthority !== compareAuthority) {
    if (manager.compareAuthority) {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(90));
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
  [import_types.SIGNAL_HANDLE] = true;
  kind = "signal";
  key;
  [import_types.SIGNAL_OWNER_RESOLVE](owner) {
    return this.manager(owner).view$;
  }
  manager(owner) {
    return managerFor(this.source$, owner, this.compareAuthority);
  }
  get() {
    const manager = this.manager(activeOperation?.owner ?? void 0);
    return excludedOperation ? manager.read(excludedOperation) : manager.view$.get();
  }
  [import_types.SIGNAL_BINDING_READ]() {
    return this.manager().view$[import_types.SIGNAL_BINDING_READ]();
  }
  [import_types.SIGNAL_BINDING_SUBSCRIBE](notify, onRetire) {
    const owner = (0, import_owner_context.currentSignalOwner)();
    if (!owner) throw new Error((0, import_error_codes_client_generated.formatClientError)(91));
    const run = (0, import_owner_context.captureSignalOwner)(owner);
    return this.manager().view$[import_types.SIGNAL_BINDING_SUBSCRIBE](
      (0, import_read_protocol.forwardNativeTransitionConsumer)(notify, () => run(notify)),
      onRetire === void 0 ? void 0 : () => run(onRetire)
    );
  }
  [import_types.SIGNAL_BINDING_IDENTITY]() {
    return this.source$[import_types.SIGNAL_BINDING_IDENTITY]();
  }
  latest(fallback) {
    return this.manager().latest(fallback, excludedOperation);
  }
  snapshot() {
    const manager = this.manager();
    return excludedOperation ? manager.snapshot(excludedOperation) : manager.view$.snapshot();
  }
  subscribe(notify) {
    const owner = (0, import_owner_context.currentSignalOwner)();
    if (!owner) throw new Error((0, import_error_codes_client_generated.formatClientError)(91));
    const run = (0, import_owner_context.captureSignalOwner)(owner);
    return this.manager().view$.subscribe(
      (0, import_read_protocol.forwardNativeTransitionConsumer)(notify, () => run(notify))
    );
  }
  set(value) {
    if (!activeOperation) {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(92));
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
    super((0, import_error_codes_client_generated.formatClientError)(93, operationId2), options);
    this.operationId = operationId2;
    this.name = "ActionUncertainError";
  }
  operationId;
  code = "OCTANE_ACTION_UNCERTAIN";
}
function operationId(key) {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID !== "function") {
    throw new Error((0, import_error_codes_client_generated.formatClientError)(94));
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
  owner = (0, import_owner_context.currentSignalOwner)();
  status = "pending";
  targets = /* @__PURE__ */ new Map();
  waits;
  descriptors = /* @__PURE__ */ new Map();
  set(signal$, value) {
    if (!(signal$ instanceof OptimisticDescriptor)) {
      throw new TypeError((0, import_error_codes_client_generated.formatClientError)(95));
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
      throw new Error((0, import_error_codes_client_generated.formatClientError)(96, this.id));
    if (this.targets.size !== 1) {
      throw new Error((0, import_error_codes_client_generated.formatClientError)(97));
    }
    const [manager, overlay] = this.targets.entries().next().value;
    manager.adopt(overlay, value);
    this.targets.delete(manager);
    this.descriptors.clear();
    this.status = "confirmed";
    this.notifyWaits();
  }
  uncertain() {
    if (this.status !== "pending") throw new Error((0, import_error_codes_client_generated.formatClientError)(96, this.id));
    this.status = "uncertain";
    this.notifyWaits();
    const receipt = Object.freeze({ status: "uncertain", operationId: this.id });
    uncertainReceipts.add(receipt);
    return receipt;
  }
  until(read, options) {
    if (this.status !== "pending") return Promise.reject(new Error((0, import_error_codes_client_generated.formatClientError)(98)));
    if (typeof read !== "function") return Promise.reject(new TypeError((0, import_error_codes_client_generated.formatClientError)(99)));
    const timeout = options?.timeout;
    if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
      return Promise.reject(new RangeError((0, import_error_codes_client_generated.formatClientError)(100)));
    }
    const managers2 = [...this.targets.keys()];
    if (!managers2.length) {
      return Promise.reject(new Error((0, import_error_codes_client_generated.formatClientError)(101)));
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
            this.status === "confirmed" ? void 0 : new Error((0, import_error_codes_client_generated.formatClientError)(102, this.status))
          );
          return;
        }
        if (managers2.some((manager) => manager.owner.retired)) {
          finish(new Error((0, import_error_codes_client_generated.formatClientError)(103)));
          return;
        }
        const previous = excludedOperation;
        excludedOperation = this;
        try {
          for (const [manager, overlay] of this.targets) {
            if (manager.source.snapshot().requestKey !== overlay.requestKey || (0, import_engine.getResourceSelectionAuthority)(manager.source) !== overlay.selectionAuthority) {
              finish(new Error((0, import_error_codes_client_generated.formatClientError)(104)));
              return;
            }
          }
          if ((0, import_owner_context.runWithSignalOwner)(managers2[0].owner, read)) finish();
        } catch (error) {
          if (!(0, import_graph.isThenable)(error)) finish(error);
        } finally {
          excludedOperation = previous;
        }
      };
      (this.waits ??= /* @__PURE__ */ new Set()).add(check);
      for (const manager of managers2) stops.push((0, import_graph.subscribeNode)(manager.source, check));
      if (timeout !== void 0) {
        timer = setTimeout(() => finish(new Error((0, import_error_codes_client_generated.formatClientError)(105))), timeout);
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
    (0, import_graph.assertWritable)();
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
    throw new TypeError((0, import_error_codes_client_generated.formatClientError)(106));
  }
  if (options?.compareAuthority !== void 0 && typeof options.compareAuthority !== "function") {
    throw new TypeError((0, import_error_codes_client_generated.formatClientError)(107));
  }
  return new OptimisticDescriptor(source$, options?.compareAuthority);
}
function action$(keyOrHandler, handler) {
  const key = typeof keyOrHandler === "string" ? keyOrHandler : "action";
  const execute = typeof keyOrHandler === "function" ? keyOrHandler : handler;
  if (!key.trim() || typeof execute !== "function") {
    throw new TypeError((0, import_error_codes_client_generated.formatClientError)(108));
  }
  return function(...args) {
    const operation = new Operation(key);
    const previous = activeOperation;
    activeOperation = operation;
    let result;
    try {
      result = (0, import_graph.signalBatch)(() => execute.call(this, operation, ...args));
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
      asyncResult = (0, import_graph.isThenable)(result);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionUncertainError,
  action$,
  isActionUncertain,
  optimistic$
});
