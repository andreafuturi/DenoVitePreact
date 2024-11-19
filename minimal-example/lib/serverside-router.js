const CONTENT_TYPES = {
  json: "application/json; charset=utf-8",
  html: "text/html; charset=utf-8",
  js: "application/javascript; charset=utf-8",
};

/**
 * Creates API route handler
 * @param {string} basePath - Base path for API routes
 * @param {Function} handleError - Error handler function
 * @returns {Function} API route handler
 */
export function createApiHandler(basePath = "", handleError) {
  return async function handleApiRoute(path, body, req) {
    try {
      const apiPath = path.slice(4);
      const { default: handler } = await import(`${basePath}/${apiPath}.js`);
      const result = await handler(body, req);
      return new Response(JSON.stringify(result), {
        headers: { "content-type": CONTENT_TYPES.json },
      });
    } catch (error) {
      console.error("API Route Error:", error);
      return handleError(error);
    }
  };
}

/**
 * Creates page route handler
 * @param {string} basePath - Base path for page components
 * @param {Function} render - Render function
 * @param {Function} App - App function
 * @param {boolean} isDev - Development mode flag
 * @param {Function} handleError - Error handler function
 * @returns {Function} Page route handler
 */
export function createPageHandler(basePath = "", render, App, isDev = false, handleError) {
  return async function handlePageRoute(path, body, req) {
    const { default: Page } = await import(`${basePath}/${path || "home"}.jsx`);
    if (!Page) return handleError(new Error("No default export found for page: " + basePath + "/" + path));
    if (body === "onlyRoute") {
      return new Response(render(Page({ originRequest: req, ...body })), {
        headers: { "content-type": CONTENT_TYPES.js },
      });
    }

    const html = render(
      App({
        children: Page({ originRequest: req, ...body }),
      })
    );

    return new Response((isDev ? `<script>globalThis.dev=true</script>` : "") + "<!DOCTYPE html>" + html, {
      headers: { "content-type": CONTENT_TYPES.html },
    });
  };
}

/**
 * Creates main router handler
 * @param {Object} config Router configuration
 * @returns {Function} Request handler
 */
export function createRouter(config = {}) {
  const {
    apiBasePath = new URL(".", import.meta.url).pathname,
    pageBasePath = new URL(".", import.meta.url).pathname + "../client",
    render,
    App,
    isDev = false,
    handleError,
  } = config;

  const handleApiRoute = createApiHandler(apiBasePath, handleError);
  const handlePageRoute = createPageHandler(pageBasePath, render, App, isDev, handleError);

  return async function handleRequest(req) {
    try {
      const path = new URL(req.url).pathname.slice(1).replace(/\/+$/, "");
      globalThis.location = { pathname: "/" + path };

      const body = await req.text().then(text => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      });

      return path.startsWith("api/") ? handleApiRoute(path, body, req) : handlePageRoute(path, body, req);
    } catch (error) {
      console.error("Router Error:", error);
      return handleError(error);
    }
  };
}
