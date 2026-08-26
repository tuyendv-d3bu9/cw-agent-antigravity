# BÁO CÁO PHÂN TÍCH VIEWPOINT KIỂM THỬ — ÁP DỤNG MÃ GIẢM GIÁ (VOUCHER) · function-d
Owner: agents/qa-analyst/skills/03-viewpoint-selection.md · Nguồn: OUTPUT/function-d/01_requirement_risk_summary.md, OUTPUT/function-d/02_missing_rule_report.md · Verdict: PASS

---

## 1. CHIẾN LƯỢC ĐỘ PHỦ THEO RỦI RO

### 1.1 Ma trận Ưu tiên Rủi ro (Likelihood × Impact)

| # | Risk Area | Likelihood | Impact | Mức ưu tiên | Nguồn (Rule / Missing Rule) |
|:---|:---|:---:|:---:|:---:|:---|
| **RK-01** | **Bypass điều kiện đơn tối thiểu khi sửa đổi giỏ hàng**: Khách thêm hàng đủ min order để áp mã, sau đó xóa bớt hàng nhưng mã không tự động hủy. | Cao | Cao | **Ưu tiên 1 (Critical)** | `BR-02`, `BR-13`, `AF-05` |
| **RK-02** | **Sai lệch tính toán tiền chiết khấu & trần giảm tối đa (Max Cap)**: Công thức tính % sai hoặc không chặn Max Cap, tính ra số tiền âm khi giảm cố định > tổng đơn. | Trung bình | Cao | **Ưu tiên 1 (Critical)** | `BR-01`, `BR-10`, `BR-11`, `MR-06` |
| **RK-03** | **Lạm dụng tái sử dụng voucher & áp dồn nhiều mã**: Khách dùng lại mã đã sử dụng (vượt mốc 1 lần/user) hoặc cộng dồn nhiều voucher trong 1 đơn. | Trung bình | Cao | **Ưu tiên 2 (High)** | `BR-08`, `BR-09`, `AF-04`, `AF-06` |
| **RK-04** | **Áp dụng mã không hợp lệ, hết hạn hoặc sai mốc thời gian**: Mã hết hạn vẫn áp dụng được do sai lệch múi giờ hoặc không re-validate khi bấm Đặt hàng. | Trung bình | Cao | **Ưu tiên 2 (High)** | `BR-03`, `BR-05`, `AF-02`, `MR-07`, `MR-08` |
| **RK-05** | **Tấn công Brute-force quét mã & XSS/SQLi qua ô nhập**: Quét thử mã nội bộ liên tục không bị rate limit, nhập ký tự đặc biệt/script gây lỗi. | Trung bình | Trung bình | **Ưu tiên 3 (Medium)** | `BR-05`, `MR-05`, `MR-11` |
| **RK-06** | **Xung đột tương tác với Ví ShopGo & sản phẩm đổi giá/hết hàng**: Thứ tự trừ tiền giữa voucher và Ví ShopGo bị sai, hoặc lỗi khi sản phẩm đổi giá. | Thấp | Trung bình | **Ưu tiên 3 (Medium)** | `BR-12`, `MR-09`, `MR-10` |
| **RK-07** | **Trải nghiệm nhập liệu & thông điệp lỗi khó hiểu**: Nhập mã có khoảng trắng thừa bị báo lỗi, thông điệp lỗi chung chung không rõ nguyên nhân. | Cao | Thấp | **Ưu tiên 4 (Low)** | `BR-04`, `BR-05`, `MR-03`, `MR-04`, `MR-12` |

### 1.2 Xếp hạng ưu tiên & loại test cần làm
1. **Rủi ro Ưu tiên 1 (Critical - RK-01, RK-02)**:
   - *Loại test*: **State Transition Testing** (cho luồng thay đổi giỏ hàng và chuyển trạng thái voucher), **Boundary Value Analysis (BVA)** (cho các mốc đơn tối thiểu `min-1`, `min`, `min+1`, mức trần Max Cap và số tiền giảm về sàn 0 VNĐ).
2. **Rủi ro Ưu tiên 2 (High - RK-03, RK-04)**:
   - *Loại test*: **Decision Table Testing** (tổ hợp trạng thái mã: còn hạn/hết hạn × đã dùng/chưa dùng × áp đè mã), **Negative Testing** (thử nghiệm tài khoản đã dùng mã).
