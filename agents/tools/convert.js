#!/usr/bin/env node
/**
 * convert.js — Converts .docx documents to clean markdown (.md) for INPUT/
 *
 * Usage:
 *   npm run convert                          # All .docx files in ./docx -> INPUT/
 *   npm run convert -- <file.docx>           # Single file               -> INPUT/
 *   npm run convert -- <src_dir> <out_dir>   # Custom directory          -> Custom output
 *   npm run convert -- <file.docx> --clean   # Clean mammoth artifacts (anchors, escape characters)
 */

const fs = require("fs");
const path = require("path");

let mammoth;
try {
  mammoth = require("mammoth");
} catch (e) {
  console.error("Missing dependency. Please run: npm install");
  process.exit(1);
}

const DEFAULT_SRC = "docx";
const DEFAULT_OUT = "INPUT";

const args = process.argv.slice(2);
const clean = args.includes("--clean");
const positional = args.filter((a) => !a.startsWith("--"));
const src = positional[0] || DEFAULT_SRC;
const outDir = positional[1] || DEFAULT_OUT;

function cleanup(md) {
  return md
    .replace(/<a id="[^"]*"><\/a>/g, "")
    .replace(/\\([()[\]*_.\-#!])/g, "$1")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function listDocx(target) {
  if (!fs.existsSync(target)) return null;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    return target.toLowerCase().endsWith(".docx") ? [target] : [];
  }
  return fs
    .readdirSync(target)
    .filter((f) => f.toLowerCase().endsWith(".docx") && !f.startsWith("~$"))
    .map((f) => path.join(target, f));
}

async function convertOne(file) {
  const result = await mammoth.convertToMarkdown({ path: file });
  const md = clean ? cleanup(result.value) : result.value;
  const outFile = path.join(outDir, path.basename(file, path.extname(file)) + ".md");

  if (fs.existsSync(outFile)) {
    console.error(`  SKIPPED  ${outFile} — already exists, will not overwrite. Delete or rename first.`);
    return { skipped: true };
  }

  fs.writeFileSync(outFile, md, "utf8");
  console.log(`  OK       ${file}  ->  ${outFile}`);
  result.messages
    .filter((m) => m.type === "warning")
    .slice(0, 5)
    .forEach((m) => console.log(`           ! ${m.message}`));
  return { skipped: false };
}

(async () => {
  const files = listDocx(src);

  if (files === null) {
    console.error(`Source not found: ${src}`);
    console.error(`Create directory ./${DEFAULT_SRC}/ and add .docx files, or provide path:`);
    console.error(`  npm run convert -- path/to/file.docx`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`No .docx files found in: ${src}`);
    process.exit(1);
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Converting ${files.length} .docx file(s) -> ${outDir}/${clean ? "  (--clean)" : ""}`);

  let ok = 0;
  let skipped = 0;
  for (const f of files) {
    try {
      const r = await convertOne(f);
      r.skipped ? skipped++ : ok++;
    } catch (err) {
      console.error(`  ERROR    ${f} — ${err.message}`);
    }
  }

  console.log(`Finished: ${ok} converted, ${skipped} skipped.`);
  if (ok > 0) {
    console.log(`Next step: Verify markdown in ${outDir}/ and run test analysis workflows.`);
  }
})();
