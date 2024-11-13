import { hydrate } from "preact";

const interactiveComponents = [];

const hydrateInteractiveComponents = (elementNode, components) => {
  if (components)
    components.forEach((component) => {
      interactiveComponents.push({ name: component.props.id, componentContent: component.props.children });
    });
  console.log("hydrating interactive components");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target } = entry;
      const { name, componentContent } = interactiveComponents.find(
        (component) => target === (elementNode || document).querySelector("interactive#" + component.name)
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

const ClientOnly = ({ children }) => (typeof document !== "undefined" ? children : null);

const Browser = ({ script, selfExecute }) => (
  <script>
    {script.toString().replaceAll('"', "`")}
    {selfExecute && `${script.name}()`}
  </script>
);

export { ClientOnly, hydrateInteractiveComponents, Browser };
