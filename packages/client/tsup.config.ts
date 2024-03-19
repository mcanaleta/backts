import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"], // Specify output format
  dts: true,
  //   external: [], // Normally you'd list external dependencies here, but we're bundling everything
  //   noExternal: ["react", "@mui/material"], // Specify React and MUI to be bundled
  sourcemap: true, // Optional but recommended
  clean: true,
});
