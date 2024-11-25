import { useState } from "https://esm.sh/preact/hooks";
import withHydration from "../../lib/withHydration.jsx";
import counterOnLoad from "./counter.js";
import { inlineImport } from "../../lib/framework-utils.jsx";

const Counter = ({ start }) => {
  const [count, setCount] = useState(start || 0);
  return (
    <counter>
      {inlineImport({ src: "counter.css" })}
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {inlineImport({ src: counterOnLoad, selfExecute: true })}
    </counter>
  );
};

export default withHydration(Counter);
