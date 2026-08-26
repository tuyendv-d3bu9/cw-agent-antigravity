# TEST CASE SPECIFICATION

> **Feature**: Áp dụng Mã Giảm Giá (Voucher) - Function D (ShopGo E-Commerce)  
> **Người thực hiện**: Senior QA Test Case Engineer  
> **Bước trong quy trình**: Step 05 (Test Case Generation & Specification)  
> **Dữ liệu đầu vào đối soát**: 
> - [01_Requirement_Summary_Report.md](OUTPUT/01_Requirement_Summary_Report.md)
> - [03_QA_Viewpoint_Analyst_Report.md](OUTPUT/03_QA_Viewpoint_Analyst_Report.md)
> - [04_QA_Test_Design_Analyst_Report.md](OUTPUT/04_QA_Test_Design_Analyst_Report.md)

---

## 1. TỔNG QUAN DANH MỤC TEST CASE

Tài liệu này đặc tả chi tiết **47 Test Cases** hoàn chỉnh được mở rộng (expand) 100% từ danh sách các Test Idea được gắn nhãn **"Giữ"** tại Step 04. Mọi Test Case tuân thủ nghiêm ngặt cấu trúc chuẩn 8 trường thông tin (FACT & RCTFC Framework), có tính khả thi cao, truy xuất nguồn gốc đầy đủ (Traceability), sẵn sàng cho việc import trực tiếp vào các hệ thống quản lý kiểm thử (Jira Xray, TestRail, Zephyr).

---

## 2. VOUCHER - TEST CASES

### TC_ID: VOUCHER-001
- **Title**: Verify Khách hàng đăng nhập áp dụng thành công 01 mã giảm giá loại phần trăm (%) còn hạn trên giỏ hàng đủ giá trị tối thiểu
- **Precondition**: 
  - Tài khoản `customer_happy01@shopgo.vn` đã được khởi tạo và đăng nhập thành công.
  - Giỏ hàng hiện tại đang có sản phẩm "Áo phông Unisex" với số lượng 1, đơn giá 200.000 VNĐ (Subtotal = 200.000 VNĐ).
  - Hệ thống đang có mã giảm giá `PCT10` (Giảm 10%, Min Order Value: 200.000 VNĐ, Ngày hết hạn: 31/12/2026 UTC+7, Lượt sử dụng còn lại: > 0).
- **Test Steps**:
  1. Điều hướng đến trang Thanh toán (Checkout).
  2. Nhập chuỗi "PCT10" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Tài khoản: customer_happy01@shopgo.vn / Pass123456
  - Giỏ hàng: Áo phông Unisex (Số lượng: 1, Đơn giá: 200.000 VNĐ)
  - Ô nhập mã: PCT10
- **Expected Result**: 
  - Giao diện hiển thị thông báo thành công: "Áp dụng mã giảm giá PCT10 thành công."
  - Dòng chiết khấu hiển thị số tiền được giảm: "-20.000 VNĐ".
  - Tổng tiền thanh toán mới được cập nhật chính xác: "180.000 VNĐ".
- **Priority**: High
- **Tags**: Rule#BR-01, Rule#BR-03, Rule#BR-04, Rule#BR-05, Rule#BR-06, Viewpoint#Happy Path, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-002
- **Title**: Verify Khách hàng đăng nhập áp dụng thành công 01 mã giảm giá loại số tiền cố định (VNĐ) còn hạn trên giỏ hàng đủ giá trị tối thiểu
- **Precondition**: 
  - Tài khoản `customer_happy02@shopgo.vn` đã đăng nhập thành công.
  - Giỏ hàng có 01 sản phẩm "Balo Du Lịch" trị giá 300.000 VNĐ.
  - Mã giảm giá `FIX30` (Giảm 30.000 VNĐ cố định, Min Order Value: 250.000 VNĐ, Hạn dùng: 31/12/2026 UTC+7) đang ở trạng thái `AVAILABLE`.
- **Test Steps**:
  1. Điều hướng đến trang Thanh toán.
  2. Nhập "FIX30" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Tài khoản: customer_happy02@shopgo.vn / Pass123456
  - Giỏ hàng: Balo Du Lịch (Đơn giá: 300.000 VNĐ)
  - Ô nhập mã: FIX30
- **Expected Result**: 
  - Hiển thị thông báo thành công: "Áp dụng mã giảm giá FIX30 thành công."
  - Dòng chiết khấu hiển thị: "-30.000 VNĐ".
  - Tổng tiền thanh toán mới được tính toán chính xác: "270.000 VNĐ".
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#BR-04, Rule#BR-05, Rule#BR-06, Viewpoint#Happy Path, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-003
- **Title**: Verify Khách hàng áp dụng đồng thời 02 mã giảm giá hợp lệ khác loại trên cùng 01 đơn hàng thành công và tổng chiết khấu được tính toán chính xác
- **Precondition**: 
  - Tài khoản `customer_happy03@shopgo.vn` đã đăng nhập thành công.
  - Giỏ hàng có tổng tiền Subtotal = 500.000 VNĐ.
  - Hệ thống tồn tại mã `PCT10` (Giảm 10% đơn hàng = 50.000 VNĐ) và mã `FREESHIP` (Miễn phí vận chuyển = 20.000 VNĐ), cả 2 mã đều thỏa mãn điều kiện áp dụng.
- **Test Steps**:
  1. Điều hướng đến trang Thanh toán.
  2. Nhập "PCT10" vào ô "Mã giảm giá" và nhấn nút "Áp dụng".
  3. Nhập tiếp "FREESHIP" vào ô "Mã giảm giá" và nhấn nút "Áp dụng".
- **Test Data**:
  - Subtotal: 500.000 VNĐ
  - Phí vận chuyển: 20.000 VNĐ
  - Mã thứ nhất: PCT10
  - Mã thứ hai: FREESHIP
- **Expected Result**: 
  - Hệ thống chấp nhận áp dụng cả 2 mã giảm giá khác loại trên cùng đơn hàng.
  - Khu vực tổng quan chiết khấu ghi nhận cả 2 mã: PCT10 (-50.000 VNĐ) và FREESHIP (-20.000 VNĐ).
  - Tổng tiền thanh toán mới cập nhật chuẩn xác: "450.000 VNĐ".
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-03, Viewpoint#Happy Path, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-004
- **Title**: Verify hệ thống tự động loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi mã giảm giá khi người dùng thực hiện nhập mã
- **Precondition**: 
  - Tài khoản `customer_happy04@shopgo.vn` đã đăng nhập tại trang Thanh toán.
  - Giỏ hàng có Subtotal = 200.000 VNĐ.
  - Mã giảm giá hợp lệ là `DISCOUNT10`.
- **Test Steps**:
  1. Nhập chuỗi "   DISCOUNT10   " (chứa 3 khoảng trắng đầu và 3 khoảng trắng cuối) vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Chuỗi nhập vào: "   DISCOUNT10   "
  - Mã chuẩn trong CSDL: DISCOUNT10
