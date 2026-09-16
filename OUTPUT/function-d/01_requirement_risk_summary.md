# REQUIREMENT & RISK ANALYSIS REPORT · function-d
Owner: qa-analyst/01-requirement-risk-summary · Nguồn: INPUT/Function D.md, INPUT/OVERVIEW.md, knowledge/_project.md, knowledge/function-d.md · Verdict: PASS

**Dạng tài liệu nhận diện**: Prose Document kết hợp bảng tổng quan dự án E-commerce.

---

## 1. FEATURE OVERVIEW
Chức năng cho phép khách hàng đã đăng nhập nhập mã giảm giá (Voucher) tại trang Thanh toán của hệ thống thương mại điện tử ShopGo để được giảm trừ trực tiếp vào giá trị đơn hàng theo hình thức phần trăm (%) có mức trần giảm tối đa hoặc số tiền cố định (VNĐ) giảm tối đa về 0 VNĐ. Mỗi khách hàng chỉ được dùng mỗi mã một lần duy nhất, không áp dụng cộng dồn nhiều mã (chỉ áp đè thay thế), và hệ thống tự động kiểm tra tính hợp lệ toàn vẹn từ lúc áp dụng đến thời điểm đặt hàng.

---

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản. Có quyền nhập mã giảm giá, áp dụng voucher tại màn hình Thanh toán khi đặt hàng. Mỗi mã chỉ dùng 1 lần/tài khoản.
- **Khách vãng lai (Guest)**: Có thể duyệt sản phẩm, thêm vào giỏ hàng nhưng bắt buộc phải đăng nhập khi tiến hành Thanh toán để áp dụng mã giảm giá.
- **Hệ thống ShopGo (System)**: Tự động kiểm tra tính hợp lệ của mã (tồn tại, thời hạn theo GMT+7 23:59:59, giá trị đơn tối thiểu, giới hạn 1 lần/user, rate limit), tính toán mức giảm (chặn Max Cap, sàn 0đ, làm tròn xuống đồng), cập nhật tổng tiền thanh toán, cảnh báo và hủy mã khi giỏ hàng đổi giá/tồn kho, hoàn lại lượt dùng khi hủy đơn.
- **Nhân viên CSKH / Admin**: Quản trị cấu hình mã giảm giá ở Back-office (ngoài phạm vi test chi tiết của function này).

---

