import { createDerivedCellWith } from "./engine.js";
import { CandidateUnsupportedError, derivedValueState, errorState, invalidateNode, isThenable, pendingState, refreshNode } from "./graph.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
class ScalarBinding {
  constructor(owner, node, compute) {
    this.owner = owner;
    this.node = node;
    this.compute = compute;
    node.compute = (target) => {
      if (owner.readBarrier !== void 0) {
        this.frozen = true;
        return target.state?.snapshot.status === "ready" ? target.state : pendingState(owner.readBarrier);
      }
      let result;
      try {
        result = this.compute();
      } catch (error) {
        if (isThenable(error))
          throw error;
        return errorState(error);
      }
      return derivedValueState(target, result);
    };
  }
  owner;
  node;
  frozen = false;
  compute;
  forkCandidate(target) {
    if (this.frozen || this.owner.readBarrier || !this.compute) {
      throw new CandidateUnsupportedError(process.env.NODE_ENV !== "production" ? "Frozen scalar candidates are not supported." : __octaneNoArgError(205));
    }
    target.compute = this.node.compute;
  }
  suspend() {
    return false;
  }
  resume() {
    if (!this.frozen || this.owner.retired || this.owner.readBarrier !== void 0 || !this.compute)
      return;
    this.frozen = false;
    invalidateNode(this.node);
    refreshNode(this.node);
  }
  dispose() {
    this.compute = void 0;
  }
}
function createDeclaredScalarCell(owner, key, compute) {
  return createDerivedCellWith(owner, key, compute, void 0, ScalarBinding);
}
export {
  createDeclaredScalarCell
};
