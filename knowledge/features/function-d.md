# Function D: Áp dụng Mã Giảm Giá (Voucher) — Feature Knowledge

> **Knowledge = AI DỰA TRÊN TRI THỨC GÌ.** File này là tri thức nền **per-feature** (dữ kiện của 1 tính năng), tích luỹ dần qua các lần chạy.
> Không chứa các bước thực thi (đó là `skills/`) hay danh tính (đó là `AGENT.md`).

Feature slug: `function-d` · Nguồn: `INPUT/Function D.md`, `INPUT/OVERVIEW.md`, Phản hồi BA/PO · Cập nhật lần cuối: `2026-08-26`

---

## 1. FEATURE OVERVIEW
Chức năng cho phép khách hàng nhập mã giảm giá (Voucher) tại trang Thanh toán của hệ thống thương mại điện tử ShopGo để được giảm trừ tiền vào tổng đơn hàng theo phần trăm (%) có mức trần giảm tối đa hoặc số tiền cố định (VND) giảm tối đa về 0 VNĐ khi thỏa mãn các điều kiện quy định. Mỗi khách hàng chỉ được dùng mỗi mã 1 lần duy nhất, không áp dụng cộng dồn nhiều mã (chỉ áp đè thay thế).

## 2. ACTOR & USER ROLE
- **Khách hàng (Customer)**: Người dùng đã đăng ký/đăng nhập tài khoản, có quyền nhập mã giảm giá, áp dụng voucher tại màn hình Thanh toán khi đặt hàng. Mỗi mã chỉ dùng 1 lần/tài khoản.
- **Khách vãng lai (Guest)**: Có thể xem sản phẩm, thêm giỏ hàng nhưng bắt buộc phải đăng nhập khi tiến hành Thanh toán để áp dụng mã giảm giá.
- **Hệ thống (System)**: Tự động kiểm tra tính hợp lệ của mã (sự tồn tại, thời hạn, giá trị đơn tối thiểu, giới hạn 1 lần/user), tính toán mức giảm (chặn Max Cap, chặn sàn 0đ), cập nhật tổng tiền đơn hàng, cảnh báo và hủy mã khi giỏ hàng thay đổi, hoàn lại lượt dùng khi hủy đơn.
- **Nhân viên CSKH / Admin**: Quản trị cấu hình mã giảm giá ở Back-office (ngoài phạm vi test chi tiết).

## 3. BUSINESS RULES
> Chỉ đưa vào đây rule đã **xác nhận**. Rule còn treo để ở mục 7.

