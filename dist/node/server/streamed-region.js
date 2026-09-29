import { materializeNativeSignalManifest } from "../signals/native-read-seeds.js";
import {
  isStreamedRendererFrame
} from "../streamed-signals-protocol.js";
function createStreamedRegionPlacementFrame(identity, rendered, options) {
  const scopes = rendered.signals === void 0 ? void 0 : materializeNativeSignalManifest(rendered.signals, options.initialDocumentSignals).scopes;
  if (scopes?.length !== 1 || scopes[0].scopeKey !== identity.ownerKey) {
    throw new TypeError("A streamed region requires the exact historical signal owner.");
  }
  if (rendered.head) {
    throw new TypeError("A streamed region cannot replace document head metadata.");
  }
  const frame = {
    identity: { ...identity },
    sequence: options.sequence,
    channel: "placement",
    kind: "html",
    contentRevision: options.contentRevision,
    mode: "full",
    // Scoped CSS is part of the same atomic candidate and precedes its users.
    // The outer pair belongs to the receiver, not to the component's layout.
    html: "<!--[-->" + rendered.css + rendered.html + "<!--]-->",
    historicalFrame: scopes[0],
    styles: options.styles === void 0 ? [] : [...options.styles]
  };
  if (!isStreamedRendererFrame(frame)) throw new TypeError("Invalid streamed region snapshot.");
  return frame;
}
export {
  createStreamedRegionPlacementFrame
};
