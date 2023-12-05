import { hydrate, render } from "preact";
import { sharedRoutes } from "../routes.jsx";

import { interactiveComponents, makeInteractive } from "../dynamic.jsx";

const menu = makeInteractive(
  <>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/lazyloaded">LazyLoaded</a>
  </>,
  "menu"
);

// };

function App({ children }) {
  //const res = await window.api.upload({ id: 123 });
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link
          rel="stylesheet"
          href={`/${!window.dev ? "dist-" : ""}assets/index.css`}
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>
          {window.location.pathname === "/" ? "Deno + Vite + Preact!" : "About"}
        </title>
        <meta
          http-equiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' http://localhost:3456;"
        />
        <script
          rel="preconnect"
          type="module"
          crossorigin
          src={
            window.dev
              ? "http://localhost:3456/index.jsx"
              : "/dist-assets/index.js"
          }
        ></script>
      </head>
      <body>
        {menu}
        <router>{children}</router>
      </body>
    </html>
  );
}

export default App;

//helpers
window.isBrowser = typeof document !== "undefined";
const getPathname = () => {
  const { pathname } = window.location;
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
};

if (window.isBrowser) {
  //hydration

  //if dev mode we should hydrate the whole route for fast refresh
  if (!window.dev) {
    const pathname = getPathname();
    const route = sharedRoutes[pathname] || sharedRoutes.default;
    hydrate(<App>{route}</App>, document);
  } else {
    console.log("hydrating interactive components", interactiveComponents);

    //in prod only interactive components are hydrated on the corresponding element
    interactiveComponents.map(({ name, componentContent }) => {
      if (!document.querySelector(name)) return;
      hydrate(componentContent, document.querySelector(name));
    });
  }
  //client side router
  window.addEventListener("popstate", () => {
    document.querySelector(`title`).innerHTML =
      window.location.pathname === "/" ? `Deno + Vite + Preact!` : `About`;
    const pathname = getPathname();
    const router = document.querySelector("router");
    //should also be able to just hide the current component and keep it for later
    router.innerHTML = "";
    const route = sharedRoutes[pathname] || sharedRoutes.default;
    //user might not want to hydrate in dev? we should render into a div and then replace old innerhtml with new innerhtml?
    hydrate(route, router);
  });
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      window.history.pushState(null, null, e.target.href);
      window.dispatchEvent(new Event("popstate"));
    }
  });
}
