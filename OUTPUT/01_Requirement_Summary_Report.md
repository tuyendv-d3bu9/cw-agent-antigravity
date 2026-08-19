# REQUIREMENT & RISK ANALYSIS REPORT

**Dạng tài liệu nhận diện**: Prose Document (Tài liệu mô tả nghiệp vụ kết hợp Bối cảnh hệ thống ShopGo và Chi tiết tính năng Function D)

---

## 1. FEATURE OVERVIEW
Tính năng **"Áp dụng Mã Giảm Giá (Voucher)"** (Function D) nằm ở bước Thanh toán thuộc nhóm tính năng E của hệ thống thương mại điện tử ShopGo, cho phép người dùng nhập mã ưu đãi để hưởng chiết khấu (theo tỷ lệ phần trăm hoặc số tiền cố định VNĐ) trên tổng giá trị đơn hàng, giúp tối ưu chi phí mua sắm cho khách hàng và kích cầu tiêu dùng cho sản phẩm.

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản; có quyền truy cập trang Thanh toán, nhập mã giảm giá, nhấn áp dụng, xem số tiền giảm và hoàn tất đơn hàng.
- **Khách vãng lai (Guest)**: Người dùng xem sản phẩm và thêm vào giỏ hàng; bắt buộc phải đăng nhập tài khoản (trở thành Customer) khi chuyển sang trang Thanh toán mới có thể sử dụng tính năng áp dụng mã giảm giá.
- **Nhân viên CSKH / Admin**: Tác nhân thuộc hệ thống Back-office thực hiện quản lý, cấu hình danh mục mã giảm giá và đối soát đơn hàng (nằm ngoài phạm vi kiểm thử chi tiết của tính năng này).
- **Hệ thống (System)**: Tác nhân tự động chịu trách nhiệm kiểm tra tính hợp lệ của mã (hạn sử dụng, giá trị đơn hàng tối thiểu), tính toán mức chiết khấu và cập nhật lại tổng tiền thanh toán hiển thị cho người dùng.

## 3. BUSINESS RULES
- BR-01: Tính năng áp dụng mã giảm giá hiển thị tại trang Thanh toán với giao diện bao gồm ô nhập "Mã giảm giá" và nút "Áp dụng".
- BR-02: Khách vãng lai (Guest) bắt buộc phải thực hiện đăng nhập tài khoản khi thanh toán mới có thể sử dụng mã giảm giá.
- BR-03: Hệ thống hỗ trợ 02 loại mã giảm giá: mã giảm theo phần trăm (%) và mã giảm theo số tiền cố định (VNĐ).
- BR-04: Mã giảm giá chỉ được áp dụng thành công khi tổng giá trị đơn hàng đạt hoặc vượt mức giá trị đơn hàng tối thiểu (min order value) do mã quy định.
- BR-05: Mỗi mã giảm giá đều được thiết lập ngày hết hạn cụ thể.
- BR-06: Khi áp dụng mã giảm giá thành công, hệ thống phải hiển thị rõ ràng số tiền được giảm và tổng tiền thanh toán mới sau chiết khấu.
- BR-07: Trường hợp mã giảm giá không hợp lệ hoặc đã hết hạn, hệ thống giữ nguyên tổng tiền và hiển thị thông báo lỗi phù hợp cho người dùng.
- BR-08: Hệ thống ShopGo là ứng dụng web bán lẻ trực tuyến hỗ trợ giao diện responsive trên cả Desktop và Mobile Web.
- BR-09: Đơn vị tiền tệ duy nhất áp dụng cho hiển thị và thanh toán là VNĐ; ngôn ngữ hiển thị giao diện là tiếng Việt.
- BR-10: Hệ thống đảm bảo thời gian tải trang chính dưới 3 giây trên các trình duyệt web được hỗ trợ (Chrome, Edge, Safari).

## 4. HAPPY PATH
1. Khách hàng (đã đăng nhập) tiến hành chuyển từ Giỏ hàng sang trang Thanh toán với đơn hàng có tổng giá trị đạt hoặc vượt mức giá trị tối thiểu (min order value) của mã giảm giá.
2. Khách hàng nhập mã giảm giá hợp lệ vào ô nhập "Mã giảm giá".
3. Khách hàng nhấn nút "Áp dụng".
4. Hệ thống thực hiện kiểm tra điều kiện: xác nhận mã tồn tại, còn thời hạn sử dụng và tổng giá trị đơn hàng đạt mức tối thiểu quy định.
5. Hệ thống tính toán chính xác số tiền được chiết khấu (theo phần trăm hoặc tiền cố định VNĐ).
6. Hệ thống cập nhật giao diện trang Thanh toán: hiển thị số tiền được giảm và tổng tiền thanh toán mới sau khi trừ chiết khấu.

