"use client";
const __octaneDev = process.env.NODE_ENV !== "production";
import { RENDERER_REGION_OWNER_TAG as RENDERER_REGION_OWNER } from "../runtime-tags.js";
import { ReactCompat } from "./react-compat.js";
import { bridgeReactContext } from "./react-compat-shared.js";
import * as React from "react";
import { hasOwnProp } from "../has-own.js";
import {
  bindRendererRegionOwner,
  createContext as createOctaneContext,
  createElement as createOctaneElement,
  createHostContextRequest,
  createRoot as createOctaneRoot,
  hydrateRoot as hydrateOctaneRoot,
  flushSync as octaneFlushSync
} from "../index.js";
import {
  OPAQUE_HOST_SENTINEL,
  OPAQUE_HOST_SENTINEL_COMMENT,
  REACT_CONTEXT_TAG,
  resolveHostedIsland
} from "./shared.js";
import { drainPassiveEffects } from "../runtime.js";
import { readNearestProviderValue } from "./fiber-adapter.js";
import { __hostContextFiberWalks } from "./fiber-adapter.js";
const EMPTY_SNAPSHOT = { entries: [], values: [] };
function hostedRootEnvelope(props) {
  bindRendererRegionOwner(props);
  const config = props.bodyKey === null ? props.bodyProps : { ...props.bodyProps, key: props.bodyKey };
  return createOctaneElement(props.body, config);
}
function reportHostedFault(error) {
  if (typeof reportError === "function") reportError(error);
  else console.error(error);
}
function shallowEqualProps(a, b) {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];
    if (!Object.is(a[key], b[key]) || !hasOwnProp.call(b, key)) {
      return false;
    }
  }
  return true;
}
class HostedIslandController {
  // ── RendererRegionOwnerBridge ──────────────────────────────────────────
  active = true;
  // ── controller state ───────────────────────────────────────────────────
  host = null;
  status = 0;
  // ready, pending, error
  payload = null;
  // null, relay promise, or the original error
  notify = () => {
  };
  /** Foreign-context registry — immutable snapshots, replaced on discovery (§6.2). */
  entries = [];
  root = null;
  rootLive = false;
  attached = false;
  disposed = false;
  identifierPrefix = "";
  committed = null;
  episode = null;
  disposers = /* @__PURE__ */ new Set();
  /** Bumped by every attachment signal; cancels a pending deferred dispose check. */
  lifecycleGeneration = 0;
  attemptSuspended = false;
  attemptErrored = false;
  /** §6.3 request thenables this controller minted (recognized in routeSuspense). */
  contextRequests = /* @__PURE__ */ new WeakSet();
  /** True while an attach is adopting server DOM (hydration). */
  hydrating = false;
  /** A §6.3 handshake unwound the last attempt; the next commit retries the root. */
  pendingContextRetry = false;
  // ── RendererRegionOwnerBridge ──────────────────────────────────────────
  /**
   * Foreign-context resolution (§6.2 steps 1–7): find or create the
   * root-local mirror for a real React context read inside the island. First
   * discovery bootstraps the committed nearest-provider value from the host
   * Fiber (bootstrap-only — the wrapper's `React.use` replay is the
   * subscription) and coalesces one React notification.
   */
  resolveForeignContext(foreign) {
    if (this.disposed) return null;
    if (foreign.$$typeof !== REACT_CONTEXT_TAG) return null;
    let entry = this.entries.find((candidate) => candidate.foreign === foreign);
    if (entry === void 0) {
      entry = {
        foreign,
        mirror: createOctaneContext(void 0),
        value: void 0,
        hasValue: false,
        settle: null
      };
      if (this.host !== null) {
        const boot = readNearestProviderValue(this.host, foreign);
        if (boot.found) {
          entry.value = boot.value;
          entry.hasValue = true;
        }
      }
      this.entries = [...this.entries, entry];
      this.notify();
    }
    return entry.mirror;
  }
  readContext(context) {
    const entry = this.entries.find(
      (candidate) => candidate.mirror === context
    );
    if (entry === void 0) {
      return context.defaultValue;
    }
    if (entry.hasValue) return entry.value;
    let settle;
    const request = new Promise((done) => {
      settle = done;
    });
    (entry.settle ??= []).push(settle);
    this.contextRequests.add(request);
    throw createHostContextRequest(request);
  }
  routeError(error) {
    if (this.disposed) return false;
    this.attemptErrored = true;
    this.status = 2;
    this.payload = error;
    const episode = this.episode;
    this.episode = null;
    this.notify();
    episode?.resolve();
    return true;
  }
  routeSuspense(thenable) {
    if (this.disposed) return false;
    if (this.contextRequests.has(thenable)) {
      if (this.hydrating && __octaneDev) {
        console.warn(
          "<OctaneCompat> abandoned hydration for an island whose context read needed the request handshake; the island was client-remounted."
        );
      }
      this.pendingContextRetry = true;
      return true;
    }
    this.attemptSuspended = true;
    let episode = this.episode;
    if (episode === null) {
      let resolve;
      const relay = new Promise((done) => {
        resolve = done;
      });
      episode = this.episode = { relay, resolve };
      if (this.status !== 2) {
        this.status = 1;
        this.payload = relay;
      }
      this.notify();
    }
    const current = episode;
    thenable.then(
      () => this.retryAfterSettle(current),
      () => this.retryAfterSettle(current)
    );
    return true;
  }
  registerDispose(dispose) {
    this.disposers.add(dispose);
    this.rootLive = true;
    return () => {
      this.disposers.delete(dispose);
      this.rootLive = this.disposers.size > 0;
    };
  }
  // ── wrapper integration ────────────────────────────────────────────────
  /**
   * §6.2 step 8: render-local replay of every registered context read.
   * Runs during EVERY wrapper render — including one about to throw the
   * relay/error — so React records the dependencies (§7 step 3; retention
   * across suspended attempts is pinned by the Phase 0 tests).
   */
  readReactSnapshots() {
    const entries = this.entries;
    if (entries.length === 0) return EMPTY_SNAPSHOT;
    const values = new Array(entries.length);
    for (let index = 0; index < entries.length; index++) {
      values[index] = React.use(entries[index].foreign);
    }
    return { entries, values };
  }
  /**
   * Layout-commit publish of the committed React snapshot (§6.2 step 9):
   * every `Object.is`-different value advances its root-local mirror's
   * version — without the bump, memo/context dependency checks would bail
   * out on the stale mirror value — and settles any §6.3 requests waiting on
   * a first value. Returns whether the island must re-render.
   */
  publishSnapshots(snapshot) {
    let changed = false;
    const live = this.entries;
    const entries = snapshot.entries;
    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      if (live !== entries && !live.includes(entry)) continue;
      const next = snapshot.values[index];
      if (!entry.hasValue || !Object.is(entry.value, next)) {
        entry.value = next;
        entry.hasValue = true;
        entry.mirror.$$version++;
        changed = true;
      }
      if (entry.settle !== null) {
        const settlers = entry.settle;
        entry.settle = null;
        for (const settle of settlers) settle();
        changed = true;
      }
    }
    return changed;
  }
  hostAttached(node) {
    this.host = node;
    this.lifecycleGeneration++;
  }
  /**
   * Host-ref detach: schedule the deferred hide/probe/unmount discriminator.
   * `host` is deliberately kept — a hidden island's ref detaches too, and a
   * pending-episode retry must still reach the (connected, display:none) host.
   */
  hostDetached() {
    this.scheduleDisconnectCheck();
  }
  passiveAlive() {
    this.lifecycleGeneration++;
  }
  /**
   * Passive-effect cleanup is the deletion signal that still fires for HIDDEN
   * trees: React 19 hide destroys layout effects and detaches refs but leaves
   * passive effects connected, so deleting an already-hidden island fires only
   * this cleanup (Phase 0 signal matrix, §5 rule 7).
   */
  passiveDetached() {
    this.scheduleDisconnectCheck();
  }
  /**
   * Layout-commit publish (§5 rule 4): synchronously finish the hosted Octane
   * commit before the wrapper's layout effect returns, so outer React layout
   * effects observe current island DOM. Bails when the parent re-render
   * changed nothing (§10 republish policy): the transported child element is
   * recreated every parent render, so `React.memo` cannot provide this bail.
   */
  commit(child, identifierPrefix, snapshot) {
    if (this.disposed) return;
    this.lifecycleGeneration++;
    this.identifierPrefix = identifierPrefix;
    const previous = this.committed;
    if (previous !== null && (previous.type !== child.type || previous.key !== child.key)) {
      this.entries = [];
    }
    const contextsChanged = this.publishSnapshots(snapshot);
    const needsContextRetry = this.pendingContextRetry;
    this.pendingContextRetry = false;
    if (!contextsChanged && !needsContextRetry && this.attached && this.rootLive && this.status === 0 && this.episode === null && previous !== null && previous.type === child.type && previous.key === child.key && shallowEqualProps(previous.props, child.props)) {
      return;
    }
    this.committed = child;
    this.attached = true;
    this.attachAndFlush();
  }
  scheduleDisconnectCheck() {
    const generation = ++this.lifecycleGeneration;
    queueMicrotask(() => {
      if (this.disposed || generation !== this.lifecycleGeneration) return;
      if (this.host !== null && this.host.isConnected) {
        this.attached = false;
        return;
      }
      try {
        this.dispose();
      } catch (error) {
        reportHostedFault(error);
      }
    });
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    try {
      const disposers = [...this.disposers];
      this.disposers.clear();
      for (const dispose of disposers) dispose();
    } finally {
      this.active = false;
    }
  }
  // ── hosted root mechanics ──────────────────────────────────────────────
  envelopeProps() {
    const committed = this.committed;
    const props = {
      body: committed.type,
      bodyProps: committed.props,
      bodyKey: committed.key
    };
    Object.defineProperty(props, RENDERER_REGION_OWNER, {
      value: this,
      enumerable: false
    });
    return props;
  }
  attachAndFlush() {
    this.attemptSuspended = false;
    this.attemptErrored = false;
    if (this.host === null || this.committed === null || this.disposed) {
      return { suspended: false, errored: false };
    }
    if (this.root === null && hasServerIslandMarkup(this.host)) {
      const host = this.host;
      this.hydrating = true;
      try {
        octaneFlushSync(() => {
          this.root = hydrateOctaneRoot(
            host,
            hostedRootEnvelope,
            this.envelopeProps(),
            { identifierPrefix: this.identifierPrefix }
          );
        });
      } finally {
        this.hydrating = false;
      }
      return { suspended: this.attemptSuspended, errored: this.attemptErrored };
    }
    if (this.root === null || !this.rootLive) {
      this.root = createOctaneRoot(this.host, { identifierPrefix: this.identifierPrefix });
    }
    const root = this.root;
    octaneFlushSync(
      () => root.render(hostedRootEnvelope, this.envelopeProps())
    );
    return { suspended: this.attemptSuspended, errored: this.attemptErrored };
  }
  retryAfterSettle(episode) {
    if (this.disposed || this.episode !== episode) return;
    const result = this.attachAndFlush();
    if (result.suspended || result.errored) return;
    this.episode = null;
    this.status = 0;
    this.payload = null;
    drainPassiveEffects();
    episode.resolve();
  }
}
function OctaneCompat(props) {
  const [controller] = React.useState(() => new HostedIslandController());
  const [, bump] = React.useReducer((count) => count + 1, 0);
  controller.notify = bump;
  const child = resolveHostedIsland(props);
  const snapshot = controller.readReactSnapshots();
  const identifierPrefix = React.useId();
  if (controller.status === 2) throw controller.payload;
  if (controller.status === 1) React.use(controller.payload);
  const [hostRef] = React.useState(() => (node) => {
    if (node !== null) controller.hostAttached(node);
    else controller.hostDetached();
  });
  React.useLayoutEffect(() => {
    controller.commit(child, identifierPrefix, snapshot);
  });
  React.useEffect(() => {
    controller.passiveAlive();
    return () => controller.passiveDetached();
  }, [controller]);
  return React.createElement("div", {
    "data-octane-compat": "",
    ref: hostRef,
    // §9.3 opaque-host contract: the server writes real island HTML; the
    // client ALWAYS supplies this stable frozen sentinel so React neither
    // diffs nor clears the Octane-owned descendants — on any render, forever.
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: OPAQUE_HOST_SENTINEL
  });
}
function hasServerIslandMarkup(host) {
  const first = host.firstChild;
  if (first === null) return false;
  return !(first.nodeType === 8 && first.data === OPAQUE_HOST_SENTINEL_COMMENT && first.nextSibling === null);
}
export {
  OctaneCompat,
  ReactCompat,
  __hostContextFiberWalks,
  bridgeReactContext
};
