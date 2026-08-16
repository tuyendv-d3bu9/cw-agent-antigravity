# BÁO CÁO PHÂN TÍCH VIEWPOINT KIỂM THỬ — ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)

> **Feature**: Áp dụng Mã Giảm Giá (Voucher) - Function D (ShopGo E-Commerce)  
> **Người thực hiện**: Senior QA Viewpoint Analyst  
> **Bước trong quy trình**: Step 03 (Xác định & Phân tích Viewpoint Kiểm thử)  
> **Dữ liệu đầu vào đối soát**: [01_Requirement_Summary_Report.md](OUTPUT/01_Requirement_Summary_Report.md) & [02_QA_Missing_Rule_Analyst_Report.md](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md)  

---

## 1. TỔNG QUAN LỰA CHỌN VIEWPOINT THEO RỦI RO

Chiến lược phân tích chất lượng cho tính năng **"Áp dụng Mã Giảm Giá (Voucher)"** được tiếp cận theo phương pháp **Kiểm thử dựa trên rủi ro (Risk-Based Testing)**, đánh giá tổng hợp trên 3 khía cạnh: **Tác động nghiệp vụ (Business Impact)**, **Khả năng xảy ra lỗi (Likelihood)** và **Khả năng phát hiện lỗi (Detectability)**.

Tất cả 8 viewpoint cốt lõi trong thư viện Registry chuẩn ([03_viewpoint-library.md](03_viewpoint-library.md)) đều được áp dụng. Đồng thời, dựa trên các quy tắc nghiệp vụ chuyên sâu về tài chính/kế toán được phát hiện tại Step 02 (MR-05 phân bổ chiết khấu khi trả hàng từng phần và MR-06 quy chuẩn làm tròn tiền tệ), báo cáo bổ sung 01 Viewpoint đặc thù có gắn tiền tố `[GIẢ ĐỊNH]`.

### Bảng tổng hợp các Viewpoint được chọn:

| STT | Tên Viewpoint | Mức độ Rủi ro | Nguồn | Lý do lựa chọn & Trọng tâm kiểm thử |
|:---:|:---|:---:|:---:|:---|
| 1 | **Happy Path** | **High** | Registry | Luồng nghiệp vụ cốt lõi: Khách hàng áp mã phần trăm (%), mã tiền cố định (VNĐ), kết hợp 2 mã thành công, tự động trim khoảng trắng, không phân biệt hoa/thường, tính toán hiển thị tổng tiền mới chính xác. |
| 2 | **Negative** | **High** | Registry | Rủi ro cao về trải nghiệm và thất thoát: Mã không tồn tại, hết hạn UTC+7, hết lượt hệ thống, hết lượt per-user, tài khoản bị khóa, giỏ hàng không đủ Min Order Value, giỏ hàng bị giảm bớt sản phẩm, thanh toán online gián đoạn. |
| 3 | **Boundary** | **High** | Registry | Rủi ro tính toán sai lệch tài chính tại các điểm ngưỡng: Trần giảm giá % (50.000 VNĐ), Min Order Value Subtotal, thời điểm hết hạn mút 23:59:59/00:00:01 ICT, max 2 mã áp dụng, độ dài mã 50 ký tự, sàn tiền hàng 0 VNĐ. |
| 4 | **Security** | **High** | Registry | Nguy cơ tấn công và tranh chấp dữ liệu: Tấn công dò mã tự động (Anti-Brute-Force rate limit 5 lần/phút), tranh chấp lượt dùng cuối cùng trùng millisecond (Concurrency locking & trạng thái `OVER`), bypass phân quyền tài khoản disabled, SQLi/XSS. |
| 5 | **Integration** | **High** | Registry | Rủi ro mất đồng bộ giữa các phân hệ: Voucher Holding 15 phút khi sang Cổng thanh toán VNPay/MoMo & auto release, re-validate giỏ hàng tại bước chốt đơn, đồng bộ múi giờ ICT (UTC+7), quy tắc hủy đơn không hoàn mã. |
| 6 | **UX/Usability** | **Medium** | Registry | Trải nghiệm người dùng tại trang Thanh toán: Hiển thị minh bạch dòng tiền chiết khấu & tổng tiền mới, thông báo lỗi phản hồi rõ ràng theo từng nguyên nhân (MR-02), giao diện responsive mượt mà trên Desktop và Mobile Web. |
| 7 | **Performance** | **Medium** | Registry | Tốc độ phản hồi và trải nghiệm tức thì: Thời gian API kiểm tra & tính toán chiết khấu phản hồi < 3 giây (BR-10), không làm đơ/treo giao diện khi tính lại tổng tiền. *(Lưu ý: Stress test Flash Sale out of scope)*. |
| 8 | **Accessibility** | **Low** | Registry | Khả năng truy cập cơ bản trên Web B2C: Thao tác đầy đủ bằng phím (Tab/Enter), tương phản màu sắc văn bản thông báo lỗi/thành công dễ đọc, đáp ứng hiển thị khi zoom 200% trên Chrome, Edge, Safari. |
| 9 | **[GIẢ ĐỊNH] Data Integrity & Financial Accounting** | **High** | `[GIẢ ĐỊNH]` | Toàn vẹn dữ liệu tài chính & kế toán: Thuật toán phân bổ chiết khấu tỷ lệ thuận vào từng sản phẩm làm căn cứ Partial Refund (MR-05), làm tròn toán học `Math.round` VNĐ (MR-06), loại trừ danh mục sản phẩm không áp mã. |

