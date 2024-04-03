import { createReadStream } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { pipeline } from "stream";
import { promisify } from "util";
import { createGzip } from "zlib";
const pump = promisify(pipeline);
import { lookup } from "mime-types";

export async function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", reject);
  });
}

export async function httpReadJsonBody(req: IncomingMessage) {
  const body = await readBody(req);
  return JSON.parse(body);
}

export async function httpReadCookies(req: IncomingMessage) {
  const cookies: Record<string, string> = Object.fromEntries(
    req.headers.cookie
      ?.split(";")
      .map((c) => c.split("=").map((e) => e.trim())) || []
  );
  return cookies;
}

export async function streamDiskFile(
  filePath: string,
  req: IncomingMessage,
  res: ServerResponse
) {
  const extension = filePath.split(".").pop() || "";
  const mimeType = lookup(extension) || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);

  const acceptsGzip = req.headers["accept-encoding"]?.includes("gzip");
  const stream = createReadStream(filePath);
  const gzip = createGzip();
  if (acceptsGzip) {
    res.setHeader("Content-Encoding", "gzip");
    await pump(stream, gzip, res);
    // await pump(stream, res);
  } else {
    await pump(stream, res);
  }
  res.end();
}