## 5. ALTERNATE FLOWS
### AF-01: Nhập mã giảm giá đã hết hạn sử dụng
1. Khách hàng nhập mã giảm giá đã quá ngày hết hạn vào ô "Mã giảm giá" tại trang Thanh toán.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống đối soát thời gian và xác định mã đã hết hạn.
4. Hệ thống không áp dụng chiết khấu, giữ nguyên tổng tiền ban đầu và hiển thị thông báo lỗi báo mã đã hết hạn.

### AF-02: Nhập mã giảm giá không hợp lệ (Không tồn tại hoặc sai ký tự)
1. Khách hàng nhập chuỗi ký tự mã giảm giá không có trên hệ thống hoặc nhập sai mã vào ô "Mã giảm giá".
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống tra cứu cơ sở dữ liệu và không tìm thấy thông tin mã hợp lệ.
4. Hệ thống giữ nguyên tổng tiền đơn hàng và hiển thị thông báo lỗi báo mã giảm giá không hợp lệ.

### AF-03: Đơn hàng chưa đạt giá trị đơn hàng tối thiểu (Min Order Value)
1. Khách hàng nhập mã giảm giá hợp lệ khi tổng tiền các sản phẩm trong giỏ hàng nhỏ hơn mức giá trị tối thiểu quy định của mã.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống kiểm tra tổng giá trị đơn hàng với điều kiện giá trị đơn tối thiểu của mã và phát hiện không đủ điều kiện.
4. Hệ thống không thực hiện chiết khấu và hiển thị thông báo lỗi nêu rõ giá trị đơn hàng chưa đạt mức tối thiểu.

### AF-04: Khách vãng lai (Guest) chưa đăng nhập tiến hành thanh toán
1. Khách vãng lai bấm chuyển sang bước Thanh toán từ trang Giỏ hàng.
2. Hệ thống kiểm tra trạng thái xác thực và phát hiện người dùng chưa đăng nhập.
3. Hệ thống yêu cầu/chuyển hướng người dùng thực hiện Đăng nhập hoặc Đăng ký tài khoản trước khi truy cập trang Thanh toán để sử dụng mã giảm giá.

## 6. OUT OF SCOPE
- Chức năng tạo mới, chỉnh sửa, xóa hoặc quản lý điều kiện mã giảm giá ở phía hệ thống Admin/CSKH Back-office.
- Tích hợp dữ liệu khuyến mãi với hệ thống quản lý kho (Warehouse) hoặc hệ thống ERP bên thứ ba.
- Kiểm thử hiệu năng chịu tải cao (Load test / Stress test) khi có lượng truy cập áp mã tăng đột biến (ví dụ: săn Flash Sale).
- Xây dựng và kiểm thử trên ứng dụng di động bản lề (Native Mobile App cho iOS/Android).

## 7. OPEN QUESTIONS
- Q1 (What if input): Khi người dùng nhập mã giảm giá, hệ thống có tự động cắt bỏ khoảng trắng thừa ở đầu/cuối chuỗi (trim spaces) và xử lý không phân biệt chữ hoa/chữ thường (case-insensitive) hay yêu cầu nhập chính xác tuyệt đối?
  - → **[GIẢ ĐỊNH] Trả lời**: Hệ thống tự trim khoảng trắng đầu/cuối và chuẩn hóa case-insensitive (đưa mã về chữ hoa) trước khi validate; khách không cần nhập chính xác hoa/thường.
- Q2 (What if data): Đối với mã giảm giá theo tỷ lệ phần trăm (%), hệ thống có thiết lập trần giảm giá tối đa (Max discount cap) hay không? Trường hợp số tiền giảm bằng 100% giá trị đơn hàng, tổng tiền thanh toán có bị âm không hay áp dụng sàn tối thiểu là 0 VNĐ?
  - → **[GIẢ ĐỊNH] Trả lời**: Số tiền giảm không vượt quá giá trị đơn hàng; tổng tiền thanh toán có sàn tối thiểu 0 VNĐ, không bao giờ âm. (Trần giảm tối đa theo campaign chưa được cung cấp — cần BA xác nhận.)
