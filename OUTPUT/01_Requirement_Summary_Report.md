# REQUIREMENT SUMMARY REPORT

**Dạng tài liệu nhận diện**: Prose Document (Tài liệu mô tả nghiệp vụ kết hợp Tổng quan hệ thống và Chi tiết tính năng)

---

## 1. FEATURE OVERVIEW
Tính năng **"Áp dụng Mã Giảm Giá (Voucher)"** (Function D) cho phép Khách hàng nhập mã khuyến mãi tại bước Thanh toán của hệ thống thương mại điện tử ShopGo để hưởng ưu đãi chiết khấu (theo phần trăm hoặc tiền cố định VNĐ), giúp tiết kiệm chi phí mua sắm và tối ưu hóa trải nghiệm đặt hàng trực tuyến.

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản; có quyền truy cập trang Thanh toán, nhập mã giảm giá, xem kết quả chiết khấu và hoàn tất đơn hàng.
- **Khách vãng lai (Guest)**: Người dùng chưa đăng nhập; có thể xem sản phẩm và giỏ hàng nhưng bắt buộc phải đăng nhập (trở thành Customer) tại bước Thanh toán mới có thể sử dụng tính năng áp dụng mã giảm giá.
- **Nhân viên CSKH / Admin**: Người quản lý back-office thực hiện tạo, thiết lập điều kiện và quản lý danh mục mã giảm giá (thuộc phạm vi bối cảnh hệ thống).
- **Hệ thống (System)**: Tác nhân ngầm định chịu trách nhiệm kiểm tra điều kiện mã (loại mã, hạn dùng, giá trị đơn hàng tối thiểu), tính toán số tiền được giảm và tự động cập nhật tổng tiền thanh toán hiển thị cho người dùng.

## 3. BUSINESS RULES
- BR-01: Tính năng áp dụng mã giảm giá được tích hợp tại trang Thanh toán (bước Thanh toán thuộc nhóm tính năng E) với vị trí ô nhập "Mã giảm giá" và nút "Áp dụng".
- BR-02: Khách vãng lai bắt buộc phải đăng nhập hệ thống khi thực hiện thanh toán mới có thể áp dụng mã giảm giá.
- BR-03: Hệ thống hỗ trợ 02 hình thức giảm giá: giảm theo tỷ lệ phần trăm (%) và giảm số tiền cố định (VNĐ).
- BR-04: Mã giảm giá chỉ áp dụng thành công khi tổng giá trị đơn hàng đạt hoặc vượt mức giá trị tối thiểu (min order value) quy định của mã đó.
- BR-05: Mỗi mã giảm giá đều được cấu hình ngày hết hạn cụ thể.
- BR-06: Khi áp dụng mã giảm giá thành công, hệ thống phải hiển thị rõ số tiền được giảm và cập nhật tổng tiền thanh toán mới sau khi trừ chiết khấu.
- BR-07: Khi mã giảm giá không hợp lệ hoặc đã quá ngày hết hạn, hệ thống không áp dụng chiết khấu và phải hiển thị thông báo lỗi tương ứng cho người dùng.
- BR-08: Đơn vị tiền tệ hiển thị và tính toán giao dịch trên toàn hệ thống là VNĐ, được làm tròn theo quy ước hiển thị.
- BR-09: Ngôn ngữ hiển thị giao diện và các câu thông báo phản hồi của tính năng là tiếng Việt.
- BR-10: Giao diện tính năng phải đáp ứng hiển thị tương thích responsive trên cả Desktop và Mobile Web, đảm bảo thời gian tải trang chính dưới 3 giây trên các trình duyệt được hỗ trợ (Chrome, Edge, Safari).
- BR-11 *(Bổ sung từ Q1)*: Ô nhập mã giảm giá tự động cắt bỏ khoảng trắng thừa ở đầu/cuối chuỗi (trim spaces) và xử lý không phân biệt chữ hoa, chữ thường (case-insensitive).
- BR-12 *(Bổ sung từ Q2)*: Mức chiết khấu tối đa (trần giảm giá / Max discount cap) cho các mã giảm giá loại phần trăm (%) là 50.000 VNĐ.
- BR-13 *(Bổ sung từ Q3)*: Hệ thống cho phép áp dụng đồng thời nhiều mã giảm giá trên cùng 01 đơn hàng, tổng số tiền chiết khấu vẫn phải tuân thủ trần giảm giá tối đa (50.000 VNĐ đối với phần trăm).
- BR-14 *(Bổ sung từ Q4)*: Kiểm tra thời hạn sử dụng của mã giảm giá dựa trên thời điểm người dùng hoàn tất thanh toán (chốt đơn) theo múi giờ Việt Nam (ICT / UTC+7) để tránh trường hợp áp dụng mã đã hết hạn.
- BR-15 *(Bổ sung từ Q5)*: Mã giảm giá đã áp dụng sử dụng không được khôi phục hoặc hoàn trả lại trạng thái "chưa sử dụng" cho khách hàng khi đơn hàng bị hủy hoặc phát sinh trả hàng.
- BR-16 *(Bổ sung từ Q6)*: Mã giảm giá có quy định giới hạn số lần sử dụng. Khi có tranh chấp lượt dùng đồng thời giữa nhiều người dùng, hệ thống ưu tiên xử lý cho người hoàn thành thanh toán trước; trường hợp trùng thời gian áp dụng và hoàn thành thanh toán, hệ thống vẫn chấp nhận áp mã nhưng ghi nhận trạng thái mã là `(OVER)` trong hệ thống để phục vụ đối soát.
- BR-17 *(Bổ sung từ Q7)*: Trường hợp khách hàng chỉnh sửa giỏ hàng làm tổng tiền giảm xuống dưới mức giá trị đơn tối thiểu (Min Order Value) sau khi áp mã thành công, hệ thống tự động kiểm tra lại và hủy áp dụng mã giảm giá tại bước xác nhận chốt đơn.

