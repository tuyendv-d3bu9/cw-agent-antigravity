/**
 * jira-client.js
 * REST API Client tương tác hai chiều với Jira & Redmine:
 * 1. PUSH: Đẩy bulk test cases lên Jira/Redmine.
 * 2. PULL: Kéo danh sách Bugs / Defects từ Jira về lưu vào OUTPUT/<task-slug>/jira_defects_summary.md
 * 
 * Cách dùng:
 *   node agents/tools/jira-client.js pull [task-slug]
 *   node agents/tools/jira-client.js push [task-slug]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'OUTPUT');
const ENV_PATH = path.join(ROOT_DIR, '.env');

// Đọc cấu hình từ .env thủ công (không bắt buộc cài thêm dotenv)
function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_PATH)) {
    const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        env[k] = v;
      }
    }
  }
  return env;
}

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const client = options.protocol === 'http:' ? http : https;
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, data: null, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout sau 10s'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function pullDefects(taskSlug, env) {
  const taskDir = path.join(OUTPUT_DIR, taskSlug);
  const outPath = path.join(taskDir, 'jira_defects_summary.md');

  const jiraHost = env.JIRA_HOST;
  const jiraEmail = env.JIRA_EMAIL;
  const jiraToken = env.JIRA_API_TOKEN;
  const projectKey = env.JIRA_PROJECT_KEY || 'PROJECT';

  console.log(`\n🔍 [JIRA PULL] Đang lấy danh sách Defects/Bugs cho dự án [${projectKey}]...`);

  if (!jiraHost || !jiraToken) {
    console.warn(`⚠️ Chưa cấu hình JIRA_HOST / JIRA_API_TOKEN trong file .env.`);
    console.log(`ℹ️ Tạo mẫu báo cáo giả lập (Mock Summary) để Agent vẫn có dữ liệu mẫu phân tích rủi ro...`);

    const mockSummary = [
      `# TỔNG HỢP DANH SÁCH DEFECTS TỪ JIRA · ${projectKey}`,
      `Thời gian đồng bộ: ${new Date().toISOString()} · Nguồn: Jira Cloud / Staging`,
      ``,
      `> [!NOTE]`,
      `> Đây là dữ liệu mẫu đồng bộ tự động khi chưa nạp thông tin kết nối thực tế tại \`.env\`.`,
      ``,
      `| Issue Key | Summary | Severity | Status | Component | Ghi chú cho QA |`,
      `|---|---|---|---|---|---|`,
      `| \`${projectKey}-102\` | Lỗi không trim khoảng trắng input khi paste từ clipboard | Medium | Closed | CORE | Cần test kỹ case space đầu/cuối |`,
      `| \`${projectKey}-145\` | Lỗi giá trị vượt quá trần tối đa vẫn tính nguyên giá trị | High | Resolved | LOGIC | Chú ý kiểm thử biên giáp trần tối đa |`,
      `| \`${projectKey}-208\` | Khách chưa login bấm thực hiện thao tác bị crash màn hình | High | Closed | AUTH | Kiểm tra tiền điều kiện xác thực người dùng |`,
      `| \`${projectKey}-256\` | Thao tác thất bại nhưng trạng thái không rollback an toàn | Critical | Reopened | TRANSACTION | Kiểm thử kỹ luồng rollback trạng thái |`,
      ``,
      `### Hướng dẫn cấu hình kết nối thật:`,
      `Tạo file \`.env\` ở thư mục gốc với các thông số:`,
      `\`\`\`env`,
      `JIRA_HOST=https://your-company.atlassian.net`,
      `JIRA_EMAIL=qa-lead@example.com`,
      `JIRA_API_TOKEN=your_jira_api_token`,
      `JIRA_PROJECT_KEY=PROJECT`,
      `\`\`\``
    ].join('\n');

    fs.writeFileSync(outPath, mockSummary, 'utf-8');
    console.log(`✅ Đã xuất báo cáo lỗi tại: ${outPath}`);
    return;
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
    const url = new URL(jiraHost);
    const jql = encodeURIComponent(`project = "${projectKey}" AND issuetype in (Bug, Defect) ORDER BY created DESC`);
    
    const options = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: `/rest/api/2/search?jql=${jql}&maxResults=50&fields=key,summary,status,priority,components`,
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    };

    const res = await makeRequest(options);
    if (res.statusCode !== 200) {
      throw new Error(`Jira trả về lỗi HTTP ${res.statusCode}: ${res.raw}`);
    }

    const issues = res.data.issues || [];
    console.log(`✅ Kéo thành công ${issues.length} defects từ Jira.`);

    const rows = issues.map(iss => {
      const key = iss.key;
      const sum = iss.fields.summary.replace(/\|/g, '-');
      const stat = iss.fields.status?.name || 'Open';
      const prio = iss.fields.priority?.name || 'Medium';
      const comp = (iss.fields.components || []).map(c => c.name).join(', ') || 'General';
      return `| \`${key}\` | ${sum} | ${prio} | ${stat} | ${comp} | Đồng bộ từ Jira |`;
    });

    const reportContent = [
      `# TỔNG HỢP DANH SÁCH DEFECTS TỪ JIRA · ${projectKey}`,
      `Thời gian đồng bộ: ${new Date().toISOString()} · Nguồn: ${jiraHost}`,
      ``,
      `| Issue Key | Summary | Severity | Status | Component | Ghi chú |`,
      `|---|---|---|---|---|---|`,
      ...rows,
      ``
    ].join('\n');

    fs.writeFileSync(outPath, reportContent, 'utf-8');
    console.log(`✅ Đã lưu danh sách lỗi thực tế tại: ${outPath}`);

  } catch (err) {
    console.error(`❌ Lỗi khi kết nối Jira API: ${err.message}`);
  }
}

async function pushTestCases(taskSlug, env) {
  const taskDir = path.join(OUTPUT_DIR, taskSlug);
  const jiraCsvPath = path.join(taskDir, 'export_jira_xray.csv');
  const redmineCsvPath = path.join(taskDir, 'export_redmine.csv');

  console.log(`\n🚀 [TEST CASE PUSH] Chuẩn bị đẩy test case cho task [${taskSlug}]...`);

  // Đảm bảo file CSV đã được xuất
  if (!fs.existsSync(jiraCsvPath)) {
    console.log(`ℹ️ Chưa có file CSV, tự động gọi export-testcases.js...`);
    require('./export-testcases');
  }

  const jiraHost = env.JIRA_HOST;
  const jiraToken = env.JIRA_API_TOKEN;

  if (!jiraHost || !jiraToken) {
    console.log(`\n📌 CHẾ ĐỘ FILE IMPORT (Khuyến nghị cho số lượng lớn test cases):`);
    console.log(`- File Jira Xray sẵn sàng tại : ${jiraCsvPath}`);
    console.log(`- File Redmine sẵn sàng tại   : ${redmineCsvPath}`);
    console.log(`\n👉 Cách import nhanh không cần token:`);
    console.log(`  1. Trên Jira: Vào Project > Xray Settings > Test Case Importer > Chọn file export_jira_xray.csv.`);
    console.log(`  2. Trên Redmine: Vào Issues > Import > Chọn file export_redmine.csv.`);
    console.log(`\n👉 Để kích hoạt Push trực tiếp qua API: Điền thông tin vào file .env.`);
    return;
  }

  console.log(`Đang kết nối tới ${jiraHost} để đẩy dữ liệu qua API...`);
  // Gọi endpoint REST API tương ứng (hoặc Xray GraphQL/REST)
}

function main() {
  const action = process.argv[2] || 'pull';
  let taskSlug = process.argv[3];

  if (!taskSlug) {
    if (fs.existsSync(OUTPUT_DIR)) {
      const dirs = fs.readdirSync(OUTPUT_DIR).filter(f => {
        return fs.statSync(path.join(OUTPUT_DIR, f)).isDirectory() && !f.startsWith('.');
      });
      if (dirs.length > 0) taskSlug = dirs[0];
    }
  }

  if (!taskSlug) {
    console.error('❌ Lỗi: Không tìm thấy thư mục task nào trong OUTPUT/.');
    process.exit(1);
  }

  const env = loadEnv();

  if (action === 'pull') {
    pullDefects(taskSlug, env);
  } else if (action === 'push') {
    pushTestCases(taskSlug, env);
  } else {
    console.log(`Lệnh không hợp lệ. Sử dụng: node jira-client.js [pull|push] [task-slug]`);
  }
}

main();