| ID | Nội dung rule | Nguồn (file / mục) | Trạng thái |
|---|---|---|---|
| BR-01 | Có 2 loại mã giảm giá: giảm theo phần trăm (%) và giảm số tiền cố định (VND). | `INPUT/Function D.md` §1 | Confirmed |
| BR-02 | Mã chỉ dùng được khi đơn hàng đạt giá trị tối thiểu quy định của mã. | `INPUT/Function D.md` §1 | Confirmed |
| BR-03 | Mỗi mã giảm giá có ngày hết hạn xác định. | `INPUT/Function D.md` §1 | Confirmed |
| BR-04 | Áp dụng thành công → hệ thống hiển thị số tiền được giảm và tổng tiền mới sau giảm. | `INPUT/Function D.md` §1 | Confirmed |
| BR-05 | Mã không hợp lệ hoặc hết hạn → hiển thị thông báo lỗi tương ứng cho người dùng. | `INPUT/Function D.md` §1 | Confirmed |
| BR-06 | Vị trí thao tác: Tại trang Thanh toán, có ô nhập "Mã giảm giá" và nút "Áp dụng". | `INPUT/Function D.md` §1 | Confirmed |
| BR-07 | Khách hàng phải đăng nhập khi tiến hành thanh toán (khách vãng lai chuyển hướng/yêu cầu đăng nhập). | `INPUT/OVERVIEW.md` §3 | Confirmed |
| BR-08 | Mỗi khách hàng chỉ được áp dụng mỗi mã giảm giá 01 lần duy nhất. | Phản hồi BA/PO (2026-08-23) Q1 | Confirmed |
| BR-09 | Không cộng dồn nhiều mã giảm giá. Khi nhập mã mới sẽ áp đè và thay thế mã hiện tại. | Phản hồi BA/PO (2026-08-23) Q2 | Confirmed |
| BR-10 | Mã giảm cố định có giá trị giảm lớn hơn tổng đơn hàng thì tổng tiền thanh toán giảm tối đa về 0 VNĐ. | Phản hồi BA/PO (2026-08-23) Q3 | Confirmed |
| BR-11 | Mã giảm giá theo phần trăm (%) có quy định mức giảm tối đa (Max Discount Cap). | Phản hồi BA/PO (2026-08-23) Q3 | Confirmed |
| BR-12 | Mã giảm giá chỉ áp dụng giảm trực tiếp trên giá trị đơn hàng (không áp dụng cho phí vận chuyển). | Phản hồi BA/PO (2026-08-23) Q5 | Confirmed |
| BR-13 | Khi thay đổi giỏ hàng khiến đơn hàng không còn đủ giá trị tối thiểu, hệ thống cảnh báo và tự động hủy voucher. | Phản hồi BA/PO (2026-08-23) Q4 | Confirmed |
| BR-14 | Khi đơn hàng đã áp mã bị hủy, lượt sử dụng mã sẽ được tự động hoàn lại cho tài khoản khách hàng. | Phản hồi BA/PO (2026-08-23) Q6 | Confirmed |
| BR-15 | Khi session đăng nhập hết hạn tại trang thanh toán, mở modal login tại chỗ và giữ nguyên ngữ cảnh giỏ hàng cùng mã đang nhập sau khi login lại. | Phản hồi BA/PO (2026-09-16) MR-01 | Confirmed |
| BR-16 | Kiểm tra realtime trạng thái Active của user khi bấm Áp dụng voucher; tài khoản bị khóa sẽ bị từ chối áp dụng và vô hiệu hóa đặt hàng. | Phản hồi BA/PO (2026-09-16) MR-02 | Confirmed |
| BR-17 | Ô nhập mã tự động trim bỏ khoảng trắng ở đầu và cuối chuỗi (`trim()`); khoảng trắng ở giữa bị coi là ký tự không hợp lệ. | Phản hồi BA/PO (2026-09-16) MR-03 | Confirmed |
| BR-18 | Mã giảm giá không phân biệt chữ hoa / chữ thường (`Case-insensitive`), tự động chuẩn hóa sang in hoa khi đối soát. | Phản hồi BA/PO (2026-09-16) MR-04 | Confirmed |
| BR-19 | Độ dài mã hợp lệ từ 3 đến 20 ký tự, chỉ gồm ký tự chữ cái và chữ số `[A-Za-z0-9]`, cấm ký tự đặc biệt. | Phản hồi BA/PO (2026-09-16) MR-05 | Confirmed |
| BR-20 | Tiền chiết khấu lẻ của mã phần trăm (%) được làm tròn xuống (Floor) hàng đơn vị đồng VNĐ gần nhất. | Phản hồi BA/PO (2026-09-16) MR-06 | Confirmed |
| BR-21 | Mốc hết hạn của mã tính chính xác đến 23:59:59 của ngày hết hạn theo múi giờ Việt Nam (GMT+7). | Phản hồi BA/PO (2026-09-16) MR-07 | Confirmed |
| BR-22 | Bắt buộc re-validate kiểm tra lại tính hợp lệ của voucher tại thời điểm khách hàng bấm nút "Đặt hàng". | Phản hồi BA/PO (2026-09-16) MR-08 | Confirmed |
| BR-23 | Thứ tự trừ tiền khi kết hợp Ví ShopGo: Trừ giá trị giảm của Voucher trước, số tiền còn lại mới trừ vào số dư Ví. | Phản hồi BA/PO (2026-09-16) MR-09 | Confirmed |
| BR-24 | Khi biến động giá hoặc tồn kho server khiến tổng đơn không còn đủ giá trị tối thiểu, hệ thống cảnh báo và tự gỡ bỏ voucher. | Phản hồi BA/PO (2026-09-16) MR-10 | Confirmed |
| BR-25 | Cơ chế Rate Limit: Nhập sai mã 5 lần liên tiếp trong 5 phút sẽ tạm khóa ô nhập voucher trong 15 phút. | Phản hồi BA/PO (2026-09-16) MR-11 | Confirmed |
| BR-26 | Thống nhất danh sách thông báo lỗi chi tiết phân biệt từng ca (trống, sai format/không tồn tại, hết hạn, chưa đủ min, đã dùng, rate limit). | Phản hồi BA/PO (2026-09-16) MR-12 | Confirmed |

