# Special Components and Tags

This document provides an overview of the special components and tags available in the Singularity framework. It explains how to use them to add interactivity and styling to your application.

## Table of Contents

- [Interactivity](#interactivity)
- [Styling](#styling)

## Interactivity

Every component is only server-side rendered by default. To make the component execute JavaScript code on the browser, you have two options:

1. Use the `withHydration` HOC (ships Preact to the browser, old way -> not really recommended):

```jsx
// Counter: a general interactive component
import { useState } from "https://esm.sh/preact/hooks";
import withHydration from "../../lib/withHydration.jsx";

const Counter = ({ start }) => {
  const [count, setCount] = useState(start || 0);
  return (
    <counter>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </counter>
  );
};

export default withHydration(Counter);
```

This is useful for complex logic that needs to be executed on the browser, like animations or interactions. You will also need to add the component to the `interactiveComponents` array in the `client/main.jsx` file to make it hydrate.

```jsx
import Counter from "./components/counter.jsx";
import About from "./about.jsx";

// CLIENT HYDRATION
const interactiveComponents = [Counter, About];
hydrateInteractiveComponents(document, interactiveComponents);
```

2. Use the ultra-lightweight `Import` tag (no Preact needed, recommended):

```jsx
import { inlineImport } from "../../lib/framework-utils.jsx";

export default function LightCounter() {
  return (
    <counter>
      <span class="count">0</span>
      <button>Count! 🚀</button>
      {inlineImport({ src: counterLogic, selfExecute: true })}
    </counter>
  );
}

function counterLogic() {
  // 🎯 Classic JS counter logic
  const countView = document.querySelector("counter .count");
  let count = 0;
  const updateCount = () => (countView.textContent = ++count);
  document.querySelector("counter button").addEventListener("click", updateCount);
}
```

This is useful for simpler vanilla JS logic where Preact or React are not needed. You can declare the function outside of the component and pass it as a prop. The function will be declared on the browser and can also be self-executed if `selfExecute` is true.

Otherwise, you can just declare it and use it later:

```html
<div onchange="doSomethingOnBrowser()"></div>
```

You can also use the `Import` tag to import JS files that will be executed on the browser:

```jsx
// Path starts from the client folder
Component content
{inlineImport({ src: "counter.js" })}
```

They will be executed once per render and will automatically not be hydrated by the client (since they don't have any interactivity) even if they are inside interactive components. If they are local, they will be included in the final HTML page (as script tags). If they are remote, they will be fetched from the remote URL and then included in the final HTML page (as external src script tags).

## Styling

The `Import` tag can also be used to import CSS files that will be included in the final HTML page (as inline style tags). Example:

```jsx
{inlineImport({ src: "counter.css" })}
Component content
```

They will appear once per render and will automatically not be hydrated by the client (since they don't have any interactivity). They are not CSS modules and therefore you have to use normal CSS syntax techniques like nesting for scoping. Example:

```css
.counter {
  p {
    color: red;
    /* this will be a scoped style */
  }
}
```
