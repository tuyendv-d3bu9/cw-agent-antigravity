# BÁO CÁO COVERAGE REVIEW & TEST SUITE GAP ANALYSIS

> **Feature**: Áp dụng Mã Giảm Giá (Voucher) - Function D (ShopGo E-Commerce)  
> **Người thực hiện**: Senior QA Coverage Reviewer (QA Lead ảo)  
> **Bước trong quy trình**: Step 06 (Coverage Review & Test Suite Gap Analysis)  
> **Dữ liệu đầu vào đối soát**: 
> - [01_Requirement_Summary_Report.md](OUTPUT/01_Requirement_Summary_Report.md)
> - [03_QA_Viewpoint_Analyst_Report.md](OUTPUT/03_QA_Viewpoint_Analyst_Report.md)
> - [05_QA_Test_Case_Specification.md](OUTPUT/05_QA_Test_Case_Specification.md)

---

## 1. Tổng quan Đánh giá 3 Góc nhìn (Coverage Framework Evaluation)

- **Góc nhìn 1 (Requirement ↔ Test Suite)**: 
  - Toàn bộ 17/17 Business Rules (từ `BR-01` đến `BR-17`) từ Step 01 đã được ánh xạ với bộ 47 Test Cases tại Step 05. 
  - Phần lớn các luồng Happy Path, Alternate Flows (AF-01 đến AF-05) và các quy tắc nghiệp vụ mở rộng đều có test case bao phủ.
  - Tuy nhiên, qua đối soát sâu chi tiết điều kiện nhánh, phát hiện một số rủi ro kiểm thử tiềm ẩn (test gaps) đối với các trường hợp: xác minh trạng thái mã sau hoàn trả hàng (BR-15), xử lý input chỉ toàn khoảng trắng (BR-11), kịch bản tranh chấp lượt dùng tuần tự sát nút (BR-16), và kết hợp đồng thời 2 mã giảm tiền cố định VNĐ (BR-13).

- **Góc nhìn 2 (Viewpoint Balance)**: 
  - Test Suite phân bổ tương đối cân bằng và đa chiều qua 9 Viewpoints (8 Viewpoints Registry chuẩn + 1 Viewpoint Giả định Data Integrity & Financial Accounting):
    - *Happy Path*: 7 TCs (VOUCHER-001 đến VOUCHER-007)
    - *Negative*: 10 TCs (VOUCHER-008 đến VOUCHER-017)
    - *Boundary*: 9 TCs (VOUCHER-018 đến VOUCHER-026)
    - *Security*: 4 TCs (VOUCHER-027 đến VOUCHER-030)
    - *Integration*: 4 TCs (VOUCHER-031 đến VOUCHER-034)
    - *UX/Usability*: 4 TCs (VOUCHER-035 đến VOUCHER-038)
    - *Performance*: 2 TCs (VOUCHER-039 đến VOUCHER-040)
    - *Accessibility*: 3 TCs (VOUCHER-041 đến VOUCHER-043)
    - *Data Integrity & Financial Accounting*: 4 TCs (VOUCHER-044 đến VOUCHER-047)
  - Tỷ lệ phân bổ phản ánh đúng chiến lược Risk-Based Testing, tập trung mật độ cao vào Negative, Boundary, Happy Path và Data Integrity.

- **Góc nhìn 3 (Boundary Completeness)**: 
  - Đã bao phủ triệt để các biên quan trọng: Min Order Value (bằng đúng 200k vs thiếu 1 VNĐ 199.999 VNĐ), trần giảm giá phần trăm 50.000 VNĐ (đơn lẻ và kết hợp), sàn thanh toán 0 VNĐ, mút thời gian ICT 23:59:59 vs 00:00:01, giới hạn 2 mã và độ dài 50/51 ký tự.
  - Cần bổ sung biên nhập liệu ký tự chỉ chứa khoảng trắng trắng (whitespace-only) và biên thời gian thanh toán lệch vài millisecond giữa 2 người dùng để hoàn thiện tính toàn diện tuyệt đối.

---

## 2. Ma trận Đối soát Độ phủ Nghiệp vụ (Traceability & Gap Matrix)

