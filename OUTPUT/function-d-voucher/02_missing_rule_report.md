# BÁO CÁO PHÂN TÍCH QUY TẮC NGHIỆP VỤ BỊ THIẾU (MISSING-RULE REPORT) · function-d-voucher
Owner: qa-analyst/02-missing-rule-06w · Nguồn: output/function-d-voucher/01_requirement_risk_summary.md, knowledge/function-d-voucher.md · Verdict: PASS

---

## 1. Ma trận Truy vết 06W

| STT | Câu hỏi 06W | Trọng tâm kiểm tra | Trạng thái | Mã Missing Rule liên quan |
|:---|:---|:---|:---|:---|
| **W1** | Who/What initiates? | Tác nhân kích hoạt, phân quyền tài khoản, điều kiện áp dụng theo user role | Đã phát hiện | **MR-01** (Phân quyền voucher theo đối tượng người dùng) |
| **W2** | What if Invalid/Negative? | Xử lý ngoại lệ, hủy/đổi mã, nhập chuỗi đặc biệt, số dư âm | Đã phát hiện | **MR-02** (Hủy/đổi mã giảm giá), **MR-08** (Xử lý khi số tiền giảm lớn hơn tổng giá trị đơn hàng) |
| **W3** | Where is Boundary/Limit? | Giá trị biên, trần giảm giá tối đa (Max Cap), căn cứ tính chiết khấu Subtotal vs Total | Đã phát hiện | **MR-03** (Trần giảm tối đa Max Discount Cap), **MR-04** (Căn cứ tính min order value và chiết khấu) |
| **W4** | When & State Transition? | Mốc thời gian hiệu lực, hoàn mã khi hủy đơn, giới hạn số lượt sử dụng | Đã phát hiện | **MR-05** (Giới hạn lượt dùng toàn sàn & per-user), **MR-06** (Cơ chế hoàn voucher khi hủy đơn/trả hàng) |
| **W5** | Which Dependency/Side-effect? | Gộp nhiều voucher, thay đổi số lượng giỏ hàng sau khi đã áp mã, tác động tới phí ship | Đã phát hiện | **MR-07** (Quy tắc gộp nhiều voucher), **MR-09** (Tự động tính lại chiết khấu khi thay đổi giỏ hàng) |
| **W6** | Why & Implicit Expectation? | Quy tắc làm tròn tiền tệ VNĐ, phân biệt chữ hoa/chữ thường (Case-sensitivity) | Đã phát hiện | **MR-10** (Quy tắc làm tròn số thập phân và Case-sensitivity của mã voucher) |

---

## 2. Chi tiết Missing Rules

### [MR-01] Phân quyền và phạm vi áp dụng voucher theo đối tượng khách hàng
1. **Mã Rule ID**: MR-01
2. **Căn cứ Requirement gốc**: BR-02 ("Khách vãng lai bắt buộc phải đăng nhập khi thanh toán...") kết hợp `INPUT/OVERVIEW.md §3`
3. **Câu hỏi 06W tương ứng**: W1 (Who/What initiates?)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Tài liệu chưa quy định voucher có được phân loại theo nhóm khách hàng (vd: Voucher chào mừng khách mới đăng ký, Voucher hạng Thành viên Thân thiết / VIP) hay áp dụng chung cho mọi tài khoản Customer.
6. **Rủi ro & Tác động**: Khách hàng cũ có thể lợi dụng sử dụng các mã khuyến mãi dành riêng cho khách hàng mới, gây thất thoát ngân sách tiếp thị và sai lệch mục tiêu kinh doanh.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Hệ thống hỗ trợ cấu hình điều kiện áp dụng voucher theo đối tượng khách hàng (Tất cả khách hàng / Khách hàng mới / Phân hạng VIP). Nếu khách hàng không thuộc nhóm đối tượng được hưởng, hệ thống hiển thị thông báo lỗi: *"Mã giảm giá này chỉ dành riêng cho khách hàng thỏa mãn điều kiện chương trình"*.
8. **Câu hỏi xác nhận cho BA/PO**: Voucher có được phân quyền theo nhóm khách hàng (Khách mới / VIP / Toàn bộ) không, hay áp dụng chung cho mọi Customer?

---

