import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

Deno.test("Basic SSR rendering", async () => {
  // 🚀 Fetch page
  const response = await fetch("http://localhost:8000");
  const html = await response.text();

  // 🔍 Parse and test
  const doc = new DOMParser().parseFromString(html, "text/html");
  assertEquals(doc?.querySelector("title")?.textContent, "Home | App Name");
});
Deno.test("About page", async () => {
  const response = await fetch("http://localhost:8000/about");
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  assertEquals(doc?.querySelector("title")?.textContent, "About | App Name");
});
Deno.test("About page content", async () => {
  const response = await fetch("http://localhost:8000/about");
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  assertEquals(true, doc?.body?.textContent.includes("Hello, from"));
});
Deno.test("About page before hydration", async () => {
  const response = await fetch("http://localhost:8000/about");
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  assertEquals(true, doc?.body?.textContent.includes("server"));
});
