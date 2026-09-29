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
var devtools_hook_exports = {};
__export(devtools_hook_exports, {
  DEVTOOLS_HOOK_VERSION: () => DEVTOOLS_HOOK_VERSION,
  __devtoolsClearBoundary: () => __devtoolsClearBoundary,
  __devtoolsNotifyFlush: () => __devtoolsNotifyFlush,
  __devtoolsRegisterRoot: () => __devtoolsRegisterRoot,
  __devtoolsSetBoundaryState: () => __devtoolsSetBoundaryState,
  __devtoolsSetChildWalker: () => __devtoolsSetChildWalker,
  __devtoolsSetNameResolver: () => __devtoolsSetNameResolver,
  __devtoolsSetNativeReadInspector: () => __devtoolsSetNativeReadInspector,
  __devtoolsSetTransitionCount: () => __devtoolsSetTransitionCount,
  __devtoolsUnregisterRoot: () => __devtoolsUnregisterRoot,
  installDevtoolsGlobal: () => installDevtoolsGlobal
});
module.exports = __toCommonJS(devtools_hook_exports);
const DEVTOOLS_HOOK_VERSION = 3;
const roots = /* @__PURE__ */ new Set();
const subscribers = /* @__PURE__ */ new Set();
const ids = /* @__PURE__ */ new WeakMap();
let nextId = 1;
let idIndex = /* @__PURE__ */ new Map();
let nameResolver = (b) => b && b.body && (b.body.displayName || b.body.name) || "Unknown";
let childWalker = null;
let nativeReadInspector = null;
let transitionPendingCount = 0;
const boundaries = /* @__PURE__ */ new Map();
function branchToState(branch) {
  if (branch === 0) return "catch";
  if (branch === 1) return "resolved";
  if (branch === 2) return "pending";
  return "init";
}
function idOf(scope) {
  let id = ids.get(scope);
  if (id === void 0) {
    id = nextId++;
    ids.set(scope, id);
  }
  return id;
}
function safePreview(value, depth = 0) {
  if (value === null || value === void 0) return value;
  const t = typeof value;
  if (t === "string" || t === "boolean") return value;
  if (t === "number") return Number.isFinite(value) ? value : String(value);
  if (t === "bigint") return `${value}n`;
  if (t === "function") return "[Function]";
  if (t === "symbol") return String(value);
  try {
    if (depth >= 2) return Array.isArray(value) ? "[Array]" : "[Object]";
    if (typeof Node !== "undefined" && value instanceof Node) return "[Node]";
    const fields = Object.getOwnPropertyDescriptors(value);
    if (Array.isArray(value)) {
      const length = Math.min(Number(fields.length?.value) || 0, 20);
      return Array.from({ length }, (_, index) => previewField(fields[index], depth));
    }
    const out = {};
    let n = 0;
    for (const key of Object.keys(fields)) {
      const field = fields[key];
      if (!field.enumerable) continue;
      if (n++ >= 20) break;
      Object.defineProperty(out, key, {
        value: previewField(field, depth),
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    return out;
  } catch {
    return "[Unavailable]";
  }
}
function previewField(field, depth) {
  if (field === void 0) return void 0;
  return "value" in field ? safePreview(field.value, depth + 1) : "[Getter]";
}
function classifyCell(cell) {
  if (cell === null || typeof cell !== "object") return null;
  let fields;
  try {
    fields = Object.getOwnPropertyDescriptors(cell);
  } catch {
    return { kind: "other", value: "[Unavailable]" };
  }
  if (fields.effect?.value === true) return null;
  if ("setter" in fields) return { kind: "state", value: previewField(fields.value, -1) };
  if ("dispatch" in fields && "reducer" in fields)
    return { kind: "reducer", value: previewField(fields.value, -1) };
  if ("current" in fields && !("deps" in fields))
    return { kind: "ref", value: previewField(fields.current, -1) };
  if ("deps" in fields && "value" in fields)
    return { kind: "memo-or-callback", value: previewField(fields.value, -1) };
  return { kind: "other", value: safePreview(cell) };
}
function nameOf(scope, key) {
  if (scope.body != null || scope.kind != null) return nameResolver(scope);
  const component = nameResolver(scope);
  if (component !== "Unknown") return component;
  return key === void 0 ? "scope" : String(key);
}
function buildNode(scope, key, seen) {
  if (scope.disposed || seen.has(scope)) return null;
  seen.add(scope);
  const id = idOf(scope);
  idIndex.set(id, scope);
  const children = [];
  if (scope.children !== null) {
    for (const child of scope.children) {
      const node = buildNode(child.scope, child.key, seen);
      if (node !== null) children.push(node);
    }
  }
  childWalker?.(scope, (child) => {
    const node = buildNode(child, void 0, seen);
    if (node !== null) children.push(node);
  });
  return {
    id,
    name: nameOf(scope, key),
    kind: scope.kind ?? "component",
    children
  };
}
const hook = {
  version: DEVTOOLS_HOOK_VERSION,
  getTree() {
    idIndex = /* @__PURE__ */ new Map();
    const seen = /* @__PURE__ */ new Set();
    const nodes = [];
    for (const root of roots) {
      const node = buildNode(root, void 0, seen);
      if (node !== null) nodes.push(node);
    }
    return nodes;
  },
  inspect(id) {
    const scope = idIndex.get(id);
    if (scope === void 0 || scope.disposed) return null;
    const hooks = [];
    if (scope.hooks) {
      for (const cell of scope.hooks.values()) {
        const classified = classifyCell(cell);
        if (classified) hooks.push(classified);
      }
    }
    const context = [];
    if (scope.$$ctxValues) {
      for (const [ctx, value] of scope.$$ctxValues) {
        context.push({
          name: ctx && (ctx.displayName || ctx.name) || "Context",
          value: safePreview(value)
        });
      }
    }
    const detail = {
      id,
      name: nameOf(scope, void 0),
      hooks,
      context,
      effectCount: scope.effectSlots ? scope.effectSlots.length : 0
    };
    const native = nativeReadInspector?.(scope);
    if (native !== void 0 && native !== null) {
      detail.nativeReads = {
        ownerId: idOf(native.block),
        committed: native.committed,
        pending: native.pending,
        retry: native.retry
      };
    }
    return detail;
  },
  subscribe(listener) {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  },
  getTransitionState() {
    return {
      pendingCount: transitionPendingCount,
      boundaries: [...boundaries.values()]
    };
  }
};
function installDevtoolsGlobal() {
  const target = globalThis;
  try {
    if (target.__OCTANE_DEVTOOLS__ !== hook) target.__OCTANE_DEVTOOLS__ = hook;
  } catch {
  }
}
function __devtoolsSetNameResolver(fn) {
  nameResolver = fn;
}
function __devtoolsSetChildWalker(walk) {
  childWalker = walk;
}
function __devtoolsSetNativeReadInspector(inspect) {
  nativeReadInspector = inspect;
}
function __devtoolsRegisterRoot(root) {
  roots.add(root);
  installDevtoolsGlobal();
}
function __devtoolsUnregisterRoot(root) {
  roots.delete(root);
  hook.getTree();
}
function __devtoolsNotifyFlush() {
  if (subscribers.size === 0) return;
  for (const listener of subscribers) {
    try {
      listener();
    } catch (err) {
      console.error(err);
    }
  }
}
function __devtoolsSetTransitionCount(count) {
  transitionPendingCount = count < 0 ? 0 : count;
}
function __devtoolsSetBoundaryState(slot, branch, hasResolved, label) {
  const id = idOf(slot);
  boundaries.set(id, { id, branch, state: branchToState(branch), hasResolved, label });
}
function __devtoolsClearBoundary(slot) {
  boundaries.delete(idOf(slot));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEVTOOLS_HOOK_VERSION,
  __devtoolsClearBoundary,
  __devtoolsNotifyFlush,
  __devtoolsRegisterRoot,
  __devtoolsSetBoundaryState,
  __devtoolsSetChildWalker,
  __devtoolsSetNameResolver,
  __devtoolsSetNativeReadInspector,
  __devtoolsSetTransitionCount,
  __devtoolsUnregisterRoot,
  installDevtoolsGlobal
});
