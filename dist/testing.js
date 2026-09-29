import { flushSync } from "./runtime.js";
function clampJsdomScrollTop(element) {
  const scrollTop = Number.isFinite(element.scrollTop) ? element.scrollTop : 0;
  const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
  const clampedScrollTop = Math.min(maxScrollTop, Math.max(0, scrollTop));
  if (clampedScrollTop === element.scrollTop) return;
  flushSync(() => {
    element.scrollTop = clampedScrollTop;
    element.dispatchEvent(new Event("scroll"));
  });
}
export {
  clampJsdomScrollTop
};
