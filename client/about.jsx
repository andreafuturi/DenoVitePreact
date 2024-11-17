import { ClientOnly } from "../lib/client-utils.jsx";

export const about = (
  <interactive id="about">
    <ClientOnly>
      <h1>About</h1>
    </ClientOnly>
  </interactive>
);
function About() {
  //const anotherPage = await fetchAnotherPage();
  // console.log(anotherPage);
  //if function is async, preact will not be able to hydrate the component so there's no way to use server side fetching etc.. without using react
  return <>Ciao, from {about}</>;
}

export default About;

//fake server async function
// function fetchAnotherPage() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve("another page");
//     }, 3000);
//   });
// }
