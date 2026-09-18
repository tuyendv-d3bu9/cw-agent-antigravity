#!/usr/bin/env node
/**
 * intake.js — Cổng tiếp nhận số 0 của QA Leader:
 *   1. Chuyển đổi mọi định dạng thô (.docx, .pdf, .txt) sang Markdown (.md) sạch
 *   2. Tự động phân tích nội dung để xếp vào đúng 1 trong 5 ngăn của INPUT/<slug>/
 *      (01_business, 02_ba, 03_dev, 04_design, 05_communication)
 *
 * Dùng:
 *   npm run intake -- <file-hoặc-thư-mục> [--slug <task-slug>]
 * Ví dụ:
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
  console.log('Cách dùng:');
  console.log('  node agents/tools/intake.js <file-hoặc-thư-mục> [--slug <task-slug>]\n');
  console.log('Ví dụ:');
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

// Chuyển đổi file docx sang markdown
async function convertDocx(filePath) {
  if (!mammoth) {
    throw new Error('Chưa cài đặt mammoth. Vui lòng chạy: npm install');
  }
  const result = await mammoth.convertToMarkdown({ path: filePath });
  return cleanupMarkdown(result.value);
}

// Chuyển đổi file pdf sang markdown qua pypdf
function convertPdf(filePath) {
  try {
    const pythonCmd = `python -c "import sys, pypdf; sys.stdout.reconfigure(encoding='utf-8'); r = pypdf.PdfReader(sys.argv[1]); print('\\n\\n'.join(p.extract_text() or '' for p in r.pages))" "${filePath}"`;
    const output = execSync(pythonCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    return cleanupMarkdown(output);
  } catch (err) {
    throw new Error(`Không thể trích xuất PDF: ${err.message}`);
  }
}

// Phân loại nội dung vào 1 trong 5 ngăn
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

  // Mặc định: 02_ba (PRD, SRS, User Stories, Acceptance Criteria)
  return '02_ba';
}

async function processFile(filePath, userSlug) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Không tìm thấy file: ${filePath}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  const slug = userSlug || slugify(baseName);

  console.log(`\n📥 [CỔNG 0 - QA LEADER] Tiếp nhận tài liệu: "${path.basename(filePath)}"`);
  console.log(`   -> Gán tính năng (Slug): [ ${slug} ]`);

  let markdownContent = '';

  if (ext === '.docx') {
    console.log('   -> Định dạng .docx: Đang chuyển đổi ngầm sang Markdown...');
    markdownContent = await convertDocx(filePath);
  } else if (ext === '.pdf') {
    console.log('   -> Định dạng .pdf: Đang trích xuất văn bản sang Markdown...');
    markdownContent = convertPdf(filePath);
  } else if (ext === '.md' || ext === '.txt') {
    console.log('   -> Định dạng văn bản thuần: Đang nạp nội dung...');
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } else {
    console.error(`❌ Định dạng ${ext} chưa được hỗ trợ chuyển đổi tự động.`);
    return;
  }

  // Phân loại vào 5 ngăn
  const category = classifyDocument(markdownContent, path.basename(filePath));
  console.log(`   -> Phân loại nội dung thông minh: Thuộc ngăn [ ${category} ]`);

  // Tạo thư mục đích
  const targetDir = path.join(process.cwd(), 'INPUT', slug, category);
  fs.mkdirSync(targetDir, { recursive: true });

  // Đảm bảo đủ cả 5 ngăn rỗng để chuẩn hóa cấu trúc
  const allCategories = ['01_business', '02_ba', '03_dev', '04_design', '05_communication'];
  allCategories.forEach(cat => {
    fs.mkdirSync(path.join(process.cwd(), 'INPUT', slug, cat), { recursive: true });
  });

  const destPath = path.join(targetDir, `${slugify(baseName)}.md`);
  fs.writeFileSync(destPath, markdownContent, 'utf8');

  console.log(`   ✅ ĐÃ XUẤT BẢN MARKDOWN SẠCH VÀO:`);
  console.log(`      ${path.relative(process.cwd(), destPath)}`);
  console.log(`   💡 QA Leader đã sẵn sàng lập 00_plan.md cho tính năng "${slug}".\n`);
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
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
