function StrictMode(props) {
  return props.children;
}
function unstable_batchedUpdates(callback, ...args) {
  return callback(...args);
}
export {
  StrictMode,
  unstable_batchedUpdates
};