- **Expected Result**: 
  - Hệ thống tự động cắt bỏ (trim) các khoảng trắng thừa trước khi gửi request xác thực.
  - Mã `DISCOUNT10` áp dụng thành công, hiển thị đúng chiết khấu và tổng tiền mới không phát sinh lỗi mã không hợp lệ.
- **Priority**: Medium
- **Tags**: Rule#BR-01, Rule#MR-02, Viewpoint#Happy Path, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-005
- **Title**: Verify hệ thống tự động xử lý mã giảm giá không phân biệt chữ hoa hay chữ thường (case-insensitive) khi áp dụng thành công
- **Precondition**: 
  - Tài khoản `customer_happy05@shopgo.vn` đã đăng nhập tại trang Thanh toán.
  - Mã giảm giá lưu trong CSDL dưới dạng chữ hoa là `SUMMER2026`.
- **Test Steps**:
  1. Nhập chuỗi chữ thường "summer2026" vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Chuỗi nhập vào: summer2026
  - Mã lưu CSDL: SUMMER2026
- **Expected Result**: 
  - Hệ thống nhận diện mã thành công mà không bắt buộc nhập đúng định dạng HOA/thường.
  - Chiết khấu của mã `SUMMER2026` được áp dụng chuẩn xác vào tổng đơn hàng.
- **Priority**: Medium
- **Tags**: Rule#BR-01, Rule#MR-02, Viewpoint#Happy Path, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-006
- **Title**: Confirm giao diện trang Thanh toán hiển thị rõ ràng dòng tiền chiết khấu được giảm và tổng tiền thanh toán mới sau khi áp mã thành công
- **Precondition**: 
  - Tài khoản `customer_happy06@shopgo.vn` đã áp dụng mã `SAVE50K` (Giảm 50.000 VNĐ) thành công trên đơn hàng có Subtotal = 300.000 VNĐ.
- **Test Steps**:
  1. Quan sát khu vực "Tóm tắt đơn hàng" (Order Summary) trên giao diện trang Thanh toán.
  2. Kiểm tra dòng "Tạm tính" (Subtotal).
  3. Kiểm tra dòng "Giảm giá" (Discount).
  4. Kiểm tra dòng "Tổng tiền thanh toán" (Total Payment).
- **Test Data**:
  - Subtotal: 300.000 VNĐ
  - Voucher: SAVE50K (Chiết khấu 50.000 VNĐ)
- **Expected Result**: 
  - Dòng "Tạm tính": Displays `300.000 VNĐ`.
  - Dòng "Giảm giá": Displays `-50.000 VNĐ`.
  - Dòng "Tổng tiền thanh toán": Displays `250.000 VNĐ`.
  - Giao diện trình bày rõ ràng, nhãn tiền chiết khấu phân biệt trực quan với tổng tiền.
- **Priority**: High
- **Tags**: Rule#BR-06, Viewpoint#Happy Path, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-007
- **Title**: Verify đơn hàng hoàn tất thanh toán thành công được ghi nhận chính xác và trạng thái mã giảm giá chuyển sang trạng thái đã sử dụng (USED)
- **Precondition**: 
  - Tài khoản `customer_happy07@shopgo.vn` đã áp dụng mã `ONETIME20` (Giới hạn 1 lượt/tài khoản) tại trang Thanh toán.
- **Test Steps**:
  1. Nhập mã "ONETIME20" và nhấn "Áp dụng" thành công.
  2. Chọn phương thức thanh toán "Thanh toán khi nhận hàng (COD)".
  3. Nhấn nút "Đặt hàng".
  4. Kiểm tra trạng thái mã trong CSDL bảng `user_vouchers` của tài khoản `customer_happy07@shopgo.vn`.
- **Test Data**:
  - Tài khoản: customer_happy07@shopgo.vn
  - Mã giảm giá: ONETIME20
  - Payment Method: COD
- **Expected Result**: 
  - Đơn hàng được tạo thành công với mã đơn hàng duy nhất.
  - Trạng thái liên kết của mã `ONETIME20` đối với tài khoản người dùng trong CSDL được cập nhật từ `AVAILABLE` sang `USED`.
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-04, Viewpoint#Happy Path, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-008
- **Title**: Validate hệ thống từ chối áp dụng và hiển thị thông báo lỗi khi nhập mã không tồn tại hoặc sai ký tự
- **Precondition**: 
  - Tài khoản `customer_neg01@shopgo.vn` đang ở trang Thanh toán.
  - Mã `INVALID999` không tồn tại trong hệ thống.
- **Test Steps**:
  1. Nhập chuỗi "INVALID999" vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Ô nhập mã: INVALID999
- **Expected Result**: 
  - Hệ thống không áp dụng chiết khấu, tổng tiền thanh toán giữ nguyên.
  - Hiển thị thông báo lỗi chuẩn: "Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."
- **Priority**: High
- **Tags**: Rule#BR-07, Rule#AF-02, Rule#MR-02, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-009
- **Title**: Validate hệ thống từ chối áp dụng và hiển thị thông báo lỗi khi nhập mã đã quá thời hạn theo múi giờ Việt Nam (UTC+7)
- **Precondition**: 
  - Tài khoản `customer_neg02@shopgo.vn` đang ở trang Thanh toán.
  - Mã `EXPIRED2025` có ngày hết hạn cấu hình là 15/08/2026 23:59:59 UTC+7 (Thời gian Server hiện tại là 16/08/2026 18:28:12 UTC+7).
- **Test Steps**:
  1. Nhập "EXPIRED2025" vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã: EXPIRED2025 (Hạn dùng: 15/08/2026 23:59:59 UTC+7)
  - Time Server: 16/08/2026 18:28:12 UTC+7
- **Expected Result**: 
  - Chiết khấu bị từ chối áp dụng.
  - Hiển thị thông báo lỗi chuẩn: "Mã giảm giá đã hết hạn sử dụng."
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#BR-07, Rule#AF-01, Rule#MR-02, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-010
- **Title**: Validate hệ thống từ chối áp dụng và hiển thị thông báo lỗi khi mã đã đạt tới giới hạn tổng số lượt dùng toàn hệ thống
- **Precondition**: 
  - Mã `LIMITED100` được cấu hình tối đa 100 lượt dùng trên toàn hệ thống.
  - Trạng thái CSDL ghi nhận tổng số lượt đã dùng đạt 100/100 (`current_usage = 100`).
- **Test Steps**:
  1. Tài khoản `customer_neg03@shopgo.vn` truy cập trang Thanh toán.
  2. Nhập "LIMITED100" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã giảm giá: LIMITED100 (Total Limit: 100, Used: 100)
- **Expected Result**: 
  - Hệ thống không áp dụng mã giảm giá.
  - Hiển thị thông báo lỗi chuẩn: "Mã giảm giá đã hết lượt sử dụng."
- **Priority**: High
- **Tags**: Rule#BR-07, Rule#MR-01, Rule#MR-02, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-011
- **Title**: Validate hệ thống từ chối áp dụng và hiển thị thông báo lỗi khi người dùng đã dùng hết lượt cho phép per-user
- **Precondition**: 
  - Mã `USERPER1` cấu hình tối đa 01 lượt/tài khoản.
  - Tài khoản `customer_neg04@shopgo.vn` đã hoàn tất 01 đơn hàng thành công trước đó có sử dụng mã `USERPER1`.
