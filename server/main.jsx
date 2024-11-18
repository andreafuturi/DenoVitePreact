import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { render } from "https://esm.sh/preact-render-to-string?deps=preact";
import App from "../client/index.jsx";
import { ErrorComponent } from "../lib/framework-utils.jsx";
import { createRouter } from "../lib/serverside-router.js";

// Error handler
const handleError = error => new Response(render(<ErrorComponent error={error} />), { headers: { "content-type": "text/html; charset=utf-8" } });

// Setup development middleware
globalThis.dev = parse(Deno.args).dev;
const middleware = refresh();

// Initialize router with paths and dependencies
const router = createRouter({
  apiBasePath: new URL(".", import.meta.url).pathname + "api",
  pageBasePath: new URL(".", import.meta.url).pathname + "../client",
  render,
  App,
  isDev: globalThis.dev,
});

Deno.serve(async req => {
  // Check middleware first
  const middlewareResponse = middleware(req);
  if (middlewareResponse) return middlewareResponse;

  try {
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
