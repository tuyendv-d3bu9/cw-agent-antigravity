# Pipeline Execution Index · function-d

> Thư mục theo dõi tiến độ và trạng thái các deliverable theo quy trình `workflows/flow.md`.

---

## Danh sách Deliverables & Trạng thái

| Bước | Deliverable | File path | Trạng thái | Verdict | Ghi chú |
|:---|:---|:---|:---|:---|:---|
| **01** | Requirement & Risk Summary | `OUTPUT/function-d/01_requirement_risk_summary.md` | Đã hoàn thành | **ASK** | 7 Open Questions đã được đào sâu thành MR-01→MR-12 ở Bước 2. Vẫn chờ BA/PO trả lời. |
| **02** | Missing Rule 06W Report | `OUTPUT/function-d/02_missing_rule_report.md` | Đã hoàn thành | **ASK** | 12 missing rule (MR-01→MR-12) phủ đủ W1–W6. Loại trừ GAP-01→GAP-06 vì BA đã trả lời. |
| **03** | Viewpoint Report | `OUTPUT/function-d/03_viewpoint_report.md` | Sẵn sàng chạy | - | Không bị chặn — viewpoint dựa trên Risk Area, không cần chờ BA trả lời. |
| **04** | Test Idea Report | `OUTPUT/function-d/04_test_idea_report.md` | Chưa kích hoạt | - | - |
| **05** | Test Case Specification | `OUTPUT/function-d/05_test_case_spec.md` | **BỊ CHẶN** | - | Chặn bởi MR-05 (format/độ dài mã), MR-07 (mốc hết hạn + timezone), MR-12 (danh sách thông điệp lỗi). |
| **06** | Coverage Review Report | `OUTPUT/function-d/06_coverage_review.md` | Chưa kích hoạt | - | - |

---

## Lịch sử thực thi (Execution Log)
- `2026-08-26`: Kích hoạt Bước 1 (`01-requirement-risk-summary`). Bóc tách 14 Business Rules, 7 Alternate Flows, phân tích 5 khía cạnh bối cảnh rủi ro và thiết lập ma trận 7 rủi ro chính. Phát hiện 7 câu hỏi mở (Open Questions) theo kỹ thuật 06W $\rightarrow$ Dừng tại chốt chặn **Clarification Gate (Verdict: ASK)**.
- `2026-09-07`: Kích hoạt Bước 2 (`02-missing-rule-06w`). Quét đủ W1→W6, cả 6 câu hỏi đều ra kẽ hở; lập 12 Missing Rule đủ 8 trường, phủ đủ 5 nhóm phân loại. 8 câu hỏi ưu tiên **High**. Verdict **ASK** — chờ BA/PO. Bước 03 không bị chặn; bước 05 bị chặn bởi MR-05, MR-07, MR-12.
