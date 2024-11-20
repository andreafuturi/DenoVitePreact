import { useEffect } from "https://esm.sh/preact/hooks";
import Counter from "./components/counter.jsx";

export default function Home() {
  // useEffect(async () => {
  //   console.log(await globalThis.api.upload({ id: 123 }));
  // }, []);
  return (
    <home>
      <h1>Home</h1>
      <Counter start={10} />
      <upload />
    </home>
  );
}
