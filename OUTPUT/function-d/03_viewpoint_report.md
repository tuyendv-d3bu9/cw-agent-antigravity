# BÁO CÁO PHÂN TÍCH VIEWPOINT KIỂM THỬ — FUNCTION D: ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER)
Owner: qa-analyst/03-viewpoint-selection · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, 02_missing_rule_report.md · Verdict: PASS

---

## 1. CHIẾN LƯỢC ĐỘ PHỦ THEO RỦI RO

### 1.1 Ma trận Ưu tiên Rủi ro (Likelihood × Impact)
| # | Risk Area | Likelihood | Impact | Mức ưu tiên | Nguồn (Rule/Missing Rule) |
|:---|:---|:---:|:---:|:---:|:---|
| **RK-01** | Tính toán sai chiết khấu (vượt Max Cap, giảm âm tiền, lệch làm tròn) | TB | Cao | **Ưu tiên 1** | BR-01, BR-10, BR-11, BR-20 |
| **RK-02** | Lạm dụng voucher (vượt quá 1 lần/user, bypass giá trị đơn tối thiểu) | Cao | Cao | **Ưu tiên 1** | BR-02, BR-08, BR-13 |
| **RK-03** | Mã hết hạn / bị hủy nhưng vẫn hoàn tất đặt đơn hàng | TB | Cao | **Ưu tiên 2** | BR-03, BR-21, BR-22 |
| **RK-04** | Xung đột trừ tiền kết hợp Số dư Ví ShopGo và Voucher | TB | Cao | **Ưu tiên 2** | BR-23 |
| **RK-05** | Tấn công Brute-force đoán mã giảm giá nội bộ / VIP | Cao | TB | **Ưu tiên 2** | BR-19, BR-25 |
| **RK-06** | Không hoàn lại lượt dùng mã khi đơn hàng bị hủy | TB | TB | **Ưu tiên 3** | BR-14 |
| **RK-07** | Mất dữ liệu / treo giao diện khi session timeout lúc thanh toán | Thấp | TB | **Ưu tiên 3** | BR-07, BR-15, BR-16 |

### 1.2 Xếp hạng ưu tiên & loại test cần làm
1. **Rủi ro Tính toán Tài chính (RK-01, RK-04)**: Kỹ thuật kiểm thử BVA (Boundary Value Analysis) cho trần Max Cap, sàn 0đ, làm tròn số lẻ tiền; State Transition / Calculation Test cho thứ tự trừ voucher trước ví sau.
2. **Rủi ro Ràng buộc Nghiệp vụ & Toàn vẹn (RK-02, RK-03)**: Equivalence Partitioning kết hợp Decision Table cho điều kiện áp mã (min order, 1 lần/user, giỏ hàng biến động, re-validate khi đặt hàng).
3. **Rủi ro An toàn & Bảo mật (RK-05, RK-07)**: Security Test cho Rate Limit (5 lần/5 phút), chặn ký tự đặc biệt/script injection, realtime auth check khi user bị khóa.
4. **Rủi ro Trải nghiệm & Ngoại lệ (RK-06, RK-07)**: Usability Test & Negative Test cho trim() khoảng trắng, case-insensitive, session timeout modal, thông báo lỗi chuẩn.

### 1.3 Liên kết Risk → Viewpoint
- **RK-01** $\rightarrow$ Covered by **Viewpoint 03 (Boundary)** & **Viewpoint 01 (Happy Path)**
- **RK-02** $\rightarrow$ Covered by **Viewpoint 02 (Negative)** & **Viewpoint 06 (Integration)**
- **RK-03** $\rightarrow$ Covered by **Viewpoint 06 (Integration)** & **Viewpoint 02 (Negative)**
- **RK-04** $\rightarrow$ Covered by **Viewpoint 06 (Integration)** & **Viewpoint 01 (Happy Path)**
- **RK-05** $\rightarrow$ Covered by **Viewpoint 04 (Security)** & **Viewpoint 03 (Boundary)**
- **RK-06** $\rightarrow$ Covered by **Viewpoint 06 (Integration)**
- **RK-07** $\rightarrow$ Covered by **Viewpoint 05 (UX/Usability)** & **Viewpoint 04 (Security)**

---

