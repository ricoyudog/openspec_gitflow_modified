#!/usr/bin/env node

/**
 * bundle-assets.js
 *
 * Copies skill files and schemas from the repo source-of-truth locations
 * into the package's assets/ directory for distribution.
 *
 * Run as part of prepublishOnly: npm run build && node scripts/bundle-assets.js
 */

import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const repoRoot = resolve(packageRoot, "../..");

const assetsDir = resolve(packageRoot, "assets");

// Clean and recreate assets directory
if (existsSync(assetsDir)) {
  rmSync(assetsDir, { recursive: true });
}
mkdirSync(assetsDir, { recursive: true });

// Copy skills from .opencode/skills/openspec-*
const skillsSource = resolve(repoRoot, ".opencode/skills");
const skillsDest = resolve(assetsDir, "skills");
mkdirSync(skillsDest, { recursive: true });

if (existsSync(skillsSource)) {
  const entries = await import("node:fs/promises").then((fs) =>
    fs.readdir(skillsSource, { withFileTypes: true })
  );
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("openspec-")) {
      cpSync(resolve(skillsSource, entry.name), resolve(skillsDest, entry.name), {
        recursive: true,
      });
    }
  }
  console.log(`Bundled skills from ${skillsSource}`);
} else {
  console.warn(`Warning: Skills source not found at ${skillsSource}`);
}

// Copy schemas
const schemasSource = resolve(repoRoot, "schemas");
const schemasDest = resolve(assetsDir, "schemas");

if (existsSync(schemasSource)) {
  cpSync(schemasSource, schemasDest, { recursive: true });
  console.log(`Bundled schemas from ${schemasSource}`);
} else {
  console.warn(`Warning: Schemas source not found at ${schemasSource}`);
}

console.log(`Assets bundled to ${assetsDir}`);
