# Project Knowledge — quy ước dùng cho MỌI feature

> Tri thức nền cấp **dự án**, không đổi theo từng tính năng. Mọi skill đọc file này.
> Trống mục nào thì agent phải gắn `[GIẢ ĐỊNH]` khi cần tới — điền dần để giảm giả định.

Dự án: `<tên dự án>` · Cập nhật lần cuối: `<YYYY-MM-DD>`

---

## 1. Quy ước định danh
| Đối tượng | Format | Ví dụ |
|---|---|---|
| Module prefix cho `TC_ID` | `<3–4 ký tự hoa>` | `AUTH`, `PAY` |
| Mã nghiệp vụ (voucher, đơn hàng…) | _[điền]_ | _[điền]_ |

## 2. Định dạng dữ liệu
| Loại | Quy ước | Ghi chú |
|---|---|---|
| Ngày | `YYYY-MM-DD` | Không mix định dạng khác |
| Tiền tệ | _[điền: đơn vị, dấu phân cách]_ |  |
| Timezone | _[điền]_ |  |
| NULL vs rỗng | _[điền: hệ thống phân biệt hay không]_ | Ảnh hưởng trực tiếp tới dataset biên |

## 3. Bối cảnh nghiệp vụ dùng chung
> Chính là các mục mà skill `01` hay phải gắn `[CONTEXT_MISSING]`. Điền được thì báo cáo rủi ro
> chính xác hơn nhiều.

| Khía cạnh | Nội dung |
|---|---|
| User Context | _[phân nhóm, đặc trưng người dùng]_ |
| Usage Context | _[tần suất, tải, giờ cao điểm]_ |
| Financial Context | _[giá trị giao dịch, tác động doanh thu]_ |
| Operational Context | _[SLA, quy trình vận hành, khả năng phục hồi]_ |
| Criticality Context | _[tính năng nào sống còn với sản phẩm]_ |

## 4. Môi trường test
| | Nội dung |
|---|---|
| Môi trường | _[dev / staging / uat]_ |
| Cách seed data | _[SQL trực tiếp / import tool / API]_ |
| Có được dùng dữ liệu giống production? | _[có/không + giới hạn]_ |

## 5. Test Management Tool
| | Nội dung |
|---|---|
| Tool | _[Jira Xray / TestRail / Zephyr]_ |
| Format import | _[CSV / JSON / …]_ |
| Trường bắt buộc thêm ngoài 8 trường chuẩn | _[nếu có]_ |

## 6. Ràng buộc riêng của dự án
- _[quy tắc nào agent phải tuân mà không suy ra được từ requirement]_