## 2. TỔNG QUAN LỰA CHỌN VIEWPOINT
| STT | Tên Viewpoint | Mức rủi ro | Nguồn | Lý do lựa chọn |
|:---|:---|:---:|:---|:---|
| **VP-01** | Happy Path | High | Registry | Luồng nghiệp vụ cốt lõi: áp voucher thành công, tính đúng tiền mới, tạo đơn thành công. |
| **VP-02** | Negative | High | Registry | Bắt buộc cho form thanh toán: bắt đúng các mã lỗi, từ chối mã không đủ điều kiện. |
| **VP-03** | Boundary | Critical | Registry | Kiểm thử các mốc giới hạn: ngưỡng min order, trần Max Cap, sàn 0đ, độ dài mã 3-20 ký tự. |
| **VP-04** | Security | High | Registry | Bảo vệ tính toàn vẹn: Rate Limit chống đoán mã, chặn script, kiểm tra user Active. |
| **VP-05** | UX/Usability | Med | Registry | Trải nghiệm thanh toán mượt mà: tự động trim(), không phân biệt hoa thường, popup login giữ giỏ. |
| **VP-06** | Integration | High | Registry | Tác động chéo: kết hợp số dư Ví ShopGo, re-validate khi đặt hàng, biến động giá server, hoàn mã khi hủy đơn. |

---

## 3. ĐẶC TẢ CHI TIẾT CÁC VIEWPOINT

### Viewpoint 01: Happy Path
- **Tên Viewpoint**: Happy Path
- **Mục tiêu kiểm thử**: Xác nhận luồng áp dụng voucher và tính toán giảm giá thành công cho cả 2 loại mã (% và cố định) khi thỏa mãn mọi điều kiện hợp lệ.
- **Phạm vi bao phủ (In-scope)**:
  - Áp dụng thành công mã giảm cố định (VNĐ) khi đơn hàng $\ge$ giá trị tối thiểu (BR-01, BR-02).
  - Áp dụng thành công mã giảm theo % chưa vượt Max Cap (BR-01, BR-11).
  - Áp dụng thành công mã giảm theo % chạm đúng mức trần Max Cap (BR-11).
  - Áp đè thành công mã mới thay thế mã cũ, tính lại tiền chuẩn xác (BR-09).
  - Hiển thị đúng số tiền giảm và tổng tiền thanh toán mới sau giảm (BR-04, BR-06).
  - Đặt hàng thành công sau khi áp voucher hợp lệ (BR-22).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Các trường hợp vi phạm điều kiện áp mã (thuộc VP-02 Negative).
  - Giá trị tại các mốc biên sát sườn (thuộc VP-03 Boundary).
- **Rủi ro nếu bỏ qua**: Luồng mua sắm chính bị gãy, khách hàng không được hưởng chiết khấu hợp lệ.
- **Ước lượng định tính Test Idea**: Trung bình (Tập trung đủ các phân loại mã và luồng đặt đơn chính).

---

### Viewpoint 02: Negative
- **Tên Viewpoint**: Negative
- **Mục tiêu kiểm thử**: Xác minh hệ thống từ chối áp dụng và hiển thị đúng thông báo lỗi cho toàn bộ các trường hợp vi phạm quy tắc nghiệp vụ.
- **Phạm vi bao phủ (In-scope)**:
  - Nhập mã không tồn tại trong hệ thống (AF-01, BR-05, BR-26).
  - Nhập mã đã qua ngày hết hạn (AF-02, BR-03, BR-05, BR-26).
  - Giá trị đơn hàng chưa đạt mức tối thiểu (AF-03, BR-02, BR-26).
  - Nhập lại mã mà tài khoản đã từng sử dụng trước đó (AF-06, BR-08, BR-26).
  - Để trống ô mã voucher rồi bấm Áp dụng (BR-26).
  - Khách vãng lai chưa đăng nhập bị chặn áp mã và chuyển hướng đăng nhập (BR-07).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Ký tự đặc biệt hoặc lỗi định dạng độ dài (thuộc VP-03 Boundary).
  - Tấn công nhập sai liên tục bị Rate Limit (thuộc VP-04 Security).
- **Rủi ro nếu bỏ qua**: Lọt voucher không hợp lệ, gây thất thoát tài chính hoặc khách hàng không hiểu lý do lỗi.
- **Ước lượng định tính Test Idea**: Cao (Nhiều trường hợp từ chối nghiệp vụ cần phân định rõ).

---

