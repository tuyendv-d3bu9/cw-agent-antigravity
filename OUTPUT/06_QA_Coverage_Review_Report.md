# BÁO CÁO COVERAGE REVIEW & TEST SUITE GAP ANALYSIS

> **Feature**: Áp dụng Mã Giảm Giá (Voucher) - Function D (ShopGo E-Commerce)  
> **Người thực hiện**: Senior QA Coverage Reviewer (QA Lead ảo)  
> **Bước trong quy trình**: Step 06 (Coverage Review & Test Suite Gap Analysis)  
> **Dữ liệu đầu vào đối soát**: 
> - [01_Requirement_Summary_Report.md](OUTPUT/01_Requirement_Summary_Report.md)
> - [02_QA_Missing_Rule_Analyst_Report.md](OUTPUT/02_QA_Missing_Rule_Analyst_Report.md)
> - [03_QA_Viewpoint_Analyst_Report.md](OUTPUT/03_QA_Viewpoint_Analyst_Report.md)
> - [05_QA_Test_Case_Specification.md](OUTPUT/05_QA_Test_Case_Specification.md)

---

## 1. Tổng quan Đánh giá 3 Góc nhìn (Coverage Framework Evaluation)

- **Góc nhìn 1 (Requirement ↔ Test Suite)**: 
  - Toàn bộ **10 Business Rules gốc (BR-01 đến BR-10)** từ Step 01 và **06 Missing Rules bổ sung (MR-01 đến MR-06)** từ Step 02 đã được ánh xạ chi tiết với bộ 47 Test Cases tại Step 05.
  - 100% các luồng Happy Path, 4 Alternate Flows (AF-01 đến AF-04) và các quy tắc nghiệp vụ mở rộng đều có test case trực tiếp bao phủ.
  - Qua quá trình kiểm tra chéo 2 chiều (Traceability Audit), phát hiện **04 khoảng trống kiểm thử (Test Gaps)** cần bổ sung để gia cố chất lượng: kiểm tra chuỗi nhập toàn khoảng trắng (MR-02), kết hợp 2 mã tiền cố định VNĐ (MR-03), xác minh trạng thái mã trong CSDL sau khi đơn hàng được duyệt Trả hàng/Hoàn tiền (MR-05), và kịch bản tranh chấp lượt dùng tuần tự sát nút (MR-01).

- **Góc nhìn 2 (Viewpoint Balance)**: 
  - Bộ Test Suite 47 test cases được phân bổ cân đối, hài hòa qua đầy đủ 9 Viewpoints (8 Viewpoints Registry chuẩn + 1 Viewpoint Giả định Data Integrity & Financial Accounting):
    - *Happy Path*: 7 TCs (`VOUCHER-001` đến `VOUCHER-007`) — Tỷ trọng 14.9%
    - *Negative*: 10 TCs (`VOUCHER-008` đến `VOUCHER-017`) — Tỷ trọng 21.3%
    - *Boundary*: 9 TCs (`VOUCHER-018` đến `VOUCHER-026`) — Tỷ trọng 19.1%
    - *Security*: 4 TCs (`VOUCHER-027` đến `VOUCHER-030`) — Tỷ trọng 8.5%
    - *Integration*: 4 TCs (`VOUCHER-031` đến `VOUCHER-034`) — Tỷ trọng 8.5%
    - *UX/Usability*: 4 TCs (`VOUCHER-035` đến `VOUCHER-038`) — Tỷ trọng 8.5%
    - *Performance*: 2 TCs (`VOUCHER-039` đến `VOUCHER-040`) — Tỷ trọng 4.3%
    - *Accessibility*: 3 TCs (`VOUCHER-041` đến `VOUCHER-043`) — Tỷ trọng 6.4%
    - *Data Integrity & Financial Accounting*: 4 TCs (`VOUCHER-044` đến `VOUCHER-047`) — Tỷ trọng 8.5%
  - Tỷ lệ phân bổ phản ánh chính xác triết lý Risk-Based Testing, ưu tiên mật độ cao cho nhóm rủi ro Critical/High (Negative, Boundary, Security, Data Integrity).