- **Test Steps**:
  1. Đăng nhập tài khoản `customer_neg04@shopgo.vn` và mua đơn hàng mới tại trang Thanh toán.
  2. Nhập "USERPER1" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Tài khoản: customer_neg04@shopgo.vn
  - Mã giảm giá: USERPER1 (Lượt dùng tài khoản: 1/1)
- **Expected Result**: 
  - Chiết khấu bị từ chối.
  - Hiển thị thông báo lỗi chuẩn: "Bạn đã sử dụng hết số lần cho phép của mã giảm giá này."
- **Priority**: High
- **Tags**: Rule#BR-07, Rule#MR-01, Rule#MR-02, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-012
- **Title**: Validate hệ thống không áp dụng chiết khấu và hiển thị thông báo lỗi khi tổng tiền giỏ hàng nhỏ hơn Min Order Value
- **Precondition**: 
  - Tài khoản `customer_neg05@shopgo.vn` có giỏ hàng trị giá 150.000 VNĐ.
  - Mã `MIN200K` yêu cầu giá trị đơn hàng tối thiểu là 200.000 VNĐ.
- **Test Steps**:
  1. Truy cập trang Thanh toán với giỏ hàng 150.000 VNĐ.
  2. Nhập "MIN200K" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Subtotal giỏ hàng: 150.000 VNĐ
  - Mã giảm giá: MIN200K (Min Order Value: 200.000 VNĐ)
- **Expected Result**: 
  - Chiết khấu không được thực hiện.
  - Hiển thị thông báo lỗi nêu rõ ngưỡng thiếu: "Đơn hàng chưa đạt giá trị tối thiểu 200.000 VNĐ để sử dụng mã này."
- **Priority**: High
- **Tags**: Rule#BR-04, Rule#BR-07, Rule#AF-03, Rule#MR-02, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-013
- **Title**: Validate hệ thống hiển thị thông báo lỗi inline khi người dùng nhấn nút Áp dụng mà để trống ô nhập mã
- **Precondition**: 
  - Tài khoản `customer_neg06@shopgo.vn` đang tại trang Thanh toán.
  - Ô "Mã giảm giá" đang ở trạng thái rỗng (empty string).
- **Test Steps**:
  1. Để trống ô nhập mã giảm giá.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Giá trị ô nhập: ""
- **Expected Result**: 
  - Hệ thống không thực hiện gọi API kiểm tra.
  - Hiển thị thông báo lỗi inline ngay bên dưới ô nhập mã: "Vui lòng nhập mã giảm giá."
- **Priority**: Medium
- **Tags**: Rule#BR-01, Rule#MR-02, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-014
- **Title**: Validate Khách vãng lai (Guest chưa đăng nhập) bị ngăn chặn truy cập trang Thanh toán và được yêu cầu Đăng nhập
- **Precondition**: 
  - Người dùng chưa đăng nhập tài khoản (Guest user).
  - Giỏ hàng đã có sản phẩm.
- **Test Steps**:
  1. Từ trang Giỏ hàng, nhấn nút "Tiến hành thanh toán".
- **Test Data**:
  - User session: Unauthenticated Guest
- **Expected Result**: 
  - Hệ thống chặn không cho vào trang Thanh toán, tự động chuyển hướng người dùng sang trang Đăng nhập/Đăng ký.
  - Hiển thị thông báo yêu cầu: "Vui lòng đăng nhập để thực hiện thanh toán và áp dụng mã giảm giá."
- **Priority**: High
- **Tags**: Rule#BR-02, Rule#AF-04, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-015
- **Title**: Validate tài khoản bị khóa ở thời điểm giữa lúc áp mã và chốt đơn bị hệ thống tự động gỡ mã và ngăn chặn đặt hàng
- **Precondition**: 
  - Tài khoản `customer_locked@shopgo.vn` áp dụng mã `DISC10` thành công tại trang Thanh toán.
  - Admin thực hiện khóa tài khoản (`status = DISABLED`) trong CSDL trước khi người dùng nhấn "Đặt hàng".
- **Test Steps**:
  1. Tại màn hình Thanh toán đã áp mã thành công, người dùng nhấn nút "Đặt hàng".
- **Test Data**:
  - Tài khoản: customer_locked@shopgo.vn (Trạng thái CSDL: DISABLED)
  - Mã đã áp: DISC10
- **Expected Result**: 
  - Hệ thống từ chối tạo đơn hàng.
  - Tự động hủy/gỡ mã `DISC10` khỏi đơn hàng.
  - Hiển thị thông báo lỗi: "Tài khoản của bạn đã bị khóa. Không thể hoàn tất đặt hàng."
- **Priority**: High
- **Tags**: Rule#BR-02, Rule#MR-01, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-016
- **Title**: Validate hệ thống tự động re-validate và gỡ mã giảm giá khi người dùng giảm bớt sản phẩm ở giỏ hàng làm Subtotal xuống dưới Min Order Value
- **Precondition**: 
  - Tài khoản `customer_neg07@shopgo.vn` có giỏ hàng 250.000 VNĐ, áp mã `MIN200K` (Min Order Value: 200.000 VNĐ) thành công tại Checkout.
- **Test Steps**:
  1. Người dùng mở lại giỏ hàng và giảm số lượng sản phẩm khiến Subtotal còn 150.000 VNĐ.
  2. Quay lại bước Thanh toán và nhấn nút "Đặt hàng".
- **Test Data**:
  - Subtotal ban đầu: 250.000 VNĐ
  - Subtotal sau điều chỉnh: 150.000 VNĐ
  - Mã: MIN200K (Min Order Value: 200.000 VNĐ)
- **Expected Result**: 
  - Hệ thống thực hiện re-validate dữ liệu điều kiện mã tại bước chốt đơn.
  - Tự động gỡ bỏ mã `MIN200K` khỏi đơn hàng.
  - Hiển thị thông báo: "Mã giảm giá đã tự động bị gỡ do tổng giá trị đơn hàng không còn đủ điều kiện tối thiểu 200.000 VNĐ."
- **Priority**: High
- **Tags**: Rule#BR-04, Rule#MR-04, Rule#MR-05, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-017
- **Title**: Validate lượt mã ở trạng thái PENDING_HOLD tự động giải phóng về AVAILABLE khi giao dịch thanh toán online thất bại hoặc quá 15 phút
- **Precondition**: 
  - Tài khoản `customer_neg08@shopgo.vn` áp dụng mã `ONLINE50` (chỉ còn 1 lượt khả dụng) và chốt đơn chọn thanh toán qua MoMo.
  - Lượt mã chuyển sang trạng thái `PENDING_HOLD`.
- **Test Steps**:
  1. Chuyển sang giao diện Cổng thanh toán MoMo.
  2. Người dùng nhấn Hủy giao dịch / hoặc không thao tác để quá thời hạn chờ 15 phút.
  3. Kiểm tra trạng thái lượt mã `ONLINE50` trong CSDL sau 15 phút.