### [MR-02] Quy tắc Hủy và Thay đổi mã giảm giá tại trang Thanh toán
1. **Mã Rule ID**: MR-02
2. **Căn cứ Requirement gốc**: BR-01 ("Tại trang Thanh toán, khách hàng có ô nhập 'Mã giảm giá' và nút 'Áp dụng'")
3. **Câu hỏi 06W tương ứng**: W2 (What if Invalid/Negative?)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Tài liệu chỉ mô tả hành động nhập và áp dụng mã thành công, chưa có quy tắc cho phép khách hàng hủy mã (Remove/Clear voucher) hoặc nhập mã mới đè lên mã cũ trước khi bấm "Đặt hàng".
6. **Rủi ro & Tác động**: Khách hàng muốn đổi sang mã ưu đãi tốt hơn hoặc không muốn dùng mã thì bị kẹt giao diện, buộc phải thoát trang thanh toán hoặc hủy giỏ hàng, làm tăng tỷ lệ bỏ đơn (Cart abandonment).
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Sau khi áp dụng mã thành công, giao diện chuyển nút "Áp dụng" thành nút "Hủy mã" (hoặc hiển thị icon [X] bên cạnh mã đang áp dụng). Khi bấm "Hủy mã", hệ thống xóa chiết khấu, khôi phục tổng tiền ban đầu và trả ô nhập về trạng thái rỗng để khách hàng có thể nhập mã khác.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có hỗ trợ nút "Hủy mã" sau khi đã áp dụng thành công để khách hàng đổi sang mã khác không?

---

### [MR-03] Thiết lập Trần giảm giá tối đa (Max Discount Cap) cho mã giảm theo %
1. **Mã Rule ID**: MR-03
2. **Căn cứ Requirement gốc**: BR-03 ("Có 2 loại mã: giảm theo % và giảm số tiền cố định VND") kết hợp `INPUT/OVERVIEW.md §6`
3. **Câu hỏi 06W tương ứng**: W3 (Where is Boundary/Limit?)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa xác định rõ mã giảm giá theo phần trăm (%) có quy định mức giảm tối đa (Max Cap) hay không (Ví dụ: Giảm 20% tối đa 100.000 VNĐ cho đơn từ 300.000 VNĐ).
6. **Rủi ro & Tác động**: Nếu không có trần giảm giá, các đơn hàng giá trị rất lớn (vd: 50.000.000 VNĐ) áp mã 20% sẽ được giảm tới 10.000.000 VNĐ, gây vượt ngân sách khuyến mãi và thất thoát doanh thu nặng nề cho nhà bán hàng.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Mỗi mã giảm giá % có trường cấu hình `Max Discount Cap` (tùy chọn). Nếu công thức `Tổng tiền hàng × % Giảm > Max Cap`, hệ thống sẽ áp dụng mức giảm đúng bằng `Max Cap`.
8. **Câu hỏi xác nhận cho BA/PO**: Mã giảm giá % có bắt buộc/tùy chọn thiết lập mức trần giảm giá tối đa (Max Discount Cap) không?

---

### [MR-04] Căn cứ tính Giá trị đơn hàng tối thiểu và Chiết khấu (Subtotal vs Total)
1. **Mã Rule ID**: MR-04
2. **Căn cứ Requirement gốc**: BR-04 ("Mã chỉ dùng được khi đơn hàng đạt giá trị tối thiểu quy định của mã")
3. **Câu hỏi 06W tương ứng**: W3 (Where is Boundary/Limit?) & W5 (Which Dependency/Side-effect?)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa định nghĩa rõ "Giá trị đơn hàng" dùng để so sánh với `min order value` và tính tiền giảm là Tiền hàng trước phí ship (Subtotal) hay Tổng tiền thanh toán đã bao gồm Phí vận chuyển (Grand Total).
6. **Rủi ro & Tác động**: Tính sai chiết khấu (giảm lấn sang phí vận chuyển của đơn vị thứ ba) hoặc khách hàng lách luật thêm phí ship để đạt ngưỡng min order value.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Điều kiện `min order value` và phần trăm chiết khấu chỉ được tính trên Tổng tiền hàng sản phẩm (Subtotal), hoàn toàn không tính trên Phí vận chuyển (Shipping fee).
8. **Câu hỏi xác nhận cho BA/PO**: Ngưỡng `min order value` và số tiền giảm giá được tính trên Tiền hàng (Subtotal) hay Tổng hóa đơn bao gồm cả Phí vận chuyển?

