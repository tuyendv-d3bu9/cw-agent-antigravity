# REQUIREMENT & RISK ANALYSIS REPORT · function-d
Owner: qa-analyst/01-requirement-risk-summary · Nguồn: INPUT/Function D.md, INPUT/OVERVIEW.md, Phản hồi làm rõ từ BA/PO (2026-08-23) · Verdict: PASS

**Dạng tài liệu nhận diện**: Prose Document (Tài liệu đặc tả yêu cầu dạng văn bản kết hợp bối cảnh tổng quan & Clarification chính thức)

---

## 1. FEATURE OVERVIEW
Chức năng **Áp dụng Mã Giảm Giá (Voucher)** tại bước Thanh toán của hệ thống thương mại điện tử ShopGo cho phép khách hàng nhập mã khuyến mãi để được giảm trừ giá trị đơn hàng theo tỷ lệ phần trăm (%) có mức trần giảm tối đa hoặc theo số tiền cố định (VNĐ) giảm tối đa về 0 VNĐ. Mỗi khách hàng chỉ được dùng mỗi mã 1 lần duy nhất, không áp dụng cộng dồn nhiều mã, và mã chỉ áp dụng cho giá trị đơn hàng. Mục đích cốt lõi là kích cầu mua sắm và gia tăng trải nghiệm thanh toán chính xác, minh bạch, an toàn cho hệ thống và người dùng.

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản trên ShopGo, tiến hành đặt hàng tại trang Thanh toán, nhập, áp dụng, thay thế mã giảm giá hợp lệ (mỗi mã 1 lần/tài khoản).
- **Khách vãng lai (Guest)**: Được duyệt sản phẩm và thêm vào giỏ hàng, nhưng bắt buộc phải đăng nhập tài khoản khi thực hiện Thanh toán để áp dụng mã giảm giá.
- **Hệ thống (System - ShopGo Platform)**: Tự động tiếp nhận mã, xác thực điều kiện hợp lệ (thời hạn, đơn tối thiểu, loại mã, giới hạn 1 lần/user), tính toán mức giảm (áp dụng trần giảm % hoặc sàn 0 VNĐ), cập nhật tổng tiền mới, cảnh báo và hủy mã khi giỏ hàng thay đổi không còn đạt điều kiện, tự động hoàn lượt mã khi hủy đơn.
- **Nhân viên CSKH / Admin (Back-office)**: Quản lý cấu hình, phát hành và kiểm soát voucher (thuộc bối cảnh hệ thống, ngoài phạm vi test chi tiết của tính năng này).

## 3. BUSINESS RULES
- **BR-01**: Hệ thống hỗ trợ 2 loại mã giảm giá: giảm theo tỷ lệ phần trăm (%) và giảm theo số tiền cố định (VNĐ).
- **BR-02**: Mã giảm giá chỉ có hiệu lực áp dụng khi giá trị đơn hàng đạt hoặc vượt mức giá trị tối thiểu quy định riêng của mã đó.
- **BR-03**: Mỗi mã giảm giá có ngày hết hạn xác định; sau thời điểm hết hạn mã sẽ không còn giá trị sử dụng.
- **BR-04**: Khi áp dụng mã thành công, hệ thống phải hiển thị rõ ràng số tiền được giảm trừ và tổng tiền thanh toán mới sau khi giảm.
- **BR-05**: Khi mã không hợp lệ (không tồn tại, sai ký tự, chưa đủ điều kiện đơn tối thiểu, đã hết hạn, hoặc đã qua sử dụng), hệ thống phải hiển thị thông báo lỗi cụ thể tương ứng cho người dùng.
- **BR-06**: Vị trí giao diện: Tại trang Thanh toán, cung cấp ô nhập văn bản "Mã giảm giá" và nút tương tác "Áp dụng".
- **BR-07**: Khách hàng bắt buộc phải ở trạng thái đã đăng nhập tài khoản tại bước Thanh toán để sử dụng mã giảm giá.
- **BR-08** *(Đã xác nhận)*: Mỗi khách hàng chỉ được áp dụng mỗi mã giảm giá **01 lần duy nhất**.
- **BR-09** *(Đã xác nhận)*: Không hỗ trợ cộng dồn nhiều mã giảm giá trong cùng 1 đơn hàng. Khi khách hàng nhập và áp dụng mã mới, hệ thống sẽ **áp đè và thay thế** mã đang áp dụng hiện tại.
- **BR-10** *(Đã xác nhận)*: Đối với mã giảm theo số tiền cố định, nếu giá trị giảm lớn hơn tổng giá trị đơn hàng thì số tiền thanh toán được giảm tối đa **về 0 VNĐ** (không phát sinh tiền âm).
- **BR-11** *(Đã xác nhận)*: Đối với mã giảm theo tỷ lệ phần trăm (%), hệ thống có áp dụng quy định **mức giảm tối đa (Max Discount Cap)**.
- **BR-12** *(Đã xác nhận)*: Mã giảm giá **chỉ áp dụng giảm trừ trực tiếp trên giá trị đơn hàng**, không áp dụng giảm trừ cho phí vận chuyển hay các dịch vụ khác.
- **BR-13** *(Đã xác nhận)*: Trường hợp khách hàng thay đổi giỏ hàng sau khi đã áp mã khiến đơn hàng không còn đủ giá trị tối thiểu, hệ thống sẽ hiển thị **cảnh báo và tự động hủy voucher**, tính toán lại tổng tiền gốc.
- **BR-14** *(Đã xác nhận)*: Khi đơn hàng đã áp mã giảm giá bị hủy, **lượt sử dụng của mã sẽ được tự động hoàn lại** cho tài khoản khách hàng để có thể sử dụng cho đơn hàng sau.