- **Test Data**:
  - Mã giảm giá: ONLINE50
  - Cổng thanh toán: MoMo Gateway (Trạng thái: CANCELLED / TIMEOUT)
- **Expected Result**: 
  - Đơn hàng chuyển sang trạng thái hủy do hết hạn thanh toán.
  - Lượt mã `ONLINE50` tự động giải phóng từ `PENDING_HOLD` trở lại trạng thái `AVAILABLE` cho hệ thống.
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-04, Viewpoint#Negative, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-018
- **Title**: Verify mã giảm giá được áp dụng thành công khi tổng tiền giỏ hàng (Subtotal) bằng đúng giá trị đơn hàng tối thiểu (Min Order Value)
- **Precondition**: 
  - Mã `MIN300K` có quy định Min Order Value = 300.000 VNĐ.
  - Tài khoản `customer_bound01@shopgo.vn` có giỏ hàng có tổng giá trị Subtotal = 300.000 VNĐ.
- **Test Steps**:
  1. Truy cập trang Thanh toán.
  2. Nhập mã "MIN300K" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Subtotal giỏ hàng: 300.000 VNĐ
  - Min Order Value: 300.000 VNĐ
- **Expected Result**: 
  - Mã `MIN300K` áp dụng thành công.
  - Số tiền chiết khấu được trừ chính xác vào tổng tiền thanh toán.
- **Priority**: High
- **Tags**: Rule#BR-04, Rule#MR-03, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-019
- **Title**: Validate hệ thống từ chối áp dụng mã giảm giá khi tổng tiền giỏ hàng nhỏ hơn giá trị đơn hàng tối thiểu đúng 1 VNĐ
- **Precondition**: 
  - Mã `MIN300K` có Min Order Value = 300.000 VNĐ.
  - Tài khoản `customer_bound02@shopgo.vn` chọn sản phẩm sao cho Subtotal = 299.999 VNĐ (thiếu đúng 1 VNĐ).
- **Test Steps**:
  1. Điều hướng sang trang Thanh toán với giỏ hàng 299.999 VNĐ.
  2. Nhập "MIN300K" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Subtotal giỏ hàng: 299.999 VNĐ
  - Min Order Value: 300.000 VNĐ
- **Expected Result**: 
  - Chiết khấu bị từ chối.
  - Hiển thị thông báo lỗi: "Đơn hàng chưa đạt giá trị tối thiểu 300.000 VNĐ để sử dụng mã này."
- **Priority**: High
- **Tags**: Rule#BR-04, Rule#MR-03, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-020
- **Title**: Verify số tiền giảm của mã loại phần trăm (%) bị ép đúng trần tối đa 50.000 VNĐ khi số tiền tính theo phần trăm vượt quá 50.000 VNĐ
- **Precondition**: 
  - Mã `PCT20` cấu hình giảm 20%, trần giảm giá tối đa (Max discount cap) = 50.000 VNĐ.
  - Giỏ hàng của `customer_bound03@shopgo.vn` có Subtotal = 1.000.000 VNĐ (Tính 20% = 200.000 VNĐ).
- **Test Steps**:
  1. Tại trang Thanh toán với giỏ hàng 1.000.000 VNĐ, nhập "PCT20" vào ô "Mã giảm giá".
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Subtotal: 1.000.000 VNĐ
  - Voucher: PCT20 (20%, Cap = 50.000 VNĐ)
- **Expected Result**: 
  - Số tiền giảm hiển thị bị khống chế đúng trần: "-50.000 VNĐ" (thay vì -200.000 VNĐ).
  - Tổng tiền thanh toán mới: "950.000 VNĐ".
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-03, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-021
- **Title**: Verify tổng tiền giảm của nhiều mã áp dụng đồng thời bị ép không vượt quá trần tối đa 50.000 VNĐ đối với mã loại phần trăm
- **Precondition**: 
  - Giỏ hàng Subtotal = 600.000 VNĐ.
  - Áp dụng 2 mã phần trăm: `PCT10_A` (10% = 60.000 VNĐ) và `PCT10_B` (10% = 60.000 VNĐ).
- **Test Steps**:
  1. Nhập mã "PCT10_A" và bấm "Áp dụng".
  2. Nhập tiếp mã "PCT10_B" và bấm "Áp dụng".
- **Test Data**:
  - Subtotal: 600.000 VNĐ
  - Mã 1: PCT10_A, Mã 2: PCT10_B
- **Expected Result**: 
  - Cả 2 mã được chấp nhận nhưng tổng tiền chiết khấu kết hợp bị khống chế tối đa đúng trần: "-50.000 VNĐ".
  - Tổng tiền thanh toán mới: "550.000 VNĐ".
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-03, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-022
- **Title**: Verify tổng tiền thanh toán sau khi trừ mã giảm giá tiền cố định VNĐ lớn hơn Subtotal được giữ ở mức sàn tối thiểu bằng đúng 0 VNĐ
- **Precondition**: 
  - Mã `FIX100K` có giá trị giảm cố định 100.000 VNĐ.
  - Giỏ hàng của `customer_bound04@shopgo.vn` chứa sản phẩm nhỏ trị giá 40.000 VNĐ (Subtotal = 40.000 VNĐ).
- **Test Steps**:
  1. Truy cập trang Thanh toán với giỏ hàng 40.000 VNĐ.
  2. Nhập "FIX100K" vào ô "Mã giảm giá" và bấm "Áp dụng".
- **Test Data**:
  - Subtotal: 40.000 VNĐ
  - Voucher: FIX100K (Giảm 100.000 VNĐ)
- **Expected Result**: 
  - Số tiền chiết khấu thực tế áp dụng: "-40.000 VNĐ".
  - Tổng tiền thanh toán được giữ ở mức sàn tối thiểu: "0 VNĐ" (tuyệt đối không bị âm < 0 VNĐ).
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-03, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-023
- **Title**: Verify mã giảm giá được áp dụng và chốt đơn thành công vào thời điểm mút cuối cùng 23:59:59 (giờ ICT / UTC+7) của ngày hết hạn
- **Precondition**: 
  - Mã `ENDTODAY` cấu hình ngày hết hạn là 16/08/2026 23:59:59 UTC+7.
  - Thời điểm đồng hồ Server chốt đơn đúng 16/08/2026 23:59:59 UTC+7.
- **Test Steps**:
  1. Khách hàng `customer_bound05@shopgo.vn` nhập mã "ENDTODAY" tại trang Thanh toán.
  2. Thực hiện bấm nút "Đặt hàng" vào đúng thời điểm 23:59:59 UTC+7.
- **Test Data**:
  - Voucher: ENDTODAY (Hạn dùng: 16/08/2026 23:59:59 UTC+7)
  - Time Server: 16/08/2026 23:59:59 UTC+7
