# REQUIREMENT & RISK ANALYSIS REPORT · function-d
Owner: agents/qa-analyst/01-requirement-risk-summary · Nguồn: INPUT/Function D.md, INPUT/OVERVIEW.md, knowledge/function-d.md · Verdict: ASK

**Dạng tài liệu nhận diện**: Prose Document (Đặc tả yêu cầu dạng văn xuôi & Bản đồ tính năng)

---

## 1. FEATURE OVERVIEW
Chức năng cho phép khách hàng nhập mã giảm giá (Voucher) tại màn hình Thanh toán của hệ thống thương mại điện tử ShopGo để được giảm trừ tiền vào tổng đơn hàng theo tỷ lệ phần trăm (%) có quy định trần giảm tối đa hoặc số tiền cố định (VNĐ) giảm tối đa về 0 VNĐ khi thỏa mãn các điều kiện quy định. Mỗi khách hàng chỉ được dùng mỗi mã 1 lần duy nhất, hệ thống không cho phép cộng dồn nhiều mã (chỉ áp dụng đè thay thế).

---

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản ShopGo; có quyền nhập mã giảm giá và áp dụng voucher tại màn hình Thanh toán khi đặt hàng. Mỗi mã chỉ được áp dụng 01 lần duy nhất cho mỗi tài khoản.
- **Khách vãng lai (Guest)**: Có thể xem danh mục sản phẩm, thêm hàng vào giỏ; bắt buộc phải đăng nhập khi tiến hành thanh toán để có thể áp dụng mã giảm giá.
- **Hệ thống (System)**: Tự động kiểm tra tính hợp lệ của mã (tồn tại, thời hạn hiệu lực, giá trị đơn hàng tối thiểu, giới hạn lượt dùng của user), tính toán mức chiết khấu (ràng buộc Max Discount Cap, giảm tối đa về 0đ), cập nhật lại tổng tiền đơn hàng, cảnh báo và hủy mã khi giỏ hàng thay đổi không đủ điều kiện, tự động hoàn lại lượt dùng mã khi đơn hàng bị hủy.
- **Nhân viên CSKH / Admin (Back-office)**: Quản lý cấu hình, tạo mới, chỉnh sửa mã giảm giá tại hệ thống quản trị (nằm ngoài phạm vi kiểm thử chi tiết của chức năng này).

---

## 3. BUSINESS RULES
| ID | Nội dung quy tắc nghiệp vụ | Nguồn gốc | Trạng thái |
|:---|:---|:---|:---|
| **BR-01** | Có 2 loại mã giảm giá: giảm theo phần trăm (%) và giảm theo số tiền cố định (VNĐ). | `INPUT/Function D.md` §1 | Confirmed |
| **BR-02** | Mã chỉ dùng được khi đơn hàng đạt giá trị tối thiểu quy định của mã (Min Order Value). | `INPUT/Function D.md` §1 | Confirmed |
| **BR-03** | Mỗi mã giảm giá có ngày hết hạn xác định. | `INPUT/Function D.md` §1 | Confirmed |
| **BR-04** | Áp dụng thành công → Hệ thống hiển thị số tiền được giảm và tổng tiền thanh toán mới sau giảm. | `INPUT/Function D.md` §1 | Confirmed |
| **BR-05** | Mã không hợp lệ hoặc hết hạn → Hiển thị thông báo lỗi tương ứng cho người dùng. | `INPUT/Function D.md` §1 | Confirmed |
| **BR-06** | Vị trí thao tác: Tại trang Thanh toán, có ô nhập "Mã giảm giá" và nút "Áp dụng". | `INPUT/Function D.md` §1 | Confirmed |
| **BR-07** | Khách hàng bắt buộc phải đăng nhập khi tiến hành thanh toán (khách vãng lai được yêu cầu đăng nhập). | `INPUT/OVERVIEW.md` §3 | Confirmed |
| **BR-08** | Mỗi khách hàng chỉ được áp dụng mỗi mã giảm giá 01 lần duy nhất trên tài khoản của mình. | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |
| **BR-09** | Không áp dụng cộng dồn nhiều mã giảm giá cùng lúc; khi nhập mã mới hợp lệ sẽ áp đè và thay thế mã hiện tại. | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |
| **BR-10** | Mã giảm số tiền cố định có giá trị lớn hơn tổng tiền đơn hàng thì tổng tiền thanh toán giảm tối đa về 0 VNĐ (không tạo số tiền âm). | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |
| **BR-11** | Mã giảm giá theo phần trăm (%) có quy định mức giảm tối đa (Max Discount Cap). | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |
| **BR-12** | Mã giảm giá chỉ áp dụng giảm trực tiếp trên giá trị đơn hàng (tiền hàng), không áp dụng giảm trừ trên phí vận chuyển. | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |
| **BR-13** | Khi thay đổi giỏ hàng khiến đơn hàng không còn đủ giá trị tối thiểu, hệ thống hiển thị cảnh báo và tự động hủy voucher. | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |
| **BR-14** | Khi đơn hàng đã áp mã bị hủy, lượt sử dụng mã sẽ được tự động hoàn lại cho tài khoản khách hàng. | `knowledge/function-d.md` (BA/PO chốt) | Confirmed |