---

### [MR-05] Giới hạn số lượt sử dụng voucher (Tổng lượt dùng toàn sàn & Lượt dùng mỗi User)
1. **Mã Rule ID**: MR-05
2. **Căn cứ Requirement gốc**: BR-05 ("Mỗi mã có ngày hết hạn")
3. **Câu hỏi 06W tương ứng**: W4 (When & State Transition?)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Ngoài hạn sử dụng theo ngày, tài liệu chưa đề cập đến giới hạn số lượng phát hành (Total usage quota) và giới hạn số lần mỗi tài khoản được dùng mã đó (Per-user usage limit).
6. **Rủi ro & Tác động**: Một tài khoản có thể sử dụng liên tục một mã voucher nhiều lần để đầu cơ trục lợi, hoặc mã vượt quá số lượng ngân sách cho phép của chiến dịch marketing.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Mặc định mỗi voucher có thiết lập: (1) Tổng số lượt sử dụng tối đa toàn sàn, (2) Số lần tối đa mỗi khách hàng được sử dụng (mặc định = 1 lần/tài khoản). Khi hết lượt, hệ thống báo lỗi: *"Mã giảm giá đã hết lượt sử dụng"*.
8. **Câu hỏi xác nhận cho BA/PO**: Mỗi mã voucher có giới hạn tổng số lượt sử dụng và số lần áp dụng tối đa trên mỗi tài khoản người dùng không?

---

### [MR-06] Cơ chế xử lý hoàn lại voucher khi Đơn hàng bị Hủy hoặc Trả hàng / Hoàn tiền
1. **Mã Rule ID**: MR-06
2. **Căn cứ Requirement gốc**: `INPUT/OVERVIEW.md §4 (Nhóm F & G)`
3. **Câu hỏi 06W tương ứng**: W4 (When & State Transition?) & W5 (Which Dependency/Side-effect?)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa xác định khi đơn hàng đã áp dụng voucher bị Hủy (bởi khách/hệ thống) hoặc Trả hàng - Hoàn tiền về Ví ShopGo thì lượt dùng của voucher đó có được hoàn lại cho khách hay không.
6. **Rủi ro & Tác động**: Nếu không hoàn lại, khách hàng bị mất voucher chính đáng khi hủy đơn chưa thanh toán; nếu hoàn lại không kiểm soát hạn dùng, khách có thể trục lợi lấy lại mã đã hết hạn.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Nếu đơn hàng bị Hủy trước khi giao hàng và mã voucher vẫn còn trong hạn sử dụng thì hệ thống tự động hoàn lại lượt sử dụng cho khách hàng. Nếu voucher đã hết hạn tại thời điểm hủy đơn thì không hoàn lại.
8. **Câu hỏi xác nhận cho BA/PO**: Khi đơn hàng bị hủy hoặc hoàn tiền, mã voucher đã dùng có được hoàn trả lại cho khách hàng không?

---

### [MR-07] Quy tắc áp dụng đồng thời (Gộp) nhiều voucher trong cùng một đơn hàng
1. **Mã Rule ID**: MR-07
2. **Căn cứ Requirement gốc**: BR-01 ("khách hàng có ô nhập 'Mã giảm giá'")
3. **Câu hỏi 06W tương ứng**: W5 (Which Dependency/Side-effect?)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Tài liệu chưa nêu rõ một đơn hàng chỉ được dùng duy nhất 01 voucher hay cho phép áp dụng đồng thời nhiều voucher khác loại (ví dụ: 1 Voucher giảm giá sản phẩm + 1 Voucher miễn phí vận chuyển Freeship).
6. **Rủi ro & Tác động**: Khách hàng áp dụng chồng chéo nhiều voucher giảm giá sản phẩm khiến giá đơn hàng về 0 hoặc âm, gây thiệt hại tài chính.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Hệ thống áp dụng quy tắc: Tối đa 01 voucher giảm giá sản phẩm trên 1 đơn hàng. Không cho phép gộp 2 voucher cùng loại.
8. **Câu hỏi xác nhận cho BA/PO**: Một đơn hàng được áp dụng tối đa bao nhiêu voucher? Có cho phép gộp nhiều voucher khác loại không?

