import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";
import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { sharedRoutes, serverOnlyRoutes } from "../routes.jsx";
import App from "../client/index.jsx";

// Create refresh middleware
const middleware = refresh();

async function handler(_req) {
  //fast refresh
  const res = middleware(_req);
  if (res) return res;

  const { pathname } = new URL(_req.url);

  //vite build dist serving for prod mode (needed to hydrate the app or to serve general static files)
  if (pathname.startsWith("/dist-assets/")) {
    return serveDir(_req, {
      fsRoot: "client/assets/dist/assets",
      urlRoot: "dist-assets",
    });
  }

  //vite build dist serving for prod mode (needed to hydrate the app or to serve general static files)
  if (pathname.startsWith("/assets/")) {
    return serveDir(_req, {
      fsRoot: "client/assets",
      urlRoot: "assets",
    });
  }

  //render
  try {
    window.location = { pathname: pathname };

    //remove initial slash from pathname
    const routePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    const route =
      serverOnlyRoutes[routePath] ||
      sharedRoutes[routePath] ||
      sharedRoutes.default;
    //if route is a function
    if (typeof route === "function") {
      //reply with the result of the function in json format
      let body = await _req.text();
      //try to parse the body as json otherwise pass it as it is
      try {
        body = JSON.parse(body);
      } catch {
        //do nothing
      }
      const response = () => route(body);
      //if the function returns a component
      if (response()?.props) {
        const html = renderSSR(<App>{response()}</App>);
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      return new Response(JSON.stringify(route(body)), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    } else if (route && !route.props) {
      //object but not a component
      return new Response(JSON.stringify(route), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    // window.api = {};
    let clientScript = "window.api = {};";
    for (const route in serverOnlyRoutes) {
      // window.api[route] = serverOnlyRoutes[route];
      clientScript += `
        window.api['${route}'] = async function(parametersFromFrontend){
          let finalResponse;
          const res = await fetch('./${route}', {
            method: 'POST',
            body: JSON.stringify(parametersFromFrontend),
          });
          finalResponse = await res.text();
          try {
            finalResponse = JSON.parse(finalResponse);
          } finally {
            return finalResponse;
          }
        };
        `;
    }
    const html = renderSSR(
      <App>
        <script>{clientScript}</script>
        <script>window.dev=true</script>
        {route}
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
window.dev = parse(Deno.args).dev;
Deno.serve(handler);
//when in prod mode it would be nice if yarn build is run everytime so save a file (maybe we can use denon for that?)
