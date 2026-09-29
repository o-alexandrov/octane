import { ReactCompat } from "./react-compat-server.js";
import { bridgeReactContext } from "./react-compat-shared.js";
import * as React from "react";
import { createElement as createOctaneServerElement } from "../server/index.js";
import {
  createHostedServerSession,
  renderHostedAttempt
} from "../runtime.server.js";
import {
  resolveHostedIsland
} from "./shared.js";
function hostedServerEnvelope(props) {
  const config = props.bodyKey === null ? props.bodyProps : { ...props.bodyProps, key: props.bodyKey };
  return createOctaneServerElement(props.body, config);
}
const SESSIONS = /* @__PURE__ */ new WeakMap();
function sessionFor(key) {
  let session = SESSIONS.get(key);
  if (session === void 0) {
    session = createHostedServerSession();
    SESSIONS.set(key, session);
  }
  return session;
}
function OctaneCompat(props) {
  const child = resolveHostedIsland(props);
  const identifierPrefix = React.useId();
  const session = sessionFor(props);
  for (const stratum of session.strata) React.use(stratum);
  const attempt = renderHostedAttempt(
    session,
    hostedServerEnvelope,
    { body: child.type, bodyProps: child.props, bodyKey: child.key },
    {
      identifierPrefix,
      // §6.4: the hosted context reader IS React's — nearest provider,
      // defaults, and Fizz semantics come along for free.
      readForeignContext: (context) => React.use(context)
    }
  );
  if (attempt.status === "suspended") {
    React.use(attempt.stratum);
  }
  if (attempt.status !== "complete") {
    throw new Error("octane/react/server: hosted attempt did not complete.");
  }
  if (attempt.head.length > 0) {
    throw new Error(
      "<OctaneCompat> islands cannot hoist <title>/<meta>/<link> to the document head during React SSR yet; render head resources from the React tree instead."
    );
  }
  const children = [];
  for (const [hash, sheet] of attempt.cssEntries) {
    children.push(
      React.createElement(
        "style",
        {
          key: `css-${hash}`,
          href: `octane-${hash}`,
          precedence: "octane",
          nonce: sheet.nonce
        },
        sheet.css
      )
    );
  }
  children.push(
    React.createElement("div", {
      key: "host",
      "data-octane-compat": "",
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: { __html: attempt.html }
    })
  );
  return React.createElement(React.Fragment, null, ...children);
}
export {
  OctaneCompat,
  ReactCompat,
  bridgeReactContext
};
