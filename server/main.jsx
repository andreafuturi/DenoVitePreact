import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

import { routes, api } from "./routes.jsx";
import App from "../client/index.jsx";
import { handleAPIRoutes } from "../lib/server-utils.jsx";

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
    if (body === "onlyRoute")
      return new Response(renderSSR(route), {
        headers: { "content-type": "application/javascript; charset=utf-8" },
      });
    const html = renderSSR(
      <App>
        <script>globalThis.dev=true;{clientScript}</script>
        {Object.entries(routes).map(([path, component]) => path !== "default" && <route path={"/" + path}>{getPathname() === path && component}</route>)}
        <route path="/default">{!Object.keys(routes).includes(getPathname()) && routes.default}</route>
      </App>
    );
    return new Response("<!DOCTYPE html>" + html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (problem) {
    return handleError(problem);
  }
}
async function handler(_req) {
  const res = middleware(_req);
  if (res) return res;

  const { pathname } = new URL(_req.url);
  globalThis.location = { pathname: pathname };

  const routePath = getRoutePath(pathname);
  const isRoute = checkIsRoute(pathname);

  if (pathname !== "/" && isRoute && !pathname.startsWith("/dist")) {
    return handleRoute(_req, routes[routePath] || routes.default);
  }

  if (pathname !== "/") {
    return serveDir(_req, { fsRoot: "client/", urlRoot: "" });
  }

  try {
    const route = api[routePath] || routes[routePath] || routes.default;
    return await handleRoute(_req, route);
  } catch (error) {
    return handleError(error);
  }
}
const getPathname = () => {
  const { pathname } = globalThis.location;
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
};
function getRoutePath(pathname) {
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
}

function checkIsRoute(pathname) {
  return !pathname.includes(".") || pathname.endsWith(".jsx") || pathname.endsWith(".js");
}

function handleError(error) {
  return new Response(
    `<div style='text-align: center;font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin-top: 50vh;color: red;'>${error}<br /><span style="color:#000">${error.stack}</span></div>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
globalThis.dev = parse(Deno.args).dev;
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
