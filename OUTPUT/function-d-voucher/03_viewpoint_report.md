# BÁO CÁO PHÂN TÍCH VIEWPOINT KIỂM THỬ — Áp dụng Mã Giảm Giá (Voucher) · function-d-voucher
Owner: qa-analyst/03-viewpoint-selection · Nguồn: output/function-d-voucher/01_requirement_risk_summary.md, output/function-d-voucher/02_missing_rule_report.md · Verdict: PASS

---

## 1. CHIẾN LƯỢC ĐỘ PHỦ THEO RỦI RO

### 1.1 Ma trận Ưu tiên Rủi ro (Likelihood × Impact)

| # | Risk Area | Likelihood | Impact | Mức ưu tiên | Nguồn (Rule / Missing Rule) |
|:---|:---|:---:|:---:|:---:|:---|
| **RK-01** | Tính sai số tiền giảm (mã % và VNĐ cố định, làm tròn tiền lẻ, trần giảm giá Max Cap) dẫn đến thất thoát doanh thu hoặc sai lệch tổng thanh toán | Cao (HIGH) | Cao (HIGH) | **Ưu tiên 1 (Critical)** | BR-03, BR-06, BR-09, MR-03, MR-08, MR-10 |
| **RK-02** | Vi phạm hoặc bypass điều kiện giá trị đơn hàng tối thiểu (`min order value`) tại các điểm biên | TB (MED) | Cao (HIGH) | **Ưu tiên 2 (High)** | BR-04, MR-04, MR-09 |
| **RK-03** | Áp dụng trái phép voucher hết hạn hoặc chưa kích hoạt do lỗi xử lý ngày/giờ biên | TB (MED) | Cao (HIGH) | **Ưu tiên 2 (High)** | BR-05, BR-07 |
| **RK-04** | Trục lợi mã khuyến mãi (Race condition áp mã đồng thời, lạm dụng mã quá số lượt quy định, bypass phân quyền user) | Cao (HIGH) | TB (MED) | **Ưu tiên 2 (High)** | MR-01, MR-05, MR-07 |
| **RK-05** | Giỏ hàng thay đổi giá trị làm đơn tụt dưới `min order value` nhưng hệ thống không thu hồi voucher đã áp | Cao (HIGH) | TB (MED) | **Ưu tiên 3 (High)** | BR-04, MR-09 |
| **RK-06** | Không thể hủy/đổi mã voucher đã áp dụng hoặc lỗi không cập nhật lại tổng tiền khi thao tác hủy | TB (MED) | TB (MED) | **Ưu tiên 4 (Medium)** | BR-01, MR-02 |
| **RK-07** | Giao diện vỡ trên Mobile Web, nút "Áp dụng" bị che khuất hoặc thời gian phản hồi API quá 3 giây gây đơ lag | TB (MED) | Thấp (LOW) | **Ưu tiên 5 (Low)** | BR-08, BR-10 |

### 1.2 Xếp hạng ưu tiên & Loại test cần làm
1. **Rủi ro RK-01 (Sai tính toán chiết khấu & trần giảm)**: Cần áp dụng **Boundary Value Analysis (BVA)** cho tỷ lệ phần trăm (0%, 1%, 50%, 99%, 100%), giá trị giảm cố định VNĐ (bằng tiền hàng, lớn hơn tiền hàng) và **Decision Table** cho các trường hợp vượt trần Max Cap.
2. **Rủi ro RK-02 (Bypass Min Order Value)**: Áp dụng **BVA chuỗi biên chuẩn 7 điểm** trên giá trị đơn hàng (`min-1`, `min`, `min+1`, giá trị giữa, và `Subtotal vs Grand Total`).
3. **Rủi ro RK-03 (Voucher hết hạn & Mốc thời gian)**: Áp dụng **Equivalence Partitioning & BVA** theo ngày/giờ (`ngày trước`, `đúng ngày hết hạn lúc 23:59:59`, `qua ngày hôm sau lúc 00:00:00`).
4. **Rủi ro RK-04 & RK-05 (Bảo mật & Tác động chéo giỏ hàng)**: Áp dụng **Security Testing / Concurrency Testing** (kiểm tra giới hạn lượt dùng, phân quyền Guest/Customer/VIP) và **Integration Testing** (tương tác giữa Giỏ hàng và Thanh toán).
5. **Rủi ro RK-06 & RK-07 (Trạng thái UI, Usability & Performance)**: Áp dụng **State Transition** cho luồng Áp dụng → Hủy → Đổi mã, phối hợp **Responsive UI Testing** và **Performance Testing (<3s)**.

