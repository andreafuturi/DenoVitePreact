# DenoVitePreact
This project is a minimal template for building a server-side rendered Preact application with Deno handling server-side rendering and Vite managing client-side hydration and Hot Module Replacement (HMR) for development.
You can also easily integrate a lightweight client router to have SPA route navigation with only 1.5kb of js by default.
This project provides a streamlined structure with separate folders for server and client code.


## Project Structure

### /server

- **main.jsx**: The entry point for the server-side application. [select this with Deno Deploy].
- **api/admin.js**: This is an example of an api route, it is automatically served at /api/admin or /api/admin/
- **deno.json**: Server configuration file.

  *Add any file with server logic here*


### /client

- **main.jsx**: The optional entry point for the front-end application. (it includes hydration of reactive components and client-side router init)
- **index.jsx**: The main html content is decalred here, you can edit HEAD tags etc.. all with Preact components
- **index.css**: This a static file served at /index.css, it's automatically included in your index.jsx head's tag so that it is accessible in every route. You can have your global styles here.
- **home.jsx**: This is your main route served at / or /home or /home/
- **about.jsx**: This example route is served at /about
- **components**: This folder can contains all your components and their relative css modules.
- **vite.config.js**: Client configuration file.

  *Add any file that has client logic here (like front-end functions, UI) or static served files*
  

## Minimal Project Structure
As its easiest configuration the project could look like (landing page using React for less config files)


client/index.jsx -> your jsx landing page
client/main.jsx -> imported in index.jsx to hydrate interactive components
server/main.jsx -> serves index.jsx at each request
server/deno.json -> preact config (not needed if you use React instead)
client/vite.config.js -> basic vite configuration


## How it works?
Deno is running on port 8000
Every request by a client is processed by /server/main.jsx which renders client/index.jsx at every route chaninging only its children based on the requested route path.
Every file from client/ is automatically served at yoursite.com/
If it is a .jsx file it will be ignored and rendered as a html route instead (about.jsx served at /about)

The generated index.html imports client's main.jsx. This file is optional but can do these important things for your application:
- Hydrate any interactive Preact components you have in your html.
- Start a client side router so that navigation feels like an SPA without hydrating all the site dom.



Vite is running on localhost:3456/main.jsx in dev mode, when compiled it is served from dist at youtsite.com/dist/index.js
The client/main.jsx is included in the <head> of index.jsx so that it can hydrates the app in the browser and continue rendering whatever is needed.

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
6. Deploy to Deno deploy (might add a script in package.json in the future)

Happy coding!


