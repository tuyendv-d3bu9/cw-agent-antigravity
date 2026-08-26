# CW QA Agent — Hướng dẫn dùng

5 agent QA, mỗi agent gồm 1 file danh tính (`AGENT.md`) + các skill (`skills/*.md`).
Ràng buộc dùng chung nằm ở `shared/QA_STANDARD.md`.

---

## 1. Bản đồ

```
shared/QA_STANDARD.md      LUẬT CHUNG — verdict · guard · FACT · 06W · risk matrix · chuỗi biên · output · knowledge

knowledge/                  TRI THỨC NỀN — tích luỹ, chạy lại vẫn còn
  _project.md                   quy ước cả dự án: format mã, ngày/tiền, NULL vs rỗng, môi trường test
  _template.md                  mẫu để copy cho mỗi feature
  <feature-slug>.md             rule đã xác nhận · câu trả lời BA · giả định đã chốt · domain constant

qa-analyst/                 PIPELINE — phân tích
  01-requirement-risk-summary   requirement thô  → báo cáo 10 phần + risk matrix
  02-missing-rule-06w           output 01        → missing rule + câu hỏi cho BA
  03-viewpoint-selection        output 01+02     → risk area + viewpoint (zero-overlap)
  04-test-idea-design           output 01+03     → test idea (1 câu) + filter Giữ/Bỏ

qa-test-design/             PIPELINE — thiết kế & kiểm định
  05-test-case-generation       output 01+03+04  → test case 8 trường
  06-coverage-review            output 01+03+05  → gap analysis + verdict

qa-test-data/               PIPELINE — dữ liệu (chạy sau 05)
  09-data-class-map             output 01        → field map + 5 data class
  10-dataset-generation         output 09        → dataset sát nghiệp vụ + export CSV/SQL/JSON
  11-boundary-negative-dataset  output 09        → dataset biên/âm tính (mỗi record 1 Test Purpose)
  12-data-validation-traceability output 10+11+05 → validate + traceability data ↔ test case

qa-exploratory/             ĐỘC LẬP — không thuộc pipeline
  07-exploratory-charter        risk area (03)   → charter set cho phiên thăm dò

qa-ui-review/               ĐỘC LẬP — cần ảnh đính kèm (Vision)
  08-ui-screenshot-review       ảnh màn hình     → UI / A11y / UX issues
```

**Thứ tự chạy**: `01 → 02 → 03 → 04 → 05 → 06`, rồi `09 → 10 → 11 → 12` nếu cần dataset.
`07` và `08` gọi bất cứ lúc nào.

---

## 2. Cách dùng — 2 kiểu

### Kiểu A · Trong Claude Code / antigravity (khuyến nghị)

Chỉ cần trỏ file, agent tự đọc:

```
Đọc shared/QA_STANDARD.md, knowledge/_project.md, qa-analyst/AGENT.md và
qa-analyst/skills/01-requirement-risk-summary.md.
Chạy skill 01 với input INPUT/Function D.md.
Ghi kết quả ra output/function-d/01_requirement_risk_summary.md
và cập nhật knowledge/function-d.md
```

Bước tiếp theo chỉ cần đổi tên skill:

```
Chạy qa-analyst/skills/02-missing-rule-06w.md với output/function-d/01_requirement_risk_summary.md
```

### Kiểu B · Dán tay vào chat AI (ChatGPT / Claude web / Gemini)

Dán theo đúng 4 khối này, mỗi lần chạy 1 skill:

```
[Khối 1] toàn bộ nội dung shared/QA_STANDARD.md
[Khối 2] knowledge/_project.md + knowledge/<feature-slug>.md (nếu đã có)
[Khối 3] toàn bộ nội dung <agent>/AGENT.md
[Khối 4] toàn bộ nội dung <agent>/skills/<skill>.md
[Khối 5] === INPUT ===
         <dán tài liệu yêu cầu, hoặc output của skill trước>
```

Khối 1 → 3 giống nhau trong cùng một agent → giữ nguyên cuộc chat, các lần sau chỉ đổi Khối 4 + 5.
Đây là lý do tách `shared/`: bạn dán 1 lần, dùng cho cả 4 skill của `qa-analyst`.

Chạy skill `01` / `02` xong, nhớ **dán kết quả knowledge trở lại file** `knowledge/<feature-slug>.md` —
chat AI không tự ghi file được, mà đây là thứ duy nhất còn lại sau khi đóng cuộc chat.

