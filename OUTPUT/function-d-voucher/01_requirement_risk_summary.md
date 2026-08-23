# REQUIREMENT & RISK ANALYSIS REPORT · function-d-voucher
Owner: qa-analyst/01-requirement-risk-summary · Nguồn: INPUT/Function D.md, INPUT/OVERVIEW.md, knowledge/_project.md · Verdict: PASS

**Dạng tài liệu nhận diện**: Prose Document (Tài liệu mô tả nghiệp vụ kết hợp Bối cảnh hệ thống ShopGo và Chi tiết tính năng Function D)

---

## 1. FEATURE OVERVIEW
Tính năng **"Áp dụng Mã Giảm Giá (Voucher)"** (Function D) nằm ở bước Thanh toán thuộc nhóm tính năng E của hệ thống thương mại điện tử ShopGo, cho phép khách hàng nhập mã ưu đãi hợp lệ để nhận chiết khấu (theo phần trăm % hoặc số tiền cố định VNĐ) trên tổng giá trị đơn hàng, giúp kích cầu tiêu dùng và nâng cao trải nghiệm mua sắm.

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản; có quyền truy cập trang Thanh toán, nhập mã voucher, áp dụng chiết khấu, xem số tiền giảm và hoàn tất đơn hàng.
- **Khách vãng lai (Guest)**: Người dùng duyệt sản phẩm và thêm vào giỏ hàng; bắt buộc phải đăng nhập/đăng ký tài khoản (chuyển thành Customer) khi vào bước Thanh toán để sử dụng mã giảm giá.
- **Nhân viên CSKH / Admin (Back-office)**: Quản lý danh mục mã giảm giá, cấu hình điều kiện voucher và giám sát đơn hàng (nằm ngoài phạm vi kiểm thử chi tiết của tính năng này).
- **Hệ thống (ShopGo System)**: Tự động đối soát tính hợp lệ của voucher (tồn tại, hạn dùng, min order value), tính toán số tiền giảm, cập nhật tổng tiền thanh toán mới và hiển thị thông báo kết quả.

## 3. BUSINESS RULES
- **BR-01**: Tính năng áp dụng mã giảm giá hiển thị tại trang Thanh toán với thành phần giao diện gồm ô nhập "Mã giảm giá" và nút "Áp dụng".
- **BR-02**: Khách vãng lai (Guest) bắt buộc phải đăng nhập tài khoản khi thanh toán mới có thể sử dụng mã giảm giá.
- **BR-03**: Hệ thống hỗ trợ 02 loại mã giảm giá: giảm theo phần trăm (%) và giảm theo số tiền cố định (VNĐ).
- **BR-04**: Mã giảm giá chỉ áp dụng thành công khi tổng giá trị đơn hàng đạt hoặc vượt giá trị tối thiểu (min order value) do mã quy định.
- **BR-05**: Mỗi mã giảm giá đều có thiết lập ngày hết hạn cụ thể.
- **BR-06**: Khi áp dụng mã giảm giá thành công, hệ thống phải hiển thị rõ ràng số tiền được giảm và tổng tiền thanh toán mới sau khi chiết khấu.
- **BR-07**: Khi mã giảm giá không hợp lệ hoặc đã hết hạn, hệ thống giữ nguyên tổng tiền ban đầu và hiển thị thông báo lỗi phù hợp cho người dùng.
- **BR-08**: Hệ thống ShopGo là web app bán lẻ trực tuyến hỗ trợ responsive trên cả giao diện Desktop và Mobile Web.
- **BR-09**: Đơn vị tiền tệ hiển thị và thanh toán duy nhất là VNĐ; ngôn ngữ giao diện là tiếng Việt.
- **BR-10**: Hệ thống đảm bảo thời gian tải trang chính dưới 3 giây trên các trình duyệt web được hỗ trợ (Chrome, Edge, Safari bản mới).

