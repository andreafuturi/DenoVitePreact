import { render as renderSSR } from "https://esm.sh/preact-render-to-string?deps=preact";
import { refresh } from "https://deno.land/x/refresh/mod.ts";
import Main from "../client/index.jsx";

// Create refresh middleware
const middleware = refresh();

async function handler(_req) {
  //fast refresh
  const res = middleware(_req);
  if (res) return res;

  //index.js serving for prod mode (needed to hydrate the app)
  const { pathname } = new URL(_req.url);
  //Deno.env.get("DENO_ENV") === "production"
  if (pathname === "/index.js" && window.prod) {
    const file = await Deno.readFile(`./client/${pathname}`);
    return new Response(file, {
      headers: { "content-type": "application/javascript" },
    });
  }

  //render
  try {
    const html = renderSSR(<Main />);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (problem) {
    return new Response(
      `<div style='text-align: center;font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;margin-top: 50vh;color: red;'>${problem}<br /><span style="color:#000">${problem.stack}</span></div>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
}

Deno.serve(handler);

//when in prod mode it would be nice if yarn build is run everytime so save a file (maybe we can use denon for that?)
