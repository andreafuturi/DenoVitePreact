import { useEffect } from "preact/hooks";
import { makeInteractive } from "../../lib/client-utils.jsx";
import Counter from "../components/Counter.jsx";

//const counter = makeInteractive(<Counter start={3} />);
const counter = makeInteractive(<Counter start={3} />);

export default function Home() {
  useEffect(async () => {
    console.log(await window.api.upload({ id: 123 }));
  }, []);
  return (
    <home>
      <h1>Home</h1>
      {counter}
      <upload />
    </home>
  );
}
