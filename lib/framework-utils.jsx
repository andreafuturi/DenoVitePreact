import { withoutHydration } from "./server-components.jsx";

const ClientOnly = ({ children }) => {
  return typeof document !== "undefined" ? children : null;
};
function IndexCss({ isDev = false }) {
  return <link rel="stylesheet" href={`/${!isDev ? "dist/assets/" : ""}index.css`} />;
}

const COMPONENT_REGISTRY = new Map();
let componentCounter = 0;
export const registerComponent = Component => {
  const id = `c${componentCounter++}`;
  COMPONENT_REGISTRY.set(id, Component);
  return id;
};

export const Import = withoutHydration(({ src, selfExecute }) => {
  //this should be in withoutHydration
  if (typeof Deno === "undefined") return null;

  // Initialize tracking Set if not exists 🔄
  globalThis.importedResources = globalThis.importedResources || new Set();

  // Generate unique key for functions or use src path 🔑
  const resourceKey = typeof src === "function" ? src.toString() : src;

  // Check if already imported ✨
  if (globalThis.importedResources.has(resourceKey)) {
    return null;
  }

  globalThis.importedResources.add(resourceKey);

  // Handle different import types
  if (typeof src === "function")
    return (
      <script>
        {src.toString().replaceAll('"', "`")}
        {selfExecute && `${src.name}()`}
      </script>
    );
  if (src.startsWith("http")) return <script rel="preconnect" type="module" src={src}></script>;

  // Handle file imports
  if (src.endsWith(".css")) {
    return <style>{Deno.readTextFileSync(Deno.cwd() + "/client/" + src).replaceAll('"', "`")}</style>;
  }
  if (src.endsWith(".js")) {
    return <script>{Deno.readTextFileSync(Deno.cwd() + "/client/" + src).replaceAll('"', "`")}</script>;
  }
});

function MainJsx({ isDev = false }) {
  return (
    <>
      {isDev && <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' *;" />}
      <script rel="preconnect" type="module" crossorigin src={isDev ? "http://localhost:3456/main.jsx" : "/dist/assets/index.js"}></script>
      {isDev && <script>{fastrefresh}</script>}
    </>
  );
}
const fastrefresh = `((l) => {
  let w, i;

  function d(m) {
    console.info('[refresh] ', m);
  }

  function r() {
    l.reload();
  }

  function s(f) {
    if (w) w.close();
    w = new WebSocket(l.origin.replace('http', 'ws')+'/_r');
    w.addEventListener('open', f);
    w.addEventListener('message', () => {
      d('reloading...');
      r();
    });
    w.addEventListener('close', () => {
      d('connection lost - reconnecting...');
      clearTimeout(i);
      i = setTimeout(() => s(r), 1000);
    });
  }

  s();
})(location);`;

function updateDocumentTitle() {
  document.title = addRouteTitle("App Name");
}
function handleRouteChange() {
  globalThis.addEventListener("popstate", updateDocumentTitle);
}
function addRouteTitle(appTitle) {
  let path = globalThis.location.pathname.split("/").filter(Boolean);
  let title = path.length ? path[0] : "home";
  return title.charAt(0).toUpperCase() + title.slice(1) + " | " + appTitle;
}
const Title = ({ children }) => (
  <>
    <title>{addRouteTitle(children)}</title>
    <Import src={addRouteTitle} />
    <Import src={updateDocumentTitle} />
    <Import src={handleRouteChange} selfExecute />
  </>
);
//Error component
function ErrorComponent({ error }) {
  return (
    <div style="text-align:center;font-family:system-ui;margin-top:50vh">
      <span style="color:red">${error}</span>
      <br />
      <span>${error.stack || "No additional details available."}</span>
    </div>
  );
}
export { ClientOnly, IndexCss, MainJsx, Title, ErrorComponent };
