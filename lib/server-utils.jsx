function handleAPIRoutes(api) {
  let clientScript = "window.api = {\n";

  for (const route in api) {
    clientScript += `
    '${route}': async function(parametersFromFrontend) {
      let finalResponse;
      const res = await fetch('./${route}', {
        method: 'POST',
        body: JSON.stringify(parametersFromFrontend),
      });
      finalResponse = await res.text();
      try {
        return JSON.parse(finalResponse);
      } catch {
        return finalResponse;
      }
    },
    `;
  }

  clientScript += "};\n";
  return clientScript;
}

export { handleAPIRoutes };
