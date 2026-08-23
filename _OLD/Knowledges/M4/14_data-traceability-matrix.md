# DATA TRACEABILITY MATRIX — Nối Data ↔ Test Case
Nguồn: Module 4 — Bài 4.6 (AI-supported Workflow & Traceability)

## Mục đích
Nối mỗi record dữ liệu với test case dùng nó — để biết data phục vụ ca kiểm nào,
và ca nào còn thiếu data.

## Workflow tổng
Requirement → Data Class Analysis → Realistic Dataset → Export Format →
Boundary/Negative → Validation → **Traceability Matrix** → Test Execution.

## Cấu trúc Traceability Matrix (bắt buộc)
| Test Case ID | Test Case Title | Test Data Record | Data Type | Notes |
|---|---|---|---|---|
| TC-001 | Áp voucher hợp lệ, đơn đủ điều kiện | SALE-A102 | Valid | Happy path |
| TC-005 | Giá trị giảm = min boundary | SALE-B001 (1%) | Boundary | Biên dưới |
| TC-006 | Giá trị giảm = max boundary | SALE-B002 (100%) | Boundary | Biên trên |
| TC-015 | Mã voucher = NULL xử lý thế nào | (record #10) | Null | NULL vs empty? |
| TC-018 | Giá trị giảm âm bị reject | SALE-B003 | Invalid | Validation chặn trước khi lưu |
| TC-025 | Mã sai format bị reject | SALE1 | Invalid | Format validation |

## Nguyên tắc
- Mỗi test case cần data phải trace về một record cụ thể (mã hoặc #).
- Record boundary/invalid phải nối đúng test case kiểm biên/âm tính tương ứng.
- Test case chưa có data → đánh `CHƯA CÓ DATA` (không để trống).

## Ràng buộc (hard constraint)
- Không tạo record "mồ côi" (không phục vụ test case nào) trừ khi có lý do ghi rõ.
- Không tạo test case dùng data không tồn tại trong dataset.

## Liên kết với FACT
- C (Complete): mọi test case cần data đều được map.
- T (Testable): record map được nêu rõ để tái hiện đúng ca kiểm.
