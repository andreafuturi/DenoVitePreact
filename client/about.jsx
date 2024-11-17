import { BrowserScript, ClientOnly } from "../lib/client-utils.jsx";

export const about = (
  <interactive id="about">
    <BrowserScript script={`document.title='About'`} />
    <ClientOnly>
      <h1>About</h1>
    </ClientOnly>
  </interactive>
);
function About() {
  return <>Ciao, from {about}</>;
}

export default About;
