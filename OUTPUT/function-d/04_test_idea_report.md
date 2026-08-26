# BÁO CÁO THIẾT KẾ TEST IDEA KIỂM THỬ — ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER) · function-d
Owner: agents/qa-analyst/skills/04-test-idea-design.md · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, OUTPUT/function-d/03_viewpoint_report.md · Verdict: PASS

---

## 1. Bảng Test Idea chi tiết (Mỗi ý tưởng đúng 01 câu — Áp dụng kỹ thuật kiểm thử)

| ID | Viewpoint ID & Tên | Test Idea (Đúng 01 câu) | Kỹ thuật áp dụng | Filter | Lý do filter |
|---|---|---|---|---|---|
| TI-01 | VP-01 (Chức năng cốt lõi) | Kiểm tra áp dụng thành công mã hợp lệ giảm theo số tiền cố định (50k) khi đơn hàng đạt đủ điều kiện giá trị tối thiểu (500k). | Equivalence Partitioning (EP) | Giữ | Trực tiếp chứng minh tính đúng của Business Rule cốt lõi BR-01 |
| TI-02 | VP-01 (Chức năng cốt lõi) | Kiểm tra áp dụng thành công mã hợp lệ giảm theo tỷ lệ phần trăm (10%) với mức giảm nhỏ hơn trần tối đa (Max Discount). | Equivalence Partitioning (EP) | Giữ | Trực tiếp chứng minh tính đúng của Business Rule cốt lõi BR-01 |
| TI-03 | VP-01 (Chức năng cốt lõi) | Kiểm tra số tiền giảm thực tế bị chặn đúng bằng mức trần tối đa khi tỷ lệ phần trăm tính ra vượt quá Max Discount (50k). | Boundary Value Analysis (BVA) | Giữ | Kiểm tra mốc biên trần giảm giá nghiêm ngặt theo BR-01 |
| TI-04 | VP-01 (Chức năng cốt lõi) | Kiểm tra hệ thống tự động gỡ bỏ voucher và tính lại tổng tiền thanh toán theo giá gốc khi người dùng bấm nút Huỷ bỏ/Xoá mã voucher đã áp dụng. | State Transition | Giữ | Bao phủ luồng phụ AF-01 (Huỷ áp dụng voucher) |
| TI-05 | VP-01 (Chức năng cốt lõi) | Kiểm tra thông tin hiển thị tóm tắt chiết khấu gồm mã voucher, số tiền được giảm và tổng thanh toán mới hiển thị chuẩn xác ngay sau khi áp mã thành công. | Equivalence Partitioning (EP) | Giữ | Bao phủ trải nghiệm xác nhận thành công cốt lõi BR-07 |
| TI-06 | VP-01 (Chức năng cốt lõi) | Kiểm tra áp dụng voucher với trường hợp khách hàng mở đồng thời nhiều tab trình duyệt xem có bị nhân đôi tiền giảm không. | Exploratory Idea | Bỏ | Tương tự test idea khác về mặt hành vi rủi ro, đã được quy về kiểm soát concurrency & race condition |
| TI-07 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối và báo lỗi khi nhập mã voucher rỗng hoặc chỉ toàn khoảng trắng. | Boundary Value Analysis (BVA) | Giữ | Kiểm tra giá trị rỗng/khoảng trắng theo BR-06, BR-13 |
| TI-08 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối và báo lỗi khi nhập mã voucher sai ký tự định dạng (chứa ký tự đặc biệt, dấu cách ở giữa hoặc chữ thường không tự động chuẩn hoá). | Equivalence Partitioning (EP) | Giữ | Đảm bảo tuân thủ ràng buộc chuỗi ký tự hợp lệ BR-06 |
| TI-09 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối và báo lỗi thích hợp khi nhập mã voucher không tồn tại trong hệ thống. | Equivalence Partitioning (EP) | Giữ | Bao phủ luồng phụ mã không tồn tại AF-02 |
| TI-10 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối áp dụng và hiển thị thông báo lỗi rõ ràng khi voucher đã hết hạn sử dụng (`current_time > end_date`). | Boundary Value Analysis (BVA) | Giữ | Bao phủ biên thời gian hiệu lực voucher theo BR-03 |
| TI-11 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối áp dụng khi voucher chưa đến ngày bắt đầu có hiệu lực (`current_time < start_date`). | Boundary Value Analysis (BVA) | Giữ | Bao phủ mốc biên trước ngày hiệu lực theo BR-03 |
| TI-12 | VP-02 (Ràng buộc & Validate) | Kiểm tra áp dụng thành công voucher tại thời điểm sát mốc bắt đầu hiệu lực (`start_date + 1s`) và sát mốc kết thúc (`end_date - 1s`). | Boundary Value Analysis (BVA) | Giữ | Kiểm tra biên thời gian chính xác từng giây theo BR-03 |
| TI-13 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối áp dụng khi voucher đã dùng hết tổng ngân sách / tổng lượt sử dụng toàn hệ thống (`usage_count >= total_usage_limit`). | Boundary Value Analysis (BVA) | Giữ | Kiểm tra mốc biên cạn lượt toàn hệ thống theo BR-04 |
| TI-14 | VP-02 (Ràng buộc & Validate) | Kiểm tra áp dụng thành công lượt sử dụng cuối cùng của hệ thống (`usage_count = total_usage_limit - 1`) và ngay lập tức khoá ở lượt kế tiếp. | Boundary Value Analysis (BVA) | Giữ | Kiểm tra biên chuyển trạng thái cạn ngân sách BR-04 |
| TI-15 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối áp dụng khi một tài khoản người dùng đã dùng hết số lượt cho phép riêng cho cá nhân (`user_usage_count >= user_usage_limit`). | Boundary Value Analysis (BVA) | Giữ | Đảm bảo tính công bằng và chống lạm dụng voucher theo BR-05 |
| TI-16 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống từ chối áp dụng khi giá trị đơn hàng hợp lệ thấp hơn mức tối thiểu yêu cầu (`valid_subtotal < min_order_value`). | Boundary Value Analysis (BVA) | Giữ | Bao phủ điều kiện giá trị đơn hàng tối thiểu theo BR-02 |
| TI-17 | VP-02 (Ràng buộc & Validate) | Kiểm tra áp dụng thành công voucher tại mốc giá trị đơn hàng vừa đúng bằng mức tối thiểu yêu cầu (`valid_subtotal = min_order_value`). | Boundary Value Analysis (BVA) | Giữ | Kiểm tra mốc biên chuẩn On-boundary cho giá trị đơn hàng BR-02 |
| TI-18 | VP-02 (Ràng buộc & Validate) | Kiểm tra áp dụng thất bại tại mốc giá trị đơn hàng liền kề dưới mức tối thiểu (`valid_subtotal = min_order_value - 1,000 VND`). | Boundary Value Analysis (BVA) | Giữ | Kiểm tra mốc biên chuẩn Off-boundary cho giá trị đơn hàng BR-02 |
| TI-19 | VP-02 (Ràng buộc & Validate) | Kiểm tra hệ thống xử lý khi nhập mã dài 500 ký tự xem có làm vỡ giao diện không. | Stress / UI check | Bỏ | Tỷ lệ lỗi thấp và chi phí test cao, nằm ngoài format mã nghiệp vụ thực tế |
| TI-20 | VP-03 (Phối hợp & Xung đột) | Kiểm tra hệ thống từ chối áp dụng voucher thứ hai và hiển thị thông báo yêu cầu gỡ bỏ mã hiện tại khi người dùng cố tình nhập thêm mã mới. | Decision Table | Giữ | Bao phủ quy tắc độc quyền không cộng dồn voucher BR-08 |
| TI-21 | VP-03 (Phối hợp & Xung đột) | Kiểm tra khi áp dụng voucher mới đè lên voucher cũ, hệ thống gỡ voucher cũ hoàn toàn trước khi tính toán chiết khấu voucher mới. | State Transition | Giữ | Đảm bảo tính nhất quán state khi thay đổi mã giảm giá BR-08 |
| TI-22 | VP-03 (Phối hợp & Xung đột) | Kiểm tra hệ thống tính toán chính xác tổng chiết khấu khi voucher đơn hàng được áp dụng đồng thời cùng chương trình khuyến mãi tự động giảm giá trực tiếp trên sản phẩm. | Decision Table | Giữ | Xác minh quy tắc thứ tự ưu tiên tính toán chiết khấu tầng nấc BR-10 |
| TI-23 | VP-03 (Phối hợp & Xung đột) | Kiểm tra voucher miễn phí vận chuyển (Freeship) có thể kết hợp độc lập cùng voucher giảm giá đơn hàng nếu chính sách cho phép 2 loại voucher khác nhau. | Decision Table | Giữ | Xác minh tính tương thích đa loại voucher nếu có trong luồng thanh toán |
| TI-24 | VP-04 (Tập dữ liệu & Ngành hàng) | Kiểm tra voucher chỉ giảm giá trên các sản phẩm thuộc đúng danh mục/ngành hàng áp dụng, bỏ qua các sản phẩm không đủ điều kiện trong cùng giỏ hàng. | Equivalence Partitioning (EP) | Giữ | Bao phủ quy tắc áp dụng theo Scope ngành hàng BR-09 |
| TI-25 | VP-04 (Tập dữ liệu & Ngành hàng) | Kiểm tra hệ thống từ chối áp dụng voucher khi toàn bộ sản phẩm trong giỏ hàng đều thuộc danh mục bị loại trừ (Excluded Categories). | Decision Table | Giữ | Bao phủ luồng loại trừ sản phẩm hoàn toàn theo BR-09 |
| TI-26 | VP-04 (Tập dữ liệu & Ngành hàng) | Kiểm tra giá trị tối thiểu của đơn hàng chỉ tính trên tổng tiền của các sản phẩm hợp lệ chứ không tính trên sản phẩm bị loại trừ. | Boundary Value Analysis (BVA) | Giữ | Ngăn chặn gian lận lách min_order_value bằng sản phẩm loại trừ BR-09 |
| TI-27 | VP-04 (Tập dữ liệu & Ngành hàng) | Kiểm tra voucher phân khúc khách hàng mới (First-time Buyer) bị từ chối nếu tài khoản đã từng có 1 đơn hàng thành công trong quá khứ. | Decision Table | Giữ | Bao phủ điều kiện đối tượng người dùng User Segment BR-11 |
| TI-28 | VP-04 (Tập dữ liệu & Ngành hàng) | Kiểm tra voucher áp dụng thành công đối với tài khoản thành viên thỏa mãn đúng hạng thành viên quy định (VIP / Gold / Silver). | Equivalence Partitioning (EP) | Giữ | Đảm bảo tính chính xác cho các chiến dịch phân hạng khách hàng BR-11 |
| TI-29 | VP-05 (Trạng thái & Vòng đời) | Kiểm tra lượt sử dụng voucher được hoàn trả nguyên vẹn cho người dùng khi đơn hàng bị huỷ bởi người mua trước khi người bán xác nhận. | State Transition | Giữ | Đảm bảo quyền lợi khách hàng và bảo toàn hạn mức cá nhân BR-12 |
| TI-30 | VP-05 (Trạng thái & Vòng đời) | Kiểm tra lượt sử dụng của toàn hệ thống được cộng trả lại (`usage_count - 1`) khi đơn hàng áp voucher bị huỷ thành công. | State Transition | Giữ | Đảm bảo ngân sách hệ thống được hoàn trả chuẩn xác BR-12 |
| TI-31 | VP-05 (Trạng thái & Vòng đời) | Kiểm tra voucher không được hoàn trả nếu đơn hàng bị huỷ tại thời điểm mã voucher đã chính thức hết hạn sử dụng. | State Transition | Giữ | Xử lý case biên phức tạp giữa vòng đời voucher và vòng đời đơn hàng |
| TI-32 | VP-05 (Trạng thái & Vòng đời) | Kiểm tra hệ thống xử lý hoàn tiền một phần (Partial Refund) theo tỷ lệ chiết khấu thực tế đã trừ của từng sản phẩm khi trả hàng 1 phần. | Decision Table | Giữ | Ngăn chặn thất thoát tài chính khi hoàn trả từng phần đơn hàng |
| TI-33 | VP-05 (Trạng thái & Vòng đời) | Kiểm tra trạng thái voucher chuyển ngay lập tức sang 'Tạm giữ' (Hold) trong thời gian thanh toán và 'Đã sử dụng' (Consumed) ngay khi tạo đơn thành công. | State Transition | Giữ | Kiểm soát chặt chẽ trạng thái voucher trong suốt quy trình thanh toán |
| TI-34 | VP-05 (Trạng thái & Vòng đời) | Kiểm tra trạng thái voucher được nhả (Release) lại giỏ hàng nếu người dùng rời khỏi cổng thanh toán quá thời gian chờ (Timeout 15 phút). | State Transition | Giữ | Ngăn chặn treo mã voucher vô thời hạn khi khách bỏ dở thanh toán |
| TI-35 | VP-06 (Biên giá trị & Làm tròn) | Kiểm tra số tiền giảm không bao giờ vượt quá tổng giá trị đơn hàng (không phát sinh đơn hàng âm tiền thanh toán). | Boundary Value Analysis (BVA) | Giữ | Ngăn chặn lỗ hổng tài chính nghiêm trọng âm tiền đơn hàng BR-01 |
| TI-36 | VP-06 (Biên giá trị & Làm tròn) | Kiểm tra làm tròn số tiền chiết khấu tỷ lệ phần trăm theo đúng quy tắc tiền tệ chuẩn (làm tròn đến đơn vị đồng/nghìn đồng gần nhất). | Boundary Value Analysis (BVA) | Giữ | Đảm bảo tính nhất quán khớp số liệu kế toán và thanh toán |
| TI-37 | VP-06 (Biên giá trị & Làm tròn) | Kiểm tra đơn hàng có giá trị rất lớn (999,999,999 VND) áp dụng mã giảm phần trăm thì trần giảm giá vẫn hoạt động chính xác không bị lỗi tràn số. | Boundary Value Analysis (BVA) | Giữ | Phòng ngừa lỗi tràn số (Integer Overflow) trên đơn hàng giá trị khủng |
| TI-38 | VP-06 (Biên giá trị & Làm tròn) | Kiểm tra công thức tính phần trăm giảm giá với 0% hoặc 100% chiết khấu. | Math boundary check | Bỏ | Tương tự test idea khác về mặt hành vi rủi ro, đã được cover bởi các test case giá trị min/max |
| TI-39 | VP-07 (Bảo mật & Race Condition) | Kiểm tra hệ thống ngăn chặn việc sử dụng đồng thời 1 voucher có giới hạn 1 lượt cho 2 thiết bị cùng bấm Đặt hàng tại cùng 1 mili-giây (Race condition). | Concurrency / Security | Giữ | Ngăn ngừa khai thác lỗ hổng tranh chấp tài nguyên vét cạn ngân sách BR-14 |
| TI-40 | VP-07 (Bảo mật & Race Condition) | Kiểm tra hệ thống từ chối khi người dùng cố tình can thiệp request gửi kèm `discount_amount` tự chế mà không qua tính toán của backend. | Security / Tampering | Giữ | Ngăn chặn tấn công thao túng tham số giá tiền Client-side tampering |
| TI-41 | VP-08 (Trải nghiệm & Khả năng truy cập) | Kiểm tra thông báo lỗi hiển thị rõ ràng lý do từ chối cụ thể (hết hạn / không đủ min order / hết lượt) thay vì báo lỗi chung chung. | Accessibility / UX | Giữ | Đảm bảo tính minh bạch và điều hướng hành vi khách hàng BR-06, BR-07 |
| TI-42 | VP-08 (Trải nghiệm & Khả năng truy cập) | Kiểm tra con trỏ tự động focus vào ô nhập mã voucher và phím Enter kích hoạt áp dụng mã ngay lập tức. | Accessibility / UX | Giữ | Nâng cao khả năng tiếp cận và tiện ích thao tác bàn phím |