## 4. HAPPY PATH
1. Khách hàng đã đăng nhập tài khoản, có sản phẩm trong giỏ hàng và tiến hành vào trang **Thanh toán**.
2. Khách hàng nhập mã giảm giá hợp lệ (còn hạn, chưa từng dùng, đơn hàng đạt giá trị tối thiểu) vào ô "Mã giảm giá".
3. Khách hàng nhấn nút **"Áp dụng"**.
4. Hệ thống kiểm tra hợp lệ, hiển thị số tiền được giảm (tuân thủ Max Cap nếu là % hoặc sàn 0đ nếu là số tiền cố định) và cập nhật tổng tiền thanh toán mới của đơn hàng.

## 5. ALTERNATE FLOWS
- **AF-01 (Mã không tồn tại / sai định dạng)**: Khách hàng nhập mã không có trong hệ thống hoặc sai định dạng → Bấm Áp dụng → Hệ thống hiển thị thông báo lỗi mã không hợp lệ, giữ nguyên tổng tiền.
- **AF-02 (Mã đã hết hạn)**: Khách hàng nhập mã đã qua ngày hết hạn → Bấm Áp dụng → Hệ thống báo lỗi mã hết hạn, không áp dụng giảm trừ.
- **AF-03 (Chưa đạt giá trị đơn hàng tối thiểu)**: Khách hàng nhập mã có giá trị đơn hàng hiện tại nhỏ hơn mức tối thiểu yêu cầu → Bấm Áp dụng → Hệ thống báo lỗi chưa đủ điều kiện giá trị đơn hàng tối thiểu.
- **AF-04 (Áp đè / Thay thế mã)**: Khách hàng đang có mã A, nhập mã B hợp lệ rồi bấm Áp dụng → Hệ thống hủy mã A, áp dụng mã B và tính lại tổng tiền mới.
- **AF-05 (Sửa giỏ hàng sau khi áp mã)**: Khách hàng sửa giỏ hàng làm giá trị đơn dưới mức tối thiểu của voucher → Hệ thống hiển thị cảnh báo, tự động hủy voucher và tính lại giá gốc.
- **AF-06 (Mã đã qua sử dụng của user)**: Khách hàng nhập lại mã đã từng sử dụng thành công trước đó → Hệ thống báo lỗi mã đã được sử dụng.
- **AF-07 (Mã giảm cố định > tổng đơn hàng)**: Đơn hàng 100k, áp mã giảm cố định 150k → Hệ thống giảm 100k, tổng tiền thanh toán hiển thị 0 VNĐ.

## 6. OUT OF SCOPE
- Chức năng tạo mới, chỉnh sửa, cấu hình mã giảm giá tại Back-office/Admin.
- Tích hợp cổng thanh toán thẻ, nạp/rút tiền ví điện tử ShopGo (thuộc Function E, F).
- Ứng dụng native mobile app (chỉ test responsive web trên desktop và mobile web).
- Kiểm thử hiệu năng chịu tải lớn (Load/Stress testing).

## 7. OPEN QUESTIONS & MISSING RULES
> Trạng thái mặc định `New`. Người duyệt chuyển: `Confirmed` / `TREO` / `Rejected`.

