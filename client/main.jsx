import { startRouter } from "https://esm.sh/lightweight-router";
import Counter from "./components/counter.jsx";
import About from "./about.jsx";
import hydrateInteractiveComponents from "../lib/hydration.jsx";

const interactiveComponents = [Counter, About];

startRouter({
  onRouteChange: currentPath => hydrateInteractiveComponents(document.querySelector(`route[path="${currentPath}"]`), interactiveComponents),
});

//CLIENT HYDRATION
hydrateInteractiveComponents(document, interactiveComponents);

//This file is optional, it's used to setup an SPA like client navigation and hydrate eventual interactive components
