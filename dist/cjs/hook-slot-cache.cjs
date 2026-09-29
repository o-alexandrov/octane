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
var hook_slot_cache_exports = {};
__export(hook_slot_cache_exports, {
  resolveHookPath: () => resolveHookPath
});
module.exports = __toCommonJS(hook_slot_cache_exports);
const MAX_PATH_DEPTH = 16;
const MAX_BASE_SLOTS = 32;
const NATIVE_APPLY = Reflect.apply;
const INITIAL_SYMBOL_FOR = Symbol.for;
let NATIVE_SYMBOL_FOR = null;
try {
  const text = NATIVE_APPLY(Function.prototype.toString, INITIAL_SYMBOL_FOR, []);
  if (typeof INITIAL_SYMBOL_FOR === "function" && typeof text === "string" && /^function for\(\)\s*\{\s*\[native code\]\s*\}$/.test(text))
    NATIVE_SYMBOL_FOR = INITIAL_SYMBOL_FOR;
} catch {
}
const frames = [];
function pathFrame(depth) {
  return frames[depth] ??= { prefix: "", tag: "", size: 0, value: "", path: "", slots: null };
}
function resolveHookPath(stack, own, universal, server = false) {
  const depth = stack.length;
  let prefix = universal ? "@octane:universal-hook:" : "@octane:hook:";
  let cacheable = depth < MAX_PATH_DEPTH;
  for (let index = 0; index <= depth; index++) {
    const last = index === depth;
    const part = last ? own : stack[index];
    cacheable &&= part === null || typeof part !== "object" && typeof part !== "function";
    let tag;
    let size;
    let value;
    let encoded;
    if (!universal && last && own === void 0) {
      tag = "";
      size = 0;
      value = "";
    } else if (!universal) {
      tag = typeof part === "number" ? "n" : server && typeof part === "string" ? "t" : "s";
      value = typeof part === "number" ? String(part) : server && typeof part === "string" ? part : part.description ?? "";
      size = value.length;
      if (typeof value !== "string" || typeof size !== "number") {
        encoded = tag + size + ":" + value;
        cacheable = false;
      }
    } else {
      tag = typeof part === "symbol" ? "s" : "v";
      size = typeof part === "symbol" ? part.description?.length ?? 0 : String(part).length;
      const head = typeof size === "number" ? void 0 : `${tag}${size}:`;
      value = typeof part === "symbol" ? part.description ?? "" : String(part);
      if (head !== void 0 || typeof value !== "string") {
        encoded = `${head ?? `${tag}${size}:`}${value}`;
        cacheable = false;
      }
    }
    if (last) {
      const registry = Symbol;
      const intern = registry.for;
      if (!cacheable || intern !== NATIVE_SYMBOL_FOR) {
        const key = prefix + (encoded ?? (tag === "" ? "" : tag + size + ":" + value));
        return intern === NATIVE_SYMBOL_FOR ? intern(key) : NATIVE_APPLY(intern, registry, [key]);
      }
      const frame2 = pathFrame(depth);
      const slots = frame2.slots ??= /* @__PURE__ */ new Map();
      const cached = slots.get(own);
      if (cached !== void 0 && cached.prefix === prefix && cached.tag === tag && cached.size === size && cached.value === value)
        return cached.resolved;
      const resolved = intern(prefix + (tag === "" ? "" : tag + size + ":" + value));
      if (cached !== void 0) {
        cached.prefix = prefix;
        cached.tag = tag;
        cached.size = size;
        cached.value = value;
        cached.resolved = resolved;
      } else if (slots.size < MAX_BASE_SLOTS)
        slots.set(own, { prefix, tag, size, value, resolved });
      return resolved;
    }
    if (!cacheable) {
      prefix += encoded ?? tag + size + ":" + value;
      continue;
    }
    const frame = pathFrame(index);
    if (frame.prefix !== prefix || frame.tag !== tag || frame.size !== size || frame.value !== value) {
      frame.prefix = prefix;
      frame.tag = tag;
      frame.size = size;
      frame.value = value;
      frame.path = prefix + tag + size + ":" + value;
    }
    prefix = frame.path;
  }
  throw new Error("Unreachable hook path");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolveHookPath
});
