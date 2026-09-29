const conditionType = "condition";
// @__NO_SIDE_EFFECTS__
function condition(conditionValue) {
  const read = () => typeof conditionValue === "function" ? conditionValue() : conditionValue;
  return {
    _t: conditionType,
    _d: () => !read(),
    _s: ({ gate }) => {
      if (read()) gate?.resolve();
    }
  };
}
export {
  condition
};
