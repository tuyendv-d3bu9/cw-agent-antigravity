#!/usr/bin/env node
/**
 * sync-system-map.js — Tự động đồng bộ bản đồ hệ thống knowledge/_system_map.json
 *
 * Dùng:
 *   npm run map:sync
 */

const fs = require('fs');
const path = require('path');

const mapPath = path.join(process.cwd(), 'knowledge', '_system_map.json');
const outputDir = path.join(process.cwd(), 'OUTPUT');
const inputDir = path.join(process.cwd(), 'INPUT');
const featuresDir = path.join(process.cwd(), 'knowledge', 'features');

if (!fs.existsSync(mapPath)) {
  console.error(`Không tìm thấy file: ${mapPath}`);
  process.exit(1);
}

let mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
mapData.last_updated = new Date().toISOString().split('T')[0];

// Quét các feature hiện có trong OUTPUT/
if (fs.existsSync(outputDir)) {
  const tasks = fs.readdirSync(outputDir).filter(f => {
    const fullPath = path.join(outputDir, f);
    return fs.statSync(fullPath).isDirectory() && !f.endsWith('.bak');
  });

  tasks.forEach(slug => {
    const taskDir = path.join(outputDir, slug);
    const planFile = path.join(taskDir, '00_plan.md');
    const specFile = path.join(taskDir, '05_test_case_spec.md');
    const featureKnowledge = `knowledge/features/${slug}.md`;
    
    // Tìm file input tương ứng
    let inputFile = `INPUT/${slug}.md`;
    if (fs.existsSync(inputDir)) {
      const inputs = fs.readdirSync(inputDir);
      const match = inputs.find(i => i.toLowerCase().includes(slug.replace(/-/g, ' ')) || i.toLowerCase().includes(slug));
      if (match) inputFile = `INPUT/${match}`;
    }

    let status = 'IN-PROGRESS';
    let lastVerdict = 'UNKNOWN';
    let totalTCs = 0;

    if (fs.existsSync(planFile)) {
      const planText = fs.readFileSync(planFile, 'utf8');
      if (planText.includes('COMPLETED') || (planText.match(/- \[x\]/g) || []).length >= 6) {
        status = 'COMPLETED (PASS)';
        lastVerdict = 'PASS';
      } else if (planText.includes('Verdict: ASK')) {
        status = 'WAITING_FOR_BA (ASK)';
        lastVerdict = 'ASK';
      }
    }

    if (fs.existsSync(specFile)) {
      const specText = fs.readFileSync(specFile, 'utf8');
      const tcMatches = specText.match(/### TC_ID:/g);
      if (tcMatches) totalTCs = tcMatches.length;
    }

    mapData.features_inventory[slug] = {
      name: slug,
      input_file: inputFile,
      knowledge_file: featureKnowledge,
      output_dir: `OUTPUT/${slug}/`,
      plan_file: `OUTPUT/${slug}/00_plan.md`,
      status: status,
      total_testcases: totalTCs,
      last_verdict: lastVerdict
    };
  });
}

fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2), 'utf8');
console.log(' Đã đồng bộ thành công bản đồ hệ thống:');
console.log(`  -> ${mapPath}`);
console.log(`  -> Đã cập nhật ${Object.keys(mapData.features_inventory).length} tính năng vào bản đồ.`);
