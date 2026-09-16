# AGENTS — Hiến Pháp & Bản Đồ Điều Hành Hệ Thống

> File này là **Hiến pháp tối cao** cho mọi AI Agent (**Antigravity IDE, Claude Code, Cursor, Codex, Copilot, Gemini CLI...**) khi làm việc trong repository này.
> Mọi tương tác, phân tích, sinh kết quả đều phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

---

## 1. Cấu Trúc Thư Mục Chuẩn (Gọn Gàng & Trực Quan)

Dự án được tổ chức thành các khu vực chức năng rạch ròi. Người dùng chỉ cần quan sát `INPUT/` và `OUTPUT/`:

```
📁 <Project-Root>/
│
├── 📄 AGENTS.md                  # [Hiến pháp tối cao] Mọi Agent tự động đọc đầu tiên
├── 📄 README.md                  # Hướng dẫn nhanh cho người dùng
│
├── 📁 INPUT/                     # Nơi DUY NHẤT chứa tài liệu yêu cầu từ BA/PO (.docx, .md)
├── 📁 OUTPUT/                    # Nơi DUY NHẤT chứa kết quả phân tích & deliverables
│   └── 📁 <task-slug>/
│       ├── 00_plan.md            # [BẮT BUỘC] Kế hoạch thực thi chống tràn context
│       ├── 01_requirement_risk_summary.md
│       ├── 02_missing_rule_report.md
│       ├── 03_viewpoint_report.md
│       ├── 04_test_idea_report.md
│       ├── 05_test_case_spec.md
│       ├── 06_coverage_review.md
│       ├── 09_* -> 12_*          # Dataset và Traceability (nếu có)
│       └── _index.md             # Mục lục kết quả & Verdict từng bước
│
├── 📁 knowledge/                 # BỘ NÃO TRI THỨC VĨNH VIỄN CỦA DỰ ÁN (SSOT)
│   ├── 📄 _project.md            # Quy ước toàn dự án (mã, tiền tệ, timezone, auth, error code)
│   ├── 📄 _glossary.md           # Từ điển thuật ngữ nghiệp vụ thống nhất
│   ├── 📄 _template.md           # Mẫu chuẩn tạo tri thức tính năng mới
│   └── 📁 features/              # Tri thức tích luỹ của từng tính năng (<feature-slug>.md)
│
├── 📁 agents/                    # Hệ thống chuyên gia QA & công cụ thực thi nội bộ
│   ├── 📁 qa-analyst/            # 01 -> 04: Tóm tắt yêu cầu, 06W kẽ hở, viewpoint, test idea
│   ├── 📁 qa-test-design/        # 05 -> 06: Test case 8 trường, rà soát độ phủ
│   ├── 📁 qa-test-data/          # 09 -> 12: Data class, dataset, validation & traceability
│   ├── 📁 qa-exploratory/        # 07: Thăm dò theo charter
│   ├── 📁 qa-ui-review/          # 08: Phân tích ảnh màn hình giao diện
│   ├── 📁 core/                  # QA_STANDARD.md (Luật bất biến & FACT standard)
│   ├── 📁 workflows/             # Runbooks điều phối quy trình (run-testcase.md...)
│   ├── 📁 templates/             # Mẫu khung định dạng Agent và Skill
│   └── 📁 tools/                 # Tiện ích chuyển đổi docx và tạo knowledge mới
│
└── 📁 .agents/                   # Nơi cài đặt các external skills bổ trợ (caveman, ponytail...)
```

---

## 2. Quy Tắc Bắt Buộc: "Plan First" Chống Tràn Context (Mọi Agent Phải Tuân Thủ)

Khi nhận bất kỳ yêu cầu phân tích tính năng hay chạy pipeline, **Agent BẮT BUỘC phải tạo file Plan trước khi thực thi**:

### Vị trí lưu Plan:
```
OUTPUT/<task-slug>/00_plan.md
```