- Q3 (What if state): Hệ thống có hỗ trợ cho phép áp dụng đồng thời nhiều mã giảm giá (ví dụ: mã giảm giá sản phẩm kết hợp mã miễn phí vận chuyển) trên cùng 01 đơn hàng hay chỉ cho phép sử dụng duy nhất 01 mã cho mỗi giao dịch?
  - → **[GIẢ ĐỊNH] Trả lời**: Cho phép áp đồng thời tối đa 02 mã nếu KHÁC loại (01 mã giảm giá đơn + 01 mã miễn phí vận chuyển); KHÔNG cộng dồn 02 mã cùng loại trên một đơn.
- Q4 (What when timing): Trường hợp người dùng nhấn nút "Áp dụng" mã thành công ở thời điểm mã còn hạn (ví dụ: 23:59:50), nhưng khi thực hiện "Đặt hàng" chốt đơn thì mã đã quá ngày hết hạn, hệ thống sẽ giữ giá trị giảm đã ghi nhận hay sẽ báo lỗi và yêu cầu tính lại tổng tiền?
  - → **[GIẢ ĐỊNH] Trả lời**: Hệ thống re-validate mã tại bước "Đặt hàng"; nếu mã đã hết hạn tại thời điểm chốt đơn → hủy phần giảm, báo lỗi và tính lại tổng tiền; KHÔNG giữ giá trị giảm đã ghi nhận trước đó.
- Q5 (What happens after post-condition): Khi một đơn hàng có sử dụng mã giảm giá bị hủy (do người dùng hủy hoặc hệ thống/Admin hủy) hoặc phát sinh trả hàng, mã giảm giá đó có được khôi phục về trạng thái "chưa sử dụng" cho khách hàng hay không?
  - → **[GIẢ ĐỊNH] Trả lời**: Đơn bị hủy hoặc trả hàng TOÀN phần → mã khôi phục về trạng thái "chưa sử dụng" và hoàn lại lượt dùng cho khách; trả hàng MỘT phần thì KHÔNG hoàn mã.
- Q6 (Who else actor): Một mã giảm giá có quy định hạn mức tổng số lần sử dụng trên toàn hệ thống hay không? Nếu có 2 người dùng cùng bấm "Áp dụng" cho lượt dùng cuối cùng của mã tại cùng một thời điểm, hệ thống xử lý tranh chấp (concurrency locking) như thế nào?
  - → **[GIẢ ĐỊNH] Trả lời**: Mã có hạn mức tổng lượt dùng toàn hệ thống; tranh chấp lượt cuối xử lý bằng khóa ở tầng server (atomic decrement / optimistic lock): chỉ giao dịch xác nhận trước nhận lượt cuối, giao dịch còn lại nhận lỗi "Mã đã hết lượt sử dụng".

---

## 8. BUSINESS CRITICALITY ASSESSMENT
- **Mục tiêu**: Thu thập Business Context phục vụ Risk Analysis và Risk Prioritization.
- **Trạng thái dữ liệu bối cảnh**: `[CONTEXT_MISSING] - Thiếu thông tin bối cảnh nghiệp vụ`
- **Tóm tắt bối cảnh nghiệp vụ ghi nhận**:
  - Hệ thống web bán lẻ trực tuyến ShopGo thuộc mảng thương mại điện tử dành cho thị trường Việt Nam (đơn vị tiền tệ VNĐ).
  - Tính năng áp dụng mã giảm giá động chạm trực tiếp đến dòng tiền giao dịch của đơn hàng, quyết định số tiền thực thanh toán của khách hàng.
  - `[CONTEXT_MISSING]`: Tài liệu gốc chưa cung cấp các chỉ số kinh doanh cụ thể như: giá trị giao dịch trung bình (AOV), tỷ lệ chuyển đổi khi áp mã, hạn mức rủi ro thất thoát doanh thu tối đa cho phép, hoặc tỷ trọng doanh thu đóng góp của các đợt chiến dịch khuyến mãi.

---

## 9. MISSING RISK CONTEXT INFORMATION

