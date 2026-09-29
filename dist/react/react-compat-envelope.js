import * as React from "react";
class IslandErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    this.props.observer?.error(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function isReactCompatErrorBoundary(value) {
  return value instanceof IslandErrorBoundary;
}
const PARKED = new Promise(() => {
});
function VisibilityGate(props) {
  if (props.visibility === "suspense") throw PARKED;
  return props.children;
}
function PendingProbe({
  observer,
  visibility
}) {
  React.useLayoutEffect(() => {
    observer?.pending(visibility);
  }, [observer, visibility]);
  React.useInsertionEffect(() => {
    return () => observer?.ready();
  }, [observer]);
  return null;
}
function ContentProbe(props) {
  React.useInsertionEffect(() => {
    props.observer?.ready();
  }, [props.observer]);
  React.useLayoutEffect(() => {
    props.observer?.ready();
  }, [props.observer]);
  return props.children;
}
function createReactCompatTree(child, contexts, observer, visibility = "visible") {
  if (React.Activity === void 0) {
    throw new Error(
      "<ReactCompat> requires React and React DOM 19.2 or newer in the React 19 series."
    );
  }
  let content = child;
  for (let index = contexts.length - 1; index >= 0; index--) {
    const entry = contexts[index];
    content = React.createElement(entry.context, { value: entry.value }, content);
  }
  return React.createElement(
    // Keep the transport error callback connected while the island is hidden.
    // Otherwise a cleanup error can wait for reveal and be lost on deletion.
    IslandErrorBoundary,
    { observer },
    React.createElement(
      React.Activity,
      { mode: visibility === "activity" ? "hidden" : "visible", children: void 0 },
      React.createElement(
        React.Suspense,
        { fallback: React.createElement(PendingProbe, { observer, visibility }) },
        React.createElement(
          VisibilityGate,
          { visibility },
          React.createElement(ContentProbe, { observer }, content)
        )
      )
    )
  );
}
export {
  createReactCompatTree,
  isReactCompatErrorBoundary
};
