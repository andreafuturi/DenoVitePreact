// This file will be treated as an API endpoint (/admin) since it's a .js file

export default async function handler(body, request) {
  //body contains any data sent from the client in already parsed format
  console.log(body);
  return { requestUrl: request.method };
}