### 1.3 Liên kết Risk → Viewpoint
- **RK-01** (Tính toán tiền giảm) → `Viewpoint: Happy Path`, `Viewpoint: Boundary`
- **RK-02** (Min order value) → `Viewpoint: Boundary`, `Viewpoint: Negative`
- **RK-03** (Thời hạn voucher) → `Viewpoint: Boundary`, `Viewpoint: Negative`
- **RK-04** (Bảo mật & Race condition) → `Viewpoint: Security`
- **RK-05** (Tác động chéo Giỏ hàng - Thanh toán) → `Viewpoint: Integration`
- **RK-06** (Hủy/Đổi mã & Trạng thái giao diện) → `Viewpoint: UX/Usability`, `Viewpoint: Negative`
- **RK-07** (Responsive & Tốc độ tải) → `Viewpoint: UX/Usability`, `Viewpoint: Performance`

---

## 2. TỔNG QUAN LỰA CHỌN VIEWPOINT

Toàn bộ **07/08 Viewpoint** từ Registry chuẩn được lựa chọn dựa trên mức độ phù hợp nghiệp vụ và rủi ro của tính năng Function D:

| STT | Tên Viewpoint | Mức rủi ro | Nguồn | Lý do lựa chọn |
|:---:|:---|:---:|:---|:---|
| 1 | **Happy Path** | Critical | Registry | Luồng chuẩn bắt buộc: Áp dụng thành công mã % và mã VNĐ cho đơn hàng hợp lệ, tính đúng tiền giảm và tổng tiền mới. |
| 2 | **Negative** | High | Registry | Kiểm tra các trường hợp nhập sai mã, mã không tồn tại, mã hết hạn, đơn chưa đủ min order value, khách vãng lai chưa đăng nhập. |
| 3 | **Boundary** | Critical | Registry | Kiểm tra các giá trị biên của số tiền đơn hàng (quanh `min order value`), giá trị % giảm, số tiền giảm VNĐ so với tổng đơn hàng, và mốc thời gian hết hạn. |
| 4 | **Security** | High | Registry | Kiểm tra kiểm soát quyền (Guest/Customer/VIP), lạm dụng mã quá số lượt, Race condition khi áp mã đồng thời, can thiệp tham số client-side. |
| 5 | **UX/Usability** | Medium | Registry | Kiểm tra tính rõ ràng của thông báo lỗi/thành công, khả năng hủy/đổi mã, hiển thị trực quan số tiền giảm, giao diện responsive trên Desktop và Mobile Web. |
| 6 | **Performance** | Low | Registry | Đảm bảo thời gian phản hồi khi nhấn "Áp dụng" và thời gian tải trang thanh toán < 3s theo tiêu chuẩn BR-10. |
| 7 | **Integration** | High | Registry | Kiểm tra tương tác giữa Giỏ hàng, Tính phí vận chuyển (Shipping), Phương thức thanh toán (COD/Thẻ/Ví ShopGo) và trạng thái Voucher. |

> *Ghi chú loại trừ*: **Accessibility** tạm thời chưa xếp vào phạm vi ưu tiên cao của đợt release này do ShopGo chưa có văn bản yêu cầu tiêu chuẩn WCAG cụ thể trong tài liệu nguồn (được ghi nhận trong Out-of-scope của Viewpoint).

---

## 3. ĐẶC TẢ CHI TIẾT CÁC VIEWPOINT

### Viewpoint 01: Happy Path
- **Tên Viewpoint**: Happy Path
- **Mục tiêu kiểm thử**: Xác nhận luồng chuẩn khách hàng (đã đăng nhập) áp dụng thành công mã giảm giá % và mã số tiền cố định VNĐ khi thỏa mãn đầy đủ điều kiện; hệ thống tính đúng tiền giảm và cập nhật tổng tiền thanh toán mới.
- **Phạm vi bao phủ (In-scope)**:
  - Áp dụng thành công mã giảm theo % trên đơn hàng đạt `min order value` (BR-03, BR-04, BR-06).
  - Áp dụng thành công mã giảm số tiền cố định VNĐ trên đơn hàng đạt `min order value` (BR-03, BR-04, BR-06).
  - Hiển thị rõ ràng dòng "Số tiền giảm" và "Tổng tiền mới" trên giao diện trang Thanh toán (BR-06, BR-09).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Các trường hợp lỗi dữ liệu, mã sai, hết hạn (thuộc Viewpoint: Negative).
  - Các giá trị biên số học sát ngưỡng (thuộc Viewpoint: Boundary).