---

## 2. BẢN ĐẶC TẢ CHI TIẾT CÁC VIEWPOINT

### Viewpoint 01: Happy Path
- **Tên Viewpoint**: `Happy Path`
- **Mục tiêu kiểm thử**: Xác minh luồng nghiệp vụ hợp lệ chuẩn khi Khách hàng đã đăng nhập áp dụng thành công mã giảm giá (dạng phần trăm % hoặc tiền cố định VNĐ), đáp ứng đầy đủ điều kiện giá trị đơn hàng, hạn dùng, số lượt dùng và hoàn tất đặt hàng thành công.
- **Phạm vi bao phủ (In-scope)**:
  - Khách hàng (Customer) đã đăng nhập nhập mã giảm giá loại phần trăm (%) hợp lệ (giỏ hàng đủ Min Order Value, trong hạn UTC+7, còn lượt dùng per-user và lượt hệ thống) [BR-01, BR-03, BR-04, BR-05].
  - Khách hàng áp dụng thành công mã giảm giá loại số tiền cố định (VNĐ) hợp lệ [BR-03].
  - Khách hàng áp dụng đồng thời 02 mã giảm giá hợp lệ trên cùng 01 đơn hàng (ví dụ: 01 mã chiết khấu sản phẩm + 01 mã miễn phí vận chuyển) [BR-13, MR-03].
  - Hệ thống tự động loại bỏ khoảng trắng thừa đầu/cuối chuỗi (trim spaces) và xử lý không phân biệt chữ hoa/chữ thường (case-insensitive) khi người dùng nhập mã [BR-11].
  - Hệ thống tính toán chính xác số tiền chiết khấu và tự động cập nhật giao diện trang Thanh toán: hiển thị rõ dòng tiền giảm và tổng tiền thanh toán mới sau chiết khấu [BR-06].
  - Hoàn tất chốt đơn thanh toán thành công (COD hoặc thanh toán trực tuyến), hệ thống ghi nhận đơn hàng và cập nhật trạng thái mã thành đã sử dụng (`USED`) [BR-16, MR-04].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tất cả các luồng nhập sai mã, mã hết hạn, chưa đủ giá trị tối thiểu *(chuyển sang Viewpoint Negative)*.
  - Kiểm tra các ngưỡng giới hạn mút như trần giảm giá 50.000 VNĐ, giá trị giỏ hàng đúng bằng Min Order Value *(chuyển sang Viewpoint Boundary)*.
  - Kiểm tra dò mã tần suất cao hoặc tranh chấp lượt dùng đồng thời *(chuyển sang Viewpoint Security)*.
- **Rủi ro nếu bỏ qua**: Lỗi luồng chính khiến người dùng không thể áp dụng mã khuyến mãi hoặc hệ thống tính sai tổng tiền thanh toán, trực tiếp gây gián đoạn tỷ lệ chuyển đổi đơn hàng và làm mất uy tín thương hiệu ShopGo.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Đơn giản đến Trung bình**. Tập trung bao phủ các kịch bản áp mã %, mã VNĐ, áp 2 mã kết hợp, tự động trim và case-insensitive trên luồng chuẩn.

