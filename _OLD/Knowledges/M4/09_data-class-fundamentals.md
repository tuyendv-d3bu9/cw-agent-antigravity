# DATA CLASS FUNDAMENTALS — 5 lớp dữ liệu & Field Map
Nguồn: Module 4 — Bài 4.1 (AI Test Data Engineering Fundamentals)

## Mục đích
Chuẩn hóa cách phân loại dữ liệu test cho từng field trước khi sinh dataset —
"Garbage data → Garbage testing".

## 5 Data Class (registry cố định)
| Data Class | Mô tả | Ví dụ: Giá trị giảm (%) | Ví dụ: Min order |
|---|---|---|---|
| Valid | Hợp lệ, trong khoảng bình thường | 10% | 200.000đ |
| Boundary | Giá trị biên tại min/max | 1% và 100% | 0đ / 5.000.000đ |
| Invalid | Vi phạm rule, sai kiểu | -5% hoặc 150% | -100.000đ |
| Null/Empty | Không có giá trị | NULL / rỗng | NULL / rỗng |
| Special | Ký tự đặc biệt, format lạ | "10%.0" | "200,000" (dấu phẩy) |

## Quy trình: Requirement → Field List → Data Class Map
1. Trích danh sách field + business rule từ Requirement Summary (OUTPUT 01).
2. Với mỗi field, xác định kiểu dữ liệu + rule.
3. Map các Data Class cần test cho field đó.

## Field Map mẫu — Voucher (Function D)
| Field | Kiểu | Business Rule | Data Class cần test |
|---|---|---|---|
| Mã voucher | String | Format `SALE-XXXX` | Valid, sai format, trùng, Null |
| Loại giảm giá | Enum | Percent / Fixed | Valid (2 loại), Invalid, Null |
| Giá trị giảm | Number | %: 1–100 · Fixed: 1.000–500.000đ | Valid, Boundary, Invalid, Null |
| Đơn hàng tối thiểu | Number | 0 – 5.000.000đ | Valid, Boundary, Invalid, Null |
| Ngày hết hạn | Date | ≥ ngày tạo | Valid, Đã hết hạn, Invalid, Null |
| Giới hạn lượt dùng | Integer | 1 – 10.000 | Valid, Boundary, Invalid, Null |
| Trạng thái | Enum | Active/Expired/Disabled | Valid (3), Invalid, Null |

## Ràng buộc (hard constraint)
- Mọi field áp dụng được đều phải có Data Class map — không bỏ sót field (ngôn ngữ định tính, không quota cứng).
- Field không rõ rule → gắn `[GIẢ ĐỊNH]`, không tự bịa khoảng giá trị.

## Liên kết với FACT
- F (Factual): kiểu dữ liệu & rule bám đúng Requirement gốc.
- C (Complete): phủ đủ 5 lớp cho field áp dụng được.
