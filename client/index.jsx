export default function Index({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href={`/${!globalThis.dev ? "dist/assets/" : ""}index.css`} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{globalThis.location.pathname === "/" ? "Deno + Vite + Preact!" : "About"}</title>
        <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' *;" />
        {/* here we should automatically load css of the components needed in the page,
         how wo we know which are needed? It will be the server to tell us? like 
         /about will tell us to load about.css and about.js and also the css of the components used in about.jsx
         /about.css could be a dynamic route that returns the css of the components used in about.jsx

         we can't know which components are used in about.jsx so we assume whatever css file is in the same folder of about.jsx is used in about.jsx
          so we load about.css and about.js and also the css of the components used in about.jsx
          this should work both on the server and on the client because we load the css of the components used in about.jsx on the client too
        */}
        <script rel="preconnect" type="module" crossorigin src={globalThis.dev ? "http://localhost:3456/main.jsx" : "/dist/assets/index.js"}></script>
      </head>
      <body>
        <script>{fastrefresh}</script>
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
const fastrefresh = `((l) => {
          let w, i;

          function d(m) {
            console.info('[refresh] ', m);
          }

          function r() {
            l.reload();
          }

          function s(f) {
            if (w) w.close();
            w = new WebSocket(l.origin.replace('http', 'ws')+'/_r');
            w.addEventListener('open', f);
            w.addEventListener('message', () => {
              d('reloading...');
              r();
            });
            w.addEventListener('close', () => {
              d('connection lost - reconnecting...');
              clearTimeout(i);
              i = setTimeout(() => s(r), 1000);
            });
          }

          s();
        })(location);`;
