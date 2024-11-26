const CONTENT_TYPES = {
  json: "application/json; charset=utf-8",
  html: "text/html; charset=utf-8",
  js: "application/javascript; charset=utf-8",
};

// Create route manager factory function 🏭
function createRouteManager(basePath, extension, excludeFiles = []) {
  const routes = new Map();
  const isDev = globalThis.dev;

  // Dynamic route resolver for dev mode 🔄
  async function resolveRoute(path) {
    const tryPath = async fullPath => {
      try {
        await Deno.stat(fullPath);
        const module = await import(fullPath);
        return module.default;
      } catch {
        return null;
      }
    };

    const filePath = `${basePath}/${path}${extension}`;
    const folderPath = `${basePath}/${path}/${path}${extension}`;

    return (await tryPath(filePath)) || (await tryPath(folderPath));
  }

  // Scan routes for production mode 📦
  async function scanRoutes() {
    const scan = async dir => {
      for await (const entry of Deno.readDir(dir)) {
        const fullPath = `${dir}/${entry.name}`;
        if (entry.isDirectory) {
          // Check for folder/file pattern first
          const folderMatchPath = `${fullPath}/${entry.name}${extension}`;
          try {
            const stat = await Deno.stat(folderMatchPath);
            if (stat.isFile && !excludeFiles.includes(entry.name + extension)) {
              const routePath = entry.name;
              const module = await import(folderMatchPath);
              routes.set(routePath, module.default);
            }
          } catch {
            // If folder/file pattern doesn't exist, scan the directory normally
            await scan(fullPath);
          }
          continue;
        }

        if (!entry.isFile || !entry.name.endsWith(extension) || excludeFiles.includes(entry.name)) continue;

        const routePath = fullPath.slice(basePath.length + 1, -extension.length);
        const module = await import(fullPath);
        routes.set(routePath, module.default);
      }
    };

    await scan(basePath);
    console.log(`🚀 Routes loaded for ${extension}:`, routes);
  }

  // Get route handler (cached in prod, dynamic in dev) 🎯
  async function getHandler(path) {
    const normalizedPath = path || "home";
    if (isDev) {
      return await resolveRoute(normalizedPath);
    }

    if (routes.size === 0) {
      await scanRoutes();
    }
    return routes.get(normalizedPath);
  }

  return { getHandler };
}

/**
 * Creates main router handler 🌐
 * @param {Object} config Router configuration
 */
export function createRouter({
  apiEndpointsPath = new URL(".", import.meta.url).pathname,
  pagesDirectory = new URL(".", import.meta.url).pathname + "../client",
  renderFunction,
  RootComponent,
  isDevelopmentMode = false,
  handleError,
  handleStaticFiles,
} = {}) {
  const apiManager = createRouteManager(apiEndpointsPath, ".js");
  const pageManager = createRouteManager(pagesDirectory, ".jsx", ["main.jsx", "index.jsx"]);
  globalThis.dev = isDevelopmentMode;

  return async function handleRequest(req) {
    globalThis.importedResources = new Set();

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

      if (path.startsWith("api/")) {
        const apiPath = path.slice(4);
        const handler = await apiManager.getHandler(apiPath);
        if (!handler) throw new Error(`API route not found: ${apiPath}`);

        const result = await handler(body, req);
        return new Response(JSON.stringify(result), {
          headers: { "content-type": CONTENT_TYPES.json },
        });
      }

      // Handle page routes
      const normalizedPath = path || "home";
      const Page = await pageManager.getHandler(normalizedPath);

      // Try static files if no page route found 🔄
      if (!Page && handleStaticFiles) {
        return await handleStaticFiles(req);
      }

      if (!Page) throw new Error(`Page not found: ${normalizedPath}`);

      if (body === "onlyRoute") {
        return new Response(await renderFunction(await Page({ originRequest: req, ...body })), { headers: { "content-type": CONTENT_TYPES.js } });
      }

      const html = await renderFunction(
        await RootComponent({
          children: await Page({ originRequest: req, ...body }),
        })
      );

      return new Response((isDevelopmentMode ? "<!DOCTYPE html><script>globalThis.dev=true</script>" : "<!DOCTYPE html>") + html, {
        headers: { "content-type": CONTENT_TYPES.html },
      });
    } catch (error) {
      console.error("🚨 Router Error:", error);
      return handleError(error);
    }
  };
}
