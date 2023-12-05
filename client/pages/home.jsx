import { makeInteractive } from "../../dynamic.jsx";
import { useState } from "preact/hooks";

export const Counter = ({ start }) => {
  const [count, setCount] = useState(start || 0);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
};

const counter = makeInteractive(<Counter start={3} />, "counter");

export default function Home() {
  return (
    <home>
      <h1>Home</h1>
      {counter}
    </home>
  );
}