## 3. BUSINESS RULES
- **BR-01**: Có 2 loại mã giảm giá: giảm theo phần trăm (%) và giảm số tiền cố định (VNĐ).
- **BR-02**: Mã chỉ dùng được khi đơn hàng đạt giá trị tối thiểu quy định của mã (min order value).
- **BR-03**: Mỗi mã giảm giá có ngày hết hạn xác định (chốt hiệu lực đến 23:59:59 ngày hết hạn theo GMT+7).
- **BR-04**: Áp dụng thành công → hệ thống hiển thị số tiền được giảm và tổng tiền mới sau giảm.
- **BR-05**: Mã không hợp lệ hoặc hết hạn → hiển thị thông báo lỗi tương ứng, giữ nguyên tổng tiền.
- **BR-06**: Vị trí thao tác: Tại trang Thanh toán, có ô nhập "Mã giảm giá" và nút "Áp dụng".
- **BR-07**: Khách hàng phải đăng nhập khi tiến hành thanh toán (khách vãng lai chuyển hướng/yêu cầu đăng nhập).
- **BR-08**: Mỗi khách hàng chỉ được áp dụng mỗi mã giảm giá 01 lần duy nhất.
- **BR-09**: Không cộng dồn nhiều mã giảm giá. Khi nhập mã mới hợp lệ sẽ áp đè và thay thế mã hiện tại.
- **BR-10**: Mã giảm cố định có giá trị giảm lớn hơn tổng đơn hàng thì tổng tiền thanh toán giảm tối đa về 0 VNĐ.
- **BR-11**: Mã giảm giá theo phần trăm (%) có quy định mức giảm tối đa (Max Discount Cap).
- **BR-12**: Mã giảm giá chỉ áp dụng giảm trực tiếp trên giá trị đơn hàng (không áp dụng cho phí vận chuyển).
- **BR-13**: Khi thay đổi giỏ hàng khiến đơn hàng không còn đủ giá trị tối thiểu, hệ thống cảnh báo và tự động hủy voucher.
- **BR-14**: Khi đơn hàng đã áp mã bị hủy, lượt sử dụng mã sẽ được tự động hoàn lại cho tài khoản khách hàng.
- **BR-15**: Khi session đăng nhập hết hạn tại trang thanh toán, mở modal login tại chỗ và giữ nguyên ngữ cảnh giỏ hàng cùng mã đang nhập dở sau khi login lại.
- **BR-16**: Kiểm tra realtime trạng thái Active của user khi bấm Áp dụng voucher; tài khoản bị khóa sẽ bị từ chối áp dụng và vô hiệu hóa đặt hàng.
- **BR-17**: Ô nhập mã tự động trim bỏ khoảng trắng ở đầu và cuối chuỗi (`trim()`); khoảng trắng ở giữa bị coi là ký tự không hợp lệ.
- **BR-18**: Mã giảm giá không phân biệt chữ hoa / chữ thường (`Case-insensitive`), tự động chuẩn hóa sang in hoa khi đối soát.
- **BR-19**: Độ dài mã hợp lệ từ 3 đến 20 ký tự, chỉ gồm ký tự chữ cái và chữ số `[A-Za-z0-9]`, cấm ký tự đặc biệt.
- **BR-20**: Tiền chiết khấu lẻ của mã phần trăm (%) được làm tròn xuống (Floor) hàng đơn vị đồng VNĐ gần nhất.
- **BR-21**: Mốc hết hạn của mã tính chính xác đến 23:59:59 của ngày hết hạn theo múi giờ Việt Nam (GMT+7).
- **BR-22**: Bắt buộc re-validate kiểm tra lại tính hợp lệ của voucher tại thời điểm khách hàng bấm nút "Đặt hàng".
- **BR-23**: Thứ tự trừ tiền khi kết hợp Ví ShopGo: Trừ giá trị giảm của Voucher trước, số tiền còn lại mới trừ vào số dư Ví.
- **BR-24**: Khi biến động giá hoặc tồn kho server khiến tổng đơn không còn đủ giá trị tối thiểu, hệ thống cảnh báo và tự gỡ bỏ voucher.
- **BR-25**: Cơ chế Rate Limit: Nhập sai mã 5 lần liên tiếp trong 5 phút sẽ tạm khóa ô nhập voucher trong 15 phút.
- **BR-26**: Thống nhất danh sách thông báo lỗi chi tiết phân biệt từng ca (trống, sai format/không tồn tại, hết hạn, chưa đủ min, đã dùng, rate limit).

---

## 4. HAPPY PATH
1. Khách hàng đã đăng nhập tài khoản ShopGo, có sản phẩm trong giỏ hàng và tiến hành vào trang **Thanh toán**.
2. Khách hàng nhập mã giảm giá hợp lệ (đúng cú pháp 3-20 ký tự, còn hạn sử dụng, chưa từng sử dụng, đơn hàng đạt giá trị tối thiểu) vào ô "Mã giảm giá".
3. Khách hàng nhấn nút **"Áp dụng"**.
4. Hệ thống kiểm tra realtime tính hợp lệ, tính toán mức giảm (chặn Max Cap nếu là % hoặc sàn 0đ nếu là cố định, làm tròn xuống đồng VNĐ).
5. Hệ thống hiển thị số tiền được giảm rõ ràng và cập nhật tổng tiền thanh toán mới của đơn hàng.
6. Khách hàng chọn phương thức thanh toán và nhấn **"Đặt hàng"**; hệ thống re-validate thành công và tạo đơn hàng.

