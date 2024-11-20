import withInteractivity from "../lib/withInteractivity.jsx";
import Counter from "./components/counter.jsx";

function About() {
  return (
    <>
      Hello, from {typeof document !== "undefined" ? "client" : "server"}
      <Counter start={10} />
    </>
  );
}

export default About;
