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
var dom_focused_move_exports = {};
__export(dom_focused_move_exports, {
  moveNativeNodeBefore: () => moveNativeNodeBefore
});
module.exports = __toCommonJS(dom_focused_move_exports);
function moveNativeNodeBefore(parent, node, anchor, focused, contentEditable) {
  let containsFocused = node === focused;
  if (!containsFocused && focused !== null && node.nodeType === 1) {
    let candidate = focused;
    do {
      if (node.contains(candidate)) {
        containsFocused = true;
        break;
      }
      candidate = candidate.getRootNode().host;
    } while (candidate !== void 0);
  }
  if (!containsFocused) {
    parent.insertBefore(node, anchor);
    return;
  }
  const moveBefore = parent.moveBefore;
  if (!contentEditable && typeof moveBefore === "function") {
    moveBefore.call(parent, node, anchor);
    return;
  }
  if (node.parentNode !== parent || anchor !== null && anchor.parentNode !== parent) {
    parent.insertBefore(node, anchor);
    return;
  }
  if (node === anchor || node.nextSibling === anchor) return;
  if (anchor === null || (node.compareDocumentPosition(anchor) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
    let cursor = node.nextSibling;
    while (cursor !== anchor) {
      const next = cursor.nextSibling;
      parent.insertBefore(cursor, node);
      cursor = next;
    }
  } else {
    const end = node.nextSibling;
    let cursor = anchor;
    while (cursor !== node) {
      const next = cursor.nextSibling;
      parent.insertBefore(cursor, end);
      cursor = next;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  moveNativeNodeBefore
});