---

### Viewpoint 02: Negative
- **Tên Viewpoint**: `Negative`
- **Mục tiêu kiểm thử**: Xác minh khả năng kiểm soát lỗi, xử lý ngoại lệ và hiển thị thông báo phản hồi chính xác khi người dùng thao tác sai, nhập dữ liệu không hợp lệ, tài khoản không đủ quyền hoặc luồng thanh toán bị gián đoạn.
- **Phạm vi bao phủ (In-scope)**:
  - Nhập mã giảm giá không tồn tại trên hệ thống hoặc gõ sai ký tự -> Hiển thị lỗi chuẩn: `"Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."` [BR-07, AF-02, MR-02].
  - Nhập mã giảm giá đã quá hạn sử dụng theo múi giờ Việt Nam (UTC+7) -> Hiển thị lỗi chuẩn: `"Mã giảm giá đã hết hạn sử dụng."` [BR-07, AF-01, MR-02].
  - Nhập mã giảm giá đã hết tổng lượt sử dụng trên toàn hệ thống -> Hiển thị lỗi chuẩn: `"Mã giảm giá đã hết lượt sử dụng."` [BR-16, MR-02].
  - Khách hàng đã dùng hết số lượt cho phép của tài khoản (`max_per_user`) cố tình nhập lại mã đó -> Hiển thị lỗi chuẩn: `"Tài khoản của bạn đã sử dụng hết lượt cho mã giảm giá này."` [MR-01, MR-02].
  - Tổng giá trị tiền hàng giỏ hàng (Subtotal) nhỏ hơn Min Order Value -> Hiển thị lỗi chuẩn nêu rõ ngưỡng thiếu [AF-03, BR-04, MR-02, MR-03].
  - Nhấn nút "Áp dụng" khi ô nhập mã để trống chuỗi -> Hiển thị thông báo lỗi inline: `"Vui lòng nhập mã giảm giá"` [MR-02].
  - Khách vãng lai (Guest chưa đăng nhập) cố gắng truy cập trang Thanh toán để nhập mã -> Hệ thống ngăn chặn và yêu cầu Đăng nhập/Đăng ký [BR-02, AF-04].
  - Tài khoản Khách hàng bị khóa/đình chỉ (`Disabled/Suspended`) ở thời điểm giữa lúc áp mã thành công và chốt đơn -> Hệ thống tự gỡ mã và chặn đặt hàng [MR-01].
  - Khách hàng quay lại giỏ hàng giảm số lượng sản phẩm làm Subtotal xuống dưới Min Order Value -> Hệ thống tự động re-validate, gỡ mã giảm giá và báo lỗi khi chốt đơn [AF-05, BR-17].
  - Giao dịch thanh toán trực tuyến (VNPay/MoMo) bị thất bại, người dùng hủy giữa chừng hoặc quá thời gian chờ (timeout 15 phút) -> Hệ thống hủy đơn Pending và tự động nhả trạng thái lượt mã về `AVAILABLE` [MR-04].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra giá trị biên chính xác tại điểm mút (1 VNĐ, mút thời gian 1 giây) *(chuyển sang Viewpoint Boundary)*.
  - Kiểm tra tấn công dò quét mã tự động tần suất cao *(chuyển sang Viewpoint Security)*.
- **Rủi ro nếu bỏ qua**: Hệ thống cho phép áp dụng mã sai/mã hết hạn/mã vượt lượt gây thất thoát ngân sách khuyến mãi nghiêm trọng, hoặc hiển thị thông báo lỗi mập mờ làm trải nghiệm khách hàng tồi tệ.
- **Ước lượng định tính Test Idea**: **Mật độ: Cao | Độ phức tạp: Trung bình**. Bao phủ tập hợp đa dạng các ngoại lệ nghiệp vụ, lỗi dữ liệu input, lỗi trạng thái tài khoản và luồng hủy/timeout.

---

