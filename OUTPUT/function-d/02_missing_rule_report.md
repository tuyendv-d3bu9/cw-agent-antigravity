# BÁO CÁO PHÂN TÍCH QUY TẮC NGHIỆP VỤ BỊ THIẾU (MISSING-RULE REPORT) · function-d
Owner: qa-analyst/02-missing-rule-06w · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, knowledge/function-d.md · Verdict: PASS

---

## 1. Ma trận Truy vết 06W
> Tên W1–W6 lấy đúng `shared/QA_STANDARD.md` §4. Các quy tắc đã được xác nhận (Confirmed) trong `knowledge/function-d.md` không báo lại thành missing rule mới.

| STT | Câu hỏi 06W | Trọng tâm đã quét | Trạng thái | Mã quy tắc / Kết luận kiểm tra |
|:---|:---|:---|:---|:---|
| **W1** | What if input lạ | Khoảng trắng thừa, hoa-thường, ký tự đặc biệt, độ dài 3-20 ký tự, input rỗng | Đã bao phủ triệt để | Không phát hiện vấn đề mới (Bao phủ bởi BR-17, BR-18, BR-19, BR-26) |
| **W2** | What if state lạ | Hết hạn session giữa chừng, tài khoản user bị khóa trong lúc thanh toán | Đã bao phủ triệt để | Không phát hiện vấn đề mới (Bao phủ bởi BR-15, BR-16) |
| **W3** | What if data lạ | Làm tròn tiền lẻ chiết khấu %, giảm cố định > tổng đơn, sàn 0 VNĐ, trần Max Cap | Đã bao phủ triệt để | Không phát hiện vấn đề mới (Bao phủ bởi BR-10, BR-11, BR-20) |
| **W4** | What when timing | Mốc 23:59:59 ngày hết hạn theo GMT+7, re-validate khi bấm Đặt hàng | Đã bao phủ triệt để | Không phát hiện vấn đề mới (Bao phủ bởi BR-03, BR-21, BR-22) |
| **W5** | Who else actor | Giới hạn 1 lần/user, thứ tự trừ ví ShopGo, biến động giá/tồn kho server | Đã bao phủ triệt để | Không phát hiện vấn đề mới (Bao phủ bởi BR-08, BR-23, BR-24) |
| **W6** | What happens after | Hoàn mã khi hủy đơn, cơ chế Rate limit 5 lần sai/5 phút, danh sách thông báo lỗi chuẩn | Đã bao phủ triệt để | Không phát hiện vấn đề mới (Bao phủ bởi BR-14, BR-25, BR-26) |

---

## 2. Tình trạng Missing Rules & Gaps nghiệp vụ
Toàn bộ 12 Missing Rules phát hiện từ chu kỳ phân tích trước (MR-01 đến MR-12) đã được chuyển giao, làm rõ chính thức với BA/PO và chuẩn hóa thành 12 Business Rules bổ sung (`BR-15` $\to$ `BR-26`) trong `01_requirement_risk_summary.md` và `knowledge/function-d.md`.

- **Số lượng Missing Rule còn `New`**: 0
- **Số lượng Missing Rule còn `TREO`**: 0
- **Số lượng Missing Rule đã `Confirmed`**: 12/12

### Danh mục quy tắc đã chuẩn hóa thành công:
1. **MR-01 $\to$ BR-15 (State & Lifecycle)**: Modal đăng nhập tại chỗ khi session timeout, bảo lưu giỏ hàng và voucher.
2. **MR-02 $\to$ BR-16 (Implicit & Authorization)**: Kiểm tra realtime trạng thái tài khoản user, chặn voucher và đặt hàng nếu bị khóa.
3. **MR-03 $\to$ BR-17 (Boundary & Edge)**: Tự động `trim()` khoảng trắng đầu/cuối chuỗi nhập mã voucher.
4. **MR-04 $\to$ BR-18 (Boundary & Edge)**: Không phân biệt chữ hoa/thường (`Case-insensitive`), auto in hoa khi đối soát.
5. **MR-05 $\to$ BR-19 (Boundary & Edge)**: Độ dài mã 3-20 ký tự, chỉ gồm ký tự chữ và số `[A-Za-z0-9]`, cấm ký tự lạ.
6. **MR-06 $\to$ BR-20 (Boundary & Edge)**: Làm tròn xuống (Floor) hàng đơn vị đồng VNĐ cho tiền chiết khấu lẻ %.
7. **MR-07 $\to$ BR-21 (State & Lifecycle)**: Mốc hết hạn chốt đến 23:59:59 của ngày kết thúc theo múi giờ GMT+7.
8. **MR-08 $\to$ BR-22 (State & Lifecycle)**: Bắt buộc re-validate kiểm tra voucher tại thời điểm bấm Đặt hàng.
9. **MR-09 $\to$ BR-23 (Dependency & Side-Effect)**: Thứ tự trừ tiền ưu tiên Voucher trước, số dư ví ShopGo sau.
10. **MR-10 $\to$ BR-24 (Dependency & Side-Effect)**: Đồng bộ biến động giá/tồn kho server, cảnh báo và tự gỡ voucher nếu dưới min order.
11. **MR-11 $\to$ BR-25 (Exception & Error Handling)**: Chặn Brute-force: Sai 5 lần liên tiếp trong 5 phút $\to$ khóa 15 phút.
12. **MR-12 $\to$ BR-26 (Exception & Error Handling)**: Thống nhất 6 thông báo lỗi chuẩn xác định lượng.

---

## 3. Tổng hợp Câu hỏi Clarification gửi BA/PO
| STT | Mã Rule | Phân loại | Câu hỏi cho BA/PO | Trạng thái | Ưu tiên |
|:---|:---|:---|:---|:---|:---|
| - | - | - | *Không còn câu hỏi tồn đọng. Toàn bộ 100% kẽ hở nghiệp vụ đã được làm rõ và xác nhận.* | Hoàn thành | - |

---

## 4. Kết luận Kiểm định Bước 2
- **Verdict**: `PASS`
- **Căn cứ**: Quét đủ 6 câu hỏi 06W, 100% kẽ hở nghiệp vụ đã được bao phủ hoàn toàn trong hệ thống Business Rules đã xác nhận (BR-01 $\to$ BR-26). Không có kẽ hở mơ hồ hay câu hỏi treo cần dừng lại. Đủ điều kiện kích hoạt Bước 3 (`03-viewpoint-selection`).
