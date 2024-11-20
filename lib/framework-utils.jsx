import { hydrate } from "https://esm.sh/preact";

const interactiveComponents = [];
const hydratedComponents = new Set();

const hydrateInteractiveComponents = (elementNode, components) => {
  // console.log("🚀 Starting hydration with components:", components);

  if (components) {
    components.forEach(Component => {
      const componentId = Component.name.toLowerCase();
      if (!interactiveComponents.some(c => c.name === componentId)) {
        interactiveComponents.push({
          name: componentId,
          function: Component,
        });
        //    console.log("➕ Added to interactiveComponents:", interactiveComponents);
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    //    console.log("👀 Observer triggered with entries:", entries.length);

    entries.forEach(entry => {
      const { target } = entry;
      const targetId = target.id;
      //    console.log("🎯 Checking target:", {
      //      id: targetId,
      //      isIntersecting: entry.isIntersecting,
      //      alreadyHydrated: hydratedComponents.has(targetId),
      //    });

      if (hydratedComponents.has(targetId)) {
        observer.unobserve(target);
        //    console.log("⏭️ Skipping already hydrated component:", targetId);
        return;
      }

      const component = interactiveComponents.find(component => {
        const selector = "interactive#" + component.name;
        const found = target === (elementNode || document).querySelector(selector);
        //    console.log("🔍 Looking for:", {
        //      selector,
        //      found,
        //      target: target.outerHTML,
        //    });
        return found;
      });
      if (entry.isIntersecting && component) {
        //    console.log("💧 Hydrating component:", {
        //      name: component.name,
        //      content: component.componentContent,
        //      });
        const Component = component.function;
        const props = document.querySelector(`interactive[id="${component.name}"]`).getAttribute("props");
        const parsedProps = JSON.parse(props);
        hydrate(<Component {...parsedProps} />, target);
        hydratedComponents.add(targetId);
        observer.unobserve(target);
      }
    });
  });

  //    console.log("🔄 Setting up observation for:", interactiveComponents);
  interactiveComponents.forEach(({ name }) => {
    const element = (elementNode || document).querySelector("interactive#" + name);
    //      console.log("📍 Finding element:", {
    //      name,
    //      found: !!element,
    //      alreadyHydrated: hydratedComponents.has(name),
    //    });

    if (element && !hydratedComponents.has(name)) {
      observer.observe(element);
      //    console.log("👁️ Now observing:", name);
    }
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
