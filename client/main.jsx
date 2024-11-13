import { startRooter } from "../lib/router.js";
import { counter } from "./home.jsx";
import { hydrateInteractiveComponents } from "../lib/client-utils.jsx";
import { about } from "./about.jsx";

startRooter();

//helpers
window.isBrowser = typeof document !== "undefined";

//CLIENT HYDRATION
//if dev mode we hydrate the whole route for fast refresh
//in prod only interactive components are hydrated on the corresponding element
if (window.isBrowser) {
  // if (!window.dev) hydrate(<App>{routes[getPathname()] || routes.default}</App>, document);
  // else  hydrateInteractiveComponents(document, [counter, about]);
  hydrateInteractiveComponents(document, [counter, about]);
}
