import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { renderToStream } from "react-streaming/server";

import { routes, api } from "./routes.jsx";
import App from "../client/index.jsx";
import { handleAPIRoutes } from "../lib/server-utils.jsx";
import { getPathname } from "../lib/router.js";

// Create refresh middleware
const middleware = refresh();

async function handleRoute(_req, route) {
  try {
    try {
      body = JSON.parse(body);
    } catch {
      //not json probably a text
    }
    // Handle the route and return the appropriate response
    let body = await _req.text();
    // Handle function-based route
    if (typeof route === "function") {
      return new Response(JSON.stringify(route(body)), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    // Continue rendering logic if 'route' is a Preact component
    const clientScript = handleAPIRoutes(api);
    // if routes doens't cotain a route with the same name as the pathname we load default route
    const loadDefaultRoute = !Object.keys(routes).includes(getPathname());
    const html =
      body === "onlyRoute"
        ? renderSSR(route, { userAgent: _req.headers.get("user-agent") })
        : renderSSR(
            <App>
              <script>{clientScript}</script>
              <script>window.dev=true;</script>
              {/* {if route has prefetch than it is rendered here with display none} */}

              {/* {those empty routes could be created on the fly by the client, the server might store the html on a script var instead } */}
              {Object.entries(routes).map(
                ([path, component]) =>
                  path !== "default" && (
                    <route path={"/" + path} style="content-visibility: auto;">
                      {getPathname() === path && component}
                    </route>
                  )
              )}
              <route path="/default" style="content-visibility: auto;">
                {loadDefaultRoute && routes.default}
              </route>
            </App>,
            { userAgent: _req.headers.get("user-agent") }
          );

    return new Response(html?.readable || html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (problem) {
    return new Response(
      `<div style='text-align: center;font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin-top: 50vh;color: red;'>${problem}<br /><span style="color:#000">${problem.stack}</span></div>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
}

async function handler(_req) {
  // Fast refresh
  const res = middleware(_req);
  if (res) return res;

  const { pathname } = new URL(_req.url);
  window.location = { pathname: pathname };
  // Assets folder (generic static files of the app)
  if (pathname.startsWith("/") && pathname !== "/") {
    //if path name does not contain a dot it is a route
    if (!pathname.includes(".") || pathname.endsWith(".jsx") || pathname.endsWith(".js")) {
      if (!pathname.startsWith("/dist")) return handleRoute(_req, routes[pathname.slice(1)] || routes.default);
    }
    return serveDir(_req, {
      fsRoot: "client/",
      urlRoot: "",
    });
  }
  //if this fails a 404 shoul be served

  // Vite build dist serving for prod mode
  if (pathname.startsWith("/dist-assets/")) {
    return serveDir(_req, {
      fsRoot: "client/assets/dist/assets",
      urlRoot: "dist-assets",
    });
  }

  // Assets folder (generic static files of the app)
  if (pathname.startsWith("/assets/")) {
    return serveDir(_req, {
      fsRoot: "client/assets",
      urlRoot: "assets",
    });
  }

  // Render
  try {
    const routePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    const route = api[routePath] || routes[routePath] || routes.default;
    return await handleRoute(_req, route);
  } catch (error) {
    return new Response(
      `<div style='text-align: center;font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin-top: 50vh;color: red;'>${error}<br /><span style="color:#000">${error.stack}</span></div>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
}

window.dev = parse(Deno.args).dev;
Deno.serve(handler);

// what to do if api returns a component
//const response = () => route(body);
// if (response()?.props) {
//   const html = renderSSR(<App>{response()}</App>);
//   return new Response(html, {
//     headers: { "content-type": "text/html; charset=utf-8" },
//   });
// }
// else if (route && !route.props) {
//   // Object but not a component
//   return new Response(JSON.stringify(route), {
//     headers: { "content-type": "application/json; charset=utf-8" },
//   });
// }
