# TEST CASE SPECIFICATION · FUNCTION D: ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)
Owner: qa-test-design/05-test-case-generation · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, 03_viewpoint_report.md, 04_test_idea_report.md · Verdict: PASS

---

## TỔNG QUAN BỘ TEST SUITE
- **Module**: `VCHR` (Voucher & Promotions)
- **Tổng số Test Case**: 41 Test Cases
- **Độ bao phủ**: 100% Test Idea "Giữ" từ `04_test_idea_report.md`, đối soát trực tiếp 26 Business Rules (`BR-01` $\to$ `BR-26`).
- **Quy chuẩn dữ liệu**: 100% có giá trị thật, không sử dụng placeholder. Định dạng tiền tệ VNĐ, ngày `YYYY-MM-DD`, múi giờ `GMT+7`.

---

## DANH SÁCH CHI TIẾT TEST CASES

### TC_ID: VCHR-001
- **Title**: Verify áp dụng thành công mã giảm số tiền cố định (VNĐ) khi đơn hàng đủ điều kiện tối thiểu
- **Precondition**:
  - Khách hàng đã đăng nhập tài khoản `cust_active_01@shopgo.vn`.
  - Giỏ hàng có sản phẩm "Áo thun Polo" trị giá 350.000 VNĐ (phí ship 30.000 VNĐ). Đang ở trang Thanh toán.
  - Hệ thống có mã `VCH50K` (giảm 50.000 VNĐ, đơn tối thiểu 200.000 VNĐ, HSD 2026-12-31).
- **Test Steps**:
  1. Nhập mã `VCH50K` vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã giảm giá: `VCH50K`
  - Giá trị đơn hàng gốc: 350.000 VNĐ
- **Expected Result**:
  - Hệ thống áp dụng thành công.
  - Hiển thị dòng chiết khấu: "-50.000 VNĐ".
  - Tổng tiền thanh toán đơn hàng cập nhật thành: 330.000 VNĐ (350.000 - 50.000 + 30.000 ship).
- **Priority**: High
- **Tags**: Rule#BR-01, Rule#BR-02, Rule#BR-04, Rule#BR-06, Viewpoint#VP-01, Module#VCHR, Manual

---

### TC_ID: VCHR-002
- **Title**: Verify áp dụng thành công mã giảm theo tỷ lệ phần trăm (%) khi mức giảm chưa chạm trần Max Cap
- **Precondition**:
  - Khách hàng đăng nhập tài khoản `cust_active_01@shopgo.vn`.
  - Giỏ hàng có sản phẩm "Quần Jeans Slimfit" trị giá 400.000 VNĐ (phí ship 30.000 VNĐ).
  - Hệ thống có mã `SALE10` (giảm 10%, Max Cap 100.000 VNĐ, đơn tối thiểu 300.000 VNĐ).
- **Test Steps**:
  1. Nhập mã `SALE10` vào ô "Mã giảm giá" tại trang Thanh toán.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã giảm giá: `SALE10`
  - Đơn hàng: 400.000 VNĐ (10% = 40.000 VNĐ < 100.000 VNĐ)
- **Expected Result**:
  - Áp dụng thành công, hiển thị mức giảm: "-40.000 VNĐ".
  - Tổng tiền thanh toán mới: 390.000 VNĐ (400.000 - 40.000 + 30.000 ship).
- **Priority**: High
- **Tags**: Rule#BR-01, Rule#BR-04, Rule#BR-11, Viewpoint#VP-01, Module#VCHR, Automated

---

### TC_ID: VCHR-003
- **Title**: Verify áp dụng thành công mã giảm theo tỷ lệ phần trăm (%) khi mức giảm chạm đúng mức trần Max Cap
- **Precondition**:
  - Khách hàng đăng nhập tài khoản `cust_active_01@shopgo.vn`.
  - Giỏ hàng có đơn hàng trị giá 1.000.000 VNĐ (phí ship 30.000 VNĐ).
  - Hệ thống có mã `SALE10` (giảm 10%, Max Cap 100.000 VNĐ, đơn tối thiểu 300.000 VNĐ).
- **Test Steps**:
  1. Nhập mã `SALE10` vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã giảm giá: `SALE10`
  - Đơn hàng: 1.000.000 VNĐ (10% = 100.000 VNĐ = Max Cap)
- **Expected Result**:
  - Hệ thống áp dụng thành công mức giảm trần: "-100.000 VNĐ".
  - Tổng tiền thanh toán: 930.000 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-11, Viewpoint#VP-01, Module#VCHR, Automated

---

