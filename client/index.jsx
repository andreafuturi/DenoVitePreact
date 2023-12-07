import { hydrate } from "preact";
import { routes } from "../routes.jsx";

import { getCurrentRoute, hydrateInteractiveComponents, startRooter } from "../lib/client-utils.jsx";

function App({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <script src="https://cdn.jsdelivr.net/npm/content-visibility/content-visibility.min.js"></script> */}
        <meta charset="utf-8" />
        <link rel="stylesheet" href={`/${!window.dev ? "dist-" : ""}assets/index.css`} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{window.location.pathname === "/" ? "Deno + Vite + Preact!" : "About"}</title>
        <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' *;" />

        <script rel="preconnect" type="module" crossorigin src={window.dev ? "http://localhost:3456/index.jsx" : "/dist-assets/index.js"}></script>
      </head>
      <body>
        <menu class="flex m-0 p-0">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/admin">Admin</a>
        </menu>
        <router>{children}</router>
      </body>
    </html>
  );
}
startRooter(routes);

export default App;

//helpers
window.isBrowser = typeof document !== "undefined";

//CLIENT HYDRATION
//if dev mode we hydrate the whole route for fast refresh
//in prod only interactive components are hydrated on the corresponding element
if (window.isBrowser) {
  // if (!window.dev) hydrate(<App>{getCurrentRoute(routes)}</App>, document);
  // else hydrateInteractiveComponents();
  hydrateInteractiveComponents();
}
