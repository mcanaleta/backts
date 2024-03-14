import { RequestContext } from "../requestcontext";

export function handleUnauthorized(reqctx: RequestContext) {
  reqctx.res.statusCode = 401;
  reqctx.res.end("Unauthorized");
}

export function handleNotFound(reqctx: RequestContext) {
  reqctx.res.statusCode = 404;
  reqctx.res.end("Not found");
}

// wrong method
export function handleMethodNotAllowed(reqctx: RequestContext) {
  reqctx.res.statusCode = 405;
  reqctx.res.end("Method not allowed");
}

// bad request
export function handleBadRequest(reqctx: RequestContext) {
  reqctx.res.statusCode = 400;
  reqctx.res.end("Bad request");
}