## 4. HAPPY PATH
1. Khách hàng đã đăng nhập tài khoản, có sản phẩm trong giỏ hàng và tiến hành điều hướng đến trang **Thanh toán**.
2. Khách hàng quan sát thấy khu vực "Mã giảm giá" gồm ô nhập liệu và nút "Áp dụng".
3. Khách hàng nhập một mã giảm giá hợp lệ (mã còn hạn, tài khoản chưa từng dùng mã này, tổng giá trị đơn hàng đạt hoặc vượt mức tối thiểu).
4. Khách hàng nhấn nút **"Áp dụng"**.
5. Hệ thống xác thực thành công, tính toán mức giảm (tuân thủ mức trần tối đa nếu là mã % hoặc không vượt quá tổng đơn về 0 VNĐ nếu là mã tiền cố định), hiển thị số tiền được giảm (VNĐ) và tự động cập nhật tổng tiền đơn hàng phải thanh toán.

## 5. ALTERNATE FLOWS
### AF-01: Áp dụng mã không tồn tại / sai định dạng
1. Tại trang Thanh toán, khách hàng nhập mã giảm giá không tồn tại trong hệ thống hoặc chứa định dạng không hợp lệ.
2. Khách hàng nhấn nút **"Áp dụng"**.
3. Hệ thống kiểm tra và trả về thông báo lỗi: Mã giảm giá không hợp lệ/không tồn tại.
4. Tổng tiền đơn hàng giữ nguyên không thay đổi, không phát sinh chiết khấu.

### AF-02: Áp dụng mã đã hết hạn sử dụng
1. Tại trang Thanh toán, khách hàng nhập mã giảm giá đã qua ngày hết hạn.
2. Khách hàng nhấn nút **"Áp dụng"**.
3. Hệ thống trả về thông báo lỗi: Mã giảm giá đã hết hạn sử dụng.
4. Tổng tiền đơn hàng giữ nguyên không thay đổi.

### AF-03: Đơn hàng chưa đạt giá trị tối thiểu của mã
1. Tại trang Thanh toán, khách hàng nhập mã giảm giá hợp lệ nhưng giá trị đơn hàng hiện tại nhỏ hơn mức tối thiểu quy định của mã.
2. Khách hàng nhấn nút **"Áp dụng"**.
3. Hệ thống trả về thông báo lỗi nêu rõ đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã.
4. Tổng tiền đơn hàng giữ nguyên không thay đổi.