### 9.1. Chi tiết thông tin rủi ro còn thiếu theo khía cạnh
- **Missing User Context**: Thiếu thông tin phân nhóm khách hàng (mã cho Khách hàng mới, Khách hàng thân thiết VIP, hay tất cả người dùng) | Ảnh hưởng đến việc xác định rủi ro áp mã sai đối tượng phân quyền | Mức độ ảnh hưởng: MEDIUM.
- **Missing Usage Context**: Thiếu dữ liệu tần suất sử dụng, số lượng giao dịch đồng thời đỉnh (Peak traffic / Flash Sale load) | Ảnh hưởng đến việc xác định rủi ro nghẽn luồng thanh toán hoặc tranh chấp lượt dùng mã (Race condition) | Mức độ ảnh hưởng: HIGH.
- **Missing Financial Context**: Thiếu quy định về trần giảm giá tối đa (Max discount cap), giá trị giảm tối đa per order, và chính sách kiểm soát gian lận mã (Fraud prevention rules) | Ảnh hưởng trực tiếp đến việc đánh giá Severity rủi ro tổn thất tài chính nếu xảy ra lỗi tính tiền | Mức độ ảnh hưởng: HIGH.
- **Missing Operational Context**: Thiếu quy trình vận hành xử lý sự cố khi hệ thống áp sai mã, quy trình hoàn mã khi hủy đơn và SLA hỗ trợ CSKH | Ảnh hưởng đến việc đánh giá tác động vận hành (Operational Impact) khi tính năng lỗi | Mức độ ảnh hưởng: MEDIUM.
- **Missing Criticality Context**: Thiếu thông tin trọng số mức độ ưu tiên của tính năng mã giảm giá so với các tính năng thanh toán khác (Thẻ/Ví ShopGo/COD) | Ảnh hưởng đến việc định hướng tỷ trọng phân bổ nguồn lực kiểm thử | Mức độ ảnh hưởng: HIGH.

### 9.2. Tổng hợp tác động Missing Context
- **Available Context**: Môi trường Web responsive (Desktop & Mobile), thị trường Việt Nam (VNĐ), ngôn ngữ tiếng Việt, 2 dạng mã giảm (% và VNĐ cố định), điều kiện Min Order Value và ngày hết hạn.
- **Missing Context**: Phân nhóm User context, chỉ số Usage/Traffic context, định mức Financial cap/Fraud context, quy trình Operational refund/cancellation context, và trọng số Criticality context trong tổng thể sản phẩm.
- **Risk Analysis Impact**: Do thiếu hụt các thông tin bối cảnh tài chính và vận hành nêu trên (`[CONTEXT_MISSING]`), việc phân tích rủi ro chưa thể xác định chính xác mức độ Severity tuyệt đối cho các kịch bản lỗi biên và chịu tải. Tất cả các đánh giá Severity thuộc nhóm này bắt buộc phải gắn cờ `[SEVERITY_CONFIDENCE_LOW]`.

---

## 10. RISK ANALYSIS & PRIORITIZATION

### 10.1. Nguồn đánh giá Risk
- **Business Rules**: 10 quy tắc nghiệp vụ cốt lõi từ BR-01 đến BR-10 quy định tính hợp lệ của mã, điều kiện Min Order Value, loại mã và thời gian tải trang.
- **Gap Analysis**: Các khoảng trống logic phát hiện qua 6 câu hỏi Open Questions (06W) liên quan đến xử lý Trim space/Case, trần giảm giá %, kết hợp nhiều mã, mốc thời gian hết hạn chốt đơn, hoàn mã khi hủy đơn và xử lý tranh chấp Concurrency.
- **Business Criticality Assessment**: Bối cảnh giao dịch thương mại điện tử trực tiếp liên quan đến doanh thu và thanh toán tiền mặt (VNĐ), tuy nhiên đang bị đánh dấu `[CONTEXT_MISSING]`.
- **Missing Risk Context Information**: Tác động cao do thiếu hụt thông tin bối cảnh tài chính và tải hệ thống (Financial Context & Usage Context).

### 10.2. Ma trận Ma trận Đánh giá Rủi ro (3x3 Risk Matrix)

