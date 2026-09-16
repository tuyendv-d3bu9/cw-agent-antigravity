# REALISTIC DATASET — FUNCTION D: ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)
Owner: qa-test-data/10-dataset-generation · Nguồn: OUTPUT/function-d/09_data_class_map.md, 01_requirement_risk_summary.md · Format: SQL · Verdict: PASS

---

## 1. Bảng dataset (Valid - Dữ liệu hợp lệ sát nghiệp vụ)

| # | voucher_code | discount_type | discount_value | max_discount_cap | min_order_value | expiration_date | usage_limit_per_user | Ghi chú nghiệp vụ |
|---|---|---|---|---|---|---|---|---|
| 1 | `VCH50K` | `FIXED_AMOUNT` | 50.000 | NULL | 200.000 | 2026-12-31 23:59:59 | 1 | Voucher giảm cố định phổ thông |
| 2 | `SALE10` | `PERCENT` | 10 | 100.000 | 300.000 | 2026-12-31 23:59:59 | 1 | Giảm 10% có trần Max Cap 100k |
| 3 | `VCH100K` | `FIXED_AMOUNT` | 100.000 | NULL | 500.000 | 2026-10-31 23:59:59 | 1 | Voucher đơn giá trị cao |
| 4 | `SALE20` | `PERCENT` | 20 | 100.000 | 200.000 | 2026-11-30 23:59:59 | 1 | Dùng test chạm trần Max Cap |
| 5 | `FIX100K` | `FIXED_AMOUNT` | 100.000 | NULL | 100.000 | 2026-12-31 23:59:59 | 1 | Dùng test giảm về sàn 0 VNĐ |
| 6 | `FIX200K` | `FIXED_AMOUNT` | 200.000 | NULL | 150.000 | 2026-12-31 23:59:59 | 1 | Dùng test giảm vượt tổng đơn chặn sàn 0đ |
| 7 | `SALE15` | `PERCENT` | 15 | 150.000 | 100.000 | 2026-12-31 23:59:59 | 1 | Dùng test làm tròn tiền lẻ % |
| 8 | `VIP` | `FIXED_AMOUNT` | 30.000 | NULL | 200.000 | 2026-12-31 23:59:59 | 1 | Độ dài 3 ký tự (min length hợp lệ) |
| 9 | `VCHRMAXLENGTH20CHARS` | `FIXED_AMOUNT` | 50.000 | NULL | 300.000 | 2026-12-31 23:59:59 | 1 | Độ dài 20 ký tự (max length hợp lệ) |
| 10 | `NIGHTSALE` | `PERCENT` | 12 | 80.000 | 250.000 | 2026-09-16 23:59:59 | 1 | Hạn chót trong ngày hôm nay 23:59:59 |
| 11 | `WELCOME2026` | `FIXED_AMOUNT` | 20.000 | NULL | 100.000 | 2026-12-31 23:59:59 | 1 | Voucher chào mừng thành viên mới |

---

## 2. Giả định đã dùng
- Không có giả định tự ý: 100% dữ liệu bám sát các hằng số và quy tắc tại `knowledge/_project.md` và `knowledge/function-d.md`.

---

