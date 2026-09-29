const __octaneDev = process.env.NODE_ENV !== "production";
import { __normalizeBinding } from "./dom-bindings.js";
import { __createBindingStyles, __prepareBindingSources } from "./dom-binding-styles.js";
import { captureSignalOwner, currentSignalOwner } from "./signals/owner-context.js";
import { beginNativeWriteGuard, endNativeWriteGuard, forwardNativeTransitionConsumer, setNativeReadObserver } from "./signals/read-protocol.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function __createBindingProjections() {
  const owner = currentSignalOwner();
  const run = owner === null ? (callback) => callback() : captureSignalOwner(owner);
  const styles = __createBindingStyles();
  return {
    connect(group, bindings, nodes, notify, restoreStyles = false) {
      let compute;
      let disposed = false;
      const subscriptions = /* @__PURE__ */ new Map();
      const styleConnections = /* @__PURE__ */ new Map();
      const get = () => {
        if (disposed)
          return [];
        const reads = /* @__PURE__ */ new Map();
        const previousObserver = setNativeReadObserver((source, version) => {
          if (!reads.has(source))
            reads.set(source, version);
          previousObserver?.(source, version);
        });
        const guard = beginNativeWriteGuard();
        const values = [];
        try {
          run(() => {
            const result = compute();
            for (const [index, field] of group) {
              if (disposed)
                break;
              const binding = bindings[index];
              const value = result?.[field];
              if (binding[1] === "styleObject") {
                let style = styleConnections.get(index);
                if (!style) {
                  style = styles.connect(nodes[binding[0]], notify, restoreStyles);
                  styleConnections.set(index, style);
                }
                values[index] = style.read(value);
              } else
                values[index] = __normalizeBinding(binding, value);
            }
          });
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
              throw new TypeError(__octaneDev ? "A DOM projection subscription must return cleanup." : __octaneNoArgError(304));
            const cleanup = () => {
              active = false;
              stop();
            };
            if (disposed)
              cleanup();
            else
              subscriptions.set(source, cleanup);
          }
          if (!disposed && source.getVersion() !== version)
            notify();
        }
        return values;
      };
      return {
        group,
        get,
        preview(next) {
          if (typeof next !== "function")
            throw new TypeError(__octaneDev ? "A DOM binding projection group requires a computation." : __octaneNoArgError(305));
          const reads = /* @__PURE__ */ new Map();
          const preparedStyles = [];
          const createdStyles = /* @__PURE__ */ new Map();
          const values = [];
          const previousObserver = setNativeReadObserver((source, version) => {
            if (!reads.has(source))
              reads.set(source, version);
            previousObserver?.(source, version);
          });
          const guard = beginNativeWriteGuard();
          try {
            run(() => {
              const result = next();
              for (const [index, field] of group) {
                const binding = bindings[index];
                const value = result?.[field];
                if (binding[1] === "styleObject") {
                  let style = styleConnections.get(index);
                  if (!style) {
                    style = styles.connect(nodes[binding[0]], notify, restoreStyles);
                    createdStyles.set(index, style);
                  }
                  const prepared2 = style.preview(value);
                  preparedStyles.push(prepared2);
                  values[index] = prepared2.value;
                } else
                  values[index] = __normalizeBinding(binding, value);
              }
            });
          } catch (error) {
            for (const prepared2 of preparedStyles)
              prepared2.discard();
            for (const style of createdStyles.values())
              style.dispose(true);
            throw error;
          } finally {
            endNativeWriteGuard(guard);
            setNativeReadObserver(previousObserver);
          }
          let prepared;
          try {
            prepared = __prepareBindingSources(reads, subscriptions, notify, () => !disposed, run);
          } catch (error) {
            for (const style of preparedStyles)
              style.discard();
            for (const style of createdStyles.values())
              style.dispose(true);
            throw error;
          }
          let accepted = false;
          return {
            value: values,
            validate: () => prepared.validate() && preparedStyles.every((style) => style.validate()),
            commit() {
              accepted = true;
              compute = next;
              for (const [index, style] of createdStyles)
                styleConnections.set(index, style);
              for (const style of preparedStyles)
                style.commit();
              prepared.commit();
            },
            discard() {
              if (accepted)
                return;
              prepared.discard();
              for (const style of preparedStyles)
                style.discard();
              for (const style of createdStyles.values())
                style.dispose(true);
            }
          };
        },
        read(next) {
          if (typeof next !== "function")
            throw new TypeError(__octaneDev ? "A DOM binding projection group requires a computation." : __octaneNoArgError(305));
          compute = next;
          return get();
        },
        writeStyle(index, value) {
          if (!disposed)
            styleConnections.get(index).write(value);
        },
        dispose(preservePresentation) {
          if (disposed)
            return;
          disposed = true;
          compute = void 0;
          let failed = false;
          let failure;
          for (const cleanup of [
            ...subscriptions.values(),
            ...[...styleConnections.values()].map((style) => () => style.dispose(preservePresentation))
          ]) {
            try {
              cleanup();
            } catch (error) {
              if (!failed) {
                failed = true;
                failure = error;
              }
            }
          }
          subscriptions.clear();
          styleConnections.clear();
          if (failed)
            throw failure;
        }
      };
    }
  };
}
export {
  __createBindingProjections
};
