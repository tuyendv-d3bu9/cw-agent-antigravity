# BÁO CÁO PHÂN TÍCH QUY TẮC NGHIỆP VỤ BỊ THIẾU (MISSING-RULE REPORT) · function-d
Owner: qa-analyst/02-missing-rule-06w · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, knowledge/function-d.md · Verdict: PASS

---

## 1. Ma trận Truy vết 06W

| STT | Câu hỏi 06W | Trọng tâm kiểm tra | Trạng thái | Mã Missing Rule liên quan |
|:---|:---|:---|:---|:---|
| **W1** | Who/What initiates? | Tác nhân kích hoạt, phân quyền, trạng thái tài khoản & phiên đăng nhập | Đã phát hiện | MR-01, MR-02 |
| **W2** | What if Invalid/Negative? | Xử lý chuỗi nhập liệu bất thường (khoảng trắng, ký tự đặc biệt, hoa/thường) | Đã phát hiện | MR-03, MR-04 |
| **W3** | Where is Boundary/Limit? | Giới hạn ký tự mã, giá trị biên đơn hàng tối thiểu & mức trần Max Cap | Đã phát hiện | MR-05, MR-06 |
| **W4** | When & State Transition? | Mốc thời gian hết hạn (Timezone/Giờ-Phút-Giây) & thời điểm chốt hợp lệ mã | Đã phát hiện | MR-07, MR-08 |
| **W5** | Which Dependency/Side-effect? | Tương tác với phương thức thanh toán Ví ShopGo & sản phẩm đổi giá/hết hàng | Đã phát hiện | MR-09, MR-10 |
| **W6** | Why & Implicit Expectation? | Chống tấn công Brute-force thử mã liên tục (Rate Limit) & thông điệp lỗi rõ ràng | Đã phát hiện | MR-11, MR-12 |

---

## 2. Chi tiết Missing Rules

### [MR-01] Xử lý phiên đăng nhập (Session Timeout) khi đang ở màn hình Thanh toán áp mã
1. **Mã Rule ID**: MR-01
2. **Căn cứ Requirement gốc**: `BR-07` ("Khách hàng bắt buộc phải ở trạng thái đã đăng nhập tài khoản tại bước Thanh toán")
3. **Câu hỏi 06W tương ứng**: W1 (Who/What initiates?)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa có quy định xử lý khi khách hàng mở màn hình thanh toán, session hết hạn (timeout), sau đó mới bấm "Áp dụng" mã giảm giá hoặc bấm "Đặt hàng".
6. **Rủi ro & Tác động**: Lỗi hệ thống (500 Internal Server Error) hoặc bypass kiểm tra quyền sở hữu mã, dẫn đến sai lệch dữ liệu đơn hàng.
7. **Đề xuất hành vi xử lý mặc định**: Khi session hết hạn, bấm "Áp dụng" sẽ hiển thị modal yêu cầu đăng nhập lại, lưu trạng thái mã đang nhập và giỏ hàng hiện tại sau khi đăng nhập thành công.
8. **Câu hỏi xác nhận cho BA/PO**: Khi hết hạn session tại trang Thanh toán, hệ thống có mở popup đăng nhập tại chỗ để giữ nguyên dữ liệu đơn hàng và mã đang nhập hay chuyển hướng về trang Login?

### [MR-02] Trạng thái tài khoản bị khóa hoặc vô hiệu hóa trong lúc áp mã
1. **Mã Rule ID**: MR-02
2. **Căn cứ Requirement gốc**: `BR-07`, `BR-08` ("Khách hàng đăng nhập, mỗi mã 1 lần/user")
3. **Câu hỏi 06W tương ứng**: W1 (Who/What initiates?)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa có quy tắc kiểm tra trạng thái tài khoản (Active / Suspended / Banned) khi tài khoản bị Admin khóa trong lúc đang thao tác thanh toán.
6. **Rủi ro & Tác động**: Tài khoản gian lận bị khóa vẫn có thể áp mã và hoàn tất đơn hàng khuyến mãi.
7. **Đề xuất hành vi xử lý mặc định**: Kiểm tra trạng thái tài khoản Active realtime trước khi áp dụng mã và trước khi tạo đơn; nếu bị khóa, báo lỗi và chặn thanh toán.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có kiểm tra trạng thái hoạt động của tài khoản (Active) tại thời điểm bấm "Áp dụng" mã không?

