import { AppContext } from "..";
import { AnyRequestContext } from "../requestcontext";

export function handleUnauthorized(reqctx: AnyRequestContext) {
  reqctx.res.statusCode = 401;
  reqctx.res.end("Unauthorized");
}

export function handleNotFound(reqctx: AnyRequestContext) {
  reqctx.res.statusCode = 404;
  reqctx.res.end("Not found");
}

// wrong method
export function handleMethodNotAllowed(reqctx: AnyRequestContext) {
  reqctx.res.statusCode = 405;
  reqctx.res.end("Method not allowed");
}

// bad request
export function handleBadRequest(reqctx: AnyRequestContext) {
  reqctx.res.statusCode = 400;
  reqctx.res.end("Bad request");
}