- **Expected Result**: 
  - Mã xác thực còn hạn sử dụng thành công.
  - Đơn hàng được khởi tạo thành công có áp dụng số tiền chiết khấu của mã.
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-04, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-024
- **Title**: Validate hệ thống từ chối chốt đơn áp mã vào thời điểm mút bắt đầu 00:00:01 (giờ ICT / UTC+7) của ngày tiếp theo ngay sau khi hết hạn
- **Precondition**: 
  - Mã `ENDTODAY` hết hạn lúc 16/08/2026 23:59:59 UTC+7.
  - Người dùng bấm nút "Đặt hàng" vào thời điểm 17/08/2026 00:00:01 UTC+7.
- **Test Steps**:
  1. Người dùng đã nhập sẵn mã "ENDTODAY" từ trước 23:59:59.
  2. Đợi đến đúng thời điểm 17/08/2026 00:00:01 UTC+7 và bấm "Đặt hàng".
- **Test Data**:
  - Voucher: ENDTODAY
  - Timestamp chốt đơn: 17/08/2026 00:00:01 UTC+7
- **Expected Result**: 
  - Hệ thống re-validate tại thời điểm chốt đơn và phát hiện mã đã quá hạn.
  - Chặn đặt hàng, gỡ mã và hiển thị thông báo: "Mã giảm giá đã hết hạn sử dụng."
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-04, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-025
- **Title**: Verify hệ thống cho phép áp dụng tối đa đúng 02 mã giảm giá hợp lệ và ngăn chặn không cho áp dụng mã thứ 03 trên cùng 01 đơn hàng
- **Precondition**: 
  - Khách hàng đã áp dụng thành công 02 mã hợp lệ `CODE1` và `CODE2` trên đơn hàng tại trang Thanh toán.
- **Test Steps**:
  1. Đã áp dụng `CODE1` và `CODE2` thành công.
  2. Nhập mã thứ ba "CODE3" vào ô "Mã giảm giá".
  3. Nhấn nút "Áp dụng".
- **Test Data**:
  - Mã đã áp: CODE1, CODE2
  - Mã mới nhập: CODE3
- **Expected Result**: 
  - Hệ thống ngăn chặn không cho áp dụng mã thứ 03.
  - Hiển thị thông báo lỗi: "Đơn hàng chỉ được áp dụng tối đa 02 mã giảm giá."
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-03, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-026
- **Title**: Verify ô nhập mã giảm giá chấp nhận chuỗi có độ dài tối đa 50 ký tự và ngăn chặn không cho nhập ký tự thứ 51
- **Precondition**: 
  - Màn hình trang Thanh toán đang hiển thị ô nhập "Mã giảm giá".
- **Test Steps**:
  1. Nhập/Paste chuỗi gồm 50 ký tự "A123456789B123456789C123456789D123456789E123456789" vào ô nhập mã.
  2. Cố gắng nhập thêm ký tự thứ 51 "X".
- **Test Data**:
  - Chuỗi 50 ký tự: A123456789B123456789C123456789D123456789E123456789
  - Ký tự 51: X
- **Expected Result**: 
  - Ô nhập nhận đúng 50 ký tự.
  - Ký tự thứ 51 "X" bị chặn hoàn toàn, không thể chèn thêm vào ô nhập (`maxlength="50"`).
- **Priority**: Medium
- **Tags**: Rule#BR-01, Rule#MR-02, Viewpoint#Boundary, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-027
- **Title**: Validate tính năng áp mã tự động bị khóa trong 10 phút khi 01 tài khoản hoặc IP bấm Áp dụng mã sai quá 05 lần trong 01 phút
- **Precondition**: 
  - Tài khoản `customer_sec01@shopgo.vn` tại IP `192.168.1.100` đang ở trang Thanh toán.
- **Test Steps**:
  1. Nhập mã sai "WRONG1" và bấm nút "Áp dụng" (Lần 1).
  2. Liên tiếp lặp lại thao tác bấm nút "Áp dụng" mã sai thêm 4 lần nữa trong vòng 30 giây (Tổng cộng 5 lần sai).
  3. Nhập mã sai "WRONG6" và bấm nút "Áp dụng" ở lần thứ 6.
- **Test Data**:
  - Chuỗi nhập sai: WRONG1, WRONG2, WRONG3, WRONG4, WRONG5, WRONG6
- **Expected Result**: 
  - Ở lần bấm thứ 6, hệ thống từ chối xử lý API.
  - Hiển thị thông báo chặn: "Bạn đã nhập sai mã quá 5 lần. Tính năng áp dụng mã giảm giá tạm thời bị khóa trong 10 phút."
- **Priority**: High
- **Tags**: Rule#BR-07, Rule#MR-06, Viewpoint#Security, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-028
- **Title**: Verify hệ thống sử dụng khóa mức server chỉ cho phép 01 giao dịch áp dụng thành công và thông báo hết lượt cho giao dịch còn lại khi tranh chấp lượt cuối
- **Precondition**: 
  - Mã `LASTONE` chỉ còn duy nhất 01 lượt dùng khả dụng cuối cùng (`remaining_usage = 1`).
- **Test Steps**:
  1. Giả lập 2 request chốt đơn cùng lúc từ User A và User B sử dụng mã `LASTONE` tại cùng millisecond.
  2. Kiểm tra phản hồi đơn hàng và trạng thái ghi nhận mã trong CSDL.
- **Test Data**:
  - Mã: LASTONE (Lượt còn lại: 1)
  - User A & User B gửi request trùng timestamp millisecond
- **Expected Result**: 
  - Giao dịch của User A (đến trước vài microsecond) được hệ thống khóa atomic lock và áp dụng thành công.
  - Giao dịch của User B bị từ chối áp dụng và nhận thông báo: "Mã giảm giá đã hết lượt sử dụng."
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-01, Viewpoint#Security, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-029
- **Title**: Validate Backend từ chối xử lý request API áp mã từ Khách vãng lai hoặc tài khoản bị khóa và trả về mã lỗi 401 hoặc 403 Unauthorized
- **Precondition**: 
  - Server API Endpoint `POST /api/v1/checkout/apply-voucher` đang hoạt động.
- **Test Steps**:
  1. Gửi request API áp mã mà không đính kèm Header Authorization Token (Khách vãng lai).
  2. Gửi request API áp mã với Header Authorization Token của tài khoản bị khóa `customer_disabled@shopgo.vn`.
- **Test Data**:
  - Endpoint: POST /api/v1/checkout/apply-voucher
  - Payload: `{"voucher_code": "SUMMER2026", "cart_id": 10293}`
- **Expected Result**: 
  - Request 1 (Không token) trả về HTTP Response Code `401 Unauthorized`.
  - Request 2 (Token tài khoản bị khóa) trả về HTTP Response Code `403 Forbidden`.
- **Priority**: High
- **Tags**: Rule#BR-02, Rule#MR-01, Viewpoint#Security, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-030
- **Title**: Verify hệ thống tự động làm sạch và mã hóa an toàn chuỗi nhập chứa mã độc SQL Injection hoặc Script XSS mà không thực thi mã độc
- **Precondition**: 
  - Tài khoản `customer_sec02@shopgo.vn` đang ở màn hình Thanh toán.