---

## 4. HAPPY PATH
1. **Tiền điều kiện**: Khách hàng đã đăng nhập tài khoản ShopGo hợp lệ, đã chọn sản phẩm vào giỏ hàng và chuyển đến trang **Thanh toán**.
2. **Thao tác**: Khách hàng nhập mã giảm giá hợp lệ (mã tồn tại, còn hạn sử dụng, chưa từng dùng, giá trị đơn hàng đạt mức tối thiểu) vào ô *"Mã giảm giá"*.
3. **Thực hiện**: Khách hàng nhấn nút **"Áp dụng"**.
4. **Kết quả mong đợi**:
   - Hệ thống xác thực thành công mã giảm giá.
   - Hiển thị rõ ràng số tiền được giảm trừ (áp dụng Max Cap nếu là mã %, hoặc giảm tối đa về 0 VNĐ nếu là mã tiền cố định).
   - Cập nhật và hiển thị tổng tiền thanh toán mới sau khi giảm trừ.
   - Trạng thái mã được ghi nhận liên kết tạm thời với đơn hàng chờ thanh toán.

---

## 5. ALTERNATE FLOWS
- **AF-01 (Mã không tồn tại / sai định dạng)**: Khách hàng nhập mã không tồn tại trong hệ thống hoặc chứa ký tự không hợp lệ → Nhấn "Áp dụng" → Hệ thống hiển thị thông báo lỗi *"Mã giảm giá không hợp lệ"*, giữ nguyên tổng tiền đơn hàng ban đầu.
- **AF-02 (Mã đã hết hạn)**: Khách hàng nhập mã đã quá ngày hết hạn → Nhấn "Áp dụng" → Hệ thống hiển thị thông báo lỗi *"Mã giảm giá đã hết hạn sử dụng"*, không giảm trừ tiền.
- **AF-03 (Chưa đạt giá trị đơn hàng tối thiểu)**: Khách hàng nhập mã có giá trị đơn hàng hiện tại nhỏ hơn Min Order Value của voucher → Nhấn "Áp dụng" → Hệ thống báo lỗi *"Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này"*.
- **AF-04 (Áp đè / Thay thế mã giảm giá)**: Khách hàng đã áp dụng thành công mã A, sau đó nhập tiếp mã B hợp lệ và nhấn "Áp dụng" → Hệ thống tự động gỡ bỏ mã A, áp dụng mã B và tính toán lại tổng tiền mới.
- **AF-05 (Thay đổi giỏ hàng sau khi áp mã)**: Khách hàng quay lại giỏ hàng giảm bớt số lượng/sản phẩm khiến tổng tiền hàng thấp hơn Min Order Value của mã đã áp → Quay lại trang Thanh toán → Hệ thống cảnh báo đơn không đủ điều kiện và tự động hủy mã voucher đã chọn, tính lại giá gốc.
- **AF-06 (Mã đã từng được sử dụng bởi user)**: Khách hàng nhập mã hợp lệ nhưng tài khoản này đã sử dụng mã đó trong một đơn hàng trước đây → Nhấn "Áp dụng" → Hệ thống báo lỗi *"Bạn đã sử dụng mã giảm giá này rồi"*.
- **AF-07 (Mã giảm tiền cố định > tổng giá trị đơn hàng)**: Đơn hàng trị giá 100.000 VNĐ, khách hàng áp mã giảm 150.000 VNĐ → Hệ thống giảm tối đa 100.000 VNĐ, hiển thị tổng tiền thanh toán là 0 VNĐ.

