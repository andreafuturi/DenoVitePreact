# DenoVitePreact
This project is a minimal template for building a server-side rendered Preact application with Deno handling server-side rendering and Vite managing client-side hydration and Hot Module Replacement (HMR). This project provides a streamlined structure with separate folders for server and client code.


## Project Structure




### /server

- **index.jsx**: The entry point for the server-side application. [select this with Deno deploy]
  It renders the main.jsx component and returns it for every request. It also serves static files of /client/assets directory
- **deno.json**: Server configuration. This file may not be necessary when using React.

  *Add any files that has server logic here (like apis or stuff like that)*


### /client

- **index.jsx**: The entry point for the front-end application. It hydrates the HTML tags returned from main.jsx in the document after the server finishes rendering.
- **vite.config.js**: Client configuration. This file may become optional in the future.

  *Add any file that has client logic here (like front-end functions) and any front-end static files under /client/assets*

### /

- **main.jsx**: The main app component that returns the HTML page.

  *Add anything used by both client and server here*

## Limitatations

- packages need to be installed with npm install (until Vite understands remote imports or Deno stores its cached packages inside node_modules)
- This not yet tested in big applications


## Suggestions and Contributions

Your suggestions and contributions are highly appreciated! Feel free to provide feedback, report issues, or contribute to making this template even better. Stay tuned for a React version for increased compatibility.

## Future
It would be nice to implement a isomorphic router and SSG as default for no javascript


## Getting Started

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Start the application on localhost:8000 with `npm start`.
4. Build the client-side code with `npm run build`.
6. Deploy to Deno deploy (might add a script in package.json in the future)

Happy coding!


