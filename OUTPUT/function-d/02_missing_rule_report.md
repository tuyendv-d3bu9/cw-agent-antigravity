# BÁO CÁO PHÂN TÍCH QUY TẮC NGHIỆP VỤ BỊ THIẾU (MISSING-RULE REPORT) · function-d
Owner: agents/qa-analyst/02-missing-rule-06w · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, knowledge/function-d.md (§3, §7, §8) · Verdict: ASK

> **Phạm vi**: 12 missing rule còn trạng thái `New`. Đã **loại trừ** `GAP-01` → `GAP-06` vì đã có
> phản hồi chính thức của BA/PO (2026-08-23) và đã chuyển thành `BR-08` → `BR-14` tại
> `knowledge/function-d.md` §3 — theo luật "không hỏi lại điều đã có câu trả lời".

---

## 1. Ma trận Truy vết 06W

> Tên W1–W6 lấy đúng `shared/QA_STANDARD.md` §4 — không đổi tên.

| STT | Câu hỏi 06W | Trọng tâm đã quét | Trạng thái | Mã Missing Rule liên quan |
|:---|:---|:---|:---|:---|
| W1 | What if input lạ | Ô nhập "Mã giảm giá": khoảng trắng thừa, hoa-thường, độ dài tối đa, ký tự đặc biệt | Đã phát hiện | MR-03, MR-04, MR-05 |
| W2 | What if state lạ | Session/tài khoản đổi trạng thái giữa lúc đang ở trang Thanh toán | Đã phát hiện | MR-01, MR-02 |
| W3 | What if data lạ | Quy tắc làm tròn số tiền chiết khấu lẻ của mã % (kết hợp Max Cap `BR-11`) | Đã phát hiện | MR-06 |
| W4 | What when timing | Mốc hết hạn chính xác + timezone; re-validate tại thời điểm chốt đơn | Đã phát hiện | MR-07, MR-08 |
| W5 | Who else actor | Ví ShopGo trừ tiền đồng thời; server đổi giá/tồn kho khi khách đang thanh toán | Đã phát hiện | MR-09, MR-10 |
| W6 | What happens after | Rate limit chống dò mã; danh sách thông điệp lỗi phân biệt từng ca | Đã phát hiện | MR-11, MR-12 |

**Nhận xét độ phủ**: cả 6 câu hỏi đều ra kẽ hở → không có mục nào ghi
"Không phát hiện vấn đề qua câu hỏi #W[X]". Mật độ cao nhất ở W1 (3 gap) do tài liệu gốc chỉ mô
tả hành vi "nhập mã rồi bấm Áp dụng" mà không đặc tả bất kỳ ràng buộc nào cho ô input.

---

## 2. Chi tiết Missing Rules

### [MR-01] Hết hạn session khi đang ở trang Thanh toán áp mã
1. **Mã Rule ID**: MR-01
2. **Căn cứ Requirement gốc**: `BR-06` (ô nhập + nút Áp dụng tại trang Thanh toán) và `BR-07` (bắt buộc đăng nhập khi thanh toán). Hành vi khi session hết hạn **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W2 (What if state lạ)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở**: `BR-07` yêu cầu đăng nhập để thanh toán, nhưng không quy định điều gì xảy ra nếu session hết hạn **sau khi** khách đã vào trang Thanh toán và bấm "Áp dụng". Không rõ hệ thống mở modal đăng nhập tại chỗ (giữ nguyên giỏ hàng + mã đang nhập) hay redirect ra trang Login (rủi ro mất dữ liệu đang nhập).
6. **Rủi ro & Tác động**: Khách mất toàn bộ tiến trình thanh toán → rời giỏ. Nếu redirect mà không xoá state phía client, có nguy cơ áp mã cho session của user khác. Rủi ro **HIGH**.
7. **Đề xuất hành vi xử lý mặc định**: Chặn tại server, trả lỗi 401, mở modal đăng nhập tại chỗ, giữ nguyên giỏ hàng và mã đang nhập; sau khi đăng nhập lại thì **re-validate** mã trước khi áp.
8. **Câu hỏi xác nhận cho BA/PO**: Khi session hết hạn lúc khách bấm "Áp dụng" tại trang Thanh toán, hệ thống mở **modal đăng nhập tại chỗ giữ nguyên giỏ hàng** (đề xuất) hay **redirect ra trang Login**? Nếu redirect, mã đang nhập có được giữ lại sau khi đăng nhập không?

