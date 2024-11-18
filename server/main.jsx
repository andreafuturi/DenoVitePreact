import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { createRouter } from "../lib/router.jsx";
import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { render } from "https://esm.sh/preact-render-to-string?deps=preact";
import App from "../client/index.jsx";
import { ErrorComponent } from "../lib/framework-utils.jsx";

// Error handler
const handleError = error => new Response(render(<ErrorComponent error={error} />), { headers: { "content-type": "text/html; charset=utf-8" } });

// Initialize router with paths and dependencies
const router = createRouter({
  apiBasePath: "./api",
  pageBasePath: "./../client",
  render,
  App,
});

// Setup development middleware
globalThis.dev = parse(Deno.args).dev;
const middleware = refresh();

Deno.serve(async req => {
  // Check middleware first
  const middlewareResponse = middleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
    // Now we don't need to pass render and App here
    return await router(req);
  } catch (error) {
    // Fall back to static file serving for non-JSX files
    const { pathname } = new URL(req.url);
    if (!pathname.endsWith(".jsx") && !pathname.startsWith("/vite.config.js")) {
      return await serveDir(req, { fsRoot: "client/", urlRoot: "" });
    }
    return handleError(error);
  }
});