3. **Rủi ro Ưu tiên 3 (Medium - RK-05, RK-06)**:
   - *Loại test*: **Security Testing** (kiểm tra Rate Limit, Input Validation với payload XSS/SQLi), **Integration Testing** (kiểm tra luồng trừ tiền kết hợp giữa Voucher và số dư Ví ShopGo).
4. **Rủi ro Ưu tiên 4 (Low - RK-07)**:
   - *Loại test*: **UX/Usability Testing** (kiểm tra auto-trim khoảng trắng, case-insensitive, hiển thị dòng chiết khấu và độ rõ ràng của thông điệp lỗi).

### 1.3 Liên kết Risk → Viewpoint
- **RK-01, RK-03** → Phủ bởi Viewpoint: **Happy Path**, **Negative**, **Boundary**
- **RK-02** → Phủ bởi Viewpoint: **Boundary**, **Happy Path**
- **RK-04** → Phủ bởi Viewpoint: **Negative**, **Boundary**
- **RK-05** → Phủ bởi Viewpoint: **Security**, **Negative**
- **RK-06** → Phủ bởi Viewpoint: **Integration**, **Boundary**
- **RK-07** → Phủ bởi Viewpoint: **UX/Usability**, **Negative**

---

## 2. TỔNG QUAN LỰA CHỌN VIEWPOINT

Toàn bộ **8/8 Viewpoint** từ Registry chuẩn được lựa chọn để đảm bảo bao phủ toàn diện tính năng:

| STT | Tên Viewpoint | Mức rủi ro | Nguồn | Lý do lựa chọn |
|:---|:---|:---:|:---|:---|
| 1 | **Happy Path** | High | Registry | Kiểm chứng luồng áp mã thành công cơ bản (% có trần và tiền cố định) trên cả Desktop và Mobile Web. |
| 2 | **Negative** | High | Registry | Kiểm chứng đầy đủ các ca lỗi nhập liệu: mã sai, hết hạn, chưa đủ đơn tối thiểu, đã dùng rồi, áp đè mã. |
| 3 | **Boundary** | Critical | Registry | Kiểm tra các giá trị biên của đơn hàng tối thiểu, mức trần Max Cap, giảm tiền về 0 VNĐ, độ dài ký tự ô nhập. |
| 4 | **Security** | Medium | Registry | Kiểm tra Rate Limit chống brute-force đoán mã, kiểm tra phân quyền tài khoản (1 lần/user) và chống tiêm script. |
| 5 | **UX/Usability** | Low | Registry | Kiểm tra khả năng tự động trim khoảng trắng, không phân biệt hoa/thường, độ rõ ràng của thông báo lỗi và tổng tiền. |
| 6 | **Performance** | Low | Registry | Kiểm tra thời gian phản hồi khi bấm nút "Áp dụng" mã (< 1s) trong điều kiện mạng bình thường. |
| 7 | **Accessibility** | Low | Registry | Đảm bảo ô nhập mã và nút Áp dụng hỗ trợ phím Enter, contrast màu thông báo lỗi và tương thích trình đọc màn hình. |
| 8 | **Integration** | Medium | Registry | Kiểm tra tính tương thích giữa giảm giá đơn hàng với phí vận chuyển và số dư thanh toán bằng Ví ShopGo. |

---

## 3. ĐẶC TẢ CHI TIẾT CÁC VIEWPOINT

### Viewpoint 01: Happy Path
- **Tên Viewpoint**: Happy Path
- **Mục tiêu kiểm thử**: Xác nhận tính năng áp dụng mã giảm giá hoạt động chính xác theo luồng chuẩn cho cả 2 loại mã (% có Max Cap và số tiền cố định) khi thỏa mãn mọi điều kiện.
- **Phạm vi bao phủ (In-scope)**:
  - Áp dụng thành công mã giảm theo số tiền cố định (VNĐ) khi đơn hàng đạt giá trị tối thiểu (`BR-01`, `BR-02`).
  - Áp dụng thành công mã giảm theo tỷ lệ % không chạm trần và chạm mức trần Max Cap (`BR-11`).
  - Hiển thị đầy đủ số tiền được giảm và tổng tiền thanh toán mới sau giảm (`BR-04`).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Các trường hợp mã lỗi, hết hạn, không đủ điều kiện (thuộc Viewpoint *Negative*).
  - Các mốc giá trị sát biên (thuộc Viewpoint *Boundary*).
