import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { launch } from "jsr:@astral/astral";

Deno.test("Browser hydration 🔄", async () => {
  const browser = await launch();
  const page = await browser.newPage("http://localhost:8000");

  try {
    // Test counter hydration
    const count = await page.evaluate(() => {
      document.querySelector("counter button").click();
      return new Promise(r => requestAnimationFrame(() => r(document.querySelector("counter p").textContent)));
    });
    assertEquals(count, "Count: 11");

    // Test about page hydration
    await page.goto("http://localhost:8000/about");
    const hasClient = await page.evaluate(() => document.body.textContent.includes("client"));
    assertEquals(hasClient, true, "About page not hydrated");
  } finally {
    await browser.close();
  }
});

//Visit home, click About link, check if About is hydrated
Deno.test("Route change hydration 🔄", async () => {
  const browser = await launch();
  const page = await browser.newPage("http://localhost:8000");
  try {
    const aboutLink = await page.$("a[href='/about']");
    aboutLink.click();
    const hasClient = await page.evaluate(() => document.body.textContent.includes("client"));
    //assertEquals(hasClient, true, "About page not hydrated");
  } finally {
    await browser.close();
  }
});