---

### [MR-02] Tài khoản bị khóa trong lúc đang thao tác thanh toán
1. **Mã Rule ID**: MR-02
2. **Căn cứ Requirement gốc**: `BR-08` (mỗi khách 1 lần/mã — gắn với danh tính tài khoản). Việc kiểm tra trạng thái Active realtime **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W2 (What if state lạ)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở**: Không có rule nào yêu cầu kiểm tra lại trạng thái tài khoản (Active / Locked / Banned) tại thời điểm áp mã. Nếu Admin khóa tài khoản trong lúc khách đang ở trang Thanh toán, chưa rõ mã còn áp được hay không.
6. **Rủi ro & Tác động**: Tài khoản gian lận đã bị khóa vẫn tiêu thụ được voucher; lượt dùng bị trừ khỏi ngân sách campaign mà không thu hồi được. Rủi ro **HIGH**.
7. **Đề xuất hành vi xử lý mặc định**: Kiểm tra trạng thái tài khoản realtime ở server trong bước validate mã; tài khoản không Active → từ chối áp mã, báo lỗi chung không tiết lộ lý do khóa.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có **kiểm tra trạng thái Active của tài khoản realtime** tại thời điểm áp mã không? Nếu tài khoản bị khóa giữa phiên thanh toán thì chặn ngay tại bước áp mã, hay chỉ chặn ở bước Đặt hàng?

---

### [MR-03] Xử lý khoảng trắng thừa (trim whitespace) trong ô nhập mã
1. **Mã Rule ID**: MR-03
2. **Căn cứ Requirement gốc**: `BR-06` (ô nhập "Mã giảm giá") và `BR-05` (mã không hợp lệ → báo lỗi). Quy tắc chuẩn hoá input **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W1 (What if input lạ)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở**: Khách copy-paste mã từ email/SMS thường kèm khoảng trắng đầu/cuối. Không rõ hệ thống trim trước khi so khớp, hay so khớp nguyên văn rồi báo "mã không hợp lệ".
6. **Rủi ro & Tác động**: Khách nhập **đúng mã** nhưng bị từ chối → khiếu nại CSKH, giảm tỷ lệ chuyển đổi của campaign. Đây là lỗi rất dễ lọt vì trông giống hành vi đúng. Rủi ro **MED**.
7. **Đề xuất hành vi xử lý mặc định**: Trim khoảng trắng đầu/cuối trước khi so khớp; khoảng trắng **ở giữa** chuỗi thì coi là sai định dạng và báo lỗi.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có **tự động trim khoảng trắng đầu/cuối** trước khi so khớp mã không (đề xuất: có)? Khoảng trắng ở giữa chuỗi thì xử lý là sai định dạng, đúng chứ?

---

### [MR-04] Phân biệt chữ hoa / chữ thường (Case Sensitivity)
1. **Mã Rule ID**: MR-04
2. **Căn cứ Requirement gốc**: `BR-06`, `BR-05`. **Chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W1 (What if input lạ)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở**: Không rõ mã có phân biệt hoa/thường. Mobile web thường tự viết hoa chữ đầu, làm lệch chuỗi khách gõ so với mã gốc.
6. **Rủi ro & Tác động**: Từ chối sai mã hợp lệ, đặc biệt trên mobile web (nền tảng hỗ trợ là responsive web). Rủi ro **LOW** về tiền, nhưng ảnh hưởng trực tiếp trải nghiệm.
7. **Đề xuất hành vi xử lý mặc định**: So khớp **không phân biệt hoa/thường** (normalize về uppercase trước khi so).
8. **Câu hỏi xác nhận cho BA/PO**: Mã giảm giá **không phân biệt hoa/thường**, đúng chứ (đề xuất: không phân biệt)? Nếu có phân biệt, cần thông điệp lỗi riêng để khách biết nguyên nhân.

---

