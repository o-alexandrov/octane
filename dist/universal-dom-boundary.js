import {
  flushSync,
  getRootRenderRetryKey,
  readContextFromScope,
  renderClientContextProvider,
  scheduleRenderCleanup,
  useInsertionEffect as useDomInsertionEffect,
  useLayoutEffect as useDomLayoutEffect,
  useRendererThenable as useDomRendererThenable,
  useState as useDomState
} from "./runtime.js";
import {
  isRendererRegion
} from "./universal-core.js";
import { registerClientRendererBridge } from "./renderer-bridge.js";
const UNIVERSAL_BOUNDARY = /* @__PURE__ */ Symbol.for("octane.universal.boundary");
const boundaryStates = /* @__PURE__ */ new WeakMap();
const rootRetryOwnership = /* @__PURE__ */ new WeakMap();
const BOUNDARY_INVALIDATE_SLOT = /* @__PURE__ */ Symbol("octane.universal.boundary.invalidate");
const BOUNDARY_COMMIT_SLOT = /* @__PURE__ */ Symbol("octane.universal.boundary.commit");
const BOUNDARY_ATTEMPT_LIFETIME_SLOT = /* @__PURE__ */ Symbol("octane.universal.boundary.attempt-lifetime");
const BOUNDARY_LIFETIME_SLOT = /* @__PURE__ */ Symbol("octane.universal.boundary.lifetime");
function assertRendererId(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("Host boundary renderer must be a non-empty renderer id.");
  }
}
function registerUniversalHostBridge() {
  registerClientRendererBridge(renderClientContextProvider, flushSync);
}
function createUniversalHostBoundary(renderer) {
  assertRendererId(renderer);
  registerUniversalHostBridge();
  const boundary = ((props, scope) => {
    if (props.root.renderer !== renderer) {
      throw new Error(
        `Universal boundary ${JSON.stringify(renderer)} received root ${JSON.stringify(props.root.renderer)}.`
      );
    }
    let component = props.component;
    let componentProps = props.props;
    if (props.children !== void 0) {
      const region = props.children;
      if (!isRendererRegion(region)) {
        throw new TypeError(
          `Universal boundary ${JSON.stringify(renderer)} expected compiler-owned renderer-region children.`
        );
      }
      if (region.ownerRenderer !== "dom" || region.childRenderer !== renderer) {
        throw new Error(
          `Universal boundary ${JSON.stringify(renderer)} cannot mount region ${JSON.stringify(region.ownerRenderer)} -> ${JSON.stringify(region.childRenderer)}.`
        );
      }
      if (component !== void 0) {
        throw new Error(
          "A universal boundary cannot receive both component and renderer-region children."
        );
      }
      component = region.component;
      componentProps = region.props;
    }
    if (component === void 0) {
      throw new Error(
        `Universal boundary ${JSON.stringify(renderer)} requires a component or renderer-owned children.`
      );
    }
    let state = boundaryStates.get(scope);
    const retryKey = getRootRenderRetryKey(scope, true);
    const retryingRootSuspension = retryKey !== null && rootRetryOwnership.get(retryKey)?.delete(props.root) === true;
    const [, invalidate] = useDomState(0, BOUNDARY_INVALIDATE_SLOT);
    if (state === void 0) {
      let rootInvalidated = false;
      const owner = {
        readContext(context) {
          return readContextFromScope(scope, context);
        },
        invalidate() {
          rootInvalidated = true;
          invalidate((value) => value + 1);
        },
        consumeRootInvalidation() {
          const invalidated = rootInvalidated;
          rootInvalidated = false;
          return invalidated;
        }
      };
      state = {
        root: props.root,
        owner,
        ownerCommitted: false,
        lifetimeCommitted: false,
        suspensionRetained: false,
        retryErrored: false,
        pending: null
      };
      boundaryStates.set(scope, state);
      state.root.setBridge(owner);
    } else if (state.root !== props.root) {
      throw new Error("Changing the root owned by a mounted universal boundary is not supported.");
    }
    const retryingRetainedSuspension = state.suspensionRetained;
    let attempt;
    let transitionAttempt = false;
    let projectedThenable = null;
    try {
      if (state.owner.consumeRootInvalidation()) {
        const preparation = state.root.__prepareBoundaryScheduled(component, componentProps);
        attempt = preparation.attempt;
        transitionAttempt = preparation.transition;
        projectedThenable = preparation.projectedThenable;
      } else {
        attempt = state.root.prepare(component, componentProps);
      }
    } catch (error) {
      if (retryingRetainedSuspension) state.retryErrored = true;
      if (!state.ownerCommitted) {
        boundaryStates.delete(scope);
        if (retryingRootSuspension && !state.lifetimeCommitted) {
          state.root.__runCommitTasks([
            () => {
              throw error;
            },
            () => state.root.unmount(),
            () => state.root.clearBridge(state.owner)
          ]);
        }
        state.root.clearBridge(state.owner);
      }
      throw error;
    }
    state.pending = attempt;
    useDomLayoutEffect(
      () => {
        if (state.pending !== attempt) return;
        try {
          if (attempt.status === "prepared") attempt.commit();
          state.ownerCommitted = true;
          state.pending = null;
        } catch (error) {
          boundaryStates.delete(scope);
          state.pending = null;
          try {
            state.root.unmount();
          } finally {
            state.root.clearBridge(state.owner);
          }
          throw error;
        }
      },
      [attempt],
      BOUNDARY_COMMIT_SLOT
    );
    useDomInsertionEffect(
      () => {
        if (attempt.status === "prepared") {
          state.lifetimeCommitted = true;
          state.suspensionRetained = false;
        } else if (attempt.status === "suspended") {
          state.suspensionRetained = true;
        }
      },
      [attempt],
      BOUNDARY_ATTEMPT_LIFETIME_SLOT
    );
    useDomInsertionEffect(
      () => {
        return () => {
          const ownedState = boundaryStates.get(scope) ?? state;
          const mustUnmount = ownedState.ownerCommitted || ownedState.lifetimeCommitted || ownedState.retryErrored;
          boundaryStates.delete(scope);
          ownedState.lifetimeCommitted = false;
          ownedState.suspensionRetained = false;
          ownedState.retryErrored = false;
          const pending = ownedState.pending;
          ownedState.pending = null;
          ownedState.root.__runCommitTasks([
            () => pending?.abort(),
            () => {
              if (mustUnmount) ownedState.root.unmount();
            },
            () => ownedState.root.clearBridge(ownedState.owner)
          ]);
        };
      },
      [],
      BOUNDARY_LIFETIME_SLOT
    );
    scheduleRenderCleanup(
      state.root.__scheduleMicrotask,
      state.root,
      () => {
        if (state.pending !== attempt) return;
        state.pending = null;
        state.root.__runCommitTasks([
          () => attempt.abort(),
          () => {
            if (!state.ownerCommitted && !state.lifetimeCommitted && !state.suspensionRetained) {
              if (boundaryStates.get(scope) === state) boundaryStates.delete(scope);
              state.root.clearBridge(state.owner);
            }
          }
        ]);
      },
      () => {
        if (scope.block.disposed && !state.ownerCommitted && !state.lifetimeCommitted && !state.suspensionRetained) {
          if (boundaryStates.get(scope) === state) boundaryStates.delete(scope);
          state.root.clearBridge(state.owner);
        }
      }
    );
    if (projectedThenable === null && attempt.status === "suspended" && !transitionAttempt) {
      projectedThenable = attempt.thenable;
    }
    if (projectedThenable !== null) {
      const key = getRootRenderRetryKey(scope);
      if (key !== null) {
        let roots = rootRetryOwnership.get(key);
        if (roots === void 0) rootRetryOwnership.set(key, roots = /* @__PURE__ */ new WeakSet());
        roots.add(state.root);
      }
      useDomRendererThenable(projectedThenable);
    }
  });
  Object.defineProperty(boundary, UNIVERSAL_BOUNDARY, {
    value: Object.freeze({
      id: `dom->${renderer}`,
      ownerRenderer: "dom",
      childRenderer: renderer,
      childrenProp: "children"
    })
  });
  return boundary;
}
export {
  createUniversalHostBoundary,
  registerUniversalHostBridge
};