## 4. HAPPY PATH
1. Khách hàng (đã đăng nhập) chuyển từ Giỏ hàng sang trang Thanh toán với đơn hàng có tổng giá trị đạt hoặc vượt mức tối thiểu (`min order value`) của voucher.
2. Khách hàng nhập mã giảm giá hợp lệ vào ô "Mã giảm giá".
3. Khách hàng nhấn nút "Áp dụng".
4. Hệ thống kiểm tra tính hợp lệ của mã: xác định mã tồn tại, đang hoạt động, còn hạn sử dụng và đơn hàng thỏa mãn giá trị tối thiểu.
5. Hệ thống tính toán chính xác số tiền giảm (theo % hoặc số tiền cố định VNĐ) và trừ trực tiếp vào tổng tiền đơn hàng.
6. Giao diện trang Thanh toán cập nhật ngay lập tức: hiển thị dòng "Số tiền giảm", hiển thị "Tổng tiền mới" đã chiết khấu, và kích hoạt trạng thái mã đã được áp dụng thành công.

## 5. ALTERNATE FLOWS
### AF-01: Áp dụng mã giảm giá đã quá hạn sử dụng
1. Khách hàng nhập mã giảm giá đã quá ngày hết hạn vào ô "Mã giảm giá" tại trang Thanh toán.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống đối soát thời gian hiện tại với ngày hết hạn của mã và ghi nhận mã đã hết hạn.
4. Hệ thống giữ nguyên tổng tiền ban đầu, không áp dụng giảm giá và hiển thị thông báo lỗi: *"Mã giảm giá đã hết hạn sử dụng"*.

### AF-02: Nhập mã giảm giá không hợp lệ / không tồn tại
1. Khách hàng nhập chuỗi ký tự mã không tồn tại trên hệ thống hoặc sai định dạng.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống tra cứu cơ sở dữ liệu và không tìm thấy bản ghi voucher hợp lệ.
4. Hệ thống giữ nguyên tổng tiền và hiển thị thông báo lỗi: *"Mã giảm giá không hợp lệ hoặc không tồn tại"*.

### AF-03: Đơn hàng chưa đạt giá trị tối thiểu (Min Order Value)
1. Khách hàng nhập mã giảm giá hợp lệ nhưng tổng tiền hàng chưa đạt mức `min order value` quy định của mã.
2. Khách hàng nhấn nút "Áp dụng".
3. Hệ thống kiểm tra điều kiện giá trị đơn hàng và phát hiện không thỏa mãn.
4. Hệ thống giữ nguyên tổng tiền và hiển thị thông báo lỗi: *"Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này"*.

### AF-04: Khách vãng lai chưa đăng nhập cố gắng vào trang Thanh toán
1. Khách vãng lai (Guest) thao tác bấm nút thanh toán từ Giỏ hàng.
2. Hệ thống kiểm tra phiên người dùng và nhận diện chưa xác thực tài khoản.
3. Hệ thống điều hướng người dùng tới trang Đăng nhập / Đăng ký trước khi cho phép vào trang Thanh toán để sử dụng voucher.

## 6. OUT OF SCOPE
- Chức năng quản lý, tạo mới, chỉnh sửa, xóa mã giảm giá trong hệ thống Back-office Admin.
- Tích hợp cổng thanh toán thẻ bên thứ ba và quy trình xử lý giao dịch tài chính chi tiết tại ngân hàng.
- Quy trình tích hợp hệ thống quản trị kho/ERP của doanh nghiệp.
- Kiểm thử tải cao (Load test / Stress test chuyên sâu hạ tầng backend).
- Ứng dụng di động Native App (iOS / Android app).

