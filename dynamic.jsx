const interactiveComponents = [];

function makeInteractive(component, name) {
  const Namer = {};
  Namer.tag = name;
  const element = <Namer.tag>{component}</Namer.tag>;
  interactiveComponents.push({
    component: element,
    componentContent: component,
    name: name || component.type.name.toLowerCase(),
  });
  return element;
}

export function Browser({ script, selfExecute }) {
  // return window.isBrowser ? (
  return (
    <script>
      {script.toString().replaceAll('"', "`")}
      {selfExecute && `${script.name}()`}
    </script>
  );
  // ) : null;
}
const ClientOnly = ({ children }) => {
  if (window.isBrowser) return children;
  return null;
};
export { makeInteractive, interactiveComponents, ClientOnly };
