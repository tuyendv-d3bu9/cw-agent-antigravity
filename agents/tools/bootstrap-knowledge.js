#!/usr/bin/env node
/**
 * bootstrap-knowledge.js — Tự động khởi tạo tri thức ban đầu cho dự án mới
 *
 * Dùng:
 *   node agents/tools/bootstrap-knowledge.js
 *   npm run knowledge:init
 *
 * Nguyên tắc:
 *   Khi dự án mới tinh chưa có thư mục knowledge/, script này tự động sao chép
 *   bộ hạt giống chuẩn (Seed Templates) từ agents/templates/knowledge/ sang.
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const knowledgeDir = path.join(rootDir, 'knowledge');
const featuresDir = path.join(knowledgeDir, 'features');
const seedDir = path.join(rootDir, 'agents', 'templates', 'knowledge');

function bootstrapKnowledge() {
  console.log('🌱 Đang kiểm tra trạng thái bộ não tri thức (knowledge/)...');

  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
    console.log(' -> Đã tạo mới thư mục: knowledge/');
  }

  if (!fs.existsSync(featuresDir)) {
    fs.mkdirSync(featuresDir, { recursive: true });
    console.log(' -> Đã tạo mới thư mục: knowledge/features/');
  }

  if (!fs.existsSync(seedDir)) {
    console.error(`❌ LỖI: Không tìm thấy thư mục hạt giống chuẩn tại: ${seedDir}`);
    process.exit(1);
  }

  const seedFiles = fs.readdirSync(seedDir);
  let initializedCount = 0;

  seedFiles.forEach(file => {
    const destFile = path.join(knowledgeDir, file);
    if (!fs.existsSync(destFile)) {
      const srcFile = path.join(seedDir, file);
      fs.copyFileSync(srcFile, destFile);
      console.log(` -> Đã khởi tạo hạt giống: knowledge/${file}`);
      initializedCount++;
    }
  });

  if (initializedCount > 0) {
    console.log(`🎉 Khởi tạo tri thức dự án thành công (${initializedCount} file nền tảng).`);
  } else {
    console.log('✅ Bộ não tri thức knowledge/ đã đầy đủ các file nền tảng.');
  }
}

if (require.main === module) {
  bootstrapKnowledge();
}

module.exports = { bootstrapKnowledge };
