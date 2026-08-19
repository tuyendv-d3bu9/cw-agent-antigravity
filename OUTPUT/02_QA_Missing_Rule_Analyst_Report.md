# BÁO CÁO PHÂN TÍCH QUY TẮC NGHIỆP VỤ BỊ THIẾU (MISSING-RULE REPORT)

## 1. Bảng Ma trận Truy vết Kỹ thuật 06W (06W Traceability Matrix)

| STT | Câu hỏi 06W | Trọng tâm kiểm tra | Trạng thái | Mã Missing Rule liên quan |
| :--- | :--- | :--- | :--- | :--- |
| W1 | Who/What initiates? | Tác nhân kích hoạt & Quyền hạn | Đã phát hiện | MR-01 |
| W2 | What if Invalid/Negative? | Luồng lỗi & Ca phủ định | Đã phát hiện | MR-02 |
| W3 | Where is Boundary/Limit? | Giá trị biên & Ngưỡng giới hạn | Đã phát hiện | MR-03 |
| W4 | When & State Transition? | Trình tự & Chuyển đổi trạng thái | Đã phát hiện | MR-04 |
| W5 | Which Dependency/Side-effect? | Phụ thuộc & Tác động chéo | Đã phát hiện | MR-05 |
| W6 | Why & Implicit Expectation? | Kỳ vọng ngầm & Tính toàn vẹn | Đã phát hiện | MR-06 |

---

## 2. Danh sách Chi tiết Missing Rules Phát hiện

