import { RequestContext } from "..";
import * as http from "http";

export async function handleFrontendDev(reqctx: RequestContext) {
  // proxy to localhost:5173
  const parsedUrl = new URL("http://localhost:5173");
  console.log("Proxying path to frontend dev server:", reqctx.path);
  const clientReq = reqctx.req;
  const clientRes = reqctx.res;
  const options: http.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80, // Default HTTP port if not specified
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers,
  };

  const proxy = http.request(options, (res) => {
    clientRes.writeHead(res.statusCode || 500, res.headers);
    res.pipe(clientRes, { end: true });
  });

  clientReq.pipe(proxy, { end: true });

  proxy.on("error", (error) => {
    console.error("Proxy error:", error);
    clientRes.writeHead(500);
    clientRes.end("Proxy error");
  });
}
