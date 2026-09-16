# BOUNDARY & NEGATIVE DATASET — FUNCTION D: ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)
Owner: qa-test-data/11-boundary-negative-dataset · Nguồn: OUTPUT/function-d/09_data_class_map.md, 01_requirement_risk_summary.md · Format: SQL · Verdict: PASS

---

## 1. Bảng dataset Biên & Âm tính (Boundary & Negative Records)

| # | voucher_code | discount_type | discount_value | max_discount_cap | min_order_value | expiration_date | order_total_amount | failed_attempts | user_status | Loại data | Test Purpose | Trace |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **B01** | `VCHMIN300` | `FIXED_AMOUNT` | 30.000 | NULL | 300.000 | 2026-12-31 | 300.000 | 0 | `ACTIVE` | Boundary | Tổng đơn bằng đúng mức tối thiểu (`min`) | BR-02 |
| **B02** | `VCHMIN300` | `FIXED_AMOUNT` | 30.000 | NULL | 300.000 | 2026-12-31 | 299.999 | 0 | `ACTIVE` | Invalid | Tổng đơn dưới mức tối thiểu 1 đồng (`min - 1 VNĐ`) | BR-02 |
| **B03** | `VCHMIN300` | `FIXED_AMOUNT` | 30.000 | NULL | 300.000 | 2026-12-31 | 300.001 | 0 | `ACTIVE` | Boundary | Tổng đơn trên mức tối thiểu 1 đồng (`min + 1 VNĐ`) | BR-02 |
| **B04** | `SALE20` | `PERCENT` | 20 | 100.000 | 200.000 | 2026-12-31 | 500.000 | 0 | `ACTIVE` | Boundary | Mức giảm % tính ra bằng đúng trần Max Cap (100.000 VNĐ) | BR-11 |
| **B05** | `SALE20` | `PERCENT` | 20 | 100.000 | 200.000 | 2026-12-31 | 499.995 | 0 | `ACTIVE` | Boundary | Mức giảm % tính ra dưới trần 1 đồng (`MaxCap - 1 VNĐ`) | BR-11 |
| **B06** | `SALE20` | `PERCENT` | 20 | 100.000 | 200.000 | 2026-12-31 | 500.005 | 0 | `ACTIVE` | Boundary | Mức giảm % tính ra trên trần 1 đồng (`MaxCap + 1 VNĐ`), chặn trần | BR-11 |
| **B07** | `FIX100K` | `FIXED_AMOUNT` | 100.000 | NULL | 100.000 | 2026-12-31 | 100.000 | 0 | `ACTIVE` | Boundary | Giảm cố định = tổng đơn, thanh toán về đúng sàn 0 VNĐ | BR-10 |
| **B08** | `FIX200K` | `FIXED_AMOUNT` | 200.000 | NULL | 150.000 | 2026-12-31 | 150.000 | 0 | `ACTIVE` | Boundary | Giảm cố định > tổng đơn, chặn sàn 0 VNĐ (không âm tiền) | BR-10 |
| **B09** | `SALE15` | `PERCENT` | 15 | 150.000 | 100.000 | 2026-12-31 | 135.555 | 0 | `ACTIVE` | Boundary | Số tiền lẻ chiết khấu %, làm tròn xuống (Floor) đơn vị đồng | BR-20 |
| **B10** | `AB` | `FIXED_AMOUNT` | 20.000 | NULL | 100.000 | 2026-12-31 | 200.000 | 0 | `ACTIVE` | Invalid | Độ dài mã 2 ký tự (dưới ngưỡng tối thiểu `min - 1`) | BR-19 |
| **B11** | `VIP` | `FIXED_AMOUNT` | 30.000 | NULL | 200.000 | 2026-12-31 | 250.000 | 0 | `ACTIVE` | Boundary | Độ dài mã đúng 3 ký tự (ngưỡng tối thiểu hợp lệ `min`) | BR-19 |
| **B12** | `VCH4` | `FIXED_AMOUNT` | 20.000 | NULL | 100.000 | 2026-12-31 | 200.000 | 0 | `ACTIVE` | Boundary | Độ dài mã 4 ký tự (ngưỡng trên min `min + 1`) | BR-19 |
| **B13** | `VCHRMAXLENGTH19CHAR` | `FIXED_AMOUNT` | 50.000 | NULL | 300.000 | 2026-12-31 | 400.000 | 0 | `ACTIVE` | Boundary | Độ dài mã 19 ký tự (ngưỡng dưới max `max - 1`) | BR-19 |
| **B14** | `VCHRMAXLENGTH20CHARS`| `FIXED_AMOUNT` | 50.000 | NULL | 300.000 | 2026-12-31 | 400.000 | 0 | `ACTIVE` | Boundary | Độ dài mã đúng 20 ký tự (ngưỡng tối đa hợp lệ `max`) | BR-19 |
| **B15** | `VCHRMAXLENGTH21CHARSS`| `FIXED_AMOUNT`| 50.000 | NULL | 300.000 | 2026-12-31 | 400.000 | 0 | `ACTIVE` | Invalid | Độ dài mã 21 ký tự (vượt ngưỡng tối đa `max + 1`) | BR-19 |
| **B16** | `NIGHTSALE` | `PERCENT` | 10 | 50.000 | 200.000 | 2026-09-16 23:59:59 | 300.000 | 0 | `ACTIVE` | Boundary | Mốc thời gian 23:59:59 của ngày hết hạn (còn hạn) | BR-21 |
| **B17** | `EXPIRED2025` | `FIXED_AMOUNT` | 50.000 | NULL | 200.000 | 2025-12-31 23:59:59 | 300.000 | 0 | `ACTIVE` | Invalid | Mã đã quá ngày hết hạn sử dụng | BR-03 |
| **B18** | `""` (Rỗng) | NULL | NULL | NULL | NULL | NULL | 300.000 | 0 | `ACTIVE` | Null | Bấm Áp dụng khi ô nhập mã để rỗng | BR-26 |
| **B19** | `<script>alert(1)</script>` | NULL | NULL | NULL | NULL | NULL | 300.000 | 0 | `ACTIVE` | Special | Ký tự đặc biệt & mã script injection vào ô mã | BR-19 |
| **B20** | `VCH50K` | `FIXED_AMOUNT` | 50.000 | NULL | 200.000 | 2026-12-31 | 300.000 | 4 | `ACTIVE` | Boundary | Số lần nhập sai 4 lần liên tiếp (chưa bị khóa) | BR-25 |
| **B21** | `VCH50K` | `FIXED_AMOUNT` | 50.000 | NULL | 200.000 | 2026-12-31 | 300.000 | 5 | `ACTIVE` | Boundary | Số lần nhập sai 5 lần liên tiếp (kích hoạt khóa 15p) | BR-25 |
| **B22** | `VCH50K` | `FIXED_AMOUNT` | 50.000 | NULL | 200.000 | 2026-12-31 | 300.000 | 6 | `ACTIVE` | Invalid | Nhập tiếp lần thứ 6 trong thời gian bị phạt khóa | BR-25 |
| **B23** | `VCH50K` | `FIXED_AMOUNT` | 50.000 | NULL | 200.000 | 2026-12-31 | 300.000 | 0 | `BANNED` | Invalid | Tài khoản user bị khóa cố tình áp dụng voucher | BR-16 |