### AF-04: Áp dụng mã mới thay thế mã hiện tại (Áp đè mã)
1. Khách hàng đã áp dụng thành công Mã A vào đơn hàng.
2. Khách hàng nhập tiếp Mã B hợp lệ vào ô "Mã giảm giá" và bấm **"Áp dụng"**.
3. Hệ thống hủy áp dụng Mã A, áp dụng Mã B, cập nhật lại dòng chiết khấu theo Mã B và tính lại tổng tiền đơn hàng mới.

### AF-05: Đơn hàng bị thay đổi sau khi đã áp mã thành công
1. Khách hàng đã áp dụng thành công mã giảm giá có điều kiện đơn tối thiểu (ví dụ: tối thiểu 300.000 VNĐ).
2. Khách hàng quay lại chỉnh sửa giỏ hàng (giảm số lượng/xóa bớt sản phẩm) khiến tổng giá trị đơn hàng giảm xuống dưới 300.000 VNĐ.
3. Khi quay lại trang Thanh toán / cập nhật giỏ hàng, hệ thống phát hiện không còn đủ điều kiện, hiển thị thông báo cảnh báo và tự động hủy mã giảm giá, trả lại tổng tiền nguyên bản chưa giảm.

### AF-06: Áp dụng mã đã từng sử dụng trước đó (Vượt giới hạn 1 lần/user)
1. Khách hàng nhập mã giảm giá mà tài khoản này đã từng sử dụng thành công trong một đơn hàng trước đó.
2. Khách hàng nhấn nút **"Áp dụng"**.
3. Hệ thống kiểm tra lịch sử sử dụng của tài khoản và hiển thị thông báo lỗi: Bạn đã sử dụng mã giảm giá này rồi.
4. Tổng tiền đơn hàng giữ nguyên không thay đổi.

### AF-07: Áp dụng mã giảm cố định lớn hơn tổng giá trị đơn hàng
1. Đơn hàng có tổng tiền 100.000 VNĐ (đạt mức tối thiểu), khách áp mã giảm cố định 150.000 VNĐ.
2. Khách hàng bấm **"Áp dụng"**.
3. Hệ thống áp dụng giảm trừ 100.000 VNĐ, hiển thị tổng tiền đơn hàng thanh toán là **0 VNĐ**.

## 6. OUT OF SCOPE
- Chức năng tạo lập, cấu hình hạn mức, thời gian hiệu lực và phân quyền mã giảm giá tại trang Quản trị Back-office.
- Tích hợp cổng thanh toán bên thứ ba (VNPay, cổng thẻ ngân hàng quốc tế) và xử lý giao dịch trừ tiền/nạp tiền Ví ShopGo (thuộc Function E, F).
- Kiểm thử trên ứng dụng di động gốc (Native App iOS/Android).
- Kiểm thử tải cao và stress testing đồng thời trên toàn bộ máy chủ.

## 7. OPEN QUESTIONS
- **Q1 (W1 - Who & Giới hạn sử dụng)**: Mã giảm giá có quy định giới hạn số lần sử dụng trên từng tài khoản khách hàng (ví dụ: mỗi user chỉ dùng 1 lần) hoặc giới hạn tổng lượt dùng toàn hệ thống hay không?
  - **Trạng thái**: **Đã xác nhận** — Mỗi người dùng chỉ được áp dụng mỗi mã giảm giá **01 lần duy nhất**.
- **Q2 (W2 - What if / Xóa & Đổi mã)**: Sau khi áp dụng mã thành công, khách hàng có thể áp đè hoặc thay đổi sang mã khác trước khi bấm "Đặt hàng" không? Có được áp cùng lúc nhiều mã không?
  - **Trạng thái**: **Đã xác nhận** — Được phép thay thế mã (áp đè mã mới lên mã cũ), **không được áp cùng lúc nhiều mã** (chỉ 1 mã/đơn).
- **Q3 (W3 - Where / Giảm quá giá trị đơn & Mức trần voucher %)**:
  - Trường hợp mã giảm số tiền cố định có giá trị giảm lớn hơn tổng tiền đơn hàng, hệ thống xử lý thế nào?
  - Với voucher giảm theo %, hệ thống có quy định mức trần giảm tối đa (Max Discount Cap) không?
  - **Trạng thái**: **Đã xác nhận** — 
    - Ý 1: Khi áp mã giảm số tiền cố định lớn hơn giá trị đơn hàng, hệ thống giảm tối đa để tổng tiền đơn hàng về **0 VNĐ**.
    - Ý 2: Có quy định mức giảm tối đa (Max Discount Cap) cho mã giảm theo phần trăm (%).