## 7. OPEN QUESTIONS
- **Q1 (06W - W1)**: Hệ thống có phân quyền mã giảm giá theo phân hạng thành viên (Khách mới, Member, VIP) hay mỗi tài khoản Customer đều dùng chung một kho voucher?
- **Q2 (06W - W2)**: Khách hàng có được phép thay đổi/hủy mã giảm giá đã áp dụng (bấm nút "Hủy mã" hoặc nhập mã khác đè lên) trước khi bấm Đặt hàng không?
- **Q3 (06W - W3)**: Đối với mã giảm giá theo tỷ lệ phần trăm (%), hệ thống có thiết lập mức trần giảm tối đa (Max Discount Cap - ví dụ giảm 20% tối đa 50.000 VNĐ) hay không?
- **Q4 (06W - W3 & W5)**: Giá trị tối thiểu của đơn hàng (`min order value`) và phần tiền được giảm được tính trên Tổng tiền hàng (Subtotal trước phí ship) hay Tổng hóa đơn bao gồm cả Phí vận chuyển (Shipping fee)?
- **Q5 (06W - W4)**: Mỗi mã giảm giá có giới hạn số lượt sử dụng trên toàn hệ thống (Total usage limit) và giới hạn số lần sử dụng trên mỗi tài khoản người dùng (Per-user usage limit) hay không?
- **Q6 (06W - W4 & W5)**: Khi đơn hàng bị hủy hoặc hoàn trả (Refund về Ví ShopGo), mã giảm giá đã sử dụng có được hoàn lại lượt dùng cho khách hàng hay không?
- **Q7 (06W - W5)**: Một đơn hàng có được phép áp dụng đồng thời nhiều mã giảm giá (ví dụ kết hợp Voucher giảm giá sản phẩm + Voucher miễn phí vận chuyển) hay chỉ duy nhất 1 voucher/đơn hàng?

## 8. BUSINESS CRITICALITY ASSESSMENT
- **Trạng thái dữ liệu bối cảnh**: `[CONTEXT_MISSING]` (Chưa có dữ liệu định lượng chi tiết trong `knowledge/_project.md` về SLA, volume giao dịch và quy mô doanh thu).
- **Bối cảnh nghiệp vụ ghi nhận**: Tính năng Áp dụng Mã Giảm Giá nằm trực tiếp tại điểm chốt chuyển đổi thanh toán (Checkout flow). Đây là mắt xích nhạy cảm về mặt tài chính và trải nghiệm người dùng: lỗi tính toán tiền giảm có thể trực tiếp gây thất thoát doanh thu cho doanh nghiệp hoặc gây tranh chấp khiếu nại với khách hàng.

## 9. MISSING RISK CONTEXT INFORMATION
### 9.1 Chi tiết theo khía cạnh
- **Missing User Context**: Chưa có dữ liệu phân nhóm chi tiết về hành vi khách hàng (tỷ lệ Guest vs Customer đăng ký, phân hạng thành viên tác động tới quyền áp mã) | Ảnh hưởng: Chưa xác định được mức độ ưu tiên giữa các phân khúc khách hàng | Mức độ: **MED**.
- **Missing Usage Context**: Chưa có số liệu cụ thể về tần suất áp mã, lưu lượng traffic trong các chiến dịch Mega Sale / Flash Sale | Ảnh hưởng: Khó đánh giá rủi ro tranh chấp tài nguyên khi hàng nghìn khách hàng áp cùng một mã hữu hạn cùng lúc (Race condition) | Mức độ: **HIGH**.
- **Missing Financial Context**: Chưa có quy định cụ thể về ngân sách chiết khấu tối đa, trần giảm giá và tỷ lệ thất thoát chấp nhận được | Ảnh hưởng: Nguy cơ rủi ro thất thoát doanh thu cao nếu mã % bị lạm dụng trên đơn hàng giá trị lớn | Mức độ: **HIGH**.
- **Missing Operational Context**: Chưa có tài liệu quy định quy trình xử lý lỗi voucher, SLA đối soát hoàn tiền khi hủy đơn | Ảnh hưởng: Thiếu cơ sở xác nhận tính nhất quán của trạng thái voucher khi đơn hàng bị hoàn/hủy | Mức độ: **MED**.
- **Missing Criticality Context**: Chưa xác định chỉ số đo lường mức độ sống còn của tính năng voucher đối với chỉ tiêu GMV của ShopGo | Ảnh hưởng: Khó xác định ngưỡng chấp nhận lỗi (Risk Tolerance) cho đợt release | Mức độ: **MED**.

