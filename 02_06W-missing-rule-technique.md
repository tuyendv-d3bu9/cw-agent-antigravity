# KỸ THUẬT 06W — Missing Business Rule Interrogation
Nguồn: Module 2 — Bài 2.2 (Finding Missing Business Rules)

## Mục đích
Dùng để bổ sung vào prompt của QA Analyst khi cần TÌM missing business rule
trong requirement. Đây là kỹ thuật đặt câu hỏi thay tester — không phải kỹ thuật
sinh test case. QA Leader PHẢI đưa nguyên bảng 6 câu hỏi này vào prompt,
không được diễn giải lại bằng lời tự do (tránh lệch giữa các lần generate).

## Bảng 6 câu hỏi cố định (KHÔNG được rút gọn hoặc gộp)

| # | Câu hỏi gốc | Áp dụng vào testing | Loại missing rule phát hiện |
|---|---|---|---|
| 1 | What if... (input lạ) | Input bất thường: ký tự đặc biệt, quá dài, để trống, paste HTML | Implicit assumption |
| 2 | What if... (state lạ) | System state chưa xử lý: chưa đăng nhập, session hết hạn, timeout | Edge case bị bỏ qua |
| 3 | What if... (data lạ) | Data edge case: = 0, âm, null, trùng lặp, tối đa+1, format không chuẩn | Edge case bị bỏ qua |
| 4 | What when... (timing) | Vấn đề thời gian/đồng thời: 2 user cùng action, network chậm | Non-functional bị ignore |
| 5 | Who else... (actor) | Actor khác ngoài user chính: admin, hệ thống bên ngoài, scheduled job | Conflict giữa các rule |
| 6 | What happens after... (post-condition) | State thay đổi sau action: notification nào gửi, rollback thế nào | Rollback/Undo scenario |

## 05 Loại Missing Rule (dùng để phân loại kết quả tìm được)

| Loại | Ví dụ | Mức độ rủi ro |
|---|---|---|
| Implicit assumption | "Email phải unique" nhưng requirement không viết | Cao |
| Edge case bị bỏ qua | Xóa account nhưng còn đơn hàng đang xử lý? | Cao |
| Conflict giữa các rule | Rule A mâu thuẫn Rule B khi áp dụng cùng lúc | Trung bình |
| Non-functional bị ignore | Timeout, concurrent user, retry limit không định nghĩa | 🟡 Trung bình |
| Rollback/Undo scenario | User Back sau khi đã thanh toán | Trung bình |

## Format bắt buộc khi output 1 missing rule (8 trường — không thiếu trường nào)

1. Rule/Business Logic bị thiếu — mô tả ngắn gọn
2. Dấu hiệu phát hiện — vì sao nghi ngờ đây là missing rule
3. Requirement hiện tại — trích đoạn liên quan, hoặc ghi "Requirement chưa đề cập"
4. Impact/Risk — chọn 1 hoặc nhiều: Sai nghiệp vụ / Thiếu coverage / Test case sai / Automation fail / Production bug
5. Ví dụ thực tế — Input / Expected / Actual AI Output
6. Câu hỏi cần confirm với BA/PO
7. Hành động đề xuất
8. Trạng thái — mặc định "New"

## Ràng buộc số lượng (hard constraint — để đồng nhất giữa học viên)
- Tối thiểu 5 missing rule mỗi lần chạy (khớp yêu cầu Assignment 2).
- Phải áp dụng đủ 6 câu hỏi trong bảng — nếu 1 câu hỏi không phát hiện gì,
  vẫn phải ghi rõ "Không phát hiện vấn đề qua câu hỏi #X" thay vì bỏ qua,
  để đảm bảo traceability cho FACT.T (Testable/Traceable).

## Liên kết với FACT
- F (Factual): mỗi missing rule phải trích được đoạn requirement liên quan hoặc ghi rõ "chưa đề cập" — không suy diễn không căn cứ.
- A (Applicable): câu hỏi đề xuất cho BA phải cụ thể, dùng được ngay trong buổi confirm.
- C (Complete): đủ 5 missing rule, đủ 6 câu hỏi đã áp dụng.
- T (Testable): mỗi missing rule phải kèm ví dụ Input/Expected cụ thể, verify được.