### TC_ID: VCHR-004
- **Title**: Verify hệ thống tự động hủy mã cũ và áp dụng mã mới thay thế khi nhập mã hợp lệ khác
- **Precondition**:
  - Khách hàng đang ở màn hình Thanh toán, đơn hàng 500.000 VNĐ.
  - Đang áp dụng sẵn mã `VCH50K` (giảm 50.000 VNĐ, tổng tiền hiện tại 450.000 VNĐ).
  - Hệ thống có mã `VCH100K` (giảm 100.000 VNĐ cho đơn từ 500.000 VNĐ).
- **Test Steps**:
  1. Xóa mã `VCH50K` trong ô nhập, nhập mã `VCH100K`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã cũ: `VCH50K`
  - Mã mới: `VCH100K`
- **Expected Result**:
  - Hệ thống hủy bỏ mã `VCH50K`, hiển thị thông báo đã áp dụng mã `VCH100K`.
  - Số tiền giảm cập nhật thành: "-100.000 VNĐ".
  - Tổng tiền thanh toán mới là: 400.000 VNĐ (không cộng dồn thành 150.000 VNĐ).
- **Priority**: High
- **Tags**: Rule#BR-09, Viewpoint#VP-01, Module#VCHR, Automated

---

### TC_ID: VCHR-005
- **Title**: Verify hoàn tất đặt hàng thành công sau khi áp dụng voucher hợp lệ
- **Precondition**:
  - Khách hàng đã áp mã `VCH50K` thành công trên đơn hàng 400.000 VNĐ.
  - Chọn phương thức thanh toán "COD" (Thanh toán khi nhận hàng).
- **Test Steps**:
  1. Kiểm tra lại thông tin tóm tắt đơn hàng.
  2. Nhấn nút "Đặt hàng".
- **Test Data**:
  - Đơn hàng: 400.000 VNĐ, Giảm giá: 50.000 VNĐ, Phí ship: 30.000 VNĐ.
- **Expected Result**:
  - Đơn hàng được tạo thành công với tổng thanh toán 380.000 VNĐ.
  - Mã giảm giá chuyển sang trạng thái đã sử dụng cho tài khoản này.
- **Priority**: High
- **Tags**: Rule#BR-04, Rule#BR-22, Viewpoint#VP-01, Module#VCHR, Manual

---

### TC_ID: VCHR-006
- **Title**: Validate hệ thống từ chối và báo lỗi khi nhập mã không tồn tại trong hệ thống
- **Precondition**:
  - Khách hàng ở màn hình Thanh toán, đơn hàng 300.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `NOSUCHCODE99` vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã giảm giá: `NOSUCHCODE99`
- **Expected Result**:
  - Hiển thị thông báo lỗi: "Mã giảm giá không hợp lệ".
  - Giữ nguyên tổng tiền thanh toán gốc 300.000 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#BR-26, Viewpoint#VP-02, Module#VCHR, Automated

---

### TC_ID: VCHR-007
- **Title**: Validate hệ thống từ chối và báo lỗi khi nhập mã giảm giá đã hết hạn sử dụng
- **Precondition**:
  - Hệ thống có mã `EXPIRED2025` có ngày hết hạn là `2025-12-31`.
  - Ngày hiện tại của hệ thống là `2026-09-16`.
- **Test Steps**:
  1. Nhập mã `EXPIRED2025` vào ô mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã giảm giá: `EXPIRED2025`
- **Expected Result**:
  - Hiển thị thông báo lỗi: "Mã giảm giá đã hết hạn sử dụng".
  - Không áp dụng chiết khấu vào đơn hàng.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#BR-05, Rule#BR-26, Viewpoint#VP-02, Module#VCHR, Automated

---

### TC_ID: VCHR-008
- **Title**: Validate hệ thống từ chối khi giá trị đơn hàng chưa đạt mức tối thiểu quy định
- **Precondition**:
  - Mã `MIN500K` yêu cầu giá trị đơn hàng tối thiểu 500.000 VNĐ.
  - Khách hàng có giỏ hàng trị giá 450.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `MIN500K` vào ô mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Đơn hàng: 450.000 VNĐ
  - Mã giảm giá: `MIN500K`
- **Expected Result**:
  - Hiển thị thông báo lỗi: "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này".
  - Không giảm trừ tiền.
- **Priority**: High
- **Tags**: Rule#BR-02, Rule#BR-05, Rule#BR-26, Viewpoint#VP-02, Module#VCHR, Automated

---

