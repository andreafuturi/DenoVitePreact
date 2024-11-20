import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { render } from "https://esm.sh/preact-render-to-string?deps=preact";
import App from "../client/index.jsx";
import { createRouter } from "../lib/serverside-router.js";
import { createServerHandler } from "../lib/server-handler.js";

// Parse CLI args
const args = parse(Deno.args);
globalThis.dev = args.dev;

// Setup configuration -> main app index jsx file, dev mode, static files directory,  middleware for dev auto refreshing
const config = {
  App,
  isDev: globalThis.dev,
  middleware: globalThis.dev ? refresh() : null,
  staticDir: "client/",
};

// Optionally setup router
config.router = createRouter({
  apiBasePath: new URL(".", import.meta.url).pathname + "api",
  pageBasePath: new URL(".", import.meta.url).pathname + "../client",
  render,
  App,
  isDev: globalThis.dev,
});

// Create and start server
const handler = createServerHandler(config);
Deno.serve(handler);