### Viewpoint 03: Boundary
- **Tên Viewpoint**: `Boundary`
- **Mục tiêu kiểm thử**: Phân tích và kiểm thử các giá trị mút/ngưỡng giới hạn (Boundary Values) về số tiền, phần trăm chiết khấu, mút thời gian, số lượng mã và độ dài ký tự để đảm bảo hệ thống xử lý chính xác tuyệt đối không gây sai số tài chính.
- **Phạm vi bao phủ (In-scope)**:
  - Ngưỡng Min Order Value (Subtotal): Giá trị giỏ hàng bằng đúng Min Order Value (ví dụ: Min 200.000 VNĐ, Subtotal = 200.000 VNĐ - Áp thành công) vs Subtotal nhỏ hơn 1 VNĐ (199.999 VNĐ - Bị từ chối) [BR-04, MR-03].
  - Trần giảm giá phần trăm (Max Discount Cap): Tổng tiền giảm tính theo phần trăm (%) vượt 50.000 VNĐ (ví dụ: giảm 10% đơn 1.000.000 VNĐ = 100.000 VNĐ) -> Hệ thống ép trần số tiền giảm đúng 50.000 VNĐ [BR-12].
  - Trần giảm giá phần trăm khi áp đồng thời nhiều mã: Tổng tiền giảm theo % của nhiều mã vượt 50.000 VNĐ -> Hệ thống vẫn đảm bảo tổng chiết khấu không vượt trần 50.000 VNĐ [BR-13].
  - Sàn thanh toán tiền hàng (Discount Floor): Mã giảm tiền cố định VNĐ lớn hơn hoặc bằng Subtotal (ví dụ: mã giảm 50.000 VNĐ trên giỏ hàng 40.000 VNĐ) -> Tổng tiền hàng sau giảm bằng đúng `0 VNĐ` (không bị âm < 0 VNĐ) [MR-03].
  - Ngưỡng mút thời hạn sử dụng mã theo múi giờ ICT (UTC+7): Chốt đơn vào thời điểm 23:59:59 (còn hạn - Áp thành công) vs 00:00:01 ngày tiếp theo (hết hạn - Từ chối) [BR-05, BR-14].
  - Ngưỡng giới hạn số lượng mã áp dụng đồng thời: Áp 2 mã (hợp lệ) vs cố gắng áp mã thứ 3 trên cùng 01 đơn hàng (Hệ thống chặn không cho nhập/áp dụng) [MR-03].
  - Giới hạn độ dài ô nhập mã: Nhập chuỗi độ dài 1 ký tự, 50 ký tự (hợp lệ) vs 51 ký tự (Bị chặn/không cho nhập thêm) [MR-02].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Luồng nhập sai mã hoặc mã không tồn tại thông thường *(chuyển sang Viewpoint Negative)*.
  - Tranh chấp lượt dùng mã đồng thời giữa 2 tài khoản *(chuyển sang Viewpoint Security)*.
- **Rủi ro nếu bỏ qua**: Lỗi tràn tiền (giảm giá âm tiền hàng), vượt trần chiết khấu 50k làm bù lỗ doanh thu, hoặc sai lệch mút thời gian cho phép người dùng trục lợi mã đã hết hạn.
- **Ước lượng định tính Test Idea**: **Mật độ: Cao | Độ phức tạp: Phức tạp**. Tập trung thiết kế các kịch bản kiểm thử tại các điểm mút biên số tiền, mút thời gian ICT, mút độ dài chuỗi và mút số lượng mã.

---

### Viewpoint 04: Security
- **Tên Viewpoint**: `Security`
- **Mục tiêu kiểm thử**: Đánh giá an toàn thông tin, bảo mật truy cập phân quyền, khả năng chống tấn công dò mã tự động (Anti-Brute-Force) và tính toàn vẹn dữ liệu khi xử lý tranh chấp đồng thời (Concurrency Locking).
- **Phạm vi bao phủ (In-scope)**:
  - Giới hạn tần suất thử mã (Rate Limiting / Anti-Brute-Force): 1 Tài khoản / IP bấm nút "Áp dụng" mã sai quá 05 lần trong 01 phút -> Hệ thống tự động khóa tính năng áp mã trong 15 phút và hiển thị thông báo chặn [MR-06].
  - Tranh chấp lượt dùng cuối cùng (Concurrency Locking): 2 người dùng đồng thời bấm "Đặt hàng" cho lượt dùng cuối của mã -> Hệ thống ưu tiên cho người hoàn thành thanh toán trước; trường hợp trùng millisecond -> hệ thống vẫn chấp nhận đơn nhưng ghi nhận trạng thái mã là `(OVER)` trong CSDL để đối soát [BR-16].
  - Kiểm soát phân quyền (Bypass Authorization): Cố tình gửi request API áp mã từ Khách vãng lai hoặc tài khoản đang ở trạng thái bị khóa (`Disabled/Suspended`) -> Backend từ chối xử lý và trả về lỗi 401/403 Unauthorized.
  - Làm sạch dữ liệu đầu vào (Input Sanitization): Nhập chuỗi mã chứa các đoạn mã độc SQL Injection, XSS, HTML/Script Injection (ví dụ: `' OR '1'='1`, `<script>alert(1)</script>`) -> Hệ thống mã hóa/làm sạch an toàn, không thực thi mã độc.