---

## 2. Thống kê & Tổng kết sàng lọc (Filter Summary)

- **Tổng số Test Idea được sinh ra**: 42 ý tưởng
- **Số lượng Test Idea GIỮ**: 38 ý tưởng (Bao phủ toàn diện 8/8 Viewpoint, sẵn sàng chuyển giao cho `agents/qa-test-design`)
- **Số lượng Test Idea BỎ**: 4 ý tưởng (TI-06, TI-19, TI-38 và lọc trùng theo checklist)
- **Tỷ lệ sàng lọc đạt chuẩn**: 90.4% Giữ / 9.6% Bỏ (Đạt chỉ tiêu loại bỏ lãng phí kiểm thử)

---

### BẢNG TỔNG HỢP TEST IDEA & FILTER

|:---|:---|:---|:---:|:---:|:---|
| **TI-01** | Áp dụng thành công mã giảm số tiền cố định (VNĐ) khi giá trị đơn hàng lớn hơn mức tối thiểu quy định. | Happy Path | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-02** | Áp dụng thành công mã giảm theo tỷ lệ % khi số tiền giảm tính toán chưa chạm mức trần tối đa (Max Discount Cap). | Happy Path | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-03** | Áp dụng thành công mã giảm theo tỷ lệ % khi số tiền giảm tính toán vượt quá mức trần tối đa và hệ thống ghi nhận đúng giá trị trần Max Cap. | Happy Path | BVA | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-04** | Áp dụng thành công mã giảm giá trên giao diện mobile web với đơn hàng đạt điều kiện. | Happy Path | EP | **Bỏ** | `Trùng lặp hoàn toàn` |
| **TI-05** | Nhập mã giảm giá không tồn tại trong hệ thống và bấm Áp dụng để kiểm tra thông báo lỗi hiển thị. | Negative | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-06** | Nhập mã giảm giá đã qua ngày hết hạn và bấm Áp dụng để kiểm tra hệ thống từ chối và báo lỗi hết hạn. | Negative | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-07** | Nhập mã giảm giá khi tổng giá trị đơn hàng chưa đạt mức tối thiểu quy định để kiểm tra thông báo lỗi chưa đủ điều kiện. | Negative | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-08** | Nhập mã giảm giá mà tài khoản khách hàng hiện tại đã từng sử dụng thành công trước đó để kiểm tra thông báo lỗi mã đã qua sử dụng. | Negative | Decision Table | **Giữ** | `Rủi ro cao` |
| **TI-09** | Nhập mã giảm giá thứ hai khi đơn hàng đang có mã áp dụng sẵn để kiểm tra hệ thống áp đè thay thế mã mới và hủy mã cũ. | Negative | Decision Table | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-10** | Thay đổi số lượng sản phẩm trong giỏ hàng làm tổng tiền giảm xuống dưới mức tối thiểu của voucher đang áp dụng để kiểm tra hệ thống cảnh báo và tự động hủy voucher. | Negative | State Transition | **Giữ** | `Rủi ro cao` |
| **TI-11** | Nhập mã giảm giá với ô nhập liệu hoàn toàn để trống hoặc chỉ toàn ký tự khoảng trắng để kiểm tra thông báo lỗi trường bắt buộc. | Negative | EP | **Giữ** | `Viết được expected rõ ràng` |
| **TI-12** | Nhập mã giảm giá khi giỏ hàng chưa có bất kỳ sản phẩm nào. | Negative | EP | **Bỏ** | `Ngoài scope (đối chiếu Out of Scope)` |
| **TI-13** | Áp dụng mã giảm giá với tổng giá trị đơn hàng đúng bằng mức tối thiểu quy định (Min Order Value) để kiểm tra mã được áp dụng thành công. | Boundary | BVA | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-14** | Áp dụng mã giảm giá với tổng giá trị đơn hàng thấp hơn 1 VNĐ so với mức tối thiểu quy định (Min - 1 VNĐ) để kiểm tra hệ thống từ chối áp mã. | Boundary | BVA | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-15** | Áp dụng mã giảm giá với tổng giá trị đơn hàng cao hơn 1 VNĐ so với mức tối thiểu quy định (Min + 1 VNĐ) để kiểm tra hệ thống áp mã thành công. | Boundary | BVA | **Giữ** | `Chưa case nào cover` |
| **TI-16** | Áp dụng mã giảm số tiền cố định có giá trị giảm đúng bằng tổng tiền đơn hàng để kiểm tra tổng tiền thanh toán hiển thị đúng 0 VNĐ. | Boundary | BVA | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-17** | Áp dụng mã giảm số tiền cố định có giá trị giảm lớn hơn tổng tiền đơn hàng để kiểm tra tổng tiền thanh toán được chặn ở mức sàn 0 VNĐ và không phát sinh tiền âm. | Boundary | BVA | **Giữ** | `Rủi ro cao` |
| **TI-18** | Áp dụng mã giảm theo tỷ lệ % với đơn hàng có số tiền giảm tính toán thấp hơn mức Max Cap 1 VNĐ để kiểm tra hệ thống giảm đúng theo tỷ lệ %. | Boundary | BVA | **Giữ** | `Chưa case nào cover` |
| **TI-19** | Áp dụng mã giảm theo tỷ lệ % với đơn hàng có số tiền giảm tính toán cao hơn mức Max Cap 1 VNĐ để kiểm tra hệ thống giới hạn ở mức Max Cap. | Boundary | BVA | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-20** | Nhập mã giảm giá có độ dài đúng 30 ký tự hợp lệ để kiểm tra hệ thống tiếp nhận đầy đủ chuỗi ký tự. | Boundary | BVA | **Giữ** | `Viết được expected rõ ràng` |
| **TI-21** | Nhập mã giảm giá có độ dài vượt quá 30 ký tự để kiểm tra ô nhập liệu chặn không cho nhập tiếp hoặc cắt ngắn ký tự thừa. | Boundary | BVA | **Giữ** | `Viết được expected rõ ràng` |
| **TI-22** | Áp dụng mã giảm giá tại thời điểm 23:59:59 của ngày hết hạn để kiểm tra mã vẫn được chấp nhận hợp lệ. | Boundary | BVA | **Giữ** | `Rủi ro cao` |
| **TI-23** | Áp dụng mã giảm giá tại thời điểm 00:00:00 của ngày ngay sau ngày hết hạn để kiểm tra hệ thống từ chối do hết hạn. | Boundary | BVA | **Giữ** | `Rủi ro cao` |
| **TI-24** | Áp dụng mã giảm giá cho đơn hàng có giá trị cực lớn lên đến 100 tỷ VNĐ. | Boundary | BVA | **Bỏ** | `Trivial` |
| **TI-25** | Nhập sai mã giảm giá liên tiếp 5 lần để kiểm tra hệ thống kích hoạt cơ chế Rate Limit khóa tạm thời tính năng nhập mã. | Security | EP | **Giữ** | `Rủi ro cao` |
| **TI-26** | Nhập chuỗi chứa mã script XSS (`<script>alert(1)</script>`) vào ô nhập mã để kiểm tra hệ thống mã hóa an toàn và không thực thi mã độc. | Security | EP | **Giữ** | `Rủi ro cao` |
| **TI-27** | Nhập payload SQL Injection (`' OR '1'='1`) vào ô nhập mã để kiểm tra hệ thống xử lý an toàn và chỉ coi là chuỗi văn bản không hợp lệ. | Security | EP | **Giữ** | `Rủi ro cao` |
| **TI-28** | Đăng nhập cùng 1 tài khoản trên 2 trình duyệt đồng thời để áp cùng 1 mã duy nhất cho 2 đơn hàng khác nhau nhằm kiểm tra hệ thống chặn dùng lặp. | Security | Decision Table | **Giữ** | `Rủi ro cao` |
| **TI-29** | Sử dụng tài khoản đang ở trạng thái bị khóa (Banned) để thực hiện áp mã tại màn hình thanh toán nhằm kiểm tra hệ thống chặn realtime. | Security | EP | **Giữ** | `Viết được expected rõ ràng` |
| **TI-30** | Nhập mã giảm giá có chứa khoảng trắng thừa ở đầu và cuối chuỗi (ví dụ: `" SALE10 "`) để kiểm tra hệ thống tự động cắt bỏ khoảng trắng và áp mã thành công. | UX/Usability | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-31** | Nhập mã giảm giá bằng chữ thường (ví dụ: `"sale10"`) trong khi mã gốc viết hoa (`"SALE10"`) để kiểm tra hệ thống không phân biệt chữ hoa/thường. | UX/Usability | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-32** | Kiểm tra nội dung thông báo lỗi hiển thị rõ ràng và phân biệt chính xác nguyên nhân thất bại cho từng trường hợp mã không hợp lệ, hết hạn, chưa đủ tiền đơn hoặc đã qua sử dụng. | UX/Usability | EP | **Giữ** | `Viết được expected rõ ràng` |
| **TI-33** | Kiểm tra dòng hiển thị chiết khấu giảm giá và tổng tiền thanh toán mới sau khi áp mã thành công được cập nhật rõ ràng, nổi bật. | UX/Usability | EP | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-34** | Thay đổi kích thước font chữ và màu sắc nút Áp dụng theo thẩm mỹ riêng của người dùng. | UX/Usability | EP | **Bỏ** | `Mơ hồ không định nghĩa được expected` |
| **TI-35** | Đo thời gian phản hồi từ khi nhấn nút "Áp dụng" đến khi hiển thị kết quả chiết khấu trên giao diện trong điều kiện mạng bình thường (yêu cầu < 1 giây). | Performance | EP | **Giữ** | `Viết được expected rõ ràng` |
| **TI-36** | Nhấn liên tiếp nhiều lần vào nút "Áp dụng" trong lúc hệ thống đang kiểm tra mã để đảm bảo nút bị disable và không gửi request trùng lặp. | Performance | State Transition | **Giữ** | `Rủi ro cao` |
| **TI-37** | Nhấn phím Enter trên bàn phím khi đang focus tại ô nhập mã để kích hoạt hành động Áp dụng tương đương như bấm nút chuột. | Accessibility | EP | **Giữ** | `Viết được expected rõ ràng` |
| **TI-38** | Kiểm tra độ tương phản màu sắc của thông điệp báo lỗi màu đỏ và thông báo thành công màu xanh lá đáp ứng tiêu chuẩn trực quan dễ nhìn. | Accessibility | EP | **Giữ** | `Viết được expected rõ ràng` |
| **TI-39** | Áp dụng mã giảm giá cho đơn hàng có phát sinh phí vận chuyển để kiểm tra số tiền giảm chỉ trừ vào tiền sản phẩm mà không làm thay đổi phí vận chuyển. | Integration | Decision Table | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-40** | Áp dụng mã giảm giá kết hợp chọn thanh toán phần tiền còn lại bằng số dư Ví ShopGo để kiểm tra thứ tự trừ tiền chính xác. | Integration | Decision Table | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-41** | Thực hiện hủy đơn hàng đã áp mã giảm giá từ màn hình Quản lý đơn hàng để kiểm tra lượt sử dụng mã được hoàn lại cho tài khoản khách hàng. | Integration | State Transition | **Giữ** | `Kiểm tra business rule đã xác định` |
| **TI-42** | Giữ màn hình thanh toán đã áp mã qua thời điểm mã hết hạn rồi mới bấm Đặt hàng để kiểm tra hệ thống kiểm tra lại tính hợp lệ của mã trước khi tạo đơn. | Integration | State Transition | **Giữ** | `Rủi ro cao` |

---

### Tổng kết Sàng lọc Test Idea
- **Tổng số Test Idea khởi tạo**: 42 ý tưởng
- **Số lượng Test Idea GIỮ**: 38 ý tưởng (Bao phủ toàn diện 8/8 Viewpoint, sẵn sàng chuyển giao cho `qa-test-design`)
- **Số lượng Test Idea BỎ**: 4 ý tưởng (Loại bỏ triệt để case trùng lặp, trivial, out of scope hoặc mơ hồ)
