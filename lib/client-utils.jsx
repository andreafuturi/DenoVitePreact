import { hydrate } from "preact";
import render from "preact-render-to-string";

const interactiveComponents = [];

//shared util
const getPathname = () => {
  const { pathname } = window.location;
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
};

const getCurrentRoute = (routes) => {
  const pathname = getPathname();
  return routes[pathname] || routes.default;
};
const fetchAndSaveContent = async (link) => {
  // Fetch the content
  const routeHTML = await fetch(link.href, { method: "POST", body: "onlyRoute" }).then((res) => res.text());
  // Save the fetched content
  linkData[link.href] = routeHTML;
};
const handleLinkHover = async (event) => {
  if (event.target.tagName === "A") {
    const link = event.target;
    // Fetch and save content when the link is hovered if it hasn't been fetched yet
    console.log(linkData);
    if (!linkData[link.href]) await fetchAndSaveContent(link);
  }
};

const handlePopState = async (routes) => {
  //if the route doesn't exist we don't do anything
  const router = document.querySelector("router");
  if (!router) return;
  //get full url
  router.innerHTML = linkData[window.location.href] || "Loading...";
  //hide all routes
  // const routesElements = router.querySelectorAll("route");
  // routesElements.forEach((route) => (route.style.display = "none"));
  //show current route
  // const currentRoute = router.querySelector(`route[path="${window.location.pathname}"]`);
  // const defaultRoute = router.querySelector(`route[path="/default"]`);
  // if (currentRoute) currentRoute.style.display = "contents";
  // else if (defaultRoute) defaultRoute.style.display = "contents";
  // else throw new Error("No default route found, couldn't navigate to " + window.location.pathname);
};
let linkData = {};
if (typeof document !== "undefined") linkData[window.location.href] = document.querySelector("router").innerHTML;
const handleLinkClick = (e) => {
  if (e.target.tagName === "A") {
    if (!e.target.href) return;
    const href = new URL(e.target.href).pathname;
    if (!href.startsWith("/")) return;
    e.preventDefault();
    window.history.pushState(null, null, e.target.href);
    window.dispatchEvent(new Event("popstate"));
  }
};

const startRooter = (routes) => {
  window.addEventListener("popstate", handlePopState);
  window.addEventListener("click", handleLinkClick);
  window.addEventListener("mouseover", handleLinkHover);
};

const makeInteractive = (component, name) => {
  const elementName = name || component.type.name.toLowerCase();
  const element = <interactive-island id={elementName}>{component}</interactive-island>;
  interactiveComponents.push({
    component: element,
    componentContent: component,
    name: elementName,
  });
  return element;
};

const hydrateInteractiveComponents = () => {
  interactiveComponents.forEach(({ name, componentContent }) => {
    const element = document.querySelector("interactive-island#" + name);
    if (element) {
      console.log("Hydrating Interacting Component: ", name);
      hydrate(componentContent, element);
    }
  });
};

const ClientOnly = ({ children }) => (typeof document !== "undefined" ? children : null);

const Browser = ({ script, selfExecute }) => (
  <script>
    {script.toString().replaceAll('"', "`")}
    {selfExecute && `${script.name}()`}
  </script>
);

export { makeInteractive, ClientOnly, startRooter, hydrateInteractiveComponents, Browser, getPathname, getCurrentRoute };
