# STRUCTURED DATA FORMAT — CSV / SQL / JSON
Nguồn: Module 4 — Bài 4.3 (Structured Data Generation)

## Mục đích
Xuất dataset ra đúng định dạng dùng được ngay (import tool / seed DB / API test),
không lỗi cú pháp.

## Chọn format theo mục đích
| Format | Dùng khi | Lưu ý quan trọng (voucher) |
|---|---|---|
| CSV | Import Excel/TestRail, data provider | Header đúng tên field; giá trị có ký tự đặc biệt → wrap trong quotes |
| SQL INSERT | Seed trực tiếp test DB | Escape ký tự đặc biệt; date đúng format DB; mỗi record 1 statement |
| JSON | API testing (Postman) | Key khớp API schema; nested object cho rule (min_order, max_discount) |

## Quy ước chung
- Date format thống nhất `YYYY-MM-DD` (không mix `15/01/2026`).
- NULL: CSV để ô trống; SQL dùng `NULL`; JSON dùng `null`.
- Cột/khóa đúng tên field trong Field Map (`01_data-class-fundamentals.md`).

## Mẫu SQL INSERT (tham chiếu)
```sql
INSERT INTO vouchers (code, discount_type, discount_value, min_order, expiry_date, usage_limit, status)
VALUES ('SALE-A102', 'percent', 15, 200000, '2026-12-31', 500, 'active');
```

## Ràng buộc (hard constraint)
- Không lỗi cú pháp; escape đầy đủ ký tự đặc biệt.
- Không đổi tên field/khóa so với schema/Field Map.

## Liên kết với FACT
- A (Accurate): cú pháp & tên trường chính xác, import/chạy được không cần sửa tay.
- T (Testable): dữ liệu ở dạng máy tiêu thụ được ngay (provider/seed/API).
