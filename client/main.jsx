import { counter } from "./home.jsx";
import { hydrateInteractiveComponents } from "../lib/client-utils.jsx";
import { about } from "./about.jsx";
import { startRouter } from "lightweight-router";

startRouter({
  onRouteChange: currentPath => hydrateInteractiveComponents(document.querySelector(`route[path="${currentPath}"]`), [counter, about]),
});

//helpers
window.isBrowser = typeof document !== "undefined";

//CLIENT HYDRATION
if (globalThis.isBrowser) hydrateInteractiveComponents(document, [counter, about]);