### [MR-03] Xử lý khoảng trắng (Leading/Trailing Whitespace) trong ô nhập mã
1. **Mã Rule ID**: MR-03
2. **Căn cứ Requirement gốc**: `BR-06` ("Cung cấp ô nhập văn bản Mã giảm giá và nút Áp dụng")
3. **Câu hỏi 06W tương ứng**: W2 (What if Invalid/Negative?)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Khách hàng thường copy mã từ tin nhắn/email có kèm khoảng trắng ở đầu hoặc cuối chuỗi (ví dụ `" SALE50 "`). Tài liệu chưa quy định hệ thống có tự động trim khoảng trắng hay không.
6. **Rủi ro & Tác động**: Mã hợp lệ bị báo lỗi không tồn tại, gây ức chế cho người dùng và tăng tỷ lệ bỏ giỏ hàng (Drop-off rate).
7. **Đề xuất hành vi xử lý mặc định**: Hệ thống tự động cắt bỏ khoảng trắng thừa ở đầu và cuối chuỗi (Auto-trim whitespace) trước khi kiểm tra hợp lệ.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có tự động trim khoảng trắng đầu/cuối khi khách hàng copy-paste mã giảm giá vào ô nhập không?

### [MR-04] Quy tắc phân biệt chữ hoa / chữ thường (Case Sensitivity) của mã giảm giá
1. **Mã Rule ID**: MR-04
2. **Căn cứ Requirement gốc**: `BR-01`, `BR-06` ("Có 2 loại mã, ô nhập Mã giảm giá")
3. **Câu hỏi 06W tương ứng**: W2 (What if Invalid/Negative?)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa xác định mã giảm giá có phân biệt chữ hoa, chữ thường hay không (ví dụ: `SHOPGO10` vs `shopgo10` vs `ShopGo10`).
6. **Rủi ro & Tác động**: Khách hàng nhập đúng chữ nhưng sai kiểu hoa/thường bị từ chối áp dụng, trải nghiệm kém.
7. **Đề xuất hành vi xử lý mặc định**: Không phân biệt chữ hoa/chữ thường (Case-insensitive) hoặc tự động chuyển toàn bộ ký tự nhập vào thành chữ in hoa (Auto-uppercase).
8. **Câu hỏi xác nhận cho BA/PO**: Mã giảm giá trên hệ thống có phân biệt chữ hoa/chữ thường (Case-sensitive) hay không?

### [MR-05] Ràng buộc độ dài ký tự và ký tự đặc biệt của ô nhập mã
1. **Mã Rule ID**: MR-05
2. **Căn cứ Requirement gốc**: `BR-05`, `BR-06` ("Mã không hợp lệ hiển thị thông báo lỗi")
3. **Câu hỏi 06W tương ứng**: W3 (Where is Boundary/Limit?)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa có quy định giới hạn ký tự tối đa (Max length) cho ô nhập mã và xử lý khi người dùng nhập chuỗi cực dài (1000+ ký tự) hoặc ký tự đặc biệt XSS/SQLi.
6. **Rủi ro & Tác động**: Tràn bộ nhớ đệm giao diện, lỗi hiển thị hoặc nguy cơ lỗ hổng bảo mật nếu không validate input.
7. **Đề xuất hành vi xử lý mặc định**: Giới hạn độ dài ô nhập tối đa 30 ký tự, chỉ cho phép chữ cái và chữ số `[a-zA-Z0-9]`, chặn script/ký tự đặc biệt.
8. **Câu hỏi xác nhận cho BA/PO**: Độ dài tối đa cho phép của chuỗi mã giảm giá là bao nhiêu ký tự (ví dụ: tối đa 30 ký tự)?

