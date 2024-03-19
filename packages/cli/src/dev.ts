import react from "@vitejs/plugin-react";
import { createServer } from "vite";

export async function runDev() {
  await Promise.all([runDevClient(), runDevBackend()]);
}
export async function runDevClient() {
  process.chdir("./packages/client");
  const server = await createServer({
    // root: "./packages/client",
    configFile: false,

    plugins: [react()],
    build: {
      rollupOptions: {
        external: ["src/server/**"],
      },
    },
    resolve: {
      alias: {
        "@client": "/src",
      },
    },

    server: {
      proxy: {
        "/trpc": "http://localhost:3000",
        "/auth": "http://localhost:3000",
      },
    },
  });

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
  process.chdir("../..");
}

export async function runDevBackend() {
  // process.chdir("./packages/server");
  // const transformed = await swc.transformFile("src/index.ts", {
  //   jsc: {
  //     parser: {
  //       syntax: "typescript",
  //       decorators: true,
  //     },
  //     transform: {
  //       decoratorVersion: "2022-03",
  //     },
  //     target: "es2019",
  //     baseUrl: "src",
  //     paths: {
  //       "@server/*": ["*"],
  //     },
  //   },
  //   module: {
  //     type: "commonjs",
  //   },
  //   sourceMaps: true,
  // });
  // const server = await createServer({
  //   configFile: false,
  //   plugins: [
  //     {
  //       name: "backend",
  //       configureServer(server) {
  //         server.middlewares.use((req, res, next) => {
  //           console.log("middleware", req.url);
  //           next();
  //         });
  //       },
  //     },
  //   ],
  //   build: {
  //     rollupOptions: {
  //       external: ["src/client/**"],
  //     },
  //   },
  //   resolve: {
  //     alias: {
  //       "@server": "/src",
  //     },
  //   },
  // });
  // await server.listen();
  // server.printUrls();
  // server.bindCLIShortcuts({ print: true });
  // process.chdir("../..");
}
