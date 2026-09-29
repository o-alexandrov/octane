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
var transition_coordinator_exports = {};
__export(transition_coordinator_exports, {
  createSignalTransitionCoordinator: () => createSignalTransitionCoordinator
});
module.exports = __toCommonJS(transition_coordinator_exports);
function createSignalTransitionCoordinator(runtime) {
  let NATIVE_TRANSITION_QUEUE = null;
  function queueNativeTransition(batch) {
    (NATIVE_TRANSITION_QUEUE ??= /* @__PURE__ */ new Set()).add(batch);
    runtime.schedule();
  }
  function prepareNativeTransitionBlock(block) {
    const admission = runtime.attempt;
    if (block.disposed || admission.blocks.has(block)) return;
    const hidden = runtime.visibility?.find(block, false);
    if (hidden?.nativeTransition !== void 0 && hidden.tryBlock !== null) block = hidden.tryBlock;
    if (admission.blocks.has(block)) return;
    const owner = block.idState.renderOwner;
    if (owner === void 0 || owner.disposed) return;
    const retired = owner.transaction?.retired;
    if (retired !== void 0 && retired !== null) {
      for (let current = block; current !== null; current = current.parentBlock)
        if (retired.has(current)) return;
    }
    admission.blocks.add(block);
    const root = runtime.beginRoot(owner);
    admission.transactions.add(owner.transaction);
    const mode = block.pendingMode;
    block.pendingMode = "transition";
    const attempt = runtime.beginAttempt(block);
    if (attempt !== null) admission.attempts.push(attempt);
    try {
      runtime.invalidate(block, block);
      if (hidden?.nativeTransition !== void 0) {
        runtime.journal(hidden);
        runtime.journalProperty(block, "inactive", block.inactive);
        runtime.visibility.reveal(hidden, "transition");
      } else runtime.render(block);
    } catch (error) {
      if (runtime.isSuspense(error)) {
        for (let owner2 = block; owner2 !== null; owner2 = owner2.parentBlock) {
          const handler = owner2.__suspenseHandler;
          if (handler) {
            try {
              handler(error.thenable, block);
            } catch (suspension) {
              if (!runtime.isSuspense(suspension)) throw suspension;
            }
            break;
          }
        }
        throw error.thenable;
      }
      admission.errorBlock ??= block;
      throw error;
    } finally {
      runtime.endAttempt(attempt);
      block.pendingMode = mode;
      runtime.endRoot(root);
    }
  }
  function finishNativeTransition(batch) {
    batch.nativeWake?.();
    batch.nativeWake = void 0;
    batch.native = void 0;
    for (const block of batch.nativeBlocks ?? [])
      block.idState.renderOwner?.nativeTransitions?.delete(batch);
    batch.nativeBlocks = void 0;
    for (const state of batch.nativeBoundaries?.keys() ?? []) {
      if (state.nativeTransition !== batch) continue;
      state.nativeTransition = void 0;
      if (state.transitionTimeoutId !== null) {
        clearTimeout(state.transitionTimeoutId);
        state.transitionTimeoutId = null;
      }
    }
    batch.nativeBoundaries = void 0;
    NATIVE_TRANSITION_QUEUE?.delete(batch);
    if (NATIVE_TRANSITION_QUEUE?.size === 0) NATIVE_TRANSITION_QUEUE = null;
    runtime.releaseHookHolder(batch);
  }
  function retireNativeTransitionBlock(block) {
    if (runtime.rollback) return;
    for (const batch of block.idState.renderOwner?.nativeTransitions ?? []) {
      if (!batch.nativeBlocks?.has(block)) continue;
      queueNativeTransition(batch);
    }
  }
  function prepareNativeTransitionUpdates(batch) {
    for (const update of batch.updates.values()) {
      const { block, slot, state, reducer } = update;
      const owner = block.idState.renderOwner;
      if (block.disposed || owner === void 0 || owner.disposed) continue;
      const frame = runtime.beginRoot(owner);
      runtime.attempt.transactions.add(owner.transaction);
      try {
        runtime.journal(slot);
        if (state !== void 0) {
          state.renderTransition = update;
          state.updates = void 0;
        } else if (reducer !== void 0) {
          reducer.renderTransition = update;
          reducer.renderPhaseActions = void 0;
        } else slot.value = runtime.rebaseUpdate(update);
        if (slot.pendingActionBatch === batch) {
          slot.pendingActionBatch = void 0;
          slot.pendingActionValue = void 0;
        }
      } finally {
        runtime.endRoot(frame);
      }
    }
  }
  function prepareNativeTransitionHook(batch, hook) {
    const owner = hook.block.idState.renderOwner;
    if (hook.block.disposed || owner === void 0 || owner.disposed) return;
    const frame = runtime.beginRoot(owner);
    runtime.attempt.transactions.add(owner.transaction);
    try {
      if (batch.hooksPending && hook.pendingBatches === 1) {
        runtime.journal(hook);
        hook.isPending = false;
      }
    } finally {
      runtime.endRoot(frame);
    }
    prepareNativeTransitionBlock(hook.block);
  }
  function flushNativeTransitions() {
    const queue = NATIVE_TRANSITION_QUEUE;
    if (queue === null) return;
    NATIVE_TRANSITION_QUEUE = null;
    for (const batch of queue) {
      const candidate = batch.native;
      if (candidate === void 0) continue;
      batch.nativeWake?.();
      batch.nativeWake = void 0;
      try {
        if (!candidate.validate()) candidate.rebase();
      } catch {
        candidate.discard();
        finishNativeTransition(batch);
        runtime.flushBatch(batch);
        continue;
      }
      if (!candidate.hasWrites()) {
        candidate.discard();
        finishNativeTransition(batch);
        runtime.flushBatch(batch);
        continue;
      }
      const admission = {
        blocks: /* @__PURE__ */ new Set(),
        transactions: /* @__PURE__ */ new Set(),
        attempts: [],
        presentations: [],
        suspensions: /* @__PURE__ */ new Map()
      };
      runtime.attempt = admission;
      let outcome;
      try {
        outcome = candidate.prepare([
          () => prepareNativeTransitionUpdates(batch),
          ...batch.hook === null ? [] : [() => prepareNativeTransitionHook(batch, batch.hook)],
          ...(batch.hooks ?? []).map((hook) => () => prepareNativeTransitionHook(batch, hook)),
          ...[...batch.updates.values()].map(
            (update) => () => prepareNativeTransitionBlock(update.block)
          ),
          ...candidate.consumers().filter((consumer) => consumer.active()).map((consumer) => () => {
            const presentation = consumer.prepare();
            if (presentation !== void 0) admission.presentations.push(presentation);
          })
        ]);
      } finally {
        runtime.attempt = null;
      }
      for (const block of batch.nativeBlocks ?? [])
        block.idState.renderOwner?.nativeTransitions?.delete(batch);
      batch.nativeBlocks = admission.blocks;
      for (const transaction of admission.transactions)
        (transaction.owner.nativeTransitions ??= /* @__PURE__ */ new Set()).add(batch);
      const valid = outcome.status === "ready" && admission.presentations.every((presentation) => presentation.validate()) && [...admission.transactions].every(
        (transaction) => !transaction.aborted && !transaction.owner.disposed && runtime.currentPresentations(transaction.capture) && runtime.validateCapture(transaction.capture)
      );
      if (valid && outcome.status === "ready" && outcome.receipt.publish(() => {
        for (const transaction of admission.transactions) {
          transaction.nativeAdmitted = true;
          runtime.acceptCapture(transaction.capture, transaction.owner, true);
        }
        batch.flushed = true;
        batch.updates.clear();
        finishNativeTransition(batch);
        for (const presentation of admission.presentations) presentation.commit();
        runtime.commitRoots();
      })) {
        continue;
      }
      for (const transaction of admission.transactions) runtime.rollbackRoot(transaction);
      for (const presentation of admission.presentations) presentation.discard();
      for (let i = admission.attempts.length - 1; i >= 0; i--) {
        const swaps = admission.attempts[i].memoSwaps;
        if (swaps !== null)
          for (let j = swaps.length - 1; j >= 0; j--) runtime.applyMemoSwap(swaps[j], false);
      }
      runtime.commitRoots();
      if (outcome.status === "pending") {
        for (const state of batch.nativeBoundaries?.keys() ?? []) {
          if (admission.suspensions.has(state)) continue;
          if (state.nativeTransition === batch) state.nativeTransition = void 0;
          if (state.transitionTimeoutId !== null) {
            clearTimeout(state.transitionTimeoutId);
            state.transitionTimeoutId = null;
          }
        }
        for (const [state, thenable] of admission.suspensions) {
          state.nativeTransition = batch;
          if (state.hasResolved && state.branch === 1 && state.pendingBody !== null && runtime.fallbackTimeout !== Infinity && runtime.fallbackTimeout >= 0 && (state.transitionTimeoutId === null || batch.nativeBoundaries?.get(state) !== thenable)) {
            if (state.transitionTimeoutId !== null) clearTimeout(state.transitionTimeoutId);
            state.transitionTimeoutId = setTimeout(() => {
              state.transitionTimeoutId = null;
              if (state.nativeTransition === batch && !state.parentBlock.disposed && state.branch === 1)
                runtime.visibility.hidePending(state);
            }, runtime.fallbackTimeout);
          }
        }
        batch.nativeBoundaries = admission.suspensions;
        batch.nativeWake = candidate.watchPreparation(outcome, () => queueNativeTransition(batch));
      } else if (outcome.status === "ready" || outcome.status === "invalid" && outcome.reason === "stale") {
        queueNativeTransition(batch);
      } else {
        candidate.discard();
        finishNativeTransition(batch);
        for (const update of batch.updates.values()) {
          if (update.slot.pendingActionBatch === batch) {
            update.slot.pendingActionBatch = void 0;
            update.slot.pendingActionValue = void 0;
          }
        }
        batch.updates.clear();
        batch.flushed = true;
        if (outcome.status === "error") {
          if (admission.errorBlock !== void 0 && !admission.errorBlock.disposed)
            runtime.handleError(admission.errorBlock, outcome.error);
          else runtime.reportError(outcome.error, batch.hook ?? void 0);
        } else if (outcome.status === "invalid")
          runtime.reportError(runtime.unsupportedError(), batch.hook ?? void 0);
      }
    }
  }
  return {
    queue: queueNativeTransition,
    flush: flushNativeTransitions,
    prepare: prepareNativeTransitionBlock,
    retire: retireNativeTransitionBlock,
    hasWork: () => NATIVE_TRANSITION_QUEUE !== null
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSignalTransitionCoordinator
});
