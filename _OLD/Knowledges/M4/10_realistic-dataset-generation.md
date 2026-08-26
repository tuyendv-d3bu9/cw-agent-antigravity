# REALISTIC DATASET GENERATION — Nguyên tắc "sát nghiệp vụ"
Nguồn: Module 4 — Bài 4.2 (Realistic Dataset Generation)

## Mục đích
Sinh dataset trông giống dữ liệu thật của dự án, không phải placeholder vô hồn —
để test phản ánh đúng hành vi production.

## Nguyên tắc "sát nghiệp vụ" (ví dụ voucher ShopGo)
- Mã đúng format công ty: `SALE-XXXX` (không phải `V001`).
- Giá trị giảm hợp lý theo campaign VN: 10–30% phổ biến hơn 90%.
- Ngày hết hạn có logic: spread từ hiện tại đến ~+6 tháng (không phải 2030, không phải đã qua).
- Min order hợp lý theo AOV ngành hàng (thời trang/gia dụng).
- Đa dạng hóa: mix loại giảm giá, range giá trị khác nhau, có mã sắp hết hạn và còn hạn dài,
  có mã gần hết lượt dùng.

## 5 bẫy thường gặp khi AI sinh data & cách phòng
| Bẫy | Ví dụ AI hay tạo | Cách phòng |
|---|---|---|
| Data lặp đơn điệu | 5 voucher cùng 10%, cùng min 200k | Yêu cầu "đa dạng hóa" trong prompt |
| Data phi thực tế | Mã "VOUCHER1", giảm 500% | Nêu rõ domain + range hợp lệ |
| Date logic sai | Hết hạn 2030 hoặc đã qua | Cung cấp range ngày cụ thể |
| Giá trị giảm bịa | Fixed nhưng để 20% cho mọi mã | Nêu rõ business rule |
| Thiếu edge tự nhiên | Không mã nào gần hết lượt | Yêu cầu "gồm mã lượt dùng còn rất ít" |

## Ràng buộc (hard constraint)
- Giá trị thực tế, KHÔNG placeholder mơ hồ.
- Đa dạng theo bản chất nghiệp vụ; dùng ngôn ngữ định tính ("đủ đa dạng", "toàn bộ biến thể áp dụng được") thay quota cứng.
- Giả định về domain (AOV, campaign) phải gắn `[GIẢ ĐỊNH]`.

## Liên kết với FACT
- A (Accurate): giá trị đúng định dạng/khoảng, không mơ hồ.
- F (Factual): không bịa rule/campaign ngoài Requirement.
