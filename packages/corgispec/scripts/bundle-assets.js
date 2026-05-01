#!/usr/bin/env node

/**
 * bundle-assets.js
 *
 * Copies skill files, JSON schemas, and workflow schemas from the repo
 * source-of-truth locations into the package's assets/ directory for distribution.
 *
 * Run as part of prepublishOnly: npm run build && node scripts/bundle-assets.js
 *
 * Asset sources:
 *   .opencode/skills/openspec-*  → assets/skills/
 *   schemas/                     → assets/schemas/ (JSON Schema files for validation)
 *   openspec/schemas/            → assets/schemas/ (workflow schemas for init/doctor)
 */

import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const repoRoot = resolve(packageRoot, "../..");

const assetsDir = resolve(packageRoot, "assets");

// --- Clean and recreate assets directory ---
if (existsSync(assetsDir)) {
  rmSync(assetsDir, { recursive: true });
}
mkdirSync(assetsDir, { recursive: true });

let totalFiles = 0;
const errors = [];

// --- 1. Bundle skills from .opencode/skills/openspec-* ---
const skillsSource = resolve(repoRoot, ".opencode/skills");
const skillsDest = resolve(assetsDir, "skills");
mkdirSync(skillsDest, { recursive: true });

if (existsSync(skillsSource)) {
  const entries = readdirSync(skillsSource, { withFileTypes: true });
  let skillCount = 0;

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("openspec-")) {
      const src = resolve(skillsSource, entry.name);
      const dest = resolve(skillsDest, entry.name);
      cpSync(src, dest, { recursive: true });
      skillCount++;

      // Validate: SKILL.md and skill.meta.json must exist
      if (!existsSync(resolve(dest, "SKILL.md"))) {
        errors.push(`${entry.name}: missing SKILL.md`);
      }
      if (!existsSync(resolve(dest, "skill.meta.json"))) {
        errors.push(`${entry.name}: missing skill.meta.json`);
      }
    }
  }

  totalFiles += skillCount;
  console.log(`✓ Bundled ${skillCount} skills from ${skillsSource}`);
} else {
  errors.push(`Skills source not found at ${skillsSource}`);
}

// --- 2. Bundle JSON schemas (for skill validation) ---
const jsonSchemasSource = resolve(repoRoot, "schemas");
const schemasDest = resolve(assetsDir, "schemas");
mkdirSync(schemasDest, { recursive: true });

if (existsSync(jsonSchemasSource)) {
  const schemaFiles = readdirSync(jsonSchemasSource).filter((f) => f.endsWith(".json"));

  for (const file of schemaFiles) {
    cpSync(resolve(jsonSchemasSource, file), resolve(schemasDest, file));
    totalFiles++;
  }

  console.log(`✓ Bundled ${schemaFiles.length} JSON schema(s) from ${jsonSchemasSource}`);
} else {
  errors.push(`JSON schemas source not found at ${jsonSchemasSource}`);
}

// --- 3. Bundle workflow schemas (for init/doctor) ---
const workflowSchemasSource = resolve(repoRoot, "openspec/schemas");

if (existsSync(workflowSchemasSource)) {
  const entries = readdirSync(workflowSchemasSource, { withFileTypes: true });
  let workflowCount = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const src = resolve(workflowSchemasSource, entry.name);
      const dest = resolve(schemasDest, entry.name);
      cpSync(src, dest, { recursive: true });
      workflowCount++;

      // Validate: schema.yaml must exist in each workflow schema
      if (!existsSync(resolve(dest, "schema.yaml"))) {
        errors.push(`Workflow schema ${entry.name}: missing schema.yaml`);
      }
    }
  }

  totalFiles += workflowCount;
  console.log(`✓ Bundled ${workflowCount} workflow schema(s) from ${workflowSchemasSource}`);
} else {
  errors.push(`Workflow schemas source not found at ${workflowSchemasSource}`);
}

// --- 4. Content verification (checksum comparison) ---
console.log("\nVerifying bundled content...");
let verifyCount = 0;
let verifyErrors = 0;

function verifyFile(srcPath, destPath) {
  if (!existsSync(srcPath) || !existsSync(destPath)) {
    return false;
  }
  const srcHash = createHash("sha256").update(readFileSync(srcPath)).digest("hex");
  const destHash = createHash("sha256").update(readFileSync(destPath)).digest("hex");
  return srcHash === destHash;
}

// Verify skills
if (existsSync(skillsSource)) {
  const entries = readdirSync(skillsSource, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("openspec-")) {
      for (const file of ["SKILL.md", "skill.meta.json"]) {
        const src = resolve(skillsSource, entry.name, file);
        const dest = resolve(skillsDest, entry.name, file);
        if (existsSync(src)) {
          if (verifyFile(src, dest)) {
            verifyCount++;
          } else {
            verifyErrors++;
            errors.push(`Checksum mismatch: ${entry.name}/${file}`);
          }
        }
      }
    }
  }
}

// Verify JSON schemas
if (existsSync(jsonSchemasSource)) {
  for (const file of readdirSync(jsonSchemasSource).filter((f) => f.endsWith(".json"))) {
    if (verifyFile(resolve(jsonSchemasSource, file), resolve(schemasDest, file))) {
      verifyCount++;
    } else {
      verifyErrors++;
      errors.push(`Checksum mismatch: schemas/${file}`);
    }
  }
}

console.log(`✓ Verified ${verifyCount} file(s), ${verifyErrors} mismatch(es)`);

// --- Summary ---
console.log(`\nAssets bundled to ${assetsDir}`);
console.log(`Total: ${totalFiles} items bundled`);

if (errors.length > 0) {
  console.error("\nErrors:");
  for (const e of errors) {
    console.error(`  ✗ ${e}`);
  }
  process.exit(1);
}