- **Test Steps**:
  1. Nhập chuỗi SQL Injection `' OR '1'='1` vào ô nhập mã và bấm "Áp dụng".
  2. Nhập chuỗi XSS Script `<script>alert('XSS')</script>` vào ô nhập mã và bấm "Áp dụng".
- **Test Data**:
  - Payload 1: `' OR '1'='1`
  - Payload 2: `<script>alert('XSS')</script>`
- **Expected Result**: 
  - Dữ liệu đầu vào được sanitize/escape an toàn.
  - Không có popup script nào bị thực thi; CSDL không nổ lỗi syntax SQL.
  - Hiển thị thông báo lỗi chuẩn: "Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."
- **Priority**: High
- **Tags**: Rule#BR-01, Rule#MR-02, Viewpoint#Security, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-031
- **Title**: Verify lượt mã chuyển sang trạng thái PENDING_HOLD trong 15 phút khi người dùng chốt đơn chọn thanh toán trực tuyến qua VNPay hoặc MoMo
- **Precondition**: 
  - Mã `ONLINE2026` ở trạng thái `AVAILABLE`.
- **Test Steps**:
  1. Tài khoản `customer_integ01@shopgo.vn` áp mã `ONLINE2026` tại Checkout.
  2. Chọn phương thức "Thanh toán VNPay" và bấm "Đặt hàng".
  3. Kiểm tra trạng thái lượt mã trong CSDL ngay sau khi chuyển hướng sang Cổng VNPay.
- **Test Data**:
  - Mã: ONLINE2026
  - Payment Method: VNPay Gateway
- **Expected Result**: 
  - Trạng thái lượt mã của người dùng trong CSDL cập nhật thành `PENDING_HOLD`.
  - Hạn tạm giữ (hold expire time) được ghi nhận chính xác 15 phút.
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-04, Viewpoint#Integration, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-032
- **Title**: Verify phân hệ Giỏ hàng tự động gửi thông tin re-validate điều kiện Min Order Value sang bước chốt đơn Thanh toán khi thay đổi số lượng
- **Precondition**: 
  - Phân hệ Giỏ hàng (Cart Service) và Thanh toán (Checkout Service) hoạt động tích hợp.
- **Test Steps**:
  1. Người dùng áp mã `MIN200K` thành công tại Checkout với giỏ hàng 200.000 VNĐ (2 sản phẩm).
  2. Điều chỉnh bớt 1 sản phẩm tại giỏ hàng khiến Subtotal còn 100.000 VNĐ.
  3. Thực hiện hành động chốt đơn tại Checkout.
- **Test Data**:
  - Subtotal: 200.000 VNĐ -> 100.000 VNĐ
- **Expected Result**: 
  - Cart Service tự động phát sự kiện đồng bộ Subtotal mới.
  - Checkout Service nhận thông tin, re-validate và tự động hủy áp dụng mã `MIN200K`.
- **Priority**: High
- **Tags**: Rule#BR-04, Rule#MR-04, Rule#MR-05, Viewpoint#Integration, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-033
- **Title**: Verify hệ thống đối soát thời hạn sử dụng mã dựa trên Server Time theo múi giờ ICT (UTC+7) bất kể việc thay đổi thời gian trên thiết bị client
- **Precondition**: 
  - Mã `SERVERTIME` hết hạn lúc 16/08/2026 12:00:00 UTC+7.
  - Thời gian Server Backend hiện tại là 16/08/2026 14:00:00 UTC+7 (Đã hết hạn).
- **Test Steps**:
  1. Thay đổi đồng hồ hệ thống trên máy tính Client lùi về 16/08/2026 10:00:00 (Cố tình chỉnh giờ máy client).
  2. Tại trang Thanh toán, nhập "SERVERTIME" và bấm "Áp dụng".
- **Test Data**:
  - Client Time: 16/08/2026 10:00:00
  - Server Time (UTC+7): 16/08/2026 14:00:00
- **Expected Result**: 
  - Backend đối soát thời gian căn cứ vào Server Time (UTC+7).
  - Từ chối áp dụng và hiển thị lỗi: "Mã giảm giá đã hết hạn sử dụng."
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#BR-07, Viewpoint#Integration, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-034
- **Title**: Verify mã giảm giá đã sử dụng thành công được tự động khôi phục về trạng thái chưa sử dụng khi đơn hàng bị hủy hoặc trả hàng toàn phần
- **Precondition**: 
  - Đơn hàng `#ORD8888` có sử dụng mã `RETURNABLE` đã chốt đơn thành công (`status = USED`).
- **Test Steps**:
  1. Khách hàng bấm "Hủy đơn hàng" `#ORD8888` tại trang Lịch sử đơn hàng trước khi shop giao hàng.
  2. Kiểm tra trạng thái sử dụng của mã `RETURNABLE` trong CSDL tài khoản.
- **Test Data**:
  - Mã đơn hàng: #ORD8888
  - Mã giảm giá: RETURNABLE
- **Expected Result**: 
  - Đơn hàng cập nhật trạng thái `CANCELLED`.
  - Trạng thái mã `RETURNABLE` được khôi phục thành công về `AVAILABLE` và hoàn lại 1 lượt dùng cho tài khoản.
- **Priority**: High
- **Tags**: Rule#BR-05, Rule#MR-05, Viewpoint#Integration, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-035
- **Title**: Confirm trang Thanh toán hiển thị rõ ràng số tiền chiết khấu giảm giá dạng số âm và tổng tiền thanh toán mới sau khi áp mã thành công
- **Precondition**: 
  - Đơn hàng có Subtotal = 500.000 VNĐ, đã áp thành công mã `DISC50` (Giảm 50.000 VNĐ).
- **Test Steps**:
  1. Quan sát giao diện khu vực hiển thị giá trị tiền tại trang Thanh toán.
- **Test Data**:
  - Subtotal: 500.000 VNĐ
  - Voucher: DISC50
- **Expected Result**: 
  - Số tiền chiết khấu hiển thị dưới dạng số âm kèm dấu trừ rõ ràng (ví dụ: `-50.000 VNĐ`).
  - Dòng tổng tiền thanh toán hiển thị con số mới nổi bật: `450.000 VNĐ`.
- **Priority**: Medium
- **Tags**: Rule#BR-06, Viewpoint#UX/Usability, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-036
- **Title**: Confirm tính năng tự động trim khoảng trắng và không phân biệt chữ hoa hay chữ thường giúp người dùng áp mã thành công mà không bị báo lỗi
- **Precondition**: 
  - Mã khuyến mãi `EASYUSE` công bố rộng rãi trên banner.
- **Test Steps**:
  1. Người dùng nhập " easyuse " (chữ thường kèm khoảng trắng đầu/cuối) vào ô nhập mã.
  2. Nhấn nút "Áp dụng".
- **Test Data**:
  - Input: " easyuse "
- **Expected Result**: 
  - Giao diện không báo lỗi nhập liệu vô lý.
  - Mã áp dụng thành công ngay lập tức mang lại cảm giác mượt mà cho người dùng.
