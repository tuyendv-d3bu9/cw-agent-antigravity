# VIEWPOINT LIBRARY — 8 Viewpoint Cốt Lõi
Nguồn: Module 2 — Bài 2.3 (Viewpoint-Based Testing)

## Mục đích
Registry CỐ ĐỊNH — Analyst KHÔNG được tự thêm/bớt viewpoint ngoài danh sách
này. Nếu Analyst thấy cần 1 viewpoint khác đặc thù cho domain, phải đánh dấu
`[GIẢ ĐỊNH]` và giải thích lý do, không được âm thầm thay thế viewpoint chuẩn.

## Định nghĩa
Viewpoint = một góc nhìn cụ thể để tiếp cận tính năng. Mỗi viewpoint sinh ra
một tập test case khác nhau từ CÙNG một requirement.

## Bảng 8 viewpoint (thứ tự ưu tiên mặc định khi liệt kê)

| Viewpoint | Câu hỏi chủ đạo | Khi nào ưu tiên cao |
|---|---|---|
| Happy Path | Luồng đúng chuẩn xảy ra thế nào? | Mọi tính năng — luôn kiểm tra trước tiên |
| Negative | Input sai/flow gián đoạn thì sao? | Form có input, flow nhiều bước |
| Boundary | Giới hạn hệ thống ở đâu? | Bất kỳ field số/text/date nào |
| Security | Có thể bị tấn công/bypass không? | Tính năng auth, payment, admin |
| UX/Usability | User hiểu và dùng được không? | Tính năng mới, form phức tạp |
| Performance | Chịu tải thực tế không? | API, search, tính năng real-time |
| Accessibility | User đặc biệt dùng được không? | Public-facing app, B2C product |
| Integration | Tương tác hệ thống khác thế nào? | Có call API bên ngoài |

## Ưu tiên hóa theo Risk (dùng khi không đủ thời gian test tất cả)

| Yếu tố | Câu hỏi kiểm tra | Viewpoint nên ưu tiên |
|---|---|---|
| Business Impact | Fail → ảnh hưởng doanh thu/uy tín/dữ liệu? | Happy Path, Negative, Security |
| Likelihood | Bug từ viewpoint này có thường xảy ra không? | Boundary, Integration, Negative |
| Detectability | Bug khó phát hiện sau release không? | Security, Integration, Performance |

## Cấu trúc bắt buộc khi output 1 Viewpoint (6 trường)

1. Viewpoint Name — lấy đúng tên trong bảng 8 viewpoint ở trên
2. Mục tiêu — kiểm tra điều gì với viewpoint này
3. Phạm vi (In scope) — test case nào thuộc viewpoint này
4. Loại trừ (Out of scope) — test case nào KHÔNG thuộc, thuộc viewpoint khác
5. Rủi ro nếu bỏ qua — hậu quả cụ thể khi không test viewpoint này
6. Số test idea ước tính — khoảng bao nhiêu ý tưởng từ viewpoint này

## Ràng buộc số lượng (hard constraint)
- Tối thiểu 4 viewpoint/lần chạy (khớp yêu cầu Assignment 2), chọn theo
  nguyên tắc ưu tiên risk ở trên — mặc định nên chọn: Happy Path + Negative +
  Boundary + 1 viewpoint theo đặc thù feature (Security/UX/Performance/
  Accessibility/Integration).
- Mỗi viewpoint không được trùng phạm vi với viewpoint khác (kiểm tra chéo
  In scope/Out of scope).

## Liên kết với FACT
- C (Complete): đủ ≥4 viewpoint, không bỏ sót góc nhìn quan trọng của feature.
- A (Applicable): Phạm vi (in/out scope) phải khớp thực tế requirement, không chung chung.