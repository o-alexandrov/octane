import { formatClientError } from "../error-codes.client.generated.js";
class ScopeDisposedError extends Error {
  constructor(scopeKey) {
    super(formatClientError(151, scopeKey));
    this.name = "ScopeDisposedError";
  }
}
class SignalWriteError extends Error {
  constructor() {
    super(formatClientError(152));
    this.name = "SignalWriteError";
  }
}
class SignalCycleError extends Error {
  constructor(key) {
    super(formatClientError(153, key));
    this.name = "SignalCycleError";
  }
}
class SignalIdleError extends Error {
  constructor(key) {
    super(formatClientError(113, key));
    this.name = "SignalIdleError";
  }
}
class SignalFrameError extends Error {
  constructor(message) {
    super(message);
    this.name = "SignalFrameError";
  }
}
class SignalStreamError extends Error {
  code;
  constructor(code) {
    super(formatClientError(154, code));
    this.code = code;
    this.name = "SignalStreamError";
  }
}
class SignalSerializationError extends Error {
  constructor(message) {
    super(message);
    this.name = "SignalSerializationError";
  }
}
export {
  ScopeDisposedError,
  SignalCycleError,
  SignalFrameError,
  SignalIdleError,
  SignalSerializationError,
  SignalStreamError,
  SignalWriteError
};