### [MR-01] Quy định giới hạn số lần sử dụng trên từng tài khoản và kiểm soát trạng thái tài khoản
1. **Mã Rule ID**: MR-01
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-02, BR-16](OUTPUT/01_Requirement_Summary_Report.md#L18-L32) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W1 (Who/What initiates)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**: BR-16 quy định mã giảm giá có giới hạn số lần sử dụng (tổng lượt dùng toàn hệ thống), nhưng chưa quy định giới hạn số lần sử dụng tối đa của mã đối với **từng tài khoản Khách hàng (Per-Customer Usage Limit)**. Đồng thời, chưa làm rõ quy tắc xử lý khi tài khoản Khách hàng bị khóa/đình chỉ ở thời điểm giữa lúc nhập mã thành công và bấm chốt đơn thanh toán.
6. **Rủi ro & Tác động (Impact)**: Nếu không có giới hạn theo từng tài khoản, một người dùng có thể sử dụng lặp đi lặp lại mã giảm giá nhiều lần trên cùng 1 tài khoản (ví dụ mã chào mừng tân thủ/mã Hot Deal) làm cạn kiệt số lượng mã của hệ thống, gây mất công bằng và thất thoát chi phí khuyến mãi. Nếu không kiểm tra trạng thái tài khoản ở bước chốt đơn, tài khoản bị khóa vẫn có thể hoàn tất giao dịch hưởng chiết khấu.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Cấu hình bổ sung thuộc tính `max_per_user` cho mỗi mã giảm giá (mặc định = 1 lượt/tài khoản đối với mã khuyến mãi chung, trừ khi có cấu hình riêng). Hệ thống kiểm tra đồng thời cả tổng lượt dùng toàn hệ thống VÀ số lượt đã sử dụng của tài khoản hiện tại.
   - Hệ thống tự động re-validate trạng thái tài khoản Customer (phải là `Active`) tại bước "Chốt đơn/Thanh toán". Nếu tài khoản bị khóa (`Disabled/Suspended`), hệ thống tự động gỡ bỏ mã giảm giá, hủy giao dịch và báo lỗi phù hợp.
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Mỗi mã giảm giá có quy định giới hạn số lần sử dụng tối đa trên từng tài khoản Khách hàng (Per-Customer Limit, ví dụ mỗi tài khoản chỉ được dùng 1 lần) hay không? Nếu tài khoản Khách hàng bị chuyển trạng thái Khóa/Đình chỉ ngay trước bước chốt đơn, hệ thống sẽ gỡ mã và chặn đặt hàng hay xử lý ra sao?"

---

### [MR-02] Quy chuẩn thông báo lỗi chi tiết theo nguyên nhân và kiểm soát độ dài chuỗi nhập mã
1. **Mã Rule ID**: MR-02
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-07, BR-11](OUTPUT/01_Requirement_Summary_Report.md#L23-L27) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W2 (What if Invalid/Negative)
4. **Phân loại**: Exception & Error Handling Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**: BR-07 mới chỉ nêu gộp chung "khi mã giảm giá không hợp lệ hoặc đã quá ngày hết hạn, hệ thống hiển thị thông báo lỗi tương ứng", chưa định nghĩa danh mục thông báo lỗi (Error Messages) phân biệt rõ từng nguyên nhân thất bại: (1) Mã không tồn tại/gõ sai, (2) Mã hết hạn sử dụng, (3) Mã hết lượt sử dụng hệ thống, (4) Mã hết lượt dùng của tài khoản, (5) Đơn hàng chưa đạt giá trị tối thiểu, (6) Ô nhập trống. Ngoài ra, tài liệu chưa quy định giới hạn độ dài ký tự tối đa của ô nhập mã (Max Length).
6. **Rủi ro & Tác động (Impact)**: Thông báo lỗi chung chung gây bối rối cho người dùng (UX kém), khiến người dùng không biết cần điều chỉnh giỏ hàng hay đổi mã khác. Ô nhập mã không giới hạn độ dài tiềm ẩn nguy cơ bị tấn công tràn bộ đệm (Buffer Overflow) hoặc gửi chuỗi cực đại gây suy giảm hiệu năng hệ thống.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Giới hạn độ dài ô nhập mã từ 1 đến 50 ký tự. Nếu nhấn nút "Áp dụng" khi ô nhập trống, hiển thị thông báo lỗi inline: `"Vui lòng nhập mã giảm giá"`.
   - Quy chuẩn danh mục câu thông báo lỗi phản hồi chính xác theo từng nguyên nhân:
     + Mã không tồn tại: `"Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."`
     + Mã hết hạn: `"Mã giảm giá đã hết hạn sử dụng."`
     + Mã hết lượt dùng chung: `"Mã giảm giá đã hết lượt sử dụng."`
     + Đã dùng hết lượt tài khoản: `"Tài khoản của bạn đã sử dụng hết lượt cho mã giảm giá này."`
     + Chưa đủ giá trị tối thiểu: `"Tổng giá trị sản phẩm chưa đạt mức tối thiểu [Min_Order_Value] VNĐ để áp dụng mã."`
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Hệ thống có cần chuẩn hóa danh mục thông báo lỗi phản hồi riêng biệt cho từng trường hợp thất bại (hết hạn, hết lượt dùng hệ thống, hết lượt tài khoản, chưa đủ giá trị tối thiểu, mã không tồn tại) hay không? Độ dài ký tự tối đa cho phép của ô nhập mã giảm giá là bao nhiêu?"

---

### [MR-03] Phạm vi tính Min Order Value (Subtotal vs Grand Total), sàn giảm giá cho mã tiền cố định và giới hạn số mã áp dụng
1. **Mã Rule ID**: MR-03
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-04, BR-12, BR-13](OUTPUT/01_Requirement_Summary_Report.md#L20-L29) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W3 (Where is Boundary/Limit)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**:
   - BR-04 sử dụng thuật ngữ "tổng giá trị đơn hàng", nhưng chưa phân định rõ đây là **Tổng giá trị tiền hàng trước phí vận chuyển/thuế (Subtotal)** hay **Tổng tiền thanh toán cuối cùng bao gồm cả phí vận chuyển (Grand Total)**.
   - BR-12 quy định trần giảm giá 50.000 VNĐ cho mã %, nhưng chưa quy định **Mức sàn thanh toán tối thiểu (Discount Floor)** khi áp dụng mã giảm tiền cố định (VNĐ) có giá trị chiết khấu lớn hơn hoặc bằng giá trị tiền hàng (ví dụ: tiền hàng 40.000 VNĐ nhưng áp mã giảm 50.000 VNĐ).
   - BR-13 cho phép áp dụng đồng thời nhiều mã giảm giá, nhưng chưa quy định **số lượng mã tối đa** được nhập/kết hợp trên cùng 01 đơn hàng.
6. **Rủi ro & Tác động (Impact)**: Nếu tính Min Order Value trên Grand Total (bao gồm phí ship), khách hàng có thể cố tình chọn dịch vụ giao hàng đắt tiền để đủ điều kiện áp mã. Nếu không quy định sàn giảm giá, tổng tiền thanh toán tiền hàng có thể bị âm (< 0 VNĐ) gây lỗi tính toán logic hệ thống. Nếu không giới hạn số mã áp dụng đồng thời, người dùng có thể áp hàng chục mã làm tổng tiền đơn hàng về 0 VNĐ không kiểm soát.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Điều kiện Giá trị đơn hàng tối thiểu (Min Order Value) chỉ được tính dựa trên **Tổng giá trị sản phẩm trong giỏ hàng (Subtotal)**, không bao gồm phí vận chuyển và phụ phí.
   - Tổng số tiền chiết khấu tiền hàng tối đa không được vượt quá Subtotal của đơn hàng. Mức sàn thanh toán tiền hàng sau chiết khấu là `0 VNĐ` (không âm), phí vận chuyển vẫn được tính riêng (trừ khi áp mã miễn phí vận chuyển).
   - Giới hạn số lượng mã giảm giá áp dụng tối đa là **02 mã / 01 đơn hàng** (ví dụ: 01 Mã chiết khấu sản phẩm + 01 Mã miễn phí vận chuyển).
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Giá trị đơn hàng tối thiểu (Min Order Value) được tính dựa trên Tiền hàng (Subtotal) hay Tổng tiền bao gồm cả phí ship (Grand Total)? Đối với mã giảm tiền cố định VNĐ lớn hơn giá trị tiền hàng, tổng tiền thanh toán tiền hàng sẽ về sàn 0 VNĐ hay quy định mức thanh toán tối thiểu? Số lượng mã giảm giá tối đa được áp dụng đồng thời trên 1 đơn hàng là bao nhiêu (đề xuất: 2 mã)?"

---

### [MR-04] Cơ chế tạm giữ lượt (Voucher Holding) và vòng đời mã khi thanh toán trực tuyến bị gián đoạn/timeout
1. **Mã Rule ID**: MR-04
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-14, BR-16](OUTPUT/01_Requirement_Summary_Report.md#L30-L32) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W4 (When & State Transition)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**: Tài liệu chưa quy định cơ chế giữ lượt sử dụng mã (Voucher Holding/Locking) khi khách hàng nhấn "Đặt hàng" và được chuyển hướng sang cổng thanh toán trực tuyến (VNPay/MoMo/Thẻ quốc tế). Trong thời gian chờ thanh toán (Pending Payment, ví dụ 15 phút): Lượt dùng mã có được tạm khóa cho khách hàng đó hay không? Nếu giao dịch thanh toán trực tuyến bị hủy giữa chừng, lỗi kết nối hoặc hết hạn thời gian chờ (timeout): Lượt dùng mã tạm giữ có được tự động khôi phục (release) về quỹ mã của hệ thống hay không?
6. **Rủi ro & Tác động (Impact)**: Nếu không giữ lượt khi chuyển sang cổng thanh toán, khách hàng đã hoàn tất thanh toán tiền trên VNPay vẫn có thể bị hệ thống báo lỗi không hoàn tất được đơn hàng do lượt mã cuối cùng vừa bị người khác chốt đơn COD trước đó vài giây. Nếu giữ lượt mà không có cơ chế tự động nhả (release) khi timeout, lượt dùng mã sẽ bị treo vĩnh viễn (phantom lock) gây lãng phí ngân sách khuyến mãi.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Khi người dùng bấm "Đặt hàng" chọn thanh toán online, hệ thống đổi trạng thái lượt mã thành `PENDING_HOLD` với thời hạn tạm giữ là 15 phút.
   - Nếu thanh toán thành công trong 15 phút: Trạng thái mã chuyển thành `USED` (Đã sử dụng).
   - Nếu thanh toán thất bại, người dùng hủy giao dịch hoặc hết 15 phút timeout: Hệ thống hủy đơn hàng Pending và tự động nhả trạng thái lượt mã về `AVAILABLE` để người khác hoặc chính tài khoản đó tiếp tục sử dụng.
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Khi khách hàng chuyển sang Cổng thanh toán trực tuyến (VNPay/MoMo), hệ thống có giữ tạm lượt sử dụng mã trong thời hạn quy định (ví dụ 15 phút) hay không? Nếu giao dịch thanh toán trực tuyến thất bại hoặc quá thời gian chờ (timeout), lượt mã tạm giữ có được tự động khôi phục lại quỹ mã toàn hệ thống hay không?"

---

### [MR-05] Quy tắc phân bổ chiết khấu cho từng dòng sản phẩm và xử lý hoàn trả từng phần (Partial Refund)
1. **Mã Rule ID**: MR-05
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-15](OUTPUT/01_Requirement_Summary_Report.md#L31) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W5 (Which Dependency/Side-effect)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**: BR-15 đã quy định mã giảm giá không được hoàn trả khi đơn hàng bị hủy hoặc trả hàng. Tuy nhiên, tài liệu chưa định nghĩa **Thuật toán phân bổ giá trị chiết khấu (Discount Allocation Ratio)** vào từng sản phẩm (Line Items) trong đơn hàng. Khi khách hàng phát sinh yêu cầu trả 1 sản phẩm trong đơn hàng gồm nhiều sản phẩm (Partial Return/Refund), số tiền hoàn lại cho sản phẩm đó được tính theo giá niêm yết gốc hay giá đã phân bổ trừ chiết khấu? Ngoài ra, có danh mục sản phẩm/ngành hàng nào bị loại trừ (Excluded Categories) không được áp dụng mã giảm giá không?
6. **Rủi ro & Tác động (Impact)**: Không có thuật toán phân bổ chiết khấu khiến bộ phận Kế toán / CSKH không thể tính toán chính xác số tiền hoàn trả cho khách hàng khi trả hàng từng phần, dễ dẫn đến tranh chấp nếu khách đòi hoàn 100% giá gốc sản phẩm trong khi đơn hàng đã hưởng tổng chiết khấu lớn.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Tổng số tiền chiết khấu của đơn hàng được phân bổ tỷ lệ thuận theo giá trị tiền hàng của từng dòng sản phẩm:
     $$\text{Discount}_{\text{item}} = \text{Total Discount} \times \frac{\text{Price}_{\text{item}} \times \text{Quantity}_{\text{item}}}{\text{Subtotal}}$$
   - Số tiền hoàn trả thực tế khi trả từng sản phẩm = $(\text{Price}_{\text{item}} \times \text{Quantity}_{\text{item}}) - \text{Discount}_{\text{item}}$.
   - Mã giảm giá áp dụng mặc định cho tất cả sản phẩm, trừ danh mục sản phẩm bị Admin đánh dấu "Loại trừ khuyến mãi" trong Back-office.
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Số tiền chiết khấu của mã giảm giá sẽ được phân bổ tỷ lệ thuận vào từng sản phẩm trong đơn hàng để làm căn cứ tính tiền hoàn trả khi khách hàng trả từng phần sản phẩm (Partial Refund) đúng không? Có danh mục sản phẩm hoặc ngành hàng đặc thù nào bị loại trừ không được áp dụng mã giảm giá hay không?"

---

### [MR-06] Quy tắc giới hạn tần suất thử mã (Anti-Brute-Force) và quy chuẩn làm tròn số tiền chiết khấu
1. **Mã Rule ID**: MR-06
2. **Căn cứ Requirement gốc**: Trích dẫn [Section 3: BR-08, BR-10](OUTPUT/01_Requirement_Summary_Report.md#L24-L26) từ tài liệu Step 01.
3. **Câu hỏi 06W tương ứng**: W6 (Why & Implicit Expectation)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / Quy tắc bị thiếu**:
   - BR-08 nêu "đơn vị tiền tệ VNĐ được làm tròn theo quy ước hiển thị", nhưng chưa xác định quy tắc làm tròn toán học cụ thể (ví dụ: làm tròn đến hàng đơn vị VNĐ, làm tròn xuống `Math.floor` hay làm tròn theo quy tắc toán học `Math.round` đến hàng trăm VNĐ) đối với số tiền chiết khấu tính theo phần trăm (%).
   - Tài liệu chưa quy định cơ chế kiểm soát tần suất thử mã (Rate Limiting / Anti-Brute-Force) để bảo vệ hệ thống khỏi các công cụ tự động (Bot/Script) thử hàng loạt mã ngẫu nhiên nhằm dò tìm mã giảm giá bí mật (Private Vouchers).
6. **Rủi ro & Tác động (Impact)**: Không làm rõ thuật toán làm tròn sẽ gây chênh lệch tiền lẻ (1 VNĐ) giữa Frontend, Backend và báo cáo tài chính Kế toán. Không có cơ chế chống brute-force khiến hệ thống dễ bị quá tải (DDoS) và nguy cơ rò rỉ các mã giảm giá nội bộ/VIP.
7. **Đề xuất hành vi xử lý (Proposed Default Behavior)**:
   - Số tiền chiết khấu tính toán theo phần trăm (%) được làm tròn theo quy tắc toán học chuẩn (`Math.round`) đến hàng đơn vị VNĐ (không để số thập phân).
   - Áp dụng Rate Limiting: 1 Tài khoản / IP chỉ được phép bấm "Áp dụng" mã sai tối đa 05 lần trong 01 phút. Nếu vượt quá, khóa tạm thời tính năng áp mã trong 15 phút và hiển thị thông báo: `"Bạn đã thử mã sai quá số lần quy định. Vui lòng thử lại sau 15 phút."`
8. **Câu hỏi xác nhận trực tiếp cho BA/PO (Clarification Question)**: "Số tiền chiết khấu toán học (%) được làm tròn theo quy tắc nào (làm tròn chuẩn `Math.round` đến hàng đơn vị VNĐ)? Hệ thống có áp đặt giới hạn số lần thử sai mã tối đa (ví dụ 5 lần/phút/tài khoản) để chống dò quét mã tự động (Anti-Brute-Force) hay không?"

---

## 3. Tổng hợp Câu hỏi Clarification gửi BA/PO (Actionable Items)

| STT | Mã Rule | Phân loại | Câu hỏi Clarification trực tiếp cho BA/PO | Mức độ ưu tiên (High/Medium/Low) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | MR-01 | Implicit & Authorization Rules | Mỗi mã giảm giá có quy định giới hạn số lần sử dụng tối đa trên từng tài khoản Khách hàng (Per-Customer Limit, ví dụ 1 lần/tài khoản) hay không? Nếu tài khoản bị Khóa/Đình chỉ trước bước chốt đơn, hệ thống có tự gỡ mã và ngăn đặt hàng không? | High |
| 2 | MR-02 | Exception & Error Handling Rules | Hệ thống có cần chuẩn hóa danh mục thông báo lỗi phản hồi riêng biệt cho từng trường hợp thất bại (hết hạn, hết lượt hệ thống, hết lượt tài khoản, chưa đủ giá trị tối thiểu, mã không tồn tại) hay không? Độ dài ký tự tối đa cho phép của ô nhập mã là bao nhiêu? | Medium |
| 3 | MR-03 | Boundary & Edge Rules | Giá trị đơn hàng tối thiểu (Min Order Value) được tính dựa trên Tiền hàng (Subtotal) hay Tổng tiền bao gồm phí ship (Grand Total)? Đối với mã giảm tiền cố định lớn hơn giá trị tiền hàng, tổng tiền hàng sẽ về sàn 0 VNĐ hay có mức tối thiểu? Số lượng mã tối đa được áp dụng đồng thời trên 1 đơn hàng là bao nhiêu (đề xuất: 2 mã)? | High |
| 4 | MR-04 | State & Lifecycle Rules | Khi khách hàng chuyển sang Cổng thanh toán trực tuyến (VNPay/MoMo), hệ thống có giữ tạm lượt sử dụng mã trong thời hạn quy định (ví dụ 15 phút) hay không? Nếu giao dịch thất bại hoặc timeout, lượt mã tạm giữ có được tự động khôi phục lại quỹ mã toàn hệ thống hay không? | High |
| 5 | MR-05 | Dependency & Side-Effect Rules | Số tiền chiết khấu của mã giảm giá sẽ được phân bổ tỷ lệ thuận vào từng sản phẩm trong đơn hàng để làm căn cứ tính tiền hoàn trả khi khách hàng trả từng phần sản phẩm (Partial Refund) đúng không? Có danh mục sản phẩm/ngành hàng nào bị loại trừ không được áp dụng mã giảm giá không? | High |
| 6 | MR-06 | Implicit & Authorization Rules | Số tiền chiết khấu toán học (%) được làm tròn theo quy tắc nào (làm tròn chuẩn `Math.round` đến hàng đơn vị VNĐ)? Hệ thống có áp đặt giới hạn số lần thử sai mã tối đa (ví dụ 5 lần/phút/tài khoản) để chống dò quét mã tự động (Anti-Brute-Force) hay không? | Medium |
