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
var dom_bindings_exports = {};
__export(dom_bindings_exports, {
  __adoptBindings: () => __adoptBindings,
  __adoptScalarBindings: () => __adoptScalarBindings,
  __claimBinding: () => __claimBinding,
  __createBindingStyleRestoration: () => __createBindingStyleRestoration,
  __mountBindings: () => __mountBindings,
  __normalizeBinding: () => normalize,
  __releaseBinding: () => __releaseBinding,
  __writeBinding: () => write,
  adoptBindings: () => adoptBindings,
  mountBindings: () => mountBindings,
  unbound: () => unbound
});
module.exports = __toCommonJS(dom_bindings_exports);
var import_class_names = require("./class-names.cjs");
var import_dom_binding_claims = require("./dom-binding-claims.cjs");
var import_sanitize_url = require("./sanitize-url.cjs");
var import_stream_protocol = require("./stream-protocol.cjs");
var import_native_read_seeds = require("./signals/native-read-seeds.cjs");
var import_control_handoff = require("./signals/control-handoff.cjs");
var import_owner_context = require("./signals/owner-context.cjs");
var import_read_protocol = require("./signals/read-protocol.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function unbound(value) {
  return value;
}
function adoptBindings(_root, _view, _source, _options) {
  throw new Error(__octaneDev ? "adoptBindings() requires an Octane-compiled .tsrx or .tsx call and a supported static view." : __octaneNoArgError(313));
}
function mountBindings(_target, _view, _source, _options) {
  throw new Error(__octaneDev ? "mountBindings() requires an Octane-compiled .tsrx or .tsx call." : __octaneNoArgError(314));
}
function __mountBindings(target, descriptor, source, options) {
  return descriptor.mount(target, descriptor, source, options);
}
const claims = /* @__PURE__ */ new WeakMap();
const namespaces = ["http://www.w3.org/1999/xhtml", "http://www.w3.org/2000/svg"];
function channel(binding) {
  return binding[1] === "styleProperty" ? `style:${binding[2]}` : binding[1] === "classToken" ? `class:${binding[2]}` : binding[1] === "classGroup" ? `classGroup:${binding[2]}:${binding[3]}` : binding[2];
}
function conflicts(channels, binding, name) {
  if (channels.has(name))
    return true;
  if (binding[1] === "styleProperty" && channels.has("style"))
    return true;
  if (name === "style") {
    for (const claimed of channels)
      if (claimed.startsWith("style:"))
        return true;
  }
  if (binding[1] === "classToken") {
    if (channels.has("class"))
      return true;
    for (const claimed of channels)
      if (claimed.startsWith("classGroup:"))
        return true;
  }
  if (binding[1] === "classGroup") {
    if (channels.has("class"))
      return true;
    for (const claimed of channels)
      if (claimed.startsWith("class:"))
        return true;
  }
  if (name === "class") {
    for (const claimed of channels)
      if (claimed.startsWith("class:") || claimed.startsWith("classGroup:"))
        return true;
  }
  return false;
}
function __claimBinding(node, binding) {
  if (binding[1] === "classToken" && !/^\S+$/.test(binding[2]))
    throw new TypeError(__octaneDev ? "A DOM class token binding requires one nonempty class token." : __octaneNoArgError(315));
  const name = channel(binding);
  let channels = claims.get(node);
  if (channels !== void 0 && conflicts(channels, binding, name))
    throw new Error(__octaneDev ? "This DOM property already has a binding. Dispose it before rebinding." : __octaneNoArgError(316));
  if (channels === void 0)
    claims.set(node, channels = /* @__PURE__ */ new Set());
  channels.add(name);
  return name;
}
function __releaseBinding(node, name) {
  const channels = claims.get(node);
  channels.delete(name);
  if (channels.size === 0)
    claims.delete(node);
  const published = import_dom_binding_claims.domBindingClaims.get(node);
  if (published) {
    published.delete(name);
    if (published.size === 0)
      import_dom_binding_claims.domBindingClaims.delete(node);
  }
}
function assertBindingRoot(root, descriptor) {
  if (root?.nodeType !== 1 || root.getAttribute("data-octane-bindings") !== descriptor.id || descriptor.nodes.length === 0) {
    throw new Error(__octaneDev ? "DOM bindings require the matching compiler-stamped root." : __octaneNoArgError(317));
  }
  return root;
}
function resolveFixedNodes(root, descriptor) {
  assertBindingRoot(root, descriptor);
  const nodes = [];
  const childIndices = [];
  for (let i = 0; i < descriptor.nodes.length; i++) {
    const [parent, tag, namespace, children, , text] = descriptor.nodes[i];
    const node = i === 0 ? parent === -1 ? root : void 0 : parent >= 0 && parent < i && descriptor.nodes[parent][3] !== null ? nodes[parent]?.children[childIndices[parent]++] : void 0;
    if (node === void 0 || descriptor.nodes[i][4] === true || node.localName !== tag || node.namespaceURI !== namespaces[namespace] || (text ? node.childNodes.length > 1 || node.firstChild !== null && node.firstChild.nodeType !== 3 : children !== null && (node.childNodes.length !== children || node.children.length !== children))) {
      throw new Error(__octaneDev ? "DOM bindings cannot adopt a mismatched static element topology." : __octaneNoArgError(318));
    }
    nodes.push(node);
    childIndices.push(0);
  }
  for (let i = 0; i < nodes.length; i++) {
    if (childIndices[i] !== (descriptor.nodes[i][3] ?? 0)) {
      throw new Error(__octaneDev ? "DOM bindings cannot adopt an incomplete static element topology." : __octaneNoArgError(319));
    }
  }
  return nodes;
}
function resolveAddressedNodes(root, descriptor) {
  const nodes = [];
  const prefix = `${descriptor.id}:`;
  let current = root;
  while (current !== null) {
    let descend = current === root || !current.hasAttribute("data-octane-bindings");
    if (descend) {
      const marker = current.getAttribute("data-octane-binding-node");
      if (marker?.startsWith(prefix)) {
        const index = Number(marker.slice(prefix.length));
        if (!Number.isSafeInteger(index) || index < 0 || index >= descriptor.nodes.length || marker !== `${prefix}${index}` || nodes[index] !== void 0) {
          throw new Error(__octaneDev ? "DOM bindings require unique compiler-issued target addresses." : __octaneNoArgError(320));
        }
        nodes[index] = current;
        if (descriptor.nodes[index][3] === null)
          descend = false;
      }
    }
    if (descend && current.firstElementChild !== null) {
      current = current.firstElementChild;
      continue;
    }
    while (current !== root && current.nextElementSibling === null)
      current = current.parentElement;
    if (current === root)
      break;
    current = current.nextElementSibling;
  }
  const childCounts = new Array(descriptor.nodes.length).fill(0);
  for (let i = 0; i < descriptor.nodes.length; i++) {
    const [parent, tag, namespace, children, openChildren, text] = descriptor.nodes[i];
    const node = nodes[i];
    if (node === void 0 || node.localName !== tag || node.namespaceURI !== namespaces[namespace] || (i === 0 ? parent !== -1 || node !== root : parent < 0 || parent >= i || descriptor.nodes[parent][3] === null || node.parentElement !== nodes[parent] || descriptor.nodes[parent][4] !== true && nodes[parent].children[childCounts[parent]] !== node) || openChildren && children === null || (text ? node.childNodes.length > 1 || node.firstChild !== null && node.firstChild.nodeType !== 3 : children !== null && !openChildren && (node.childNodes.length !== children || node.children.length !== children))) {
      throw new Error(__octaneDev ? "DOM bindings cannot adopt a mismatched addressed element topology." : __octaneNoArgError(321));
    }
    if (parent !== -1)
      childCounts[parent]++;
  }
  for (let i = 0; i < descriptor.nodes.length; i++) {
    if (childCounts[i] !== (descriptor.nodes[i][3] ?? 0)) {
      throw new Error(__octaneDev ? "DOM bindings cannot adopt an incomplete addressed element topology." : __octaneNoArgError(322));
    }
  }
  return nodes;
}
function isFixedScalarChannel(binding) {
  const kind = binding[1];
  return kind === "attr" || kind === "boolean" || kind === "aria" || kind === "class" || kind === "text";
}
function normalizeFixedScalar(binding, value) {
  const type = typeof value;
  switch (binding[1]) {
    case "text":
      if (value == null || value === false)
        return "";
      if (type !== "string" && type !== "number" && type !== "bigint" && type !== "boolean")
        throw new TypeError(__octaneDev ? "DOM binding text must be a synchronous scalar." : __octaneNoArgError(323));
      return String(value);
    case "class":
      return value == null || value === false ? null : (0, import_class_names.normalizeClass)(value);
    case "boolean":
      return !value || type === "function" || type === "symbol" ? null : "";
    default:
      return value == null || type === "function" || type === "symbol" || binding[1] === "attr" && type === "boolean" ? null : String(value);
  }
}
function writeFixedScalar(node, binding, value) {
  const name = binding[2];
  if (binding[1] === "text") {
    const text = node.firstChild;
    if (text === null)
      node.appendChild(node.ownerDocument.createTextNode(value));
    else if (text.nodeValue !== value)
      text.nodeValue = value;
  } else if (value === null) {
    if (node.hasAttribute(name))
      node.removeAttribute(name);
  } else if (node.getAttribute(name) !== value) {
    node.setAttribute(name, value);
  }
}
function normalize(binding, value) {
  const type = typeof value;
  switch (binding[1]) {
    case "styleObject":
      return value;
    case "classGroup":
      return value == null || value === false ? "" : (0, import_class_names.normalizeClass)(value);
    case "styleAttribute":
      if (value == null || value === false || value === "")
        return null;
      if (type !== "string")
        throw new TypeError(__octaneDev ? "A whole-style DOM binding requires serialized CSS text or null." : __octaneNoArgError(324));
      return value;
    case "classToken":
      return value ? "" : null;
    case "url":
      return value == null || type === "boolean" || type === "function" || type === "symbol" ? null : (0, import_sanitize_url.sanitizeURL)(String(value));
    case "styleProperty": {
      if (value == null || type === "boolean")
        return null;
      return type === "number" && value !== 0 && !binding[3] ? value + "px" : type === "string" ? value.trim() : "" + value;
    }
    default:
      return normalizeFixedScalar(binding, value);
  }
}
function write(node, binding, value) {
  const name = binding[2];
  if (binding[1] === "classToken") {
    node.classList.toggle(name, value !== null);
  } else if (binding[1] === "url") {
    if (value === "" && !(name === "href" && node.localName === "a"))
      value = null;
    if (name === "xlink:href") {
      if (value === null)
        node.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
      else if (node.getAttributeNS("http://www.w3.org/1999/xlink", "href") !== value)
        node.setAttributeNS("http://www.w3.org/1999/xlink", name, value);
    } else if (value === null) {
      if (node.hasAttribute(name))
        node.removeAttribute(name);
    } else if (node.getAttribute(name) !== value)
      node.setAttribute(name, value);
  } else if (binding[1] === "styleProperty") {
    const style = node.style;
    if (value === null) {
      style.removeProperty(name);
    } else {
      const tail = value.trimEnd();
      const important = tail.endsWith("!important");
      const text = important ? tail.slice(0, -10).trimEnd() : value;
      const priority = important ? "important" : "";
      if (style.getPropertyValue(name) !== text || style.getPropertyPriority(name) !== priority)
        style.setProperty(name, text, priority);
    }
  } else
    writeFixedScalar(node, binding, value);
}
function __createBindingStyleRestoration(node, binding) {
  if (binding[1] === "styleAttribute") {
    let baseline2;
    let expected2;
    let disposed2 = false;
    return {
      write(value) {
        if (disposed2)
          return;
        if (baseline2 === void 0)
          baseline2 = node.getAttribute("style");
        expected2 = value;
        write(node, binding, value);
      },
      dispose(preservePresentation) {
        if (disposed2)
          return;
        disposed2 = true;
        if (!preservePresentation && baseline2 !== void 0 && node.getAttribute("style") === expected2)
          write(node, binding, baseline2);
      }
    };
  }
  const style = node.style;
  const name = binding[2];
  let baseline;
  let expected;
  let probe;
  let disposed = false;
  return {
    write(value) {
      if (disposed)
        return;
      baseline ??= [style.getPropertyValue(name), style.getPropertyPriority(name)];
      probe ??= node.ownerDocument.createElement("i");
      probe.style.cssText = "";
      probe.style.setProperty(name, style.getPropertyValue(name), style.getPropertyPriority(name));
      write(probe, binding, value);
      expected = [probe.style.getPropertyValue(name), probe.style.getPropertyPriority(name)];
      write(node, binding, value);
    },
    dispose(preservePresentation) {
      if (disposed)
        return;
      disposed = true;
      if (!preservePresentation && baseline && expected && style.getPropertyValue(name) === expected[0] && style.getPropertyPriority(name) === expected[1]) {
        if (baseline[0] === "")
          style.removeProperty(name);
        else
          style.setProperty(name, baseline[0], baseline[1]);
      }
    }
  };
}
function __adoptBindings(root, descriptor, source, options) {
  if ("root" in descriptor)
    return descriptor.adopt(root, descriptor, source, options);
  if (!source || typeof source.getSnapshot !== "function" || typeof source.subscribe !== "function")
    throw new TypeError(__octaneDev ? "DOM bindings require synchronous getSnapshot() and subscribe() methods." : __octaneNoArgError(325));
  const nodes = descriptor.addressed ? resolveAddressedNodes(assertBindingRoot(root, descriptor), descriptor) : resolveFixedNodes(root, descriptor);
  const bindings = descriptor.bindings;
  const owned = [];
  const previous = [];
  let groups;
  let styles;
  const signalFactory = descriptor.connectSignal?.();
  const styleFactory = descriptor.connectStyle?.();
  const projectionFactory = descriptor.connectProjection?.();
  const projections = projectionFactory ? /* @__PURE__ */ new Map() : void 0;
  const controlFactory = descriptor.createControls?.();
  const controls = controlFactory ? /* @__PURE__ */ new Map() : void 0;
  const signalConnections = signalFactory || styleFactory ? /* @__PURE__ */ new Map() : void 0;
  const signalUpdates = signalFactory || styleFactory || projectionFactory || controlFactory ? /* @__PURE__ */ new Set() : void 0;
  let disposed = false;
  let busy = true;
  let dirty = false;
  let revision = 0;
  let unsubscribe;
  let publicationRetries;
  let published;
  const signal = options?.signal;
  const dispose = (_disposal, publish, preservePresentation = false) => {
    if (disposed) {
      publish?.();
      return;
    }
    disposed = true;
    publicationRetries?.clear();
    signal?.removeEventListener("abort", dispose);
    let failed = false;
    let failure;
    try {
      publish?.();
    } catch (error) {
      failed = true;
      failure = error;
    }
    for (const connection of signalConnections?.values() ?? []) {
      try {
        connection.dispose(preservePresentation);
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    for (const connection of projections ? new Set(projections.values()) : []) {
      try {
        connection.dispose(preservePresentation);
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    projections?.clear();
    for (const control of controls?.values() ?? []) {
      try {
        control.dispose();
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    controls?.clear();
    signalConnections?.clear();
    signalUpdates?.clear();
    for (let i = 0; i < owned.length; i++) {
      const [node, name] = owned[i];
      try {
        groups?.get(i)?.dispose(preservePresentation);
        styles?.get(i)?.dispose(preservePresentation);
        if (!preservePresentation && bindings[i][1] === "classToken" && previous[i] === "")
          node.classList.remove(bindings[i][2]);
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
      __releaseBinding(node, name);
    }
    owned.length = nodes.length = previous.length = 0;
    groups?.clear();
    styles?.clear();
    const stop = unsubscribe;
    unsubscribe = void 0;
    try {
      stop?.();
    } catch (error) {
      if (!failed)
        throw error;
    }
    if (failed)
      throw failure;
  };
  const prepareProjection = projections ? (index, next, indices) => {
    const projection = projections.get(index);
    if (!projection)
      return;
    if (index === projection.group[0][0]) {
      const values = projection.get();
      for (const [fieldIndex] of projection.group) {
        next[fieldIndex] = values[fieldIndex];
        if (indices && !indices.includes(fieldIndex))
          indices.push(fieldIndex);
      }
    }
    return projection.group;
  } : void 0;
  const writePrepared = (next, indices, preparedControls, preparedGroups) => {
    for (let position = 0; position < (indices?.length ?? bindings.length) && !dirty && !disposed; position++) {
      const i = indices ? indices[position] : position;
      if (bindings[i][1] === "control") {
        preparedControls.get(i).commit();
        continue;
      }
      if (next[i] === previous[i])
        continue;
      const binding = bindings[i];
      if (binding[1] === "classToken")
        previous[i] = next[i];
      if (binding[1] === "styleObject") {
        const projection = projections?.get(i);
        if (projection)
          projection.writeStyle(i, next[i]);
        else
          signalConnections.get(i).write(next[i]);
      } else if (binding[1] === "classGroup")
        preparedGroups.get(i).commit();
      else if ((binding[1] === "styleProperty" || binding[1] === "styleAttribute") && options?.restoreStyles) {
        styles ??= /* @__PURE__ */ new Map();
        let style = styles.get(i);
        if (!style)
          styles.set(i, style = __createBindingStyleRestoration(nodes[binding[0]], binding));
        style.write(next[i]);
      } else
        write(nodes[binding[0]], binding, next[i]);
      if (!disposed) {
        previous[i] = next[i];
        if (binding[1] === "attr" || binding[1] === "boolean" || binding[1] === "aria" || binding[1] === "class" || binding[1] === "styleProperty" || binding[1] === "text") {
          const [node, name] = owned[i];
          let published2 = next[i];
          if (binding[1] === "styleProperty") {
            const style = node.style;
            const value = style.getPropertyValue(binding[2]);
            published2 = value === "" ? null : value + (style.getPropertyPriority(binding[2]) ? " !important" : "");
          }
          let claims2 = import_dom_binding_claims.domBindingClaims.get(node);
          if (claims2 === void 0)
            import_dom_binding_claims.domBindingClaims.set(node, claims2 = /* @__PURE__ */ new Map());
          claims2.set(name, published2);
        }
      }
    }
  };
  const drain = (preview = false) => {
    if (disposed)
      return;
    if (busy)
      return preview ? { validate: () => false, commit() {
      }, discard() {
      } } : void 0;
    const version = revision;
    const previousDirty = dirty;
    const previousUpdates = preview && signalUpdates ? [...signalUpdates] : void 0;
    const preparedSignals = preview && signalConnections ? new Map(signalConnections) : signalConnections;
    const preparedProjections = preview && projections ? new Map(projections) : projections;
    const receipts = preview ? [] : void 0;
    const controlReceipts = preview ? [] : void 0;
    let accepted = false;
    let retired = false;
    const discard = preview ? () => {
      if (accepted || retired)
        return;
      retired = true;
      for (const receipt of receipts)
        receipt.discard();
      for (const control of controlReceipts)
        control.discard();
      for (const [index, connection] of preparedSignals ?? [])
        if (connection !== signalConnections?.get(index))
          connection.dispose(true);
      for (const [index, connection] of preparedProjections ?? [])
        if (connection !== projections?.get(index))
          connection.dispose(true);
    } : void 0;
    if (preview)
      dirty = true;
    busy = true;
    try {
      while ((dirty || signalUpdates?.size) && !disposed) {
        let next;
        let indices;
        const preparedControls = controls ? /* @__PURE__ */ new Map() : void 0;
        if (dirty) {
          dirty = false;
          signalUpdates?.clear();
          const snapshot = source.getSnapshot();
          if (dirty || disposed)
            continue;
          if (snapshot !== null && (typeof snapshot === "object" || typeof snapshot === "function") && typeof snapshot.then === "function" && !dirty && !disposed)
            throw new TypeError(__octaneDev ? "DOM bindings require a synchronous snapshot, not a thenable." : __octaneNoArgError(326));
          if (dirty || disposed)
            continue;
          const values = descriptor.project(snapshot);
          if (dirty || disposed)
            continue;
          if (!Array.isArray(values) || values.length !== bindings.length)
            throw new TypeError(__octaneDev ? "A DOM binding projection must return its synchronous scalar values." : __octaneNoArgError(327));
          let resolved = values;
          if (projectionFactory && descriptor.projectionGroups) {
            for (const group of descriptor.projectionGroups) {
              if (disposed || dirty)
                break;
              const first = group[0][0];
              let connection = preparedProjections.get(first);
              if (!connection) {
                connection = projectionFactory.connect(group, bindings, nodes, (0, import_read_protocol.forwardNativeTransitionConsumer)(refresh, () => {
                  if (!disposed) {
                    revision++;
                    signalUpdates.add(first);
                    drain();
                  }
                }), options?.restoreStyles);
                for (const [index] of group)
                  preparedProjections.set(index, connection);
              }
              const receipt = preview ? connection.preview(values[first]) : void 0;
              if (receipt)
                receipts.push(receipt);
              const projected = receipt ? receipt.value : connection.read(values[first]);
              if (resolved === values)
                resolved = [...values];
              for (const [index] of group)
                resolved[index] = projected[index];
            }
          }
          if (styleFactory && descriptor.styleIndices) {
            for (const index of descriptor.styleIndices) {
              if (disposed || dirty)
                break;
              let connection = preparedSignals.get(index);
              if (!connection) {
                connection = styleFactory.connect(nodes[bindings[index][0]], (0, import_read_protocol.forwardNativeTransitionConsumer)(refresh, () => {
                  if (!disposed) {
                    revision++;
                    signalUpdates.add(index);
                    drain();
                  }
                }), options?.restoreStyles);
                preparedSignals.set(index, connection);
              }
              if (resolved === values)
                resolved = [...values];
              const receipt = preview ? connection.preview(values[index]) : void 0;
              if (receipt)
                receipts.push(receipt);
              resolved[index] = receipt ? receipt.value : connection.read(values[index]);
            }
          }
          if (signalFactory && descriptor.signalIndices) {
            for (const index of descriptor.signalIndices) {
              if (disposed || dirty)
                break;
              let connection = preparedSignals.get(index);
              if (!connection && signalFactory.isSignal(values[index])) {
                connection = signalFactory.connect((0, import_read_protocol.forwardNativeTransitionConsumer)(refresh, () => {
                  if (!disposed) {
                    revision++;
                    signalUpdates.add(index);
                    drain();
                  }
                }));
                preparedSignals.set(index, connection);
              }
              if (connection) {
                if (resolved === values)
                  resolved = [...values];
                const receipt = preview ? connection.preview(values[index]) : void 0;
                if (receipt)
                  receipts.push(receipt);
                resolved[index] = receipt ? receipt.value : connection.read(values[index]);
              }
            }
          }
          next = resolved.map((value, index) => {
            const control = controls?.get(index);
            if (control) {
              const prepared = preview ? control.preview(value) : control.prepare(value);
              controlReceipts?.push(prepared);
              preparedControls.set(index, prepared);
              return null;
            }
            return normalize(bindings[index], value);
          });
        } else {
          indices = [...signalUpdates];
          signalUpdates.clear();
          next = [];
          for (const index of indices) {
            if (prepareProjection?.(index, next, indices))
              continue;
            const control = controls?.get(index);
            if (control)
              preparedControls.set(index, control.prepareCurrent());
            else
              next[index] = normalize(bindings[index], signalConnections.get(index).get());
          }
        }
        while (!preview && signalUpdates?.size && !dirty && !disposed) {
          const pending = [...signalUpdates];
          signalUpdates.clear();
          for (const index of pending) {
            if (prepareProjection?.(index, next, indices))
              continue;
            const control = controls?.get(index);
            if (control)
              preparedControls.set(index, control.prepareCurrent());
            else
              next[index] = normalize(bindings[index], signalConnections.get(index).get());
            if (indices && !indices.includes(index))
              indices.push(index);
          }
        }
        const preparedGroups = groups && new Map([...groups].filter(([index]) => !indices || indices.includes(index)).map(([index, group]) => [
          index,
          group.prepare(next[index] ?? "")
        ]));
        if (preparedControls && !preview) {
          while (!dirty && !disposed) {
            for (const control of preparedControls.values()) {
              control.publish();
              if (dirty || disposed)
                break;
            }
            if (!signalUpdates?.size || dirty || disposed)
              break;
            const pending = [...signalUpdates];
            signalUpdates.clear();
            for (const index of pending) {
              const projection = prepareProjection?.(index, next, indices);
              if (projection) {
                for (const [fieldIndex] of projection) {
                  const group = groups?.get(fieldIndex);
                  if (group)
                    preparedGroups.set(fieldIndex, group.prepare(next[fieldIndex] ?? ""));
                }
                continue;
              }
              const control = controls?.get(index);
              if (control)
                preparedControls.set(index, control.prepareCurrent());
              else {
                next[index] = normalize(bindings[index], signalConnections.get(index).get());
                const group = groups?.get(index);
                if (group)
                  preparedGroups.set(index, group.prepare(next[index] ?? ""));
              }
              if (indices && !indices.includes(index))
                indices.push(index);
            }
          }
        }
        if (preview)
          return {
            validate: () => !retired && !disposed && revision === version && receipts.every((receipt) => receipt.validate()) && controlReceipts.every((control) => control.validate()),
            discard,
            commit() {
              if (disposed || retired || accepted)
                return;
              accepted = true;
              busy = true;
              try {
                for (const [index, connection] of preparedSignals ?? [])
                  signalConnections.set(index, connection);
                for (const [index, connection] of preparedProjections ?? [])
                  projections.set(index, connection);
                for (const receipt of receipts)
                  receipt.commit();
                for (const control of preparedControls?.values() ?? [])
                  control.publish();
                writePrepared(next, indices, preparedControls, preparedGroups);
              } finally {
                busy = false;
                published?.();
              }
            }
          };
        if (dirty || disposed)
          continue;
        writePrepared(next, indices, preparedControls, preparedGroups);
      }
    } catch (error) {
      if (preview) {
        discard();
        throw error;
      }
      try {
        dispose();
      } catch {
      }
      throw error;
    } finally {
      if (preview) {
        dirty ||= previousDirty;
        for (const index of previousUpdates ?? [])
          signalUpdates.add(index);
      }
      busy = false;
      if (!preview)
        published?.();
    }
  };
  const refresh = () => {
    if (disposed)
      return;
    revision++;
    dirty = true;
    drain();
  };
  const owner = (0, import_owner_context.currentSignalOwner)();
  const run = owner === null ? (callback) => callback() : (0, import_owner_context.captureSignalOwner)(owner);
  refresh[import_read_protocol.NATIVE_TRANSITION_CONSUMER] = {
    active: () => !disposed,
    prepare: () => run(() => drain(true))
  };
  const handle = { refresh, dispose };
  if (descriptor.handoff === "host") {
    published = () => {
      if (!publicationRetries?.size)
        return;
      const pending = [...publicationRetries];
      publicationRetries.clear();
      for (const retry of pending)
        queueMicrotask(() => {
          if (!disposed)
            retry();
        });
    };
    const host = root;
    const document = host.ownerDocument;
    const ancestry = [];
    for (let node = host; node !== null; node = node.parentNode)
      ancestry.push([node, node.parentNode]);
    const sibling = (node, previous2) => {
      let next = previous2 ? node.previousSibling : node.nextSibling;
      while (next?.nodeType === 1 && next.localName === "script" && (next.hasAttribute(import_native_read_seeds.NATIVE_SIGNAL_SEED_ATTR) || next.hasAttribute(import_stream_protocol.SUSPENSE_SCRIPT_ATTR) || next.hasAttribute(import_stream_protocol.STREAM_SCRIPT_ATTR)))
        next = previous2 ? next.previousSibling : next.nextSibling;
      return next;
    };
    const previousSibling = sibling(host, true);
    const nextSibling = sibling(host, false);
    let handoff;
    handle[import_control_handoff.BINDING_HANDOFF] = () => {
      if (handoff !== void 0)
        return handoff;
      return handoff = {
        id: descriptor.id,
        root: host,
        anchor: host,
        host: new Set(bindings.map((binding) => binding[1] === "styleProperty" ? "style:" + binding[2] : binding[1].startsWith("style") ? "style" : binding[2])),
        revision: () => busy ? -1 : revision,
        afterPublication: (callback) => {
          (publicationRetries ??= /* @__PURE__ */ new Set()).add(callback);
          return () => publicationRetries.delete(callback);
        },
        valid: () => host.parentNode !== null && host.ownerDocument === document && ancestry.every(([node, parent]) => node.parentNode === parent) && sibling(host, true) === previousSibling && sibling(host, false) === nextSibling && host.getAttribute("data-octane-bindings") === descriptor.id,
        active: () => !disposed,
        retire: (publish) => dispose(void 0, publish, true)
      };
    };
  }
  if (signal?.aborted) {
    dispose();
    return handle;
  }
  try {
    for (let index = 0; index < bindings.length; index++) {
      const binding = bindings[index];
      const node = nodes[binding[0]];
      if (node === void 0)
        throw new TypeError(__octaneDev ? "A DOM binding targets an unknown element." : __octaneNoArgError(328));
      owned.push([node, __claimBinding(node, binding)]);
      if (binding[1] === "control") {
        controls.set(index, controlFactory.claim(node, binding[2], (0, import_read_protocol.forwardNativeTransitionConsumer)(refresh, () => {
          if (!disposed) {
            revision++;
            signalUpdates.add(index);
            drain();
          }
        })));
      }
      if (binding[1] === "classGroup") {
        groups ??= /* @__PURE__ */ new Map();
        groups.set(index, descriptor.createClassGroup(node, binding[2], binding[3]));
      }
    }
    signal?.addEventListener("abort", dispose, { once: true });
    const stop = source.subscribe(refresh);
    if (typeof stop !== "function")
      throw new TypeError(__octaneDev ? "A DOM binding subscription must return a cleanup function." : __octaneNoArgError(329));
    if (disposed)
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
function __adoptScalarBindings(root, descriptor, source, options) {
  if (descriptor.addressed || descriptor.handoff || descriptor.connectProjection || !descriptor.bindings.every(isFixedScalarChannel))
    throw new TypeError(__octaneDev ? "This DOM binding view requires the general adopter." : __octaneNoArgError(330));
  if (!source || typeof source.getSnapshot !== "function" || typeof source.subscribe !== "function")
    throw new TypeError(__octaneDev ? "DOM bindings require synchronous getSnapshot() and subscribe() methods." : __octaneNoArgError(325));
  const nodes = resolveFixedNodes(root, descriptor);
  const bindings = descriptor.bindings;
  const owned = [];
  const previous = [];
  const signalFactory = descriptor.connectSignal?.();
  const signalConnections = signalFactory ? /* @__PURE__ */ new Map() : void 0;
  const signalUpdates = signalFactory ? /* @__PURE__ */ new Set() : void 0;
  let disposed = false;
  let busy = true;
  let dirty = false;
  let revision = 0;
  let unsubscribe;
  const signal = options?.signal;
  const dispose = () => {
    if (disposed)
      return;
    disposed = true;
    signal?.removeEventListener("abort", dispose);
    let failed = false;
    let failure;
    for (const connection of signalConnections?.values() ?? []) {
      try {
        connection.dispose();
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    signalConnections?.clear();
    signalUpdates?.clear();
    for (let i = 0; i < owned.length; i++)
      __releaseBinding(owned[i][0], owned[i][1]);
    owned.length = nodes.length = previous.length = 0;
    const stop = unsubscribe;
    unsubscribe = void 0;
    try {
      stop?.();
    } catch (error) {
      if (!failed)
        throw error;
    }
    if (failed)
      throw failure;
  };
  const writePrepared = (next, indices) => {
    for (let position = 0; position < (indices?.length ?? bindings.length) && !dirty && !disposed; position++) {
      const i = indices ? indices[position] : position;
      if (next[i] === previous[i])
        continue;
      const binding = bindings[i];
      writeFixedScalar(nodes[binding[0]], binding, next[i]);
      if (!disposed) {
        previous[i] = next[i];
        const node = owned[i][0];
        let claims2 = import_dom_binding_claims.domBindingClaims.get(node);
        if (claims2 === void 0)
          import_dom_binding_claims.domBindingClaims.set(node, claims2 = /* @__PURE__ */ new Map());
        claims2.set(owned[i][1], next[i]);
      }
    }
  };
  const drain = (preview = false) => {
    if (disposed)
      return;
    if (busy)
      return preview ? { validate: () => false, commit() {
      }, discard() {
      } } : void 0;
    const version = revision;
    const previousDirty = dirty;
    const previousUpdates = preview && signalUpdates ? [...signalUpdates] : void 0;
    const preparedSignals = preview && signalConnections ? new Map(signalConnections) : signalConnections;
    const receipts = preview ? [] : void 0;
    let accepted = false;
    let retired = false;
    const discard = preview ? () => {
      if (accepted || retired)
        return;
      retired = true;
      for (const receipt of receipts)
        receipt.discard();
      for (const [index, connection] of preparedSignals ?? [])
        if (connection !== signalConnections?.get(index))
          connection.dispose();
    } : void 0;
    if (preview)
      dirty = true;
    busy = true;
    try {
      while ((dirty || signalUpdates?.size) && !disposed) {
        let next;
        let indices;
        if (dirty) {
          dirty = false;
          signalUpdates?.clear();
          const snapshot = source.getSnapshot();
          if (dirty || disposed)
            continue;
          if (snapshot !== null && (typeof snapshot === "object" || typeof snapshot === "function") && typeof snapshot.then === "function" && !dirty && !disposed)
            throw new TypeError(__octaneDev ? "DOM bindings require a synchronous snapshot, not a thenable." : __octaneNoArgError(326));
          if (dirty || disposed)
            continue;
          const values = descriptor.project(snapshot);
          if (dirty || disposed)
            continue;
          if (!Array.isArray(values) || values.length !== bindings.length)
            throw new TypeError(__octaneDev ? "A DOM binding projection must return its synchronous scalar values." : __octaneNoArgError(327));
          let resolved = values;
          if (signalFactory && descriptor.signalIndices) {
            for (const index of descriptor.signalIndices) {
              if (disposed || dirty)
                break;
              let connection = preparedSignals.get(index);
              if (!connection && signalFactory.isSignal(values[index])) {
                connection = signalFactory.connect((0, import_read_protocol.forwardNativeTransitionConsumer)(refresh, () => {
                  if (!disposed) {
                    revision++;
                    signalUpdates.add(index);
                    drain();
                  }
                }));
                preparedSignals.set(index, connection);
              }
              if (connection) {
                if (resolved === values)
                  resolved = [...values];
                const receipt = preview ? connection.preview(values[index]) : void 0;
                if (receipt)
                  receipts.push(receipt);
                resolved[index] = receipt ? receipt.value : connection.read(values[index]);
              }
            }
          }
          next = resolved.map((value, index) => normalizeFixedScalar(bindings[index], value));
        } else {
          indices = [...signalUpdates];
          signalUpdates.clear();
          next = [];
          for (const index of indices)
            next[index] = normalizeFixedScalar(bindings[index], signalConnections.get(index).get());
        }
        while (!preview && signalUpdates?.size && !dirty && !disposed) {
          const pending = [...signalUpdates];
          signalUpdates.clear();
          for (const index of pending) {
            next[index] = normalizeFixedScalar(bindings[index], signalConnections.get(index).get());
            if (indices && !indices.includes(index))
              indices.push(index);
          }
        }
        if (preview)
          return {
            validate: () => !retired && !disposed && revision === version && receipts.every((receipt) => receipt.validate()),
            discard,
            commit() {
              if (disposed || retired || accepted)
                return;
              accepted = true;
              busy = true;
              try {
                for (const [index, connection] of preparedSignals ?? [])
                  signalConnections.set(index, connection);
                for (const receipt of receipts)
                  receipt.commit();
                writePrepared(next, indices);
              } finally {
                busy = false;
              }
            }
          };
        if (dirty || disposed)
          continue;
        writePrepared(next, indices);
      }
    } catch (error) {
      if (preview) {
        discard();
        throw error;
      }
      try {
        dispose();
      } catch {
      }
      throw error;
    } finally {
      if (preview) {
        dirty ||= previousDirty;
        for (const index of previousUpdates ?? [])
          signalUpdates.add(index);
      }
      busy = false;
    }
  };
  const refresh = () => {
    if (disposed)
      return;
    revision++;
    dirty = true;
    drain();
  };
  const owner = (0, import_owner_context.currentSignalOwner)();
  const run = owner === null ? (callback) => callback() : (0, import_owner_context.captureSignalOwner)(owner);
  refresh[import_read_protocol.NATIVE_TRANSITION_CONSUMER] = {
    active: () => !disposed,
    prepare: () => run(() => drain(true))
  };
  const handle = { refresh, dispose };
  if (signal?.aborted) {
    dispose();
    return handle;
  }
  try {
    for (let index = 0; index < bindings.length; index++) {
      const node = nodes[bindings[index][0]];
      if (node === void 0)
        throw new TypeError(__octaneDev ? "A DOM binding targets an unknown element." : __octaneNoArgError(328));
      owned.push([node, __claimBinding(node, bindings[index])]);
    }
    signal?.addEventListener("abort", dispose, { once: true });
    const stop = source.subscribe(refresh);
    if (typeof stop !== "function")
      throw new TypeError(__octaneDev ? "A DOM binding subscription must return a cleanup function." : __octaneNoArgError(329));
    if (disposed)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __adoptBindings,
  __adoptScalarBindings,
  __claimBinding,
  __createBindingStyleRestoration,
  __mountBindings,
  __normalizeBinding,
  __releaseBinding,
  __writeBinding,
  adoptBindings,
  mountBindings,
  unbound
});