- **Phạm vi loại trừ (Out-of-scope)**:
  - Phân quyền màn hình Back-office Admin/CSKH tạo và quản lý mã *(Out of scope chung của feature)*.
  - Kiểm thử an toàn hạ tầng mạng, chứng chỉ SSL/TLS hoặc tấn công DDoS quy mô hạ tầng.
- **Rủi ro nếu bỏ qua**: Hệ thống bị kẻ xấu dùng Bot dò quét mã khuyến mãi nội bộ/VIP, xảy ra lỗi Race Condition làm thất thoát vượt quá tổng số lượt mã quy định, hoặc bị khai thác lỗ hổng bảo mật Web.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Phức tạp**. Đòi hỏi kỹ thuật giả lập concurrency, giả lập rate limit và chèn script bảo mật để kiểm tra.

---

### Viewpoint 05: Integration
- **Tên Viewpoint**: `Integration`
- **Mục tiêu kiểm thử**: Kiểm tra tính tương thích, khả năng tích hợp và đồng bộ trạng thái dữ liệu chính xác giữa tính năng áp mã tại trang Thanh toán với các phân hệ Cổng thanh toán online, Giỏ hàng, Server Time ICT và Quản lý đơn hàng.
- **Phạm vi bao phủ (In-scope)**:
  - Tích hợp Cổng thanh toán trực tuyến (VNPay/MoMo/Thẻ): Khi người dùng chốt đơn chọn thanh toán online, lượt mã chuyển sang trạng thái tạm giữ `PENDING_HOLD` trong 15 phút. Nếu thanh toán thất bại/hủy/timeout -> hệ thống tự động nhả trạng thái lượt mã về `AVAILABLE` [MR-04].
  - Tích hợp Giỏ hàng (Cart Service): Người dùng quay lại giỏ hàng thay đổi số lượng/bớt sản phẩm -> Hệ thống tự động re-validate điều kiện Min Order Value (Subtotal) và gỡ mã nếu không còn đủ điều kiện tại bước chốt đơn [BR-17].
  - Tích hợp Múi giờ hệ thống (Server Time ICT / UTC+7): Thời hạn mã được đối soát chính xác theo giờ Server Việt Nam, không phụ thuộc vào múi giờ local trên thiết bị của người dùng (ví dụ client chỉnh lại giờ thiết bị) [BR-14].
  - Tích hợp Quản lý đơn hàng & Trả hàng (Order Management System): Mã giảm giá đã áp dụng thành công không được khôi phục hay hoàn trả về trạng thái "chưa sử dụng" khi đơn hàng bị hủy hoặc phát sinh trả hàng [BR-15].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tích hợp hệ thống quản lý kho hàng Warehouse hoặc ERP bên ngoài *(Out of scope chung của feature)*.
  - Quy trình xử lý đối soát thủ công các mã `(OVER)` phía Back-office Admin *(Out of scope chung của feature)*.
- **Rủi ro nếu bỏ qua**: Lượt mã bị treo vĩnh viễn (phantom lock) khi thanh toán online bị lỗi, người dùng lợi dụng đổi giờ thiết bị để dùng mã hết hạn, hoặc mã bị gỡ sai lúc chốt đơn gây tranh chấp với khách hàng.
- **Ước lượng định tính Test Idea**: **Mật độ: Cao | Độ phức tạp: Phức tạp**. Bao phủ các kịch bản tương tác đa hệ thống giữa Client, Server, Payment Gateway và Cart Service.