### [MR-06] Quy tắc làm tròn số tiền chiết khấu (Rounding Rule) cho mã %
1. **Mã Rule ID**: MR-06
2. **Căn cứ Requirement gốc**: `BR-01`, `BR-04` ("Giảm theo %, hiển thị số tiền được giảm")
3. **Câu hỏi 06W tương ứng**: W3 (Where is Boundary/Limit?)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Khi áp dụng mã giảm giá % cho đơn hàng lẻ (ví dụ: giảm 15% cho đơn 123.456 VNĐ = 18.518,4 VNĐ), chưa có quy tắc làm tròn số tiền lẻ.
6. **Rủi ro & Tác động**: Lệch số liệu thanh toán, không khớp với cổng thanh toán thẻ hoặc tiền mặt lẻ không thể thối khi giao hàng COD.
7. **Đề xuất hành vi xử lý mặc định**: Làm tròn số tiền giảm đến hàng đơn vị VNĐ theo quy tắc toán học tiêu chuẩn (hoặc làm tròn xuống hàng nghìn/hàng đồng tùy quy ước tài chính).
8. **Câu hỏi xác nhận cho BA/PO**: Tiền giảm giá theo % khi ra số lẻ sẽ được làm tròn theo quy tắc nào (làm tròn số học đến 1 VNĐ hay làm tròn xuống)?

### [MR-07] Mốc thời gian hết hạn chính xác và Timezone hiệu lực của mã
1. **Mã Rule ID**: MR-07
2. **Căn cứ Requirement gốc**: `BR-03` ("Mỗi mã có ngày hết hạn")
3. **Câu hỏi 06W tương ứng**: W4 (When & State Transition?)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Ngày hết hạn được hiểu là hết hạn vào 00:00:00 đầu ngày hay 23:59:59 cuối ngày? Timezone tính theo GMT+7 (Việt Nam) hay timezone máy chủ?
6. **Rủi ro & Tác động**: Mã bị hết hạn sớm hơn kỳ vọng của khách hàng trong ngày cuối cùng của sự kiện khuyến mãi.
7. **Đề xuất hành vi xử lý mặc định**: Mã có hạn đến ngày D sẽ hết hạn vào đúng `23:59:59` của ngày D theo múi giờ Việt Nam (`GMT+7`).
8. **Câu hỏi xác nhận cho BA/PO**: Mã hết hạn vào ngày D nghĩa là hết hạn vào 23:59:59 cuối ngày D theo giờ Việt Nam (GMT+7) đúng không?

### [MR-08] Xử lý mã hết hạn trong khoảng thời gian giữa lúc Áp mã và Đặt hàng
1. **Mã Rule ID**: MR-08
2. **Căn cứ Requirement gốc**: `BR-03`, `BR-04` ("Áp dụng thành công, mã hết hạn báo lỗi")
3. **Câu hỏi 06W tương ứng**: W4 (When & State Transition?)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Khách hàng áp mã thành công lúc 23:58, nhưng dừng ở màn hình thanh toán đến 00:02 (qua ngày hôm sau - mã đã hết hạn) mới bấm "Đặt hàng".
6. **Rủi ro & Tác động**: Hệ thống cho phép đặt đơn với mã đã hết hạn nếu chỉ kiểm tra 1 lần lúc bấm "Áp dụng", hoặc hủy đơn gây ức chế nếu không thông báo trước.
7. **Đề xuất hành vi xử lý mặc định**: Hệ thống bắt buộc phải re-validate (kiểm tra lại) tính hợp lệ của mã tại thời điểm bấm "Đặt hàng"; nếu mã hết hạn, hiển thị popup thông báo và tính lại tiền.
8. **Câu hỏi xác nhận cho BA/PO**: Tại thời điểm bấm "Đặt hàng", hệ thống có kiểm tra lại tính hợp lệ của mã giảm giá lần cuối không?