| ID | Mô tả gap | Loại (06W) | Rủi ro | Câu hỏi cho BA | Trả lời của BA | Trạng thái |
|---|---|---|---|---|---|---|
| GAP-01 | Giới hạn số lần sử dụng của mỗi mã trên từng tài khoản. | W5 (who else actor) | Lạm dụng voucher | Mã có giới hạn lượt dùng mỗi user không? | Có, mỗi người chỉ được áp mã đó 1 lần duy nhất | Confirmed |
| GAP-02 | Quy tắc hủy / thay đổi / áp đè mã giảm giá. | W2 (state lạ) | Khách kẹt mã | Có được áp đè mã khác không? | Được. Khi đè mã, chỉ được thay thế mã, không áp cùng lúc | Confirmed |
| GAP-03 | Mức sàn khi giảm cố định > tổng đơn & Trần giảm giá mã %. | W3 (data lạ) | Giảm tiền âm / quá ngân sách | Tiền giảm > tổng đơn thì sao? Mã % có trần giảm không? | Tiền giảm tối đa về 0đ; Có quy định giảm tối đa theo % (Max Cap) | Confirmed |
| GAP-04 | Xử lý khi giỏ hàng thay đổi sau khi đã áp mã thành công. | W6 (what happens after) | Lách luật giảm giá | Sửa giỏ hàng dưới mức tối thiểu thì xử lý ra sao? | Hệ thống tính lại, cảnh báo và tự động hủy voucher | Confirmed |
| GAP-05 | Phạm vi áp dụng của mã (tiền hàng hay phí ship). | W5 (who else actor) | Sai lệch phí ship | Mã áp dụng cho tiền hàng hay cả phí ship? | Chỉ áp dụng giảm giá đơn hàng (tiền sản phẩm) | Confirmed |
| GAP-06 | Hoàn lại lượt dùng mã khi đơn hàng bị hủy. | W6 (what happens after) | Khiếu nại mất mã | Hủy đơn có hoàn lại lượt dùng mã không? | Có, lượt dùng sẽ hoàn lại cho khách hàng | Confirmed |
| MR-01 | Hết hạn session khi đang ở trang Thanh toán áp mã. | W2 (state lạ) | Lỗi hệ thống / bypass auth | Hết session thì mở modal login tại chỗ hay redirect? | Mở modal đăng nhập tại chỗ; login lại thành công giữ nguyên giỏ hàng và voucher đang nhập dở | Confirmed |
| MR-02 | Tài khoản bị khóa trong lúc đang thao tác thanh toán. | W2 (state lạ) | Gian lận voucher | Có kiểm tra trạng thái Active của user realtime khi áp mã không? | Có kiểm tra realtime; từ chối áp voucher và vô hiệu hóa nút Đặt hàng nếu user bị khóa | Confirmed |
| MR-03 | Xử lý khoảng trắng thừa (trim whitespace) trong ô nhập mã. | W1 (input lạ) | Khách nhập đúng nhưng bị báo lỗi | Có tự động trim khoảng trắng đầu/cuối chuỗi nhập không? | Có tự động trim khoảng trắng đầu/cuối; khoảng trắng ở giữa tính là ký tự không hợp lệ | Confirmed |
| MR-04 | Phân biệt chữ hoa / chữ thường (Case Sensitivity). | W1 (input lạ) | Trải nghiệm người dùng kém | Mã giảm giá có phân biệt hoa/thường (Case-sensitive) không? | Không phân biệt (Case-insensitive); tự động chuẩn hóa sang in hoa khi đối soát | Confirmed |
| MR-05 | Giới hạn độ dài tối đa & ký tự đặc biệt của ô nhập mã. | W1 (input lạ) | Tràn buffer / bảo mật | Độ dài tối đa của mã là bao nhiêu ký tự? | Độ dài 3-20 ký tự, chỉ gồm chữ và số [A-Za-z0-9], cấm ký tự đặc biệt | Confirmed |
| MR-06 | Quy tắc làm tròn số tiền chiết khấu lẻ cho mã %. | W3 (data lạ) | Lệch tiền thanh toán/thối tiền | Làm tròn số lẻ tiền giảm theo quy tắc nào (làm tròn 1đ)? | Làm tròn xuống (Floor) hàng đơn vị đồng VNĐ gần nhất | Confirmed |
| MR-07 | Mốc thời gian hết hạn chính xác và Timezone hiệu lực. | W4 (timing) | Hết hạn sớm trước kỳ vọng | Hạn đến ngày D là 23:59:59 ngày D theo GMT+7 đúng không? | Hết hiệu lực chính xác vào 23:59:59 của ngày hết hạn theo múi giờ GMT+7 (Việt Nam) | Confirmed |
| MR-08 | Re-validate mã tại thời điểm bấm "Đặt hàng". | W4 (timing) | Mã hết hạn giữa chừng | Có kiểm tra lại tính hợp lệ của mã lần cuối khi bấm Đặt hàng không? | Bắt buộc re-validate; nếu voucher không còn hợp lệ thì chặn đặt hàng và báo lỗi | Confirmed |
| MR-09 | Thứ tự trừ tiền kết hợp Ví ShopGo và Voucher. | W5 (who else actor) | Sai lệch số dư ví | Có thống nhất: Trừ voucher trước, sau đó mới trừ số dư ví không? | Trừ voucher trước trên tổng đơn, số tiền còn lại mới trừ vào số dư Ví ShopGo | Confirmed |
| MR-10 | Biến động tồn kho/giá server khi đang ở màn hình thanh toán. | W5 (who else actor) | Lỗi đơn hàng không hợp lệ | Có tự động tính lại giỏ hàng và re-check voucher khi server đổi giá không? | Đồng bộ giá mới realtime; nếu không còn đủ min order thì cảnh báo và tự hủy voucher | Confirmed |
| MR-11 | Cơ chế Rate Limit chống brute-force đoán mã giảm giá. | W6 (what happens after) | Lộ mã nội bộ / quét mã | Có áp dụng Rate Limit (khóa tạm nếu nhập sai 5 lần) không? | Nhập sai 5 lần liên tiếp trong 5 phút thì tạm khóa ô nhập mã trong 15 phút | Confirmed |
| MR-12 | Thống nhất danh sách thông điệp lỗi chi tiết phân biệt từng ca. | W6 (what happens after) | Thông báo lỗi mơ hồ | Có thống nhất danh sách câu thông báo lỗi chi tiết không? | Thống nhất 6 thông báo lỗi chuẩn: trống, không hợp lệ, hết hạn, chưa đủ min, đã dùng, rate limit | Confirmed |

