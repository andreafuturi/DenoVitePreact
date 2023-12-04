import { render } from "preacting";

function App() {
  if (window.isBrowser) console.log("In the browser!");
  else console.log("In the server!");
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Deno + Vite + Preact!</title>
        <meta name="description" content="Future is here" />
        <meta property="og:title" content="Andrea Futuri" />
        <meta property="og:description" content="Future is here" />
        <meta
          http-equiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' http://localhost:3456;"
        />
        <script
          rel="preconnect"
          type="module"
          crossorigin
          src={
            window.dev
              ? "http://localhost:3456/index.jsx"
              : "./dist-assets/index.js"
          }
        ></script>
      </head>
      <body>Hello World</body>
    </html>
  );
}

render(<App />);
export default App;