### Mục đích của `00_plan.md`:
1. **Kiểm soát Context Window**: Tránh đọc tràn lan tất cả file cùng lúc làm đầy ngữ cảnh, khiến AI bị phân tâm và hallucinate. Mỗi bước (Milestone) Agent chỉ nạp đúng file đầu vào của bước đó.
2. **Kế thừa xuyên Agent**: Khi người dùng chuyển đổi giữa các tool (từ Antigravity sang Claude Code hay Cursor), Agent mới chỉ cần mở `00_plan.md` là biết ngay tiến độ đang dừng ở đâu để làm tiếp, không cần tóm tắt lại lịch sử chat.

### Cấu trúc chuẩn của `00_plan.md`:
```markdown
# Kế Hoạch Phân Tích & Kiểm Thử · <task-slug>
Ngày tạo: YYYY-MM-DD · Người lập: <Agent/Tool> · Trạng thái: IN-PROGRESS

## 1. Phạm Vi & Tài Liệu Nguồn
- Tài liệu yêu cầu: INPUT/<file>.md
- Tri thức dự án: knowledge/_project.md, knowledge/_glossary.md
- Tri thức tính năng: knowledge/features/<task-slug>.md

## 2. Lộ Trình Từng Chặng (Milestones)
- [ ] **Chặng 1**: Đọc yêu cầu thô & Phân tích rủi ro (`01`) ➔ Ra `01_requirement_risk_summary.md`
- [ ] **Chặng 2**: Quét kẽ hở 06W & Câu hỏi cho BA (`02`) ➔ Ra `02_missing_rule_report.md`
      *(Nếu Verdict là ASK -> DỪNG để người dùng chốt với BA)*
- [ ] **Chặng 3**: Chọn Risk Area & Viewpoints (`03`) ➔ Ra `03_viewpoint_report.md`
- [ ] **Chặng 4**: Thiết kế Test Idea & Lọc Giữ/Bỏ (`04`) ➔ Ra `04_test_idea_report.md`
- [ ] **Chặng 5**: Sinh Test Case chi tiết 8 trường (`05`) ➔ Ra `05_test_case_spec.md`
- [ ] **Chặng 6**: Rà soát độ phủ 3 góc nhìn & Nghiệm thu (`06`) ➔ Ra `06_coverage_review.md`

## 3. Nhật Ký Verdict & Điểm Chặn (Stop-Gates)
| Bước | Deliverable | Verdict | Ghi chú / Điểm dừng |
|---|---|---|---|
| 01 | 01_requirement_risk_summary.md | PASS |  |
| 02 | 02_missing_rule_report.md | ASK | Chờ BA trả lời MR-06 về làm tròn tiền lẻ |
```

---

## 3. Quy Tắc Xử Lý Quy Mô Lớn: Blueprint JSON & Batch Generation (Chống Tràn Token)

Khi số lượng Test Case dự tính vượt quá **50 test cases** (hoặc lên tới hàng trăm, hàng nghìn test cases), **CẤM** cố sinh toàn bộ trong 1 lần (One-shot) vì chắc chắn sẽ bị cắt cụt token hoặc suy giảm chất lượng. Mọi Agent bắt buộc tuân theo quy trình 3 giai đoạn:

```
[04-test-idea-report] ──► 1. TẠO BLUEPRINT JSON (05_test_blueprint.json)
                                    │
                                    ├──► Lô 1 (batch_01.md: TC-001 -> TC-050)
                                    ├──► Lô 2 (batch_02.md: TC-051 -> TC-100)
                                    └──► ... Lô N
                                    │
                          3. GỘP TỔNG (npm run testcases:merge <slug>)
                                    ▼
                          05_test_case_spec.md
```

1. **Giai đoạn 1 — Bản thiết kế khung (`05_test_blueprint.json`)**:
   - Sinh danh mục metadata rút gọn cho toàn bộ 500 - 1.000 test case (TC ID, Module, Rule ID, Viewpoint ID, Mục đích kiểm thử, Priority).
   - Bản thiết kế này nhẹ (~30 token/item), đảm bảo bao quát 100% phạm vi mà không bị đứt đoạn hay trùng lặp.
2. **Giai đoạn 2 — Chia lô sinh chi tiết (`Chunked Batching`)**:
   - Chia danh mục thành các lô nhỏ (khuyến nghị **50 test cases / batch**).
   - Sinh chi tiết 8 trường chuẩn cho từng lô vào `OUTPUT/<task-slug>/testcases/batch_01.md`, `batch_02.md`...