---

## 6. OUT OF SCOPE
- Chức năng quản lý, tạo mới, phát hành, chỉnh sửa cấu hình mã giảm giá ở Back-office / Admin portal.
- Quy trình tích hợp thanh toán qua thẻ ngân hàng, cổng thanh toán bên thứ ba và quản lý số dư Ví điện tử ShopGo (thuộc Function E & F).
- Ứng dụng native mobile app trên iOS/Android (chỉ tập trung Web responsive trên Desktop và Mobile Web).
- Kiểm thử tải cao và hiệu năng chịu tải đồng thời lớn (Load/Stress Testing).
- Tích hợp hệ thống quản lý kho vận ERP / Logistics vận chuyển.

---

## 7. OPEN QUESTIONS (Áp dụng kỹ thuật 06W)
> Bắt buộc tối thiểu 5 câu hỏi đào sâu kẽ hở kết hợp kỹ thuật 06W.

| # | Mã | Câu hỏi làm rõ cho BA / PO | Thuộc nhóm 06W | Mức độ rủi ro | Trạng thái |
|:---|:---|:---|:---|:---|:---|
| 1 | **Q-01** | Khi khách hàng nhập mã có khoảng trắng thừa ở đầu/cuối chuỗi (do copy-paste), hệ thống có tự động cắt tỉa (trim whitespace) không hay báo lỗi không hợp lệ? | **W1 (Input lạ)** | MED | Chờ trả lời |
| 2 | **Q-02** | Mã giảm giá có phân biệt chữ hoa / chữ thường (Case-sensitive) không? (Ví dụ: `SHOPGO10` vs `shopgo10`). | **W1 (Input lạ)** | LOW | Chờ trả lời |
| 3 | **Q-03** | Trong lúc khách hàng đang ở màn hình Thanh toán, nếu phiên đăng nhập (Session) hết hạn hoặc tài khoản bị khóa thì khi bấm "Áp dụng" hệ thống hiển thị thông báo gì (modal login tại chỗ hay redirect ra trang Login)? | **W2 (State lạ)** | HIGH | Chờ trả lời |
| 4 | **Q-04** | Quy tắc làm tròn số tiền chiết khấu đối với mã giảm giá theo phần trăm (%) có kết quả số tiền lẻ thập phân được xử lý như thế nào (làm tròn lên/xuống hay làm tròn đến hàng đơn vị đồng)? | **W3 (Data lạ)** | MED | Chờ trả lời |
| 5 | **Q-05** | Mốc thời gian hết hạn của mã giảm giá: Hết hạn vào ngày `YYYY-MM-DD` được hiểu chính xác là `00:00:00` hay `23:59:59` theo múi giờ nào (GMT+7)? | **W4 (Timing)** | HIGH | Chờ trả lời |
| 6 | **Q-06** | Khi khách hàng đã áp mã thành công và đang ở màn hình Thanh toán, nếu mã giảm giá bị Admin vô hiệu hóa/hết hạn hoặc đơn hàng bị thay đổi giá từ server trước khi khách bấm "Đặt hàng", hệ thống có cơ chế Re-validate tại thời điểm chốt đơn không? | **W4 (Timing)** | HIGH | Chờ trả lời |
| 7 | **Q-07** | Hệ thống có cơ chế phòng chống Brute-force / Rate limit (giới hạn số lần nhập sai mã liên tiếp) để ngăn chặn hành vi dò quét mã voucher tự động không? | **W6 (What happens after)** | HIGH | Chờ trả lời |

