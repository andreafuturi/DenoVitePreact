import { MainJsx, Title } from "../lib/framework-utils.jsx";

export default function Index({ children }) {
  return (
    <html lang="en">
      <head>
        <MainJsx isDev={globalThis.dev} />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Title>App Name</Title>
        {/* here we should automatically load css of the components needed in the page,
         how wo we know which are needed? It will be the server to tell us? like 
         /about will tell us to load about.css and about.js and also the css of the components used in about.jsx?
         /about.css could be a dynamic route that returns the css of the components used in about.jsx
         /every component automatically have his css inline
         we can't know which components are used in about.jsx so we assume whatever css file is in the same folder of about.jsx is used in about.jsx
          so we load about.css and about.js and also the css of the components used in about.jsx (every component is directly loaded with its css file)
          this should work both on the server and on the client because we load the css of the components used in about.jsx on the client too
        */}
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
        <router>
          <route path={globalThis.location.pathname}>{children}</route>
        </router>
      </body>
    </html>
  );
}
