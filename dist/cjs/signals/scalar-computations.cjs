"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var scalar_computations_exports = {};
__export(scalar_computations_exports, {
  createDeclaredScalarCell: () => createDeclaredScalarCell
});
module.exports = __toCommonJS(scalar_computations_exports);
var import_engine = require("./engine.cjs");
var import_graph = require("./graph.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
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
        return target.state?.snapshot.status === "ready" ? target.state : (0, import_graph.pendingState)(owner.readBarrier);
      }
      let result;
      try {
        result = this.compute();
      } catch (error) {
        if ((0, import_graph.isThenable)(error))
          throw error;
        return (0, import_graph.errorState)(error);
      }
      return (0, import_graph.derivedValueState)(target, result);
    };
  }
  owner;
  node;
  frozen = false;
  compute;
  forkCandidate(target) {
    if (this.frozen || this.owner.readBarrier || !this.compute) {
      throw new import_graph.CandidateUnsupportedError(__octaneDev ? "Frozen scalar candidates are not supported." : __octaneNoArgError(205));
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
    (0, import_graph.invalidateNode)(this.node);
    (0, import_graph.refreshNode)(this.node);
  }
  dispose() {
    this.compute = void 0;
  }
}
function createDeclaredScalarCell(owner, key, compute) {
  return (0, import_engine.createDerivedCellWith)(owner, key, compute, void 0, ScalarBinding);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDeclaredScalarCell
});
