# REQUIREMENT SUMMARY TEMPLATE — 7 Phần Cốt Lõi
Nguồn: Module 2 — Bài 2.1 (Requirement Summarization với AI)

## Mục đích
Dùng làm bước ĐẦU TIÊN trong Prompt Chain — biến requirement thô thành bản
tóm tắt có cấu trúc, làm input chuẩn cho các bước Viewpoint/Test Idea/Coverage
Review phía sau. QA Leader PHẢI đưa nguyên 7 phần này vào prompt của Analyst,
đúng thứ tự, không gộp/bỏ phần nào.

## 4 dạng requirement đầu vào cần nhận diện trước khi tóm tắt

| Dạng | Đặc điểm | Cách AI xử lý |
|---|---|---|
| Prose document | Văn xuôi dài, lẫn functional/non-functional | Tách 2 loại, liệt kê rule rõ ràng |
| User Story | As a...I want...So that... — thiếu acceptance criteria | Expand thành acceptance criteria testable |
| Wireframe + mô tả | Visual-first, nhiều thứ ngầm định | Suy ra rule ngầm định từ mô tả UI |
| Email/Chat từ BA | Informal, rải rác nhiều thread | Tổng hợp, remove duplicate, structurize |

## 7 phần bắt buộc (đánh số thứ tự, không đảo lộn)

1. **FEATURE OVERVIEW** — 1–2 câu tóm tắt mục đích và giá trị của tính năng với user
2. **ACTOR & USER ROLE** — liệt kê toàn bộ loại người dùng liên quan
3. **BUSINESS RULES** — toàn bộ rule được đề cập, đánh số thứ tự, mỗi rule 1 dòng ngắn gọn
4. **HAPPY PATH** — luồng chính, step-by-step từ đầu đến cuối
5. **ALTERNATE FLOWS** — các luồng phụ, exception được đề cập
6. **OUT OF SCOPE** — những gì tài liệu không đề cập, không thuộc phạm vi
7. **OPEN QUESTIONS** — tối thiểu 5 câu hỏi cần clarify với BA trước khi test

## Ràng buộc số lượng (hard constraint)
- Phần 3 (Business Rules): liệt kê hết, không giới hạn số lượng, nhưng phải đánh số.
- Phần 7 (Open Questions): tối thiểu 5 câu hỏi — nếu requirement quá đầy đủ và
  không tìm được 5 câu hỏi tự nhiên, phải kết hợp 06W (xem file
  `06W-missing-rule-technique.md`) để đào thêm.

## Liên kết với các bước sau
- Output của phần 3 (Business Rules) là input bắt buộc cho Coverage Review
  (mapping rule ↔ test case).
- Output của phần 7 (Open Questions) là điểm khởi đầu để chạy 06W tìm missing
  rule chi tiết hơn ở bước kế tiếp — không tự lặp lại, mà đào sâu thêm.
- Toàn bộ 7 phần phải hoàn thành trước khi Analyst được phép sinh Viewpoint.

## Liên kết với FACT
- F (Factual): Business Rules chỉ liệt kê những gì có trong requirement gốc, không suy diễn thêm vào phần này (suy diễn để ở Open Questions).
- C (Complete): đủ 7 phần, không bỏ phần nào dù nội dung ngắn.
- T (Testable): Happy Path và Alternate Flows phải viết dạng step-by-step, verify được.