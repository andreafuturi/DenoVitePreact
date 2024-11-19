import { hydrate } from "https://esm.sh/preact";

const interactiveComponents = [];

const hydrateInteractiveComponents = (elementNode, components) => {
  //this should not hydrate components that are already hydrated
  if (components)
    components.forEach(component => {
      interactiveComponents.push({ name: component.props.id, componentContent: component.props.children });
    });
  console.log("hydrating interactive components");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const { target } = entry;
      const { name, componentContent } = interactiveComponents.find(
        component => target === (elementNode || document).querySelector("interactive#" + component.name)
      );

      if (entry.isIntersecting && name && componentContent) {
        console.log("Hydrating Interacting Component: ", name);
        hydrate(componentContent, target);
        observer.unobserve(target); // Stop observing once hydrated
      }
    });
  });
  console.log("interactiveComponents", interactiveComponents);
  interactiveComponents.forEach(({ name }) => {
    const element = (elementNode || document).querySelector("interactive#" + name);
    if (element) observer.observe(element);
  });
};

const BrowserScript = ({ script, selfExecute }) => (
  <script>
    {script.toString().replaceAll('"', "`")}
    {selfExecute && `${script.name}()`}
  </script>
);
const ClientOnly = ({ children }) => {
  return typeof document !== "undefined" ? children : null;
};
function IndexCss({ isDev = false }) {
  return <link rel="stylesheet" href={`/${!isDev ? "dist/assets/" : ""}index.css`} />;
}
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
    <BrowserScript script={addRouteTitle} />
    <BrowserScript script={updateDocumentTitle} />
    <BrowserScript script={handleRouteChange} selfExecute />
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
export { hydrateInteractiveComponents, BrowserScript, ClientOnly, IndexCss, MainJsx, Title, ErrorComponent };
