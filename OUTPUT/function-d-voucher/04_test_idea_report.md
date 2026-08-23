# BẢNG TỔNG HỢP TEST IDEA & FILTER — Áp dụng Mã Giảm Giá (Voucher) · function-d-voucher
Owner: qa-analyst/04-test-idea-design · Nguồn: output/function-d-voucher/01_requirement_risk_summary.md, output/function-d-voucher/03_viewpoint_report.md · Verdict: PASS

---

### BẢNG TỔNG HỢP TEST IDEA & FILTER

| # | Test Idea | Viewpoint | Kỹ thuật | Giữ/Bỏ | Lý do filter |
|:---|:---|:---|:---|:---:|:---|
| **TI-01** | Kiểm tra áp dụng thành công mã giảm giá theo tỷ lệ phần trăm (%) cho đơn hàng đạt giá trị tối thiểu và cập nhật chính xác số tiền giảm cùng tổng tiền mới. | Happy Path | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-02** | Kiểm tra áp dụng thành công mã giảm giá theo số tiền cố định (VNĐ) cho đơn hàng đạt giá trị tối thiểu và cập nhật chính xác số tiền giảm cùng tổng tiền mới. | Happy Path | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-03** | Kiểm tra hệ thống hiển thị thông báo lỗi và giữ nguyên tổng tiền khi người dùng nhập mã giảm giá không tồn tại trên hệ thống. | Negative | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-04** | Kiểm tra hệ thống hiển thị thông báo lỗi và giữ nguyên tổng tiền khi người dùng nhập mã giảm giá đã quá ngày hết hạn sử dụng. | Negative | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-05** | Kiểm tra hệ thống hiển thị thông báo lỗi khi nhập mã voucher hợp lệ nhưng giá trị đơn hàng chưa đạt mức giá trị đơn tối thiểu (`min order value`). | Negative | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-06** | Kiểm tra hệ thống hiển thị cảnh báo yêu cầu nhập mã khi người dùng để trống ô "Mã giảm giá" và nhấn nút "Áp dụng". | Negative | EP | Giữ | Viết được expected rõ ràng |
| **TI-07** | Kiểm tra khách vãng lai (Guest) chưa đăng nhập bị chuyển hướng yêu cầu đăng nhập/đăng ký khi tiến hành thanh toán để áp dụng mã giảm giá. | Negative | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-08** | Kiểm tra hệ thống từ chối áp dụng mã và báo lỗi khi tổng giá trị đơn hàng là `min order value - 1 VNĐ` (ngay dưới biên tối thiểu). | Boundary | BVA | Giữ | Rủi ro cao |
| **TI-09** | Kiểm tra hệ thống chấp nhận áp dụng mã và tính đúng chiết khấu khi tổng giá trị đơn hàng bằng đúng `min order value` (chính xác tại biên tối thiểu). | Boundary | BVA | Giữ | Rủi ro cao |
| **TI-10** | Kiểm tra hệ thống chấp nhận áp dụng mã và tính đúng chiết khấu khi tổng giá trị đơn hàng là `min order value + 1 VNĐ` (ngay trên biên tối thiểu). | Boundary | BVA | Giữ | Chưa case nào cover |
| **TI-11** | Kiểm tra tính toán số tiền giảm khi tỷ lệ chiết khấu ở các giá trị biên như 1%, 50%, 99% và 100% giá trị đơn hàng. | Boundary | BVA | Giữ | Rủi ro cao |
| **TI-12** | Kiểm tra hệ thống tự động khống chế mức giảm đúng bằng giá trị trần (Max Discount Cap) khi số tiền giảm tính theo % vượt quá mức trần cho phép. | Boundary | Decision Table | Giữ | Rủi ro cao |
| **TI-13** | Kiểm tra hệ thống cập nhật tổng tiền thanh toán mới bằng đúng 0 VNĐ (không phát sinh số âm) khi số tiền giảm cố định VNĐ lớn hơn hoặc bằng tổng giá trị đơn hàng. | Boundary | BVA | Giữ | Rủi ro cao |
| **TI-14** | Kiểm tra áp dụng mã voucher thành công tại thời điểm sát nút hiệu lực là 23:59:59 của ngày hết hạn. | Boundary | BVA | Giữ | Rủi ro cao |
| **TI-15** | Kiểm tra hệ thống từ chối áp dụng mã và báo hết hạn tại thời điểm 00:00:00 của ngày liền kề sau ngày hết hạn. | Boundary | BVA | Giữ | Rủi ro cao |
| **TI-16** | Kiểm tra hệ thống từ chối áp dụng mã voucher khi tài khoản khách hàng đã sử dụng hết số lượt áp dụng cho phép của mã đó (Per-user limit). | Security | EP | Giữ | Rủi ro cao |
| **TI-17** | Kiểm tra hệ thống từ chối và báo hết lượt khi tổng số lượt sử dụng của voucher trên toàn hệ thống đã chạm mức phát hành tối đa (Total quota limit). | Security | EP | Giữ | Rủi ro cao |
| **TI-18** | Kiểm tra hệ thống ngăn chặn việc gửi đồng thời nhiều request áp dụng cùng 1 mã hữu hạn từ nhiều luồng (Race condition concurrency test). | Security | Decision Table | Giữ | Rủi ro cao |
| **TI-19** | Kiểm tra hệ thống từ chối mã khuyến mãi dành riêng cho khách hàng mới khi được nhập bởi tài khoản khách hàng cũ đã có lịch sử mua hàng. | Security | Decision Table | Giữ | Rủi ro cao |
| **TI-20** | Kiểm tra hệ thống ngăn chặn việc can thiệp chỉnh sửa tham số giá trị tiền giảm hoặc min order value từ phía Client gửi lên Server. | Security | EP | Giữ | Rủi ro cao |
| **TI-21** | Kiểm tra người dùng có thể bấm nút "Hủy mã" sau khi áp dụng thành công để xóa chiết khấu và khôi phục lại tổng tiền thanh toán ban đầu. | UX/Usability | State Transition | Giữ | Viết được expected rõ ràng |
| **TI-22** | Kiểm tra người dùng có thể nhập và áp dụng mã voucher mới để thay thế trực tiếp mã voucher cũ đang được áp dụng trên đơn hàng. | UX/Usability | State Transition | Giữ | Viết được expected rõ ràng |
| **TI-23** | Kiểm tra hệ thống tự động loại bỏ khoảng trắng thừa ở đầu/cuối và nhận diện mã không phân biệt chữ hoa hay chữ thường (Case-insensitive). | UX/Usability | EP | Giữ | Viết được expected rõ ràng |
| **TI-24** | Kiểm tra toàn bộ số tiền giảm giá và tổng tiền thanh toán hiển thị đúng định dạng tiền tệ VNĐ có phân cách hàng nghìn và không có số lẻ thập phân. | UX/Usability | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-25** | Kiểm tra giao diện ô nhập mã giảm giá, nút áp dụng, nút hủy mã và thông báo hiển thị đầy đủ, không bị vỡ layout trên cả Desktop và Mobile Web. | UX/Usability | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-26** | Kiểm tra thời gian phản hồi từ khi nhấn nút "Áp dụng" đến khi hiển thị kết quả và tổng tiền mới hoàn tất trong thời gian dưới 3 giây. | Performance | EP | Giữ | Kiểm tra business rule đã xác định |
| **TI-27** | Kiểm tra hệ thống tự động hủy mã voucher và tính lại tổng tiền ban đầu khi khách hàng quay lại giỏ hàng giảm số lượng khiến tổng tiền tụt dưới `min order value`. | Integration | State Transition | Giữ | Rủi ro cao |
| **TI-28** | Kiểm tra số tiền giảm giá của voucher chỉ được trừ vào Tiền hàng (Subtotal) mà không làm khấu trừ sai lệch vào Phí vận chuyển (Shipping fee). | Integration | Decision Table | Giữ | Rủi ro cao |
| **TI-29** | Kiểm tra tổng tiền sau chiết khấu được truyền đồng bộ và chính xác sang các phương thức thanh toán COD, Thẻ và Ví ShopGo. | Integration | Decision Table | Giữ | Rủi ro cao |
| **TI-30** | Kiểm tra lượt sử dụng của voucher được tự động hoàn lại cho tài khoản khách hàng khi đơn hàng áp mã bị hủy trước khi giao hàng. | Integration | State Transition | Giữ | Rủi ro cao |
| **TI-31** | Kiểm tra hệ thống chỉ cho phép áp dụng tối đa 01 voucher giảm giá sản phẩm trên mỗi đơn hàng và từ chối khi nhập mã thứ hai cùng loại. | Integration | Decision Table | Giữ | Rủi ro cao |
| **TI-32** | Kiểm tra giao diện quản trị Admin tạo mới mã giảm giá với các cấu hình % và VNĐ. | Happy Path | EP | Bỏ | Ngoài scope (đối chiếu Out of Scope) |
| **TI-33** | Kiểm tra hiển thị nút Áp dụng có màu nền và hiệu ứng hover chuột chuyển màu. | UX/Usability | EP | Bỏ | Trivial |
| **TI-34** | Kiểm tra nhập mã giảm giá đúng trên đơn hàng hợp lệ để xem tổng tiền có giảm không. | Happy Path | EP | Bỏ | Trùng lặp hoàn toàn |
| **TI-35** | Kiểm tra người dùng có cảm thấy hài lòng với tốc độ áp dụng mã giảm giá hay không. | UX/Usability | EP | Bỏ | Mơ hồ không định nghĩa được expected |

---

## FIX
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|
| - | Không phát hiện | Đã tuân thủ quy tắc 1 câu duy nhất cho mỗi Test Idea và trích nguyên văn checklist filter | Không có bản sửa |

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| 1 | Bảng Test Idea | Bàn giao danh sách 31 Test Idea "Giữ" sang Agent `qa-test-design` để chi tiết hóa thành Test Case 8 trường | Chuyển `qa-test-design` |
