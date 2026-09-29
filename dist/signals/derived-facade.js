import { createDeclaredDerivedCell } from "./computations.js";
import { DerivedDescriptor, descriptorKey, signalOptionsKey } from "./facade.js";
import { runWithSignalOwner } from "./owner-context.js";
function __octaneNoArgError(code) {
  return "Minified Octane error #" + code + "; visit https://octanejs.dev/errors/" + code + " for the full message or use a development build for full errors and additional helpful warnings.";
}
function __derivedAt(site, compute, options) {
  if (typeof compute !== "function")
    throw new TypeError(process.env.NODE_ENV !== "production" ? "derived$ requires a function." : __octaneNoArgError(122));
  const explicit = signalOptionsKey(options);
  site ??= explicit;
  const key = descriptorKey(site, explicit);
  return new DerivedDescriptor(key, "derived", (owner) => {
    const wrapped = compute.length ? (context) => runWithSignalOwner(owner, () => compute(context)) : () => runWithSignalOwner(owner, () => compute());
    return createDeclaredDerivedCell(owner, key, wrapped, options);
  }, site);
}
function derived$(compute, options) {
  return __derivedAt(void 0, compute, options);
}
export {
  __derivedAt,
  derived$
};
