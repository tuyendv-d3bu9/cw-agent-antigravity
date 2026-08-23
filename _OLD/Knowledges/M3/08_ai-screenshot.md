# UI SCREENSHOT ANALYSIS — Vision Review Framework
Nguồn: Module 3 — Bài 3.5 (AI Screenshot Analysis)

## Mục đích
Chuẩn hóa cách đọc ảnh chụp màn hình (AI Vision) để phát hiện vấn đề giao diện,
khả năng tiếp cận và trải nghiệm — chỉ dựa trên những gì NHÌN THẤY trên ảnh tĩnh.

## Điều kiện tiên quyết
- BẮT BUỘC có ảnh đính kèm. Không có ảnh → không thực thi, yêu cầu cung cấp ảnh.
- Chỉ nhận xét nội dung tĩnh; KHÔNG suy đoán hành vi động (hover, animation,
  phản hồi sau click) vì ảnh không chứa thông tin đó.

## 03 nhóm vấn đề + checklist quan sát

### 1. UI Inconsistency
- Lệch canh lề, spacing/khoảng cách không đều giữa các phần tử.
- Nút/thành phần cùng loại nhưng khác kích thước, bo góc, màu.
- Font/kiểu chữ/cỡ chữ không nhất quán; icon lệch chuẩn.

### 2. Accessibility
- Tương phản chữ/nền thấp (chữ xám nhạt trên nền trắng...).
- Cỡ chữ quá nhỏ khó đọc.
- Vùng chạm/nút quá sát nhau (khó thao tác trên mobile).
- Thiếu nhãn nhìn thấy được cho trường nhập/nút.

### 3. UX Problem
- Thông báo lỗi/nhãn khó hiểu, không nói rõ nguyên nhân/cách xử lý.
- Thiếu tín hiệu trạng thái (không thấy loading khi đang xử lý).
- Luồng thị giác gây nhầm lẫn, thứ tự ưu tiên thông tin sai.

## Cấu trúc mô tả 1 vấn đề (bắt buộc)
Vị trí · Mô tả (nhìn thấy gì) · Lý do (vì sao là vấn đề) · Mức độ (Low/Med/High) · Đề xuất sửa.

## Thang mức độ
- **High**: cản trở hoàn thành tác vụ hoặc loại người dùng khỏi luồng.
- **Med**: gây khó chịu/nhầm lẫn nhưng vẫn hoàn thành được.
- **Low**: lỗi thẩm mỹ nhỏ, không ảnh hưởng thao tác.

## Ràng buộc (hard constraint)
- Chỉ nhận xét cái nhìn thấy; cấm suy đoán hành vi động.
- Ảnh mờ/không chắc chắn → gắn `[GIẢ ĐỊNH]` + đề nghị cross-check bằng mắt, không khẳng định.
- Mỗi vấn đề thuộc đúng một trong 03 nhóm.

## Human-Final
Mức độ nghiêm trọng thực tế và phương án sửa cuối cùng do người review quyết định.

## Liên kết với FACT
- F (Factual): mọi vấn đề nêu ra thực sự nhìn thấy trên ảnh, không suy diễn.
- A (Accurate): vị trí & mô tả chính xác, khớp đúng chỗ trên ảnh.
- C (Complete): quét đủ 03 nhóm cho từng ảnh.
- T (Testable): mỗi đề xuất sửa đủ cụ thể để verify lại sau khi fix.