- **Rủi ro nếu bỏ qua**: Luồng mua hàng cốt lõi bị gián đoạn, khách hàng không thể sử dụng mã khuyến mãi hợp lệ.
- **Ước lượng định tính Test Idea**: Trung bình (Tập trung vào các kịch bản thành công tiêu chuẩn cho từng loại mã).

### Viewpoint 02: Negative
- **Tên Viewpoint**: Negative
- **Mục tiêu kiểm thử**: Đảm bảo hệ thống phát hiện, ngăn chặn và xử lý chính xác mọi trường hợp nhập mã không hợp lệ, vi phạm điều kiện hoặc vi phạm quy tắc nghiệp vụ.
- **Phạm vi bao phủ (In-scope)**:
  - Nhập mã không tồn tại, mã sai định dạng, mã đã hết hạn (`AF-01`, `AF-02`).
  - Nhập mã khi đơn hàng chưa đạt giá trị tối thiểu (`AF-03`).
  - Nhập mã đã từng sử dụng thành công trước đó của tài khoản (`AF-06`, `BR-08`).
  - Thao tác áp đè mã mới lên mã cũ đang có (`AF-04`, `BR-09`).
  - Thay đổi giỏ hàng làm tổng tiền dưới mức tối thiểu → hệ thống cảnh báo và hủy mã (`AF-05`, `BR-13`).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra giá trị biên chính xác từng đồng (thuộc Viewpoint *Boundary*).
  - Tấn công thử mã hàng loạt (thuộc Viewpoint *Security*).
- **Rủi ro nếu bỏ qua**: Khách hàng lách luật dùng mã sai quy định, gây thất thoát tài chính hoặc phát sinh lỗi hệ thống không kiểm soát.
- **Ước lượng định tính Test Idea**: Cao (Nhiều nhánh rẽ và kịch bản vi phạm điều kiện).

### Viewpoint 03: Boundary
- **Tên Viewpoint**: Boundary
- **Mục tiêu kiểm thử**: Kiểm tra hành vi tính toán và xử lý của hệ thống tại các giá trị biên của đơn giá, mức trần chiết khấu và giới hạn ký tự.
- **Phạm vi bao phủ (In-scope)**:
  - Chuỗi biên giá trị đơn hàng tối thiểu: `Min - 1 VNĐ`, `Đúng Min VNĐ`, `Min + 1 VNĐ` (`BR-02`).
  - Chuỗi biên mức trần chiết khấu Max Cap của mã %: `Chiết khấu < Max Cap`, `Chiết khấu = Max Cap`, `Chiết khấu > Max Cap` (`BR-11`).
  - Biên số tiền giảm cố định: `Tiền giảm < Tổng đơn`, `Tiền giảm = Tổng đơn (về 0đ)`, `Tiền giảm > Tổng đơn (sàn 0đ)` (`BR-10`).
  - Biên độ dài ký tự ô nhập mã: `Rỗng (0 ký tự)`, `1 ký tự`, `Độ dài max (30 ký tự)`, `Quá max (31+ ký tự)` (`MR-05`).
  - Biên thời gian hiệu lực: `Thời điểm 23:59:59 ngày hết hạn` và `00:00:00 ngày kế tiếp` (`MR-07`).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Kiểm tra giao diện hiển thị chung chung (thuộc Viewpoint *UX/Usability*).
- **Rủi ro nếu bỏ qua**: Lỗi tính toán sai lệch tiền (Off-by-one error), phát sinh tiền thanh toán âm hoặc áp dụng sai mã tại thời điểm chuyển giao ngày.
- **Ước lượng định tính Test Idea**: Cao (Đòi hỏi bao phủ đầy đủ chuỗi giá trị biên chuẩn).

