# DATA CLASS MAP — FUNCTION D: ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)
Owner: qa-test-data/09-data-class-map · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, knowledge/function-d.md, knowledge/_project.md · Verdict: PASS

---

## 1. Field Map

| Field | Kiểu | Business Rule (trace) | Data Class cần test | Mốc biên cần phủ |
|---|---|---|---|---|
| `voucher_code` | String (Alphanumeric) | Độ dài 3–20 ký tự, chữ và số `[A-Za-z0-9]`, trim() đầu/cuối, case-insensitive. Trace: BR-17, BR-18, BR-19 | **Valid, Boundary, Invalid, Null/Empty, Special** | 0 ký tự (rỗng), 1 ký tự, 2 ký tự (min-1), 3 ký tự (min), 4 ký tự (min+1), 19 ký tự (max-1), 20 ký tự (max), 21 ký tự (max+1) |
| `discount_type` | Enum (`PERCENT`, `FIXED_AMOUNT`) | 2 loại giảm giá: theo tỷ lệ phần trăm (%) hoặc số tiền cố định (VNĐ). Trace: BR-01 | **Valid, Invalid** | Không áp dụng (Enum rời rạc) |
| `discount_value` | Number / Integer (VNĐ / %) | Tỷ lệ % từ 1-100% hoặc số tiền cố định $\ge 1.000$ VNĐ. Trace: BR-01, BR-20 | **Valid, Boundary, Invalid** | Với %: 0%, 1% (min), 2%, 99%, 100% (max), 101%. Với tiền: 0đ, 1.000đ, 50.000đ... |
| `max_discount_cap` | Number / Integer (VNĐ) | Mức trần giảm giá tối đa cho mã phần trăm (áp dụng khi tiền giảm % vượt trần). Trace: BR-11 | **Valid, Boundary, Null/Empty** | Mức tính toán: `MaxCap - 1 VNĐ`, `MaxCap`, `MaxCap + 1 VNĐ` |
| `min_order_value` | Number / Integer (VNĐ) | Giá trị đơn hàng tối thiểu để mã có hiệu lực. Trace: BR-02 | **Valid, Boundary** | Đối chiếu với tổng đơn: `min - 1 VNĐ`, `min`, `min + 1 VNĐ` |
| `order_total_amount` | Number / Integer (VNĐ) | Tổng giá trị sản phẩm trong đơn hàng (chưa gồm phí ship). Trace: BR-02, BR-10, BR-12 | **Valid, Boundary, Invalid** | 0 VNĐ, `min - 1 VNĐ`, `min VNĐ`, `min + 1 VNĐ`, `= discount_value` (sàn 0đ), `< discount_value` (chặn sàn 0đ không âm) |
| `expiration_date` | DateTime (`YYYY-MM-DD HH:mm:ss`) | Thời hạn sử dụng, hiệu lực chốt đến 23:59:59 của ngày kết thúc theo GMT+7. Trace: BR-03, BR-21 | **Valid, Boundary, Invalid** | `2026-09-16 23:59:59` (còn hạn), `2026-09-17 00:00:00` (hết hạn), ngày trong quá khứ |
| `usage_count_per_user` | Integer ($\ge 0$) | Mỗi khách hàng chỉ được dùng mỗi mã tối đa 01 lần. Trace: BR-08, BR-14 | **Valid, Boundary, Invalid** | 0 lần (chưa dùng), 1 lần (vừa đủ), 2 lần (vi phạm / chặn) |
| `user_status` | Enum (`ACTIVE`, `INACTIVE`, `BANNED`) | Trạng thái tài khoản người dùng, chỉ user Active mới được áp mã và tạo đơn. Trace: BR-16 | **Valid, Invalid** | Không áp dụng (Enum trạng thái) |
| `failed_attempts_count`| Integer ($\ge 0$) | Đếm số lần nhập sai liên tiếp trong 5 phút. Sai 5 lần $\rightarrow$ tạm khóa 15 phút. Trace: BR-25 | **Valid, Boundary** | 0 lần, 4 lần (chưa khóa), 5 lần (kích hoạt khóa), 6 lần (bị từ chối ngay) |

---

## 2. Field thiếu rule — cần clarify

| Field | Thiếu gì | Giả định tạm | Câu hỏi cho BA/PO |
|---|---|---|---|
| *Không có* | *Không có* | *Toàn bộ các field nghiệp vụ và khoảng giá trị đã được làm rõ 100% qua BR-01 đến BR-26.* | *Không có câu hỏi tồn đọng* |

---

## 3. Kết luận Kiểm định Bước 9
- **Verdict**: `PASS`
- **Căn cứ**: Đã phân rã và map đủ 5 Data Class cho toàn bộ 10 trường dữ liệu nghiệp vụ trọng yếu của tính năng áp mã giảm giá; chuỗi biên min/max được định nghĩa tường minh theo `QA_STANDARD §6`. Sẵn sàng cho Bước 10 sinh dataset.
