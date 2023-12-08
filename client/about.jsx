import { ClientOnly } from "../lib/client-utils.jsx";
export const about = (
  <interactive id="about">
    <ClientOnly>
      <h1>About</h1>
    </ClientOnly>
  </interactive>
);
function About() {
  return about;
}

export default About;