### TC_ID: VCHR-009
- **Title**: Validate hệ thống từ chối khi khách hàng nhập lại mã đã từng sử dụng thành công trước đó
- **Precondition**:
  - Tài khoản `cust_used_01@shopgo.vn` đã từng đặt đơn hàng thành công với mã `WELCOME2026`.
  - Khách hàng đang tạo đơn hàng mới trị giá 600.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `WELCOME2026` vào ô mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - User: `cust_used_01@shopgo.vn`
  - Mã giảm giá: `WELCOME2026`
- **Expected Result**:
  - Hiển thị thông báo lỗi: "Bạn đã sử dụng mã giảm giá này rồi".
  - Không cho phép áp dụng lần 2.
- **Priority**: High
- **Tags**: Rule#BR-08, Rule#BR-26, Viewpoint#VP-02, Module#VCHR, Automated

---

### TC_ID: VCHR-010
- **Title**: Validate hệ thống cảnh báo khi người dùng bấm Áp dụng mà để trống ô nhập mã
- **Precondition**:
  - Khách hàng ở màn hình Thanh toán. Ô nhập "Mã giảm giá" đang để trống.
- **Test Steps**:
  1. Để trống ô nhập mã giảm giá (chuỗi rỗng `""`).
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Input: `""`
- **Expected Result**:
  - Hiển thị thông báo ngay dưới ô nhập: "Vui lòng nhập mã giảm giá".
  - Không gửi request xác thực rác lên server.
- **Priority**: Medium
- **Tags**: Rule#BR-26, Viewpoint#VP-02, Module#VCHR, Automated

---

### TC_ID: VCHR-011
- **Title**: Validate khách vãng lai (Guest) bị chuyển hướng đăng nhập khi tiến hành thanh toán để áp voucher
- **Precondition**:
  - Người dùng đang ở trạng thái chưa đăng nhập (Guest).
  - Có sản phẩm trong giỏ hàng và nhấn nút "Tiến hành thanh toán".
- **Test Steps**:
  1. Nhấn nút "Thanh toán" từ màn hình giỏ hàng.
- **Test Data**:
  - User role: Guest
- **Expected Result**:
  - Hệ thống chuyển hướng người dùng đến trang Đăng nhập / Đăng ký.
  - Không cho phép truy cập thẳng vào trang thanh toán khi chưa xác thực.
- **Priority**: High
- **Tags**: Rule#BR-07, Viewpoint#VP-02, Module#VCHR, Automated

---

### TC_ID: VCHR-012
- **Title**: Confirm áp dụng thành công khi giá trị đơn hàng bằng đúng giá trị tối thiểu (`min`)
- **Precondition**:
  - Mã `VCHMIN300` yêu cầu đơn hàng tối thiểu 300.000 VNĐ (giảm 30.000 VNĐ).
  - Khách hàng có giỏ hàng với tổng tiền hàng đúng 300.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `VCHMIN300` vào ô mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Giá trị đơn hàng: 300.000 VNĐ
  - Mã: `VCHMIN300`
- **Expected Result**:
  - Áp dụng thành công, hiển thị giảm 30.000 VNĐ.
  - Tổng tiền thanh toán: 270.000 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-02, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-013
- **Title**: Validate hệ thống từ chối khi giá trị đơn hàng thấp hơn 1 đồng so với mức tối thiểu (`min - 1 VNĐ`)
- **Precondition**:
  - Mã `VCHMIN300` yêu cầu đơn hàng tối thiểu 300.000 VNĐ.
  - Khách hàng có đơn hàng trị giá đúng 299.999 VNĐ.
- **Test Steps**:
  1. Nhập mã `VCHMIN300`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Đơn hàng: 299.999 VNĐ
- **Expected Result**:
  - Báo lỗi: "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này".
  - Giữ nguyên tiền thanh toán 299.999 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-02, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-014
- **Title**: Confirm áp dụng thành công khi giá trị đơn hàng cao hơn 1 đồng so với mức tối thiểu (`min + 1 VNĐ`)
- **Precondition**:
  - Mã `VCHMIN300` yêu cầu tối thiểu 300.000 VNĐ (giảm 30.000 VNĐ).
  - Khách hàng có đơn hàng trị giá 300.001 VNĐ.
- **Test Steps**:
  1. Nhập mã `VCHMIN300`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Đơn hàng: 300.001 VNĐ
- **Expected Result**:
  - Áp dụng thành công, giảm 30.000 VNĐ.
  - Tiền thanh toán còn lại: 270.001 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-02, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-015
