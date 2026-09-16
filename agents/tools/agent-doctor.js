#!/usr/bin/env node
/**
 * agent-doctor.js — Module chẩn đoán, kiểm tra toàn vẹn và phân tích tác động khi sửa Agent
 *
 * Dùng:
 *   npm run agent:check                       # Kiểm tra toàn vẹn toàn bộ hệ thống agent
 *   npm run agent:check --impact <tên-agent>  # Phân tích tác động (Blast Radius) khi sửa 1 agent
 * Ví dụ:
 *   npm run agent:check --impact qa-analyst
 *   npm run agent:check --impact 01
 */

const fs = require('fs');
const path = require('path');

const agentsDir = path.join(process.cwd(), 'agents');
const mapPath = path.join(process.cwd(), 'knowledge', '_system_map.json');

const args = process.argv.slice(2);
const impactIndex = args.indexOf('--impact');
const targetImpact = impactIndex !== -1 ? args[impactIndex + 1] : null;

// Bản đồ phụ thuộc (Dependency Graph) giữa các Deliverables và Skills
const PIPELINE_DEPENDENCIES = {
  '01': {
    skill: 'agents/qa-analyst/skills/01-requirement-risk-summary.md',
    produces: '01_requirement_risk_summary.md',
    consumed_by: [
      { step: '02', name: 'qa-analyst/02-missing-rule-06w', reason: 'Đọc Business Rules để tìm kẽ hở' },
      { step: '03', name: 'qa-analyst/03-viewpoint-selection', reason: 'Đọc Risk Matrix và bối cảnh nghiệp vụ' },
      { step: '04', name: 'qa-analyst/04-test-idea-design', reason: 'Đọc Business Rules để thiết kế test idea' },
      { step: '05', name: 'qa-test-design/05-test-case-generation', reason: 'Trace mã BR-xx vào Tags' },
      { step: '06', name: 'qa-test-design/06-coverage-review', reason: 'Rà soát độ phủ 100% BR-xx' },
      { step: '09', name: 'qa-test-data/09-data-class-map', reason: 'Đọc trường dữ liệu để phân loại Data Class' }
    ]
  },
  '02': {
    skill: 'agents/qa-analyst/skills/02-missing-rule-06w.md',
    produces: '02_missing_rule_report.md',
    consumed_by: [
      { step: '03', name: 'qa-analyst/03-viewpoint-selection', reason: 'Kết hợp kẽ hở 06W để chọn góc nhìn rủi ro' },
      { step: 'knowledge', name: 'knowledge/features/<slug>.md', reason: 'Nạp kẽ hở vào Mục 7 và Q&A BA vào Mục 8' }
    ]
  },
  '03': {
    skill: 'agents/qa-analyst/skills/03-viewpoint-selection.md',
    produces: '03_viewpoint_report.md',
    consumed_by: [
      { step: '04', name: 'qa-analyst/04-test-idea-design', reason: 'Phân bổ Test Idea theo từng Viewpoint' },
      { step: '05', name: 'qa-test-design/05-test-case-generation', reason: 'Trace mã VP-xx vào Tags của Test Case' },
      { step: '06', name: 'qa-test-design/06-coverage-review', reason: 'Rà soát độ phủ góc nhìn' },
      { step: '07', name: 'qa-exploratory/07-exploratory-charter', reason: 'Lấy Risk Area làm charter thăm dò' }
    ]
  },
  '04': {
    skill: 'agents/qa-analyst/skills/04-test-idea-design.md',
    produces: '04_test_idea_report.md',
    consumed_by: [
      { step: '05', name: 'qa-test-design/05-test-case-generation', reason: 'Expand toàn bộ Test Idea "Giữ" thành Test Case 8 trường' }
    ]
  },
  '05': {
    skill: 'agents/qa-test-design/skills/05-test-case-generation.md',
    produces: '05_test_case_spec.md & 05_test_blueprint.json',
    consumed_by: [
      { step: '06', name: 'qa-test-design/06-coverage-review', reason: 'Đánh giá độ phủ thực tế của từng Test Case' },
      { step: '12', name: 'qa-test-data/12-data-validation-traceability', reason: 'Ánh xạ dữ liệu test vào từng mã TC_ID' }
    ]
  },
  '09': {
    skill: 'agents/qa-test-data/skills/09-data-class-map.md',
    produces: '09_data_class_map.md',
    consumed_by: [
      { step: '10', name: 'qa-test-data/10-dataset-generation', reason: 'Lấy field map để sinh dataset thực tế' },
      { step: '11', name: 'qa-test-data/11-boundary-negative-dataset', reason: 'Lấy mốc min/max để sinh dataset biên' }
    ]
  }
};