3. **Giai đoạn 3 — Gộp tổng thể (`Assembly`)**:
   - Chạy lệnh tiện ích để tự động ghép các lô thành file đặc tả hoàn chỉnh:
     ```bash
     npm run testcases:merge <task-slug>
     ```

---

## 4. Quy Trình Khởi Tạo & Tích Luỹ Tri Thức Cho Dự Án Mới (`INPUT` ➔ `knowledge/`)

Đối với một dự án mới tinh **chưa có tri thức nền**:

1. **Khởi tạo tối thiểu**:
   - `knowledge/_project.md`: Điền vài quy ước dự án cơ bản (tiền tệ, timezone, định dạng mã).
   - Thả file tài liệu của BA (PRD/SRS) vào `INPUT/<feature>.md` (dùng `npm run convert` nếu là `.docx`).
2. **Khởi tạo tri thức tính năng**:
   - Chạy lệnh: `npm run knowledge:new <feature-slug>` để tạo `knowledge/features/<feature-slug>.md`.
3. **Agent tự động bóc tách từ `INPUT/`**:
   - Chạy bước `01`: Agent trích xuất các quy tắc đã có căn cứ rõ ràng từ `INPUT/` nạp vào Mục 3 (`CONFIRMED BUSINESS RULES`).
   - Chạy bước `02`: Agent quét 06W tìm ra các kẽ hở logic mà tài liệu chưa nêu, ghi vào Mục 7 (`OPEN QUESTIONS`) với trạng thái `New` và ra Verdict `ASK`.
4. **BA/PO phản hồi**:
   - Người dùng đưa câu trả lời của BA vào Mục 8 (`GIẢ ĐỊNH ĐÃ CHỐT`) và chuyển rule sang `Confirmed`.
5. **Kế thừa lâu dài**:
   - Lần chạy tiếp theo, Agent đọc `knowledge/features/<feature-slug>.md` ➔ **Không hỏi lại điều đã trả lời**, áp dụng ngay vào Test Cases.

---

## 5. Các Ràng Buộc Bất Biến (Non-Negotiable Rules)

1. **Chuẩn FACT 100% (Chống Ảo Giác)**:
   - **Factual**: Mọi kết luận phải dẫn xuất từ `INPUT/` hoặc `knowledge/`. Cấm tự bịa quy tắc.
   - **Accurate**: Dùng đúng mã định danh (`BR-xx`, `MR-xx`, `VP-xx`, `TC-xx`) và thuật ngữ trong `knowledge/_glossary.md`.
   - **Complete**: Quét đủ 6 câu hỏi 06W (W1 đến W6). Không bỏ sót nhánh ngoại lệ.
   - **Testable**: Kỳ vọng đầu ra phải kiểm chứng được nhị phân (Pass/Fail).
2. **Bắt buộc gắn nhãn `[GIẢ ĐỊNH]`**:
   - Bất kỳ điểm nào tài liệu chưa nêu mà Agent tự suy đoán đều **BẮT BUỘC** gắn tiền tố `[GIẢ ĐỊNH]` kèm mức độ rủi ro.
3. **Cổng Nghiệm Thu (Verdict Gates)**:
   - `PASS`: Đạt chuẩn ➔ Chạy bước tiếp.
   - `FIX`: Sai format/trace ➔ Agent tự sửa.
   - `ASK`: Hổng nghiệp vụ ➔ DỪNG LẠI, hỏi người dùng, không được tự suy đoán đi tiếp.
4. **Không làm bẩn thư mục gốc (Keep Root Clean)**:
   - Không sinh file tùy tiện ngoài thư mục gốc. Mọi kết quả phân tích PHẢI nằm trong `OUTPUT/<task-slug>/`.

---

## 6. Lệnh Tiện Ích

- Đổi file `.docx` từ BA sang `.md`:
  ```bash
  npm run convert
  ```
- Tạo file tri thức mới cho tính năng:
  ```bash
  npm run knowledge:new <feature-slug>
  ```
- Gộp các batch test case thành spec tổng:
  ```bash
  npm run testcases:merge <task-slug>
  ```
