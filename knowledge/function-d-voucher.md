# Function D: Áp dụng Mã Giảm Giá (Voucher) — Feature Knowledge

> **Knowledge = AI DỰA TRÊN TRI THỨC GÌ.** File này là tri thức nền **per-feature** (dữ kiện của
> 1 tính năng), tích luỹ dần qua các lần chạy.
> KHÔNG chứa các bước thực thi (đó là `skills/`) hay danh tính (đó là `AGENT.md`).

Feature slug: `function-d-voucher` · Nguồn: `INPUT/Function D.md`, `INPUT/OVERVIEW.md`, `OUTPUT/function-d-voucher/02_missing_rule_report.md` · Cập nhật lần cuối: `2026-08-23`

---

## 1. FEATURE OVERVIEW
Tính năng **"Áp dụng Mã Giảm Giá (Voucher)"** (Function D) nằm ở bước Thanh toán thuộc nhóm tính năng E của hệ thống thương mại điện tử ShopGo, cho phép khách hàng nhập mã ưu đãi hợp lệ để nhận chiết khấu (theo phần trăm % hoặc số tiền cố định VNĐ) trên tổng giá trị đơn hàng, giúp kích cầu tiêu dùng và nâng cao trải nghiệm mua sắm.

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký và đăng nhập tài khoản; có quyền truy cập trang Thanh toán, nhập mã voucher, áp dụng chiết khấu, xem số tiền giảm và hoàn tất đơn hàng.
- **Khách vãng lai (Guest)**: Người dùng duyệt sản phẩm và thêm vào giỏ hàng; bắt buộc phải đăng nhập/đăng ký tài khoản (chuyển thành Customer) khi vào bước Thanh toán để sử dụng mã giảm giá.
- **Nhân viên CSKH / Admin (Back-office)**: Quản lý danh mục mã giảm giá, cấu hình điều kiện voucher và giám sát đơn hàng (nằm ngoài phạm vi kiểm thử chi tiết của tính năng này).
- **Hệ thống (ShopGo System)**: Tự động đối soát tính hợp lệ của voucher (tồn tại, hạn dùng, min order value), tính toán số tiền giảm, cập nhật tổng tiền thanh toán mới và hiển thị thông báo kết quả.

## 3. BUSINESS RULES
> Chỉ đưa vào đây rule đã **xác nhận**. Rule còn treo để ở mục 7.

| ID | Nội dung rule | Nguồn (file / mục) | Trạng thái |
|---|---|---|---|
| BR-01 | Tính năng áp dụng mã giảm giá hiển thị tại trang Thanh toán với thành phần giao diện gồm ô nhập "Mã giảm giá" và nút "Áp dụng". | INPUT/Function D.md §1 | Confirmed |
| BR-02 | Khách vãng lai (Guest) bắt buộc phải đăng nhập tài khoản khi thanh toán mới có thể sử dụng mã giảm giá. | INPUT/OVERVIEW.md §3 | Confirmed |
| BR-03 | Hệ thống hỗ trợ 02 loại mã giảm giá: giảm theo phần trăm (%) và giảm theo số tiền cố định (VNĐ). | INPUT/Function D.md §1 | Confirmed |
| BR-04 | Mã giảm giá chỉ áp dụng thành công khi tổng giá trị đơn hàng đạt hoặc vượt giá trị tối thiểu (min order value) do mã quy định. | INPUT/Function D.md §1 | Confirmed |
| BR-05 | Mỗi mã giảm giá đều có thiết lập ngày hết hạn cụ thể. | INPUT/Function D.md §1 | Confirmed |
| BR-06 | Khi áp dụng mã giảm giá thành công, hệ thống phải hiển thị rõ ràng số tiền được giảm và tổng tiền thanh toán mới sau khi chiết khấu. | INPUT/Function D.md §1 | Confirmed |
| BR-07 | Khi mã giảm giá không hợp lệ hoặc đã hết hạn, hệ thống giữ nguyên tổng tiền ban đầu và hiển thị thông báo lỗi phù hợp cho người dùng. | INPUT/Function D.md §1 | Confirmed |
| BR-08 | Hệ thống ShopGo là web app bán lẻ trực tuyến hỗ trợ responsive trên cả giao diện Desktop và Mobile Web. | INPUT/Function D.md §1, OVERVIEW.md §2 | Confirmed |
| BR-09 | Đơn vị tiền tệ hiển thị và thanh toán duy nhất là VNĐ; ngôn ngữ giao diện là tiếng Việt. | INPUT/Function D.md §1, OVERVIEW.md §2 | Confirmed |
| BR-10 | Hệ thống đảm bảo thời gian tải trang chính dưới 3 giây trên các trình duyệt web được hỗ trợ (Chrome, Edge, Safari bản mới). | INPUT/OVERVIEW.md §7 | Confirmed |