- **Title**: Confirm mức giảm mã % bị chặn trần đúng Max Cap khi tính toán vượt trần (`MaxCap + 1 VNĐ`)
- **Precondition**:
  - Mã `SALE20` giảm 20%, Max Cap 100.000 VNĐ, đơn tối thiểu 200.000 VNĐ.
  - Khách hàng có đơn hàng 500.005 VNĐ (20% của 500.005 = 100.001 VNĐ > 100.000 VNĐ).
- **Test Steps**:
  1. Nhập mã `SALE20`.
  2. Nhấn "Áp dụng".
- **Test Data**:
  - Đơn hàng: 500.005 VNĐ
  - Mã: `SALE20`
- **Expected Result**:
  - Áp dụng thành công với mức giảm trần đúng: 100.000 VNĐ (chặn Max Cap).
  - Tổng thanh toán: 400.005 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-11, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-016
- **Title**: Confirm mức giảm mã % giữ nguyên giá trị tính toán khi thấp hơn 1 đồng so với trần (`MaxCap - 1 VNĐ`)
- **Precondition**:
  - Mã `SALE20` giảm 20%, Max Cap 100.000 VNĐ.
  - Đơn hàng trị giá 499.995 VNĐ (20% = 99.999 VNĐ = MaxCap - 1 VNĐ).
- **Test Steps**:
  1. Nhập mã `SALE20`.
  2. Nhấn "Áp dụng".
- **Test Data**:
  - Đơn hàng: 499.995 VNĐ
- **Expected Result**:
  - Áp dụng thành công với mức giảm đúng: 99.999 VNĐ.
  - Tổng tiền thanh toán: 400.000 VNĐ (kèm phí ship nếu có).
- **Priority**: High
- **Tags**: Rule#BR-11, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-017
- **Title**: Confirm tổng tiền thanh toán hiển thị đúng 0 VNĐ khi mã giảm cố định bằng đúng tổng giá trị đơn
- **Precondition**:
  - Mã `FIX100K` giảm 100.000 VNĐ, min order 100.000 VNĐ.
  - Đơn hàng trị giá đúng 100.000 VNĐ (miễn phí vận chuyển).
- **Test Steps**:
  1. Nhập mã `FIX100K`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Đơn hàng: 100.000 VNĐ, Mã: `FIX100K`
- **Expected Result**:
  - Giảm 100.000 VNĐ.
  - Tổng tiền thanh toán cập nhật hiển thị chính xác: 0 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-10, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-018
- **Title**: Confirm tổng tiền thanh toán chặn sàn ở 0 VNĐ khi mã giảm cố định lớn hơn tổng giá trị đơn
- **Precondition**:
  - Mã `FIX200K` giảm 200.000 VNĐ cho đơn từ 150.000 VNĐ.
  - Đơn hàng trị giá 150.000 VNĐ (miễn phí vận chuyển).
- **Test Steps**:
  1. Nhập mã `FIX200K`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Đơn hàng: 150.000 VNĐ, Mã: `FIX200K` (Mức giảm danh định 200.000 VNĐ > 150.000 VNĐ)
- **Expected Result**:
  - Mức giảm thực tế áp dụng là 150.000 VNĐ.
  - Tổng tiền thanh toán hiển thị đúng 0 VNĐ, tuyệt đối không bị số âm (`-50.000 VNĐ`).
- **Priority**: Critical
- **Tags**: Rule#BR-10, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-019
- **Title**: Confirm quy tắc làm tròn xuống hàng đơn vị đồng VNĐ khi chiết khấu % ra số tiền lẻ thập phân
- **Precondition**:
  - Mã `SALE15` giảm 15%, min order 100.000 VNĐ.
  - Đơn hàng trị giá 135.555 VNĐ (15% = 20.333,25 VNĐ).
- **Test Steps**:
  1. Nhập mã `SALE15`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Đơn hàng: 135.555 VNĐ
- **Expected Result**:
  - Hệ thống làm tròn xuống (Floor) thành: 20.333 VNĐ.
  - Tổng tiền hàng sau giảm: 115.222 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-20, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-020
- **Title**: Validate hệ thống từ chối khi nhập mã giảm giá có độ dài 2 ký tự (dưới ngưỡng tối thiểu 3)
- **Precondition**:
  - Khách hàng tại trang Thanh toán.
- **Test Steps**:
  1. Nhập chuỗi `AB` vào ô mã giảm giá.
  2. Nhấn "Áp dụng".
- **Test Data**:
  - Mã: `AB` (2 ký tự)
- **Expected Result**:
  - Báo lỗi: "Mã giảm giá không hợp lệ".