---

### Viewpoint 06: UX/Usability
- **Tên Viewpoint**: `UX/Usability`
- **Mục tiêu kiểm thử**: Đánh giá trải nghiệm người dùng, tính minh bạch trong hiển thị thông tin chiết khấu, tính dễ hiểu của các phản hồi thông báo lỗi và khả năng tương thích giao diện trên các thiết bị.
- **Phạm vi bao phủ (In-scope)**:
  - Minh bạch thông tin chiết khấu: Trang Thanh toán hiển thị rõ ràng số tiền được giảm (dạng `- XX.XXX VNĐ`) và tổng tiền thanh toán mới sau khi áp mã thành công [BR-06].
  - Trải nghiệm nhập liệu thuận tiện: Tự động trim khoảng trắng đầu/cuối và xử lý case-insensitive giúp người dùng không bị báo lỗi vô lý do gõ nhầm chữ hoa/thường hoặc lỡ tay cách khoảng [BR-11].
  - Tính rõ ràng của thông báo lỗi: Phản hồi thông báo lỗi chi tiết, phân biệt rõ nguyên nhân (mã hết hạn, hết lượt, không đủ Min Order Value, ô nhập trống) giúp người dùng biết cách xử lý [MR-02].
  - Hiển thị tương thích Responsive: Giao diện ô nhập mã, nút "Áp dụng", vị trí dòng giảm giá hiển thị cân đối, không bị đè vỡ bố cục trên cả màn hình Desktop và Mobile Web [BR-10].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Thiết kế ứng dụng di động bản lề Native App iOS / Android *(Out of scope chung của feature)*.
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
- **Rủi ro nếu bỏ qua**: API phản hồi chậm làm màn hình thanh toán bị quay spinnner lâu (> 3 giây), khiến người dùng tưởng hệ thống lỗi và bấm thao tác lặp lại nhiều lần.
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
  - Quy chuẩn làm tròn tiền tệ (`Math.round`): Số tiền chiết khấu tính theo phần trăm (%) được làm tròn toán học chuẩn đến hàng đơn vị VNĐ, không làm phát sinh số thập phân hay lệch tiền lẻ (1 VNĐ) giữa Frontend, Backend và CSDL [BR-08, MR-06].
  - Danh mục sản phẩm loại trừ: Kiểm tra hệ thống từ chối áp dụng mã chiết khấu đối với các sản phẩm thuộc danh mục bị Admin đánh dấu "Loại trừ khuyến mãi" [MR-05].
- **Phạm vi loại trừ (Out-of-scope)**:
  - Quy trình hạch toán sổ sách kế toán tổng hợp trên phần mềm ERP bên ngoài *(Out of scope chung của feature)*.
- **Rủi ro nếu bỏ qua**: Sai lệch tiền lẻ 1 VNĐ giữa báo cáo và cổng thanh toán, không thể tính tiền hoàn trả chính xác khi khách trả 1 sản phẩm gây tranh chấp khiếu nại tài chính.
- **Ước lượng định tính Test Idea**: **Mật độ: Trung bình | Độ phức tạp: Phức tạp**. Đòi hỏi kiểm tra chính xác công thức toán học phân bổ dữ liệu và làm tròn tiền tệ trên từng item trong CSDL.

---

## 3. MA TRẬN ĐỐI SOÁT RANH GIỚI PHẠM VI (ZERO-OVERLAP MATRIX)

Để đảm bảo các Viewpoint phân tách ranh giới hoàn toàn độc lập (Mutually Exclusive), không bị trùng lặp In-scope / Out-of-scope, ma trận dưới đây quy định rõ điểm phân định trách nhiệm kiểm thử giữa các cặp Viewpoint có nguy cơ giao thoa:

| Viewpoint A | Viewpoint B | Điểm có nguy cơ giao thoa | Ranh giới phân định rõ ràng (In/Out Scope Separation) |
|:---|:---|:---|:---|
| **Happy Path** | **Boundary** | Áp dụng mã phần trăm (%) có tổng tiền giảm lớn hơn 50.000 VNĐ | • **Happy Path**: Phụ trách kiểm thử luồng áp mã % thành công với số tiền giảm nằm trong khoảng bình thường (< 50.000 VNĐ).<br>• **Boundary**: Phụ trách kiểm thử chính xác tại ngưỡng mút biên trần 50.000 VNĐ (ví dụ: đơn 600.000 VNĐ giảm 10% = 60.000 VNĐ -> ép trần đúng 50.000 VNĐ). |
| **Happy Path** | **Integration** | Nhập mã hợp lệ và chốt đơn chọn thanh toán trực tuyến VNPay/MoMo | • **Happy Path**: Phụ trách luồng áp mã thành công và tính toán số tiền giảm hiển thị trên giao diện.<br>• **Integration**: Phụ trách chuyển đổi trạng thái `PENDING_HOLD` 15 phút của lượt mã khi chuyển sang cổng thanh toán và nhả về `AVAILABLE` nếu hủy. |
| **Negative** | **Boundary** | Nhập mã khi giá trị giỏ hàng nhỏ hơn Min Order Value | • **Negative**: Phụ trách kiểm thử trường hợp tổng tiền hàng nhỏ hơn rõ rệt so với Min Order Value (ví dụ: Min 200k nhưng giỏ hàng 100k) và hiển thị câu thông báo lỗi.<br>• **Boundary**: Phụ trách kiểm thử đúng điểm mút biên sát nút (ví dụ: Min 200.000 VNĐ vs Subtotal 199.999 VNĐ - thiếu đúng 1 VNĐ). |
| **Negative** | **Integration** | Khách hàng giảm bớt sản phẩm ở giỏ hàng làm Subtotal < Min Order Value | • **Negative**: Phụ trách hành vi hiển thị thông báo gỡ mã và chặn không cho đặt hàng khi giỏ hàng thiếu điều kiện.<br>• **Integration**: Phụ trách cơ chế re-validate tự động giữa phân hệ Giỏ hàng và trang Thanh toán tại bước chốt đơn. |
| **Negative** | **Security** | Nhập mã sai / không hợp lệ nhiều lần | • **Negative**: Phụ trách luồng lỗi chức năng khi nhập mã sai 1 hoặc vài lần thông thường và hiển thị đúng thông báo lỗi.<br>• **Security**: Phụ trách cơ chế chống dò quét mã (Rate Limiting) khi nhập sai quá 5 lần/phút dẫn đến tự động khóa tính năng áp mã 15 phút. |
| **Boundary** | **[GIẢ ĐỊNH] Data Integrity** | Áp mã tiền cố định VNĐ có số tiền giảm lớn hơn giá trị tiền hàng | • **Boundary**: Phụ trách xác định ngưỡng mút sàn thanh toán tiền hàng bằng đúng 0 VNĐ (không bị âm tiền).<br>• **[GIẢ ĐỊNH] Data Integrity**: Phụ trách thuật toán phân bổ số tiền chiết khấu 0 VNĐ/thực tế vào từng dòng sản phẩm trong CSDL và quy tắc làm tròn `Math.round` không lệch 1 VNĐ. |
| **Security** | **Integration** | Xử lý tranh chấp lượt dùng mã cuối cùng (Concurrency) | • **Security**: Phụ trách kiểm thử khả năng khóa đồng thời (Concurrency locking) giữa 2 request chốt đơn cùng millisecond và ghi nhận trạng thái `(OVER)`.<br>• **Integration**: Phụ trách luồng cập nhật trạng thái lượt mã về hệ thống quản lý đơn hàng sau khi tranh chấp được giải quyết. |
| **UX/Usability** | **Negative** | Hiển thị thông báo lỗi khi áp mã thất bại | • **UX/Usability**: Phụ trách đánh giá vị trí hiển thị, tính minh bạch, trực quan và dễ hiểu của câu chữ thông báo lỗi.<br>• **Negative**: Phụ trách kiểm thử logic phát sinh lỗi đúng nguyên nhân nghiệp vụ và trả về đúng mã lỗi tương ứng. |
| **UX/Usability** | **Accessibility** | Thao tác nhập mã và áp dụng trên giao diện trình duyệt | • **UX/Usability**: Phụ trách giao diện hiển thị responsive chuẩn khung hình, không bị đè vỡ bố cục trên Desktop/Mobile Web.<br>• **Accessibility**: Phụ trách khả năng tương tác bằng bàn phím (Tab/Enter), độ tương phản màu sắc và khả năng zoom 200% màn hình. |
| **Performance** | **UX/Usability** | Tốc độ phản hồi khi bấm nút "Áp dụng" mã | • **Performance**: Phụ trách đo lường chỉ số thời gian phản hồi API Backend và tính toán Client (< 3 giây).<br>• **UX/Usability**: Phụ trách trải nghiệm hiển thị loading indicator/spinner trong lúc chờ API phản hồi mà không làm đơ màn hình. |