## 4. HAPPY PATH
1. Khách hàng (đã đăng nhập) chuyển từ Giỏ hàng sang trang Thanh toán với đơn hàng có tổng giá trị đạt hoặc vượt mức tối thiểu (`min order value`) của voucher.
2. Khách hàng nhập mã giảm giá hợp lệ vào ô "Mã giảm giá".
3. Khách hàng nhấn nút "Áp dụng".
4. Hệ thống kiểm tra tính hợp lệ của mã: xác định mã tồn tại, đang hoạt động, còn hạn sử dụng và đơn hàng thỏa mãn giá trị tối thiểu.
5. Hệ thống tính toán chính xác số tiền giảm (theo % hoặc số tiền cố định VNĐ) và trừ trực tiếp vào tổng tiền đơn hàng.
6. Giao diện trang Thanh toán cập nhật ngay lập tức: hiển thị dòng "Số tiền giảm", hiển thị "Tổng tiền mới" đã chiết khấu, và kích hoạt trạng thái mã đã được áp dụng thành công.

## 5. ALTERNATE FLOWS
- **AF-01**: Khách hàng nhập mã giảm giá đã quá hạn sử dụng → Hệ thống hiển thị thông báo lỗi và giữ nguyên tổng tiền.
- **AF-02**: Khách hàng nhập mã giảm giá không tồn tại / không hợp lệ → Hệ thống hiển thị thông báo lỗi và giữ nguyên tổng tiền.
- **AF-03**: Tổng giá trị đơn hàng chưa đạt giá trị đơn tối thiểu (`min order value`) → Hệ thống hiển thị thông báo lỗi và giữ nguyên tổng tiền.
- **AF-04**: Khách vãng lai (Guest) chưa đăng nhập chuyển sang Thanh toán → Hệ thống yêu cầu đăng nhập trước khi sử dụng voucher.

## 6. OUT OF SCOPE
- Quản lý mã giảm giá trong Back-office Admin.
- Tích hợp cổng thanh toán bên thứ ba chi tiết.
- Tích hợp ERP / Kho.
- Load test / Performance hạ tầng tải cao.
- Native mobile app.

## 7. OPEN QUESTIONS & MISSING RULES
> Trạng thái mặc định `New`. Người duyệt chuyển: `Confirmed` / `TREO` / `Rejected`.