## 4. HAPPY PATH
1. Khách hàng (đã đăng nhập) tiến hành chuyển sang trang Thanh toán với giỏ hàng có tổng giá trị đạt/vượt mức giá trị đơn hàng tối thiểu (min order value) của mã giảm giá.
2. Khách hàng nhập mã giảm giá (không phân biệt hoa/thường, tự động trim khoảng trắng) vào ô "Mã giảm giá".
3. Khách hàng nhấn nút "Áp dụng".
4. Hệ thống kiểm tra điều kiện mã: xác nhận mã hợp lệ, còn hạn sử dụng (theo giờ Việt Nam UTC+7) và giá trị đơn hàng thỏa mãn điều kiện tối thiểu.
5. Hệ thống thực hiện tính toán số tiền chiết khấu (theo % có áp trần tối đa 50.000 VNĐ hoặc theo tiền cố định VNĐ), cho phép kết hợp nhiều mã nếu thỏa mãn.
6. Hệ thống cập nhật giao diện trang Thanh toán: hiển thị chính xác số tiền được giảm và tổng tiền thanh toán mới đã được trừ chiết khấu.

## 5. ALTERNATE FLOWS
### AF-01: Áp dụng mã giảm giá đã hết hạn
1. Khách hàng nhập mã giảm giá đã quá ngày hết hạn vào ô "Mã giảm giá" tại trang Thanh toán.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống đối soát thời điểm với hạn mã theo múi giờ Việt Nam (UTC+7) và xác định mã đã hết hạn.
4. Hệ thống không thực hiện giảm giá, giữ nguyên tổng tiền đơn hàng ban đầu và hiển thị thông báo lỗi báo mã giảm giá đã hết hạn.

### AF-02: Áp dụng mã giảm giá không hợp lệ (Không tồn tại / Sai ký tự)
1. Khách hàng nhập mã giảm giá không tồn tại trên hệ thống hoặc nhập sai ký tự vào ô "Mã giảm giá".
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống tra cứu CSDL và không tìm thấy thông tin mã giảm giá hợp lệ.
4. Hệ thống không thực hiện giảm giá, giữ nguyên tổng tiền đơn hàng ban đầu và hiển thị thông báo lỗi báo mã giảm giá không hợp lệ.

### AF-03: Giá trị đơn hàng chưa đạt mức tối thiểu (Min Order Value)
1. Khách hàng nhập mã giảm giá vào ô "Mã giảm giá" khi tổng giá trị các sản phẩm trong giỏ hàng nhỏ hơn mức giá trị tối thiểu do mã quy định.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống kiểm tra tổng giá trị đơn hàng với điều kiện giá trị đơn tối thiểu của mã và phát hiện chưa đủ điều kiện.
4. Hệ thống không áp dụng chiết khấu, giữ nguyên tổng tiền đơn hàng và hiển thị thông báo lỗi nêu rõ giá trị đơn hàng chưa đạt mức tối thiểu.

### AF-04: Khách vãng lai (Guest) chưa đăng nhập cố gắng thanh toán và dùng mã
1. Khách vãng lai nhấn chuyển sang bước Thanh toán từ giỏ hàng.
2. Hệ thống phát hiện người dùng chưa thực hiện đăng nhập tài khoản.
3. Hệ thống yêu cầu người dùng thực hiện Đăng nhập / Đăng ký tài khoản trước khi tiếp tục truy cập trang Thanh toán để nhập mã giảm giá và hoàn tất đơn hàng.

### AF-05: Giỏ hàng bị thay đổi xuống dưới mức giá trị đơn hàng tối thiểu sau khi áp mã thành công
1. Khách hàng áp dụng mã giảm giá thành công tại trang Thanh toán.
2. Khách hàng quay lại giỏ hàng giảm số lượng sản phẩm khiến tổng giá trị đơn hàng thấp hơn Min Order Value của mã.
3. Khách hàng thực hiện chốt đơn thanh toán.
4. Hệ thống tự động re-validate, phát hiện đơn hàng không đủ điều kiện tối thiểu, tự động gỡ bỏ mã giảm giá và thông báo cập nhật lại tổng tiền.

