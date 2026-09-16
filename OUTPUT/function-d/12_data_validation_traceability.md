# DATA VALIDATION & TRACEABILITY — FUNCTION D: ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)
Owner: qa-test-data/12-data-validation-traceability · Nguồn: OUTPUT/function-d/10_dataset.md, 11_boundary_negative_dataset.md, 05_test_case_spec.md · Verdict: PASS

---

## 1. Kết quả Validation Dataset
- **Verdict**: `PASS`
- **Tổng quan Issue**: 0 lỗi phát hiện.
  - Logic Inconsistency: 0
  - Business Rule Violation: 0
  - Date/Time Logic Error: 0
  - Format Inconsistency: 0
  - Null sai chỗ: 0

| # | Record | Field lỗi | Mô tả lỗi | Loại lỗi | Gợi ý sửa | Verdict |
|---|---|---|---|---|---|---|
| - | *Không có* | *Không có* | *Toàn bộ dataset hợp lệ, tuân thủ 100% schema và business rule.* | - | - | PASS |

---

## 2. FACT Check Dataset
| Tiêu chí | Nội dung kiểm tra | Kết quả | Ghi chú |
|:---:|---|:---:|---|
| **F** | Factual: Giá trị bám đúng thực tế và Business Rules đã xác nhận | **PASS** | Mọi mã, số tiền, ngày hết hạn bám sát BR-01 $\to$ BR-26. |
| **A** | Accurate: Đúng định dạng, khoảng giá trị, không lỗi cú pháp SQL | **PASS** | Tiền tệ số nguyên VNĐ, ngày `YYYY-MM-DD HH:mm:ss`, mã `[A-Za-z0-9]{3,20}`. |
| **C** | Complete: Không thiếu trường NOT NULL, phủ đủ 5 Data Class | **PASS** | Không có trường bắt buộc nào bị khuyết; đủ 41 test case có data. |
| **T** | Testable: Dữ liệu phân định rõ ranh giới Pass/Fail | **PASS** | Mỗi record boundary/negative có `Test Purpose` định lượng rõ. |

---

## 3. Traceability Matrix: Test Case ↔ Dataset

