# BÁO CÁO THIẾT KẾ & SÀNG LỌC TEST IDEA — ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER) · function-d
Owner: qa-analyst/04-test-idea-design · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, OUTPUT/function-d/03_viewpoint_report.md · Verdict: PASS

---

### BẢNG TỔNG HỢP TEST IDEA & FILTER

| # | Test Idea | Viewpoint | Kỹ thuật | Giữ/Bỏ | Lý do filter |
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
