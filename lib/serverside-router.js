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
    globalThis.importedResources = new Set();

    // Normalize the path - if empty, set to "home"
    const normalizedPath = path || "home";

    let Page;
    try {
      // Try direct path first (e.g., home.jsx or about.jsx)
      Page = (await import(`${basePath}/${normalizedPath}.jsx`)).default;
    } catch (e) {
      // If not found, try nested path (e.g., home/home.jsx or about/about.jsx)
      Page = (await import(`${basePath}/${normalizedPath}/${normalizedPath}.jsx`)).default;
    }

    if (!Page) return handleError(new Error("No default export found for page: " + basePath + "/" + path + "or" + normalizedPath));

    if (body === "onlyRoute") {
      return new Response(await render(await Page({ originRequest: req, ...body })), {
        headers: { "content-type": CONTENT_TYPES.js },
      });
    }

    try {
      const html = await render(
        await App({
          children: await Page({ originRequest: req, ...body }),
        })
      );
      //from importedResources array separate js and css files
      // const scripts = globalThis.importedResources.filter(resource => resource.endsWith(".js"));
      // import async all css files
      // const scriptContents = await Promise.all(scripts.map(script => Deno.readTextFile(Deno.cwd() + "/client/" + script)));
      // const finalScripts = `<script>${scriptContents.join("")}</script>`;
      return new Response((isDev ? `<!DOCTYPE html><script>globalThis.dev=true</script>` : "<!DOCTYPE html>") + html, {
        headers: { "content-type": CONTENT_TYPES.html },
      });
    } catch (renderError) {
      console.error("🚨 Page rendering error:", renderError);
      return handleError(renderError);
    }
  };
}

/**
 * Creates main router handler
 * @param {Object} config Router configuration
 * @returns {Function} Request handler
 */
export function createRouter(config = {}) {
  const {
    apiEndpointsPath = new URL(".", import.meta.url).pathname,
    pagesDirectory = new URL(".", import.meta.url).pathname + "../client",
    renderFunction,
    RootComponent,
    isDevelopmentMode = false,
    handleError,
  } = config;

  const handleApiRoute = createApiHandler(apiEndpointsPath, handleError);
  const handlePageRoute = createPageHandler(pagesDirectory, renderFunction, RootComponent, isDevelopmentMode, handleError);

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