- **Rủi ro nếu bỏ qua**: Tính năng cốt lõi bị lỗi khiến khách hàng không thể sử dụng mã khuyến mại, gây tắc nghẽn luồng thanh toán và hỏng trải nghiệm người dùng.
- **Ước lượng định tính Test Idea**: **Trung bình** — Tập trung vào các kịch bản chuẩn cho cả 2 loại mã (% và VNĐ).

---

### Viewpoint 02: Negative
- **Tên Viewpoint**: Negative
- **Mục tiêu kiểm thử**: Xác nhận hệ thống xử lý từ chối chính xác và hiển thị thông báo lỗi tường minh khi dữ liệu đầu vào hoặc trạng thái voucher không hợp lệ, đảm bảo giữ nguyên tổng tiền ban đầu.
- **Phạm vi bao phủ (In-scope)**:
  - Nhập mã voucher không tồn tại trong hệ thống (AF-02, BR-07).
  - Nhập mã voucher đã hết hạn sử dụng (AF-01, BR-05, BR-07).
  - Nhập mã hợp lệ nhưng tổng tiền hàng chưa đạt `min order value` (AF-03, BR-04, BR-07).
  - Để trống ô nhập mã voucher hoặc nhập chuỗi ký tự đặc biệt không hợp lệ rồi bấm "Áp dụng".
  - Khách vãng lai (Guest) chưa đăng nhập cố gắng thực hiện thanh toán với voucher (AF-04, BR-02).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Phân tích chuỗi giá trị biên sát nút min-1, max+1 (thuộc Viewpoint: Boundary).
  - Tấn công injection hoặc bypass logic phía client (thuộc Viewpoint: Security).
- **Rủi ro nếu bỏ qua**: Hệ thống bị crash hoặc cho phép áp dụng sai voucher, gây hiểu lầm cho người dùng và phát sinh lỗi logic thanh toán.
- **Ước lượng định tính Test Idea**: **Cao** — Cần bao phủ toàn bộ các thông báo lỗi và nhánh điều kiện từ chối.

---

### Viewpoint 03: Boundary
- **Tên Viewpoint**: Boundary
- **Mục tiêu kiểm thử**: Kiểm tra triệt để tính chính xác của hệ thống tại các giá trị biên của tiền đơn hàng, tỷ lệ %, tiền giảm cố định và mốc thời gian hiệu lực.
- **Phạm vi bao phủ (In-scope)**:
  - Chuỗi biên giá trị đơn hàng quanh ngưỡng `min order value`: `min - 1 VNĐ` (bị từ chối), `min` (chấp nhận), `min + 1 VNĐ` (chấp nhận).
  - Biên tỷ lệ chiết khấu %: 0%, 1%, 100% và xử lý trường hợp có trần Max Cap (MR-03).
  - Biên số tiền giảm cố định VNĐ: Bằng chính xác tổng tiền hàng, và lớn hơn tổng tiền hàng (tổng tiền mới = 0 VNĐ, không âm) (MR-08).
  - Biên thời gian hiệu lực: Trước ngày hiệu lực, đúng ngày hết hạn (23:59:59) và vừa qua ngày hết hạn (00:00:00).
  - Biên độ dài và định dạng chuỗi ký tự mã voucher (chuỗi rỗng, 1 ký tự, khoảng trắng đầu/cuối).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Các kịch bản luồng chuẩn thông thường (thuộc Viewpoint: Happy Path).
  - Các lỗi hệ thống hoặc phân quyền tài khoản (thuộc Viewpoint: Security).
- **Rủi ro nếu bỏ qua**: Lỗi so sánh dấu toán tử (`<` thay vì `<=`) làm thất thoát tiền hoặc từ chối oan đơn hàng hợp lệ sát biên.
- **Ước lượng định tính Test Idea**: **Cao** — Yêu cầu kiểm tra đầy đủ chuỗi biên chuẩn cho toàn bộ các trường số học và thời gian.

---