### [MR-05] Giới hạn độ dài tối đa & ký tự đặc biệt của ô nhập mã
1. **Mã Rule ID**: MR-05
2. **Căn cứ Requirement gốc**: `BR-06`. **Chưa đề cập trong tài liệu** — không có bất kỳ đặc tả format/độ dài nào cho mã.
3. **Câu hỏi 06W tương ứng**: W1 (What if input lạ)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở**: Không có `maxlength`, không có whitelist ký tự, không có format mã chuẩn. Ô input nhận chuỗi tuỳ ý → không thể thiết kế test biên độ dài, và mở đường cho payload injection.
6. **Rủi ro & Tác động**: Chuỗi cực dài gây lỗi truy vấn/timeout; ký tự đặc biệt (dấu nháy đơn, thẻ script, ký tự `%`) là bề mặt tấn công SQLi/XSS ngay tại luồng thanh toán. Rủi ro **HIGH** (bảo mật).
7. **Đề xuất hành vi xử lý mặc định**: Chốt format mã (vd chỉ nhận `A-Z`, `0-9` và dấu gạch nối), đặt `maxlength` cụ thể ở cả client và server, reject ký tự ngoài whitelist bằng thông điệp "mã không hợp lệ" — không echo lại input của khách.
8. **Câu hỏi xác nhận cho BA/PO**: **Format và độ dài tối đa** của mã giảm giá là gì (vd `SALE-XXXX`, tối đa 20 ký tự)? Đây là hằng số bắt buộc để thiết kế test biên và test bảo mật — thiếu nó thì mọi test độ dài đều là giả định.

---

### [MR-06] Quy tắc làm tròn số tiền chiết khấu lẻ cho mã %
1. **Mã Rule ID**: MR-06
2. **Căn cứ Requirement gốc**: `BR-01` (mã theo %), `BR-11` (Max Discount Cap), `BR-04` (hiển thị số tiền được giảm và tổng tiền mới). Quy tắc làm tròn **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W3 (What if data lạ)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở**: Đơn vị tiền là VND (không có đơn vị nhỏ hơn đồng), nhưng mã % chắc chắn sinh ra số lẻ (vd 7% của 199.999đ = 13.999,93đ). Không rõ làm tròn lên, xuống, hay half-up, và làm tròn đến hàng đồng hay hàng trăm đồng. Chồng thêm `BR-11` (Max Cap) thì thứ tự "tính % → làm tròn → chặn cap" hay "tính % → chặn cap → làm tròn" cho ra kết quả khác nhau.
6. **Rủi ro & Tác động**: Lệch tiền giữa hiển thị và thực thu; đối soát kế toán sai; khách khiếu nại tổng tiền. Rủi ro **MED** nhưng phát sinh trên **mọi** đơn dùng mã %.
7. **Đề xuất hành vi xử lý mặc định**: Làm tròn **xuống** đến hàng đồng (không bao giờ giảm quá cap), thứ tự: tính % → chặn Max Cap → làm tròn xuống.
8. **Câu hỏi xác nhận cho BA/PO**: Số tiền giảm lẻ của mã % làm tròn theo quy tắc nào (đề xuất: **làm tròn xuống đến hàng đồng**)? Và thứ tự áp dụng là **tính % → chặn Max Cap → làm tròn**, đúng chứ?

---

### [MR-07] Mốc thời gian hết hạn chính xác và Timezone hiệu lực
1. **Mã Rule ID**: MR-07
2. **Căn cứ Requirement gốc**: `BR-03` (mỗi mã có ngày hết hạn), `BR-05` (hết hạn → báo lỗi). Mốc giờ và timezone **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W4 (What when timing)
4. **Phân loại**: Boundary & Edge Rules
5. **Mô tả kẽ hở**: `BR-03` chỉ nói "ngày hết hạn". Không rõ mã hết hạn ngày `D` còn dùng được đến `D 23:59:59` hay đã chết từ `D 00:00:00`. Không khai báo timezone — server có thể chạy UTC trong khi khách ở GMT+7, lệch 7 tiếng.
6. **Rủi ro & Tác động**: Mã chết sớm 1 ngày so với kỳ vọng khách → khiếu nại hàng loạt vào ngày cuối campaign. Đây chính là biên `max`/`max+1` của trục thời gian, không thiết kế test được nếu thiếu rule. Rủi ro **HIGH**.
7. **Đề xuất hành vi xử lý mặc định**: Mã hiệu lực đến hết `D 23:59:59` theo **GMT+7**; server lưu UTC nhưng so sánh theo GMT+7; hiển thị hạn cho khách theo giờ Việt Nam.
8. **Câu hỏi xác nhận cho BA/PO**: Mã có hạn đến ngày `D` được hiểu là còn dùng được đến **`D 23:59:59` GMT+7**, đúng chứ (đề xuất)? Server so sánh thời gian theo timezone nào?

