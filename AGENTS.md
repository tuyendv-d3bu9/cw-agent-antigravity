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
│   ├── 📄 _system_map.json       # [BẢN ĐỒ VỆ TINH] Radar hệ thống — MỌI Agent đọc file này đầu tiên
│   ├── 📄 _project.md            # Quy ước toàn dự án (mã, tiền tệ, timezone, auth, error code)
│   ├── 📄 _glossary.md           # Từ điển thuật ngữ nghiệp vụ thống nhất
│   ├── 📄 _template.md           # Mẫu chuẩn tạo tri thức tính năng mới
│   └── 📁 features/              # Tri thức tích luỹ của từng tính năng (<feature-slug>.md)
│
├── 📁 agents/                    # Hệ thống chuyên gia QA & công cụ thực thi nội bộ
│   ├── 📁 qa-lead/               # [TỔNG CHỈ HUY] Cửa ngõ duy nhất tiếp nhận lệnh & giao việc
│   ├── 📁 qa-analyst/            # 01 -> 04: Tóm tắt yêu cầu, 06W kẽ hở, viewpoint, test idea
│   ├── 📁 qa-test-design/        # 05 -> 06: Test case 8 trường, rà soát độ phủ
│   ├── 📁 qa-test-data/          # 09 -> 12: Data class, dataset, validation & traceability
│   ├── 📁 qa-exploratory/        # 07: Thăm dò theo charter
│   ├── 📁 qa-ui-review/          # 08: Phân tích ảnh màn hình giao diện
│   ├── 📁 core/                  # QA_STANDARD.md (Luật bất biến & FACT standard)
│   ├── 📁 workflows/             # Runbooks điều phối quy trình (run-testcase.md...)
│   ├── 📁 templates/             # Mẫu khung định dạng Agent và Skill
│   └── 📁 tools/                 # Tiện ích: convert docx, map sync, testcase merge, status
│
└── 📁 .agents/                   # Nơi cài đặt các external skills bổ trợ (caveman, ponytail...)
```

### 1.1. Nguyên Tắc "System Map First" (Tuyệt Đối Chống Đọc Dò File & Tiết Kiệm Token):
- **CẤM** các Agent coding hay QA chạy lệnh quét/tìm kiếm mò mẫm (`list_dir`, `grep_search` toàn dự án) khi vào việc.
- **BẮT BUỘC**: Mọi Agent trước khi thực thi việc gì phải đọc ngay file:
  ```
  knowledge/_system_map.json
  ```
- File này chứa đầy đủ: Bảng định tuyến (`routing_table`), vị trí chính xác của từng feature, và trạng thái hiện tại. Đọc xong là mở **ĐÚNG FILE ĐÍCH**, tiết kiệm 80% token tìm kiếm.
- Lệnh đồng bộ bản đồ: `npm run map:sync`.

### 1.2. Vai Trò Tổng Chỉ Huy Của QA Leader (`agents/qa-lead/`):
- User **CHỈ CẦN GIAO TIẾP VỚI QA LEADER**. Không cần nhớ hay gọi trực tiếp từng sub-agent con.
- QA Leader tự động nắm bắt ý định của User, tra cứu `_system_map.json`, lập `00_plan.md` và giao việc cho đúng chuyên gia (`qa-analyst`, `qa-test-design`, `qa-test-data`...).

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

### 2.4. Cơ Chế "QA Leader Tự Nắm Tiến Độ" (Zero-Path Typing):
Người dùng **KHÔNG CẦN** nhớ đường dẫn hay gõ lại `OUTPUT/.../00_plan.md`.
Khi người dùng gõ các câu thoại ngắn như:
> *"Tiếp tục"*, *"Làm tiếp"*, *"Tiến độ thế nào"*, *"Hôm nay làm gì tiếp?"*, hoặc *"Chạy tiếp task <slug>"*

Mọi AI Agent **bắt buộc tự động đóng vai QA Leader**:
1. Tự động quét thư mục `OUTPUT/` để kiểm tra toàn bộ file `00_plan.md` hiện có.
2. Xác định chính xác: Task nào đang làm dở? Đã xong đến chặng nào? Có đang bị chặn bởi câu hỏi `ASK` cho BA không?
3. Báo cáo bảng Dashboard tiến độ ngắn gọn và chủ động đề xuất:
   *"Task `<task-slug>` đã hoàn thành xong Chặng X. Tôi đề xuất làm tiếp Chặng Y [hoặc Batch Z]. Bạn có muốn tiếp tục không?"*
4. Khi người dùng xác nhận (`OK` / `Tiếp tục`), Agent tự động đọc đúng đầu vào của chặng dang dở để làm tiếp mà không làm lại các bước cũ.

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
