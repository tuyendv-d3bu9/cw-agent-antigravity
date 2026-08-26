# WORKFLOW — Bản đồ pipeline QA Agent

> File này để **ĐỌC**: hệ thống có gì, chạy theo thứ tự nào, dừng ở đâu.
> Muốn **CHẠY** một chuỗi cụ thể => dùng runbook trong `workflow/run-*.md`.
> Ràng buộc chung nằm ở `shared/QA_STANDARD.md` — file này không nhắc lại.

Cấu trúc thư mục file (sau khi đã gom agent):

```
agents/
    qa-analyst/
    qa-test-design/
    qa-test-data/
    qa-exploratory/
    qa-ui-review/

shared/
    QA_STANDARD.md

knowledge/
    _project.md
    _template.md
    <task-slug>/
        <task-slug>.md
    
INPUT/
output/
workflow/
```

---

## 1. Ba nhánh

| Nhánh | Gồm | Khi nào chạy |
|---|---|---|
| **A · Pipeline chính** | `01 => 02 => 03 => 04 => 05 => 06` | Luôn chạy. Đây là xương sống requirement => test case. |
| **B · Nhánh dữ liệu** | `09 => 10 => 11 => 12` | Chạy **sau** `05`, khi cần dataset để execute. |
| **C · Độc lập** | `07` (exploratory) · `08` (UI screenshot) | Gọi bất cứ lúc nào, không chặn nhánh A/B. |

`07` cần risk area từ `03`. `08` cần ảnh đính kèm, không cần bước nào trước.

---

## 2. Bảng điều phối đầy đủ

### Nhánh A — Pipeline chính

| # | Agent | Skill | Vào | Ra |
|---|---|---|---|---|
| 1 | `qa-analyst` | `01-requirement-risk-summary` | `INPUT/*.md` | `01_requirement_risk_summary.md` |
| 2 | `qa-analyst` | `02-missing-rule-06w` | `01` + `knowledge/<slug>.md` | `02_missing_rule_report.md` |
| 3 | `qa-analyst` | `03-viewpoint-selection` | `01` + `02` | `03_viewpoint_report.md` |
| 4 | `qa-analyst` | `04-test-idea-design` | `01` + `03` | `04_test_idea_report.md` |
| 5 | `qa-test-design` | `05-test-case-generation` | `01` + `03` + `04` | `05_test_case_spec.md` |
| 6 | `qa-test-design` | `06-coverage-review` | `01` + `03` + `05` | `06_coverage_review.md` |

### Nhánh B — Dữ liệu

| # | Agent | Skill | Vào | Ra |
|---|---|---|---|---|
| 9 | `qa-test-data` | `09-data-class-map` | `01` | `09_data_class_map.md` |
| 10 | `qa-test-data` | `10-dataset-generation` | `09` | `10_dataset.md` |
| 11 | `qa-test-data` | `11-boundary-negative-dataset` | `09` | `11_boundary_negative_dataset.md` |
| 12 | `qa-test-data` | `12-data-validation-traceability` | `10` + `11` + `05` | `12_data_validation_traceability.md` |

### Nhánh C — Độc lập

| # | Agent | Skill | Vào | Ra |
|---|---|---|---|---|
| 7 | `qa-exploratory` | `07-exploratory-charter` | Risk area ở `03` | `07_exploratory_charter.md` |
| 8 | `qa-ui-review` | `08-ui-screenshot-review` | Ảnh đính kèm | `08_ui_screenshot_analysis.md` |

Mọi output nằm trong `output/<task-slug>/`, kèm `_index.md`.

---

## 3. Luật khi nào dừng

Mỗi output có `Verdict` ở dòng meta.

| Verdict | Workflow làm gì | Ai xử lý |
|---|---|---|
| `PASS` | Chạy bước tiếp | — |
| `FIX` | **Dừng**. Đọc bảng FIX cuối file, sửa, chạy lại đúng bước đó | Tester |
| `ASK` | **Dừng**. Đọc bảng ASK, hỏi BA/PO, ghi câu trả lời vào `knowledge/<slug>.md` mục 7–8, chạy lại | BA / PO |

**Ngoại lệ có chủ ý** — skill `06`: rà đủ 3 góc nhìn mà không thấy gap nào thì kết luận `ASK`,
không phải `PASS`. `PASS` chỉ khi có người phụ trách ký chấp nhận rủi ro. Đây không phải lỗi.

Các nhãn khác cũng là điểm dừng cần người: `[GIẢ ĐỊNH]` · `[CONTEXT_MISSING]` ·
`[SEVERITY_CONFIDENCE_LOW]` · `CHƯA COVER` · `CHƯA CÓ DATA` · `[GAP — chuyển 06-coverage-review bổ sung]`.

---

## 4. Vòng knowledge — thứ làm workflow nhanh dần

```
Chạy lần 1  =>  02 sinh MR-01…MR-nn (trạng thái New)  =>  hỏi BA
            =>  ghi câu trả lời vào knowledge/<slug>.md (mục 7 => Confirmed, mục 8)
Chạy lần 2  =>  01/02 đọc knowledge trước  =>  ít [GIẢ ĐỊNH] hơn, ít ASK hơn
```

- Chỉ skill `01` và `02` được ghi `knowledge/<slug>.md`.
- Không xoá dòng cũ — chỉ đổi `Trạng thái`.
- `output/` vứt được và chạy lại. `knowledge/` mất là mất công hỏi BA lần nữa.

---

## 5. Quy ước chạy

| Mục | Quy ước |
|---|---|
| `task-slug` | Trùng `feature-slug`. Vd `function-d`. Một feature một thư mục output. |
| Nạp trước mọi bước | `shared/QA_STANDARD.md` · `knowledge/_project.md` · `knowledge/<slug>.md` (nếu có) |
| Một skill | Ghi **đúng một** file output. Không dồn nhiều bước vào một file. |
| Sau mỗi bước | Cập nhật `output/<task-slug>/_index.md`: tên file + verdict |
| Không được | Ghi đè `INPUT/` · sửa deliverable của agent khác · chạy bước sau khi bước trước chưa có output |

---

## 6. Runbook có sẵn

| File | Chạy gì | Dùng khi |
|---|---|---|
| `workflow/run-to-testcase.md` | Nhánh A bước `01 => 05` | Từ requirement thô ra test case spec |

Thêm runbook mới: tạo `workflow/run-<mục-tiêu>.md`, khai vào bảng này. Không sửa bản đồ.
