const EAGER_METADATA = /* @__PURE__ */ new Set([
  // reconcileDeoptChildren: renderer keys used while planning retained hosts.
  "$$deoptKey",
  // renderPortalState: fixed end marker on a newly created portal start marker.
  "$$portalEnd",
  // attr: listener identity ledger; actual native registrations are staged.
  "$$ceListeners",
  // setAutoFocus: one-time mount ownership; focusing uses the commit queue.
  "$$afSeen",
  // setFormAction: one-time submit driver installation, shared across renders.
  "$$formSubmitWired",
  // maybeEnqueueRestore: native input/change event sequence state.
  "$$checkableActivation",
  "$$selectPick",
  // handleFormSubmit/publishManualFormPending: native submit lifetime counter.
  "$$pendingSubmits"
]);
const PROJECTED_PROPERTIES = /* @__PURE__ */ new Set([
  "id",
  "className",
  "slot",
  "title",
  "lang",
  "dir",
  "hidden",
  "inert",
  "tabIndex",
  "accessKey",
  "draggable",
  "contentEditable",
  "spellcheck",
  "translate",
  "role",
  "name",
  "type",
  "value",
  "defaultValue",
  "checked",
  "defaultChecked",
  "selected",
  "defaultSelected",
  "disabled",
  "multiple",
  "readOnly",
  "required",
  "autofocus",
  "placeholder",
  "min",
  "max",
  "step",
  "pattern",
  "minLength",
  "maxLength",
  "size",
  "rows",
  "cols",
  "accept",
  "action",
  "method",
  "enctype",
  "target",
  "noValidate",
  "href",
  "src",
  "srcset",
  "sizes",
  "alt",
  "width",
  "height",
  "loading",
  "decoding",
  "crossOrigin",
  "referrerPolicy",
  "htmlFor",
  "open",
  "controls",
  "muted",
  "loop"
]);
class DOMStage {
  constructor(captureGuard) {
    this.captureGuard = captureGuard;
  }
  captureGuard;
  views = /* @__PURE__ */ new Map();
  children = /* @__PURE__ */ new Map();
  links = /* @__PURE__ */ new Map();
  projections = /* @__PURE__ */ new Map();
  parents = /* @__PURE__ */ new Map();
  values = /* @__PURE__ */ new Map();
  states = /* @__PURE__ */ new Map();
  styles = /* @__PURE__ */ new Map();
  documents = /* @__PURE__ */ new Map();
  fresh = /* @__PURE__ */ new Set();
  actions = [];
  ended = false;
  /** Mark an actual creation/clone result, never an arbitrary detached node. */
  created(node) {
    this.fresh.add(node);
    const templates = (root) => {
      if (root.nodeType !== 1 && root.nodeType !== 11) return;
      const mark = (template) => {
        if (template.content === void 0) return;
        this.fresh.add(template.content);
        templates(template.content);
      };
      if (root.nodeType === 1 && root.localName === "template")
        mark(root);
      for (const template of root.querySelectorAll("template"))
        mark(template);
    };
    templates(node);
    return node;
  }
  view(node) {
    if (this.ended || node === null || typeof node !== "object" || typeof node.nodeType !== "number" || !("ownerDocument" in node))
      return node;
    let view = this.views.get(node);
    if (view === void 0) {
      view = new Proxy(node, {
        get: (_, key) => this.get(node, key),
        set: (_, key, value) => {
          this.set(node, key, value);
          return true;
        }
      });
      this.views.set(node, view);
    }
    return view;
  }
  /** Lifecycle work is interleaved with host writes, especially before removal. */
  enqueue(action, durable = false) {
    if (this.ended) throw new Error("Cannot append to a completed DOM commit.");
    this.actions.push({ action, guard: durable ? void 0 : this.captureGuard?.() });
  }
  commit() {
    if (this.ended) return;
    this.ended = true;
    const actions = this.actions;
    this.release();
    let failed = false;
    let firstError;
    for (const { action, guard } of actions) {
      try {
        if (guard === void 0 || guard()) action();
      } catch (error) {
        if (!failed) {
          failed = true;
          firstError = error;
        }
      }
    }
    if (failed) throw firstError;
  }
  release() {
    this.actions = [];
    this.views.clear();
    this.children.clear();
    this.links.clear();
    this.projections.clear();
    this.parents.clear();
    this.values.clear();
    this.states.clear();
    this.styles.clear();
    this.documents.clear();
    this.fresh.clear();
  }
  isFresh(node) {
    for (let current = node; current !== null; current = current.parentNode) {
      if (this.fresh.has(current)) return true;
    }
    return false;
  }
  childList(node) {
    let list = this.children.get(node);
    if (list !== void 0) return list;
    list = { first: node.firstChild, last: node.lastChild, length: 0, snapshot: null };
    let previous = null;
    for (let child = node.firstChild; child !== null; child = child.nextSibling) {
      this.links.set(child, { previous, next: child.nextSibling });
      previous = child;
      list.length++;
    }
    this.children.set(node, list);
    return list;
  }
  childNodes(node) {
    const list = this.children.get(node);
    if (list === void 0) return Array.from(node.childNodes);
    if (list.snapshot !== null) return list.snapshot;
    const result = [];
    for (let child = list.first; child !== null; child = this.links.get(child).next)
      result.push(child);
    return list.snapshot = result;
  }
  child(node, key) {
    const list = this.children.get(node);
    return list === void 0 ? node[key] : key === "firstChild" ? list.first : list.last;
  }
  parent(node) {
    return this.parents.has(node) ? this.parents.get(node) : node.parentNode;
  }
  siblings(node, direction, elements) {
    const parent = this.parent(node);
    if (parent === null) return null;
    if (!this.children.has(parent)) {
      if (elements)
        return direction > 0 ? node.nextElementSibling : node.previousElementSibling;
      return direction > 0 ? node.nextSibling : node.previousSibling;
    }
    let current = node;
    while (true) {
      const link = this.links.get(current);
      const next = direction > 0 ? link.next : link.previous;
      if (next === null || !elements || next.nodeType === 1) return next;
      current = next;
    }
  }
  root(node, composed = false) {
    let parent;
    while ((parent = this.parent(node) ?? (composed && node.nodeType === 11 ? node.host ?? null : null)) !== null)
      node = parent;
    return node;
  }
  contains(node, other) {
    while (other !== null) {
      if (other === node) return true;
      other = this.parent(other);
    }
    return false;
  }
  collection(nodes) {
    return Object.assign(nodes, {
      item: (index) => nodes[index] ?? null,
      namedItem: (name) => nodes.find(
        (node) => node.nodeType === 1 && (this.get(node, "id") === name || this.get(node, "name") === name)
      ) ?? null
    });
  }
  inertDocument(node) {
    const owner = node.nodeType === 9 ? node : node.ownerDocument;
    let inert = this.documents.get(owner);
    if (inert === void 0) {
      inert = owner.implementation.createHTMLDocument("");
      this.documents.set(owner, inert);
    }
    return inert;
  }
  /** Native reflection/coercion runs in a document with no custom registry. */
  state(node) {
    let state = this.states.get(node);
    if (state !== void 0) return state;
    const doc = this.inertDocument(node);
    if (node.namespaceURI === "http://www.w3.org/1999/xhtml" && (node.localName === "input" || node.localName === "textarea" || node.localName === "option") && !node.hasAttribute("is")) {
      state = doc.importNode(node, false);
      if (node.localName !== "input") state.textContent = node.textContent;
      if (node.localName === "option")
        state.selected = node.selected;
    } else {
      state = doc.createElementNS(
        node.namespaceURI,
        node.prefix ? `${node.prefix}:${node.localName}` : node.localName
      );
      for (const attr of Array.from(node.attributes))
        state.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    }
    if (node.localName === "video" || node.localName === "audio")
      state.muted = node.muted;
    this.states.set(node, state);
    return state;
  }
  /** Cold selector/form reads use an inert projection and map results back. */
  projection(node, ancestors = false) {
    const originalRoot = ancestors ? this.root(node) : node;
    const cached = this.projections.get(originalRoot);
    if (cached !== void 0) return { ...cached, node: cached.copies.get(node) };
    const doc = this.inertDocument(node);
    const originals = /* @__PURE__ */ new Map();
    const copies = /* @__PURE__ */ new Map();
    let target;
    const project = (original) => {
      let copy;
      switch (original.nodeType) {
        case 1: {
          const state = this.state(original);
          copy = doc.importNode(state, false);
          break;
        }
        case 3:
          copy = doc.createTextNode(this.get(original, "nodeValue"));
          break;
        case 8:
          copy = doc.createComment(this.get(original, "nodeValue"));
          break;
        case 9: {
          const document = doc.implementation.createHTMLDocument("");
          document.replaceChildren();
          copy = document;
          break;
        }
        default:
          copy = doc.createDocumentFragment();
          break;
      }
      originals.set(copy, original);
      copies.set(original, copy);
      if (original === node) target = copy;
      const isTemplate = original.nodeType === 1 && original.localName === "template" && "content" in original;
      const sourceParent = isTemplate ? original.content : original;
      const copyParent = isTemplate ? copy.content : copy;
      for (const child of this.childNodes(sourceParent)) {
        if (child.nodeType !== 10) copyParent.appendChild(project(child));
      }
      if (original.nodeType === 1 && original.localName === "option")
        copy.selected = this.state(original).selected;
      const values = this.values.get(original);
      if (values !== void 0 && copy.nodeType === 1) {
        for (const key of ["value", "checked", "selected", "selectedIndex"]) {
          if (values.has(key)) Reflect.set(copy, key, values.get(key));
        }
      }
      return copy;
    };
    project(originalRoot);
    const projection = { root: originalRoot, originals, copies };
    this.projections.set(originalRoot, projection);
    return { ...projection, node: target };
  }
  textContent(node) {
    if (node.nodeType === 9 || node.nodeType === 10) return null;
    if (node.nodeType === 3 || node.nodeType === 8) return this.get(node, "nodeValue");
    let text = "";
    for (const child of this.childNodes(node)) {
      if (child.nodeType !== 8) text += this.textContent(child) ?? "";
    }
    return text;
  }
  get(node, key) {
    if (this.ended) {
      const value2 = Reflect.get(node, key, node);
      return typeof value2 === "function" ? value2.bind(node) : value2;
    }
    const values = this.values.get(node);
    if ((node.nodeType === 3 || node.nodeType === 8) && (key === "data" || key === "textContent"))
      key = "nodeValue";
    if (values?.has(key)) return values.get(key);
    if (key === "length" && (node.nodeType === 3 || node.nodeType === 8))
      return this.get(node, "nodeValue").length;
    switch (key) {
      case "parentNode":
        return this.parent(node);
      case "parentElement": {
        const parent = this.parent(node);
        return parent?.nodeType === 1 ? parent : null;
      }
      case "firstChild":
      case "lastChild":
        return this.child(node, key);
      case "nextSibling":
        return this.siblings(node, 1, false);
      case "previousSibling":
        return this.siblings(node, -1, false);
      case "nextElementSibling":
        return this.siblings(node, 1, true);
      case "previousElementSibling":
        return this.siblings(node, -1, true);
      case "firstElementChild":
        return this.childNodes(node).find((child) => child.nodeType === 1) ?? null;
      case "lastElementChild":
        return this.childNodes(node).filter((child) => child.nodeType === 1).at(-1) ?? null;
      case "childNodes":
        return this.collection(this.childNodes(node).slice());
      case "children":
        return this.collection(this.childNodes(node).filter((child) => child.nodeType === 1));
      case "childElementCount":
        return this.childNodes(node).filter((child) => child.nodeType === 1).length;
      case "isConnected":
        return this.root(node, true).nodeType === 9;
      case "textContent":
        return this.textContent(node);
      case "innerHTML":
      case "outerHTML":
        return Reflect.get(this.projection(node).node, key);
      case "style":
        return this.style(node);
      case "classList":
        return this.classList(node);
      case "attributes":
        return this.state(node).attributes;
      case "options":
      case "selectedOptions":
      case "elements": {
        const projected = this.projection(node, key === "elements");
        const options = Reflect.get(projected.node, key);
        return this.collection(Array.from(options, (option) => projected.originals.get(option)));
      }
      case "selectedIndex":
        return Reflect.get(this.projection(node).node, key);
      case "form": {
        const projected = this.projection(node, true);
        const form = Reflect.get(projected.node, key);
        return form === null ? null : projected.originals.get(form) ?? null;
      }
    }
    const value = Reflect.get(node, key, node);
    if (typeof value === "function") return (...args) => this.call(node, key, args);
    if (node.nodeType === 1 && typeof key === "string" && (PROJECTED_PROPERTIES.has(key) || key.startsWith("aria")) && key in this.state(node) && (value === null || typeof value !== "object")) {
      if (key === "value" && (node.localName === "select" || node.localName === "option"))
        return Reflect.get(this.projection(node).node, key);
      return Reflect.get(this.state(node), key);
    }
    return value;
  }
  value(node, key, value) {
    let values = this.values.get(node);
    if (values === void 0) this.values.set(node, values = /* @__PURE__ */ new Map());
    values.set(key, value);
  }
  set(node, key, value) {
    if (this.ended || typeof key === "symbol" || typeof key === "string" && (key.startsWith("__oct") || EAGER_METADATA.has(key))) {
      Reflect.set(node, key, value, node);
      return;
    }
    const radioWrite = node.nodeType === 1 && node.localName === "input" && (key === "checked" || key === "defaultChecked") && this.state(node).type === "radio";
    if (!radioWrite) this.projections.clear();
    if ((node.nodeType === 3 || node.nodeType === 8) && (key === "data" || key === "textContent" || key === "nodeValue")) {
      key = "nodeValue";
      value = value === null || value === void 0 ? "" : String(value);
    }
    if ((key === "innerHTML" || key === "textContent") && this.isFresh(node) && !this.children.has(node) && !(node.localName === "template" && this.children.has(node.content))) {
      Reflect.set(node, key, value, node);
      this.states.delete(node);
      this.created(node);
      return;
    }
    if (key === "textContent" && node.nodeType !== 3 && node.nodeType !== 8) {
      const text = value === null || value === void 0 ? "" : String(value);
      const children = text === "" ? [] : [this.created(node.ownerDocument.createTextNode(text))];
      this.replaceChildren(node, children);
      return;
    }
    if (key === "innerHTML") {
      const element = node;
      const shell = this.inertDocument(node).createElementNS(
        element.namespaceURI,
        element.prefix ? `${element.prefix}:${element.localName}` : element.localName
      );
      shell.innerHTML = value;
      const isTemplate = element.localName === "template" && "content" in element;
      const parsed = isTemplate ? shell.content : shell;
      const children = Array.from(
        parsed.childNodes,
        (child) => this.created(node.ownerDocument.importNode(child, true))
      );
      this.replaceChildren(isTemplate ? element.content : node, children);
      return;
    }
    if (key === "style") {
      this.style(node).cssText = value;
      return;
    }
    if (key === "scrollTop" || key === "scrollLeft") {
      this.write(node, () => {
        Reflect.set(node, key, value, node);
      });
      return;
    }
    if (node.nodeType === 1 && this.setFormProperty(node, key, value)) return;
    if (this.isFresh(node)) {
      Reflect.set(node, key, value, node);
      this.states.delete(node);
      return;
    }
    if (node.nodeType === 1 && typeof key === "string") {
      const state = this.state(node);
      if (key in state && !key.startsWith("on") && !key.startsWith("_") && !key.startsWith("$")) {
        Reflect.set(state, key, value);
        if (key === "selected" || key === "selectedIndex" || !PROJECTED_PROPERTIES.has(key) && !key.startsWith("aria"))
          this.value(node, key, Reflect.get(state, key));
      } else this.value(node, key, value);
    } else this.value(node, key, value);
    this.enqueue(() => {
      Reflect.set(node, key, value, node);
    });
  }
  setFormProperty(node, key, value) {
    if (node.localName === "input" && (key === "checked" || key === "defaultChecked") && this.state(node).type === "radio") {
      const projected = this.projection(node, true);
      const target = projected.node;
      Reflect.set(target, key, value);
      for (const [copy, original] of projected.originals) {
        if (copy.nodeType !== 1 || copy.localName !== "input") continue;
        const input = copy;
        if (input !== target && (input.type !== "radio" || input.name !== target.name || input.form !== target.form))
          continue;
        this.states.set(original, this.inertDocument(original).importNode(input, false));
        this.values.get(original)?.delete("checked");
      }
      this.projections.clear();
      this.projections.set(projected.root, projected);
      this.enqueue(() => {
        Reflect.set(node, key, value, node);
      });
      return true;
    }
    if (node.localName === "textarea" && key === "defaultValue") {
      const state = this.state(node);
      state.defaultValue = value;
      this.replaceChildren(
        node,
        state.defaultValue === "" ? [] : [this.created(node.ownerDocument.createTextNode(state.defaultValue))]
      );
      return true;
    }
    let select = node;
    if (node.localName === "option" && key === "selected") {
      while (select !== null && select.localName !== "select")
        select = this.parent(select);
    } else if (node.localName !== "select" || key !== "value" && key !== "selectedIndex")
      return false;
    if (select === null) return false;
    if (node !== select && this.get(select, "multiple")) {
      const state = this.state(node);
      state.selected = value;
      this.value(node, "selected", state.selected);
    } else {
      const projected = this.projection(select);
      let target = projected.node;
      if (node !== select)
        for (const [copy, original] of projected.originals) {
          if (original === node) {
            target = copy;
            break;
          }
        }
      Reflect.set(target, key, value);
      for (const option of Array.from(projected.node.options)) {
        const original = projected.originals.get(option);
        this.state(original).selected = option.selected;
        this.value(original, "selected", option.selected);
      }
    }
    this.enqueue(() => {
      Reflect.set(node, key, value, node);
    });
    return true;
  }
  style(node) {
    let style = this.styles.get(node);
    if (style !== void 0) return style;
    const actual = node.style;
    style = new Proxy(actual, {
      get: (_, key) => {
        const state = this.state(node).style;
        if (key === "setProperty" || key === "removeProperty")
          return (...args) => {
            const result = Reflect.apply(Reflect.get(state, key), state, args);
            this.write(node, () => {
              Reflect.apply(Reflect.get(actual, key), actual, args);
            });
            return result;
          };
        const value = Reflect.get(state, key, state);
        return typeof value === "function" ? value.bind(state) : value;
      },
      set: (_, key, value) => {
        Reflect.set(this.state(node).style, key, value);
        this.write(node, () => {
          Reflect.set(actual, key, value);
        });
        return true;
      }
    });
    this.styles.set(node, style);
    return style;
  }
  classList(node) {
    return new Proxy(node.classList, {
      get: (_, key) => {
        const list = this.state(node).classList;
        const value = Reflect.get(list, key, list);
        if (key === "add" || key === "remove" || key === "toggle" || key === "replace")
          return (...args) => {
            const result = Reflect.apply(value, list, args);
            this.write(node, () => {
              Reflect.apply(Reflect.get(node.classList, key), node.classList, args);
            });
            return result;
          };
        return typeof value === "function" ? value.bind(list) : value;
      },
      set: (_, key, value) => {
        Reflect.set(this.state(node).classList, key, value);
        this.write(node, () => {
          Reflect.set(node.classList, key, value);
        });
        return true;
      }
    });
  }
  write(node, action) {
    this.projections.clear();
    if (this.isFresh(node)) action();
    else this.enqueue(action);
  }
  remove(parent, child) {
    const list = this.childList(parent);
    if (this.parent(child) !== parent)
      throw new DOMException("The node is not a child of this parent.", "NotFoundError");
    const link = this.links.get(child);
    if (link.previous === null) list.first = link.next;
    else this.links.get(link.previous).next = link.next;
    if (link.next === null) list.last = link.previous;
    else this.links.get(link.next).previous = link.previous;
    list.length--;
    list.snapshot = null;
    this.links.delete(child);
    this.parents.set(child, null);
    this.projections.clear();
  }
  insert(parent, child, anchor, move = false) {
    if (child === anchor) return;
    if (anchor !== null && this.parent(anchor) !== parent)
      throw new DOMException("The anchor is not a child of this parent.", "NotFoundError");
    if (this.contains(child, parent))
      throw new DOMException("The insertion would create a cycle.", "HierarchyRequestError");
    if (child.nodeType === 11) {
      for (const item of this.childNodes(child).slice()) this.insert(parent, item, anchor);
      return;
    }
    const oldParent = this.parent(child);
    const eager = this.isFresh(parent) && this.isFresh(child) && !this.parents.has(child) && !this.children.has(parent) && (oldParent === null || !this.children.has(oldParent)) && (anchor === null || anchor.parentNode === parent);
    if (eager) {
      parent.insertBefore(child, anchor);
      this.projections.clear();
      return;
    }
    if (oldParent !== null) this.remove(oldParent, child);
    const list = this.childList(parent);
    const previous = anchor === null ? list.last : this.links.get(anchor).previous;
    this.links.set(child, { previous, next: anchor });
    if (previous === null) list.first = child;
    else this.links.get(previous).next = child;
    if (anchor === null) list.last = child;
    else this.links.get(anchor).previous = child;
    list.length++;
    list.snapshot = null;
    this.parents.set(child, parent);
    this.projections.clear();
    this.enqueue(() => {
      if (move)
        parent.moveBefore(
          child,
          anchor
        );
      else parent.insertBefore(child, anchor);
    });
  }
  replaceChildren(node, children) {
    const list = this.childList(node);
    for (let child = list.first; child !== null; ) {
      const next = this.links.get(child).next;
      this.parents.set(child, null);
      this.links.delete(child);
      child = next;
    }
    list.first = list.last = null;
    list.length = 0;
    list.snapshot = null;
    this.projections.clear();
    this.enqueue(() => {
      node.textContent = "";
    });
    for (const child of children) this.insert(node, child, null);
  }
  /** Clear a shared-parent range once while retaining both live anchors. */
  clearBetween(start, end) {
    const parent = this.parent(start);
    if (parent === null || this.parent(end) !== parent)
      throw new DOMException("Range anchors have different parents.", "NotFoundError");
    this.childList(parent);
    let child = this.siblings(start, 1, false);
    while (child !== null && child !== end) child = this.siblings(child, 1, false);
    if (child !== end)
      throw new DOMException("The end anchor precedes the start.", "NotFoundError");
    child = this.siblings(start, 1, false);
    while (child !== null && child !== end) {
      const next = this.siblings(child, 1, false);
      this.remove(parent, child);
      child = next;
    }
    this.enqueue(() => {
      if (start.parentNode !== parent || end.parentNode !== parent) return;
      const range = parent.ownerDocument.createRange();
      range.setStartAfter(start);
      range.setEndBefore(end);
      range.deleteContents();
    });
  }
  nodes(node, args) {
    return args.map(
      (value) => typeof value === "object" && value !== null && "nodeType" in value ? value : this.created(node.ownerDocument.createTextNode(String(value)))
    );
  }
  call(node, key, args) {
    switch (key) {
      case "hasChildNodes":
        return this.childNodes(node).length > 0;
      case "contains":
        return this.contains(node, args[0]);
      case "getRootNode":
        return this.root(node, args[0]?.composed);
      case "compareDocumentPosition": {
        const other = args[0];
        if (node === other) return 0;
        if (this.contains(node, other)) return 20;
        if (this.contains(other, node)) return 10;
        if (this.root(node) !== this.root(other)) return node.compareDocumentPosition(other) | 1;
        const path = (current) => {
          const result = [current];
          let parent;
          while ((parent = this.parent(current)) !== null) result.unshift(current = parent);
          return result;
        };
        const a = path(node), b = path(other);
        let index = 0;
        while (a[index] === b[index]) index++;
        const children = this.childNodes(a[index - 1]);
        return children.indexOf(a[index]) < children.indexOf(b[index]) ? 4 : 2;
      }
      case "appendChild":
        this.insert(node, args[0], null);
        return args[0];
      case "insertBefore":
        this.insert(node, args[0], args[1]);
        return args[0];
      case "moveBefore":
        this.insert(node, args[0], args[1], true);
        return;
      case "removeChild": {
        const child = args[0];
        if (this.isFresh(node) && this.isFresh(child) && !this.children.has(node)) {
          node.removeChild(child);
          this.projections.clear();
        } else {
          this.remove(node, child);
          this.enqueue(() => {
            if (child.parentNode === node) node.removeChild(child);
          });
        }
        return child;
      }
      case "replaceChild": {
        const child = args[0], old = args[1];
        if (child !== old) {
          this.insert(node, child, old);
          this.call(node, "removeChild", [old]);
        }
        return old;
      }
      case "replaceChildren":
        this.replaceChildren(node, this.nodes(node, args));
        return;
      case "append":
        for (const child of this.nodes(node, args)) this.insert(node, child, null);
        return;
      case "prepend": {
        const anchor = this.childNodes(node)[0] ?? null;
        for (const child of this.nodes(node, args)) this.insert(node, child, anchor);
        return;
      }
      case "remove": {
        const parent = this.parent(node);
        if (parent !== null) this.call(parent, "removeChild", [node]);
        return;
      }
      case "before":
      case "after":
      case "replaceWith": {
        const parent = this.parent(node);
        if (parent === null) return;
        const anchor = key === "after" ? this.siblings(node, 1, false) : node;
        for (const child of this.nodes(node, args)) this.insert(parent, child, anchor);
        if (key === "replaceWith") this.call(parent, "removeChild", [node]);
        return;
      }
      case "getAttribute":
      case "getAttributeNS":
      case "getAttributeNames":
      case "hasAttribute":
      case "hasAttributeNS":
      case "hasAttributes": {
        const state = this.states.get(node) ?? node;
        return Reflect.apply(Reflect.get(state, key), state, args);
      }
      case "setAttribute":
      case "setAttributeNS":
      case "removeAttribute":
      case "removeAttributeNS":
      case "toggleAttribute": {
        const state = this.state(node);
        const result = Reflect.apply(Reflect.get(state, key), state, args);
        this.write(node, () => {
          Reflect.apply(Reflect.get(node, key), node, args);
        });
        return result;
      }
      case "getElementsByTagName":
      case "getElementsByTagNameNS":
      case "getElementsByClassName":
      case "getElementsByName":
      case "getElementById": {
        const result = [];
        const name = String(args[key === "getElementsByTagNameNS" ? 1 : 0]);
        const tokens = name.trim().split(/\s+/);
        const visit = (parent) => {
          for (const child of this.childNodes(parent)) {
            if (child.nodeType !== 1) continue;
            const element = child;
            let match;
            if (key === "getElementsByClassName")
              match = name.trim() !== "" && tokens.every((token) => this.state(element).classList.contains(token));
            else if (key === "getElementsByName")
              match = this.state(element).getAttribute("name") === name;
            else if (key === "getElementById")
              match = name !== "" && this.get(element, "id") === name;
            else if (key === "getElementsByTagNameNS")
              match = (args[0] === "*" || (args[0] || null) === element.namespaceURI) && (name === "*" || name === element.localName);
            else
              match = name === "*" || (element.namespaceURI === "http://www.w3.org/1999/xhtml" ? name.toLowerCase() === element.localName : name === element.tagName);
            if (match) result.push(element);
            visit(element);
          }
        };
        visit(node);
        return key === "getElementById" ? result[0] ?? null : this.collection(result);
      }
      case "querySelector":
      case "querySelectorAll":
      case "matches":
      case "closest": {
        const projected = this.projection(node, key === "matches" || key === "closest");
        const result = Reflect.apply(Reflect.get(projected.node, key), projected.node, args);
        if (key === "matches") return result;
        if (key === "querySelectorAll")
          return this.collection(
            Array.from(result, (item) => projected.originals.get(item))
          );
        return result === null ? null : projected.originals.get(result) ?? null;
      }
      case "addEventListener":
      case "removeEventListener":
      case "focus":
      case "blur":
      case "setSelectionRange":
      case "setRangeText":
      case "scrollTo":
      case "scrollBy":
      case "scrollIntoView":
        this.write(node, () => {
          Reflect.apply(Reflect.get(node, key), node, args);
        });
        return;
      case "createElement":
      case "createElementNS":
      case "createTextNode":
      case "createComment":
      case "createDocumentFragment":
      case "importNode":
      case "cloneNode":
        return this.created(Reflect.apply(Reflect.get(node, key), node, args));
    }
    return Reflect.apply(Reflect.get(node, key), node, args);
  }
}
export {
  DOMStage
};