---

### [MR-08] Xử lý ngoại lệ khi Giá trị giảm giá cố định (VNĐ) lớn hơn Tổng tiền hàng
1. **Mã Rule ID**: MR-08
2. **Căn cứ Requirement gốc**: BR-03 ("giảm số tiền cố định (VND)"), BR-06 ("tổng tiền mới")
3. **Câu hỏi 06W tương ứng**: W2 (What if Invalid/Negative?)
4. **Phân loại**: Exception & Error Handling Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Khi mã giảm cố định số tiền lớn (ví dụ giảm 100.000 VNĐ) áp dụng cho đơn hàng có tiền hàng nhỏ hơn (ví dụ 80.000 VNĐ thỏa mãn min order value 50.000 VNĐ), công thức trừ tiền có làm tổng tiền bị âm không.
6. **Rủi ro & Tác động**: Lỗi số học làm tổng tiền âm (`-20.000 VNĐ`), gây sập cổng thanh toán hoặc lỗi ghi nhận doanh thu vào cơ sở dữ liệu.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Tổng tiền thanh toán sau giảm giá tối thiểu là 0 VNĐ (Không phát sinh số tiền âm). Số tiền thừa của voucher không được quy đổi ra tiền mặt hay chuyển thành số dư ví.
8. **Câu hỏi xác nhận cho BA/PO**: Khi số tiền giảm cố định (VNĐ) lớn hơn tổng tiền hàng, tổng tiền mới sẽ về 0 VNĐ hay có quy tắc nào khác?

---

