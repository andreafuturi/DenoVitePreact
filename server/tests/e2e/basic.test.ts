import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

Deno.test("Basic SSR rendering", async () => {
  // 🌐 Start server
  const server = await startServer();

  try {
    // 🚀 Fetch page
    const response = await fetch("http://localhost:8000");
    const html = await response.text();

    // 🔍 Parse and test
    const doc = new DOMParser().parseFromString(html, "text/html");
    assertEquals(doc?.querySelector("title")?.textContent, "App Title");

    // ⚡ Test hydration
    // ... hydration specific tests
  } finally {
    // 🧹 Cleanup
    await server.close();
  }
});