- **Góc nhìn 3 (Boundary Completeness)**: 
  - Đã bao phủ triệt để các mốc biên rủi ro cốt lõi: Min Order Value (đạt chuẩn 300k vs thiếu 1 VNĐ 299.999 VNĐ), trần giảm giá phần trăm 50.000 VNĐ (cho 1 mã và kết hợp 2 mã), sàn thanh toán tối thiểu 0 VNĐ, mút thời gian ICT 23:59:59 vs 00:00:01, giới hạn số lượng áp tối đa 2 mã, và độ dài ô nhập 50 ký tự vs chặn ký tự thứ 51.
  - Cần gia cố thêm điểm biên nhập liệu chỉ chứa ký tự khoảng trắng (whitespace-only input) và biên thời gian đặt hàng lệch 1-2 giây giữa 2 tài khoản tranh chấp lượt cuối.

---

## 2. Ma trận Đối soát Độ phủ Nghiệp vụ (Traceability & Gap Matrix)

| Rule# | Rule description | Test Case IDs cover | Gap & Recommendation |
| :--- | :--- | :--- | :--- |
| **BR-01** | Tính năng áp dụng mã giảm giá hiển thị tại trang Thanh toán với giao diện bao gồm ô nhập "Mã giảm giá" và nút "Áp dụng". | `VOUCHER-001`, `VOUCHER-004`, `VOUCHER-005`, `VOUCHER-013`, `VOUCHER-026`, `VOUCHER-030`, `VOUCHER-036`, `VOUCHER-041` | **Đạt** (Đã bao phủ toàn diện vị trí UI, ô nhập, nút bấm, phím tắt tiếp cận và cơ chế nhập liệu). |
| **BR-02** | Khách vãng lai (Guest) bắt buộc phải thực hiện đăng nhập tài khoản khi thanh toán mới có thể sử dụng mã giảm giá. | `VOUCHER-014`, `VOUCHER-015`, `VOUCHER-029` | **Đạt** (Đã bao phủ chặn UI redirect sang Login, kiểm tra trạng thái tài khoản và chặn API Backend trả mã lỗi 401/403). |
| **BR-03** | Hệ thống hỗ trợ 02 loại mã giảm giá: mã giảm theo phần trăm (%) và mã giảm theo số tiền cố định (VNĐ). | `VOUCHER-001`, `VOUCHER-002`, `VOUCHER-003`, `VOUCHER-020`, `VOUCHER-021`, `VOUCHER-022`, `VOUCHER-025`, `VOUCHER-044`, `VOUCHER-045`, `VOUCHER-046`, `VOUCHER-047` | **Đạt** (Đã bao phủ tính toán chuẩn xác cho cả 2 loại mã %, mã VNĐ, kết hợp mã, phân bổ line-item và làm tròn). |
| **BR-04** | Mã giảm giá chỉ được áp dụng thành công khi tổng giá trị đơn hàng đạt hoặc vượt mức giá trị đơn hàng tối thiểu (min order value) do mã quy định. | `VOUCHER-001`, `VOUCHER-002`, `VOUCHER-012`, `VOUCHER-016`, `VOUCHER-018`, `VOUCHER-019`, `VOUCHER-032` | **Đạt** (Đã bao phủ luồng hợp lệ, từ chối rõ ràng, mút biên đủ tiền/thiếu 1 VNĐ và re-validate khi giảm sản phẩm trong giỏ). |
| **BR-05** | Mỗi mã giảm giá đều được thiết lập ngày hết hạn cụ thể. | `VOUCHER-001`, `VOUCHER-002`, `VOUCHER-007`, `VOUCHER-009`, `VOUCHER-017`, `VOUCHER-023`, `VOUCHER-024`, `VOUCHER-028`, `VOUCHER-031`, `VOUCHER-033`, `VOUCHER-034` | **Đạt** (Đã bao phủ mã còn hạn, mã hết hạn, mút thời gian 23:59:59 / 00:00:01 ICT, đối soát Server Time và trạng thái HOLD/USED). |
| **BR-06** | Khi áp dụng mã giảm giá thành công, hệ thống phải hiển thị rõ ràng số tiền được giảm và tổng tiền thanh toán mới sau chiết khấu. | `VOUCHER-001`, `VOUCHER-002`, `VOUCHER-006`, `VOUCHER-035` | **Đạt** (Đã bao phủ hiển thị dòng chiết khấu số âm `-XX.XXX VNĐ`, cập nhật tổng tiền thanh toán mới trực quan). |
| **BR-07** | Trường hợp mã giảm giá không hợp lệ hoặc đã hết hạn, hệ thống giữ nguyên tổng tiền và hiển thị thông báo lỗi phù hợp cho người dùng. | `VOUCHER-008`, `VOUCHER-009`, `VOUCHER-010`, `VOUCHER-011`, `VOUCHER-012`, `VOUCHER-027`, `VOUCHER-033`, `VOUCHER-037`, `VOUCHER-042` | **Đạt** (Đã bao phủ từ chối chiết khấu, giữ nguyên tổng tiền và chuẩn hóa danh mục thông báo lỗi phân biệt theo nguyên nhân). |
| **BR-08** | Hệ thống ShopGo là ứng dụng web bán lẻ trực tuyến hỗ trợ giao diện responsive trên cả Desktop và Mobile Web. | `VOUCHER-038`, `VOUCHER-043` | **Đạt** (Đã bao phủ hiển thị responsive trên Desktop, Mobile Web và zoom phóng to 200%). |
| **BR-09** | Đơn vị tiền tệ duy nhất áp dụng cho hiển thị và thanh toán là VNĐ; ngôn ngữ hiển thị giao diện là tiếng Việt. | `VOUCHER-006`, `VOUCHER-035`, `VOUCHER-037`, `VOUCHER-046` | **Đạt** (100% hiển thị định dạng VNĐ, làm tròn `Math.round` và ngôn ngữ thông báo tiếng Việt chuẩn mực). |
| **BR-10** | Hệ thống đảm bảo thời gian tải trang chính dưới 3 giây trên các trình duyệt web được hỗ trợ (Chrome, Edge, Safari). | `VOUCHER-039`, `VOUCHER-040` | **Đạt** (Đã bao phủ kiểm thử API Response Time < 3s trên Chrome, Edge, Safari và tốc độ render DOM tức thì). |
| **MR-01** | Quy định giới hạn số lần sử dụng trên từng tài khoản và kiểm soát trạng thái tài khoản. | `VOUCHER-010`, `VOUCHER-011`, `VOUCHER-015`, `VOUCHER-028`, `VOUCHER-029` | **Cần bổ sung (Gap)**: `VOUCHER-028` đã kiểm thử tranh chấp trùng millisecond, nhưng chưa có test case cho kịch bản tranh chấp tuần tự sát nút (User A chốt trước 1-2s mua thành công, User B chốt sau bị từ chối báo hết lượt). |
| **MR-02** | Quy chuẩn danh mục thông báo lỗi phân biệt theo nguyên nhân và kiểm soát đầu vào ô nhập. | `VOUCHER-004`, `VOUCHER-005`, `VOUCHER-008`, `VOUCHER-009`, `VOUCHER-010`, `VOUCHER-011`, `VOUCHER-012`, `VOUCHER-013`, `VOUCHER-026`, `VOUCHER-030`, `VOUCHER-036`, `VOUCHER-037` | **Cần bổ sung (Gap)**: Chưa có test case kiểm thử chuỗi nhập chỉ toàn ký tự khoảng trắng (`"     "`). Cần đảm bảo hệ thống trim về rỗng và báo lỗi inline ngay tại client mà không gọi API Backend vô ích. |
| **MR-03** | Phạm vi tính Min Order Value, trần chiết khấu, sàn giảm giá và giới hạn số mã áp dụng. | `VOUCHER-003`, `VOUCHER-018`, `VOUCHER-019`, `VOUCHER-020`, `VOUCHER-021`, `VOUCHER-022`, `VOUCHER-025` | **Cần bổ sung (Gap)**: Chưa có test case áp dụng đồng thời 02 mã đều thuộc loại giảm tiền cố định VNĐ để kiểm chứng tổng tiền giảm không bị giới hạn nhầm bởi trần 50.000 VNĐ của mã %. |
| **MR-04** | Thời điểm re-validate mã khi chốt đơn và cơ chế tạm giữ lượt mã (Voucher Holding) khi thanh toán online. | `VOUCHER-007`, `VOUCHER-016`, `VOUCHER-017`, `VOUCHER-023`, `VOUCHER-024`, `VOUCHER-031`, `VOUCHER-032` | **Đạt** (Đã bao phủ re-validate thời gian/giỏ hàng khi chốt đơn và cơ chế holding 15 phút cổng VNPay/MoMo). |
| **MR-05** | Thuật toán phân bổ chiết khấu cho từng sản phẩm và xử lý hoàn trả từng phần (Partial Refund). | `VOUCHER-016`, `VOUCHER-032`, `VOUCHER-034`, `VOUCHER-044`, `VOUCHER-045`, `VOUCHER-047` | **Cần bổ sung (Gap)**: `VOUCHER-045` đã test tính số tiền hoàn khi trả hàng nhưng chưa kiểm tra tường minh trạng thái mã trong CSDL có bị khôi phục nhầm về `AVAILABLE` sau khi hoàn tất thủ tục Trả hàng/Hoàn tiền hay không. |
| **MR-06** | Quy chuẩn làm tròn số tiền chiết khấu VNĐ và cơ chế chống dò quét mã (Anti Brute-Force). | `VOUCHER-027`, `VOUCHER-046` | **Đạt** (Đã bao phủ cơ chế Rate Limiting khóa 10 phút khi nhập sai quá 5 lần/phút và thuật toán `Math.round` VNĐ). |