- **Priority**: Medium
- **Tags**: Rule#BR-19, Rule#BR-26, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-021
- **Title**: Confirm áp dụng thành công mã giảm giá có độ dài đúng 3 ký tự (ngưỡng min hợp lệ)
- **Precondition**:
  - Hệ thống cấu hình mã `VIP` (3 ký tự, giảm 30.000 VNĐ cho đơn từ 200.000 VNĐ).
  - Đơn hàng 250.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `VIP`.
  2. Nhấn "Áp dụng".
- **Test Data**:
  - Mã: `VIP` (3 ký tự)
- **Expected Result**:
  - Áp dụng thành công, giảm 30.000 VNĐ.
- **Priority**: Medium
- **Tags**: Rule#BR-19, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-022
- **Title**: Confirm áp dụng thành công mã giảm giá có độ dài đúng 20 ký tự (ngưỡng max hợp lệ)
- **Precondition**:
  - Hệ thống cấu hình mã `VCHRMAXLENGTH20CHARS` (20 ký tự, giảm 50.000 VNĐ).
  - Đơn hàng 300.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `VCHRMAXLENGTH20CHARS`.
  2. Nhấn "Áp dụng".
- **Test Data**:
  - Mã: `VCHRMAXLENGTH20CHARS` (độ dài 20 ký tự)
- **Expected Result**:
  - Áp dụng thành công, giảm 50.000 VNĐ.
- **Priority**: Medium
- **Tags**: Rule#BR-19, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-023
- **Title**: Validate hệ thống từ chối khi nhập mã giảm giá có độ dài 21 ký tự (vượt ngưỡng max 20)
- **Precondition**:
  - Khách hàng ở màn hình Thanh toán.
- **Test Steps**:
  1. Nhập chuỗi `VCHRMAXLENGTH21CHARSS` (21 ký tự).
  2. Nhấn "Áp dụng".
- **Test Data**:
  - Mã: `VCHRMAXLENGTH21CHARSS` (21 ký tự)
- **Expected Result**:
  - Ô nhập ngăn không cho nhập quá 20 ký tự hoặc báo lỗi: "Mã giảm giá không hợp lệ".
- **Priority**: Medium
- **Tags**: Rule#BR-19, Rule#BR-26, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-024
- **Title**: Confirm mã giảm giá vẫn áp dụng hợp lệ tại thời điểm 23:59:59 của ngày hết hạn (GMT+7)
- **Precondition**:
  - Mã `NIGHTSALE` có ngày hết hạn là `2026-09-16`.
  - Đồng hồ máy chủ hệ thống mô phỏng thời điểm: `2026-09-16 23:59:59 GMT+7`.
  - Đơn hàng 400.000 VNĐ.
- **Test Steps**:
  1. Nhập mã `NIGHTSALE`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã: `NIGHTSALE`
  - Timestamp: `2026-09-16 23:59:59`
- **Expected Result**:
  - Áp dụng thành công, chiết khấu được ghi nhận.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#BR-21, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-025
- **Title**: Validate mã giảm giá bị từ chối hết hạn tại thời điểm 00:00:00 của ngày liền kề sau ngày hết hạn
- **Precondition**:
  - Mã `NIGHTSALE` hết hạn ngày `2026-09-16`.
  - Đồng hồ hệ thống bước sang: `2026-09-17 00:00:00 GMT+7`.
- **Test Steps**:
  1. Nhập mã `NIGHTSALE`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Timestamp: `2026-09-17 00:00:00`
- **Expected Result**:
  - Báo lỗi: "Mã giảm giá đã hết hạn sử dụng".
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#BR-21, Rule#BR-26, Viewpoint#VP-03, Module#VCHR, Automated

---

### TC_ID: VCHR-026
- **Title**: Validate kích hoạt tạm khóa 15 phút khi người dùng nhập sai mã liên tiếp 5 lần trong 5 phút
- **Precondition**:
  - Tài khoản `cust_brute_01@shopgo.vn` đang ở màn hình Thanh toán.
- **Test Steps**:
  1. Nhập mã sai lần 1: `SAI1` $\rightarrow$ Áp dụng.
  2. Nhập mã sai lần 2: `SAI2` $\rightarrow$ Áp dụng.
  3. Nhập mã sai lần 3: `SAI3` $\rightarrow$ Áp dụng.
  4. Nhập mã sai lần 4: `SAI4` $\rightarrow$ Áp dụng.
  5. Nhập mã sai lần 5: `SAI5` $\rightarrow$ Áp dụng (trong vòng 5 phút).
- **Test Data**:
  - Chuỗi sai: `SAI1` $\to$ `SAI5`
