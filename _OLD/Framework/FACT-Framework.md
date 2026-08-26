
# FACT — Framework Đánh Giá Output AI
Nguồn: Module 1 — Bài 1.5 (Đánh Giá AI Output & Tránh Hallucination)
Biến thể QA Leader (Module 2+): Faithful / Accurate / Complete / Traceable

## Mục đích
Đây là bộ tiêu chí BẮT BUỘC để QA Leader và Analyst tự kiểm tra output AI
trước khi công nhận là PASS. Mọi file knowledge khác trong Module 02 đều
tham chiếu ngược lại FACT — không tạo tiêu chí đánh giá riêng lẻ nào khác.

## Lưu ý quan trọng về 2 phiên bản FACT (tránh nhầm lẫn)

| Phiên bản | Dùng ở đâu | 4 chữ cái |
|---|---|---|
| **FACT gốc (Module 1)** | Đánh giá AI output nói chung, AI Mindset | Factual / Applicable / Complete / Testable |
| **FACT biến thể (QA Leader)** | Review sản phẩm cuối của Analyst (Module 2+) | Faithful / Accurate / Complete / Traceable |

QA Leader dùng **biến thể** khi review output cuối của Analyst. Analyst dùng
**bản gốc** khi tự kiểm tra output AI ở từng bước trung gian. Hai bảng dưới
đây tách riêng để không lẫn.

## FACT gốc — dùng khi Analyst tự review từng bước

| Chữ | Tiêu chí | Câu hỏi tự kiểm tra | Cách verify |
|---|---|---|---|
| F | Factual (Thực tế) | Thông tin có khớp requirement thật không? | Cross-check từng rule với tài liệu gốc |
| A | Applicable (Áp dụng được) | Output áp dụng được vào dự án thực tế không? | Thử reproduce steps trên system/test env |
| C | Complete (Đầy đủ) | Có bỏ sót trường hợp quan trọng nào không? | Đối chiếu với danh sách test condition đã xác định |
| T | Testable (Kiểm thử được) | Steps có rõ ràng, reproducible không? | Người khác đọc có làm theo được không? |

## FACT biến thể QA Leader — dùng khi review sản phẩm cuối

| Chữ | Tiêu chí | Câu hỏi tự kiểm tra |
|---|---|---|
| F | Faithful (Trung thực) | Output có bám sát requirement gốc, không tự bịa business rule không? |
| A | Accurate (Chính xác) | Số liệu, format, giá trị có đúng không (không có lỗi cú pháp/logic)? |
| C | Complete (Đầy đủ) | Đủ số lượng tối thiểu theo từng bước (≥5 rule, ≥4 viewpoint, ≥20 idea, ≥10 test case, ≥3 gap)? |
| T | Traceable (Truy vết được) | Mỗi output (test case, gap...) có trace ngược về Rule#/Viewpoint gốc không? |

## 5 Loại lỗi phổ biến trong AI-generated testing content (dùng để phân loại khi review)

| Loại lỗi | Ví dụ | Cách phát hiện |
|---|---|---|
| 1. Hallucination Business Rule | AI tự thêm rule không có trong requirement | Hỏi lại: "Requirement nào hỗ trợ rule này?" — không trả lời được = bịa |
| 2. Lỗi Format | Thiếu cột Priority, Steps viết đoạn văn thay vì numbered list | So sánh với `testcase-format-standard.md` |
| 3. Expected Result mơ hồ | "Hiển thị thông báo lỗi" — lỗi gì, ở đâu, bao lâu? | Expected phải đủ cụ thể verify pass/fail |
| 4. Scope Creep | Đang test Login nhưng sinh thêm case cho Forgot Password | Kiểm tra mỗi item có nằm trong scope yêu cầu không |
| 5. Data không hợp lệ | Ngày 30/02, email thiếu @, số âm cho field tuổi | Chạy qua validation rule thực tế của hệ thống |

## Quy trình review dùng FACT (áp dụng cho mọi bước trong Prompt Chain)
1. Chạy F/A/C/T (hoặc Faithful/Accurate/Complete/Traceable) lần lượt — không bỏ qua chữ nào.
2. Với mỗi tiêu chí không đạt → ghi rõ lý do cụ thể, không ghi chung chung "chưa tốt".
3. Verdict cuối: PASS (đạt cả 4) / FIX (có lỗi cụ thể, sửa được ngay) / ASK
   (thiếu thông tin, cần hỏi lại BA hoặc người dùng) — dùng chung quy ước
   PASS/FIX/ASK với MAX_ROUNDS đã thiết lập trong `task-management-conventions.md`.

## Liên kết với các file khác
- `06W-missing-rule-technique.md` → dùng F (Factual) để buộc trích requirement gốc.
- `viewpoint-library.md` → dùng C (Complete) để buộc đủ ≥4 viewpoint.
- `test-idea-generation.md` → dùng T (Testable) để buộc expected result rõ ràng.
- `testcase-format-standard.md` → dùng A (Applicable/Accurate) để buộc test data cụ thể, không placeholder.
- `coverage-review-framework.md` → dùng Traceable để buộc mọi gap trace về Rule# cụ thể.