---

## 3. Chạy thử trọn pipeline — ví dụ `INPUT/Function D.md`

| # | Gọi gì | Vào | Ra |
|---|---|---|---|
| 1 | `qa-analyst` / `01` | `INPUT/Function D.md` | `output/function-d/01_requirement_risk_summary.md` |
| 2 | `qa-analyst` / `02` | `01` | `02_missing_rule_report.md` |
| 3 | `qa-analyst` / `03` | `01` + `02` | `03_viewpoint_report.md` |
| 4 | `qa-analyst` / `04` | `01` + `03` | `04_test_idea_report.md` |
| 5 | `qa-test-design` / `05` | `01` + `03` + `04` | `05_test_case_spec.md` |
| 6 | `qa-test-design` / `06` | `01` + `03` + `05` | `06_coverage_review.md` |
| 7 | `qa-test-data` / `09`→`12` | `01`, `05` | `09_*` → `12_*` |
| — | `qa-exploratory` / `07` | risk area ở `03` | `07_exploratory_charter.md` |
| — | `qa-ui-review` / `08` | ảnh đính kèm | `08_ui_screenshot_analysis.md` |

Mọi file ra nằm trong `output/<task-slug>/`, kèm `_index.md` liệt kê file + verdict từng bước.

---

## 4. Đọc kết quả — verdict

Mỗi output có `Verdict` ở dòng meta:

| Verdict | Nghĩa | Bạn làm gì |
|---|---|---|
| `PASS` | Đủ thông tin, đạt checklist | Chạy bước tiếp |
| `FIX` | Đủ thông tin nhưng sai format/trace/consistency | Xem bảng FIX cuối file, sửa rồi chạy lại |
| `ASK` | Thiếu thông tin nghiệp vụ | Xem bảng ASK, hỏi BA/PO rồi bổ sung input |

**Riêng skill `06`**: rà đủ 3 góc nhìn mà không thấy gap nào → verdict là `ASK`, **không phải**
`PASS`. `PASS` chỉ khi có người phụ trách ký chấp nhận rủi ro. Đây là chủ ý, không phải lỗi.

Các nhãn khác gặp trong output: `[GIẢ ĐỊNH]` (agent tự suy luận — cần bạn xác nhận) ·
`[CONTEXT_MISSING]` · `[SEVERITY_CONFIDENCE_LOW]` · `CHƯA COVER` · `CHƯA CÓ DATA` ·
`[GAP — chuyển 06-coverage-review bổ sung]`. Tất cả đều là chỗ **cần người xử lý**, agent cố ý
không tự quyết.

---

## 5. Sửa / mở rộng ở đâu

| Muốn đổi gì | Sửa file nào |
|---|---|
| Ràng buộc chung (FACT, verdict, `[GIẢ ĐỊNH]`, chuỗi biên, quy ước output) | `shared/QA_STANDARD.md` — sửa 1 chỗ, áp cho mọi skill |
| Quyền hạn / ranh giới / human-final của 1 agent | `<agent>/AGENT.md` |
| Quy trình hoặc format output của 1 bước | `<agent>/skills/<skill>.md` |
| Thêm bước mới | Tạo `skills/NN-<tên>.md` + khai vào mục "Skill sở hữu" của `AGENT.md` |
| Registry/technique mới (kỹ thuật, bảng chuẩn) | Dùng bởi **≥2 skill** → `shared/QA_STANDARD.md`. Dùng bởi **1 skill** → nội hoá trong skill đó |
| Quy ước dự án (format mã, đơn vị tiền, tool test) | `knowledge/_project.md` — điền 1 lần, mọi agent dùng |
| Dữ kiện 1 tính năng (rule đã chốt, BA trả lời gì) | `knowledge/<feature-slug>.md` — copy từ `knowledge/_template.md` |

Nguyên tắc 4 tầng:
`AGENT.md` = **LÀ AI** · `skills/*.md` = **LÀM THẾ NÀO** · `shared/` = **LUẬT CHUNG** ·
`knowledge/` = **DỰA TRÊN TRI THỨC GÌ**.

Không nhồi ràng buộc chung vào skill, không nhồi các bước vào `AGENT.md`, không nhồi dữ kiện
feature vào skill.



