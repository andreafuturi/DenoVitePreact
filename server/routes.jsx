import Notfound from "../client/404.jsx";
import About from "../client/about.jsx";
import Home from "../client/home.jsx";

//lazy routes
// const LazyLoaded = lazy(() => import("./client/LazyLoaded.jsx"));

//routes are server side rendered
const routes = {
  "": <Home />,
  about: <About />,
  default: <Notfound />,
  onlyServer: "onlyServer by default",
  //lazyloaded: <Suspense fallback="Loading..."><LazyLoaded /></Suspense>,
};

//this enables us to create api endpoints
const api = {
  upload: ({ id }) => {
    return { key: "My secret key is: rom4om4" + id };
  },
  "manifest.json": () => {
    return { test: "test" };
  },
};
export { routes, api };

//server only routes can be used to create api endpoints
//server only routes could be placed in /server/apis.jsx

//shared routes could be placed in /client/routes.jsx
//if for some reasons someone wants a client only route they can sorround it with
// <ClientOnly></ClientOnly> or conditionally render it with {globalThis.isBrowser && <Component/>}
