import { ClientOnly } from "../lib/framework-utils.jsx";

export const about = (
  <interactive id="about">
    <ClientOnly>
      <h1>About</h1>
    </ClientOnly>
  </interactive>
);
function About() {
  return <>Ciao, from {about}</>;
}

export default About;
