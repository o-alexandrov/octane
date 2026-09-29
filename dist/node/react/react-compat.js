import { createRoot, hydrateRoot } from "react-dom/client";
import {
  createElement,
  descriptorChildren,
  useEffect,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useState
} from "../index.js";
import {
  getRendererOwnerVisibility,
  readContextFromScope,
  reportRendererOwnerError,
  useRendererThenable
} from "../runtime.js";
import {
  createReactCompatTree,
  isReactCompatErrorBoundary
} from "./react-compat-envelope.js";
import {
  createReactIslandElement,
  resolveReactIsland,
  validateReactContextBridges
} from "./react-compat-shared.js";
const CONTROLLER_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.controller");
const INVALIDATE_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.invalidate");
const ID_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.id");
const LIFETIME_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.lifetime");
const VISIBILITY_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.visibility");
const ACTIVITY_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.activity");
const PUBLISH_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.publish");
const SENTINEL_COMMENT = "react-compat";
const SENTINEL = Object.freeze({ __html: `<!--${SENTINEL_COMMENT}-->` });
function equalProps(a, b) {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(a[key], b[key])) return false;
  }
  return true;
}
class ReactIslandController {
  constructor(scope) {
    this.scope = scope;
  }
  scope;
  status = 0;
  payload = null;
  notify = () => {
  };
  host = null;
  root = null;
  disposed = false;
  child = null;
  contexts = [];
  mappings = null;
  visibility = "visible";
  settle = null;
  observer = {
    pending: (visibility) => {
      if (visibility === "visible") this.signal("pending");
    },
    ready: () => this.signal("ready"),
    error: (error) => this.signal("error", error)
  };
  ref = (host) => {
    if (host !== null && !this.disposed) this.host = host;
  };
  readContexts(mappings) {
    const previous = this.mappings;
    if (previous === null)
      this.mappings = mappings.map(({ source, target }) => ({ source, target }));
    else if (previous.length !== mappings.length || previous.some(
      (entry, index) => entry.source !== mappings[index].source || entry.target !== mappings[index].target
    )) {
      throw new Error(
        "<ReactCompat> context mapping identities and order must stay stable; change the boundary key to replace them."
      );
    }
    return mappings.map(({ source, target }) => {
      if (!("$$version" in source) || typeof source.$$version !== "number") {
        throw new TypeError(
          "<ReactCompat> client rendering requires a native client Octane context."
        );
      }
      return {
        context: target,
        value: readContextFromScope(this.scope, source)
      };
    });
  }
  signal(kind, error) {
    queueMicrotask(() => {
      if (this.disposed) {
        if (kind === "error") reportRendererOwnerError(this.scope, error);
        return;
      }
      if (this.status === 2) return;
      if (kind === "error") {
        this.status = 2;
        this.payload = error;
      } else if (kind === "pending") {
        if (this.visibility !== "visible" || this.status === 1) return;
        this.status = 1;
        this.payload = new Promise((resolve) => {
          this.settle = resolve;
        });
      } else {
        if (this.visibility === "suspense" || this.status === 0) return;
        this.status = 0;
        this.payload = null;
      }
      const settle = kind === "pending" ? null : this.settle;
      if (kind !== "pending") this.settle = null;
      this.notify();
      settle?.();
    });
  }
  commit(child, contexts, identifierPrefix) {
    if (this.disposed || this.host === null) return;
    const previous = this.child;
    if (previous !== null && previous.type === child.type && previous.key === child.key && equalProps(previous.props, child.props) && this.contexts.every((entry, index) => Object.is(entry.value, contexts[index].value)))
      return;
    this.child = child;
    this.contexts = contexts;
    const tree = this.tree();
    if (this.root === null) {
      const options = {
        identifierPrefix,
        onUncaughtError: (error) => this.signal("error", error),
        onCaughtError: (error, info) => {
          if (!isReactCompatErrorBoundary(info.errorBoundary)) console.error(error);
        }
      };
      const first = this.host.firstChild;
      const serverMarkup = first !== null && !(first.nodeType === 8 && first.data === SENTINEL_COMMENT && first.nextSibling === null);
      if (serverMarkup) this.root = hydrateRoot(this.host, tree, options);
      else {
        this.root = createRoot(this.host, options);
        this.root.render(tree);
      }
    } else this.root.render(tree);
  }
  tree() {
    return createReactCompatTree(
      createReactIslandElement(this.child),
      this.contexts,
      this.observer,
      this.visibility
    );
  }
  visibilityChanged() {
    if (this.disposed) return;
    let visibility = getRendererOwnerVisibility(this.scope);
    if (visibility === "suspense" && this.status === 1) visibility = "visible";
    if (visibility === this.visibility) return;
    this.visibility = visibility;
    if (this.root !== null) this.root.render(this.tree());
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.settle?.();
    this.settle = null;
    this.payload = null;
    this.notify = () => {
    };
    const root = this.root;
    this.root = null;
    this.host = null;
    this.child = null;
    this.contexts = [];
    this.mappings = null;
    if (root !== null)
      queueMicrotask(() => {
        try {
          root.unmount();
        } catch (error) {
          reportRendererOwnerError(this.scope, error);
        }
      });
  }
}
function ReactCompatImpl(props, scope) {
  const [controller] = useState(() => new ReactIslandController(scope), CONTROLLER_SLOT);
  const [, invalidate] = useState(0, INVALIDATE_SLOT);
  controller.notify = () => invalidate((value) => value + 1);
  const child = resolveReactIsland(props);
  const contexts = controller.readContexts(validateReactContextBridges(props.contexts));
  const identifierPrefix = `react-compat-${useId(ID_SLOT)}`;
  if (controller.status === 2) throw controller.payload;
  if (controller.status === 1) useRendererThenable(controller.payload);
  useInsertionEffect(() => () => controller.dispose(), [], LIFETIME_SLOT);
  useLayoutEffect(
    () => {
      controller.visibilityChanged();
      return () => controller.visibilityChanged();
    },
    [],
    VISIBILITY_SLOT
  );
  useEffect(
    () => {
      controller.visibilityChanged();
      return () => controller.visibilityChanged();
    },
    [],
    ACTIVITY_SLOT
  );
  useLayoutEffect(() => controller.commit(child, contexts, identifierPrefix), null, PUBLISH_SLOT);
  return createElement("div", {
    "data-react-compat": "",
    style: "display: contents",
    ref: controller.ref,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: SENTINEL
  });
}
const ReactCompat = descriptorChildren(ReactCompatImpl);
export {
  ReactCompat
};