---

## 5. ALTERNATE FLOWS
- **AF-01 (Mã không tồn tại / sai định dạng)**: Nhập mã không có trong hệ thống hoặc chứa ký tự đặc biệt / ngoài 3-20 ký tự $\rightarrow$ Bấm Áp dụng $\rightarrow$ Báo lỗi: *"Mã giảm giá không hợp lệ"*, giữ nguyên tổng tiền.
- **AF-02 (Mã đã hết hạn)**: Nhập mã quá hạn 23:59:59 GMT+7 $\rightarrow$ Báo lỗi: *"Mã giảm giá đã hết hạn sử dụng"*.
- **AF-03 (Chưa đạt giá trị đơn hàng tối thiểu)**: Tổng tiền hàng chưa đủ min order $\rightarrow$ Báo lỗi: *"Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này"*.
- **AF-04 (Áp đè / Thay thế mã)**: Đang áp mã A, nhập mã B hợp lệ $\rightarrow$ Hệ thống hủy mã A, áp dụng mã B và tính lại tổng tiền mới.
- **AF-05 (Sửa giỏ hàng sau khi áp mã)**: Xóa bớt món hoặc giảm số lượng khiến đơn dưới min order $\rightarrow$ Cảnh báo, tự động hủy voucher, hiển thị lại giá gốc.
- **AF-06 (Mã đã qua sử dụng của user)**: Nhập lại voucher đã từng đặt đơn thành công $\rightarrow$ Báo lỗi: *"Bạn đã sử dụng mã giảm giá này rồi"*.
- **AF-07 (Mã giảm cố định > tổng đơn hàng)**: Đơn hàng 100k, áp mã giảm cố định 150k $\rightarrow$ Giảm 100k, tổng tiền thanh toán hiển thị đúng 0 VNĐ.
- **AF-08 (Mã % vượt trần Max Cap)**: Đơn 2.000.000đ, mã giảm 20% trần 100.000đ $\rightarrow$ Giảm đúng 100.000đ thay vì 400.000đ.
- **AF-09 (Hết session khi áp mã)**: Session token hết hạn $\rightarrow$ Bật popup đăng nhập tại chỗ; đăng nhập xong giữ nguyên giỏ hàng và mã đang nhập.
- **AF-10 (Tài khoản bị khóa giữa chừng)**: User bị khóa tài khoản $\rightarrow$ Báo lỗi khóa tài khoản, vô hiệu hóa nút Đặt hàng.
- **AF-11 (Biến động giá server khi thanh toán)**: Sản phẩm đổi giá làm đơn dưới min order $\rightarrow$ Báo giá thay đổi, tự hủy voucher.
- **AF-12 (Voucher hết hạn lúc bấm Đặt hàng)**: Khách để màn hình lâu khiến voucher hết hạn lúc bấm Đặt hàng $\rightarrow$ Re-validate thất bại, chặn đặt hàng, yêu cầu thanh toán giá gốc.
- **AF-13 (Rate Limit brute-force)**: Nhập sai 5 lần liên tiếp trong 5 phút $\rightarrow$ Tạm khóa ô nhập mã trong 15 phút và hiển thị cảnh báo.

---

## 6. OUT OF SCOPE
- Chức năng tạo mới, chỉnh sửa, cấu hình hạn mức voucher tại Back-office Admin.
- Tích hợp kỹ thuật sâu của cổng thanh toán bên thứ ba (VNPay, Momo, Visa).
- Ứng dụng native mobile app (chỉ kiểm thử responsive web trên Desktop Chrome/Edge/Safari và Mobile Web).
- Kiểm thử hiệu năng chịu tải lớn (Load/Stress test) và kiểm thử thâm nhập an ninh chuyên sâu (Penetration test).

---

