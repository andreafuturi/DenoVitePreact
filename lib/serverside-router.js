const CONTENT_TYPES = {
  json: "application/json; charset=utf-8",
  html: "text/html; charset=utf-8",
  js: "application/javascript; charset=utf-8",
};

/**
 * Creates API route handler
 * @param {string} basePath - Base path for API routes
 * @returns {Function} API route handler
 */
export function createApiHandler(basePath = "") {
  return async function handleApiRoute(path, body, req) {
    const apiPath = path.slice(4);
    const { default: handler } = await import(`${basePath}/${apiPath}.js`);
    const result = await handler(body, req);
    return new Response(JSON.stringify(result), {
      headers: { "content-type": CONTENT_TYPES.json },
    });
  };
}

/**
 * Creates page route handler
 * @param {string} basePath - Base path for page components
 * @param {Function} render - Render function
 * @param {Function} App - App function
 * @param {boolean} isDev - Development mode flag
 * @returns {Function} Page route handler
 */
export function createPageHandler(basePath = "", render, App, isDev = false) {
  return async function handlePageRoute(path, body, req) {
    const { default: Page } = await import(`${basePath}/${path || "home"}.jsx`);

    if (body === "onlyRoute") {
      return new Response(render(Page({ originRequest: req, ...body })), { headers: { "content-type": CONTENT_TYPES.js } });
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
  } = config;

  const handleApiRoute = createApiHandler(apiBasePath);
  const handlePageRoute = createPageHandler(pageBasePath, render, App, isDev);

  return async function handleRequest(req) {
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
  };
}
