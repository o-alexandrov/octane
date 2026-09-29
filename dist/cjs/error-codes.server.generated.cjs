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
var error_codes_server_generated_exports = {};
__export(error_codes_server_generated_exports, {
  formatServerError: () => formatServerError
});
module.exports = __toCommonJS(error_codes_server_generated_exports);
var import_error_message = require("./error-message.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function formatServerError(code, ...args) {
  if (__octaneDev) {
    switch (code) {
      case 2:
        return (0, import_error_message.formatDevErrorMessage)(
          "Children.only expected to receive a single element child.",
          args
        );
      case 3:
        return (0, import_error_message.formatDevErrorMessage)(
          "Objects are not valid as an Octane child (found: %s). If you meant to render a collection of children, use an array instead.",
          args
        );
      case 4:
        return (0, import_error_message.formatDevErrorMessage)(
          "cloneElement: the first argument must be an element (from createElement / JSX).",
          args
        );
      case 5:
        return (0, import_error_message.formatDevErrorMessage)(
          "Can only set one of `children` or `props.dangerouslySetInnerHTML`.",
          args
        );
      case 6:
        return (0, import_error_message.formatDevErrorMessage)(
          "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`",
          args
        );
      case 7:
        return (0, import_error_message.formatDevErrorMessage)(
          "`%s` is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
          args
        );
      case 8:
        return (0, import_error_message.formatDevErrorMessage)(
          "`<%s>` is a void element tag and must neither have children nor use `dangerouslySetInnerHTML`.",
          args
        );
      case 9:
        return (0, import_error_message.formatDevErrorMessage)(
          "Too many re-renders. Octane limits the number of renders to prevent an infinite loop.",
          args
        );
      case 10:
        return (0, import_error_message.formatDevErrorMessage)(
          "lazy: expected the load() promise to resolve to a component function or a module with a component as its default export, got '%s'",
          args
        );
      case 11:
        return (0, import_error_message.formatDevErrorMessage)(
          "A function wrapped in useEffectEvent can't be called during rendering.",
          args
        );
      case 12:
        return (0, import_error_message.formatDevErrorMessage)("%s(): argument is not a Context nor a thenable", args);
      case 23:
        return (0, import_error_message.formatDevErrorMessage)("Server-rendered use() rejected", args);
      case 30:
        return (0, import_error_message.formatDevErrorMessage)("Invalid tag: %s", args);
      case 31:
        return (0, import_error_message.formatDevErrorMessage)(
          "If you supply `defaultValue` on a <textarea>, do not pass children.",
          args
        );
      case 32:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: a use(thenable) did not settle within %sms.",
          args
        );
      case 34:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: a root suspension no longer has resumable work.",
          args
        );
      case 35:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: %s root streaming passes completed without producing a shell.",
          args
        );
      case 36:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: a pending streamed boundary no longer has resumable work; its error escaped to an ancestor that was already flushed.",
          args
        );
      case 38:
        return (0, import_error_message.formatDevErrorMessage)("The stream destination closed.", args);
      case 39:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: destination.write() returned false but the destination cannot emit drain.",
          args
        );
      case 40:
        return (0, import_error_message.formatDevErrorMessage)("The stream destination is closed.", args);
      case 41:
        return (0, import_error_message.formatDevErrorMessage)("octane SSR: pipe() may only be called once.", args);
      case 42:
        return (0, import_error_message.formatDevErrorMessage)("The render was aborted.", args);
      case 43:
        return (0, import_error_message.formatDevErrorMessage)("The stream consumer cancelled.", args);
      case 44:
        return (0, import_error_message.formatDevErrorMessage)("The readable stream is closed.", args);
      case 45:
        return (0, import_error_message.formatDevErrorMessage)("Server-rendered use() rejected (function)", args);
      case 47:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: exceeded %s suspense passes \u2014 a use(thenable) never resolved. If promises are re-created on every render pass (e.g. created in an ancestor render and passed down through props), create them at their use() site or hoist them out of render.",
          args
        );
      case 48:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: %s consecutive streaming passes completed no boundary \u2014 a use(thenable) never resolved. If promises are re-created on every render pass (e.g. created in an ancestor render and passed down through props), create them at their use() site or hoist them out of render.",
          args
        );
      case 57:
        return (0, import_error_message.formatDevErrorMessage)(
          "prerenderToNodeStream requires a Node.js runtime with process.getBuiltinModule; use prerender() in non-Node environments.",
          args
        );
      case 58:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported native-read compiler/runtime version.", args);
      case 59:
        return (0, import_error_message.formatDevErrorMessage)("%s requires an active server component.", args);
      case 60:
        return (0, import_error_message.formatDevErrorMessage)(
          "A component suspended without a Suspense boundary during synchronous server rendering. Use prerender() or a streaming renderer to await it.",
          args
        );
      case 65:
        return (0, import_error_message.formatDevErrorMessage)(
          "Internal SSR invariant violated: ASYNC_SCOPE is not an extension of the active frame's async scope. Please file an Octane issue.",
          args
        );
      case 68:
        return (0, import_error_message.formatDevErrorMessage)(
          "A signal control cannot join values from different document owners.",
          args
        );
      case 69:
        return (0, import_error_message.formatDevErrorMessage)(
          "Independent Hydrate requires a build manifest in RenderOptions.",
          args
        );
      case 70:
        return (0, import_error_message.formatDevErrorMessage)(
          "Independent Hydrate activation chunk is missing from the build manifest.",
          args
        );
      case 71:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported Octane server signal binding ABI.", args);
      case 73:
        return (0, import_error_message.formatDevErrorMessage)("Octane DOM bindings require unique list keys.", args);
      case 74:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported Octane signal binding ABI.", args);
      case 80:
        return (0, import_error_message.formatDevErrorMessage)(
          "Independent Hydrate cannot activate a `%s` strategy because its lexical parent never runs on the client. Use load(), idle(), visible(), media(), interaction(), or never(), or remove `independent`.",
          args
        );
      case 81:
        return (0, import_error_message.formatDevErrorMessage)("An optimistic source needs a live Octane scope.", args);
      case 82:
        return (0, import_error_message.formatDevErrorMessage)('Action operation "%s" is no longer writable.', args);
      case 83:
        return (0, import_error_message.formatDevErrorMessage)("An optimistic write requires ready source authority.", args);
      case 84:
        return (0, import_error_message.formatDevErrorMessage)(
          "An action cannot adopt authority for a different query selection.",
          args
        );
      case 85:
        return (0, import_error_message.formatDevErrorMessage)(
          "Only a writable or query source can adopt an authoritative value.",
          args
        );
      case 86:
        return (0, import_error_message.formatDevErrorMessage)(
          "An action needs current authority to compare receipt revisions.",
          args
        );
      case 87:
        return (0, import_error_message.formatDevErrorMessage)(
          "An authority revision comparator must return a finite number.",
          args
        );
      case 88:
        return (0, import_error_message.formatDevErrorMessage)("The pinned query selection is no longer current.", args);
      case 89:
        return (0, import_error_message.formatDevErrorMessage)("optimistic$ requires an Octane signal source.", args);
      case 90:
        return (0, import_error_message.formatDevErrorMessage)(
          "An optimistic source cannot use conflicting authority revision policies.",
          args
        );
      case 91:
        return (0, import_error_message.formatDevErrorMessage)(
          "An optimistic subscription needs an active signal owner.",
          args
        );
      case 92:
        return (0, import_error_message.formatDevErrorMessage)(
          "An optimistic write must belong to action$ or use operation.set().",
          args
        );
      case 93:
        return (0, import_error_message.formatDevErrorMessage)('Action operation "%s" may have been accepted.', args);
      case 94:
        return (0, import_error_message.formatDevErrorMessage)(
          "action$ requires crypto.randomUUID() for operation identity.",
          args
        );
      case 95:
        return (0, import_error_message.formatDevErrorMessage)("operation.set() requires a signal from optimistic$().", args);
      case 96:
        return (0, import_error_message.formatDevErrorMessage)('Action operation "%s" is settled.', args);
      case 97:
        return (0, import_error_message.formatDevErrorMessage)(
          "operation.adopt() requires exactly one optimistic source.",
          args
        );
      case 98:
        return (0, import_error_message.formatDevErrorMessage)("The action is settled.", args);
      case 99:
        return (0, import_error_message.formatDevErrorMessage)("until() requires a read.", args);
      case 100:
        return (0, import_error_message.formatDevErrorMessage)("until() timeout must be a nonnegative number.", args);
      case 101:
        return (0, import_error_message.formatDevErrorMessage)("until() requires a pinned optimistic source.", args);
      case 102:
        return (0, import_error_message.formatDevErrorMessage)("The action is %s.", args);
      case 103:
        return (0, import_error_message.formatDevErrorMessage)("The optimistic owner was retired.", args);
      case 104:
        return (0, import_error_message.formatDevErrorMessage)("The pinned optimistic selection is no longer current.", args);
      case 105:
        return (0, import_error_message.formatDevErrorMessage)("The optimistic confirmation timed out.", args);
      case 106:
        return (0, import_error_message.formatDevErrorMessage)("optimistic$ requires a signal source.", args);
      case 107:
        return (0, import_error_message.formatDevErrorMessage)(
          "An authority revision policy must be a comparator function.",
          args
        );
      case 108:
        return (0, import_error_message.formatDevErrorMessage)(
          "action$ requires a handler and an optional nonempty key.",
          args
        );
      case 109:
        return (0, import_error_message.formatDevErrorMessage)("Attempt reads require an Octane signal handle.", args);
      case 110:
        return (0, import_error_message.formatDevErrorMessage)("Frozen derived candidates are not supported.", args);
      case 111:
        return (0, import_error_message.formatDevErrorMessage)("The derived attempt is no longer active.", args);
      case 112:
        return (0, import_error_message.formatDevErrorMessage)("A derived signal cannot read itself.", args);
      case 113:
        return (0, import_error_message.formatDevErrorMessage)('Signal "%s" has no selected value.', args);
      case 114:
        return (0, import_error_message.formatDevErrorMessage)("An async iterator must return an iteration result.", args);
      case 115:
        return (0, import_error_message.formatDevErrorMessage)("The stream completed without yielding a value.", args);
      case 116:
        return (0, import_error_message.formatDevErrorMessage)(
          "A signal control requires a native value/checked property and a signal.",
          args
        );
      case 117:
        return (0, import_error_message.formatDevErrorMessage)(
          "This control property already has a signal binding. Dispose it before rebinding.",
          args
        );
      case 118:
        return (0, import_error_message.formatDevErrorMessage)("A signal control subscription must return cleanup.", args);
      case 119:
        return (0, import_error_message.formatDevErrorMessage)("A checked signal must contain a boolean.", args);
      case 120:
        return (0, import_error_message.formatDevErrorMessage)("A multiple select signal must contain an array.", args);
      case 121:
        return (0, import_error_message.formatDevErrorMessage)("A value signal must contain a string.", args);
      case 122:
        return (0, import_error_message.formatDevErrorMessage)("derived$ requires a function.", args);
      case 123:
        return (0, import_error_message.formatDevErrorMessage)("A signal document owner requires a document.", args);
      case 124:
        return (0, import_error_message.formatDevErrorMessage)(
          "A streamed signal hydration owner is already installed.",
          args
        );
      case 125:
        return (0, import_error_message.formatDevErrorMessage)("%s must be a nonempty string.", args);
      case 126:
        return (0, import_error_message.formatDevErrorMessage)('A signal seed must match scope "%s" and version 1.', args);
      case 127:
        return (0, import_error_message.formatDevErrorMessage)(
          "Signal seeds require unique, valid ready node entries.",
          args
        );
      case 128:
        return (0, import_error_message.formatDevErrorMessage)(
          "An unavailable latest entry cannot contain a ready value or request.",
          args
        );
      case 129:
        return (0, import_error_message.formatDevErrorMessage)("Async seed entries require a query identity.", args);
      case 130:
        return (0, import_error_message.formatDevErrorMessage)("Only async seed entries may contain a query identity.", args);
      case 131:
        return (0, import_error_message.formatDevErrorMessage)(
          "Signal traceLimit must be an integer from 0 through 10000.",
          args
        );
      case 132:
        return (0, import_error_message.formatDevErrorMessage)('Signal key "%s" already exists in this scope.', args);
      case 133:
        return (0, import_error_message.formatDevErrorMessage)('Signal seed kind does not match "%s".', args);
      case 134:
        return (0, import_error_message.formatDevErrorMessage)('Signal key "%s" already has kind "%s".', args);
      case 135:
        return (0, import_error_message.formatDevErrorMessage)("Candidate frames require live, non-adopting nodes.", args);
      case 136:
        return (0, import_error_message.formatDevErrorMessage)(
          "Async derived candidates are not supported by this prototype.",
          args
        );
      case 137:
        return (0, import_error_message.formatDevErrorMessage)("A query resource requires a description.", args);
      case 138:
        return (0, import_error_message.formatDevErrorMessage)(
          "Read or write a signal through its owning scope or its handle.",
          args
        );
      case 139:
        return (0, import_error_message.formatDevErrorMessage)("A signal action requires a function.", args);
      case 140:
        return (0, import_error_message.formatDevErrorMessage)("Local hook scopes do not create SSR seeds.", args);
      case 141:
        return (0, import_error_message.formatDevErrorMessage)(
          "Distinct scopes in one presented graph need distinct scopeKey values.",
          args
        );
      case 142:
        return (0, import_error_message.formatDevErrorMessage)("Local hook scopes do not adopt shared-state seeds.", args);
      case 143:
        return (0, import_error_message.formatDevErrorMessage)("The signal adoption lease has been released.", args);
      case 144:
        return (0, import_error_message.formatDevErrorMessage)(
          'The presented frame has no compatible ready value for "%s".',
          args
        );
      case 145:
        return (0, import_error_message.formatDevErrorMessage)('The presented query definition does not match "%s".', args);
      case 146:
        return (0, import_error_message.formatDevErrorMessage)('Missing adoption frame for signal scope "%s".', args);
      case 147:
        return (0, import_error_message.formatDevErrorMessage)("createScope requires scopeKey.", args);
      case 148:
        return (0, import_error_message.formatDevErrorMessage)("A direct signal needs an Octane scope.", args);
      case 149:
        return (0, import_error_message.formatDevErrorMessage)("A direct derived signal needs an Octane scope.", args);
      case 150:
        return (0, import_error_message.formatDevErrorMessage)("A direct query needs an Octane scope.", args);
      case 151:
        return (0, import_error_message.formatDevErrorMessage)('Signal scope "%s" has been disposed.', args);
      case 152:
        return (0, import_error_message.formatDevErrorMessage)(
          "Signals cannot be changed during a computation, render, or adoption frame.",
          args
        );
      case 153:
        return (0, import_error_message.formatDevErrorMessage)(
          'Signal "%s" depends on its own unfinished computation.',
          args
        );
      case 154:
        return (0, import_error_message.formatDevErrorMessage)('Streamed signal failed with code "%s".', args);
      case 155:
        return (0, import_error_message.formatDevErrorMessage)(
          "Initial document signals require an implicit document owner.",
          args
        );
      case 156:
        return (0, import_error_message.formatDevErrorMessage)(
          "Initial document signals must be installed once, before any signal reads or writes.",
          args
        );
      case 157:
        return (0, import_error_message.formatDevErrorMessage)("A document lifecycle requires its document owner.", args);
      case 158:
        return (0, import_error_message.formatDevErrorMessage)(
          "A module signal needs an active signal owner. Render it in an Octane root or use runWithSignalOwner().",
          args
        );
      case 159:
        return (0, import_error_message.formatDevErrorMessage)(
          "Module signal identity is assigned by the Octane compiler. Use an explicit key outside compiled code.",
          args
        );
      case 160:
        return (0, import_error_message.formatDevErrorMessage)("Signal declaration options must be an object.", args);
      case 161:
        return (0, import_error_message.formatDevErrorMessage)("A signal declaration key must be a nonempty string.", args);
      case 162:
        return (0, import_error_message.formatDevErrorMessage)("A signal binding requires a signal handle.", args);
      case 163:
        return (0, import_error_message.formatDevErrorMessage)("Only an async signal can be retried.", args);
      case 164:
        return (0, import_error_message.formatDevErrorMessage)("Only a writable signal accepts set().", args);
      case 165:
        return (0, import_error_message.formatDevErrorMessage)("A signal subscriber must be a function.", args);
      case 166:
        return (0, import_error_message.formatDevErrorMessage)("derived$ requires a synchronous computation.", args);
      case 170:
        return (0, import_error_message.formatDevErrorMessage)(
          "Initial document signals require a matching version 1 scope seed.",
          args
        );
      case 171:
        return (0, import_error_message.formatDevErrorMessage)(
          "Initial document signals require unique, valid node entries.",
          args
        );
      case 172:
        return (0, import_error_message.formatDevErrorMessage)(
          "Unavailable initial document entries cannot contain ready data.",
          args
        );
      case 173:
        return (0, import_error_message.formatDevErrorMessage)(
          "Initial document async entries require a query identity.",
          args
        );
      case 174:
        return (0, import_error_message.formatDevErrorMessage)(
          "Only initial document async entries may contain a query identity.",
          args
        );
      case 175:
        return (0, import_error_message.formatDevErrorMessage)(
          "Native signal revisions changed during server rendering.",
          args
        );
      case 176:
        return (0, import_error_message.formatDevErrorMessage)(
          "Native signal revisions changed before server output was accepted.",
          args
        );
      case 177:
        return (0, import_error_message.formatDevErrorMessage)(
          "Native signal revisions changed during server serialization.",
          args
        );
      case 178:
        return (0, import_error_message.formatDevErrorMessage)(
          "A completed native server read has no serializable ready value.",
          args
        );
      case 179:
        return (0, import_error_message.formatDevErrorMessage)("Multiple data scopes claim native server key %s.", args);
      case 180:
        return (0, import_error_message.formatDevErrorMessage)("Conflicting native signal seed for %s:%s.", args);
      case 181:
        return (0, import_error_message.formatDevErrorMessage)("Invalid native signal hydration manifest.", args);
      case 182:
        return (0, import_error_message.formatDevErrorMessage)("Invalid or duplicate native signal hydration scope.", args);
      case 183:
        return (0, import_error_message.formatDevErrorMessage)("Invalid initial document signal references.", args);
      case 184:
        return (0, import_error_message.formatDevErrorMessage)(
          "Invalid or duplicate initial document signal reference.",
          args
        );
      case 185:
        return (0, import_error_message.formatDevErrorMessage)(
          "Native signal hydration requires its initial document signal seed.",
          args
        );
      case 186:
        return (0, import_error_message.formatDevErrorMessage)(
          "Missing or duplicate initial document signal reference.",
          args
        );
      case 187:
        return (0, import_error_message.formatDevErrorMessage)(
          "Overlapping initial document signal reference and boundary history.",
          args
        );
      case 188:
        return (0, import_error_message.formatDevErrorMessage)("Multiple data scopes claim native hydration key %s.", args);
      case 189:
        return (0, import_error_message.formatDevErrorMessage)(
          "A signal owner environment requires current, run, and capture.",
          args
        );
      case 190:
        return (0, import_error_message.formatDevErrorMessage)("A default signal owner requires a provider.", args);
      case 191:
        return (0, import_error_message.formatDevErrorMessage)("A signal owner callback is required.", args);
      case 192:
        return (0, import_error_message.formatDevErrorMessage)(
          "A server signal query observer requires an observation factory.",
          args
        );
      case 193:
        return (0, import_error_message.formatDevErrorMessage)("query$ requires selector and loader functions.", args);
      case 194:
        return (0, import_error_message.formatDevErrorMessage)("Native hydration has no %s seed for %s:%s.", args);
      case 195:
        return (0, import_error_message.formatDevErrorMessage)("query requires a nonempty key and a loader function.", args);
      case 196:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported signal query kind.", args);
      case 197:
        return (0, import_error_message.formatDevErrorMessage)(
          "The streamed signal completed without yielding a value.",
          args
        );
      case 198:
        return (0, import_error_message.formatDevErrorMessage)("A stream query must return an async iterable.", args);
      case 199:
        return (0, import_error_message.formatDevErrorMessage)("A stream query returned an invalid iterator.", args);
      case 200:
        return (0, import_error_message.formatDevErrorMessage)("A resource must describe a query request.", args);
      case 201:
        return (0, import_error_message.formatDevErrorMessage)(
          "Streamed candidates are not supported by this prototype.",
          args
        );
      case 202:
        return (0, import_error_message.formatDevErrorMessage)('Incompatible query definitions use the same key "%s".', args);
      case 203:
        return (0, import_error_message.formatDevErrorMessage)("The signal candidate has retired.", args);
      case 204:
        return (0, import_error_message.formatDevErrorMessage)("The request description is still pending.", args);
      case 205:
        return (0, import_error_message.formatDevErrorMessage)("Frozen scalar candidates are not supported.", args);
      case 206:
        return (0, import_error_message.formatDevErrorMessage)("Nested signal candidates are not supported.", args);
      case 207:
        return (0, import_error_message.formatDevErrorMessage)("Only live candidate-capable owners are supported.", args);
      case 208:
        return (0, import_error_message.formatDevErrorMessage)("Rebase the signal candidate before writing.", args);
      case 209:
        return (0, import_error_message.formatDevErrorMessage)("Native signal presentation is not installed.", args);
      case 210:
        return (0, import_error_message.formatDevErrorMessage)("The candidate owner changed lifetime.", args);
      case 211:
        return (0, import_error_message.formatDevErrorMessage)("Candidate dependency escaped its frame.", args);
      case 213:
        return (0, import_error_message.formatDevErrorMessage)(
          "A signal document lifecycle requires a live document and build identity.",
          args
        );
      case 214:
        return (0, import_error_message.formatDevErrorMessage)(
          "Early independent Hydrate intent queue overflow; reload the document.",
          args
        );
      case 215:
        return (0, import_error_message.formatDevErrorMessage)("Invalid independent Hydrate manifest.", args);
      case 216:
        return (0, import_error_message.formatDevErrorMessage)("Independent Hydrate boundary identity mismatch.", args);
      case 217:
        return (0, import_error_message.formatDevErrorMessage)(
          "Independent Hydrate activation export is not a function.",
          args
        );
      case 218:
        return (0, import_error_message.formatDevErrorMessage)("Invalid independent Hydrate sidecar.", args);
      case 219:
        return (0, import_error_message.formatDevErrorMessage)("Independent Hydrate build identity mismatch.", args);
      case 220:
        return (0, import_error_message.formatDevErrorMessage)("Independent Hydrate sidecar has no boundary.", args);
      case 221:
        return (0, import_error_message.formatDevErrorMessage)("Independent Hydrate boundary already registered.", args);
      case 222:
        return (0, import_error_message.formatDevErrorMessage)(
          "Streamed renderer response limits must be positive safe integers.",
          args
        );
      case 223:
        return (0, import_error_message.formatDevErrorMessage)("A streamed renderer frame exceeded its byte budget.", args);
      case 224:
        return (0, import_error_message.formatDevErrorMessage)(
          "Streamed renderer delivery exceeded its pending budget.",
          args
        );
      case 225:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer delivery timed out.", args);
      case 226:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer delivery failed.", args);
      case 227:
        return (0, import_error_message.formatDevErrorMessage)(
          "An Octane streamed renderer receiver is already installed in this realm.",
          args
        );
      case 228:
        return (0, import_error_message.formatDevErrorMessage)("The pre-module streamed renderer mailbox overflowed.", args);
      case 229:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer exceeded its open result budget.", args);
      case 230:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer result timed out.", args);
      case 231:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer entrypoint was removed.", args);
      case 232:
        return (0, import_error_message.formatDevErrorMessage)("The streamed renderer response has no body.", args);
      case 233:
        return (0, import_error_message.formatDevErrorMessage)("Malformed streamed renderer frame.", args);
      case 234:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer response was canceled.", args);
      case 235:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer response timed out.", args);
      case 236:
        return (0, import_error_message.formatDevErrorMessage)(
          "The streamed renderer response exceeded its total byte budget.",
          args
        );
      case 237:
        return (0, import_error_message.formatDevErrorMessage)("The streamed renderer response ended mid-frame.", args);
      case 238:
        return (0, import_error_message.formatDevErrorMessage)(
          "The streamed renderer response ended before a result terminal.",
          args
        );
      case 239:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer response failed.", args);
      case 240:
        return (0, import_error_message.formatDevErrorMessage)("The streamed region range is detached.", args);
      case 241:
        return (0, import_error_message.formatDevErrorMessage)("The streamed region range is malformed.", args);
      case 242:
        return (0, import_error_message.formatDevErrorMessage)('Duplicate streamed control key "%s".', args);
      case 243:
        return (0, import_error_message.formatDevErrorMessage)("A full streamed region must be one balanced range.", args);
      case 244:
        return (0, import_error_message.formatDevErrorMessage)('Streamed HTML cannot preserve live control "%s".', args);
      case 245:
        return (0, import_error_message.formatDevErrorMessage)("Required streamed region styles are unavailable.", args);
      case 246:
        return (0, import_error_message.formatDevErrorMessage)("Historical read-frame adoption failed.", args);
      case 247:
        return (0, import_error_message.formatDevErrorMessage)("This region does not support renderer deltas.", args);
      case 248:
        return (0, import_error_message.formatDevErrorMessage)("Register the exact current selection first.", args);
      case 249:
        return (0, import_error_message.formatDevErrorMessage)("The streamed region markers do not share a parent.", args);
      case 250:
        return (0, import_error_message.formatDevErrorMessage)(
          "Streamed region content revisions must be nonnegative safe integers.",
          args
        );
      case 251:
        return (0, import_error_message.formatDevErrorMessage)(
          "Stream receiver limits must be positive safe integers.",
          args
        );
      case 252:
        return (0, import_error_message.formatDevErrorMessage)("Streamed result timed out.", args);
      case 253:
        return (0, import_error_message.formatDevErrorMessage)("Invalid streamed selection identity.", args);
      case 254:
        return (0, import_error_message.formatDevErrorMessage)("Streamed selection has the wrong authority.", args);
      case 255:
        return (0, import_error_message.formatDevErrorMessage)("Cannot attach a result to a stale selection.", args);
      case 256:
        return (0, import_error_message.formatDevErrorMessage)("A streamed result already has a consumer.", args);
      case 257:
        return (0, import_error_message.formatDevErrorMessage)("Invalid or duplicate streamed result sequence.", args);
      case 258:
        return (0, import_error_message.formatDevErrorMessage)("A streamed result must begin with open.", args);
      case 259:
        return (0, import_error_message.formatDevErrorMessage)("A streamed result cannot open twice.", args);
      case 260:
        return (0, import_error_message.formatDevErrorMessage)("A promise result emitted more than one value.", args);
      case 261:
        return (0, import_error_message.formatDevErrorMessage)("A promise result completed without one value.", args);
      case 262:
        return (0, import_error_message.formatDevErrorMessage)("Streamed result mailbox exceeded its bound.", args);
      case 263:
        return (0, import_error_message.formatDevErrorMessage)("Invalid or duplicate placement sequence.", args);
      case 264:
        return (0, import_error_message.formatDevErrorMessage)("Streamed renderer frame failed.", args);
      case 265:
        return (0, import_error_message.formatDevErrorMessage)("Streamed receiver was disposed.", args);
      case 266:
        return (0, import_error_message.formatDevErrorMessage)(
          "Streamed signal hydration requires buildId and documentId.",
          args
        );
      case 267:
        return (0, import_error_message.formatDevErrorMessage)(
          "The streamed signal selection bootstrap is missing or incompatible.",
          args
        );
      case 268:
        return (0, import_error_message.formatDevErrorMessage)(
          "The pre-module streamed signal selection mailbox overflowed.",
          args
        );
      case 269:
        return (0, import_error_message.formatDevErrorMessage)("A streamed signal selection has the wrong authority.", args);
      case 270:
        return (0, import_error_message.formatDevErrorMessage)(
          "Document initialization requires full initial signal scopes.",
          args
        );
      case 277:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding hydration lease must be active and have only one root owner.",
          args
        );
      case 306:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation key must be a string or finite number.",
          args
        );
      case 307:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation key has invalid serialized identity.",
          args
        );
      case 331:
        return (0, import_error_message.formatDevErrorMessage)("Invalid independent Hydrate manifest inputs.", args);
      case 332:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: a component kept throwing already-settled thenables outside use() for %sms. A resource reader should stop suspending once its data has settled.",
          args
        );
      case 333:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: exceeded %s suspense passes \u2014 a component kept throwing thenables outside use(). A resource reader should stop suspending once its data has settled.",
          args
        );
      case 334:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: %s consecutive streaming passes completed no boundary \u2014 a component kept throwing thenables outside use(). A resource reader should stop suspending once its data has settled.",
          args
        );
      case 335:
        return (0, import_error_message.formatDevErrorMessage)(
          "octane SSR: %s root streaming passes completed without producing a shell \u2014 a component kept throwing thenables outside use(). A resource reader should stop suspending once its data has settled.",
          args
        );
      default:
        return (0, import_error_message.formatUnknownDevErrorMessage)(code);
    }
  }
  return (0, import_error_message.formatProdErrorMessage)(code, args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatServerError
});