- **Expected Result**:
  - Ở lần thứ 5, hệ thống hiển thị thông báo: "Bạn đã thử sai quá nhiều lần. Vui lòng thử lại sau 15 phút".
  - Ô nhập mã giảm giá và nút Áp dụng bị tạm khóa (disabled).
- **Priority**: High
- **Tags**: Rule#BR-25, Rule#BR-26, Viewpoint#VP-04, Module#VCHR, Automated

---

### TC_ID: VCHR-027
- **Title**: Validate hệ thống từ chối ngay lập tức khi người dùng cố gắng thao tác trong thời gian bị khóa
- **Precondition**:
  - Tài khoản đang trong thời gian bị phạt tạm khóa 15 phút do brute-force.
- **Test Steps**:
  1. Cố tình gửi request áp dụng mã qua API hoặc giao diện.
- **Test Data**:
  - Mã: `VCH50K`
- **Expected Result**:
  - Server trả về mã lỗi 429 Too Many Requests và thông báo "Bạn đã thử sai quá nhiều lần. Vui lòng thử lại sau 15 phút".
- **Priority**: High
- **Tags**: Rule#BR-25, Viewpoint#VP-04, Module#VCHR, Automated

---

### TC_ID: VCHR-028
- **Title**: Confirm hệ thống tự động mở khóa ô nhập mã sau khi hết thời gian chờ 15 phút
- **Precondition**:
  - Tài khoản bị khóa từ `10:00:00`.
  - Thời gian hệ thống trôi qua 15 phút 01 giây (`10:15:01`).
- **Test Steps**:
  1. Tải lại trang hoặc thao tác nhập mã `VCH50K` hợp lệ.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã: `VCH50K`
- **Expected Result**:
  - Ô nhập mã hoạt động bình thường, áp dụng mã thành công.
- **Priority**: Medium
- **Tags**: Rule#BR-25, Viewpoint#VP-04, Module#VCHR, Automated

---

### TC_ID: VCHR-029
- **Title**: Validate hệ thống từ chối và lọc an toàn khi nhập ký tự đặc biệt hoặc mã script HTML/SQL
- **Precondition**:
  - Khách hàng tại trang Thanh toán.
- **Test Steps**:
  1. Nhập chuỗi `<script>alert(1)</script>` vào ô mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Input: `<script>alert(1)</script>` và `' OR 1=1 --`
- **Expected Result**:
  - Không kích hoạt XSS/SQL Injection.
  - Báo lỗi: "Mã giảm giá không hợp lệ".
- **Priority**: High
- **Tags**: Rule#BR-19, Rule#BR-26, Viewpoint#VP-04, Module#VCHR, Automated

---

### TC_ID: VCHR-030
- **Title**: Validate hệ thống chặn áp voucher và vô hiệu hóa đặt hàng khi tài khoản bị khóa realtime
- **Precondition**:
  - Khách hàng đang mở màn hình thanh toán.
  - Quản trị viên thực hiện Khóa tài khoản khách hàng này trên Admin.
- **Test Steps**:
  1. Khách hàng nhập mã `VCH50K`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Tài khoản trạng thái: `Inactive / Banned`
- **Expected Result**:
  - Hệ thống từ chối và báo lỗi: "Tài khoản của bạn đã bị tạm khóa, vui lòng liên hệ CSKH".
  - Nút Đặt hàng bị vô hiệu hóa.
- **Priority**: High
- **Tags**: Rule#BR-16, Viewpoint#VP-04, Module#VCHR, Manual

---

### TC_ID: VCHR-031
- **Title**: Confirm hệ thống tự động trim khoảng trắng thừa ở đầu và cuối chuỗi nhập mã
- **Precondition**:
  - Hệ thống có mã `VCH50K`.
  - Đơn hàng 300.000 VNĐ.
- **Test Steps**:
  1. Nhập chuỗi có khoảng trắng đầu/cuối: `"   VCH50K   "`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Input: `"   VCH50K   "`
- **Expected Result**:
  - Hệ thống tự động cắt bỏ khoảng trắng thừa, nhận diện mã là `VCH50K`.
  - Áp dụng thành công, giảm 50.000 VNĐ.
- **Priority**: Medium
- **Tags**: Rule#BR-17, Viewpoint#VP-05, Module#VCHR, Automated

---

### TC_ID: VCHR-032
- **Title**: Validate hệ thống báo lỗi khi chuỗi nhập mã có khoảng trắng ở giữa
- **Precondition**:
  - Khách hàng tại trang Thanh toán.
- **Test Steps**:
  1. Nhập chuỗi `"VCH 50K"` vào ô mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Input: `"VCH 50K"`
