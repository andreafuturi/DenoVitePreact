# Singularity

Singularity is a minimal, modern framework for building server-side rendered (SSR) and partially hydrated web applications with (P)React. It combines the power of Deno, JSX and Vite to deliver fast, SEO-friendly, and lightweight web apps with a focus on seamless Developer Experience.

Deno manages server-side rendering, while Vite handles client-side hydration, HMR reload and production build.

## Features

- 🔥 **Zero Setup**: Clone, code, and deploy. No boilerplate needed.
- 🖥️ **Server-Side Rendering (SSR)**: Better SEO and faster initial load by default.
- 💧 **Partial Hydration**: Easily hydrate only where necessary, saving resources.
- 🧩 **Minimal Interactivity**: Execute simple client-side logic without hydrating the component.
- 🚗 **Lightweight SPA Navigation**: SPA-like experience with just 1.5 KB of JavaScript.
- 🌐 **File-Based Routing**: Automatically map files to routes and apis.
- 🎨 **Scoped Styling**: Easiliy import CSS files for clean and modular CSS.
- 🌟 **Preact or React**: Flexibility to choose based on your needs.
- 🤖 **Automatic static files serving:** Easily serve static assets like images and files
- 📁 **Clear separation of server code and client code**: /server/main.jsx serves client/index.jsx
- 🔀 **Automatic Development/Production Switching**: In production minified and otpimized css and js are used.
- 🚀 **Deno Deploy Ready**: Deploy seamlessly with Deno Deploy.

And meny others coming:

- ✅ **Middleware Support**: Thanks to Deno
- ✅ **TypeScript Support**: Thanks to Deno
- ✅ **Dynamic Metadata Management**: Route-specific titles and meta tags.
- ✅ **Take away**: Easily optout of routing and hydration if not needed making the project 0kb js by default. You choose what gets in in index.jsx and what not.
- ❌ **Serverside Data Fetch**: Async components are not supported in Preact, trying to implement async routes like saw in fresh but it's not working properly right now. Use normal api fetch for data fetching.
- ❌ **Dynamic & Nested Routing**: Support for dynamic parameters (e.g., /post/[id]).
- ❌ **Global Error Handling**: Custom component for server errors
- ❌ **Static Site Generation (SSG)**: Smartly pre-render routes for blazing-fast delivery. Server will automatically knows when he has to rerender.

## Why? 💡

- Faster, lighter, and simpler than most frameworks.
- Perfect for SEO-focused, high-performance web apps.
- Combines the best of server rendering and minimal client-side interaction.

## Getting Started

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Start the application with `npm start`.
4. Visit localhost:8000 and see your code changes in real time.
5. When ready build the client-side code with `npm run build`.
6. Deploy to Deno deploy and select server/main.jsx as entry point (might add a script in package.json in the future)

## Documentation

For detailed documentation, please refer to the following files in the `docs` directory:

- [Project Structure](docs/project-structure.md)
- [Routing](docs/routing.md)
- [Special Components and Tags](docs/special-components.md)
- [Styling](docs/styling.md)
- [Change Preact to React](docs/change-preact-to-react.md)

## How it Works

Deno runs on port 8000, processing each client request through `/server/main.jsx` to render `client/index.jsx` with route-specific content. Files in `client/` are served at `yoursite.com/` (non-JSX files as static assets; JSX files rendered as routes, e.g., `about.jsx` at `/about`).

The generated index includes `client/main.jsx`, which enables client-side hydration and [optional lightweight SPA navigation](https://github.com/andreafuturi/lightweight-router) without Virtual DOM.

Vite runs on `localhost:3456/main.jsx` during development. When compiled, it’s served from `dist` at `yoursite.com/dist/index.js`, same for css files etc...
The compiled file is included in the `<head>` of `index.jsx` to enable hydration in the browser thanks to the ScriptAndCss component.
This is a smart component that will automatically switch between the compiled and non compiled files in production.

```jsx
function Index({children) {
  return (
    <html lang="en">
      <head>
        <IndexCss isDev={globalThis.dev} />
        <MainJsx isDev={globalThis.dev} />
        <Title>App Title</Title>
      </head>
      <body>
       <Menu />
       <router>
        <route path={globalThis.location.pathname}>{children}</route>
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

- This is experimental and not yet tested in big applications
- You still manually need to hydrate interactive components in main.jsx but it's very easy to do it.

## Suggestions and Contributions

Your suggestions and contributions are highly appreciated! Feel free to provide feedback, report issues, or contribute to making this template even better. Stay tuned for a React version for increased compatibility.

## Future

It would be nice to implement SSG as default for no server side rendering and improve css modules
See if this works without main.jsx
Create Dynamic routes
Create a hook to perform client side js easily
maybe just a .js filed linked to the component (counter.js)

Happy coding!
