# Thuật Ngữ Nghiệp Vụ Toàn Hệ Thống (_glossary.md)

> File này định nghĩa chính xác các thuật ngữ nghiệp vụ xuyên suốt mọi tính năng của dự án.
> Giúp Agent, Tester, BA và Developer hiểu cùng một nghĩa, tránh nhầm lẫn logic khi phân tích.

Dự án: `ShopGo (Thương Mại Điện Tử Bán Lẻ)` · Cập nhật: `2026-09-16`

---

## 1. Khách Hàng & Tài Khoản (Customer & Auth)

| Thuật ngữ | Tiếng Anh tương đương | Định nghĩa chính xác | Ranh giới / Lưu ý |
|---|---|---|---|
| **Khách vãng lai** | Guest User | Người dùng truy cập web chưa đăng nhập. | Được duyệt hàng, thêm giỏ, nhưng **bắt buộc đăng nhập** khi vào trang Thanh toán áp mã. |
| **Khách hàng định danh** | Registered Customer | Tài khoản đã xác thực có User ID, Email/SĐT. | Mỗi tài khoản có hạn mức sử dụng mã voucher riêng biệt. |
| **Tài khoản Active** | Active Account | Tài khoản đang hoạt động bình thường. | Duy nhất trạng thái Active mới được hưởng khuyến mãi. |
| **Tài khoản Locked / Banned** | Locked / Banned | Tài khoản bị tạm khóa hoặc cấm do vi phạm/gian lận. | Hệ thống chặn ngay tại bước validate mã khuyến mãi. |

---

## 2. Khuyến Mãi & Voucher (Promotion & Voucher)

| Thuật ngữ | Tiếng Anh tương đương | Định nghĩa chính xác | Ranh giới / Lưu ý |
|---|---|---|---|
| **Mã giảm giá cố định** | Fixed Discount Code | Giảm số tiền cụ thể trên tổng đơn hàng (VD: 50.000 VNĐ). | Giảm tối đa về 0 VNĐ, không bao giờ sinh ra số âm. |
| **Mã giảm giá theo %** | Percentage Discount Code | Giảm theo tỷ lệ % giá trị tiền hàng (VD: 10%, 20%). | Luôn đi kèm quy tắc làm tròn và mức giảm trần (Max Cap). |
| **Mức giảm tối đa (Max Cap)** | Discount Cap | Số tiền chiết khấu tối đa mà mã % được phép giảm (VD: tối đa 100.000 VNĐ). | Công thức: `Min(TienHang * %, MaxCap)`. |
| **Đơn tối thiểu (Min Spend)** | Minimum Order Value | Tổng tiền hàng tối thiểu để mã có hiệu lực kích hoạt. | Chỉ tính trên tiền hàng (Subtotal), không tính phí vận chuyển. |
| **Thời hạn voucher** | Voucher Validity Period | Khoảng thời gian từ `Start Time` đến `End Time`. | Theo múi giờ GMT+7, chốt chính xác đến 23:59:59 của ngày kết thúc. |
| **Lượt dùng / Hạn mức** | Usage Limit | Số lần tối đa mã được dùng trên toàn hệ thống hoặc mỗi user. | Phải phân biệt: Tổng lượt toàn campaign vs Lượt của mỗi khách hàng. |

---

## 3. Giỏ Hàng & Thanh Toán (Cart & Checkout)

| Thuật ngữ | Tiếng Anh tương đương | Định nghĩa chính xác | Ranh giới / Lưu ý |
|---|---|---|---|
| **Tiền hàng (Subtotal)** | Subtotal | Tổng giá niêm yết của các sản phẩm trong giỏ hàng. | Đây là căn cứ duy nhất để tính chiết khấu voucher. |
| **Phí vận chuyển (Shipping Fee)**| Shipping Fee | Cước phí giao vận từ đơn vị logistics. | Voucher thông thường **không** giảm phí vận chuyển trừ khi là mã Freeship. |
| **Tổng thanh toán (Final Total)**| Final Amount | Số tiền thực tế khách hàng phải trả: `Subtotal - Discount + Shipping`. | Đơn vị tính VNĐ, không có phần thập phân. |
| **Áp dụng đồng thời** | Stacking Discounts | Áp dụng nhiều mã giảm giá hoặc chương trình cùng lúc. | Mặc định hệ thống ShopGo: **Không áp dụng đồng thời** (chỉ 1 mã/đơn). |

---

## 4. Trạng Thái Mã (Voucher Lifecycle States)

| Trạng thái | Ý nghĩa | Hành vi hệ thống |
|---|---|---|
| **Draft** | Mã đang được Admin tạo nháp. | Khách hàng không thể tìm thấy hoặc áp dụng. |
| **Active** | Mã đang trong thời gian hiệu lực và còn ngân sách. | Cho phép áp dụng thành công. |
| **Expired** | Mã đã qua thời gian kết thúc campaign. | Báo lỗi: *"Mã giảm giá đã hết hạn sử dụng"*. |
| **Depleted** | Mã đã hết tổng lượt sử dụng trên hệ thống. | Báo lỗi: *"Mã giảm giá đã hết lượt sử dụng"*. |
| **Used by User** | Khách hàng này đã từng dùng mã trước đó. | Báo lỗi: *"Bạn đã sử dụng mã này rồi"*. |
