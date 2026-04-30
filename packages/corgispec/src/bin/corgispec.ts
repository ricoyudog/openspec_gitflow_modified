import { Command } from "commander";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkNodeVersion } from "../lib/node-guard.js";

// Guard: exit early if Node version is too low
checkNodeVersion();

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf-8")
);

const program = new Command();

program
  .name("corgispec")
  .description(
    "Unified CLI for OpenSpec workflow — skill management, validation, and AI instruction generation"
  )
  .version(pkg.version)
  .option("--no-color", "Disable color output");

// Respect NO_COLOR environment variable (https://no-color.org/)
if (process.env["NO_COLOR"] !== undefined) {
  process.env["FORCE_COLOR"] = "0";
}

// Commands will be registered here as they are implemented
// program.command("init")...
// program.command("install")...
// program.command("validate")...
// program.command("list")...
// program.command("graph")...
// program.command("doctor")...
// program.command("propose")...
// program.command("apply")...
// program.command("review")...
// program.command("archive")...
// program.command("status")...
// program.command("instructions")...

program.parse();
