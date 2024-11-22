import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { ErrorComponent } from "./framework-utils.jsx";
import { createRouter } from "./serverside-router.js";

// Error handler helper
const createErrorHandler = renderFunction => error =>
  new Response(renderFunction(ErrorComponent({ error })), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

// Static file handler
const handleStaticFiles = async (req, options = {}) => {
  const { pathname } = new URL(req.url);
  if (!pathname.endsWith(".jsx") && !pathname.startsWith("/vite.config.js")) {
    return await serveDir(req, {
      fsRoot: options.staticDir || "client/",
      urlRoot: "",
    });
  }
  return new Response("Not Found");
};

// Create server handler with options
export const createServerHandler = ({ RootComponent, routingConfig = null, devMiddleware = null, staticAssetsDirectory = "client/", renderFunction }) => {
  const handleError = createErrorHandler(renderFunction);
  // Create router instance if options provided
  const router = routingConfig
    ? createRouter({
        ...routingConfig,
        RootComponent,
        renderFunction,
        handleError,
      })
    : null;

  return async req => {
    try {
      // Check middleware first if provided
      if (devMiddleware) {
        const middlewareResponse = devMiddleware(req);
        if (middlewareResponse) return middlewareResponse;
      }

      // Use router if provided, otherwise render single page
      if (router) {
        try {
          const response = await router(req);
          if (response) return response;
        } catch (error) {
          //route failed let's try static files
          const staticResponse = await handleStaticFiles(req, { staticDir: staticAssetsDirectory });
          if (staticResponse) return staticResponse;
        }
      } else {
        // Simple single page rendering
        return new Response(renderFunction(RootComponent()), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    } catch (error) {
      return handleError(error);
    }
  };
};
