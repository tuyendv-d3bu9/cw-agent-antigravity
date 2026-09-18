#!/usr/bin/env node
/**
 * merge-testcases.js — Gộp toàn bộ các batch test case thành 05_test_case_spec.md
 *
 * Dùng:
 *   npm run testcases:merge <task-slug>
 * Ví dụ:
 *   npm run testcases:merge auth-login
 */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2];

if (!slug) {
  console.error('Vui lòng truyền task-slug:');
  console.error('  npm run testcases:merge <task-slug>');
  console.error('Ví dụ: npm run testcases:merge auth-login');
  process.exit(1);
}

const batchDir = path.join(process.cwd(), 'OUTPUT', slug, 'testcases');
const outputFile = path.join(process.cwd(), 'OUTPUT', slug, '05_test_case_spec.md');

if (!fs.existsSync(batchDir)) {
  console.error(`Không tìm thấy thư mục batches: ${batchDir}`);
  process.exit(1);
}

const files = fs.readdirSync(batchDir)
  .filter(f => f.startsWith('batch_') && f.endsWith('.md'))
  .sort();

if (files.length === 0) {
  console.error(`Không tìm thấy file batch nào trong ${batchDir}`);
  process.exit(1);
}

console.log(`Tìm thấy ${files.length} file batch. Đang tiến hành gộp...`);

let combinedContent = `# TEST CASE SPECIFICATION · ${slug}\n`;
combinedContent += `Owner: agents/qa-test-design/test-case-generation · Nguồn: OUTPUT/${slug}/05_test_blueprint.json · Verdict: PASS\n\n`;
combinedContent += `> Tổng hợp tự động từ ${files.length} batch kiểm thử chi tiết.\n\n---\n\n`;

let totalCases = 0;
for (const file of files) {
  const filePath = path.join(batchDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Đếm số lượng TC
  const matches = content.match(/### TC_ID:/g);
  if (matches) totalCases += matches.length;

  combinedContent += `## Lô kiểm thử: ${file}\n\n`;
  combinedContent += content.trim() + '\n\n---\n\n';
}

fs.writeFileSync(outputFile, combinedContent, 'utf8');
console.log(`\n Đã gộp thành công ${totalCases} test cases vào:`);
console.log(`  -> ${outputFile}\n`);