- **Expected Result**:
  - Hệ thống báo lỗi: "Mã giảm giá không hợp lệ".
- **Priority**: Medium
- **Tags**: Rule#BR-17, Rule#BR-26, Viewpoint#VP-05, Module#VCHR, Automated

---

### TC_ID: VCHR-033
- **Title**: Confirm hệ thống không phân biệt chữ hoa / chữ thường khi nhập mã (Case-insensitive)
- **Precondition**:
  - Mã trong hệ thống lưu dạng in hoa: `SALE50`.
- **Test Steps**:
  1. Khách hàng nhập chữ thường: `sale50`.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Input: `sale50`
- **Expected Result**:
  - Hệ thống tự động chuyển thành in hoa `SALE50` và áp dụng chiết khấu thành công.
- **Priority**: Medium
- **Tags**: Rule#BR-18, Viewpoint#VP-05, Module#VCHR, Automated

---

### TC_ID: VCHR-034
- **Title**: Confirm hiển thị modal đăng nhập tại chỗ khi session timeout và giữ nguyên giỏ hàng cùng mã nhập dở
- **Precondition**:
  - Khách hàng đang ở trang Thanh toán, giỏ hàng 400.000 VNĐ, đang nhập dở mã `VCH50K`.
  - Phiên làm việc (Session token) bị hết hạn.
- **Test Steps**:
  1. Nhấn nút "Áp dụng".
- **Test Data**:
  - Trạng thái session: Expired
- **Expected Result**:
  - Bật popup/modal yêu cầu đăng nhập lại ngay tại chỗ (không redirect mất trang).
  - Sau khi đăng nhập thành công, modal đóng lại, thông tin giỏ hàng và mã `VCH50K` trong ô nhập được giữ nguyên vẹn.
- **Priority**: Medium
- **Tags**: Rule#BR-15, Viewpoint#VP-05, Module#VCHR, Manual

---

### TC_ID: VCHR-035
- **Title**: Confirm hiển thị chính xác danh sách thông báo lỗi tiêu chuẩn cho từng trường hợp
- **Precondition**:
  - Khách hàng tại màn hình thanh toán.
- **Test Steps**:
  1. Kiểm tra đối chiếu các thông báo lỗi hiển thị với bảng mẫu chuẩn BR-26.
- **Test Data**:
  - 6 kịch bản lỗi: rỗng, sai mã, hết hạn, thiếu min order, đã dùng, rate limit.
- **Expected Result**:
  - 100% câu chữ thông báo hiển thị đúng từng từ theo quy định tại BR-26.
- **Priority**: Medium
- **Tags**: Rule#BR-26, Viewpoint#VP-05, Module#VCHR, Automated

---

### TC_ID: VCHR-036
- **Title**: Confirm thứ tự trừ tiền khi kết hợp Ví ShopGo: Trừ chiết khấu Voucher trước, số dư Ví trừ sau
- **Precondition**:
  - Đơn hàng trị giá 500.000 VNĐ (miễn phí ship).
  - Mã `VCH100K` giảm 100.000 VNĐ.
  - Số dư Ví ShopGo của tài khoản là 600.000 VNĐ.
- **Test Steps**:
  1. Áp dụng mã `VCH100K`.
  2. Chọn phương thức thanh toán bằng "Ví ShopGo".
  3. Nhấn "Đặt hàng".
- **Test Data**:
  - Đơn hàng: 500.000 VNĐ, Voucher: -100.000 VNĐ, Số dư ví ban đầu: 600.000 VNĐ.
- **Expected Result**:
  - Tổng tiền sau voucher là 400.000 VNĐ.
  - Số dư Ví ShopGo bị trừ đúng 400.000 VNĐ (số dư còn lại 200.000 VNĐ, không bị trừ 500.000 VNĐ).
- **Priority**: High
- **Tags**: Rule#BR-23, Viewpoint#VP-06, Module#VCHR, Manual

---

### TC_ID: VCHR-037
- **Title**: Validate hệ thống tự động gỡ voucher khi sửa giỏ hàng làm tổng đơn < mức tối thiểu
- **Precondition**:
  - Đơn hàng gồm 2 áo giá 400.000 VNĐ, đã áp mã `MIN300K` (giảm 30.000 VNĐ cho đơn từ 300.000 VNĐ).
- **Test Steps**:
  1. Quay lại giỏ hàng hoặc sửa số lượng giảm còn 1 áo (tổng tiền còn 200.000 VNĐ < 300.000 VNĐ).
  2. Quay lại trang Thanh toán.
