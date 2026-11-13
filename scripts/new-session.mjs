#!/usr/bin/env node
// Scaffolds a new, independent Next.js (App Router, src/ dir) session inside
// modules/<module>/<session>.
//
// Usage:
//   npm run new-session -- m01-fundamentals s01-jsx
//   npm run new-session -- m01-fundamentals s01-jsx --tailwind   (override a default flag)

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , moduleName, sessionName, ...extraFlags] = process.argv;

if (!moduleName || !sessionName) {
  console.error("Usage: npm run new-session -- <module> <session> [extra create-next-app flags]");
  console.error("Example: npm run new-session -- m01-fundamentals s01-jsx");
  process.exit(1);
}

const targetDir = path.join("modules", moduleName, sessionName);

if (existsSync(targetDir)) {
  console.error(`"${targetDir}" already exists.`);
  process.exit(1);
}

mkdirSync(path.join("modules", moduleName), { recursive: true });

// Sensible non-interactive defaults for a teaching session: TypeScript, App
// Router, code under src/, no Tailwind (kept minimal), npm, no auto-install
// (root `npm install` handles that once, across all sessions).
const defaultFlags = [
  "--typescript",
  "--eslint",
  "--no-tailwind",
  "--app",
  "--src-dir",
  "--import-alias", "@/*",
  "--use-npm",
  "--skip-install",
  "--no-turbopack",
];

// Flags passed on the command line are appended after the defaults, so
// repeating a flag (e.g. --tailwind) overrides the default.
const flags = [...defaultFlags, ...extraFlags];

console.log(`Scaffolding ${targetDir}...`);
execSync(`npx --yes create-next-app@latest ${targetDir} ${flags.join(" ")}`, {
  stdio: "inherit",
});

// create-next-app's Tailwind rule ("*.css" -> as "*.css") also matches
// *.module.css files and breaks CSS Modules (styles.x === undefined).
// Exclude CSS Modules from that rule.
const useTailwind = flags.lastIndexOf("--tailwind") > flags.lastIndexOf("--no-tailwind");
const configPath = path.join(targetDir, "next.config.ts");

if (useTailwind && existsSync(configPath)) {
  const config = readFileSync(configPath, "utf8");
  const cssRule = /(["']\*\.css["']\s*:\s*\{\n)(\s*)/;

  if (config.includes("module\\.css")) {
    // already patched
  } else if (cssRule.test(config)) {
    const patched = config.replace(
      cssRule,
      `$1$2condition: { not: { path: /\\.module\\.css$/ } },\n$2`
    );
    writeFileSync(configPath, patched);
    console.log("Patched next.config.ts: CSS Modules excluded from the Tailwind loader.");
  } else {
    console.warn(
      "WARNING: could not find the \"*.css\" rule in next.config.ts. " +
      "Add `condition: { not: { path: /\\.module\\.css$/ } },` to it manually."
    );
  }
}


console.log(`\nDone. Next steps:`);
console.log(`  1. npm install                 (run once, from the repo root)`);
console.log(`  2. npm run dev -w ${targetDir}`);