## 8. GIẢ ĐỊNH ĐÃ CHỐT
> Mỗi lần BA/PO trả lời một `[GIẢ ĐỊNH]`, chuyển nó xuống đây. Lần chạy sau agent dùng luôn, không phải giả định lại.

| # | Giả định ban đầu | Kết luận chính thức | Ai chốt | Ngày |
|---|---|---|---|---|
| 1 | Giới hạn lượt dùng của mã | Mỗi khách hàng chỉ được dùng mỗi mã 01 lần duy nhất | BA / PO | 2026-08-23 |
| 2 | Áp dụng nhiều mã đồng thời | Không cộng dồn, chỉ áp đè thay thế mã cũ | BA / PO | 2026-08-23 |
| 3 | Sàn số tiền giảm cố định | Số tiền thanh toán sau giảm tối thiểu là 0 VNĐ | BA / PO | 2026-08-23 |
| 4 | Trần chiết khấu mã % | Có quy định mức giảm tối đa (Max Discount Cap) cho mã % | BA / PO | 2026-08-23 |
| 5 | Thay đổi giỏ hàng sau áp mã | Cảnh báo và tự động hủy voucher nếu không còn đủ min order | BA / PO | 2026-08-23 |
| 6 | Phạm vi chiết khấu | Chỉ giảm trực tiếp trên giá trị đơn hàng, không giảm phí ship | BA / PO | 2026-08-23 |
| 7 | Hoàn mã khi hủy đơn | Tự động hoàn lại lượt dùng cho khách hàng khi hủy đơn | BA / PO | 2026-08-23 |
| 8 | Hết session khi áp mã (MR-01) | Modal login tại chỗ, giữ nguyên giỏ hàng và voucher đang nhập dở | BA / PO | 2026-09-16 |
| 9 | User bị khóa giữa chừng (MR-02) | Check realtime, chặn áp voucher và vô hiệu hóa đặt hàng | BA / PO | 2026-09-16 |
| 10 | Xử lý khoảng trắng thừa (MR-03) | Tự động trim() đầu/cuối chuỗi nhập; khoảng trắng giữa là lỗi | BA / PO | 2026-09-16 |
| 11 | Phân biệt hoa/thường (MR-04) | Case-insensitive; tự chuẩn hóa in hoa khi đối soát | BA / PO | 2026-09-16 |
| 12 | Độ dài & format mã (MR-05) | 3-20 ký tự chữ và số [A-Za-z0-9], cấm ký tự đặc biệt | BA / PO | 2026-09-16 |
| 13 | Làm tròn chiết khấu % (MR-06) | Làm tròn xuống (Floor) hàng đơn vị đồng VNĐ | BA / PO | 2026-09-16 |
| 14 | Mốc hết hạn & Timezone (MR-07) | 23:59:59 ngày hết hạn theo múi giờ GMT+7 (Việt Nam) | BA / PO | 2026-09-16 |
| 15 | Re-validate khi đặt hàng (MR-08) | Bắt buộc re-validate trước khi tạo đơn; lỗi thì chặn đặt hàng | BA / PO | 2026-09-16 |
| 16 | Thứ tự trừ Ví ShopGo (MR-09) | Trừ Voucher trước, sau đó mới trừ số dư Ví | BA / PO | 2026-09-16 |
| 17 | Biến động giá server (MR-10) | Sync realtime; dưới min order thì cảnh báo và tự gỡ voucher | BA / PO | 2026-09-16 |
| 18 | Rate Limit Brute-force (MR-11) | Sai 5 lần / 5 phút -> khóa ô nhập voucher 15 phút | BA / PO | 2026-09-16 |
| 19 | Danh sách thông báo lỗi (MR-12) | 6 mẫu thông báo chuẩn cho từng trường hợp cụ thể | BA / PO | 2026-09-16 |

