# BÁO CÁO THIẾT KẾ Ý TƯỞNG KIỂM THỬ (TEST IDEA REPORT) · function-d
Owner: qa-analyst/04-test-idea-design · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, 03_viewpoint_report.md · Verdict: PASS

---

### BẢNG TỔNG HỢP TEST IDEA & FILTER

| # | Test Idea | Viewpoint | Kỹ thuật | Giữ/Bỏ | Lý do filter |
|:---|:---|:---|:---|:---:|:---|
| **TI-01** | Kiểm tra áp dụng thành công mã giảm số tiền cố định (VNĐ) khi giá trị đơn hàng lớn hơn mức tối thiểu quy định. | VP-01 (Happy Path) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-02** | Kiểm tra áp dụng thành công mã giảm theo tỷ lệ phần trăm (%) với mức giảm tính ra nhỏ hơn mức trần Max Cap. | VP-01 (Happy Path) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-03** | Kiểm tra áp dụng thành công mã giảm theo tỷ lệ phần trăm (%) với mức giảm tính ra đạt chính xác mức trần Max Cap. | VP-01 (Happy Path) | BVA | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-04** | Kiểm tra hệ thống hủy mã cũ và áp dụng mã mới thay thế khi nhập mã hợp lệ khác trong lúc đang áp sẵn một mã. | VP-01 (Happy Path) | Decision Table | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-05** | Kiểm tra khách hàng đặt hàng thành công sau khi đã áp dụng mã giảm giá hợp lệ và tổng tiền thanh toán được cập nhật chính xác. | VP-01 (Happy Path) | EP | **Giữ** | Viết được expected rõ ràng |
| **TI-06** | Kiểm tra bấm Áp dụng nhiều lần liên tiếp với cùng một mã giảm giá đã được áp dụng thành công. | VP-01 (Happy Path) | EP | **Bỏ** | Trùng lặp hoàn toàn |
| **TI-07** | Kiểm tra hệ thống từ chối và báo lỗi khi nhập mã giảm giá không tồn tại trong cơ sở dữ liệu. | VP-02 (Negative) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-08** | Kiểm tra hệ thống từ chối và báo lỗi khi nhập mã giảm giá đã quá thời hạn sử dụng. | VP-02 (Negative) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-09** | Kiểm tra hệ thống từ chối và báo lỗi khi tổng giá trị đơn hàng chưa đạt mức tối thiểu quy định của mã giảm giá. | VP-02 (Negative) | EP | **Giữ** | Rủi ro cao |
| **TI-10** | Kiểm tra hệ thống từ chối và báo lỗi khi khách hàng nhập lại mã giảm giá mà tài khoản này đã từng sử dụng thành công trước đó. | VP-02 (Negative) | Decision Table | **Giữ** | Rủi ro cao |
| **TI-11** | Kiểm tra hệ thống cảnh báo yêu cầu nhập mã khi bấm nút Áp dụng trong khi ô nhập mã đang để trống. | VP-02 (Negative) | EP | **Giữ** | Viết được expected rõ ràng |
| **TI-12** | Kiểm tra khách vãng lai chưa đăng nhập bị yêu cầu đăng nhập khi tiến hành thanh toán để sử dụng mã giảm giá. | VP-02 (Negative) | Decision Table | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-13** | Kiểm tra giao diện nút Áp dụng hiển thị hiệu ứng hover chuyển màu. | VP-02 (Negative) | EP | **Bỏ** | Trivial |
| **TI-14** | Kiểm tra áp dụng thành công mã giảm giá khi tổng giá trị đơn hàng bằng đúng giá trị tối thiểu quy định (`min`). | VP-03 (Boundary) | BVA | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-15** | Kiểm tra hệ thống từ chối khi tổng giá trị đơn hàng thấp hơn 1 đồng so với giá trị tối thiểu quy định (`min - 1 VNĐ`). | VP-03 (Boundary) | BVA | **Giữ** | Chưa case nào cover |
| **TI-16** | Kiểm tra áp dụng thành công khi tổng giá trị đơn hàng cao hơn 1 đồng so với giá trị tối thiểu quy định (`min + 1 VNĐ`). | VP-03 (Boundary) | BVA | **Giữ** | Chưa case nào cover |
| **TI-17** | Kiểm tra số tiền giảm của mã phần trăm (%) khi giá trị tính toán vượt quá mức trần Max Cap (`MaxCap + 1 VNĐ`) thì hệ thống chốt đúng bằng Max Cap. | VP-03 (Boundary) | BVA | **Giữ** | Rủi ro cao |
| **TI-18** | Kiểm tra số tiền giảm của mã phần trăm (%) khi giá trị tính toán thấp hơn 1 đồng so với mức trần (`MaxCap - 1 VNĐ`) thì hệ thống giảm đúng giá trị tính toán. | VP-03 (Boundary) | BVA | **Giữ** | Chưa case nào cover |
| **TI-19** | Kiểm tra mã giảm số tiền cố định có giá trị giảm bằng đúng tổng giá trị đơn hàng thì tổng tiền thanh toán hiển thị đúng 0 VNĐ. | VP-03 (Boundary) | BVA | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-20** | Kiểm tra mã giảm số tiền cố định có giá trị giảm lớn hơn tổng giá trị đơn hàng thì tổng tiền thanh toán giảm tối đa về sàn 0 VNĐ không bị âm tiền. | VP-03 (Boundary) | BVA | **Giữ** | Rủi ro cao |
| **TI-21** | Kiểm tra quy tắc làm tròn tiền chiết khấu lẻ của mã phần trăm (%) được làm tròn xuống hàng đơn vị đồng VNĐ gần nhất. | VP-03 (Boundary) | BVA | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-22** | Kiểm tra hệ thống từ chối khi nhập mã giảm giá có độ dài 2 ký tự (dưới ngưỡng tối thiểu 3 ký tự). | VP-03 (Boundary) | BVA | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-23** | Kiểm tra áp dụng thành công mã giảm giá có độ dài đúng 3 ký tự (ngưỡng min hợp lệ). | VP-03 (Boundary) | BVA | **Giữ** | Chưa case nào cover |
| **TI-24** | Kiểm tra áp dụng thành công mã giảm giá có độ dài đúng 20 ký tự (ngưỡng max hợp lệ). | VP-03 (Boundary) | BVA | **Giữ** | Chưa case nào cover |
| **TI-25** | Kiểm tra hệ thống từ chối khi nhập mã giảm giá có độ dài 21 ký tự (vượt quá ngưỡng tối đa 20 ký tự). | VP-03 (Boundary) | BVA | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-26** | Kiểm tra mã giảm giá vẫn áp dụng hợp lệ tại thời điểm 23:59:59 của ngày hết hạn theo giờ Việt Nam (GMT+7). | VP-03 (Boundary) | BVA | **Giữ** | Rủi ro cao |
| **TI-27** | Kiểm tra mã giảm giá bị từ chối hết hạn tại thời điểm 00:00:00 của ngày liền kề sau ngày hết hạn theo giờ Việt Nam (GMT+7). | VP-03 (Boundary) | BVA | **Giữ** | Rủi ro cao |
| **TI-28** | Kiểm tra hệ thống tạm khóa ô nhập mã trong 15 phút sau khi người dùng nhập sai mã liên tiếp 5 lần trong vòng 5 phút. | VP-04 (Security) | Decision Table | **Giữ** | Rủi ro cao |
| **TI-29** | Kiểm tra hệ thống từ chối thao tác ngay lập tức nếu người dùng cố tình nhập mã ở lần thứ 6 trong thời gian bị tạm khóa. | VP-04 (Security) | Decision Table | **Giữ** | Rủi ro cao |
| **TI-30** | Kiểm tra hệ thống tự động mở lại ô nhập mã bình thường sau khi hết thời gian tạm khóa 15 phút. | VP-04 (Security) | Decision Table | **Giữ** | Viết được expected rõ ràng |
| **TI-31** | Kiểm tra hệ thống từ chối và chặn khi nhập các ký tự đặc biệt hoặc mã độc script/HTML vào ô mã giảm giá. | VP-04 (Security) | EP | **Giữ** | Rủi ro cao |
| **TI-32** | Kiểm tra hệ thống từ chối áp dụng voucher và vô hiệu hóa đặt hàng khi tài khoản khách hàng bị khóa trạng thái trong lúc thao tác. | VP-04 (Security) | Decision Table | **Giữ** | Rủi ro cao |
| **TI-33** | Kiểm tra khả năng chịu tải của hệ thống khi 10.000 user cùng áp mã trong 1 giây. | VP-04 (Security) | EP | **Bỏ** | Ngoài scope (đối chiếu Out of Scope) |
| **TI-34** | Kiểm tra hệ thống tự động cắt bỏ khoảng trắng ở đầu và cuối chuỗi nhập mã (`trim()`) và áp dụng thành công nếu mã hợp lệ. | VP-05 (UX/Usability) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-35** | Kiểm tra hệ thống báo lỗi mã không hợp lệ khi chuỗi nhập chứa khoảng trắng ở giữa các ký tự. | VP-05 (UX/Usability) | EP | **Giữ** | Viết được expected rõ ràng |
| **TI-36** | Kiểm tra hệ thống tự động chuyển đổi chữ thường thành chữ in hoa và đối soát hợp lệ (`Case-insensitive`). | VP-05 (UX/Usability) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-37** | Kiểm tra hệ thống bật modal đăng nhập tại chỗ khi session hết hạn và giữ nguyên giỏ hàng cùng mã đang nhập sau khi login lại thành công. | VP-05 (UX/Usability) | State Transition | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-38** | Kiểm tra hệ thống hiển thị chính xác các câu thông báo lỗi theo đúng danh sách mẫu chuẩn cho từng ca lỗi. | VP-05 (UX/Usability) | EP | **Giữ** | Viết được expected rõ ràng |
| **TI-39** | Kiểm tra thứ tự trừ tiền khi kết hợp Ví ShopGo: trừ tiền chiết khấu của voucher trước trên tổng đơn, số tiền còn lại mới trừ vào số dư Ví. | VP-06 (Integration) | Decision Table | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-40** | Kiểm tra khi khách hàng chỉnh sửa giỏ hàng làm tổng giá trị đơn giảm xuống dưới mức tối thiểu thì hệ thống cảnh báo và tự động gỡ bỏ voucher. | VP-06 (Integration) | State Transition | **Giữ** | Rủi ro cao |
| **TI-41** | Kiểm tra khi máy chủ cập nhật giá sản phẩm hoặc hết hàng làm đơn hàng không còn đủ giá trị tối thiểu thì hệ thống cảnh báo và tự gỡ voucher. | VP-06 (Integration) | Decision Table | **Giữ** | Rủi ro cao |
| **TI-42** | Kiểm tra hệ thống re-validate tính hợp lệ của voucher tại thời điểm bấm Đặt hàng: nếu voucher bị hết hạn/hết lượt trong lúc thao tác thì chặn đặt hàng. | VP-06 (Integration) | Decision Table | **Giữ** | Rủi ro cao |
| **TI-43** | Kiểm tra lượt sử dụng voucher được tự động hoàn lại cho tài khoản khách hàng khi đơn hàng đã áp voucher bị hủy. | VP-06 (Integration) | State Transition | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-44** | Kiểm tra mã giảm giá chỉ giảm trừ trên tổng tiền sản phẩm trong đơn hàng, không áp dụng giảm trừ vào phí vận chuyển. | VP-06 (Integration) | EP | **Giữ** | Kiểm tra business rule đã xác định |
| **TI-45** | Kiểm tra tích hợp sâu cổng thanh toán Visa thanh toán thành công đơn hàng sau khi giảm giá. | VP-06 (Integration) | EP | **Bỏ** | Ngoài scope (đối chiếu Out of Scope) |

---

## TỔNG KẾT SÀNG LỌC
- **Tổng số Test Idea được sinh**: 45
- **Số Test Idea được GIỮ**: 41
- **Số Test Idea bị BỎ**: 4 (Lý do: 1 Trùng lặp hoàn toàn, 1 Trivial, 2 Ngoài scope)
- **100% Test Idea GIỮ** có lý do trích nguyên văn từ checklist chuẩn, phân loại kỹ thuật rõ ràng và bao phủ trọn vẹn toàn bộ 26 Business Rules.
