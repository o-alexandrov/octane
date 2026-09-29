const __octaneDev = process.env.NODE_ENV !== "production";
import { cssStyleValue, hyphenateStyleName } from "./style-values.js";
import { __writeBinding } from "./dom-bindings.js";
import { captureSignalOwner, currentSignalOwner } from "./signals/owner-context.js";
import { beginNativeWriteGuard, endNativeWriteGuard, forwardNativeTransitionConsumer, readNativeDomStyle, setNativeReadObserver } from "./signals/read-protocol.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function __prepareBindingSources(reads, subscriptions, notify, active, run) {
  const previous = new Map(subscriptions);
  const acquired = /* @__PURE__ */ new Map();
  let accepted = false;
  let retired = false;
  let invalid = false;
  try {
    for (const source of reads.keys()) {
      if (previous.has(source))
        continue;
      let live = true;
      const stop = run(() => source.subscribe(forwardNativeTransitionConsumer(notify, () => {
        if (!live || retired || !active())
          return;
        if (!accepted)
          invalid = true;
        else
          notify();
      })));
      acquired.set(source, () => {
        live = false;
        stop();
      });
    }
  } catch (error) {
    for (const stop of acquired.values())
      stop();
    throw error;
  }
  return {
    validate: () => !retired && !invalid && active() && subscriptions.size === previous.size && [...previous].every(([source, stop]) => subscriptions.get(source) === stop) && [...reads].every(([source, version]) => source.getVersion() === version),
    commit() {
      if (accepted || retired || !active())
        return;
      accepted = true;
      for (const [source, stop] of acquired)
        subscriptions.set(source, stop);
      for (const [source, stop] of previous) {
        if (reads.has(source))
          continue;
        subscriptions.delete(source);
        stop();
      }
    },
    discard() {
      if (accepted || retired)
        return;
      retired = true;
      for (const stop of acquired.values())
        stop();
    }
  };
}
function __normalizeBindingStyle(value) {
  if (value == null || value === false || value === "")
    return null;
  if (typeof value === "string")
    return value;
  if (typeof value !== "object")
    throw new TypeError(__octaneDev ? "A whole-style DOM binding requires a style object, CSS text or null." : __octaneNoArgError(311));
  const result = /* @__PURE__ */ Object.create(null);
  for (const name in value) {
    const property = value[name];
    result[name] = property == null || typeof property === "boolean" ? null : cssStyleValue(name, property);
  }
  return result;
}
function __createBindingStyles() {
  const owner = currentSignalOwner();
  const run = owner === null ? (callback) => callback() : captureSignalOwner(owner);
  return {
    connect(node, notify, restoreStyles = false) {
      let raw;
      let disposed = false;
      const subscriptions = /* @__PURE__ */ new Map();
      let previous = null;
      let firstWrite = true;
      const style = node.style;
      let restorations;
      let baseline;
      let expected;
      let probe;
      const snapshotDOM = () => {
        const result = /* @__PURE__ */ Object.create(null);
        for (let i = 0; i < style.length; i++) {
          const name = style.item(i);
          result[name] = style.getPropertyValue(name) + (style.getPropertyPriority(name) ? " !important" : "");
        }
        return result;
      };
      previous = snapshotDOM();
      const get = () => {
        if (disposed)
          return null;
        const reads = /* @__PURE__ */ new Map();
        const previousObserver = setNativeReadObserver((source, version) => reads.set(source, version));
        const guard = beginNativeWriteGuard();
        let value;
        try {
          value = run(() => __normalizeBindingStyle(readNativeDomStyle(raw)));
        } finally {
          endNativeWriteGuard(guard);
          setNativeReadObserver(previousObserver);
        }
        for (const [source, stop] of subscriptions) {
          if (reads.has(source))
            continue;
          subscriptions.delete(source);
          stop();
        }
        for (const [source, version] of reads) {
          if (disposed)
            break;
          if (!subscriptions.has(source)) {
            let active = true;
            const stop = run(() => source.subscribe(forwardNativeTransitionConsumer(notify, () => {
              if (active && !disposed)
                notify();
            })));
            if (typeof stop !== "function")
              throw new TypeError(__octaneDev ? "A DOM style subscription must return cleanup." : __octaneNoArgError(312));
            const disposeSource = () => {
              active = false;
              stop();
            };
            if (disposed)
              disposeSource();
            else
              subscriptions.set(source, disposeSource);
          }
          if (!disposed && source.getVersion() !== version)
            notify();
        }
        return value;
      };
      const writeProperty = (name, value) => {
        if (disposed)
          return;
        name = hyphenateStyleName(name);
        const operation = [0, "styleProperty", name];
        if (restoreStyles) {
          if (!baseline) {
            baseline = node.ownerDocument.createElement("i");
            expected = node.ownerDocument.createElement("i");
            baseline.style.cssText = expected.style.cssText = style.cssText;
            restorations = /* @__PURE__ */ new Set();
          }
          restorations.add(name);
          __writeBinding(expected, operation, value);
        }
        __writeBinding(node, operation, value);
      };
      const restore = () => {
        if (!restorations)
          return;
        const owned = [...restorations].filter((name) => style.getPropertyValue(name) === expected.style.getPropertyValue(name) && style.getPropertyPriority(name) === expected.style.getPropertyPriority(name));
        let failed = false;
        let failure;
        for (const name of owned) {
          try {
            const value = baseline.style.getPropertyValue(name);
            if (value === "")
              style.removeProperty(name);
            else
              style.setProperty(name, value, baseline.style.getPropertyPriority(name));
          } catch (error) {
            if (!failed) {
              failed = true;
              failure = error;
            }
          }
        }
        if (failed)
          throw failure;
      };
      return {
        get,
        preview(value) {
          const reads = /* @__PURE__ */ new Map();
          const previousObserver = setNativeReadObserver((source, version) => {
            if (!reads.has(source))
              reads.set(source, version);
          });
          const guard = beginNativeWriteGuard();
          let projected;
          try {
            projected = run(() => __normalizeBindingStyle(readNativeDomStyle(value)));
          } finally {
            endNativeWriteGuard(guard);
            setNativeReadObserver(previousObserver);
          }
          const prepared = __prepareBindingSources(reads, subscriptions, notify, () => !disposed, run);
          return {
            value: projected,
            validate: prepared.validate,
            discard: prepared.discard,
            commit() {
              raw = value;
              prepared.commit();
            }
          };
        },
        read(value) {
          raw = value;
          return get();
        },
        write(value) {
          if (disposed)
            return;
          let next = value;
          let old = typeof previous === "string" ? snapshotDOM() : previous;
          const writeAll = firstWrite || typeof previous === "string" || typeof value === "string";
          if (typeof next === "string") {
            probe ??= node.ownerDocument.createElement("i");
            probe.style.cssText = next;
            const parsed = /* @__PURE__ */ Object.create(null);
            for (let i = 0; i < probe.style.length; i++) {
              const name = probe.style.item(i);
              parsed[name] = probe.style.getPropertyValue(name) + (probe.style.getPropertyPriority(name) ? " !important" : "");
            }
            next = parsed;
            old = snapshotDOM();
          }
          previous = typeof value === "string" ? value : next;
          const initialNames = firstWrite && next && typeof next === "object" ? new Set(Object.keys(next).map(hyphenateStyleName)) : null;
          firstWrite = false;
          if (old && typeof old === "object") {
            for (const name in old)
              if (next === null || (initialNames ? !initialNames.has(name) : !(name in next)))
                writeProperty(name, null);
          }
          if (next && typeof next === "object") {
            for (const name in next)
              if (writeAll || old === null || typeof old !== "object" || next[name] !== old[name])
                writeProperty(name, next[name]);
          }
        },
        dispose(preservePresentation) {
          if (disposed)
            return;
          disposed = true;
          raw = previous = null;
          let failed = false;
          let failure;
          for (const stop of [
            ...subscriptions.values(),
            ...preservePresentation ? [] : [restore]
          ]) {
            try {
              stop();
            } catch (error) {
              if (!failed) {
                failed = true;
                failure = error;
              }
            }
          }
          subscriptions.clear();
          restorations?.clear();
          probe = baseline = expected = void 0;
          if (failed)
            throw failure;
        }
      };
    }
  };
}
export {
  __createBindingStyles,
  __normalizeBindingStyle,
  __prepareBindingSources
};