---

### [MR-08] Re-validate mã tại thời điểm bấm "Đặt hàng"
1. **Mã Rule ID**: MR-08
2. **Căn cứ Requirement gốc**: `BR-04` (áp thành công → cập nhật tổng tiền), `BR-13` (giỏ hàng đổi → cảnh báo + hủy voucher). Việc kiểm tra lại tại bước chốt đơn **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W4 (What when timing)
4. **Phân loại**: State & Lifecycle Rules
5. **Mô tả kẽ hở**: `BR-13` xử lý trường hợp **khách** đổi giỏ hàng, nhưng không xử lý trường hợp **mã** thay đổi trạng thái trong lúc khách còn ở trang Thanh toán: hết hạn theo `BR-03`, bị Admin vô hiệu hoá, hoặc hết ngân sách campaign. Không rõ có re-validate tại thời điểm bấm "Đặt hàng".
6. **Rủi ro & Tác động**: Đơn được tạo với mức giảm không còn hợp lệ → thất thoát doanh thu, phải xử lý bù trừ thủ công. Ngược lại nếu chặn mà không thông báo rõ, khách bị chặn đặt hàng ở bước cuối. Rủi ro **HIGH**.
7. **Đề xuất hành vi xử lý mặc định**: **Bắt buộc re-validate** toàn bộ điều kiện mã tại thời điểm submit đơn; không còn hợp lệ → chặn tạo đơn, hủy mã, hiện cảnh báo nêu rõ lý do và tổng tiền mới, để khách xác nhận lại.
8. **Câu hỏi xác nhận cho BA/PO**: Hệ thống có **re-validate mã lần cuối khi khách bấm "Đặt hàng"** không (đề xuất: có)? Nếu mã đã hết hiệu lực tại thời điểm đó thì **chặn tạo đơn và yêu cầu xác nhận lại**, hay vẫn cho tạo đơn theo giá đã chốt trước đó?

---

### [MR-09] Thứ tự trừ tiền khi kết hợp Ví ShopGo và Voucher
1. **Mã Rule ID**: MR-09
2. **Căn cứ Requirement gốc**: `BR-12` (mã chỉ giảm trên giá trị đơn hàng, không giảm phí ship), `BR-10` (sàn 0đ). Thứ tự kết hợp với ví **chưa đề cập trong tài liệu**; ví ShopGo nằm ở `OUT OF SCOPE` (Function E/F) nhưng **giao thoa trực tiếp** tại bước thanh toán.
3. **Câu hỏi 06W tương ứng**: W5 (Who else actor)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở**: Nếu đơn dùng cả voucher và số dư ví, thứ tự "trừ voucher trước rồi trừ ví" so với "trừ ví trước rồi trừ voucher" cho ra số dư ví còn lại khác nhau, và ảnh hưởng cả `BR-10` (sàn 0đ) lẫn `BR-12` (phí ship có được ví chi trả không).
6. **Rủi ro & Tác động**: Sai lệch số dư ví — lỗi liên quan tiền thật, khó hoàn nguyên, dễ thành khiếu nại tài chính. Rủi ro **HIGH**.
7. **Đề xuất hành vi xử lý mặc định**: Trừ voucher trước (trên tiền hàng, theo `BR-12`), ra số phải trả cuối; sau đó ví chi trả phần còn lại **bao gồm** phí ship.
8. **Câu hỏi xác nhận cho BA/PO**: Thứ tự là **trừ voucher trước, ví thanh toán phần còn lại** (đề xuất), đúng chứ? Số dư ví có được dùng để trả **phí vận chuyển** không? *(Ghi chú: ví thuộc Function E/F — cần chốt ranh giới trước khi thiết kế test cho Function D.)*

---

