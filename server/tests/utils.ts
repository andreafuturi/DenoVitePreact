import { handler } from "../server/main.jsx";

/**
 * 🚀 Starts a test server instance
 * @returns Promise<{ port: number, close: () => void }>
 */
export async function startServer() {
  // 🎯 Start server on random available port
  const listener = Deno.listen({ port: 0 });
  const port = (listener.addr as Deno.NetAddr).port;

  // 🌐 Start HTTP server
  const httpConn = Deno.serve(handler);

  return {
    port,
    close: () => {
      listener.close();
    },
    httpConn,
  };
}