// 1. Chế độ phân tích tác động (Impact Analysis)
if (targetImpact) {
  console.log('===============================================================');
  console.log(`      BÁO CÁO PHÂN TÍCH TÁC ĐỘNG KHI SỬA AGENT / SKILL        `);
  console.log('===============================================================\n');

  let matchedStep = null;
  for (const [step, info] of Object.entries(PIPELINE_DEPENDENCIES)) {
    if (step === targetImpact || info.skill.includes(targetImpact) || info.produces.includes(targetImpact)) {
      matchedStep = step;
      break;
    }
  }

  if (targetImpact.includes('qa-analyst') || targetImpact === 'analyst') {
    matchedStep = '01';
  } else if (targetImpact.includes('qa-test-design') || targetImpact === 'test-design') {
    matchedStep = '05';
  } else if (targetImpact.includes('qa-test-data') || targetImpact === 'test-data') {
    matchedStep = '09';
  }

  if (matchedStep && PIPELINE_DEPENDENCIES[matchedStep]) {
    const dep = PIPELINE_DEPENDENCIES[matchedStep];
    console.log(`🎯 Đối tượng sửa đổi: [ ${dep.skill} ]`);
    console.log(`📦 Sản phẩm đầu ra bị ảnh hưởng: [ ${dep.produces} ]\n`);
    console.log('⚠️  CÁC THÀNH PHẦN PHÍA SAU BỊ TÁC ĐỘNG (BLAST RADIUS):');
    console.log('---------------------------------------------------------------');
    dep.consumed_by.forEach((consumer, idx) => {
      console.log(` ${idx + 1}. Bước [${consumer.step}] -> ${consumer.name}`);
      console.log(`    Lý do ảnh hưởng: ${consumer.reason}`);
    });
    console.log('---------------------------------------------------------------');
    console.log('\n📋 CHECKLIST ĐỒNG BỘ BẮT BUỘC KHI SỬA:');
    console.log(' [ ] Nếu đổi mã định danh (vd: BR-xx -> REQ-xx) -> Phải sửa toàn bộ các bước tiêu thụ ở trên.');
    console.log(' [ ] Nếu thêm/bớt trường trong output -> Phải cập nhật format tại các bước sau.');
    console.log(' [ ] Cập nhật lại agents/qa-lead/AGENT.md (nếu đổi tên skill hoặc tham số).');
    console.log(' [ ] Chạy lệnh: npm run map:sync để đồng bộ lại bản đồ hệ thống.\n');
  } else {
    console.log(`ℹ️ Không tìm thấy quan hệ phụ thuộc cụ thể cho: "${targetImpact}".`);
    console.log('Gợi ý tìm kiếm: qa-analyst, qa-test-design, qa-test-data, 01, 02, 03, 04, 05, 09');
  }
  process.exit(0);
}

// 2. Chế độ kiểm tra toàn vẹn hệ thống (Health Check)
console.log('===============================================================');
console.log('           BÁO CÁO KIỂM TRA TOÀN VẸN HỆ THỐNG AGENT            ');
console.log('===============================================================\n');

const agentDirs = ['qa-lead', 'qa-analyst', 'qa-test-design', 'qa-test-data', 'qa-exploratory', 'qa-ui-review', 'qa-reporter'];
let totalErrors = 0;

agentDirs.forEach(agentName => {
  const agentPath = path.join(agentsDir, agentName);
  const agentFile = path.join(agentPath, 'AGENT.md');
  const skillsPath = path.join(agentPath, 'skills');

  if (!fs.existsSync(agentFile)) {
    console.log(`❌ LỖI: Thiếu file danh tính [ ${agentFile} ]`);
    totalErrors++;
    return;
  }

  // Đọc AGENT.md kiểm tra skill khai báo (chỉ lấy các dòng bắt đầu bằng "- `")
  const agentContent = fs.readFileSync(agentFile, 'utf8');
  let declaredSkills = [];
  const lines = agentContent.split('\n');
  let inSkillSection = false;
  
  for (const line of lines) {
    if (line.startsWith('## Skill sở hữu')) {
      inSkillSection = true;
      continue;
    }
    if (inSkillSection && line.startsWith('## ')) {
      break;
    }
    if (inSkillSection) {
      const match = line.match(/^-\s+`([^`]+)`/);
      if (match) {
        declaredSkills.push(match[1]);
      }
    }
  }

  // Kiểm tra file skill thực tế
  let actualSkills = [];
  if (fs.existsSync(skillsPath)) {
    actualSkills = fs.readdirSync(skillsPath).filter(f => f.endsWith('.md'));
  }

  let status = '✅ Chuẩn';
  let issue = '';

  // So sánh
  declaredSkills.forEach(s => {
    const found = actualSkills.some(act => act.startsWith(s) || act.includes(s));
    if (!found && agentName !== 'qa-lead') {
      status = '⚠️  LỆCH';
      issue += `Skill khai báo "${s}" không có file trong skills/. `;
      totalErrors++;
    }
  });

  console.log(`🤖 Agent: [ ${agentName} ] -> ${status}`);
  if (issue) console.log(`   - Vấn đề: ${issue}`);
});

console.log('\n---------------------------------------------------------------');
if (totalErrors === 0) {
  console.log('🎉 TOÀN BỘ HỆ THỐNG AGENT ĐẠT CHUẨN TOÀN VẸN 100%! Không có đứt gãy.');
} else {
  console.log(`⚠️  Phát hiện ${totalErrors} điểm cần hiệu chỉnh trong hệ thống.`);
}
console.log('💡 Để phân tích tác động trước khi sửa một agent, chạy:');
console.log('   npm run agent:check -- --impact <tên-agent>');
console.log('===============================================================\n');
