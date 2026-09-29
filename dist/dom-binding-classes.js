import { normalizeClass } from "./class-names.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const receipts = /* @__PURE__ */ new WeakMap();
function tokens(value) {
  return new Set(value.match(/[^\t\n\f\r ]+/g));
}
function __bindingClassReceipt(baseline, groups) {
  return JSON.stringify([normalizeClass(baseline), groups.map(normalizeClass)]);
}
function readReceipt(node, name, initialReceipt) {
  let value;
  try {
    value = JSON.parse(initialReceipt ?? node.getAttribute(name) ?? "null");
  } catch {
    throw new Error(process.env.NODE_ENV !== "production" ? "DOM class groups require a valid compiler-issued class receipt." : __octaneNoArgError(271));
  }
  if (!name.startsWith("data-octane-class-") || !Array.isArray(value) || value.length !== 2 || typeof value[0] !== "string" || !Array.isArray(value[1]) || value[1].some((group) => typeof group !== "string"))
    throw new Error(process.env.NODE_ENV !== "production" ? "DOM class groups require a valid compiler-issued class receipt." : __octaneNoArgError(271));
  const counts = /* @__PURE__ */ new Map();
  for (const contribution of [value[0], ...value[1]])
    for (const token of tokens(contribution))
      counts.set(token, (counts.get(token) ?? 0) + 1);
  return { name, baseline: value[0], values: value[1], counts, active: /* @__PURE__ */ new Set() };
}
function createBindingClassGroup(node, name, index, initialReceipt) {
  let receipt = receipts.get(node);
  if (receipt !== void 0 && receipt.name !== name)
    throw new Error(process.env.NODE_ENV !== "production" ? "A DOM host cannot mix class groups from different binding views." : __octaneNoArgError(272));
  receipt ??= readReceipt(node, name, initialReceipt);
  if (!Number.isInteger(index) || index < 0 || index >= receipt.values.length)
    throw new Error(process.env.NODE_ENV !== "production" ? "A DOM class group does not match its compiler-issued receipt." : __octaneNoArgError(273));
  if (receipt.active.has(index))
    throw new Error(process.env.NODE_ENV !== "production" ? "This DOM class group already has a binding." : __octaneNoArgError(274));
  receipt.active.add(index);
  receipts.set(node, receipt);
  let disposed = false;
  let committed = false;
  let revision = 0;
  let retiring = /* @__PURE__ */ new Set();
  const state = receipt;
  function publish(value, next) {
    const old = tokens(state.values[index]);
    const remove = [];
    const add = [];
    for (const token of old) {
      if (next.has(token))
        continue;
      const count = state.counts.get(token) - 1;
      if (count === 0) {
        state.counts.delete(token);
        remove.push(token);
      } else
        state.counts.set(token, count);
    }
    for (const token of next) {
      if (old.has(token))
        continue;
      const count = state.counts.get(token) ?? 0;
      state.counts.set(token, count + 1);
      if (count === 0)
        add.push(token);
    }
    state.values[index] = value;
    revision++;
    retiring = new Set(remove);
    for (const token of remove) {
      node.classList.remove(token);
      retiring.delete(token);
      if (disposed)
        return;
    }
    for (const token of add) {
      node.classList.add(token);
      if (disposed)
        return;
    }
    node.setAttribute(name, JSON.stringify([state.baseline, state.values]));
  }
  return {
    prepare(value) {
      if (disposed)
        throw new Error(process.env.NODE_ENV !== "production" ? "Cannot prepare a disposed DOM class group." : __octaneNoArgError(275));
      const preparedAt = revision;
      const next = value === state.values[index] ? null : tokens(value);
      return {
        commit() {
          if (disposed)
            return;
          if (preparedAt !== revision)
            throw new Error(process.env.NODE_ENV !== "production" ? "Cannot commit an outdated DOM class group preparation." : __octaneNoArgError(276));
          committed = true;
          if (next !== null)
            publish(value, next);
        }
      };
    },
    dispose(preservePresentation) {
      if (disposed)
        return;
      disposed = true;
      if (!committed || preservePresentation) {
        state.active.delete(index);
        if (state.active.size === 0)
          receipts.delete(node);
        return;
      }
      const old = tokens(state.values[index]);
      state.values[index] = "";
      revision++;
      const remove = /* @__PURE__ */ new Set();
      for (const token of old) {
        const count = state.counts.get(token) - 1;
        if (count === 0) {
          state.counts.delete(token);
          remove.add(token);
        } else
          state.counts.set(token, count);
      }
      for (const token of retiring)
        if (!state.counts.has(token))
          remove.add(token);
      retiring.clear();
      let failed = false;
      let failure;
      const attempt = (write) => {
        try {
          write();
        } catch (error) {
          if (!failed) {
            failed = true;
            failure = error;
          }
        }
      };
      for (const token of remove)
        attempt(() => node.classList.remove(token));
      attempt(() => node.setAttribute(name, JSON.stringify([state.baseline, state.values])));
      state.active.delete(index);
      if (state.active.size === 0)
        receipts.delete(node);
      if (failed)
        throw failure;
    }
  };
}
export {
  __bindingClassReceipt,
  createBindingClassGroup
};
