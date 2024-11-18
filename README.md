# DenoVitePreact

This project is a minimal template for building a server-side rendered Preact application. Deno manages server-side rendering, while Vite handles client-side hydration and Hot Module Replacement (HMR) in development. You can also integrate a lightweight client router for SPA navigation with only 1.5 KB of JS by default. The structure separates server and client code for clarity.

## Project Structure

### /server

- **main.jsx**: Entry point for the server-side application (select this with Deno Deploy).
- **api/admin.js**: Example API route, automatically served at `/api/admin` or `/api/admin/`.
- **deno.json**: Server configuration file (only needed if you want to use Preact).

  _Add any additional server logic files here._

### /client

- **main.jsx**: Front-end entry point for client-side hydration and router initialization. (only if you use the ScriptAndCss component)
- **index.jsx**: Main HTML content; editable with Preact components to customize `<head>`, etc.
- **index.css**: Global styles, automatically included in `index.jsx` (only if you use the ScriptAndCss component).
- **home.jsx**: Main route served at `/` or `/home`.
- **about.jsx**: Another route example served at `/about`.
- **components**: Folder for components and their relative CSS modules.
- **vite.config.js**: Client configuration file for Vite's Preact HMR.

  _Add client-side files (e.g., front-end functions, UI components, or static files) here._

## Minimal Project Structure

For a simple setup, structure the project as:

- `client/index.jsx`: JSX landing page
- `server/main.jsx`: Serves `index.jsx` at each request
- `server/deno.json`: Optional Preact config (you can also use React instead)
- `client/vite.config.js`: Basic Vite configuration

To add interactivity

- `client/main.jsx`: Hydrates interactive components (import in `index.jsx` with the ScriptAndCss component)

## How it Works

Deno runs on port 8000, processing each client request through `/server/main.jsx` to render `client/index.jsx` with route-specific content. Files in `client/` are served at `yoursite.com/` (non-JSX files as static assets; JSX files rendered as routes, e.g., `about.jsx` at `/about`).

The generated index includes `client/main.jsx`, which enables client-side hydration and optional lightweight SPA navigation without Virtual DOM.

Vite runs on `localhost:3456/main.jsx` during development. When compiled, it’s served from `dist` at `yoursite.com/dist/index.js`, same for css files etc...
The compiled file is included in the `<head>` of `index.jsx` to enable hydration in the browser thanks to the ScriptAndCss component.
This is a smart component that will automatically switch between the compiled and non compiled files in production.

```jsx
function Index({children) {
  return (
    <html lang="en">
      <head>
        <Title>App Title</Title>
        <ScriptAndCss isDev={globalThis.dev} />
      </head>
      <body>
       <Menu />
       <router>
        {children}
       </router>
      </body>
    </html>
  );
}
export default Index;
```

Title is an optional special component that let you have a dyamic title that changes for each route example when we're in about title will be About - App title
When your app is ready for production you can compile it with "npm run build" or "npm run preview" which will also start the server in prod mode for you to test everything.
When everything is working properly you will soon be able to deploy to denodeploy with "npm run deploy"

## Special Components and tags

### Interactivity

The interactive tag enables client-side interactivity. Every component is only server side rendered by default. To make the component executes javascript code on the browser you have 2 options:

- Use the interactive tag:

```jsx
//ClientOnly a general interactive component
export const about = (
  <interactive id="about">
    <ClientOnly>
      <h1>About</h1>
    </ClientOnly>
  </interactive>
);
function About() {
  return <>Ciao, from {about}</>;
}

//in this case ClientOnly makes sure that the component is only rendered on the client side, useful when you have components with browser only logic and you want to avoid rendering them on the server
const ClientOnly = ({ children }) => {
  return typeof document !== "undefined" ? children : null;
};
```

- Use the BrowserScript tag

```jsx
function doSomethingOnBrowser() {
  console.log("hello");
}
function Component() {
  return (
    <div>
      <h1>Hello</h1>
      <BrowserScript script={doSomethingOnBrowser} selfExecute={true} />
    </div>
  );
}
```

This is useful for simpler vanilla js logic where preact or react are not needed.
You can declare the function outside of the component and pass it as a prop.
Function will be declared on the browser and can also be self executed if selfExecute is true.

Otherwise you can just declare it and use it later

```html
<div onchange="doSomethingOnBrowser()"></div>
```

## Limitatations

- Interactive components need to be declared outside of normal components to be export and hydrated by client/main.jsx (currently working on a smart workaround)
- For some unknow reasons you have to specify file names and extensions in the local imports (surely there's an easy fix)
- We still need a node_modules for Vite to work (unfortunately there's no remote imports feature in vite.config.js)
- This is experimental and not yet tested in big applications

## Suggestions and Contributions

Your suggestions and contributions are highly appreciated! Feel free to provide feedback, report issues, or contribute to making this template even better. Stay tuned for a React version for increased compatibility.

## Future

It would be nice to implement SSG as default for no javascript and improve css modules

## Getting Started

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Start the application on localhost with `npm start`.
4. When ready build the client-side code with `npm run build`.
5. Deploy to Deno deploy (might add a script in package.json in the future)

Happy coding!
