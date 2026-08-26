# BÁO CÁO PHÂN TÍCH QUY TẮC NGHIỆP VỤ BỊ THIẾU (MISSING-RULE REPORT)

## 1. Bảng Ma trận Truy vết Kỹ thuật 06W (06W Traceability Matrix)

| STT | Câu hỏi 06W | Trọng tâm kiểm tra | Trạng thái | Mã Missing Rule liên quan |
| :--- | :--- | :--- | :--- | :--- |
| W1 | Who/What initiates? | Tác nhân kích hoạt & Quyền hạn | Đã phát hiện | [MR-01](#mr-01-quy-dinh-gioi-han-so-lan-su-dung-tren-tung-tai-khoan-va-kiem-soat-trang-thai-tai-khoan) |
| W2 | What if Invalid/Negative? | Luồng lỗi & Ca phủ định | Đã phát hiện | [MR-02](#mr-02-quy-chuan-danh-muc-thong-bao-loi-phan-biet-theo-nguyen-nhan-va-kiem-soat-dau-vao-o-nhap) |
| W3 | Where is Boundary/Limit? | Giá trị biên & Ngưỡng giới hạn | Đã phát hiện | [MR-03](#mr-03-pham-vi-tinh-min-order-value-tran-chiet-khau-san-giam-gia-va-gioi-han-so-ma-ap-dung) |
| W4 | When & State Transition? | Trình tự & Chuyển đổi trạng thái | Đã phát hiện | [MR-04](#mr-04-thoi-diem-re-validate-ma-khi-chot-don-va-co-che-tam-giu-luot-ma-voucher-holding-khi-thanh-toan-online) |
| W5 | Which Dependency/Side-effect? | Phụ thuộc & Tác động chéo | Đã phát hiện | [MR-05](#mr-05-thuat-toan-phan-bo-chiet-khau-cho-tung-san-pham-va-xu-ly-hoan-tra-tung-phan-partial-refund) |
| W6 | Why & Implicit Expectation? | Kỳ vọng ngầm & Tính toàn vẹn | Đã phát hiện | [MR-06](#mr-06-quy-chuan-lam-tron-so-tien-chiet-khau-vnd-va-co-che-chong-do-quet-ma-anti-brute-force) |

---

## 2. Danh sách Chi tiết Missing Rules Phát hiện

### [MR-01] Quy định giới hạn số lần sử dụng trên từng tài khoản và kiểm soát trạng thái tài khoản
1. **Mã Rule ID**: MR-01
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 2: ACTOR & USER ROLE](OUTPUT/01_Requirement_Summary_Report.md#L10-L14), [Section 3: BR-02](OUTPUT/01_Requirement_Summary_Report.md#L18), [Section 7: Q6](OUTPUT/01_Requirement_Summary_Report.md#L77-L78) và [Section 9.1: Missing User Context](OUTPUT/01_Requirement_Summary_Report.md#L95) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W1 (Who/What initiates)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**: 
   - Tài liệu mới chỉ quy định Khách vãng lai (Guest) phải đăng nhập tài khoản Customer để sử dụng mã (BR-02) và giả định có tổng lượt dùng toàn hệ thống (Q6), nhưng chưa quy định **giới hạn số lần sử dụng tối đa của một mã trên từng tài khoản Khách hàng (Per-Customer Usage Limit)**.
   - Chưa làm rõ phân quyền áp dụng theo nhóm người dùng (ví dụ: mã dành riêng cho khách hàng mới Registered, khách hàng thân thiết VIP, hay áp dụng đại trà cho mọi Customer).
   - Chưa xác định cơ chế kiểm tra trạng thái tài khoản nếu tài khoản Khách hàng bị khóa/đình chỉ (Suspended/Banned) sau khi đã nhập mã thành công nhưng chưa bấm chốt đơn thanh toán.
6. **Rủi ro & Tác động (Impact)**: 
   - Không có giới hạn theo từng tài khoản, một người dùng có thể gom/dùng lặp đi lặp lại một mã giảm giá nhiều lần trên cùng 1 tài khoản (nhất là các mã ưu đãi lớn hoặc mã độc quyền), làm cạn kiệt ngân sách khuyến mãi và gây mất công bằng cho các khách hàng khác.
   - Không kiểm soát phân nhóm và trạng thái tài khoản có thể dẫn đến việc khách hàng bị khóa hoặc không đủ điều kiện vẫn lợi dụng được lỗ hổng để chốt đơn hưởng chiết khấu.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Bổ sung cấu hình `max_usage_per_user` cho từng mã giảm giá (mặc định = 1 lượt/tài khoản đối với mã khuyến mãi thông thường, hoặc N lượt theo cấu hình chiến dịch). Hệ thống kiểm tra đồng thời cả tổng lượt dùng toàn hệ thống VÀ số lượt đã sử dụng của tài khoản hiện tại.
   - Hỗ trợ cấu hình đối tượng áp dụng (`applicable_user_group`: ALL, NEW_USER, VIP).
   - Tự động re-validate trạng thái tài khoản Customer (phải là `Active`) tại thời điểm bấm "Đặt hàng / Thanh toán". Nếu tài khoản bị khóa (`Suspended/Disabled`), hệ thống tự động gỡ mã, hủy giao dịch và báo lỗi: `"Tài khoản không đủ điều kiện thực hiện giao dịch này"`.
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Mỗi mã giảm giá có quy định giới hạn số lần sử dụng tối đa trên từng tài khoản Khách hàng (Per-Customer Limit, ví dụ mặc định 1 lần/tài khoản) hay không? Có phân tách mã theo nhóm đối tượng người dùng (Khách mới / VIP / Tất cả) không? Nếu tài khoản Khách hàng bị khóa/vô hiệu hóa ngay trước bước chốt đơn, hệ thống sẽ tự động gỡ mã và chặn đặt hàng hay xử lý ra sao?"

---

### [MR-02] Quy chuẩn danh mục thông báo lỗi phân biệt theo nguyên nhân và kiểm soát đầu vào ô nhập
1. **Mã Rule ID**: MR-02
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-07](OUTPUT/01_Requirement_Summary_Report.md#L23), [Section 5: AF-01, AF-02, AF-03](OUTPUT/01_Requirement_Summary_Report.md#L37-L54) và [Section 7: Q1](OUTPUT/01_Requirement_Summary_Report.md#L67-L68) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W2 (What if Invalid/Negative)
4. **Phân loại**: Exception & Error Handling Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**: 
   - BR-07 chỉ nêu chung "khi mã giảm giá không hợp lệ hoặc đã hết hạn, hệ thống giữ nguyên tổng tiền và hiển thị thông báo lỗi phù hợp", chưa chuẩn hóa danh mục thông báo lỗi (Error Messages) phân biệt rõ ràng từng nguyên nhân thất bại: (1) Mã không tồn tại, (2) Mã hết hạn, (3) Mã hết tổng lượt sử dụng hệ thống, (4) Tài khoản đã dùng hết lượt cho phép, (5) Đơn hàng chưa đạt giá trị tối thiểu, (6) Ô nhập mã bị để trống khi bấm "Áp dụng", (7) Nhập ký tự không hợp lệ.
   - Tài liệu chưa quy định giới hạn độ dài ký tự tối đa (Max length), định dạng ký tự cho phép (chỉ chữ và số, không chứa ký tự đặc biệt/emoji) và xử lý trim khoảng trắng ở ô nhập mã.
6. **Rủi ro & Tác động (Impact)**: 
   - Thông báo lỗi chung chung ("Mã không hợp lệ") gây trải nghiệm người dùng kém (UX kém), khiến khách hàng không biết nguyên nhân do gõ sai mã, do hết hạn hay do giỏ hàng chưa đủ tiền để điều chỉnh.
   - Không giới hạn độ dài và định dạng ký tự ô nhập tiềm ẩn rủi ro tấn công XSS, SQL Injection hoặc chuỗi cực lớn làm treo trình duyệt/server.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Giới hạn độ dài ô nhập mã từ 1 đến 50 ký tự, tự động trim khoảng trắng đầu/cuối chuỗi và chuyển thành chữ in hoa (uppercase/case-insensitive) trước khi gửi xác thực.
   - Chuẩn hóa danh mục thông báo lỗi trực quan ngay dưới ô nhập:
     + Bấm "Áp dụng" khi ô trống: `"Vui lòng nhập mã giảm giá."`
     + Mã không tồn tại / sai ký tự: `"Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."`
     + Mã hết hạn sử dụng: `"Mã giảm giá đã hết hạn sử dụng."`
     + Mã hết lượt dùng hệ thống: `"Mã giảm giá đã hết lượt sử dụng."`
     + Tài khoản hết lượt dùng: `"Bạn đã sử dụng hết số lần cho phép của mã giảm giá này."`
     + Đơn hàng chưa đạt Min Order Value: `"Đơn hàng chưa đạt giá trị tối thiểu [Min_Order_Value] VNĐ để áp dụng mã này."`
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Hệ thống có cần chuẩn hóa danh mục thông báo lỗi chi tiết theo từng nguyên nhân thất bại cụ thể nêu trên hay không? Giới hạn độ dài tối đa của ô nhập mã là bao nhiêu (đề xuất 50 ký tự) và hệ thống có tự động cắt khoảng trắng thừa (trim) cùng chuẩn hóa không phân biệt hoa/thường không?"

---

### [MR-03] Phạm vi tính Min Order Value, trần chiết khấu, sàn giảm giá và giới hạn số mã áp dụng
1. **Mã Rule ID**: MR-03
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-03, BR-04](OUTPUT/01_Requirement_Summary_Report.md#L19-L20), [Section 7: Q2, Q3](OUTPUT/01_Requirement_Summary_Report.md#L69-L72) và [Section 9.1: Missing Financial Context](OUTPUT/01_Requirement_Summary_Report.md#L97) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W3 (Where is Boundary/Limit)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**:
   - BR-04 dùng khái niệm "tổng giá trị đơn hàng", nhưng chưa phân định rõ là **Tiền hàng trước phí vận chuyển/thuế (Subtotal)** hay **Tổng tiền thanh toán cuối cùng bao gồm cả phí vận chuyển (Grand Total)**.
   - Chưa quy định **Trần chiết khấu tối đa (Max Discount Cap)** cho mã giảm theo phần trăm (%) (ví dụ: giảm 20% tối đa 50.000 VNĐ hay không giới hạn).
   - Chưa quy định **Mức sàn thanh toán tối thiểu (Discount Floor)** khi áp dụng mã giảm tiền cố định (VNĐ) có giá trị chiết khấu lớn hơn hoặc bằng tổng tiền hàng (ví dụ: tiền hàng 40.000 VNĐ nhưng áp mã giảm 50.000 VNĐ).
   - Chưa quy định **Số lượng mã giảm giá tối đa** được áp dụng đồng thời trên 1 đơn hàng (áp 1 mã duy nhất hay cho phép kết hợp mã giảm giá sản phẩm + mã miễn phí vận chuyển).
6. **Rủi ro & Tác động (Impact)**: 
   - Nếu tính Min Order Value trên Grand Total (gồm phí ship), khách hàng có thể chọn phương thức giao hàng đắt tiền để đủ điều kiện áp mã rồi đổi lại phương thức giao hàng rẻ hơn.
   - Thiếu trần giảm giá cho mã % có thể dẫn đến thất thoát tài chính nghiêm trọng trên các đơn hàng giá trị lớn (ví dụ giảm 50% đơn 100 triệu VNĐ).
   - Thiếu sàn thanh toán có thể khiến tổng tiền đơn hàng bị âm (< 0 VNĐ) gây lỗi tính toán luồng thanh toán hoặc cổng thanh toán từ chối xử lý.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Điều kiện Giá trị đơn hàng tối thiểu (Min Order Value) chỉ tính trên **Tổng tiền hàng (Subtotal)**, không bao gồm phí vận chuyển và các phụ phí khác.
   - Bổ sung cấu hình `max_discount_amount` cho mã giảm phần trăm (%).
   - Mức sàn thanh toán tiền hàng sau chiết khấu tối thiểu là `0 VNĐ` (không bao giờ âm tiền). Phí vận chuyển được tính riêng trừ khi có mã miễn phí vận chuyển.
   - Giới hạn tối đa **01 mã giảm giá tiền hàng** cho mỗi đơn hàng; trường hợp sau này mở rộng mã Freeship thì cho phép tối đa 02 mã (01 mã sản phẩm + 01 mã Freeship).
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Giá trị đơn hàng tối thiểu (Min Order Value) được tính trên Tiền hàng (Subtotal) hay Tổng tiền bao gồm cả phí vận chuyển (Grand Total)? Mã giảm theo phần trăm (%) có quy định mức giảm tối đa (Max Cap) không? Khi số tiền giảm lớn hơn tiền hàng thì tổng tiền thanh toán sẽ về sàn 0 VNĐ hay có mức tối thiểu? Mỗi đơn hàng được áp dụng tối đa bao nhiêu mã giảm giá (1 mã duy nhất hay kết hợp)?"

---

### [MR-04] Thời điểm re-validate mã khi chốt đơn và cơ chế tạm giữ lượt mã (Voucher Holding) khi thanh toán online
1. **Mã Rule ID**: MR-04
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-05, BR-06](OUTPUT/01_Requirement_Summary_Report.md#L21-L22), [Section 7: Q4, Q6](OUTPUT/01_Requirement_Summary_Report.md#L73-L78) và [Section 9.1: Missing Operational Context](OUTPUT/01_Requirement_Summary_Report.md#L98) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W4 (When & State Transition)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**:
   - Tài liệu chưa quy định cơ chế **Tái kiểm tra tính hợp lệ (Re-validation)** tại thời điểm người dùng nhấn "Đặt hàng / Thanh toán": Nếu khách hàng nhập mã thành công lúc mã còn hạn hoặc còn lượt, nhưng treo màn hình đến khi mã hết hạn/hết lượt rồi mới bấm chốt đơn thì hệ thống xử lý ra sao?
   - Chưa quy định cơ chế **Tạm giữ lượt mã (Voucher Holding / Lock)** khi khách hàng chọn thanh toán trực tuyến qua cổng thanh toán (VNPay/MoMo/Thẻ quốc tế) với trạng thái chờ thanh toán (Pending Payment, thời gian chờ 15 phút): Lượt mã có được tạm khóa không? Nếu thanh toán thất bại/timeout thì lượt mã tạm giữ có được tự động khôi phục (release) lại quỹ mã không?
6. **Rủi ro & Tác động (Impact)**: 
   - Nếu không re-validate ở bước chốt đơn, người dùng có thể lách luật sử dụng các mã đã hết hạn hoặc hết ngân sách từ trước đó.
   - Nếu không tạm giữ lượt khi chuyển sang cổng thanh toán online, khách hàng thanh toán thành công trên cổng thanh toán vẫn có thể bị hủy đơn do lượt mã cuối cùng bị người khác chốt đơn COD trước (Race Condition). Ngược lại nếu khóa vĩnh viễn mà không nhả khi timeout/hủy đơn thì sẽ gây thất thoát/treo mã ảo (Phantom Lock).
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Hệ thống bắt buộc re-validate toàn bộ điều kiện mã (Hạn dùng, Lượt dùng, Min Order Value, Trạng thái tài khoản) ngay khi người dùng nhấn "Đặt hàng / Thanh toán". Nếu vi phạm, dừng luồng thanh toán, gỡ mã, cập nhật lại tổng tiền và thông báo lỗi.
   - Khi chuyển sang Cổng thanh toán trực tuyến, trạng thái lượt mã chuyển sang `PENDING_HOLD` với thời hạn tối đa 15 phút.
   - Nếu thanh toán thành công trong 15 phút: Mã chuyển sang `USED`.
   - Nếu thanh toán thất bại, người dùng hủy hoặc quá 15 phút timeout: Hệ thống tự động hủy đơn Pending và nhả trạng thái mã về `AVAILABLE` để người khác hoặc chính tài khoản đó tái sử dụng.
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Hệ thống có thực hiện re-validate toàn diện mã giảm giá tại thời điểm bấm 'Đặt hàng' để ngăn chặn mã hết hạn/hết lượt trong thời gian treo màn hình không? Khi chuyển sang cổng thanh toán trực tuyến (VNPay/MoMo), hệ thống có tạm giữ lượt mã trong 15 phút và tự động nhả lượt mã lại quỹ hệ thống nếu giao dịch bị hủy/timeout hay không?"

---

### [MR-05] Thuật toán phân bổ chiết khấu cho từng sản phẩm và xử lý hoàn trả từng phần (Partial Refund)
1. **Mã Rule ID**: MR-05
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-06](OUTPUT/01_Requirement_Summary_Report.md#L22), [Section 6: OUT OF SCOPE](OUTPUT/01_Requirement_Summary_Report.md#L60-L64), [Section 7: Q5](OUTPUT/01_Requirement_Summary_Report.md#L75-L76) và [Section 9.1: Missing Operational Context](OUTPUT/01_Requirement_Summary_Report.md#L98) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W5 (Which Dependency/Side-effect)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**:
   - Tài liệu chưa định nghĩa **Thuật toán phân bổ giá trị chiết khấu (Discount Line-Item Allocation)** vào từng sản phẩm trong đơn hàng.
   - Chưa quy định quy tắc xử lý khi khách hàng phát sinh yêu cầu hoàn trả hoặc hủy một phần đơn hàng (Partial Return / Partial Refund - ví dụ đơn gồm 2 sản phẩm A và B, khách trả lại sản phẩm A): Số tiền hoàn trả cho sản phẩm A được tính theo giá niêm yết gốc hay giá đã trừ phần chiết khấu phân bổ? Lượt dùng mã có được hoàn lại một phần hay không?
   - Chưa làm rõ quy tắc tác động chéo khi giỏ hàng bị chỉnh sửa số lượng / xóa sản phẩm ở bước thanh toán làm tổng tiền tụt xuống dưới mức Min Order Value.
6. **Rủi ro & Tác động (Impact)**: 
   - Thiếu thuật toán phân bổ chiết khấu dẫn đến việc bộ phận Kế toán/CSKH không có căn cứ tính tiền hoàn trả chính xác cho khách hàng, gây tranh chấp tài chính nếu khách đòi hoàn 100% giá gốc sản phẩm trong khi đơn hàng đã hưởng chiết khấu tổng.
   - Không tự động hủy mã khi giỏ hàng bị thay đổi giảm tiền dẫn đến vi phạm quy tắc Min Order Value.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Áp dụng thuật toán phân bổ chiết khấu tỷ lệ thuận theo giá trị từng dòng sản phẩm:
     $$\text{Discount}_{\text{item}} = \text{Total Discount} \times \frac{\text{Price}_{\text{item}} \times \text{Quantity}_{\text{item}}}{\text{Subtotal}}$$
   - Số tiền hoàn lại thực tế khi trả từng sản phẩm = $(\text{Price}_{\text{item}} \times \text{Quantity}_{\text{item}}) - \text{Discount}_{\text{item}}$.
   - Hủy/Trả toàn bộ đơn hàng: Khôi phục lại 01 lượt dùng mã cho khách hàng (nếu mã còn hạn); Trả hàng một phần (Partial Return): Không hoàn lại mã giảm giá.
   - Nếu khách hàng quay lại giỏ hàng sửa số lượng làm Subtotal < Min Order Value: Hệ thống tự động gỡ bỏ mã đã áp dụng và thông báo cho người dùng.
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Số tiền chiết khấu của mã giảm giá có được phân bổ theo tỷ lệ giá trị vào từng sản phẩm để làm căn cứ tính tiền hoàn trả khi trả hàng từng phần (Partial Refund) đúng không? Khi hủy toàn bộ đơn hàng thì mã có được hoàn lại lượt dùng cho khách không? Khi thay đổi giỏ hàng khiến tổng tiền không còn đủ Min Order Value, hệ thống có tự động gỡ mã không?"

---

### [MR-06] Quy chuẩn làm tròn số tiền chiết khấu VNĐ và cơ chế chống dò quét mã (Anti-Brute-Force)
1. **Mã Rule ID**: MR-06
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-06, BR-09, BR-10](OUTPUT/01_Requirement_Summary_Report.md#L22-L26) và [Section 9.1: Missing Financial & Usage Context](OUTPUT/01_Requirement_Summary_Report.md#L96-L97) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W6 (Why & Implicit Expectation)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**:
   - BR-09 quy định đơn vị tiền tệ là VNĐ, nhưng chưa quy định **Thuật toán làm tròn số tiền chiết khấu toán học** đối với mã giảm theo tỷ lệ phần trăm (%) khi kết quả phép nhân ra số lẻ (ví dụ: đơn hàng 125.500 VNĐ giảm 15% = 18.825 VNĐ thì làm tròn thành 18.825 VNĐ, 18.800 VNĐ hay 19.000 VNĐ; làm tròn `Math.round`, `Math.floor` hay `Math.ceil`).
   - Chưa quy định cơ chế kiểm soát tần suất thử mã (Rate Limiting / Anti-Brute-Force) tại ô nhập mã để ngăn chặn người dùng hoặc bot tự động gửi hàng loạt request thử các mã giảm giá ngẫu nhiên (Voucher coupon enumeration / cracking).
6. **Rủi ro & Tác động (Impact)**: 
   - Không chuẩn hóa thuật toán làm tròn sẽ gây sai lệch số liệu tài chính giữa giao diện người dùng (Frontend), logic tính toán Backend và hệ thống đối soát Kế toán/Cổng thanh toán.
   - Không có Rate Limiting khiến hệ thống dễ bị tấn công quá tải (DDoS ô nhập mã) hoặc bị lộ các mã bí mật dành riêng cho khách hàng VIP / nội bộ do bị dò quét tự động.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Số tiền chiết khấu theo phần trăm (%) được làm tròn theo quy tắc toán học chuẩn (`Math.round`) đến hàng đơn vị VNĐ nguyên (không có phần thập phân). Tổng tiền thanh toán = $\text{Subtotal} - \text{Discount Amount}$ (luôn là số nguyên VNĐ).
   - Thiết lập cơ chế Rate Limiting: 01 tài khoản hoặc 01 địa chỉ IP chỉ được phép gửi request "Áp dụng" mã sai tối đa 05 lần trong vòng 01 phút. Nếu vượt ngưỡng, tạm khóa tính năng áp mã trong 10 phút và phản hồi: `"Bạn đã nhập sai mã quá số lần quy định. Vui lòng thử lại sau 10 phút."`
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Số tiền chiết khấu (%) khi phát sinh số lẻ sẽ được làm tròn theo nguyên tắc toán học nào (`Math.round` đến hàng đơn vị VNĐ)? Hệ thống có áp dụng cơ chế giới hạn tần suất thử sai mã (Rate Limiting / Anti-Brute-Force, ví dụ tối đa 5 lần sai/phút) để ngăn chặn hành vi dò quét mã tự động hay không?"

---

## 3. Tổng hợp Câu hỏi Clarification gửi BA/PO (Actionable Items)

| STT | Mã Rule | Phân loại | Câu hỏi Clarification trực tiếp cho BA/PO | Mức độ ưu tiên (High/Medium/Low) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | MR-01 | Implicit & Authorization Rules | Mỗi mã giảm giá có quy định giới hạn số lần sử dụng tối đa trên từng tài khoản Khách hàng (Per-Customer Limit, ví dụ 1 lần/tài khoản) hay không? Có phân tách mã theo nhóm đối tượng (Khách mới / VIP / Tất cả) không? Nếu tài khoản Khách hàng bị khóa/đình chỉ ngay trước bước chốt đơn, hệ thống sẽ tự động gỡ mã và chặn đặt hàng hay xử lý ra sao? | High |
| 2 | MR-02 | Exception & Error Handling Rules | Hệ thống có cần chuẩn hóa danh mục thông báo lỗi chi tiết theo từng nguyên nhân thất bại cụ thể (hết hạn, hết lượt hệ thống, hết lượt tài khoản, chưa đủ Min Order Value, mã không tồn tại, ô nhập trống) hay không? Giới hạn độ dài ký tự tối đa của ô nhập mã là bao nhiêu (đề xuất 50 ký tự) và hệ thống có tự động cắt khoảng trắng thừa (trim) cùng chuẩn hóa hoa/thường không? | Medium |
| 3 | MR-03 | Boundary & Edge Rules | Giá trị đơn hàng tối thiểu (Min Order Value) được tính dựa trên Tiền hàng (Subtotal) hay Tổng tiền bao gồm cả phí vận chuyển (Grand Total)? Mã giảm theo phần trăm (%) có quy định mức giảm tối đa (Max Cap) không? Khi số tiền giảm lớn hơn tiền hàng thì tổng tiền thanh toán sẽ về sàn 0 VNĐ hay có mức sàn tối thiểu? Mỗi đơn hàng được áp dụng tối đa bao nhiêu mã giảm giá (1 mã duy nhất hay kết hợp)? | High |
| 4 | MR-04 | State & Lifecycle Rules | Hệ thống có thực hiện re-validate toàn diện mã giảm giá tại thời điểm bấm 'Đặt hàng' để ngăn chặn mã hết hạn/hết lượt trong thời gian treo màn hình không? Khi chuyển sang cổng thanh toán trực tuyến (VNPay/MoMo), hệ thống có tạm giữ lượt mã trong 15 phút và tự động nhả lượt mã lại quỹ hệ thống nếu giao dịch bị hủy/timeout hay không? | High |
| 5 | MR-05 | Dependency & Side-Effect Rules | Số tiền chiết khấu của mã giảm giá có được phân bổ theo tỷ lệ giá trị vào từng sản phẩm để làm căn cứ tính tiền hoàn trả khi trả hàng từng phần (Partial Refund) đúng không? Khi hủy toàn bộ đơn hàng thì mã có được hoàn lại lượt dùng cho khách không? Khi thay đổi giỏ hàng khiến tổng tiền không còn đủ Min Order Value, hệ thống có tự động gỡ mã không? | High |
| 6 | MR-06 | Implicit & Authorization Rules | Số tiền chiết khấu (%) khi phát sinh số lẻ sẽ được làm tròn theo nguyên tắc toán học nào (`Math.round` đến hàng đơn vị VNĐ)? Hệ thống có áp dụng cơ chế giới hạn tần suất thử sai mã (Rate Limiting / Anti-Brute-Force, ví dụ tối đa 5 lần sai/phút) để ngăn chặn hành vi dò quét mã tự động hay không? | Medium |