### [MR-09] Tự động tính toán lại chiết khấu khi thay đổi Giỏ hàng sau khi đã áp mã
1. **Mã Rule ID**: MR-09
2. **Căn cứ Requirement gốc**: BR-04 ("Mã chỉ dùng được khi đơn hàng đạt giá trị tối thiểu quy định của mã")
3. **Câu hỏi 06W tương ứng**: W5 (Which Dependency/Side-effect?)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Nếu khách hàng quay lại giỏ hàng giảm số lượng hoặc xóa sản phẩm làm tổng tiền tụt xuống dưới `min order value`, khi quay lại trang Thanh toán thì voucher đã áp dụng trước đó sẽ được xử lý ra sao.
6. **Rủi ro & Tác động**: Khách hàng trục lợi bằng cách thêm nhiều hàng để đạt min order value, áp mã giảm giá thành công rồi giảm bớt số lượng sản phẩm nhưng vẫn giữ nguyên tiền chiết khấu.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]` Mỗi khi có sự thay đổi về thành phần/giá trị đơn hàng hoặc khi tải lại trang Thanh toán, hệ thống phải tự động tái kiểm tra điều kiện của voucher. Nếu không còn thỏa mãn `min order value`, voucher tự động bị hủy và thông báo cho người dùng.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có tự động re-validate và hủy voucher nếu giá trị đơn hàng bị giảm xuống dưới mức tối thiểu sau khi chỉnh sửa giỏ hàng không?

---

### [MR-10] Quy tắc làm tròn số tiền chiết khấu lẻ và Phân biệt chữ hoa/chữ thường (Case-sensitivity)
1. **Mã Rule ID**: MR-10
2. **Căn cứ Requirement gốc**: BR-03 ("giảm theo phần trăm (%)"), BR-09 ("tiền tệ VNĐ, làm tròn theo quy ước")
3. **Câu hỏi 06W tương ứng**: W6 (Why & Implicit Expectation?)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: 
   - Mã % khi nhân với giá trị đơn hàng có thể sinh ra số tiền lẻ (ví dụ giảm 15% của 135.000 VNĐ = 20.250 VNĐ) chưa có quy tắc làm tròn (làm tròn đến hàng đơn vị VNĐ hay hàng nghìn).
   - Ô nhập mã có phân biệt chữ hoa / chữ thường (`SHOPGO10` vs `shopgo10`) và có tự động loại bỏ khoảng trắng đầu/cuối (Trim space) hay không.
6. **Rủi ro & Tác động**: Khách hàng nhập đúng ký tự nhưng viết thường bị báo lỗi gây trải nghiệm tệ; sai lệch số lẻ tiền đồng gây khó khăn cho việc đối soát thanh toán và kết toán sổ sách.
7. **Đề xuất hành vi xử lý mặc định**: `[GIẢ ĐỊNH]`
   - Tiền chiết khấu VNĐ làm tròn số nguyên gần nhất (không có chữ số thập phân).
   - Mã voucher không phân biệt hoa thường (Case-insensitive, tự động uppercase khi xử lý) và tự động trim khoảng trắng thừa đầu/cuối.
8. **Câu hỏi xác nhận cho BA/PO**: 
   - Tiền giảm giá VNĐ có làm tròn đến hàng đơn vị hay quy tròn hàng nghìn?
   - Mã voucher có phân biệt hoa/thường (Case-sensitive) và có tự động trim khoảng trắng không?

---

## 3. Tổng hợp Câu hỏi Clarification gửi BA/PO

| STT | Mã Rule | Phân loại | Câu hỏi cho BA/PO | Đề xuất giải pháp mặc định | Ưu tiên |
|:---:|:---:|:---|:---|:---|:---:|
| 1 | **MR-03** | Boundary & Edge Rules | Mã giảm giá theo phần trăm (%) có quy định mức trần giảm tối đa (Max Discount Cap) không? | Thêm cấu hình Max Cap, nếu vượt trần thì giảm đúng bằng Max Cap | **High** |
| 2 | **MR-04** | Boundary & Edge Rules | Ngưỡng `min order value` và số tiền giảm giá được tính trên Tiền hàng (Subtotal) hay Tổng hóa đơn gồm ship? | Chỉ tính trên Subtotal của sản phẩm | **High** |
| 3 | **MR-05** | State & Lifecycle Rules | Mỗi voucher có giới hạn tổng số lượt dùng toàn hệ thống và số lần dùng tối đa trên mỗi tài khoản không? | Có giới hạn tổng lượt và mặc định 1 lần/tài khoản | **High** |
| 4 | **MR-07** | Dependency & Side-Effect Rules | Một đơn hàng được áp dụng tối đa bao nhiêu voucher? Có cho phép gộp voucher không? | Tối đa 1 voucher giảm giá sản phẩm / 1 đơn hàng | **High** |
| 5 | **MR-09** | Dependency & Side-Effect Rules | Hệ thống có tự động re-validate và hủy voucher nếu tổng tiền bị giảm dưới mức tối thiểu khi sửa giỏ hàng không? | Tự động kiểm tra lại và hủy mã nếu không đủ điều kiện | **High** |
| 6 | **MR-02** | State & Lifecycle Rules | Hệ thống có hỗ trợ nút "Hủy mã" sau khi áp dụng thành công để khách hàng đổi sang mã khác không? | Hiển thị nút Hủy mã / icon [X] để xóa mã và nhập lại | **Medium** |
| 7 | **MR-06** | Dependency & Side-Effect Rules | Khi đơn hàng bị hủy hoặc hoàn tiền, mã voucher đã dùng có được hoàn trả lại cho khách hàng không? | Hoàn lại lượt nếu đơn hủy trước khi giao và mã còn hạn | **Medium** |
| 8 | **MR-08** | Exception & Error Handling | Khi số tiền giảm cố định (VNĐ) lớn hơn tổng tiền hàng, tổng tiền thanh toán mới xử lý ra sao? | Tổng tiền mới tối thiểu về 0 VNĐ (không âm) | **Medium** |
| 9 | **MR-01** | Implicit & Authorization | Voucher có được phân quyền theo nhóm khách hàng (Mới / VIP / Tất cả) không? | Hỗ trợ phân quyền theo đối tượng khách hàng | **Medium** |
| 10 | **MR-10** | Implicit & Authorization | Mã voucher có phân biệt hoa/thường, tự trim khoảng trắng, và quy tắc làm tròn tiền VNĐ ra sao? | Case-insensitive, auto-trim, làm tròn tiền VNĐ nguyên | **Low** |

---

## FIX
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|
| - | Không phát hiện | Đã đối soát đầy đủ 06W và tuân thủ format chuẩn | Không có bản sửa |

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| 1 | Bảng mục 3 (MR-01 → MR-10) | Xác nhận phương án xử lý cho 10 kẽ hở quy tắc nghiệp vụ | Chuyển BA / PO ShopGo |
