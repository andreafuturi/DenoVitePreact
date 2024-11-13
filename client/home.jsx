import { useEffect } from "preact/hooks";
import Counter from "./components/counter.jsx";

export default function Home() {
  //   useEffect(async () => {
  //     console.log(await window.api.upload({ id: 123 }));
  //   }, []);
  window.counterStart = 10;
  return (
    <home>
      <h1>Home</h1>

      {/* crearte lot of space before counter */}
      {counter}
      <upload />
    </home>
  );
}
export const counter = (
  <interactive id="counter">
    <Counter start={window.counterStart} />
  </interactive>
);