### Viewpoint 04: Security
- **Tên Viewpoint**: Security
- **Mục tiêu kiểm thử**: Ngăn chặn các hành vi gian lận, trục lợi mã khuyến mãi, lạm dụng số lượt dùng và tấn công can thiệp dữ liệu giá trị đơn hàng.
- **Phạm vi bao phủ (In-scope)**:
  - Kiểm tra giới hạn số lần sử dụng voucher trên mỗi tài khoản (Per-user usage limit) (MR-05).
  - Kiểm tra vượt tổng số lượt phát hành của voucher trên toàn hệ thống (Total quota limit).
  - Race condition: Gửi nhiều request áp mã cùng một thời điểm từ một tài khoản hoặc nhiều tài khoản cho mã giới hạn số lượng.
  - Phân quyền áp dụng mã theo đối tượng khách hàng (Khách mới vs VIP vs Regular) (MR-01).
  - Kiểm tra chống tấn công giả mạo (Client-side parameter tampering) để sửa đổi số tiền giảm giá gửi lên server.
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra bảo mật hạ tầng mạng và mã hóa database (thuộc Out-of-scope chung của dự án).
- **Rủi ro nếu bỏ qua**: Thất thoát ngân sách khuyến mãi quy mô lớn do bot trục lợi hoặc gian lận từ người dùng xấu.
- **Ước lượng định tính Test Idea**: **Trung bình** — Tập trung vào các lỗ hổng logic nghiệp vụ và concurrency.

---

### Viewpoint 05: UX/Usability
- **Tên Viewpoint**: UX/Usability
- **Mục tiêu kiểm thử**: Đảm bảo trải nghiệm người dùng mượt mà, thông báo hiển thị rõ ràng, dễ hiểu, hỗ trợ đầy đủ thao tác hủy/đổi mã và tương thích giao diện Desktop/Mobile Web.
- **Phạm vi bao phủ (In-scope)**:
  - Khả năng Hủy mã giảm giá đã áp dụng (nút Hủy mã / icon [X]) để khôi phục tổng tiền hoặc đổi sang mã khác (MR-02).
  - Thông báo lỗi/thành công hiển thị rõ ràng, đúng ngữ cảnh tiếng Việt, dễ hiểu (BR-07, BR-09).
  - Định dạng hiển thị tiền tệ VNĐ chuẩn (phân cách hàng nghìn `100.000 VNĐ`) và làm tròn số nguyên không có số thập phân (BR-09, MR-10).
  - Xử lý mã không phân biệt chữ hoa/chữ thường (Case-insensitive) và tự động cắt bỏ khoảng trắng (Trim space) (MR-10).
  - Kiểm tra hiển thị responsive trên các kích thước màn hình Desktop và Mobile Web (BR-08).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra tính toán số học logic (thuộc Viewpoint: Boundary).
- **Rủi ro nếu bỏ qua**: Trải nghiệm khách hàng kém, gây nhầm lẫn khi nhập mã dẫn đến hủy bỏ quá trình mua hàng.
- **Ước lượng định tính Test Idea**: **Trung bình** — Bao phủ các tương tác giao diện và hiển thị trực quan.

---

### Viewpoint 06: Performance
- **Tên Viewpoint**: Performance
- **Mục tiêu kiểm thử**: Đảm bảo thời gian phản hồi của thao tác kiểm tra và áp dụng voucher không làm trễ quá trình thanh toán của người dùng.
- **Phạm vi bao phủ (In-scope)**:
  - Thời gian xử lý API từ lúc bấm "Áp dụng" đến khi cập nhật tổng tiền mới trên giao diện đạt tiêu chuẩn < 3 giây (BR-10).
  - Thời gian tải trang Thanh toán khi có kèm thông tin voucher < 3 giây trên Chrome, Edge, Safari (BR-10).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Load test / Stress test hàng chục nghìn CCU trên toàn server (thuộc Out-of-scope dự án).
- **Rủi ro nếu bỏ qua**: Giao diện bị treo/đơ khi người dùng bấm áp dụng mã, dẫn đến người dùng bấm liên tục nút áp dụng gây trùng lặp request.
- **Ước lượng định tính Test Idea**: **Thấp** — Tập trung vào đo lường thời gian phản hồi client-side mức cơ bản.

---