---

## 3. Danh mục Lỗ hổng & Đề xuất Bổ sung Chi tiết (Detailed Gaps & Test Recommendations)

### Rule #MR-02: Kiểm soát đầu vào ô nhập & Thông báo lỗi inline
- **Gap phát hiện**: Thiếu kịch bản người dùng nhập chuỗi chỉ chứa toàn khoảng trắng (ví dụ: `"     "`) rồi bấm nút "Áp dụng". Cần đảm bảo Frontend tự động trim về chuỗi rỗng và hiển thị thông báo lỗi inline ngay tại giao diện mà không gửi request API kiểm tra mã về Server.
- **Rủi ro Business (Business Risk)**: Nếu không xử lý trim ở client, chuỗi khoảng trắng sẽ bị gửi về API Backend dẫn đến phát sinh lỗi `400 Bad Request` hoặc thông báo lỗi sai lệch `"Mã giảm giá không hợp lệ"` thay vì thông báo nhắc nhở `"Vui lòng nhập mã giảm giá"`.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-048: Validate hệ thống tự động trim chuỗi chỉ chứa toàn khoảng trắng và hiển thị thông báo lỗi inline yêu cầu nhập mã`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Khách hàng đăng nhập đang ở màn hình Thanh toán.
    - Input: Nhập chuỗi `"     "` (5 dấu cách) vào ô "Mã giảm giá" và bấm nút "Áp dụng".
  - *Kết quả mong đợi*: 
    - Hệ thống tự động nhận diện chuỗi rỗng, không phát sinh lệnh gọi API xác thực mã.
    - Hiển thị thông báo lỗi inline ngay dưới ô nhập: `"Vui lòng nhập mã giảm giá."`

---

### Rule #MR-03: Áp dụng đồng thời nhiều mã giảm giá loại tiền cố định VNĐ
- **Gap phát hiện**: Test suite hiện tại đã có kịch bản kết hợp 1 mã % + 1 mã VNĐ (`VOUCHER-003`) và 2 mã % (`VOUCHER-021`), nhưng chưa có kịch bản áp dụng kết hợp 02 mã đều thuộc loại giảm số tiền cố định VNĐ (ví dụ: 1 Voucher khuyến mãi ngành hàng 40.000 VNĐ + 1 Voucher phí vận chuyển 30.000 VNĐ).
- **Rủi ro Business (Business Risk)**: Logic tính toán Backend có nguy cơ áp đặt nhầm trần khống chế 50.000 VNĐ (vốn chỉ áp dụng cho loại mã %) lên cả tổng số tiền giảm của các mã tiền cố định VNĐ, làm mất quyền lợi chiết khấu hợp lệ của người mua (bị giảm thiếu 20.000 VNĐ).
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-049: Verify áp dụng đồng thời 02 mã giảm giá loại số tiền cố định (VNĐ) thành công và tổng tiền giảm không bị giới hạn bởi trần 50.000 VNĐ của mã phần trăm`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Đơn hàng có Subtotal = 500.000 VNĐ. Hệ thống có mã `FIX40K` (giảm 40.000 VNĐ) và mã `FIX30K` (giảm 30.000 VNĐ).
    - Input: Áp dụng thành công mã `FIX40K`, sau đó tiếp tục nhập và áp dụng mã `FIX30K`.
  - *Kết quả mong đợi*: 
    - Cả 2 mã được áp dụng đồng thời thành công trên đơn hàng.
    - Khu vực chiết khấu hiển thị đầy đủ tổng mức giảm `-70.000 VNĐ` (40.000 + 30.000 VNĐ, không bị ép về 50.000 VNĐ).
    - Tổng tiền thanh toán mới được cập nhật chính xác: `430.000 VNĐ`.