### [MR-10] Biến động tồn kho / giá server khi khách đang ở màn hình thanh toán
1. **Mã Rule ID**: MR-10
2. **Căn cứ Requirement gốc**: `BR-02` (điều kiện giá trị đơn tối thiểu), `BR-13` (giỏ hàng đổi → hủy voucher). Trường hợp **server** đổi giá/tồn kho **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W5 (Who else actor)
4. **Phân loại**: Dependency & Side-Effect Rules
5. **Mô tả kẽ hở**: `BR-13` chỉ nói tới thay đổi **do khách** thao tác. Nếu giá sản phẩm giảm hoặc hàng hết do actor khác (Admin, hệ thống kho, khách khác mua trước) khiến đơn tụt xuống dưới mức tối thiểu của `BR-02`, chưa rõ hệ thống có tự tính lại và re-check voucher.
6. **Rủi ro & Tác động**: Đơn hàng không hợp lệ vẫn được hưởng giảm giá, hoặc voucher bị hủy im lặng khiến tổng tiền nhảy mà khách không hiểu vì sao. Rủi ro **HIGH**.
7. **Đề xuất hành vi xử lý mặc định**: Mỗi lần server thay đổi giá/tồn kho của đơn đang mở → tính lại tổng, re-check điều kiện `BR-02`, và áp cùng cơ chế cảnh báo + tự hủy voucher như `BR-13`.
8. **Câu hỏi xác nhận cho BA/PO**: Khi **server** đổi giá hoặc hết tồn kho làm đơn tụt dưới mức tối thiểu, hệ thống áp dụng **cùng cơ chế cảnh báo và tự hủy voucher như `BR-13`**, đúng chứ (đề xuất)?

---

### [MR-11] Cơ chế Rate Limit chống brute-force đoán mã giảm giá
1. **Mã Rule ID**: MR-11
2. **Căn cứ Requirement gốc**: `BR-05` (mã không hợp lệ → báo lỗi). Giới hạn số lần thử **chưa đề cập trong tài liệu**.
3. **Câu hỏi 06W tương ứng**: W6 (What happens after)
4. **Phân loại**: Implicit & Authorization Rules
5. **Mô tả kẽ hở**: `BR-05` cho phép thử mã không giới hạn và mỗi lần đều trả về phản hồi cho biết mã tồn tại hay không. Không có rule nào giới hạn số lần thử sai liên tiếp → cho phép script dò quét toàn bộ không gian mã.
6. **Rủi ro & Tác động**: Lộ mã nội bộ/mã dành riêng cho nhóm khách; ngân sách campaign bị tiêu thụ sai đối tượng. Kèm rủi ro chi phí hạ tầng do lưu lượng dò quét. Rủi ro **HIGH** (bảo mật).
7. **Đề xuất hành vi xử lý mặc định**: Rate limit theo tài khoản **và** theo IP (vd 5 lần sai liên tiếp → khoá thử mã 15 phút); thông điệp lỗi **không** phân biệt "mã không tồn tại" với "mã không đủ điều kiện" để tránh rò rỉ thông tin qua phản hồi.
8. **Câu hỏi xác nhận cho BA/PO**: Có áp dụng **Rate Limit** cho ô nhập mã không (đề xuất: 5 lần sai → khoá tạm 15 phút, tính theo cả tài khoản và IP)? Ngưỡng cụ thể là bao nhiêu?

---

### [MR-12] Thống nhất danh sách thông điệp lỗi phân biệt từng ca
1. **Mã Rule ID**: MR-12
2. **Căn cứ Requirement gốc**: `BR-05` ("hiển thị thông báo lỗi") — nêu chung, **không liệt kê nội dung thông điệp cho từng ca**.
3. **Câu hỏi 06W tương ứng**: W6 (What happens after)
4. **Phân loại**: Exception & Error Handling Rules
5. **Mô tả kẽ hở**: Có ít nhất 7 ca lỗi khác nhau đã xác định được từ `AF-01`, `AF-02`, `AF-03`, `AF-06`, `BR-08`, `MR-05`, `MR-11` (mã không tồn tại · sai định dạng · hết hạn · chưa đủ đơn tối thiểu · đã dùng rồi · vượt độ dài · bị rate limit) nhưng `BR-05` chỉ nói "hiển thị thông báo lỗi". Không có danh sách thông điệp chuẩn → **không viết được Expected Result đo lường được** cho các ca negative.
6. **Rủi ro & Tác động**: Chặn trực tiếp bước `05-test-case-generation`: mọi test case negative sẽ có Expected Result mơ hồ — đúng loại lỗi mà skill 05 phải loại bỏ ở Pre-output Quality Audit. Rủi ro **MED** với sản phẩm, nhưng **chặn** với quy trình test.
7. **Đề xuất hành vi xử lý mặc định**: Lập bảng `mã lỗi → thông điệp tiếng Việt` cho đủ 7 ca; gộp "không tồn tại" và "sai định dạng" thành một thông điệp chung để không rò rỉ thông tin (đồng bộ với `MR-11`).
8. **Câu hỏi xác nhận cho BA/PO**: Cần **danh sách thông điệp lỗi chính thức** cho 7 ca đã nêu. Đây là điều kiện tiên quyết để viết Expected Result đo lường được — thiếu nó thì test case negative của bước 05 buộc phải gắn `[GIẢ ĐỊNH]`.

