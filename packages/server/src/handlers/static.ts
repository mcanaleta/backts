import { streamDiskFile } from "../lib/nodehttp";
import { handleBadRequest, handleMethodNotAllowed } from "./exceptions";
import { isFile } from "../utils/files";
import { RequestContext } from "../requestcontext";
import { AppContext } from "..";

export async function handleStaticApp<TA extends AppContext>(
  reqctx: RequestContext<TA>
) {
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
