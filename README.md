# CW QA Agent — Hướng Dẫn Vận Hành

Hệ thống Agent QA chuyên sâu gồm 5 nhóm chuyên gia, điều hành tự động theo triết lý **Knowledge-First** và chuẩn **FACT**.
Toàn bộ quy tắc cốt lõi nằm tại `AGENTS.md` (root) và `agents/core/QA_STANDARD.md`.

---

## 1. Bản Đồ Thư Mục Hệ Thống

```
INPUT/                          TÀI LIỆU YÊU CẦU THÔ — BA/PO nạp file .md hoặc .docx vào đây
OUTPUT/<task-slug>/             KẾT QUẢ & DELIVERABLES — 00_plan.md, báo cáo 01->06, dataset, _index.md

knowledge/                      BỘ NÃO TRI THỨC VĨNH VIỄN (SSOT)
  _system_map.json              Bản đồ vệ tinh toàn hệ thống (Agent đọc file này đầu tiên)
  _project.md                   Quy ước dự án: format mã, tiền tệ VNĐ, timezone, NULL vs rỗng
  _glossary.md                  Từ điển thuật ngữ nghiệp vụ thống nhất
  _template.md                  Mẫu chuẩn tạo tri thức tính năng mới
  features/<feature-slug>.md    Quy tắc đã chốt · câu trả lời BA · giả định đã chốt · domain constant

agents/                         HỆ THỐNG QA NỘI BỘ
  qa-lead/AGENT.md              TỔNG CHỈ HUY — Cửa ngõ duy nhất tiếp nhận & điều phối
  core/QA_STANDARD.md           Luật chung: verdict · guard · FACT · 06W · risk matrix
  workflows/                    Các kịch bản chạy mẫu (run-testcase.md, flow.md...)
  tools/                        Công cụ convert docx, sync map, merge testcases, status
  qa-analyst/                   01->04: Tóm tắt yêu cầu, 06W kẽ hở, viewpoint, test idea
  qa-test-design/               05->06: Test case 8 trường, rà soát độ phủ 3 góc nhìn
  qa-test-data/                 09->12: Data class, dataset, validation & traceability
  qa-exploratory/               07: Thăm dò theo charter
  qa-ui-review/                 08: Phân tích ảnh màn hình (Vision)

.agents/                        Nơi cài đặt skill mở rộng bên ngoài (caveman, ponytail...)
```

**Thứ tự pipeline**:
1. Tạo kế hoạch `OUTPUT/<slug>/00_plan.md`
2. Chạy `01 → 02 → 03 → 04 → 05 → 06`
3. Chạy `09 → 10 → 11 → 12` (nếu cần dataset)

---

## 2. Cách Sử Dụng Với Các AI Agent

Nhờ đã cấu hình file hiến pháp `AGENTS.md` ở root, bất kỳ AI Agent nào (**Antigravity IDE, Claude Code, Cursor, Codex, Gemini CLI...**) khi mở thư mục dự án lên đều tự động nắm luật:

### Lệnh chạy đơn giản:
```
Tạo plan và chạy pipeline cho tính năng function-d từ INPUT/Function D.md.
```

### Quy trình tự động:
1. Agent tạo ngay file kế hoạch: `OUTPUT/<task-slug>/00_plan.md` để chia nhỏ milestone và chống tràn context.
2. Agent đọc `knowledge/_project.md`, `knowledge/_glossary.md` và `knowledge/features/<slug>.md`.
3. Chạy từng bước và cập nhật trạng thái `PASS / FIX / ASK` vào file Plan.

---

## 3. Các Lệnh Tiện Ích

- **Chuyển đổi tài liệu .docx từ BA thành .md**:
  ```bash
  npm run convert
  ```
- **Tạo nhanh file tri thức cho tính năng mới**:
  ```bash
  npm run knowledge:new <feature-slug>
  ```
- **Gộp các lô test case (batch) thành file đặc tả tổng**:
  ```bash
  npm run testcases:merge <task-slug>
  ```
- **Bảng điều phối tiến độ QA Leader (Dashboard)**:
  ```bash
  npm run status
  ```
- **Đồng bộ bản đồ hệ thống tập trung (System Map)**:
  ```bash
  npm run map:sync
  ```

---

## 4. Quản Lý Tri Thức Cho Dự Án Mới (`INPUT` ➔ `knowledge/`)

- **Bước 1**: Dự án mới chỉ cần có `knowledge/_project.md`. Nạp tài liệu BA vào `INPUT/`.
- **Bước 2**: Agent phân tích `INPUT/`, tự trích xuất quy tắc vào `knowledge/features/<slug>.md` Mục 3 (`CONFIRMED BUSINESS RULES`) và tìm kẽ hở 06W vào Mục 7 (`OPEN QUESTIONS`).
- **Bước 3**: BA trả lời các kẽ hở $\to$ Cập nhật vào Mục 8 (`GIẢ ĐỊNH ĐÃ CHỐT`).
- **Bước 4**: Lần sau chạy lại, Agent tự động kế thừa tri thức này mà không cần hỏi lại.
