# EXPLORATORY CHARTER SET — TÍNH NĂNG ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER) — SHOPGO

## 1. Bảng tổng hợp Charter theo rủi ro

| # | Charter (Tóm tắt Mission) | Risk nhắm tới | Mức rủi ro | Time-box |
|:---|:---|:---|:---:|:---:|
| **CH-01** | Khám phá các công thức tính toán chiết khấu (tỷ lệ %, tiền VNĐ, làm tròn số lẻ, chạm sàn 0 VNĐ) để phát hiện sai lệch tổng tiền giữa FE/BE/Cổng thanh toán. | **RK-01**: Sai lệch tính toán chiết khấu & Tổng tiền thanh toán | **Ưu tiên 1 (Critical)** | 60 phút |
| **CH-02** | Khám phá các kịch bản lạm dụng mã giảm giá (vượt `max_per_user`, mã hết hạn UTC+7, mã cạn ngân sách/tổng lượt, tài khoản `Suspended`) để phát hiện lỗ hổng thất thoát ngân sách khuyến mãi. | **RK-02**: Lạm dụng mã & Thất thoát ngân sách khuyến mãi | **Ưu tiên 1 (Critical)** | 60 phút |
| **CH-03** | Khám phá các giá trị biên của điều kiện Min Order Value, Max Discount Cap và giới hạn số lượng voucher để phát hiện lỗi tràn ngưỡng và tính toán sai Subtotal. | **RK-03**: Lỗi ranh giới ngưỡng giá trị (Boundary & Cap) | **Ưu tiên 1 (Critical)** | 45 phút |
| **CH-04** | Khám phá luồng tranh chấp đồng thời nhiều giao dịch và vòng đời giữ mã (Voucher Holding/Phantom Lock) khi thanh toán bên thứ ba bị hủy/timeout để phát hiện thất thoát hoặc treo mã. | **RK-04**: Tranh chấp đồng thời (Concurrency) & Treo giữ lượt mã (Voucher Holding) | **Ưu tiên 2 (High)** | 60 phút |
| **CH-05** | Khám phá khả năng chống chịu của ô nhập mã trước hành vi dò quét tự động (Brute-Force) và chèn payload độc hại để phát hiện lỗ hổng bảo mật XSS/SQLi/DoS. | **RK-05**: Tấn công dò quét vét cạn mã (Brute-Force) & Injection qua Input | **Ưu tiên 2 (High)** | 45 phút |
| **CH-06** | Khám phá quy tắc bảo toàn dữ liệu tài chính khi sửa đổi giỏ hàng sau áp mã và xử lý hoàn trả từng phần đơn hàng để phát hiện sai lệch kế toán `[GIẢ ĐỊNH]`. | **RK-06**: Mất toàn vẹn dữ liệu khi hoàn trả từng phần & Sửa giỏ hàng | **Ưu tiên 3 (Medium)** | 45 phút |
| **CH-07** | Khám phá tính rõ ràng của các thông điệp phản hồi lỗi và khả năng co giãn giao diện Responsive trên Mobile Web để phát hiện các rào cản trải nghiệm người dùng. | **RK-07**: Trải nghiệm người dùng kém & Thông báo lỗi mập mờ | **Ưu tiên 3 (Medium)** | 30 phút |
| **CH-08** | Khám phá độ trễ phản hồi của API kiểm tra mã và tính chiết khấu trong điều kiện mạng biến động (Slow 3G, rớt gói tin) để phát hiện tình trạng nghẽn luồng checkout. | **RK-08**: Hiệu năng phản hồi API chậm | **Ưu tiên 4 (Low)** | 30 phút |
| **CH-09** | Khám phá khả năng tiếp cận (Accessibility) khi điều hướng hoàn toàn bằng bàn phím và thu phóng màn hình 200% để phát hiện lỗi cản trở thao tác áp mã. | **RK-09**: Rào cản khả năng tiếp cận (Accessibility) | **Ưu tiên 5 (Low)** | 30 phút |

---

## 2. Chi tiết từng Charter