---

## 3. Tổng hợp Câu hỏi Clarification gửi BA/PO (Actionable Items)

| STT | Mã Rule | Phân loại | Câu hỏi Clarification cho BA/PO | Ưu tiên |
|:---|:---|:---|:---|:---|
| 1 | MR-05 | Boundary & Edge | Format và độ dài tối đa của mã là gì? (vd `SALE-XXXX`, ≤20 ký tự) | **High** |
| 2 | MR-07 | Boundary & Edge | Hạn đến ngày `D` = còn dùng đến `D 23:59:59` GMT+7, đúng chứ? | **High** |
| 3 | MR-08 | State & Lifecycle | Có re-validate mã khi bấm "Đặt hàng"? Không hợp lệ thì chặn tạo đơn? | **High** |
| 4 | MR-11 | Implicit & Authorization | Có Rate Limit ô nhập mã? Ngưỡng bao nhiêu lần sai? | **High** |
| 5 | MR-09 | Dependency & Side-Effect | Thứ tự trừ voucher ↔ ví ShopGo? Ví có trả phí ship? | **High** |
| 6 | MR-10 | Dependency & Side-Effect | Server đổi giá/tồn kho → áp cùng cơ chế `BR-13`, đúng chứ? | **High** |
| 7 | MR-01 | State & Lifecycle | Hết session lúc áp mã → modal tại chỗ hay redirect Login? | **High** |
| 8 | MR-02 | Implicit & Authorization | Có kiểm tra trạng thái Active của tài khoản realtime khi áp mã? | **High** |
| 9 | MR-06 | Boundary & Edge | Làm tròn tiền giảm mã % theo quy tắc nào? Thứ tự với Max Cap? | Medium |
| 10 | MR-12 | Exception & Error Handling | Danh sách thông điệp lỗi chính thức cho 7 ca lỗi đã xác định? | Medium |
| 11 | MR-03 | Boundary & Edge | Có tự trim khoảng trắng đầu/cuối trước khi so khớp mã? | Medium |
| 12 | MR-04 | Boundary & Edge | Mã có phân biệt chữ hoa/chữ thường? | Low |

---

## ASK — chốt chặn trước khi qua bước 03

| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| 1 | MR-05, MR-07 | Hằng số nghiệp vụ (format/độ dài mã, mốc giờ + timezone hết hạn) — thiếu thì **không thiết kế được test biên** theo `shared/QA_STANDARD.md` §6 | BA / PO |
| 2 | MR-12 | Danh sách thông điệp lỗi — thiếu thì **Expected Result các ca negative không đo lường được** ở bước 05 | BA / PO |
| 3 | MR-09 | Chốt ranh giới Function D ↔ ví ShopGo (Function E/F) | BA / PO + QA Lead |
| 4 | MR-01, MR-02, MR-08, MR-10, MR-11 | Quyết định hành vi hệ thống cho 5 kẽ hở rủi ro HIGH | BA / PO |

**Ghi chú cho bước 03**: `03-viewpoint-selection` **chạy được ngay** vì viewpoint dựa trên
Risk Area, không cần câu trả lời chi tiết. Nhưng bước `05` thì **bị chặn thật** bởi MR-05, MR-07
và MR-12 — không có 3 nhóm dữ liệu này thì test case buộc phải gắn `[GIẢ ĐỊNH]` diện rộng.
