# DenoVitePreact
This project is a minimal template for building a server-side rendered Preact application with Deno handling server-side rendering and Vite managing client-side hydration and Hot Module Replacement (HMR). This project provides a streamlined structure with separate folders for server and client code.


## Project Structure

### /server

- **index.jsx**: The entry point for the server-side application. [select this with Deno Deploy].
- **deno.json**: Server configuration file.

  *Add any files that has server logic here (like apis or stuff like that)*


### /client

- **index.jsx**: The entry point for the front-end application.
- **vite.config.js**: Client configuration file.

  *Add any file that has client logic here (like front-end functions, UI) or static served files under /client/assets*
  
## How it works?
Every request by a client is processed by /server/index.js which renders client/index.jsx at every route (You can easily setup server side routing if you want).
Every file from client/assets/ is automatically served at yoursite.com/assets/
The index.jsx autoincludes itself in the <head> tag so that it can hydrates the app in the browser
```jsx
<script rel="preconnect" type="module" crossorigin
          src={window.dev ? "http://localhost:3456/index.jsx" : "./dist-assets/index.js"}>
</script>
```

When your app is ready for production you can compile it with "npm run build" or "npm run preview" which will also start the server in prod mode for you to test it.




## Limitatations
- packages need to be installed with npm install (until Vite understands remote imports or Deno stores its cached packages inside node_modules)
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