---

## 2. Đối chiếu độ phủ biên (Boundary Completeness Matrix)

| Field / Đối tượng | min-1 | min | min+1 | max-1 | max | max+1 | Rỗng | Sai format | Ký tự đặc biệt |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Độ dài mã voucher** (`voucher_code`) | #B10 (2 ký tự) | #B11 (3 ký tự) | #B12 (4 ký tự) | #B13 (19 ký tự) | #B14 (20 ký tự) | #B15 (21 ký tự) | #B18 | #B10, #B15 | #B19 |
| **Giá trị đơn hàng** (`min_order_value`) | #B02 (299.999đ) | #B01 (300.000đ) | #B03 (300.001đ) | N/A (Không trần đơn) | N/A | N/A | N/A | N/A | N/A |
| **Mức trần Max Cap** (`max_discount_cap`) | #B05 (99.999đ) | #B04 (100.000đ) | #B06 (100.001đ) | N/A | N/A | N/A | N/A | N/A | N/A |
| **Mức sàn thanh toán** (Sàn 0 VNĐ) | N/A | #B07 (về đúng 0đ) | #B08 (chặn sàn 0đ) | N/A | N/A | N/A | N/A | N/A | N/A |
| **Mốc thời hạn HSD** (`expiration_date`) | N/A | #B16 (23:59:59) | #B17 (hết hạn) | N/A | N/A | N/A | N/A | N/A | N/A |
| **Ngưỡng Rate Limit** (`failed_attempts`) | #B20 (4 lần) | #B21 (5 lần) | #B22 (6 lần) | N/A | N/A | N/A | N/A | N/A | N/A |

*Ghi chú*: 100% ô áp dụng được đều được ánh xạ mã record cụ thể (#B01 $\to$ #B23). Không có ô nào `CHƯA PHỦ`.

---

## 3. Export — SQL INSERT
```sql
-- SEED CÁC RECORD BIÊN & ÂM TÍNH PHỤC VỤ TEST AUTOMATION / MANUAL
INSERT INTO vouchers (voucher_code, discount_type, discount_value, max_discount_cap, min_order_value, expiration_date, usage_limit_per_user, is_active) VALUES
('VCHMIN300', 'FIXED_AMOUNT', 30000, NULL, 300000, '2026-12-31 23:59:59', 1, TRUE),
('EXPIRED2025', 'FIXED_AMOUNT', 50000, NULL, 200000, '2025-12-31 23:59:59', 1, FALSE),
('VCH4', 'FIXED_AMOUNT', 20000, NULL, 100000, '2026-12-31 23:59:59', 1, TRUE),
('VCHRMAXLENGTH19CHAR', 'FIXED_AMOUNT', 50000, NULL, 300000, '2026-12-31 23:59:59', 1, TRUE);
```
