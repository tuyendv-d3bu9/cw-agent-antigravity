---
name: flow-clustering
description: >
  Phân tích kho Test Cases gốc (05_test_case_spec.md) hoặc danh sách test cases theo Ticket,
  phân cụm các test cases có chung hành trình người dùng (User Journey / Common Flow) để tái sử dụng trạng thái trình duyệt và tối ưu hóa việc chạy Playwright.
---

# Skill: flow-clustering

> Tuân thủ `agents/core/QA_STANDARD.md` (verdict · guard · FACT).

## Mục đích
Tránh việc mở đi mở lại trình duyệt và lặp lại các bước điều hướng từ đầu cho từng test case đơn lẻ. Skill này nhóm các test case có chung điểm xuất phát, chung ngữ cảnh dữ liệu và chung luồng thao tác.

## Đầu vào
- `OUTPUT/<task-slug>/05_test_case_spec.md` hoặc `OUTPUT/<task-slug>/runs/<run-id>/run_plan.md`.

## Các bước thực hiện
1. **Quét Preconditions & Test Steps**:
   - Nhóm theo trang xuất phát (ví dụ: Trang chủ, Trang danh mục, Trang giỏ hàng).
   - Nhóm theo trạng thái xác thực: Khách vãng lai (Guest) vs Người dùng đã đăng nhập (Authenticated User).
2. **Gom thành các cụm hành trình (Journey Clusters)**:
   - *Cụm Xác thực (Auth Journey)*: Đăng ký $\to$ Đăng nhập $\to$ Quên mật khẩu.
   - *Cụm Tìm kiếm & Chọn hàng (Catalog & Search Journey)*: Tìm từ khóa $\to$ Bộ lọc $\to$ Xem chi tiết $\to$ Thêm vào giỏ.
   - *Cụm Thanh toán & Khuyến mãi (Checkout & Promotion Journey)*: Giỏ hàng $\to$ Áp mã voucher $\to$ Điền địa chỉ $\to$ Chọn thanh toán $\to$ Xác nhận đơn.
3. **Sắp xếp thứ tự thực thi trong cụm**:
   - Chạy Happy Path trước để làm baseline.
   - Chạy Boundary / Negative / Edge cases sau để cô lập lỗi.

## Format output
Xuất thông tin cụm vào bảng kế hoạch chạy:

```markdown
### Cụm Hành Trình: [Tên Cụm — ví dụ: Checkout & Voucher Flow]
- **Trang khởi đầu**: `/cart` hoặc `/checkout`
- **Session State**: Đăng nhập bằng tài khoản test `buyer01@shopgo.vn`
- **Danh sách Test Cases trong cụm**:
  1. TC-001 (Happy Path — Áp voucher 10% thành công)
  2. TC-002 (Negative — Áp voucher hết hạn)
  3. TC-005 (Boundary — Áp voucher đạt mức giảm tối đa)
```

## Chốt chặn nghiệm thu (Quality Gates)
- [ ] 100% Test Case trong phạm vi đợt chạy được phân vào đúng cụm hành trình logic.
- [ ] Không có test case nào bị bỏ quên hoặc trùng lặp giữa các cụm.
- [ ] Chỉ rõ Precondition và trạng thái Auth để Playwright tái sử dụng Storage State.