### Viewpoint 04: Security
- **Tên Viewpoint**: Security
- **Mục tiêu kiểm thử**: Đảm bảo an toàn bảo mật cho hệ thống khuyến mãi, chống gian lận lạm dụng voucher và tấn công tiêm mã độc.
- **Phạm vi bao phủ (In-scope)**:
  - Kiểm tra giới hạn tần suất nhập sai mã liên tiếp (Rate Limiting / Chống Brute-force dò mã) (`MR-11`).
  - Kiểm tra cơ chế ràng buộc tài khoản (1 user chỉ dùng 1 lần) khi đăng nhập trên nhiều trình duyệt/thiết bị đồng thời (`BR-08`).
  - Kiểm tra Input Sanitization: Nhập payload HTML/JS (XSS) hoặc SQL Injection vào ô "Mã giảm giá" (`MR-05`).
  - Kiểm tra trạng thái tài khoản bị khóa (Banned/Suspended) cố tình áp mã (`MR-02`).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tấn công từ chối dịch vụ phân tán DDoS (thuộc Infrastructure testing).
- **Rủi ro nếu bỏ qua**: Lộ mã khuyến mãi nội bộ, cạn kiệt ngân sách khuyến mãi do tài khoản ảo hoặc mã độc thực thi trên trình duyệt.
- **Ước lượng định tính Test Idea**: Trung bình.

### Viewpoint 05: UX/Usability
- **Tên Viewpoint**: UX/Usability
- **Mục tiêu kiểm thử**: Đảm bảo trải nghiệm người dùng mượt mà, tiện lợi, thông báo rõ ràng và thân thiện trên cả Desktop và Mobile Web.
- **Phạm vi bao phủ (In-scope)**:
  - Tự động cắt bỏ khoảng trắng thừa đầu/cuối chuỗi (Auto-trim whitespace) khi copy-paste (`MR-03`).
  - Kiểm tra không phân biệt chữ in hoa / in thường (Case-insensitivity) khi nhập mã (`MR-04`).
  - Tính rõ ràng, dễ hiểu của các thông báo lỗi phân biệt từng trường hợp (`MR-12`).
  - Tính trực quan của dòng hiển thị số tiền được giảm và tổng tiền mới (`BR-04`).
  - Trải nghiệm tương thích giao diện Responsive trên màn hình Mobile Web (bàn phím ảo không che nút Áp dụng).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Tính đúng đắn của công thức tính tiền (thuộc Viewpoint *Boundary* / *Happy Path*).
- **Rủi ro nếu bỏ qua**: Người dùng gặp khó khăn khi thao tác, hiểu nhầm thông báo lỗi dẫn đến bỏ dở đơn hàng.
- **Ước lượng định tính Test Idea**: Trung bình.

### Viewpoint 06: Performance
- **Tên Viewpoint**: Performance
- **Mục tiêu kiểm thử**: Đảm bảo thời gian phản hồi kiểm tra và áp dụng mã giảm giá trên giao diện người dùng diễn ra nhanh chóng, không bị đơ giật.
- **Phạm vi bao phủ (In-scope)**:
  - Thời gian xử lý từ khi nhấn "Áp dụng" đến khi hiển thị kết quả/tiền mới (< 1 giây ở điều kiện mạng bình thường).
  - Trạng thái Loading Indicator (vòng xoay tải / disable nút Áp dụng) trong lúc hệ thống đang validate mã để tránh user click đúp nhiều lần.
- **Phạm vi loại trừ (Out-of-scope)**:
  - Stress testing chịu tải hàng chục nghìn người cùng lúc (thuộc Out of Scope dự án).
- **Rủi ro nếu bỏ qua**: Người dùng click liên tục nhiều lần gây gửi request trùng lặp, tạo cảm giác hệ thống chậm chạp.
- **Ước lượng định tính Test Idea**: Thấp.

### Viewpoint 07: Accessibility
- **Tên Viewpoint**: Accessibility
- **Mục tiêu kiểm thử**: Đảm bảo mọi đối tượng người dùng có thể tiếp cận và tương tác thuận tiện với tính năng nhập mã giảm giá.
- **Phạm vi bao phủ (In-scope)**:
  - Hỗ trợ phím `Enter` khi con trỏ đang ở ô nhập mã để kích hoạt hành động "Áp dụng" thay vì bắt buộc dùng chuột/chạm tay.
  - Độ tương phản màu sắc của thông báo lỗi (đỏ/cam) và thông báo thành công (xanh lá) đáp ứng tiêu chuẩn dễ đọc.
  - Các thẻ nhãn (`<label>`, `aria-label`, `placeholder`) đầy đủ cho trình đọc màn hình (Screen Reader).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Các tiêu chuẩn WCAG cấp độ AAA chuyên sâu toàn trang.
