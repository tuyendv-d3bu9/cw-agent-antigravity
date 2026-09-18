#!/usr/bin/env node
/**
 * intake.js — QA Leader Intake Gate (Gate 0):
 *   1. Converts raw document formats (.docx, .pdf, .txt) to clean Markdown (.md)
 *   2. Intelligently classifies content into 1 of 5 categories under INPUT/<slug>/
 *      (01_business, 02_ba, 03_dev, 04_design, 05_communication)
 *
 * Usage:
 *   npm run intake -- <file-or-dir> [--slug <task-slug>]
 * Examples:
 *   node agents/tools/intake.js "SRS_Auth.docx" --slug auth-login
 *   node agents/tools/intake.js "doc.pdf" --slug qa-standard-guide
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let mammoth;
try {
  mammoth = require('mammoth');
} catch (e) {
  // Mammoth optional if only parsing txt/pdf
}

const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
let targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;
const positional = args.filter((a, idx) => !a.startsWith('--') && idx !== slugIndex + 1);
const targetInput = positional[0];

if (!targetInput) {
  console.log('Usage:');
  console.log('  node agents/tools/intake.js <file-or-directory> [--slug <task-slug>]\n');
  console.log('Example:');
  console.log('  node agents/tools/intake.js "SRS_Auth.docx" --slug auth-login');
  process.exit(0);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanupMarkdown(md) {
  return md
    .replace(/<a id="[^"]*"><\/a>/g, '')
    .replace(/\\([()[\]*_.\-#!])/g, '$1')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Convert docx to markdown
async function convertDocx(filePath) {
  if (!mammoth) {
    throw new Error('Mammoth dependency not installed. Please run: npm install');
  }
  const result = await mammoth.convertToMarkdown({ path: filePath });
  return cleanupMarkdown(result.value);
}

// Extract PDF text to markdown via python pypdf
function convertPdf(filePath) {
  try {
    const pythonCmd = `python -c "import sys, pypdf; sys.stdout.reconfigure(encoding='utf-8'); r = pypdf.PdfReader(sys.argv[1]); print('\\n\\n'.join(p.extract_text() or '' for p in r.pages))" "${filePath}"`;
    const output = execSync(pythonCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    return cleanupMarkdown(output);
  } catch (err) {
    throw new Error(`Unable to extract PDF: ${err.message}`);
  }
}

// Classify document content into 1 of 5 intake buckets
function classifyDocument(content, filename) {
  const lowerContent = (content + ' ' + filename).toLowerCase();

  // 03_dev
  if (
    lowerContent.includes('swagger') ||
    lowerContent.includes('openapi') ||
    lowerContent.includes('status code') ||
    lowerContent.includes('database schema') ||
    lowerContent.includes('endpoint') ||
    lowerContent.includes('postman') ||
    filename.endsWith('.json') ||
    filename.endsWith('.yaml')
  ) {
    return '03_dev';
  }

  // 04_design
  if (
    lowerContent.includes('figma') ||
    lowerContent.includes('wireframe') ||
    lowerContent.includes('design system') ||
    lowerContent.includes('ui mockup') ||
    lowerContent.includes('pixel') ||
    lowerContent.includes('palette')
  ) {
    return '04_design';
  }

  // 05_communication
  if (
    lowerContent.includes('biên bản họp') ||
    lowerContent.includes('meeting minutes') ||
    lowerContent.includes('q&a') ||
    lowerContent.includes('hỏi đáp') ||
    lowerContent.includes('change request') ||
    lowerContent.includes('slack') ||
    lowerContent.includes('email')
  ) {
    return '05_communication';
  }

  // 01_business
  if (
    lowerContent.includes('chính sách cấp cao') ||
    lowerContent.includes('mục tiêu kinh doanh') ||
    lowerContent.includes('business strategy') ||
    lowerContent.includes('business objective') ||
    lowerContent.includes('vision') ||
    lowerContent.includes('kpi')
  ) {
    return '01_business';
  }

  // Default: 02_ba (PRD, SRS, User Stories, Acceptance Criteria)
  return '02_ba';
}

async function processFile(filePath, userSlug) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  const slug = userSlug || slugify(baseName);

  console.log(`\n📥 [GATE 0 - QA LEADER] Ingesting document: "${path.basename(filePath)}"`);
  console.log(`   -> Target feature slug: [ ${slug} ]`);

  let markdownContent = '';

  if (ext === '.docx') {
    console.log('   -> Format .docx: Converting to clean Markdown...');
    markdownContent = await convertDocx(filePath);
  } else if (ext === '.pdf') {
    console.log('   -> Format .pdf: Extracting text to Markdown...');
    markdownContent = convertPdf(filePath);
  } else if (ext === '.md' || ext === '.txt') {
    console.log('   -> Plain text format: Loading content...');
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } else {
    console.error(`❌ Format ${ext} is not supported for automated conversion.`);
    return;
  }

  // Classify into 5 categories
  const category = classifyDocument(markdownContent, path.basename(filePath));
  console.log(`   -> Categorized into: [ ${category} ]`);

  // Create destination directory
  const targetDir = path.join(process.cwd(), 'INPUT', slug, category);
  fs.mkdirSync(targetDir, { recursive: true });

  // Ensure all 5 categories exist for structure consistency
  const allCategories = ['01_business', '02_ba', '03_dev', '04_design', '05_communication'];
  allCategories.forEach(cat => {
    fs.mkdirSync(path.join(process.cwd(), 'INPUT', slug, cat), { recursive: true });
  });

  const destPath = path.join(targetDir, `${slugify(baseName)}.md`);
  fs.writeFileSync(destPath, markdownContent, 'utf8');

  console.log(`   ✅ Exported clean Markdown to:`);
  console.log(`      ${path.relative(process.cwd(), destPath)}`);
  console.log(`   💡 QA Leader is ready to generate 00_plan.md for "${slug}".\n`);
}

async function main() {
  const stat = fs.statSync(targetInput);
  if (stat.isFile()) {
    await processFile(targetInput, targetSlug);
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(targetInput);
    for (const file of files) {
      const full = path.join(targetInput, file);
      if (fs.statSync(full).isFile() && !file.startsWith('~$')) {
        await processFile(full, targetSlug);
      }
    }
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
