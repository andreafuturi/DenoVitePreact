import { serveDir } from "https://deno.land/std/http/file_server.ts";
import { render } from "https://esm.sh/preact-render-to-string?deps=preact";
import { ErrorComponent } from "./framework-utils.jsx";

// Error handler helper
const createErrorHandler = () => error =>
  new Response(render(ErrorComponent({ error })), {
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
export const createServerHandler = ({ App, router = null, middleware = null, staticDir = "client/", isDev = false }) => {
  const handleError = createErrorHandler();

  return async req => {
    try {
      // Check middleware first if provided
      if (middleware) {
        const middlewareResponse = middleware(req);
        if (middlewareResponse) return middlewareResponse;
      }

      // Use router if provided, otherwise render single page
      if (router) {
        try {
          const response = await router(req);
          if (response) return response;
        } catch (error) {
          //route failed let's try static files
          const staticResponse = await handleStaticFiles(req, { staticDir });
          if (staticResponse) return staticResponse;
        }
      } else {
        // Simple single page rendering
        return new Response(render(App()), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    } catch (error) {
      return handleError(error);
    }
  };
};
