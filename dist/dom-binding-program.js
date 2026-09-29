import { __claimBinding, __createBindingStyleRestoration, __normalizeBinding, __releaseBinding, __writeBinding } from "./dom-bindings.js";
import { bindingRootMarker, BINDING_OPEN_PREFIX, encodeBindingKey, parseBindingMarker } from "./dom-binding-protocol.js";
import { HYDRATION_FOR_PREFIX } from "./hydration-markers.js";
import { moveNativeNodeBefore } from "./dom-focused-move.js";
import { rendererRangeClose } from "./stream-protocol.js";
import { BINDING_HANDOFF, registerBindingEvent, markBindingEvent } from "./dom-binding-handoff.js";
import { captureSignalOwner, currentSignalOwner } from "./signals/owner-context.js";
import { NATIVE_TRANSITION_CONSUMER, forwardNativeTransitionConsumer } from "./signals/read-protocol.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
import { __methodDep } from "./method-dep.js";
function __activateBindingAdapters(nodes, context, definitions) {
  const cleanups = [];
  const refs = [];
  let disposed = false;
  let cleaned = false;
  const drain = (callbacks) => {
    let failed = false;
    let failure;
    for (const cleanup of callbacks) {
      try {
        cleanup();
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    callbacks.length = 0;
    if (failed)
      throw failure;
  };
  const abort = () => {
    disposed = true;
  };
  const dispose = () => {
    if (cleaned)
      return;
    cleaned = true;
    disposed = true;
    context.signal.removeEventListener("abort", abort);
    for (const ref of refs) {
      if (ref.cleanup)
        cleanups.push(ref.cleanup);
      ref.cleanup = void 0;
    }
    drain(cleanups);
  };
  const own = (cleanup) => {
    if (disposed)
      cleanup();
    else
      cleanups.push(cleanup);
  };
  const attachRef = (value, node, ownRef) => {
    if (value == null || disposed)
      return;
    if (Array.isArray(value)) {
      for (const ref of value)
        attachRef(ref, node, ownRef);
    } else if (typeof value === "function") {
      const cleanup = value(node);
      ownRef(typeof cleanup === "function" ? cleanup : () => value(null));
    } else if (typeof value === "object") {
      const ref = value;
      ref.current = node;
      ownRef(() => {
        if (ref.current === node)
          ref.current = null;
      });
    } else
      throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation ref must be a callback, object, or ref array." : __octaneNoArgError(278));
  };
  const replaceRef = (ref, value) => {
    const cleanup = ref.cleanup;
    ref.cleanup = void 0;
    ref.value = value;
    cleanup?.();
    if (disposed || value == null)
      return;
    const attached = [];
    let detached = false;
    ref.cleanup = () => {
      if (detached)
        return;
      detached = true;
      drain(attached);
    };
    attachRef(value, ref.node, (stop) => {
      if (disposed || detached)
        stop();
      else
        attached.push(stop);
    });
  };
  const handle = dispose;
  if (context.signal.aborted) {
    dispose();
    return handle;
  }
  context.signal.addEventListener("abort", abort, { once: true });
  try {
    for (const definition of definitions) {
      if (disposed)
        break;
      const node = nodes[definition.node];
      if (node?.nodeType !== 1)
        mismatch();
      if (definition.kind === "ref") {
        const ref = {
          definition,
          node,
          value: void 0,
          dependencies: definition.dependencies?.(context.getEnvironment())
        };
        refs.push(ref);
        replaceRef(ref, definition.read(context.getEnvironment()));
      } else {
        const listener = (event) => {
          if (disposed)
            return;
          const handler = definition.read(context.getEnvironment());
          if (handler == null || handler === false)
            return;
          if (typeof handler !== "function")
            throw new TypeError(process.env.NODE_ENV !== "production" ? "A native event binding must resolve to a function." : __octaneNoArgError(279));
          markBindingEvent(event, node, !!definition.capture);
          handler.call(node, event);
        };
        node.addEventListener(definition.name, listener, !!definition.capture);
        own(registerBindingEvent(node, definition.name));
        own(() => node.removeEventListener(definition.name, listener, !!definition.capture));
      }
    }
    if (refs.some((ref) => !ref.definition.stable))
      handle.prepare = (environment) => {
        const next = refs.map((ref) => {
          const dependencies = ref.definition.dependencies?.(environment);
          const unchanged = ref.definition.stable || dependencies !== void 0 && ref.dependencies !== void 0 && dependencies.length === ref.dependencies.length && dependencies.every((value, index) => Object.is(value, ref.dependencies[index]));
          return { value: unchanged ? ref.value : ref.definition.read(environment), dependencies };
        });
        return () => {
          for (let index = 0; index < refs.length && !disposed; index++) {
            const ref = refs[index];
            ref.dependencies = next[index].dependencies;
            if (!Object.is(ref.value, next[index].value))
              replaceRef(ref, next[index].value);
          }
        };
      };
    return handle;
  } catch (error) {
    try {
      dispose();
    } catch {
    }
    throw error;
  }
}
const bindingSlot = /* @__PURE__ */ Symbol("octane.compiled-binding-slot");
function __bindingSlot(id, fragment, environment, site) {
  return {
    [bindingSlot]: true,
    id,
    fragment,
    environment,
    ...site === void 0 ? {} : { site }
  };
}
function __createStructuralBindingHandoff(instance, transaction, dispose, ready) {
  let revision = 0;
  let rangeRevision = -1;
  let ranges;
  let views;
  let rest;
  let retries;
  const currentRanges = () => {
    if (rangeRevision === revision && ranges !== void 0)
      return ranges;
    const next = /* @__PURE__ */ new Map();
    let nextViews;
    let nextRest;
    const collect = (current, closed = false) => {
      if (current.definition.conditionalRest === true) {
        if (current.definition.closedProps === void 0)
          throw new Error(process.env.NODE_ENV !== "production" ? "Conditional hydration requires a compiler-proven caller shape." : __octaneNoArgError(280));
        (nextViews ??= /* @__PURE__ */ new Map()).set(current.range.start, {
          id: current.id,
          closedProps: current.definition.closedProps
        });
        closed = true;
      }
      if (current.definition.constructible === false || current.definition.bindings.some((binding) => binding[1] === "control") || current.definition.nodes.some((node) => node[1] === "element" && node[4] === null))
        throw new Error(process.env.NODE_ENV !== "production" ? "Structural hydration leases require compiler-owned native nodes." : __octaneNoArgError(281));
      for (const site of current.definition.restSites ?? []) {
        const element = current.nodes[site.node];
        if (!closed || element?.nodeType !== 1)
          throw new Error(process.env.NODE_ENV !== "production" ? "Native rest hydration requires an eligible closed child view." : __octaneNoArgError(282));
        const sites = (nextRest ??= /* @__PURE__ */ new Map()).get(element) ?? /* @__PURE__ */ new Map();
        sites.set(site.site, {
          id: current.id,
          node: site.node,
          spread: site.spread,
          keys: site.keys
        });
        nextRest.set(element, sites);
      }
      for (const region of current.regions) {
        const definition = region.definition;
        if (definition.kind === "for" || definition.kind === "opaque")
          throw new Error(process.env.NODE_ENV !== "production" ? "Structural hydration leases do not support lists or opaque regions." : __octaneNoArgError(283));
        if (definition.kind === "text" && definition.generic)
          throw new Error(process.env.NODE_ENV !== "production" ? "Structural hydration leases require primitive text." : __octaneNoArgError(284));
        if (definition.kind === "view" && definition.view.root.handoff !== true && definition.view.root.handoff !== "structural" && definition.view.root.conditionalRest !== true)
          throw new Error(process.env.NODE_ENV !== "production" ? "Structural hydration leases require a supported child view." : __octaneNoArgError(285));
        next.set(region.range.start, {
          kind: definition.kind,
          end: region.range.end,
          ...definition.kind === "if" ? { arm: region.arm } : {},
          ...definition.kind === "view" ? { view: definition.view.id } : {},
          ...definition.kind === "slot" ? { slot: region.slot } : {}
        });
        if (region.child !== null)
          collect(region.child, definition.kind !== "view" && region.child.id === current.id && closed);
      }
    };
    collect(instance);
    ranges = next;
    views = nextViews;
    rest = nextRest;
    rangeRevision = revision;
    return next;
  };
  currentRanges();
  transaction.published = () => {
    revision++;
    if (retries?.size) {
      const pending = [...retries];
      retries.clear();
      for (const retry of pending)
        queueMicrotask(() => {
          if (!transaction.disposed)
            retry();
        });
    }
  };
  const valid = (current) => {
    const parent = current.range.start.parentNode;
    if (parent === null || current.range.end.parentNode !== parent)
      return false;
    const cursors = /* @__PURE__ */ new Map([[-1, current.range.start.nextSibling]]);
    for (let index = 0; index < current.definition.nodes.length; index++) {
      const proof = current.definition.nodes[index];
      const node = current.nodes[index];
      if (cursors.get(proof[0]) !== node || node.parentNode !== (proof[0] === -1 ? parent : current.nodes[proof[0]]))
        return false;
      let next = node.nextSibling;
      if (proof[1] === "element")
        cursors.set(index, node.firstChild);
      else if (proof[1] === "text") {
        if (node.nodeValue !== proof[2])
          return false;
      } else {
        const region = current.regions.find((item) => item.range.start === node);
        if (region.range.end.parentNode !== node.parentNode || region.child !== null && !valid(region.child))
          return false;
        if (region.definition.kind === "text" && (node.nextSibling !== (region.text ?? region.range.end) || region.text !== null && region.text.nextSibling !== region.range.end))
          return false;
        next = region.range.end.nextSibling;
      }
      cursors.set(proof[0], next);
    }
    for (const [index, cursor] of cursors)
      if (cursor !== (index === -1 ? current.range.end : null))
        return false;
    return true;
  };
  return {
    id: instance.id,
    root: instance.range.start,
    anchor: instance.range.start,
    end: instance.range.end,
    revision: () => ready() ? revision : -1,
    ranges: currentRanges,
    view: (root) => {
      currentRanges();
      return views?.get(root);
    },
    rest: (element, site) => {
      currentRanges();
      return rest?.get(element)?.get(site);
    },
    valid: () => {
      if (!ready())
        return false;
      try {
        currentRanges();
      } catch {
        return false;
      }
      return valid(instance);
    },
    afterPublication: (callback) => {
      (retries ??= /* @__PURE__ */ new Set()).add(callback);
      return () => retries.delete(callback);
    },
    active: () => !transaction.disposed,
    retire: (publish) => {
      retries?.clear();
      transaction.published = void 0;
      transaction.preservePresentation = true;
      dispose(void 0, publish);
    }
  };
}
const stopped = {};
const programRoots = /* @__PURE__ */ new WeakSet();
function requireActive(transaction) {
  if (transaction.disposed)
    throw stopped;
}
function mismatch() {
  throw new Error(process.env.NODE_ENV !== "production" ? "DOM presentation cannot adopt mismatched compiler-owned ranges or nodes." : __octaneNoArgError(286));
}
function rangeAt(node, end) {
  if (node?.nodeType !== 8)
    return mismatch();
  const close = rendererRangeClose(node);
  if (close === null)
    return mismatch();
  for (let cursor = node; cursor !== close; cursor = cursor.nextSibling)
    if (cursor === null || cursor === end)
      return mismatch();
  if (close === end)
    return mismatch();
  return { start: node, end: close };
}
function rootRange(root, id) {
  if (root.nodeType === 1) {
    let start = root;
    let end = start;
    let match;
    while (start.previousSibling?.nodeType === 8) {
      const open = start.previousSibling;
      const marker2 = parseBindingMarker(open.data);
      if (marker2?.kind !== "root" && marker2?.kind !== "view")
        break;
      const close = rendererRangeClose(open);
      if (close === null || close.previousSibling !== end)
        break;
      if (marker2.kind === "root" && marker2.id === id) {
        if (match !== void 0)
          mismatch();
        match = { start: open, end: close };
      }
      start = open;
      end = close;
    }
    return match ?? mismatch();
  }
  const range = root;
  if (range?.start?.nodeType !== 8 || range?.end?.nodeType !== 8)
    mismatch();
  const marker = parseBindingMarker(range.start.data);
  if (marker?.kind !== "root" || marker.id !== id || rendererRangeClose(range.start) !== range.end)
    mismatch();
  return range;
}
function releaseInstance(instance, transaction) {
  if (instance.disposed)
    return;
  instance.disposed = true;
  transaction.all.delete(instance);
  transaction.candidates.delete(instance);
  let failed = false;
  let failure;
  const attempt = (callback) => {
    try {
      callback();
    } catch (error) {
      if (!failed) {
        failed = true;
        failure = error;
      }
    }
  };
  transaction.hostOperations?.releaseControls(instance, attempt);
  attempt(() => instance.controller?.abort());
  attempt(() => instance.cleanup?.());
  instance.cleanup = void 0;
  instance.updateAdapters = void 0;
  for (const connection of instance.signals?.values() ?? [])
    attempt(() => connection.dispose(transaction.preservePresentation));
  instance.signals?.clear();
  transaction.hostOperations?.releaseProjections(instance, transaction, attempt);
  instance.signalPlan = void 0;
  for (const region of instance.regions) {
    if (region.signal)
      attempt(() => region.signal.dispose());
    region.signalPlan = void 0;
    if (region.child)
      attempt(() => releaseInstance(region.child, transaction));
    if (region.items)
      for (const child of region.items.values())
        attempt(() => releaseInstance(child, transaction));
  }
  for (let i = 0; i < instance.owned.length; i++) {
    const [node, channel] = instance.owned[i];
    const binding = instance.definition.bindings[i];
    if (instance.groups.has(i))
      attempt(() => instance.groups.get(i).dispose(transaction.preservePresentation));
    if (instance.styles?.has(i))
      attempt(() => instance.styles.get(i).dispose(transaction.preservePresentation));
    if (!transaction.preservePresentation && binding[1] === "classToken" && instance.previous[i] === "")
      attempt(() => node.classList.remove(binding[2]));
    __releaseBinding(node, channel);
  }
  instance.owned.length = 0;
  instance.previous.length = 0;
  instance.groups.clear();
  instance.styles?.clear();
  if (failed)
    throw failure;
}
function resolveFragment(definition, id, range, fresh, transaction) {
  requireActive(transaction);
  const instance = {
    id,
    definition,
    range,
    nodes: [],
    regions: [],
    owned: [],
    previous: [],
    groups: /* @__PURE__ */ new Map(),
    environment: [],
    fresh,
    disposed: false,
    activated: false
  };
  transaction.all.add(instance);
  if (fresh) {
    transaction.candidates.add(instance);
    transaction.preview?.fragments.add(instance);
  }
  const cursors = /* @__PURE__ */ new Map([[-1, range.start.nextSibling]]);
  const counts = /* @__PURE__ */ new Map();
  const regions = /* @__PURE__ */ new Map();
  for (const region of definition.regions) {
    if (regions.has(region.node) || definition.nodes[region.node]?.[1] !== "region")
      mismatch();
    regions.set(region.node, region);
  }
  for (let index = 0; index < definition.nodes.length; index++) {
    const proof = definition.nodes[index];
    const parent = proof[0];
    if (parent !== -1 && (parent < 0 || parent >= index || definition.nodes[parent]?.[1] !== "element" || definition.nodes[parent]?.[4] === null))
      mismatch();
    const node = cursors.get(parent);
    if (node == null || node === range.end)
      mismatch();
    counts.set(parent, (counts.get(parent) ?? 0) + 1);
    instance.nodes[index] = node;
    let next = node.nextSibling;
    if (proof[1] === "element") {
      if (node.nodeType !== 1 || node.localName !== proof[2] || node.namespaceURI !== (proof[3] === 0 ? "http://www.w3.org/1999/xhtml" : "http://www.w3.org/2000/svg"))
        mismatch();
      if (proof[4] !== null)
        cursors.set(index, node.firstChild);
    } else if (proof[1] === "text") {
      if (node.nodeType !== 3 || node.nodeValue !== proof[2])
        mismatch();
    } else {
      const childRange = rangeAt(node, parent === -1 ? range.end : null);
      const marker = parseBindingMarker(childRange.start.data);
      const region = regions.get(index);
      if (!region || marker?.id !== id || marker.site !== proof[2] || marker.kind !== region.kind)
        mismatch();
      const state = {
        definition: region,
        range: childRange,
        site: proof[2],
        arm: marker.arm ?? -1,
        child: null,
        items: null,
        text: null,
        unresolvedSlot: region.kind === "slot" && !fresh
      };
      instance.regions.push(state);
      next = childRange.end.nextSibling;
      if (!fresh)
        adoptRegion(state, id, transaction);
    }
    cursors.set(parent, next);
  }
  if (cursors.get(-1) !== range.end)
    mismatch();
  for (let index = 0; index < definition.nodes.length; index++) {
    const proof = definition.nodes[index];
    if (proof[1] === "element" && proof[4] !== null && (cursors.get(index) !== null || (counts.get(index) ?? 0) !== proof[4]))
      mismatch();
  }
  for (let index = 0; index < definition.bindings.length; index++) {
    const binding = definition.bindings[index];
    const node = instance.nodes[binding[0]];
    if (node?.nodeType !== 1)
      mismatch();
    instance.owned.push([node, __claimBinding(node, binding)]);
    if (binding[1] === "control")
      transaction.hostOperations.claimControl(instance, index, node, transaction);
    if (!fresh && binding[1] === "classGroup")
      instance.groups.set(index, definition.createClassGroup(node, binding[2], binding[3]));
  }
  return instance;
}
function adoptRegion(region, id, transaction) {
  const definition = region.definition;
  const range = region.range;
  if (definition.kind === "if") {
    if (region.arm === -1) {
      if (range.start.nextSibling !== range.end)
        mismatch();
      return;
    }
    const arm = definition.arms[region.arm];
    if (!arm)
      mismatch();
    let body = range;
    if (definition.armRange) {
      body = rangeAt(range.start.nextSibling, range.end);
      if (body.start.data !== "[" || body.end.nextSibling !== range.end)
        mismatch();
    }
    region.child = resolveFragment(arm, id, body, false, transaction);
  } else if (definition.kind === "for") {
    transaction.list.adopt(region, id, transaction);
  } else if (definition.kind === "view") {
    region.child = resolveFragment(definition.view.root, definition.view.id, range, false, transaction);
  } else if (definition.kind === "text") {
    const text = range.start.nextSibling;
    if (text !== range.end) {
      if (text?.nodeType !== 3 || text.nextSibling !== range.end)
        mismatch();
      region.text = text;
    }
  }
}
function createFragment(definition, id, document, transaction) {
  requireActive(transaction);
  if (definition.constructible === false)
    throw new Error(definition.constructionError ?? (process.env.NODE_ENV !== "production" ? "This opaque view cannot be constructed without its external owner." : __octaneNoArgError(287)));
  const template = document.createElement("template");
  template.innerHTML = definition.ns === 1 ? `<svg>${definition.html}</svg>` : definition.html;
  const content = document.createDocumentFragment();
  const start = document.createComment(bindingRootMarker(id));
  const end = document.createComment("]");
  content.appendChild(start);
  if (definition.ns === 1) {
    const svg = template.content.firstChild;
    while (svg.firstChild)
      content.appendChild(svg.firstChild);
  } else
    content.appendChild(template.content);
  content.appendChild(end);
  return resolveFragment(definition, id, { start, end }, true, transaction);
}
function projectValues(values, instance, transaction, controls) {
  const operations = instance.definition.bindings;
  if (!Array.isArray(values) || values.length !== operations.length)
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation projection must return its synchronous scalar values." : __octaneNoArgError(288));
  values = transaction.hostOperations?.project(values, instance, transaction) ?? values;
  if (transaction.signals || transaction.styles) {
    let copied = false;
    const indices = instance.definition.styleIndices ? [...instance.definition.signalIndices ?? [], ...instance.definition.styleIndices] : instance.definition.signalIndices ?? [];
    for (const index of indices) {
      requireActive(transaction);
      let connection = (transaction.preview?.signals.get(instance) ?? instance.signals)?.get(index);
      const style = operations[index][1] === "styleObject";
      if (!connection && (style || transaction.signals?.isSignal(values[index]))) {
        const prepare = () => {
          if (instance.disposed || transaction.preparing && instance.signalFrame !== transaction.frame)
            return () => {
            };
          const value = __normalizeBinding(operations[index], connection.get());
          const group = instance.groups.get(index)?.prepare(value ?? "");
          if (transaction.preparing && instance.signalPlan) {
            instance.signalPlan.values[index] = value;
            if (group)
              instance.signalPlan.groups.set(index, group);
            return () => {
            };
          }
          return () => writeOperation(instance, index, value, group, transaction);
        };
        const notify = forwardNativeTransitionConsumer(transaction.consumer, () => transaction.notifySignal(prepare));
        connection = style ? transaction.styles.connect(instance.nodes[operations[index][0]], notify, transaction.restoreStyles) : transaction.signals.connect(notify);
        if (transaction.preview) {
          let signals = transaction.preview.signals.get(instance);
          if (!signals)
            transaction.preview.signals.set(instance, signals = new Map(instance.signals));
          signals.set(index, connection);
          const created = connection;
          transaction.preview.disposals.push(() => created.dispose(true));
        } else
          (instance.signals ??= /* @__PURE__ */ new Map()).set(index, connection);
      }
      if (connection) {
        if (!copied) {
          values = [...values];
          copied = true;
        }
        if (transaction.preview) {
          const receipt = connection.preview(values[index]);
          transaction.preview.receipts.push(receipt);
          values[index] = receipt.value;
        } else
          values[index] = connection.read(values[index]);
      }
    }
  }
  return values.map((value, index) => {
    if (operations[index][1] === "control") {
      const control = transaction.preview ? instance.controls.get(index).preview(value) : instance.controls.get(index).prepare(value);
      transaction.preview?.controls.push(control);
      controls.set(index, control);
      return null;
    }
    return __normalizeBinding(operations[index], value);
  });
}
function textValue(value, generic) {
  if (generic) {
    if (value == null || typeof value === "boolean")
      return "";
    if (!["string", "number", "bigint"].includes(typeof value))
      throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation signal text requires a primitive value." : __octaneNoArgError(289));
  }
  return value == null || value === false ? "" : String(value);
}
function initialValues(instance, environment) {
  const definition = instance.definition;
  if (!instance.fresh || !definition.initializers?.length)
    return null;
  const values = definition.initialize?.(environment);
  if (!Array.isArray(values) || values.length !== definition.initializers.length)
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation initializer must return its synchronous scalar values." : __octaneNoArgError(290));
  return definition.initializers.map((operation, index) => {
    if (instance.nodes[operation[0]]?.nodeType !== 1)
      mismatch();
    const value = values[index];
    switch (operation[1]) {
      case "classGroupInitial": {
        const baseline = __normalizeBinding([operation[0], "class", "class"], value) ?? "";
        const groups = [];
        for (const binding of definition.bindings)
          if (binding[0] === operation[0] && binding[1] === "classGroup" && binding[2] === operation[2])
            groups[binding[3]] = "";
        return JSON.stringify([baseline, groups]);
      }
      case "checked":
      case "defaultChecked":
      case "selected":
        return Boolean(value);
      case "value":
      case "defaultValue":
        if (instance.nodes[operation[0]].localName === "select" && Array.isArray(value))
          return value.map(String);
        return value == null ? "" : String(value);
      default:
        return __normalizeBinding(operation, value);
    }
  });
}
function prepareFragment(instance, environment, transaction) {
  requireActive(transaction);
  const definition = instance.definition;
  const controls = instance.controls && /* @__PURE__ */ new Map();
  const plan = {
    instance,
    environment,
    values: projectValues(definition.project(environment), instance, transaction, controls),
    initial: transaction.initialOperations?.initial(instance, environment) ?? null,
    regions: [],
    groups: /* @__PURE__ */ new Map(),
    controls,
    adapters: instance.cleanup?.prepare?.(environment)
  };
  if (!transaction.preview && (instance.signals || instance.controls || instance.projections)) {
    instance.signalPlan = plan;
    instance.signalFrame = transaction.frame;
  }
  requireActive(transaction);
  transaction.hostOperations?.groups(plan);
  const document = instance.range.start.ownerDocument;
  requireActive(transaction);
  for (const region of instance.regions) {
    const descriptor = region.definition;
    const candidate = {
      instance: region,
      arm: -1,
      child: null,
      items: null,
      text: null
    };
    plan.regions.push(candidate);
    if (descriptor.kind === "text") {
      let value = descriptor.read(environment);
      if (descriptor.signal && transaction.signals) {
        let connection = transaction.preview?.text.get(region) ?? region.signal;
        if (!connection && transaction.signals.isSignal(value)) {
          const prepare = () => {
            if (instance.disposed || transaction.preparing && region.signalFrame !== transaction.frame)
              return () => {
              };
            const next = textValue(region.signal.get(), descriptor.generic);
            if (transaction.preparing && region.signalPlan) {
              region.signalPlan.text = next;
              return () => {
              };
            }
            return () => {
              if (!instance.disposed && !transaction.disposed)
                writeText(region, next);
            };
          };
          connection = transaction.signals.connect(forwardNativeTransitionConsumer(transaction.consumer, () => transaction.notifySignal(prepare)));
          if (transaction.preview) {
            transaction.preview.text.set(region, connection);
            const created = connection;
            transaction.preview.disposals.push(() => created.dispose());
          } else
            region.signal = connection;
        }
        if (connection) {
          if (transaction.preview) {
            const receipt = connection.preview(value);
            transaction.preview.receipts.push(receipt);
            value = receipt.value;
          } else {
            region.signalPlan = candidate;
            region.signalFrame = transaction.frame;
            value = connection.read(value);
          }
        }
      }
      candidate.text = textValue(value, descriptor.generic);
    } else if (descriptor.kind === "if") {
      const arm = descriptor.select(environment);
      if (!Number.isSafeInteger(arm) || arm < -1 || arm >= descriptor.arms.length)
        throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation branch projection returned an unknown arm." : __octaneNoArgError(291));
      candidate.arm = arm;
      if (arm !== -1)
        candidate.child = prepareFragment(region.arm === arm && region.child ? region.child : createFragment(descriptor.arms[arm], instance.id, document, transaction), environment, transaction);
    } else if (descriptor.kind === "for") {
      transaction.list.prepare(instance, region, candidate, environment, document, transaction);
    } else if (descriptor.kind === "view") {
      candidate.child = prepareFragment(region.child ?? createFragment(descriptor.view.root, descriptor.view.id, document, transaction), descriptor.view.prepareProps ? descriptor.view.prepareProps(descriptor.props(environment)) : [descriptor.props(environment)], transaction);
    } else if (descriptor.kind === "slot") {
      const value = descriptor.read(environment);
      if (value != null && (typeof value !== "object" || value[bindingSlot] !== true))
        throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation child slot requires a compiler-owned fragment." : __octaneNoArgError(292));
      const slot = value;
      if (slot?.site !== void 0)
        candidate.slot = slot.id + ";" + slot.site;
      if (region.unresolvedSlot) {
        if (slot)
          region.child = resolveFragment(slot.fragment, slot.id, region.range, false, transaction);
        else if (region.range.start.nextSibling !== region.range.end)
          mismatch();
        region.unresolvedSlot = false;
      }
      if (slot)
        candidate.child = prepareFragment(region.child?.definition === slot.fragment && region.child.id === slot.id ? region.child : createFragment(slot.fragment, slot.id, document, transaction), slot.environment, transaction);
    }
  }
  requireActive(transaction);
  return plan;
}
function removeRange(range, interior, transaction) {
  let node = interior ? range.start.nextSibling : range.start;
  const stop = interior ? range.end : range.end.nextSibling;
  while (node !== stop && node !== null && !transaction?.disposed) {
    const next = node.nextSibling;
    node.parentNode.removeChild(node);
    node = next;
  }
}
function moveRange(range, parent, anchor, transaction) {
  if (range.end.nextSibling === anchor && range.start.parentNode === parent)
    return;
  const nodes = [];
  for (let node = range.start; node !== null; node = node.nextSibling) {
    nodes.push(node);
    if (node === range.end)
      break;
  }
  for (const node of nodes) {
    if (transaction.disposed)
      return;
    moveNativeNodeBefore(parent, node, anchor, transaction.focused, transaction.contentEditable);
  }
}
function insertBody(instance, range, armRange, transaction) {
  if (armRange) {
    instance.range.start.data = "[";
    moveRange(instance.range, range.end.parentNode, range.end, transaction);
  } else {
    let node = instance.range.start.nextSibling;
    while (node !== instance.range.end && !transaction.disposed) {
      const next = node.nextSibling;
      range.end.parentNode.insertBefore(node, range.end);
      node = next;
    }
    instance.range = range;
  }
}
function initializeProperties(plan, afterChildren, transaction) {
  if (!plan.initial)
    return;
  const instance = plan.instance;
  const operations = instance.definition.initializers;
  for (let index = 0; index < operations.length && !transaction.disposed; index++) {
    const operation = operations[index];
    const node = instance.nodes[operation[0]];
    const value = plan.initial[index];
    const deferred = node.localName === "select" && (operation[1] === "value" || operation[1] === "defaultValue");
    if (deferred !== afterChildren)
      continue;
    switch (operation[1]) {
      case "classGroupInitial": {
        const baseline = JSON.parse(value)[0];
        __writeBinding(node, [operation[0], "class", "class"], baseline);
        if (!transaction.disposed)
          node.setAttribute(operation[2], value);
        break;
      }
      case "value":
      case "defaultValue":
        if (node.localName === "select") {
          const select = node;
          if (Array.isArray(value)) {
            const selected = new Set(value);
            for (const option of select.options)
              option.selected = selected.has(option.value);
          } else
            select.value = value;
          if (operation[1] === "defaultValue")
            for (const option of select.options)
              option.defaultSelected = option.selected;
        } else
          node[operation[1]] = value;
        break;
      case "checked":
      case "defaultChecked":
        node[operation[1]] = value;
        break;
      case "selected":
        node.selected = value;
        break;
      default:
        __writeBinding(node, operation, value);
    }
  }
}
function commitRegion(plan, id, transaction) {
  const region = plan.instance;
  const definition = region.definition;
  if (definition.kind === "opaque")
    return;
  if (definition.kind === "text") {
    region.signalPlan = void 0;
    writeText(region, plan.text);
    return;
  }
  if (definition.kind === "for") {
    transaction.list.commit(plan, id, transaction);
    return;
  }
  const oldChild = region.child;
  const child = plan.child?.instance ?? null;
  region.child = child;
  region.arm = plan.arm;
  if (definition.kind === "slot")
    region.slot = plan.slot;
  if (oldChild !== child) {
    if (oldChild)
      releaseInstance(oldChild, transaction);
    if (transaction.disposed)
      return;
    removeRange(region.range, true, transaction);
  }
  if (plan.child) {
    commitFragment(plan.child, transaction);
    if (transaction.disposed)
      return;
    if (oldChild !== child)
      insertBody(child, region.range, definition.kind === "if" && !!definition.armRange, transaction);
  }
  if (definition.kind === "if")
    region.range.start.data = `${BINDING_OPEN_PREFIX}${id};${region.site};${plan.arm}`;
}
function writeText(region, value) {
  if (region.text === null) {
    if (value !== "") {
      region.text = region.range.start.ownerDocument.createTextNode(value);
      region.range.end.parentNode.insertBefore(region.text, region.range.end);
    }
  } else if (region.text.data !== value)
    region.text.data = value;
}
function writeOperation(instance, index, value, group, transaction) {
  if (transaction.disposed || instance.disposed || value === instance.previous[index])
    return;
  const operation = instance.definition.bindings[index];
  if (operation[1] === "classToken")
    instance.previous[index] = value;
  if (operation[1] === "styleObject") {
    const projection = instance.projections?.get(index);
    if (projection)
      projection.writeStyle(index, value);
    else
      instance.signals.get(index).write(value);
  } else if (operation[1] === "classGroup")
    group.commit();
  else if ((operation[1] === "styleProperty" || operation[1] === "styleAttribute") && transaction.restoreStyles) {
    instance.styles ??= /* @__PURE__ */ new Map();
    let style = instance.styles.get(index);
    if (!style)
      instance.styles.set(index, style = __createBindingStyleRestoration(instance.nodes[operation[0]], operation));
    style.write(value);
  } else
    __writeBinding(instance.nodes[operation[0]], operation, value);
  if (!transaction.disposed && !instance.disposed)
    instance.previous[index] = value;
}
function commitFragment(plan, transaction) {
  const instance = plan.instance;
  if (transaction.disposed)
    return;
  instance.signalPlan = void 0;
  instance.environment = plan.environment;
  instance.updateAdapters = plan.adapters;
  transaction.initialOperations?.initialize(plan, false, transaction);
  for (let index = 0; index < plan.values.length && !transaction.disposed; index++) {
    if (instance.definition.bindings[index][1] === "control")
      continue;
    writeOperation(instance, index, plan.values[index], plan.groups.get(index), transaction);
  }
  for (const region of plan.regions) {
    if (transaction.disposed)
      return;
    commitRegion(region, instance.id, transaction);
  }
  transaction.initialOperations?.initialize(plan, true, transaction);
  for (const control of plan.controls?.values() ?? []) {
    if (transaction.disposed)
      return;
    control.commit();
  }
  if (!transaction.disposed)
    instance.fresh = false;
}
function publishControls(plan, transaction) {
  if (transaction.disposed)
    return;
  for (const control of plan.controls?.values() ?? []) {
    if (transaction.disposed)
      return;
    control.publish();
  }
  for (const region of plan.regions) {
    if (region.child)
      publishControls(region.child, transaction);
    if (region.items)
      for (const child of region.items.values())
        publishControls(child, transaction);
  }
}
function activateInstance(instance, transaction) {
  if (transaction.disposed || instance.disposed)
    return;
  if (!instance.activated) {
    instance.activated = true;
    if (instance.definition.activate) {
      const controller = new AbortController();
      instance.controller = controller;
      const cleanup = instance.definition.activate(instance.nodes, {
        signal: controller.signal,
        getEnvironment: () => instance.environment
      });
      if (cleanup !== void 0 && typeof cleanup !== "function")
        throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation activation must return cleanup or undefined." : __octaneNoArgError(293));
      if (instance.disposed)
        cleanup?.();
      else if (cleanup)
        instance.cleanup = cleanup;
    }
  } else {
    const update = instance.updateAdapters;
    instance.updateAdapters = void 0;
    update?.();
  }
  for (const region of instance.regions) {
    if (region.child)
      activateInstance(region.child, transaction);
    if (region.items)
      for (const child of region.items.values())
        activateInstance(child, transaction);
  }
}
function bindProgram(root, descriptor, source, options, mount, list = descriptor.list, hostOperations = descriptor.hostOperations) {
  if (!source || typeof source.getSnapshot !== "function" || typeof source.subscribe !== "function")
    throw new TypeError(process.env.NODE_ENV !== "production" ? "DOM presentation requires synchronous getSnapshot() and subscribe() methods." : __octaneNoArgError(294));
  const target = mount ? root : null;
  if (target && (!target.parent || target.before != null && target.before.parentNode !== target.parent))
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation mount requires a parent and its optional insertion anchor." : __octaneNoArgError(295));
  const transaction = {
    disposed: false,
    all: /* @__PURE__ */ new Set(),
    candidates: /* @__PURE__ */ new Set(),
    focused: null,
    contentEditable: false,
    restoreStyles: options?.restoreStyles === true,
    signals: descriptor.connectSignal?.(),
    styles: descriptor.connectStyle?.(),
    projections: descriptor.connectProjection?.(),
    controls: descriptor.createControls?.(),
    list,
    hostOperations,
    initialOperations: descriptor.initialOperations ?? hostOperations,
    frame: 0
  };
  const signalUpdates = transaction.signals || transaction.styles || transaction.projections || transaction.controls ? /* @__PURE__ */ new Set() : void 0;
  let instance;
  let ownedRoot;
  let busy = true;
  let dirty = false;
  let revision = 0;
  let mounted = !mount;
  let unsubscribe;
  const signal = options?.signal;
  const dispose = (disposal, publish) => {
    if (transaction.disposed) {
      publish?.();
      return;
    }
    transaction.disposed = true;
    signalUpdates?.clear();
    signal?.removeEventListener("abort", abort);
    let failed = false;
    let failure;
    if (publish !== void 0) {
      for (const owned of transaction.all)
        owned.controller?.abort();
      try {
        publish();
      } catch (error) {
        failed = true;
        failure = error;
      }
    }
    for (const owned of [...transaction.all]) {
      try {
        releaseInstance(owned, transaction);
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    const stop = unsubscribe;
    unsubscribe = void 0;
    try {
      stop?.();
    } catch (error) {
      if (!failed) {
        failed = true;
        failure = error;
      }
    }
    try {
      if (disposal?.preserveDOM === false && mounted && instance)
        removeRange(instance.range, false);
    } catch (error) {
      if (!failed) {
        failed = true;
        failure = error;
      }
    } finally {
      if (ownedRoot)
        programRoots.delete(ownedRoot);
    }
    if (failed)
      throw failure;
  };
  const abort = () => dispose();
  const drain = () => {
    if (transaction.disposed)
      return;
    if (busy)
      return;
    busy = true;
    try {
      while ((dirty || signalUpdates?.size) && !transaction.disposed) {
        if (!dirty) {
          if (transaction.projections) {
            const writes2 = /* @__PURE__ */ new Map();
            while (signalUpdates.size && !dirty && !transaction.disposed) {
              const pending2 = [...signalUpdates];
              signalUpdates.clear();
              for (const prepare of pending2)
                writes2.set(prepare, prepare());
            }
            if (!dirty && !transaction.disposed) {
              for (const write of writes2.values())
                write();
              transaction.published?.();
            }
            continue;
          }
          const pending = [...signalUpdates];
          signalUpdates.clear();
          const writes = pending.map((prepare) => prepare());
          if (!dirty && !transaction.disposed) {
            for (const write of writes)
              write();
            transaction.published?.();
          }
          continue;
        }
        dirty = false;
        signalUpdates?.clear();
        const snapshot = source.getSnapshot();
        if (dirty || transaction.disposed)
          continue;
        if (snapshot !== null && (typeof snapshot === "object" || typeof snapshot === "function") && typeof snapshot.then === "function")
          throw new TypeError(process.env.NODE_ENV !== "production" ? "DOM presentation requires a synchronous snapshot, not a thenable." : __octaneNoArgError(296));
        transaction.preparing = true;
        transaction.frame++;
        const plan = prepareFragment(instance, descriptor.prepareProps ? descriptor.prepareProps(snapshot) : [snapshot], transaction);
        if (!dirty && !transaction.disposed && transaction.controls)
          transaction.hostOperations.publish(plan, transaction);
        while (signalUpdates?.size && !dirty && !transaction.disposed) {
          const pending = [...signalUpdates];
          signalUpdates.clear();
          for (const prepare of pending)
            prepare();
        }
        transaction.preparing = false;
        if (dirty || transaction.disposed) {
          for (const candidate of [...transaction.candidates])
            if (candidate !== instance)
              releaseInstance(candidate, transaction);
          if (instance.fresh) {
            for (const group of instance.groups.values())
              group.dispose();
            instance.groups.clear();
          }
          continue;
        }
        const document = instance.range.start.ownerDocument;
        const tree = instance.range.start.getRootNode();
        let focused = "activeElement" in tree ? tree.activeElement : document.activeElement;
        while (focused?.shadowRoot?.activeElement)
          focused = focused.shadowRoot.activeElement;
        transaction.focused = focused;
        transaction.contentEditable = !!transaction.focused?.isContentEditable;
        commitFragment(plan, transaction);
        if (transaction.disposed)
          break;
        transaction.published?.();
        if (!mounted) {
          moveRange(instance.range, target.parent, target.before ?? null, transaction);
          mounted = true;
        }
        transaction.candidates.clear();
        activateInstance(instance, transaction);
      }
    } catch (error) {
      if (error === stopped)
        return;
      try {
        dispose();
      } catch {
      }
      throw error;
    } finally {
      transaction.preparing = false;
      busy = false;
    }
  };
  if (signalUpdates)
    transaction.notifySignal = (prepare) => {
      if (!transaction.disposed) {
        revision++;
        signalUpdates.add(prepare);
        drain();
      }
    };
  const refresh = () => {
    if (transaction.disposed)
      return;
    revision++;
    dirty = true;
    drain();
  };
  transaction.consumer = refresh;
  const owner = currentSignalOwner();
  const run = owner === null ? (callback) => callback() : captureSignalOwner(owner);
  refresh[NATIVE_TRANSITION_CONSUMER] = {
    active: () => !transaction.disposed,
    prepare: () => run(() => {
      const version = revision;
      const preview = {
        receipts: [],
        controls: [],
        fragments: /* @__PURE__ */ new Set(),
        signals: /* @__PURE__ */ new Map(),
        projections: /* @__PURE__ */ new Map(),
        text: /* @__PURE__ */ new Map(),
        disposals: []
      };
      let accepted = false;
      let retired = false;
      const discard = () => {
        if (accepted || retired)
          return;
        retired = true;
        for (const receipt of preview.receipts)
          receipt.discard();
        for (const control of preview.controls)
          control.discard();
        for (const dispose2 of preview.disposals)
          dispose2();
        for (const fragment of preview.fragments)
          releaseInstance(fragment, transaction);
      };
      let plan;
      transaction.preview = preview;
      const previousBusy = busy;
      busy = true;
      try {
        const snapshot = source.getSnapshot();
        if (snapshot != null && typeof snapshot.then === "function")
          throw new TypeError(process.env.NODE_ENV !== "production" ? "DOM presentation requires a synchronous snapshot, not a thenable." : __octaneNoArgError(296));
        plan = prepareFragment(instance, descriptor.prepareProps ? descriptor.prepareProps(snapshot) : [snapshot], transaction);
      } catch (error) {
        discard();
        throw error;
      } finally {
        transaction.preview = void 0;
        busy = previousBusy;
      }
      return {
        validate: () => !retired && !transaction.disposed && !busy && version === revision && preview.receipts.every((receipt) => receipt.validate()) && preview.controls.every((control) => control.validate()),
        discard,
        commit() {
          if (retired || accepted || transaction.disposed)
            return;
          accepted = true;
          busy = true;
          try {
            for (const [fragment, signals] of preview.signals)
              fragment.signals = signals;
            for (const [fragment, projections] of preview.projections)
              fragment.projections = projections;
            for (const [region, signal2] of preview.text)
              region.signal = signal2;
            for (const receipt of preview.receipts)
              receipt.commit();
            transaction.hostOperations?.publish(plan, transaction);
            const document = instance.range.start.ownerDocument;
            const tree = instance.range.start.getRootNode();
            transaction.focused = "activeElement" in tree ? tree.activeElement : document.activeElement;
            while (transaction.focused?.shadowRoot?.activeElement)
              transaction.focused = transaction.focused.shadowRoot.activeElement;
            transaction.contentEditable = !!transaction.focused?.isContentEditable;
            commitFragment(plan, transaction);
            transaction.published?.();
            for (const fragment of preview.fragments)
              transaction.candidates.delete(fragment);
            activateInstance(instance, transaction);
          } finally {
            busy = false;
          }
        }
      };
    })
  };
  let handoff;
  const handle = {
    refresh,
    dispose,
    [BINDING_HANDOFF]() {
      const structural = descriptor.root.handoff === "structural" || descriptor.root.conditionalRest === true;
      if (structural && !mount && instance && descriptor.root.createHandoff)
        return handoff ??= descriptor.root.createHandoff(instance, transaction, dispose, () => !busy);
      if (mount || descriptor.root.handoff !== true || !instance || descriptor.root.regions.length !== 0 || descriptor.root.bindings.some((binding) => binding[1] === "control") || descriptor.root.nodes.some((node, index) => node[1] === "element" && node[4] === null && !(node[2] === "textarea" && node[3] === 0 && node[5] === "value" && Array.from(instance.nodes[index].childNodes).every((child) => child.nodeType === 3))))
        throw new Error(process.env.NODE_ENV !== "production" ? "Hydration binding leases require an adopted fixed native view without structural regions or controls." : __octaneNoArgError(297));
      const topology = handoff === void 0 && descriptor.root.nodes.some((node) => node[1] === "element" && node[5] === "value") ? [instance.range.start, ...instance.nodes, instance.range.end].map((node) => [node, node.parentNode, node.previousSibling, node.nextSibling]) : void 0;
      return handoff ??= {
        id: descriptor.id,
        root: instance.range.start,
        anchor: instance.nodes.find((node) => node.nodeType === 1) ?? instance.range.start,
        active: () => !transaction.disposed,
        ...topology === void 0 ? {} : {
          end: instance.range.end,
          valid: () => topology.every(([node, parent, before, after]) => node.parentNode === parent && (node === instance.range.start || node.previousSibling === before) && (node === instance.range.end || node.nextSibling === after)) && descriptor.root.nodes.every((proof, index) => proof[1] !== "element" || (proof[4] === null ? Array.from(instance.nodes[index].childNodes).every((child) => child.nodeType === 3) : instance.nodes[index].childNodes.length === proof[4]))
        },
        retire: (publish) => {
          transaction.preservePresentation = true;
          dispose(void 0, publish);
        }
      };
    }
  };
  if (signal?.aborted) {
    dispose();
    return handle;
  }
  try {
    if (mount) {
      instance = createFragment(descriptor.root, descriptor.id, target.parent.ownerDocument ?? target.parent, transaction);
      ownedRoot = instance.range.start;
      programRoots.add(ownedRoot);
    } else {
      const range = rootRange(root, descriptor.id);
      if (programRoots.has(range.start))
        throw new Error(process.env.NODE_ENV !== "production" ? "This DOM presentation range already has a binding. Dispose it before rebinding." : __octaneNoArgError(298));
      ownedRoot = range.start;
      programRoots.add(ownedRoot);
      instance = resolveFragment(descriptor.root, descriptor.id, range, false, transaction);
    }
    if (signal?.aborted) {
      dispose();
      return handle;
    }
    signal?.addEventListener("abort", abort, { once: true });
    const stop = source.subscribe(refresh);
    if (typeof stop !== "function")
      throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation subscription must return cleanup." : __octaneNoArgError(299));
    if (transaction.disposed)
      stop();
    else
      unsubscribe = stop;
    busy = false;
    refresh();
    return handle;
  } catch (error) {
    try {
      dispose();
    } catch {
    }
    throw error;
  }
}
function adoptProgram(root, descriptor, source, options, list, hostOperations) {
  if (root.nodeType === 1 && descriptor.scalar?.id === descriptor.id && descriptor.adoptScalar) {
    const element = root;
    const previous = element.previousSibling;
    const marker = previous?.nodeType === 8 ? parseBindingMarker(previous.data) : null;
    if (marker?.kind !== "root" && element.getAttribute("data-octane-bindings") === descriptor.id)
      return descriptor.adoptScalar(element, descriptor.scalar, source, options);
  }
  return bindProgram(root, descriptor, source, options, false, list, hostOperations);
}
function __adoptLeanBindingProgram(root, descriptor, source, options) {
  return adoptProgram(root, descriptor, source, options);
}
function __mountLeanBindingProgram(target, descriptor, source, options) {
  return bindProgram(target, descriptor, source, options, true);
}
const __bindingList = { adopt: adoptList, prepare: prepareList, commit: commitList };
const __bindingProgramHostOperations = {
  claimControl: claimProgramControl,
  project: projectHostValues,
  initial: initialValues,
  groups: prepareHostGroups,
  initialize: initializeProperties,
  publish: publishControls,
  releaseControls: releaseHostControls,
  releaseProjections: releaseHostProjections
};
const __bindingProgramInitializers = {
  initial: initialValues,
  initialize: initializeProperties
};
const __adoptBindingProgram = /* @__PURE__ */ Object.assign(function __adoptBindingProgram2(root, descriptor, source, options) {
  return adoptProgram(root, descriptor, source, options, __bindingList, __bindingProgramHostOperations);
}, { list: __bindingList, hostOperations: __bindingProgramHostOperations });
function __mountBindingProgram(target, descriptor, source, options) {
  return bindProgram(target, descriptor, source, options, true, __bindingList, __bindingProgramHostOperations);
}
function adoptList(region, id, transaction) {
  const definition = region.definition;
  const range = region.range;
  if (region.arm === 0) {
    if (definition.empty)
      region.child = resolveFragment(definition.empty, id, range, false, transaction);
    else if (range.start.nextSibling !== range.end)
      mismatch();
    return;
  }
  region.items = /* @__PURE__ */ new Map();
  let cursor = range.start.nextSibling;
  while (cursor !== range.end) {
    const itemRange = rangeAt(cursor, range.end);
    const marker = parseBindingMarker(itemRange.start.data);
    if (marker?.id !== id || marker.site !== region.site || marker.kind !== "item" || region.items.has(marker.key))
      mismatch();
    region.items.set(marker.key, resolveFragment(definition.item, id, itemRange, false, transaction));
    cursor = itemRange.end.nextSibling;
  }
  if (region.items.size === 0)
    mismatch();
}
function prepareList(instance, region, candidate, environment, document, transaction) {
  const descriptor = region.definition;
  const input = descriptor.items(environment);
  if (input == null || typeof input[Symbol.iterator] !== "function")
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM presentation list requires a synchronous iterable." : __octaneNoArgError(300));
  const items = Array.from(input);
  const keys = items.map((item, index) => encodeBindingKey(descriptor.key(item, index, environment)));
  if (new Set(keys).size !== keys.length)
    throw new Error(process.env.NODE_ENV !== "production" ? "A DOM presentation list cannot contain duplicate keys." : __octaneNoArgError(301));
  candidate.arm = items.length === 0 ? 0 : 1;
  if (items.length === 0) {
    if (descriptor.empty)
      candidate.child = prepareFragment(region.arm === 0 && region.child ? region.child : createFragment(descriptor.empty, instance.id, document, transaction), environment, transaction);
  } else {
    candidate.items = /* @__PURE__ */ new Map();
    for (let index = 0; index < items.length; index++) {
      const key = keys[index];
      const child = region.items?.get(key) ?? createFragment(descriptor.item, instance.id, document, transaction);
      candidate.items.set(key, prepareFragment(child, [...environment, items[index], index], transaction));
    }
  }
}
function commitList(plan, id, transaction) {
  const region = plan.instance;
  const oldChild = region.child;
  const oldItems = region.items;
  const child = plan.child?.instance ?? null;
  const items = plan.items ? new Map([...plan.items].map(([key, item]) => [key, item.instance])) : null;
  region.child = child;
  region.items = items;
  region.arm = plan.arm;
  if (oldChild && oldChild !== child) {
    releaseInstance(oldChild, transaction);
    if (transaction.disposed)
      return;
    removeRange(region.range, true, transaction);
  }
  if (oldItems)
    for (const [key, item] of oldItems) {
      if (items?.get(key) === item)
        continue;
      releaseInstance(item, transaction);
      if (transaction.disposed)
        return;
      removeRange(item.range, false, transaction);
    }
  if (plan.child) {
    commitFragment(plan.child, transaction);
    if (transaction.disposed)
      return;
    if (child !== oldChild)
      insertBody(child, region.range, false, transaction);
  } else if (plan.items) {
    for (const item of plan.items.values()) {
      commitFragment(item, transaction);
      if (transaction.disposed)
        return;
    }
    let anchor = region.range.end;
    for (const [key, item] of [...plan.items].reverse()) {
      item.instance.range.start.data = `${BINDING_OPEN_PREFIX}${id};${region.site};k;${key}`;
      moveRange(item.instance.range, region.range.end.parentNode, anchor, transaction);
      if (transaction.disposed)
        return;
      anchor = item.instance.range.start;
    }
  }
  region.range.start.data = `${HYDRATION_FOR_PREFIX}${plan.arm};b;${id};${region.site}`;
  return;
}
function claimProgramControl(instance, index, node, transaction) {
  if (!transaction.controls)
    throw new TypeError(process.env.NODE_ENV !== "production" ? "A DOM control binding requires its compiler-selected adapter." : __octaneNoArgError(302));
  const prepare = () => {
    if (instance.disposed || transaction.preparing && instance.signalFrame !== transaction.frame)
      return () => {
      };
    const prepared = instance.controls.get(index).prepareCurrent();
    prepared.publish();
    if (transaction.preparing && instance.signalPlan) {
      instance.signalPlan.controls.set(index, prepared);
      return () => {
      };
    }
    return prepared.commit;
  };
  (instance.controls ??= /* @__PURE__ */ new Map()).set(index, transaction.controls.claim(node, instance.definition.bindings[index][2], forwardNativeTransitionConsumer(transaction.consumer, () => transaction.notifySignal(prepare))));
}
function projectHostValues(values, instance, transaction) {
  const operations = instance.definition.bindings;
  if (transaction.projections && instance.definition.projectionGroups) {
    values = [...values];
    for (const group of instance.definition.projectionGroups) {
      requireActive(transaction);
      const first = group[0][0];
      let connection = (transaction.preview?.projections.get(instance) ?? instance.projections)?.get(first);
      if (!connection) {
        const prepare = () => {
          if (instance.disposed || transaction.preparing && instance.signalFrame !== transaction.frame)
            return () => {
            };
          const projected2 = connection.get();
          const groups = /* @__PURE__ */ new Map();
          for (const [index] of group) {
            const classGroup = instance.groups.get(index)?.prepare(projected2[index] ?? "");
            if (classGroup)
              groups.set(index, classGroup);
          }
          if (transaction.preparing && instance.signalPlan) {
            for (const [index] of group) {
              instance.signalPlan.values[index] = projected2[index];
              const classGroup = groups.get(index);
              if (classGroup)
                instance.signalPlan.groups.set(index, classGroup);
            }
            return () => {
            };
          }
          return () => {
            for (const [index] of group)
              writeOperation(instance, index, projected2[index], groups.get(index), transaction);
          };
        };
        connection = transaction.projections.connect(group, operations, instance.nodes, forwardNativeTransitionConsumer(transaction.consumer, () => transaction.notifySignal(prepare)), transaction.restoreStyles);
        if (transaction.preview) {
          let projections = transaction.preview.projections.get(instance);
          if (!projections)
            transaction.preview.projections.set(instance, projections = new Map(instance.projections));
          for (const [index] of group)
            projections.set(index, connection);
          const created = connection;
          transaction.preview.disposals.push(() => created.dispose(true));
        } else {
          instance.projections ??= /* @__PURE__ */ new Map();
          for (const [index] of group)
            instance.projections.set(index, connection);
        }
      }
      const receipt = transaction.preview ? connection.preview(values[first]) : void 0;
      if (receipt)
        transaction.preview.receipts.push(receipt);
      const projected = receipt ? receipt.value : connection.read(values[first]);
      for (const [index] of group)
        values[index] = projected[index];
    }
  }
  return values;
}
function prepareHostGroups(plan) {
  const instance = plan.instance;
  const definition = instance.definition;
  for (let index = 0; index < definition.bindings.length; index++) {
    const operation = definition.bindings[index];
    if (operation[1] !== "classGroup")
      continue;
    let group = instance.groups.get(index);
    if (!group) {
      const receipt = definition.initializers?.findIndex((initializer) => initializer[0] === operation[0] && initializer[1] === "classGroupInitial" && initializer[2] === operation[2]);
      if (receipt === void 0 || receipt < 0 || typeof plan.initial?.[receipt] !== "string")
        throw new Error(process.env.NODE_ENV !== "production" ? "A constructible class group requires its compiler baseline initializer." : __octaneNoArgError(303));
      group = definition.createClassGroup(instance.nodes[operation[0]], operation[2], operation[3], plan.initial[receipt]);
      instance.groups.set(index, group);
    }
    plan.groups.set(index, group.prepare(plan.values[index] ?? ""));
  }
}
function releaseHostControls(instance, attempt) {
  for (const control of instance.controls?.values() ?? [])
    attempt(() => control.dispose());
  instance.controls?.clear();
}
function releaseHostProjections(instance, transaction, attempt) {
  for (const connection of instance.projections ? new Set(instance.projections.values()) : [])
    attempt(() => connection.dispose(transaction.preservePresentation));
  instance.projections?.clear();
}
const __adoptSelectedBindingProgram = /* @__PURE__ */ Object.assign(function __adoptSelectedBindingProgram2(root, descriptor, source, options) {
  return adoptProgram(root, descriptor, source, options, descriptor.list, __bindingProgramHostOperations);
}, { hostOperations: __bindingProgramHostOperations });
function __mountSelectedBindingProgram(target, descriptor, source, options) {
  return bindProgram(target, descriptor, source, options, true, descriptor.list, __bindingProgramHostOperations);
}
export {
  __activateBindingAdapters,
  __adoptBindingProgram,
  __adoptLeanBindingProgram,
  __adoptSelectedBindingProgram,
  __bindingList,
  __bindingProgramHostOperations,
  __bindingProgramInitializers,
  __bindingSlot,
  __createStructuralBindingHandoff,
  __methodDep,
  __mountBindingProgram,
  __mountLeanBindingProgram,
  __mountSelectedBindingProgram
};