| ID | Mô tả gap | Loại (6W) | Rủi ro | Câu hỏi cho BA | Trả lời của BA | Trạng thái |
|---|---|---|---|---|---|---|
| MR-01 | Phân quyền mã giảm giá theo đối tượng/hạng khách hàng | W1 | Khách hàng không đủ điều kiện vẫn áp được mã ưu đãi nội bộ | Voucher có được phân quyền theo nhóm khách hàng (Khách mới / VIP / Toàn bộ) không, hay áp dụng chung cho mọi Customer? | | New |
| MR-02 | Quy tắc Hủy và Thay đổi mã giảm giá tại trang Thanh toán | W2 | Khách không đổi được mã ưu đãi tốt hơn hoặc UI bị kẹt trạng thái | Hệ thống có hỗ trợ nút "Hủy mã" sau khi đã áp dụng thành công để khách hàng đổi sang mã khác không? | | New |
| MR-03 | Thiết lập Trần giảm giá tối đa (Max Discount Cap) cho mã giảm % | W3 | Thất thoát tài chính nghiêm trọng trên các đơn hàng giá trị lớn | Mã giảm giá % có bắt buộc/tùy chọn thiết lập mức trần giảm giá tối đa (Max Discount Cap) không? | | New |
| MR-04 | Căn cứ tính Giá trị đơn hàng tối thiểu và Chiết khấu (Subtotal vs Total) | W3/W5 | Tính sai tiền chiết khấu hoặc lạm dụng giảm luôn cả phí ship | Ngưỡng `min order value` và số tiền giảm giá được tính trên Tiền hàng (Subtotal) hay Tổng hóa đơn bao gồm cả Phí vận chuyển? | | New |
| MR-05 | Giới hạn số lượt sử dụng voucher (Tổng lượt toàn sàn & Lượt mỗi User) | W4 | Trục lợi mã khuyến mại, cạn kiệt ngân sách tiếp thị | Mỗi mã voucher có giới hạn tổng số lượt sử dụng và số lần áp dụng tối đa trên mỗi tài khoản người dùng không? | | New |
| MR-06 | Cơ chế xử lý hoàn lại voucher khi Đơn hàng bị Hủy hoặc Trả hàng/Hoàn tiền | W4/W5 | Khách mất voucher oan hoặc trục lợi hoàn tiền để quay vòng voucher | Khi đơn hàng bị hủy hoặc hoàn tiền, mã voucher đã dùng có được hoàn trả lại cho khách hàng không? | | New |
| MR-07 | Quy tắc áp dụng đồng thời (Gộp) nhiều voucher trong cùng một đơn hàng | W5 | Lỗ lãi kinh doanh khi khách kết hợp nhiều mã chiết khấu sâu | Một đơn hàng được áp dụng tối đa bao nhiêu voucher? Có cho phép gộp nhiều voucher khác loại không? | | New |
| MR-08 | Xử lý ngoại lệ khi Giá trị giảm giá cố định (VNĐ) lớn hơn Tổng tiền hàng | W2 | Lỗi số học làm tổng tiền âm hoặc lỗi lưu trữ DB | Khi số tiền giảm cố định (VNĐ) lớn hơn tổng tiền hàng, tổng tiền mới sẽ về 0 VNĐ hay có quy tắc nào khác? | | New |
| MR-09 | Tự động tính toán lại chiết khấu khi thay đổi Giỏ hàng sau khi đã áp mã | W5 | Khách hàng lách luật giảm số lượng hàng để giữ nguyên mức chiết khấu | Hệ thống có tự động re-validate và hủy voucher nếu giá trị đơn hàng bị giảm xuống dưới mức tối thiểu sau khi chỉnh sửa giỏ hàng không? | | New |
| MR-10 | Quy tắc làm tròn số tiền chiết khấu lẻ và Phân biệt chữ hoa/chữ thường | W6 | Sai lệch tiền lẻ kết toán; UX khó khăn khi nhập mã hoa/thường | Tiền giảm giá VNĐ có làm tròn đến hàng đơn vị hay quy tròn hàng nghìn? Mã voucher có phân biệt hoa/thường (Case-sensitive) và có tự động trim khoảng trắng không? | | New |

## 8. GIẢ ĐỊNH ĐÃ CHỐT
> Mỗi lần BA/PO trả lời một `[GIẢ ĐỊNH]`, chuyển nó xuống đây. Lần chạy sau agent dùng luôn, không phải giả định lại.

| # | Giả định ban đầu | Kết luận chính thức | Ai chốt | Ngày |
|---|---|---|---|---|
| - | `CHƯA CÓ DATA` | `CHƯA CÓ DATA` | `CHƯA CÓ DATA` | `CHƯA CÓ DATA` |

## 9. DOMAIN CONSTANT của feature này
> Hằng số nghiệp vụ agent cần để sinh data/test case sát thực tế.

| Hằng số | Giá trị | Nguồn |
|---|---|---|
| Đơn vị tiền tệ | `VNĐ` (Việt Nam Đồng) | INPUT/Function D.md §1 |
| Ngôn ngữ hiển thị | `Tiếng Việt` | INPUT/Function D.md §1 |
| Loại mã hỗ trợ | `Giảm theo %` và `Giảm số tiền cố định (VNĐ)` | INPUT/Function D.md §1 |
| NFR Thời gian tải trang | `< 3 giây` | INPUT/OVERVIEW.md §7 |
| Định dạng ngày hết hạn | `YYYY-MM-DD` | knowledge/_project.md §2 |

## 10. TRACEABILITY
> Mọi rule/gap ở trên phải trace được về file nguồn.

| Item | Nguồn (file / mục) |
|---|---|
| BR-01 → BR-07 | INPUT/Function D.md §1 |
| BR-08 → BR-10 | INPUT/OVERVIEW.md §2, §7 |
| MR-01 → MR-10 | 02_missing_rule_report.md §2 |
