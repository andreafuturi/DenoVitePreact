import { useEffect } from "preact/hooks";
import Counter from "./components/counter.jsx";

export default function Index({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <script src="https://cdn.jsdelivr.net/npm/content-visibility/content-visibility.min.js"></script> */}
        <meta charset="utf-8" />
        <link rel="stylesheet" href={`/${!window.dev ? "dist/assets/" : ""}index.css`} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{window.location.pathname === "/" ? "Deno + Vite + Preact!" : "About"}</title>
        <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' *;" />
        {/* here we should automatically load css of the components needed in the page,
         how wo we know which are needed? It will be the server to tell us? like 
         /about will tell us to load about.css and about.js and also the css of the components used in about.jsx
         /about.css could be a dynamic route that returns the css of the components used in about.jsx

         we can't know which components are used in about.jsx so we assume whatever css file is in the same folder of about.jsx is used in about.jsx
          so we load about.css and about.js and also the css of the components used in about.jsx
          this should work both on the server and on the client because we load the css of the components used in about.jsx on the client too
        */}

        <script rel="preconnect" type="module" crossorigin src={window.dev ? "http://localhost:3456/main.jsx" : "/dist/assets/index.js"}></script>
      </head>
      <body>
        <menu class="flex m-0 p-0">
          <a prefetch="onHover" href="/">
            Home
          </a>
          <a href="/about">About</a>
          <a href="/admin" prefetch="onHover">
            Admin
          </a>
          <a href="/irmfirmiror" prefetch="onHover">
            404
          </a>
        </menu>
        <router>{children}</router>
      </body>
    </html>
  );
}
export const counter = (
  <interactive id="counter">
    <Counter start={3} />
  </interactive>
);
export function Home() {
  useEffect(async () => {
    console.log(await window.api.upload({ id: 123 }));
  }, []);
  return (
    <home>
      <h1>Home</h1>

      {/* crearte lot of space before counter */}
      {counter}
      <upload />
    </home>
  );
}
