import { useState } from "preact/hooks";
const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <counter>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </counter>
  );
};
export default Counter;
