# DATA CONSISTENCY & VALIDATION — FACT cho dataset
Nguồn: Module 4 — Bài 4.5 (Data Consistency & Validation)

## Mục đích
Review dataset AI sinh ra TRƯỚC khi dùng — bắt lỗi logic/nghiệp vụ/format trước khi seed hoặc test.

## FACT áp cho Data Validation
| | Tiêu chí | Ví dụ lỗi trong voucher dataset |
|---|---|---|
| F — Factual | Giá trị đúng thực tế/rule | Fixed Amount > tổng đơn tối thiểu → về lý thuyết đơn âm tiền |
| A — Accurate | Đúng định dạng/khoảng | Mã `V001` thay vì `SALE-XXXX` → INSERT fail do constraint |
| C — Complete | Không thiếu trường bắt buộc | Thiếu cột Giới hạn lượt dùng → SQL fail NOT NULL |
| T — Testable | Đủ rõ để biết pass/fail | Giá trị giảm 10.5% nhưng không rõ hệ thống có cho số thập phân |

## 5 loại lỗi phổ biến trong AI-generated data
1. Logic inconsistency (giá trị giảm Fixed > min order → đơn âm tiền).
2. Business rule violation (Percent nhưng để giá trị = 150).
3. Date/time logic error (hết hạn ở quá khứ nhưng đánh dấu Active).
4. Format inconsistency (mix `2026-01-15` và `15/01/2026`).
5. Null sai chỗ (mã voucher NULL — field bắt buộc).

## Cách chạy validation
- Với mỗi issue: Record # (mã) · field lỗi · mô tả cụ thể · phân loại lỗi · gợi ý sửa.
- Verdict theo PASS/FIX/ASK: sai format/logic → FIX; thiếu rule để phán → ASK.

## Ràng buộc (hard constraint)
- Liệt kê toàn bộ issue tìm được (định tính, không quota cứng).
- Không tự "sửa ngầm" data nguồn — chỉ đề xuất bản sửa.
- Rule chưa rõ (vd cho phép số thập phân?) → `ASK`, không tự quyết.

## Liên kết với FACT
- F/A/C/T dùng trực tiếp làm checklist review ở trên.
