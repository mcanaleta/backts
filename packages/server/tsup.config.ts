import { defineConfig, type Options } from "tsup";
import rawPlugin from "esbuild-plugin-raw";

export default defineConfig((options: Options) => ({
  esbuildPlugins: [rawPlugin()],
  entryPoints: ["src/index.ts"],
  clean: true,
  sourcemap: true,
  format: ["cjs"],
  ...options,
  dts: true,
}));
