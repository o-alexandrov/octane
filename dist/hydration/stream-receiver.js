import { formatClientError } from "../error-codes.client.generated.js";
import { HYDRATE_INPUT_ATTR } from "../hydration-markers.js";
import { rendererRangeClose } from "../stream-protocol.js";
import {
  sameStreamFrameIdentity
} from "../streamed-signals-protocol.js";
import { snapshotHydrationControl } from "./control-capture.js";
import {
  createStreamedResultReceiverState,
  StreamedReceiverError
} from "./stream-result-receiver.js";
import {
  StreamedReceiverError as StreamedReceiverError2
} from "./stream-result-receiver.js";
function rangeNodes(start, end) {
  if (start.parentNode === null || start.parentNode !== end.parentNode) {
    throw new StreamedReceiverError("placement", formatClientError(240));
  }
  const nodes = [];
  for (let node = start.nextSibling; node !== null && node !== end; node = node.nextSibling) {
    nodes.push(node);
  }
  if (end.previousSibling !== start && nodes.length === 0) {
    throw new StreamedReceiverError("placement", formatClientError(241));
  }
  return nodes;
}
function keyedControls(nodes) {
  const controls = /* @__PURE__ */ new Map();
  const visit = (element) => {
    const key = element.getAttribute(HYDRATE_INPUT_ATTR);
    if (key !== null) {
      if (controls.has(key)) {
        throw new StreamedReceiverError("placement", formatClientError(242, key));
      }
      controls.set(key, element);
    }
    for (const child of element.children) visit(child);
  };
  for (const node of nodes) if (node.nodeType === 1) visit(node);
  return controls;
}
function compatibleControl(current, incoming) {
  return current.localName === incoming.localName && current.namespaceURI === incoming.namespaceURI && (current.localName !== "input" || current.type === incoming.type);
}
function restoreControl(control) {
  const { element, snapshot } = control;
  if (!snapshot.focused || !element.isConnected) return;
  try {
    element.focus({ preventScroll: true });
  } catch {
    return;
  }
  if (snapshot.composing || snapshot.selectionStart === null || snapshot.selectionEnd === null)
    return;
  try {
    element.setSelectionRange(
      snapshot.selectionStart,
      snapshot.selectionEnd,
      snapshot.selectionDirection ?? void 0
    );
  } catch {
  }
}
function placeFullRegion(registration, html) {
  const { start, end } = registration;
  const oldNodes = rangeNodes(start, end);
  const oldControls = keyedControls(oldNodes);
  const snapshots = /* @__PURE__ */ new Map();
  for (const [key, element] of oldControls) {
    const snapshot = snapshotHydrationControl(element);
    if (snapshot !== null) snapshots.set(key, { element, snapshot });
  }
  const template = start.ownerDocument.createElement("template");
  template.innerHTML = html;
  const incomingOpen = template.content.firstChild;
  const incomingClose = rendererRangeClose(incomingOpen);
  if (incomingOpen === null || incomingClose === null || incomingClose !== template.content.lastChild) {
    throw new StreamedReceiverError("placement", formatClientError(243));
  }
  const incomingNodes = [];
  for (let node = incomingOpen.nextSibling; node !== incomingClose; node = node.nextSibling) {
    incomingNodes.push(node);
  }
  const incomingControls = keyedControls(incomingNodes);
  for (const [key, preserved] of snapshots) {
    const replacement = incomingControls.get(key);
    if ((preserved.snapshot.editRevision > 0 || preserved.snapshot.focused || preserved.snapshot.composing) && (replacement === void 0 || !compatibleControl(preserved.element, replacement))) {
      throw new StreamedReceiverError("placement", formatClientError(244, key));
    }
  }
  const parent = end.parentNode;
  for (const node of incomingNodes) parent.insertBefore(node, end);
  const preservedElements = /* @__PURE__ */ new Set();
  for (const [key, replacement] of incomingControls) {
    const current = oldControls.get(key);
    if (current === void 0 || !compatibleControl(current, replacement)) continue;
    replacement.parentNode.replaceChild(current, replacement);
    preservedElements.add(current);
  }
  for (const node of oldNodes) {
    if (node.nodeType === 1 && preservedElements.has(node)) continue;
    node.parentNode?.removeChild(node);
  }
  for (const preserved of snapshots.values()) restoreControl(preserved);
}
async function commitPlacement(state, frame, isCurrent) {
  const registration = state.region;
  if (!isCurrent(state, frame.identity) || registration === void 0 || registration.isActive() || !sameStreamFrameIdentity(state.identity, frame.identity) || frame.contentRevision <= state.contentRevision || frame.mode === "delta" && frame.baseRevision !== state.contentRevision) {
    return "stale";
  }
  try {
    await registration.loadStyles(frame.styles);
  } catch {
    throw new StreamedReceiverError("styles", formatClientError(245));
  }
  if (!isCurrent(state, frame.identity) || state.region !== registration || registration.isActive() || !sameStreamFrameIdentity(state.identity, frame.identity) || frame.contentRevision <= state.contentRevision || frame.mode === "delta" && frame.baseRevision !== state.contentRevision) {
    return "stale";
  }
  for (const element of keyedControls(rangeNodes(registration.start, registration.end)).values()) {
    if (!snapshotHydrationControl(element)?.composing) continue;
    state.pendingPlacement?.cancel();
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        element.removeEventListener("compositionend", resume);
        if (state.pendingPlacement === pending) state.pendingPlacement = void 0;
      };
      const pending = {
        cancel() {
          cleanup();
          resolve("stale");
        }
      };
      const resume = () => {
        cleanup();
        void commitPlacement(state, frame, isCurrent).then(resolve, reject);
      };
      state.pendingPlacement = pending;
      element.addEventListener("compositionend", resume, { once: true });
    });
  }
  let lease;
  try {
    lease = registration.adoptHistoricalFrame(frame.historicalFrame);
  } catch {
    throw new StreamedReceiverError("historical-frame", formatClientError(246));
  }
  try {
    if (frame.mode === "delta") {
      if (registration.applyDelta === void 0) {
        throw new StreamedReceiverError("placement", formatClientError(247));
      }
      registration.applyDelta(frame);
    } else {
      placeFullRegion(registration, frame.html);
    }
  } catch (error) {
    lease.release();
    throw error;
  }
  state.historical?.release();
  state.historical = lease;
  state.contentRevision = frame.contentRevision;
  return "accepted";
}
function createStreamedRegionReceiver(options) {
  const { receiver, current } = createStreamedResultReceiverState(options, commitPlacement);
  const registerRegion = (registration) => {
    const state = current(registration.identity);
    if (state === void 0) {
      throw new StreamedReceiverError("identity", formatClientError(248));
    }
    if (registration.start.parentNode !== registration.end.parentNode) {
      throw new StreamedReceiverError("placement", formatClientError(249));
    }
    if (!Number.isSafeInteger(registration.contentRevision) || registration.contentRevision < 0) {
      throw new StreamedReceiverError("identity", formatClientError(250));
    }
    state.region = registration;
    state.contentRevision = registration.contentRevision;
    return () => {
      if (state.region === registration) state.region = void 0;
    };
  };
  return { ...receiver, registerRegion };
}
export {
  StreamedReceiverError2 as StreamedReceiverError,
  createStreamedRegionReceiver
};
