const __octaneDev = process.env.NODE_ENV !== "production";
import { consumeHydrationControl, initializeHydrationControlCapture, snapshotHydrationControl, isRestoredHydrationTextarea } from "../hydration/control-capture.js";
import { hasHydrationControlSignalWriter, registerHydrationControlSignalWriter } from "./early-values.js";
import { isSignalHandle, isWritableSignal } from "./handle-protocol.js";
import { CONTROL_BINDINGS, CONTROL_HANDOFF } from "./control-handoff.js";
import { captureSignalOwner, currentSignalOwner } from "./owner-context.js";
import { forwardNativeTransitionConsumer, NATIVE_TRANSITION_CONSUMER } from "./read-protocol.js";
import { SIGNAL_BINDING_IDENTITY, SIGNAL_BINDING_READ, SIGNAL_BINDING_SUBSCRIBE, SIGNAL_OWNER_RESOLVE } from "./types.js";
import { withoutSignalCandidate } from "./transition-state.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
const RADIO_WRITERS = /* @__PURE__ */ new WeakMap();
function controlString(value) {
  return typeof value === "string" ? value : typeof value === "function" || typeof value === "symbol" ? "" : String(value);
}
function publishRadioInput(input) {
  const root = input.getRootNode();
  const group = input.form !== null ? input.form.elements : root.nodeType === 9 ? root.getElementsByName(input.name) : root.querySelectorAll('input[type="radio"]');
  const edits = [];
  for (let index = 0; index < group.length; index++) {
    const other = group[index];
    if (other.localName !== "input" || other.type !== "radio" || other.name !== input.name || other.form !== input.form || other.getRootNode() !== root)
      continue;
    const write = RADIO_WRITERS.get(other);
    if (write)
      edits.push([write, other.checked]);
  }
  for (const [write, checked] of edits)
    if (!checked)
      write(false);
  for (const [write, checked] of edits)
    if (checked)
      write(true);
}
function __createBindingControls(owner = currentSignalOwner()) {
  const run = owner === null ? (callback) => callback() : captureSignalOwner(owner);
  return {
    claim(element, channel, notify) {
      const control = element;
      if (control?.nodeType !== 1 || channel !== "value" && channel !== "checked" || !["input", "textarea", "select"].includes(control.localName) || channel === "checked" && (control.localName !== "input" || !["checkbox", "radio"].includes(control.type)) || channel === "value" && control.localName === "input" && control.type === "file")
        throw new TypeError(__octaneDev ? "A signal control requires a native value/checked property and a signal." : __octaneNoArgError(116));
      if (CONTROL_BINDINGS.get(control)?.has(channel) || hasHydrationControlSignalWriter(control, channel))
        throw new Error(__octaneDev ? "This control property already has a signal binding. Dispose it before rebinding." : __octaneNoArgError(117));
      let channels = CONTROL_BINDINGS.get(control);
      if (!channels)
        CONTROL_BINDINGS.set(control, channels = /* @__PURE__ */ new Set());
      channels.add(channel);
      let disposed = false;
      let initialized = false;
      let composing = false;
      let raw;
      let handle;
      let active;
      let unsubscribe;
      let stopWriter;
      let generation = 0;
      let revision = 0;
      const read = (value) => run(() => value[SIGNAL_BINDING_READ]());
      const write = (value) => {
        if (disposed || !isWritableSignal(active))
          return;
        const writable = active;
        withoutSignalCandidate(() => run(() => {
          const previous = read(writable);
          if (Object.is(previous, value) || Array.isArray(previous) && Array.isArray(value) && previous.length === value.length && previous.every((item, index) => item === value[index]))
            return;
          writable.set(value);
        }));
      };
      const nativeValue = () => {
        const snapshot = snapshotHydrationControl(control);
        return channel === "checked" ? snapshot.checked : snapshot.selectedValues ?? snapshot.value;
      };
      const input = () => {
        if (disposed)
          return;
        if (channel === "checked" && control.type === "radio" && control.name !== "")
          publishRadioInput(control);
        else
          write(nativeValue());
      };
      const compositionStart = () => {
        composing = true;
      };
      const compositionEnd = () => {
        if (disposed)
          return;
        composing = false;
        input();
        if (!disposed)
          notify();
      };
      const dispose = () => {
        if (disposed)
          return;
        disposed = true;
        generation++;
        raw = void 0;
        active = handle = void 0;
        if (channel === "checked")
          RADIO_WRITERS.delete(control);
        let failed = false;
        let failure;
        const attempt = (stop2) => {
          try {
            stop2?.();
          } catch (error) {
            if (!failed) {
              failed = true;
              failure = error;
            }
          }
        };
        const stop = unsubscribe;
        unsubscribe = void 0;
        attempt(stop);
        attempt(stopWriter);
        stopWriter = void 0;
        control.removeEventListener("input", input);
        control.removeEventListener("compositionstart", compositionStart);
        control.removeEventListener("compositionend", compositionEnd);
        channels.delete(channel);
        if (channels.size === 0)
          CONTROL_BINDINGS.delete(control);
        if (failed)
          throw failure;
      };
      const prepare = (next, preview = false) => {
        if (disposed)
          return { validate: () => false, discard() {
          }, publish() {
          }, commit() {
          } };
        if (isSignalHandle(next) && (typeof next[SIGNAL_BINDING_READ] !== "function" || typeof next[SIGNAL_BINDING_SUBSCRIBE] !== "function"))
          throw new TypeError(__octaneDev ? "A signal control requires a native value/checked property and a signal." : __octaneNoArgError(116));
        if (!preview && raw !== next) {
          const ticket2 = ++generation;
          const stop = unsubscribe;
          unsubscribe = void 0;
          handle = void 0;
          stop?.();
          if (disposed)
            return { validate: () => false, discard() {
            }, publish() {
            }, commit() {
            } };
          raw = next;
          handle = isSignalHandle(next) ? next : void 0;
          if (handle) {
            const candidate2 = handle;
            const stopNext = run(() => candidate2[SIGNAL_BINDING_SUBSCRIBE](forwardNativeTransitionConsumer(notify, () => {
              if (!disposed && generation === ticket2) {
                revision++;
                notify();
              }
            }), () => {
              if (!disposed && generation === ticket2)
                dispose();
            }));
            if (typeof stopNext !== "function")
              throw new TypeError(__octaneDev ? "A signal control subscription must return cleanup." : __octaneNoArgError(118));
            if (disposed || generation !== ticket2)
              stopNext();
            else
              unsubscribe = stopNext;
          }
        }
        if (disposed)
          return { validate: () => false, discard() {
          }, publish() {
          }, commit() {
          } };
        const candidate = preview ? isSignalHandle(next) ? next : void 0 : handle;
        const value = candidate ? read(candidate) : next;
        if (disposed)
          return { validate: () => false, discard() {
          }, publish() {
          }, commit() {
          } };
        const multiple = control.localName === "select" && control.multiple;
        if (candidate && (channel === "checked" ? typeof value !== "boolean" : multiple ? !Array.isArray(value) : typeof value !== "string"))
          throw new TypeError(channel === "checked" ? __octaneDev ? "A checked signal must contain a boolean." : __octaneNoArgError(119) : multiple ? __octaneDev ? "A multiple select signal must contain an array." : __octaneNoArgError(120) : __octaneDev ? "A value signal must contain a string." : __octaneNoArgError(121));
        let selected;
        if (multiple && Array.isArray(value)) {
          selected = /* @__PURE__ */ new Set();
          for (const item of value)
            selected.add(candidate ? item : controlString(item));
        }
        const normalized = channel === "checked" ? !!value : value == null || multiple ? "" : controlString(value);
        let ticket = generation;
        const version = revision;
        let accepted = !preview;
        let retired = false;
        let invalid = false;
        let staged = preview && candidate && candidate !== handle ? run(() => candidate[SIGNAL_BINDING_SUBSCRIBE](forwardNativeTransitionConsumer(notify, () => {
          if (retired || disposed)
            return;
          if (!accepted)
            invalid = true;
          else if (generation === ticket) {
            revision++;
            notify();
          }
        }), () => {
          if (!accepted)
            invalid = true;
          else if (!disposed && generation === ticket)
            dispose();
        })) : void 0;
        const prepared = {
          publish() {
            if (retired || disposed || ticket !== generation)
              return;
            if (!accepted) {
              accepted = true;
              if (raw !== next) {
                const stop = unsubscribe;
                ticket = ++generation;
                raw = next;
                handle = candidate;
                unsubscribe = staged;
                staged = void 0;
                stop?.();
              }
            }
            active = candidate;
            if (isWritableSignal(active)) {
              stopWriter ??= registerHydrationControlSignalWriter(control, channel, channel === "checked" && control.type === "radio" ? input : write);
              if (channel === "checked" && control.type === "radio")
                RADIO_WRITERS.set(control, write);
            } else {
              stopWriter?.();
              stopWriter = void 0;
              if (channel === "checked")
                RADIO_WRITERS.delete(control);
            }
            if (initialized)
              return;
            initializeHydrationControlCapture(control.ownerDocument);
            control.addEventListener("input", input);
            control.addEventListener("compositionstart", compositionStart);
            control.addEventListener("compositionend", compositionEnd);
            initialized = true;
            if (!isWritableSignal(active))
              return;
            let snapshot;
            do {
              snapshot = snapshotHydrationControl(control);
              if (isWritableSignal(active) && (snapshot.editRevision > 0 || channel === "value" && isRestoredHydrationTextarea(control, read(active))))
                write(nativeValue());
              if (disposed)
                return;
            } while (!consumeHydrationControl(control, snapshot.revision));
          },
          commit() {
            if (retired || disposed || value == null || multiple && selected === void 0 || ticket !== generation || version !== revision || active !== candidate || composing || snapshotHydrationControl(control).composing)
              return;
            if (channel === "checked") {
              if (control.checked !== normalized)
                control.checked = normalized;
            } else if (selected) {
              for (const option of control.options) {
                if (disposed)
                  return;
                const next2 = selected.has(option.value);
                if (option.selected !== next2)
                  option.selected = next2;
              }
            } else if (!candidate && control.localName === "input" && control.type === "number" ? (
              // Preserve a user's "1.0" for sampled numeric 1, but show zero over an empty edit.
              value === 0 && control.value === "" || control.value != value
            ) : control.value !== normalized)
              control.value = normalized;
          }
        };
        return preview ? Object.assign(prepared, {
          validate: () => !retired && !invalid && !disposed && ticket === generation && version === revision,
          discard() {
            if (accepted || retired)
              return;
            retired = true;
            staged?.();
            staged = void 0;
          }
        }) : prepared;
      };
      return {
        prepare,
        preview: (value) => prepare(value, true),
        prepareCurrent: () => prepare(raw),
        active: () => !disposed,
        composing: () => composing,
        dispose
      };
    }
  };
}
function controlSignalOwner(owner, document) {
  return owner !== null && "documentOwner" in owner ? document ? owner.documentOwner : owner.instanceOwner : owner;
}
function bindSignalControl(control, channel, handle$) {
  if (!isSignalHandle(handle$))
    throw new TypeError(__octaneDev ? "A signal control requires a native value/checked property and a signal." : __octaneNoArgError(116));
  let busy = false;
  let dirty = false;
  let disposed = false;
  let lease;
  let handoff;
  const dispose = () => {
    disposed = true;
    lease.dispose();
  };
  const refresh = () => {
    if (disposed)
      return;
    dirty = true;
    if (busy)
      return;
    busy = true;
    try {
      while (dirty && !disposed) {
        dirty = false;
        const prepared = lease.prepare(handle$);
        prepared.publish();
        if (!dirty && !disposed)
          prepared.commit();
      }
    } catch (error) {
      try {
        dispose();
      } catch {
      }
      throw error;
    } finally {
      busy = false;
    }
  };
  refresh[NATIVE_TRANSITION_CONSUMER] = {
    active: () => !disposed,
    prepare: () => {
      const prepared = lease.preview(handle$);
      return {
        validate: () => !disposed && !busy && prepared.validate(),
        discard: prepared.discard,
        commit() {
          if (!disposed) {
            busy = true;
            try {
              prepared.publish();
              prepared.commit();
            } finally {
              busy = false;
            }
          }
        }
      };
    }
  };
  const owner = currentSignalOwner();
  lease = __createBindingControls(owner).claim(control, channel, refresh);
  refresh();
  return Object.assign(dispose, {
    [CONTROL_HANDOFF]() {
      return handoff ??= {
        control,
        channel,
        active: () => !disposed && lease.active(),
        matches(handle) {
          if (disposed || !lease.active() || handle !== handle$)
            return false;
          if (!(SIGNAL_OWNER_RESOLVE in handle$))
            return true;
          const document = handle$[SIGNAL_BINDING_IDENTITY]().scope === "document";
          return owner !== null && controlSignalOwner(owner, document) === controlSignalOwner(currentSignalOwner(), document) && !disposed && lease.active();
        },
        composing: lease.composing,
        // dispose revokes authority before invoking fallible subscription
        // cleanup; a later call cannot release the renderer's replacement.
        retire: dispose
      };
    }
  });
}
export {
  __createBindingControls,
  bindSignalControl
};
