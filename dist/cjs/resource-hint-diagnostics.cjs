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
var resource_hint_diagnostics_exports = {};
__export(resource_hint_diagnostics_exports, {
  resourceHintWarning: () => resourceHintWarning
});
module.exports = __toCommonJS(resource_hint_diagnostics_exports);
function describeHintValue(value) {
  if (value === null) return "`null`";
  if (value === void 0) return "`undefined`";
  if (value === "") return "an empty string";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return "`" + value + "`";
  return 'a value of type "' + typeof value + '"';
}
function resourceHintWarning(name, href, options, hasOptions = false) {
  const invalidHref = typeof href !== "string" || href === "";
  const invalidOptions = options === null || typeof options !== "object";
  if (name === "preload") {
    let encountered = "";
    if (invalidHref) encountered += " The `href` argument was " + describeHintValue(href) + ".";
    if (invalidOptions) {
      encountered += " The `options` argument was " + describeHintValue(options) + ".";
    } else {
      const destination = options.as;
      if (typeof destination !== "string" || destination === "") {
        encountered += " The `as` option was " + describeHintValue(destination) + ".";
      }
    }
    return encountered === "" ? null : "preload(): Expected a non-empty `href` string and an `options` object with a valid `as` destination." + encountered;
  }
  if (name === "preloadModule" || name === "preinitModule") {
    let encountered = "";
    if (invalidHref) encountered += " The `href` argument was " + describeHintValue(href) + ".";
    if (options != null && invalidOptions) {
      encountered += " The `options` argument was " + describeHintValue(options) + ".";
    } else if (options !== null && typeof options === "object" && "as" in options) {
      const destination = options.as;
      if (name === "preloadModule" && typeof destination !== "string" || name === "preinitModule" && destination !== "script") {
        encountered += " The `as` option was " + describeHintValue(destination) + ".";
      }
    }
    if (encountered === "") return null;
    return name + "(): Expected a non-empty `href` string and optional object-shaped `options`" + (name === "preinitModule" ? ' with `as: "script"`.' : " with a string `as` destination.") + encountered;
  }
  if (invalidHref) {
    return name + "(): Expected a non-empty string `href`; received " + describeHintValue(href) + ".";
  }
  if (name === "preinit") {
    if (invalidOptions) {
      return 'preinit(): Expected the `options` argument to be an object with `as: "style"` or `as: "script"`; received ' + describeHintValue(options) + ".";
    }
    const destination = options.as;
    return destination === "style" || destination === "script" ? null : 'preinit(): The `as` option must be "style" or "script"; received ' + describeHintValue(destination) + ". Use preload() for other resource destinations.";
  }
  if (name === "preconnect") {
    if (options != null && typeof options !== "object") {
      return "preconnect(): Expected the optional `options` argument to be an object; received " + describeHintValue(options) + ".";
    }
    if (options !== null && typeof options === "object") {
      const crossOrigin2 = options.crossOrigin;
      if (typeof crossOrigin2 !== "string") {
        return "preconnect(): The `crossOrigin` option must be a string; received " + describeHintValue(crossOrigin2) + ". Remove the option or provide a string value.";
      }
    }
    return null;
  }
  if (!hasOptions) return null;
  const crossOrigin = options !== null && typeof options === "object" && "crossOrigin" in options ? " Browsers never use `crossOrigin` for DNS queries." : "";
  return "prefetchDNS(): Expected only one `href` argument; the second `options` argument is unsupported." + crossOrigin;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resourceHintWarning
});