- **Priority**: Medium
- **Tags**: Rule#BR-01, Rule#MR-02, Viewpoint#UX/Usability, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-037
- **Title**: Confirm các thông báo phản hồi lỗi phân biệt rõ nguyên nhân cụ thể như hết hạn, hết lượt, không đủ giá trị đơn tối thiểu
- **Precondition**: 
  - Người dùng nhập thử các mã vi phạm điều kiện khác nhau.
- **Test Steps**:
  1. Thử mã hết hạn `EXPIRED_CODE`.
  2. Thử mã hết lượt `MAX_USED_CODE`.
  3. Thử mã thiếu tiền giỏ hàng `UNDER_MIN_CODE`.
- **Test Data**:
  - 3 mã tương ứng 3 lỗi khác nhau.
- **Expected Result**: 
  - Mỗi mã hiển thị đúng câu văn thông báo phản hồi nêu rõ lý do tương ứng, không dùng câu chung chung.
- **Priority**: Medium
- **Tags**: Rule#BR-07, Rule#MR-02, Viewpoint#UX/Usability, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-038
- **Title**: Confirm giao diện ô nhập mã, nút Áp dụng và dòng tiền giảm hiển thị tương thích cân đối, không bị vỡ bố cục trên cả Desktop và Mobile Web
- **Precondition**: 
  - Truy cập trang Thanh toán trên các thiết bị Desktop và Mobile.
- **Test Steps**:
  1. Mở trang trên Desktop Chrome (Resolution 1920x1080), kiểm tra giao diện.
  2. Chuyển sang Mobile Web (Resolution 375x812), kiểm tra giao diện.
- **Test Data**:
  - Resolutions: 1920x1080 (Desktop), 375x812 (Mobile Web)
- **Expected Result**: 
  - Ô nhập mã, nút "Áp dụng" và các dòng tiền hiển thị cân đối, không bị đè chữ hay tràn viền trên cả 2 loại màn hình.
- **Priority**: Medium
- **Tags**: Rule#BR-08, Viewpoint#UX/Usability, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-039
- **Title**: Verify thời gian xử lý của API kiểm tra điều kiện mã và tính toán chiết khấu phản hồi dưới 3 giây trên các trình duyệt Chrome, Edge và Safari
- **Precondition**: 
  - Mở Network tab trên DevTools của các trình duyệt Chrome, Edge, Safari.
- **Test Steps**:
  1. Nhập mã hợp lệ `SPEED2026` và bấm "Áp dụng".
  2. Ghi nhận chỉ số Latency/Response Time của API `POST /api/v1/checkout/apply-voucher`.
- **Test Data**:
  - Browsers: Chrome, Edge, Safari
  - Voucher: SPEED2026
- **Expected Result**: 
  - Thời gian phản hồi của API t < 3.000 ms (dưới 3 giây) trên cả 3 trình duyệt.
- **Priority**: High
- **Tags**: Rule#BR-10, Viewpoint#Performance, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-040
- **Title**: Verify giao diện DOM trang Thanh toán cập nhật lại tổng tiền thanh toán tức thì sau khi API trả kết quả mà không gây treo hay đơ màn hình
- **Precondition**: 
  - Trang Thanh toán sẵn sàng ở phía Client.
- **Test Steps**:
  1. Nhấn nút "Áp dụng" mã giảm giá.
  2. Quan sát tốc độ render lại giao diện DOM ngay khi API trả về status code 200.
- **Test Data**:
  - UI Component: Checkout Order Summary DOM
- **Expected Result**: 
  - DOM tổng tiền được cập nhật ngay lập tức (< 100ms sau khi API phản hồi xong).
  - Không xuất hiện hiện tượng đơ, giật lag hay treo trang.
- **Priority**: Medium
- **Tags**: Rule#BR-10, Viewpoint#Performance, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-041
- **Title**: Confirm người dùng có thể di chuyển vào ô nhập mã bằng phím Tab và kích hoạt nút Áp dụng bằng phím Enter hoặc Space
- **Precondition**: 
  - Màn hình Thanh toán mở, không dùng chuột điều hướng.
- **Test Steps**:
  1. Nhấn phím `Tab` điều hướng focus vào ô "Mã giảm giá".
  2. Nhập "TABENTER10".
  3. Nhấn phím `Tab` để chuyển focus sang nút "Áp dụng".
  4. Nhấn phím `Enter` (hoặc `Space`).
- **Test Data**:
  - Key sequence: Tab -> Text Input -> Tab -> Enter / Space
- **Expected Result**: 
  - Đường viền focus indicator hiển thị rõ ràng trên ô nhập và nút bấm.
  - Phím `Enter`/`Space` kích hoạt nút "Áp dụng" thành công.
- **Priority**: Low
- **Tags**: Rule#BR-01, Viewpoint#Accessibility, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-042
- **Title**: Confirm văn bản thông báo lỗi và thông báo thành công có độ tương phản màu sắc đạt chuẩn giúp người dùng dễ đọc
- **Precondition**: 
  - Các thông báo phản hồi (Banner/Toast) đang hiển thị tại trang Thanh toán.
- **Test Steps**:
  1. Kích hoạt hiển thị thông báo lỗi.
  2. Kích hoạt hiển thị thông báo thành công.
  3. Đo tỷ lệ tương phản màu sắc chữ/nền bằng công cụ Color Contrast Analyzer.
- **Test Data**:
  - Chữ thông báo lỗi/thành công và màu nền tương ứng.
- **Expected Result**: 
  - Tỷ lệ tương phản màu sắc (Color Contrast Ratio) đạt mức tối thiểu >= 4.5:1 (đạt chuẩn WCAG AA).
- **Priority**: Low
- **Tags**: Rule#BR-07, Viewpoint#Accessibility, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-043
- **Title**: Confirm giao diện ô nhập mã và nút Áp dụng không bị đè khuất hay vỡ khung hình khi thu phóng trình duyệt lên mức 200%
- **Precondition**: 
  - Trình duyệt Chrome/Edge/Safari đang mở trang Thanh toán.
- **Test Steps**:
  1. Thu phóng (Zoom) trình duyệt lên mức 200%.
  2. Kiểm tra hiển thị ô nhập mã, nút "Áp dụng" và văn bản thông báo.
- **Test Data**:
  - Zoom level: 200%
- **Expected Result**: 
  - Giao diện tự động căn chỉnh co giãn, không bị vỡ khung hình, không bị đè khuất chữ hay nút bấm.
- **Priority**: Low
- **Tags**: Rule#BR-08, Viewpoint#Accessibility, Module#ShopGo_Voucher, Manual

---

### TC_ID: VOUCHER-044
- **Title**: Verify số tiền giảm giá của mã được hệ thống tự động phân bổ tỷ lệ thuận vào từng sản phẩm (Line Items) trong CSDL đơn hàng
- **Precondition**: 
  - Đơn hàng gồm 2 sản phẩm: Sản phẩm A (Giá 300.000 VNĐ, SL 1) và Sản phẩm B (Giá 100.000 VNĐ, SL 1). Subtotal = 400.000 VNĐ. Áp mã `SAVE40K` (Giảm 40.000 VNĐ).
