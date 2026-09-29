const neverType = "never";
const neverStrategy = {
  _t: neverType,
  _d: () => true
};
// @__NO_SIDE_EFFECTS__
function never() {
  return neverStrategy;
}
export {
  never
};