- **Test Data**:
  - Số lượng áo: từ 2 giảm còn 1 (giá mới 200.000 VNĐ).
- **Expected Result**:
  - Hệ thống hiển thị cảnh báo: "Đơn hàng không còn đủ giá trị tối thiểu để áp dụng mã MIN300K".
  - Voucher tự động bị gỡ bỏ, tổng thanh toán tính theo giá gốc 200.000 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-13, Viewpoint#VP-06, Module#VCHR, Automated

---

### TC_ID: VCHR-038
- **Title**: Validate hệ thống cảnh báo và tự gỡ voucher khi server cập nhật giá làm đơn < mức tối thiểu
- **Precondition**:
  - Khách hàng đang ở màn hình Thanh toán với đơn hàng 300.000 VNĐ, đã áp mã `MIN300K`.
  - Phía server cập nhật giảm giá sản phẩm khiến tổng đơn chỉ còn 280.000 VNĐ.
- **Test Steps**:
  1. Khách hàng thực hiện thao tác trên màn hình thanh toán.
- **Test Data**:
  - Giá server cập nhật: 280.000 VNĐ.
- **Expected Result**:
  - Hệ thống đồng bộ giá mới, thông báo giá thay đổi và tự động gỡ voucher `MIN300K`.
- **Priority**: High
- **Tags**: Rule#BR-24, Viewpoint#VP-06, Module#VCHR, Manual

---

### TC_ID: VCHR-039
- **Title**: Validate re-validate voucher khi bấm Đặt hàng: Chặn tạo đơn nếu voucher hết hạn trong lúc chờ
- **Precondition**:
  - Khách hàng đã áp mã `FLASHSALE` thành công lúc `23:59:50`.
  - Khách hàng chần chừ, đến `00:00:10` ngày hôm sau mới bấm nút "Đặt hàng".
- **Test Steps**:
  1. Nhấn nút "Đặt hàng".
- **Test Data**:
  - Thời điểm bấm Đặt hàng: Sau thời điểm hết hạn voucher.
- **Expected Result**:
  - Hệ thống re-validate thất bại, chặn tạo đơn hàng.
  - Hiển thị thông báo: "Mã giảm giá đã hết hạn sử dụng. Vui lòng kiểm tra lại đơn hàng".
  - Gỡ bỏ voucher khỏi đơn hàng.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#BR-22, Viewpoint#VP-06, Module#VCHR, Automated

---

### TC_ID: VCHR-040
- **Title**: Confirm tự động hoàn lại lượt dùng voucher cho tài khoản khi đơn hàng bị hủy
- **Precondition**:
  - Tài khoản `cust_cancel_01@shopgo.vn` đã đặt đơn hàng `ORD-9999` có áp mã `UNIQUE2026` (1 lần/user).
  - Đơn hàng đang ở trạng thái "Chờ xác nhận".
- **Test Steps**:
  1. Khách hàng nhấn "Hủy đơn hàng" và xác nhận lý do hủy.
  2. Tạo đơn hàng mới và nhập lại mã `UNIQUE2026`.
  3. Nhấn "Áp dụng".
- **Test Data**:
  - Mã: `UNIQUE2026`
- **Expected Result**:
  - Lượt dùng của mã `UNIQUE2026` được hoàn trả ngay khi hủy đơn thành công.
  - Ở đơn hàng mới, áp dụng mã `UNIQUE2026` thành công không bị báo lỗi đã sử dụng.
- **Priority**: High
- **Tags**: Rule#BR-08, Rule#BR-14, Viewpoint#VP-06, Module#VCHR, Manual

---

### TC_ID: VCHR-041
- **Title**: Confirm chiết khấu voucher chỉ trừ vào tiền hàng hóa, không làm thay đổi hoặc trừ vào phí ship
- **Precondition**:
  - Đơn hàng gồm tiền sản phẩm 500.000 VNĐ, phí vận chuyển 45.000 VNĐ.
  - Mã `VCH100K` giảm 100.000 VNĐ.
- **Test Steps**:
  1. Áp dụng mã `VCH100K`.
  2. Quan sát bảng tính tiền chi tiết.
- **Test Data**:
  - Tiền hàng: 500.000 VNĐ, Phí ship: 45.000 VNĐ, Voucher: 100.000 VNĐ.
- **Expected Result**:
  - Tiền hàng sau giảm: 400.000 VNĐ.
  - Phí ship giữ nguyên: 45.000 VNĐ.
  - Tổng thanh toán là: 445.000 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-12, Viewpoint#VP-06, Module#VCHR, Automated
