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
var query_facade_exports = {};
__export(query_facade_exports, {
  __queryAt: () => __queryAt,
  query$: () => query$
});
module.exports = __toCommonJS(query_facade_exports);
var import_engine = require("./engine.cjs");
var import_facade = require("./facade.cjs");
var import_owner_context = require("./owner-context.cjs");
var import_requests = require("./requests.cjs");
var import_types = require("./types.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
class QueryDescriptor extends import_facade.Descriptor {
  refetch() {
    this.resolve().retry();
  }
  reset() {
    this.resolve().retry({ pending: true });
  }
  retry(options) {
    this.resolve().retry(options);
  }
}
function __queryAt(site, select, load, options) {
  if (typeof select !== "function" || typeof load !== "function") {
    throw new TypeError(__octaneDev ? "query$ requires selector and loader functions." : __octaneNoArgError(193));
  }
  const explicit = (0, import_facade.signalOptionsKey)(options);
  site ??= explicit;
  const authoredKey = (0, import_facade.descriptorKey)(site, explicit);
  const key = explicit !== void 0 && (site?.startsWith("g:") || site?.startsWith("i:")) ? site.slice(0, 2) + authoredKey : authoredKey;
  const request = (0, import_requests.query)(key, load, options);
  return new QueryDescriptor(key, "async", (owner) => (0, import_engine.createResourceCellWith)(owner, key, () => {
    const selection = (0, import_owner_context.runWithSignalOwner)(owner, select);
    return selection === import_types.skip ? import_types.skip : request(selection);
  }, import_requests.initializeResource), site);
}
function query$(select, load, options) {
  return __queryAt(void 0, select, load, options);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __queryAt,
  query$
});
