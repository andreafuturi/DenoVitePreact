import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";
import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import App from "../client/index.jsx";

// Create refresh middleware
const middleware = refresh();

async function handler(_req) {
  //fast refresh
  const res = middleware(_req);
  if (res) return res;

  const { pathname } = new URL(_req.url);

  //vite build dist serving for prod mode (needed to hydrate the app or to serve general static files)
  if (pathname.startsWith("/dist-assets/")) {
    return serveDir(_req, {
      fsRoot: "client/assets/dist/assets",
      urlRoot: "dist-assets",
    });
  }

  //vite build dist serving for prod mode (needed to hydrate the app or to serve general static files)
  if (pathname.startsWith("/assets/")) {
    return serveDir(_req, {
      fsRoot: "client/assets",
      urlRoot: "assets",
    });
  }

  //render
  try {
    const html = renderSSR(<App />);
    //can't find a smarter way to pass dev info to client
    const devScript = window.dev ? "<script>window.dev=true</script>" : "";
    return new Response(devScript + html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (problem) {
    return new Response(
      `<div style='text-align: center;font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin-top: 50vh;color: red;'>${problem}<br /><span style="color:#000">${problem.stack}</span></div>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
}
window.dev = parse(Deno.args).dev;
Deno.serve(handler);

//when in prod mode it would be nice if yarn build is run everytime so save a file (maybe we can use denon for that?)