| Rule# | Rule description | Test Case IDs cover | Gap & Recommendation |
| :--- | :--- | :--- | :--- |
| **BR-01** | Tính năng áp dụng mã giảm giá được tích hợp tại trang Thanh toán với ô nhập "Mã giảm giá" và nút "Áp dụng". | VOUCHER-001, VOUCHER-026, VOUCHER-038 | **Đạt** (Đã bao phủ vị trí UI, ô nhập, nút bấm và hiển thị responsive). |
| **BR-02** | Khách vãng lai bắt buộc phải đăng nhập hệ thống khi thanh toán mới có thể áp dụng mã giảm giá. | VOUCHER-014, VOUCHER-029 | **Đạt** (Đã bao phủ chặn UI redirect sang Login và chặn API 401 Unauthorized ở Backend). |
| **BR-03** | Hệ thống hỗ trợ 02 hình thức giảm giá: giảm theo tỷ lệ phần trăm (%) và giảm số tiền cố định (VNĐ). | VOUCHER-001, VOUCHER-002 | **Đạt** (Đã bao phủ luồng tính toán chiết khấu chuẩn cho cả 2 loại mã % và VNĐ). |
| **BR-04** | Mã giảm giá chỉ áp dụng thành công khi tổng giá trị đơn hàng đạt hoặc vượt mức giá trị tối thiểu (Min Order Value). | VOUCHER-001, VOUCHER-002, VOUCHER-012, VOUCHER-018, VOUCHER-019 | **Đạt** (Đã bao phủ luồng hợp lệ, luồng từ chối rõ rệt, biên bằng đúng Min và biên thiếu đúng 1 VNĐ). |
| **BR-05** | Mỗi mã giảm giá đều được cấu hình ngày hết hạn cụ thể. | VOUCHER-001, VOUCHER-002, VOUCHER-009, VOUCHER-023, VOUCHER-024 | **Đạt** (Đã bao phủ mã còn hạn, mã quá hạn và 2 mút thời gian 23:59:59 / 00:00:01 UTC+7). |
| **BR-06** | Khi áp dụng mã thành công, hệ thống phải hiển thị rõ số tiền được giảm và cập nhật tổng tiền thanh toán mới. | VOUCHER-001, VOUCHER-002, VOUCHER-006, VOUCHER-035 | **Đạt** (Đã bao phủ hiển thị dòng chiết khấu số âm `-XX.XXX VNĐ` và tổng tiền mới). |
| **BR-07** | Khi mã không hợp lệ hoặc đã quá hạn, hệ thống không áp chiết khấu và hiển thị thông báo lỗi tương ứng. | VOUCHER-008, VOUCHER-009 | **Đạt** (Đã bao phủ từ chối áp dụng và thông báo lỗi rõ ràng theo từng nguyên nhân). |
| **BR-08** | Đơn vị tiền tệ hiển thị và tính toán giao dịch trên toàn hệ thống là VNĐ, được làm tròn theo quy ước hiển thị. | VOUCHER-006, VOUCHER-035, VOUCHER-046 | **Đạt** (Đã bao phủ hiển thị định dạng VNĐ và thuật toán làm tròn `Math.round` không phát sinh số thập phân/lệch tiền lẻ). |
| **BR-09** | Ngôn ngữ hiển thị giao diện và các câu thông báo phản hồi của tính năng là tiếng Việt. | VOUCHER-008, VOUCHER-009, VOUCHER-010, VOUCHER-011, VOUCHER-012, VOUCHER-013, VOUCHER-014, VOUCHER-015, VOUCHER-016, VOUCHER-025, VOUCHER-027, VOUCHER-030, VOUCHER-033, VOUCHER-037 | **Đạt** (100% câu chữ thông báo thành công và thông báo lỗi kiểm thử đều dùng tiếng Việt chuẩn mực). |
| **BR-10** | Giao diện responsive trên Desktop và Mobile Web; thời gian tải trang/API dưới 3 giây trên Chrome, Edge, Safari. | VOUCHER-038, VOUCHER-039, VOUCHER-040 | **Đạt** (Đã bao phủ responsive Desktop/Mobile, Response Time API < 3s trên 3 trình duyệt và tốc độ render DOM tức thì). |
| **BR-11** | Ô nhập mã tự động cắt bỏ khoảng trắng thừa ở đầu/cuối chuỗi (trim spaces) và xử lý không phân biệt hoa/thường (case-insensitive). | VOUCHER-004, VOUCHER-005, VOUCHER-036 | **Cần bổ sung (Gap)**: Chưa có test case kiểm thử chuỗi nhập chỉ toàn khoảng trắng (`"   "`). Cần bổ sung để đảm bảo validate inline đúng mà không gọi API Backend. |
| **BR-12** | Mức chiết khấu tối đa (trần giảm giá / Max discount cap) cho mã phần trăm (%) là 50.000 VNĐ. | VOUCHER-020, VOUCHER-021 | **Đạt** (Đã bao phủ ép trần 50k cho 1 mã % lớn và ép trần tổng 50k khi kết hợp 2 mã %). |
| **BR-13** | Hệ thống cho phép áp dụng đồng thời nhiều mã trên cùng 01 đơn hàng, tuân thủ trần giảm giá tối đa (50k đối với %). | VOUCHER-003, VOUCHER-021, VOUCHER-025 | **Cần bổ sung (Gap)**: Chưa có kịch bản áp dụng đồng thời 02 mã loại tiền cố định VNĐ (ví dụ: 1 mã giảm 30k + 1 mã giảm 20k) để kiểm tra tổng chiết khấu không bị giới hạn bởi trần 50k của mã %. |
| **BR-14** | Kiểm tra thời hạn sử dụng mã dựa trên thời điểm hoàn tất thanh toán (chốt đơn) theo múi giờ Việt Nam (ICT / UTC+7). | VOUCHER-009, VOUCHER-023, VOUCHER-024, VOUCHER-033 | **Đạt** (Đã bao phủ đối soát Server Time UTC+7, chống gian lận chỉnh giờ client và mút thời gian chốt đơn). |
| **BR-15** | Mã giảm giá đã áp dụng sử dụng không được khôi phục hoặc hoàn trả lại trạng thái "chưa sử dụng" khi đơn hàng bị hủy hoặc phát sinh trả hàng. | VOUCHER-034, VOUCHER-045 | **Cần bổ sung (Gap)**: VOUCHER-034 đã test luồng hủy đơn hàng; VOUCHER-045 test tiền hoàn khi trả hàng nhưng chưa kiểm tra tường minh trạng thái mã trong CSDL có bị rollback về `AVAILABLE` sau khi hoàn tất thủ tục trả hàng (Return/Refund) hay không. |
| **BR-16** | Giới hạn số lần dùng; ưu tiên người thanh toán trước; trường hợp trùng thời gian áp dụng và chốt đơn ghi nhận trạng thái `(OVER)` để đối soát. | VOUCHER-007, VOUCHER-010, VOUCHER-028 | **Cần bổ sung (Gap)**: VOUCHER-028 đã kiểm thử trường hợp trùng millisecond ghi nhận `(OVER)`, nhưng chưa có test case cho vế đầu của rule: User A bấm chốt đơn trước 1 giây mua thành công, User B chốt đơn sau 1 giây bị từ chối với thông báo "Mã đã hết lượt sử dụng". |
| **BR-17** | Tự động kiểm tra lại và hủy áp dụng mã giảm giá tại bước xác nhận chốt đơn nếu sửa giỏ hàng làm Subtotal < Min Order Value. | VOUCHER-016, VOUCHER-032 | **Đạt** (Đã bao phủ xử lý UI gỡ mã và sự kiện đồng bộ Cart Service - Checkout Service). |