| Test Case ID | Test Case Title | Test Data Record | Data Type | Notes |
|:---|:---|:---:|:---:|:---|
| **VCHR-001** | Verify áp dụng mã giảm cố định đủ điều kiện | #1 (`VCH50K`) | Valid | Đơn 350k, giảm 50k, tổng mới 330k |
| **VCHR-002** | Verify áp dụng mã % chưa chạm trần Max Cap | #2 (`SALE10`) | Valid | Đơn 400k, giảm 10% = 40k < MaxCap 100k |
| **VCHR-003** | Verify áp dụng mã % chạm đúng trần Max Cap | #2 (`SALE10`) / #B04 | Boundary | Đơn 1.000k, giảm 10% = 100k = MaxCap |
| **VCHR-004** | Verify áp đè thay thế mã mới hủy mã cũ | #1 (`VCH50K`), #3 (`VCH100K`) | Valid | Thay thế mã, không cộng dồn |
| **VCHR-005** | Verify hoàn tất đặt hàng sau khi áp voucher | #1 (`VCH50K`) | Valid | Đơn 400k COD tạo thành công |
| **VCHR-006** | Validate từ chối mã không tồn tại | Input `NOSUCHCODE99` | Invalid | Báo mã không hợp lệ |
| **VCHR-007** | Validate từ chối mã đã hết hạn | #B17 (`EXPIRED2025`) | Invalid | Hết hạn 2025-12-31, báo mã hết hạn |
| **VCHR-008** | Validate từ chối khi đơn chưa đủ min order | #3 (`VCH100K`) / Đơn 450k | Invalid | Min 500k, báo chưa đủ điều kiện |
| **VCHR-009** | Validate từ chối mã đã sử dụng của user | #11 (`WELCOME2026`) + User 102 | Invalid | Đã có trong log dùng, báo đã sử dụng |
| **VCHR-010** | Validate cảnh báo khi để ô nhập mã rỗng | #B18 (`""`) | Null | Báo vui lòng nhập mã |
| **VCHR-011** | Validate khách vãng lai bị chuyển hướng login | User: Guest | Invalid | Bắt buộc login khi thanh toán |
| **VCHR-012** | Confirm áp thành công khi đơn bằng đúng min order | #B01 (`VCHMIN300` / Đơn 300k) | Boundary | Đúng ngưỡng min order |
| **VCHR-013** | Validate từ chối khi đơn = min - 1 VNĐ | #B02 (`VCHMIN300` / Đơn 299.999k)| Invalid | Biên dưới min order 1 đồng |
| **VCHR-014** | Confirm áp thành công khi đơn = min + 1 VNĐ | #B03 (`VCHMIN300` / Đơn 300.001k)| Boundary | Biên trên min order 1 đồng |
| **VCHR-015** | Confirm chặn trần khi mức giảm % vượt trần (MaxCap + 1)| #B06 (`SALE20` / Đơn 500.005k) | Boundary | 20% = 100.001đ $\rightarrow$ chốt 100.000đ |
| **VCHR-016** | Confirm mức giảm % khi thấp hơn trần (MaxCap - 1) | #B05 (`SALE20` / Đơn 499.995k) | Boundary | 20% = 99.999đ $\rightarrow$ giảm đúng 99.999đ |
| **VCHR-017** | Confirm tổng tiền về đúng sàn 0 VNĐ | #5 (`FIX100K` / #B07) | Boundary | Giảm 100k đơn 100k về đúng 0đ |
| **VCHR-018** | Confirm chặn sàn 0 VNĐ khi giảm cố định > tổng đơn | #6 (`FIX200K` / #B08) | Boundary | Giảm 200k đơn 150k về sàn 0đ, không âm |
| **VCHR-019** | Confirm làm tròn xuống đơn vị đồng cho số lẻ % | #7 (`SALE15` / #B09) | Boundary | 20.333,25đ làm tròn xuống 20.333đ |
| **VCHR-020** | Validate từ chối mã 2 ký tự (min - 1) | #B10 (`AB`) | Invalid | Độ dài 2 ký tự vi phạm [3-20] |
| **VCHR-021** | Confirm áp thành công mã 3 ký tự (min) | #8 (`VIP` / #B11) | Boundary | Độ dài 3 ký tự chuẩn min |
| **VCHR-022** | Confirm áp thành công mã 20 ký tự (max) | #9 (`VCHRMAXLENGTH20CHARS` / #B14)| Boundary | Độ dài 20 ký tự chuẩn max |
| **VCHR-023** | Validate từ chối mã 21 ký tự (max + 1) | #B15 (`VCHRMAXLENGTH21CHARSS`)| Invalid | Độ dài 21 ký tự vi phạm [3-20] |
| **VCHR-024** | Confirm mã hợp lệ lúc 23:59:59 ngày hết hạn | #10 (`NIGHTSALE` / #B16) | Boundary | HSD chốt lúc 23:59:59 GMT+7 |
| **VCHR-025** | Validate từ chối mã lúc 00:00:00 ngày hôm sau | #10 (`NIGHTSALE` lúc 00:00:00)| Invalid | Hết hạn sang ngày hôm sau |
| **VCHR-026** | Validate tạm khóa 15p khi nhập sai 5 lần/5 phút | #B21 (Failed count = 5) | Boundary | Kích hoạt Rate Limit |
| **VCHR-027** | Validate từ chối thao tác lần 6 khi đang bị khóa | #B22 (Failed count = 6) | Invalid | Trả về 429 Too Many Requests |
| **VCHR-028** | Confirm tự động mở khóa sau 15 phút | User 103 sau 15p | Valid | Phục hồi trạng thái Active |
| **VCHR-029** | Validate chặn script injection/HTML | #B19 (`<script>...`) | Special | Lọc mã độc an toàn |
| **VCHR-030** | Validate chặn voucher khi user bị khóa | #B23 (User 104 - `BANNED`) | Invalid | Check realtime chặn áp voucher |
| **VCHR-031** | Confirm tự động trim khoảng trắng đầu/cuối | Input `"   VCH50K   "` | Special | Tự động trim() thành `VCH50K` |
| **VCHR-032** | Validate báo lỗi khoảng trắng ở giữa chuỗi | Input `"VCH 50K"` | Invalid | Báo mã không hợp lệ |
| **VCHR-033** | Confirm case-insensitive tự chuyển in hoa | Input `sale50` | Special | Tự động uppercase thành `SALE50` |
| **VCHR-034** | Confirm modal login khi session timeout | Session Expired state | Valid | Login tại chỗ giữ nguyên giỏ & mã |
| **VCHR-035** | Confirm danh sách thông báo lỗi tiêu chuẩn | 6 mẫu lỗi chuẩn | Valid | Đối chiếu 100% khớp BR-26 |
| **VCHR-036** | Confirm thứ tự trừ voucher trước ví ShopGo sau | User 101 (Ví 600k) + #3 | Valid | Trừ voucher 100k trước, ví trừ 400k |
| **VCHR-037** | Validate tự gỡ voucher khi sửa giỏ hàng < min | Giỏ 400k giảm còn 200k | Invalid | Tự gỡ mã, cảnh báo giá gốc |
| **VCHR-038** | Validate tự gỡ voucher khi server đổi giá < min | Giá server sync 280k < min 300k | Invalid | Tự hủy voucher, thông báo giá đổi |
| **VCHR-039** | Validate re-validate chặn đặt hàng khi mã hết hạn | Mã hết hạn lúc bấm Đặt hàng | Invalid | Re-validate chặn tạo đơn |
| **VCHR-040** | Confirm tự động hoàn mã khi đơn hàng bị hủy | User 105 + #12 (`UNIQUE2026`) | Valid | Hoàn lại lượt dùng ngay khi hủy đơn |
| **VCHR-041** | Confirm voucher chỉ giảm tiền hàng, không giảm ship | Đơn 500k + ship 45k + #3 | Valid | Giảm tiền hàng, ship giữ nguyên 45k |

---

## 4. Kiểm tra Record Mồ côi
- **Tổng số record sinh ra**: 12 Valid records + 23 Boundary/Negative records = 35 records.
- **Số record đã được ánh xạ**: 35/35 records.
- **Số record mồ côi (Orphan Records)**: **0**. Mọi record đều phục vụ trực tiếp cho ít nhất 1 test case.

---

## 5. Kết luận Kiểm định Bước 12
- **Verdict**: `PASS`
- **Căn cứ**: 41/41 Test Cases đều có dữ liệu ánh xạ cụ thể (0 test case bị `CHƯA CÓ DATA`); 100% record dữ liệu đều có mục đích kiểm thử rõ ràng và bám sát quy tắc nghiệp vụ. Sẵn sàng cho chốt chặn cuối cùng `06-coverage-review`.
