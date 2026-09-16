/**
 * conflict-detector.js
 * Module Phát Hiện Xung Đột Tri Thức Chéo (Cross-Feature Conflict Detector)
 * 
 * Mục tiêu: Tự động đối chiếu các Business Rules giữa các tài liệu tính năng trong knowledge/features/*.md
 * Phát hiện các điểm đá nhau về logic (Stacking khuyến mãi, Guest vs Member, Hoàn huỷ, Hằng số).
 * 
 * Cách dùng:
 *   node agents/tools/conflict-detector.js [target-feature-slug]
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const FEATURES_DIR = path.join(ROOT_DIR, 'knowledge', 'features');
const OUTPUT_DIR = path.join(ROOT_DIR, 'OUTPUT');

// Từ khóa phát hiện các khía cạnh nghiệp vụ nhạy cảm
const PATTERNS = {
  stacking: {
    category: 'Cộng dồn khuyến mãi (Promotion Stacking)',
    allowKeywords: ['cộng dồn', 'kết hợp', 'áp dụng đồng thời', 'stackable', 'dùng chung'],
    denyKeywords: ['không cộng dồn', 'không áp dụng đồng thời', 'chỉ 1 mã', 'duy nhất 1', 'không dùng chung']
  },
  guestCheckout: {
    category: 'Điều kiện tài khoản (Guest vs Logged-in)',
    allowKeywords: ['không cần đăng nhập', 'khách vãng lai', 'guest', 'chưa đăng nhập'],
    denyKeywords: ['bắt buộc đăng nhập', 'yêu cầu đăng nhập', 'phải đăng nhập', 'chỉ áp dụng thành viên', 'tài khoản kích hoạt']
  },
  cancellationRefund: {
    category: 'Chính sách hoàn trả khi huỷ đơn (Cancellation Refund)',
    allowKeywords: ['hoàn lại mã', 'hoàn voucher', 'phục hồi mã', 'restore voucher', 'hoàn về ví'],
    denyKeywords: ['không hoàn lại', 'hủy là mất', 'mất quyền sử dụng', 'không phục hồi']
  },
  shippingDiscount: {
    category: 'Phạm vi giảm giá (Phí ship vs Tiền hàng)',
    allowKeywords: ['giảm cả phí ship', 'áp dụng phí vận chuyển', 'freeship kết hợp'],
    denyKeywords: ['chỉ áp dụng tiền hàng', 'không giảm phí vận chuyển', 'không bao gồm ship']
  }
};

function parseFeatureFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const slug = path.basename(filePath, '.md');

  // Trích xuất tên tính năng
  const titleMatch = content.match(/^#\s+(?:Tính năng:\s*)?([^\n]+)/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  // Trích xuất các Business Rules (cả dạng bảng và dạng header)
  const rules = [];
  
  // Dạng bảng: | BR-01 | Nội dung quy tắc | Nguồn | Trạng thái |
  const tableRowRegex = /\|\s*(BR-[0-9]+)\s*\|\s*([^|]+)\s*\|/gi;
  let match;
  while ((match = tableRowRegex.exec(content)) !== null) {
    rules.push({
      id: match[1].toUpperCase(),
      title: match[2].trim(),
      body: match[2].trim()
    });
  }

  // Dạng header nếu có: ### BR-01: ...
  const headerRegex = /###\s+(BR-[0-9]+)[:\s]+([^\n]+)/gi;
  while ((match = headerRegex.exec(content)) !== null) {
    if (!rules.some(r => r.id === match[1].toUpperCase())) {
      rules.push({
        id: match[1].toUpperCase(),
        title: match[2].trim(),
        body: match[2].trim()
      });
    }
  }

  return {
    slug,
    title,
    content,
    rules
  };
}

function detectConflicts(features) {
  const conflicts = [];

  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {
      const featA = features[i];
      const featB = features[j];

      for (const [key, ruleDef] of Object.entries(PATTERNS)) {
        const textA = featA.content.toLowerCase();
        const textB = featB.content.toLowerCase();

        const aAllows = ruleDef.allowKeywords.some(kw => textA.includes(kw));
        const aDenies = ruleDef.denyKeywords.some(kw => textA.includes(kw));

        const bAllows = ruleDef.allowKeywords.some(kw => textB.includes(kw));
        const bDenies = ruleDef.denyKeywords.some(kw => textB.includes(kw));

        // Trường hợp 1: A cho phép, B cấm
        if (aAllows && bDenies) {
          conflicts.push({
            type: ruleDef.category,
            featureA: `${featA.slug} (${featA.title})`,
            featureB: `${featB.slug} (${featB.title})`,
            description: `Tính năng [${featA.slug}] cho phép / hỗ trợ nhưng [${featB.slug}] lại cấm hoặc loại trừ.`,
            recommendation: `Cần chốt lại với BA xem khi khách hàng thực hiện đồng thời cả hai tính năng thì ưu tiên quy tắc nào.`
          });
        }
        // Trường hợp 2: A cấm, B cho phép
        else if (aDenies && bAllows) {
          conflicts.push({
            type: ruleDef.category,
            featureA: `${featA.slug} (${featA.title})`,
            featureB: `${featB.slug} (${featB.title})`,
            description: `Tính năng [${featA.slug}] cấm / loại trừ nhưng [${featB.slug}] lại cho phép.`,
            recommendation: `Cần chốt lại với BA về thứ tự ưu tiên (Precedence Order) giữa 2 nghiệp vụ.`
          });
        }
      }
    }
  }

  return conflicts;
}

function main() {
  const targetSlug = process.argv[2];

  console.log('🔍 [CONFLICT DETECTOR] Đang quét tri thức tính năng tại knowledge/features/...\n');

  if (!fs.existsSync(FEATURES_DIR)) {
    console.error('❌ Thư mục knowledge/features/ không tồn tại.');
    process.exit(1);
  }

  const files = fs.readdirSync(FEATURES_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

  if (files.length === 0) {
    console.log('ℹ️ Chưa có file tri thức tính năng nào để đối chiếu.');
    return;
  }

  const features = files.map(f => parseFeatureFile(path.join(FEATURES_DIR, f)));
  console.log(`📚 Đã nạp ${features.length} tính năng:`);
  features.forEach(f => console.log(`  - [${f.slug}] ${f.title} (${f.rules.length} rules)`));

  const conflicts = detectConflicts(features);

  let reportLines = [
    `# BÁO CÁO RÀ SOÁT XUNG ĐỘT TRI THỨC CHÉO (CROSS-FEATURE CONFLICT REPORT)`,
    `Thời gian quét: ${new Date().toISOString()} · Phạm vi: ${features.length} tính năng`,
    ``
  ];

  if (conflicts.length === 0) {
    console.log('\n✅ TUYỆT VỜI: Không phát hiện xung đột mâu thuẫn logic nào giữa các tính năng hiện tại!');
    reportLines.push(`> [!NOTE]`);
    reportLines.push(`> **KẾT QUẢ: PASS** — Các tính năng trong \`knowledge/features/\` hoàn toàn nhất quán về chính sách người dùng, cộng dồn khuyến mãi và hoàn huỷ.`);
  } else {
    console.warn(`\n⚠️ PHÁT HIỆN ${conflicts.length} ĐIỂM XUNG ĐỘT LOGIC CẦN XÁC MINH VỚI BA:`);
    reportLines.push(`> [!WARNING]`);
    reportLines.push(`> Phát hiện **${conflicts.length} xung đột logic nghiệp vụ** giữa các tính năng. Đề xuất QA Analyst đưa vào \`02_missing_rule_report.md\` với Verdict **ASK** để chốt lại với PO/BA.`);
    reportLines.push(``);
    reportLines.push(`| STT | Khía cạnh xung đột | Tính năng A | Tính năng B | Chi tiết mâu thuẫn | Đề xuất xử lý |`);
    reportLines.push(`|---|---|---|---|---|---|`);

    conflicts.forEach((c, idx) => {
      console.warn(`  [${idx + 1}] ${c.type}:`);
      console.warn(`      ${c.featureA} ⚡ ${c.featureB}`);
      console.warn(`      Chi tiết: ${c.description}`);

      reportLines.push(`| ${idx + 1} | **${c.type}** | ${c.featureA} | ${c.featureB} | ${c.description} | ${c.recommendation} |`);
    });
  }

  // Nếu có chỉ định target slug trong OUTPUT, ghi file vào OUTPUT
  if (targetSlug && fs.existsSync(path.join(OUTPUT_DIR, targetSlug))) {
    const reportPath = path.join(OUTPUT_DIR, targetSlug, '01_conflict_warning.md');
    fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf-8');
    console.log(`\n📄 Đã lưu báo cáo xung đột tại: ${reportPath}`);
  }
}

main();