### Viewpoint 07: Integration
- **Tên Viewpoint**: Integration
- **Mục tiêu kiểm thử**: Đảm bảo tính toàn vẹn dữ liệu và tính toán chính xác khi tính năng voucher tương tác với Giỏ hàng, Phí vận chuyển, Phương thức thanh toán và Đơn hàng.
- **Phạm vi bao phủ (In-scope)**:
  - Tương tác với Giỏ hàng: Tự động kiểm tra lại điều kiện và tính lại tiền khi khách hàng quay lại giỏ hàng thay đổi số lượng/xóa sản phẩm (MR-09).
  - Tương tác với Phí vận chuyển: Xác nhận tiền giảm voucher tính trên Tiền hàng (Subtotal) chứ không làm giảm âm phí vận chuyển của đơn vị vận chuyển (MR-04).
  - Tương tác với Phương thức thanh toán: Kiểm tra tổng tiền sau giảm giá được truyền chính xác sang các cổng thanh toán (COD, Thẻ, Ví ShopGo).
  - Tương tác với Vòng đời đơn hàng: Kiểm tra cơ chế hoàn lại lượt sử dụng voucher khi đơn hàng bị Hủy hoặc Hoàn tiền (MR-06).
  - Kiểm tra quy tắc gộp nhiều voucher trên cùng một đơn hàng (MR-07).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra xử lý giao dịch nội bộ của cổng thanh toán bên thứ ba (thuộc Out-of-scope).
- **Rủi ro nếu bỏ qua**: Dữ liệu không đồng bộ giữa giỏ hàng và thanh toán, gây thất thoát tài chính hoặc xung đột cổng thanh toán.
- **Ước lượng định tính Test Idea**: **Cao** — Cần bao phủ toàn bộ các luồng tương tác đa module trong hệ thống ShopGo.

---

## 4. MA TRẬN ZERO-OVERLAP

| Viewpoint A | Viewpoint B | Điểm nguy cơ giao thoa | Ranh giới phân định |
|:---|:---|:---|:---|
| **Happy Path** | **Boundary** | Kiểm tra áp dụng mã với các giá trị đơn hàng khác nhau | **Happy Path** chỉ kiểm tra các giá trị điển hình ở giữa khoảng hợp lệ. **Boundary** chuyên biệt kiểm tra các giá trị sát nút biên (`min - 1`, `min`, `min + 1`, 0%, 100%, Max Cap). |
| **Negative** | **Boundary** | Đơn hàng không đủ `min order value` | **Negative** kiểm tra đơn hàng có giá trị nhỏ rõ rệt (vd: đơn 10.000đ vs min 100.000đ) để xác nhận hiển thị thông báo lỗi. **Boundary** kiểm tra chính xác giá trị `min - 1 VNĐ` (vd: 99.999đ vs min 100.000đ). |
| **Negative** | **Security** | Mã voucher bị từ chối do hết lượt hoặc không có quyền | **Negative** kiểm tra mã không tồn tại / sai cú pháp / hết hạn theo ngày. **Security** kiểm tra bypass phân quyền nhóm user, tấn công đồng thời (Race condition) và giả mạo tham số tiền giảm. |
| **UX/Usability** | **Happy / Negative** | Hiển thị thông báo và kết quả áp mã | **Happy/Negative** xác nhận tính đúng đắn về logic nghiệp vụ (tiền giảm đúng, thông báo xuất hiện). **UX/Usability** kiểm tra chất lượng hiển thị (văn phong tiếng Việt, format định dạng số `100.000 VNĐ`, tính năng Hủy/Đổi mã, responsive trên Mobile Web). |
| **Integration** | **Happy Path** | Đơn hàng áp mã và chuyển sang thanh toán | **Happy Path** kiểm tra việc áp mã và hiển thị tổng tiền mới tại bước thanh toán. **Integration** kiểm tra luồng tác động qua lại khi sửa giỏ hàng, tính phí ship, chuyển số tiền sang cổng thanh toán và hoàn mã khi hủy đơn. |

---

## 5. XÁC NHẬN BÀN GIAO
- [x] Mọi Risk Area ưu tiên cao (RK-01 → RK-07) đã được ánh xạ đầy đủ tới ít nhất một viewpoint.
- [x] Đã chọn đủ 07 viewpoint áp dụng được từ Registry chuẩn theo bản chất nghiệp vụ.
- [x] Toàn bộ tên viewpoint sử dụng đúng tên chuẩn trong Registry.
- [x] Phạm vi In-scope và Out-of-scope phân định tường minh, không trùng lặp (đã qua kiểm duyệt ma trận Zero-Overlap).
- [x] Không sinh test idea hay test case chi tiết (đảm bảo đúng phạm vi trách nhiệm của Skill 03).

---

## FIX
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|
| - | Không phát hiện | Đã đối soát Zero-Overlap và Registry chuẩn | Không có bản sửa |

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| 1 | Viewpoint Usability | Xác nhận tiêu chuẩn hỗ trợ trình duyệt và độ phân giải mobile chính thức | PO / Lead Tech |
