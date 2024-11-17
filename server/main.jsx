import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

import App from "../client/index.jsx";

async function handleRoute(req, RouteHandler, isApi) {
  try {
    //what is the client requesting
    let body = await req.text();
    try {
      body = JSON.parse(body);
    } catch {
      // If parsing fails, we already have the text body
    }
    // Handle function-based route
    if (isApi)
      //check it it's object, if so directly return it stringified
      return new Response(JSON.stringify(await RouteHandler(body, req)), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });

    const route = <RouteHandler originRequest={req} {...body} />;
    //handle partial rendering of route
    if (body === "onlyRoute")
      //should we call the fn with request body?
      return new Response(renderSSR(route), {
        headers: { "content-type": "application/javascript; charset=utf-8" },
      });

    //handle full rendering of route
    //here we should also render default 404 route? and routes that needs preloading
    const html = renderSSR(
      <App>
        <script>{`globalThis.dev=${globalThis.dev}`}</script>
        <route path={globalThis.location.pathname}>{route}</route>
      </App>
    );

    return new Response("<!DOCTYPE html>" + html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (problem) {
    return handleError(problem);
  }
}
async function handler(req) {
  const middlewareResponse = middleware(req);
  if (middlewareResponse) return middlewareResponse;

  const { pathname } = new URL(req.url);
  globalThis.location = { pathname };

  // Handle routes
  try {
    let routePath = formatPathname(pathname);
    if (routePath == "vite.config") throw new Error("404");
    if (routePath == "index.html") routePath = "home";

    const basePath = `${new URL(".", import.meta.url).pathname}../client/${routePath || "home"}`;

    // Check for .jsx or .js file
    const extension = await getFileExtension(basePath);
    if (extension) {
      const module = await import(`../client/${routePath || "home"}${extension}`);
      if (!module.default) {
        throw new Error(`No default export found for route ${routePath} in ${basePath}${extension}`);
      }
      const isApi = extension === ".js";
      return handleRoute(req, module.default, isApi);
    }
    if (!routePath.endsWith(".jsx") && routePath !== "vite.config.js") return serveDir(req, { fsRoot: "client/", urlRoot: "" });
    else throw new Error("404 route not found. Make sure you have a corresponding .js or .jsx file with the same name");
  } catch (error) {
    return handleError(error.message);
  }
}
function formatPathname(pathname) {
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
}

// Helper functions
async function getFileExtension(basePath) {
  for (const ext of [".jsx", ".js"]) {
    try {
      await Deno.stat(`${basePath}${ext}`);
      return ext;
    } catch {
      continue;
    }
  }
  return null;
}

function handleError(error) {
  return new Response(
    `<div style='text-align: center;font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin-top: 50vh;color: red;'>${error}<br /><span style="color:#000">${
      error.stack || "That's all we know."
    }</span></div>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
globalThis.dev = parse(Deno.args).dev;
Deno.serve(handler);

// Create refresh middleware
const middleware = refresh();
