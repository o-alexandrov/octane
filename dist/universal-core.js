import { bumpContextEpoch } from "./context-epoch.js";
import { isContext } from "./context-identity.js";
import { hasOwnProp } from "./has-own.js";
import {
  ACTIVITY_TAG,
  CONTEXT_TAG,
  LAZY_COMPONENT_TAG as LAZY_COMPONENT,
  RENDERER_REGION_OWNER_TAG as RENDERER_REGION_OWNER
} from "./runtime-tags.js";
import { resolveHookPath } from "./hook-slot-cache.js";
import {
  __profileBeginRender,
  __profileComponentSource,
  __profileEndRender,
  __profileSchedule,
  __profileTrackComponent
} from "./profiling.js";
import { getRendererHostFlusher } from "./renderer-bridge.js";
import { resolveLazyDefaultProps } from "./shared-value-helpers.js";
import { __methodDep } from "./method-dep.js";
const UNIVERSAL_PLAN = /* @__PURE__ */ Symbol.for("octane.universal.plan");
const UNIVERSAL_VALUE = /* @__PURE__ */ Symbol.for("octane.universal.value");
const UNIVERSAL_LIST = /* @__PURE__ */ Symbol.for("octane.universal.list");
const UNIVERSAL_COMPONENT = /* @__PURE__ */ Symbol.for("octane.universal.component");
const UNIVERSAL_COMPONENT_VALUE = /* @__PURE__ */ Symbol.for("octane.universal.component-value");
const UNIVERSAL_HOST_COMPONENT = /* @__PURE__ */ Symbol("octane.universal.host-component");
const UNIVERSAL_PROPS = /* @__PURE__ */ Symbol.for("octane.universal.props");
const UNIVERSAL_CHILDREN = /* @__PURE__ */ Symbol.for("octane.universal.children");
const UNIVERSAL_IF = /* @__PURE__ */ Symbol.for("octane.universal.if");
const UNIVERSAL_BLOCK = /* @__PURE__ */ Symbol.for("octane.universal.block");
const UNIVERSAL_SWITCH = /* @__PURE__ */ Symbol.for("octane.universal.switch");
const UNIVERSAL_FOR = /* @__PURE__ */ Symbol.for("octane.universal.for");
const UNIVERSAL_HOST_BINDING = /* @__PURE__ */ Symbol("octane.universal.host-binding");
function universalHostBinding(source, select) {
  return {
    $$kind: UNIVERSAL_HOST_BINDING,
    source,
    select,
    getSnapshot: () => select(source.get())
  };
}
function isUniversalHostBinding(value) {
  return value !== null && typeof value === "object" && value.$$kind === UNIVERSAL_HOST_BINDING;
}
const UNIVERSAL_TRY = /* @__PURE__ */ Symbol.for("octane.universal.try");
const UNIVERSAL_CONTEXT = /* @__PURE__ */ Symbol.for("octane.universal.context");
const UNIVERSAL_ACTIVITY = /* @__PURE__ */ Symbol.for("octane.universal.activity");
const UNIVERSAL_KEYED = /* @__PURE__ */ Symbol.for("octane.universal.keyed");
const UNIVERSAL_PORTAL = /* @__PURE__ */ Symbol.for("octane.universal.portal");
const UNIVERSAL_RENDERER_REGION = /* @__PURE__ */ Symbol.for("octane.universal.renderer-region");
const UNIVERSAL_COMPONENT_REVISION = /* @__PURE__ */ Symbol("octane.universal.component-revision");
const NO_CHILDREN = /* @__PURE__ */ Symbol("octane.universal.no-children");
const NO_KEY = /* @__PURE__ */ Symbol("octane.universal.no-key");
const NO_PENDING_PASSIVE_ERROR = /* @__PURE__ */ Symbol("octane.universal.no-pending-passive-error");
let HAS_UNIVERSAL_HOST_COMPONENTS = false;
const UNIVERSAL_TRANSPORT_PROTOCOL_VERSION = 1;
const UNIVERSAL_LAZY_METADATA = Object.freeze({
  id: "<lazy>",
  target: "universal"
});
const UNIVERSAL_CONTEXT_METADATA = Object.freeze({
  id: "<context>",
  target: "universal"
});
function isUniversalHostTemplateProgramValue(value) {
  return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint";
}
function isValidPreparedHostBatch(prepared) {
  return prepared !== null && typeof prepared === "object" && typeof prepared.apply === "function" && typeof prepared.abort === "function" && (prepared.afterAccept === void 0 || typeof prepared.afterAccept === "function");
}
function noopUniversalCommitTask() {
}
const EMPTY_BLUEPRINT_EVENTS = /* @__PURE__ */ new Map();
const EMPTY_BLUEPRINT_HOST_CALLBACKS = /* @__PURE__ */ new Map();
const EMPTY_COMMITTED_EVENTS = /* @__PURE__ */ new Map();
const EMPTY_COMMITTED_HOST_CALLBACKS = /* @__PURE__ */ new Map();
const EMPTY_STATIC_HOST_PROPS = Object.freeze({});
const EMPTY_STATIC_PROP_NAMES = Object.freeze([]);
let PARKED_UNIVERSAL_LINKED_DRAFTS = null;
const UNIVERSAL_TREE_PORTAL = 1 << 0;
const UNIVERSAL_TREE_REGION = 1 << 1;
const UNIVERSAL_TREE_EVENT = 1 << 2;
const UNIVERSAL_TREE_LIFECYCLE = 1 << 3;
const UNIVERSAL_TREE_LOCAL_CALLBACK = 1 << 4;
const UNIVERSAL_TREE_REF = 1 << 5;
const UNIVERSAL_TREE_HIDDEN = 1 << 6;
const UNIVERSAL_TREE_HOST_BINDING = 1 << 7;
let CURRENT_ATTEMPT = null;
let CURRENT_OWNER = null;
let CURRENT_LAZY_LEAF_OWNER = null;
let CURRENT_MEMO_CONTEXT_READS = null;
const SCHEDULED_UNIVERSAL_ROOTS = /* @__PURE__ */ new Set();
const PENDING_UNIVERSAL_PASSIVE_ROOTS = /* @__PURE__ */ new Set();
let UNIVERSAL_SYNC_DEPTH = 0;
let UNIVERSAL_COMMIT_TASK_DEPTH = 0;
let UNIVERSAL_TRANSITION_DEPTH = 0;
let UNIVERSAL_ASYNC_TRANSITION_COUNT = 0;
let UNIVERSAL_DISCRETE_EVENT_DEPTH = 0;
let UNIVERSAL_TRANSITION_PENDING_COUNT = 0;
let ACTIVE_UNIVERSAL_TRANSITION_BATCH = null;
let IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH = null;
const UNIVERSAL_TRANSITION_LISTENERS = /* @__PURE__ */ new Set();
const UNIVERSAL_SYNC_DRAIN_LIMIT = 100;
let NEXT_HOOK_SLOT = 0;
let NEXT_OWNER_ID = 1;
let NEXT_UNIVERSAL_ID_ROOT = 1;
let NEXT_EVENT_ROOT = 1;
let NEXT_RESOURCE_ROOT = 1;
let NEXT_PORTAL_ROOT = 1;
let NEXT_TRANSPORT_ROOT = 1;
const EVENT_DISPATCHERS = /* @__PURE__ */ new Map();
const UNIVERSAL_SLOT_STACK = [];
const EMPTY_UNIVERSAL_TRANSITION_BATCHES = /* @__PURE__ */ new Set();
class UniversalRendererRegionOwnerBridge {
  constructor(owner, ownerRenderer, childRenderer, component) {
    this.owner = owner;
    this.ownerRenderer = ownerRenderer;
    this.childRenderer = childRenderer;
    this.component = component;
  }
  owner;
  ownerRenderer;
  childRenderer;
  component;
  cell = null;
  get active() {
    return this.cell?.active === true;
  }
  compatible(previous) {
    return previous.owner === this.owner && previous.ownerRenderer === this.ownerRenderer && previous.childRenderer === this.childRenderer && previous.component === this.component;
  }
  activate(previous) {
    if (this.cell?.active === true) return this.cell;
    if (previous !== null && this.compatible(previous) && previous.cell?.active === true) {
      this.cell = previous.cell;
      return this.cell;
    }
    this.cell = { active: true, disposing: false, disposers: /* @__PURE__ */ new Set() };
    return this.cell;
  }
  lifecycle() {
    return this.cell;
  }
  readContext(context) {
    if (!this.active) {
      throw new Error("A renderer-region owner bridge cannot be read before its host commit.");
    }
    for (let current = this.owner; current !== null; current = current.parent) {
      if (current.contextValues?.has(context)) return current.contextValues.get(context);
    }
    return this.owner.root.readBridgeContext(context);
  }
  routeError(error) {
    return this.active && routeUniversalOwnerError(this.owner, error);
  }
  routeSuspense(thenable) {
    return this.active && routeUniversalOwnerSuspense(this.owner, thenable);
  }
  registerDispose(dispose) {
    const cell = this.cell;
    if (cell === null || !cell.active || cell.disposing) {
      throw new Error(
        "A renderer-owned child root cannot attach before its universal region commits."
      );
    }
    if (typeof dispose !== "function") {
      throw new TypeError("A renderer-region disposer must be a function.");
    }
    cell.disposers.add(dispose);
    let registered = true;
    return () => {
      if (!registered) return;
      registered = false;
      cell.disposers.delete(dispose);
    };
  }
  deactivate() {
    const cell = this.cell;
    if (cell === null || !cell.active || cell.disposing) return;
    cell.active = false;
    cell.disposing = true;
    const disposers = [...cell.disposers];
    cell.disposers.clear();
    for (const dispose of disposers) {
      try {
        dispose();
      } catch (error) {
        if (routeUniversalOwnerError(this.owner, error)) continue;
        if (!reportUniversalUncaughtError(this.owner.root, error)) console.error(error);
      }
    }
    cell.disposing = false;
  }
}
class UniversalSuspense {
  constructor(thenable) {
    this.thenable = thenable;
  }
  thenable;
}
let SETTLED_UNIVERSAL_WAKEABLES = null;
function resumeOnSettle(wakeable, retry) {
  const onSettle = SETTLED_UNIVERSAL_WAKEABLES?.has(wakeable) === true ? () => void setTimeout(retry, 0) : () => {
    (SETTLED_UNIVERSAL_WAKEABLES ??= /* @__PURE__ */ new WeakSet()).add(wakeable);
    retry();
  };
  wakeable.then(onSettle, onSettle);
}
class UniversalSuspendedAttemptImpl {
  constructor(root, thenable, component, props, replayEntries, transitionBatches, transitionRender, bridgeContextReads) {
    this.root = root;
    this.thenable = thenable;
    this.component = component;
    this.props = props;
    this.replayEntries = replayEntries;
    this.transitionBatches = transitionBatches;
    this.transitionRender = transitionRender;
    this.bridgeContextReads = bridgeContextReads;
    resumeOnSettle(thenable, () => this.settle());
  }
  root;
  thenable;
  component;
  props;
  replayEntries;
  transitionBatches;
  transitionRender;
  bridgeContextReads;
  state = "suspended";
  get status() {
    return this.state;
  }
  settle() {
    if (this.state !== "suspended") return;
    this.root.finishSuspension(this, true);
  }
  abort(preserveTransitions = false) {
    if (this.state !== "suspended") return;
    this.state = "aborted";
    this.root.finishSuspension(this, false, preserveTransitions);
  }
}
function assertRendererId(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty renderer id.`);
  }
}
function normalizeUniversalKey(value) {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "symbol" || typeof value === "bigint") {
    return value;
  }
  throw new TypeError(`Universal keys must be strings, numbers, symbols, or bigints.`);
}
function freezePlanNode(node) {
  if (node.kind === "host") {
    if (typeof node.type !== "string" || node.type === "") {
      throw new TypeError("A universal host plan requires a non-empty string type.");
    }
    const props = node.props === void 0 ? EMPTY_STATIC_HOST_PROPS : Object.freeze({ ...node.props });
    const bindings = Object.freeze(
      (node.bindings ?? []).map((binding) => Object.freeze([binding[0], binding[1]]))
    );
    const children = Object.freeze((node.children ?? []).map(freezePlanNode));
    return Object.freeze({
      kind: "host",
      type: node.type,
      props,
      bindings,
      ...node.propsSlot === void 0 ? null : { propsSlot: node.propsSlot },
      children
    });
  }
  if (node.kind === "range") {
    return Object.freeze({
      kind: "range",
      children: Object.freeze(node.children.map(freezePlanNode))
    });
  }
  if (node.kind === "slot") {
    return Object.freeze({ kind: "slot", slot: node.slot });
  }
  if (node.kind === "component") {
    return Object.freeze({
      kind: "component",
      renderer: node.renderer,
      ...node.component === void 0 ? null : { component: node.component },
      ...node.componentSlot === void 0 ? null : { componentSlot: node.componentSlot },
      ...node.propsSlot === void 0 ? null : { propsSlot: node.propsSlot },
      ...node.keySlot === void 0 ? null : { keySlot: node.keySlot },
      children: Object.freeze((node.children ?? []).map(freezePlanNode))
    });
  }
  if (node.kind === "if") {
    return Object.freeze({
      kind: "if",
      conditionSlot: node.conditionSlot,
      then: freezePlanNode(node.then),
      ...node.else === void 0 ? null : { else: freezePlanNode(node.else) }
    });
  }
  if (node.kind === "switch") {
    return Object.freeze({
      kind: "switch",
      valueSlot: node.valueSlot,
      cases: Object.freeze(
        node.cases.map(([value, child]) => Object.freeze([value, freezePlanNode(child)]))
      ),
      ...node.default === void 0 ? null : { default: freezePlanNode(node.default) }
    });
  }
  return Object.freeze({
    kind: "text",
    ...node.value === void 0 ? null : { value: node.value },
    ...node.slot === void 0 ? null : { slot: node.slot }
  });
}
function universalPlan(renderer, root) {
  assertRendererId(renderer, "universalPlan renderer");
  return Object.freeze({ $$kind: UNIVERSAL_PLAN, renderer, root: freezePlanNode(root) });
}
function universalValue(plan, values = [], key = null) {
  if (plan?.$$kind !== UNIVERSAL_PLAN)
    throw new TypeError("universalValue expected a universal plan.");
  return { $$kind: UNIVERSAL_VALUE, plan, values, key };
}
function universalKey(key, value) {
  if (value?.$$kind === UNIVERSAL_VALUE) {
    return { ...value, key };
  }
  return { $$kind: UNIVERSAL_KEYED, key, value };
}
function universalList(items, render, empty) {
  const values = [];
  let index = 0;
  const keys = /* @__PURE__ */ new Set();
  for (const item of items) {
    const value = render(item, index++);
    const key = renderableKey(value);
    if (key === null) {
      throw new Error("Universal keyed lists require every item to have an explicit key.");
    }
    if (keys.has(key)) throw new Error(`Duplicate universal list key ${String(key)}.`);
    keys.add(key);
    values.push(value);
  }
  return { $$kind: UNIVERSAL_LIST, values, ...values.length === 0 ? { empty } : null };
}
function renderableKey(value) {
  if (value?.$$kind === UNIVERSAL_VALUE) {
    return value.key;
  }
  if (value?.$$kind === UNIVERSAL_KEYED) {
    return value.key;
  }
  if (value?.$$kind === UNIVERSAL_COMPONENT_VALUE) {
    const component = value;
    return component.hasKey ? component.key : null;
  }
  return null;
}
function defineUniversalProtoProp(props, value) {
  Object.defineProperty(props, "__proto__", {
    configurable: true,
    enumerable: true,
    value,
    writable: true
  });
}
function assignUniversalPropSpread(props, value, canonicalizeHostClass) {
  const source = Object(value);
  const hasOwnProto = Object.prototype.propertyIsEnumerable.call(source, "__proto__");
  const hasOwnClassName = canonicalizeHostClass && Object.prototype.propertyIsEnumerable.call(source, "className");
  if (!hasOwnProto && !hasOwnClassName) {
    Object.assign(props, source);
    return;
  }
  let protoAssigned = false;
  const needsProtoGuard = hasOwnProto && !hasOwnProp.call(props, "__proto__");
  if (needsProtoGuard) {
    Object.defineProperty(props, "__proto__", {
      configurable: true,
      set(next) {
        protoAssigned = true;
        defineUniversalProtoProp(props, next);
      }
    });
  }
  if (hasOwnClassName) {
    Object.defineProperty(props, "className", {
      configurable: true,
      set(next) {
        props.class = next;
      }
    });
  }
  try {
    Object.assign(props, source);
  } finally {
    if (needsProtoGuard && !protoAssigned) delete props.__proto__;
    if (hasOwnClassName) delete props.className;
  }
}
function universalProps(entries, children = NO_CHILDREN, canonicalizeHostClass = false, compilerOwnedRecord = false) {
  if (compilerOwnedRecord) {
    return {
      $$kind: UNIVERSAL_PROPS,
      props: Object.freeze(entries),
      key: null,
      hasKey: false,
      hasChildren: false
    };
  }
  let props = {};
  let key = null;
  let hasKey = false;
  if (!canonicalizeHostClass) {
    for (const entry of entries) {
      if (entry[0] === "set") {
        if (entry[1] === "key") {
          key = entry[2];
          hasKey = true;
        } else if (entry[1] === "__proto__") defineUniversalProtoProp(props, entry[2]);
        else props[entry[1]] = entry[2];
        continue;
      }
      const spread = entry[1];
      if (spread == null) continue;
      assignUniversalPropSpread(props, spread, false);
      if (hasOwnProp.call(props, "key")) {
        ({ key, ...props } = props);
        hasKey = true;
      }
    }
  } else {
    for (const entry of entries) {
      if (entry[0] === "set") {
        const name = entry[1];
        if (name === "key") {
          key = entry[2];
          hasKey = true;
        } else if (name === "__proto__") defineUniversalProtoProp(props, entry[2]);
        else props[name === "className" ? "class" : name] = entry[2];
        continue;
      }
      const spread = entry[1];
      if (spread == null) continue;
      assignUniversalPropSpread(props, spread, true);
      if (hasOwnProp.call(props, "key")) {
        ({ key, ...props } = props);
        hasKey = true;
      }
    }
  }
  if (children !== NO_CHILDREN) props.children = children;
  return {
    $$kind: UNIVERSAL_PROPS,
    props: Object.freeze(props),
    key,
    hasKey,
    hasChildren: hasOwnProp.call(props, "children")
  };
}
function normalizePropsValue(value) {
  if (value?.$$kind === UNIVERSAL_PROPS) {
    return value;
  }
  return universalProps(value == null ? [] : [["spread", value]]);
}
function universalComponent(renderer, component, props = null, key = NO_KEY) {
  assertRendererId(renderer, "universalComponent renderer");
  const normalized = normalizePropsValue(props);
  return {
    $$kind: UNIVERSAL_COMPONENT_VALUE,
    renderer,
    component,
    props: normalized,
    key: key === NO_KEY ? normalized.key : key,
    hasKey: key !== NO_KEY || normalized.hasKey
  };
}
function universalChildren(renderer, render) {
  assertRendererId(renderer, "universalChildren renderer");
  if (typeof render !== "function") throw new TypeError("universalChildren expected a function.");
  return { $$kind: UNIVERSAL_CHILDREN, renderer, render };
}
function universalIf(condition, then, otherwise = null) {
  return { $$kind: UNIVERSAL_IF, condition: !!condition, then, else: otherwise };
}
function universalBlock(body) {
  if (typeof body !== "function") throw new TypeError("universalBlock expected a body function.");
  return { $$kind: UNIVERSAL_BLOCK, body };
}
function universalSwitch(value, cases, defaultValue = null) {
  return { $$kind: UNIVERSAL_SWITCH, value, cases, default: defaultValue };
}
function universalFor(items, key, render, empty = null, ownerless = false, compact = false, hostComponent, leafPlan, leafSignature, componentScope = false) {
  if (componentScope) {
    return {
      $$kind: UNIVERSAL_FOR,
      items,
      key,
      render,
      empty,
      ownerless,
      compact,
      componentScope: true
    };
  }
  if (hostComponent === true) {
    return { $$kind: UNIVERSAL_FOR, items, key, render, empty, ownerless, compact, template: true };
  }
  if (leafSignature !== void 0) {
    return {
      $$kind: UNIVERSAL_FOR,
      items,
      key,
      render,
      empty,
      ownerless,
      compact,
      ...hostComponent === void 0 ? null : { hostComponent },
      ...leafPlan === void 0 ? null : { leafPlan },
      leafSignature
    };
  }
  if (leafPlan !== void 0) {
    return hostComponent === void 0 ? { $$kind: UNIVERSAL_FOR, items, key, render, empty, ownerless, compact, leafPlan } : {
      $$kind: UNIVERSAL_FOR,
      items,
      key,
      render,
      empty,
      ownerless,
      compact,
      hostComponent,
      leafPlan
    };
  }
  return hostComponent === void 0 ? { $$kind: UNIVERSAL_FOR, items, key, render, empty, ownerless, compact } : { $$kind: UNIVERSAL_FOR, items, key, render, empty, ownerless, compact, hostComponent };
}
function universalTry(body, pending = null, catchBody = null) {
  return { $$kind: UNIVERSAL_TRY, body, pending, catch: catchBody };
}
function universalContext(context, value, children) {
  return { $$kind: UNIVERSAL_CONTEXT, context, value, children };
}
function universalActivity(mode, body) {
  if (mode !== "visible" && mode !== "hidden") {
    throw new TypeError(
      `Universal Activity mode must be "visible" or "hidden", received ${JSON.stringify(mode)}.`
    );
  }
  if (typeof body !== "function")
    throw new TypeError("universalActivity expected a body function.");
  return { $$kind: UNIVERSAL_ACTIVITY, mode, body };
}
function rendererRegion(ownerRenderer, childRenderer, component, props) {
  assertRendererId(ownerRenderer, "rendererRegion owner renderer");
  assertRendererId(childRenderer, "rendererRegion child renderer");
  if (ownerRenderer === childRenderer) {
    throw new Error("rendererRegion requires distinct owner and child renderers.");
  }
  if (typeof component !== "function") {
    throw new TypeError("rendererRegion expected a child component function.");
  }
  let regionProps = props;
  const owner = activateLazyLeafOwner();
  if (owner !== null) {
    if (ownerRenderer !== owner.record.renderer) {
      throw new Error(
        `rendererRegion owner ${JSON.stringify(ownerRenderer)} does not match the active universal renderer ${JSON.stringify(owner.record.renderer)}.`
      );
    }
    if (typeof props !== "object" && typeof props !== "function" || props === null) {
      throw new TypeError(
        "A renderer region created by a universal component requires object props."
      );
    }
    const bridge = new UniversalRendererRegionOwnerBridge(
      owner.record,
      ownerRenderer,
      childRenderer,
      component
    );
    const nextProps = { ...props };
    Object.defineProperty(nextProps, RENDERER_REGION_OWNER, {
      value: bridge,
      enumerable: false,
      configurable: false,
      writable: false
    });
    regionProps = Object.freeze(nextProps);
  }
  return Object.freeze({
    $$kind: UNIVERSAL_RENDERER_REGION,
    ownerRenderer,
    childRenderer,
    component,
    props: regionProps
  });
}
function isRendererRegion(value) {
  return value?.$$kind === UNIVERSAL_RENDERER_REGION;
}
function rendererRegionOwnerBridge(value) {
  if (!isRendererRegion(value)) return null;
  const bridge = value.props?.[RENDERER_REGION_OWNER];
  return bridge instanceof UniversalRendererRegionOwnerBridge ? bridge : null;
}
function defineUniversalComponent(renderer, render, metadata) {
  assertRendererId(renderer, "defineUniversalComponent renderer");
  if (typeof render !== "function")
    throw new TypeError("defineUniversalComponent expected a function.");
  Object.defineProperty(render, UNIVERSAL_COMPONENT, {
    configurable: false,
    enumerable: false,
    value: Object.freeze({ id: renderer, module: metadata?.module, target: "universal" })
  });
  return render;
}
function markUniversalHostComponent(component, renderer, plan) {
  assertRendererId(renderer, "markUniversalHostComponent renderer");
  if (getComponentMetadata(component).id !== renderer) {
    throw new Error("A universal host component and its renderer must match.");
  }
  if (component[UNIVERSAL_HMR] !== void 0) {
    throw new Error("A hot-reloadable component cannot be certified as a universal host.");
  }
  if (plan?.$$kind !== UNIVERSAL_PLAN || plan.renderer !== renderer || plan.root.kind !== "host" || plan.root.type === "#text" || plan.root.propsSlot !== 0 || (plan.root.children?.length ?? 0) !== 0 || (plan.root.bindings?.length ?? 0) !== 0 || Object.keys(plan.root.props ?? {}).length !== 0) {
    throw new TypeError("A universal host component requires one matching forwarded-props host.");
  }
  const existing = component[UNIVERSAL_HOST_COMPONENT];
  if (existing !== void 0) {
    if (existing.component === component && existing.renderer === renderer && existing.plan === plan) {
      return component;
    }
    throw new Error("A universal host component cannot change its certified host plan.");
  }
  Object.defineProperty(component, UNIVERSAL_HOST_COMPONENT, {
    value: Object.freeze({ component, renderer, plan, specializations: /* @__PURE__ */ new Map() })
  });
  HAS_UNIVERSAL_HOST_COMPONENTS = true;
  return component;
}
function trustedUniversalHostComponent(component, renderer) {
  if (!HAS_UNIVERSAL_HOST_COMPONENTS || typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
    return null;
  }
  const metadata = component[UNIVERSAL_HOST_COMPONENT];
  return metadata !== void 0 && metadata.component === component && metadata.renderer === renderer && component[UNIVERSAL_HMR] === void 0 ? metadata : null;
}
function parseUniversalHostComponentSignature(signature) {
  const names = JSON.parse(signature);
  if (!Array.isArray(names) || new Set(names).size !== names.length || names.some(
    (name) => typeof name !== "string" || name === "__proto__" || name === "key" || name === "ref" || name === "children" || name === "attach" || name.startsWith("on")
  )) {
    throw new TypeError("A universal host component requires safe, unique ordinary prop names.");
  }
  return names;
}
function universalHostComponentLeafPlan(renderer, component, signature) {
  const host = trustedUniversalHostComponent(component, renderer);
  if (host === null) return void 0;
  let plan = host.specializations.get(signature);
  if (plan === void 0) {
    const names = parseUniversalHostComponentSignature(signature);
    plan = universalPlan(renderer, {
      kind: "host",
      type: host.plan.root.type,
      bindings: names.map((name, index) => [name, index])
    });
    host.specializations.set(signature, plan);
  }
  return plan;
}
const UNIVERSAL_HMR = /* @__PURE__ */ Symbol.for("octane.universal.hmr");
function hmrUniversalComponent(renderer, component) {
  assertRendererId(renderer, "hmrUniversalComponent renderer");
  const metadata = getComponentMetadata(component);
  if (metadata.id !== renderer) {
    throw new Error(
      `Universal HMR renderer mismatch: wrapper ${JSON.stringify(renderer)} cannot own ${JSON.stringify(metadata.id)}.`
    );
  }
  const owners = /* @__PURE__ */ new Set();
  const meta = {
    component,
    owners,
    revision: 0,
    update(incoming) {
      const incomingMeta = incoming[UNIVERSAL_HMR];
      const next = incomingMeta?.component ?? incoming;
      const nextMetadata = getComponentMetadata(next);
      if (nextMetadata.id !== renderer) {
        throw new Error(
          `Universal HMR renderer mismatch: wrapper ${JSON.stringify(renderer)} cannot accept ${JSON.stringify(nextMetadata.id)}.`
        );
      }
      meta.component = next;
      meta.revision++;
      if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
        __profileComponentSource(wrapper, next);
      }
      if (next.__warm === void 0) delete wrapper.__warm;
      else markWarm(wrapper, next.__warm);
      for (const owner of owners) {
        if (owner.disposed) {
          owners.delete(owner);
          continue;
        }
        if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
          __profileSchedule(owner, "hmr");
        }
        owner.root.schedule();
      }
    }
  };
  const wrapper = defineUniversalComponent(
    renderer,
    (props, context) => {
      const owner = activateLazyLeafOwner();
      if (owner !== null) owners.add(owner.record);
      return meta.component(props, context);
    },
    { module: metadata.module }
  );
  Object.defineProperties(wrapper, {
    [UNIVERSAL_HMR]: {
      get() {
        return this === wrapper ? meta : void 0;
      }
    },
    [UNIVERSAL_COMPONENT_REVISION]: { get: () => meta.revision }
  });
  if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
    __profileComponentSource(wrapper, component);
  }
  if (component.__warm !== void 0) markWarm(wrapper, component.__warm);
  return wrapper;
}
function getComponentMetadata(component) {
  const metadata = component?.[UNIVERSAL_COMPONENT];
  if (metadata === void 0) {
    if (isContext(component)) return UNIVERSAL_CONTEXT_METADATA;
    if (component?.[LAZY_COMPONENT] === true) return UNIVERSAL_LAZY_METADATA;
    throw new Error("Universal roots accept only compiler-defined universal components.");
  }
  return metadata;
}
function identityPathEqual(left, right) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    if (!Object.is(left[index], right[index])) return false;
  }
  return true;
}
const OWNER_IDENTITY_NEGATIVE_ZERO = /* @__PURE__ */ Symbol("octane.universal.owner-identity.-0");
function ownerIdentityMapKey(value) {
  return typeof value === "number" && Object.is(value, -0) ? OWNER_IDENTITY_NEGATIVE_ZERO : value;
}
function createOwnerIdentityIndex() {
  return { components: /* @__PURE__ */ new Map() };
}
function readOwnerIdentity(index, component, identityPath, key) {
  let node = index.components.get(component);
  if (node === void 0) return void 0;
  for (const segment of identityPath) {
    node = node.children.get(ownerIdentityMapKey(segment));
    if (node === void 0) return void 0;
  }
  return node.values?.get(ownerIdentityMapKey(key));
}
function writeOwnerIdentity(index, component, identityPath, key, value) {
  const existing = index.components.get(component);
  let node;
  if (existing === void 0) {
    node = { children: /* @__PURE__ */ new Map(), values: null };
    index.components.set(component, node);
  } else {
    node = existing;
  }
  for (const segment of identityPath) {
    const segmentKey = ownerIdentityMapKey(segment);
    let child = node.children.get(segmentKey);
    if (child === void 0) {
      child = { children: /* @__PURE__ */ new Map(), values: null };
      node.children.set(segmentKey, child);
    }
    node = child;
  }
  node.values ??= /* @__PURE__ */ new Map();
  node.values.set(ownerIdentityMapKey(key), value);
}
function createOwnerRecord(root, component, parent, identityPath, key) {
  return {
    root,
    renderer: root.renderer,
    component,
    componentProps: null,
    componentRevision: 0,
    parent,
    identityPath,
    key,
    id: NEXT_OWNER_ID++,
    rangeKey: /* @__PURE__ */ Symbol("octane.universal.owner-range"),
    hooks: /* @__PURE__ */ new Map(),
    effectOrder: [],
    children: [],
    dirtyEpoch: 0,
    range: null,
    contextValues: null,
    updates: /* @__PURE__ */ new Map(),
    isBoundary: false,
    canHandleSuspense: false,
    boundaryError: void 0,
    hasBoundaryError: false,
    boundaryThenable: null,
    visibility: "visible",
    mounted: false,
    disposed: false
  };
}
function draftOwner(record, parent, replayPath) {
  return {
    record,
    componentProps: record.componentProps,
    componentRevision: record.componentRevision,
    parent,
    replayPath,
    priorClaimedSibling: parent?.children[parent.children.length - 1] ?? null,
    hooks: new Map(record.hooks),
    clonedHooks: /* @__PURE__ */ new Set(),
    seenEffects: [],
    children: [],
    retainedChildren: null,
    claimedChildren: /* @__PURE__ */ new Set(),
    sequentialClaimCursor: 0,
    childOwnerBuckets: null,
    childClaimCursors: null,
    contextValues: record.contextValues === null ? null : new Map(record.contextValues),
    appliedUpdates: /* @__PURE__ */ new Map(),
    needsRender: false,
    implicitSlot: 0,
    boundaryError: record.boundaryError,
    hasBoundaryError: record.hasBoundaryError,
    boundaryThenable: record.boundaryThenable,
    isBoundary: record.isBoundary,
    canHandleSuspense: record.canHandleSuspense,
    visibility: parent?.visibility ?? record.visibility,
    contextStable: null
  };
}
function ownerReplayPath(owner) {
  if (owner.replayPath !== null) return owner.replayPath;
  const record = owner.record;
  let ordinal = 0;
  for (let sibling = owner.priorClaimedSibling; sibling !== null; sibling = sibling.priorClaimedSibling) {
    const previous = sibling.record;
    if (previous.component === record.component && Object.is(previous.key, record.key) && identityPathsEqual(previous.identityPath, record.identityPath)) {
      ordinal++;
    }
  }
  return owner.replayPath = [
    ...ownerReplayPath(owner.parent),
    {
      component: record.component,
      identityPath: record.identityPath,
      key: record.key,
      ordinal
    }
  ];
}
function childOwnerBucket(parent, component, identityPath, key) {
  let buckets = parent.childOwnerBuckets;
  if (buckets === null) {
    buckets = createOwnerIdentityIndex();
    for (const child of parent.record.children) {
      let bucket = readOwnerIdentity(buckets, child.component, child.identityPath, child.key);
      if (bucket === void 0) {
        bucket = [];
        writeOwnerIdentity(buckets, child.component, child.identityPath, child.key, bucket);
      }
      bucket.push(child);
    }
    parent.childOwnerBuckets = buckets;
  }
  return readOwnerIdentity(buckets, component, identityPath, key);
}
function identityPathsEqual(left, right) {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    if (!Object.is(left[index], right[index])) return false;
  }
  return true;
}
function findClaimableChildRecord(parent, component, identityPath, key) {
  if (parent.record.children.length === 0) return void 0;
  if (parent.childOwnerBuckets === null) {
    const candidate = parent.record.children[parent.sequentialClaimCursor];
    if (candidate !== void 0 && candidate.component === component && Object.is(candidate.key, key) && identityPathsEqual(candidate.identityPath, identityPath) && !parent.claimedChildren.has(candidate)) {
      parent.sequentialClaimCursor++;
      return candidate;
    }
  }
  const bucket = childOwnerBucket(parent, component, identityPath, key);
  if (bucket === void 0) return void 0;
  const cursors = parent.childClaimCursors ??= createOwnerIdentityIndex();
  let cursor = readOwnerIdentity(cursors, component, identityPath, key) ?? 0;
  while (cursor < bucket.length && parent.claimedChildren.has(bucket[cursor])) cursor++;
  const record = bucket[cursor];
  writeOwnerIdentity(
    cursors,
    component,
    identityPath,
    key,
    cursor + (record === void 0 ? 0 : 1)
  );
  return record;
}
function adoptChildOwner(parent, record, component, identityPath, key) {
  const attempt = currentAttempt();
  parent.claimedChildren.add(record);
  const draft = draftOwner(record, parent, null);
  parent.children.push(draft);
  attempt.owners.push(draft);
  return draft;
}
function claimChildOwner(parent, component, identityPath, key) {
  const record = findClaimableChildRecord(parent, component, identityPath, key) ?? createOwnerRecord(currentAttempt().root, component, parent.record, identityPath, key);
  return adoptChildOwner(parent, record, component, identityPath, key);
}
function ancestorContextsStable(owner) {
  if (owner.contextStable !== null) return owner.contextStable;
  let stable = owner.parent === null ? true : ancestorContextsStable(owner.parent);
  if (stable && owner.contextValues !== null) {
    const committed = owner.record.mounted ? owner.record.contextValues : null;
    if (committed === null) {
      stable = owner.contextValues.size === 0;
    } else if (committed.size !== owner.contextValues.size) {
      stable = false;
    } else {
      for (const [context, value] of owner.contextValues) {
        if (!committed.has(context) || !Object.is(committed.get(context), value)) {
          stable = false;
          break;
        }
      }
    }
  }
  owner.contextStable = stable;
  return stable;
}
function ownerSubtreeRetainable(owner) {
  if (owner.updates.size !== 0 || owner.visibility !== "visible" || owner.boundaryThenable !== null || owner.isBoundary && owner.hasBoundaryError || owner.component?.__warm !== void 0 || owner.component !== null && universalComponentRevision(owner.component) !== owner.componentRevision) {
    return false;
  }
  for (const child of owner.children) {
    if (!ownerSubtreeRetainable(child)) return false;
  }
  return true;
}
function activateLazyLeafOwner() {
  const scope = CURRENT_LAZY_LEAF_OWNER;
  const attempt = CURRENT_ATTEMPT;
  if (scope === null || attempt !== scope.attempt || CURRENT_OWNER !== scope.parent && CURRENT_OWNER !== scope.owner) {
    return CURRENT_OWNER;
  }
  const owner = scope.owner ??= claimChildOwner(
    scope.parent,
    null,
    scope.identityPath,
    scope.key
  );
  owner.contextValues = null;
  CURRENT_OWNER = owner;
  attempt.owner = owner;
  return owner;
}
function readOwnerContext(owner, context, trackMemoRead = true) {
  let value;
  for (let current = owner; current !== null; current = current.parent) {
    if (current.contextValues?.has(context)) {
      value = current.contextValues.get(context);
      if (trackMemoRead) CURRENT_MEMO_CONTEXT_READS?.set(context, value);
      return value;
    }
  }
  if (currentAttempt().scope !== null) {
    for (let current = owner?.record.parent ?? null; current !== null; current = current.parent) {
      if (current.contextValues?.has(context)) {
        value = current.contextValues.get(context);
        if (trackMemoRead) CURRENT_MEMO_CONTEXT_READS?.set(context, value);
        return value;
      }
    }
  }
  value = currentAttempt().root.readBridgeContext(context);
  if (trackMemoRead) CURRENT_MEMO_CONTEXT_READS?.set(context, value);
  return value;
}
function executeOwner(owner, build, initialRenderCount = 0) {
  const attempt = currentAttempt();
  const warmPlanCheckpoint = ACTIVE_UNIVERSAL_WARM_PLANS.length;
  let output = [];
  for (let renderCount = initialRenderCount; ; renderCount++) {
    ACTIVE_UNIVERSAL_WARM_PLANS.length = warmPlanCheckpoint;
    if (renderCount === 25) throw new Error("Too many universal render-phase updates.");
    if (renderCount > 0) {
      resetDraftChildren(owner);
      owner.seenEffects = [];
    }
    owner.retainedChildren = null;
    owner.sequentialClaimCursor = 0;
    owner.childClaimCursors = null;
    owner.contextStable = null;
    owner.needsRender = false;
    owner.implicitSlot = 0;
    const previousOwner = CURRENT_OWNER;
    const previousAttemptOwner = attempt.owner;
    CURRENT_OWNER = owner;
    attempt.owner = owner;
    const component = owner.record.component;
    if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__ && component !== null) {
      __profileTrackComponent(owner.record, component);
    }
    const profileFrame = typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__ && component !== null ? __profileBeginRender(owner.record, component, owner.record.mounted) : null;
    let didThrow = false;
    let thrown;
    try {
      output = build();
    } catch (error) {
      didThrow = true;
      thrown = error;
      throw error;
    } finally {
      if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
        __profileEndRender(profileFrame, didThrow, thrown);
      }
      ACTIVE_UNIVERSAL_WARM_PLANS.length = warmPlanCheckpoint;
      CURRENT_OWNER = previousOwner;
      attempt.owner = previousAttemptOwner;
    }
    if (!owner.needsRender) return output;
  }
}
function renderLazyLeafItem(scope, render, item, index, key) {
  const previousScope = CURRENT_LAZY_LEAF_OWNER;
  const previousOwner = CURRENT_OWNER;
  const previousAttemptOwner = scope.attempt.owner;
  const warmPlanCheckpoint = ACTIVE_UNIVERSAL_WARM_PLANS.length;
  scope.key = key;
  scope.owner = null;
  CURRENT_LAZY_LEAF_OWNER = scope;
  let rendered;
  try {
    rendered = render(item, index);
    const owner = scope.owner;
    if (owner?.needsRender) {
      ACTIVE_UNIVERSAL_WARM_PLANS.length = warmPlanCheckpoint;
      executeOwner(
        owner,
        () => {
          rendered = render(item, index);
          return [];
        },
        1
      );
    }
    return rendered;
  } finally {
    if (ACTIVE_UNIVERSAL_WARM_PLANS.length !== warmPlanCheckpoint) {
      ACTIVE_UNIVERSAL_WARM_PLANS.length = warmPlanCheckpoint;
    }
    CURRENT_LAZY_LEAF_OWNER = previousScope;
    if (scope.owner !== null) {
      CURRENT_OWNER = previousOwner;
      scope.attempt.owner = previousAttemptOwner;
    }
  }
}
function ownerRange(owner, children) {
  return [{ kind: "range", key: owner.record.rangeKey, owner: owner.record, children }];
}
function readComponentContext(context) {
  return readOwnerContext(activateLazyLeafOwner(), context);
}
function componentInsertionEffect(create, deps) {
  enqueueUniversalEffect("insertion", create, deps);
}
function componentLayoutEffect(create, deps) {
  enqueueUniversalEffect("layout", create, deps);
}
function componentEffect(create, deps) {
  enqueueUniversalEffect("passive", create, deps);
}
function componentContext(renderer) {
  return {
    renderer,
    readContext: readComponentContext,
    insertionEffect: componentInsertionEffect,
    layoutEffect: componentLayoutEffect,
    effect: componentEffect
  };
}
function materializeComponentValue(value, expectedRenderer, path) {
  if (value.renderer !== expectedRenderer) {
    throw new Error(
      `Universal renderer mismatch: owner ${JSON.stringify(expectedRenderer)} cannot materialize component descriptor ${JSON.stringify(value.renderer)}.`
    );
  }
  const metadata = getComponentMetadata(value.component);
  if (metadata === UNIVERSAL_CONTEXT_METADATA) {
    const normalized2 = normalizePropsValue(value.props);
    const provider = universalContext(
      value.component,
      normalized2.props.value,
      normalized2.props.children
    );
    const key2 = value.hasKey ? normalizeUniversalKey(value.key) : null;
    return materializeValue(
      key2 === null ? provider : universalKey(key2, provider),
      expectedRenderer,
      null,
      path
    );
  }
  if (metadata !== UNIVERSAL_LAZY_METADATA && metadata.id !== expectedRenderer) {
    throw new Error(
      `Universal renderer mismatch: owner ${JSON.stringify(expectedRenderer)} cannot render nested component ${JSON.stringify(metadata.id)}.`
    );
  }
  const parent = CURRENT_OWNER;
  if (parent === null) throw new Error("A nested universal component requires an owner.");
  const normalized = normalizePropsValue(value.props);
  const host = trustedUniversalHostComponent(value.component, expectedRenderer);
  if (host !== null) {
    const nodes2 = [];
    materializeNode(host.plan.root, [normalized], expectedRenderer, path, nodes2);
    if (value.hasKey) nodes2[0].key = normalizeUniversalKey(value.key);
    return nodes2;
  }
  const key = value.hasKey ? value.key : null;
  const attempt = currentAttempt();
  const record = findClaimableChildRecord(parent, value.component, path, key);
  if (attempt.retainEligible && record !== void 0 && record.mounted && !record.disposed && record.dirtyEpoch !== attempt.dirtyEpoch && record.visibility === "visible" && parent.visibility === "visible" && record.componentProps !== null && universalShallowEqual(record.componentProps, normalized.props) && record.range !== null && record.range.owner === record && ancestorContextsStable(parent) && ownerSubtreeRetainable(record)) {
    const features = logicalTreeFeatures(record.range);
    if ((features & (UNIVERSAL_TREE_PORTAL | UNIVERSAL_TREE_REGION)) === 0) {
      parent.claimedChildren.add(record);
      (parent.retainedChildren ??= []).push({ record, position: parent.children.length });
      attempt.treeFeatures |= features;
      attempt.retainedCount++;
      return [
        {
          kind: "range",
          key: record.range.key,
          owner: record,
          retained: record.range,
          children: []
        }
      ];
    }
  }
  const owner = adoptChildOwner(
    parent,
    record ?? createOwnerRecord(attempt.root, value.component, parent.record, path, key),
    value.component,
    path,
    key
  );
  owner.componentRevision = universalComponentRevision(value.component);
  const props = { ...normalized.props };
  owner.componentProps = props;
  const nodes = executeOwner(owner, () => {
    const rendered = value.component(props, componentContext(expectedRenderer));
    return materializeValue(rendered, expectedRenderer, null, [...path, "output"]);
  });
  return ownerRange(owner, nodes);
}
function materializeScoped(parent, path, key, build, contextValues = null, outputPath = [...path, "output"]) {
  const attempt = currentAttempt();
  const universalIdCheckpoint = attempt.nextUniversalId;
  const owner = claimChildOwner(parent, null, path, key);
  owner.contextValues = contextValues;
  try {
    const nodes = executeOwner(
      owner,
      () => materializeValue(build(), parent.record.renderer, null, outputPath)
    );
    return ownerRange(owner, nodes);
  } catch (error) {
    attempt.nextUniversalId = universalIdCheckpoint;
    throw error;
  }
}
function disposeUncommittedDraft(owner) {
  for (const child of owner.children) disposeUncommittedDraft(child);
  if (!owner.record.mounted) {
    owner.record.disposed = true;
    owner.record.componentProps = null;
    owner.record.range = null;
    owner.record.updates.clear();
    for (const hook of owner.hooks.values()) {
      if (hook.kind === "effect-event") hook.cell.active = false;
    }
  }
}
function resetDraftChildren(owner) {
  for (const child of owner.children) disposeUncommittedDraft(child);
  owner.children = [];
  owner.retainedChildren = null;
  owner.claimedChildren = /* @__PURE__ */ new Set();
  owner.sequentialClaimCursor = 0;
  owner.childClaimCursors = null;
}
function retainCommittedOwnerTree(owner) {
  owner.hooks = new Map(owner.record.hooks);
  owner.seenEffects = [...owner.record.effectOrder];
  owner.contextValues = owner.record.contextValues === null ? null : new Map(owner.record.contextValues);
  owner.children = [];
  owner.retainedChildren = null;
  owner.claimedChildren = new Set(owner.record.children);
  owner.sequentialClaimCursor = 0;
  owner.childClaimCursors = null;
  for (const childRecord of owner.record.children) {
    const child = draftOwner(childRecord, owner, null);
    owner.children.push(child);
    currentAttempt().owners.push(child);
    retainCommittedOwnerTree(child);
  }
}
function findLogicalRange(record, key) {
  if (record.kind === "range" && Object.is(record.key, key)) return record;
  for (const child of record.children) {
    const match = findLogicalRange(child, key);
    if (match !== null) return match;
  }
  return null;
}
function blueprintFromLogical(record) {
  if (record.kind === "range") {
    return {
      kind: "range",
      key: record.key,
      ...record.owner === null ? null : { owner: record.owner },
      children: record.children.map(blueprintFromLogical)
    };
  }
  if (record.kind === "portal") {
    markUniversalTreeFeature(UNIVERSAL_TREE_PORTAL);
    return {
      kind: "portal",
      key: record.key,
      target: null,
      registration: record.portalRegistration,
      children: record.children.map(blueprintFromLogical)
    };
  }
  if (record.events.size !== 0) markUniversalTreeFeature(UNIVERSAL_TREE_EVENT);
  if (record.lifecycles.size !== 0) markUniversalTreeFeature(UNIVERSAL_TREE_LIFECYCLE);
  if (record.localCallbacks.size !== 0) {
    markUniversalTreeFeature(UNIVERSAL_TREE_LOCAL_CALLBACK);
  }
  if (record.ref != null) markUniversalTreeFeature(UNIVERSAL_TREE_REF);
  if (record.visibility !== "visible") markUniversalTreeFeature(UNIVERSAL_TREE_HIDDEN);
  for (const value of Object.values(record.props)) {
    if (isRendererRegion(value)) markUniversalTreeFeature(UNIVERSAL_TREE_REGION);
  }
  return {
    kind: "host",
    key: record.key,
    type: record.type,
    props: { ...record.props },
    ref: record.ref,
    owner: record.owner,
    events: new Map(record.events),
    lifecycles: new Map(record.lifecycles),
    localCallbacks: new Map(record.localCallbacks),
    visibility: record.visibility,
    children: record.children.map(blueprintFromLogical)
  };
}
function markDraftOwnerHidden(owner, visibility) {
  owner.visibility = owner.record.visibility === "suspense-hidden" ? "suspense-hidden" : visibility;
  for (const child of owner.children) markDraftOwnerHidden(child, owner.visibility);
}
function markBlueprintHidden(nodes, visibility) {
  for (const node of nodes) {
    if (node.kind === "host") {
      if (node.visibility !== "suspense-hidden") node.visibility = visibility;
      markUniversalTreeFeature(UNIVERSAL_TREE_HIDDEN);
    }
    markBlueprintHidden(node.children, visibility);
  }
}
function retainCommittedTryArm(owner) {
  if (!owner.record.mounted) return null;
  const childRecord = owner.record.children.find((child2) => Object.is(child2.key, "try"));
  if (childRecord === void 0) return null;
  const range = childRecord.range ?? findLogicalRange(owner.record.root.rootRecordForRetention(), childRecord.rangeKey);
  if (range === null) return null;
  resetDraftChildren(owner);
  const child = draftOwner(childRecord, owner, null);
  owner.children.push(child);
  owner.claimedChildren.add(childRecord);
  currentAttempt().owners.push(child);
  retainCommittedOwnerTree(child);
  markDraftOwnerHidden(child, "suspense-hidden");
  const nodes = ownerRange(child, range.children.map(blueprintFromLogical));
  markBlueprintHidden(nodes, "suspense-hidden");
  return nodes;
}
function retainCommittedActivity(owner) {
  const attempt = currentAttempt();
  const record = owner.record;
  const parent = owner.parent;
  const range = record.mounted ? record.range ?? findLogicalRange(attempt.root.rootRecordForRetention(), record.rangeKey) : null;
  resetDraftChildren(owner);
  const retained = draftOwner(record, parent, owner.replayPath);
  retained.priorClaimedSibling = owner.priorClaimedSibling;
  retained.visibility = owner.visibility;
  retained.canHandleSuspense = owner.canHandleSuspense;
  retained.boundaryThenable = owner.boundaryThenable;
  parent.children[parent.children.indexOf(owner)] = retained;
  attempt.owners.push(retained);
  retainCommittedOwnerTree(retained);
  const visibility = retained.visibility;
  for (const child of retained.children) markDraftOwnerHidden(child, visibility);
  const nodes = range === null ? [] : range.children.map(blueprintFromLogical);
  markBlueprintHidden(nodes, visibility);
  return ownerRange(retained, nodes);
}
const OWNERLESS_LEAF_PLAN_CACHE = /* @__PURE__ */ new WeakMap();
function ownerlessLeafHostPlan(plan) {
  const cached = OWNERLESS_LEAF_PLAN_CACHE.get(plan);
  if (cached !== void 0) return cached;
  const root = plan.root;
  let host = null;
  if (root.kind === "host" && root.type !== "#text" && root.propsSlot === void 0 && (root.children?.length ?? 0) === 0) {
    const names = [
      ...Object.keys(root.props ?? {}),
      ...(root.bindings ?? []).map(([name]) => name)
    ];
    if (!names.some((name) => name === "key" || name === "ref" || name === "children")) {
      host = root;
    }
  }
  OWNERLESS_LEAF_PLAN_CACHE.set(plan, host);
  return host;
}
function materializeOwnerlessLeafValue(value, expectedRenderer, owner = CURRENT_OWNER) {
  if (value?.$$kind !== UNIVERSAL_VALUE) return null;
  const planValue = value;
  if (planValue.plan.renderer !== expectedRenderer) {
    throw new Error(
      `Universal renderer mismatch: root expects ${JSON.stringify(expectedRenderer)} but the plan targets ${JSON.stringify(planValue.plan.renderer)}.`
    );
  }
  if (planValue.key !== null) return null;
  const node = ownerlessLeafHostPlan(planValue.plan);
  if (node === null) return null;
  const props = { ...node.props ?? {} };
  for (const [name, slot] of node.bindings ?? []) props[name] = planValue.values[slot];
  let hostBindings = null;
  const attempt = currentAttempt();
  for (const name of Object.keys(props)) {
    const handler = props[name];
    if (isUniversalHostBinding(handler)) {
      if (attempt.root.hasHostBindingUnsupportedConfiguration() || name.startsWith("on")) {
        throw new Error(
          "Experimental host bindings require an ordinary prop on a local direct root."
        );
      }
      markUniversalTreeFeature(UNIVERSAL_TREE_HOST_BINDING);
      (hostBindings ??= /* @__PURE__ */ new Map()).set(name, handler);
      props[name] = attempt.root.encodeHostProp(node.type, name, handler.getSnapshot());
      continue;
    }
    if (isRendererRegion(handler)) markUniversalTreeFeature(UNIVERSAL_TREE_REGION);
    props[name] = attempt.root.encodeHostProp(node.type, name, handler);
  }
  if (owner.visibility !== "visible") markUniversalTreeFeature(UNIVERSAL_TREE_HIDDEN);
  return {
    kind: "host",
    key: null,
    type: node.type,
    props,
    ...hostBindings === null ? null : { hostBindings },
    ref: null,
    owner: owner.record,
    events: EMPTY_BLUEPRINT_EVENTS,
    lifecycles: EMPTY_BLUEPRINT_HOST_CALLBACKS,
    localCallbacks: EMPTY_BLUEPRINT_HOST_CALLBACKS,
    visibility: owner.visibility,
    children: []
  };
}
function materializeRawUniversalListValue(list, value, renderer) {
  if (list.leafPlan !== void 0 && (list.hostComponent === void 0 || list.leafSignature === void 0 || trustedUniversalHostComponent(list.hostComponent, renderer) !== null)) {
    return universalValue(list.leafPlan, value);
  }
  if (list.leafSignature === void 0) return value;
  if (list.hostComponent === void 0) {
    throw new TypeError("A specialized universal host list requires its original component.");
  }
  const values = value;
  const names = parseUniversalHostComponentSignature(list.leafSignature);
  if (names.length !== values.length) {
    throw new TypeError("A universal host component signature and its values must match.");
  }
  return universalComponent(
    renderer,
    list.hostComponent,
    universalProps(names.map((name, index) => ["set", name, values[index]]))
  );
}
function materializeValue(value, expectedRenderer, key, path) {
  if (value == null || value === false || value === true) return [];
  if (value?.$$kind === UNIVERSAL_KEYED) {
    const keyed = value;
    const nodes = materializeValue(keyed.value, expectedRenderer, keyed.key, [...path, keyed.key]);
    if (nodes.length === 1) nodes[0].key = keyed.key;
    else return [{ kind: "range", key: keyed.key, children: nodes }];
    return nodes;
  }
  if (value?.$$kind === UNIVERSAL_LIST) {
    const list = value;
    if (list.values.length === 0 && list.empty !== void 0) {
      return materializeValue(list.empty, expectedRenderer, null, [...path, "empty"]);
    }
    const output = [];
    for (let index = 0; index < list.values.length; index++) {
      const item = list.values[index];
      const itemKey = renderableKey(item);
      output.push(
        ...materializeValue(item, expectedRenderer, itemKey, [...path, "item", itemKey ?? index])
      );
    }
    return output;
  }
  if (value?.$$kind === UNIVERSAL_VALUE) {
    const planValue = value;
    const nodes = materializePlanValue(planValue, expectedRenderer, path);
    if (key !== null && nodes.length === 1) nodes[0].key = key;
    return nodes;
  }
  if (value?.$$kind === UNIVERSAL_COMPONENT_VALUE) {
    const nodes = materializeComponentValue(
      value,
      expectedRenderer,
      path
    );
    if (key !== null && nodes.length === 1) nodes[0].key = key;
    return nodes;
  }
  if (value?.$$kind === UNIVERSAL_CHILDREN) {
    const children = value;
    if (children.renderer !== expectedRenderer) {
      throw new Error(
        `Universal renderer mismatch: owner ${JSON.stringify(expectedRenderer)} cannot render children for ${JSON.stringify(children.renderer)}.`
      );
    }
    return materializeValue(children.render(), expectedRenderer, key, [...path, "children"]);
  }
  if (value?.$$kind === UNIVERSAL_PORTAL) {
    const portal = value;
    markUniversalTreeFeature(UNIVERSAL_TREE_PORTAL);
    return [
      {
        kind: "portal",
        key,
        target: portal.target,
        registration: null,
        children: materializeValue(portal.children, expectedRenderer, null, [...path, "portal"])
      }
    ];
  }
  if (value?.$$kind === UNIVERSAL_ACTIVITY) {
    const activity = value;
    if (currentAttempt().root.driverCapabilities().visibility !== true) {
      throw new Error(
        `Universal renderer ${JSON.stringify(expectedRenderer)} does not declare the visibility capability.`
      );
    }
    const parent = CURRENT_OWNER;
    if (parent === null) throw new Error("Universal Activity requires an owning component.");
    const owner = claimChildOwner(parent, null, [...path, "activity"], null);
    const hidden = activity.mode === "hidden";
    owner.canHandleSuspense = hidden;
    owner.visibility = parent.visibility === "suspense-hidden" ? "suspense-hidden" : parent.visibility === "activity-hidden" || hidden ? "activity-hidden" : "visible";
    const attempt = currentAttempt();
    const universalIdCheckpoint = attempt.nextUniversalId;
    let range;
    try {
      if (owner.boundaryThenable !== null) throw new UniversalSuspense(owner.boundaryThenable);
      const nodes = executeOwner(
        owner,
        () => materializeValue(activity.body(), expectedRenderer, null, [...path, "activity-output"])
      );
      range = ownerRange(owner, nodes);
    } catch (error) {
      if (!hidden || !(error instanceof UniversalSuspense)) throw error;
      attempt.nextUniversalId = universalIdCheckpoint;
      if (owner.boundaryThenable === null) attempt.retryThenables.add(error.thenable);
      range = retainCommittedActivity(owner);
    }
    return key === null ? range : [{ kind: "range", key, children: range }];
  }
  if (value?.$$kind === UNIVERSAL_IF) {
    const branch = value;
    const body = branch.condition ? branch.then : branch.else;
    if (body === null) return [];
    return materializeScoped(CURRENT_OWNER, [...path, "if"], branch.condition ? 1 : 0, body);
  }
  if (value?.$$kind === UNIVERSAL_SWITCH) {
    const branch = value;
    let selected = branch.default;
    let selectedKey = "default";
    for (let index = 0; index < branch.cases.length; index++) {
      if (branch.cases[index][0] === branch.value) {
        selected = branch.cases[index][1];
        selectedKey = index;
        break;
      }
    }
    if (selected === null) return [];
    return materializeScoped(CURRENT_OWNER, [...path, "switch"], selectedKey, selected);
  }
  if (value?.$$kind === UNIVERSAL_FOR) {
    const list = value;
    const output = [];
    const certifiedHost = list.hostComponent === void 0 || trustedUniversalHostComponent(list.hostComponent, expectedRenderer) !== null;
    const compilerLeafProps = list.ownerless && certifiedHost && currentAttempt().root.driverCapabilities().compilerLeafProps === true;
    const compilerTemplateTree = list.template === true && currentAttempt().root.driverCapabilities().templateProgramMount === true && CURRENT_OWNER?.visibility === "visible";
    const compilerComponentScope = list.componentScope === true && currentAttempt().root.driverCapabilities().templateProgramRuns === true && CURRENT_OWNER?.visibility === "visible";
    if (list.ownerless && list.compact && certifiedHost && currentAttempt().root.canCompactCompilerLeafProps()) {
      const attempt2 = currentAttempt();
      const parent2 = CURRENT_OWNER;
      const lazyOwnerScope2 = {
        attempt: attempt2,
        parent: parent2,
        identityPath: [...path, "for"],
        key: 0,
        owner: null
      };
      const compactKeys = [];
      const compactValues = [];
      let compactSeenKeys = null;
      let previousNumericKey = Number.NEGATIVE_INFINITY;
      let compactOwners = null;
      const rawLeafValues = list.leafPlan !== void 0;
      let compactPlan = list.leafPlan ?? null;
      let compactHost = compactPlan === null ? null : ownerlessLeafHostPlan(compactPlan);
      if (compactPlan !== null) {
        if (compactPlan.renderer !== expectedRenderer) {
          throw new Error(
            `Universal renderer mismatch: root expects ${JSON.stringify(expectedRenderer)} but the plan targets ${JSON.stringify(compactPlan.renderer)}.`
          );
        }
        if (compactHost === null) {
          throw new Error(
            "Compact universal lists require one stable intrinsic leaf plan per item."
          );
        }
      }
      let compactIndex = 0;
      for (const item of list.items) {
        const itemIndex = compactIndex++;
        const itemKey = list.key(item, itemIndex);
        if (compactSeenKeys === null && typeof itemKey === "number" && itemKey > previousNumericKey) {
          previousNumericKey = itemKey;
        } else {
          const seen = compactSeenKeys ??= new Set(compactKeys);
          if (seen.has(itemKey)) {
            throw new Error(`Duplicate universal list key ${String(itemKey)}.`);
          }
          seen.add(itemKey);
        }
        const rendered = renderLazyLeafItem(lazyOwnerScope2, list.render, item, itemIndex, itemKey);
        if (lazyOwnerScope2.owner !== null) {
          (compactOwners ??= [])[itemIndex] = lazyOwnerScope2.owner.record;
        }
        let values;
        if (rawLeafValues) {
          values = rendered;
        } else {
          if (rendered?.$$kind !== UNIVERSAL_VALUE) {
            throw new Error(
              "Compact universal lists require one compiler-proven intrinsic leaf host per item."
            );
          }
          const planValue = rendered;
          if (planValue.plan !== compactPlan) {
            if (planValue.plan.renderer !== expectedRenderer) {
              throw new Error(
                `Universal renderer mismatch: root expects ${JSON.stringify(expectedRenderer)} but the plan targets ${JSON.stringify(planValue.plan.renderer)}.`
              );
            }
            if (compactPlan !== null) {
              throw new Error(
                "Compact universal lists require one stable intrinsic leaf plan per item."
              );
            }
            compactPlan = planValue.plan;
            compactHost = ownerlessLeafHostPlan(compactPlan);
          }
          if (planValue.key !== null || compactHost === null) {
            throw new Error(
              "Compact universal lists require one stable intrinsic leaf plan per item."
            );
          }
          values = planValue.values;
        }
        const host = compactHost;
        if (itemIndex === 0 && host.props !== void 0) {
          for (const name of Object.keys(host.props)) {
            if (isUniversalHostBinding(host.props[name])) {
              throw new Error(
                "Experimental host bindings cannot be used in compact universal leaf lists."
              );
            }
            if (isRendererRegion(host.props[name])) {
              markUniversalTreeFeature(UNIVERSAL_TREE_REGION);
            }
          }
        }
        const bindings = host.bindings;
        if (bindings !== void 0) {
          for (let bindingIndex = 0; bindingIndex < bindings.length; bindingIndex++) {
            const binding = values[bindings[bindingIndex][1]];
            if (isUniversalHostBinding(binding)) {
              throw new Error(
                "Experimental host bindings cannot be used in compact universal leaf lists."
              );
            }
            if (typeof binding === "object" && binding !== null && isRendererRegion(binding)) {
              markUniversalTreeFeature(UNIVERSAL_TREE_REGION);
            }
          }
        }
        compactKeys.push(itemKey);
        compactValues.push(values);
      }
      if (compactIndex === 0 && list.empty !== null) {
        return materializeScoped(CURRENT_OWNER, [...path, "for-empty"], null, list.empty);
      }
      const owner = parent2;
      if (compactIndex !== 0 && owner.visibility !== "visible") {
        markUniversalTreeFeature(UNIVERSAL_TREE_HIDDEN);
      }
      currentAttempt().hasCompactLists = true;
      return [
        {
          kind: "range",
          key: null,
          children: [],
          compactLeafList: {
            host: compactHost,
            keys: compactKeys,
            values: compactValues,
            owner: owner.record,
            owners: compactOwners,
            visibility: owner.visibility,
            props: [],
            propCount: -1
          }
        }
      ];
    }
    const parent = CURRENT_OWNER;
    const attempt = currentAttempt();
    const keys = /* @__PURE__ */ new Set();
    let compactTemplateEnabled = compilerTemplateTree && attempt.root.driverCapabilities().templateProgramRuns === true;
    let compactTemplateList = null;
    const lazyOwnerScope = compilerLeafProps || compilerTemplateTree || compilerComponentScope ? {
      attempt,
      parent,
      identityPath: [...path, "for"],
      key: 0,
      owner: null
    } : null;
    let componentScopeEnabled = compilerComponentScope;
    if (componentScopeEnabled) {
      const previous = parent.record.children[parent.sequentialClaimCursor];
      if (previous?.component === null && identityPathsEqual(previous.identityPath, lazyOwnerScope.identityPath)) {
        componentScopeEnabled = false;
      }
    }
    const componentPath = componentScopeEnabled ? [...lazyOwnerScope.identityPath, "output"] : null;
    let listOwnerPath = lazyOwnerScope?.identityPath ?? null;
    let listOutputPath = componentPath;
    let index = 0;
    for (const item of list.items) {
      const itemIndex = index++;
      const itemKey = list.key(item, itemIndex);
      if (keys.has(itemKey)) throw new Error(`Duplicate universal list key ${String(itemKey)}.`);
      keys.add(itemKey);
      if (componentScopeEnabled) {
        const rendered = renderLazyLeafItem(lazyOwnerScope, list.render, item, itemIndex, itemKey);
        const candidate = rendered;
        if (lazyOwnerScope.owner === null && candidate?.$$kind === UNIVERSAL_COMPONENT_VALUE && candidate.renderer === expectedRenderer && !candidate.hasKey) {
          const keyed = {
            ...candidate,
            key: itemKey,
            hasKey: true
          };
          output.push(...materializeComponentValue(keyed, expectedRenderer, componentPath));
          continue;
        }
        if (lazyOwnerScope.owner === null) {
          output.push(
            ...materializeScoped(parent, lazyOwnerScope.identityPath, itemKey, () => rendered)
          );
          continue;
        }
        const itemOwner = lazyOwnerScope.owner;
        const previousOwner = CURRENT_OWNER;
        const previousAttemptOwner = attempt.owner;
        CURRENT_OWNER = itemOwner;
        attempt.owner = itemOwner;
        let nodes;
        try {
          nodes = materializeValue(rendered, expectedRenderer, null, componentPath);
        } finally {
          CURRENT_OWNER = previousOwner;
          attempt.owner = previousAttemptOwner;
        }
        output.push(...ownerRange(itemOwner, nodes));
      } else if (compilerTemplateTree) {
        const rendered = renderLazyLeafItem(lazyOwnerScope, list.render, item, itemIndex, itemKey);
        if (compactTemplateEnabled) {
          const candidate = rendered;
          const candidatePlan = candidate?.$$kind === UNIVERSAL_VALUE ? candidate.plan : null;
          const compiled = candidatePlan?.root.kind === "host" ? compiledCollapsedTemplateProgram(candidatePlan.root) : null;
          const prepared = compiled === null ? null : attempt.root.prepareCollapsedTemplateProgram(compiled);
          const dense = compiled === null || prepared === null ? null : prepareCollapsedTemplateValues(candidate, attempt.root, compiled, prepared);
          if (lazyOwnerScope.owner === null && candidatePlan !== null && candidatePlan.renderer === expectedRenderer && candidate.key === null && compiled !== null && prepared !== null && dense !== null && (compactTemplateList === null || compactTemplateList.plan === candidatePlan)) {
            compactTemplateList ??= {
              plan: candidatePlan,
              compiled,
              program: prepared,
              keys: [],
              values: [],
              captures: [],
              owner: parent.record
            };
            compactTemplateList.keys.push(itemKey);
            compactTemplateList.values.push(dense);
            compactTemplateList.captures.push(candidate.values);
            if (prepared.events.length !== 0) markUniversalTreeFeature(UNIVERSAL_TREE_EVENT);
            continue;
          }
          compactTemplateEnabled = false;
          if (compactTemplateList !== null) {
            for (let compactIndex = 0; compactIndex < compactTemplateList.keys.length; compactIndex++) {
              const host = preparedCollapsedTemplateBlueprint(
                compactTemplateList.plan,
                compactTemplateList.compiled,
                compactTemplateList.program,
                compactTemplateList.values[compactIndex],
                compactTemplateList.captures[compactIndex],
                compactTemplateList.owner
              );
              host.key = compactTemplateList.keys[compactIndex];
              output.push(host);
            }
            compactTemplateList = null;
          }
        }
        const itemOwner = lazyOwnerScope.owner ?? parent;
        const previousOwner = CURRENT_OWNER;
        const previousAttemptOwner = attempt.owner;
        CURRENT_OWNER = itemOwner;
        attempt.owner = itemOwner;
        let nodes;
        try {
          nodes = materializeValue(rendered, expectedRenderer, null, path);
        } finally {
          CURRENT_OWNER = previousOwner;
          attempt.owner = previousAttemptOwner;
        }
        if (nodes.length !== 1 || nodes[0].kind !== "host" || nodes[0].key !== null) {
          throw new Error(
            "Program-backed universal lists require one compiler-proven intrinsic host tree per item."
          );
        }
        if (lazyOwnerScope.owner === null) {
          nodes[0].key = itemKey;
          output.push(nodes[0]);
        } else {
          output.push(...ownerRange(itemOwner, nodes));
        }
      } else if (compilerLeafProps) {
        const rawOutput = renderLazyLeafItem(
          lazyOwnerScope,
          list.render,
          item,
          itemIndex,
          itemKey
        );
        const rendered = materializeRawUniversalListValue(list, rawOutput, expectedRenderer);
        const itemOwner = lazyOwnerScope.owner ?? parent;
        const leaf = materializeOwnerlessLeafValue(rendered, expectedRenderer, itemOwner);
        if (leaf !== null) {
          leaf.key = itemKey;
          output.push(leaf);
          continue;
        }
        const previousOwner = CURRENT_OWNER;
        const previousAttemptOwner = attempt.owner;
        CURRENT_OWNER = itemOwner;
        attempt.owner = itemOwner;
        let nodes;
        try {
          nodes = materializeValue(rendered, expectedRenderer, null, [...path, "for", itemKey]);
        } finally {
          CURRENT_OWNER = previousOwner;
          attempt.owner = previousAttemptOwner;
        }
        if (nodes.length !== 1 || nodes[0].kind !== "host" || nodes[0].key !== null || nodes[0].children.length !== 0) {
          throw new Error(
            "Ownerless universal lists require exactly one intrinsic leaf host per item."
          );
        }
        nodes[0].key = itemKey;
        output.push(nodes[0]);
      } else {
        listOwnerPath ??= [...path, "for"];
        listOutputPath ??= [...listOwnerPath, "output"];
        output.push(
          ...materializeScoped(
            parent,
            listOwnerPath,
            itemKey,
            () => materializeRawUniversalListValue(
              list,
              list.render(item, itemIndex),
              expectedRenderer
            ),
            null,
            listOutputPath
          )
        );
      }
    }
    if (compactTemplateEnabled && compactTemplateList !== null) {
      attempt.hasCompactLists = true;
      return [{ kind: "range", key: null, children: [], compactTemplateList }];
    }
    if (index === 0 && list.empty !== null) {
      return materializeScoped(CURRENT_OWNER, [...path, "for-empty"], null, list.empty);
    }
    return output;
  }
  if (value?.$$kind === UNIVERSAL_CONTEXT) {
    const provider = value;
    const parent = CURRENT_OWNER;
    const owner = claimChildOwner(parent, null, [...path, "context", provider.context], null);
    owner.contextValues = /* @__PURE__ */ new Map([[provider.context, provider.value]]);
    const nodes = executeOwner(owner, () => {
      const children = provider.children;
      const rendered = typeof children === "function" ? children() : children;
      return materializeValue(rendered, expectedRenderer, null, [...path, "context-output"]);
    });
    return ownerRange(owner, nodes);
  }
  if (value?.$$kind === UNIVERSAL_TRY) {
    const boundary = value;
    const parent = CURRENT_OWNER;
    const owner = claimChildOwner(parent, null, [...path, "try-boundary"], null);
    owner.isBoundary = true;
    owner.canHandleSuspense = boundary.pending !== null;
    let branch = boundary.body;
    let branchKey = "try";
    if (owner.boundaryThenable !== null) {
      if (boundary.pending === null) throw new UniversalSuspense(owner.boundaryThenable);
      const retained = retainCommittedTryArm(owner);
      if (retained !== null) {
        if (currentAttempt().root.driverCapabilities().visibility !== true) {
          throw new Error(
            `Universal renderer ${JSON.stringify(expectedRenderer)} does not declare the visibility capability required by retained Suspense.`
          );
        }
        const pending = materializeScoped(owner, [...path, "try-arm"], "pending", boundary.pending);
        return ownerRange(owner, [...retained, ...pending]);
      }
      branchKey = "pending";
      branch = boundary.pending;
    } else if (owner.hasBoundaryError) {
      if (boundary.catch === null) throw owner.boundaryError;
      const error = owner.boundaryError;
      branchKey = "catch";
      branch = () => boundary.catch(error, () => {
        owner.record.hasBoundaryError = false;
        owner.record.boundaryError = void 0;
        owner.record.root.schedule();
      });
    }
    try {
      const nodes = materializeScoped(owner, [...path, "try-arm"], branchKey, branch);
      return ownerRange(owner, nodes);
    } catch (error) {
      if (error instanceof UniversalSuspense) {
        const retained = retainCommittedTryArm(owner);
        if (retained !== null) {
          if (currentAttempt().transitionRender) throw error;
          if (boundary.pending === null) throw error;
          if (currentAttempt().root.driverCapabilities().visibility !== true) {
            throw new Error(
              `Universal renderer ${JSON.stringify(expectedRenderer)} does not declare the visibility capability required by retained Suspense.`
            );
          }
          currentAttempt().retryThenables.add(error.thenable);
          const pending = materializeScoped(
            owner,
            [...path, "try-arm"],
            "pending",
            boundary.pending
          );
          return ownerRange(owner, [...retained, ...pending]);
        }
        currentAttempt().retryThenables.add(error.thenable);
        resetDraftChildren(owner);
        if (boundary.pending === null) throw error;
        const nodes2 = materializeScoped(owner, [...path, "try-arm"], "pending", boundary.pending);
        return ownerRange(owner, nodes2);
      }
      if (boundary.catch === null || branchKey === "catch") throw error;
      resetDraftChildren(owner);
      owner.hasBoundaryError = true;
      owner.boundaryError = error;
      reportUniversalCaughtError(owner.record.root, error);
      const nodes = materializeScoped(
        owner,
        [...path, "try-arm"],
        "catch",
        () => boundary.catch(error, () => {
          owner.record.hasBoundaryError = false;
          owner.record.boundaryError = void 0;
          owner.record.root.schedule();
        })
      );
      return ownerRange(owner, nodes);
    }
  }
  if (value?.$$kind === UNIVERSAL_BLOCK) {
    return materializeScoped(
      CURRENT_OWNER,
      [...path, "block"],
      0,
      value.body
    );
  }
  if (Array.isArray(value)) {
    const output = [];
    let firstKey = null;
    let keys;
    for (let index = 0; index < value.length; index++) {
      const item = value[index];
      const itemKey = renderableKey(item);
      if (itemKey !== null) {
        if (firstKey === null) {
          firstKey = itemKey;
        } else {
          if (keys === void 0) {
            keys = /* @__PURE__ */ new Set();
            keys.add(firstKey);
          }
          if (keys.has(itemKey))
            throw new Error(`Duplicate universal child key ${String(itemKey)}.`);
          keys.add(itemKey);
        }
      }
      output.push(
        ...materializeValue(item, expectedRenderer, itemKey, [
          ...path,
          itemKey === null ? index : itemKey
        ])
      );
    }
    return output;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    const text = currentAttempt().root.textPolicy();
    if (text === "ignore") return [];
    if (text === "reject") {
      throw new Error(
        `Universal renderer ${JSON.stringify(expectedRenderer)} rejects primitive text children.`
      );
    }
    return [
      {
        kind: "host",
        key,
        type: "#text",
        props: { value: String(value) },
        ref: null,
        owner: CURRENT_OWNER.record,
        events: EMPTY_BLUEPRINT_EVENTS,
        lifecycles: EMPTY_BLUEPRINT_HOST_CALLBACKS,
        localCallbacks: EMPTY_BLUEPRINT_HOST_CALLBACKS,
        visibility: CURRENT_OWNER.visibility,
        children: []
      }
    ];
  }
  throw new TypeError(
    `Unsupported universal dynamic child ${Object.prototype.toString.call(value)}.`
  );
}
function copyUniversalHostPropPrefix(source, names, end) {
  const props = {};
  for (let index = 0; index < end; index++) {
    const name = names[index];
    if (name === "__proto__") defineUniversalProtoProp(props, source[name]);
    else props[name] = source[name];
  }
  for (const symbol of Object.getOwnPropertySymbols(source)) {
    props[symbol] = source[symbol];
  }
  return props;
}
function materializeNode(node, values, renderer, path, output) {
  if (node.kind === "slot") {
    output.push(
      ...materializeValue(values[node.slot], renderer, null, [...path, "slot", node.slot])
    );
    return;
  }
  if (node.kind === "text") {
    const value = node.slot === void 0 ? node.value ?? "" : values[node.slot];
    output.push(...materializeValue(value, renderer, null, [...path, "text"]));
    return;
  }
  if (node.kind === "range") {
    const children2 = [];
    for (let index = 0; index < node.children.length; index++) {
      materializeNode(node.children[index], values, renderer, [...path, "range", index], children2);
    }
    output.push({ kind: "range", key: null, children: children2 });
    return;
  }
  if (node.kind === "component") {
    const component = node.component ?? values[node.componentSlot];
    let props2 = node.propsSlot === void 0 ? universalProps([]) : normalizePropsValue(values[node.propsSlot]);
    if (node.children !== void 0 && node.children.length > 0) {
      const childPlan = universalPlan(renderer, {
        kind: "range",
        children: node.children
      });
      const children2 = universalChildren(renderer, () => universalValue(childPlan, values));
      props2 = universalProps([["spread", props2.props]], children2);
    }
    output.push(
      ...materializeComponentValue(
        universalComponent(
          node.renderer,
          component,
          props2,
          node.keySlot === void 0 ? NO_KEY : values[node.keySlot]
        ),
        renderer,
        [...path, "component"]
      )
    );
    return;
  }
  if (node.kind === "if") {
    const selected = values[node.conditionSlot] ? node.then : node.else;
    if (selected === void 0) return;
    const owner = claimChildOwner(
      CURRENT_OWNER,
      null,
      [...path, "if"],
      values[node.conditionSlot] ? 1 : 0
    );
    const children2 = executeOwner(owner, () => {
      const nodes = [];
      materializeNode(selected, values, renderer, [...path, "if-output"], nodes);
      return nodes;
    });
    output.push(...ownerRange(owner, children2));
    return;
  }
  if (node.kind === "switch") {
    let selected = node.default;
    let selectedKey = "default";
    for (let index = 0; index < node.cases.length; index++) {
      if (node.cases[index][0] === values[node.valueSlot]) {
        selected = node.cases[index][1];
        selectedKey = index;
        break;
      }
    }
    if (selected === void 0) return;
    const owner = claimChildOwner(CURRENT_OWNER, null, [...path, "switch"], selectedKey);
    const children2 = executeOwner(owner, () => {
      const nodes = [];
      materializeNode(selected, values, renderer, [...path, "switch-output"], nodes);
      return nodes;
    });
    output.push(...ownerRange(owner, children2));
    return;
  }
  if (node.type === "#text") {
    const text = currentAttempt().root.textPolicy();
    if (text === "ignore") return;
    if (text === "reject") {
      throw new Error(
        `Universal renderer ${JSON.stringify(renderer)} rejects primitive text children.`
      );
    }
  }
  const attempt = currentAttempt();
  const root = attempt.root;
  const staticProps = root.materializeStaticHostProps(node);
  const sourceProps = staticProps ?? { ...node.props ?? {} };
  if (staticProps === null) {
    for (const [name, slot] of node.bindings ?? []) sourceProps[name] = values[slot];
  }
  let propsValue = null;
  if (node.propsSlot !== void 0) {
    propsValue = normalizePropsValue(values[node.propsSlot]);
    Object.assign(sourceProps, propsValue.props);
  }
  if (isUniversalHostBinding(sourceProps.ref) || isUniversalHostBinding(sourceProps.key) || isUniversalHostBinding(sourceProps.children)) {
    throw new Error("Experimental host bindings require an ordinary host property.");
  }
  const hasKey = staticProps === null && (propsValue?.hasKey || hasOwnProp.call(sourceProps, "key"));
  const hostKey = normalizeUniversalKey(
    propsValue?.hasKey ? propsValue.key : hasKey ? sourceProps.key : null
  );
  const ref = staticProps === null && hasOwnProp.call(sourceProps, "ref") ? sourceProps.ref : null;
  const dynamicChildren = staticProps === null && hasOwnProp.call(sourceProps, "children") ? sourceProps.children : void 0;
  let props = sourceProps;
  let events = null;
  let lifecycles = null;
  let localCallbacks = null;
  let hostBindings = null;
  const names = staticProps === null ? Object.keys(sourceProps) : EMPTY_STATIC_PROP_NAMES;
  for (let index = 0; index < names.length; index++) {
    const name = names[index];
    if (name === "ref" || name === "key" || name === "children") {
      if (props === sourceProps) props = copyUniversalHostPropPrefix(sourceProps, names, index);
      continue;
    }
    const handler = sourceProps[name];
    if (isUniversalHostBinding(handler)) {
      if (root.hasHostBindingUnsupportedConfiguration() || name.startsWith("on")) {
        throw new Error(
          "Experimental host bindings require an ordinary prop on a local direct root."
        );
      }
      markUniversalTreeFeature(UNIVERSAL_TREE_HOST_BINDING);
      (hostBindings ??= /* @__PURE__ */ new Map()).set(name, handler);
      const encoded2 = root.encodeHostProp(node.type, name, handler.getSnapshot());
      if (name === "__proto__") defineUniversalProtoProp(props, encoded2);
      else props[name] = encoded2;
      continue;
    }
    const lifecycle = root.classifyLifecycle(name, handler);
    if (lifecycle !== null) {
      if (props === sourceProps) props = copyUniversalHostPropPrefix(sourceProps, names, index);
      if (handler == null) continue;
      if (typeof handler !== "function") {
        throw new TypeError(
          `Universal lifecycle prop ${JSON.stringify(name)} for renderer ${JSON.stringify(renderer)} must be a function, null, or undefined.`
        );
      }
      (lifecycles ??= /* @__PURE__ */ new Map()).set(lifecycle.type, {
        prop: name,
        type: lifecycle.type,
        handler,
        owner: CURRENT_OWNER.record
      });
      continue;
    }
    const local = root.classifyLocalCallback(name, handler);
    if (local !== null) {
      if (props === sourceProps) props = copyUniversalHostPropPrefix(sourceProps, names, index);
      if (root.driverCapabilities().localHostCallbacks !== true) {
        throw new Error(
          `Universal renderer ${JSON.stringify(renderer)} does not declare the local-host-callback capability.`
        );
      }
      if (handler == null) continue;
      if (typeof handler !== "function") {
        throw new TypeError(
          `Universal local callback prop ${JSON.stringify(name)} for renderer ${JSON.stringify(renderer)} must be a function, null, or undefined.`
        );
      }
      (localCallbacks ??= /* @__PURE__ */ new Map()).set(local.type, {
        prop: name,
        type: local.type,
        handler,
        owner: CURRENT_OWNER.record
      });
      continue;
    }
    const definition = root.classifyEvent(name);
    if (definition !== null) {
      if (props === sourceProps) props = copyUniversalHostPropPrefix(sourceProps, names, index);
      if (handler == null) continue;
      if (typeof handler !== "function") {
        throw new TypeError(
          `Universal event prop ${JSON.stringify(name)} for renderer ${JSON.stringify(renderer)} must be a function, null, or undefined.`
        );
      }
      (events ??= /* @__PURE__ */ new Map()).set(definition.type, {
        prop: name,
        type: definition.type,
        priority: definition.priority ?? "default",
        handler,
        owner: CURRENT_OWNER.record
      });
      continue;
    }
    if (isRendererRegion(handler)) markUniversalTreeFeature(UNIVERSAL_TREE_REGION);
    const encoded = root.encodeHostProp(node.type, name, handler);
    if (name === "__proto__") defineUniversalProtoProp(props, encoded);
    else props[name] = encoded;
  }
  if (props !== sourceProps) Object.setPrototypeOf(props, Object.getPrototypeOf(sourceProps));
  if (events !== null && events.size !== 0) markUniversalTreeFeature(UNIVERSAL_TREE_EVENT);
  if (lifecycles !== null && lifecycles.size !== 0)
    markUniversalTreeFeature(UNIVERSAL_TREE_LIFECYCLE);
  if (localCallbacks !== null && localCallbacks.size !== 0)
    markUniversalTreeFeature(UNIVERSAL_TREE_LOCAL_CALLBACK);
  if (ref != null) markUniversalTreeFeature(UNIVERSAL_TREE_REF);
  if (CURRENT_OWNER.visibility !== "visible") markUniversalTreeFeature(UNIVERSAL_TREE_HIDDEN);
  const children = [];
  if ((node.children?.length ?? 0) > 0) {
    for (let index = 0; index < node.children.length; index++) {
      materializeNode(node.children[index], values, renderer, [...path, "host", index], children);
    }
  } else if (dynamicChildren !== void 0) {
    children.push(...materializeValue(dynamicChildren, renderer, null, [...path, "host-children"]));
  }
  output.push({
    kind: "host",
    key: hostKey,
    type: node.type,
    props,
    ...hostBindings === null ? null : { hostBindings },
    ref,
    owner: CURRENT_OWNER.record,
    events: events ?? EMPTY_BLUEPRINT_EVENTS,
    lifecycles: lifecycles ?? EMPTY_BLUEPRINT_HOST_CALLBACKS,
    localCallbacks: localCallbacks ?? EMPTY_BLUEPRINT_HOST_CALLBACKS,
    visibility: CURRENT_OWNER.visibility,
    children
  });
}
function materializePlanValue(value, expectedRenderer, path = []) {
  if (value.plan.renderer !== expectedRenderer) {
    throw new Error(
      `Universal renderer mismatch: root expects ${JSON.stringify(expectedRenderer)} but the plan targets ${JSON.stringify(value.plan.renderer)}.`
    );
  }
  const collapsed = materializeCollapsedTemplate(value);
  if (collapsed !== null) {
    if (value.key !== null) collapsed.key = value.key;
    return [collapsed];
  }
  const nodes = [];
  materializeNode(value.plan.root, value.values, expectedRenderer, [...path, "plan"], nodes);
  if (currentAttempt().root.driverCapabilities().templateMount === true && value.plan.root.kind === "host" && nodes.length === 1 && nodes[0].kind === "host") {
    nodes[0].templatePlan = value.plan.root;
  }
  if (value.key === null) return nodes;
  if (nodes.length === 1) {
    nodes[0].key = value.key;
    return nodes;
  }
  return [{ kind: "range", key: value.key, children: nodes }];
}
function materializeCollapsedTemplate(value) {
  const owner = CURRENT_OWNER;
  const root = currentAttempt().root;
  const capabilities = root.driverCapabilities();
  if (capabilities.templateMount !== true || capabilities.collapsedTemplateMount !== true || owner.visibility !== "visible" || value.plan.root.kind !== "host") {
    return null;
  }
  const program = compiledCollapsedTemplateProgram(value.plan.root);
  if (program === null) return null;
  const prepared = root.prepareCollapsedTemplateProgram(program);
  if (prepared !== null) {
    const fast = materializePreparedCollapsedTemplate(value, owner, root, program, prepared);
    if (fast !== null) return fast;
  }
  for (const node of program.plans) {
    if (node.kind === "slot" || node.kind === "text" && node.slot !== void 0) {
      const entry = value.values[node.slot];
      if (typeof entry !== "string" && typeof entry !== "number" && typeof entry !== "bigint" || root.textPolicy() !== "host") {
        return null;
      }
    } else if (node.kind === "text" && root.textPolicy() !== "host") {
      return null;
    }
  }
  const nodes = new Array(program.plans.length);
  for (let index = 0; index < program.plans.length; index++) {
    const node = program.plans[index];
    if (node.kind === "slot" || node.kind === "text") {
      const text = node.kind === "slot" ? value.values[node.slot] : node.slot === void 0 ? node.value ?? "" : value.values[node.slot];
      nodes[index] = { props: { value: String(text) } };
      continue;
    }
    const staticProps = root.materializeStaticHostProps(node);
    if (staticProps === null && (node.bindings?.length ?? 0) === 0) return null;
    if (staticProps !== null) {
      nodes[index] = { props: staticProps };
      continue;
    }
    const sourceProps = { ...node.props ?? EMPTY_STATIC_HOST_PROPS };
    for (const [name, slot] of node.bindings ?? []) sourceProps[name] = value.values[slot];
    let props = sourceProps;
    let events;
    const names = Object.keys(sourceProps);
    for (let propIndex = 0; propIndex < names.length; propIndex++) {
      const name = names[propIndex];
      const current = sourceProps[name];
      if (isUniversalHostBinding(current) || root.classifyLifecycle(name, current) !== null || root.classifyLocalCallback(name, current) !== null || isRendererRegion(current)) {
        return null;
      }
      const definition = root.classifyEvent(name);
      if (definition !== null) {
        if (props === sourceProps)
          props = copyUniversalHostPropPrefix(sourceProps, names, propIndex);
        if (current == null) continue;
        if (typeof current !== "function") return null;
        (events ??= []).push({
          prop: name,
          type: definition.type,
          priority: definition.priority ?? "default",
          handler: current,
          owner: owner.record
        });
        continue;
      }
      const encoded = root.encodeHostProp(node.type, name, current);
      if (name === "__proto__") defineUniversalProtoProp(props, encoded);
      else props[name] = encoded;
    }
    if (props !== sourceProps) Object.setPrototypeOf(props, Object.getPrototypeOf(sourceProps));
    if (events !== void 0) markUniversalTreeFeature(UNIVERSAL_TREE_EVENT);
    nodes[index] = events === void 0 ? { props } : { props, events };
  }
  const first = nodes[0];
  return {
    kind: "host",
    key: null,
    type: value.plan.root.type,
    props: first.props,
    ref: null,
    owner: owner.record,
    events: first.events === void 0 ? EMPTY_BLUEPRINT_EVENTS : new Map(first.events.map((event) => [event.type, event])),
    lifecycles: EMPTY_BLUEPRINT_HOST_CALLBACKS,
    localCallbacks: EMPTY_BLUEPRINT_HOST_CALLBACKS,
    visibility: "visible",
    children: [],
    templatePlan: value.plan.root,
    collapsedTemplate: { program, nodes, ids: null }
  };
}
function materializePreparedCollapsedTemplate(value, owner, root, program, prepared) {
  const values = prepareCollapsedTemplateValues(value, root, program, prepared);
  if (values === null) return null;
  if (prepared.events.length !== 0) markUniversalTreeFeature(UNIVERSAL_TREE_EVENT);
  return preparedCollapsedTemplateBlueprint(
    value.plan,
    program,
    prepared,
    values,
    value.values,
    owner.record
  );
}
function prepareCollapsedTemplateValues(value, root, program, prepared) {
  for (const site of prepared.events) {
    if (typeof value.values[site.slot] !== "function") return null;
  }
  const values = new Array(prepared.values.length);
  for (let index = 0; index < prepared.values.length; index++) {
    const binding = prepared.values[index];
    const source = value.values[binding.slot];
    if (isUniversalHostBinding(source)) return null;
    if (binding.text) {
      if (typeof source !== "string" && typeof source !== "number" && typeof source !== "bigint") {
        return null;
      }
      values[index] = String(source);
      continue;
    }
    if (!isUniversalHostTemplateProgramValue(source) || root.classifyLifecycle(binding.name, source) !== null || root.classifyLocalCallback(binding.name, source) !== null) {
      return null;
    }
    const encoded = root.encodeHostProp(program.shape[binding.node].type, binding.name, source);
    if (!isUniversalHostTemplateProgramValue(encoded)) return null;
    values[index] = encoded;
  }
  return Object.freeze(values);
}
function preparedCollapsedTemplateBlueprint(plan, program, prepared, values, captures, owner) {
  const props = materializePreparedCollapsedHostProps(prepared, values, 0);
  return {
    kind: "host",
    key: null,
    type: plan.root.kind === "host" ? plan.root.type : "",
    props,
    ref: null,
    owner,
    events: EMPTY_BLUEPRINT_EVENTS,
    lifecycles: EMPTY_BLUEPRINT_HOST_CALLBACKS,
    localCallbacks: EMPTY_BLUEPRINT_HOST_CALLBACKS,
    visibility: "visible",
    children: [],
    templatePlan: plan.root,
    collapsedTemplate: {
      program,
      nodes: null,
      prepared,
      values,
      captures,
      owner,
      ids: null
    }
  };
}
function materializePreparedCollapsedHostProps(program, values, index) {
  const node = program.wire.nodes[index];
  if (node.bindings === void 0) return node.props;
  const props = { ...node.props };
  for (const binding of node.bindings) props[binding.name] = values[binding.valueIndex];
  return Object.freeze(props);
}
function materializeCollapsedBlueprintNode(collapsed, index, owner) {
  if (collapsed.nodes !== null) return collapsed.nodes[index];
  const program = collapsed.prepared;
  const props = materializePreparedCollapsedHostProps(program, collapsed.values, index);
  let events;
  for (const site of program.events) {
    if (site.node !== index) continue;
    (events ??= []).push({
      prop: site.prop,
      type: site.type,
      priority: site.priority,
      handler: collapsed.captures[site.slot],
      owner
    });
  }
  return events === void 0 ? { props } : { props, events };
}
function materializeCommittedCollapsedNode(state, index) {
  if (state.nodes !== null) return state.nodes[index];
  return {
    id: state.firstId + index,
    props: materializePreparedCollapsedHostProps(state.prepared, state.values, index)
  };
}
function sameRecordShape(record, blueprint) {
  return record.kind === blueprint.kind && Object.is(record.key, blueprint.key) && (record.kind !== "host" || record.type === blueprint.type);
}
function createLogicalRecord(id, blueprint) {
  return {
    id,
    kind: blueprint.kind,
    key: blueprint.key,
    type: blueprint.kind === "host" ? blueprint.type : null,
    props: EMPTY_STATIC_HOST_PROPS,
    ref: null,
    refCleanup: null,
    refAttached: false,
    owner: null,
    events: EMPTY_COMMITTED_EVENTS,
    lifecycles: EMPTY_COMMITTED_HOST_CALLBACKS,
    localCallbacks: EMPTY_COMMITTED_HOST_CALLBACKS,
    visibility: blueprint.kind === "host" ? blueprint.visibility : "visible",
    portalRegistration: null,
    parent: null,
    children: [],
    treeFeatures: null
  };
}
function hasCrossRealmPlainPrototype(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function sameUniversalHostPropValue(left, right, depth = 2) {
  if (Object.is(left, right)) return true;
  if (depth === 0) return false;
  if (typeof left !== "object" || typeof right !== "object" || left === null || right === null) {
    return false;
  }
  if (Array.isArray(left)) {
    if (!Array.isArray(right) || left.length !== right.length) return false;
    for (let index = 0; index < left.length; index++) {
      if (!sameUniversalHostPropValue(left[index], right[index], depth - 1)) return false;
    }
    return true;
  }
  if (Array.isArray(right)) return false;
  if (!hasCrossRealmPlainPrototype(left) || !hasCrossRealmPlainPrototype(right)) return false;
  if (Object.getOwnPropertySymbols(left).length !== 0 || Object.getOwnPropertySymbols(right).length !== 0) {
    return false;
  }
  let leftCount = 0;
  for (const key in left) {
    if (!hasOwnProp.call(left, key)) continue;
    leftCount++;
    if (!hasOwnProp.call(right, key)) return false;
    if (!sameUniversalHostPropValue(
      left[key],
      right[key],
      depth - 1
    )) {
      return false;
    }
  }
  let rightCount = 0;
  for (const key in right) {
    if (hasOwnProp.call(right, key)) rightCount++;
  }
  return leftCount === rightCount;
}
function shallowPropsEqual(left, right, rightCountHint = -1) {
  if (left === right) return true;
  let leftCount = 0;
  for (const key in left) {
    if (!hasOwnProp.call(left, key)) continue;
    leftCount++;
    if (!hasOwnProp.call(right, key) || !sameUniversalHostPropValue(left[key], right[key])) {
      return false;
    }
  }
  if (rightCountHint >= 0) return leftCount === rightCountHint;
  let rightCount = 0;
  for (const key in right) {
    if (hasOwnProp.call(right, key)) rightCount++;
  }
  return leftCount === rightCount;
}
function collapsedTemplateRootPropsEqual(previous, next) {
  if (previous?.prepared === void 0 || previous.prepared !== next?.prepared || previous.values === void 0 || next.values === void 0) {
    return null;
  }
  for (let index = 0; index < previous.prepared.values.length; index++) {
    if (previous.prepared.values[index].node !== 0) break;
    if (!Object.is(previous.values[index], next.values[index])) return false;
  }
  return true;
}
function physicalRecords(records) {
  const output = [];
  for (const record of records) {
    if (record.kind === "host") output.push(record);
    else if (record.kind === "range") output.push(...physicalRecords(record.children));
  }
  return output;
}
function physicalDrafts(drafts) {
  const output = [];
  for (const draft of drafts) {
    if (draft.record.kind === "host") output.push(draft.record);
    else if (draft.retained === true) output.push(...physicalRecords(draft.record.children));
    else if (draft.record.kind === "range") output.push(...physicalDrafts(draft.children));
  }
  return output;
}
function stableUniversalPlacementPositions(sources) {
  const predecessors = new Int32Array(sources.length);
  const tails = new Int32Array(sources.length);
  let size = 0;
  for (let index2 = 0; index2 < sources.length; index2++) {
    const source = sources[index2];
    if (source === -1) continue;
    let low = 0;
    let high = size;
    while (low < high) {
      const middle = low + high >> 1;
      if (sources[tails[middle]] < source) low = middle + 1;
      else high = middle;
    }
    predecessors[index2] = low === 0 ? -1 : tails[low - 1];
    tails[low] = index2;
    if (low === size) size++;
  }
  const stable = new Uint8Array(sources.length);
  let index = size === 0 ? -1 : tails[size - 1];
  while (index !== -1) {
    stable[index] = 1;
    index = predecessors[index];
  }
  return stable;
}
const UNIVERSAL_HOST_TEMPLATE_SHAPES = /* @__PURE__ */ new WeakMap();
function universalHostTemplateShape(plan) {
  const cached = UNIVERSAL_HOST_TEMPLATE_SHAPES.get(plan);
  if (cached !== void 0) return cached;
  const output = [];
  const visit = (node, parent) => {
    if (node.kind === "range") {
      for (const child of node.children) if (!visit(child, parent)) return false;
      return true;
    }
    if (node.kind === "text" || node.kind === "slot") {
      output.push(Object.freeze({ type: "#text", parent }));
      return true;
    }
    if (node.kind !== "host") return false;
    if (node.type === "list" || node.type === "list-item") return false;
    const index = output.length;
    output.push(Object.freeze({ type: node.type, parent }));
    for (const child of node.children ?? []) if (!visit(child, index)) return false;
    return true;
  };
  const shape = visit(plan, -1) && output.length > 1 ? Object.freeze(output) : null;
  UNIVERSAL_HOST_TEMPLATE_SHAPES.set(plan, shape);
  return shape;
}
const COMPILED_COLLAPSED_TEMPLATE_PROGRAMS = /* @__PURE__ */ new WeakMap();
function compiledCollapsedTemplateProgram(plan) {
  const cached = COMPILED_COLLAPSED_TEMPLATE_PROGRAMS.get(plan);
  if (cached !== void 0) return cached;
  const shape = universalHostTemplateShape(plan);
  if (shape === null) {
    COMPILED_COLLAPSED_TEMPLATE_PROGRAMS.set(plan, null);
    return null;
  }
  const plans = [];
  const visit = (node) => {
    if (node.kind === "slot" || node.kind === "text") {
      plans.push(node);
      return true;
    }
    if (node.kind !== "host" || node.propsSlot !== void 0) return false;
    for (const name of Object.keys(node.props ?? EMPTY_STATIC_HOST_PROPS)) {
      if (name === "ref" || name === "key" || name === "children" || name.startsWith("main-thread:")) {
        return false;
      }
    }
    for (const [name] of node.bindings ?? []) {
      if (name === "ref" || name === "key" || name === "children" || name.startsWith("main-thread:")) {
        return false;
      }
    }
    plans.push(node);
    for (const child of node.children ?? []) if (!visit(child)) return false;
    return true;
  };
  const program = visit(plan) && plans.length === shape.length ? Object.freeze({ shape, plans: Object.freeze(plans) }) : null;
  COMPILED_COLLAPSED_TEMPLATE_PROGRAMS.set(plan, program);
  return program;
}
function collectUniversalHostTemplateDrafts(root, shape) {
  const output = [];
  const visit = (draft, parent) => {
    if (draft.retained === true) return false;
    if (draft.record.kind === "range") {
      if (draft.blueprint.owner !== void 0) return false;
      for (const child of draft.children) if (!visit(child, parent)) return false;
      return true;
    }
    if (draft.record.kind !== "host" || !draft.isNew) return false;
    const host = draft.blueprint;
    const index = output.length;
    const expected = shape[index];
    if (expected === void 0 || expected.type !== host.type || expected.parent !== parent || host.type === "list" || host.type === "list-item" || host.ref != null || host.visibility !== "visible" || host.lifecycles.size !== 0 || host.localCallbacks.size !== 0) {
      return false;
    }
    for (const name of Object.keys(host.props)) {
      if (name.startsWith("main-thread:")) return false;
    }
    output.push(draft);
    for (const child of draft.children) if (!visit(child, index)) return false;
    return true;
  };
  return visit(root, -1) && output.length === shape.length ? output : null;
}
function expandCollapsedTemplateBlueprint(host) {
  const collapsed = host.collapsedTemplate;
  if (collapsed === void 0) return;
  const blueprints = [host];
  for (let index = 1; index < collapsed.program.shape.length; index++) {
    const node = materializeCollapsedBlueprintNode(collapsed, index, host.owner);
    const blueprint = {
      kind: "host",
      key: null,
      type: collapsed.program.shape[index].type,
      props: node.props,
      ref: null,
      owner: host.owner,
      events: node.events === void 0 ? EMPTY_BLUEPRINT_EVENTS : new Map(node.events.map((event) => [event.type, event])),
      lifecycles: EMPTY_BLUEPRINT_HOST_CALLBACKS,
      localCallbacks: EMPTY_BLUEPRINT_HOST_CALLBACKS,
      visibility: host.visibility,
      children: []
    };
    blueprints.push(blueprint);
    blueprints[collapsed.program.shape[index].parent].children.push(blueprint);
  }
  delete host.collapsedTemplate;
}
function walkLogical(record, visit) {
  visit(record);
  for (const child of record.children) walkLogical(child, visit);
}
function walkDraft(record, visit) {
  visit(record);
  for (const child of record.children) walkDraft(child, visit);
}
function walkDraftPostOrder(record, visit) {
  for (const child of record.children) walkDraftPostOrder(child, visit);
  visit(record);
}
function invalidateLogicalTreeFeatures(record) {
  let current = record;
  while (current !== null && current.treeFeatures !== null) {
    current.treeFeatures = null;
    current = current.parent;
  }
}
function logicalTreeFeatures(record) {
  if (record.treeFeatures !== null) return record.treeFeatures;
  let features = 0;
  if (record.kind === "portal") features |= UNIVERSAL_TREE_PORTAL;
  else if (record.kind === "host") {
    if (record.events.size !== 0 || (record.collapsedTemplate?.events.length ?? 0) !== 0) {
      features |= UNIVERSAL_TREE_EVENT;
    }
    if (record.lifecycles.size !== 0) features |= UNIVERSAL_TREE_LIFECYCLE;
    if (record.localCallbacks.size !== 0) features |= UNIVERSAL_TREE_LOCAL_CALLBACK;
    if (record.ref != null) features |= UNIVERSAL_TREE_REF;
    if (record.visibility !== "visible") features |= UNIVERSAL_TREE_HIDDEN;
    for (const name of Object.keys(record.props)) {
      if (isRendererRegion(record.props[name])) {
        features |= UNIVERSAL_TREE_REGION;
        break;
      }
    }
  }
  for (const child of record.children) features |= logicalTreeFeatures(child);
  return record.treeFeatures = features;
}
function ownerTreeHasWarmPlan(owner) {
  if (owner.component?.__warm !== void 0) return true;
  for (const child of owner.children) {
    if (ownerTreeHasWarmPlan(child)) return true;
  }
  return false;
}
function commonOwnerAncestor(left, right) {
  let leftDepth = 0;
  for (let current = left.parent; current !== null; current = current.parent) leftDepth++;
  let rightDepth = 0;
  for (let current = right.parent; current !== null; current = current.parent) rightDepth++;
  let a = left;
  let b = right;
  for (; leftDepth > rightDepth; leftDepth--) a = a.parent;
  for (; rightDepth > leftDepth; rightDepth--) b = b.parent;
  while (a !== null && a !== b) {
    a = a.parent;
    b = b.parent;
  }
  return a;
}
function stableLogicalChildren(records, blueprints) {
  if (records.length !== blueprints.length) return false;
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    const blueprint = blueprints[index];
    if (blueprint.kind === "range" && blueprint.retained !== void 0) {
      if (blueprint.retained === record) continue;
      return false;
    }
    if (blueprint.kind === "range" && blueprint.compactLeafList !== void 0 || !sameRecordShape(record, blueprint) || !stableLogicalChildren(record.children, blueprint.children)) {
      return false;
    }
  }
  return true;
}
function collectRemovedPostOrder(record, output) {
  for (const child of record.children) collectRemovedPostOrder(child, output);
  if (record.kind === "host") output.push(record);
}
function detachRef(record, ref = record.ref, refCleanup = record.refCleanup) {
  if (ref == null || !record.refAttached) return;
  record.refAttached = false;
  if (refCleanup !== null) {
    if (record.refCleanup === refCleanup) record.refCleanup = null;
    refCleanup();
    return;
  }
  const tasks = [];
  const collect = (value) => {
    if (Array.isArray(value)) {
      for (const nested of value) collect(nested);
    } else if (typeof value === "function") {
      tasks.push(() => value(null));
    } else if (value !== null && typeof value === "object") {
      tasks.push(() => {
        value.current = null;
      });
    }
  };
  collect(ref);
  runCommitTasks(tasks);
}
function attachRef(record, value) {
  const ref = record.ref;
  if (ref == null) return;
  record.refAttached = true;
  const cleanupTasks = [];
  const attachTasks = [];
  const collect = (target) => {
    if (Array.isArray(target)) {
      for (const nested of target) collect(nested);
    } else if (typeof target === "function") {
      attachTasks.push(() => {
        const cleanupIndex = cleanupTasks.length;
        cleanupTasks.push(() => target(null));
        const cleanup = target(value);
        if (typeof cleanup === "function") cleanupTasks[cleanupIndex] = cleanup;
      });
    } else if (target !== null && typeof target === "object") {
      attachTasks.push(() => {
        target.current = value;
        cleanupTasks.push(() => {
          target.current = null;
        });
      });
    }
  };
  collect(ref);
  record.refCleanup = () => runCommitTasks(cleanupTasks);
  runCommitTasks(attachTasks);
}
function runCommitTasks(tasks) {
  let hasError = false;
  let firstError;
  UNIVERSAL_COMMIT_TASK_DEPTH++;
  try {
    for (const task of tasks) {
      try {
        task();
      } catch (error) {
        if (!hasError) {
          hasError = true;
          firstError = error;
        }
      }
    }
  } finally {
    UNIVERSAL_COMMIT_TASK_DEPTH--;
  }
  if (hasError) throw firstError;
}
function depsEqual(left, right) {
  if (left === null || right === null || left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    if (!Object.is(left[index], right[index])) return false;
  }
  return true;
}
function suspendedOwnerPathEqual(left, right) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    const leftSegment = left[index];
    const rightSegment = right[index];
    if (leftSegment.component !== rightSegment.component || !Object.is(leftSegment.key, rightSegment.key) || leftSegment.ordinal !== rightSegment.ordinal || !identityPathEqual(leftSegment.identityPath, rightSegment.identityPath)) {
      return false;
    }
  }
  return true;
}
function isThenable(value) {
  return value !== null && typeof value === "object" && typeof value.then === "function" || typeof value === "function" && typeof value.then === "function";
}
function findSuspendedMemo(owner, slot, deps) {
  if (deps === null) return null;
  for (const entry of currentAttempt().replayEntries) {
    if (Object.is(entry.slot, slot) && depsEqual(entry.deps, deps) && suspendedOwnerPathEqual(entry.ownerPath, ownerReplayPath(owner))) {
      return entry;
    }
  }
  return null;
}
function collectSuspendedMemos(attempt) {
  const entries = [];
  for (let ownerIndex = attempt.owners.length - 1; ownerIndex >= 0; ownerIndex--) {
    const owner = attempt.owners[ownerIndex];
    for (const [slot, hook] of owner.hooks) {
      if (hook.kind !== "memo" || hook.deps === null || !isThenable(hook.value) || owner.record.hooks.get(slot) === hook) {
        continue;
      }
      if (entries.some(
        (entry) => Object.is(entry.slot, slot) && suspendedOwnerPathEqual(entry.ownerPath, ownerReplayPath(owner))
      )) {
        continue;
      }
      entries.push({
        ownerPath: ownerReplayPath(owner),
        slot,
        deps: hook.deps,
        value: hook.value
      });
    }
  }
  return entries;
}
function currentAttempt() {
  if (CURRENT_ATTEMPT === null) {
    throw new Error("Universal hooks may only run while a universal component is rendering.");
  }
  return CURRENT_ATTEMPT;
}
function markUniversalTreeFeature(feature) {
  currentAttempt().treeFeatures |= feature;
}
function resolveHookSlot(slot) {
  currentAttempt();
  const owner = activateLazyLeafOwner();
  if (owner === null) {
    throw new Error("Universal hooks require an active component owner.");
  }
  const own = slot ?? `implicit:${owner.implicitSlot++}`;
  const depth = UNIVERSAL_SLOT_STACK.length;
  if (depth === 0) return own;
  return resolveHookPath(UNIVERSAL_SLOT_STACK, own, true);
}
function hookSlots(count) {
  const base = NEXT_HOOK_SLOT;
  NEXT_HOOK_SLOT += count;
  return base;
}
let MANUAL_HOOK_DRIVER = null;
function invokeManualHook(fn, receiver, args) {
  const driver = MANUAL_HOOK_DRIVER ??= {
    pending: UNIVERSAL_SLOT_STACK[UNIVERSAL_SLOT_STACK.length - 1],
    active: false
  };
  const pending = driver.pending;
  const active = driver.active;
  driver.pending = void 0;
  driver.active = true;
  try {
    if (pending === void 0) return Reflect.apply(fn, receiver, args);
    switch (args.length) {
      case 0:
        return fn.call(receiver, pending);
      case 1:
        return fn.call(receiver, args[0], pending);
      case 2:
        return fn.call(receiver, args[0], args[1], pending);
      case 3:
        return fn.call(receiver, args[0], args[1], args[2], pending);
      case 4:
        return fn.call(receiver, args[0], args[1], args[2], args[3], pending);
      default: {
        const forwarded = new Array(args.length + 1);
        for (let index = 0; index < args.length; index++) forwarded[index] = args[index];
        forwarded[args.length] = pending;
        return fn.apply(receiver, forwarded);
      }
    }
  } finally {
    driver.pending = pending;
    driver.active = active;
  }
}
function manualHook(fn, name) {
  function provider() {
    return invokeManualHook(fn, this, arguments);
  }
  Object.defineProperty(provider, "name", { value: name ?? fn.name, configurable: true });
  Object.defineProperty(provider, "length", { value: fn.length, configurable: true });
  return provider;
}
function withSlot(sym, fn, ...args) {
  const driver = MANUAL_HOOK_DRIVER;
  const pending = driver?.pending;
  const active = driver?.active ?? false;
  if (driver !== null) {
    driver.pending = sym;
    driver.active = false;
  }
  UNIVERSAL_SLOT_STACK.push(sym);
  try {
    return fn(...args);
  } finally {
    UNIVERSAL_SLOT_STACK.pop();
    if (MANUAL_HOOK_DRIVER !== null) {
      MANUAL_HOOK_DRIVER.pending = driver === null ? UNIVERSAL_SLOT_STACK[UNIVERSAL_SLOT_STACK.length - 1] : pending;
      MANUAL_HOOK_DRIVER.active = active;
    }
  }
}
function createUniversalTransitionBatch() {
  const batch = {
    updates: /* @__PURE__ */ new Map(),
    roots: /* @__PURE__ */ new Set(),
    pendingActions: 0,
    pendingSignals: 0,
    closed: false,
    promotionScheduled: false,
    promoted: false,
    settled: false,
    optimisticReverts: null
  };
  return batch;
}
function tickUniversalTransitionCount(delta) {
  UNIVERSAL_TRANSITION_PENDING_COUNT += delta;
  if (UNIVERSAL_TRANSITION_PENDING_COUNT < 0) UNIVERSAL_TRANSITION_PENDING_COUNT = 0;
  UNIVERSAL_DISCRETE_EVENT_DEPTH++;
  try {
    for (const listener of [...UNIVERSAL_TRANSITION_LISTENERS]) listener();
  } finally {
    UNIVERSAL_DISCRETE_EVENT_DEPTH--;
  }
}
function settleUniversalTransitionBatch(batch) {
  if (batch.settled) return;
  batch.settled = true;
  if (ACTIVE_UNIVERSAL_TRANSITION_BATCH === batch) ACTIVE_UNIVERSAL_TRANSITION_BATCH = null;
  if (IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH === batch) {
    IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH = null;
  }
  tickUniversalTransitionCount(-batch.pendingSignals);
  const reverts = batch.optimisticReverts;
  if (reverts !== null) {
    batch.optimisticReverts = null;
    for (const revert of reverts) revert();
  }
}
function finishUniversalTransitionRoot(batch, root) {
  if (batch.settled) return;
  const rehomePromotion = !batch.promoted && batch.promotionScheduled;
  root.discardTransitionBatch(batch);
  batch.roots.delete(root);
  if (batch.closed && batch.pendingActions === 0 && batch.roots.size === 0) {
    settleUniversalTransitionBatch(batch);
  } else if (rehomePromotion) {
    batch.promotionScheduled = false;
    queueUniversalTransitionPromotion(batch);
  }
}
function promoteUniversalTransitionBatch(batch) {
  if (batch.promoted || batch.settled || !batch.closed || batch.pendingActions !== 0) return;
  batch.promoted = true;
  const scheduledRoots = /* @__PURE__ */ new Set();
  for (const [owner, bySlot] of batch.updates) {
    if (owner.disposed) continue;
    let hasUpdates = false;
    for (const slot of bySlot.keys()) {
      const queue = owner.updates.get(slot);
      if (queue?.batches?.some((queuedBatch) => queuedBatch === batch)) {
        hasUpdates = true;
        break;
      }
    }
    if (!hasUpdates) continue;
    if (!scheduledRoots.has(owner.root)) {
      scheduledRoots.add(owner.root);
      owner.root.scheduleTransition(batch);
    }
  }
  batch.updates.clear();
  for (const root of [...batch.roots]) {
    if (!scheduledRoots.has(root)) finishUniversalTransitionRoot(batch, root);
  }
  if (batch.roots.size === 0) settleUniversalTransitionBatch(batch);
}
function queueUniversalTransitionPromotion(batch) {
  if (batch.promotionScheduled || batch.promoted || batch.settled || !batch.closed || batch.pendingActions !== 0) {
    return;
  }
  batch.promotionScheduled = true;
  const firstOwner = batch.updates.keys().next().value;
  const promote = () => {
    batch.promotionScheduled = false;
    promoteUniversalTransitionBatch(batch);
  };
  if (firstOwner !== void 0 && !firstOwner.disposed) {
    firstOwner.root.__scheduleMicrotask(promote);
    return;
  }
  const scheduler = readGlobalMicrotaskScheduler();
  if (scheduler !== void 0) scheduler.call(globalThis, promote);
  else void Promise.resolve().then(promote);
}
function universalTransitionBatchForUpdate() {
  if (UNIVERSAL_TRANSITION_DEPTH > 0) return ACTIVE_UNIVERSAL_TRANSITION_BATCH;
  if (UNIVERSAL_DISCRETE_EVENT_DEPTH > 0) return null;
  if (UNIVERSAL_ASYNC_TRANSITION_COUNT > 0) return IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH;
  return null;
}
function stageUniversalTransitionUpdate(batch, owner, slot, kind, value) {
  enqueueUniversalHookUpdate(owner, slot, kind, value, batch);
  batch.roots.add(owner.root);
  let bySlot = batch.updates.get(owner);
  if (bySlot === void 0) {
    bySlot = /* @__PURE__ */ new Map();
    batch.updates.set(owner, bySlot);
  }
  let update = bySlot.get(slot);
  if (update === void 0) {
    update = { kind };
    bySlot.set(slot, update);
  } else if (update.kind !== kind) {
    throw new Error("A universal transition cannot stage incompatible hook updates.");
  }
}
function enqueueUniversalHookUpdate(owner, slot, kind, value, batch) {
  let queue = owner.updates.get(slot);
  if (queue === void 0) {
    const hook = owner.hooks.get(slot);
    if (hook?.kind !== kind) {
      throw new Error(`Cannot queue a universal ${kind} update for an inactive hook.`);
    }
    queue = [];
    owner.updates.set(slot, queue);
    if (batch !== null) {
      queue.kind = kind;
      queue.baseState = hook.value;
      queue.batches = [];
    }
  } else if (queue.kind !== void 0 && queue.kind !== kind) {
    throw new Error("A universal hook cannot queue incompatible update kinds.");
  }
  if (batch !== null && queue.batches === void 0) {
    const hook = owner.hooks.get(slot);
    if (hook?.kind !== kind) {
      throw new Error(`Cannot queue a universal ${kind} update for an inactive hook.`);
    }
    queue.kind = kind;
    queue.baseState = hook.value;
    queue.batches = new Array(queue.length).fill(null);
  }
  queue.push(value);
  queue.batches?.push(batch);
  queue.rebases?.push(false);
}
function scheduleOwner(owner, slot) {
  if (owner.disposed) return;
  if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
    __profileSchedule(
      owner,
      "state",
      typeof slot === "symbol" || typeof slot === "number" ? slot : void 0
    );
  }
  owner.root.scheduleOwned(owner);
}
function currentDraftOwner() {
  currentAttempt();
  const owner = activateLazyLeafOwner();
  if (owner === null) {
    throw new Error("Universal hooks require an active component owner.");
  }
  return owner;
}
function findDraftOwner(record) {
  const attempt = CURRENT_ATTEMPT;
  if (attempt === null) return null;
  const owners = attempt.owners;
  const last = owners[owners.length - 1];
  if (last !== void 0 && last.record === record) return last;
  let lookup = attempt.draftLookup;
  if (lookup === null) {
    lookup = { indexed: 0, byRecord: /* @__PURE__ */ new Map() };
    attempt.draftLookup = lookup;
  }
  for (let index = lookup.indexed; index < owners.length; index++) {
    const owner = owners[index];
    lookup.byRecord.set(owner.record, owner);
  }
  lookup.indexed = owners.length;
  return lookup.byRecord.get(record) ?? null;
}
function applyUniversalHookUpdateQueue(owner, slot, kind, fallback, apply) {
  const queue = owner.record.updates.get(slot);
  if (queue === void 0) return fallback;
  if (queue.kind !== void 0 && queue.kind !== kind) {
    throw new Error("A universal hook encountered an incompatible queued update kind.");
  }
  const consumed = queue.length;
  const batches = queue.batches;
  let value = batches === void 0 ? fallback : queue.baseState;
  if (batches === void 0) {
    for (let index = 0; index < consumed; index++) value = apply(value, queue[index]);
    owner.appliedUpdates.set(slot, {
      lane: false,
      queue,
      consumed,
      baseState: value
    });
    return value;
  }
  let baseState = value;
  let skipped = false;
  const remainingValues = [];
  const remainingBatches = [];
  const remainingRebases = [];
  const attempt = currentAttempt();
  for (let index = 0; index < consumed; index++) {
    const update = queue[index];
    const batch = batches[index];
    const included = batch === null || attempt.transitionRender && attempt.transitionBatches.has(batch);
    if (!included) {
      if (!skipped) {
        skipped = true;
        baseState = value;
      }
      remainingValues.push(update);
      remainingBatches.push(batch);
      remainingRebases.push(queue.rebases?.[index] ?? false);
      continue;
    }
    value = apply(value, update);
    if (skipped) {
      remainingValues.push(update);
      remainingBatches.push(null);
      remainingRebases.push(true);
    }
  }
  owner.appliedUpdates.set(slot, {
    lane: true,
    queue,
    consumed,
    baseState: skipped ? baseState : value,
    remainingValues,
    remainingBatches,
    remainingRebases
  });
  return value;
}
function hasUniversalUpdatesForAttempt(owner) {
  if (owner.updates.size === 0) return false;
  const attempt = currentAttempt();
  for (const queue of owner.updates.values()) {
    const batches = queue.batches;
    if (batches === void 0) {
      if (queue.length !== 0) return true;
      continue;
    }
    for (const batch of batches) {
      if (batch === null || attempt.transitionRender && attempt.transitionBatches.has(batch)) {
        return true;
      }
    }
  }
  return false;
}
function cloneStateHook(owner, slot) {
  let hook = owner.hooks.get(slot);
  if (hook?.kind !== "state") return void 0;
  if (!owner.clonedHooks.has(slot)) {
    hook = { ...hook };
    owner.hooks.set(slot, hook);
    owner.clonedHooks.add(slot);
    hook.value = applyUniversalHookUpdateQueue(
      owner,
      slot,
      "state",
      hook.value,
      (value, update) => typeof update === "function" ? update(value) : update
    );
  }
  return hook;
}
function projectedStateValue(record, slot, fallback) {
  const draft = findDraftOwner(record);
  const draftHook = draft?.hooks.get(slot);
  if (draftHook?.kind === "state") return draftHook.value;
  const hook = record.hooks.get(slot);
  const queue = record.updates.get(slot);
  if (queue === void 0) return hook?.kind === "state" ? hook.value : fallback;
  if (queue.length !== 0) {
    const last = queue[queue.length - 1];
    if (typeof last !== "function") return last;
  }
  let value = queue.batches === void 0 ? hook?.kind === "state" ? hook.value : fallback : queue.baseState;
  for (const update of queue) {
    value = typeof update === "function" ? update(value) : update;
  }
  return value;
}
function visibleStateValue(record, slot, fallback) {
  const draft = findDraftOwner(record);
  const draftHook = draft?.hooks.get(slot);
  if (draftHook?.kind === "state") return draftHook.value;
  const hook = record.hooks.get(slot);
  const queue = record.updates.get(slot);
  if (queue === void 0) return hook?.kind === "state" ? hook.value : fallback;
  let last = queue.length - 1;
  while (last >= 0 && queue.batches !== void 0 && queue.batches[last] !== null) last--;
  if (last >= 0 && typeof queue[last] !== "function") return queue[last];
  let value = queue.batches === void 0 ? hook?.kind === "state" ? hook.value : fallback : queue.baseState;
  for (let index = 0; index <= last; index++) {
    if (queue.batches !== void 0 && queue.batches[index] !== null) continue;
    const update = queue[index];
    value = typeof update === "function" ? update(value) : update;
  }
  return value;
}
function useState(initial, slot) {
  if (slot === void 0 && typeof initial === "symbol" && arguments.length === 1 && MANUAL_HOOK_DRIVER?.active === true) {
    slot = initial;
    initial = void 0;
  }
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  let hook = cloneStateHook(owner, resolved);
  if (hook?.kind !== "state") {
    const record = owner.record;
    const initialValue = typeof initial === "function" ? initial() : initial;
    hook = {
      kind: "state",
      value: initialValue,
      set(value) {
        if (record.disposed) return;
        const draft = findDraftOwner(record);
        if (draft !== null) {
          const live = cloneStateHook(draft, resolved);
          if (live === void 0) return;
          const next2 = typeof value === "function" ? value(live.value) : value;
          if (Object.is(next2, live.value)) return;
          live.value = next2;
          draft.needsRender = true;
          return;
        }
        const transition = universalTransitionBatchForUpdate();
        const previous = transition === null ? visibleStateValue(record, resolved, initialValue) : projectedStateValue(record, resolved, initialValue);
        const next = typeof value === "function" ? value(previous) : value;
        const queue = record.updates.get(resolved);
        const needsUrgentRebase = transition === null && queue?.batches?.some((batch) => batch !== null) === true;
        if (Object.is(next, previous) && !needsUrgentRebase) return;
        if (transition !== null) {
          stageUniversalTransitionUpdate(transition, record, resolved, "state", value);
          return;
        }
        enqueueUniversalHookUpdate(record, resolved, "state", value, null);
        scheduleOwner(record, resolved);
      },
      get() {
        return projectedStateValue(record, resolved, initialValue);
      }
    };
    owner.hooks.set(resolved, hook);
    owner.clonedHooks.add(resolved);
  }
  return [hook.value, hook.set, hook.get];
}
const __useStateWithGetter = useState;
function universalLinkedStateHook(source, reconcile, optionsOrSlot, maybeSlot, withGetter) {
  const options = optionsOrSlot !== null && typeof optionsOrSlot === "object" ? optionsOrSlot : void 0;
  const slot = maybeSlot ?? (options === void 0 ? optionsOrSlot : void 0);
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  let hook = owner.hooks.get(resolved);
  const sourceEqual = options?.sourceEqual ?? Object.is;
  const valueEqual = options?.valueEqual ?? Object.is;
  if (hook?.linked !== true) {
    const record2 = owner.record;
    const initialValue2 = reconcile(source, void 0);
    const current = {
      kind: "state",
      linked: true,
      source,
      generation: 0,
      generationBase: initialValue2,
      value: initialValue2,
      valueEqual,
      set(update) {
        if (record2.disposed) return;
        const draft = findDraftOwner(record2);
        if (draft !== null) {
          const live = cloneStateHook(draft, resolved);
          if (live?.linked !== true) return;
          const next2 = typeof update === "function" ? update(live.value) : update;
          if (live.valueEqual(live.value, next2)) return;
          live.value = next2;
          draft.needsRender = true;
          return;
        }
        const committed = record2.hooks.get(resolved);
        if (committed?.linked !== true) return;
        const transition = universalTransitionBatchForUpdate();
        const parked = PARKED_UNIVERSAL_LINKED_DRAFTS?.get(committed);
        if (transition === null && record2.visibility === "suspense-hidden" && parked !== void 0 && parked.generation === committed.generation) {
          const next2 = typeof update === "function" ? update(parked.value) : update;
          if (parked.valueEqual(parked.value, next2)) return;
          parked.value = next2;
          parked.updated = true;
          scheduleOwner(record2, resolved);
          return;
        }
        const previous = transition === null ? visibleStateValue(record2, resolved, committed.value) : projectedStateValue(record2, resolved, committed.value);
        const next = typeof update === "function" ? update(previous) : update;
        const queue = record2.updates.get(resolved);
        const needsUrgentRebase = transition === null && queue?.batches?.some((batch) => batch !== null) === true;
        if (committed.valueEqual(previous, next) && !needsUrgentRebase) return;
        const generation = committed.generation;
        const apply = (previousValue) => {
          const latest = record2.hooks.get(resolved);
          if (latest?.linked !== true) return previousValue;
          if (latest.generation !== generation) return latest.generationBase;
          const candidate = typeof update === "function" ? update(previousValue) : update;
          return latest.valueEqual(previousValue, candidate) ? previousValue : candidate;
        };
        if (transition !== null) {
          stageUniversalTransitionUpdate(transition, record2, resolved, "state", apply);
          return;
        }
        enqueueUniversalHookUpdate(record2, resolved, "state", apply, null);
        scheduleOwner(record2, resolved);
      }
    };
    owner.hooks.set(resolved, current);
    owner.clonedHooks.add(resolved);
    hook = current;
  } else {
    if (!owner.clonedHooks.has(resolved)) {
      hook = { ...hook };
      owner.hooks.set(resolved, hook);
      owner.clonedHooks.add(resolved);
      hook.value = applyUniversalHookUpdateQueue(
        owner,
        resolved,
        "state",
        hook.value,
        (previous, update) => typeof update === "function" ? update(previous) : update
      );
    }
    hook.valueEqual = valueEqual;
    const committed = owner.record.hooks.get(resolved);
    let parked = committed === void 0 ? void 0 : PARKED_UNIVERSAL_LINKED_DRAFTS?.get(committed);
    if (parked !== void 0) {
      if (committed?.generation !== parked.generation || !sourceEqual(parked.source, source)) {
        PARKED_UNIVERSAL_LINKED_DRAFTS.delete(committed);
        parked = void 0;
      } else {
        parked.valueEqual = valueEqual;
      }
    }
    const sourceChanged = !sourceEqual(hook.source, source);
    if (sourceChanged) {
      const previous = { source: hook.source, value: hook.value };
      const next = reconcile(source, previous);
      const reconciled = valueEqual(hook.value, next) ? hook.value : next;
      const reuseParked = parked !== void 0 && owner.record.visibility === "suspense-hidden" && parked.updated && parked.generation === committed?.generation;
      hook.value = reuseParked && parked !== void 0 ? parked.value : reconciled;
      if (!reuseParked && committed !== void 0) {
        let boundary = owner.parent;
        while (boundary !== null && !(boundary.isBoundary && boundary.canHandleSuspense)) {
          boundary = boundary.parent;
        }
        if (boundary !== null) {
          (PARKED_UNIVERSAL_LINKED_DRAFTS ??= /* @__PURE__ */ new WeakMap()).set(committed, {
            source,
            value: hook.value,
            valueEqual,
            generation: committed.generation,
            updated: false
          });
        }
      }
      hook.source = source;
      hook.generation++;
      hook.generationBase = hook.value;
      const applied = owner.appliedUpdates.get(resolved);
      if (applied?.lane) {
        owner.appliedUpdates.set(resolved, { ...applied, baseState: hook.value });
      }
    }
  }
  if (!withGetter) return [hook.value, hook.set];
  const record = owner.record;
  const initialValue = hook.value;
  const getter = hook.get ??= () => {
    if (record.visibility === "suspense-hidden" && findDraftOwner(record) === null) {
      const committed = record.hooks.get(resolved);
      if (committed?.linked === true) {
        const parked = PARKED_UNIVERSAL_LINKED_DRAFTS?.get(committed);
        if (parked?.generation === committed.generation) return committed.value;
      }
    }
    return projectedStateValue(record, resolved, initialValue);
  };
  return [hook.value, hook.set, getter];
}
function useLinkedState(source, reconcile, optionsOrSlot, maybeSlot) {
  return universalLinkedStateHook(source, reconcile, optionsOrSlot, maybeSlot, false);
}
function __useLinkedStateWithGetter(source, reconcile, optionsOrSlot, maybeSlot) {
  return universalLinkedStateHook(source, reconcile, optionsOrSlot, maybeSlot, true);
}
function useReducer(reducer, initialArg, initOrSlot, maybeSlot) {
  const init = typeof initOrSlot === "function" ? initOrSlot : null;
  const slot = maybeSlot ?? (init === null ? initOrSlot : void 0);
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  let hook = owner.hooks.get(resolved);
  if (hook?.kind !== "reducer") {
    const record = owner.record;
    const initialValue = init === null ? initialArg : init(initialArg);
    hook = {
      kind: "reducer",
      value: initialValue,
      reducer,
      dispatch(action) {
        if (record.disposed) return;
        const draft = findDraftOwner(record);
        if (draft !== null) {
          let live = draft.hooks.get(resolved);
          if (live?.kind !== "reducer") return;
          if (!draft.clonedHooks.has(resolved)) {
            live = { ...live };
            draft.hooks.set(resolved, live);
            draft.clonedHooks.add(resolved);
          }
          const next = live.reducer(live.value, action);
          if (Object.is(next, live.value)) return;
          live.value = next;
          draft.needsRender = true;
          return;
        }
        const transition = universalTransitionBatchForUpdate();
        if (transition !== null) {
          stageUniversalTransitionUpdate(transition, record, resolved, "reducer", action);
          return;
        }
        enqueueUniversalHookUpdate(record, resolved, "reducer", action, null);
        scheduleOwner(record, resolved);
      },
      get() {
        const draft = findDraftOwner(record);
        const draftHook = draft?.hooks.get(resolved);
        if (draftHook?.kind === "reducer") return draftHook.value;
        const committed = record.hooks.get(resolved);
        const queue = record.updates.get(resolved);
        let value = queue === void 0 ? committed?.kind === "reducer" ? committed.value : initialValue : queue.batches === void 0 ? committed?.kind === "reducer" ? committed.value : initialValue : queue.baseState;
        if (queue !== void 0) {
          for (const update of queue) {
            value = (committed?.reducer ?? reducer)(value, update);
          }
        }
        return value;
      }
    };
    owner.hooks.set(resolved, hook);
    owner.clonedHooks.add(resolved);
  } else {
    if (!owner.clonedHooks.has(resolved)) {
      hook = { ...hook };
      owner.hooks.set(resolved, hook);
      owner.clonedHooks.add(resolved);
      hook.value = applyUniversalHookUpdateQueue(
        owner,
        resolved,
        "reducer",
        hook.value,
        (value, action) => reducer(value, action)
      );
    }
    hook.reducer = reducer;
  }
  return [hook.value, hook.dispatch, hook.get];
}
const __useReducerWithGetter = useReducer;
function enqueueUniversalEffect(phase, create, deps, slot) {
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  const previous = owner.record.hooks.get(resolved);
  const hook = {
    kind: "effect",
    owner: owner.record,
    slot: resolved,
    phase,
    create,
    deps: deps === void 0 ? null : deps,
    cleanup: previous?.kind === "effect" ? previous.cleanup : null,
    mounted: previous?.kind === "effect" ? previous.mounted : false,
    previous: previous?.kind === "effect" ? previous : null
  };
  owner.hooks.set(resolved, hook);
  owner.clonedHooks.add(resolved);
  owner.seenEffects.push(hook);
}
function useInsertionEffect(create, deps, slot) {
  enqueueUniversalEffect("insertion", create, deps, slot);
}
function useLayoutEffect(create, deps, slot) {
  enqueueUniversalEffect("layout", create, deps, slot);
}
function useEffect(create, deps, slot) {
  enqueueUniversalEffect("passive", create, deps, slot);
}
function memoHookValue(input, compute, deps, slot) {
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  const previous = owner.hooks.get(resolved);
  const normalized = deps === void 0 ? null : deps;
  if (previous?.kind === "memo" && depsEqual(previous.deps, normalized)) return previous.value;
  const replayed = findSuspendedMemo(owner, resolved, normalized);
  if (replayed !== null) {
    const value2 = replayed.value;
    owner.hooks.set(resolved, { kind: "memo", value: value2, deps: normalized });
    owner.clonedHooks.add(resolved);
    return value2;
  }
  const warmed = takeUniversalWarmValue(owner.record.root, resolved, normalized);
  const value = warmed === NO_WARM_VALUE ? compute ? input(...normalized ?? []) : input : warmed;
  owner.hooks.set(resolved, { kind: "memo", value, deps: normalized });
  owner.clonedHooks.add(resolved);
  return value;
}
function useMemo(compute, deps, slot) {
  return memoHookValue(compute, true, deps, slot);
}
function useCallback(callback, deps, slot) {
  return memoHookValue(callback, false, deps, slot);
}
function useRef(initial, slot) {
  if (slot === void 0 && typeof initial === "symbol" && arguments.length === 1 && MANUAL_HOOK_DRIVER?.active === true) {
    slot = initial;
    initial = void 0;
  }
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  let hook = owner.hooks.get(resolved);
  if (hook?.kind !== "ref") {
    const record = owner.record;
    const value = {};
    Object.defineProperty(value, "current", {
      enumerable: true,
      get() {
        const draft = findDraftOwner(record);
        const live = draft?.hooks.get(resolved) ?? record.hooks.get(resolved);
        return live?.kind === "ref" ? live.current : initial;
      },
      set(next) {
        const draft = findDraftOwner(record);
        if (draft !== null) {
          let live2 = draft.hooks.get(resolved);
          if (live2?.kind !== "ref") return;
          if (!draft.clonedHooks.has(resolved)) {
            live2 = { ...live2 };
            draft.hooks.set(resolved, live2);
            draft.clonedHooks.add(resolved);
          }
          live2.current = next;
          return;
        }
        const live = record.hooks.get(resolved);
        if (live?.kind === "ref") live.current = next;
      }
    });
    hook = { kind: "ref", current: initial, value };
    owner.hooks.set(resolved, hook);
    owner.clonedHooks.add(resolved);
  }
  return hook.value;
}
function useId(slot) {
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  let hook = owner.hooks.get(resolved);
  if (hook?.kind !== "id") {
    const attempt = currentAttempt();
    hook = {
      kind: "id",
      value: attempt.root.formatUniversalId(attempt.nextUniversalId++)
    };
    owner.hooks.set(resolved, hook);
    owner.clonedHooks.add(resolved);
  }
  return hook.value;
}
function enqueueUniversalStoreSnapshot(instance, value) {
  if (instance.notificationFailed || !Object.is(instance.notificationValue, value)) {
    instance.notificationFailed = false;
    instance.notificationValue = value;
    instance.notificationState = Object.is(instance.value, value) ? instance.committedState : { instance };
  }
  instance.forceUpdate(instance.notificationState);
}
function enqueueUniversalStoreError(instance) {
  if (!instance.notificationFailed) {
    instance.notificationFailed = true;
    instance.notificationState = { instance };
  }
  instance.forceUpdate(instance.notificationState);
}
function notifyUniversalStore(instance) {
  let value;
  try {
    value = instance.getSnapshot();
  } catch {
    enqueueUniversalStoreError(instance);
    return;
  }
  enqueueUniversalStoreSnapshot(instance, value);
}
function checkUniversalStore(instance) {
  let value;
  try {
    value = instance.getSnapshot();
  } catch {
    enqueueUniversalStoreError(instance);
    return;
  }
  if (!Object.is(instance.value, value)) enqueueUniversalStoreSnapshot(instance, value);
}
function updateUniversalStoreInstance(instance, value, getSnapshot, state) {
  instance.value = value;
  instance.getSnapshot = getSnapshot;
  instance.committedState = state;
  instance.notificationState = state;
  instance.notificationValue = value;
  instance.notificationFailed = false;
  checkUniversalStore(instance);
}
function subscribeToUniversalStore(instance, subscribe) {
  let activeInstance = instance;
  const onStoreChange = () => {
    if (activeInstance !== null) notifyUniversalStore(activeInstance);
  };
  let unsubscribe = null;
  try {
    unsubscribe = subscribe(onStoreChange);
  } catch (error) {
    activeInstance = null;
    throw error;
  }
  checkUniversalStore(instance);
  return () => {
    activeInstance = null;
    const cleanup = unsubscribe;
    unsubscribe = null;
    cleanup?.();
  };
}
function useSyncExternalStore(subscribe, getSnapshot, serverSnapshotOrSlot = void 0, lastSlot) {
  let slot;
  const count = arguments.length;
  if (count === 3) {
    slot = typeof serverSnapshotOrSlot === "function" ? void 0 : serverSnapshotOrSlot;
  } else if (count > 3) {
    slot = count > 4 ? arguments[count - 1] : lastSlot;
  }
  const base = resolveHookSlot(slot);
  return withSlot(base, () => {
    const snapshot = getSnapshot();
    const [state, forceUpdate] = useState(() => {
      const initial = {};
      const instance2 = {
        value: snapshot,
        getSnapshot,
        committedState: initial,
        notificationState: initial,
        notificationValue: snapshot,
        notificationFailed: false,
        forceUpdate: (next) => forceUpdate(next)
      };
      initial.instance = instance2;
      return initial;
    }, "state");
    const instance = state.instance;
    useLayoutEffect(
      updateUniversalStoreInstance,
      [instance, snapshot, getSnapshot, state],
      "snapshot"
    );
    useLayoutEffect(
      subscribeToUniversalStore,
      [instance, subscribe],
      "subscribe"
    );
    return snapshot;
  });
}
function useDeferredValue(value, initialValueOrSlot = void 0, lastSlot) {
  const count = arguments.length;
  const slot = count > 3 ? arguments[count - 1] : count === 3 ? lastSlot : initialValueOrSlot;
  const hasInitialValue = count >= 3;
  const initialValue = initialValueOrSlot;
  const base = resolveHookSlot(slot);
  return withSlot(base, () => {
    const owner = currentDraftOwner();
    const transitionRender = currentAttempt().transitionRender;
    const inactive = owner.visibility !== "visible" || owner.record.visibility !== "visible";
    const [deferred, setDeferred] = useState(
      hasInitialValue && !transitionRender && !inactive ? initialValue : value,
      "value"
    );
    if ((transitionRender || inactive) && !Object.is(deferred, value)) {
      setDeferred(value);
      return value;
    }
    useLayoutEffect(
      () => {
        if (Object.is(deferred, value)) return;
        startTransition(() => setDeferred(value));
      },
      [value, deferred],
      "defer"
    );
    return deferred;
  });
}
function useTransition(slot) {
  const base = resolveHookSlot(slot);
  return withSlot(base, () => {
    const [pending, setPending] = useState(UNIVERSAL_TRANSITION_PENDING_COUNT > 0, "pending");
    useLayoutEffect(
      () => {
        const update = () => setPending(UNIVERSAL_TRANSITION_PENDING_COUNT > 0);
        UNIVERSAL_TRANSITION_LISTENERS.add(update);
        update();
        return () => UNIVERSAL_TRANSITION_LISTENERS.delete(update);
      },
      [],
      "subscribe"
    );
    return [pending, startTransition];
  });
}
function createUniversalActionStateQueue(owner, action, initialState, setState, setPending) {
  const queue = {
    action,
    state: initialState,
    head: null,
    tail: null,
    running: false,
    owner,
    setState,
    setPending,
    dispatch(payload) {
      const run = {
        action: queue.action,
        payload,
        next: null
      };
      if (queue.tail === null) queue.head = run;
      else queue.tail.next = run;
      queue.tail = run;
      publishUrgentUniversalUpdate(setPending, true);
      if (!queue.running) runUniversalActionStateQueue(queue);
    }
  };
  return queue;
}
function publishUrgentUniversalUpdate(set, value) {
  const transitionDepth = UNIVERSAL_TRANSITION_DEPTH;
  UNIVERSAL_TRANSITION_DEPTH = 0;
  UNIVERSAL_DISCRETE_EVENT_DEPTH++;
  try {
    set(value);
  } finally {
    UNIVERSAL_DISCRETE_EVENT_DEPTH--;
    UNIVERSAL_TRANSITION_DEPTH = transitionDepth;
  }
}
function runUniversalActionStateQueue(queue) {
  while (queue.head !== null && !queue.running) {
    const run = queue.head;
    let failed = false;
    let error;
    queue.running = true;
    startTransition(() => {
      let result;
      try {
        result = run.action(queue.state, run.payload);
        if (result != null && typeof result.then === "function") {
          return Promise.resolve(result).then(
            (value) => settleUniversalActionStateRun(queue, true, value),
            (reason) => settleUniversalActionStateRun(queue, false, reason)
          );
        }
      } catch (reason) {
        failed = true;
        error = reason;
        completeUniversalActionStateRun(queue, false, void 0);
        return;
      }
      completeUniversalActionStateRun(queue, true, result);
    });
    if (failed) reportUniversalActionStateError(queue.owner, error);
  }
}
function settleUniversalActionStateRun(queue, fulfilled, value) {
  startTransition(() => completeUniversalActionStateRun(queue, fulfilled, value));
  if (!fulfilled) reportUniversalActionStateError(queue.owner, value);
  runUniversalActionStateQueue(queue);
}
function completeUniversalActionStateRun(queue, fulfilled, value) {
  queue.head = queue.head.next;
  if (queue.head === null) queue.tail = null;
  queue.running = false;
  if (fulfilled) {
    const state = value;
    queue.state = state;
    queue.setState(() => state);
  }
  if (queue.head === null) queue.setPending(false);
}
function reportUniversalActionStateError(owner, error) {
  if (!owner.disposed && routeUniversalOwnerError(owner, error)) return;
  if (reportUniversalUncaughtError(owner.root, error)) return;
  owner.root.__scheduleMicrotask(() => {
    throw error;
  });
}
function useActionState(action, initialState, _permalinkOrSlot, maybeSlot) {
  const slot = maybeSlot ?? (typeof _permalinkOrSlot === "string" ? void 0 : _permalinkOrSlot);
  const base = resolveHookSlot(slot);
  const owner = currentDraftOwner().record;
  return withSlot(base, () => {
    const [state, setState] = useState(() => initialState, "state");
    const [pending, setPending] = useState(false, "pending");
    const [queue] = useState(
      () => createUniversalActionStateQueue(
        owner,
        action,
        initialState,
        setState,
        setPending
      ),
      "queue"
    );
    useLayoutEffect(
      () => {
        queue.action = action;
      },
      [queue, action],
      "action"
    );
    return [state, queue.dispatch, pending];
  });
}
const UNIVERSAL_FORM_STATUS = Object.freeze({
  pending: false,
  data: null,
  method: null,
  action: null
});
function useFormStatus() {
  return UNIVERSAL_FORM_STATUS;
}
const NO_UNIVERSAL_OPTIMISTIC_UPDATES = [];
function basicUniversalOptimisticReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}
function createUniversalOptimisticDispatch(record, setUpdates, getUpdates) {
  return (action) => {
    if (record.disposed) return;
    if (CURRENT_ATTEMPT !== null && findDraftOwner(record) !== null) {
      throw new Error("Cannot update optimistic state while rendering.");
    }
    const update = { action };
    const revert = (previous) => previous.filter((pending) => pending !== update);
    const pendingBatch = UNIVERSAL_TRANSITION_DEPTH > 0 ? ACTIVE_UNIVERSAL_TRANSITION_BATCH : IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH;
    const batch = pendingBatch ?? createUniversalTransitionBatch();
    publishUrgentUniversalUpdate(setUpdates, (previous) => [...previous, update]);
    const activeBatch = ACTIVE_UNIVERSAL_TRANSITION_BATCH;
    ACTIVE_UNIVERSAL_TRANSITION_BATCH = batch;
    UNIVERSAL_TRANSITION_DEPTH++;
    try {
      setUpdates(revert);
    } finally {
      UNIVERSAL_TRANSITION_DEPTH--;
      ACTIVE_UNIVERSAL_TRANSITION_BATCH = activeBatch;
    }
    (batch.optimisticReverts ??= []).push(() => {
      if (!record.disposed && getUpdates().includes(update)) {
        publishUrgentUniversalUpdate(setUpdates, revert);
      }
    });
    if (pendingBatch === null) {
      batch.closed = true;
      queueUniversalTransitionPromotion(batch);
    }
  };
}
function useOptimistic(passthrough, ...reducerAndSlot) {
  let reducer = basicUniversalOptimisticReducer;
  let slot;
  if (reducerAndSlot.length === 1) {
    if (typeof reducerAndSlot[0] === "function") {
      reducer = reducerAndSlot[0];
    } else {
      slot = reducerAndSlot[0];
    }
  } else if (reducerAndSlot.length > 1) {
    if (typeof reducerAndSlot[0] === "function") {
      reducer = reducerAndSlot[0];
    }
    slot = reducerAndSlot[reducerAndSlot.length - 1];
  }
  const base = resolveHookSlot(slot);
  const record = currentDraftOwner().record;
  return withSlot(base, () => {
    const [updates, setUpdates, getUpdates] = useState(
      NO_UNIVERSAL_OPTIMISTIC_UPDATES,
      "updates"
    );
    const [dispatch] = useState(
      () => createUniversalOptimisticDispatch(record, setUpdates, getUpdates),
      "dispatch"
    );
    let state = passthrough;
    for (let index = 0; index < updates.length; index++) {
      state = reducer(state, updates[index].action);
    }
    return [state, dispatch];
  });
}
function useContext(context) {
  return readOwnerContext(currentDraftOwner(), context);
}
function trackUniversalThenable(thenable) {
  if (thenable.status !== void 0) return;
  thenable.status = "pending";
  thenable.then(
    (value) => {
      thenable.status = "fulfilled";
      thenable.value = value;
    },
    (error) => {
      thenable.status = "rejected";
      thenable.reason = error;
    }
  );
}
const UNIVERSAL_WARM_CACHES = /* @__PURE__ */ new WeakMap();
let CURRENT_UNIVERSAL_WARM = null;
let CURRENT_UNIVERSAL_WARM_CLAIMS = null;
const ACTIVE_UNIVERSAL_WARM_PLANS = [];
let UNIVERSAL_WARM_DEPTH = 0;
const UNIVERSAL_WARM_DEPTH_CAP = 64;
const NO_WARM_VALUE = /* @__PURE__ */ Symbol("octane.universal.no-warm-value");
function takeUniversalWarmValue(root, slot, deps) {
  if (deps === null) return NO_WARM_VALUE;
  const cache = UNIVERSAL_WARM_CACHES.get(root);
  const entries = cache?.get(slot);
  if (entries === void 0) return NO_WARM_VALUE;
  for (let index = 0; index < entries.length; index++) {
    if (!depsEqual(entries[index].deps, deps)) continue;
    if (!entries[index].available) continue;
    entries[index].available = false;
    return entries[index].value;
  }
  return NO_WARM_VALUE;
}
function useBatch(items, warm) {
  if (items.length === 0) {
    if (warm !== void 0) ACTIVE_UNIVERSAL_WARM_PLANS.push(warm);
    return;
  }
  let pending = null;
  for (const item of items) {
    if (item == null || typeof item.then !== "function") continue;
    const thenable = item;
    trackUniversalThenable(thenable);
    if (thenable.status === "rejected") break;
    if (thenable.status === "pending") (pending ??= []).push(thenable);
  }
  if (pending === null) return;
  if (ACTIVE_UNIVERSAL_WARM_PLANS.length !== 0 || warm !== void 0) {
    const root = currentAttempt().root;
    let cache = UNIVERSAL_WARM_CACHES.get(root);
    if (cache === void 0) {
      cache = /* @__PURE__ */ new Map();
      UNIVERSAL_WARM_CACHES.set(root, cache);
    }
    const previous = CURRENT_UNIVERSAL_WARM;
    const previousClaims = CURRENT_UNIVERSAL_WARM_CLAIMS;
    CURRENT_UNIVERSAL_WARM = cache;
    CURRENT_UNIVERSAL_WARM_CLAIMS = /* @__PURE__ */ new Set();
    try {
      for (let i = 0; i < ACTIVE_UNIVERSAL_WARM_PLANS.length; i++) {
        CURRENT_UNIVERSAL_WARM_CLAIMS = /* @__PURE__ */ new Set();
        try {
          ACTIVE_UNIVERSAL_WARM_PLANS[i]();
        } catch {
        }
      }
      if (warm !== void 0) {
        CURRENT_UNIVERSAL_WARM_CLAIMS = /* @__PURE__ */ new Set();
        try {
          warm();
        } catch {
        }
      }
    } finally {
      CURRENT_UNIVERSAL_WARM = previous;
      CURRENT_UNIVERSAL_WARM_CLAIMS = previousClaims;
    }
  }
  if (pending.length === 1) throw new UniversalSuspense(pending[0]);
  let remaining = pending.length;
  const combined = new Promise((resolve, reject) => {
    for (const thenable of pending) {
      thenable.then(() => {
        if (--remaining === 0) resolve();
      }, reject);
    }
  });
  throw new UniversalSuspense(combined);
}
function warmMemo(compute, deps, slot) {
  const cache = CURRENT_UNIVERSAL_WARM;
  if (cache === null) return;
  let entries = cache.get(slot);
  if (entries !== void 0) {
    for (const entry2 of entries) {
      if (!depsEqual(entry2.deps, deps) || CURRENT_UNIVERSAL_WARM_CLAIMS?.has(entry2)) {
        continue;
      }
      CURRENT_UNIVERSAL_WARM_CLAIMS?.add(entry2);
      return;
    }
  }
  let activeCreation;
  for (const owner of currentAttempt().owners) {
    const hook = owner.hooks.get(slot);
    if (hook?.kind === "memo" && depsEqual(hook.deps, deps) && !CURRENT_UNIVERSAL_WARM_CLAIMS?.has(hook)) {
      activeCreation = hook;
      break;
    }
  }
  if (activeCreation !== void 0) {
    CURRENT_UNIVERSAL_WARM_CLAIMS?.add(activeCreation);
    if (entries === void 0) {
      entries = [];
      cache.set(slot, entries);
    }
    const entry2 = { deps: [...deps], value: void 0, available: false };
    entries.push(entry2);
    CURRENT_UNIVERSAL_WARM_CLAIMS?.add(entry2);
    return;
  }
  let value;
  try {
    value = compute();
  } catch {
    return;
  }
  if (value != null && typeof value.then === "function") {
    trackUniversalThenable(value);
  }
  if (entries === void 0) {
    entries = [];
    cache.set(slot, entries);
  }
  const entry = { deps: [...deps], value, available: true };
  entries.push(entry);
  CURRENT_UNIVERSAL_WARM_CLAIMS?.add(entry);
}
function markWarm(component, plan) {
  Object.defineProperty(component, "__warm", {
    configurable: true,
    get() {
      return this === component ? plan : void 0;
    }
  });
  return component;
}
function warmChild(component, props) {
  if (CURRENT_UNIVERSAL_WARM === null || component == null) return;
  const plan = component.__warm;
  if (typeof plan !== "function" || UNIVERSAL_WARM_DEPTH >= UNIVERSAL_WARM_DEPTH_CAP) return;
  UNIVERSAL_WARM_DEPTH++;
  try {
    plan(props);
  } catch {
  } finally {
    UNIVERSAL_WARM_DEPTH--;
  }
}
function resolveUniversalLazyModule(module, renderer) {
  let component = module;
  if (module != null) {
    const defaultExport = module.default;
    if (defaultExport !== void 0) component = defaultExport;
  }
  if (typeof component !== "function" || component[LAZY_COMPONENT] === true) {
    throw new Error(
      `Universal lazy expected a component function or module default, got ${component?.[LAZY_COMPONENT] === true ? "a lazy component" : typeof component}.`
    );
  }
  const resolved = component;
  const metadata = getComponentMetadata(resolved);
  if (metadata === UNIVERSAL_LAZY_METADATA || metadata.id !== renderer) {
    throw new Error(
      `Universal lazy for renderer ${JSON.stringify(renderer)} cannot render component ${JSON.stringify(metadata.id)}.`
    );
  }
  return resolved;
}
// @__NO_SIDE_EFFECTS__
function lazy(load) {
  let status = "uninitialized";
  let result = null;
  let thenable = null;
  const initialize = () => {
    if (status !== "uninitialized") return;
    try {
      const loaded = load();
      thenable = loaded;
      loaded.then(
        (module) => {
          if (status === "uninitialized" || status === "pending") {
            result = module;
            status = "fulfilled";
          }
        },
        (error) => {
          if (status === "uninitialized" || status === "pending") {
            result = error;
            status = "rejected";
          }
        }
      );
    } catch (error) {
      if (status === "uninitialized") thenable = null;
      throw error;
    }
    if (status === "uninitialized") status = "pending";
  };
  const wrapper = ((props, context) => {
    if (status === "uninitialized") initialize();
    let settledStatus = status;
    if (settledStatus === "fulfilled") {
      const component = resolveUniversalLazyModule(result, context.renderer);
      return component(resolveLazyDefaultProps(component, props), context);
    }
    if (settledStatus === "rejected") throw result;
    useBatch([thenable]);
    settledStatus = status;
    if (settledStatus === "fulfilled") {
      const component = resolveUniversalLazyModule(result, context.renderer);
      return component(resolveLazyDefaultProps(component, props), context);
    }
    if (settledStatus === "rejected") throw result;
    throw new UniversalSuspense(thenable);
  });
  Object.defineProperties(wrapper, {
    [LAZY_COMPONENT]: {
      get() {
        return this === wrapper;
      }
    }
  });
  markWarm(wrapper, initialize);
  return wrapper;
}
function use(usable) {
  currentDraftOwner();
  if (usable?.$$kind === CONTEXT_TAG) {
    return useContext(usable);
  }
  const thenable = usable;
  if (thenable.status === "fulfilled") return thenable.value;
  if (thenable.status === "rejected") throw thenable.reason;
  trackUniversalThenable(thenable);
  throw new UniversalSuspense(thenable);
}
function useImperativeHandle(ref, create, deps, slot) {
  useLayoutEffect(
    () => {
      const value = create();
      if (typeof ref === "function") ref(value);
      else if (ref !== null) ref.current = value;
      return () => {
        if (typeof ref === "function") ref(null);
        else if (ref !== null) ref.current = null;
      };
    },
    deps,
    slot
  );
}
function useEffectEvent(fn, slot) {
  const owner = currentDraftOwner();
  const resolved = resolveHookSlot(slot);
  let hook = owner.hooks.get(resolved);
  if (hook?.kind !== "effect-event") {
    const cell = { impl: fn, active: false };
    const value = ((...args) => {
      if (!cell.active) throw new Error("A universal Effect Event cannot run before commit.");
      return cell.impl(...args);
    });
    hook = { kind: "effect-event", cell, next: fn, value };
  } else {
    hook = { ...hook, next: fn };
  }
  owner.hooks.set(resolved, hook);
  owner.clonedHooks.add(resolved);
  return hook.value;
}
function useDebugValue() {
}
function startTransition(fn) {
  if (typeof fn !== "function") throw new TypeError("startTransition expected a function.");
  tickUniversalTransitionCount(1);
  const parentBatch = ACTIVE_UNIVERSAL_TRANSITION_BATCH;
  const pendingBatch = IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH;
  const batch = parentBatch ?? pendingBatch ?? createUniversalTransitionBatch();
  const ownsBatch = parentBatch === null && pendingBatch === null;
  batch.pendingSignals++;
  ACTIVE_UNIVERSAL_TRANSITION_BATCH = batch;
  UNIVERSAL_TRANSITION_DEPTH++;
  let result;
  let then = null;
  try {
    result = fn();
    if (result !== null && typeof result === "object" || typeof result === "function") {
      const candidate = result.then;
      if (typeof candidate === "function") then = candidate;
    }
    if (then !== null) {
      batch.pendingActions++;
      IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH = batch;
    }
  } catch (error) {
    batch.pendingSignals--;
    tickUniversalTransitionCount(-1);
    if (ownsBatch) {
      batch.closed = true;
      queueUniversalTransitionPromotion(batch);
    }
    throw error;
  } finally {
    ACTIVE_UNIVERSAL_TRANSITION_BATCH = parentBatch;
    UNIVERSAL_TRANSITION_DEPTH--;
  }
  if (ownsBatch) batch.closed = true;
  if (then !== null) {
    UNIVERSAL_ASYNC_TRANSITION_COUNT++;
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      batch.pendingActions--;
      UNIVERSAL_ASYNC_TRANSITION_COUNT--;
      if (batch.pendingActions === 0 && IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH === batch) {
        IN_FLIGHT_UNIVERSAL_TRANSITION_BATCH = null;
      }
      queueUniversalTransitionPromotion(batch);
    };
    try {
      then.call(result, settle, settle);
    } catch (error) {
      settle();
      throw error;
    }
  } else {
    queueUniversalTransitionPromotion(batch);
  }
}
function requestFormReset() {
}
function universalShallowEqual(previous, next) {
  if (Object.is(previous, next)) return true;
  if (previous === null || next === null || typeof previous !== "object" || typeof next !== "object") {
    return false;
  }
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);
  if (previousKeys.length !== nextKeys.length) return false;
  for (const key of previousKeys) {
    if (!hasOwnProp.call(next, key) || !Object.is(previous[key], next[key])) {
      return false;
    }
  }
  return true;
}
function universalComponentRevision(component) {
  const revision = component[UNIVERSAL_COMPONENT_REVISION];
  return typeof revision === "number" ? revision : 0;
}
function mergeMemoContextReads(contextReads) {
  if (CURRENT_MEMO_CONTEXT_READS === null || contextReads === null) return;
  for (const [context, value] of contextReads) CURRENT_MEMO_CONTEXT_READS.set(context, value);
}
function memo(component, compare) {
  if (typeof component !== "function") throw new TypeError("memo expected a component function.");
  if (compare !== void 0 && typeof compare !== "function") {
    throw new TypeError("memo compare must be a function.");
  }
  const metadata = getComponentMetadata(component);
  const equal = compare ?? universalShallowEqual;
  const memoSlot = /* @__PURE__ */ Symbol("octane.universal.component-memo");
  const renderMemo = (props, context) => {
    const owner = currentDraftOwner();
    const previous = owner.record.hooks.get(memoSlot);
    const revision = universalComponentRevision(component);
    let contextsEqual = true;
    if (previous?.kind === "component-memo" && previous.component === component && previous.revision === revision && !hasUniversalUpdatesForAttempt(owner.record) && equal(previous.props, props)) {
      for (const [readContext, previousValue] of previous.contextReads ?? []) {
        if (!Object.is(readOwnerContext(owner, readContext, false), previousValue)) {
          contextsEqual = false;
          break;
        }
      }
      if (contextsEqual) {
        owner.seenEffects = [...owner.record.effectOrder];
        owner.hooks.set(memoSlot, previous);
        mergeMemoContextReads(previous.contextReads);
        return previous.value;
      }
    }
    const parentContextReads = CURRENT_MEMO_CONTEXT_READS;
    const contextReads = /* @__PURE__ */ new Map();
    CURRENT_MEMO_CONTEXT_READS = contextReads;
    let value;
    try {
      value = component(props, context);
    } finally {
      CURRENT_MEMO_CONTEXT_READS = parentContextReads;
    }
    mergeMemoContextReads(contextReads.size === 0 ? null : contextReads);
    owner.hooks.set(memoSlot, {
      kind: "component-memo",
      component,
      revision,
      props,
      value,
      contextReads: contextReads.size === 0 ? null : contextReads
    });
    return value;
  };
  let wrapper;
  if (metadata === UNIVERSAL_LAZY_METADATA) {
    wrapper = renderMemo;
    Object.defineProperty(wrapper, LAZY_COMPONENT, {
      get() {
        return this === wrapper;
      }
    });
  } else {
    wrapper = defineUniversalComponent(metadata.id, renderMemo, { module: metadata.module });
  }
  Object.defineProperty(wrapper, UNIVERSAL_COMPONENT_REVISION, {
    get: () => universalComponentRevision(component)
  });
  if (typeof __OCTANE_PROFILE_ENABLED__ !== "undefined" && __OCTANE_PROFILE_ENABLED__) {
    __profileComponentSource(wrapper, component);
  }
  if (component.__warm !== void 0) markWarm(wrapper, component.__warm);
  return wrapper;
}
function createPortal(children, target) {
  return Object.freeze({ $$kind: UNIVERSAL_PORTAL, children, target });
}
const Activity = ACTIVITY_TAG;
function runEffectCreate(hook) {
  const cleanup = hook.create(
    ...hook.deps ?? []
  );
  hook.cleanup = typeof cleanup === "function" ? cleanup : null;
  hook.mounted = true;
}
function runEffectCleanup(hook) {
  const cleanup = hook.cleanup;
  hook.cleanup = null;
  hook.mounted = false;
  cleanup?.();
}
let UNIVERSAL_ROOT_ERROR_HANDLERS = null;
function registerUniversalRootErrorHandlers(root, options) {
  const { onCaughtError, onUncaughtError } = options;
  if (onCaughtError === void 0 && onUncaughtError === void 0) return;
  (UNIVERSAL_ROOT_ERROR_HANDLERS ??= /* @__PURE__ */ new WeakMap()).set(root, { onCaughtError, onUncaughtError });
}
function universalRootErrorHandlersFor(root) {
  if (UNIVERSAL_ROOT_ERROR_HANDLERS === null) return null;
  return UNIVERSAL_ROOT_ERROR_HANDLERS.get(root) ?? null;
}
function invokeUniversalRootErrorHandler(handler, err) {
  try {
    handler(err);
  } catch (handlerErr) {
    console.error(handlerErr);
  }
}
function reportUniversalCaughtError(root, err) {
  const h = universalRootErrorHandlersFor(root)?.onCaughtError;
  if (h !== void 0) invokeUniversalRootErrorHandler(h, err);
}
function reportUniversalUncaughtError(root, err) {
  const h = universalRootErrorHandlersFor(root)?.onUncaughtError;
  if (h === void 0) return false;
  invokeUniversalRootErrorHandler(h, err);
  return true;
}
function routeUniversalOwnerError(owner, error) {
  for (let current = owner.parent; current !== null; current = current.parent) {
    if (!current.isBoundary || current.disposed) continue;
    current.boundaryThenable = null;
    current.boundaryError = error;
    current.hasBoundaryError = true;
    current.root.schedule();
    reportUniversalCaughtError(current.root, error);
    return true;
  }
  return false;
}
function routeUniversalOwnerSuspense(owner, thenable) {
  for (let current = owner.parent; current !== null; current = current.parent) {
    if (!current.canHandleSuspense || current.disposed) continue;
    current.boundaryThenable = thenable;
    current.boundaryError = void 0;
    current.hasBoundaryError = false;
    const settle = () => {
      if (current.disposed || current.boundaryThenable !== thenable) return;
      current.boundaryThenable = null;
      current.root.schedule();
    };
    resumeOnSettle(thenable, settle);
    current.root.schedule();
    return true;
  }
  return false;
}
function runOwnedEffectCreate(hook) {
  try {
    runEffectCreate(hook);
  } catch (error) {
    if (routeUniversalOwnerError(hook.owner, error)) return;
    if (!reportUniversalUncaughtError(hook.owner.root, error)) throw error;
  }
}
function runOwnedEffectCleanup(hook) {
  try {
    runEffectCleanup(hook);
  } catch (error) {
    if (routeUniversalOwnerError(hook.owner, error)) return;
    if (!reportUniversalUncaughtError(hook.owner.root, error)) throw error;
  }
}
function runOwnedCommit(owner, work) {
  try {
    work();
  } catch (error) {
    if (owner === null) throw error;
    if (routeUniversalOwnerError(owner, error)) return;
    if (!reportUniversalUncaughtError(owner.root, error)) throw error;
  }
}
function cloneSerializableValue(value, seen) {
  if (value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "object") {
    throw new TypeError(`Unsupported serializable host value ${String(value)}.`);
  }
  if (value.$$kind === "octane.universal.resource") {
    throw new TypeError("A resource handle must use the resource encoding branch.");
  }
  seen ??= /* @__PURE__ */ new WeakSet();
  if (seen.has(value)) throw new TypeError("Serializable host values cannot contain cycles.");
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      return Object.freeze(value.map((entry) => cloneSerializableValue(entry, seen)));
    }
    if (!hasCrossRealmPlainPrototype(value)) {
      throw new TypeError(
        `Serializable host values require plain objects, received ${Object.prototype.toString.call(value)}.`
      );
    }
    const output = {};
    for (const [name, entry] of Object.entries(value)) {
      Object.defineProperty(output, name, {
        configurable: true,
        enumerable: true,
        value: cloneSerializableValue(entry, seen),
        writable: true
      });
    }
    return Object.freeze(output);
  } finally {
    seen.delete(value);
  }
}
function freezeUniversalHostBatch(renderer, version, commands) {
  for (const command of commands) {
    if ((command.op === "event" || command.op === "lifecycle" || command.op === "local-callback") && command.listener !== null) {
      Object.freeze(command.listener);
    }
    Object.freeze(command);
  }
  return Object.freeze({
    renderer,
    version,
    commands: Object.freeze(commands)
  });
}
function collectEffectEventCells(owners) {
  const cells = [];
  for (const owner of owners) {
    for (const hook of owner.hooks.values()) {
      if (hook.kind === "effect-event") cells.push(hook.cell);
    }
  }
  return cells;
}
function deactivateEffectEventCells(cells) {
  for (const cell of cells) cell.active = false;
}
function snapshotHostAttachmentIds(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`Universal host attachment ${label} must be an array.`);
  }
  const ids = [];
  const seen = /* @__PURE__ */ new Set();
  for (const id of value) {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new TypeError(`Universal host attachment ${label} IDs must be positive safe integers.`);
    }
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  return Object.freeze(ids);
}
function snapshotHostAttachmentBatch(batch) {
  if (batch === null || typeof batch !== "object" || Array.isArray(batch)) {
    throw new TypeError("A universal host attachment batch must be an object.");
  }
  return Object.freeze({
    detached: snapshotHostAttachmentIds(batch.detached, "detached"),
    attached: snapshotHostAttachmentIds(batch.attached, "attached")
  });
}
function logicalRecordDepth(record) {
  let depth = 0;
  for (let parent = record.parent; parent !== null; parent = parent.parent) depth++;
  return depth;
}
class UniversalRootImpl {
  constructor(container, driver, transport, microtaskScheduler) {
    this.container = container;
    this.driver = driver;
    this.transport = transport;
    this.microtaskScheduler = microtaskScheduler;
    assertRendererId(driver.id, "Universal driver id");
    if (transport?.mode === "async" && driver.capabilities?.localHostCallbacks === true) {
      throw new Error(
        "Universal async transports do not support the local host callback capability."
      );
    }
    this.renderer = driver.id;
    this.rootRecord = {
      id: 0,
      kind: "range",
      key: null,
      type: null,
      props: {},
      ref: null,
      refCleanup: null,
      refAttached: false,
      owner: null,
      events: /* @__PURE__ */ new Map(),
      lifecycles: /* @__PURE__ */ new Map(),
      localCallbacks: /* @__PURE__ */ new Map(),
      visibility: "visible",
      portalRegistration: null,
      parent: null,
      children: [],
      treeFeatures: null
    };
    this.initializeHostAttachments();
  }
  container;
  driver;
  transport;
  microtaskScheduler;
  renderer;
  rootRecord;
  universalIdRoot = NEXT_UNIVERSAL_ID_ROOT++;
  resourceRoot = NEXT_RESOURCE_ROOT++;
  portalRoot = NEXT_PORTAL_ROOT++;
  transportRoot = NEXT_TRANSPORT_ROOT++;
  portalHandles = /* @__PURE__ */ new Map();
  owner = null;
  bridge = null;
  bridgeContextReads = null;
  unmounted = false;
  unmounting = false;
  unmountPromise = null;
  asyncWork = Promise.resolve();
  asyncWorkError = NO_PENDING_PASSIVE_ERROR;
  nextId = 1;
  nextLogicalRangeId = -1;
  nextUniversalId = 1;
  nextListener = NEXT_EVENT_ROOT++ * 1e6;
  nextBatchVersion = 1;
  acceptedBatchVersion = 0;
  treeFeatures = 0;
  handlers = /* @__PURE__ */ new Map();
  eventDefinitions = null;
  staticHostProps = null;
  templatePrograms = null;
  localCallbacks = /* @__PURE__ */ new Map();
  boundHosts = null;
  boundSources = /* @__PURE__ */ new Map();
  dirtyBoundHosts = [];
  dirtyBoundHostSet = /* @__PURE__ */ new Set();
  dirtyBoundSources = [];
  dirtyBoundSourceSet = /* @__PURE__ */ new Set();
  boundHostScheduled = false;
  publishedListeners = /* @__PURE__ */ new Set();
  pending = null;
  suspended = null;
  urgentBoundarySuspension = null;
  awaitingReplay = null;
  queuedReplay = null;
  rootRetryAttempt = null;
  lastComponent = null;
  lastProps;
  retryRenderInput = null;
  scheduled = false;
  scheduledUrgent = false;
  scheduledFullRoot = false;
  scheduledOwners = /* @__PURE__ */ new Set();
  scheduledPreparationDepth = 0;
  // The current dirty epoch: scheduleOwned() stamps it on the scheduled owner
  // and its ancestors, and prepare() bumps it as it consumes the batch, so an
  // attempt recognizes exactly the owners scheduled into it.
  dirtyEpoch = 1;
  attemptDirtyEpoch = 0;
  attemptFullRootScheduled = false;
  scheduledTransitionBatches = /* @__PURE__ */ new Set();
  unattemptedTransitionBatches = /* @__PURE__ */ new Set();
  eventScopeDepth = 0;
  eventScopePriority = null;
  eventScopeHandlers = null;
  passiveScheduled = false;
  passiveTasks = [];
  hostAttachments = null;
  collapsedTemplates = null;
  codecResourceHandle = null;
  initializeHostAttachments() {
    const capability = this.driver.attachments;
    if (capability === void 0) return;
    if (typeof capability.subscribe !== "function") {
      throw new TypeError("A universal host attachment capability must provide subscribe().");
    }
    const state = {
      registration: null,
      records: /* @__PURE__ */ new Map(),
      pending: [],
      flushScheduled: false
    };
    this.hostAttachments = state;
    let registration;
    try {
      registration = capability.subscribe(
        this.container,
        (batch) => this.receiveHostAttachmentBatch(batch)
      );
      if (registration === null || typeof registration !== "object") {
        throw new TypeError("A universal host attachment subscription must return a registration.");
      }
      const candidate = registration;
      if (typeof candidate.isAttached !== "function") {
        throw new TypeError("A universal host attachment registration must provide isAttached().");
      }
      if (typeof candidate.unsubscribe !== "function") {
        throw new TypeError("A universal host attachment registration must provide unsubscribe().");
      }
      state.registration = candidate;
      this.flushPendingHostAttachmentBatches();
    } catch (error) {
      this.hostAttachments = null;
      try {
        const unsubscribe = registration?.unsubscribe;
        if (typeof unsubscribe === "function") {
          unsubscribe.call(registration);
        }
      } catch {
      }
      throw error;
    }
  }
  receiveHostAttachmentBatch(batch) {
    const state = this.hostAttachments;
    if (state === null || this.unmounted) return;
    const snapshot = snapshotHostAttachmentBatch(batch);
    if (snapshot.detached.length === 0 && snapshot.attached.length === 0) return;
    state.pending.push(snapshot);
    if (state.registration === null || this.unmounting) return;
    if (CURRENT_ATTEMPT !== null || UNIVERSAL_COMMIT_TASK_DEPTH > 0 || this.pending?.isAwaitingTransportAcknowledgement()) {
      this.queueHostAttachmentFlush();
      return;
    }
    this.flushPendingHostAttachmentBatches();
  }
  queueHostAttachmentFlush() {
    const state = this.hostAttachments;
    if (state === null || state.flushScheduled || state.pending.length === 0 || this.unmounted || this.unmounting) {
      return;
    }
    state.flushScheduled = true;
    this.__scheduleMicrotask(() => {
      state.flushScheduled = false;
      if (this.hostAttachments !== state || this.unmounted) {
        state.pending.splice(0);
        return;
      }
      if (this.unmounting || this.pending?.isAwaitingTransportAcknowledgement()) return;
      this.flushPendingHostAttachmentBatches();
    });
  }
  readHostAttachment(id) {
    const registration = this.hostAttachments?.registration ?? null;
    if (registration === null) return true;
    const attached = registration.isAttached(id);
    if (typeof attached !== "boolean") {
      throw new TypeError("Universal host attachment isAttached() must return a boolean.");
    }
    return attached;
  }
  attachHostRef(record) {
    if (this.hostAttachments?.registration == null || this.unmounted || record.visibility !== "visible") {
      return;
    }
    if (!this.readHostAttachment(record.id)) return;
    const value = this.driver.getPublicInstance(this.container, record.id);
    if (value === null) return;
    attachRef(record, value);
  }
  processHostAttachmentBatch(batch, forcedDetaches) {
    const state = this.hostAttachments;
    if (state === null || state.registration === null) return;
    const records = state.records;
    const ordered = (ids, childFirst) => ids.map((id, index) => {
      const record = records.get(id);
      return {
        record,
        index,
        depth: record === void 0 ? 0 : logicalRecordDepth(record)
      };
    }).filter(
      (entry) => entry.record?.kind === "host"
    ).sort((left, right) => {
      const depth = left.depth - right.depth;
      return (childFirst ? -depth : depth) || left.index - right.index;
    }).map((entry) => entry.record);
    const tasks = [];
    for (const record of ordered(batch.detached, false)) {
      tasks.push(() => {
        if (this.unmounted || records.get(record.id) !== record || !record.refAttached || this.readHostAttachment(record.id) && !forcedDetaches?.has(record.id)) {
          return;
        }
        runOwnedCommit(record.owner, () => detachRef(record));
      });
    }
    for (const record of ordered(batch.attached, true)) {
      tasks.push(() => {
        if (this.unmounted || records.get(record.id) !== record || record.ref == null || record.refAttached || record.visibility !== "visible" || !this.readHostAttachment(record.id)) {
          return;
        }
        runOwnedCommit(record.owner, () => this.attachHostRef(record));
      });
    }
    runCommitTasks(tasks);
  }
  flushPendingHostAttachmentBatches() {
    const state = this.hostAttachments;
    if (state === null || state.pending.length === 0 || state.registration === null || this.unmounted || this.unmounting || this.pending?.isAwaitingTransportAcknowledgement()) {
      return;
    }
    const batches = state.pending.splice(0);
    const forcedDetaches = batches.map(() => /* @__PURE__ */ new Set());
    const laterAttachments = /* @__PURE__ */ new Set();
    for (let index = batches.length - 1; index >= 0; index--) {
      const batch = batches[index];
      for (const id of batch.attached) laterAttachments.add(id);
      for (const id of batch.detached) {
        if (laterAttachments.has(id)) forcedDetaches[index].add(id);
      }
    }
    runCommitTasks(
      batches.map(
        (batch, index) => () => this.processHostAttachmentBatch(batch, forcedDetaches[index])
      )
    );
  }
  disposeHostAttachments() {
    const state = this.hostAttachments;
    if (state === null) return;
    const registration = state.registration;
    this.hostAttachments = null;
    state.registration = null;
    state.records.clear();
    state.pending.splice(0);
    state.flushScheduled = false;
    registration?.unsubscribe();
  }
  /** @internal Shared with the DOM-owned boundary facade. */
  __scheduleMicrotask(callback) {
    if (this.microtaskScheduler !== null) {
      this.microtaskScheduler(callback);
      return;
    }
    const scheduler = readGlobalMicrotaskScheduler();
    if (scheduler === void 0) {
      throw new Error("The global queueMicrotask scheduler became unavailable.");
    }
    scheduler.call(globalThis, callback);
  }
  /** @internal Shared with the DOM-owned boundary facade. */
  __runCommitTasks(tasks) {
    runCommitTasks(tasks);
  }
  hasAsyncTransport() {
    return this.transport?.mode === "async";
  }
  hasHostBindingUnsupportedConfiguration() {
    return this.transport !== null || this.bridge !== null;
  }
  dropHostBindings(record) {
    const attached = this.boundHosts?.get(record);
    if (attached === void 0) return NO_PENDING_PASSIVE_ERROR;
    this.boundHosts.delete(record);
    this.dirtyBoundHostSet.delete(record);
    const dirtyIndex = this.dirtyBoundHosts.indexOf(record);
    if (dirtyIndex !== -1) this.dirtyBoundHosts.splice(dirtyIndex, 1);
    let unsubscribeError = NO_PENDING_PASSIVE_ERROR;
    for (let index = 0; index < attached.length; index++) {
      const source = attached[index].binding.source;
      const group = this.boundSources.get(source);
      if (group === void 0) continue;
      const position = group.records.indexOf(record);
      if (position >= 0) group.records.splice(position, 1);
      if (group.records.length === 0) {
        this.boundSources.delete(source);
        try {
          group.unsubscribe();
        } catch (error) {
          if (unsubscribeError === NO_PENDING_PASSIVE_ERROR) unsubscribeError = error;
        }
      }
    }
    return unsubscribeError;
  }
  commitHostBindings(record, next) {
    const bindings = next.hostBindings;
    if (bindings === void 0 || next.visibility !== "visible") {
      return this.dropHostBindings(record);
    }
    const previous = this.boundHosts?.get(record);
    if (previous !== void 0 && previous.length === bindings.size) {
      let unchanged = true;
      let index = 0;
      for (const [name, binding] of bindings) {
        const current = previous[index++];
        if (current.name !== name || current.binding !== binding) {
          unchanged = false;
          break;
        }
      }
      if (unchanged) return NO_PENDING_PASSIVE_ERROR;
    }
    const unsubscribeError = this.dropHostBindings(record);
    const connected = [];
    (this.boundHosts ??= /* @__PURE__ */ new Map()).set(record, connected);
    try {
      for (const [name, binding] of bindings) {
        connected.push({ name, binding });
        let group = this.boundSources.get(binding.source);
        if (group === void 0) {
          group = { records: [], unsubscribe: () => {
          } };
          this.boundSources.set(binding.source, group);
          group.records.push(record);
          try {
            group.unsubscribe = this.subscribeHostBindingSource(binding.source);
          } catch (error) {
            this.boundSources.delete(binding.source);
            throw error;
          }
        } else if (!group.records.includes(record)) group.records.push(record);
        const value = this.encodeHostProp(next.type, name, binding.getSnapshot());
        if (!sameUniversalHostPropValue(record.props[name], value)) {
          this.queueHostBindingUpdate(record);
        }
      }
    } catch (error) {
      this.dropHostBindings(record);
      throw error;
    }
    return unsubscribeError;
  }
  subscribeHostBindingSource(source) {
    return source.subscribe(() => this.queueHostBindingSource(source));
  }
  queueHostBindingUpdate(record) {
    if (this.unmounted || this.unmounting || !this.boundHosts?.has(record)) return;
    if (!this.dirtyBoundHostSet.has(record)) {
      this.dirtyBoundHostSet.add(record);
      this.dirtyBoundHosts.push(record);
    }
    this.scheduleHostBindingUpdate();
  }
  queueHostBindingSource(source) {
    if (this.unmounted || this.unmounting || !this.boundSources.has(source)) return;
    if (!this.dirtyBoundSourceSet.has(source)) {
      this.dirtyBoundSourceSet.add(source);
      this.dirtyBoundSources.push(source);
    }
    this.scheduleHostBindingUpdate();
  }
  scheduleHostBindingUpdate() {
    SCHEDULED_UNIVERSAL_ROOTS.add(this);
    if (this.boundHostScheduled) return;
    this.boundHostScheduled = true;
    this.__scheduleMicrotask(() => {
      if (this.boundHostScheduled) this.flushHostBindingUpdates();
    });
  }
  restoreDirtyHostBindings(records) {
    this.boundHostScheduled = false;
    if (!this.scheduled) SCHEDULED_UNIVERSAL_ROOTS.delete(this);
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      if (this.boundHosts?.has(record) && !this.dirtyBoundHostSet.has(record)) {
        this.dirtyBoundHostSet.add(record);
        this.dirtyBoundHosts.push(record);
      }
    }
  }
  /** @internal Restore a binding-only batch abandoned before host acceptance. */
  restoreAbortedHostBindingRecords(records) {
    this.restoreDirtyHostBindings(records);
  }
  flushHostBindingUpdates() {
    if (this.dirtyBoundHosts.length === 0 && this.dirtyBoundSources.length === 0 || this.unmounted || this.unmounting) {
      this.boundHostScheduled = false;
      if (!this.scheduled) SCHEDULED_UNIVERSAL_ROOTS.delete(this);
      return;
    }
    if (this.pending !== null || this.scheduled) {
      this.boundHostScheduled = false;
      if (!this.scheduled) SCHEDULED_UNIVERSAL_ROOTS.delete(this);
      return;
    }
    this.boundHostScheduled = false;
    SCHEDULED_UNIVERSAL_ROOTS.delete(this);
    let records = this.dirtyBoundHosts;
    const sources = this.dirtyBoundSources;
    this.dirtyBoundHosts = [];
    this.dirtyBoundHostSet.clear();
    this.dirtyBoundSources = [];
    this.dirtyBoundSourceSet.clear();
    if (sources.length === 1 && records.length === 0) {
      records = this.boundSources.get(sources[0])?.records.slice() ?? [];
    } else if (sources.length !== 0) {
      const seen = new Set(records);
      for (let index = 0; index < sources.length; index++) {
        const group = this.boundSources.get(sources[index]);
        if (group === void 0) continue;
        for (let recordIndex = 0; recordIndex < group.records.length; recordIndex++) {
          const record = group.records[recordIndex];
          if (!seen.has(record)) {
            seen.add(record);
            records.push(record);
          }
        }
      }
    }
    const changedRecords = [];
    const commands = [];
    const soleSource = sources.length === 1 ? sources[0] : null;
    let soleSourceRead = false;
    let soleSourceSnapshot;
    const otherSourceSnapshots = sources.length > 1 ? /* @__PURE__ */ new Map() : null;
    try {
      for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
        const record = records[recordIndex];
        const connected = this.boundHosts?.get(record);
        if (connected === void 0 || record.visibility !== "visible") continue;
        let next = null;
        for (let bindingIndex = 0; bindingIndex < connected.length; bindingIndex++) {
          const { name, binding } = connected[bindingIndex];
          let raw;
          if (binding.source === soleSource) {
            if (!soleSourceRead) {
              soleSourceSnapshot = binding.source.get();
              soleSourceRead = true;
            }
            raw = soleSourceSnapshot;
          } else if (otherSourceSnapshots !== null && sources.includes(binding.source)) {
            if (!otherSourceSnapshots.has(binding.source)) {
              otherSourceSnapshots.set(binding.source, binding.source.get());
            }
            raw = otherSourceSnapshots.get(binding.source);
          } else {
            raw = binding.source.get();
          }
          const selected = binding.select(raw);
          const current = (next ?? record.props)[name];
          if (this.driver.props === void 0 && sameUniversalHostPropValue(current, selected))
            continue;
          const value = this.encodeHostProp(record.type, name, selected);
          if (sameUniversalHostPropValue(current, value)) continue;
          (next ??= { ...record.props })[name] = value;
        }
        if (next === null) continue;
        const kind = this.driver.updates?.classify(record.type, record.props, next) ?? "update";
        if (kind !== "update" || record.lifecycles.size !== 0) {
          throw new Error(
            "Experimental host bindings require update-only hosts without lifecycle callbacks."
          );
        }
        Object.freeze(next);
        changedRecords.push(record);
        commands.push({ op: "update", id: record.id, props: next });
      }
    } catch (error) {
      this.restoreDirtyHostBindings(records);
      throw error;
    }
    if (commands.length === 0) return;
    const batch = freezeUniversalHostBatch(this.renderer, this.nextBatchVersion++, commands);
    let prepared;
    try {
      prepared = this.driver.prepareBatch(this.container, batch, {
        invokeLocalCallback: (listener, args) => this.invokeLocalCallback(listener, args)
      });
    } catch (error) {
      this.restoreDirtyHostBindings(records);
      throw error;
    }
    if (!isValidPreparedHostBatch(prepared)) {
      this.restoreDirtyHostBindings(records);
      throw new TypeError("Invalid host binding batch token.");
    }
    const transaction = new UniversalBoundHostTransaction(
      this,
      batch,
      prepared,
      changedRecords,
      records
    );
    this.pending = transaction;
    transaction.commit();
  }
  enqueueAsyncWork(work) {
    const run = async () => {
      try {
        await work();
      } catch (error) {
        if (this.asyncWorkError === NO_PENDING_PASSIVE_ERROR) this.asyncWorkError = error;
      }
    };
    this.asyncWork = this.asyncWork.then(run, run);
  }
  flushQueuedTransportWork() {
    if (this.unmounted || this.unmounting) return;
    if (this.scheduled) this.flushScheduledWork();
    const replay = this.queuedReplay;
    if (this.bridge === null && replay !== null && replay.active) this.runReplay(replay);
  }
  async flushTransport() {
    while (true) {
      const unmount = this.unmountPromise;
      if (unmount !== null) {
        try {
          await unmount;
        } catch {
        }
      }
      this.flushQueuedTransportWork();
      const pending = this.asyncWork;
      await pending;
      if (this.unmountPromise !== null || this.unmounting && !this.unmounted) continue;
      if (pending === this.asyncWork && (this.unmounted || !this.scheduled && (this.bridge !== null || this.queuedReplay === null || !this.queuedReplay.active))) {
        break;
      }
    }
    if (this.asyncWorkError !== NO_PENDING_PASSIVE_ERROR) {
      const error = this.asyncWorkError;
      this.asyncWorkError = NO_PENDING_PASSIVE_ERROR;
      throw error;
    }
  }
  transportIdentity(version) {
    return Object.freeze({
      protocol: UNIVERSAL_TRANSPORT_PROTOCOL_VERSION,
      renderer: this.renderer,
      root: this.transportRoot,
      version
    });
  }
  validateTransportAcknowledgement(message, version) {
    this.validateTransportIdentity(message, version, "acknowledgement");
    if (message.type !== "ack") {
      throw new Error(`Universal transport expected an acknowledgement for batch ${version}.`);
    }
  }
  validateTransportIdentity(message, version, label) {
    if (message.protocol !== UNIVERSAL_TRANSPORT_PROTOCOL_VERSION) {
      throw new Error(
        `Universal transport ${label} uses protocol ${String(message.protocol)}; expected ${UNIVERSAL_TRANSPORT_PROTOCOL_VERSION}.`
      );
    }
    if (message.renderer !== this.renderer) {
      throw new Error(
        `Universal transport ${label} renderer ${JSON.stringify(message.renderer)} does not match ${JSON.stringify(this.renderer)}.`
      );
    }
    if (message.root !== this.transportRoot) {
      throw new Error(`Universal transport ${label} belongs to a stale or foreign root.`);
    }
    if (message.version !== version) {
      throw new Error(
        `Universal transport ${label} version ${message.version} does not match batch ${version}.`
      );
    }
  }
  markBatchAccepted(version) {
    if (version <= this.acceptedBatchVersion) {
      throw new Error(
        `Universal transport rejected stale accepted batch version ${version}; current version is ${this.acceptedBatchVersion}.`
      );
    }
    this.acceptedBatchVersion = version;
  }
  setBridge(bridge) {
    if (this.bridge !== null && this.bridge !== bridge) {
      throw new Error("A universal root cannot be owned by more than one host boundary.");
    }
    this.bridge = bridge;
  }
  clearBridge(bridge) {
    if (this.bridge === bridge) this.bridge = null;
  }
  readBridgeContext(context) {
    const value = this.bridge === null ? context.defaultValue : this.bridge.readContext(context);
    if (this.bridge !== null && CURRENT_ATTEMPT?.root === this) {
      (CURRENT_ATTEMPT.bridgeContextReads ??= /* @__PURE__ */ new Map()).set(context, value);
    }
    return value;
  }
  rootRecordForRetention() {
    return this.rootRecord;
  }
  formatUniversalId(index) {
    const sum = this.universalIdRoot + index;
    const paired = sum * (sum + 1) / 2 + index;
    return `:octane-u${paired.toString(36)}:`;
  }
  classifyEvent(name) {
    const capability = this.driver.events;
    if (capability === void 0) return null;
    const definitions = this.eventDefinitions ??= /* @__PURE__ */ new Map();
    const cached = definitions.get(name);
    if (cached !== void 0) return cached;
    const definition = capability.classify(name) ?? null;
    if (definitions.size < 128) definitions.set(name, definition);
    return definition;
  }
  materializeStaticHostProps(node) {
    if (node.propsSlot !== void 0 || (node.bindings?.length ?? 0) !== 0) return null;
    const source = node.props ?? EMPTY_STATIC_HOST_PROPS;
    if (source === EMPTY_STATIC_HOST_PROPS) return EMPTY_STATIC_HOST_PROPS;
    if (this.driver.props !== void 0 && this.driver.capabilities?.stableStaticHostProps !== true) {
      return null;
    }
    const cache = this.staticHostProps ??= /* @__PURE__ */ new WeakMap();
    const cached = cache.get(node);
    if (cached !== void 0) return cached;
    if (Object.getOwnPropertySymbols(source).length !== 0) {
      cache.set(node, null);
      return null;
    }
    const names = Object.keys(source);
    for (const name of names) {
      const value = source[name];
      if (name === "ref" || name === "key" || name === "children" || name.startsWith("main-thread:") || value !== null && (typeof value === "object" || typeof value === "function" || typeof value === "symbol") || this.classifyLifecycle(name, value) !== null || this.classifyLocalCallback(name, value) !== null || this.classifyEvent(name) !== null) {
        cache.set(node, null);
        return null;
      }
    }
    let props = source;
    for (const name of names) {
      const encoded = this.encodeHostProp(node.type, name, source[name]);
      if (!Object.is(encoded, source[name])) {
        if (props === source) props = { ...source };
        props[name] = encoded;
      }
    }
    Object.freeze(props);
    cache.set(node, props);
    return props;
  }
  prepareCollapsedTemplateProgram(compiled) {
    if (this.driver.capabilities?.templateProgramMount !== true || this.driver.capabilities?.stableStaticHostProps !== true || this.textPolicy() !== "host") {
      return null;
    }
    const cache = this.templatePrograms ??= /* @__PURE__ */ new WeakMap();
    const cached = cache.get(compiled);
    if (cached !== void 0) return cached;
    const wireNodes = [];
    const wireEvents = [];
    const values = [];
    const events = [];
    const sharedNodes = [];
    const reject = () => {
      cache.set(compiled, null);
      return null;
    };
    for (let index = 0; index < compiled.plans.length; index++) {
      const node = compiled.plans[index];
      const shape = compiled.shape[index];
      if (node.kind === "slot" || node.kind === "text") {
        if (node.kind === "text" && node.slot === void 0) {
          const props = Object.freeze({ value: String(node.value ?? "") });
          wireNodes.push(Object.freeze({ type: shape.type, parent: shape.parent, props }));
          sharedNodes.push(Object.freeze({ props }));
        } else {
          const valueIndex = values.length;
          values.push({ node: index, name: "value", slot: node.slot, text: true });
          const binding = Object.freeze({ name: "value", valueIndex });
          wireNodes.push(
            Object.freeze({
              type: shape.type,
              parent: shape.parent,
              props: EMPTY_STATIC_HOST_PROPS,
              bindings: Object.freeze([binding])
            })
          );
          sharedNodes.push(null);
        }
        continue;
      }
      const source = node.props ?? EMPTY_STATIC_HOST_PROPS;
      const overwritten = /* @__PURE__ */ new Set();
      for (const [name] of node.bindings ?? []) {
        if (overwritten.has(name)) return reject();
        overwritten.add(name);
      }
      let staticProps;
      if (overwritten.size === 0) {
        const shared = this.materializeStaticHostProps(node);
        if (shared === null) return reject();
        staticProps = shared;
      } else {
        let output = null;
        for (const name of Object.keys(source)) {
          if (overwritten.has(name)) continue;
          const entry = source[name];
          if (!isUniversalHostTemplateProgramValue(entry) || this.classifyLifecycle(name, entry) !== null || this.classifyLocalCallback(name, entry) !== null || this.classifyEvent(name) !== null) {
            return reject();
          }
          const encoded = this.encodeHostProp(node.type, name, entry);
          if (!isUniversalHostTemplateProgramValue(encoded)) return reject();
          (output ??= {})[name] = encoded;
        }
        staticProps = output === null ? EMPTY_STATIC_HOST_PROPS : Object.freeze(output);
      }
      const bindings = [];
      let eventful = false;
      const types = /* @__PURE__ */ new Set();
      for (const [name, slot] of node.bindings ?? []) {
        const definition = this.classifyEvent(name);
        if (definition !== null) {
          if (index === 0 || types.has(definition.type)) return reject();
          types.add(definition.type);
          const priority = definition.priority ?? "default";
          wireEvents.push(Object.freeze({ node: index, type: definition.type, priority }));
          events.push({ node: index, prop: name, slot, type: definition.type, priority });
          eventful = true;
          continue;
        }
        const valueIndex = values.length;
        values.push({ node: index, name, slot, text: false });
        bindings.push(Object.freeze({ name, valueIndex }));
      }
      wireNodes.push(
        Object.freeze({
          type: shape.type,
          parent: shape.parent,
          props: staticProps,
          ...bindings.length === 0 ? null : { bindings: Object.freeze(bindings) }
        })
      );
      sharedNodes.push(
        bindings.length === 0 && !eventful ? Object.freeze({ props: staticProps }) : null
      );
    }
    const prepared = Object.freeze({
      wire: Object.freeze({ nodes: Object.freeze(wireNodes), events: Object.freeze(wireEvents) }),
      values: Object.freeze(values),
      events: Object.freeze(events),
      sharedNodes: Object.freeze(sharedNodes)
    });
    cache.set(compiled, prepared);
    return prepared;
  }
  expandCollapsedTemplate(record) {
    const state = record.collapsedTemplate;
    if (state === void 0) return;
    const events = /* @__PURE__ */ new Map();
    for (const entry of state.events) {
      let current = events.get(entry.index);
      if (current === void 0) events.set(entry.index, current = /* @__PURE__ */ new Map());
      current.set(entry.event.type, entry.event);
    }
    invalidateLogicalTreeFeatures(record);
    const records = [record];
    for (let index = 1; index < state.shape.length; index++) {
      const node = materializeCommittedCollapsedNode(state, index);
      const child = {
        id: node.id ?? state.firstId + index,
        kind: "host",
        key: null,
        type: state.shape[index].type,
        props: node.props,
        ref: null,
        refCleanup: null,
        refAttached: false,
        owner: state.owner,
        events: events.get(index) ?? EMPTY_COMMITTED_EVENTS,
        lifecycles: EMPTY_COMMITTED_HOST_CALLBACKS,
        localCallbacks: EMPTY_COMMITTED_HOST_CALLBACKS,
        visibility: "visible",
        portalRegistration: null,
        parent: records[state.shape[index].parent],
        children: [],
        treeFeatures: null
      };
      records.push(child);
      child.parent.children.push(child);
    }
    delete record.collapsedTemplate;
    this.collapsedTemplates?.delete(record);
  }
  expandCollapsedTemplates() {
    const records = this.collapsedTemplates;
    if (records === null || records.size === 0) return;
    for (const record of [...records]) this.expandCollapsedTemplate(record);
  }
  classifyLifecycle(name, value) {
    return this.driver.lifecycles?.classify(name, value) ?? null;
  }
  classifyLocalCallback(name, value) {
    return this.driver.localCallbacks?.classify(name, value) ?? null;
  }
  textPolicy() {
    return this.driver.capabilities?.text ?? "reject";
  }
  driverCapabilities() {
    return this.driver.capabilities ?? {};
  }
  canCompactCompilerLeafProps() {
    return this.transport === null && this.driver.props === void 0 && this.driver.capabilities?.compilerLeafProps === true;
  }
  acquirePortalTargetHandle(id, pendingEntries) {
    if (typeof id !== "string" && typeof id !== "number" || String(id).length === 0) {
      throw new TypeError(
        "A universal portal target handle ID must be a non-empty string or number."
      );
    }
    let entry = this.portalHandles.get(id);
    if (entry === void 0) {
      entry = {
        handle: Object.freeze({
          $$kind: "octane.universal.portal-target",
          renderer: this.renderer,
          root: this.portalRoot,
          id
        }),
        registrations: 0,
        pending: 0
      };
      this.portalHandles.set(id, entry);
    }
    entry.pending++;
    pendingEntries.push(entry);
    return entry.handle;
  }
  releasePortalHandleEntry(entry) {
    if (entry.registrations === 0 && entry.pending === 0 && this.portalHandles.get(entry.handle.id) === entry) {
      this.portalHandles.delete(entry.handle.id);
    }
  }
  preparePortalTarget(target) {
    const capability = this.driver.portals;
    if (capability === void 0) {
      throw new Error(
        `Universal renderer ${JSON.stringify(this.renderer)} does not declare the portal capability.`
      );
    }
    const pendingEntries = [];
    let release = null;
    try {
      const registration = capability.prepareTarget({
        container: this.container,
        renderer: this.renderer,
        target,
        transported: this.transport !== null,
        createPortalTargetHandle: (id) => this.acquirePortalTargetHandle(id, pendingEntries)
      });
      release = registration !== null && typeof registration === "object" && typeof registration.release === "function" ? registration.release.bind(registration) : null;
      if (registration === null || typeof registration !== "object" || release === null) {
        throw new TypeError(
          "A universal portal capability must return a valid target registration."
        );
      }
      const handle = registration.handle;
      const entry = handle !== null && typeof handle === "object" ? this.portalHandles.get(handle.id) : void 0;
      if (handle?.$$kind !== "octane.universal.portal-target" || handle.renderer !== this.renderer || handle.root !== this.portalRoot || typeof handle.id !== "string" && typeof handle.id !== "number" || entry?.handle !== handle) {
        throw new Error(
          `Universal portal target handle does not belong to renderer ${JSON.stringify(this.renderer)} and this root.`
        );
      }
      const registrationRelease = release;
      let released = false;
      const prepared = Object.freeze({
        handle,
        release: () => {
          if (released) return;
          released = true;
          try {
            registrationRelease();
          } finally {
            entry.registrations--;
            this.releasePortalHandleEntry(entry);
          }
        }
      });
      entry.registrations++;
      return prepared;
    } catch (error) {
      try {
        release?.();
      } catch {
      }
      throw error;
    } finally {
      for (const entry of pendingEntries) {
        entry.pending--;
        this.releasePortalHandleEntry(entry);
      }
    }
  }
  encodeHostProp(hostType, name, value) {
    const codec = this.driver.props;
    if (codec === void 0) {
      return this.transport === null ? value : cloneSerializableValue(value);
    }
    const createResourceHandle = this.codecResourceHandle ??= (id) => {
      if (typeof id !== "string" && typeof id !== "number" || String(id).length === 0) {
        throw new TypeError("A universal resource handle ID must be a non-empty string or number.");
      }
      return Object.freeze({
        $$kind: "octane.universal.resource",
        renderer: this.renderer,
        root: this.resourceRoot,
        id
      });
    };
    const result = codec.encode({
      container: this.container,
      renderer: this.renderer,
      hostType,
      name,
      value,
      createResourceHandle
    });
    if (result === null || typeof result !== "object") {
      throw new TypeError(
        `Universal prop codec for ${JSON.stringify(name)} returned an invalid result.`
      );
    }
    if (result.kind === "unsupported") {
      throw new TypeError(
        result.reason ?? `Universal renderer ${JSON.stringify(this.renderer)} does not support host prop ${JSON.stringify(name)}.`
      );
    }
    if (result.kind === "value") return cloneSerializableValue(result.value);
    if (result.kind !== "resource") {
      throw new TypeError(
        `Universal prop codec for ${JSON.stringify(name)} returned unknown encoding ${JSON.stringify(result.kind)}.`
      );
    }
    const handle = result.handle;
    if (handle?.$$kind !== "octane.universal.resource" || handle.renderer !== this.renderer || handle.root !== this.resourceRoot || typeof handle.id !== "string" && typeof handle.id !== "number") {
      throw new Error(
        `Universal resource handle for ${JSON.stringify(name)} does not belong to renderer ${JSON.stringify(this.renderer)} and this root.`
      );
    }
    return handle;
  }
  eventScope(priority, run) {
    if (priority !== "discrete" && priority !== "continuous" && priority !== "default") {
      throw new TypeError(`Unknown universal event priority ${JSON.stringify(priority)}.`);
    }
    if (this.eventScopeDepth > 0) {
      if (this.eventScopePriority !== priority) {
        throw new Error(
          `Nested universal event scopes must retain priority ${JSON.stringify(this.eventScopePriority)}.`
        );
      }
      this.eventScopeDepth++;
      try {
        return run();
      } finally {
        this.eventScopeDepth--;
      }
    }
    this.eventScopeDepth = 1;
    this.eventScopePriority = priority;
    this.eventScopeHandlers = this.handlers;
    if (priority === "discrete") UNIVERSAL_DISCRETE_EVENT_DEPTH++;
    try {
      return run();
    } finally {
      if (priority === "discrete") UNIVERSAL_DISCRETE_EVENT_DEPTH--;
      this.eventScopeDepth = 0;
      this.eventScopePriority = null;
      this.eventScopeHandlers = null;
      if (this.scheduled) {
        if (priority === "discrete") this.flushScheduledWork();
        else this.queueScheduledWork();
      }
    }
  }
  dispatchEvent(listener, payload) {
    if (this.eventScopeDepth === 0) {
      const event2 = this.handlers.get(listener);
      if (event2 === void 0 || event2.owner.disposed) {
        throw new Error(`Unknown or inactive universal event listener ${listener}.`);
      }
      return this.eventScope(event2.priority, () => this.dispatchEvent(listener, payload));
    }
    const event = this.eventScopeHandlers.get(listener);
    if (event === void 0) {
      throw new Error(`Unknown or inactive universal event listener ${listener}.`);
    }
    let result;
    try {
      result = event.handler(payload);
    } catch (error) {
      if (!routeUniversalOwnerError(event.owner, error)) throw error;
    }
    return result;
  }
  dispatchTransportEvent(message) {
    if (this.unmounted) {
      throw new Error("Cannot dispatch a transported event to an unmounted universal root.");
    }
    this.validateTransportIdentity(message, this.acceptedBatchVersion, "event");
    if (message.type !== "event") {
      throw new Error("Universal transport expected an event message.");
    }
    if (message.priority !== "discrete" && message.priority !== "continuous" && message.priority !== "default") {
      throw new TypeError(`Unknown universal event priority ${JSON.stringify(message.priority)}.`);
    }
    for (const { listener } of message.deliveries) {
      const event = this.handlers.get(listener);
      if (event === void 0 || event.owner.disposed) {
        throw new Error(`Unknown or inactive universal event listener ${listener}.`);
      }
      if (event.priority !== message.priority) {
        throw new Error(
          `Universal event listener ${listener} has priority ${JSON.stringify(event.priority)}, not transported priority ${JSON.stringify(message.priority)}.`
        );
      }
    }
    let errors = null;
    const results = this.eventScope(message.priority, () => {
      const values = new Array(message.deliveries.length);
      for (let index = 0; index < message.deliveries.length; index++) {
        const { listener, payload } = message.deliveries[index];
        try {
          values[index] = this.dispatchEvent(listener, payload);
        } catch (error) {
          (errors ??= []).push(error);
        }
      }
      return values;
    });
    const dispatchedErrors = errors;
    if (dispatchedErrors !== null) {
      if (dispatchedErrors.length === 1) throw dispatchedErrors[0];
      throw typeof AggregateError === "function" ? new AggregateError(dispatchedErrors, "Multiple universal event listeners failed.") : dispatchedErrors[0];
    }
    return results;
  }
  invokeLocalCallback(listener, args) {
    const callback = this.localCallbacks.get(listener);
    if (callback === void 0 || callback.owner.disposed) {
      throw new Error(`Unknown or inactive universal local callback ${listener}.`);
    }
    let result;
    runOwnedCommit(callback.owner, () => {
      result = callback.handler(...args);
    });
    if (typeof result !== "function") return result;
    const cleanup = result;
    return () => runOwnedCommit(callback.owner, cleanup);
  }
  scheduledRenderInput() {
    const pendingInput = this.suspended ?? (this.queuedReplay?.active === true ? this.queuedReplay : null);
    const component = pendingInput?.component ?? this.retryRenderInput?.[0] ?? this.lastComponent;
    if (component === null) return null;
    return [component, pendingInput?.props ?? this.retryRenderInput?.[1] ?? this.lastProps];
  }
  retryRejectedScheduledAttempt(attempt, component, props) {
    if (attempt.status !== "aborted" || this.unmounted || this.unmounting) return;
    this.retryRenderInput = [component, props];
    this.schedule();
  }
  restoreRejectedReplay(attempt, replay) {
    if (attempt.status !== "aborted" || this.unmounted || this.unmounting) return;
    if (this.queuedReplay !== null && this.queuedReplay !== replay && this.queuedReplay.active) {
      return;
    }
    let transitionBatches = replay.transitionBatches;
    if (replay.transitionRender) {
      const merged = new Set(replay.transitionBatches);
      for (const batch of this.takeScheduledTransitionBatches()) merged.add(batch);
      transitionBatches = merged;
    } else {
      for (const batch of replay.transitionBatches) {
        this.scheduledTransitionBatches.delete(batch);
        this.unattemptedTransitionBatches.delete(batch);
      }
    }
    if (!this.scheduledUrgent) {
      this.scheduled = false;
      SCHEDULED_UNIVERSAL_ROOTS.delete(this);
    }
    const restored = {
      entries: replay.entries,
      component: replay.component,
      props: replay.props,
      transitionBatches,
      transitionRender: replay.transitionRender,
      active: true,
      asyncWorkQueued: false
    };
    this.queueReplay(restored);
  }
  flushScheduledWork() {
    if (!this.scheduled) {
      this.flushHostBindingUpdates();
      return;
    }
    if (this.unmounting) return;
    this.scheduled = false;
    SCHEDULED_UNIVERSAL_ROOTS.delete(this);
    if (this.unmounted || this.owner?.disposed || this.lastComponent === null) {
      this.flushHostBindingUpdates();
      return;
    }
    if (this.bridge !== null) {
      this.bridge.invalidate();
    } else if (this.hasAsyncTransport()) {
      this.enqueueAsyncWork(async () => {
        while (this.pending?.isAwaitingTransportAcknowledgement()) {
          const pending = this.pending;
          try {
            await pending.commitAsync();
          } catch {
          }
        }
        if (this.unmounting) await this.waitForProvisionalUnmount();
        if (this.unmounted) return;
        const input = this.scheduledRenderInput();
        if (input === null) return;
        let attempt;
        try {
          attempt = this.__prepareScheduled(input[0], input[1]);
        } catch (error) {
          if (!reportUniversalUncaughtError(this, error)) throw error;
          return;
        }
        if (attempt.status === "prepared") {
          try {
            await attempt.commitAsync();
          } catch (error) {
            this.retryRejectedScheduledAttempt(attempt, input[0], input[1]);
            throw error;
          }
        }
      });
    } else {
      const input = this.scheduledRenderInput();
      if (input === null) {
        this.flushHostBindingUpdates();
        return;
      }
      let attempt;
      try {
        attempt = this.__prepareScheduled(input[0], input[1]);
      } catch (error) {
        try {
          if (!reportUniversalUncaughtError(this, error)) throw error;
        } finally {
          this.flushHostBindingUpdates();
        }
        return;
      }
      let commitError = NO_PENDING_PASSIVE_ERROR;
      try {
        if (attempt.status === "prepared") attempt.commit();
      } catch (error) {
        commitError = error;
      }
      let bindingError = NO_PENDING_PASSIVE_ERROR;
      try {
        this.flushHostBindingUpdates();
      } catch (error) {
        bindingError = error;
      }
      if (commitError !== NO_PENDING_PASSIVE_ERROR && bindingError !== NO_PENDING_PASSIVE_ERROR) {
        throw typeof AggregateError === "function" ? new AggregateError(
          [commitError, bindingError],
          "Universal host commit and binding update both failed."
        ) : commitError;
      }
      if (commitError !== NO_PENDING_PASSIVE_ERROR) throw commitError;
      if (bindingError !== NO_PENDING_PASSIVE_ERROR) throw bindingError;
    }
  }
  queueScheduledWork() {
    if (!this.scheduled) return;
    if (this.unmounting) return;
    if (UNIVERSAL_SYNC_DEPTH > 0) return;
    if (this.bridge !== null) {
      this.scheduled = false;
      SCHEDULED_UNIVERSAL_ROOTS.delete(this);
      this.bridge.invalidate();
      return;
    }
    this.__scheduleMicrotask(() => this.flushScheduledWork());
  }
  markUrgentScheduled() {
    if (this.unmounted || this.owner?.disposed || this.lastComponent === null) return;
    this.scheduledUrgent = true;
    if (this.scheduled) return;
    this.scheduled = true;
    SCHEDULED_UNIVERSAL_ROOTS.add(this);
    if (this.eventScopeDepth === 0 && UNIVERSAL_SYNC_DEPTH === 0) this.queueScheduledWork();
  }
  scheduleOwned(owner) {
    if (owner.root !== this || owner.disposed) return;
    this.scheduledOwners.add(owner);
    for (let current = owner; current !== null && current.dirtyEpoch !== this.dirtyEpoch; current = current.parent) {
      current.dirtyEpoch = this.dirtyEpoch;
    }
    this.markUrgentScheduled();
  }
  schedule() {
    this.scheduledFullRoot = true;
    this.markUrgentScheduled();
  }
  /** @internal Associates promoted transition work with its accepting transaction. */
  scheduleTransition(batch) {
    if (batch.settled || this.unmounted || this.owner?.disposed || this.lastComponent === null) {
      finishUniversalTransitionRoot(batch, this);
      return;
    }
    this.scheduledTransitionBatches.add(batch);
    this.unattemptedTransitionBatches.add(batch);
    this.ensureScheduledTransitionWork();
  }
  ensureScheduledTransitionWork() {
    if (this.scheduledTransitionBatches.size === 0 || this.unmounted || this.owner?.disposed || this.lastComponent === null) {
      return;
    }
    let runnable = false;
    for (const batch of [...this.scheduledTransitionBatches]) {
      const state = this.transitionQueueState(batch);
      if (state === "none") {
        this.scheduledTransitionBatches.delete(batch);
        finishUniversalTransitionRoot(batch, this);
      } else if (state === "runnable") {
        runnable = true;
      }
    }
    if (!runnable) return;
    if (this.scheduled) return;
    this.scheduled = true;
    SCHEDULED_UNIVERSAL_ROOTS.add(this);
    if (this.eventScopeDepth === 0 && UNIVERSAL_SYNC_DEPTH === 0) this.queueScheduledWork();
  }
  requeueTransitionBatches(batches) {
    for (const batch of batches) {
      if (batch.settled) continue;
      this.scheduledTransitionBatches.add(batch);
      this.unattemptedTransitionBatches.add(batch);
    }
  }
  transitionQueueState(batch) {
    let state = "none";
    const needsFirstAttempt = this.unattemptedTransitionBatches.has(batch);
    const visit = (owner) => {
      if (state === "runnable") return;
      for (const queue of owner.updates.values()) {
        if (queue.batches?.includes(batch) !== true) continue;
        state = needsFirstAttempt || owner.visibility !== "suspense-hidden" ? "runnable" : "blocked";
        if (state === "runnable") return;
      }
      for (const child of owner.children) visit(child);
    };
    if (this.owner !== null) visit(this.owner);
    return state;
  }
  detachCompletedTransitionBatch(batch) {
    const visit = (owner) => {
      if (owner.visibility !== "suspense-hidden") {
        for (const queue of owner.updates.values()) {
          const batches = queue.batches;
          if (batches === void 0 || !batches.includes(batch)) continue;
          for (let index = 0; index < batches.length; index++) {
            if (batches[index] === batch) batches[index] = null;
          }
        }
      }
      for (const child of owner.children) visit(child);
    };
    if (this.owner !== null) visit(this.owner);
  }
  completeTransitionBatches(batches) {
    for (const batch of batches) {
      if (batch.settled) continue;
      this.detachCompletedTransitionBatch(batch);
      if (this.transitionQueueState(batch) === "none") {
        finishUniversalTransitionRoot(batch, this);
      } else {
        this.scheduledTransitionBatches.add(batch);
      }
    }
  }
  takeScheduledTransitionBatches() {
    if (this.scheduledTransitionBatches.size === 0) return EMPTY_UNIVERSAL_TRANSITION_BATCHES;
    const batches = new Set(this.scheduledTransitionBatches);
    this.scheduledTransitionBatches.clear();
    for (const batch of batches) this.unattemptedTransitionBatches.delete(batch);
    return batches;
  }
  finishTransitionBatches(batches) {
    for (const batch of batches) finishUniversalTransitionRoot(batch, this);
  }
  /** @internal Drops canceled lane entries without disturbing later rebase updates. */
  discardTransitionBatch(batch) {
    this.scheduledTransitionBatches.delete(batch);
    this.unattemptedTransitionBatches.delete(batch);
    for (const owner of batch.updates.keys()) {
      if (owner.root === this) batch.updates.delete(owner);
    }
    const visit = (owner) => {
      for (const [slot, queue] of owner.updates) {
        const batches = queue.batches;
        if (batches === void 0 || !batches.includes(batch)) continue;
        const values = [];
        const remainingBatches = [];
        const rebases = [];
        for (let index = 0; index < queue.length; index++) {
          if (batches[index] === batch) continue;
          values.push(queue[index]);
          remainingBatches.push(batches[index]);
          rebases.push(queue.rebases?.[index] ?? false);
        }
        if (values.length === 0) {
          owner.updates.delete(slot);
        } else if (remainingBatches.every((remaining) => remaining === null) && rebases.every(Boolean)) {
          owner.updates.delete(slot);
        } else {
          queue.length = 0;
          queue.push(...values);
          queue.batches = remainingBatches;
          if (rebases.some(Boolean)) queue.rebases = rebases;
          else delete queue.rebases;
        }
      }
      for (const child of owner.children) visit(child);
    };
    if (this.owner !== null) visit(this.owner);
  }
  // A live replay still owns suspended regions that a scoped update or a
  // retained subtree can leave untouched in this attempt. Hand its memo cache
  // to the fresh render so that render re-attempts those regions itself;
  // discarding the replay would drop the only scheduled retry and leave
  // pending content on screen after its thenables have already settled.
  absorbableReplay(component) {
    const replay = this.awaitingReplay?.active === true ? this.awaitingReplay : this.queuedReplay?.active === true ? this.queuedReplay : null;
    if (replay === null || replay.transitionRender || replay.component !== component) return null;
    return replay;
  }
  cancelSuspendedReplays(preserveTransitions = false) {
    if (this.awaitingReplay === null && this.queuedReplay === null && this.rootRetryAttempt === null) {
      return;
    }
    const batches = /* @__PURE__ */ new Set();
    for (const batch of this.awaitingReplay?.transitionBatches ?? []) batches.add(batch);
    for (const batch of this.queuedReplay?.transitionBatches ?? []) batches.add(batch);
    for (const batch of this.rootRetryAttempt?.transitionBatches ?? []) batches.add(batch);
    if (this.awaitingReplay !== null) this.awaitingReplay.active = false;
    if (this.queuedReplay !== null) this.queuedReplay.active = false;
    this.awaitingReplay = null;
    this.queuedReplay = null;
    this.rootRetryAttempt = null;
    if (preserveTransitions) this.requeueTransitionBatches(batches);
    else this.finishTransitionBatches(batches);
  }
  runReplay(replay) {
    if (!replay.active || this.queuedReplay !== replay || this.unmounted || this.unmounting) return;
    if (this.hasAsyncTransport()) {
      if (replay.asyncWorkQueued) return;
      replay.asyncWorkQueued = true;
      this.enqueueAsyncWork(async () => {
        try {
          if (this.unmounting) await this.waitForProvisionalUnmount();
          if (!replay.active || this.queuedReplay !== replay || this.unmounted || this.unmounting) {
            return;
          }
          this.queuedReplay = null;
          replay.active = false;
          this.rootRetryAttempt = null;
          let attempt2;
          try {
            attempt2 = this.prepareWithReplay(
              replay.component,
              replay.props,
              replay.entries,
              replay.transitionBatches,
              replay.transitionRender,
              false
            );
          } catch (error) {
            const batches = new Set(replay.transitionBatches);
            for (const batch of this.takeScheduledTransitionBatches()) batches.add(batch);
            this.finishTransitionBatches(batches);
            if (!reportUniversalUncaughtError(this, error)) throw error;
            return;
          }
          if (attempt2.status === "prepared") {
            try {
              await attempt2.commitAsync();
            } catch (error) {
              this.restoreRejectedReplay(attempt2, replay);
              throw error;
            }
          } else {
            this.ensureScheduledTransitionWork();
          }
        } finally {
          replay.asyncWorkQueued = false;
        }
      });
      return;
    }
    this.queuedReplay = null;
    replay.active = false;
    this.rootRetryAttempt = null;
    let attempt;
    try {
      attempt = this.prepareWithReplay(
        replay.component,
        replay.props,
        replay.entries,
        replay.transitionBatches,
        replay.transitionRender,
        false
      );
    } catch (error) {
      const batches = new Set(replay.transitionBatches);
      for (const batch of this.takeScheduledTransitionBatches()) batches.add(batch);
      this.finishTransitionBatches(batches);
      if (!reportUniversalUncaughtError(this, error)) throw error;
      return;
    }
    if (attempt.status === "prepared") attempt.commit();
    else this.ensureScheduledTransitionWork();
  }
  queueReplay(replay) {
    if (!replay.active || this.unmounted) return;
    if (this.awaitingReplay === replay) this.awaitingReplay = null;
    if (this.queuedReplay === replay) return;
    if (this.queuedReplay !== null) {
      this.queuedReplay.active = false;
      this.finishTransitionBatches(this.queuedReplay.transitionBatches);
    }
    this.queuedReplay = replay;
    if (this.bridge !== null) {
      this.bridge.invalidate();
      return;
    }
    this.__scheduleMicrotask(() => this.runReplay(replay));
  }
  resumeAfterRejectedUnmount() {
    this.unmounting = false;
    if (this.hostAttachments !== null) this.queueHostAttachmentFlush();
    if (this.scheduled) this.queueScheduledWork();
    const replay = this.queuedReplay;
    if (replay === null || !replay.active) return;
    if (this.bridge !== null) this.bridge.invalidate();
    else this.__scheduleMicrotask(() => this.runReplay(replay));
  }
  async waitForProvisionalUnmount() {
    while (this.unmounting && !this.unmounted) {
      const unmount = this.unmountPromise;
      if (unmount === null) {
        await Promise.resolve();
        continue;
      }
      try {
        await unmount;
      } catch {
      }
    }
  }
  publishLocalReplay(thenables, entries, component, props) {
    if (this.awaitingReplay !== null) this.awaitingReplay.active = false;
    const replay = {
      entries,
      component,
      props,
      transitionBatches: EMPTY_UNIVERSAL_TRANSITION_BATCHES,
      transitionRender: false,
      active: true,
      asyncWorkQueued: false
    };
    this.awaitingReplay = replay;
    for (const thenable of thenables) {
      resumeOnSettle(thenable, () => this.queueReplay(replay));
    }
  }
  suspend(thenable, component, props, replayEntries, transitionBatches, transitionRender, bridgeContextReads) {
    const attempt = new UniversalSuspendedAttemptImpl(
      this,
      thenable,
      component,
      props,
      replayEntries,
      transitionBatches,
      transitionRender,
      bridgeContextReads
    );
    this.suspended = attempt;
    if (!transitionRender && this.bridge !== null) {
      this.urgentBoundarySuspension = attempt;
      const releaseProjection = () => {
        if (this.urgentBoundarySuspension !== attempt) return;
        this.urgentBoundarySuspension = null;
        this.ensureScheduledTransitionWork();
      };
      resumeOnSettle(thenable, releaseProjection);
    }
    return attempt;
  }
  finishSuspension(attempt, schedule, preserveTransitions = false) {
    if (schedule && this.urgentBoundarySuspension === attempt) {
      this.urgentBoundarySuspension = null;
    }
    if (this.suspended === attempt) this.suspended = null;
    else if (this.rootRetryAttempt !== attempt) return;
    if (!schedule || this.unmounted) {
      if (this.rootRetryAttempt === attempt) {
        this.rootRetryAttempt = null;
        if (this.queuedReplay !== null) this.queuedReplay.active = false;
        this.queuedReplay = null;
      }
      if (preserveTransitions) this.requeueTransitionBatches(attempt.transitionBatches);
      else this.finishTransitionBatches(attempt.transitionBatches);
      return;
    }
    this.rootRetryAttempt = attempt;
    this.queueReplay({
      entries: attempt.replayEntries,
      component: attempt.component,
      props: attempt.props,
      transitionBatches: attempt.transitionBatches,
      transitionRender: attempt.transitionRender,
      active: true,
      asyncWorkQueued: false
    });
  }
  flushPassiveTasks() {
    PENDING_UNIVERSAL_PASSIVE_ROOTS.delete(this);
    this.passiveScheduled = false;
    if (this.passiveTasks.length === 0) return;
    const tasks = this.passiveTasks.splice(0);
    runCommitTasks(tasks);
  }
  enqueuePassive(task) {
    this.passiveTasks.push(task);
    PENDING_UNIVERSAL_PASSIVE_ROOTS.add(this);
    if (this.passiveScheduled) return;
    this.passiveScheduled = true;
    this.__scheduleMicrotask(() => {
      this.flushPassiveTasks();
    });
  }
  flushPassivesBeforeRender() {
    this.flushPassiveTasks();
  }
  discardDraftOwners(owners) {
    const committed = /* @__PURE__ */ new Set();
    const collect = (owner) => {
      if (owner === null || committed.has(owner)) return;
      committed.add(owner);
      for (const child of owner.children) collect(child);
    };
    collect(this.owner);
    for (const draft of owners) {
      if (committed.has(draft.record)) continue;
      draft.record.disposed = true;
      draft.record.componentProps = null;
      draft.record.range = null;
      draft.record.updates.clear();
      for (const hook of draft.hooks.values()) {
        if (hook.kind === "effect-event") hook.cell.active = false;
      }
    }
  }
  /** @internal Preserves scheduler lane provenance through host-boundary renders. */
  __prepareScheduled(component, props) {
    this.scheduledPreparationDepth++;
    try {
      return this.prepare(component, props);
    } finally {
      this.scheduledPreparationDepth--;
    }
  }
  /** @internal Separates renderer-root invalidation from coalesced host input updates. */
  __prepareBoundaryScheduled(component, props) {
    const urgentSuspension = this.suspended !== null && !this.suspended.transitionRender ? this.suspended : null;
    const urgentProjection = this.urgentBoundarySuspension;
    const previousUrgentAttempt = urgentProjection ?? urgentSuspension;
    const previousComponent = previousUrgentAttempt?.component ?? this.lastComponent;
    const previousProps = previousUrgentAttempt?.props ?? this.lastProps;
    const previousContextReads = previousUrgentAttempt?.bridgeContextReads ?? this.bridgeContextReads;
    let inputsChanged = component !== previousComponent || !universalShallowEqual(previousProps, props);
    if (!inputsChanged && previousContextReads !== null) {
      for (const [context, previousValue] of previousContextReads) {
        const value = this.bridge === null ? context.defaultValue : this.bridge.readContext(context);
        if (!Object.is(value, previousValue)) {
          inputsChanged = true;
          break;
        }
      }
    }
    const urgentReplay = this.queuedReplay?.active === true && !this.queuedReplay.transitionRender;
    if (urgentProjection !== null && !this.scheduledUrgent && !urgentReplay && !inputsChanged) {
      return {
        attempt: urgentProjection,
        transition: false,
        projectedThenable: urgentProjection.thenable
      };
    }
    const transition = urgentSuspension === null && !this.scheduledUrgent && !urgentReplay && !inputsChanged;
    return {
      attempt: transition ? this.__prepareScheduled(component, props) : this.prepare(component, props),
      transition,
      projectedThenable: null
    };
  }
  // A local state update may replay only the component range that owns its hook.
  // The retained topology check keeps reconciliation atomic: features that need
  // root-wide coordination, or any structural change, fall back to the ordinary
  // full-root attempt before a host batch is prepared.
  prepareOwnedUpdate(target, component, props) {
    const range = target.range;
    if (this.transport !== null || this.bridge !== null || target.component === null || target.componentProps === null || ownerTreeHasWarmPlan(target) || range === null || range.kind !== "range" || range.owner !== target || target.visibility === "suspense-hidden") {
      return null;
    }
    for (let ancestor = target.parent; ancestor !== null; ancestor = ancestor.parent) {
      if (ancestor.boundaryThenable !== null || ancestor.isBoundary && ancestor.hasBoundaryError) {
        return null;
      }
    }
    const unsupported = UNIVERSAL_TREE_PORTAL | UNIVERSAL_TREE_REGION;
    const scopeFeatures = range === this.rootRecord ? this.treeFeatures : logicalTreeFeatures(range);
    if ((scopeFeatures & unsupported) !== 0) return null;
    this.flushPassivesBeforeRender();
    this.pending?.abort();
    const owner = draftOwner(target, null, [
      {
        component: target.component,
        identityPath: target.identityPath,
        key: target.key,
        ordinal: 0
      }
    ]);
    owner.componentRevision = universalComponentRevision(target.component);
    const previousAttempt = CURRENT_ATTEMPT;
    const previousOwner = CURRENT_OWNER;
    const previousWarm = CURRENT_UNIVERSAL_WARM;
    const previousWarmClaims = CURRENT_UNIVERSAL_WARM_CLAIMS;
    const previousWarmPlans = ACTIVE_UNIVERSAL_WARM_PLANS.slice();
    const attempt = {
      root: this,
      owner,
      scope: target,
      owners: [owner],
      draftLookup: null,
      treeFeatures: 0,
      hasCompactLists: false,
      replayEntries: [],
      retryThenables: /* @__PURE__ */ new Set(),
      nextUniversalId: this.nextUniversalId,
      implicitSlot: 0,
      transitionBatches: EMPTY_UNIVERSAL_TRANSITION_BATCHES,
      transitionRender: false,
      bridgeContextReads: null,
      // The owned-update guards already require a plain urgent local-driver
      // attempt, which is exactly the retain-eligible shape.
      retainEligible: true,
      retainedCount: 0,
      dirtyEpoch: this.attemptDirtyEpoch
    };
    ACTIVE_UNIVERSAL_WARM_PLANS.length = 0;
    CURRENT_UNIVERSAL_WARM = null;
    CURRENT_UNIVERSAL_WARM_CLAIMS = null;
    CURRENT_ATTEMPT = attempt;
    CURRENT_OWNER = owner;
    let nodes;
    try {
      nodes = executeOwner(owner, () => {
        const value = target.component(target.componentProps, componentContext(this.renderer));
        return materializeValue(value, this.renderer, null, [...target.identityPath, "output"]);
      });
    } catch (error) {
      this.discardDraftOwners(attempt.owners);
      if (error instanceof UniversalSuspense) {
        UNIVERSAL_WARM_CACHES.delete(this);
        return null;
      }
      for (let ancestor = target.parent; ancestor !== null; ancestor = ancestor.parent) {
        if (ancestor.isBoundary) {
          UNIVERSAL_WARM_CACHES.delete(this);
          return null;
        }
      }
      throw error;
    } finally {
      ACTIVE_UNIVERSAL_WARM_PLANS.length = 0;
      ACTIVE_UNIVERSAL_WARM_PLANS.push(...previousWarmPlans);
      CURRENT_UNIVERSAL_WARM = previousWarm;
      CURRENT_UNIVERSAL_WARM_CLAIMS = previousWarmClaims;
      CURRENT_ATTEMPT = previousAttempt;
      CURRENT_OWNER = previousOwner;
    }
    if (attempt.retryThenables.size !== 0 || (attempt.treeFeatures & unsupported) !== 0) {
      this.discardDraftOwners(attempt.owners);
      UNIVERSAL_WARM_CACHES.delete(this);
      return null;
    }
    const blueprint = {
      kind: "range",
      // The committed range key: rangeKey for an ownerRange() scope, null for
      // the root range, so the reapplied key never drifts from what the full
      // render path would commit.
      key: range.key,
      owner: target,
      children: nodes
    };
    if (attempt.hasCompactLists) this.expandCompactLeafLists(blueprint);
    let scopePlacement = null;
    if (range !== this.rootRecord && !stableLogicalChildren(range.children, blueprint.children)) {
      scopePlacement = this.scopePhysicalPlacement(range);
      if (scopePlacement === null) {
        this.discardDraftOwners(attempt.owners);
        UNIVERSAL_WARM_CACHES.delete(this);
        return null;
      }
    }
    try {
      const transaction = this.createPreparedTransaction(
        blueprint,
        attempt,
        component,
        props,
        /* @__PURE__ */ new Set(),
        range,
        scopeFeatures,
        scopePlacement
      );
      this.pending = transaction;
      return transaction;
    } catch (error) {
      this.discardDraftOwners(attempt.owners);
      throw error;
    }
  }
  // The physical frame a scoped range commits into: its nearest host (or
  // container) ancestor plus the first physical host that follows the scope
  // inside that parent. Untouched siblings cannot move during a scoped commit,
  // so both stay valid anchors for inserted or reordered scope content. A
  // portal or detached ancestor owns a separate physical tree: no frame.
  scopePhysicalPlacement(scope) {
    let endAnchor = null;
    let current = scope;
    for (let parent = current.parent; parent !== null; current = parent, parent = current.parent) {
      if (parent.kind !== "host" && parent.kind !== "range") return null;
      if (endAnchor === null) {
        const siblings = parent.children;
        for (let index = siblings.indexOf(current) + 1; index < siblings.length; index++) {
          const found = physicalRecords([siblings[index]]);
          if (found.length !== 0) {
            endAnchor = found[0].id;
            break;
          }
        }
      }
      if (parent.kind === "host") return { parent: parent.id, endAnchor };
      if (parent === this.rootRecord) return { parent: null, endAnchor };
    }
    return null;
  }
  // A scheduled owner that cannot replay alone (an anonymous @for-item owner,
  // or several owners raised by one event scope) still has one smallest
  // ancestor whose retained props and range can replay every queued update:
  // the nearest enclosing component owner of their common ancestor.
  resolveScopedTarget() {
    let scope = null;
    for (const owner of this.scheduledOwners) {
      if (owner.disposed) continue;
      if (owner.visibility === "suspense-hidden") return void 0;
      scope = scope === null ? owner : commonOwnerAncestor(scope, owner);
      if (scope === null) return void 0;
    }
    let target = null;
    for (let current = scope; current !== null; current = current.parent) {
      if (current.component !== null && current.componentProps !== null && current.range !== null) {
        target = current;
        break;
      }
    }
    if (target === null) return void 0;
    for (const owner of this.scheduledOwners) {
      if (owner.disposed) continue;
      for (let current = owner; current !== target; current = current.parent) {
        if (current === null || current.boundaryThenable !== null || current.isBoundary && current.hasBoundaryError) {
          return void 0;
        }
      }
    }
    return target;
  }
  prepare(component, props) {
    const ownedTarget = this.scheduledPreparationDepth > 0 && this.scheduledUrgent && !this.scheduledFullRoot && this.scheduledOwners.size !== 0 ? this.resolveScopedTarget() : void 0;
    const scheduledUrgent = this.scheduledUrgent || this.scheduledPreparationDepth === 0;
    this.attemptFullRootScheduled = this.scheduledFullRoot;
    this.attemptDirtyEpoch = this.dirtyEpoch;
    this.dirtyEpoch++;
    this.scheduledUrgent = false;
    this.scheduledFullRoot = false;
    this.scheduledOwners.clear();
    if (scheduledUrgent) this.urgentBoundarySuspension = null;
    const bridgeReplay = this.bridge === null ? null : this.queuedReplay;
    if (!scheduledUrgent && bridgeReplay !== null && bridgeReplay.component === component && bridgeReplay.active) {
      const scheduledTransitions2 = this.takeScheduledTransitionBatches();
      this.queuedReplay = null;
      bridgeReplay.active = false;
      this.rootRetryAttempt = null;
      const transitions = /* @__PURE__ */ new Set([...bridgeReplay.transitionBatches, ...scheduledTransitions2]);
      try {
        return this.prepareWithReplay(
          component,
          props,
          bridgeReplay.entries,
          transitions,
          !scheduledUrgent && (bridgeReplay.transitionRender || scheduledTransitions2.size !== 0)
        );
      } catch (error) {
        this.finishTransitionBatches(transitions);
        throw error;
      }
    }
    this.suspended?.abort(true);
    const absorbedReplay = this.absorbableReplay(component);
    this.cancelSuspendedReplays(true);
    const scheduledTransitions = scheduledUrgent ? EMPTY_UNIVERSAL_TRANSITION_BATCHES : this.takeScheduledTransitionBatches();
    UNIVERSAL_WARM_CACHES.delete(this);
    try {
      if (absorbedReplay === null && ownedTarget !== void 0 && component === this.lastComponent && universalShallowEqual(props, this.lastProps)) {
        const ownedAttempt = this.prepareOwnedUpdate(ownedTarget, component, props);
        if (ownedAttempt !== null) return ownedAttempt;
      }
      const attempt = this.prepareWithReplay(
        component,
        props,
        absorbedReplay?.entries ?? [],
        scheduledTransitions,
        !scheduledUrgent && scheduledTransitions.size !== 0,
        absorbedReplay === null
      );
      if (scheduledUrgent && attempt.status === "suspended") {
        this.ensureScheduledTransitionWork();
      }
      return attempt;
    } catch (error) {
      this.finishTransitionBatches(scheduledTransitions);
      if (scheduledUrgent) {
        this.finishTransitionBatches(this.takeScheduledTransitionBatches());
      }
      throw error;
    }
  }
  prepareWithReplay(component, props, replayEntries, transitionBatches, transitionRender, allowRetain = true) {
    if (this.unmounted || this.unmounting) {
      throw new Error("Cannot render an unmounted universal root.");
    }
    this.flushPassivesBeforeRender();
    const metadata = getComponentMetadata(component);
    if (metadata !== UNIVERSAL_LAZY_METADATA && metadata.id !== this.renderer) {
      throw new Error(
        `Universal renderer mismatch: root ${JSON.stringify(this.renderer)} cannot render component ${JSON.stringify(metadata.id)}.`
      );
    }
    this.pending?.abort();
    this.suspended?.abort();
    const ownerRecord = this.owner?.component === component ? this.owner : createOwnerRecord(this, component, null, ["root"], null);
    const rootPath = [
      { component, identityPath: ownerRecord.identityPath, key: ownerRecord.key, ordinal: 0 }
    ];
    const owner = draftOwner(ownerRecord, null, rootPath);
    owner.componentProps = props;
    owner.componentRevision = universalComponentRevision(component);
    const previousAttempt = CURRENT_ATTEMPT;
    const previousOwner = CURRENT_OWNER;
    const previousWarm = CURRENT_UNIVERSAL_WARM;
    const previousWarmClaims = CURRENT_UNIVERSAL_WARM_CLAIMS;
    const previousWarmPlans = ACTIVE_UNIVERSAL_WARM_PLANS.slice();
    const attempt = {
      root: this,
      owner,
      scope: null,
      owners: [owner],
      draftLookup: null,
      treeFeatures: 0,
      hasCompactLists: false,
      replayEntries,
      retryThenables: /* @__PURE__ */ new Set(),
      nextUniversalId: this.nextUniversalId,
      implicitSlot: 0,
      transitionBatches,
      transitionRender,
      bridgeContextReads: null,
      // Replay, transition, and bridge attempts re-execute every owner for
      // their own bookkeeping. An ordinary transported full-root commit can
      // adopt unchanged subtrees: its acknowledgement still covers the whole
      // tree, and committed hosts and listeners remain published.
      retainEligible: allowRetain && this.bridge === null && !this.attemptFullRootScheduled && replayEntries.length === 0 && transitionBatches.size === 0 && !transitionRender,
      retainedCount: 0,
      dirtyEpoch: this.attemptDirtyEpoch
    };
    ACTIVE_UNIVERSAL_WARM_PLANS.length = 0;
    CURRENT_UNIVERSAL_WARM = null;
    CURRENT_UNIVERSAL_WARM_CLAIMS = null;
    CURRENT_ATTEMPT = attempt;
    CURRENT_OWNER = owner;
    let nodes;
    try {
      nodes = executeOwner(owner, () => {
        const value = component(props, componentContext(this.renderer));
        return materializeValue(value, this.renderer, null, [
          ...ownerRecord.identityPath,
          "output"
        ]);
      });
    } catch (error) {
      const suspendedMemos = attempt.retainedCount !== 0 ? [] : collectSuspendedMemos(attempt);
      this.discardDraftOwners(attempt.owners);
      if (error instanceof UniversalSuspense) {
        return this.suspend(
          error.thenable,
          component,
          props,
          suspendedMemos,
          transitionBatches,
          transitionRender,
          attempt.bridgeContextReads
        );
      }
      throw error;
    } finally {
      ACTIVE_UNIVERSAL_WARM_PLANS.length = 0;
      ACTIVE_UNIVERSAL_WARM_PLANS.push(...previousWarmPlans);
      CURRENT_UNIVERSAL_WARM = previousWarm;
      CURRENT_UNIVERSAL_WARM_CLAIMS = previousWarmClaims;
      CURRENT_ATTEMPT = previousAttempt;
      CURRENT_OWNER = previousOwner;
    }
    try {
      const rootBlueprint = {
        kind: "range",
        key: null,
        owner: owner.record,
        children: nodes
      };
      const transaction = this.createTransaction(rootBlueprint, attempt, component, props);
      this.pending = transaction;
      return transaction;
    } catch (error) {
      this.discardDraftOwners(attempt.owners);
      throw error;
    }
  }
  render(component, props) {
    if (this.hasAsyncTransport()) {
      throw new Error("A transported universal root must use renderAsync().");
    }
    const attempt = this.prepare(component, props);
    if (attempt.status === "prepared") attempt.commit();
    return attempt;
  }
  async renderAsync(component, props) {
    const attempt = this.prepare(component, props);
    if (attempt.status === "prepared") await attempt.commitAsync();
    return attempt;
  }
  stableAttemptOwnersEqual(attempt) {
    const contextValuesEqual = (previous, next) => {
      if (previous === null || next === null) return previous === next;
      if (previous.size !== next.size) return false;
      for (const [context, value] of next) {
        if (!previous.has(context) || !Object.is(previous.get(context), value)) return false;
      }
      return true;
    };
    let ownerCount = 0;
    const validateOwner = (draft, parent) => {
      ownerCount++;
      const record = draft.record;
      if (!record.mounted || record.disposed || record.parent !== (parent?.record ?? null) || record.visibility !== draft.visibility || record.isBoundary !== draft.isBoundary || record.canHandleSuspense !== draft.canHandleSuspense || record.hasBoundaryError !== draft.hasBoundaryError || !Object.is(record.boundaryError, draft.boundaryError) || record.boundaryThenable !== draft.boundaryThenable || !contextValuesEqual(record.contextValues, draft.contextValues) || draft.appliedUpdates.size !== 0 || record.updates.size !== 0 || record.children.length !== draft.children.length || record.effectOrder.length !== draft.seenEffects.length || record.hooks.size !== draft.hooks.size) {
        return false;
      }
      for (let index = 0; index < draft.children.length; index++) {
        if (record.children[index] !== draft.children[index].record) return false;
      }
      for (let index = 0; index < draft.seenEffects.length; index++) {
        const next = draft.seenEffects[index];
        const previous = record.effectOrder[index];
        if (previous.kind !== "effect" || next.previous !== previous || next.phase !== previous.phase || !previous.mounted || !depsEqual(previous.deps, next.deps)) {
          return false;
        }
      }
      for (const hook of draft.hooks.values()) if (hook.kind !== "effect") return false;
      for (const child of draft.children) if (!validateOwner(child, draft)) return false;
      return true;
    };
    return validateOwner(attempt.owner, null) && ownerCount === attempt.owners.length;
  }
  compactLeafProps(list, index) {
    const cached = list.props[index];
    if (cached !== void 0) return cached;
    if (list.host === null) {
      throw new Error("A compact universal leaf list has no host plan.");
    }
    const host = list.host;
    const props = host.props === void 0 ? {} : { ...host.props };
    const values = list.values[index];
    const bindings = host.bindings;
    if (bindings !== void 0) {
      for (let bindingIndex = 0; bindingIndex < bindings.length; bindingIndex++) {
        const binding = bindings[bindingIndex];
        props[binding[0]] = values[binding[1]];
      }
    }
    if (this.driver.props !== void 0 || this.transport !== null) {
      for (const name of Object.keys(props)) {
        props[name] = this.encodeHostProp(host.type, name, props[name]);
      }
    }
    if (list.propCount < 0) list.propCount = Object.keys(props).length;
    list.props[index] = props;
    return props;
  }
  expandCompactLeafLists(node) {
    let expanded = null;
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index];
      const list = child.kind === "range" ? child.compactLeafList : void 0;
      const templates = child.kind === "range" ? child.compactTemplateList : void 0;
      if (list === void 0 && templates === void 0) {
        this.expandCompactLeafLists(child);
        if (expanded !== null) expanded.push(child);
        continue;
      }
      expanded ??= node.children.slice(0, index);
      const hosts = [];
      if (templates !== void 0) {
        for (let templateIndex = 0; templateIndex < templates.keys.length; templateIndex++) {
          const host = preparedCollapsedTemplateBlueprint(
            templates.plan,
            templates.compiled,
            templates.program,
            templates.values[templateIndex],
            templates.captures[templateIndex],
            templates.owner
          );
          host.key = templates.keys[templateIndex];
          hosts.push(host);
        }
      } else if (list.host !== null) {
        const host = list.host;
        for (let leafIndex = 0; leafIndex < list.keys.length; leafIndex++) {
          hosts.push({
            kind: "host",
            key: list.keys[leafIndex],
            type: host.type,
            props: this.compactLeafProps(list, leafIndex),
            ref: null,
            owner: list.owners?.[leafIndex] ?? list.owner,
            events: EMPTY_BLUEPRINT_EVENTS,
            lifecycles: EMPTY_BLUEPRINT_HOST_CALLBACKS,
            localCallbacks: EMPTY_BLUEPRINT_HOST_CALLBACKS,
            visibility: list.visibility,
            children: []
          });
        }
      }
      if (child.key === null) expanded.push(...hosts);
      else expanded.push({ kind: "range", key: child.key, children: hosts });
    }
    if (expanded !== null) node.children = expanded;
  }
  tryCreateCompactTemplateUpdateTransaction(blueprint, attempt, component, props) {
    const owner = this.owner;
    const draftOwner2 = attempt.owner;
    if (this.driver.capabilities?.templateProgramRuns !== true || owner === null || draftOwner2.record !== owner || attempt.owners.length !== 1 || owner.children.length !== 0 || draftOwner2.children.length !== 0 || owner.effectOrder.length !== 0 || draftOwner2.seenEffects.length !== 0 || owner.contextValues !== null || draftOwner2.contextValues !== null || owner.visibility !== "visible" || draftOwner2.visibility !== "visible" || owner.isBoundary || draftOwner2.isBoundary || owner.componentRevision !== draftOwner2.componentRevision || owner.hooks.size !== draftOwner2.hooks.size || attempt.scope !== null || attempt.retryThenables.size !== 0 || attempt.replayEntries.length !== 0 || attempt.transitionBatches.size !== 0 || attempt.transitionRender || this.bridge !== null || ((this.treeFeatures | attempt.treeFeatures) & ~UNIVERSAL_TREE_EVENT) !== 0) {
      return null;
    }
    for (const [slot, hook] of draftOwner2.hooks) {
      const previous = owner.hooks.get(slot);
      if (previous === void 0 || previous.kind !== hook.kind || hook.kind !== "state" && hook.kind !== "reducer" || hook.kind === "state" && "linked" in hook) {
        return null;
      }
    }
    for (const [slot, queue] of owner.updates) {
      const applied = draftOwner2.appliedUpdates.get(slot);
      if (applied === void 0 || applied.lane || applied.queue !== queue || queue.batches) {
        return null;
      }
    }
    const shells = [];
    const lists = [];
    const pair = (records, blueprints) => {
      let recordIndex = 0;
      for (const next of blueprints) {
        const list = next.kind === "range" ? next.compactTemplateList : void 0;
        if (list !== void 0) {
          if (next.key !== null || list.owner !== owner || list.keys.length !== list.values.length || list.keys.length !== list.captures.length) {
            return false;
          }
          const start = recordIndex;
          for (let index = 0; index < list.keys.length; index++) {
            const record2 = records[recordIndex++];
            const state = record2?.collapsedTemplate;
            if (record2 === void 0 || record2.kind !== "host" || !Object.is(record2.key, list.keys[index]) || record2.type !== list.program.wire.nodes[0].type || record2.owner !== owner || record2.children.length !== 0 || record2.ref != null || record2.events.size !== 0 || state?.prepared !== list.program || state.values === void 0 || state.firstId === void 0 || state.events.length !== list.program.events.length) {
              return false;
            }
          }
          lists.push({ list, records, start });
          continue;
        }
        const record = records[recordIndex++];
        if (record === void 0 || !sameRecordShape(record, next) || record.kind === "portal") {
          return false;
        }
        if (record.kind === "range") {
          if (next.kind !== "range" || next.compactLeafList !== void 0 || record.owner !== (next.owner ?? null) || !pair(record.children, next.children)) {
            return false;
          }
          continue;
        }
        if (next.kind !== "host" || record.owner !== next.owner || record.ref != null || next.ref != null || record.events.size !== 0 || next.events.size !== 0 || record.lifecycles.size !== 0 || next.lifecycles.size !== 0 || record.localCallbacks.size !== 0 || next.localCallbacks.size !== 0 || record.visibility !== "visible" || next.visibility !== "visible" || record.collapsedTemplate !== void 0 || next.collapsedTemplate !== void 0 || !pair(record.children, next.children)) {
          return false;
        }
        shells.push({ record, blueprint: next });
      }
      return recordIndex === records.length;
    };
    if (!pair(this.rootRecord.children, blueprint.children) || lists.length === 0) return null;
    const commands = [];
    const rowUpdates = [];
    const recreatedEvents = [];
    const stageUpdate = (type, id, previous, next) => {
      const kind = this.driver.updates?.classify(type, previous, next) ?? "update";
      if (kind !== "update" && kind !== "recreate") {
        throw new TypeError(
          `Universal update classifier returned invalid kind ${JSON.stringify(kind)}.`
        );
      }
      commands.push(
        kind === "recreate" ? { op: "recreate", id, type, props: Object.freeze(next) } : { op: "update", id, props: Object.freeze(next) }
      );
      return kind;
    };
    for (const { record, blueprint: host } of shells) {
      if (!shallowPropsEqual(record.props, host.props)) {
        stageUpdate(host.type, record.id, record.props, host.props);
      }
    }
    for (const { list, records, start } of lists) {
      const program = list.program;
      for (let row = 0; row < list.keys.length; row++) {
        const record = records[start + row];
        const accepted = record.collapsedTemplate;
        const values = list.values[row];
        let previousChangedNode = -1;
        for (let valueIndex = 0; valueIndex < program.values.length; valueIndex++) {
          if (Object.is(accepted.values[valueIndex], values[valueIndex])) continue;
          const index = program.values[valueIndex].node;
          if (previousChangedNode === index) continue;
          previousChangedNode = index;
          const next = materializePreparedCollapsedHostProps(program, values, index);
          const previous = index === 0 ? record.props : materializePreparedCollapsedHostProps(program, accepted.values, index);
          const id = accepted.firstId + index;
          const kind = stageUpdate(program.wire.nodes[index].type, id, previous, next);
          if (index === 0) rowUpdates.push({ record, props: next });
          if (kind === "recreate") {
            for (let eventIndex = 0; eventIndex < program.events.length; eventIndex++) {
              const site = program.events[eventIndex];
              if (site.node !== index) continue;
              const event = accepted.events[eventIndex].event;
              recreatedEvents.push({
                id,
                type: site.type,
                listener: { id: event.listener, priority: site.priority }
              });
            }
          }
        }
        for (let eventIndex = 0; eventIndex < program.events.length; eventIndex++) {
          const site = program.events[eventIndex];
          const previous = accepted.events[eventIndex];
          if (previous.index !== site.node || previous.event.type !== site.type || typeof list.captures[row][site.slot] !== "function") {
            return null;
          }
        }
      }
    }
    for (const event of recreatedEvents) commands.push({ op: "event", ...event });
    const batch = freezeUniversalHostBatch(this.renderer, this.nextBatchVersion++, commands);
    const identity = this.transportIdentity(batch.version);
    const prepareHost = (value) => this.driver.prepareBatch(this.container, value, {
      invokeLocalCallback: (listener, args) => this.invokeLocalCallback(listener, args)
    });
    let sync = null;
    let async = null;
    if (this.transport?.mode === "async") {
      async = this.transport.prepareBatch(this.container, batch, identity);
    } else {
      sync = this.transport === null ? prepareHost(batch) : this.transport.prepareBatch(this.container, batch, prepareHost);
    }
    const prepared = sync ?? async;
    if (!isValidPreparedHostBatch(prepared)) {
      throw new TypeError("A universal host driver must return a valid prepared batch token.");
    }
    return new UniversalTransactionImpl(
      this,
      batch,
      sync === null ? null : () => sync.apply(),
      async === null ? null : (acknowledge) => async.apply(acknowledge),
      identity,
      () => {
        for (const { record, blueprint: host } of shells) record.props = host.props;
        for (const update of rowUpdates) update.record.props = update.props;
        for (const { list, records, start } of lists) {
          const program = list.program;
          for (let row = 0; row < list.keys.length; row++) {
            const state = records[start + row].collapsedTemplate;
            state.values = list.values[row];
            for (let eventIndex = 0; eventIndex < program.events.length; eventIndex++) {
              const site = program.events[eventIndex];
              const previous = state.events[eventIndex].event;
              const handler = list.captures[row][site.slot];
              if (previous.handler === handler && previous.owner === list.owner) continue;
              const event = {
                prop: site.prop,
                type: site.type,
                priority: site.priority,
                handler,
                owner: list.owner,
                listener: previous.listener
              };
              state.events[eventIndex] = {
                index: site.node,
                event
              };
              this.handlers.set(event.listener, event);
            }
          }
        }
        owner.componentProps = draftOwner2.componentProps;
        owner.componentRevision = draftOwner2.componentRevision;
        owner.hooks = draftOwner2.hooks;
        for (const [slot, applied] of draftOwner2.appliedUpdates) {
          const queue = owner.updates.get(slot);
          if (queue !== applied.queue || applied.lane) continue;
          queue.splice(0, applied.consumed);
          if (queue.length === 0) owner.updates.delete(slot);
        }
        this.owner = owner;
        this.lastComponent = component;
        this.lastProps = props;
        this.retryRenderInput = null;
        this.urgentBoundarySuspension = null;
        this.bridgeContextReads = attempt.bridgeContextReads;
        this.nextUniversalId = attempt.nextUniversalId;
        this.treeFeatures = attempt.treeFeatures;
      },
      () => prepared.afterAccept?.(),
      noopUniversalCommitTask,
      noopUniversalCommitTask,
      noopUniversalCommitTask,
      null,
      () => prepared.abort(),
      () => this.discardDraftOwners(attempt.owners),
      attempt.transitionBatches
    );
  }
  /** Publish stable owner records only after their compact host batch is accepted. */
  publishAcceptedCompactOwners(attempt, component, props) {
    for (const draft of attempt.owners) {
      const record = draft.record;
      record.componentProps = draft.componentProps;
      record.componentRevision = draft.componentRevision;
      record.parent = draft.parent?.record ?? null;
      record.hooks = draft.hooks;
      record.effectOrder = [...draft.seenEffects];
      for (let index = 0; index < draft.seenEffects.length; index++) {
        draft.seenEffects[index].previous = null;
      }
      record.children = draft.children.map((child) => child.record);
      record.contextValues = draft.contextValues;
      record.isBoundary = draft.isBoundary;
      record.canHandleSuspense = draft.canHandleSuspense;
      record.boundaryError = draft.boundaryError;
      record.hasBoundaryError = draft.hasBoundaryError;
      record.boundaryThenable = draft.boundaryThenable;
      record.visibility = draft.visibility;
      record.mounted = true;
      record.disposed = false;
    }
    this.owner = attempt.owner.record;
    this.lastComponent = component;
    this.lastProps = props;
    this.retryRenderInput = null;
    this.urgentBoundarySuspension = null;
    this.bridgeContextReads = attempt.bridgeContextReads;
    this.nextUniversalId = attempt.nextUniversalId;
    this.treeFeatures = 0;
  }
  tryCreateCompactLeafUpdateTransaction(blueprint, attempt, component, props) {
    if (this.transport !== null || this.owner === null || attempt.owner.record !== this.owner || this.treeFeatures !== 0 || attempt.treeFeatures !== 0 || attempt.retryThenables.size !== 0) {
      return null;
    }
    const matches = [];
    let sawCompactList = false;
    const pairChildren = (records, blueprints) => {
      let recordIndex = 0;
      for (const next of blueprints) {
        const list = next.kind === "range" ? next.compactLeafList : void 0;
        if (list !== void 0) {
          sawCompactList = true;
          if (next.key !== null || list.owners !== null) return false;
          if (list.host === null) continue;
          const host = list.host;
          if (list.keys.length !== list.values.length) return false;
          const start = recordIndex;
          for (let leafIndex = 0; leafIndex < list.keys.length; leafIndex++) {
            const record2 = records[recordIndex++];
            if (record2 === void 0 || record2.kind !== "host" || !Object.is(record2.key, list.keys[leafIndex]) || record2.type !== host.type || record2.children.length !== 0 || record2.owner !== list.owner) {
              return false;
            }
          }
          matches.push({ list, records, start });
          continue;
        }
        const record = records[recordIndex++];
        if (record === void 0 || record.kind !== "range" || next.kind !== "range" || !sameRecordShape(record, next) || !pairChildren(record.children, next.children)) {
          return false;
        }
      }
      return recordIndex === records.length;
    };
    if (!pairChildren(this.rootRecord.children, blueprint.children) || !sawCompactList || !this.stableAttemptOwnersEqual(attempt)) {
      return null;
    }
    for (const { list } of matches) {
      for (let index = 0; index < list.keys.length; index++) this.compactLeafProps(list, index);
    }
    const commands = [];
    for (const { list, records, start } of matches) {
      const host = list.host;
      const bindings = host.bindings;
      const lastBinding = bindings === void 0 || bindings.length === 0 ? null : bindings[bindings.length - 1][0];
      for (let index = 0; index < list.keys.length; index++) {
        const record = records[start + index];
        const hostProps = list.props[index];
        if ((lastBinding === null || !hasOwnProp.call(record.props, lastBinding) || !hasOwnProp.call(hostProps, lastBinding) || Object.is(record.props[lastBinding], hostProps[lastBinding])) && shallowPropsEqual(record.props, hostProps, list.propCount)) {
          continue;
        }
        const kind = this.driver.updates?.classify(host.type, record.props, hostProps) ?? "update";
        const frozenProps = Object.freeze(hostProps);
        if (kind === "update") {
          commands.push({ op: "update", id: record.id, props: frozenProps });
        } else if (kind === "recreate") {
          commands.push({
            op: "recreate",
            id: record.id,
            type: host.type,
            props: frozenProps
          });
        } else {
          throw new TypeError(
            `Universal update classifier returned invalid kind ${JSON.stringify(kind)}.`
          );
        }
      }
    }
    if (commands.length === 0) return null;
    const batch = freezeUniversalHostBatch(this.renderer, this.nextBatchVersion++, commands);
    const preparedHost = this.driver.prepareBatch(this.container, batch, {
      invokeLocalCallback: (listener, args) => this.invokeLocalCallback(listener, args)
    });
    if (!isValidPreparedHostBatch(preparedHost)) {
      throw new TypeError("A universal host driver must return a valid prepared batch token.");
    }
    return new UniversalTransactionImpl(
      this,
      batch,
      () => preparedHost.apply(),
      null,
      this.transportIdentity(batch.version),
      () => {
        for (const { list, records, start } of matches) {
          for (let index = 0; index < list.keys.length; index++) {
            records[start + index].props = list.props[index];
          }
        }
        this.publishAcceptedCompactOwners(attempt, component, props);
      },
      () => preparedHost.afterAccept?.(),
      noopUniversalCommitTask,
      noopUniversalCommitTask,
      noopUniversalCommitTask,
      null,
      () => preparedHost.abort(),
      () => this.discardDraftOwners(attempt.owners),
      attempt.transitionBatches
    );
  }
  tryCreateStableLeafUpdateTransaction(blueprint, attempt, component, props) {
    if (this.transport !== null || this.owner === null || attempt.owner.record !== this.owner || this.treeFeatures !== 0 || attempt.treeFeatures !== 0 || attempt.retryThenables.size !== 0) {
      return null;
    }
    if (!this.stableAttemptOwnersEqual(attempt)) return null;
    const hostRecords = [];
    const hostBlueprints = [];
    const commands = [];
    const pairChildren = (records, blueprints) => {
      if (records.length !== blueprints.length) return false;
      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        const next = blueprints[index];
        if (!sameRecordShape(record, next) || record.kind === "portal") return false;
        if (record.kind === "host") {
          if (next.kind !== "host") return false;
          if (record.children.length !== 0 || next.children.length !== 0 || record.owner !== next.owner) {
            return false;
          }
          hostRecords.push(record);
          hostBlueprints.push(next);
        } else if (!pairChildren(record.children, next.children)) {
          return false;
        }
      }
      return true;
    };
    if (!pairChildren(this.rootRecord.children, blueprint.children)) return null;
    for (let index = 0; index < hostRecords.length; index++) {
      const record = hostRecords[index];
      const host = hostBlueprints[index];
      if (shallowPropsEqual(record.props, host.props)) continue;
      const kind = this.driver.updates?.classify(host.type, record.props, host.props) ?? "update";
      const frozenProps = Object.freeze(host.props);
      if (kind === "update") {
        commands.push({ op: "update", id: record.id, props: frozenProps });
      } else if (kind === "recreate") {
        commands.push({
          op: "recreate",
          id: record.id,
          type: host.type,
          props: frozenProps
        });
      } else {
        throw new TypeError(
          `Universal update classifier returned invalid kind ${JSON.stringify(kind)}.`
        );
      }
    }
    if (commands.length === 0) return null;
    const batch = freezeUniversalHostBatch(this.renderer, this.nextBatchVersion++, commands);
    const preparedHost = this.driver.prepareBatch(this.container, batch, {
      invokeLocalCallback: (listener, args) => this.invokeLocalCallback(listener, args)
    });
    if (!isValidPreparedHostBatch(preparedHost)) {
      throw new TypeError("A universal host driver must return a valid prepared batch token.");
    }
    const transaction = new UniversalTransactionImpl(
      this,
      batch,
      () => preparedHost.apply(),
      null,
      this.transportIdentity(batch.version),
      () => {
        for (let index = 0; index < hostRecords.length; index++) {
          const record = hostRecords[index];
          const host = hostBlueprints[index];
          record.props = host.props;
          record.owner = host.owner;
        }
        this.publishAcceptedCompactOwners(attempt, component, props);
      },
      () => preparedHost.afterAccept?.(),
      noopUniversalCommitTask,
      noopUniversalCommitTask,
      noopUniversalCommitTask,
      null,
      () => preparedHost.abort(),
      () => this.discardDraftOwners(attempt.owners),
      attempt.transitionBatches
    );
    return transaction;
  }
  createTransaction(blueprint, attempt, component, props) {
    const hasHostBindings = (this.boundHosts?.size ?? 0) !== 0 || (attempt.treeFeatures & UNIVERSAL_TREE_HOST_BINDING) !== 0;
    if (attempt.hasCompactLists && !hasHostBindings) {
      const compactTemplateUpdate = this.tryCreateCompactTemplateUpdateTransaction(
        blueprint,
        attempt,
        component,
        props
      );
      if (compactTemplateUpdate !== null) return compactTemplateUpdate;
      const compactLeafUpdate = this.tryCreateCompactLeafUpdateTransaction(
        blueprint,
        attempt,
        component,
        props
      );
      if (compactLeafUpdate !== null) return compactLeafUpdate;
    }
    if (attempt.hasCompactLists) this.expandCompactLeafLists(blueprint);
    if (!hasHostBindings) {
      const stableLeafUpdate = this.tryCreateStableLeafUpdateTransaction(
        blueprint,
        attempt,
        component,
        props
      );
      if (stableLeafUpdate !== null) return stableLeafUpdate;
    }
    const stagedPortalRegistrations = /* @__PURE__ */ new Set();
    if (((this.treeFeatures | attempt.treeFeatures) & UNIVERSAL_TREE_PORTAL) === 0) {
      return this.createPreparedTransaction(
        blueprint,
        attempt,
        component,
        props,
        stagedPortalRegistrations
      );
    }
    const preparePortals = (node) => {
      if (node.kind === "portal" && node.registration === null) {
        node.registration = this.preparePortalTarget(node.target);
        stagedPortalRegistrations.add(node.registration);
      }
      for (const child of node.children) preparePortals(child);
    };
    try {
      preparePortals(blueprint);
      return this.createPreparedTransaction(
        blueprint,
        attempt,
        component,
        props,
        stagedPortalRegistrations
      );
    } catch (error) {
      for (const registration of stagedPortalRegistrations) {
        try {
          registration.release();
        } catch {
        }
      }
      throw error;
    }
  }
  createPreparedTransaction(blueprint, attempt, component, props, stagedPortalRegistrations, scopeRecord = this.rootRecord, scopeFeatures = 0, scopePlacement = null) {
    let nextId = this.nextId;
    let nextLogicalRangeId = this.nextLogicalRangeId;
    const scoped = scopeRecord !== this.rootRecord;
    const treeFeatures = (scoped ? scopeFeatures : this.treeFeatures) | attempt.treeFeatures;
    const templateExcludedFeatures = UNIVERSAL_TREE_PORTAL | UNIVERSAL_TREE_REGION | UNIVERSAL_TREE_HIDDEN;
    const compactLogicalRangeIds = this.driver.capabilities?.templateProgramRuns === true && (treeFeatures & templateExcludedFeatures) === 0;
    if ((treeFeatures & templateExcludedFeatures) !== 0) {
      const expandBlueprint = (node) => {
        if (node.kind === "host") expandCollapsedTemplateBlueprint(node);
        for (const child of node.children) expandBlueprint(child);
      };
      expandBlueprint(blueprint);
    }
    const used = /* @__PURE__ */ new Set([scopeRecord]);
    const changedRangeOwners = [];
    let topologyChanged = false;
    const retainedScopes = /* @__PURE__ */ new Set();
    const retainedDraft = (record, blueprint2) => {
      retainedScopes.add(record);
      return { record, blueprint: blueprint2, children: [], isNew: false, hostUpdate: null, retained: true };
    };
    const expandRetained = (marker) => {
      const previousAttempt = CURRENT_ATTEMPT;
      CURRENT_ATTEMPT = attempt;
      try {
        return blueprintFromLogical(marker.retained);
      } finally {
        CURRENT_ATTEMPT = previousAttempt;
      }
    };
    const reconcileCollapsedTemplate = (record, next) => {
      if (record.kind !== "host" || next.kind !== "host") return;
      const previous = record.collapsedTemplate;
      const collapsed = next.collapsedTemplate;
      if (previous !== void 0) {
        if (collapsed === void 0 || previous.shape !== collapsed.program.shape) {
          this.expandCollapsedTemplate(record);
          if (collapsed !== void 0) expandCollapsedTemplateBlueprint(next);
        }
      } else if (collapsed !== void 0) {
        expandCollapsedTemplateBlueprint(next);
      }
    };
    const reserveCollapsedTemplateIds = (record, next) => {
      if (next.kind !== "host" || next.collapsedTemplate === void 0) return;
      const collapsed = next.collapsedTemplate;
      if (collapsed.prepared !== void 0) {
        collapsed.firstId = record.id;
        nextId += collapsed.program.shape.length - 1;
        return;
      }
      const ids = new Array(collapsed.program.shape.length);
      ids[0] = record.id;
      for (let index = 1; index < ids.length; index++) ids[index] = nextId++;
      collapsed.ids = ids;
    };
    const reconcileChildren = (oldChildren, blueprints) => {
      if (oldChildren.length === 0) {
        if (blueprints.length === 0) return [];
        topologyChanged = true;
        const output2 = new Array(blueprints.length);
        let keys;
        for (let index = 0; index < blueprints.length; index++) {
          let child = blueprints[index];
          if (child.key !== null && blueprints.length > 1) {
            keys ??= /* @__PURE__ */ new Set();
            if (keys.has(child.key)) {
              throw new Error(`Duplicate universal child key ${String(child.key)}.`);
            }
            keys.add(child.key);
          }
          if (child.kind === "range" && child.retained !== void 0) {
            child = expandRetained(child);
          }
          const record = createLogicalRecord(
            compactLogicalRangeIds && child.kind === "range" ? nextLogicalRangeId-- : nextId++,
            child
          );
          reserveCollapsedTemplateIds(record, child);
          const draft = {
            record,
            blueprint: child,
            children: reconcileChildren(record.children, child.children),
            isNew: true,
            hostUpdate: null
          };
          if (record.kind === "range" && record.owner !== (child.owner ?? null)) {
            changedRangeOwners.push(draft);
          }
          output2[index] = draft;
        }
        return output2;
      }
      if ((treeFeatures & UNIVERSAL_TREE_PORTAL) === 0 && oldChildren.length === blueprints.length && oldChildren.every((record, index) => sameRecordShape(record, blueprints[index]))) {
        return oldChildren.map((record, index) => {
          used.add(record);
          let blueprint2 = blueprints[index];
          if (blueprint2.kind === "range" && blueprint2.retained !== void 0) {
            if (blueprint2.retained === record) return retainedDraft(record, blueprint2);
            blueprint2 = expandRetained(blueprint2);
          }
          reconcileCollapsedTemplate(record, blueprint2);
          const draft = {
            record,
            blueprint: blueprint2,
            children: reconcileChildren(record.children, blueprint2.children),
            isNew: false,
            hostUpdate: null
          };
          if (record.kind === "range" && record.owner !== (blueprint2.owner ?? null)) {
            changedRangeOwners.push(draft);
          }
          return draft;
        });
      }
      const keyed = /* @__PURE__ */ new Map();
      for (const old of oldChildren) if (old.key !== null) keyed.set(old.key, old);
      const claimed = /* @__PURE__ */ new Set();
      let nextKeys;
      const output = [];
      for (let childIndex = 0; childIndex < blueprints.length; childIndex++) {
        let child = blueprints[childIndex];
        let record;
        if (child.key !== null) {
          if (blueprints.length > 1) {
            nextKeys ??= /* @__PURE__ */ new Set();
            if (nextKeys.has(child.key)) {
              throw new Error(`Duplicate universal child key ${String(child.key)}.`);
            }
            nextKeys.add(child.key);
          }
          const candidate = keyed.get(child.key);
          if (candidate !== void 0 && !claimed.has(candidate) && sameRecordShape(candidate, child)) {
            record = candidate;
          }
        } else {
          const candidate = oldChildren[childIndex];
          if (candidate !== void 0 && candidate.key === null && !claimed.has(candidate) && sameRecordShape(candidate, child)) {
            record = candidate;
          }
        }
        if (child.kind === "range" && child.retained !== void 0) {
          if (record === child.retained && record !== void 0) {
            claimed.add(record);
            used.add(record);
            output.push(retainedDraft(record, child));
            continue;
          }
          child = expandRetained(child);
        }
        if (record?.kind === "portal" && child.kind === "portal") {
          const previousRegistration = record.portalRegistration;
          const nextRegistration = child.registration;
          if (previousRegistration !== null && nextRegistration !== null && previousRegistration !== nextRegistration && Object.is(previousRegistration.handle, nextRegistration.handle)) {
            stagedPortalRegistrations.delete(nextRegistration);
            nextRegistration.release();
            child.registration = previousRegistration;
          } else if (previousRegistration !== null && nextRegistration !== null && !Object.is(previousRegistration.handle, nextRegistration.handle)) {
            topologyChanged = true;
          }
        }
        const isNew = record === void 0;
        record ??= createLogicalRecord(
          compactLogicalRangeIds && child.kind === "range" ? nextLogicalRangeId-- : nextId++,
          child
        );
        if (isNew) reserveCollapsedTemplateIds(record, child);
        else reconcileCollapsedTemplate(record, child);
        claimed.add(record);
        used.add(record);
        const draft = {
          record,
          blueprint: child,
          children: reconcileChildren(record.children, child.children),
          isNew,
          hostUpdate: null
        };
        if (record.kind === "range" && record.owner !== (child.owner ?? null)) {
          changedRangeOwners.push(draft);
        }
        output.push(draft);
      }
      if (oldChildren.length !== output.length || output.some((draft, index) => draft.record !== oldChildren[index])) {
        topologyChanged = true;
      }
      return output;
    };
    const draftRoot = {
      record: scopeRecord,
      blueprint,
      children: reconcileChildren(scopeRecord.children, blueprint.children),
      isNew: false,
      hostUpdate: null
    };
    if (scopeRecord.kind === "range" && scopeRecord.owner !== (blueprint.owner ?? null)) {
      changedRangeOwners.push(draftRoot);
    }
    const removedRoots = [];
    const findRemoved = (parent) => {
      for (const child of parent.children) {
        if (!used.has(child)) removedRoots.push(child);
        else if (!retainedScopes.has(child)) findRemoved(child);
      }
    };
    if (topologyChanged) findRemoved(scopeRecord);
    const teardownRunRecords = this.driver.capabilities?.teardownRuns === true ? /* @__PURE__ */ new Map() : null;
    const physicalParentIdOf = (record) => {
      let ancestor = record.parent;
      while (ancestor !== void 0 && ancestor !== null) {
        if (ancestor.kind === "portal") return void 0;
        if (ancestor.kind === "host") return ancestor.id;
        ancestor = ancestor.parent;
      }
      return ancestor === null || record.parent === void 0 ? null : void 0;
    };
    for (const removed of removedRoots) {
      const visitRemoved = (record, underRemovedHost) => {
        if (record.collapsedTemplate !== void 0) {
          const collapsed = record.collapsedTemplate;
          if (teardownRunRecords !== null && !underRemovedHost && record.kind === "host" && collapsed.prepared !== void 0 && collapsed.firstId !== void 0 && (collapsed.nodes === null || collapsed.nodes.every((node) => node.id === void 0)) && record.visibility === "visible" && record.ref == null && record.portalRegistration === null && record.lifecycles.size === 0 && record.localCallbacks.size === 0 && physicalParentIdOf(record) !== void 0) {
            teardownRunRecords.set(record, collapsed);
            return;
          }
          this.expandCollapsedTemplate(record);
        }
        const nextUnderRemovedHost = underRemovedHost || record.kind === "host";
        for (const child of record.children) visitRemoved(child, nextUnderRemovedHost);
      };
      visitRemoved(removed, false);
    }
    const previousPortalRegistrations = /* @__PURE__ */ new Set();
    const nextPortalRegistrations = /* @__PURE__ */ new Set();
    let reorderedPortalRecords = null;
    if ((treeFeatures & UNIVERSAL_TREE_PORTAL) !== 0) {
      const previousPortalsByTarget = topologyChanged ? /* @__PURE__ */ new Map() : null;
      for (const child of scopeRecord.children) {
        walkLogical(child, (record) => {
          if (record.kind === "portal" && record.portalRegistration !== null) {
            previousPortalRegistrations.add(record.portalRegistration);
            if (previousPortalsByTarget !== null) {
              let records = previousPortalsByTarget.get(record.portalRegistration.handle);
              if (records === void 0) {
                records = [];
                previousPortalsByTarget.set(record.portalRegistration.handle, records);
              }
              records.push(record);
            }
          }
        });
      }
      const nextPortalsByTarget = topologyChanged ? /* @__PURE__ */ new Map() : null;
      walkDraft(draftRoot, (draft) => {
        if (draft.blueprint.kind !== "portal") return;
        const registration = draft.blueprint.registration;
        if (registration === null) {
          throw new Error("A universal portal target was not prepared before reconciliation.");
        }
        nextPortalRegistrations.add(registration);
        if (nextPortalsByTarget !== null) {
          let records = nextPortalsByTarget.get(registration.handle);
          if (records === void 0) {
            records = [];
            nextPortalsByTarget.set(registration.handle, records);
          }
          records.push(draft);
        }
      });
      if (nextPortalsByTarget !== null && previousPortalsByTarget !== null) {
        for (const [target, nextPortals] of nextPortalsByTarget) {
          const previousPortals = previousPortalsByTarget.get(target);
          if (previousPortals?.length === nextPortals.length && nextPortals.every((draft, index) => draft.record === previousPortals[index])) {
            continue;
          }
          const reordered = reorderedPortalRecords ??= /* @__PURE__ */ new Set();
          for (const draft of nextPortals) reordered.add(draft.record);
        }
      }
    }
    const previousRegionBridges = /* @__PURE__ */ new Set();
    const stagedRegionBridges = [];
    const nextRegionBridges = /* @__PURE__ */ new Set();
    if ((treeFeatures & UNIVERSAL_TREE_REGION) !== 0) {
      for (const child of scopeRecord.children) {
        walkLogical(child, (record) => {
          if (record.kind !== "host") return;
          for (const value of Object.values(record.props)) {
            const bridge = rendererRegionOwnerBridge(value);
            if (bridge !== null) previousRegionBridges.add(bridge);
          }
        });
      }
      const attemptedOwnerRecords = new Set(attempt.owners.map((owner) => owner.record));
      walkDraft(draftRoot, (draft) => {
        if (draft.record.kind !== "host") return;
        const props2 = draft.blueprint.props;
        for (const name of Object.keys(props2)) {
          const value = props2[name];
          if (!isRendererRegion(value)) continue;
          if (value.ownerRenderer !== this.renderer) {
            throw new Error(
              `Universal renderer region owner mismatch: region owner ${JSON.stringify(value.ownerRenderer)} cannot be committed by root ${JSON.stringify(this.renderer)}.`
            );
          }
          const next = rendererRegionOwnerBridge(value);
          if (next === null) {
            throw new Error(
              "A universal renderer region must be created while its owning component renders."
            );
          }
          if (!attemptedOwnerRecords.has(next.owner)) {
            throw new Error(
              "A renderer region cannot escape the universal owner attempt that created it."
            );
          }
          if (nextRegionBridges.has(next)) {
            throw new Error("One renderer-region descriptor cannot own more than one host region.");
          }
          nextRegionBridges.add(next);
          const previous = rendererRegionOwnerBridge(draft.record.props[name]);
          stagedRegionBridges.push({ next, previous });
        }
      });
    }
    const creates = [];
    const updates = [];
    const recreated = /* @__PURE__ */ new Set();
    const hostDrafts = [];
    const collapsedUpdates = [];
    const templateMounts = /* @__PURE__ */ new Map();
    const templatedRecords = /* @__PURE__ */ new Set();
    const canMountTemplates = this.driver.capabilities?.templateMount === true && (treeFeatures & templateExcludedFeatures) === 0;
    walkDraft(draftRoot, (draft) => {
      if (draft.record.kind !== "host") return;
      hostDrafts.push(draft);
      const blueprintHost = draft.blueprint;
      if (canMountTemplates && draft.isNew && !templatedRecords.has(draft.record)) {
        const collapsed = blueprintHost.collapsedTemplate;
        if (collapsed !== void 0) {
          templateMounts.set(draft.record, {
            shape: collapsed.program.shape,
            drafts: [draft],
            nodes: collapsed.prepared === void 0 ? new Array(collapsed.program.shape.length) : null,
            collapsed
          });
          templatedRecords.add(draft.record);
        } else if (blueprintHost.templatePlan !== void 0) {
          const plan = blueprintHost.templatePlan;
          const shape = universalHostTemplateShape(plan);
          if (shape !== null) {
            const drafts = collectUniversalHostTemplateDrafts(draft, shape);
            if (drafts !== null) {
              templateMounts.set(draft.record, {
                shape,
                drafts,
                nodes: new Array(drafts.length)
              });
              for (const templated of drafts) templatedRecords.add(templated.record);
            }
          }
        }
      }
      if (!draft.isNew && draft.record.collapsedTemplate !== void 0 && blueprintHost.collapsedTemplate !== void 0) {
        collapsedUpdates.push({
          record: draft.record,
          previous: draft.record.collapsedTemplate,
          next: blueprintHost.collapsedTemplate
        });
      }
      if (draft.isNew) {
        Object.freeze(blueprintHost.props);
        if (!templatedRecords.has(draft.record)) {
          creates.push({
            op: "create",
            id: draft.record.id,
            type: blueprintHost.type,
            props: blueprintHost.props
          });
        }
      } else if (!(collapsedTemplateRootPropsEqual(
        draft.record.collapsedTemplate,
        blueprintHost.collapsedTemplate
      ) ?? shallowPropsEqual(draft.record.props, blueprintHost.props))) {
        const props2 = Object.freeze(blueprintHost.props);
        const kind = this.driver.updates?.classify(
          blueprintHost.type,
          draft.record.props,
          blueprintHost.props
        ) ?? "update";
        if (kind !== "update" && kind !== "recreate") {
          throw new TypeError(
            `Universal update classifier returned invalid kind ${JSON.stringify(kind)}.`
          );
        }
        draft.hostUpdate = kind;
        if (kind === "recreate") {
          recreated.add(draft.record);
          updates.push({
            op: "recreate",
            id: draft.record.id,
            type: blueprintHost.type,
            props: props2
          });
        } else {
          updates.push({ op: "update", id: draft.record.id, props: props2 });
        }
      }
    });
    const removes = [];
    const placements = [];
    const templateRuns = [];
    const placeTemplate = (template, parent, before) => {
      const collapsed = template.collapsed;
      if (collapsed?.prepared !== void 0) {
        if (this.driver.capabilities?.templateProgramRuns === true) {
          const previous = placements[placements.length - 1];
          if (previous?.op === "mount-template-run" && previous.program === collapsed.prepared.wire && Object.is(previous.parent, parent) && previous.before === before && previous.firstId + previous.count * previous.program.nodes.length === collapsed.firstId) {
            const run2 = previous;
            template.runIndex = run2.count++;
            run2.values.push(...collapsed.values);
            template.run = run2;
            return;
          }
          const run = {
            op: "mount-template-run",
            parent,
            before,
            program: collapsed.prepared.wire,
            firstId: collapsed.firstId,
            firstListenerId: null,
            count: 1,
            values: [...collapsed.values]
          };
          template.run = run;
          template.runIndex = 0;
          templateRuns.push(run);
          placements.push(run);
          return;
        }
        const range = {
          op: "mount-template-range",
          parent,
          before,
          program: collapsed.prepared.wire,
          firstId: collapsed.firstId,
          values: collapsed.values,
          firstListenerId: null
        };
        template.range = range;
        placements.push(range);
        return;
      }
      placements.push({
        op: "mount-template",
        parent,
        before,
        shape: template.shape,
        nodes: template.nodes
      });
    };
    const planPlacements = (parentId, oldRecords, newDrafts, sourceParentId = parentId, forceMove = false, endAnchor = null) => {
      if (oldRecords.length === 0 && !forceMove) {
        if (newDrafts.length === 0) return;
        for (const record of physicalDrafts(newDrafts)) {
          const template = templateMounts.get(record);
          if (template !== void 0) {
            placeTemplate(template, parentId, endAnchor);
          } else if (!templatedRecords.has(record)) {
            placements.push({
              op: "insert",
              parent: parentId,
              id: record.id,
              before: endAnchor
            });
          }
        }
        return;
      }
      const oldPhysical = physicalRecords(oldRecords);
      const newPhysical = physicalDrafts(newDrafts);
      if (oldPhysical.length === 0 && newPhysical.length === 0) return;
      const desiredIds = /* @__PURE__ */ new Set();
      for (const entry of newPhysical) desiredIds.add(entry.id);
      const previousPositions = /* @__PURE__ */ new Map();
      for (let index = 0; index < oldPhysical.length; index++) {
        const old = oldPhysical[index];
        previousPositions.set(old.id, index);
        if (!desiredIds.has(old.id)) {
          if (teardownRunRecords?.has(old) !== true) {
            removes.push({ op: "remove", parent: sourceParentId, id: old.id });
          }
        }
      }
      if (forceMove) {
        for (const record of newPhysical) {
          placements.push({
            op: previousPositions.has(record.id) ? "move" : "insert",
            parent: parentId,
            id: record.id,
            before: endAnchor
          });
        }
        return;
      }
      const sources = new Int32Array(newPhysical.length);
      let previousSource = -1;
      let reordered = false;
      for (let index = 0; index < newPhysical.length; index++) {
        const source = previousPositions.get(newPhysical[index].id) ?? -1;
        sources[index] = source;
        if (source === -1) continue;
        if (source < previousSource) reordered = true;
        previousSource = source;
      }
      const stable = reordered ? stableUniversalPlacementPositions(sources) : null;
      const isStable = (index) => stable === null ? sources[index] !== -1 : stable[index] === 1;
      let nextStable = 0;
      while (nextStable < newPhysical.length && !isStable(nextStable)) nextStable++;
      for (let index = 0; index < newPhysical.length; index++) {
        if (index === nextStable) {
          nextStable++;
          while (nextStable < newPhysical.length && !isStable(nextStable)) nextStable++;
          continue;
        }
        const record = newPhysical[index];
        const id = record.id;
        const before = nextStable < newPhysical.length ? newPhysical[nextStable].id : endAnchor;
        if (sources[index] === -1) {
          const template = templateMounts.get(record);
          if (template !== void 0) placeTemplate(template, parentId, before);
          else placements.push({ op: "insert", parent: parentId, id, before });
        } else {
          placements.push({ op: "move", parent: parentId, id, before });
        }
      }
    };
    if (topologyChanged) {
      walkDraftPostOrder(draftRoot, (draft) => {
        if (draft.record === this.rootRecord) {
          planPlacements(null, this.rootRecord.children, draft.children);
        } else if (scoped && draft === draftRoot && scopePlacement !== null) {
          planPlacements(
            scopePlacement.parent,
            draft.record.children,
            draft.children,
            scopePlacement.parent,
            false,
            scopePlacement.endAnchor
          );
        } else if (draft.record.kind === "host") {
          if (templatedRecords.has(draft.record)) return;
          planPlacements(draft.record.id, draft.record.children, draft.children);
        } else if (draft.record.kind === "portal") {
          const nextRegistration = draft.blueprint.registration;
          const previousRegistration = draft.record.portalRegistration;
          const retainedTarget = previousRegistration !== null && Object.is(previousRegistration.handle, nextRegistration.handle);
          planPlacements(
            nextRegistration.handle,
            draft.record.children,
            draft.children,
            previousRegistration?.handle ?? nextRegistration.handle,
            previousRegistration !== null && !retainedTarget || reorderedPortalRecords?.has(draft.record) === true
          );
        }
      });
    }
    for (const removed of removedRoots) {
      walkLogical(removed, (record) => {
        if (record.kind !== "portal" || record.portalRegistration === null) return;
        for (const child of physicalRecords(record.children)) {
          removes.push({
            op: "remove",
            parent: record.portalRegistration.handle,
            id: child.id
          });
        }
      });
    }
    if (teardownRunRecords !== null && teardownRunRecords.size !== 0) {
      const runs = [...teardownRunRecords.entries()].sort((a, b) => a[1].firstId - b[1].firstId);
      let open = null;
      const flush = () => {
        if (open === null) return;
        removes.push({
          op: "destroy-run",
          parent: open.parent,
          firstId: open.firstId,
          count: open.count,
          width: open.width
        });
        open = null;
      };
      for (const [record, collapsed] of runs) {
        const width = collapsed.shape.length;
        const parent = physicalParentIdOf(record);
        if (open !== null && open.program === collapsed.prepared && open.parent === parent && open.firstId + open.count * open.width === collapsed.firstId) {
          open.count++;
          continue;
        }
        flush();
        open = {
          parent,
          firstId: collapsed.firstId,
          count: 1,
          width,
          program: collapsed.prepared
        };
      }
      flush();
    }
    const hiddenVisibilityCommands = [];
    const visibleVisibilityCommands = [];
    const stageHiddenVisibility = (draft) => {
      if (draft.record.kind !== "host") return;
      const nextHidden = draft.blueprint.visibility !== "visible";
      const previousHidden = draft.record.visibility !== "visible";
      if (nextHidden && (draft.isNew || recreated.has(draft.record) || !previousHidden)) {
        hiddenVisibilityCommands.push({
          op: "visibility",
          id: draft.record.id,
          state: "hidden"
        });
      }
    };
    const stageVisibleVisibility = (draft) => {
      if (draft.record.kind !== "host") return;
      const nextHidden = draft.blueprint.visibility !== "visible";
      const previousHidden = draft.record.visibility !== "visible";
      if (!nextHidden && !draft.isNew && previousHidden) {
        visibleVisibilityCommands.push({
          op: "visibility",
          id: draft.record.id,
          state: "visible"
        });
      }
    };
    if ((treeFeatures & UNIVERSAL_TREE_HIDDEN) !== 0) {
      walkDraftPostOrder(draftRoot, stageHiddenVisibility);
      walkDraft(draftRoot, stageVisibleVisibility);
    }
    const visibilityCommands = [...hiddenVisibilityCommands, ...visibleVisibilityCommands];
    const removedHosts = [];
    for (const removed of removedRoots) collectRemovedPostOrder(removed, removedHosts);
    let nextListener = this.nextListener;
    const eventCommands = [];
    const stagedEvents = /* @__PURE__ */ new Map();
    const stagedVisibleEventRecords = /* @__PURE__ */ new Set();
    if ((treeFeatures & UNIVERSAL_TREE_EVENT) !== 0) {
      for (const draft of hostDrafts) {
        const blueprintHost = draft.blueprint;
        const blueprintEvents = blueprintHost.events;
        if (blueprintEvents.size === 0 && draft.record.events.size === 0) continue;
        const wasVisible = draft.record.visibility === "visible";
        const isVisible = blueprintHost.visibility === "visible";
        if (isVisible) stagedVisibleEventRecords.add(draft.record);
        const nextEvents = /* @__PURE__ */ new Map();
        for (const [type, event] of blueprintEvents) {
          const previous = draft.record.events.get(type);
          const listener = previous?.listener ?? nextListener++;
          const committed = { ...event, listener };
          nextEvents.set(type, committed);
          const descriptorChanged = previous === void 0 || previous.priority !== event.priority || previous.owner !== event.owner;
          if (isVisible && (!wasVisible || descriptorChanged) && !templatedRecords.has(draft.record)) {
            eventCommands.push({
              op: "event",
              id: draft.record.id,
              type,
              listener: { id: listener, priority: event.priority }
            });
          }
        }
        for (const [type] of draft.record.events) {
          if (wasVisible && (!isVisible || !nextEvents.has(type))) {
            eventCommands.push({ op: "event", id: draft.record.id, type, listener: null });
          }
        }
        stagedEvents.set(draft.record, nextEvents);
      }
      for (const record of removedHosts) {
        if (record.visibility !== "visible") continue;
        for (const [type] of record.events) {
          eventCommands.push({ op: "event", id: record.id, type, listener: null });
        }
      }
    }
    const stagedCollapsedTemplates = /* @__PURE__ */ new Map();
    const previousCollapsedEventListeners = /* @__PURE__ */ new Set();
    const nextCollapsedEvents = [];
    for (const update of collapsedUpdates) {
      const { previous, next } = update;
      if (previous.prepared !== void 0 && previous.prepared === next.prepared && previous.values !== void 0 && next.values !== void 0) {
        const program = previous.prepared;
        let nodes2 = previous.nodes;
        let events = previous.events;
        let changed2 = false;
        let previousChangedNode = -1;
        let recreatedNodes = null;
        for (let valueIndex = 0; valueIndex < program.values.length; valueIndex++) {
          if (Object.is(previous.values[valueIndex], next.values[valueIndex])) continue;
          const index = program.values[valueIndex].node;
          if (index === previousChangedNode) continue;
          previousChangedNode = index;
          const sourceProps = materializePreparedCollapsedHostProps(program, next.values, index);
          const accepted = previous.nodes?.[index];
          const acceptedProps = accepted?.props ?? materializePreparedCollapsedHostProps(program, previous.values, index);
          if (index !== 0) {
            const kind = this.driver.updates?.classify(
              previous.shape[index].type,
              acceptedProps,
              sourceProps
            ) ?? "update";
            if (kind !== "update" && kind !== "recreate") {
              throw new TypeError(
                `Universal update classifier returned invalid kind ${JSON.stringify(kind)}.`
              );
            }
            const id = accepted?.id ?? previous.firstId + index;
            if (kind === "recreate") {
              (recreatedNodes ??= /* @__PURE__ */ new Set()).add(index);
              updates.push({
                op: "recreate",
                id,
                type: previous.shape[index].type,
                props: sourceProps
              });
            } else {
              updates.push({ op: "update", id, props: sourceProps });
            }
          }
          if (nodes2 !== null) {
            if (nodes2 === previous.nodes) nodes2 = nodes2.slice();
            nodes2[index] = Object.freeze({ ...accepted, props: sourceProps });
          }
          changed2 = true;
        }
        for (let eventIndex = 0; eventIndex < program.events.length; eventIndex++) {
          const site = program.events[eventIndex];
          const prior = previous.events[eventIndex];
          const handler = next.captures?.[site.slot];
          if (prior === void 0 || prior.index !== site.node || prior.event.type !== site.type || typeof handler !== "function") {
            throw new Error("A universal template program lost an accepted event site.");
          }
          if (prior.event.handler !== handler || prior.event.owner !== next.owner || prior.event.priority !== site.priority) {
            const committed = {
              prop: site.prop,
              type: site.type,
              priority: site.priority,
              handler,
              owner: next.owner,
              listener: prior.event.listener
            };
            if (events === previous.events) events = previous.events.slice();
            events[eventIndex] = {
              index: site.node,
              event: committed
            };
            nextCollapsedEvents.push(committed);
            changed2 = true;
          }
          if (prior.event.priority !== site.priority || recreatedNodes?.has(site.node)) {
            eventCommands.push({
              op: "event",
              id: previous.nodes?.[site.node].id ?? previous.firstId + site.node,
              type: site.type,
              listener: { id: prior.event.listener, priority: site.priority }
            });
          }
        }
        if (changed2) {
          if (nodes2 !== null && nodes2 !== previous.nodes) Object.freeze(nodes2);
          stagedCollapsedTemplates.set(update.record, {
            shape: previous.shape,
            nodes: nodes2,
            events,
            owner: update.record.owner ?? attempt.owner.record,
            ...previous.firstId === void 0 ? null : { firstId: previous.firstId },
            prepared: program,
            values: previousChangedNode === -1 ? previous.values : next.values
          });
        }
        continue;
      }
      const previousNodes = previous.nodes ?? previous.shape.map((_shape, index) => materializeCommittedCollapsedNode(previous, index));
      const nextNodes = next.nodes ?? next.program.shape.map(
        (_shape, index) => materializeCollapsedBlueprintNode(next, index, next.owner)
      );
      let nodes = previousNodes;
      const committedEvents = [];
      let changed = false;
      let previousEventCursor = 0;
      for (let index = 0; index < nextNodes.length; index++) {
        const source = nextNodes[index];
        const accepted = previousNodes[index];
        const acceptedId = accepted.id ?? previous.firstId + index;
        while (previousEventCursor < previous.events.length && previous.events[previousEventCursor].index < index) {
          previousEventCursor++;
        }
        const previousEventStart = previousEventCursor;
        while (previousEventCursor < previous.events.length && previous.events[previousEventCursor].index === index) {
          previousEventCursor++;
        }
        const propsChanged = !shallowPropsEqual(accepted.props, source.props);
        let recreatedNode = false;
        if (propsChanged) {
          Object.freeze(source.props);
          if (index !== 0) {
            const kind = this.driver.updates?.classify(
              previous.shape[index].type,
              accepted.props,
              source.props
            ) ?? "update";
            if (kind !== "update" && kind !== "recreate") {
              throw new TypeError(
                `Universal update classifier returned invalid kind ${JSON.stringify(kind)}.`
              );
            }
            recreatedNode = kind === "recreate";
            updates.push(
              recreatedNode ? {
                op: "recreate",
                id: acceptedId,
                type: previous.shape[index].type,
                props: source.props
              } : { op: "update", id: acceptedId, props: source.props }
            );
          }
          if (nodes === previousNodes) nodes = previousNodes.slice();
          nodes[index] = Object.freeze({
            ...accepted,
            props: source.props
          });
          changed = true;
        }
        if (index === 0) continue;
        const events = source.events;
        if (events === void 0) continue;
        for (const event of events) {
          let prior;
          for (let previousEventIndex = previousEventStart; previousEventIndex < previousEventCursor; previousEventIndex++) {
            const candidate = previous.events[previousEventIndex].event;
            if (candidate.type === event.type) {
              prior = candidate;
              break;
            }
          }
          const listener = prior?.listener ?? nextListener++;
          const committed = { ...event, listener };
          committedEvents.push({ index, event: committed });
          if (prior === void 0 || prior.handler !== event.handler || prior.owner !== event.owner || prior.priority !== event.priority) {
            changed = true;
            nextCollapsedEvents.push(committed);
          }
          if (prior === void 0 || prior.priority !== event.priority || recreatedNode) {
            eventCommands.push({
              op: "event",
              id: acceptedId,
              type: event.type,
              listener: { id: listener, priority: event.priority }
            });
          }
        }
      }
      for (const accepted of previous.events) {
        const nextEvents = nextNodes[accepted.index].events;
        if (nextEvents?.some((event) => event.type === accepted.event.type) === true) continue;
        previousCollapsedEventListeners.add(accepted.event.listener);
        eventCommands.push({
          op: "event",
          id: previousNodes[accepted.index].id ?? previous.firstId + accepted.index,
          type: accepted.event.type,
          listener: null
        });
        changed = true;
      }
      if (changed) {
        if (nodes !== previousNodes) Object.freeze(nodes);
        stagedCollapsedTemplates.set(update.record, {
          shape: previous.shape,
          nodes,
          events: committedEvents,
          owner: update.record.owner ?? attempt.owner.record,
          ...previous.firstId === void 0 ? null : { firstId: previous.firstId },
          ...next.prepared === void 0 ? null : { prepared: next.prepared, values: next.values }
        });
      }
    }
    for (const template of templateMounts.values()) {
      const collapsed = template.collapsed;
      const count = collapsed?.program.shape.length ?? template.drafts.length;
      const collapsedEvents = [];
      if ((template.range !== void 0 || template.run !== void 0) && collapsed?.prepared !== void 0) {
        const sites = collapsed.prepared.events;
        if (template.range !== void 0) {
          template.range.firstListenerId = sites.length === 0 ? null : nextListener;
        } else if (sites.length !== 0) {
          const run = template.run;
          if (run.firstListenerId === null) run.firstListenerId = nextListener;
          if (run.firstListenerId + template.runIndex * sites.length !== nextListener) {
            throw new Error("A universal template run requires consecutive listener IDs.");
          }
        }
        for (const site of sites) {
          const handler = collapsed.captures?.[site.slot];
          if (typeof handler !== "function") {
            throw new Error("A universal template program lost a prepared event site.");
          }
          const committed = {
            prop: site.prop,
            type: site.type,
            priority: site.priority,
            handler,
            owner: collapsed.owner,
            listener: nextListener++
          };
          collapsedEvents.push({ index: site.node, event: committed });
          nextCollapsedEvents.push(committed);
        }
        stagedCollapsedTemplates.set(template.drafts[0].record, {
          shape: template.shape,
          nodes: null,
          events: collapsedEvents,
          owner: template.drafts[0].blueprint.owner,
          firstId: collapsed.firstId,
          prepared: collapsed.prepared,
          values: collapsed.values
        });
        continue;
      }
      for (let index = 0; index < count; index++) {
        const draft = template.drafts[collapsed === void 0 ? index : 0];
        const host = draft.blueprint;
        const staged = index === 0 || collapsed === void 0 ? stagedEvents.get(draft.record) : void 0;
        const source = collapsed?.nodes?.[index];
        const id = collapsed === void 0 ? draft.record.id : collapsed.ids[index];
        let events;
        if (staged !== void 0 && staged.size !== 0) {
          const nextEvents = [];
          for (const event of staged.values()) {
            nextEvents.push(
              Object.freeze({
                type: event.type,
                listener: Object.freeze({ id: event.listener, priority: event.priority })
              })
            );
          }
          events = Object.freeze(nextEvents);
        } else if (source?.events !== void 0 && index !== 0) {
          const nextEvents = [];
          for (const event of source.events) {
            const committed = { ...event, listener: nextListener++ };
            collapsedEvents.push({ index, event: committed });
            nextCollapsedEvents.push(committed);
            nextEvents.push(
              Object.freeze({
                type: committed.type,
                listener: Object.freeze({
                  id: committed.listener,
                  priority: committed.priority
                })
              })
            );
          }
          events = Object.freeze(nextEvents);
        }
        template.nodes[index] = Object.freeze({
          id,
          props: Object.freeze(source?.props ?? host.props),
          ...events === void 0 ? null : { events }
        });
      }
      Object.freeze(template.nodes);
      if (collapsed !== void 0) {
        const draft = template.drafts[0];
        stagedCollapsedTemplates.set(draft.record, {
          shape: template.shape,
          nodes: template.nodes,
          events: collapsedEvents,
          owner: draft.blueprint.owner
        });
      }
    }
    for (const run of templateRuns) Object.freeze(run.values);
    const stageHostCallbacks = (op, readBlueprint, readCommitted) => {
      const commands2 = [];
      const staged = /* @__PURE__ */ new Map();
      const feature = op === "lifecycle" ? UNIVERSAL_TREE_LIFECYCLE : UNIVERSAL_TREE_LOCAL_CALLBACK;
      if ((treeFeatures & feature) === 0) return { commands: commands2, staged };
      for (const draft of hostDrafts) {
        const blueprintCallbacks = readBlueprint(draft.blueprint);
        const previousCallbacks = readCommitted(draft.record);
        const nextCallbacks = /* @__PURE__ */ new Map();
        for (const [type, callback] of blueprintCallbacks) {
          const previous = previousCallbacks.get(type);
          const listener = previous?.listener ?? nextListener++;
          nextCallbacks.set(type, { ...callback, listener });
          if (previous === void 0 || previous.handler !== callback.handler || previous.owner !== callback.owner) {
            commands2.push({ op, id: draft.record.id, type, listener: { id: listener } });
          }
        }
        for (const [type] of previousCallbacks) {
          if (!nextCallbacks.has(type)) {
            commands2.push({ op, id: draft.record.id, type, listener: null });
          }
        }
        staged.set(draft.record, nextCallbacks);
      }
      for (const record of removedHosts) {
        for (const [type] of readCommitted(record)) {
          commands2.push({ op, id: record.id, type, listener: null });
        }
      }
      return { commands: commands2, staged };
    };
    const lifecycleStage = stageHostCallbacks(
      "lifecycle",
      (host) => host.lifecycles,
      (record) => record.lifecycles
    );
    const localCallbackStage = stageHostCallbacks(
      "local-callback",
      (host) => host.localCallbacks,
      (record) => record.localCallbacks
    );
    const publicInstanceCommands = [];
    if (this.driver.capabilities?.lazyPublicInstances === true && (treeFeatures & (UNIVERSAL_TREE_REF | UNIVERSAL_TREE_LIFECYCLE | UNIVERSAL_TREE_LOCAL_CALLBACK)) !== 0) {
      for (const draft of hostDrafts) {
        const host = draft.blueprint;
        if (host.ref != null || host.lifecycles.size !== 0 || host.localCallbacks.size !== 0) {
          publicInstanceCommands.push({ op: "ensure-public-instance", id: draft.record.id });
        }
      }
    }
    const destroys = [];
    for (const record of removedHosts) {
      if (teardownRunRecords?.has(record) === true) continue;
      destroys.push({ op: "destroy", id: record.id });
    }
    const commands = [
      ...creates,
      ...updates,
      ...publicInstanceCommands,
      ...eventCommands,
      ...lifecycleStage.commands,
      ...localCallbackStage.commands,
      ...removes,
      ...placements,
      ...visibilityCommands,
      ...destroys
    ];
    const batch = freezeUniversalHostBatch(this.renderer, this.nextBatchVersion++, commands);
    const retryThenables = [...attempt.retryThenables];
    const retryMemos = retryThenables.length === 0 ? [] : collectSuspendedMemos(attempt);
    const refDetaches = [];
    const refAttaches = [];
    const lifecycleHosts = /* @__PURE__ */ new Set();
    if ((treeFeatures & UNIVERSAL_TREE_LIFECYCLE) !== 0) {
      const hostsById = /* @__PURE__ */ new Map();
      walkDraft(draftRoot, (draft) => {
        if (draft.retained === true) {
          for (const host of physicalRecords(draft.record.children)) {
            hostsById.set(host.id, host);
          }
          return;
        }
        if (draft.record.kind !== "host") return;
        hostsById.set(draft.record.id, draft.record);
        if (draft.isNew || draft.hostUpdate !== null) lifecycleHosts.add(draft.record);
      });
      for (const placement of placements) {
        if (placement.op !== "move") continue;
        const host = hostsById.get(placement.id);
        if (host !== void 0) lifecycleHosts.add(host);
      }
    }
    if ((treeFeatures & UNIVERSAL_TREE_REF) !== 0) {
      for (const removed of removedRoots) {
        walkLogical(removed, (record) => {
          if (record.kind === "host" && record.refAttached) {
            refDetaches.push({ record, ref: record.ref, cleanup: record.refCleanup });
          }
        });
      }
      walkDraftPostOrder(draftRoot, (draft) => {
        if (draft.record.kind !== "host") return;
        const blueprintHost = draft.blueprint;
        const nextRef = blueprintHost.ref;
        const hide = draft.record.visibility === "visible" && blueprintHost.visibility !== "visible";
        const reveal = draft.record.visibility !== "visible" && blueprintHost.visibility === "visible";
        if (!draft.isNew && draft.record.refAttached && (recreated.has(draft.record) || hide || !Object.is(draft.record.ref, nextRef))) {
          refDetaches.push({
            record: draft.record,
            ref: draft.record.ref,
            cleanup: draft.record.refCleanup
          });
        }
        if (nextRef != null && blueprintHost.visibility === "visible" && (draft.isNew || recreated.has(draft.record) || reveal || !draft.record.refAttached || !Object.is(draft.record.ref, nextRef))) {
          refAttaches.push(draft);
        }
      });
    }
    const draftOwnersParentFirst = [];
    const draftOwnersPostOrder = [];
    const walkDraftOwners = (owner) => {
      draftOwnersParentFirst.push(owner);
      for (const child of owner.children) walkDraftOwners(child);
      draftOwnersPostOrder.push(owner);
    };
    walkDraftOwners(attempt.owner);
    const changedContexts = /* @__PURE__ */ new Set();
    for (const draft of draftOwnersParentFirst) {
      const previous = draft.record.contextValues;
      if (previous === null || draft.contextValues === null) continue;
      for (const [context, value] of draft.contextValues) {
        if (previous.has(context) && !Object.is(previous.get(context), value)) {
          changedContexts.add(context);
        }
      }
    }
    const draftedRecords = new Set(draftOwnersParentFirst.map((owner) => owner.record));
    const retainedOwnerRoots = /* @__PURE__ */ new Set();
    for (const draft of draftOwnersParentFirst) {
      if (draft.retainedChildren === null) continue;
      for (const entry of draft.retainedChildren) retainedOwnerRoots.add(entry.record);
    }
    const committedOwnersParentFirst = [];
    const walkCommittedOwners = (owner) => {
      if (owner === null) return;
      committedOwnersParentFirst.push(owner);
      for (const child of owner.children) {
        if (!retainedOwnerRoots.has(child)) walkCommittedOwners(child);
      }
    };
    walkCommittedOwners(scoped ? attempt.owner.record : this.owner);
    const removedOwners = committedOwnersParentFirst.filter((owner) => !draftedRecords.has(owner));
    const removedEffectEventCells = collectEffectEventCells(removedOwners);
    const orderedEffectCleanups = [];
    for (const owner of removedOwners) {
      for (const hook of owner.effectOrder) {
        if (hook.mounted) orderedEffectCleanups.push({ phase: hook.phase, hook });
      }
    }
    const effectChanges = [];
    const disconnectedPreviousEffects = /* @__PURE__ */ new Set();
    for (const owner of draftOwnersParentFirst) {
      if (owner.record.visibility !== "visible" || owner.visibility === "visible" || !owner.record.mounted) {
        continue;
      }
      const nextBySlot = new Map(owner.seenEffects.map((effect) => [effect.slot, effect]));
      for (const previous of owner.record.effectOrder) {
        if (previous.phase === "insertion" || !previous.mounted) continue;
        const next = nextBySlot.get(previous.slot);
        orderedEffectCleanups.push({
          phase: previous.phase,
          hook: next?.phase === previous.phase ? next : previous
        });
        disconnectedPreviousEffects.add(previous);
      }
    }
    for (const owner of draftOwnersPostOrder) {
      const seenSlots = new Set(owner.seenEffects.map((effect) => effect.slot));
      const nextByPrevious = /* @__PURE__ */ new Map();
      for (const next of owner.seenEffects) {
        const visibilityChanged = next.phase !== "insertion" && owner.record.visibility === "visible" !== (owner.visibility === "visible");
        const changed = visibilityChanged || owner.record.hooks.get(next.slot) !== next && (next.previous === null || next.previous.phase !== next.phase || !depsEqual(next.previous.deps, next.deps) || !next.previous.mounted);
        effectChanges.push({ owner, next, changed });
        if (changed && next.previous !== null && next.previous.mounted && !disconnectedPreviousEffects.has(next.previous)) {
          nextByPrevious.set(next.previous, next);
        }
      }
      for (const previous of owner.record.effectOrder) {
        if (!seenSlots.has(previous.slot)) {
          owner.hooks.delete(previous.slot);
          if (previous.mounted && !disconnectedPreviousEffects.has(previous)) {
            orderedEffectCleanups.push({ phase: previous.phase, hook: previous });
          }
          continue;
        }
        const replacement = nextByPrevious.get(previous);
        if (replacement !== void 0) {
          orderedEffectCleanups.push({ phase: previous.phase, hook: replacement });
        }
      }
    }
    let portalReleaseError = NO_PENDING_PASSIVE_ERROR;
    const applyLogicalTopology = () => {
      const applyHost = (draft) => {
        const record = draft.record;
        const host = draft.blueprint;
        invalidateLogicalTreeFeatures(record);
        record.type = host.type;
        record.props = host.props;
        record.ref = host.ref;
        record.owner = host.owner;
        record.events = stagedEvents.get(record) ?? record.events;
        record.lifecycles = lifecycleStage.staged.get(record) ?? record.lifecycles;
        record.localCallbacks = localCallbackStage.staged.get(record) ?? record.localCallbacks;
        record.visibility = host.visibility;
      };
      const applyRangeOwner = (draft) => {
        const record = draft.record;
        const nextOwner = draft.blueprint.owner ?? null;
        if (record.owner !== nextOwner && record.owner?.range === record) {
          record.owner.range = null;
        }
        record.owner = nextOwner;
        if (nextOwner !== null) nextOwner.range = record;
      };
      const apply = (draft, parent) => {
        const record = draft.record;
        if (draft.retained === true) {
          record.parent = parent;
          return;
        }
        invalidateLogicalTreeFeatures(record);
        record.parent = parent;
        record.key = draft.blueprint.key;
        if (record.kind === "host") {
          applyHost(draft);
        } else if (record.kind === "range") {
          applyRangeOwner(draft);
        } else if (record.kind === "portal") {
          record.portalRegistration = draft.blueprint.registration;
        }
        record.children = draft.children.map((child) => child.record);
        for (const child of draft.children) apply(child, record);
      };
      if (topologyChanged) apply(draftRoot, scoped ? scopeRecord.parent : null);
      else {
        for (const draft of hostDrafts) applyHost(draft);
        for (const draft of changedRangeOwners) applyRangeOwner(draft);
      }
      stagedPortalRegistrations.clear();
      for (const registration of previousPortalRegistrations) {
        if (nextPortalRegistrations.has(registration)) continue;
        try {
          registration.release();
        } catch (error) {
          if (portalReleaseError === NO_PENDING_PASSIVE_ERROR) portalReleaseError = error;
        }
      }
    };
    const lifecycleOrder = [];
    if (lifecycleHosts.size !== 0) {
      walkDraftPostOrder(draftRoot, (draft) => {
        if (draft.retained === true) {
          for (const host of physicalRecords(draft.record.children)) {
            if (lifecycleHosts.has(host)) lifecycleOrder.push(host);
          }
          return;
        }
        if (lifecycleHosts.has(draft.record)) lifecycleOrder.push(draft.record);
      });
    }
    const hasPassiveWork = removedEffectEventCells.length !== 0 || orderedEffectCleanups.some((cleanup) => cleanup.phase === "passive") || effectChanges.some(({ next, changed }) => changed && next.phase === "passive");
    const previousReplacedEventListeners = /* @__PURE__ */ new Set();
    const previousReplacedLocalCallbacks = /* @__PURE__ */ new Set();
    if ((treeFeatures & (UNIVERSAL_TREE_EVENT | UNIVERSAL_TREE_LOCAL_CALLBACK)) !== 0) {
      const collectReplaced = (record) => {
        if (record.kind !== "host") return;
        for (const event of record.events.values()) {
          previousReplacedEventListeners.add(event.listener);
        }
        const collapsed = record.collapsedTemplate;
        if (collapsed !== void 0 && teardownRunRecords?.has(record) === true) {
          for (const entry of collapsed.events) {
            previousReplacedEventListeners.add(entry.event.listener);
          }
        }
        for (const callback of record.localCallbacks.values()) {
          previousReplacedLocalCallbacks.add(callback.listener);
        }
      };
      for (const draft of hostDrafts) collectReplaced(draft.record);
      for (const removed of removedHosts) collectReplaced(removed);
    }
    const prepareHost = (value) => this.driver.prepareBatch(this.container, value, {
      invokeLocalCallback: (listener, args) => this.invokeLocalCallback(listener, args)
    });
    const identity = this.transportIdentity(batch.version);
    let preparedHost = null;
    let preparedAsyncHost = null;
    if (this.transport?.mode === "async") {
      preparedAsyncHost = this.transport.prepareBatch(this.container, batch, identity);
      if (!isValidPreparedHostBatch(preparedAsyncHost)) {
        throw new TypeError(
          "A universal async transport must return a valid prepared batch token."
        );
      }
    } else {
      preparedHost = this.transport === null ? prepareHost(batch) : this.transport.prepareBatch(this.container, batch, prepareHost);
      if (!isValidPreparedHostBatch(preparedHost)) {
        throw new TypeError("A universal host driver must return a valid prepared batch token.");
      }
    }
    const transaction = new UniversalTransactionImpl(
      this,
      batch,
      preparedHost === null ? null : () => preparedHost.apply(),
      preparedAsyncHost === null ? null : (acknowledge) => preparedAsyncHost.apply(acknowledge),
      identity,
      () => {
        applyLogicalTopology();
        if (teardownRunRecords !== null && teardownRunRecords.size !== 0) {
          for (const record of teardownRunRecords.keys()) {
            delete record.collapsedTemplate;
            this.collapsedTemplates?.delete(record);
          }
        }
        if (stagedCollapsedTemplates.size !== 0) {
          const collapsed = this.collapsedTemplates ??= /* @__PURE__ */ new Set();
          for (const [record, state] of stagedCollapsedTemplates) {
            record.collapsedTemplate = state;
            collapsed.add(record);
          }
        }
        if (this.hostAttachments !== null && (treeFeatures & UNIVERSAL_TREE_REF) !== 0) {
          for (const record of removedHosts) this.hostAttachments.records.delete(record.id);
          for (const draft of hostDrafts) {
            this.hostAttachments.records.set(draft.record.id, draft.record);
          }
        }
        if ((treeFeatures & UNIVERSAL_TREE_EVENT) !== 0) {
          const handlers = this.handlers;
          for (const listener of previousCollapsedEventListeners) {
            EVENT_DISPATCHERS.delete(listener);
            this.publishedListeners.delete(listener);
            handlers.delete(listener);
          }
          for (const [record, events] of stagedEvents) {
            if (!stagedVisibleEventRecords.has(record)) continue;
            for (const event of events.values()) {
              previousReplacedEventListeners.delete(event.listener);
              handlers.set(event.listener, event);
              if (!this.publishedListeners.has(event.listener)) {
                this.publishedListeners.add(event.listener);
                EVENT_DISPATCHERS.set(
                  event.listener,
                  (payload) => this.dispatchEvent(event.listener, payload)
                );
              }
            }
          }
          for (const listener of previousReplacedEventListeners) {
            EVENT_DISPATCHERS.delete(listener);
            this.publishedListeners.delete(listener);
            handlers.delete(listener);
          }
          for (const event of nextCollapsedEvents) {
            handlers.set(event.listener, event);
            if (!this.publishedListeners.has(event.listener)) {
              this.publishedListeners.add(event.listener);
              EVENT_DISPATCHERS.set(
                event.listener,
                (payload) => this.dispatchEvent(event.listener, payload)
              );
            }
          }
        }
        if ((treeFeatures & UNIVERSAL_TREE_LOCAL_CALLBACK) !== 0) {
          const localCallbacks = this.localCallbacks;
          for (const listener of previousReplacedLocalCallbacks) {
            localCallbacks.delete(listener);
          }
          for (const callbacks of localCallbackStage.staged.values()) {
            for (const callback of callbacks.values()) {
              localCallbacks.set(callback.listener, callback);
            }
          }
        }
        for (const owner of removedOwners) {
          owner.disposed = true;
          owner.mounted = false;
          owner.componentProps = null;
          owner.range = null;
          owner.updates.clear();
        }
        for (const draft of draftOwnersParentFirst) {
          const record = draft.record;
          record.componentProps = draft.componentProps;
          record.componentRevision = draft.componentRevision;
          if (!scoped || draft !== attempt.owner) {
            record.parent = draft.parent?.record ?? null;
          }
          record.hooks = draft.hooks;
          record.effectOrder = [...draft.seenEffects];
          for (let index = 0; index < draft.seenEffects.length; index++) {
            draft.seenEffects[index].previous = null;
          }
          if (draft.retainedChildren === null) {
            record.children = draft.children.map((child) => child.record);
          } else {
            const merged = [];
            let retainedIndex = 0;
            for (let index = 0; index <= draft.children.length; index++) {
              while (retainedIndex < draft.retainedChildren.length && draft.retainedChildren[retainedIndex].position === index) {
                merged.push(draft.retainedChildren[retainedIndex++].record);
              }
              if (index < draft.children.length) merged.push(draft.children[index].record);
            }
            record.children = merged;
          }
          record.contextValues = draft.contextValues;
          record.isBoundary = draft.isBoundary;
          record.canHandleSuspense = draft.canHandleSuspense;
          record.boundaryError = draft.boundaryError;
          record.hasBoundaryError = draft.hasBoundaryError;
          record.boundaryThenable = draft.boundaryThenable;
          record.visibility = draft.visibility;
          record.mounted = true;
          record.disposed = false;
          for (const [slot, applied] of draft.appliedUpdates) {
            const queue = record.updates.get(slot);
            if (queue !== applied.queue) continue;
            if (!applied.lane) {
              queue.splice(0, applied.consumed);
              if (queue.batches !== void 0) {
                queue.batches.splice(0, applied.consumed);
                queue.rebases?.splice(0, applied.consumed);
                queue.baseState = applied.baseState;
              }
              if (queue.length === 0) record.updates.delete(slot);
              continue;
            }
            const appendedValues = queue.slice(applied.consumed);
            const appendedBatches = queue.batches?.slice(applied.consumed) ?? new Array(appendedValues.length).fill(null);
            const appendedRebases = queue.rebases?.slice(applied.consumed) ?? new Array(appendedValues.length).fill(false);
            queue.length = 0;
            queue.push(...applied.remainingValues, ...appendedValues);
            queue.baseState = applied.baseState;
            queue.batches = [...applied.remainingBatches, ...appendedBatches];
            const rebases = [...applied.remainingRebases, ...appendedRebases];
            if (rebases.some(Boolean)) queue.rebases = rebases;
            else delete queue.rebases;
            if (queue.length === 0) {
              record.updates.delete(slot);
            } else if (queue.batches.every((batch2) => batch2 === null)) {
              const pendingValues = queue.filter((_, index) => !rebases[index]);
              queue.length = 0;
              queue.push(...pendingValues);
              delete queue.kind;
              delete queue.baseState;
              delete queue.batches;
              delete queue.rebases;
              if (queue.length === 0) record.updates.delete(slot);
            }
          }
          for (const hook of record.hooks.values()) {
            if (hook.kind === "effect-event") {
              hook.cell.impl = hook.next;
              hook.cell.active = true;
            }
          }
        }
        if (!scoped) this.owner = attempt.owner.record;
        this.lastComponent = component;
        this.lastProps = props;
        this.retryRenderInput = null;
        this.urgentBoundarySuspension = null;
        if (!scoped) this.bridgeContextReads = attempt.bridgeContextReads;
        if (retryThenables.length > 0) {
          this.publishLocalReplay(retryThenables, retryMemos, component, props);
        }
        this.nextId = nextId;
        this.nextLogicalRangeId = nextLogicalRangeId;
        this.nextUniversalId = attempt.nextUniversalId;
        this.nextListener = nextListener;
        this.treeFeatures = scoped ? this.treeFeatures | attempt.treeFeatures : attempt.treeFeatures;
        for (const context of changedContexts) context.$$version++;
        if (changedContexts.size !== 0) bumpContextEpoch();
        const retainedRegionCells = /* @__PURE__ */ new Set();
        for (const { next, previous } of stagedRegionBridges) {
          retainedRegionCells.add(next.activate(previous));
        }
        const deactivatedRegionCells = /* @__PURE__ */ new Set();
        for (const previous of previousRegionBridges) {
          const cell = previous.lifecycle();
          if (cell === null || retainedRegionCells.has(cell) || deactivatedRegionCells.has(cell)) {
            continue;
          }
          deactivatedRegionCells.add(cell);
          previous.deactivate();
        }
        let bindingPublicationError = NO_PENDING_PASSIVE_ERROR;
        for (const record of removedHosts) {
          const error = this.dropHostBindings(record);
          if (bindingPublicationError === NO_PENDING_PASSIVE_ERROR) bindingPublicationError = error;
        }
        for (const draft of hostDrafts) {
          try {
            const error = this.commitHostBindings(draft.record, draft.blueprint);
            if (bindingPublicationError === NO_PENDING_PASSIVE_ERROR)
              bindingPublicationError = error;
          } catch (error) {
            if (bindingPublicationError === NO_PENDING_PASSIVE_ERROR)
              bindingPublicationError = error;
          }
        }
        if (bindingPublicationError !== NO_PENDING_PASSIVE_ERROR) throw bindingPublicationError;
        if (portalReleaseError !== NO_PENDING_PASSIVE_ERROR) throw portalReleaseError;
      },
      () => (preparedHost ?? preparedAsyncHost)?.afterAccept?.(),
      () => {
        const tasks = [];
        for (const cleanup of orderedEffectCleanups) {
          if (cleanup.phase === "insertion") {
            tasks.push(() => runOwnedEffectCleanup(cleanup.hook));
          }
        }
        for (const { next, changed } of effectChanges) {
          if (changed && next.phase === "insertion") tasks.push(() => runOwnedEffectCreate(next));
        }
        for (const cleanup of orderedEffectCleanups) {
          if (cleanup.phase === "layout") {
            tasks.push(() => runOwnedEffectCleanup(cleanup.hook));
          }
        }
        for (const { record, ref, cleanup } of refDetaches) {
          tasks.push(() => runOwnedCommit(record.owner, () => detachRef(record, ref, cleanup)));
        }
        runCommitTasks(tasks);
      },
      () => {
        const tasks = [];
        for (const record of lifecycleOrder) {
          for (const callback of record.lifecycles.values()) {
            tasks.push(
              () => runOwnedCommit(
                callback.owner,
                () => callback.handler(this.driver.getPublicInstance(this.container, record.id))
              )
            );
          }
        }
        runCommitTasks(tasks);
      },
      () => {
        const tasks = [];
        if (this.driver.attachments === void 0) {
          for (const draft of refAttaches) {
            const record = draft.record;
            tasks.push(
              () => runOwnedCommit(
                record.owner,
                () => attachRef(record, this.driver.getPublicInstance(this.container, record.id))
              )
            );
          }
        } else {
          for (const draft of refAttaches) {
            const record = draft.record;
            tasks.push(() => runOwnedCommit(record.owner, () => this.attachHostRef(record)));
          }
          tasks.push(() => this.flushPendingHostAttachmentBatches());
        }
        for (const { owner, next, changed } of effectChanges) {
          if (changed && next.phase === "layout" && owner.visibility === "visible") {
            tasks.push(() => runOwnedEffectCreate(next));
          }
        }
        runCommitTasks(tasks);
      },
      hasPassiveWork ? () => {
        const tasks = [];
        try {
          for (const cleanup of orderedEffectCleanups) {
            if (cleanup.phase === "passive") {
              tasks.push(() => runOwnedEffectCleanup(cleanup.hook));
            }
          }
          if (this.unmounted || this.owner === null || this.owner.disposed) {
            runCommitTasks(tasks);
            return;
          }
          for (const { owner, next, changed } of effectChanges) {
            if (!changed || next.phase !== "passive") continue;
            if (owner.record.hooks.get(next.slot) !== next || owner.record.disposed || owner.record.visibility !== "visible") {
              continue;
            }
            tasks.push(() => runOwnedEffectCreate(next));
          }
          runCommitTasks(tasks);
        } finally {
          deactivateEffectEventCells(removedEffectEventCells);
        }
      } : null,
      () => preparedHost === null ? preparedAsyncHost.abort() : preparedHost.abort(),
      () => {
        const tasks = [...stagedPortalRegistrations].map(
          (registration) => () => registration.release()
        );
        stagedPortalRegistrations.clear();
        tasks.push(() => this.discardDraftOwners(draftOwnersParentFirst));
        runCommitTasks(tasks);
      },
      attempt.transitionBatches
    );
    return transaction;
  }
  finish(transaction) {
    if (this.pending === transaction) {
      this.pending = null;
      if (transaction.status === "committed") {
        this.completeTransitionBatches(transaction.transitionBatches);
      } else {
        this.requeueTransitionBatches(transaction.transitionBatches);
      }
      if (this.hostAttachments !== null) this.queueHostAttachmentFlush();
      this.ensureScheduledTransitionWork();
      if ((this.dirtyBoundHosts.length !== 0 || this.dirtyBoundSources.length !== 0) && !this.boundHostScheduled) {
        this.scheduleHostBindingUpdate();
      }
    }
  }
  unmount() {
    if (this.hasAsyncTransport()) {
      throw new Error("A transported universal root must use unmountAsync().");
    }
    if (this.unmounted) return;
    const work = this.stageUnmount();
    let acceptedHostError = NO_PENDING_PASSIVE_ERROR;
    if (work.batch !== null) {
      const prepare = (value) => this.driver.prepareBatch(this.container, value, {
        invokeLocalCallback: (listener, args) => this.invokeLocalCallback(listener, args)
      });
      const prepared = this.transport === null ? prepare(work.batch) : this.transport.prepareBatch(
        this.container,
        work.batch,
        prepare
      );
      try {
        runCommitTasks([
          () => prepared.apply(),
          () => this.markBatchAccepted(work.batch.version),
          () => prepared.afterAccept?.()
        ]);
      } catch (error) {
        acceptedHostError = error;
      }
    }
    work.finalize(acceptedHostError);
  }
  unmountAsync() {
    const transport = this.transport;
    if (transport?.mode !== "async") {
      try {
        this.unmount();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
    if (this.unmountPromise !== null) return this.unmountPromise;
    if (this.unmounted) return Promise.resolve();
    if (this.pending?.isAwaitingTransportAcknowledgement()) {
      return Promise.reject(
        new Error("Cannot unmount a universal root while a batch awaits acknowledgement.")
      );
    }
    this.unmounting = true;
    let work;
    try {
      work = this.stageUnmount();
    } catch (error) {
      this.resumeAfterRejectedUnmount();
      return Promise.reject(error);
    }
    if (work.batch === null) {
      try {
        work.finalize(NO_PENDING_PASSIVE_ERROR);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
    const batch = work.batch;
    const identity = this.transportIdentity(batch.version);
    let prepared;
    try {
      prepared = transport.prepareBatch(this.container, batch, identity);
    } catch (error) {
      this.resumeAfterRejectedUnmount();
      return Promise.reject(error);
    }
    if (!isValidPreparedHostBatch(prepared)) {
      this.resumeAfterRejectedUnmount();
      return Promise.reject(
        new TypeError("A universal async transport must return a valid prepared batch token.")
      );
    }
    let acknowledged = false;
    let closed = false;
    let finalizeError = NO_PENDING_PASSIVE_ERROR;
    const rejectBeforeAcknowledgement = (error) => {
      closed = true;
      runCommitTasks([
        () => {
          throw error;
        },
        () => prepared.abort(),
        () => this.resumeAfterRejectedUnmount()
      ]);
      throw error;
    };
    const acknowledge = (message) => {
      if (closed || acknowledged || this.unmounted) {
        throw new Error(
          `Universal transport received a stale or duplicate acknowledgement for batch ${batch.version}.`
        );
      }
      this.validateTransportAcknowledgement(message, batch.version);
      acknowledged = true;
      this.markBatchAccepted(batch.version);
      try {
        runCommitTasks([
          () => prepared.afterAccept?.(),
          () => work.finalize(NO_PENDING_PASSIVE_ERROR)
        ]);
      } catch (error) {
        finalizeError = error;
      }
    };
    let applying;
    try {
      const result = prepared.apply(acknowledge);
      if (result === null || typeof result !== "object" || typeof result.then !== "function") {
        throw new TypeError("A universal async transport apply() method must return a Promise.");
      }
      applying = Promise.resolve(result);
    } catch (error) {
      closed = true;
      applying = Promise.reject(error);
    }
    this.unmountPromise = applying.then(
      () => {
        closed = true;
        if (!acknowledged) {
          return rejectBeforeAcknowledgement(
            new Error(
              `Universal transport completed teardown batch ${batch.version} without acknowledgement.`
            )
          );
        }
        if (finalizeError !== NO_PENDING_PASSIVE_ERROR) throw finalizeError;
      },
      (error) => {
        closed = true;
        if (!acknowledged) {
          return rejectBeforeAcknowledgement(error);
        }
        if (finalizeError !== NO_PENDING_PASSIVE_ERROR) throw finalizeError;
        throw error;
      }
    ).finally(() => {
      this.unmountPromise = null;
    });
    return this.unmountPromise;
  }
  stageUnmount() {
    let pendingAbortError = NO_PENDING_PASSIVE_ERROR;
    try {
      this.pending?.abort();
    } catch (error) {
      pendingAbortError = error;
    }
    this.expandCollapsedTemplates();
    const owners = [];
    const collectOwners = (owner) => {
      if (owner === null) return;
      owners.push(owner);
      for (const child of owner.children) collectOwners(child);
    };
    collectOwners(this.owner);
    const stagedTransitionBatches = /* @__PURE__ */ new Set();
    for (const owner of owners) {
      for (const queue of owner.updates.values()) {
        for (const transition of queue.batches ?? []) {
          if (transition !== null) stagedTransitionBatches.add(transition);
        }
      }
    }
    const effectEventCells = collectEffectEventCells(owners);
    const effects = owners.flatMap((owner) => owner.effectOrder);
    const children = [...this.rootRecord.children];
    const regionBridges = /* @__PURE__ */ new Set();
    for (const child of children) {
      walkLogical(child, (record) => {
        if (record.kind !== "host") return;
        for (const value of Object.values(record.props)) {
          const bridge = rendererRegionOwnerBridge(value);
          if (bridge !== null) regionBridges.add(bridge);
        }
      });
    }
    const physical = physicalRecords(this.rootRecord.children);
    const portalRegistrations = /* @__PURE__ */ new Set();
    const portalRemoves = [];
    for (const child of this.rootRecord.children) {
      walkLogical(child, (record) => {
        if (record.kind !== "portal" || record.portalRegistration === null) return;
        portalRegistrations.add(record.portalRegistration);
        for (const physicalChild of physicalRecords(record.children)) {
          portalRemoves.push({
            op: "remove",
            parent: record.portalRegistration.handle,
            id: physicalChild.id
          });
        }
      });
    }
    const removedHosts = [];
    for (const child of this.rootRecord.children) collectRemovedPostOrder(child, removedHosts);
    const batch = removedHosts.length === 0 ? null : freezeUniversalHostBatch(this.renderer, this.nextBatchVersion++, [
      ...removedHosts.flatMap(
        (record) => [...record.events.keys()].map((type) => ({
          op: "event",
          id: record.id,
          type,
          listener: null
        }))
      ),
      ...removedHosts.flatMap(
        (record) => [...record.lifecycles.keys()].map((type) => ({
          op: "lifecycle",
          id: record.id,
          type,
          listener: null
        }))
      ),
      ...removedHosts.flatMap(
        (record) => [...record.localCallbacks.keys()].map((type) => ({
          op: "local-callback",
          id: record.id,
          type,
          listener: null
        }))
      ),
      ...physical.map((record) => ({
        op: "remove",
        parent: null,
        id: record.id
      })),
      ...portalRemoves,
      ...removedHosts.map((record) => ({ op: "destroy", id: record.id }))
    ]);
    return {
      batch,
      finalize: (acceptedHostError) => {
        let bindingUnsubscribeError = NO_PENDING_PASSIVE_ERROR;
        if (this.boundHosts !== null) {
          for (const record of [...this.boundHosts.keys()]) {
            const error = this.dropHostBindings(record);
            if (bindingUnsubscribeError === NO_PENDING_PASSIVE_ERROR)
              bindingUnsubscribeError = error;
          }
        }
        this.dirtyBoundHosts = [];
        this.dirtyBoundHostSet.clear();
        this.dirtyBoundSources = [];
        this.dirtyBoundSourceSet.clear();
        this.boundHostScheduled = false;
        this.scheduled = false;
        this.scheduledUrgent = false;
        this.scheduledFullRoot = false;
        this.scheduledOwners.clear();
        SCHEDULED_UNIVERSAL_ROOTS.delete(this);
        const transitionBatches = new Set(this.takeScheduledTransitionBatches());
        for (const transition of stagedTransitionBatches) transitionBatches.add(transition);
        this.finishTransitionBatches(transitionBatches);
        this.suspended?.abort();
        this.cancelSuspendedReplays();
        this.scheduled = false;
        this.scheduledUrgent = false;
        this.scheduledFullRoot = false;
        this.scheduledOwners.clear();
        SCHEDULED_UNIVERSAL_ROOTS.delete(this);
        let attachmentUnsubscribeError = NO_PENDING_PASSIVE_ERROR;
        if (this.hostAttachments !== null) {
          try {
            this.disposeHostAttachments();
          } catch (error) {
            attachmentUnsubscribeError = error;
          }
        }
        this.rootRecord.children = [];
        this.rootRecord.treeFeatures = null;
        this.rootRecord.owner = null;
        let portalReleaseError = NO_PENDING_PASSIVE_ERROR;
        for (const registration of portalRegistrations) {
          try {
            registration.release();
          } catch (error) {
            if (portalReleaseError === NO_PENDING_PASSIVE_ERROR) portalReleaseError = error;
          }
        }
        this.portalHandles.clear();
        for (const listener of this.publishedListeners) EVENT_DISPATCHERS.delete(listener);
        this.publishedListeners.clear();
        this.handlers = /* @__PURE__ */ new Map();
        this.localCallbacks = /* @__PURE__ */ new Map();
        for (const owner of owners) {
          owner.disposed = true;
          owner.mounted = false;
          owner.componentProps = null;
          owner.range = null;
          owner.updates.clear();
        }
        const deactivatedRegionCells = /* @__PURE__ */ new Set();
        for (const bridge of regionBridges) {
          const cell = bridge.lifecycle();
          if (cell === null || deactivatedRegionCells.has(cell)) continue;
          deactivatedRegionCells.add(cell);
          bridge.deactivate();
        }
        this.owner = null;
        this.urgentBoundarySuspension = null;
        this.bridgeContextReads = null;
        this.treeFeatures = 0;
        this.unmounted = true;
        this.unmounting = false;
        this.lastComponent = null;
        this.retryRenderInput = null;
        let pendingPassiveError = NO_PENDING_PASSIVE_ERROR;
        try {
          this.flushPassiveTasks();
        } catch (error) {
          pendingPassiveError = error;
        }
        const insertionTasks = [];
        const layoutTasks = [];
        const refTasks = [];
        const passiveTasks = [];
        for (const hook of effects) {
          if (!hook.mounted) continue;
          if (hook.phase === "passive") passiveTasks.push(() => runOwnedEffectCleanup(hook));
          else if (hook.phase === "insertion") {
            insertionTasks.push(() => runOwnedEffectCleanup(hook));
          } else {
            layoutTasks.push(() => runOwnedEffectCleanup(hook));
          }
        }
        for (const child of children) {
          walkLogical(child, (record) => {
            if (record.refAttached) {
              refTasks.push(() => runOwnedCommit(record.owner, () => detachRef(record)));
            }
          });
        }
        const syncTasks = [...insertionTasks, ...layoutTasks, ...refTasks];
        if (bindingUnsubscribeError !== NO_PENDING_PASSIVE_ERROR) {
          syncTasks.unshift(() => {
            throw bindingUnsubscribeError;
          });
        }
        if (attachmentUnsubscribeError !== NO_PENDING_PASSIVE_ERROR) {
          syncTasks.unshift(() => {
            throw attachmentUnsubscribeError;
          });
        }
        if (acceptedHostError !== NO_PENDING_PASSIVE_ERROR) {
          syncTasks.unshift(() => {
            throw acceptedHostError;
          });
        }
        if (portalReleaseError !== NO_PENDING_PASSIVE_ERROR) {
          syncTasks.unshift(() => {
            throw portalReleaseError;
          });
        }
        if (pendingPassiveError !== NO_PENDING_PASSIVE_ERROR) {
          syncTasks.unshift(() => {
            throw pendingPassiveError;
          });
        }
        if (pendingAbortError !== NO_PENDING_PASSIVE_ERROR) {
          syncTasks.unshift(() => {
            throw pendingAbortError;
          });
        }
        if (passiveTasks.length > 0) {
          this.enqueuePassive(() => {
            try {
              runCommitTasks(passiveTasks);
            } finally {
              deactivateEffectEventCells(effectEventCells);
            }
          });
          runCommitTasks(syncTasks);
        } else {
          try {
            runCommitTasks(syncTasks);
          } finally {
            deactivateEffectEventCells(effectEventCells);
          }
        }
      }
    };
  }
}
class UniversalBoundHostTransaction {
  constructor(root, batch, prepared, changedRecords, records) {
    this.root = root;
    this.batch = batch;
    this.prepared = prepared;
    this.changedRecords = changedRecords;
    this.records = records;
  }
  root;
  batch;
  prepared;
  changedRecords;
  records;
  state = "prepared";
  hostAccepted = false;
  transitionBatches = EMPTY_UNIVERSAL_TRANSITION_BATCHES;
  get status() {
    return this.state;
  }
  isAwaitingTransportAcknowledgement() {
    return false;
  }
  commit() {
    if (this.state !== "prepared" || this.hostAccepted) return;
    this.hostAccepted = true;
    let failure = NO_PENDING_PASSIVE_ERROR;
    UNIVERSAL_COMMIT_TASK_DEPTH++;
    try {
      try {
        this.prepared.apply();
      } catch (error) {
        failure = error;
      }
      try {
        this.root.markBatchAccepted(this.batch.version);
      } catch (error) {
        if (failure === NO_PENDING_PASSIVE_ERROR) failure = error;
      }
      try {
        for (let index = 0; index < this.changedRecords.length; index++) {
          invalidateLogicalTreeFeatures(this.changedRecords[index]);
          this.changedRecords[index].props = this.batch.commands[index].props;
        }
      } catch (error) {
        if (failure === NO_PENDING_PASSIVE_ERROR) failure = error;
      }
      try {
        this.prepared.afterAccept?.();
      } catch (error) {
        if (failure === NO_PENDING_PASSIVE_ERROR) failure = error;
      }
    } finally {
      UNIVERSAL_COMMIT_TASK_DEPTH--;
      this.state = "committed";
      try {
        this.root.finish(this);
      } catch (error) {
        if (failure === NO_PENDING_PASSIVE_ERROR) failure = error;
      }
    }
    if (failure !== NO_PENDING_PASSIVE_ERROR) throw failure;
  }
  commitAsync() {
    try {
      this.commit();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  abort() {
    if (this.state !== "prepared") return;
    if (this.hostAccepted) {
      throw new Error("A universal transaction cannot be aborted after its host batch committed.");
    }
    this.state = "aborted";
    let failure = NO_PENDING_PASSIVE_ERROR;
    UNIVERSAL_COMMIT_TASK_DEPTH++;
    try {
      try {
        this.prepared.abort();
      } catch (error) {
        failure = error;
      }
      try {
        this.root.restoreAbortedHostBindingRecords(this.records);
      } catch (error) {
        if (failure === NO_PENDING_PASSIVE_ERROR) failure = error;
      }
    } finally {
      UNIVERSAL_COMMIT_TASK_DEPTH--;
      try {
        this.root.finish(this);
      } catch (error) {
        if (failure === NO_PENDING_PASSIVE_ERROR) failure = error;
      }
    }
    if (failure !== NO_PENDING_PASSIVE_ERROR) throw failure;
  }
}
class UniversalTransactionImpl {
  constructor(root, batch, applyHost, applyHostAsync, transportIdentity, publishHost, afterHostAccept, afterMutation, lifecycle, layout, passive, abortHost, onAbort, transitionBatches) {
    this.root = root;
    this.batch = batch;
    this.applyHost = applyHost;
    this.applyHostAsync = applyHostAsync;
    this.transportIdentity = transportIdentity;
    this.publishHost = publishHost;
    this.afterHostAccept = afterHostAccept;
    this.afterMutation = afterMutation;
    this.lifecycle = lifecycle;
    this.layout = layout;
    this.passive = passive;
    this.abortHost = abortHost;
    this.onAbort = onAbort;
    this.transitionBatches = transitionBatches;
  }
  root;
  batch;
  applyHost;
  applyHostAsync;
  transportIdentity;
  publishHost;
  afterHostAccept;
  afterMutation;
  lifecycle;
  layout;
  passive;
  abortHost;
  onAbort;
  transitionBatches;
  state = "prepared";
  hostAccepted = false;
  commitStarted = false;
  completion = null;
  acceptedCommitError = NO_PENDING_PASSIVE_ERROR;
  passiveScheduled = false;
  passiveRan = false;
  get status() {
    return this.state;
  }
  isAwaitingTransportAcknowledgement() {
    return this.applyHostAsync !== null && this.commitStarted && !this.hostAccepted;
  }
  commitMutation() {
    if (this.state !== "prepared" || this.hostAccepted) return;
    if (this.applyHost === null) {
      throw new Error("A transported universal transaction must use commitAsync().");
    }
    this.commitStarted = true;
    this.hostAccepted = true;
    runCommitTasks([
      this.applyHost,
      () => this.root.markBatchAccepted(this.batch.version),
      this.publishHost,
      this.afterHostAccept,
      this.afterMutation,
      this.lifecycle
    ]);
  }
  commitLayout() {
    if (this.state !== "prepared") return;
    if (!this.hostAccepted) this.commitMutation();
    if (this.state !== "prepared") return;
    try {
      this.layout();
    } finally {
      this.state = "committed";
      this.root.finish(this);
      this.schedulePassive();
    }
  }
  commitPassive() {
    if (this.state !== "committed") return;
    this.schedulePassive();
    this.root.flushPassivesBeforeRender();
  }
  commit() {
    if (this.state !== "prepared") return;
    if (this.applyHostAsync !== null) {
      throw new Error("A transported universal transaction must use commitAsync().");
    }
    let hasError = false;
    let firstError;
    try {
      this.commitMutation();
    } catch (error) {
      hasError = true;
      firstError = error;
    }
    if (this.hostAccepted) {
      try {
        this.commitLayout();
      } catch (error) {
        if (!hasError) {
          hasError = true;
          firstError = error;
        }
      }
    }
    if (hasError) throw firstError;
  }
  commitAsync() {
    if (this.applyHostAsync === null) {
      try {
        this.commit();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
    if (this.completion !== null) return this.completion;
    if (this.state !== "prepared") return Promise.resolve();
    this.commitStarted = true;
    const acknowledge = (message) => {
      if (this.state !== "prepared" || this.hostAccepted) {
        throw new Error(
          `Universal transport received a stale or duplicate acknowledgement for batch ${this.batch.version}.`
        );
      }
      this.root.validateTransportAcknowledgement(message, this.transportIdentity.version);
      this.hostAccepted = true;
      let hasError = false;
      let firstError;
      try {
        runCommitTasks([
          () => this.root.markBatchAccepted(this.batch.version),
          this.publishHost,
          this.afterHostAccept,
          this.afterMutation,
          this.lifecycle
        ]);
      } catch (error) {
        hasError = true;
        firstError = error;
      }
      try {
        this.commitLayout();
      } catch (error) {
        if (!hasError) {
          hasError = true;
          firstError = error;
        }
      }
      if (hasError) this.acceptedCommitError = firstError;
    };
    let applying;
    try {
      const result = this.applyHostAsync(acknowledge);
      if (result === null || typeof result !== "object" || typeof result.then !== "function") {
        throw new TypeError("A universal async transport apply() method must return a Promise.");
      }
      applying = Promise.resolve(result);
    } catch (error) {
      applying = Promise.reject(error);
    }
    this.completion = applying.then(
      () => {
        if (!this.hostAccepted) {
          const error = new Error(
            `Universal transport completed batch ${this.batch.version} without acknowledgement.`
          );
          this.rejectBeforeAcknowledgement();
          throw error;
        }
        if (this.acceptedCommitError !== NO_PENDING_PASSIVE_ERROR) {
          throw this.acceptedCommitError;
        }
      },
      (error) => {
        if (!this.hostAccepted) {
          this.rejectBeforeAcknowledgement();
          throw error;
        }
        if (this.acceptedCommitError !== NO_PENDING_PASSIVE_ERROR) {
          throw this.acceptedCommitError;
        }
        throw error;
      }
    );
    return this.completion;
  }
  rejectBeforeAcknowledgement() {
    if (this.state !== "prepared" || this.hostAccepted) return;
    this.state = "aborted";
    try {
      runCommitTasks([this.abortHost, this.onAbort]);
    } finally {
      this.root.finish(this);
    }
  }
  schedulePassive() {
    const passive = this.passive;
    if (passive === null || this.passiveScheduled) return;
    this.passiveScheduled = true;
    this.root.enqueuePassive(() => {
      if (this.passiveRan) return;
      this.passiveRan = true;
      passive();
    });
  }
  abort() {
    if (this.state !== "prepared") return;
    if (this.hostAccepted) {
      throw new Error("A universal transaction cannot be aborted after its host batch committed.");
    }
    if (this.commitStarted) {
      throw new Error(
        "A universal transaction cannot be aborted while awaiting transport acknowledgement."
      );
    }
    this.state = "aborted";
    try {
      runCommitTasks([this.abortHost, this.onAbort]);
    } finally {
      this.root.finish(this);
    }
  }
}
function queuePendingUniversalWork() {
  for (const root of [...SCHEDULED_UNIVERSAL_ROOTS]) root.queueScheduledWork();
}
function flushScheduledUniversalWave() {
  for (const root of [...SCHEDULED_UNIVERSAL_ROOTS]) root.flushScheduledWork();
}
function flushUniversalPassiveWave() {
  for (const root of [...PENDING_UNIVERSAL_PASSIVE_ROOTS]) root.flushPassiveTasks();
}
const INLINE_UNIVERSAL_FLUSHER = (run) => run();
function getUniversalHostFlusher() {
  return getRendererHostFlusher();
}
function runUniversalSyncBoundary(run, flushOwner, includePassives, label) {
  const canDrain = UNIVERSAL_SYNC_DEPTH === 0 && CURRENT_ATTEMPT === null && UNIVERSAL_COMMIT_TASK_DEPTH === 0;
  UNIVERSAL_SYNC_DEPTH++;
  if (!canDrain) {
    try {
      return run();
    } finally {
      UNIVERSAL_SYNC_DEPTH--;
      if (UNIVERSAL_SYNC_DEPTH === 0) queuePendingUniversalWork();
    }
  }
  let completed = false;
  let invoked = false;
  let result;
  try {
    for (let pass = 0; pass < UNIVERSAL_SYNC_DRAIN_LIMIT; pass++) {
      flushOwner(() => {
        if (!invoked) {
          invoked = true;
          result = run();
        }
        flushScheduledUniversalWave();
        if (includePassives) flushUniversalPassiveWave();
      });
      if (SCHEDULED_UNIVERSAL_ROOTS.size === 0 && (!includePassives || PENDING_UNIVERSAL_PASSIVE_ROOTS.size === 0)) {
        completed = true;
        return result;
      }
    }
    throw new Error(
      `${label}(): scheduler did not stabilize after ${UNIVERSAL_SYNC_DRAIN_LIMIT} iterations \u2014 likely an infinite render loop`
    );
  } finally {
    UNIVERSAL_SYNC_DEPTH--;
    if (UNIVERSAL_SYNC_DEPTH === 0 && !completed) queuePendingUniversalWork();
  }
}
function flushUniversalSync(run, flushOwner = INLINE_UNIVERSAL_FLUSHER) {
  return runUniversalSyncBoundary(run, flushOwner, false, "flushUniversalSync");
}
function flushUniversalAct(run, flushOwner = INLINE_UNIVERSAL_FLUSHER) {
  return runUniversalSyncBoundary(run, flushOwner, true, "flushUniversalAct");
}
function createUniversalRoot(container, driver, options = {}) {
  if (options.scheduleMicrotask !== void 0 && typeof options.scheduleMicrotask !== "function") {
    throw new TypeError("Universal root options.scheduleMicrotask must be a function.");
  }
  const scheduleMicrotask = options.scheduleMicrotask ?? null;
  if (scheduleMicrotask === null && readGlobalMicrotaskScheduler() === void 0) {
    throw new Error(
      "Universal roots require options.scheduleMicrotask when the host has no global queueMicrotask."
    );
  }
  const root = new UniversalRootImpl(
    container,
    driver,
    options.transport ?? null,
    scheduleMicrotask
  );
  registerUniversalRootErrorHandlers(root, options);
  return root;
}
function readGlobalMicrotaskScheduler() {
  const scheduler = globalThis.queueMicrotask;
  return typeof scheduler === "function" ? scheduler : void 0;
}
const OBJECT_DRIVER_STATE = /* @__PURE__ */ Symbol("octane.object-driver.state");
function createObjectContainer(renderer = "object") {
  assertRendererId(renderer, "Object container renderer");
  const state = {
    instances: /* @__PURE__ */ new Map(),
    parents: /* @__PURE__ */ new Map(),
    events: /* @__PURE__ */ new Map(),
    lifecycles: /* @__PURE__ */ new Map(),
    localCallbacks: /* @__PURE__ */ new Map(),
    localCleanups: /* @__PURE__ */ new Map()
  };
  return {
    renderer,
    children: [],
    commits: [],
    get instanceCount() {
      return state.instances.size;
    },
    dispatchEvent(instance, type, payload) {
      const id = typeof instance === "number" ? instance : instance.id;
      const current = state.instances.get(id);
      if (current === void 0) throw new Error(`Object driver: unknown event target ${id}.`);
      if (typeof instance !== "number" && current !== instance) {
        throw new Error(`Object driver: stale event target ${id}.`);
      }
      const listener = state.events.get(id)?.get(type.toLowerCase());
      if (listener === void 0) {
        throw new Error(`Object driver: target ${id} has no ${JSON.stringify(type)} listener.`);
      }
      const dispatch = EVENT_DISPATCHERS.get(listener.id);
      if (dispatch === void 0) {
        throw new Error(`Object driver: inactive listener ${listener.id}.`);
      }
      return dispatch(payload);
    },
    [OBJECT_DRIVER_STATE]: state
  };
}
function objectChildren(container, parent, instances) {
  if (parent === null) return container.children;
  const instance = instances.get(parent);
  if (instance === void 0) throw new Error(`Object driver: unknown parent ${parent}.`);
  return instance.children;
}
function createObjectDriver(renderer = "object") {
  assertRendererId(renderer, "Object driver renderer");
  return {
    id: renderer,
    capabilities: { text: "host", localHostCallbacks: true, visibility: true },
    events: {
      classify(name) {
        if (!/^on[A-Z]/.test(name)) return null;
        return { type: name.slice(2).toLowerCase(), priority: "discrete" };
      }
    },
    lifecycles: {
      classify(name) {
        return name === "onUpdate" ? { type: "update" } : null;
      }
    },
    localCallbacks: {
      classify(name, value) {
        return name === "attach" && (value == null || typeof value === "function") ? { type: "attach" } : null;
      }
    },
    prepareBatch(container, batch, context) {
      if (container.renderer !== renderer || batch.renderer !== renderer) {
        throw new Error(
          `Object driver renderer mismatch: driver ${JSON.stringify(renderer)}, container ${JSON.stringify(container.renderer)}, batch ${JSON.stringify(batch.renderer)}.`
        );
      }
      const state = container[OBJECT_DRIVER_STATE];
      const useBatchedDetaches = batch.commands.length >= 4096;
      const simulated = /* @__PURE__ */ new Map();
      const destroyed = /* @__PURE__ */ new Set();
      const readSimulated = (id) => {
        if (destroyed.has(id)) return void 0;
        let value = simulated.get(id);
        if (value !== void 0) return value;
        const instance = state.instances.get(id);
        if (instance === void 0) return void 0;
        value = {
          type: instance.type,
          props: instance.props,
          visible: instance.visible,
          children: instance.children.map((child) => child.id),
          events: new Map(state.events.get(id)),
          lifecycles: new Map(state.lifecycles.get(id)),
          localCallbacks: new Map(state.localCallbacks.get(id))
        };
        simulated.set(id, value);
        return value;
      };
      const hasSimulated = (id) => !destroyed.has(id) && (simulated.has(id) || state.instances.has(id));
      const stagedInstances = /* @__PURE__ */ new Map();
      const cleanupKeys = /* @__PURE__ */ new Set();
      const invokeKeys = /* @__PURE__ */ new Set();
      const keyFor = (id, type) => `${id}:${type}`;
      const parseKey = (key) => {
        const separator = key.indexOf(":");
        return [Number(key.slice(0, separator)), key.slice(separator + 1)];
      };
      const DETACHED = /* @__PURE__ */ Symbol("octane.object-driver.detached");
      const parentChanges = /* @__PURE__ */ new Map();
      let rootChildren = null;
      let pendingDetaches = null;
      const readParent = (id) => {
        if (parentChanges.has(id)) return parentChanges.get(id);
        return state.parents.has(id) ? state.parents.get(id) : DETACHED;
      };
      const flushPendingDetaches = (parent, children) => {
        const detached = pendingDetaches?.get(parent);
        if (detached === void 0) return;
        let write = 0;
        for (let read = 0; read < children.length; read++) {
          const child = children[read];
          if (!detached.delete(child)) children[write++] = child;
        }
        if (detached.size !== 0) {
          const missing = detached.values().next().value;
          throw new Error(`Object driver: child ${missing} is not attached.`);
        }
        children.length = write;
        pendingDetaches.delete(parent);
        if (pendingDetaches.size === 0) pendingDetaches = null;
      };
      const simulatedChildren = (parent) => {
        let children;
        if (parent === null) {
          children = rootChildren ??= container.children.map((child) => child.id);
        } else {
          const value = readSimulated(parent);
          if (value === void 0) throw new Error(`Object driver: unknown parent ${parent}.`);
          children = value.children;
        }
        flushPendingDetaches(parent, children);
        return children;
      };
      const detachSimulated = (id, defer) => {
        const parent = readParent(id);
        if (parent === DETACHED) return;
        if (useBatchedDetaches && defer) {
          const detaches = pendingDetaches ??= /* @__PURE__ */ new Map();
          const detached = detaches.get(parent);
          if (detached === void 0) detaches.set(parent, /* @__PURE__ */ new Set([id]));
          else detached.add(id);
        } else {
          const children = simulatedChildren(parent);
          const index = children.indexOf(id);
          if (index === -1) throw new Error(`Object driver: child ${id} is not attached.`);
          children.splice(index, 1);
        }
        parentChanges.set(id, DETACHED);
      };
      const forgetPendingDetachParent = (parent) => {
        if (pendingDetaches === null) return;
        pendingDetaches.delete(parent);
        if (pendingDetaches.size === 0) pendingDetaches = null;
      };
      const flushAllPendingDetaches = () => {
        while (pendingDetaches !== null) {
          const parent = pendingDetaches.keys().next().value;
          simulatedChildren(parent);
        }
      };
      for (const command of batch.commands) {
        if (command.op === "create") {
          if (hasSimulated(command.id))
            throw new Error(`Object driver: duplicate id ${command.id}.`);
          destroyed.delete(command.id);
          simulated.set(command.id, {
            type: command.type,
            props: command.props,
            visible: true,
            children: [],
            events: /* @__PURE__ */ new Map(),
            lifecycles: /* @__PURE__ */ new Map(),
            localCallbacks: /* @__PURE__ */ new Map()
          });
          stagedInstances.set(command.id, {
            id: command.id,
            type: command.type,
            props: command.props,
            visible: true,
            children: []
          });
        } else if (command.op === "update") {
          const value = readSimulated(command.id);
          if (value === void 0) throw new Error(`Object driver: unknown update ${command.id}.`);
          value.props = command.props;
        } else if (command.op === "recreate") {
          const value = readSimulated(command.id);
          const current = state.instances.get(command.id);
          if (value === void 0 || current === void 0) {
            throw new Error(`Object driver: unknown recreate ${command.id}.`);
          }
          if (value.type !== command.type) {
            throw new Error(`Object driver: recreate type mismatch for ${command.id}.`);
          }
          value.props = command.props;
          stagedInstances.set(command.id, {
            id: command.id,
            type: command.type,
            props: command.props,
            visible: true,
            children: [...current.children]
          });
          for (const type of value.localCallbacks.keys()) {
            cleanupKeys.add(keyFor(command.id, type));
            invokeKeys.add(keyFor(command.id, type));
          }
        } else if (command.op === "visibility") {
          const value = readSimulated(command.id);
          if (value === void 0) {
            throw new Error(`Object driver: unknown visibility target ${command.id}.`);
          }
          value.visible = command.state === "visible";
        } else if (command.op === "event") {
          const value = readSimulated(command.id);
          if (value === void 0)
            throw new Error(`Object driver: unknown event target ${command.id}.`);
          if (command.listener === null) value.events.delete(command.type);
          else value.events.set(command.type, command.listener);
        } else if (command.op === "lifecycle") {
          const value = readSimulated(command.id);
          if (value === void 0)
            throw new Error(`Object driver: unknown lifecycle target ${command.id}.`);
          if (command.listener === null) value.lifecycles.delete(command.type);
          else value.lifecycles.set(command.type, command.listener);
        } else if (command.op === "local-callback") {
          const value = readSimulated(command.id);
          if (value === void 0)
            throw new Error(`Object driver: unknown local callback target ${command.id}.`);
          const key = keyFor(command.id, command.type);
          cleanupKeys.add(key);
          if (command.listener === null) value.localCallbacks.delete(command.type);
          else {
            value.localCallbacks.set(command.type, command.listener);
            invokeKeys.add(key);
          }
        } else if (command.op === "insert" || command.op === "move") {
          if (command.parent !== null && typeof command.parent !== "number") {
            throw new Error("Object driver does not support portal target parents.");
          }
          if (!hasSimulated(command.id))
            throw new Error(`Object driver: unknown child ${command.id}.`);
          detachSimulated(command.id, false);
          const children = simulatedChildren(command.parent);
          const before = command.before === null ? children.length : children.indexOf(command.before);
          if (before === -1) throw new Error(`Object driver: unknown before id ${command.before}.`);
          children.splice(before, 0, command.id);
          parentChanges.set(command.id, command.parent);
          if (command.op === "move") {
            for (const type of readSimulated(command.id).localCallbacks.keys()) {
              const key = keyFor(command.id, type);
              cleanupKeys.add(key);
              invokeKeys.add(key);
            }
          }
        } else if (command.op === "remove") {
          if (command.parent !== null && typeof command.parent !== "number") {
            throw new Error("Object driver does not support portal target parents.");
          }
          if (readParent(command.id) !== command.parent) {
            throw new Error(`Object driver: child ${command.id} is not attached.`);
          }
          detachSimulated(command.id, true);
          for (const type of readSimulated(command.id).localCallbacks.keys()) {
            cleanupKeys.add(keyFor(command.id, type));
          }
        } else if (command.op === "destroy") {
          const instance = readSimulated(command.id);
          if (instance === void 0)
            throw new Error(`Object driver: unknown destroy ${command.id}.`);
          detachSimulated(command.id, true);
          for (const child of instance.children) parentChanges.set(child, DETACHED);
          instance.children.length = 0;
          forgetPendingDetachParent(command.id);
          destroyed.add(command.id);
        }
      }
      flushAllPendingDetaches();
      for (const [id, instance] of stagedInstances) {
        const staged = readSimulated(id);
        if (staged === void 0) continue;
        instance.visible = staged.visible;
        instance.children.splice(
          0,
          instance.children.length,
          ...staged.children.map(
            (child) => stagedInstances.get(child) ?? state.instances.get(child)
          )
        );
      }
      let status = "prepared";
      let acceptedCallbacksRan = false;
      let pendingLiveDetaches = null;
      const liveChildren = (parent) => {
        const children = objectChildren(container, parent, state.instances);
        const detached = pendingLiveDetaches?.get(parent);
        if (detached === void 0) return children;
        let write = 0;
        for (let read = 0; read < children.length; read++) {
          const child = children[read];
          if (!detached.has(child.id)) children[write++] = child;
        }
        children.length = write;
        pendingLiveDetaches.delete(parent);
        if (pendingLiveDetaches.size === 0) pendingLiveDetaches = null;
        return children;
      };
      const detachLive = (id, defer) => {
        if (!state.parents.has(id)) return;
        const parent = state.parents.get(id);
        const instance = state.instances.get(id);
        if (useBatchedDetaches && defer) {
          const detaches = pendingLiveDetaches ??= /* @__PURE__ */ new Map();
          const detached = detaches.get(parent);
          if (detached === void 0) detaches.set(parent, /* @__PURE__ */ new Set([id]));
          else detached.add(id);
        } else {
          const children = liveChildren(parent);
          const index = children.indexOf(instance);
          if (index !== -1) children.splice(index, 1);
        }
        state.parents.delete(id);
      };
      const forgetPendingLiveParent = (parent) => {
        if (pendingLiveDetaches === null) return;
        pendingLiveDetaches.delete(parent);
        if (pendingLiveDetaches.size === 0) pendingLiveDetaches = null;
      };
      const flushAllPendingLiveDetaches = () => {
        while (pendingLiveDetaches !== null) {
          const parent = pendingLiveDetaches.keys().next().value;
          liveChildren(parent);
        }
      };
      return {
        apply() {
          if (status !== "prepared") return;
          status = "applied";
          const tasks = [];
          for (const key of cleanupKeys) {
            const [id, type] = parseKey(key);
            const cleanups = state.localCleanups.get(id);
            const cleanup = cleanups?.get(type);
            if (cleanup === void 0) continue;
            cleanups.delete(type);
            tasks.push(cleanup);
          }
          tasks.push(() => {
            for (const command of batch.commands) {
              if (command.op === "create") {
                const instance = stagedInstances.get(command.id);
                state.instances.set(command.id, instance);
                for (const child of instance.children) {
                  state.parents.set(child.id, command.id);
                }
                state.events.set(command.id, /* @__PURE__ */ new Map());
                state.lifecycles.set(command.id, /* @__PURE__ */ new Map());
                state.localCallbacks.set(command.id, /* @__PURE__ */ new Map());
                state.localCleanups.set(command.id, /* @__PURE__ */ new Map());
              } else if (command.op === "update") {
                state.instances.get(command.id).props = command.props;
              } else if (command.op === "recreate") {
                const previous = state.instances.get(command.id);
                const replacement = stagedInstances.get(command.id);
                if (state.parents.has(command.id)) {
                  const parent = liveChildren(state.parents.get(command.id));
                  const index = parent.indexOf(previous);
                  if (index !== -1) parent[index] = replacement;
                }
                previous.children.length = 0;
                state.instances.set(command.id, replacement);
              } else if (command.op === "visibility") {
                state.instances.get(command.id).visible = command.state === "visible";
              } else if (command.op === "event") {
                const events = state.events.get(command.id);
                if (command.listener === null) events.delete(command.type);
                else events.set(command.type, command.listener);
              } else if (command.op === "lifecycle") {
                const lifecycles = state.lifecycles.get(command.id);
                if (command.listener === null) lifecycles.delete(command.type);
                else lifecycles.set(command.type, command.listener);
              } else if (command.op === "local-callback") {
                const callbacks = state.localCallbacks.get(command.id);
                if (command.listener === null) callbacks.delete(command.type);
                else callbacks.set(command.type, command.listener);
              } else if (command.op === "insert" || command.op === "move") {
                if (command.parent !== null && typeof command.parent !== "number") {
                  throw new Error("Object driver does not support portal target parents.");
                }
                const instance = state.instances.get(command.id);
                detachLive(command.id, false);
                const children = liveChildren(command.parent);
                const before = command.before === null ? children.length : children.indexOf(state.instances.get(command.before));
                children.splice(before, 0, instance);
                state.parents.set(command.id, command.parent);
              } else if (command.op === "remove") {
                if (command.parent !== null && typeof command.parent !== "number") {
                  throw new Error("Object driver does not support portal target parents.");
                }
                detachLive(command.id, true);
              } else if (command.op === "destroy") {
                const instance = state.instances.get(command.id);
                detachLive(command.id, true);
                for (const child of instance.children) state.parents.delete(child.id);
                instance.children.length = 0;
                forgetPendingLiveParent(command.id);
                state.instances.delete(command.id);
                state.parents.delete(command.id);
                state.events.delete(command.id);
                state.lifecycles.delete(command.id);
                state.localCallbacks.delete(command.id);
                state.localCleanups.delete(command.id);
              }
            }
            flushAllPendingLiveDetaches();
            container.commits.push(batch);
          });
          runCommitTasks(tasks);
        },
        afterAccept() {
          if (status !== "applied" || acceptedCallbacksRan) return;
          acceptedCallbacksRan = true;
          const tasks = [];
          for (const key of invokeKeys) {
            const [id, type] = parseKey(key);
            const instance = state.instances.get(id);
            const listener = state.localCallbacks.get(id)?.get(type);
            if (instance === void 0 || listener === void 0) continue;
            tasks.push(() => {
              const parentId = state.parents.get(id);
              const parent = parentId == null ? null : state.instances.get(parentId) ?? null;
              const cleanup = context.invokeLocalCallback(listener.id, [parent, instance]);
              if (cleanup == null) return;
              if (typeof cleanup !== "function") {
                throw new TypeError(
                  "A universal local host callback must return a cleanup or nothing."
                );
              }
              state.localCleanups.get(id).set(type, cleanup);
            });
          }
          runCommitTasks(tasks);
        },
        abort() {
          if (status !== "prepared") return;
          status = "aborted";
          for (const instance of stagedInstances.values()) instance.children.length = 0;
          stagedInstances.clear();
        }
      };
    },
    getPublicInstance(container, id) {
      return container[OBJECT_DRIVER_STATE].instances.get(id) ?? null;
    }
  };
}
export {
  Activity,
  UNIVERSAL_HMR,
  UNIVERSAL_TRANSPORT_PROTOCOL_VERSION,
  __methodDep,
  __useLinkedStateWithGetter,
  __useReducerWithGetter,
  __useStateWithGetter,
  createObjectContainer,
  createObjectDriver,
  createPortal,
  createUniversalRoot,
  defineUniversalComponent,
  flushUniversalAct,
  flushUniversalSync,
  getUniversalHostFlusher,
  hasCrossRealmPlainPrototype,
  hmrUniversalComponent,
  hookSlots,
  invokeManualHook,
  isRendererRegion,
  lazy,
  manualHook,
  markUniversalHostComponent,
  markWarm,
  memo,
  rendererRegion,
  requestFormReset,
  sameUniversalHostPropValue,
  startTransition,
  universalActivity,
  universalBlock,
  universalChildren,
  universalComponent,
  universalContext,
  universalFor,
  universalHostBinding,
  universalHostComponentLeafPlan,
  universalIf,
  universalKey,
  universalList,
  universalPlan,
  universalProps,
  universalSwitch,
  universalTry,
  universalValue,
  use,
  useActionState,
  useBatch,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useActionState as useFormState,
  useFormStatus,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useLinkedState,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  warmChild,
  warmMemo,
  withSlot
};