---

## 3. Danh mục Lỗ hổng & Đề xuất Bổ sung Chi tiết (Detailed Gaps & Test Recommendations)

### Rule #BR-11: Tự động trim khoảng trắng thừa và xử lý case-insensitive
- **Gap phát hiện**: Thiếu kịch bản người dùng nhập chuỗi chỉ chứa toàn dấu cách/khoảng trắng (ví dụ: `"   "`) rồi nhấn nút "Áp dụng". Cần đảm bảo hệ thống tự trim về chuỗi rỗng và hiển thị thông báo lỗi inline ngay tại client mà không gửi request API vô ích về Server.
- **Rủi ro Business (Business Risk)**: Hệ thống có thể gửi chuỗi khoảng trắng về API Backend dẫn đến phát sinh lỗi 400 Bad Request hoặc thông báo lỗi "Mã không hợp lệ" thay vì hướng dẫn người dùng nhập mã cụ thể.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-048: Validate hệ thống tự động trim chuỗi chỉ chứa toàn khoảng trắng và hiển thị thông báo lỗi inline yêu cầu nhập mã`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Tài khoản đăng nhập đang ở trang Thanh toán.
    - Input: Nhập chuỗi `"     "` (5 khoảng trắng) vào ô "Mã giảm giá" và bấm nút "Áp dụng".
  - *Kết quả mong đợi*: 
    - Hệ thống cắt chuỗi về rỗng, không gọi API kiểm tra mã.
    - Hiển thị thông báo lỗi inline ngay dưới ô nhập: `"Vui lòng nhập mã giảm giá"`.

---

### Rule #BR-13: Áp dụng đồng thời nhiều mã giảm giá
- **Gap phát hiện**: Test suite hiện tại mới bao phủ kết hợp 1 mã % + 1 mã VNĐ (VOUCHER-003) và 2 mã % (VOUCHER-021), chưa có kịch bản áp dụng kết hợp 02 mã đều thuộc loại giảm số tiền cố định (VNĐ) (ví dụ: 1 Voucher khuyến mãi ngành hàng 30.000 VNĐ + 1 Voucher phí vận chuyển 20.000 VNĐ).
- **Rủi ro Business (Business Risk)**: Logic tính toán có thể nhầm lẫn áp đặt trần khống chế 50.000 VNĐ (vốn chỉ áp dụng cho loại mã %) lên cả tổng số tiền giảm của các mã tiền cố định VNĐ, làm sai lệch quyền lợi chính đáng của khách hàng.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-049: Verify áp dụng đồng thời 02 mã giảm giá loại số tiền cố định (VNĐ) thành công và tổng tiền giảm không bị giới hạn bởi trần 50.000 VNĐ của mã phần trăm`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Đơn hàng có Subtotal = 500.000 VNĐ. Hệ thống có mã `FIX40K` (giảm 40.000 VNĐ) và mã `FIX30K` (giảm 30.000 VNĐ).
    - Input: Áp dụng thành công mã `FIX40K`, sau đó áp dụng tiếp mã `FIX30K`.
  - *Kết quả mong đợi*: 
    - Cả 2 mã được áp dụng đồng thời.
    - Tổng tiền chiết khấu hiển thị đầy đủ `-70.000 VNĐ` (40.000 + 30.000 VNĐ, không bị ép về 50.000 VNĐ).
    - Tổng tiền thanh toán mới: `430.000 VNĐ`.

