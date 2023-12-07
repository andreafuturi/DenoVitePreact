import { upload } from "./server/api.jsx";
import Home from "./client/pages/home.jsx";

//lazy routes
// const LazyLoaded = lazy(() => import("./client/LazyLoaded.jsx"));

//routes are server side rendered
const routes = {
  "": <Home />,
  about: <h1>About</h1>,
  default: <h1>404</h1>,
  //lazyloaded: <Suspense fallback="Loading..."><LazyLoaded /></Suspense>,
};

//this enables us to create api endpoints
const api = {
  upload,
  "upload/:id": upload,
};
export { routes, api };

//server only routes can be used to create api endpoints
//server only routes could be placed in /server/apis.jsx

//shared routes could be placed in /client/routes.jsx
//if for some reasons someone wants a client only route they can sorround it with
// <ClientOnly></ClientOnly> or conditionally render it with {window.isBrowser && <Component/>}