## 7. OPEN QUESTIONS
- **Q1 (06W - W5 Actor)**: Giới hạn lượt dùng của mỗi mã trên từng tài khoản?
  - **Trạng thái**: [Đã xác nhận: Mỗi khách hàng chỉ được áp dụng mỗi mã 01 lần duy nhất - BR-08].
- **Q2 (06W - W2 State)**: Quy tắc áp dụng nhiều mã đồng thời (cộng dồn hay áp đè)?
  - **Trạng thái**: [Đã xác nhận: Không cộng dồn, chỉ áp đè thay thế mã cũ - BR-09].
- **Q3 (06W - W3 Data)**: Sàn số tiền giảm cố định và trần chiết khấu mã %?
  - **Trạng thái**: [Đã xác nhận: Giảm tối đa về 0 VNĐ; mã % có trần Max Cap - BR-10, BR-11].
- **Q4 (06W - W6 After)**: Xử lý giỏ hàng thay đổi sau khi áp mã?
  - **Trạng thái**: [Đã xác nhận: Tự động tính lại, cảnh báo và tự gỡ voucher nếu không đủ min order - BR-13].
- **Q5 (06W - W5 Actor)**: Phạm vi chiết khấu (tiền hàng hay phí ship)?
  - **Trạng thái**: [Đã xác nhận: Chỉ giảm trực tiếp trên giá trị hàng hóa, không giảm phí ship - BR-12].
- **Q6 (06W - W6 After)**: Hoàn lại lượt dùng khi hủy đơn hàng?
  - **Trạng thái**: [Đã xác nhận: Lượt dùng được tự động hoàn lại cho tài khoản khách hàng - BR-14].
- **Q7 (06W - W1 Input / W4 Timing)**: Định dạng mã, làm tròn tiền lẻ, múi giờ và rate limit?
  - **Trạng thái**: [Đã xác nhận: [A-Za-z0-9]{3,20}, trim(), case-insensitive, làm tròn xuống đồng, hạn 23:59:59 GMT+7, sai 5 lần khóa 15p - BR-15 đến BR-26].

---

## 8. BUSINESS CRITICALITY ASSESSMENT
- **Trạng thái dữ liệu bối cảnh**: Đầy đủ (Đã nạp từ `knowledge/_project.md` §3 và `knowledge/function-d.md`).
- **Bối cảnh nghiệp vụ ghi nhận**:
  - Áp mã giảm giá nằm trực tiếp trong luồng Thanh toán (Core Revenue Flow).
  - Lỗi tính sai tiền gây thất thoát tài chính trực tiếp hoặc tranh chấp khiếu nại khách hàng.
  - Tần suất sử dụng cao điểm vào các dịp Flash Sale và chiến dịch Marketing lớn.

---

## 9. MISSING RISK CONTEXT INFORMATION
### 9.1 Chi tiết theo khía cạnh
- **User Context**: Đầy đủ (Khách vãng lai, khách hàng đã đăng ký tại Việt Nam). Mức độ rủi ro: LOW.
- **Usage Context**: Đầy đủ (Web responsive desktop/mobile, cao điểm Flash Sale). Mức độ rủi ro: LOW.
- **Financial Context**: Đầy đủ (Tiền tệ VNĐ, làm tròn xuống đồng, Max Cap, sàn 0đ, trừ trước số dư ví). Mức độ rủi ro: LOW.
- **Operational Context**: Đầy đủ (SLA phản hồi < 2s, hoàn mã tự động khi hủy đơn, chặn brute-force). Mức độ rủi ro: LOW.
- **Criticality Context**: Đầy đủ (Tính năng doanh thu sống còn, ảnh hưởng trực tiếp đến thanh toán). Mức độ rủi ro: LOW.

### 9.2 Tổng hợp
- **Available Context**: 100% bối cảnh đã được xác định qua `knowledge/_project.md` và `knowledge/function-d.md`.
- **Missing Context**: 0 (Không còn dữ liệu bối cảnh bị thiếu).
- **Risk Analysis Impact**: Bức tranh rủi ro được định lượng chính xác tuyệt đối.