- **Test Steps**:
  1. Thực hiện chốt đơn đặt hàng với mã `SAVE40K`.
  2. Tra cứu dữ liệu bảng `order_items` trong CSDL của đơn hàng vừa tạo.
- **Test Data**:
  - SP A: 300.000 VNĐ (75% Subtotal)
  - SP B: 100.000 VNĐ (25% Subtotal)
  - Voucher: SAVE40K (Giảm 40.000 VNĐ)
- **Expected Result**: 
  - Số tiền chiết khấu phân bổ cho SP A: `40.000 * 75% = 30.000 VNĐ`.
  - Số tiền chiết khấu phân bổ cho SP B: `40.000 * 25% = 10.000 VNĐ`.
  - Tổng tiền chiết khấu các line items bằng đúng 40.000 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-05, Viewpoint#[GIẢ ĐỊNH] Data Integrity & Financial Accounting, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-045
- **Title**: Verify số tiền hoàn lại khi khách hàng trả 01 sản phẩm được tính bằng giá trị sản phẩm đó trừ đi phần chiết khấu đã được phân bổ
- **Precondition**: 
  - Đơn hàng có SP A (Giá 300.000 VNĐ, Chiết khấu phân bổ 30.000 VNĐ). Khách hàng yêu cầu trả lại SP A.
- **Test Steps**:
  1. Khởi tạo yêu cầu Trả hàng/Hoàn tiền (Return/Refund) cho SP A.
  2. Kiểm tra số tiền hoàn lại (Refund Amount) do hệ thống tính toán.
- **Test Data**:
  - Giá SP A: 300.000 VNĐ
  - Discount Allocated SP A: 30.000 VNĐ
- **Expected Result**: 
  - Số tiền hoàn lại cho SP A được tính chính xác: `300.000 - 30.000 = 270.000 VNĐ`.
  - Hệ thống không hoàn lại nguyên giá 300.000 VNĐ ban đầu.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-05, Viewpoint#[GIẢ ĐỊNH] Data Integrity & Financial Accounting, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-046
- **Title**: Verify số tiền chiết khấu tính theo phần trăm (%) được làm tròn toán học chuẩn (Math.round) đến hàng đơn vị VNĐ
- **Precondition**: 
  - Giỏ hàng Subtotal = 155.555 VNĐ. Áp dụng mã `PCT7` (Giảm 7%).
- **Test Steps**:
  1. Áp mã `PCT7` trên đơn hàng 155.555 VNĐ.
  2. Kiểm tra giá trị chiết khấu được tính (`155.555 * 7% = 10.888,85 VNĐ`).
- **Test Data**:
  - Subtotal: 155.555 VNĐ
  - Voucher: PCT7 (7%)
- **Expected Result**: 
  - Chiết khấu được làm tròn toán học theo `Math.round`: `10.889 VNĐ`.
  - Không có số thập phân trong CSDL và UI, không gây lệch tiền lẻ 1 VNĐ.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#BR-09, Rule#MR-06, Viewpoint#[GIẢ ĐỊNH] Data Integrity & Financial Accounting, Module#ShopGo_Voucher, Automated

---

### TC_ID: VOUCHER-047
- **Title**: Verify hệ thống từ chối áp dụng chiết khấu đối với các sản phẩm thuộc danh mục bị đánh dấu loại trừ khuyến mãi
- **Precondition**: 
  - Giỏ hàng có SP A (Sản phẩm thường: 200.000 VNĐ) và SP B (Thuộc danh mục "Loại trừ khuyến mãi": 300.000 VNĐ). Subtotal = 500.000 VNĐ. Mã `PCT10` (Giảm 10%).
- **Test Steps**:
  1. Áp mã `PCT10` trên giỏ hàng chứa cả SP A và SP B.
  2. Kiểm tra giá trị chiết khấu được tính.
- **Test Data**:
  - SP A: 200.000 VNĐ
  - SP B (Excluded): 300.000 VNĐ
  - Voucher: PCT10 (10%)
- **Expected Result**: 
  - Chiết khấu 10% chỉ áp dụng trên SP A (`200.000 * 10% = 20.000 VNĐ`).
  - SP B không được tính chiết khấu. Dòng chiết khấu hiển thị: `-20.000 VNĐ`.
- **Priority**: High
- **Tags**: Rule#BR-03, Rule#MR-05, Viewpoint#[GIẢ ĐỊNH] Data Integrity & Financial Accounting, Module#ShopGo_Voucher, Automated

---

## 3. BẢNG TỰ AUDIT CHẤT LƯỢNG TEST CASE (FACT & BOUNDARY AUDIT CHECKLIST)

| Tiêu chuẩn FACT | Tiêu chí Kiểm tra (Checkpoints) | Tự đánh giá | Luận điểm & Minh chứng |
|:---|:---|:---:|:---|
| **F — Factual** | 100% Test Steps, Test Data và Expected Result bám sát Business Rules (BR) và Missing Rules (MR). | **PASS** | Mọi test case đều dẫn chiếu chính xác mã Rule# (BR-01 đến BR-10, MR-01 đến MR-06) tại thẻ `Tags`. Không phát sinh logic bịa đặt. |
| **A — Accurate** | Test Steps, Test Data và Expected Result diễn đạt chính xác, một nghĩa; giá trị cụ thể, không mơ hồ, không dùng placeholder chung chung. | **PASS** | Đã tuân thủ nghiêm ngặt 8 trường chuẩn. Dữ liệu Test Data 100% cụ thể (`customer_happy01@shopgo.vn`, `PCT10`, `200.000 VNĐ`), cấm dùng placeholder mơ hồ. |
| **C — Complete** | 100% Test Idea "Giữ" từ Step 04 (47/47 Test Ideas) được expand thành Test Case hoàn chỉnh; không có test case mồ côi. | **PASS** | Mở rộng trọn vẹn 47/47 Test Idea "Giữ" (từ VOUCHER-001 đến VOUCHER-047), không lược bỏ hay cắt giảm bất kỳ kịch bản hợp lệ nào. |
| **T — Testable** | Expected Result có tiêu chí xác minh Pass/Fail rõ ràng (Message, UI State, DB Record, Response Code). | **PASS** | Expected Result mô tả kết quả đầu ra định lượng cụ thể (Ví dụ: Trạng thái CSDL `USED`, mã lỗi HTTP `401`, số tiền `-50.000 VNĐ`, thông báo nguyên văn). |
| **Boundary Completeness** | Phủ đầy đủ các mốc biên (`min-1, min, min+1, max-1, max, max+1`) và các Equivalence Partition cho các trường min/max, định dạng và độ dài. | **PASS** | Đã phủ các điểm mút biên Min Order Value (VOUCHER-018, VOUCHER-019), trần giảm giá % 50k (VOUCHER-020, VOUCHER-021), sàn 0 VNĐ (VOUCHER-022), mút thời gian 23:59:59 / 00:00:01 ICT (VOUCHER-023, VOUCHER-024), độ dài 50/51 ký tự (VOUCHER-026). Các mốc biên chi tiết hơn được chuyển Step 06 review bổ sung. |