| Mã Rủi Ro / Vùng Logic | Likelihood (HIGH/MED/LOW) | Impact (HIGH/MED/LOW) | Risk Level (CRITICAL/HIGH/MED/LOW) | Severity (Critical/Major/Minor) | Cờ Tin Cậy Severity | Lý do Đánh giá Severity & Cờ Tin Cậy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| RK-01: Lỗi tính toán sai số tiền chiết khấu (mã phần trăm % hoặc tiền cố định VNĐ) dẫn đến hiển thị hoặc trừ sai tổng tiền thanh toán | MED | HIGH | HIGH | Critical | `[SEVERITY_CONFIDENCE_LOW]` | Ảnh hưởng trực tiếp đến tài chính giao dịch của người dùng và doanh thu cửa hàng, nhưng thiếu dữ liệu Financial Context về trần chiết khấu tối đa. |
| RK-02: Hệ thống chấp nhận áp dụng mã giảm giá đã hết hạn hoặc chưa đến hạn do sai lệch múi giờ hoặc kiểm tra thời gian không chính xác | MED | HIGH | HIGH | Major | `[SEVERITY_CONFIDENCE_LOW]` | Gây tổn thất tài chính khi người dùng lợi dụng mã hết hạn, thiếu dữ liệu Operational Context về quy trình đối soát đơn hàng. |
| RK-03: Áp dụng mã thành công khi giá trị đơn hàng chưa đạt mức tối thiểu (Min Order Value) hoặc không tự hủy mã khi giỏ hàng bị thay đổi giảm tiền | HIGH | MED | HIGH | Major | `[SEVERITY_CONFIDENCE_HIGH]` | Vi phạm trực tiếp quy tắc nghiệp vụ BR-04, có thể tái lặp dễ dàng nếu không re-validate ở bước chốt đơn. |
| RK-04: Tranh chấp lượt dùng (Race condition / Concurrency lock) khi nhiều người dùng đồng thời bấm áp dụng cho mã giới hạn số lần sử dụng | MED | HIGH | HIGH | Critical | `[SEVERITY_CONFIDENCE_LOW]` | Nguy cơ lọt lưới vượt quá ngân sách khuyến mãi cho phép, thiếu dữ liệu Usage Context về đỉnh tải peak traffic. |
| RK-05: Lỗi không trim khoảng trắng thừa hoặc phân biệt hoa/thường làm hệ thống từ chối mã hợp lệ hoặc chấp nhận mã không chính xác | HIGH | LOW | MED | Minor | `[SEVERITY_CONFIDENCE_HIGH]` | Ảnh hưởng đến trải nghiệm người dùng (UX), không gây thiệt hại tài chính trực tiếp hay phá vỡ luồng thanh toán. |
| RK-06: Khách vãng lai (Guest) chưa đăng nhập nhưng vẫn bypass được giao diện để áp mã giảm giá tại bước Thanh toán | LOW | HIGH | MED | Major | `[SEVERITY_CONFIDENCE_HIGH]` | Vi phạm quy tắc phân quyền người dùng BR-02, tác động đến chính sách quản lý tài khoản người dùng của ShopGo. |

### 10.3. Đánh giá tác động chiến lược (Strategic Impact Assessment)
- **Impact to Risk Analysis**: Bản phân tích rủi ro hiện tại phản ánh chính xác các kịch bản logic nghiệp vụ từ tài liệu, nhưng độ tin cậy về mức độ nghiêm trọng Severity bị hạn chế do cờ `[SEVERITY_CONFIDENCE_LOW]`. Cần ưu tiên làm rõ 6 câu hỏi Open Questions để chốt logic trước khi đóng khung ma trận rủi ro.
- **Impact to Test Prioritization**: 
  - **Ưu tiên 1 (Top Priority - Critical/High Risk)**: Tập trung kiểm thử nhóm RK-01 (Tính toán số tiền chiết khấu), RK-03 (Ranh giới Min Order Value) và RK-02 (Hạn sử dụng theo mốc thời gian real-time).
  - **Ưu tiên 2 (Medium Priority)**: Kiểm thử nhóm RK-06 (Phân quyền Guest/Customer) và RK-04 (Giới hạn lượt dùng và đồng thời nếu có spec bổ sung).
  - **Ưu tiên 3 (Low Priority)**: Kiểm thử nhóm RK-05 (Trim space & Case-sensitivity).
- **Impact to Coverage Strategy**: 
  - Áp dụng chiến lược **Deep Testing (Kiểm thử sâu)** và thiết kế Test Case tự động (Automation Test) cho luồng Happy Path thanh toán cùng các kỹ thuật Phân tích giá trị biên (BVA) cho Min Order Value và Expiry Date.
  - Chuẩn bị sẵn các kịch bản **Boundary & Exception Testing** cho phần kết hợp mã và xử lý giỏ hàng biến động.
  - Kiến nghị bổ sung kịch bản **Concurrency / Load Test** nếu BA/PO xác nhận mã có giới hạn lượt dùng trên toàn hệ thống.