---

## 8. BUSINESS CRITICALITY ASSESSMENT
- **Trạng thái dữ liệu bối cảnh**: `[CONTEXT_MISSING]` (Chưa có đầy đủ dữ liệu SLA, số lượng người dùng đồng thời, giá trị giao dịch trung bình trong `knowledge/_project.md`).
- **Bối cảnh nghiệp vụ ghi nhận**:
  - Khách hàng là người mua sắm trực tuyến bán lẻ tại Việt Nam (`INPUT/OVERVIEW.md` §1, §2).
  - Tính năng Áp dụng Voucher là động lực chuyển đổi mua hàng (Conversion Rate) then chốt ở khâu Thanh toán.
  - Lỗi tính toán sai tiền khuyến mãi hoặc lỗi không áp được mã sẽ trực tiếp dẫn đến bỏ giỏ hàng (Cart Abandonment) hoặc thất thoát tài chính doanh nghiệp.

---

## 9. MISSING RISK CONTEXT INFORMATION

### 9.1 Chi tiết theo 5 khía cạnh
1. **Missing User Context**:
   - *Dữ liệu thiếu*: Tỷ lệ người dùng mới (Guest) so với người dùng trung thành (Registered Customer); phân bổ truy cập Desktop vs Mobile Web.
   - *Ảnh hưởng*: Khó xác định độ ưu tiên tối ưu giao diện trên Mobile Web và độ nhạy cảm của luồng bắt buộc login đối với Guest.
   - *Mức độ*: **MED**
2. **Missing Usage Context**:
   - *Dữ liệu thiếu*: Lưu lượng truy cập giờ cao điểm (Flash Sale / Ngày hội mua sắm Mega Sale), tần suất nhập mã/giây.
   - *Ảnh hưởng*: Chưa đủ cơ sở đánh giá rủi ro tranh chấp tài nguyên (Concurrency / Race Condition) khi số lượng voucher có hạn phát hành cùng lúc.
   - *Mức độ*: **HIGH**
3. **Missing Financial Context**:
   - *Dữ liệu thiếu*: Giá trị đơn hàng trung bình (AOV), ngân sách khuyến mãi tối đa cho từng chiến dịch voucher, chính sách bồi hoàn nếu xảy ra lỗi áp mã.
   - *Ảnh hưởng*: Khó lượng hóa mức độ thiệt hại tài chính tối đa khi xảy ra lỗ hổng áp mã nhiều lần hoặc tính sai công thức giảm giá.
   - *Mức độ*: **HIGH**
4. **Missing Operational Context**:
   - *Dữ liệu thiếu*: Cam kết thời gian phản hồi API voucher (SLA latency), quy trình CSKH xử lý khiếu nại khi khách bị mất mã hoặc mã lỗi.
   - *Ảnh hưởng*: Khó xác định ngưỡng timeout và kịch bản fallback khi service voucher phản hồi chậm.
   - *Mức độ*: **MED**
5. **Missing Criticality Context**:
   - *Dữ liệu thiếu*: Mức độ ưu tiên xếp hạng của Function D so với các module Core Payment và Quản lý Đơn hàng.
   - *Ảnh hưởng*: Khó xác định chiến lược kiểm thử khi thời gian release bị thu hẹp (Time-to-market trade-off).
   - *Mức độ*: **MED**

