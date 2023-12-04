# DenoVitePreact
This project is a minimal template for building a server-side rendered Preact application with Deno handling server-side rendering and Vite managing client-side hydration and Hot Module Replacement (HMR). This project provides a streamlined structure with separate folders for server and client code.


## Project Structure




### /server

- **index.jsx**: The entry point for the server-side application. [select this with Deno deploy]
  It renders the main.jsx component and returns it for every request. It also serves static files of /client/assets directory
- **deno.json**: Server configuration. This file may not be necessary when using React.

  Add any files that has server logic here (like apis or stuff like that)


### /client

- **index.jsx**: The entry point for the front-end application. It hydrates the HTML tags returned from main.jsx in the document after the server finishes rendering.
- **vite.config.js**: Client configuration. This file may become optional in the future.

  Add any file that has client logic here (like front-end functions) and any front-end static files under /client/assets

### /

- **main.jsx**: The main app component that returns the HTML page.

  Add anything used by both client and server here

## Limitations
- After installing a package with npm install, you must reference its name in importMap.json for it to work. For example:

```json
{
  "imports": {
    "preact": "https://esm.sh/preact",
    "not-a-module": "npm:not-a-module"
  }
}
```

This is necessary because Vite does not understand remote imports and imports prefixed with "npm:".

Before running "npm run build," you need to switch the `window.srr` variable to true in `client/index.jsx`. If you want to revert to HMR for development, you need to set it back to false. Automation for this process is being explored.

This not yet tested in big applications (if Vite produces more than one index some ajdustments need to be done)


## Suggestions and Contributions

Your suggestions and contributions are highly appreciated! Feel free to provide feedback, report issues, or contribute to making this template even better. Stay tuned for a React version for increased compatibility.

## Future
It would be nice to implement a isomorphic router and SSG as default for no javascript


## Getting Started

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Start the Deno server and the Vite server with `npm start`.
4. Build the client-side code with `npm run build`.
5. Switch `window.srr` to true in `client/index.jsx` after running the build.
6. Deploy to Deno deploy (might add a script in package.json in the future)

Happy coding!


