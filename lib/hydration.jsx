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
        const selector = `interactive[data-component="${component.name}"]`;
        const found = target.getAttribute("data-component") === component.name;
        return found;
      });
      if (entry.isIntersecting && component) {
        //    console.log("💧 Hydrating component:", {
        //      name: component.name,
        //      content: component.componentContent,
        //      });
        const Component = component.function;
        const props = target.getAttribute("props");
        const parsedProps = JSON.parse(props);
        hydrate(<Component {...parsedProps} />, target);
        hydratedComponents.add(targetId);
        observer.unobserve(target);
      }
    });
  });

  //    console.log("🔄 Setting up observation for:", interactiveComponents);
  interactiveComponents.forEach(({ name }) => {
    const elements = (elementNode || document).querySelectorAll(`interactive[data-component="${name}"]`);
    elements.forEach(element => {
      if (!hydratedComponents.has(element.id)) {
        observer.observe(element);
      }
    });
  });
};
export default hydrateInteractiveComponents;