---

### Rule #BR-15: Quy tắc không hoàn trả mã khi đơn hàng bị hủy hoặc trả hàng
- **Gap phát hiện**: VOUCHER-034 đã kiểm tra trạng thái mã giữ nguyên `USED` khi HỦY đơn hàng. Tuy nhiên, luồng TRẢ HÀNG/HOÀN TIỀN (Return & Refund) sau khi đơn hàng đã giao thành công chưa có test case xác nhận trạng thái mã trong CSDL có bị kích hoạt hoàn lại thành `AVAILABLE` hay không.
- **Rủi ro Business (Business Risk)**: Khi module Quản lý đổi trả hoàn tiền (RMA/Refund) xử lý, logic backend có thể vô tình reset trạng thái voucher của khách hàng về `AVAILABLE`, dẫn đến thất thoát ngân sách do khách hàng lợi dụng trả hàng để lấy lại mã VIP/mã giảm sâu đã sử dụng.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-050: Verify trạng thái mã giảm giá trong CSDL giữ nguyên trạng thái USED và không được khôi phục khi đơn hàng hoàn tất thủ tục Trả hàng/Hoàn tiền (Return/Refund)`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Đơn hàng `#ORD9999` có áp dụng mã `ONETIME_CODE` đã giao hàng thành công (`status = DELIVERED`, trạng thái mã trong `user_vouchers` là `USED`).
    - Input: CSKH/Hệ thống duyệt và xử lý thành công yêu cầu Trả hàng - Hoàn tiền toàn phần cho đơn `#ORD9999`.
  - *Kết quả mong đợi*: 
    - Đơn hàng chuyển trạng thái `REFUNDED`.
    - Trạng thái mã `ONETIME_CODE` của tài khoản trong CSDL vẫn giữ nguyên là `USED`, tài khoản không thể sử dụng lại mã này cho đơn hàng mới.

---

