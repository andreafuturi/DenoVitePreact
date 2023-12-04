import { hydrate } from "preact";
import Main from "./main.jsx";

//helpers
window.isBrowser = typeof document !== "undefined";

if (window.isBrowser) {
  const root = document.querySelector("html");
  root.remove();
  hydrate(<Main />, document);
}
export default Main;
