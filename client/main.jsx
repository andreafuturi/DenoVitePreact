function Home() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Andrea Futuri</title>
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
            window.dev ? "http://localhost:3456/index.jsx" : "./assets/index.js"
          }
        ></script>
      </head>
      <body>Ciauuuuu</body>
    </html>
  );
}
export default Home;
