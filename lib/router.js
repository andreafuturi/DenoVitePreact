import { hydrateInteractiveComponents } from "./client-utils.jsx";

//shared util
const getPathname = () => {
  const { pathname } = window.location;
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
};

const fetchAndSaveContent = async (link) => {
  linkData[link.href] = "";

  // Fetch the content
  const response = await fetch(link.href, { method: "POST", body: "onlyRoute" });

  // Check if the response is ok
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Get the reader from the response body
  const reader = response.body.getReader();

  // Create a new decoder
  const decoder = new TextDecoder("utf-8");

  // Read the chunks from the stream and decode them
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    linkData[link.href] += decoder.decode(value);
  }
};
const handleLinkHover = async (event) => {
  const link = event.target;
  // Fetch and save content when the link is hovered if it hasn't been fetched yet
  if (!linkData[link.href]) await fetchAndSaveContent(link);
};
const handleLinkIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const link = entry.target;
      // Fetch and save content when the link becomes visible if it hasn't been fetched yet
      if (!linkData[link.href]) {
        fetchAndSaveContent(link);
        observer.unobserve(link); // Stop observing once content is fetched
      }
    }
  });
};

const observeLinks = (observer) => {
  // Check if Save-Data is on
  const saveDataOn = navigator.connection && navigator.connection.saveData;

  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    const prefetchValue = link.getAttribute("prefetch");
    if (prefetchValue !== "onHover" && !saveDataOn) {
      // Observe the link for visibility changes only if Save-Data is not on
      observer.observe(link);
    }
  });
};

const handlePopState = async () => {
  //this part can be further optimized to only keep in dom what's visible
  //if the route doesn't exist we don't do anything
  const router = document.querySelector("router");
  if (!router) return;
  const currentRoute = router.querySelector(`route[path="${window.location.pathname}"]`) || router.querySelector(`route[path="/default"]`);

  const routesElements = router.querySelectorAll("route");
  routesElements.forEach((route) => (route.style.display = "none"));
  //than we can make the route visible
  currentRoute.style.display = "contents";

  // if the route is empty we fill it with the content
  if (!currentRoute.innerHTML) {
    currentRoute.innerHTML = await linkData[window.location.href];
    //we hydrate the interactive components on the route
    hydrateInteractiveComponents(currentRoute);
  }

  //get full url
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
let linkData = new Proxy(
  {},
  {
    set: function (target, property, value, receiver) {
      target[property] = value;

      // Trigger the DOM update when a property is set
      const router = document.querySelector("router");
      const currentRoute = router.querySelector(`route[path="${window.location.pathname}"]`) || router.querySelector(`route[path="/default"]`);

      if (currentRoute && !currentRoute.innerHTML && property === window.location.href) {
        currentRoute.innerHTML = value;
        hydrateInteractiveComponents(currentRoute);
      }

      return true;
    },
  }
);
// Save the current route's content
// if (typeof document !== "undefined") linkData[window.location.href] = document.querySelector("router").innerHTML;
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
const startRooter = () => {
  if (typeof document === "undefined") return;
  window.addEventListener("popstate", handlePopState);
  document.addEventListener("click", handleLinkClick);
  document.body.addEventListener("mouseover", function (event) {
    if (event.target.tagName === "A" && event.target.getAttribute("prefetch") === "onHover") {
      handleLinkHover(event);
    }
  });
  const observer = new IntersectionObserver(handleLinkIntersection, {
    root: null, // Use the viewport as the root
    rootMargin: "0px", // No margin around the root
    threshold: 0.5, // Trigger when 50% of the link is visible
  });
  observeLinks(observer);
};

export { startRooter, getPathname };
