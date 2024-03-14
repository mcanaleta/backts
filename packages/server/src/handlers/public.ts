import { lookup } from "mime-types";
import { streamDiskFile } from "../lib/nodehttp";
import { handleBadRequest, handleNotFound } from "./exceptions";
import { RequestContext } from "../requestcontext";
import { isFile } from "../utils/files";

export async function handlePublic(reqctx: RequestContext) {
  const { req, res } = reqctx;
  const path = req.url!.split("?")[0];
  if (!path.startsWith("/public/") || path.includes("../")) {
    return handleBadRequest(reqctx);
  }
  const filePath = `.${path}`;
  if (!isFile(path)) {
    return handleNotFound(reqctx);
  }
  const extension = filePath.split(".").pop() || "";
  const mimeType = lookup(extension) || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);
  // cache 1 day?
  res.setHeader("Cache-Control", "max-age=86400");
  await streamDiskFile(filePath, req, res);
  // if file exists, pipe it to the response else pipe index.html to the response
}