- **Q4 (W4 - When / Thay đổi giỏ hàng sau khi áp mã)**: Sau khi áp mã thành công, nếu khách hàng quay lại giỏ hàng sửa đổi/xóa bớt sản phẩm khiến tổng đơn rơi xuống dưới mức tối thiểu của voucher thì hệ thống xử lý thế nào?
  - **Trạng thái**: **Đã xác nhận** — Hệ thống sẽ tính lại điều kiện voucher khi đơn hàng có sự thay đổi; nếu không còn đủ điều kiện, hệ thống sẽ hiển thị **cảnh báo và tự động hủy voucher**.
- **Q5 (W5 - Which / Phí ship & Đối tượng áp dụng)**: Mã giảm giá áp dụng cho đối tượng nào (tiền hàng hay cả phí vận chuyển)?
  - **Trạng thái**: **Đã xác nhận** — **Chỉ áp dụng giảm giá trực tiếp trên giá trị đơn hàng** (không áp dụng cho phí vận chuyển).
- **Q6 (W6 - Why / Hoàn mã khi hủy đơn)**: Khi đơn hàng đã áp mã giảm giá bị hủy, lượt sử dụng mã giảm giá đó có được tự động hoàn lại cho khách hàng không?
  - **Trạng thái**: **Đã xác nhận** — **Có**, lượt sử dụng mã sẽ được tự động hoàn lại vào tài khoản của khách hàng.

## 8. BUSINESS CRITICALITY ASSESSMENT
- **Trạng thái dữ liệu bối cảnh**: **Đầy đủ sau Clarification**
- **Bối cảnh nghiệp vụ ghi nhận**:
  - Chức năng Áp dụng Voucher nằm ở bước Thanh toán, trực tiếp quyết định số tiền phải thu từ khách hàng.
  - Các quy tắc về giới hạn 1 lần/user, cơ chế áp đè mã (không cộng dồn), sàn tiền 0 VNĐ, trần giảm %, và tự động kiểm tra lại giỏ hàng đã thiết lập một hàng rào kiểm soát tài chính chặt chẽ, ngăn ngừa triệt để các nguy cơ trục lợi voucher.

## 9. MISSING RISK CONTEXT INFORMATION
### 9.1 Chi tiết theo khía cạnh
- **Missing User Context**: Đã xác định rõ: Khách hàng đăng nhập, mỗi khách chỉ dùng mã 1 lần. Vẫn cần lưu ý trường hợp 1 người tạo nhiều tài khoản (fraud) → **Mức độ: LOW**.
- **Missing Usage Context**: Chưa có dữ liệu cụ thể về lưu lượng đỉnh (Peak Concurrency) trong các đợt flash sale → **Mức độ: MED**.
- **Missing Financial Context**: Đã có quy tắc sàn 0 VNĐ và Max Discount Cap cho mã %, ngăn ngừa hoàn toàn lỗi tiền âm và giảm giá vô hạn → **Mức độ: LOW**.
- **Missing Operational Context**: Đã có quy tắc rõ ràng về việc tự động hoàn lượt mã khi đơn hàng bị hủy → **Mức độ: LOW**.
- **Missing Criticality Context**: Đã xác định mức độ quan trọng cao tại cổng thanh toán → **Mức độ: LOW**.

### 9.2 Tổng hợp
- **Available Context**: Quy tắc nghiệp vụ đầy đủ, toàn diện từ tài liệu gốc kết hợp làm rõ chính thức của BA/PO (14 Business Rules, 7 Alternate Flows).
- **Missing Context**: Chỉ còn các thông số tải hạ tầng kỹ thuật (nằm ngoài phạm vi phân tích chức năng).
- **Risk Analysis Impact**: Bức tranh rủi ro đã rõ ràng và có căn cứ xác thực cao, cho phép đánh giá Severity với độ tin cậy cao (`SEVERITY_CONFIDENCE_HIGH`).