---

### Rule #MR-05: Kiểm soát trạng thái mã sau quy trình Trả hàng/Hoàn tiền (Return/Refund)
- **Gap phát hiện**: `VOUCHER-034` đã kiểm tra khôi phục mã khi HỦY đơn hàng trước khi giao; `VOUCHER-045` đã kiểm tra số tiền hoàn khi trả hàng. Tuy nhiên, luồng TRẢ HÀNG/HOÀN TIỀN (Return & Refund) sau khi đơn hàng đã giao thành công chưa có test case xác nhận trạng thái mã trong CSDL có bị giữ nguyên là `USED` (không được hoàn lại) hay không.
- **Rủi ro Business (Business Risk)**: Khi phân hệ Đổi trả - Hoàn tiền (RMA/Refund) xử lý, logic backend có thể vô tình reset trạng thái voucher của khách hàng về `AVAILABLE`, tạo kẽ hở cho khách hàng trục lợi bằng cách mua hàng áp mã giảm sâu rồi yêu cầu trả hàng để tái sử dụng mã nhiều lần.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-050: Verify trạng thái mã giảm giá trong CSDL giữ nguyên trạng thái USED và không được khôi phục khi đơn hàng hoàn tất thủ tục Trả hàng/Hoàn tiền (Return/Refund)`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Đơn hàng `#ORD9999` có áp dụng mã `ONETIME_CODE` đã giao hàng thành công (`status = DELIVERED`, trạng thái mã trong bảng `user_vouchers` là `USED`).
    - Input: Hệ thống/CSKH duyệt và hoàn tất thủ tục Trả hàng - Hoàn tiền cho đơn `#ORD9999`.
  - *Kết quả mong đợi*: 
    - Đơn hàng chuyển sang trạng thái `REFUNDED`.
    - Trạng thái mã `ONETIME_CODE` của tài khoản trong CSDL vẫn giữ nguyên là `USED`, không bị chuyển về `AVAILABLE`; tài khoản không thể áp dụng lại mã này cho đơn hàng mới.

