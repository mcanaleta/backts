import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ESLint } from "eslint";
import { runDev, runDevBackend, runDevClient } from "./dev";
import swcCore from "@swc/core";
export async function _cli() {
  return await cli();
}

export async function cli() {
  yargs(hideBin(process.argv))
    .command(
      "dev",
      "dev",
      () => {},
      async () => {
        await runDev();
      }
    )
    .command(
      "server-dev",
      "server-dev",
      () => {},
      async () => {
        await runDevBackend();
      }
    )
    .command(
      "client-dev",
      "client-dev",
      () => {},
      async () => {
        await runDevClient();
      }
    )
    .command(
      "lint",
      "lint",
      () => {},
      async () => {
        const eslint = new ESLint({ fix: true });
        const results = await eslint.lintFiles(["src/**/*.ts", "src/**/*.tsx"]);
        await ESLint.outputFixes(results);
      }
    )
    .strictCommands()
    .demandCommand(1)
    .parse();
}
