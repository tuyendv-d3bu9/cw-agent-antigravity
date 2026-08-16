# BÁO CÁO PHÂN TÍCH VÀ SÀNG LỌC TEST IDEA (STEP 04)

> **Feature**: Áp dụng Mã Giảm Giá (Voucher) - Function D (ShopGo E-Commerce)  
> **Người thực hiện**: Senior QA Test Design Analyst  
> **Bước trong quy trình**: Step 04 (Test Idea Generation & Filtering)  
> **Dữ liệu đầu vào đối soát**: [01_Requirement_Summary_Report.md](OUTPUT/01_Requirement_Summary_Report.md) & [03_QA_Viewpoint_Analyst_Report.md](OUTPUT/03_QA_Viewpoint_Analyst_Report.md)  

---

### BẢNG TỔNG HỢP TEST IDEA & FILTER (STEP 04)

| # | Test Idea | Viewpoint | Giữ/Bỏ | Lý do filter |
|---|---|---|---|---|
| TI-01 | Kiểm tra Khách hàng đăng nhập áp dụng thành công 01 mã giảm giá loại phần trăm (%) còn hạn trên giỏ hàng đủ giá trị tối thiểu và tổng tiền được trừ chính xác. | Happy Path | Giữ | Kiểm tra business rule đã xác định |
| TI-02 | Kiểm tra Khách hàng đăng nhập áp dụng thành công 01 mã giảm giá loại số tiền cố định (VNĐ) còn hạn trên giỏ hàng đủ giá trị tối thiểu và tổng tiền được cập nhật chuẩn xác. | Happy Path | Giữ | Kiểm tra business rule đã xác định |
| TI-03 | Kiểm tra Khách hàng áp dụng đồng thời 02 mã giảm giá hợp lệ trên cùng 01 đơn hàng thành công và tổng chiết khấu được tính toán chính xác. | Happy Path | Giữ | Kiểm tra business rule đã xác định |
| TI-04 | Kiểm tra hệ thống tự động loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi mã giảm giá khi người dùng thực hiện nhập mã. | Happy Path | Giữ | Kiểm tra business rule đã xác định |
| TI-05 | Kiểm tra hệ thống tự động xử lý mã giảm giá không phân biệt chữ hoa hay chữ thường (case-insensitive) khi áp dụng thành công. | Happy Path | Giữ | Kiểm tra business rule đã xác định |
| TI-06 | Kiểm tra giao diện trang Thanh toán hiển thị rõ ràng dòng tiền chiết khấu được giảm và tổng tiền thanh toán mới sau khi áp mã thành công. | Happy Path | Giữ | Viết được expected rõ ràng |
| TI-07 | Kiểm tra đơn hàng hoàn tất thanh toán thành công được ghi nhận chính xác và trạng thái mã giảm giá chuyển sang trạng thái đã sử dụng (USED). | Happy Path | Giữ | Kiểm tra business rule đã xác định |
| TI-08 | Kiểm tra việc áp dụng mã giảm giá loại phần trăm (%) hợp lệ thành công trên đơn hàng chuẩn. | Happy Path | Bỏ | Trùng lặp hoàn toàn |
| TI-09 | Kiểm tra hệ thống từ chối áp dụng và hiển thị thông báo lỗi "Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại." khi nhập mã không tồn tại hoặc sai ký tự. | Negative | Giữ | Kiểm tra business rule đã xác định |
| TI-10 | Kiểm tra hệ thống từ chối áp dụng và hiển thị thông báo lỗi "Mã giảm giá đã hết hạn sử dụng." khi nhập mã đã quá thời hạn theo múi giờ Việt Nam (UTC+7). | Negative | Giữ | Rủi ro cao |
| TI-11 | Kiểm tra hệ thống từ chối áp dụng và hiển thị thông báo lỗi "Mã giảm giá đã hết lượt sử dụng." khi mã đã đạt tới giới hạn tổng số lượt dùng toàn hệ thống. | Negative | Giữ | Rủi ro cao |
| TI-12 | Kiểm tra hệ thống từ chối áp dụng và hiển thị thông báo lỗi "Tài khoản của bạn đã sử dụng hết lượt cho mã giảm giá này." khi người dùng đã dùng hết lượt cho phép. | Negative | Giữ | Kiểm tra business rule đã xác định |
| TI-13 | Kiểm tra hệ thống không áp dụng chiết khấu và hiển thị thông báo lỗi nêu rõ ngưỡng thiếu khi tổng tiền giỏ hàng nhỏ hơn giá trị đơn hàng tối thiểu (Min Order Value). | Negative | Giữ | Kiểm tra business rule đã xác định |
| TI-14 | Kiểm tra hệ thống hiển thị thông báo lỗi inline "Vui lòng nhập mã giảm giá" khi người dùng nhấn nút Áp dụng mà để trống ô nhập mã. | Negative | Giữ | Viết được expected rõ ràng |
| TI-15 | Kiểm tra Khách vãng lai (Guest chưa đăng nhập) bị ngăn chặn truy cập trang Thanh toán và được yêu cầu Đăng nhập hoặc Đăng ký tài khoản khi cố gắng sử dụng mã. | Negative | Giữ | Kiểm tra business rule đã xác định |
| TI-16 | Kiểm tra tài khoản Khách hàng bị khóa (Disabled/Suspended) ở thời điểm giữa lúc áp mã và chốt đơn bị hệ thống tự động gỡ mã và ngăn chặn đặt hàng. | Negative | Giữ | Rủi ro cao |
| TI-17 | Kiểm tra hệ thống tự động re-validate và gỡ mã giảm giá khi người dùng giảm bớt sản phẩm ở giỏ hàng làm Subtotal xuống dưới Min Order Value tại bước chốt đơn. | Negative | Giữ | Kiểm tra business rule đã xác định |
| TI-18 | Kiểm tra lượt mã ở trạng thái PENDING_HOLD tự động được giải phóng về AVAILABLE khi giao dịch thanh toán trực tuyến bị thất bại, hủy bỏ hoặc quá thời gian chờ 15 phút. | Negative | Giữ | Rủi ro cao |
| TI-19 | Kiểm tra hệ thống báo lỗi khi nhập sai ký tự mã giảm giá. | Negative | Bỏ | Trùng lặp hoàn toàn |
| TI-20 | Kiểm tra thao tác khởi tạo mã giảm giá mới phía quản trị viên Admin Back-office. | Negative | Bỏ | Ngoài scope (đối chiếu Out of Scope) |
| TI-21 | Kiểm tra mã giảm giá áp dụng thành công khi tổng tiền giỏ hàng (Subtotal) bằng đúng giá trị đơn hàng tối thiểu (Min Order Value). | Boundary | Giữ | Kiểm tra business rule đã xác định |
| TI-22 | Kiểm tra hệ thống từ chối áp dụng mã giảm giá khi tổng tiền giỏ hàng nhỏ hơn giá trị đơn hàng tối thiểu (Min Order Value) đúng 1 VNĐ. | Boundary | Giữ | Chưa case nào cover |
| TI-23 | Kiểm tra số tiền giảm của mã loại phần trăm (%) bị ép đúng trần tối đa 50.000 VNĐ khi số tiền tính theo phần trăm vượt quá 50.000 VNĐ. | Boundary | Giữ | Kiểm tra business rule đã xác định |
| TI-24 | Kiểm tra tổng tiền giảm của nhiều mã áp dụng đồng thời bị ép không vượt quá trần tối đa 50.000 VNĐ đối với mã loại phần trăm trên cùng 01 đơn hàng. | Boundary | Giữ | Kiểm tra business rule đã xác định |
| TI-25 | Kiểm tra tổng tiền thanh toán sau khi trừ mã giảm giá tiền cố định VNĐ lớn hơn Subtotal được giữ ở mức sàn tối thiểu bằng đúng 0 VNĐ. | Boundary | Giữ | Rủi ro cao |
| TI-26 | Kiểm tra mã giảm giá được áp dụng và chốt đơn thành công vào thời điểm mút cuối cùng 23:59:59 (giờ ICT / UTC+7) của ngày hết hạn. | Boundary | Giữ | Chưa case nào cover |
| TI-27 | Kiểm tra hệ thống từ chối chốt đơn áp mã vào thời điểm mút bắt đầu 00:00:01 (giờ ICT / UTC+7) của ngày tiếp theo ngay sau khi hết hạn. | Boundary | Giữ | Chưa case nào cover |
| TI-28 | Kiểm tra hệ thống cho phép áp dụng tối đa đúng 02 mã giảm giá hợp lệ và ngăn chặn không cho áp dụng mã thứ 03 trên cùng 01 đơn hàng. | Boundary | Giữ | Kiểm tra business rule đã xác định |
| TI-29 | Kiểm tra ô nhập mã giảm giá chấp nhận chuỗi có độ dài tối đa 50 ký tự và ngăn chặn không cho nhập ký tự thứ 51. | Boundary | Giữ | Viết được expected rõ ràng |
| TI-30 | Kiểm tra áp dụng mã phần trăm đối với đơn hàng có số tiền giảm là 0.0000001 VNĐ. | Boundary | Bỏ | Trivial |
| TI-31 | Kiểm tra tính năng áp mã tự động bị khóa trong 15 phút và hiển thị thông báo chặn khi 01 tài khoản hoặc IP bấm Áp dụng mã sai quá 05 lần trong 01 phút. | Security | Giữ | Kiểm tra business rule đã xác định |
| TI-32 | Kiểm tra hệ thống ưu tiên xử lý cho người hoàn thành thanh toán trước khi có tranh chấp lượt dùng cuối và tự động ghi nhận trạng thái mã là (OVER) trong CSDL nếu trùng millisecond. | Security | Giữ | Rủi ro cao |
| TI-33 | Kiểm tra Backend từ chối xử lý request API áp mã từ Khách vãng lai hoặc tài khoản bị khóa và trả về mã lỗi 401 hoặc 403 Unauthorized. | Security | Giữ | Rủi ro cao |
| TI-34 | Kiểm tra hệ thống tự động làm sạch và mã hóa an toàn chuỗi nhập chứa mã độc SQL Injection hoặc Script XSS mà không thực thi mã độc. | Security | Giữ | Viết được expected rõ ràng |
| TI-35 | Kiểm tra khả năng chống tấn công brute force mật khẩu tài khoản quản trị viên hệ thống. | Security | Bỏ | Ngoài scope (đối chiếu Out of Scope) |
| TI-36 | Kiểm tra lượt mã chuyển sang trạng thái tạm giữ PENDING_HOLD trong 15 phút khi người dùng chốt đơn chọn thanh toán trực tuyến qua cổng VNPay hoặc MoMo. | Integration | Giữ | Kiểm tra business rule đã xác định |
| TI-37 | Kiểm tra phân hệ Giỏ hàng tự động gửi thông tin re-validate điều kiện Min Order Value sang bước chốt đơn Thanh toán khi người dùng thay đổi số lượng sản phẩm. | Integration | Giữ | Kiểm tra business rule đã xác định |
| TI-38 | Kiểm tra hệ thống đối soát thời hạn sử dụng mã dựa trên Server Time theo múi giờ ICT (UTC+7) bất kể việc thay đổi thời gian trên thiết bị client. | Integration | Giữ | Rủi ro cao |
| TI-39 | Kiểm tra mã giảm giá đã sử dụng thành công không được khôi phục hay hoàn trả về trạng thái chưa sử dụng khi đơn hàng bị hủy hoặc phát sinh trả hàng. | Integration | Giữ | Kiểm tra business rule đã xác định |
| TI-40 | Kiểm tra việc đồng bộ dữ liệu chiết khấu mã giảm giá sang phân hệ quản lý kho hàng ERP. | Integration | Bỏ | Ngoài scope (đối chiếu Out of Scope) |
| TI-41 | Kiểm tra trang Thanh toán hiển thị rõ ràng số tiền chiết khấu giảm giá dạng số âm và tổng tiền thanh toán mới sau khi áp mã thành công. | UX/Usability | Giữ | Viết được expected rõ ràng |
| TI-42 | Kiểm tra tính năng tự động trim khoảng trắng và không phân biệt chữ hoa hay chữ thường giúp người dùng áp mã thành công mà không bị thông báo lỗi do nhầm lẫn nhập liệu. | UX/Usability | Giữ | Viết được expected rõ ràng |
| TI-43 | Kiểm tra các thông báo phản hồi lỗi phân biệt rõ nguyên nhân cụ thể như hết hạn, hết lượt, không đủ giá trị đơn tối thiểu giúp người dùng dễ dàng hiểu và xử lý. | UX/Usability | Giữ | Viết được expected rõ ràng |
| TI-44 | Kiểm tra giao diện ô nhập mã, nút Áp dụng và dòng tiền giảm hiển thị tương thích cân đối, không bị vỡ bố cục trên cả màn hình Desktop và Mobile Web. | UX/Usability | Giữ | Viết được expected rõ ràng |
| TI-45 | Kiểm tra màu sắc của nút Áp dụng có cảm giác đẹp mắt theo đánh giá cảm tính của cá nhân. | UX/Usability | Bỏ | Mơ hồ không định nghĩa được expected |
| TI-46 | Kiểm tra thời gian xử lý của API kiểm tra điều kiện mã và tính toán chiết khấu phản hồi dưới 3 giây trên các trình duyệt Chrome, Edge và Safari. | Performance | Giữ | Kiểm tra business rule đã xác định |
| TI-47 | Kiểm tra giao diện DOM trang Thanh toán cập nhật lại tổng tiền thanh toán tức thì sau khi API trả kết quả mà không gây treo hay đơ màn hình. | Performance | Giữ | Viết được expected rõ ràng |
| TI-48 | Kiểm tra khả năng chịu tải của hệ thống với 50.000 lượt truy cập áp mã đồng thời trong sự kiện Flash Sale. | Performance | Bỏ | Ngoài scope (đối chiếu Out of Scope) |
| TI-49 | Kiểm tra người dùng có thể di chuyển vào ô nhập mã bằng phím Tab và kích hoạt nút Áp dụng bằng phím Enter hoặc Space mà không cần dùng chuột. | Accessibility | Giữ | Viết được expected rõ ràng |
| TI-50 | Kiểm tra văn bản thông báo lỗi và thông báo thành công có độ tương phản màu sắc đạt chuẩn giúp người dùng dễ đọc. | Accessibility | Giữ | Viết được expected rõ ràng |
| TI-51 | Kiểm tra giao diện ô nhập mã và nút Áp dụng không bị đè khuất hay vỡ khung hình khi thu phóng trình duyệt lên mức 200% trên Chrome, Edge và Safari. | Accessibility | Giữ | Viết được expected rõ ràng |
| TI-52 | Kiểm tra tính năng đáp ứng toàn bộ các tiêu chí kiểm thử truy cập nâng cao quốc tế cho người khiếm thị. | Accessibility | Bỏ | Ngoài scope (đối chiếu Out of Scope) |
| TI-53 | Kiểm tra số tiền giảm giá của mã được hệ thống tự động phân bổ tỷ lệ thuận vào từng sản phẩm (Line Items) trong CSDL đơn hàng. | [GIẢ ĐỊNH] Data Integrity & Financial Accounting | Giữ | Kiểm tra business rule đã xác định |
| TI-54 | Kiểm tra số tiền hoàn lại khi khách hàng trả 01 sản phẩm được tính bằng giá trị sản phẩm đó trừ đi phần chiết khấu đã được phân bổ tương ứng. | [GIẢ ĐỊNH] Data Integrity & Financial Accounting | Giữ | Rủi ro cao |
| TI-55 | Kiểm tra số tiền chiết khấu tính theo phần trăm (%) được làm tròn toán học chuẩn (Math.round) đến hàng đơn vị VNĐ mà không phát sinh số thập phân hay lệch tiền lẻ. | [GIẢ ĐỊNH] Data Integrity & Financial Accounting | Giữ | Rủi ro cao |
| TI-56 | Kiểm tra hệ thống từ chối áp dụng chiết khấu đối với các sản phẩm thuộc danh mục bị đánh dấu loại trừ khuyến mãi. | [GIẢ ĐỊNH] Data Integrity & Financial Accounting | Giữ | Kiểm tra business rule đã xác định |
| TI-57 | Kiểm tra việc đối soát dữ liệu hạch toán kế toán thủ công tại sổ sách back-office. | [GIẢ ĐỊNH] Data Integrity & Financial Accounting | Bỏ | Ngoài scope (đối chiếu Out of Scope) |