### 9.2 Tổng hợp
- **Available Context**: Hệ thống bán lẻ web responsive (VND, Tiếng Việt); luồng thanh toán hỗ trợ COD / Thẻ / Ví ShopGo; hỗ trợ 2 loại mã (% và số tiền cố định); có điều kiện min order value và ngày hết hạn.
- **Missing Context**: Trần giảm giá tối đa (Max Discount Cap); quy tắc gộp mã; giới hạn lượt dùng toàn sàn/mỗi user; quy tắc tính trên subtotal vs shipping; chính sách hoàn mã khi hủy đơn.
- **Risk Analysis Impact**: Việc thiếu các bối cảnh tài chính và giới hạn sử dụng khiến việc đánh giá mức độ nghiêm trọng (Severity) của rủi ro tính toán sai chiết khấu phải được gắn cờ `[SEVERITY_CONFIDENCE_LOW]` cho các kịch bản biên tài chính.

## 10. RISK ANALYSIS & PRIORITIZATION
### 10.1 Nguồn đánh giá Risk
- **Business Rules**: 10 quy tắc nghiệp vụ đã bóc tách từ tài liệu nguồn (`BR-01` → `BR-10`).
- **Gap Analysis**: Các kẽ hở logic và câu hỏi mở từ phần 7 (`Q1` → `Q7`) liên quan đến Max Cap, Race Condition, Hoàn mã, Gộp mã.
- **Business Criticality Assessment**: Chức năng thanh toán trực tiếp tác động tới dòng tiền và chuyển đổi doanh thu.
- **Missing Risk Context Information**: 5 khía cạnh bối cảnh thiếu hụt (Usage volume, Financial cap, Concurrency).

### 10.2 Ma trận Đánh giá Rủi ro (3x3)
| Mã rủi ro | Likelihood | Impact | Risk Level | Severity | Cờ tin cậy | Lý do (5 yếu tố Impact: Business, User, Revenue, Operational, Usage) |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **RK-01**: Tính sai số tiền giảm (đặc biệt là mã % không có trần hoặc sai công thức làm tròn) dẫn đến thất thoát tài chính hoặc tính sai tổng thanh toán | HIGH | HIGH | **CRITICAL** | Critical | `SEVERITY_CONFIDENCE_HIGH` | Tác động trực tiếp đến Revenue và Business: thất thoát dòng tiền bán lẻ; gây User bức xúc vì số tiền thanh toán không chính xác; ảnh hưởng toàn bộ quy mô giao dịch. |
| **RK-02**: Cho phép bypass điều kiện giá trị đơn hàng tối thiểu (`min order value`) do lỗi so sánh biên (`<` vs `<=`) | MED | HIGH | **HIGH** | Major | `SEVERITY_CONFIDENCE_HIGH` | Ảnh hưởng trực tiếp đến Revenue: vi phạm chính sách khuyến mại; Operational: thất thoát ngân sách marketing; diễn ra trên các đơn hàng sát biên min. |
| **RK-03**: Sử dụng được mã giảm giá đã hết hạn hoặc chưa đến ngày bắt đầu hiệu lực do chênh lệch múi giờ / xử lý mốc `00:00:00` vs `23:59:59` | MED | HIGH | **HIGH** | Major | `SEVERITY_CONFIDENCE_HIGH` | Gây tổn thất tài chính khi khách dùng mã hết hạn; phát sinh tranh chấp vận hành (Operational); ảnh hưởng tính minh bạch của chương trình khuyến mại. |
| **RK-04**: Race condition / Đồng thời áp dụng 1 mã giới hạn vượt quá số lượt cho phép hoặc 1 user dùng nhiều lần | HIGH | MED | **HIGH** | Major | `SEVERITY_CONFIDENCE_LOW` (Thiếu dữ liệu về cơ chế concurrency & usage limit) | Nguy cơ lạm dụng voucher (Abuse/Fraud); ảnh hưởng doanh thu và ngân sách chiến dịch; User khai thác lỗ hổng hệ thống. |
| **RK-05**: Không cho phép hủy/đổi mã voucher sau khi đã áp dụng hoặc lỗi hiển thị tổng tiền không cập nhật khi xóa mã | MED | MED | **MEDIUM** | Minor | `SEVERITY_CONFIDENCE_HIGH` | Ảnh hưởng tiêu cực đến User Experience; tăng tỷ lệ bỏ giỏ hàng (Cart abandonment); Operational: tăng tải CSKH xử lý khiếu nại. |
| **RK-06**: Không tính toán lại tổng tiền khi thay đổi số lượng sản phẩm trong giỏ hàng sau khi đã áp mã giảm giá | HIGH | MED | **HIGH** | Major | `SEVERITY_CONFIDENCE_HIGH` | Khách hàng có thể lợi dụng giảm số lượng sản phẩm để đơn tụt dưới `min order value` nhưng vẫn giữ nguyên chiết khấu; ảnh hưởng trực tiếp đến Revenue. |
| **RK-07**: Giao diện responsive trên Mobile Web bị vỡ layout, che khuất nút "Áp dụng" hoặc thông báo lỗi không đọc được | MED | LOW | **LOW** | Minor | `SEVERITY_CONFIDENCE_HIGH` | Ảnh hưởng cục bộ đến User Experience trên thiết bị màn hình nhỏ; không gây thất thoát tài chính trực tiếp. |