## 9. DOMAIN CONSTANT của feature này
| Hằng số | Giá trị | Nguồn |
|---|---|---|
| Đơn vị tiền tệ | VND (đồng) | `INPUT/Function D.md` §1 |
| Ngôn ngữ hiển thị | Tiếng Việt | `INPUT/Function D.md` §1 |
| Loại giảm giá | 2 loại: Phần trăm (%) có Max Cap và Số tiền cố định (VND) giảm tối đa về 0đ | `INPUT/Function D.md` §1, Phản hồi BA/PO |
| Giới hạn lượt dùng | 1 lần / mã / tài khoản khách hàng | Phản hồi BA/PO |
| Cơ chế kết hợp | Thay thế (Áp đè), không cộng dồn | Phản hồi BA/PO |
| Nền tảng hỗ trợ | Responsive Web (Desktop Chrome/Edge/Safari, Mobile Web) | `INPUT/OVERVIEW.md` §5 |
| Format mã hợp lệ | `[A-Za-z0-9]{3,20}`, không phân biệt hoa/thường, tự động trim() | Phản hồi BA/PO (2026-09-16) |
| Rate Limit | 5 lần sai / 5 phút -> khóa 15 phút | Phản hồi BA/PO (2026-09-16) |
| Timezone | Asia/Ho_Chi_Minh (GMT+7), hạn chốt 23:59:59 | Phản hồi BA/PO (2026-09-16) |

## 10. TRACEABILITY
| Item | Nguồn (file / mục) |
|---|---|
| BR-01 → BR-06 | `INPUT/Function D.md` §1 |
| BR-07 | `INPUT/OVERVIEW.md` §3 |
| BR-08 → BR-14 | Phản hồi làm rõ chính thức từ BA/PO (2026-08-23) |
| BR-15 → BR-26 | Phản hồi làm rõ chính thức từ BA/PO (2026-09-16) |
| GAP-01 → GAP-06 | Câu hỏi làm rõ từ `01_requirement_risk_summary.md` |
| MR-01 → MR-12 | Phân tích 06W (§4 QA_STANDARD) từ `02_missing_rule_report.md` |
