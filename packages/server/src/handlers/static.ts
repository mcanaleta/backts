import { lookup } from "mime-types";
import { streamDiskFile } from "../lib/nodehttp";
import { handleBadRequest, handleMethodNotAllowed } from "./exceptions";
import { isFile } from "../utils/files";
import { RequestContext } from "../requestcontext";

export async function handleStaticApp(reqctx: RequestContext) {
  if (!reqctx.isGet) {
    return handleMethodNotAllowed(reqctx);
  }
  const { req, res } = reqctx;
  const path = req.url!.split("?")[0];
  if (!path.startsWith("/") || path.includes("../")) {
    return handleBadRequest(reqctx);
  }
  const filePath = `../client/dist${path}`;
  const pathToRead = (await isFile(filePath))
    ? filePath
    : "../client/dist/index.html";
  const extension = pathToRead.split(".").pop() || "";
  const mimeType = lookup(extension) || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);
  if (path.startsWith("/assets")) {
    res.setHeader("Cache-Control", "max-age=31536000");
  } else {
    // no cache
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
  }
  await streamDiskFile(pathToRead, req, res);
  // if file exists, pipe it to the response else pipe index.html to the response
}
