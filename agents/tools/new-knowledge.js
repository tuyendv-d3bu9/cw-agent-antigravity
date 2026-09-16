#!/usr/bin/env node
/**
 * new-knowledge.js — Khởi tạo nhanh file tri thức tính năng từ _template.md
 *
 * Dùng:
 *   npm run knowledge:new <feature-slug>
 * Ví dụ:
 *   npm run knowledge:new checkout-voucher
 */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2];

if (!slug) {
  console.error('Vui lòng truyền feature-slug:');
  console.error('  npm run knowledge:new <feature-slug>');
  console.error('Ví dụ: npm run knowledge:new checkout-payment');
  process.exit(1);
}

const templatePath = path.join(__dirname, '..', '..', 'knowledge', '_template.md');
const targetDir = path.join(__dirname, '..', '..', 'knowledge', 'features');
const targetPath = path.join(targetDir, `${slug}.md`);

if (!fs.existsSync(templatePath)) {
  console.error(`Không tìm thấy template: ${templatePath}`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(targetPath)) {
  console.error(`File đã tồn tại: ${targetPath}`);
  console.error('Không ghi đè để bảo vệ tri thức cũ. Hãy đổi slug hoặc sửa trực tiếp file.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
let content = fs.readFileSync(templatePath, 'utf8');
content = content.replace(/<feature-slug>/g, slug);
content = content.replace(/<YYYY-MM-DD>/g, today);
content = content.replace(/<Tên Tính Năng>/g, slug.toUpperCase());

fs.writeFileSync(targetPath, content, 'utf8');
console.log(`\n Đã tạo thành công file tri thức tính năng:`);
console.log(`  -> ${targetPath}`);
console.log(`\nTiếp theo: Điền các thông tin đầu vào từ tài liệu BA vào file này hoặc để Agent tự nạp.\n`);
