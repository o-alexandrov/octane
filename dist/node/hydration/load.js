const loadType = "load";
const loadStrategy = {
  _t: loadType,
  _d: () => false,
  _s: ({ gate, prefetch }) => {
    (prefetch ?? gate?.resolve)?.();
  }
};
// @__NO_SIDE_EFFECTS__
function load() {
  return loadStrategy;
}
export {
  load
};
