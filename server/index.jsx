import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";
import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { routes, api } from "../routes.jsx";
import App from "../client/index.jsx";
import { handleAPIRoutes } from "../lib/server-utils.jsx";
import { getPathname } from "../lib/client-utils.jsx";

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
    const html =
      body === "onlyRoute"
        ? renderSSR(route)
        : renderSSR(
            <App>
              <script>{clientScript}</script>
              <script>window.dev=true;</script>
              {Object.entries(routes).map(([path, component]) => (
                <content-visibility key={path}>
                  <route path={"/" + path} style={getPathname() !== path && "display: none;"}>
                    {component}
                  </route>
                </content-visibility>
              ))}
            </App>
          );

    return new Response(html, {
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
    window.location = { pathname: pathname };

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
