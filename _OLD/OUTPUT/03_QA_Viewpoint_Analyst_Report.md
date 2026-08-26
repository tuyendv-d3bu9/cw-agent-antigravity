# BÁO CÁO PHÂN TÍCH VIEWPOINT KIỂM THỬ — ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)

> **Feature**: Áp dụng Mã Giảm Giá (Voucher) - Function D (ShopGo E-Commerce)  
> **Người thực hiện**: Senior QA Viewpoint Analyst  
> **Bước trong quy trình**: Step 03 (Xác định & Phân tích Viewpoint Kiểm thử)  
> **Dữ liệu đầu vào đối soát**: [01_Requirement_Summary_Report.md](OUTPUT/01_Requirement_Summary_Report.md) & [02_QA_Missing_Rule_Analyst_Report.md](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md)  

---

## 1. CHIẾN LƯỢC ĐỘ PHỦ THEO RỦI RO (RISK-BASED COVERAGE STRATEGY)
*Chiến lược tiếp cận "test đúng chỗ, không test tràn lan" — dựa trên công thức Rủi ro = Khả năng xảy ra (Likelihood) × Tác động nghiệp vụ (Impact) kết hợp Khả năng phát hiện lỗi (Detectability) làm cơ sở tuyển chọn và phân định phạm vi các Viewpoint.*

### 1.1 Ma trận Ưu tiên Rủi ro (Likelihood × Impact)

