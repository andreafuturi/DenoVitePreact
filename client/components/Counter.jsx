import { useState } from "https://esm.sh/preact/hooks";
import withInteractivity from "./withInteractivity.jsx";

const Counter = ({ start, children }) => {
  const [count, setCount] = useState(start || 0);
  return (
    <counter>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {children}
    </counter>
  );
};

export default withInteractivity(Counter);
