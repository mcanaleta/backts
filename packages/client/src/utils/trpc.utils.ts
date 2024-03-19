import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { AnyRouter } from "@trpc/server/";

export async function createTrpcProxy() {
  return createTRPCProxyClient<AnyRouter>({
    links: [httpLink({ url: "/trpc" })],
  });
}
