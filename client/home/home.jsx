import { useEffect } from "https://esm.sh/preact/hooks";
import Counter from "../components/counter.jsx";
import { Import } from "../../lib/framework-utils.jsx";

export default function Home() {
  // useEffect(async () => {
  //   console.log(await globalThis.api.upload({ id: 123 }));
  // }, []);
  return (
    <home>
      <h1>Home</h1>
      <Counter start={10} />
      <Counter start={3} />
      <upload />
      <Import src="home/home.js" />
    </home>
  );
}