---

### BẢNG ĐÁNH GIÁ TỰ AUDIT THỎA MÃN CHUẨN FACT (SELF-AUDIT CHECKLIST)

| Tiêu chuẩn | Tiêu chí Kiểm tra | Kết quả | Ghi chú minh chứng |
|---|---|---|---|
| **F — Faithful** | Test Idea có bám sát Business Rules và Viewpoint từ Step 03 không? | **PASS** | Tất cả 57 Test Idea đều được xây dựng trực tiếp dựa trên Business Rules (BR-01 đến BR-17), Missing Rules (MR-01 đến MR-06) và 9 Viewpoint từ Step 03. |
| **A — Accurate** | Test Idea có diễn đạt chính xác trong 01 câu và lý do filter có trích đúng checklist không? | **PASS** | 100% Test Idea được phát biểu trọn vẹn trong đúng 01 câu đơn duy nhất. Cột `Lý do filter` sử dụng chính xác các cụm từ nguyên văn từ bộ tiêu chí cố định. |
| **C — Complete** | Đã bao phủ toàn bộ các Viewpoint in-scope chưa? | **PASS** | Toàn bộ 9 Viewpoints (8 Viewpoint tiêu chuẩn và 1 Viewpoint [GIẢ ĐỊNH]) đều có danh sách Test Idea bao phủ đầy đủ chiều sâu nghiệp vụ. |
| **T — Testable** | Các ý tưởng được "Giữ" có khả năng xác định kết quả mong đợi (Expected Result) khi expand không? | **PASS** | 48 Test Idea được đánh dấu `Giữ` đều có hành vi và điều kiện đầu ra rõ ràng, sẵn sàng làm tiền đề cho Step 05 mở rộng thành Test Case chi tiết. |
