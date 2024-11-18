import { counter } from "./home.jsx";
import { hydrateInteractiveComponents } from "../lib/framework-utils.jsx";
import { about } from "./about.jsx";
import { startRouter } from "https://esm.sh/lightweight-router";

startRouter({
  onRouteChange: currentPath => hydrateInteractiveComponents(document.querySelector(`route[path="${currentPath}"]`), [counter, about]),
});

//helpers
window.isBrowser = typeof document !== "undefined";

//CLIENT HYDRATION
if (globalThis.isBrowser) hydrateInteractiveComponents(document, [counter, about]);
