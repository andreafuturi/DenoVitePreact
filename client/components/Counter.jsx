import { useState } from "https://esm.sh/preact/hooks";
import withInteractivity from "../../lib/withInteractivity.jsx";
import counterOnLoad from "./counter.js";
import { BrowserScript, Import } from "../../lib/framework-utils.jsx";

const Counter = ({ start }) => {
  const [count, setCount] = useState(start || 0);
  return (
    <counter>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <BrowserScript script={counterOnLoad} selfExecute={true} />
      {/* <link rel="stylesheet" href="/components/counter.css" /> */}
      <Import href="components/counter.css" />
    </counter>
  );
};

export default withInteractivity(Counter);
