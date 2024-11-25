import withHydration from "../lib/withHydration.jsx";

function About() {
  return <>Hello, from {typeof document !== "undefined" ? "client" : "server"}</>;
}

export default withHydration(About);
