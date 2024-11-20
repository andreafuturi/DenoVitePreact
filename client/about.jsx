import withInteractivity from "./components/withInteractivity.jsx";

function About() {
  return <>Hello, from {typeof document !== "undefined" ? "client" : "server"}</>;
}

export default withInteractivity(About);