### Viewpoint 03: Boundary
- **Tên Viewpoint**: Boundary
- **Mục tiêu kiểm thử**: Kiểm soát triệt để các mốc giới hạn số học và chuỗi ký tự theo chuẩn QA_STANDARD §6.
- **Phạm vi bao phủ (In-scope)**:
  - Chuỗi biên giá trị đơn hàng min: `min-1`, `min`, `min+1` (BR-02).
  - Chuỗi biên mức trần Max Cap của mã %: mức giảm tính ra bằng `MaxCap-1`, đúng `MaxCap`, và `MaxCap+1` (BR-11).
  - Chuỗi biên mức sàn 0đ của mã cố định: giảm cố định = tổng đơn (còn 0đ), giảm cố định > tổng đơn (sàn 0đ, không âm) (BR-10).
  - Quy tắc làm tròn số lẻ tiền giảm %: làm tròn xuống hàng đơn vị đồng gần nhất (BR-20).
  - Chuỗi biên độ dài mã: rỗng, 1 ký tự, 2 ký tự (dưới hạn 3), 3 ký tự (min hợp lệ), 20 ký tự (max hợp lệ), 21 ký tự (quá hạn 20) (BR-19).
  - Biên thời gian hiệu lực: 23:59:59 của ngày hết hạn (hợp lệ) vs 00:00:00 của ngày hôm sau (hết hạn) theo GMT+7 (BR-21).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm thử lỗi logic không liên quan đến biên (thuộc VP-02 Negative).
- **Rủi ro nếu bỏ qua**: Tràn số, tiền âm, thất thoát ngân sách do tính toán sai ở điểm biên.
- **Ước lượng định tính Test Idea**: Rất cao (Bao phủ đủ chuỗi 7 điểm chuẩn và biên chuỗi).

---

### Viewpoint 04: Security
- **Tên Viewpoint**: Security
- **Mục tiêu kiểm thử**: Ngăn chặn hành vi gian lận, tấn công vét cạn mã và bypass cơ chế xác thực.
- **Phạm vi bao phủ (In-scope)**:
  - Cơ chế Rate Limit: Nhập sai 5 lần liên tiếp trong 5 phút $\rightarrow$ Khóa ô nhập mã trong 15 phút (BR-25).
  - Thử lại ở lần thứ 6 trong vòng 5 phút bị chặn ngay lập tức (BR-25).
  - Hết 15 phút khóa $\rightarrow$ Hệ thống mở lại ô nhập bình thường (BR-25).
  - Chặn ký tự đặc biệt, dấu câu, thẻ HTML, Script injection vào ô nhập mã (BR-19).
  - Kiểm tra realtime tài khoản khách hàng bị khóa/vô hiệu hóa $\rightarrow$ Chặn áp voucher và vô hiệu hóa đặt hàng (BR-16).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tấn công DDoS hạ tầng, SQL injection sâu vào DB (thuộc kiểm thử an ninh cấp hạ tầng ngoài scope).
- **Rủi ro nếu bỏ qua**: Lộ mã nội bộ, bị hack khuyến mại, trục lợi tài khoản bị khóa.
- **Ước lượng định tính Test Idea**: Trung bình (Tập trung bảo mật ứng dụng mức tính năng).

---

### Viewpoint 05: UX/Usability
- **Tên Viewpoint**: UX/Usability
- **Mục tiêu kiểm thử**: Đảm bảo giao diện thông minh, thuận tiện cho người dùng và hiển thị thông tin rõ ràng.
- **Phạm vi bao phủ (In-scope)**:
  - Tự động cắt bỏ khoảng trắng ở đầu và cuối chuỗi nhập (`trim()`) mà không báo lỗi giả (BR-17).
  - Khoảng trắng ở giữa chuỗi bị coi là ký tự không hợp lệ và báo lỗi rõ ràng (BR-17).
  - Không phân biệt chữ in hoa / chữ thường (`Case-insensitive`), nhập chữ thường tự chuyển in hoa (BR-18).
  - Khi session timeout tại trang thanh toán: Mở modal login tại chỗ, giữ nguyên giỏ hàng và voucher sau đăng nhập (BR-15).
  - Hiển thị thông báo lỗi rõ ràng, trực quan ngay dưới ô nhập mã (BR-05, BR-26).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Thiết kế đồ họa UI / Màu sắc thẩm mỹ (thuộc UI Review).
