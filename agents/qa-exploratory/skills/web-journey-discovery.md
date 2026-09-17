---
name: web-journey-discovery
description: >
  Sử dụng Playwright Browser MCP để tự động truy cập URL mục tiêu, "mò web" (khám phá cây DOM, Accessibility Snapshot),
  nhận diện các phần tử tương tác và ghi nhận luồng chuyển trang thực tế để phục vụ sinh Page Object Model (POM).
---

# Skill: web-journey-discovery

> Tuân thủ `agents/core/QA_STANDARD.md` (verdict · guard · FACT).

## Mục đích
Khám phá trực tiếp ứng dụng web đang chạy (Staging / Dev / Production), tự động quét cấu trúc trang để xác định:
1. Thứ tự chuyển trang (Page transitions).
2. Các phần tử tương tác chính (Buttons, Input fields, Forms, Modals).
3. Đề xuất các selector / locator chuẩn nhất cho `qa-automation` đưa vào POM.

## Tham số
- `url`: Địa chỉ trang web mục tiêu (ví dụ: `https://cwshopo.github.io` hoặc `http://localhost:3000`).
- `scope`: Hành trình cần khám phá (ví dụ: `checkout`, `cart`, `login`).

## Các bước thực hiện
1. **Khởi tạo & Điều hướng**:
   - Sử dụng Playwright mở URL được chỉ định.
   - Chờ trang tải hoàn tất mạng (`networkidle` hoặc `domcontentloaded`).
2. **Quét Accessibility Snapshot & DOM**:
   - Trích xuất cây Accessibility Tree để phát hiện các `role`, `name`, `placeholder`, `aria-label`.
   - Tìm kiếm các phần tử có thuộc tính `data-testid` hoặc `id` ổn định.
3. **Thử nghiệm tương tác (Exploration Probe)**:
   - Thử click hoặc nhập dữ liệu mẫu để kích hoạt hành vi chuyển trang hoặc mở popup.
   - Ghi nhận trạng thái URL trước và sau hành động.
4. **Tổng hợp báo cáo khám phá**:
   - Ghi lại danh sách các locator bền vững kèm ảnh chụp màn hình hiện trạng trang.

## Format output
Ghi ra `OUTPUT/<task-slug>/07_web_journey_discovery.md`:

```markdown
# WEB JOURNEY DISCOVERY — [TÊN ỨNG DỤNG / DOMAIN]
URL khảo sát: [URL] · Thời gian: YYYY-MM-DD · Người thực hiện: qa-exploratory

## 1. Hành Trình Khám Phá Thực Tế
| Bước | Trang / URL | Thao tác thử nghiệm | Kết quả chuyển trang / Popup |
|---|---|---|---|
| 1 | `/` | Bấm vào sản phẩm đầu tiên | Chuyển sang `/product/1` |
| 2 | `/product/1` | Bấm 'Thêm vào giỏ hàng' | Xuất hiện toast thông báo thành công |
| 3 | `/cart` | Nhập mã voucher | Hiển thị box giảm giá |

## 2. Bản Đồ Locator Khuyến Nghị Cho POM
| Trang | Tên phần tử | Action | Recommended Locator |
|---|---|---|---|
| CartPage | Input Voucher | fill | `page.getByPlaceholder('Nhập mã voucher')` |
| CartPage | Nút Áp dụng | click | `page.getByRole('button', { name: 'Áp dụng' })` |
| CartPage | Tổng tiền | text | `page.getByTestId('cart-total')` |
```

## Chốt chặn nghiệm thu (Quality Gates)
- [ ] Mọi locator được đề xuất đều được kiểm tra tính khả dụng thực tế trên trang web.
- [ ] Ưu tiên 100% role/testid, không dùng XPath dễ gãy.
- [ ] Báo cáo ghi rõ URL môi trường và luồng tương tác thực tế.
