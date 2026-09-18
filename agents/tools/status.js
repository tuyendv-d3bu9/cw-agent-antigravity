#!/usr/bin/env node
/**
 * status.js — QA Leader Dashboard: Quét tiến độ toàn bộ task trong OUTPUT/
 *
 * Dùng:
 *   npm run status               # Xem dashboard tiến độ mọi task
 *   npm run status -- <slug>     # Xem chi tiết 1 task cụ thể
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), 'OUTPUT');
const targetSlug = process.argv[2];

if (!fs.existsSync(outputDir)) {
  console.log('Thư mục OUTPUT/ chưa tồn tại. Chưa có task nào được thực thi.');
  process.exit(0);
}

const tasks = fs.readdirSync(outputDir).filter(f => {
  const fullPath = path.join(outputDir, f);
  return fs.statSync(fullPath).isDirectory() && !f.endsWith('.bak') && !f.startsWith('_');
});

if (tasks.length === 0) {
  console.log('Chưa có task nào trong OUTPUT/.');
  process.exit(0);
}

console.log('===============================================================');
console.log('         BẢNG ĐIỀU PHỐI TIẾN ĐỘ QA LEADER (DASHBOARD)          ');
console.log('===============================================================\n');

tasks.forEach(slug => {
  if (targetSlug && slug !== targetSlug) return;

  const taskDir = path.join(outputDir, slug);
  const planFile = path.join(taskDir, '00_plan.md');
  const indexFile = path.join(taskDir, '_index.md');
  const batchDir = path.join(taskDir, 'testcases');

  let status = 'CHƯA RÕ';
  let completedMilestones = 0;
  let totalMilestones = 6;
  let nextAction = 'Cần tạo 00_plan.md';
  let stopReason = '';

  if (fs.existsSync(planFile)) {
    const planText = fs.readFileSync(planFile, 'utf8');
    const checked = (planText.match(/- \[x\]/gi) || []).length;
    const unchecked = (planText.match(/- \[ \]/gi) || []).length;
    completedMilestones = checked;
    totalMilestones = checked + unchecked;

    if (planText.includes('Verdict: ASK') || planText.includes('| ASK |')) {
      status = ' ĐANG CHỜ BA (BLOCKED - ASK)';
      stopReason = 'Phát hiện kẽ hở nghiệp vụ, cần BA/PO trả lời.';
      nextAction = `Hỏi BA và cập nhật knowledge/features/${slug}.md`;
    } else if (unchecked === 0 && totalMilestones > 0) {
      status = ' HOÀN THÀNH (PASS)';
      nextAction = 'Bộ test suite đã sẵn sàng nghiệm thu.';
    } else {
      status = ' ĐANG THỰC HIỆN DỞ (IN-PROGRESS)';
      nextAction = `Chạy tiếp Chặng ${completedMilestones + 1}`;
    }
  }

  // Kiểm tra nếu có batch testcase
  let batchInfo = '';
  if (fs.existsSync(batchDir)) {
    const batches = fs.readdirSync(batchDir).filter(f => f.startsWith('batch_') && f.endsWith('.md'));
    if (batches.length > 0) {
      batchInfo = ` (Đã sinh ${batches.length} batch testcase)`;
    }
  }

  console.log(`📌 Task: [ ${slug} ]`);
  console.log(`   - Trạng thái: ${status}`);
  console.log(`   - Tiến độ:    ${completedMilestones}/${totalMilestones} chặng hoàn thành${batchInfo}`);
  if (stopReason) {
    console.log(`   - Lý do dừng: ${stopReason}`);
  }
  console.log(`   👉 Đề xuất hành động tiếp theo: ${nextAction}`);
  console.log('---------------------------------------------------------------');
});

console.log('\n💡 Để tiếp tục một task bất kỳ, bạn chỉ cần nói trong chat:');
console.log('   "Tiếp tục task <task-slug>" hoặc "Làm tiếp"');
console.log('===============================================================\n');