---

### Rule #MR-01: Kiểm soát tranh chấp lượt sử dụng mã tuần tự sát nút
- **Gap phát hiện**: `VOUCHER-028` mới chỉ kiểm thử trường hợp 2 user gửi request chốt đơn trùng khớp millisecond và cơ chế concurrency lock. Chưa có test case kiểm thử kịch bản tuần tự sát nút (User A chốt đơn thanh toán trước -> trừ hết lượt khả dụng; User B chốt đơn sau 1-2 giây -> bị từ chối và báo lỗi hết lượt).
- **Rủi ro Business (Business Risk)**: Khi lượt dùng thực tế đã cạn do người khác thanh toán trước, người dùng đến sau nếu không bị hệ thống re-validate và chặn kịp thời tại thời điểm chốt đơn sẽ gây thất thoát ngân sách khuyến mãi do phát hành vượt hạn mức cho phép.
- **Đề xuất Test Case bổ sung**:
  - *Tên Test Case*: `VOUCHER-051: Validate người dùng chốt đơn sau bị từ chối và hiển thị thông báo hết lượt khi lượt dùng cuối cùng đã được người dùng khác thanh toán thành công trước đó`
  - *Điều kiện/Dữ liệu*: 
    - Precondition: Mã `FLASH1` chỉ còn duy nhất 01 lượt dùng khả dụng. Cả User A và User B đều đã nhập mã sẵn tại trang Thanh toán.
    - Test Steps: 
      1. User A nhấn "Đặt hàng" và hoàn tất thanh toán thành công lúc `T`.
      2. User B nhấn "Đặt hàng" lúc `T + 2 giây`.
  - *Kết quả mong đợi*: 
    - Giao dịch của User A hoàn tất thành công, số lượt mã giảm về 0.
    - Giao dịch của User B bị chặn lại tại bước chốt đơn, mã tự động bị gỡ khỏi đơn hàng và hiển thị thông báo lỗi: `"Mã giảm giá đã hết lượt sử dụng."`