---

## 4. BẢNG TỰ ĐÁNH GIÁ TIÊU CHUẨN FACT (SELF-AUDIT CHECKLIST)

| Tiêu chuẩn | Tiêu chí Kiểm tra (Checkpoints) | Tự đánh giá | Luận điểm kiểm chứng |
|:---|:---|:---:|:---|
| **F — Faithful** | • Bám sát toàn bộ phạm vi nghiệp vụ từ Step 01 và quy tắc biên từ Step 02.<br>• Giữ đúng định nghĩa bản chất của từng viewpoint trong registry. | **PASS** | Tất cả In-scope/Out-of-scope đều trích dẫn trực tiếp các mã BR-01 đến BR-17 và MR-01 đến MR-06. 8 viewpoint chuẩn giữ nguyên nguyên văn tên từ Registry. |
| **A — Accurate** | • Tên viewpoint đúng nguyên văn registry chuẩn; đánh dấu `[GIẢ ĐỊNH]` chính xác.<br>• Phân định ranh giới In/Out scope rõ ràng, không mập mờ, không trùng lặp. | **PASS** | Viewpoint 01-08 dùng 100% tên chuẩn. Viewpoint 09 được đánh dấu `[GIẢ ĐỊNH]` rõ ràng. Bảng Zero-Overlap Matrix giải quyết triệt để 10 điểm giao thoa tiềm ẩn. |
| **C — Complete** | • Mô tả đầy đủ 6 trường thông tin cho từng viewpoint được chọn.<br>• Chọn toàn diện mọi góc nhìn cần thiết cho tính năng theo rủi ro.<br>• Sử dụng chuẩn diễn đạt định tính hoàn toàn, không có quota con số. | **PASS** | Đã cấu trúc đủ 6 trường thông tin cho cả 9 viewpoint. Tất cả ước lượng Test Idea đều dùng định tính (Cao/Trung bình/Thấp; Đơn giản/Phức tạp), tuyệt đối không dùng con số quota. |
| **T — Testable** | • Mục tiêu và phạm vi In-scope đủ rõ ràng để làm đầu vào trực tiếp sinh Test Idea ở Step 04.<br>• Ma trận đối soát ranh giới xác minh được tính tách biệt của các góc nhìn. | **PASS** | Phạm vi In-scope mô tả cụ thể điều kiện đầu vào và kết quả mong đợi, sẵn sàng để Step 04 sinh Test Idea chi tiết mà không bị chồng chéo. |

---

## 5. XÁC NHẬN CHẤT LƯỢNG BÀN GIAO (HANDOVER READINESS)

- [x] **Tính bao phủ rủi ro**: Đã chọn đầy đủ 9 viewpoint (8 Registry + 1 GIẢ ĐỊNH), không bỏ sót bất kỳ góc nhìn rủi ro nào của tính năng áp mã giảm giá.
- [x] **Chuẩn hóa danh xưng**: Toàn bộ tên Viewpoint chuẩn xác 100% theo Registry; Viewpoint bổ sung có tiền tố `[GIẢ ĐỊNH]` kèm phân tích lý do kỹ thuật/nghiệp vụ rõ ràng.
- [x] **Độc lập phạm vi**: Đã kiểm soát triệt để tính độc lập phạm vi qua Zero-Overlap Matrix, không trùng lặp In/Out scope giữa các viewpoint.
- [x] **Định tính hoàn toàn**: Không chứa bất kỳ con số quota cứng hay số lượng test case ước tính cụ thể nào.
- [x] **Sẵn sàng chuyển giao**: Không sinh test idea hay test case chi tiết ở bước này. Hồ sơ đặc tả sẵn sàng bàn giao làm đầu vào trực tiếp cho **Step 04 (Senior QA Test Design Analyst)**.
