import * as z from "zod";

// TYPES

export type ApiEndpoint<TInput = any, TOutput = any> = {
  input: z.ZodType<TInput>;
  output: z.ZodType<TOutput>;
};

export type ApiDefinition = {
  [key: string]: ApiEndpoint | RecursiveApiDefinition;
};

export interface RecursiveApiDefinition
  extends Record<string, ApiEndpoint | ApiDefinition> {}

export function defineApi<T extends ApiDefinition>(api: T): T {
  return api;
}

export function isApiEndpoint(obj: any): obj is ApiEndpoint {
  return obj && obj.input && obj.output;
}

// CLIENT SIDE

export type inferApiClientEndpoint<T> = T extends ApiEndpoint
  ? (input: z.infer<T["input"]>) => Promise<z.infer<T["output"]>>
  : never;

export type inferApiClientModule<T> = {
  [K in keyof T]: T[K] extends ApiEndpoint
    ? inferApiClientEndpoint<T[K]>
    : T[K] extends RecursiveApiDefinition
    ? inferApiClientModule<T[K]>
    : never;
};

export type inferApiClient<TApi extends ApiDefinition> =
  inferApiClientModule<TApi>;

async function fetchEndpoint<TI, TO>(
  baseUrl: string,
  input: TI,
  endpoint: ApiEndpoint<TI, TO>
) {
  // No need for methodNameToPath conversion
  const inputSchema = endpoint.input;
  inputSchema.parse(input); // validate input

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const status = response.status;
  if (status <= 400) {
    const jsonResponse = await response.json();
    return jsonResponse; // Assuming automatic validation of output
  } else {
    const text = await response.text();
    throw new Error(`Server error ${status}: ${text}`);
  }
}

function createApiClientObject<T extends ApiDefinition>(
  baseUrl: string,
  apiDefinition: T
): inferApiClient<T> {
  const apiClient: any = {};

  for (const key in apiDefinition) {
    if (key == "0") {
      throw new Error(`Invalid key: ${key}`);
    }
    const apiItem = apiDefinition[key];

    if (isApiEndpoint(apiItem)) {
      // It's an ApiEndpoint
      apiClient[key] = async (input: any) => {
        const endpointUrl = `${baseUrl}/${key}`;
        return fetchEndpoint(endpointUrl, input, apiItem);
      };
    } else {
      // It's a nested ApiDefinition
      const nestedBaseUrl = `${baseUrl}/${key}`;
      apiClient[key] = createApiClientObject(
        nestedBaseUrl,
        apiItem as ApiDefinition
      );
    }
  }

  return apiClient as inferApiClient<T>;
}

export function generateApiClient<T extends ApiDefinition>(
  baseUrl: string,
  api: T
): inferApiClient<T> {
  return createApiClientObject(baseUrl, api);
}

// SERVER SIDE

export type inferApiServerEndpoint<T, CTX> = T extends ApiEndpoint
  ? (ctx: CTX, input: z.infer<T["input"]>) => Promise<z.infer<T["output"]>>
  : never;

export type inferApiServerModule<T, CTX> = {
  [K in keyof T]: T[K] extends ApiEndpoint
    ? inferApiServerEndpoint<T[K], CTX>
    : T[K] extends RecursiveApiDefinition
    ? inferApiServerModule<T[K], CTX>
    : never;
};

export type inferApiServer<
  TApi extends ApiDefinition,
  CTX
> = inferApiServerModule<TApi, CTX>;

export async function handleApiRequest<TApi extends ApiDefinition, CTX>({
  ctx,
  api,
  pathParts,
  input,
  impl,
}: {
  ctx: CTX;
  api: TApi;
  pathParts: string[];
  input: string;
  impl: inferApiServer<TApi, CTX>;
}) {
  const endpointOrDefinition = api[pathParts[0]];
  if (!endpointOrDefinition) {
    throw new Error(`Unknown endpoint ${pathParts[0]}`);
  }
  const [nextPart, ...restParts] = pathParts;
  if (isApiEndpoint(endpointOrDefinition)) {
    const method = impl[nextPart] as inferApiServerEndpoint<
      typeof endpointOrDefinition,
      CTX
    >;
    if (input === "") {
      return await method(ctx, undefined);
    } else {
      const j = JSON.parse(input);
      return await method(ctx, j);
    }
  } else {
    const nestedApi = endpointOrDefinition as ApiDefinition;
    const nestedImpl = impl[nextPart] as inferApiServerModule<
      typeof nestedApi,
      CTX
    >;
    return await handleApiRequest({
      ctx,
      api: nestedApi,
      pathParts: restParts,
      input,
      impl: nestedImpl,
    });
  }
}

// export function generateOpenApi(api: ApiDefinition) {
//   const paths = Object.keys(api).reduce((acc, key) => {
//     const endpoint = api[key];
//     return {
//       ...acc,
//       [key]: {
//         post: {
//           requestBody: {
//             content: {
//               "application/json": {
//                 schema: endpoint.input.toJSON(),
//               },
//             },
//           },
//           responses: {
//             200: {
//               content: {
//                 "application/json": {
//                   schema: endpoint.output.toJSON(),
//                 },
//               },
//             },
//           },
//         },
//       },
//     };
//   }, {});
//   return {
//     openapi: "3.0.0",
//     info: {
//       title: "My API",
//       version: "1.0.0",
//     },
//     paths,
//   };
// }