---

## 4. Mục Dành Cho Human Reviewer Quyết Định (Human-Final Decision Scope)

> *Lưu ý: Senior QA Coverage Reviewer tổng hợp các khía cạnh nghiệp vụ nâng cao dưới đây và bàn giao cho QA Lead / Product Owner / Solution Architect thẩm định và phê duyệt:*

1. **Business Criticality (Mức độ sống còn nghiệp vụ)**:
   - Các rule liên quan đến trần chiết khấu tài chính (`BR-03`, `MR-03`), xử lý concurrency tranh chấp ngân sách khuyến mãi (`MR-01`) và kiểm soát trạng thái mã khi hủy/trả hàng (`MR-05`) là các quy tắc sống còn (Critical). Cần ưu tiên tự động hóa (Automation) 100% trong bộ CI/CD Regression Test Suite.
2. **Actual Risk Sufficiency (Mức độ chấp nhận rủi ro release)**:
   - Bộ 47 Test Cases hiện tại đã bao phủ rất tốt các luồng rủi ro cao nhất. Nếu dự án gấp rút bàn giao bản Beta nội bộ, bộ test suite hiện tại có thể tạm thời chấp nhận được. Tuy nhiên, đối với bản Release Production chính thức, bắt buộc phải bổ sung 4 Test Cases (`VOUCHER-048` đến `VOUCHER-051`) để đóng hoàn toàn các lỗ hổng biên và luồng đổi trả.
3. **Cross-system Impact (Tác động tích hợp liên hệ thống)**:
   - Tác động giữa Cổng thanh toán bên thứ ba (VNPay, MoMo) với trạng thái tạm giữ `PENDING_HOLD` 15 phút: Cần QA Lead phối hợp cùng Payment Gateway Team để xác thực kịch bản IPN (Instant Payment Notification) bị trễ hoặc gửi callback lặp lại (Idempotency).
   - Tác động đồng bộ CSDL giữa phân hệ E-Commerce Web với hệ thống Kế toán/ERP khi ghi nhận doanh thu và dòng tiền chiết khấu phân bổ line-item.
4. **Exploratory Insights (Góc nhìn kiểm thử thăm dò thực chiến)**:
   - Thử nghiệm người dùng mở 2 trình duyệt/tab đồng thời trên cùng 1 tài khoản và bấm áp 2 mã khác nhau.
   - Thử nghiệm chuyển đổi qua lại giữa phương thức COD và Cổng thanh toán online sau khi đã áp mã giảm giá.

---

## 5. Kết luận Kiểm định (Review Verdict)

- **Review Verdict**: **`FIX`**
- **Lý do chi tiết**:
  1. **Kết quả rà soát 3 góc nhìn**: Bộ Test Suite đã đạt độ phủ rất cao (10/10 Business Rules gốc và 6/6 Missing Rules có Test Case ánh xạ, 9/9 Viewpoints được phân bổ hợp lý, các giá trị biên quan trọng nhất đã được bao phủ).
  2. **Căn cứ kết luận FIX**: Căn cứ theo quy chuẩn kiểm soát chất lượng, phát hiện **04 lỗ hổng kiểm thử (Test Gaps)** chi tiết thuộc các quy tắc `MR-02` (nhập khoảng trắng), `MR-03` (áp kết hợp 2 mã tiền cố định VNĐ), `MR-05` (kiểm tra trạng thái mã sau quy trình Trả hàng/Hoàn tiền), và `MR-01` (tranh chấp lượt dùng tuần tự).
  3. **Hành động tiếp theo**: Đề xuất bổ sung ngay 04 Test Cases từ `VOUCHER-048` đến `VOUCHER-051` (đã đặc tả rõ ràng Precondition, Input, Test Steps và Expected Result tại Mục 3) vào tài liệu Test Case Specification trước khi tiến hành nghiệm thu và ký duyệt bàn giao chính thức.