## 10. RISK ANALYSIS & PRIORITIZATION
### 10.1 Nguồn đánh giá Risk
- **Business Rules**: 14 Business Rules toàn diện (BR-01 đến BR-14).
- **Gap Analysis**: Các khoảng trống nghiệp vụ đã được làm rõ hoàn toàn qua 6 câu hỏi 06W.
- **Business Criticality Assessment**: Xác định rõ các điểm chạm rủi ro tài chính và trải nghiệm người dùng tại bước Thanh toán.
- **Missing Risk Context Information**: Các khía cạnh tài chính và vòng đời mã đã được bù đắp đầy đủ.

### 10.2 Ma trận Đánh giá Rủi ro (3x3)

| Mã rủi ro | Likelihood | Impact | Risk Level | Severity | Cờ tin cậy | Lý do (5 yếu tố Impact) |
|:---|:---|:---|:---|:---|:---|:---|
| **RK-01: Sai lệch tính toán chiết khấu % vượt mức trần (Max Cap) hoặc sai tiền đơn hàng** | MED | HIGH | **HIGH** | Critical | SEVERITY_CONFIDENCE_HIGH | Sai công thức tính % hoặc không chặn mức trần Max Cap gây thiệt hại tài chính trực tiếp cho doanh nghiệp. |
| **RK-02: Lỗi không hủy voucher khi sửa giỏ hàng làm tổng tiền dưới mức tối thiểu** | HIGH | HIGH | **CRITICAL** | Critical | SEVERITY_CONFIDENCE_HIGH | Người dùng lách luật bằng cách thêm hàng cho đủ min order, áp mã rồi xóa bớt hàng nhưng mã vẫn giảm. |
| **RK-03: Lỗi cho phép 1 khách hàng sử dụng mã nhiều lần (Vượt giới hạn 1 lần/user)** | MED | HIGH | **HIGH** | Major | SEVERITY_CONFIDENCE_HIGH | Khách hàng tái sử dụng mã một lần dẫn đến cạn kiệt ngân sách khuyến mãi. |
| **RK-04: Lỗi cho phép cộng dồn nhiều mã giảm giá thay vì áp đè thay thế** | MED | HIGH | **HIGH** | Major | SEVERITY_CONFIDENCE_HIGH | Nếu hệ thống không hủy mã cũ khi áp mã mới, khách hàng có thể hưởng nhiều ưu đãi cùng lúc. |
| **RK-05: Lỗi tính toán ra số tiền âm khi mã giảm cố định > tổng giá trị đơn hàng** | LOW | HIGH | **MEDIUM** | Major | SEVERITY_CONFIDENCE_HIGH | Hệ thống phải đưa tổng tiền về chính xác 0 VNĐ, không được phát sinh giá trị âm hoặc lỗi Exception gián đoạn checkout. |
| **RK-06: Lỗi không hoàn lại lượt dùng mã khi đơn hàng bị hủy** | MED | MED | **MEDIUM** | Minor | SEVERITY_CONFIDENCE_HIGH | Ảnh hưởng trực tiếp tới quyền lợi và trải nghiệm của khách hàng, gây phát sinh khiếu nại CSKH. |

### 10.3 Đánh giá tác động chiến lược
- **Impact to Risk Analysis**: Đầy đủ cơ sở dữ liệu để chuyển giao cho các bước thiết kế Viewpoint và Test Idea.
- **Impact to Test Prioritization**: Tập trung cao độ vào kiểm thử tính toán biên (BVA cho min order, max cap, giảm về 0đ), kiểm thử chuyển trạng thái giỏ hàng (State Transition / Alternate Flow) và kiểm tra phân quyền tài khoản (1 lần/user).
- **Impact to Coverage Strategy**: Áp dụng Equivalence Partitioning cho các loại voucher, Decision Table cho tổ hợp điều kiện áp mã và áp đè mã.

---

## FIX
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|
| 1 | `INPUT/Function D.md` | Tài liệu thô ban đầu thiếu các rule quan trọng (Max Cap, 1 lần/user, áp đè, hoàn mã) | Đã cập nhật và chuẩn hóa vào `01_requirement_risk_summary.md` và `knowledge/function-d.md` theo phản hồi chính thức của BA/PO |

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
| — | Không còn câu hỏi tồn đọng | Toàn bộ 6 Open Questions đã được xác nhận hoàn tất | — |