### CH-01
- **Mission**: Khám phá các công thức tính toán chiết khấu (tỷ lệ %, tiền cố định VNĐ, quy tắc làm tròn số học `Math.round` VNĐ, và tính sàn thanh toán 0 VNĐ) để phát hiện sai lệch tổng tiền đơn hàng giữa giao diện người dùng (FE), hệ thống máy chủ (BE) và Cổng thanh toán bên thứ ba.
- **Area**: Màn hình Thanh toán (Checkout Page), Bảng tóm tắt đơn hàng (Order Summary), API tính giá `POST /api/checkout/apply-coupon`, Cổng thanh toán tích hợp (VNPay/MoMo/COD).
- **Risk**: **RK-01** (Sai lệch tính toán chiết khấu & Tổng tiền thanh toán — Trace: [BR-03, BR-06, BR-09, MR-03, MR-06](OUTPUT/01_Requirement_Summary_Report.md#L19-L26)).
- **Time-box**: 60 phút.
- **Notes**:
  - *Điểm chú ý*: Các đơn hàng có giá trị lẻ (ví dụ: 199.999 VNĐ, 333.333 VNĐ) áp mã chiết khấu tỷ lệ lẻ (15%, 33%).
  - *Biến thể nên thử*: 
    - Đơn hàng có chiết khấu lớn hơn Subtotal (xem hệ thống có giữ sàn tối thiểu 0 VNĐ hay phát sinh số âm).
    - So sánh tổng tiền hiển thị trên UI với payload gửi sang Cổng thanh toán VNPay/MoMo.
  - *Câu hỏi mở cần trả lời*: Số tiền làm tròn có được ghi nhận thống nhất trong hóa đơn và lịch sử giao dịch kế toán hay không?

---

### CH-02
- **Mission**: Khám phá các kịch bản lạm dụng mã khuyến mãi (dùng vượt số lần cho phép trên 1 tài khoản `max_per_user`, áp dụng mã đã hết hạn theo múi giờ UTC+7, mã cạn ngân sách tổng lượt phát hành, hoặc tài khoản đang bị khóa/treo) để phát hiện lỗ hổng gây thất thoát ngân sách tiếp thị.
- **Area**: Ô nhập "Mã giảm giá" tại trang Thanh toán, Trạng thái xác thực tài khoản Customer, Database lưu vết lịch sử dùng mã (`voucher_usage_history`).
- **Risk**: **RK-02** (Lạm dụng mã & Thất thoát ngân sách khuyến mãi — Trace: [BR-02, BR-05, BR-07, MR-01, MR-04](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L18-L35)).
- **Time-box**: 60 phút.
- **Notes**:
  - *Điểm chú ý*: Múi giờ hết hạn (UTC+7 so với UTC server), kiểm tra thời điểm 23:59:59 của ngày hết hạn và 00:00:00 của ngày kế tiếp.
  - *Biến thể nên thử*:
    - Đổi trạng thái tài khoản sang `Suspended` trong lúc đang mở giỏ hàng đã áp mã rồi bấm "Đặt hàng".
    - Khách hàng đã dùng đủ hạn mức (vd: 1 lần) cố tình mở 2 tab trình duyệt hoặc 2 thiết bị khác nhau cùng lúc.
    - Áp mã giảm giá khi chưa đăng nhập (luồng Guest chuyển đổi sang Customer).
  - *Câu hỏi mở cần trả lời*: Hệ thống có re-validate lại tính hợp lệ của mã tại thời điểm bấm nút chốt "Đặt hàng" (Final Submit) hay chỉ validate lúc nhấn "Áp dụng"?

---

### CH-03
- **Mission**: Khám phá các giá trị biên của điều kiện Giá trị đơn hàng tối thiểu (Min Order Value), Mức giảm giá tối đa (Max Discount Cap) và giới hạn số lượng voucher áp dụng đồng thời để phát hiện lỗi tính sai ranh giới Subtotal và tràn trần giảm giá.
- **Area**: Ô nhập mã giảm giá, Khối tính toán Subtotal (tiền hàng) vs Grand Total (tiền hàng + phí ship), Pop-up/Thông báo lỗi ranh giới.
- **Risk**: **RK-03** (Lỗi ranh giới ngưỡng giá trị & Cap — Trace: [BR-04, MR-03, MR-05](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L62-L82)).
- **Time-box**: 45 phút.
- **Notes**:
  - *Điểm chú ý*: Phân biệt rõ Subtotal (chỉ tính tiền sản phẩm) với Tổng tiền gồm phí vận chuyển và thuế.
  - *Biến thể nên thử*:
    - Subtotal = Min Order Value - 1 VNĐ (ví dụ: 199.999 VNĐ so với mốc 200.000 VNĐ).
    - Subtotal = Min Order Value đúng từng đồng (ví dụ: 200.000 VNĐ).
    - Subtotal = Min Order Value + 1 VNĐ (ví dụ: 200.001 VNĐ).
    - Giá trị đơn cực lớn khiến mức giảm % vượt Max Cap (ví dụ: giảm 20% đơn 10.000.000 VNĐ = 2.000.000 VNĐ nhưng Max Cap là 500.000 VNĐ).
    - Cố tình nhập liên tiếp 2 mã giảm giá khác nhau trên cùng 1 đơn hàng (thử áp đồng thời).
  - *Câu hỏi mở cần trả lời*: Khi nhập mã thứ hai, hệ thống sẽ từ chối hay tự động ghi đè (replace) mã thứ nhất?

---

### CH-04
- **Mission**: Khám phá luồng xử lý tranh chấp đồng thời (Concurrency) khi nhiều giao dịch cùng tranh giành lượt mã cuối cùng và cơ chế khóa giữ/hoàn trả mã (Voucher Holding & Phantom Lock) trong các luồng thanh toán online bị hủy hoặc timeout để phát hiện lỗi kẹt mã hoặc phát hành vượt quota.
- **Area**: API chốt đơn hàng `POST /api/orders/place-order`, Hàng đợi xử lý lượt mã (Redis/DB lock), Luồng thanh toán qua Cổng VNPay/MoMo/ZaloPay.
- **Risk**: **RK-04** (Tranh chấp đồng thời & Treo giữ lượt mã — Trace: [BR-16, MR-04, MR-06](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L85-L102)).
- **Time-box**: 60 phút.
- **Notes**:
  - *Điểm chú ý*: Mã chỉ còn đúng 1 lượt sử dụng cuối cùng trong toàn hệ thống.
  - *Biến thể nên thử*:
    - Gửi đồng thời 2 request thanh toán áp mã trong cùng một millisecond từ 2 tài khoản khác nhau.
    - Áp mã, chuyển sang màn hình Cổng VNPay rồi tắt tab / bấm nút "Hủy thanh toán" quay về shop.
    - Để giao dịch thanh toán online treo quá 15 phút cho đến khi hết hạn (Session Timeout).
  - *Câu hỏi mở cần trả lời*: Sau khi hủy giao dịch thanh toán online, lượt mã có được tự động hoàn lại ngay lập tức (`AVAILABLE`) để khách tiếp tục mua sắm hay bị khóa vĩnh viễn (`PENDING_HOLD`)?

---

### CH-05
- **Mission**: Khám phá khả năng tự bảo vệ của ô nhập mã trước các cuộc tấn công dò quét vét cạn mã (Brute-Force / Coupon Enumeration) và các payload chèn mã độc (XSS, SQL Injection) để phát hiện lỗ hổng bảo mật và nguy cơ nghẽn tài nguyên server.
- **Area**: Input text "Mã giảm giá", Nút "Áp dụng", API endpoint `/api/coupons/validate`, Cơ chế Rate Limiting / WAF.
- **Risk**: **RK-05** (Tấn công dò quét vét cạn mã & Injection qua Input — Trace: [MR-02, MR-06](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L127-L142)).
- **Time-box**: 45 phút.
- **Notes**:
  - *Điểm chú ý*: Cơ chế giới hạn tần suất (Rate Limiting 5 lần/phút trên 1 IP/User) và làm sạch dữ liệu đầu vào (Input Sanitization).
  - *Biến thể nên thử*:
    - Nhập liên tục > 5 mã không tồn tại trong 1 phút bằng script hoặc click tay cực nhanh.
    - Chèn payload XSS: `<script>alert('Voucher')</script>`, `<img src=x onerror=alert(1)>`.
    - Chèn chuỗi SQL Injection: `' OR '1'='1`, `'; DROP TABLE vouchers;--`.
    - Nhập chuỗi unicode đặc biệt, khoảng trắng đầu/cuối chuỗi, emoji, chuỗi vượt quá 50 ký tự.
  - *Câu hỏi mở cần trả lời*: Khi bị Rate Limit, hệ thống trả về mã lỗi HTTP 429 hay thông báo thân thiện kèm thời gian cần chờ?

---

### CH-06
- **Mission**: Khám phá quy tắc bảo toàn dữ liệu tài chính khi người dùng quay lại chỉnh sửa giỏ hàng sau khi đã áp mã và luồng hoàn tiền từng phần (Partial Refund) khi trả hàng để phát hiện sai lệch giá trị hoàn tiền và thất thoát chiết khấu `[GIẢ ĐỊNH]`.
- **Area**: Giỏ hàng (Cart), Màn hình Thanh toán, Luồng Quản lý Đơn hàng & Hoàn trả (Order Return / Refund).
- **Risk**: **RK-06** (Mất toàn vẹn dữ liệu khi hoàn trả từng phần & Sửa giỏ hàng — Trace: [MR-04, MR-05](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L105-L124)).
- **Time-box**: 45 phút.
- **Notes**:
  - *Điểm chú ý `[GIẢ ĐỊNH]`*: Do tài liệu đặc tả chưa mô tả chi tiết logic phân bổ chiết khấu vào từng item khi hoàn tiền, cần giả định cơ chế phân bổ tỷ lệ theo giá trị món hàng.
  - *Biến thể nên thử*:
    - Áp mã thành công (đơn 300k, min 200k), sau đó quay lại giỏ hàng xóa bớt 1 món khiến Subtotal giảm xuống 150k (< 200k) rồi quay lại thanh toán.
    - Mua 2 sản phẩm (A: 200k, B: 100k) áp mã giảm 30k cố định. Khách hàng thực hiện hoàn trả sản phẩm A (kiểm tra số tiền hoàn là 200k hay 200k trừ phần chiết khấu phân bổ 20k).
  - *Câu hỏi mở cần trả lời*: Mã giảm giá có tự động bị hủy/gỡ bỏ khi giá trị giỏ hàng tụt xuống dưới mức Min Order Value hay không?

---

### CH-07
- **Mission**: Khám phá tính rõ ràng, chuẩn xác của các thông điệp phản hồi (Validation Feedback) và khả năng thích ứng giao diện trên nhiều độ phân giải Mobile Web để phát hiện các khiếm khuyết về trải nghiệm người dùng (UX/UI).
- **Area**: Giao diện trang Thanh toán trên Mobile Web (iPhone Safari, Android Chrome) và Desktop Web; Hộp thông báo lỗi và thành công (Toasts / Inline error text).
- **Risk**: **RK-07** (Trải nghiệm người dùng kém & Thông báo lỗi mập mờ — Trace: [BR-01, BR-07, BR-08, MR-02](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md#L38-L59)).
- **Time-box**: 30 phút.
- **Notes**:
  - *Điểm chú ý*: Độ phân biệt rõ ràng của từng lý do lỗi (hết hạn vs hết lượt vs không đủ giá trị đơn vs sai ký tự).
  - *Biến thể nên thử*:
    - Nhập mã hết hạn -> Kiểm tra xem thông báo có ghi rõ "Mã giảm giá đã hết hạn" thay vì "Mã không hợp lệ".
    - Mở bàn phím ảo trên mobile khi nhập mã -> Kiểm tra xem nút "Áp dụng" có bị che khuất hoặc layout trang thanh toán có bị vỡ/cuộn lệch hay không.
    - Áp mã thành công -> Kiểm tra xem dòng hiển thị số tiền giảm (-... VNĐ) có dùng màu sắc nổi bật (màu xanh/cam) và tổng tiền mới có được cập nhật tức thì (Live update) hay không.
  - *Câu hỏi mở cần trả lời*: Người dùng có dễ dàng nhận biết lý do chính xác khiến việc áp mã bị từ chối hay không?

---

### CH-08
- **Mission**: Khám phá độ trễ phản hồi của API kiểm tra mã và tính toán chiết khấu trong điều kiện mạng yếu hoặc chập chờn (Slow 3G, Packet Loss) để phát hiện tình trạng đơ giao diện hoặc người dùng bấm liên tục (Double click) gây lỗi.
- **Area**: Nút "Áp dụng", Trạng thái Loading spinner, API `/api/checkout/apply-coupon`.
- **Risk**: **RK-08** (Hiệu năng phản hồi API chậm — Trace: [BR-10](OUTPUT/01_Requirement_Summary_Report.md#L26)).
- **Time-box**: 30 phút.
- **Notes**:
  - *Điểm chú ý*: Thời gian xử lý API phải dưới 3 giây theo BR-10.
  - *Biến thể nên thử*:
    - Bật Network Throttling (Slow 3G / Fast 3G) trong Chrome DevTools.
    - Nhấn nút "Áp dụng" liên tiếp nhiều lần khi đang trong trạng thái loading (kiểm tra cơ chế disable nút / debounce).
    - Ngắt kết nối mạng ngay khi vừa bấm "Áp dụng" (Offline transition).
  - *Câu hỏi mở cần trả lời*: Giao diện có hiển thị chỉ báo trạng thái chờ (loading indicator) rõ ràng trong lúc chờ API phản hồi hay không?

---

### CH-09
- **Mission**: Khám phá khả năng tiếp cận (Accessibility) khi điều hướng hoàn toàn bằng bàn phím (Keyboard Navigation) và khi thu phóng màn hình lên 200% để phát hiện các rào cản ngăn người khiếm thị hoặc người khuyết tật sử dụng mã giảm giá.
- **Area**: Toàn bộ khối Voucher trên trang Checkout, Thứ tự Focus bàn phím (`tabindex`), Thuộc tính ARIA hỗ trợ Screen Reader.
- **Risk**: **RK-09** (Rào cản khả năng tiếp cận — Trace: [BR-08](OUTPUT/01_Requirement_Summary_Report.md#L24)).
- **Time-box**: 30 phút.
- **Notes**:
  - *Điểm chú ý*: Tiêu chuẩn WCAG 2.1 AA cơ bản cho form nhập liệu và nút bấm.
  - *Biến thể nên thử*:
    - Dùng phím `Tab` để di chuyển vào ô "Mã giảm giá", gõ mã, rồi nhấn phím `Enter` hoặc `Tab` sang nút "Áp dụng" và nhấn `Space`/`Enter`.
    - Zoom màn hình trình duyệt lên 200% và 300% -> Kiểm tra ô nhập và nút áp dụng có bị tràn viền hoặc che mất thông báo kết quả.
    - Bật trình đọc màn hình (Screen Reader / NVDA / VoiceOver) để kiểm tra thông báo lỗi/thành công có được đọc tự động (`aria-live="polite"`).
  - *Câu hỏi mở cần trả lời*: Người dùng chỉ dùng bàn phím có thể kích hoạt áp mã và đọc được số tiền chiết khấu mới hay không?

---

## 3. Tự đối chiếu kiểm soát chất lượng (FACT Self-Audit)

| Tiêu chí | Câu hỏi kiểm tra | Đánh giá | Trạng thái |
|:---|:---|:---|:---:|
| **F — Factual** | Rủi ro và vùng khám phá có bám sát Risk Area/Requirement gốc, không bịa? | Bám sát toàn bộ 9 Risk Areas (RK-01 đến RK-09) từ Chiến lược Độ phủ theo Rủi ro ở Step 03 và tài liệu BR Step 01. | **PASS** |
| **A — Accurate** | Mission/Area/Risk phát biểu chính xác, một nghĩa, không mơ hồ? | Mỗi trường đều định nghĩa cụ thể mục tiêu, phạm vi luồng dữ liệu và rủi ro truy vết trực tiếp. | **PASS** |
| **C — Complete** | Đủ 05 trường cho mỗi Charter; bao phủ đầy đủ rủi ro cao? | Đầy đủ 9 Charter tương ứng 9 rủi ro từ Ưu tiên 1 đến 5; mỗi Charter đủ 5 trường (Mission, Area, Risk, Time-box, Notes). | **PASS** |
| **T — Testable** | Mission đủ rõ để người test biết cần khám phá gì và khi nào coi là "đã đủ"? | Định hướng rõ mục tiêu khám phá ("Khám phá ... để phát hiện ..."), có gợi ý biến thể và câu hỏi nghiệm thu thực tế. | **PASS** |
