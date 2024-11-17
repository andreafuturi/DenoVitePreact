# DenoVitePreact
This project is a minimal template for building a server-side rendered Preact application with Deno handling server-side rendering and Vite managing client-side hydration and Hot Module Replacement (HMR) for development. This project provides a streamlined structure with separate folders for server and client code.


## Project Structure

### /server

- **main.jsx**: The entry point for the server-side application. [select this with Deno Deploy].
- **deno.json**: Server configuration file.

  *Add any files that has server logic here*


### /client

- **main.jsx**: The entry point for the front-end application. (it includes hydration of components and start of client router)
- **index.jsx**: The main html content is here, you can edit HEAD tags etc.. with Preact
- **home.jsx**: This is your main route served at /
- **about.jsx**: This page is served at /about
etc...
- **vite.config.js**: Client configuration file.

  *Add any file that has client logic here (like front-end functions, UI) or static served files under /client/assets*
  
## How it works?
Deno is running on port 8000
Every request by a client is processed by /server/main.jsx which renders client/index.jsx at every route chaninging only its children based on the requested path.
Every file from client/ is automatically served at yoursite.com/
If it is a .jsx file it will be ignored and rendered as a route instead
If it is a .js file it will be ignored and rendered as an api endpoint instead



Vite is running on port 3456 in dev mode, when compiled it is served from dist at youtsite.com/dist/
The client/main.jsx auto injects itself in the <head> tag so that it can hydrates the app in the browser and continue rendering

```jsx
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
```

When your app is ready for production you can compile it with "npm run build" or "npm run preview" which will also start the server in prod mode for you to test it.




## Limitatations
- Interactive components need to be declared outside of normal components (still trying to find a workaround)
- For some unknow reasons you have to specify file names and extensions in the local imports
- Unless you're in server/main.jsx packages need to be installed with npm install (until Vite understands remote imports or Deno stores its cached packages inside node_modules)
-  After installing a package with npm install, you must reference its name in importMap.json for it to work. For example:

```json
{
  "imports": {
    "preact": "https://esm.sh/preact",
    "not-a-module": "npm:not-a-module"
  }
}
```


This is necessary because Vite does not understand remote imports and imports prefixed with "npm:".
- This not yet tested in big applications


## Suggestions and Contributions

Your suggestions and contributions are highly appreciated! Feel free to provide feedback, report issues, or contribute to making this template even better. Stay tuned for a React version for increased compatibility.

## Future
It would be nice to implement a isomorphic router and SSG as default for no javascript


## Getting Started

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Start the application on localhost:8000 with `npm start`.
4. When ready build the client-side code with `npm run build`.
6. Deploy to Deno deploy (might add a script in package.json in the future)

Happy coding!


