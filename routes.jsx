import { ServerOnlyComponent, upload } from "./server/export.jsx";
import Home from "./client/pages/home.jsx";

//lazy routes
// const LazyLoaded = lazy(() => import("./client/LazyLoaded.jsx"));

//sharedRoutes are server side rendered and client hydrated routes (why by default? we should be able to choose with a <Hydrate /> component)
const sharedRoutes = {
  "": <Home />,
  about: <h1>About</h1>,
  default: <h1>404</h1>,
  //lazyloaded: <Suspense fallback="Loading..."><LazyLoaded /></Suspense>,
};

//if they're not a component or they don't return a component they will be returned as json otherwise they will be rendered as html
//this enables us to create api endpoints or to use react async server compoents (not yet implemented in preact)
//if function of component is not async then we will have normal component otherwise a server only component?
const serverOnlyRoutes = {
  upload,
  "upload/:id": upload,
  admin: () => <ServerOnlyComponent />,
};
export { sharedRoutes, serverOnlyRoutes };

//server only routes can be used to create api endpoints
//server only routes could be placed in /server/routes.jsx
//shared routes could be placed in /client/routes.jsx