---

## 10. RISK ANALYSIS & PRIORITIZATION
### 10.1 Nguồn đánh giá Risk
- **Business Rules**: 26 rules hoàn chỉnh, bao quát từ validation, luồng phụ, bảo mật đến tính toán tài chính.
- **Gap Analysis**: 0 gap mở (100% Open Questions và Missing Rules đã được BA/PO xác nhận).
- **Business Criticality Assessment**: Mức quan trọng Critical (Luồng Thanh toán và Tiền tệ).
- **Missing Risk Context Information**: Không có khoảng trống thông tin bối cảnh.

### 10.2 Ma trận Đánh giá Rủi ro (3x3)
| Mã rủi ro | Likelihood | Impact | Risk Level | Severity | Cờ tin cậy | Lý do (5 yếu tố Impact) |
|:---|:---|:---|:---|:---|:---|:---|
| **RK-01**: Tính toán sai tiền giảm (vượt trần Max Cap hoặc âm tiền) | MED | HIGH | **HIGH** | Critical | SEVERITY_CONFIDENCE_HIGH | Thất thoát tài chính trực tiếp, sai lệch báo cáo doanh thu kế toán. |
| **RK-02**: Lạm dụng voucher (dùng nhiều lần, bypass điều kiện min order) | HIGH | HIGH | **CRITICAL** | Critical | SEVERITY_CONFIDENCE_HIGH | Lợi dụng lỗ hổng trục lợi ngân sách khuyến mại, rủi ro diện rộng. |
| **RK-03**: Voucher hết hạn hoặc bị gỡ nhưng vẫn tạo được đơn hàng | MED | HIGH | **HIGH** | Major | SEVERITY_CONFIDENCE_HIGH | Tranh chấp đơn hàng, sai lệch trạng thái đơn giữa hệ thống và cổng thanh toán. |
| **RK-04**: Xung đột trừ tiền kết hợp Ví ShopGo và Voucher | MED | HIGH | **HIGH** | Major | SEVERITY_CONFIDENCE_HIGH | Sai lệch số dư ví của khách hàng, gây khiếu nại nghiêm trọng. |
| **RK-05**: Bị tấn công Brute-force đoán mã giảm giá nội bộ | HIGH | MED | **HIGH** | Major | SEVERITY_CONFIDENCE_HIGH | Lộ mã private/VIP, cạn kiệt ngân sách khuyến mãi cho khách hàng mục tiêu. |
| **RK-06**: Không hoàn lại mã khi đơn hàng bị hủy | MED | MED | **MEDIUM** | Minor | SEVERITY_CONFIDENCE_HIGH | Ảnh hưởng trải nghiệm người dùng, tăng khối lượng hỗ trợ cho CSKH. |
| **RK-07**: Treo giao diện / Mất giỏ hàng khi session timeout | LOW | MED | **LOW** | Minor | SEVERITY_CONFIDENCE_HIGH | Trải nghiệm mua sắm bị gián đoạn, khách hàng từ bỏ thanh toán. |

### 10.3 Đánh giá tác động chiến lược
- **Impact to Risk Analysis**: Mọi rủi ro đã được nhận diện với độ tin cậy cao nhất (SEVERITY_CONFIDENCE_HIGH) nhờ tri thức nền đầy đủ.
- **Impact to Test Prioritization**: Tập trung ưu tiên cao nhất cho RK-01, RK-02, RK-03 (Logic tài chính & Ràng buộc toàn vẹn).
- **Impact to Coverage Strategy**: Thiết kế kiểm thử sâu (Deep Testing) cho chuỗi biên 7 mốc, validation định dạng, concurrency/re-validate khi đặt hàng, và ma trận dữ liệu phân lớp chi tiết.
