import {
  HYDRATE_DEFAULT_INTERACTION_EVENTS,
  HYDRATE_INTERACTION_EVENTS_ATTR
} from "./interaction-config.js";
const interactionType = "interaction";
// @__NO_SIDE_EFFECTS__
function interaction(options = {}) {
  let events = HYDRATE_DEFAULT_INTERACTION_EVENTS;
  if (options.events !== void 0) {
    const input = typeof options.events === "string" ? [options.events] : options.events;
    events = [...new Set(input.filter(Boolean))];
  }
  const eventKey = events.join(" ");
  return {
    _t: interactionType,
    _s: ({ element, gate, prefetch }) => {
      if (!element || events.length === 0) return;
      const callback = prefetch ?? gate?.resolve;
      if (!callback) return;
      const onIntent = () => callback();
      for (const eventName of events) {
        element.addEventListener(eventName, onIntent, true);
      }
      return () => {
        for (const eventName of events) {
          element.removeEventListener(eventName, onIntent, true);
        }
      };
    },
    _a: () => options.events === void 0 ? void 0 : { [HYDRATE_INTERACTION_EVENTS_ATTR]: eventKey }
  };
}
export {
  interaction
};
