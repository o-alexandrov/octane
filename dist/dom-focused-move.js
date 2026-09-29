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
export {
  moveNativeNodeBefore
};
