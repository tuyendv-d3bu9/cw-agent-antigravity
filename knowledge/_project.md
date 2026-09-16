# Project Knowledge — quy ước dùng cho MỌI feature

> Tri thức nền cấp **dự án**, không đổi theo từng tính năng. Mọi skill đọc file này.
> Trống mục nào thì agent phải gắn `[GIẢ ĐỊNH]` khi cần tới — điền dần để giảm giả định.

Dự án: `ShopGo (Hệ thống Thương mại điện tử Bán lẻ)` · Cập nhật lần cuối: `2026-09-16`

---

## 1. Quy ước định danh
| Đối tượng | Format | Ví dụ |
|---|---|---|
| Module prefix cho `TC_ID` | `<3–4 ký tự hoa>` | `VCHR` (Voucher), `AUTH`, `CART`, `PAY` |
| Mã nghiệp vụ (voucher, đơn hàng…) | `[A-Z0-9]{3,20}` | `SALE50`, `WELCOME2026`, `FREESHIP` |

## 2. Định dạng dữ liệu
| Loại | Quy ước | Ghi chú |
|---|---|---|
| Ngày | `YYYY-MM-DD` | Không mix định dạng khác |
| Tiền tệ | `VNĐ`, dấu chấm `.` phân cách hàng nghìn | Ví dụ `100.000 VNĐ`. Không có phần thập phân |
| Timezone | `Asia/Ho_Chi_Minh (GMT+7)` | Hạn sử dụng chốt đến 23:59:59 của ngày kết thúc |
| NULL vs rỗng | Hệ thống phân biệt tường minh | Input rỗng `""` báo lỗi nhập liệu; Backend xử lý `NULL` an toàn |

## 3. Bối cảnh nghiệp vụ dùng chung
> Chính là các mục mà skill `01` hay phải gắn `[CONTEXT_MISSING]`. Điền được thì báo cáo rủi ro
> chính xác hơn nhiều.

| Khía cạnh | Nội dung |
|---|---|
| User Context | Khách mua hàng bán lẻ tại Việt Nam (Guest, Registered Customer) |
| Usage Context | Web responsive (Desktop & Mobile Web), cao điểm các đợt Flash Sale / khuyến mãi |
| Financial Context | Thanh toán COD, thẻ ngân hàng, Ví ShopGo; chiết khấu voucher trừ trực tiếp vào đơn |
| Operational Context | SLA phản hồi < 2s cho luồng áp mã; hệ thống tự động hoàn mã khi hủy đơn |
| Criticality Context | Áp mã và thanh toán là luồng sống còn (Core Revenue Flow) |

## 4. Môi trường test
| | Nội dung |
|---|---|
| Môi trường | `Staging / Test` |
| Cách seed data | `SQL trực tiếp` vào database test kết hợp kiểm thử UI Web |
| Có được dùng dữ liệu giống production? | Có, sử dụng dữ liệu đã ẩn danh hóa (anonymized data) |

## 5. Test Management Tool
| | Nội dung |
|---|---|
| Tool | `Jira Xray` |
| Format import | `CSV / Markdown` |
| Trường bắt buộc thêm ngoài 8 trường chuẩn | Tuân thủ 8 trường chuẩn của dự án |

## 6. Ràng buộc riêng của dự án
- Ô nhập mã tự động `trim()` khoảng trắng ở đầu và cuối chuỗi; không phân biệt chữ hoa/thường (`Case-insensitive`).
- Giảm giá chỉ áp dụng trên tiền hàng, không giảm phí vận chuyển.
- Mã giảm cố định giảm tối đa về 0 VNĐ; mã phần trăm có mức giảm trần (Max Cap).
- Chặn brute-force nhập sai mã: 5 lần sai / 5 phút -> tạm khóa ô nhập 15 phút.