### Rule #BR-16: Xử lý tranh chấp lượt sử dụng mã
- **Gap phát hiện**: VOUCHER-028 mới chỉ kiểm thử trường hợp 2 user gửi request chốt đơn trùng khớp millisecond và ghi nhận trạng thái `(OVER)`. Chưa có test case kiểm thử kịch bản tuần tự sát nút (User A chốt đơn thanh toán trước -> trừ hết lượt; User B chốt đơn sau vài giây -> bị từ chối và báo lỗi hết lượt).
- **Rủi ro Business (Business Risk)**: Khi hết lượt thực tế do người khác đã hoàn tất thanh toán trước, người dùng đến sau nếu không bị chặn kịp thời có thể chốt đơn thành công ngoài ý muốn, làm sai lệch số lượng phát hành dự toán của chương trình.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-051: Validate người dùng chốt đơn sau bị từ chối và hiển thị thông báo hết lượt khi lượt dùng cuối cùng đã được người dùng khác thanh toán thành công trước đó`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Mã `FLASH1` chỉ còn 01 lượt dùng duy nhất. Cả User A và User B đều đã nhập mã sẵn tại trang Thanh toán.
    - Test Steps: 
      1. User A nhấn "Đặt hàng" và hoàn tất thanh toán thành công lúc `T`.
      2. User B nhấn "Đặt hàng" lúc `T + 2 giây`.
  - *Kết quả mong đợi*: 
    - User A chốt đơn thành công, lượt mã giảm về 0.
    - User B bị hệ thống chặn chốt đơn, tự động gỡ mã và hiển thị thông báo lỗi: `"Mã giảm giá đã hết lượt sử dụng."`

---

## 4. Mục Dành Cho Human Reviewer Quyết Định (Human-Final Decision Scope)

> *Lưu ý: Senior QA Coverage Reviewer tổng hợp các khía cạnh nghiệp vụ nâng cao dưới đây và bàn giao cho QA Lead / Product Owner / Solution Architect thẩm định và phê duyệt:*

1. **Business Criticality (Mức độ sống còn nghiệp vụ)**:
   - Các rule liên quan đến trần chiết khấu tài chính (`BR-12`, `BR-13`), xử lý concurrency tranh chấp ngân sách khuyến mãi (`BR-16`) và không hoàn mã khi hủy/trả hàng (`BR-15`) là các quy tắc sống còn (Critical). Cần ưu tiên tự động hóa (Automation) 100% trong bộ CI/CD Regression Test Suite.
2. **Actual Risk Sufficiency (Mức độ chấp nhận rủi ro release)**:
   - Bộ 47 Test Cases hiện tại đã bao phủ rất tốt các luồng rủi ro cao nhất. Nếu dự án gấp rút bàn giao bản Beta nội bộ, bộ test suite hiện tại có thể tạm thời chấp nhận được. Tuy nhiên, đối với bản Release Production chính thức, bắt buộc phải bổ sung 4 Test Cases (`VOUCHER-048` đến `VOUCHER-051`) để đóng hoàn toàn các lỗ hổng biên và luồng đổi trả.
3. **Cross-system Impact (Tác động tích hợp liên hệ thống)**:
   - Tác động giữa Cổng thanh toán bên thứ ba (VNPay, MoMo) với trạng thái tạm giữ `PENDING_HOLD` 15 phút: Cần QA Lead phối hợp cùng Payment Gateway Team để xác thực kịch bản IPN (Instant Payment Notification) bị trễ hoặc gửi callback lặp lại (Idempotency).
   - Tác động đồng bộ CSDL giữa phân hệ E-Commerce Web với hệ thống Kế toán/ERP khi ghi nhận doanh thu và dòng tiền giảm giá `(OVER)`.
4. **Exploratory Insights (Góc nhìn kiểm thử thăm dò thực chiến)**:
   - Thử nghiệm người dùng mở 2 trình duyệt/tab đồng thời trên cùng 1 tài khoản và bấm áp 2 mã khác nhau.
   - Thử nghiệm chuyển đổi qua lại giữa phương thức COD và Cổng thanh toán online sau khi đã áp mã giảm giá.

---

## 5. Kết luận Kiểm định (Review Verdict)

- **Review Verdict**: **`FIX`**
- **Lý do chi tiết**:
  1. **Kết quả rà soát 3 góc nhìn**: Bộ Test Suite đã đạt độ phủ rất cao (17/17 Business Rules có Test Case ánh xạ, 9/9 Viewpoints được phân bổ hợp lý, các giá trị biên quan trọng nhất đã được bao phủ).
  2. **Căn cứ kết luận FIX**: Căn cứ theo quy chuẩn kiểm soát chất lượng, phát hiện **04 lỗ hổng kiểm thử (Test Gaps)** chi tiết thuộc các quy tắc `BR-11` (nhập khoảng trắng), `BR-13` (áp kết hợp 2 mã tiền cố định VNĐ), `BR-15` (kiểm tra trạng thái mã sau quy trình Trả hàng/Hoàn tiền), và `BR-16` (tranh chấp lượt dùng tuần tự).
  3. **Hành động tiếp theo**: Đề xuất bổ sung ngay 04 Test Cases từ `VOUCHER-048` đến `VOUCHER-051` (đã đặc tả rõ ràng Precondition, Input, Test Steps và Expected Result tại Mục 3) vào tài liệu Test Case Specification trước khi tiến hành nghiệm thu và ký duyệt bàn giao chính thức.