| # | Risk Area (Khu vực rủi ro nghiệp vụ) | Likelihood | Impact | Mức ưu tiên | Nguồn (Rule/Missing Rule) |
|:---|:---|:---:|:---:|:---:|:---|
| RK-01 | **Sai lệch tính toán chiết khấu & Tổng tiền thanh toán**: Áp sai tỷ lệ % hoặc tiền VNĐ, tính sai sàn 0 VNĐ, không làm tròn số tiền lẻ theo quy chuẩn `Math.round` VNĐ dẫn đến lệch tiền đơn hàng giữa FE/BE/Cổng thanh toán. | Cao | Cao | **Ưu tiên 1 (Critical)** | [BR-03, BR-06, BR-09, MR-03, MR-06](OUTPUT/01_Requirement_Summary_Report.md#L19-L26) |
| RK-02 | **Lạm dụng mã & Thất thoát ngân sách khuyến mãi**: Khách hàng dùng lặp lại nhiều lần trên 1 tài khoản (vượt `max_per_user`), dùng mã đã hết hạn UTC+7, dùng mã đã hết tổng lượt phát hành của hệ thống hoặc dùng mã khi tài khoản bị khóa (`Suspended`). | Cao | Cao | **Ưu tiên 1 (Critical)** | [BR-02, BR-05, BR-07, MR-01, MR-04](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L18-L35) |
| RK-03 | **Lỗi ranh giới ngưỡng giá trị (Boundary & Cap)**: Vượt trần giảm giá tối đa (Max Discount Cap) cho mã %, lách luật tính Min Order Value trên Grand Total thay vì Subtotal tiền hàng, hoặc áp đồng thời quá số lượng mã cho phép. | Cao | Cao | **Ưu tiên 1 (Critical)** | [BR-04, MR-03, MR-05](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L62-L82) |
| RK-04 | **Tranh chấp đồng thời (Concurrency) & Treo giữ lượt mã (Voucher Holding)**: 2 giao dịch tranh chấp lượt dùng cuối cùng cùng millisecond; lượt mã bị khóa vĩnh viễn (Phantom lock) khi thanh toán online qua VNPay/MoMo bị hủy/timeout mà không tự động hoàn lại quỹ mã. | TB | Cao | **Ưu tiên 2 (High)** | [BR-16, MR-04, MR-06](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L85-L102) |
| RK-05 | **Tấn công dò quét vét cạn mã (Brute-Force) & Injection qua Input**: Kẻ xấu dùng Bot dò quét thử mã tự động liên tục làm nghẽn server hoặc chèn mã độc XSS/SQLi vào ô nhập mã giảm giá. | TB | Cao | **Ưu tiên 2 (High)** | [MR-02, MR-06](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L127-L142) |
| RK-06 | **Mất toàn vẹn dữ liệu khi hoàn trả từng phần (Partial Refund) & Sửa giỏ hàng**: Không có thuật toán phân bổ chiết khấu vào từng dòng sản phẩm khi khách trả 1 món; không re-validate gỡ mã khi giỏ hàng bị sửa giảm tiền dưới Min Order Value. | TB | TB | **Ưu tiên 3 (Medium)** | [MR-04, MR-05](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L105-L124) |
| RK-07 | **Trải nghiệm người dùng kém & Thông báo lỗi mập mờ**: Thông báo lỗi chung chung không rõ nguyên nhân (hết hạn, hết lượt, thiếu tiền hàng); giao diện vỡ bố cục trên Mobile Web. | Cao | TB | **Ưu tiên 3 (Medium)** | [BR-01, BR-07, BR-08, MR-02](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L38-L59) |
| RK-08 | **Hiệu năng phản hồi API chậm**: API kiểm tra mã và tính chiết khấu phản hồi quá 3 giây làm chậm luồng thanh toán gây bỏ dở đơn hàng. | TB | Thấp | **Ưu tiên 4 (Low)** | [BR-10](OUTPUT/01_Requirement_Summary_Report.md#L26) |
| RK-09 | **Rào cản khả năng tiếp cận (Accessibility)**: Người dùng điều hướng bằng bàn phím (Tab/Enter) hoặc người dùng zoom 200% không thao tác được nút áp mã. | Thấp | Thấp | **Ưu tiên 5 (Low)** | [BR-08](OUTPUT/01_Requirement_Summary_Report.md#L24) |

### 1.2 Xếp hạng ưu tiên & Top rủi ro test trước
1. **Nhóm Rủi ro Ưu tiên 1 (Critical - Test trước tiên)**:
   - **RK-01 (Sai lệch tính toán & Tổng tiền)**: Đề xuất kỹ thuật kiểm thử **Boundary Value Analysis (BVA)**, **Equivalence Partitioning (EP)** và kiểm tra công thức làm tròn số học `Math.round` VNĐ.
   - **RK-02 (Lạm dụng mã & Thất thoát ngân sách)**: Đề xuất kỹ thuật **Negative Testing**, **State Re-validation** tại thời điểm chốt đơn, và kiểm tra phân quyền tài khoản (Authorization).
   - **RK-03 (Lỗi ranh giới ngưỡng giá trị & Cap)**: Đề xuất kỹ thuật **Boundary Value Analysis (BVA)** tại các điểm mút biên (Subtotal đúng bằng Min Order Value, Subtotal thiếu 1 VNĐ, chiết khấu chạm trần Max Cap).
2. **Nhóm Rủi ro Ưu tiên 2 (High - Test chuyên sâu)**:
   - **RK-04 (Tranh chấp đồng thời & Treo giữ mã)**: Đề xuất kỹ thuật **Concurrency/Race Condition Testing** và **State Transition Testing** cho vòng đời mã (`AVAILABLE` → `PENDING_HOLD` → `USED`/`AVAILABLE`).
   - **RK-05 (Tấn công Brute-Force & Injection)**: Đề xuất kỹ thuật **Security Testing** (Rate Limiting 5 lần/phút) và **Input Sanitization** (XSS/SQLi).
3. **Nhóm Rủi ro Ưu tiên 3, 4, 5 (Medium/Low - Test tích hợp, giao diện và hiệu năng)**:
   - **RK-06, RK-07, RK-08, RK-09**: Đề xuất kỹ thuật **Integration Testing**, **Usability/Responsive Testing**, **Performance Response Time Measurement** (< 3s), và **Accessibility Keyboard/Zoom Testing**.

### 1.3 Liên kết Risk → Viewpoint

| Mã Risk Area | Tên Khu vực Rủi ro | Viewpoint phụ trách chính | Viewpoint phụ trách phối hợp |
|:---|:---|:---|:---|
| **RK-01** | Sai lệch tính toán chiết khấu & Tổng tiền | **Happy Path**, **Boundary** | **[GIẢ ĐỊNH] Data Integrity & Financial Accounting** |
| **RK-02** | Lạm dụng mã & Thất thoát ngân sách | **Negative** | **Security**, **Integration** |
| **RK-03** | Lỗi ranh giới ngưỡng giá trị & Cap | **Boundary** | **Negative** |
| **RK-04** | Tranh chấp đồng thời & Treo giữ mã | **Integration** | **Security** |
| **RK-05** | Tấn công dò quét mã & Injection | **Security** | **Negative** |
| **RK-06** | Hoàn trả từng phần & Sửa giỏ hàng | **[GIẢ ĐỊNH] Data Integrity & Financial Accounting** | **Integration** |
| **RK-07** | Trải nghiệm người dùng & Thông báo lỗi | **UX/Usability** | **Negative** |
| **RK-08** | Hiệu năng phản hồi API chậm | **Performance** | **UX/Usability** |
| **RK-09** | Rào cản khả năng tiếp cận | **Accessibility** | **UX/Usability** |

---

## 2. TỔNG QUAN LỰA CHỌN VIEWPOINT THEO RỦI RO
*Chiến lược tiếp cận đa góc nhìn bao quát toàn bộ 8 viewpoint chuẩn từ Registry kèm 01 viewpoint chuyên sâu giả định để bao phủ toàn bộ các khu vực rủi ro đã nhận diện.*

| STT | Tên Viewpoint | Mức độ Rủi ro (High/Med/Low) | Nguồn (Registry / [GIẢ ĐỊNH]) | Lý do lựa chọn |
|:---:|:---|:---:|:---:|:---|
| 1 | **Happy Path** | **High** | Registry | Luồng nghiệp vụ chuẩn: Áp mã %, mã VNĐ, kết hợp 2 mã hợp lệ, tự động trim khoảng trắng, không phân biệt hoa/thường, cập nhật tổng tiền thanh toán mới chính xác. |
| 2 | **Negative** | **High** | Registry | Xử lý ngoại lệ & kiểm soát thất thoát: Nhập mã không tồn tại, mã hết hạn, hết lượt hệ thống, hết lượt per-user, tài khoản bị khóa, giỏ hàng không đủ Min Order Value, ô nhập trống. |
| 3 | **Boundary** | **High** | Registry | Kiểm tra các giá trị mút/ngưỡng rủi ro cao: Trần giảm giá % (50.000 VNĐ), Min Order Value Subtotal (thiếu/đủ 1 VNĐ), mút thời gian 23:59:59/00:00:01 ICT, sàn tiền hàng 0 VNĐ, độ dài 50 ký tự. |
| 4 | **Security** | **High** | Registry | Phòng chống tấn công & gian lận: Cơ chế chống dò quét mã (Rate Limiting 5 lần/phút), tranh chấp lượt dùng cuối (Concurrency Locking / trạng thái `OVER`), bypass tài khoản bị khóa, Input Sanitization (XSS/SQLi). |
| 5 | **Integration** | **High** | Registry | Đồng bộ trạng thái giữa các phân hệ: Voucher Holding 15 phút khi chuyển Cổng thanh toán VNPay/MoMo & auto release, re-validate giỏ hàng khi chốt đơn, đồng bộ múi giờ ICT (UTC+7). |
| 6 | **UX/Usability** | **Medium** | Registry | Trải nghiệm giao diện & thông điệp: Minh bạch hiển thị dòng tiền chiết khấu, câu thông báo lỗi phân biệt rõ nguyên nhân, giao diện responsive chuẩn trên Desktop và Mobile Web. |
| 7 | **Performance** | **Medium** | Registry | Tốc độ đáp ứng hệ thống: Thời gian phản hồi của API xác thực mã và cập nhật DOM giao diện dưới 3 giây theo quy chuẩn BR-10. |
| 8 | **Accessibility** | **Low** | Registry | Khả năng tiếp cận cơ bản trên Web B2C: Thao tác bằng bàn phím (Tab/Enter), độ tương phản màu sắc thông báo lỗi/thành công, hiển thị khi phóng to (zoom 200%). |
| 9 | **[GIẢ ĐỊNH] Data Integrity & Financial Accounting** | **High** | `[GIẢ ĐỊNH]` | Toàn vẹn dữ liệu tài chính & hạch toán: Thuật toán phân bổ chiết khấu theo tỷ lệ vào từng sản phẩm làm căn cứ Partial Refund (MR-05), làm tròn số học `Math.round` VNĐ (MR-06). |

---

## 3. BẢN ĐẶC TẢ CHI TIẾT CÁC VIEWPOINT

### Viewpoint 01: Happy Path
- **Tên Viewpoint**: `Happy Path`
- **Mục tiêu kiểm thử**: Xác minh luồng nghiệp vụ chuẩn khi Khách hàng đã đăng nhập áp dụng thành công mã giảm giá (dạng % hoặc tiền cố định VNĐ), đáp ứng đầy đủ điều kiện giá trị đơn hàng, hạn dùng, số lượt dùng và hoàn tất thanh toán thành công.
- **Phạm vi bao phủ (In-scope)**:
  - Khách hàng đã đăng nhập áp dụng thành công mã giảm giá loại phần trăm (%) hợp lệ khi Subtotal ≥ Min Order Value [BR-01, BR-03, BR-04, BR-05].
  - Khách hàng áp dụng thành công mã giảm giá loại số tiền cố định (VNĐ) hợp lệ [BR-03].
  - Khách hàng áp dụng đồng thời 02 mã giảm giá hợp lệ khác loại (01 mã sản phẩm + 01 mã Freeship) trên cùng 01 đơn hàng [MR-03].
  - Hệ thống tự động loại bỏ khoảng trắng thừa đầu/cuối chuỗi (trim spaces) và xử lý không phân biệt chữ hoa/chữ thường (case-insensitive) khi người dùng nhập mã [Section 7: Q1].
  - Hệ thống tính toán chính xác số tiền chiết khấu và tự động cập nhật giao diện trang Thanh toán: hiển thị rõ số tiền giảm và tổng tiền thanh toán mới sau chiết khấu [BR-06].
  - Hoàn tất chốt đơn đặt hàng thành công (COD hoặc thanh toán online), hệ thống ghi nhận đơn hàng và cập nhật trạng thái mã thành đã sử dụng (`USED`) [MR-04].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Mọi trường hợp nhập sai mã, mã hết hạn, giỏ hàng thiếu điều kiện *(chuyển sang Viewpoint Negative)*.
  - Các trường hợp kiểm tra tại điểm mút biên số tiền, mút thời gian, trần giảm giá *(chuyển sang Viewpoint Boundary)*.
  - Kiểm tra tấn công dò mã hoặc tranh chấp đồng thời *(chuyển sang Viewpoint Security)*.
- **Rủi ro nếu bỏ qua**: Luồng chính bị lỗi khiến khách hàng không thể sử dụng ưu đãi, làm giảm trực tiếp tỷ lệ chuyển đổi đơn hàng và gây mất uy tín thương hiệu ShopGo.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Đơn giản đến Trung bình**. Tập trung vào các kịch bản áp mã %, mã VNĐ, áp 2 mã kết hợp, tự động trim và case-insensitive trên luồng hợp lệ.

---

### Viewpoint 02: Negative
- **Tên Viewpoint**: `Negative`
- **Mục tiêu kiểm thử**: Xác minh khả năng kiểm soát lỗi, xử lý ngoại lệ và hiển thị thông báo phản hồi chính xác khi người dùng thao tác sai, nhập dữ liệu không hợp lệ, tài khoản không đủ quyền hoặc luồng thanh toán bị gián đoạn.
- **Phạm vi bao phủ (In-scope)**:
  - Nhập mã giảm giá không tồn tại trên hệ thống hoặc gõ sai ký tự -> Hiển thị thông báo lỗi chuẩn: `"Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."` [BR-07, AF-02, MR-02].
  - Nhập mã giảm giá đã quá hạn sử dụng theo múi giờ ICT (UTC+7) -> Hiển thị thông báo lỗi chuẩn: `"Mã giảm giá đã hết hạn sử dụng."` [BR-07, AF-01, MR-02].
  - Nhập mã giảm giá đã hết tổng lượt sử dụng trên toàn hệ thống -> Hiển thị thông báo lỗi: `"Mã giảm giá đã hết lượt sử dụng."` [MR-02].
  - Khách hàng đã dùng hết số lượt cho phép của tài khoản (`max_per_user`) cố tình nhập lại mã -> Hiển thị thông báo lỗi: `"Bạn đã sử dụng hết số lần cho phép của mã giảm giá này."` [MR-01, MR-02].
  - Tổng giá trị tiền hàng (Subtotal) nhỏ hơn Min Order Value -> Hiển thị thông báo lỗi nêu rõ ngưỡng thiếu [AF-03, BR-04, MR-02, MR-03].
  - Nhấn nút "Áp dụng" khi ô nhập mã để trống chuỗi -> Hiển thị thông báo lỗi inline: `"Vui lòng nhập mã giảm giá."` [MR-02].
  - Khách vãng lai (Guest chưa đăng nhập) cố gắng truy cập trang Thanh toán để nhập mã -> Hệ thống ngăn chặn và yêu cầu Đăng nhập/Đăng ký [BR-02, AF-04].
  - Tài khoản Khách hàng bị khóa/đình chỉ (`Disabled/Suspended`) ở thời điểm giữa lúc áp mã thành công và chốt đơn -> Hệ thống tự gỡ mã và chặn đặt hàng [MR-01].
  - Khách hàng quay lại giỏ hàng giảm số lượng sản phẩm làm Subtotal xuống dưới Min Order Value -> Hệ thống tự động re-validate, gỡ mã giảm giá và báo lỗi khi chốt đơn [MR-04, MR-05].
  - Giao dịch thanh toán online (VNPay/MoMo) thất bại, người dùng hủy giữa chừng hoặc timeout 15 phút -> Hệ thống hủy đơn Pending và tự động hoàn lượt mã về `AVAILABLE` [MR-04].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra giá trị biên chính xác tại điểm mút (thiếu 1 VNĐ, sát 1 giây) *(chuyển sang Viewpoint Boundary)*.
  - Kiểm tra tấn công dò quét mã tự động liên tục *(chuyển sang Viewpoint Security)*.
- **Rủi ro nếu bỏ qua**: Cho phép áp dụng sai mã, thất thoát ngân sách khuyến mãi, hoặc thông báo lỗi mập mờ gây bực bội cho người dùng.
- **Ước lượng định tính Test Idea**: **Mật độ: Cao | Độ phức tạp: Trung bình**. Bao phủ tập hợp đa dạng các ngoại lệ nghiệp vụ, lỗi input, lỗi trạng thái tài khoản và gián đoạn luồng thanh toán.

---

### Viewpoint 03: Boundary
- **Tên Viewpoint**: `Boundary`
- **Mục tiêu kiểm thử**: Kiểm tra và xác thực các giá trị mút/ngưỡng giới hạn (Boundary Values) về số tiền, phần trăm chiết khấu, mút thời gian, số lượng mã và độ dài chuỗi ký tự để đảm bảo hệ thống không bị sai lệch số học.
- **Phạm vi bao phủ (In-scope)**:
  - Ngưỡng Min Order Value (Subtotal): Tiền hàng bằng đúng Min Order Value (Subtotal = Min Order Value: Áp thành công) vs Subtotal nhỏ hơn 1 VNĐ (Subtotal = Min Order Value - 1 VNĐ: Bị từ chối) [BR-04, MR-03].
  - Trần giảm giá phần trăm (Max Discount Cap): Tiền giảm tính theo % vượt mức trần tối đa theo quy định chiến dịch (ví dụ trần 50.000 VNĐ) -> Hệ thống ép trần số tiền giảm đúng bằng mức trần tối đa [MR-03].
  - Sàn thanh toán tiền hàng (Discount Floor): Mã giảm tiền cố định VNĐ lớn hơn hoặc bằng Subtotal (ví dụ mã giảm 50.000 VNĐ trên đơn 40.000 VNĐ) -> Tổng tiền hàng sau giảm bằng đúng `0 VNĐ` (không bị âm tiền) [MR-03].
  - Ngưỡng mút thời hạn sử dụng mã theo múi giờ ICT (UTC+7): Chốt đơn tại thời điểm 23:59:59 ngày hết hạn (còn hạn: Áp thành công) vs 00:00:01 ngày tiếp theo (hết hạn: Bị từ chối) [BR-05, MR-04].
  - Ngưỡng giới hạn số lượng mã áp dụng đồng thời: Áp 2 mã khác loại (hợp lệ) vs cố gắng áp mã thứ 3 trên cùng 01 đơn hàng (Hệ thống chặn không cho áp dụng) [MR-03].
  - Giới hạn độ dài ô nhập mã: Nhập chuỗi độ dài 1 ký tự, 50 ký tự (hợp lệ) vs 51 ký tự (Bị chặn/cắt không cho nhập thêm) [MR-02].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Luồng nhập sai mã hoặc mã không tồn tại thông thường *(chuyển sang Viewpoint Negative)*.
  - Tranh chấp lượt dùng mã đồng thời giữa nhiều tài khoản *(chuyển sang Viewpoint Security)*.
- **Rủi ro nếu bỏ qua**: Lỗi tràn tiền (tổng tiền bị âm), vượt trần chiết khấu gây thất thoát tài chính, hoặc sai lệch mút thời gian cho phép người dùng trục lợi mã đã hết hạn.
- **Ước lượng định tính Test Idea**: **Mật độ: Cao | Độ phức tạp: Phức tạp**. Tập trung thiết kế các kịch bản kiểm thử tại các điểm mút biên số tiền, mút thời gian ICT, mút độ dài chuỗi và mút số lượng mã.

---

### Viewpoint 04: Security
- **Tên Viewpoint**: `Security`
- **Mục tiêu kiểm thử**: Đánh giá an toàn thông tin, kiểm soát phân quyền truy cập, khả năng chống tấn công dò quét mã (Anti-Brute-Force) và tính toàn vẹn dữ liệu khi xử lý tranh chấp đồng thời (Concurrency Locking).
- **Phạm vi bao phủ (In-scope)**:
  - Giới hạn tần suất thử mã (Rate Limiting / Anti-Brute-Force): 1 Tài khoản / 1 Địa chỉ IP gửi request "Áp dụng" mã sai quá 05 lần trong 01 phút -> Hệ thống tự động tạm khóa tính năng áp mã trong 10 phút và phản hồi thông báo chặn [MR-06].
  - Tranh chấp lượt dùng cuối cùng (Concurrency Locking): 2 người dùng đồng thời bấm "Đặt hàng" cho lượt dùng cuối cùng của mã tại cùng một thời điểm -> Hệ thống sử dụng khóa mức server (atomic lock), chỉ 01 giao dịch được áp dụng, giao dịch còn lại nhận thông báo mã đã hết lượt [Section 7: Q6, MR-01].
  - Kiểm soát phân quyền (Bypass Authorization): Cố tình gửi request API áp mã từ Khách vãng lai chưa đăng nhập hoặc từ tài khoản đang ở trạng thái bị khóa (`Disabled/Suspended`) -> Backend từ chối xử lý và trả về lỗi 401/403 Unauthorized [BR-02, MR-01].
  - Làm sạch dữ liệu đầu vào (Input Sanitization): Nhập chuỗi mã chứa các ký tự mã độc SQL Injection, XSS, HTML script (ví dụ: `' OR '1'='1`, `<script>alert(1)</script>`) -> Hệ thống mã hóa/làm sạch an toàn, không thực thi mã độc [MR-02].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Phân quyền màn hình Back-office Admin/CSKH tạo và quản lý mã *(Out of scope chung của feature)*.
  - Kiểm thử an toàn hạ tầng mạng, chứng chỉ SSL/TLS hoặc tấn công DDoS quy mô hạ tầng.
- **Rủi ro nếu bỏ qua**: Bị kẻ xấu dùng bot dò quét lộ các mã bí mật/VIP, xảy ra lỗi Race Condition làm vượt quá tổng số lượt mã quy định, hoặc bị khai thác lỗ hổng bảo mật ứng dụng Web.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Phức tạp**. Đòi hỏi kỹ thuật giả lập concurrency, giả lập rate limit và chèn script bảo mật để kiểm tra.

---

### Viewpoint 05: Integration
- **Tên Viewpoint**: `Integration`
- **Mục tiêu kiểm thử**: Kiểm tra tính tương thích, khả năng tích hợp và đồng bộ trạng thái dữ liệu chính xác giữa tính năng áp mã tại trang Thanh toán với Cổng thanh toán online, phân hệ Giỏ hàng, Server Time ICT và Quản lý đơn hàng.
- **Phạm vi bao phủ (In-scope)**:
  - Tích hợp Cổng thanh toán online (VNPay/MoMo/Thẻ): Khi người dùng chốt đơn chọn thanh toán online, lượt mã chuyển sang trạng thái tạm giữ `PENDING_HOLD` tối đa 15 phút. Nếu thanh toán thất bại/hủy/timeout -> hệ thống tự động giải phóng lượt mã về `AVAILABLE` [MR-04].
  - Tích hợp Giỏ hàng (Cart Service): Người dùng quay lại giỏ hàng sửa số lượng/bớt sản phẩm -> Hệ thống tự động re-validate điều kiện Min Order Value (Subtotal) và gỡ mã nếu không còn đủ điều kiện tại bước chốt đơn [MR-04, MR-05].
  - Tích hợp Múi giờ hệ thống (Server Time ICT / UTC+7): Thời hạn mã được đối soát chính xác theo giờ Server Việt Nam, không phụ thuộc vào múi giờ local trên thiết bị của người dùng (chống gian lận đổi giờ máy khách) [Section 7: Q4].
  - Tích hợp Quản lý đơn hàng & Hoàn trả (Order Management System): Mã giảm giá đã áp dụng thành công được khôi phục về trạng thái "chưa sử dụng" khi đơn hàng bị hủy hoặc trả hàng toàn phần; không hoàn lại mã khi trả hàng một phần [Section 7: Q5, MR-05].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tích hợp hệ thống quản lý kho hàng Warehouse hoặc ERP bên ngoài *(Out of scope chung của feature)*.
  - Quy trình xử lý đối soát thủ công các giao dịch lỗi phía Back-office Admin *(Out of scope chung của feature)*.
- **Rủi ro nếu bỏ qua**: Lượt mã bị treo vĩnh viễn (phantom lock) khi thanh toán online bị lỗi, người dùng lợi dụng đổi giờ thiết bị để dùng mã hết hạn, hoặc mã bị gỡ sai lúc chốt đơn gây tranh chấp với khách hàng.
- **Ước lượng định tính Test Idea**: **Mật độ: Cao | Độ phức tạp: Phức tạp**. Bao phủ các kịch bản tương tác đa hệ thống giữa Client, Server, Payment Gateway và Cart Service.

---

### Viewpoint 06: UX/Usability
- **Tên Viewpoint**: `UX/Usability`
- **Mục tiêu kiểm thử**: Đánh giá trải nghiệm người dùng, tính minh bạch trong hiển thị thông tin chiết khấu, tính dễ hiểu của các phản hồi thông báo lỗi và khả năng tương thích giao diện trên các thiết bị.
- **Phạm vi bao phủ (In-scope)**:
  - Minh bạch thông tin chiết khấu: Trang Thanh toán hiển thị rõ ràng số tiền được giảm (dạng `- XX.XXX VNĐ`) và tổng tiền thanh toán mới sau khi áp mã thành công [BR-06].
  - Trải nghiệm nhập liệu thuận tiện: Tự động trim khoảng trắng đầu/cuối và xử lý case-insensitive giúp người dùng không bị báo lỗi do gõ chữ hoa/thường hoặc cách khoảng vô ý [Section 7: Q1].
  - Tính rõ ràng của thông báo lỗi: Phản hồi thông báo lỗi chi tiết, phân biệt rõ nguyên nhân (mã hết hạn, hết lượt, không đủ Min Order Value, ô nhập trống) giúp người dùng dễ dàng nắm bắt nguyên nhân [MR-02].
  - Hiển thị tương thích Responsive: Giao diện ô nhập mã, nút "Áp dụng", vị trí dòng giảm giá hiển thị cân đối, không bị đè vỡ bố cục trên cả màn hình Desktop và Mobile Web [BR-08].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Thiết kế ứng dụng di động bản lề Native App iOS / Android *(Out of scope theo Section 6 tài liệu Step 01)*.
  - Đánh giá màu sắc hay thiết kế đồ họa chi tiết ngoài phạm vi tính năng áp mã.
- **Rủi ro nếu bỏ qua**: Giao diện hiển thị đè vỡ trên mobile, thông báo lỗi khó hiểu làm người dùng bỏ dở giỏ hàng, hoặc không thấy rõ số tiền được giảm gây thắc mắc nghi ngờ.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Đơn giản**. Tập trung kiểm tra tính thẩm mỹ, minh bạch thông tin và trải nghiệm giao diện người dùng.

---

### Viewpoint 07: Performance
- **Tên Viewpoint**: `Performance`
- **Mục tiêu kiểm thử**: Đánh giá thời gian phản hồi API kiểm tra mã và tính toán chiết khấu, đảm bảo tốc độ phản hồi tức thì không gây gián đoạn luồng thanh toán chuẩn của người dùng.
- **Phạm vi bao phủ (In-scope)**:
  - Thời gian xử lý của API kiểm tra điều kiện mã và trả về số tiền chiết khấu đáp ứng dưới 3 giây trên các trình duyệt được hỗ trợ (Chrome, Edge, Safari) [BR-10].
  - Tốc độ tính toán lại tổng tiền thanh toán và cập nhật lại DOM giao diện diễn ra tức thì sau khi API trả về kết quả thành công, không bị giật lag hay treo màn hình.
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm thử chịu tải cao (Load test / Stress test / Flash Sale) với số lượng lớn truy cập đồng thời *(Out of scope theo Section 6 tài liệu Step 01)*.
- **Rủi ro nếu bỏ qua**: API phản hồi chậm làm màn hình thanh toán bị quay spinner lâu (> 3 giây), khiến người dùng tưởng hệ thống lỗi và bấm thao tác lặp lại nhiều lần.
- **Ước lượng định tính Test Idea**: **Mật độ: Thấp | Độ phức tạp: Đơn giản**. Đo lường thời gian phản hồi (Response Time) của API và khả năng render giao diện trong điều kiện luồng đơn.

---

### Viewpoint 08: Accessibility
- **Tên Viewpoint**: `Accessibility`
- **Mục tiêu kiểm thử**: Đánh giá khả năng truy cập và thao tác cơ bản của tính năng áp mã đối với người dùng trên các thiết bị trình duyệt Web Desktop và Mobile.
- **Phạm vi bao phủ (In-scope)**:
  - Thao tác bằng bàn phím (Keyboard Navigation): Người dùng có thể dùng phím `Tab` để di chuyển vào ô nhập mã, nhập chuỗi và nhấn phím `Enter` (hoặc `Space`) để kích hoạt nút "Áp dụng" mà không cần dùng chuột.
  - Độ tương phản màu sắc (Color Contrast): Văn bản thông báo lỗi (màu đỏ/cảnh báo) và thông báo thành công (màu xanh/xác nhận) đạt độ tương phản chuẩn dễ đọc.
  - Khả năng thu phóng màn hình (Zooming): Màn hình trình duyệt zoom 200% trên Chrome, Edge, Safari các ô nhập mã và nút bấm không bị mất chữ hay đè khuất phần tử khác.
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tuân thủ chứng nhận WCAG 2.1 AAA toàn diện quốc tế cho ứng dụng chuyên biệt.
- **Rủi ro nếu bỏ qua**: Người dùng thao tác bàn phím hoặc người dùng có thị lực kém không thể bấm nút áp dụng mã trên web.
- **Ước lượng định tính Test Idea**: **Mật độ: Thấp | Độ phức tạp: Đơn giản**. Kiểm tra tương tác phím, tương phản hiển thị và khả năng zoom trình duyệt.

---

### Viewpoint 09: [GIẢ ĐỊNH] Data Integrity & Financial Accounting
- **Tên Viewpoint**: `[GIẢ ĐỊNH] Data Integrity & Financial Accounting`
- **Mục tiêu kiểm thử**: Xác minh tính toàn vẹn dữ liệu tài chính, quy tắc làm tròn tiền tệ VNĐ và thuật toán phân bổ số tiền chiết khấu chính xác vào từng sản phẩm trong đơn hàng làm căn cứ xử lý hoàn trả từng phần (Partial Refund) và đối soát kế toán.
- **Phạm vi bao phủ (In-scope)**:
  - Thuật toán phân bổ chiết khấu (Discount Allocation Ratio): Kiểm tra số tiền giảm giá của mã được phân bổ tỷ lệ thuận vào từng sản phẩm (Line Items) trong đơn hàng theo công thức:  
    $$\text{Discount}_{\text{item}} = \text{Total Discount} \times \frac{\text{Price}_{\text{item}} \times \text{Quantity}_{\text{item}}}{\text{Subtotal}}$$ [MR-05].
  - Xử lý hoàn trả từng phần (Partial Refund): Xác minh số tiền hoàn lại khi khách hàng trả 01 sản phẩm trong đơn hàng nhiều sản phẩm = $(\text{Price}_{\text{item}} \times \text{Quantity}_{\text{item}}) - \text{Discount}_{\text{item}}$ [MR-05].
  - Quy chuẩn làm tròn tiền tệ (`Math.round`): Số tiền chiết khấu tính theo phần trăm (%) được làm tròn toán học chuẩn đến hàng đơn vị VNĐ, không làm phát sinh số thập phân hay lệch tiền lẻ (1 VNĐ) giữa Frontend, Backend và CSDL [BR-09, MR-06].
  - Loại trừ danh mục không áp mã: Kiểm tra hệ thống từ chối áp dụng mã chiết khấu đối với các sản phẩm thuộc danh mục bị đánh dấu "Loại trừ khuyến mãi" [MR-05].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Quy trình hạch toán sổ sách kế toán tổng hợp trên phần mềm ERP bên ngoài *(Out of scope chung của feature)*.
- **Rủi ro nếu bỏ qua**: Sai lệch tiền lẻ 1 VNĐ giữa báo cáo và cổng thanh toán, không thể tính tiền hoàn trả chính xác khi khách trả 1 sản phẩm gây tranh chấp khiếu nại tài chính.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Phức tạp**. Đòi hỏi kiểm tra chính xác công thức toán học phân bổ dữ liệu và làm tròn tiền tệ trên từng item trong CSDL.

---

## 4. MA TRẬN ĐỐI SOÁT RANH GIỚI PHẠM VI (ZERO-OVERLAP MATRIX)

| Viewpoint A | Viewpoint B | Điểm có nguy cơ giao thoa | Ranh giới phân định rõ ràng (In/Out Scope Separation) |
|:---|:---|:---|:---|
| **Happy Path** | **Boundary** | Áp dụng mã phần trăm (%) có số tiền giảm bình thường vs chạm trần | • **Happy Path**: Phụ trách kiểm thử luồng áp mã % thành công với số tiền giảm nằm trong khoảng bình thường dưới mức trần.<br>• **Boundary**: Phụ trách kiểm thử chính xác tại điểm mút biên trần tối đa (ví dụ: đơn hàng lớn làm mức giảm vượt trần -> ép trần đúng mức quy định). |
| **Happy Path** | **Integration** | Nhập mã hợp lệ và chốt đơn chọn thanh toán trực tuyến VNPay/MoMo | • **Happy Path**: Phụ trách luồng áp mã thành công và tính toán số tiền giảm hiển thị trên giao diện.<br>• **Integration**: Phụ trách chuyển đổi trạng thái `PENDING_HOLD` 15 phút của lượt mã khi chuyển sang cổng thanh toán và tự động nhả về `AVAILABLE` nếu hủy/timeout. |
| **Negative** | **Boundary** | Nhập mã khi giá trị giỏ hàng nhỏ hơn Min Order Value | • **Negative**: Phụ trách kiểm thử trường hợp tổng tiền hàng nhỏ hơn rõ rệt so với Min Order Value (ví dụ: Min 200k nhưng giỏ hàng 100k) và hiển thị thông báo lỗi.<br>• **Boundary**: Phụ trách kiểm thử đúng điểm mút biên sát nút (ví dụ: Min 200.000 VNĐ vs Subtotal 199.999 VNĐ - thiếu đúng 1 VNĐ). |
| **Negative** | **Integration** | Khách hàng giảm bớt sản phẩm ở giỏ hàng làm Subtotal < Min Order Value | • **Negative**: Phụ trách hành vi hiển thị thông báo gỡ mã và chặn không cho đặt hàng khi giỏ hàng thiếu điều kiện.<br>• **Integration**: Phụ trách cơ chế re-validate tự động giữa phân hệ Giỏ hàng và trang Thanh toán tại bước chốt đơn. |
| **Negative** | **Security** | Nhập mã sai / không hợp lệ nhiều lần | • **Negative**: Phụ trách luồng lỗi chức năng khi người dùng nhập mã sai 1 hoặc vài lần thông thường và hiển thị đúng thông báo lỗi.<br>• **Security**: Phụ trách cơ chế chống dò quét mã (Rate Limiting) khi nhập sai quá 5 lần/phút dẫn đến tự động khóa tính năng áp mã 10 phút. |
| **Boundary** | **[GIẢ ĐỊNH] Data Integrity** | Áp mã tiền cố định VNĐ có số tiền giảm lớn hơn giá trị tiền hàng | • **Boundary**: Phụ trách xác định ngưỡng mút sàn thanh toán tiền hàng bằng đúng 0 VNĐ (không bị âm tiền).<br>• **[GIẢ ĐỊNH] Data Integrity**: Phụ trách thuật toán phân bổ số tiền chiết khấu 0 VNĐ/thực tế vào từng dòng sản phẩm trong CSDL và quy tắc làm tròn `Math.round` không lệch 1 VNĐ. |
| **Security** | **Integration** | Xử lý tranh chấp lượt dùng mã đồng thời (Concurrency) | • **Security**: Phụ trách kiểm thử khả năng khóa đồng thời (Concurrency locking) giữa 2 request chốt đơn cùng millisecond.<br>• **Integration**: Phụ trách luồng cập nhật và giải phóng trạng thái lượt mã về hệ thống quản lý đơn hàng sau khi giao dịch kết thúc. |
| **UX/Usability** | **Negative** | Hiển thị thông báo lỗi khi áp mã thất bại | • **UX/Usability**: Phụ trách đánh giá vị trí hiển thị, tính minh bạch, trực quan và dễ hiểu của câu chữ thông báo lỗi.<br>• **Negative**: Phụ trách kiểm thử logic phát sinh lỗi đúng nguyên nhân nghiệp vụ và trả về đúng mã lỗi tương ứng. |
| **UX/Usability** | **Accessibility** | Thao tác nhập mã và áp dụng trên giao diện trình duyệt | • **UX/Usability**: Phụ trách giao diện hiển thị responsive chuẩn khung hình, không bị đè vỡ bố cục trên Desktop/Mobile Web.<br>• **Accessibility**: Phụ trách khả năng tương tác bằng bàn phím (Tab/Enter), độ tương phản màu sắc và khả năng zoom 200% màn hình. |
| **Performance** | **UX/Usability** | Tốc độ phản hồi khi bấm nút "Áp dụng" mã | • **Performance**: Phụ trách đo lường chỉ số thời gian phản hồi API Backend và tính toán Client (< 3 giây).<br>• **UX/Usability**: Phụ trách trải nghiệm hiển thị loading spinner trong lúc chờ API phản hồi mà không làm đơ màn hình. |

---

## 5. XÁC NHẬN CHẤT LƯỢNG BÀN GIAO (HANDOVER READINESS)
- [x] Đã lập Chiến lược Độ phủ theo Rủi ro (Likelihood × Impact) và ánh xạ mọi rủi ro ưu tiên cao tới viewpoint.
- [x] Đã chọn đầy đủ mọi viewpoint áp dụng được, không bỏ sót theo rủi ro.
- [x] Toàn bộ tên Viewpoint chuẩn xác theo Registry; các Viewpoint ngoài registry đều có tiền tố `[GIẢ ĐỊNH]`.
- [x] Đã kiểm soát triệt để tính độc lập phạm vi, không trùng lặp In/Out scope.
- [x] Không sinh test idea/test case chi tiết (sẵn sàng chuyển giao cho Step 04).
