import { ApiDefinition, handleApiRequest, inferApiServer } from "backts-utils";
import { AppContext } from "../context";
import { RequestContext } from "../requestcontext";
import { readBody } from "./nodehttp";

export async function nodeApiHandler<T extends AppContext>(
  ctx: RequestContext<T>,
  api: ApiDefinition,
  impl: inferApiServer<ApiDefinition, RequestContext<T>>
) {
  const pathParts = ctx.pathParts.slice(1); // strip /api)
  const input = await readBody(ctx.req);
  try {
    const result = await handleApiRequest({
      ctx,
      api,
      pathParts,
      input,
      impl,
    });
    ctx.res.setHeader("Content-Type", "application/json");
    ctx.res.end(JSON.stringify(result));
  } catch (e: any) {
    ctx.res.statusCode = 500;
    ctx.res.end(e.message);
  }
}
