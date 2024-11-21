import { Import } from "../lib/framework-utils.jsx";
import withInteractivity from "../lib/withInteractivity.jsx";

function About() {
  return (
    <>
      Hello, from {typeof document !== "undefined" ? "client" : "server"}
      <Import href={"/about.js"} />
    </>
  );
}

export default withInteractivity(About);
