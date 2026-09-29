import { createResourceCellWith } from "./engine.js";
import { Descriptor, descriptorKey, signalOptionsKey } from "./facade.js";
import { runWithSignalOwner } from "./owner-context.js";
import { initializeResource, query as createQueryRequest } from "./requests.js";
import { skip } from "./types.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
class QueryDescriptor extends Descriptor {
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
    throw new TypeError(process.env.NODE_ENV !== "production" ? "query$ requires selector and loader functions." : __octaneNoArgError(193));
  }
  const explicit = signalOptionsKey(options);
  site ??= explicit;
  const authoredKey = descriptorKey(site, explicit);
  const key = explicit !== void 0 && (site?.startsWith("g:") || site?.startsWith("i:")) ? site.slice(0, 2) + authoredKey : authoredKey;
  const request = createQueryRequest(key, load, options);
  return new QueryDescriptor(key, "async", (owner) => createResourceCellWith(owner, key, () => {
    const selection = runWithSignalOwner(owner, select);
    return selection === skip ? skip : request(selection);
  }, initializeResource), site);
}
function query$(select, load, options) {
  return __queryAt(void 0, select, load, options);
}
export {
  __queryAt,
  query$
};
