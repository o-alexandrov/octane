const SIGNAL_HANDLE = /* @__PURE__ */ Symbol.for("octane.signal-handle");
const SIGNAL_BINDING_READ = /* @__PURE__ */ Symbol.for("octane.signal-binding-read");
const SIGNAL_BINDING_SUBSCRIBE = /* @__PURE__ */ Symbol.for(
  "octane.signal-binding-subscribe"
);
const SIGNAL_BINDING_IDENTITY = /* @__PURE__ */ Symbol.for(
  "octane.signal-binding-identity"
);
const QUERY_REQUEST = /* @__PURE__ */ Symbol.for("octane.query-request");
const SIGNAL_OWNER_RESOLVE = /* @__PURE__ */ Symbol.for("octane.signal-owner-resolve");
const skip = /* @__PURE__ */ Symbol.for("octane.query-skip");
export {
  QUERY_REQUEST,
  SIGNAL_BINDING_IDENTITY,
  SIGNAL_BINDING_READ,
  SIGNAL_BINDING_SUBSCRIBE,
  SIGNAL_HANDLE,
  SIGNAL_OWNER_RESOLVE,
  skip
};
