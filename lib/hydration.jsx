import { hydrate } from "https://esm.sh/preact";
import { registerComponent } from "./framework-utils";

const interactiveComponents = [];
const hydratedComponents = new Set();

const hydrateInteractiveComponents = (elementNode, components) => {
  console.log("🔄 Starting hydration process...");

  if (components) {
    components.forEach(Component => {
      // Get or create component ID
      const componentId = Component.__componentId || registerComponent(Component);
      Component.__componentId = componentId;

      if (!interactiveComponents.some(c => c.id === componentId)) {
        console.log(`➕ Registering new component: ${componentId}`);
        interactiveComponents.push({
          id: componentId,
          function: Component,
        });
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const { target } = entry;
      if (hydratedComponents.has(target.id)) return;

      const component = interactiveComponents.find(c => target.getAttribute("data-component") === c.id);

      if (entry.isIntersecting && component) {
        const props = JSON.parse(target.getAttribute("props") || "{}");
        hydrate(<component.function {...props} />, target);
        hydratedComponents.add(target.id);
      }
    });
  });

  interactiveComponents.forEach(({ id }) => {
    const elements = (elementNode || document).querySelectorAll(`interactive[data-component="${id}"]`);
    elements.forEach(el => !hydratedComponents.has(el.id) && observer.observe(el));
  });
};

export default hydrateInteractiveComponents;