- **Rủi ro nếu bỏ qua**: Tỷ lệ hủy đơn cao, khách hàng bức xúc vì trải nghiệm nhập mã cứng nhắc.
- **Ước lượng định tính Test Idea**: Trung bình.

---

### Viewpoint 06: Integration
- **Tên Viewpoint**: Integration
- **Mục tiêu kiểm thử**: Đảm bảo tính toàn vẹn dữ liệu khi tương tác chéo giữa Voucher, Giỏ hàng, Ví ShopGo và Đơn hàng.
- **Phạm vi bao phủ (In-scope)**:
  - Tương tác với Ví ShopGo: Trừ giá trị giảm của Voucher trước, số tiền còn lại mới trừ vào Ví ShopGo (BR-23).
  - Sửa giỏ hàng sau khi áp mã (xóa món/giảm số lượng) làm tổng đơn < min order $\rightarrow$ Cảnh báo, tự động gỡ voucher (BR-13).
  - Biến động giá hoặc hết tồn kho từ server khiến đơn < min order $\rightarrow$ Cảnh báo, tự động hủy voucher (BR-24).
  - Re-validate voucher tại thời điểm bấm "Đặt hàng": Nếu voucher bị hết hạn/hết lượt trong lúc chờ $\rightarrow$ Chặn tạo đơn, thông báo (BR-22).
  - Tự động hoàn lại lượt sử dụng voucher cho tài khoản khách hàng khi đơn hàng bị hủy (BR-14).
  - Chiết khấu voucher chỉ trừ vào tiền hàng, không làm thay đổi hay trừ vào phí vận chuyển (BR-12).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Chi tiết luồng thanh toán cổng thẻ bên thứ 3 (thuộc Function E).
- **Rủi ro nếu bỏ qua**: Lệch số dư ví của khách hàng, tạo đơn hàng sai giá trị, không hoàn trả quyền lợi khi hủy đơn.
- **Ước lượng định tính Test Idea**: Cao (Nhiều trạng thái tương tác chéo giữa các module).

---

## 4. MA TRẬN ZERO-OVERLAP
| Viewpoint A | Viewpoint B | Điểm nguy cơ giao thoa | Ranh giới phân định |
|:---|:---|:---|:---|
| **VP-01 (Happy Path)** | **VP-03 (Boundary)** | Mã áp thành công tại các mốc đơn hàng | VP-01 chỉ test giá trị danh định thông thường (vd: đơn 500k, min 200k). VP-03 phụ trách riêng các mốc sát ranh giới: đúng `min`, `min-1`, `min+1`, chạm `MaxCap`. |
| **VP-02 (Negative)** | **VP-03 (Boundary)** | Nhập mã sai độ dài / mã trống | VP-02 test ca mã không tồn tại trong DB, mã hết hạn. VP-03 phụ trách riêng độ dài biên (2 ký tự, 21 ký tự, rỗng). |
| **VP-02 (Negative)** | **VP-04 (Security)** | Nhập sai mã nhiều lần | VP-02 test hành vi của lần nhập sai đơn lẻ (báo mã không tồn tại). VP-04 phụ trách riêng hành vi kích hoạt Rate Limit khi sai liên tiếp 5 lần. |
| **VP-03 (Boundary)** | **VP-05 (UX/Usability)**| Khoảng trắng thừa và độ dài chuỗi | VP-05 phụ trách việc tự động `trim()` đầu/cuối và `case-insensitive`. VP-03 phụ trách kiểm thử độ dài chuỗi sau khi đã trim. |
| **VP-01 (Happy Path)** | **VP-06 (Integration)**| Thanh toán đơn hàng có áp mã | VP-01 test luồng thanh toán cơ bản. VP-06 phụ trách riêng tương tác thứ tự trừ ví ShopGo, hủy đơn hoàn mã, và re-check voucher khi giỏ hàng đổi giá. |

---

## 5. XÁC NHẬN BÀN GIAO
- [x] Mọi Risk Area ưu tiên cao (RK-01 $\to$ RK-07) đã được ánh xạ tới ít nhất một viewpoint.
- [x] Chọn đủ 6 viewpoint áp dụng được theo rủi ro thực tế của tính năng.
- [x] Tên viewpoint tuân thủ 100% tên chuẩn trong Registry.
- [x] Ranh giới In/Out scope phân định rõ ràng, không trùng lặp (Zero-Overlap).
- [x] Không sinh test idea hay test case chi tiết ở bước này.