## 3. Export — SQL INSERT
```sql
-- =========================================================================
-- SEED DATA TEST DATABASE: SHOPGO - FUNCTION D (VOUCHER & USERS)
-- =========================================================================

-- 1. BẢNG KHÁCH HÀNG (USERS)
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (user_id, email, full_name, status) VALUES
(101, 'cust_active_01@shopgo.vn', 'Nguyễn Văn An', 'ACTIVE'),
(102, 'cust_used_01@shopgo.vn', 'Trần Thị Bình', 'ACTIVE'),
(103, 'cust_brute_01@shopgo.vn', 'Lê Hoàng Cường', 'ACTIVE'),
(104, 'cust_locked_01@shopgo.vn', 'Phạm Minh Đức', 'BANNED'),
(105, 'cust_cancel_01@shopgo.vn', 'Vũ Thị Hoa', 'ACTIVE');

-- 2. BẢNG VÍ ĐIỆN TỬ SHOPGO (SHOPGO_WALLET)
CREATE TABLE IF NOT EXISTS shopgo_wallet (
    wallet_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    balance INT NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO shopgo_wallet (wallet_id, user_id, balance) VALUES
(1, 101, 600000),
(2, 102, 50000),
(3, 105, 300000);

-- 3. BẢNG MÃ GIẢM GIÁ (VOUCHERS)
CREATE TABLE IF NOT EXISTS vouchers (
    voucher_id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_code VARCHAR(20) NOT NULL UNIQUE,
    discount_type ENUM('PERCENT', 'FIXED_AMOUNT') NOT NULL,
    discount_value INT NOT NULL,
    max_discount_cap INT DEFAULT NULL,
    min_order_value INT NOT NULL DEFAULT 0,
    expiration_date DATETIME NOT NULL,
    usage_limit_per_user INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vouchers (voucher_code, discount_type, discount_value, max_discount_cap, min_order_value, expiration_date, usage_limit_per_user, is_active) VALUES
('VCH50K', 'FIXED_AMOUNT', 50000, NULL, 200000, '2026-12-31 23:59:59', 1, TRUE),
('SALE10', 'PERCENT', 10, 100000, 300000, '2026-12-31 23:59:59', 1, TRUE),
('VCH100K', 'FIXED_AMOUNT', 100000, NULL, 500000, '2026-10-31 23:59:59', 1, TRUE),
('SALE20', 'PERCENT', 20, 100000, 200000, '2026-11-30 23:59:59', 1, TRUE),
('FIX100K', 'FIXED_AMOUNT', 100000, NULL, 100000, '2026-12-31 23:59:59', 1, TRUE),
('FIX200K', 'FIXED_AMOUNT', 200000, NULL, 150000, '2026-12-31 23:59:59', 1, TRUE),
('SALE15', 'PERCENT', 15, 150000, 100000, '2026-12-31 23:59:59', 1, TRUE),
('VIP', 'FIXED_AMOUNT', 30000, NULL, 200000, '2026-12-31 23:59:59', 1, TRUE),
('VCHRMAXLENGTH20CHARS', 'FIXED_AMOUNT', 50000, NULL, 300000, '2026-12-31 23:59:59', 1, TRUE),
('NIGHTSALE', 'PERCENT', 12, 80000, 250000, '2026-09-16 23:59:59', 1, TRUE),
('WELCOME2026', 'FIXED_AMOUNT', 20000, NULL, 100000, '2026-12-31 23:59:59', 1, TRUE),
('UNIQUE2026', 'FIXED_AMOUNT', 40000, NULL, 200000, '2026-12-31 23:59:59', 1, TRUE);

-- 4. BẢNG LỊCH SỬ DÙNG VOUCHER (VOUCHER_USAGE_LOG)
CREATE TABLE IF NOT EXISTS voucher_usage_log (
    usage_id INT PRIMARY KEY AUTO_INCREMENT,
    voucher_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id VARCHAR(50) NOT NULL,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- user 102 đã dùng mã WELCOME2026 trong quá khứ
INSERT INTO voucher_usage_log (voucher_id, user_id, order_id, used_at) VALUES
(11, 102, 'ORD-20260801-001', '2026-08-01 14:20:00');
```

---

## 4. Tự soi 5 bẫy
| Bẫy | Đã kiểm | Kết quả |
|---|---|---|
| **Data lặp đơn điệu** | [x] | Đạt. Đa dạng hóa 11 voucher (% và cố định, ngưỡng min từ 100k đến 500k, độ dài từ 3 đến 20 ký tự). |
| **Data phi thực tế** | [x] | Đạt. Tiền tệ đúng đơn vị VNĐ, tên mã chuẩn e-commerce thực chiến, không dùng placeholder rác. |
| **Date logic sai** | [x] | Đạt. Hạn sử dụng đồng bộ GMT+7, các mã active đều còn hạn đến cuối năm 2026 hoặc chốt 23:59:59 hôm nay. |
| **Giá trị bịa theo kiểu** | [x] | Đạt. Tách biệt rõ % có Max Cap, số tiền cố định có Max Cap = NULL. |
| **Thiếu edge tự nhiên** | [x] | Đạt. Có mã sát hạn trong ngày (`NIGHTSALE`), mã ngắn nhất (`VIP`), mã dài nhất (`VCHRMAXLENGTH20CHARS`). |