### [MR-09] Xử lý kết hợp thanh toán bằng Ví ShopGo và Mã giảm giá
1. **Mã Rule ID**: MR-09
2. **Căn cứ Requirement gốc**: `INPUT/OVERVIEW.md` §1 ("Thanh toán linh hoạt: COD / thẻ / Ví ShopGo")
3. **Câu hỏi 06W tương ứng**: W5 (Which Dependency/Side-effect?)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Thứ tự trừ tiền khi khách hàng vừa áp mã giảm giá vừa chọn thanh toán bằng số dư Ví ShopGo.
6. **Rủi ro & Tác động**: Sai lệch số dư ví bị trừ nếu hệ thống trừ ví trước khi trừ voucher.
7. **Đề xuất hành vi xử lý mặc định**: Trừ tiền theo voucher trước trên tổng đơn hàng → Ra tổng tiền mới cần thanh toán → Trừ số dư Ví ShopGo tương ứng.
8. **Câu hỏi xác nhận cho BA/PO**: Thứ tự thanh toán có phải là: [Tổng tiền hàng] - [Mã giảm giá] = [Số tiền cần thanh toán], sau đó mới dùng Ví ShopGo / thẻ để thanh toán phần còn lại không?

### [MR-10] Sản phẩm trong giỏ bị thay đổi giá hoặc hết hàng sau khi đã áp mã
1. **Mã Rule ID**: MR-10
2. **Căn cứ Requirement gốc**: `BR-02`, `BR-13` ("Đơn tối thiểu, tính lại khi giỏ hàng đổi")
3. **Câu hỏi 06W tương ứng**: W5 (Which Dependency/Side-effect?)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Khi sản phẩm trong giỏ bị admin đổi giá hoặc hết hàng trong kho trong lúc khách đang ở trang Thanh toán đã áp mã.
6. **Rủi ro & Tác động**: Đơn hàng không hợp lệ về tồn kho hoặc giá trị đơn hàng thực tế không còn đủ min order.
7. **Đề xuất hành vi xử lý mặc định**: Khi hệ thống reload lại giỏ hàng, tự động kích hoạt lại quy tắc `BR-13` để kiểm tra min order và cảnh báo cho user.
8. **Câu hỏi xác nhận cho BA/PO**: Khi có biến động tồn kho/giá từ phía server, hệ thống có tự động cập nhật giỏ hàng và re-check voucher không?

### [MR-11] Cơ chế phòng chống Brute-Force thử mã giảm giá liên tục (Rate Limiting)
1. **Mã Rule ID**: MR-11
2. **Căn cứ Requirement gốc**: `BR-05` ("Mã không hợp lệ hiển thị thông báo lỗi")
3. **Câu hỏi 06W tương ứng**: W6 (Why & Implicit Expectation?)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Tài liệu chưa có cơ chế giới hạn số lần nhập sai liên tiếp nhằm chống bot/user đoán mò mã khuyến mãi nội bộ.
6. **Rủi ro & Tác động**: Hacker/bot quét thử hàng triệu mã giảm giá nội bộ (leak mã), gây quá tải server và thất thoát khuyến mãi.
7. **Đề xuất hành vi xử lý mặc định**: Tạm khóa tính năng nhập mã trong 5 phút hoặc yêu cầu mã captcha nếu người dùng nhập sai liên tiếp 5 lần.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có áp dụng cơ chế Rate Limit (ví dụ: khóa nhập 5 phút nếu sai 5 lần liên tiếp) để chống đoán mã không?

