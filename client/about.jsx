import { ClientOnly } from "../lib/client-utils.jsx";
export const about = (
  <interactive id="about">
    <ClientOnly>
      <h1>About</h1>
    </ClientOnly>
  </interactive>
);
function About() {
  // const anotherPage = await fetchAnotherPage();
  // console.log(anotherPage);
  return <div>Ciao, from {about}</div>;
}
//fake server async function
function fetchAnotherPage() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("another page");
    }, 3000);
  });
}

export default About;