## 6. OUT OF SCOPE
- Chức năng khởi tạo, chỉnh sửa, thiết lập điều kiện hoặc xóa mã giảm giá ở phía Admin/CSKH Back-office.
- Quy trình xử lý đối soát thủ công các mã có trạng thái `(OVER)` ở hệ thống Back-office.
- Tích hợp dữ liệu khuyến mãi với hệ thống quản lý kho (Warehouse) hoặc hệ thống ERP bên ngoài.
- Kiểm thử hiệu năng chịu tải cao (Load test / Stress test) khi số lượng truy cập áp mã tăng đột biến (ví dụ: săn Flash Sale).
- Ứng dụng di động bản lề (Native App cho iOS / Android).

## 7. OPEN QUESTIONS (Đã xác nhận)
- **Q1 (What if input)**: Khi người dùng nhập mã giảm giá, hệ thống có tự động loại bỏ khoảng trắng thừa ở đầu/cuối chuỗi (trim spaces) và không phân biệt chữ hoa chữ thường (case-insensitive) hay yêu cầu nhập chính xác tuyệt đối?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Có. Hệ thống tự động trim khoảng trắng thừa đầu/cuối và xử lý không phân biệt chữ hoa/chữ thường (case-insensitive).
- **Q2 (What if data)**: Đối với mã giảm giá loại phần trăm (%), hệ thống có áp đặt trần giảm giá tối đa (Max discount cap) hay không? Nếu số tiền giảm lớn hơn hoặc bằng giá trị đơn hàng (giảm 100%), tổng tiền thanh toán mới có bị âm không hay quy định sàn tối thiểu là 0 VNĐ?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Có. Hệ thống áp đặt trần giảm giá tối đa cho mã phần trăm là 50.000 VNĐ.
- **Q3 (What if state)**: Hệ thống có cho phép áp dụng đồng thời nhiều mã giảm giá trên cùng 01 đơn hàng (ví dụ: kết hợp mã giảm giá sản phẩm và mã miễn phí vận chuyển) hay chỉ áp dụng duy nhất 01 mã cho mỗi đơn hàng?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Có. Cho phép áp dụng đồng thời nhiều mã giảm giá trên cùng 01 đơn hàng và vẫn phải tuân thủ quy định trần giảm giá tối đa.
- **Q4 (What when timing)**: Trường hợp khách hàng nhấn "Áp dụng" mã thành công ở thời điểm mã còn hạn (ví dụ 23:59:50), nhưng đến khi bấm "Đặt hàng" chốt đơn thì mã đã sang ngày mới và hết hạn, hệ thống sẽ giữ giá trị giảm đã ghi nhận hay sẽ báo lỗi và yêu cầu tính lại tổng tiền?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Hệ thống căn cứ vào thời gian hoàn tất thanh toán (chốt đơn) theo múi giờ Việt Nam (ICT / UTC+7) để xác thực hạn mã, tránh trường hợp áp dụng mã đã quá hạn.
- **Q5 (What happens after post-condition)**: Khi một đơn hàng có sử dụng mã giảm giá bị hủy (do người dùng hủy hoặc hệ thống/Admin hủy) hoặc phát sinh trả hàng, mã giảm giá đó có được khôi phục về trạng thái "chưa sử dụng" cho khách hàng hay không?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Không. Mã giảm giá đã áp dụng sử dụng không được khôi phục hay hoàn trả lại trạng thái chưa sử dụng khi đơn hàng bị hủy hoặc phát sinh trả hàng.
- **Q6 (Who else actor)**: Một mã giảm giá có quy định tổng số lần sử dụng trên toàn hệ thống hay không? Nếu có 2 người dùng cùng lúc bấm "Áp dụng" cho lượt dùng cuối cùng của mã, hệ thống xử lý tranh chấp (concurrency locking) như thế nào?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Có quy định giới hạn số lần sử dụng. Trường hợp 2 người dùng thao tác cùng lúc, hệ thống ưu tiên xử lý theo người hoàn thành thanh toán trước. Trường hợp cùng thời gian áp mã và cùng thời gian hoàn thành đơn, hệ thống vẫn chấp nhận áp mã nhưng sẽ tự động ghi nhận trạng thái mã giảm giá là `(OVER)` trong hệ thống để đối soát.
- **Q7 (What if state)**: Sau khi đã áp dụng mã giảm giá thành công tại trang Thanh toán, nếu người dùng quay lại chỉnh sửa giỏ hàng (bớt sản phẩm làm tổng tiền giảm xuống dưới mức Min Order Value), hệ thống sẽ tự động hủy áp dụng mã hay kiểm tra lại tại bước xác nhận Đặt hàng?
  - **Trả lời từ BA/PO (Đã xác nhận)**: Đúng. Hệ thống sẽ tự động re-validate điều kiện Min Order Value tại bước chốt đơn và hủy áp dụng mã giảm giá nếu tổng tiền giỏ hàng không đủ điều kiện tối thiểu.