### [MR-12] Quy định thông điệp lỗi chi tiết phân biệt từng nguyên nhân thất bại
1. **Mã Rule ID**: MR-12
2. **Căn cứ Requirement gốc**: `BR-05` ("Hiển thị thông báo lỗi tương ứng")
3. **Câu hỏi 06W tương ứng**: W6 (Why & Implicit Expectation?)
4. **Phân loại**: Exception & Error Handling Rules
5. **Mô tả kẽ hở / quy tắc bị thiếu**: Chưa có bảng quy chuẩn thông điệp lỗi cụ thể cho từng trường hợp thất bại.
6. **Rủi ro & Tác động**: Thông báo chung chung ("Lỗi áp dụng mã") làm khách hàng không hiểu lý do (do hết hạn, do thiếu tiền hay do đã dùng).
7. **Đề xuất hành vi xử lý mặc định**: Cung cấp các thông điệp rõ ràng:
   - *"Mã giảm giá không tồn tại hoặc sai ký tự"*
   - *"Mã giảm giá đã hết hạn sử dụng"*
   - *"Đơn hàng chưa đạt giá trị tối thiểu X VNĐ để áp dụng mã này"*
   - *"Bạn đã sử dụng mã giảm giá này rồi"*
8. **Câu hỏi xác nhận cho BA/PO**: Có thống nhất danh sách thông điệp lỗi chi tiết cho từng trường hợp như đề xuất trên không?

---

## 3. Tổng hợp Câu hỏi Clarification gửi BA/PO

| STT | Mã Rule | Phân loại | Câu hỏi cho BA/PO | Ưu tiên |
|:---|:---|:---|:---|:---|
| 1 | MR-03 | Boundary & Edge Rules | Hệ thống có tự động cắt bỏ khoảng trắng (trim) đầu/cuối khi user nhập mã không? | **High** |
| 2 | MR-04 | Implicit & Authorization Rules | Mã giảm giá có phân biệt chữ hoa/chữ thường (Case-sensitive) hay không? | **High** |
| 3 | MR-06 | Boundary & Edge Rules | Tiền giảm giá theo % khi ra số lẻ được làm tròn theo quy tắc nào (làm tròn số học 1 VNĐ)? | **High** |
| 4 | MR-07 | State & Lifecycle Rules | Ngày hết hạn của mã tính chính xác đến 23:59:59 của ngày đó theo giờ VN (GMT+7) đúng không? | **High** |
| 5 | MR-08 | State & Lifecycle Rules | Tại thời điểm bấm "Đặt hàng", hệ thống có re-validate tính hợp lệ của mã lần cuối không? | **High** |
| 6 | MR-05 | Boundary & Edge Rules | Giới hạn độ dài tối đa cho phép của ô nhập mã là bao nhiêu ký tự (ví dụ: 30 ký tự)? | Medium |
| 7 | MR-09 | Dependency & Side-Effect Rules | Có thống nhất thứ tự: Trừ Voucher trước, sau đó mới tính tiền trừ Ví ShopGo / cổng thanh toán không? | Medium |
| 8 | MR-11 | Implicit & Authorization Rules | Hệ thống có áp dụng Rate Limit (khóa tạm 5 phút nếu nhập sai 5 lần) để chống brute-force không? | Medium |
| 9 | MR-12 | Exception & Error Handling Rules | Có thống nhất danh sách các câu thông báo lỗi chi tiết cho từng trường hợp thất bại không? | Medium |
| 10 | MR-01 | Implicit & Authorization Rules | Hết hạn session khi đang ở trang Thanh toán thì mở modal login tại chỗ hay redirect? | Low |
| 11 | MR-02 | Implicit & Authorization Rules | Tài khoản bị khóa trong lúc thanh toán có bị chặn realtime khi bấm áp mã / đặt hàng không? | Low |
| 12 | MR-10 | Dependency & Side-Effect Rules | Biến động tồn kho/giá từ server có tự động kích hoạt tính lại giỏ hàng và re-check voucher không? | Low |

---

## FIX
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|
| 1 | Đặc tả ô nhập liệu | Chưa quy định trim khoảng trắng và case-sensitivity | Áp dụng hành vi mặc định: Auto-trim và Case-insensitive |

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| 1 | Bảng mục 3 (MR-03 → MR-08) | Xác nhận các quy tắc biên, làm tròn tiền và thời điểm re-validate (Ưu tiên High) | BA / Tech Lead |