### 9.2 Tổng hợp bối cảnh rủi ro
- **Available Context**: Nền tảng Responsive Web, người dùng tại Việt Nam, tiền tệ VNĐ, giao diện Tiếng Việt, loại mã % có Max Cap và mã cố định sàn 0đ, quy tắc 1 lần/user, không cộng dồn, hoàn mã khi hủy đơn.
- **Missing Context**: Chưa có dữ liệu số lượng tải cao điểm (Mega Sale), ngân sách chiến dịch, SLA kỹ thuật của service voucher, quy chuẩn phân biệt hoa/thường, quy tắc trim whitespace và rate limit.
- **Risk Analysis Impact**: Các đánh giá Severity và Risk Level về mặt hiệu năng/tài chính tạm thời gắn cờ `[SEVERITY_CONFIDENCE_LOW]` cho tới khi có phản hồi từ PO/BA.

---

## 10. RISK ANALYSIS & PRIORITIZATION

### 10.1 Nguồn đánh giá Risk
- **Business Rules**: 14 quy tắc nghiệp vụ đã xác nhận (BR-01 → BR-14) bao gồm các điều kiện logic chặt chẽ về Min Order Value, Max Cap, 1 lần/user, thay thế mã.
- **Gap Analysis**: Các vùng trống logic về bảo mật (Rate limit), xử lý input biên (trim khoảng trắng, case sensitivity), timing (múi giờ hết hạn, re-validate trước khi đặt hàng) thu được từ 7 Open Questions.
- **Business Criticality Assessment**: Tính năng khuyến mãi ảnh hưởng trực tiếp đến doanh thu và trải nghiệm chốt đơn của khách hàng.
- **Missing Risk Context Information**: Thiếu thông tin tải cao điểm và ngân sách tối đa đòi hỏi kiểm thử bao quát cả khía cạnh tính đúng đắn lẫn an toàn tài chính.

### 10.2 Ma trận Đánh giá Rủi ro (3x3)
| Mã rủi ro | Mô tả rủi ro | Likelihood | Impact | Risk Level | Severity | Cờ tin cậy | Lý do (5 yếu tố Impact) |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **RK-01** | Lỗ hổng áp mã nhiều lần (Bypass quy tắc 1 lần/user bằng thao tác đồng thời hoặc mở nhiều tab thanh toán) | MED | HIGH | **HIGH** | Critical | `[SEVERITY_CONFIDENCE_LOW]` | Thất thoát ngân sách khuyến mãi trực tiếp, ảnh hưởng lớn tới doanh thu và vận hành nếu bị lợi dụng quy mô lớn. |
| **RK-02** | Tính toán sai số tiền chiết khấu (vượt Max Cap cho mã % hoặc tính ra số tiền thanh toán âm cho mã số tiền cố định) | LOW | HIGH | **MEDIUM** | Critical | `[SEVERITY_CONFIDENCE_LOW]` | Sai lệch tài chính nghiêm trọng, vi phạm quy tắc kế toán và gây thiệt hại trực tiếp trên mỗi giao dịch. |
| **RK-03** | Khách hàng sửa giỏ hàng làm giảm tổng tiền dưới Min Order Value nhưng voucher vẫn được giữ nguyên | MED | HIGH | **HIGH** | Major | `[SEVERITY_CONFIDENCE_LOW]` | Khách hàng lách luật Min Order để hưởng chiết khấu không đúng điều kiện chiến dịch. |
| **RK-04** | Tranh chấp thời gian hết hạn voucher (Mã hết hạn giữa lúc áp mã và lúc bấm Đặt hàng nhưng hệ thống không re-validate) | MED | MED | **MEDIUM** | Major | `[SEVERITY_CONFIDENCE_LOW]` | Gây khiếu nại CSKH gay gắt từ người dùng nếu bị từ chối đơn hàng hoặc gây thiệt hại cho shop. |
| **RK-05** | Bị Brute-force / Quét tự động danh sách mã giảm giá do thiếu cơ chế Rate Limit | HIGH | MED | **HIGH** | Major | `[SEVERITY_CONFIDENCE_LOW]` | Lộ các mã voucher nội bộ/VIP, gây quá tải hệ thống và thất thoát chiết khấu. |
| **RK-06** | Khách nhập đúng mã nhưng dính khoảng trắng thừa hoặc chữ thường bị hệ thống báo lỗi không hợp lệ | HIGH | LOW | **MEDIUM** | Minor | `[SEVERITY_CONFIDENCE_HIGH]` | Giảm trải nghiệm người dùng (UX), tăng tỷ lệ bỏ giỏ hàng ngay tại bước cuối cùng. |
| **RK-07** | Không hoàn lại lượt sử dụng mã khi đơn hàng bị hủy bỏ | MED | MED | **MEDIUM** | Major | `[SEVERITY_CONFIDENCE_LOW]` | Gây mất niềm tin người dùng, phát sinh khối lượng lớn ticket hỗ trợ cho đội ngũ CSKH. |

