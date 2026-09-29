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
var error_codes_client_generated_exports = {};
__export(error_codes_client_generated_exports, {
  formatClientError: () => formatClientError
});
module.exports = __toCommonJS(error_codes_client_generated_exports);
var import_error_message = require("./error-message.cjs");
const __octaneDev = process.env.NODE_ENV !== "production";
function formatClientError(code, ...args) {
  if (__octaneDev) {
    switch (code) {
      case 1:
        return (0, import_error_message.formatDevErrorMessage)(
          "Maximum update depth exceeded. Octane limits the number of nested updates to prevent infinite loops.",
          args
        );
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
      case 13:
        return (0, import_error_message.formatDevErrorMessage)("Multiple errors were thrown during the render flush.", args);
      case 14:
        return (0, import_error_message.formatDevErrorMessage)(
          "act(): scheduler did not stabilize after %s iterations \u2014 likely an infinite render loop",
          args
        );
      case 15:
        return (0, import_error_message.formatDevErrorMessage)(
          "%s was called without a hook slot. The octane compiler injects per-call-site keys; ensure your project loads this runtime through the Vite plugin (octane/compiler/vite). To call hooks by hand, pass a stable symbol, e.g. useState(0, Symbol.for('my-stable-id')).",
          args
        );
      case 16:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydrate: `when` must synchronously return a hydration strategy with a valid type.",
          args
        );
      case 17:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydrate: the compiler-generated child loader did not resolve to a component.",
          args
        );
      case 18:
        return (0, import_error_message.formatDevErrorMessage)(
          "%s(): a React context can only be read inside a React-hosted Octane island (see octane/react); this component is not rendered under one.",
          args
        );
      case 19:
        return (0, import_error_message.formatDevErrorMessage)(
          "A renderer-owned DOM region is missing its universal owner bridge.",
          args
        );
      case 20:
        return (0, import_error_message.formatDevErrorMessage)(
          "bindRendererRegionOwner() must run while a DOM component is rendering.",
          args
        );
      case 21:
        return (0, import_error_message.formatDevErrorMessage)(
          "bindRendererRegionOwner() must be the first call in a renderer-owned DOM root component.",
          args
        );
      case 22:
        return (0, import_error_message.formatDevErrorMessage)("A renderer-owned DOM region requires a live DOM root.", args);
      case 23:
        return (0, import_error_message.formatDevErrorMessage)("Server-rendered use() rejected", args);
      case 24:
        return (0, import_error_message.formatDevErrorMessage)(
          "Element type is invalid: expected a string (for a built-in element) or a function (for a component), but got: %s.",
          args
        );
      case 25:
        return (0, import_error_message.formatDevErrorMessage)(
          "Octane: internal \u2014 a component descriptor reached the de-opt host reconciler (should have been routed through a Block via hostElementBody/componentSlot).",
          args
        );
      case 26:
        return (0, import_error_message.formatDevErrorMessage)(
          "`<%s>` is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.",
          args
        );
      case 27:
        return (0, import_error_message.formatDevErrorMessage)(
          "A hosted foreign-context request escaped its renderer-region owner; the owning bridge is gone or declined it.",
          args
        );
      case 29:
        return (0, import_error_message.formatDevErrorMessage)("Cannot update an unmounted root.", args);
      case 46:
        return (0, import_error_message.formatDevErrorMessage)(
          "Expected %s listener to be a function, instead got a value of `%s` type.",
          args
        );
      case 49:
        return (0, import_error_message.formatDevErrorMessage)(
          "FragmentInstance.scrollIntoView() does not support scrollIntoViewOptions. Use the alignToTop boolean instead.",
          args
        );
      case 50:
        return (0, import_error_message.formatDevErrorMessage)("Unclosed server-rendered Fragment descriptor.", args);
      case 51:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the server-rendered node did not match the client render; the mismatched subtree was rebuilt on the client.",
          args
        );
      case 52:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: root adoption was abandoned after a server/client shape divergence; the root was rebuilt on the client.",
          args
        );
      case 53:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the server rendered more root content than the client; the stale remainder was discarded.",
          args
        );
      case 54:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the client rendered text where the server rendered none; the client text was built fresh.",
          args
        );
      case 55:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the server rendered a different child shape where the client renders a component; the stale range was discarded and the component was built on the client.",
          args
        );
      case 56:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the server rendered more list items than the client; the extra server items were discarded.",
          args
        );
      case 58:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported native-read compiler/runtime version.", args);
      case 61:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the server-rendered text differed from the client; the text was updated to the client value.",
          args
        );
      case 62:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration mismatch: the server rendered extra children in a text element; the stale children were discarded.",
          args
        );
      case 63:
        return (0, import_error_message.formatDevErrorMessage)(
          "Target container is not a DOM element. Pass an Element, Document, or DocumentFragment. If document.body is null after document hydration, update the existing document root or render a document shell containing <body>.",
          args
        );
      case 64:
        return (0, import_error_message.formatDevErrorMessage)("Multiple errors were thrown during act.", args);
      case 66:
        return (0, import_error_message.formatDevErrorMessage)(
          "An independent Hydrate boundary cannot change ownership after mount.",
          args
        );
      case 67:
        return (0, import_error_message.formatDevErrorMessage)('Signal control identity mismatch for "%s".', args);
      case 72:
        return (0, import_error_message.formatDevErrorMessage)(
          "Octane DOM binding text range does not match its template.",
          args
        );
      case 74:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported Octane signal binding ABI.", args);
      case 75:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration binding leases require a supported fixed native view without structural regions or unsupported writers.",
          args
        );
      case 76:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM binding hydration leases are supported only by hydrateRoot().",
          args
        );
      case 77:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration binding leases require active fixed native views owned by this container.",
          args
        );
      case 78:
        return (0, import_error_message.formatDevErrorMessage)("A hydration binding lease can be claimed only once.", args);
      case 79:
        return (0, import_error_message.formatDevErrorMessage)("Unsupported native signal transition.", args);
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
      case 167:
        return (0, import_error_message.formatDevErrorMessage)(
          "A completed native render requires a renderer transaction.",
          args
        );
      case 168:
        return (0, import_error_message.formatDevErrorMessage)("Native reads require a renderer transaction.", args);
      case 169:
        return (0, import_error_message.formatDevErrorMessage)("A native capture must be accepted before publication.", args);
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
      case 212:
        return (0, import_error_message.formatDevErrorMessage)("The native read candidate has retired.", args);
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
      case 271:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM class groups require a valid compiler-issued class receipt.",
          args
        );
      case 272:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM host cannot mix class groups from different binding views.",
          args
        );
      case 273:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM class group does not match its compiler-issued receipt.",
          args
        );
      case 274:
        return (0, import_error_message.formatDevErrorMessage)("This DOM class group already has a binding.", args);
      case 275:
        return (0, import_error_message.formatDevErrorMessage)("Cannot prepare a disposed DOM class group.", args);
      case 276:
        return (0, import_error_message.formatDevErrorMessage)(
          "Cannot commit an outdated DOM class group preparation.",
          args
        );
      case 277:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding hydration lease must be active and have only one root owner.",
          args
        );
      case 278:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation ref must be a callback, object, or ref array.",
          args
        );
      case 279:
        return (0, import_error_message.formatDevErrorMessage)("A native event binding must resolve to a function.", args);
      case 280:
        return (0, import_error_message.formatDevErrorMessage)(
          "Conditional hydration requires a compiler-proven caller shape.",
          args
        );
      case 281:
        return (0, import_error_message.formatDevErrorMessage)(
          "Structural hydration leases require compiler-owned native nodes.",
          args
        );
      case 282:
        return (0, import_error_message.formatDevErrorMessage)(
          "Native rest hydration requires an eligible closed child view.",
          args
        );
      case 283:
        return (0, import_error_message.formatDevErrorMessage)(
          "Structural hydration leases do not support lists or opaque regions.",
          args
        );
      case 284:
        return (0, import_error_message.formatDevErrorMessage)("Structural hydration leases require primitive text.", args);
      case 285:
        return (0, import_error_message.formatDevErrorMessage)(
          "Structural hydration leases require a supported child view.",
          args
        );
      case 286:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM presentation cannot adopt mismatched compiler-owned ranges or nodes.",
          args
        );
      case 287:
        return (0, import_error_message.formatDevErrorMessage)(
          "This opaque view cannot be constructed without its external owner.",
          args
        );
      case 288:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation projection must return its synchronous scalar values.",
          args
        );
      case 289:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation signal text requires a primitive value.",
          args
        );
      case 290:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation initializer must return its synchronous scalar values.",
          args
        );
      case 291:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation branch projection returned an unknown arm.",
          args
        );
      case 292:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation child slot requires a compiler-owned fragment.",
          args
        );
      case 293:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation activation must return cleanup or undefined.",
          args
        );
      case 294:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM presentation requires synchronous getSnapshot() and subscribe() methods.",
          args
        );
      case 295:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation mount requires a parent and its optional insertion anchor.",
          args
        );
      case 296:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM presentation requires a synchronous snapshot, not a thenable.",
          args
        );
      case 297:
        return (0, import_error_message.formatDevErrorMessage)(
          "Hydration binding leases require an adopted fixed native view without structural regions or controls.",
          args
        );
      case 298:
        return (0, import_error_message.formatDevErrorMessage)(
          "This DOM presentation range already has a binding. Dispose it before rebinding.",
          args
        );
      case 299:
        return (0, import_error_message.formatDevErrorMessage)("A DOM presentation subscription must return cleanup.", args);
      case 300:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation list requires a synchronous iterable.",
          args
        );
      case 301:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM presentation list cannot contain duplicate keys.",
          args
        );
      case 302:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM control binding requires its compiler-selected adapter.",
          args
        );
      case 303:
        return (0, import_error_message.formatDevErrorMessage)(
          "A constructible class group requires its compiler baseline initializer.",
          args
        );
      case 304:
        return (0, import_error_message.formatDevErrorMessage)("A DOM projection subscription must return cleanup.", args);
      case 305:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding projection group requires a computation.",
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
      case 308:
        return (0, import_error_message.formatDevErrorMessage)(
          "Octane DOM bindings: an imported signal accessor performed a live read without a subscription; bind the handle directly or pass an explicit sample through BindingSource.",
          args
        );
      case 309:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding signal requires the native binding protocol.",
          args
        );
      case 310:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding signal subscription must return cleanup.",
          args
        );
      case 311:
        return (0, import_error_message.formatDevErrorMessage)(
          "A whole-style DOM binding requires a style object, CSS text or null.",
          args
        );
      case 312:
        return (0, import_error_message.formatDevErrorMessage)("A DOM style subscription must return cleanup.", args);
      case 313:
        return (0, import_error_message.formatDevErrorMessage)(
          "adoptBindings() requires an Octane-compiled .tsrx or .tsx call and a supported static view.",
          args
        );
      case 314:
        return (0, import_error_message.formatDevErrorMessage)(
          "mountBindings() requires an Octane-compiled .tsrx or .tsx call.",
          args
        );
      case 315:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM class token binding requires one nonempty class token.",
          args
        );
      case 316:
        return (0, import_error_message.formatDevErrorMessage)(
          "This DOM property already has a binding. Dispose it before rebinding.",
          args
        );
      case 317:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings require the matching compiler-stamped root.",
          args
        );
      case 318:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings cannot adopt a mismatched static element topology.",
          args
        );
      case 319:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings cannot adopt an incomplete static element topology.",
          args
        );
      case 320:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings require unique compiler-issued target addresses.",
          args
        );
      case 321:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings cannot adopt a mismatched addressed element topology.",
          args
        );
      case 322:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings cannot adopt an incomplete addressed element topology.",
          args
        );
      case 323:
        return (0, import_error_message.formatDevErrorMessage)("DOM binding text must be a synchronous scalar.", args);
      case 324:
        return (0, import_error_message.formatDevErrorMessage)(
          "A whole-style DOM binding requires serialized CSS text or null.",
          args
        );
      case 325:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings require synchronous getSnapshot() and subscribe() methods.",
          args
        );
      case 326:
        return (0, import_error_message.formatDevErrorMessage)(
          "DOM bindings require a synchronous snapshot, not a thenable.",
          args
        );
      case 327:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding projection must return its synchronous scalar values.",
          args
        );
      case 328:
        return (0, import_error_message.formatDevErrorMessage)("A DOM binding targets an unknown element.", args);
      case 329:
        return (0, import_error_message.formatDevErrorMessage)(
          "A DOM binding subscription must return a cleanup function.",
          args
        );
      case 330:
        return (0, import_error_message.formatDevErrorMessage)("This DOM binding view requires the general adopter.", args);
      case 331:
        return (0, import_error_message.formatDevErrorMessage)("Invalid independent Hydrate manifest inputs.", args);
      default:
        return (0, import_error_message.formatUnknownDevErrorMessage)(code);
    }
  }
  return (0, import_error_message.formatProdErrorMessage)(code, args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatClientError
});
