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
var signal_query_observation_exports = {};
__export(signal_query_observation_exports, {
  createServerSignalQueryAttemptObservations: () => createServerSignalQueryAttemptObservations
});
module.exports = __toCommonJS(signal_query_observation_exports);
class StreamAttemptMirror {
  constructor(releaseObservation) {
    this.releaseObservation = releaseObservation;
  }
  releaseObservation;
  pending;
  queued;
  hasQueued = false;
  acknowledgement;
  terminal;
  [Symbol.asyncIterator]() {
    return this;
  }
  next() {
    if (this.pending !== void 0) {
      return Promise.reject(new TypeError("A streamed signal result permits one pending read."));
    }
    this.acknowledgement?.();
    this.acknowledgement = void 0;
    if (this.hasQueued) {
      this.hasQueued = false;
      const value = this.queued;
      this.queued = void 0;
      return Promise.resolve({ done: false, value });
    }
    if (this.terminal !== void 0) {
      return this.terminal.kind === "complete" ? Promise.resolve({ done: true, value: void 0 }) : Promise.reject(this.terminal.error);
    }
    return new Promise((resolve, reject) => {
      this.pending = { resolve, reject };
    });
  }
  return() {
    this.releaseObservation();
    return Promise.resolve({ done: true, value: void 0 });
  }
  publish(value) {
    if (this.terminal !== void 0) return Promise.resolve();
    const acknowledgement = new Promise((resolve) => {
      this.acknowledgement = resolve;
    });
    if (this.pending !== void 0) {
      const pending = this.pending;
      this.pending = void 0;
      pending.resolve({ done: false, value });
    } else {
      this.queued = value;
      this.hasQueued = true;
    }
    return acknowledgement;
  }
  complete() {
    if (this.terminal !== void 0) return;
    this.terminal = { kind: "complete" };
    this.queued = void 0;
    this.hasQueued = false;
    this.acknowledgement?.();
    this.acknowledgement = void 0;
    this.pending?.resolve({ done: true, value: void 0 });
    this.pending = void 0;
  }
  fail(error) {
    if (this.terminal !== void 0) return;
    this.terminal = { kind: "error", error };
    this.queued = void 0;
    this.hasQueued = false;
    this.acknowledgement?.();
    this.acknowledgement = void 0;
    this.pending?.reject(error);
    this.pending = void 0;
  }
}
class QueryAttemptObservations {
  observations = /* @__PURE__ */ new Set();
  observe(context, source) {
    let observation;
    const release = () => this.release(observation);
    const mirror = source.kind === "stream" ? new StreamAttemptMirror(release) : void 0;
    observation = { controller: new AbortController(), mirror };
    this.observations.add(observation);
    try {
      context.observe({
        ownerKey: context.owner.documentOwner.scopeKey,
        instanceKey: context.owner.instanceKey,
        nodeKey: source.nodeKey,
        selectionKey: source.selectionKey,
        attempt: source.attempt,
        kind: source.kind,
        result: mirror ?? source.result,
        signal: observation.controller.signal,
        isCurrent: () => source.isCurrent() && this.observations.has(observation),
        release
      });
    } catch (error) {
      release();
      throw error;
    }
  }
  release(observation) {
    if (!this.observations.delete(observation)) return;
    observation.mirror?.complete();
    observation.controller.abort();
  }
  retire() {
    for (const observation of this.observations) {
      observation.mirror?.fail(
        new DOMException("The signal query attempt was replaced.", "AbortError")
      );
      observation.controller.abort();
    }
    this.observations.clear();
  }
  complete() {
    for (const observation of this.observations) observation.mirror?.complete();
  }
  fail(error) {
    for (const observation of this.observations) observation.mirror?.fail(error);
  }
  publish(value) {
    let pending;
    for (const observation of this.observations) {
      if (observation.mirror === void 0) continue;
      (pending ??= []).push(observation.mirror.publish(value));
    }
    return pending === void 0 ? void 0 : Promise.all(pending).then(() => {
    });
  }
}
function createServerSignalQueryAttemptObservations() {
  return new QueryAttemptObservations();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createServerSignalQueryAttemptObservations
});