### 10.3 Đánh giá tác động chiến lược
- **Impact to Risk Analysis**: Cần sớm làm rõ các câu hỏi trong mục 7 (đặc biệt về Re-validate, Rate limit, Timezone) để nâng mức tin cậy từ `[SEVERITY_CONFIDENCE_LOW]` lên mức High.
- **Impact to Test Prioritization**:
  1. *Ưu tiên 1 (Critical/High Risk)*: Kiểm thử tính đúng đắn của công thức tính tiền (Max Cap, sàn 0đ, không trừ phí ship) và kiểm tra ràng buộc 1 lần/user.
  2. *Ưu tiên 2 (High Risk / State Changing)*: Kiểm thử luồng tự động hủy mã khi giỏ hàng đổi dưới Min Order, luồng hoàn mã khi hủy đơn và luồng áp đè mã.
  3. *Ưu tiên 3 (Input & Edge Cases)*: Kiểm thử xử lý chuỗi ký tự lạ, khoảng trắng, chữ hoa/thường, mã hết hạn biên `min/max`.
- **Impact to Coverage Strategy**:
  - *Deep Testing & Automation*: Áp dụng cho các ca kiểm thử tính toán chiết khấu (Equivalence Partitioning & Boundary Value Analysis), quy tắc ràng buộc trạng thái giỏ hàng và re-validate.
  - *Exploratory / Sanity*: Áp dụng cho trải nghiệm giao diện responsive trên đa trình duyệt/thiết bị di động và các thông điệp cảnh báo lỗi.

---

## ASK
| # | Vị trí | Cần gì | Chuyển cho ai |
|:---|:---|:---|:---|
| 1 | Mục 7 (Q-01) | Xác nhận hành vi tự động trim khoảng trắng đầu/cuối của ô nhập mã giảm giá | BA / PO |
| 2 | Mục 7 (Q-02) | Xác nhận quy tắc phân biệt hoa/thường (Case-sensitive) của mã voucher | BA / PO |
| 3 | Mục 7 (Q-03) | Xác nhận hành vi khi hết hạn phiên / tài khoản bị khóa trong lúc áp mã thanh toán | BA / PO |
| 4 | Mục 7 (Q-04) | Xác nhận quy tắc làm tròn số tiền chiết khấu lẻ đối với mã phần trăm (%) | BA / PO |
| 5 | Mục 7 (Q-05) | Xác nhận mốc thời gian hết hạn chính xác và Timezone quy chuẩn | BA / PO |
| 6 | Mục 7 (Q-06) | Xác nhận cơ chế Re-validate mã voucher tại thời điểm bấm nút Đặt hàng | BA / Tech Lead |
| 7 | Mục 7 (Q-07) | Xác nhận yêu cầu Rate Limit / Chống brute-force ô nhập voucher | Tech Lead / Security |
