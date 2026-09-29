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
var signals_exports = {};
__export(signals_exports, {
  ActionUncertainError: () => import_actions.ActionUncertainError,
  QUERY_REQUEST: () => import_types.QUERY_REQUEST,
  SIGNAL_BINDING_IDENTITY: () => import_types.SIGNAL_BINDING_IDENTITY,
  SIGNAL_BINDING_READ: () => import_types.SIGNAL_BINDING_READ,
  SIGNAL_BINDING_SUBSCRIBE: () => import_types.SIGNAL_BINDING_SUBSCRIBE,
  SIGNAL_HANDLE: () => import_types.SIGNAL_HANDLE,
  ScopeDisposedError: () => import_errors.ScopeDisposedError,
  SignalCycleError: () => import_errors.SignalCycleError,
  SignalFrameError: () => import_errors.SignalFrameError,
  SignalIdleError: () => import_errors.SignalIdleError,
  SignalSerializationError: () => import_errors.SignalSerializationError,
  SignalStreamError: () => import_errors.SignalStreamError,
  SignalWriteError: () => import_errors.SignalWriteError,
  __derivedAt: () => import_derived_facade.__derivedAt,
  __derivedScalarAt: () => import_facade.__derivedScalarAt,
  __enableSignalDocument: () => import_document_owner.enableSignalDocument,
  __queryAt: () => import_query_facade.__queryAt,
  __signalAt: () => import_facade.__signalAt,
  __startSignalReads: () => import_facade.__startSignalReads,
  acceptStreamedSignalResult: () => import_facade.acceptStreamedSignalResult,
  action$: () => import_actions.action$,
  attachStreamedSignalResult: () => import_facade.attachStreamedSignalResult,
  bindSignalControl: () => import_control_binding.bindSignalControl,
  bindStreamedSignalSelection: () => import_facade.bindStreamedSignalSelection,
  captureSignalOwner: () => import_owner_context.captureSignalOwner,
  createResource: () => import_requests.createResource,
  createScope: () => import_engine.createScope,
  currentSignalOwner: () => import_owner_context.currentSignalOwner,
  derived$: () => import_derived_facade.derived$,
  failStreamedSignalResult: () => import_facade.failStreamedSignalResult,
  installSignalOwnerEnvironment: () => import_owner_context.installSignalOwnerEnvironment,
  isActionUncertain: () => import_actions.isActionUncertain,
  isSignalHandle: () => import_handle_protocol.isSignalHandle,
  isWritableSignal: () => import_handle_protocol.isWritableSignal,
  optimistic$: () => import_actions.optimistic$,
  query: () => import_requests.query,
  query$: () => import_query_facade.query$,
  readSignalBinding: () => import_facade.readSignalBinding,
  retireSignalOwnerIdentity: () => import_owner_context.retireSignalOwnerIdentity,
  runWithSignalOwner: () => import_owner_context.runWithSignalOwner,
  signal$: () => import_facade.signal$,
  skip: () => import_types.skip
});
module.exports = __toCommonJS(signals_exports);
var import_engine = require("./engine.cjs");
var import_control_binding = require("./control-binding.cjs");
var import_document_owner = require("./document-owner.cjs");
var import_requests = require("./requests.cjs");
var import_actions = require("./actions.cjs");
var import_derived_facade = require("./derived-facade.cjs");
var import_query_facade = require("./query-facade.cjs");
var import_handle_protocol = require("./handle-protocol.cjs");
var import_facade = require("./facade.cjs");
var import_owner_context = require("./owner-context.cjs");
var import_errors = require("./errors.cjs");
var import_types = require("./types.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionUncertainError,
  QUERY_REQUEST,
  SIGNAL_BINDING_IDENTITY,
  SIGNAL_BINDING_READ,
  SIGNAL_BINDING_SUBSCRIBE,
  SIGNAL_HANDLE,
  ScopeDisposedError,
  SignalCycleError,
  SignalFrameError,
  SignalIdleError,
  SignalSerializationError,
  SignalStreamError,
  SignalWriteError,
  __derivedAt,
  __derivedScalarAt,
  __enableSignalDocument,
  __queryAt,
  __signalAt,
  __startSignalReads,
  acceptStreamedSignalResult,
  action$,
  attachStreamedSignalResult,
  bindSignalControl,
  bindStreamedSignalSelection,
  captureSignalOwner,
  createResource,
  createScope,
  currentSignalOwner,
  derived$,
  failStreamedSignalResult,
  installSignalOwnerEnvironment,
  isActionUncertain,
  isSignalHandle,
  isWritableSignal,
  optimistic$,
  query,
  query$,
  readSignalBinding,
  retireSignalOwnerIdentity,
  runWithSignalOwner,
  signal$,
  skip
});
