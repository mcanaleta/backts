import { streamDiskFile } from "../lib/nodehttp";
import { handleBadRequest, handleNotFound } from "./exceptions";
import { RequestContext } from "../requestcontext";
import { isFile } from "../utils/files";
import { AppContext } from "..";

export async function handlePublic<AppContextType extends AppContext>(
  reqctx: RequestContext<AppContextType>
) {
  const { req, res } = reqctx;
  const path = req.url!.split("?")[0];
  if (!path.startsWith("/public/") || path.includes("../")) {
    return handleBadRequest(reqctx);
  }
  const modulePath = `${__dirname}/..${path}`;

  const localPath = `.${path}`;

  console.log({ modulePath, localPath });

  const pathToServe = (await isFile(modulePath))
    ? modulePath
    : (await isFile(localPath))
    ? localPath
    : null;
  if (!pathToServe) {
    return handleNotFound(reqctx);
  }
  // cache 1 day?
  res.setHeader("Cache-Control", "max-age=86400");
  await streamDiskFile(pathToServe, req, res);
  // if file exists, pipe it to the response else pipe index.html to the response
}