### 10.3 Đánh giá tác động chiến lược
- **Impact to Risk Analysis**: Cung cấp bức tranh toàn diện về rủi ro tài chính, rủi ro biên giá trị và các kẽ hở logic tiềm ẩn trong quá trình áp dụng voucher.
- **Impact to Test Prioritization**: Ưu tiên cao nhất (P1) cho việc kiểm thử tính toán chiết khấu (BVA, Equivalence Partitioning cho % và VNĐ), kiểm tra điều kiện `min order value` và kiểm tra hạn sử dụng. Ưu tiên P2 cho các luồng thay đổi giỏ hàng sau áp mã, bảo mật/race condition.
- **Impact to Coverage Strategy**: Áp dụng Deep Testing và Boundary Value Analysis cho toàn bộ luồng tính toán tiền tệ và ngày tháng; phối hợp Decision Table cho các tổ hợp điều kiện voucher; áp dụng UI/Responsive Testing cho các thiết bị Desktop và Mobile Web.

---

## FIX
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|
| 1 | `knowledge/_project.md` §3 | Dữ liệu bối cảnh dự án còn để trống `[điền]` | Đề xuất PM/BA bổ sung thông tin User, Usage, Financial SLA để nâng cao độ chính xác đánh giá rủi ro |

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| 1 | Mục 7 (Q3) | Xác nhận có áp dụng Trần giảm giá tối đa (Max Discount Cap) cho mã % không | BA / PO |
| 2 | Mục 7 (Q4) | Xác nhận `min order value` và giảm giá tính trên Subtotal hay Total (gồm ship) | BA / PO |
| 3 | Mục 7 (Q5) | Xác nhận quy định về giới hạn số lượt dùng voucher trên toàn sàn và trên mỗi user | BA / PO |
| 4 | Mục 7 (Q6) | Xác nhận chính sách hoàn lại voucher khi hủy/hoàn đơn hàng | BA / PO |
| 5 | Mục 7 (Q7) | Xác nhận có cho phép gộp nhiều voucher trong cùng một đơn hàng không | BA / PO |
