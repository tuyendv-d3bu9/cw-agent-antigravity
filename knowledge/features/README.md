# Quản Lý Tri Thức Tính Năng (knowledge/features/)

Thư mục này chứa tri thức tích lũy vĩnh viễn cho từng tính năng cụ thể của dự án.

## Quy ước đặt tên:
- Mỗi file đại diện cho một tính năng, đặt tên theo dạng kebab-case: `<feature-slug>.md` (Ví dụ: `voucher-checkout.md`, `cart-management.md`, `user-authentication.md`).

## Cách tạo mới một file tri thức tính năng:
Sử dụng script tự động:
```bash
npm run knowledge:new <feature-slug>
```
Hoặc copy từ `knowledge/_template.md` sang thư mục này.

## Quy trình cập nhật tri thức:
1. **Lần phân tích đầu tiên**: Agent đọc tài liệu trong `INPUT/` và sinh các kẽ hở ban đầu vào Mục 7 (`OPEN QUESTIONS`).
2. **Khi BA phản hồi**: Con người hoặc Agent (thông qua skill `qa-knowledge-sync`) ghi nhận câu trả lời vào Mục 8 (`GIẢ ĐỊNH ĐÃ CHỐT`) và chuyển các rule thành công sang Mục 3 (`BUSINESS RULES`).
3. **Các lần chạy sau**: Mọi Agent sẽ đọc file này trước tiên để kế thừa toàn bộ các quyết định trước đó.
