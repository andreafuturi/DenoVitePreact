import { counter } from "./home.jsx";
import { hydrateInteractiveComponents } from "../lib/framework-utils.jsx";
import { about } from "./about.jsx";
import { startRouter } from "https://esm.sh/lightweight-router";

startRouter({
  onRouteChange: currentPath => hydrateInteractiveComponents(document.querySelector(`route[path="${currentPath}"]`), [counter, about]),
});

//CLIENT HYDRATION
hydrateInteractiveComponents(document, [counter, about]);

//This file is optional, it's used to setup an SPA like client navigation and hydrate eventual interactive components
