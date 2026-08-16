# COVERAGE REVIEW FRAMEWORK — 3 Góc Nhìn
Nguồn: Module 2 — Bài 2.6 (Coverage Review bằng AI)

## Mục đích
Bước cuối trong luồng Analyst — dùng AI như "QA Lead ảo" để tự kiểm tra test
suite trước khi giao lại. Đây là bước Analyst tự review, KHÁC với vai trò QA
Leader (người soạn prompt) trong kiến trúc khóa học này — không gây nhầm lẫn
tên gọi.

## 3 góc nhìn bắt buộc — chạy đủ cả 3, không được chọn 1

| Góc nhìn | Prompt approach | Output kỳ vọng |
|---|---|---|
| Requirement ↔ Test Suite | So sánh business rule list với test case list | Rule nào chưa có test case cover |
| Viewpoint Balance | Đếm test case theo viewpoint | Viewpoint nào under-tested/over-tested |
| Boundary Completeness | Review boundary value coverage từng field | Edge case/giá trị biên nào còn thiếu |

## Quy trình 3 bước cố định

1. Liệt kê tất cả business rule từ Requirement Summary (đánh số thứ tự — dùng
   lại đúng số đã đánh ở bước Requirement Summary, không đánh số lại).
2. Map từng rule với Test Case ID trong suite. Ghi rõ TC_ID nào cover rule
   nào. Nếu không có → ghi "CHƯA COVER" (không được để trống ô).
3. Với mỗi rule chưa cover hoặc cover chưa đủ: (a) mô tả gap cụ thể,
   (b) nêu rủi ro business, (c) đề xuất test case bổ sung cụ thể.

## Format output bắt buộc — bảng 4 cột cố định

| **Rule#** | **Rule description** | **Test Case IDs cover** | **Gap & Recommendation** |
|----------|----------------------|-------------------------|---------------------------|
|          |                      |                         |                           |

## Giới hạn AI trong Coverage Review (Analyst phải tự đánh dấu, không tự quyết)

| AI làm được | Tester/QA Leader phải tự làm |
|---|---|
| Map rule text → test case title | Đánh giá rule quan trọng đến mức nào với business |
| Đếm test case theo viewpoint | Đánh giá coverage đã đủ chưa cho risk thực tế |
| Gợi ý test case theo pattern đã học | Cross-system impact ngoài context AI có |
| Tìm obvious gap từ viewpoint list | Exploratory insight từ kinh nghiệm dự án thực tế |

## Ràng buộc số lượng & verdict (hard constraint)
- Tối thiểu 3 gap coverage cụ thể mỗi lần chạy (khớp Assignment 2/A3).
- Nếu tìm được <3 gap sau khi chạy đủ 3 góc nhìn → verdict bắt buộc = **ASK**
  (không tự PASS), vì có khả năng Analyst bỏ sót thay vì test suite thực sự đủ.
- Nếu ≥3 gap và đã ghi rõ recommendation → verdict = **FIX** (cần bổ sung
  test case) hoặc **PASS** nếu học viên xác nhận đã chấp nhận rủi ro có ý
  thức (ghi rõ lý do).

## Liên kết với FACT
- C (Complete): chạy đủ cả 3 góc nhìn, không bỏ góc nào.
- Traceable (QA Leader variant): mọi gap phải trace ngược về Rule# cụ thể, không nói chung chung "thiếu coverage".