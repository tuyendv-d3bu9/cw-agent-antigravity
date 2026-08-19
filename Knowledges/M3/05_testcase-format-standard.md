# TEST CASE FORMAT STANDARD — 8 Trường Chuẩn Jira/TestRail
Nguồn: Module 2 — Bài 2.5 (Chuẩn hóa Test Case Format)

## Mục đích
Khung xuất Test Case CỐ ĐỊNH khi expand từ Test Idea — đảm bảo mọi học viên
xuất ra cùng 1 cấu trúc field, import thẳng được vào Jira Xray/TestRail/Zephyr.

## 8 trường bắt buộc (đủ, đúng thứ tự, không đổi tên trường)

| Trường | Yêu cầu | Ghi chú |
|---|---|---|
| TC_ID | Mã duy nhất, không trùng | Format: [MODULE]-[3 số], VD: LOGIN-001 |
| Title | 1 câu, rõ mục đích test | Bắt đầu bằng Verify/Validate/Confirm |
| Precondition | State hệ thống + data cần có trước | Đủ cụ thể để reproduce: login state, data, môi trường |
| Test Steps | Numbered list, mỗi step = 1 action | Tối đa 8 steps, dùng động từ Nhập/Nhấn/Chọn/Kiểm tra |
| Test Data | Giá trị cụ thể | KHÔNG dùng placeholder "nhập giá trị hợp lệ" |
| Expected Result | Đủ cụ thể để verify pass/fail | Ghi rõ: màn hình hiển thị gì, data đổi thế nào, thông báo gì |
| Priority | Critical/High/Medium/Low | Critical = fail→block release |
| Tags/Labels | Viewpoint, module, regression flag | VD: @negative @boundary @regression |

## 5 lỗi AI thường mắc — Analyst phải tự kiểm tra trước khi xuất (self-check)

| Lỗi | Ví dụ lỗi | Cách tự sửa |
|---|---|---|
| Expected result mơ hồ | "Hệ thống hiển thị thông báo lỗi" | Phải ghi rõ: text thông báo, vị trí, thời gian tồn tại |
| Test data chung chung | "Nhập email hợp lệ" | Phải là giá trị cụ thể: email='test@abc.com' |
| Steps quá gộp | "Thực hiện luồng thanh toán" — 1 step | Tách mỗi step = 1 action, tối đa 8 steps |
| Thiếu precondition | Steps bắt đầu không rõ state hệ thống | Luôn mô tả login state + data + môi trường |
| Scope creep | Đang test Login, thêm test case Forgot Password | Chỉ sinh trong scope đã định, đối chiếu Out of Scope |

## Ràng buộc số lượng (hard constraint)
- Tối thiểu 10 test case hoàn chỉnh mỗi lần chạy (khớp Assignment 2).
- Mỗi test case phải trace ngược được về: 1 Business Rule cụ thể (từ
  Requirement Summary) + 1 Viewpoint cụ thể (từ Viewpoint Library) — không có
  test case "mồ côi" không rõ nguồn gốc.

## Liên kết với FACT
- A (Applicable): Test Data dùng giá trị thật, dùng được ngay không cần sửa.
- T (Testable): Expected Result đủ cụ thể để pass/fail không cần đoán.
- Traceable (QA Leader variant): mỗi TC_ID phải map được về Rule# và Viewpoint Name.