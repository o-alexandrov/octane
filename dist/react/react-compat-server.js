import { renderToReadableStream } from "react-dom/server";
import {
  createElement,
  descriptorChildren,
  EXTERNAL_HYDRATION_PROMISE,
  getServerRenderResourceContext,
  puMemo,
  use,
  useContext,
  useId
} from "../runtime.server.js";
import { createReactCompatTree } from "./react-compat-envelope.js";
import {
  createReactIslandElement,
  resolveReactIsland,
  validateReactContextBridges
} from "./react-compat-shared.js";
const SERVER_RENDER_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.server.render");
const SERVER_RESULT_SLOT = /* @__PURE__ */ Symbol("octane.react-compat.server.result");
const MAX_ISLAND_HTML_BYTES = 8 * 1024 * 1024;
function bufferReactIsland(tree, identifierPrefix, owner) {
  const controller = new AbortController();
  let finished = false;
  let failure;
  let timeout;
  let reader;
  let fullyRead = false;
  const abort = (reason) => {
    if (finished || failure !== void 0) return;
    failure = { reason };
    controller.abort(reason);
  };
  const throwIfFailed = () => {
    if (failure !== void 0) throw failure.reason;
  };
  const onAbort = () => abort(owner.signal.reason);
  const release = owner.registerCleanup(() => {
    abort(new Error("<ReactCompat> server rendering ended before the React island completed."));
  });
  if (owner.signal?.aborted) onAbort();
  else owner.signal?.addEventListener("abort", onAbort, { once: true });
  if (owner.timeoutMs > 0) {
    timeout = setTimeout(() => {
      abort(new Error(`<ReactCompat> server rendering exceeded ${owner.timeoutMs}ms.`));
    }, owner.timeoutMs);
  }
  const result = (async () => {
    try {
      const stream = await renderToReadableStream(tree, {
        identifierPrefix,
        nonce: owner.nonce,
        signal: controller.signal,
        onError(reason) {
          if (failure !== void 0) return;
          failure = { reason };
          queueMicrotask(() => controller.abort(reason));
        }
      });
      await stream.allReady;
      throwIfFailed();
      reader = stream.getReader();
      const decoder = new TextDecoder();
      let bytes = 0;
      let html = "";
      for (; ; ) {
        const chunk = await reader.read();
        throwIfFailed();
        if (chunk.done) {
          fullyRead = true;
          return html + decoder.decode();
        }
        bytes += chunk.value.byteLength;
        if (bytes > MAX_ISLAND_HTML_BYTES) {
          throw new Error("<ReactCompat> server-rendered island HTML exceeds the 8 MiB limit.");
        }
        html += decoder.decode(chunk.value, { stream: true });
      }
    } finally {
      finished = true;
      if (timeout !== void 0) clearTimeout(timeout);
      owner.signal?.removeEventListener("abort", onAbort);
      release();
      if (!fullyRead) {
        controller.abort(failure?.reason);
        await reader?.cancel().catch(() => {
        });
      }
      reader?.releaseLock();
    }
  })();
  result.catch(() => {
  });
  Object.defineProperty(result, EXTERNAL_HYDRATION_PROMISE, { value: true });
  return result;
}
function ReactCompatServer(props) {
  const child = resolveReactIsland(props);
  const contexts = validateReactContextBridges(props.contexts).map(({ source, target }) => ({
    context: target,
    value: useContext(source)
  }));
  const identifierPrefix = `react-compat-${useId()}`;
  const owner = getServerRenderResourceContext();
  if (owner === null) {
    throw new Error(
      "<ReactCompat> server rendering requires an owned Octane render request. Nesting it inside React-hosted <OctaneCompat> on the server is not supported."
    );
  }
  const pending = puMemo(
    () => bufferReactIsland(
      createReactCompatTree(createReactIslandElement(child), contexts, null),
      identifierPrefix,
      owner
    ),
    [child.type, child.key, identifierPrefix],
    SERVER_RENDER_SLOT
  );
  const html = use(pending, SERVER_RESULT_SLOT);
  return createElement("div", {
    "data-react-compat": "",
    style: "display: contents",
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: html }
  });
}
const ReactCompat = descriptorChildren(ReactCompatServer);
export {
  ReactCompat
};
