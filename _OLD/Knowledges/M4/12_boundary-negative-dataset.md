# BOUNDARY & NEGATIVE DATASET — Record có Mục đích
Nguồn: Module 4 — Bài 4.4 (Boundary & Negative Dataset Automation)

## Mục đích
Sinh dataset biên & âm tính có chủ đích — mỗi record kiểm một edge case khác nhau,
không trùng lặp.

## Nguyên tắc "Record có Mục đích"
- Mỗi record boundary/negative BẮT BUỘC có cột **Test Purpose** (nêu rõ record này test gì).
- Với field có min/max: phủ đủ `min-1, min, min+1, max-1, max, max+1`.
- Với field có format/độ dài: rỗng, 1 ký tự, đúng độ dài, quá độ dài, ký tự đặc biệt.
- Có ≥1 NULL cho field bắt buộc (vd mã voucher) và ≥1 NULL cho field giá trị (vd giá trị giảm).

## Bảng mẫu — Voucher (Function D)
| # | Mã voucher | Giá trị giảm | Min order | Lượt dùng | Loại data | Test Purpose |
|---|---|---|---|---|---|---|
| 1 | SALE-B001 | 1% | 200.000 | 100 | Boundary | Giá trị giảm = min (1%) |
| 2 | SALE-B002 | 100% | 200.000 | 100 | Boundary | Giá trị giảm = max (100%) |
| 3 | SALE-B003 | 0% | 200.000 | 100 | Invalid | Dưới min 1 đơn vị |
| 4 | SALE-B004 | 101% | 200.000 | 100 | Invalid | Trên max |
| 5 | SALE-B005 | 10% | 0 | 100 | Boundary | Min order = 0 |
| 6 | SALE-B006 | 10% | 5.000.000 | 100 | Boundary | Min order = max |
| 7 | SALE-B007 | 10% | -100.000 | 100 | Invalid | Min order âm |
| 8 | SALE-B008 | 10% | 200.000 | 0 | Invalid | Lượt dùng = 0 |
| 9 | SALE-B009 | NULL | 200.000 | 100 | Null | Giá trị giảm NULL |
| 10 | NULL | 10% | 200.000 | 100 | Null | Mã voucher NULL |
| 11 | SALE1 | 10% | 200.000 | 100 | Invalid | Mã sai format |

## Ràng buộc (hard constraint)
- Không bỏ sót `min-1` và `max+1`.
- Mỗi record test một edge case khác nhau; cột Test Purpose bắt buộc, không để trống.
- Đủ theo bản chất field (ngôn ngữ định tính, không quota cứng).

## Liên kết với FACT
- C (Complete): phủ đủ biên trong/ngoài + null + invalid + special.
- T (Testable): mỗi record có Test Purpose rõ để biết pass/fail.