- **Rủi ro nếu bỏ qua**: Người dùng khuyết tật hoặc người dùng chỉ sử dụng bàn phím không thể áp dụng mã giảm giá.
- **Ước lượng định tính Test Idea**: Thấp.

### Viewpoint 08: Integration
- **Tên Viewpoint**: Integration
- **Mục tiêu kiểm thử**: Đảm bảo tính nhất quán và toàn vẹn dữ liệu khi chức năng mã giảm giá tương tác liên thông với các module khác trong luồng Checkout.
- **Phạm vi bao phủ (In-scope)**:
  - Xác nhận mã giảm giá chỉ trừ vào tiền sản phẩm, không làm ảnh hưởng đến cách tính Phí vận chuyển (`BR-12`).
  - Xác nhận thứ tự tính toán khi kết hợp Voucher và thanh toán bằng số dư Ví ShopGo (`MR-09`).
  - Kiểm tra việc tự động hoàn lại lượt dùng mã khi đơn hàng bị hủy từ module Quản lý đơn hàng (`BR-14`, `GAP-06`).
  - Kiểm tra re-validate mã lần cuối tại thời điểm bấm nút "Đặt hàng" (`MR-08`).
- **Phạm vi loại trừ (Out-of-scope)**:
  - Logic nạp tiền vào ví hoặc kết nối cổng thanh toán thẻ ngân hàng bên thứ ba (thuộc Function E, F).
- **Rủi ro nếu bỏ qua**: Sai lệch hạch toán tài chính giữa tiền hàng, phí ship và số dư ví điện tử của khách hàng.
- **Ước lượng định tính Test Idea**: Trung bình.

---

## 4. MA TRẬN ZERO-OVERLAP

| Viewpoint A | Viewpoint B | Điểm nguy cơ giao thoa | Ranh giới phân định |
|:---|:---|:---|:---|
| **Happy Path** | **Boundary** | Áp mã thành công với giá trị đơn hàng cụ thể | **Happy Path** kiểm tra các giá trị thông thường ở giữa khoảng hợp lệ. **Boundary** chuyên biệt kiểm tra tại đúng các điểm mút (`min-1`, `min`, `min+1`, mức Max Cap). |
| **Negative** | **Boundary** | Nhập mã bị lỗi do đơn chưa đủ min order | **Negative** kiểm tra luồng lỗi tổng quát và hiển thị thông báo. **Boundary** kiểm tra chính xác giá trị `min - 1 VNĐ`. |
| **Negative** | **Security** | Nhập sai mã nhiều lần | **Negative** kiểm tra thông báo lỗi khi nhập sai mã đơn lẻ. **Security** kiểm tra cơ chế Rate Limit khi nhập sai liên tục ≥5 lần. |
| **Negative** | **UX/Usability** | Nhập mã có khoảng trắng thừa hoặc sai chữ hoa/thường | **Negative** kiểm tra trường hợp nhập sai ký tự nội dung mã. **UX/Usability** kiểm tra tính năng auto-trim và case-insensitivity tự sửa lỗi cho user. |
| **Integration** | **Happy Path** | Tính tổng tiền đơn hàng sau khi áp mã | **Happy Path** kiểm tra trừ tiền đơn hàng độc lập. **Integration** kiểm tra tác động liên hoàn tới Phí vận chuyển, Ví ShopGo và quy trình hủy đơn hoàn mã. |

---

## 5. XÁC NHẬN BÀN GIAO
- [x] Mọi Risk Area ưu tiên cao (RK-01 → RK-07) đã được ánh xạ tới ít nhất một viewpoint.
- [x] Chọn đủ mọi viewpoint áp dụng được theo ma trận rủi ro (8/8 Viewpoint chuẩn).
- [x] Tên viewpoint sử dụng đúng 100% theo Registry cố định.
- [x] Ranh giới In/Out scope được phân định rõ ràng, không trùng lặp (Zero-Overlap).
- [x] Không sinh test idea hay test case chi tiết (đảm bảo đúng phạm vi trách nhiệm của skill 03).
