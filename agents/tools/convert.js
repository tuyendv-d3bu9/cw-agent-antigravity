#!/usr/bin/env node
/**
 * convert.js — đổi tài liệu .docx thành .md để nạp vào INPUT/
 *
 * Dùng:
 *   npm run convert                          # mọi .docx trong ./docx  ->  INPUT/
 *   npm run convert -- <file.docx>           # 1 file                  ->  INPUT/
 *   npm run convert -- <thư-mục> <đích>      # thư mục khác            ->  đích khác
 *   npm run convert -- <file.docx> --clean   # dọn rác mammoth (xem bên dưới)
 *
 * Vì sao cần: skill 01 đọc tài liệu yêu cầu ở INPUT/*.md. Tài liệu gốc từ BA
 * thường là .docx, phải đổi sang .md trước khi chạy pipeline.
 *
 * --clean làm gì: bỏ anchor rác `<a id="_xxx"></a>` và bỏ dấu escape thừa
 * (`\(` -> `(`, `\.` -> `.`) mà mammoth sinh ra. Mặc định TẮT để giữ nguyên
 * bản chuyển đổi — bật khi muốn bản .md dễ đọc hơn.
 */

const fs = require("fs");
const path = require("path");

let mammoth;
try {
  mammoth = require("mammoth");
} catch (e) {
  console.error("Chưa cài dependency. Chạy: npm install");
  process.exit(1);
}

const DEFAULT_SRC = "docx";
const DEFAULT_OUT = "INPUT";

const args = process.argv.slice(2);
const clean = args.includes("--clean");
const positional = args.filter((a) => !a.startsWith("--"));
const src = positional[0] || DEFAULT_SRC;
const outDir = positional[1] || DEFAULT_OUT;

function cleanup(md) {
  return md
    .replace(/<a id="[^"]*"><\/a>/g, "")
    .replace(/\\([()[\]*_.\-#!])/g, "$1")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function listDocx(target) {
  if (!fs.existsSync(target)) return null;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    return target.toLowerCase().endsWith(".docx") ? [target] : [];
  }
  return fs
    .readdirSync(target)
    .filter((f) => f.toLowerCase().endsWith(".docx") && !f.startsWith("~$"))
    .map((f) => path.join(target, f));
}

async function convertOne(file) {
  const result = await mammoth.convertToMarkdown({ path: file });
  const md = clean ? cleanup(result.value) : result.value;
  const outFile = path.join(outDir, path.basename(file, path.extname(file)) + ".md");

  if (fs.existsSync(outFile)) {
    console.error(`  BỎ QUA  ${outFile} — đã tồn tại, không ghi đè. Xoá hoặc đổi tên trước.`);
    return { skipped: true };
  }

  fs.writeFileSync(outFile, md, "utf8");
  console.log(`  OK      ${file}  ->  ${outFile}`);
  result.messages
    .filter((m) => m.type === "warning")
    .slice(0, 5)
    .forEach((m) => console.log(`          ! ${m.message}`));
  return { skipped: false };
}

(async () => {
  const files = listDocx(src);

  if (files === null) {
    console.error(`Không tìm thấy: ${src}`);
    console.error(`Tạo thư mục ./${DEFAULT_SRC}/ rồi bỏ file .docx vào, hoặc truyền đường dẫn:`);
    console.error(`  npm run convert -- duong/dan/file.docx`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Không có file .docx nào trong: ${src}`);
    process.exit(1);
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Đổi ${files.length} file .docx  ->  ${outDir}/${clean ? "  (--clean)" : ""}`);

  let ok = 0;
  let skipped = 0;
  for (const f of files) {
    try {
      const r = await convertOne(f);
      r.skipped ? skipped++ : ok++;
    } catch (err) {
      console.error(`  LỖI    ${f} — ${err.message}`);
    }
  }

  console.log(`Xong: ${ok} file mới, ${skipped} bỏ qua.`);
  if (ok > 0) {
    console.log(`Bước tiếp: kiểm nội dung trong ${outDir}/ rồi chạy workflows/run-to-testcase.md`);
  }
})();
