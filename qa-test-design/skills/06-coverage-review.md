# Skill: 06-coverage-review

> Tuân thủ `shared/QA_STANDARD.md` (verdict + **ngoại lệ §1** · guard · FACT · chuỗi biên §6).

## Mục đích
Chốt chặn kiểm soát chất lượng nội bộ: tự review độc lập test suite trước khi bàn giao — đối
soát độ phủ, phát hiện test gap, đánh giá rủi ro business từ góc nhìn QA Lead.

## Đầu vào
- `output/<task-slug>/01_requirement_risk_summary.md` — danh sách Business Rules.
- `output/<task-slug>/05_test_case_spec.md` — test suite.
- `output/<task-slug>/03_viewpoint_report.md` — ma trận viewpoint.

## KHÔNG được (riêng skill này)
- Đánh số lại / gộp mã Business Rule — dùng đúng mã và thứ tự đã đánh ở skill 01.
- Để trống ô `Test Case IDs cover` — chưa cover thì điền **`CHƯA COVER`**.
- Kết luận chung chung ("thiếu test case", "cần bổ sung coverage") — mọi gap phải gắn `Rule#` cụ thể.
- Tự kết luận `PASS` khi chưa có biên bản chấp nhận rủi ro từ người phụ trách.
- Tự suy đoán thay con người về mức rủi ro chấp nhận, tác động liên hệ thống, insight thực chiến.

## Các bước
1. **Rà đủ 3 góc nhìn Coverage Framework** (bắt buộc cả 3, không được chọn 1):

   | Góc nhìn | Nội dung |
   |---|---|
   | 1 — Requirement ↔ Test Suite Matrix | Đối soát 2 chiều giữa từng Business Rule và Test Case ID |
   | 2 — Viewpoint Balance | Cân bằng giữa Functional, Boundary, Exception/Negative, Security/Authorization, State Transition, Data Integrity |
   | 3 — Boundary Completeness | Tính triệt để của giá trị biên theo `shared/QA_STANDARD.md` §6 cho từng rule |

2. **Map ma trận Rule ↔ Test Case ID** — liệt kê toàn bộ rule theo đúng mã gốc, ánh xạ TC ID
   cover từng rule, thiếu thì điền `CHƯA COVER`.
3. **Phân tích Gap** cho mỗi rule chưa cover / cover chưa đủ: *Gap Analysis* (kịch bản còn thiếu)
   · *Business Risk* (rủi ro lọt lưới nếu không test) · *Recommendation* (test case bổ sung cụ
   thể: tên kịch bản, input, expected result).
4. **Ra verdict** theo luật riêng:
   - `FIX` — phát hiện có gap coverage (kèm recommendation khắc phục).
   - `ASK` — rà đủ 3 góc nhìn mà KHÔNG tìm thấy gap nào (bắt buộc nghi ngờ bỏ sót).
   - `PASS` — CHỈ khi có xác nhận chính thức chấp nhận rủi ro từ người phụ trách kèm lý do kinh doanh.

## Format output
Ghi ra `output/<task-slug>/06_coverage_review.md`:

```markdown
# BÁO CÁO COVERAGE REVIEW & TEST SUITE GAP ANALYSIS

## 1. Tổng quan 3 Góc nhìn
- **Góc nhìn 1 (Requirement ↔ Test Suite)**: [hiện trạng bao phủ requirement]
- **Góc nhìn 2 (Viewpoint Balance)**: [mức cân bằng giữa các khía cạnh]
- **Góc nhìn 3 (Boundary Completeness)**: [mức bao phủ giá trị biên]

## 2. Ma trận Đối soát Độ phủ
| Rule# | Rule description | Test Case IDs cover | Gap & Recommendation |
|:---|:---|:---|:---|
| BR-01 | [mô tả ngắn] | [TC-01, TC-02…] HOẶC **CHƯA COVER** | ['Đạt' nếu cover đủ; hoặc: gap / rủi ro business / TC bổ sung] |

## 3. Danh mục Lỗ hổng & Đề xuất Bổ sung
### Rule #[ID]: [tên rule]
- **Gap phát hiện**: [góc nhìn/biên/kịch bản còn thiếu]
- **Rủi ro Business**: [hậu quả nếu lỗi xảy ra trên production]
- **Đề xuất Test Case bổ sung**:
  - *Tên*: [tên rõ ràng]
  - *Điều kiện/Dữ liệu*: [input, pre-condition]
  - *Kết quả mong đợi*: [expected outcome]

## 4. Human-Final Decision Scope
> AI không tự quyết các nội dung dưới đây — bàn giao QA Lead / PO thẩm định:
1. **Business Criticality** — mức quan trọng sống còn của rule với mục tiêu kinh doanh.
2. **Actual Risk Sufficiency** — độ phủ hiện tại đã đủ cho mức rủi ro của release chưa.
3. **Cross-system Impact** — tác động tích hợp liên hệ thống ngoài phạm vi tài liệu.
4. **Exploratory Insights** — góc thăm dò sâu theo kinh nghiệm thực chiến.

## 5. Kết luận Kiểm định
- **Review Verdict**: `[FIX / ASK / PASS]`
- **Lý do chi tiết**: [căn cứ logic theo kết quả rà 3 góc nhìn]
```
