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
export {
  resolveHookPath
};
