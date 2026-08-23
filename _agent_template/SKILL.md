# Skill: <skill-name>

> **Skill = LÀM THẾ NÀO.** Quy trình + tham số + checklist + format. Tái dùng được, có tham số.
> KHÔNG chứa danh tính/quyền hạn (đó là `role.md`), KHÔNG nhồi tri thức nền (trỏ tới `knowledge/`).

## Mục đích
<Skill dùng để làm gì, chạy ở stage nào, sinh output gì.>

## Tham số
- `<param-1>` ∈ `<giá trị hợp lệ>`
- `<param-2>` ∈ `<giá trị hợp lệ>`

## Knowledge dùng tới
- `knowledge/<file>.md` — <dùng vào việc gì>

## KHÔNG được
- Không tự phán nghiệp vụ nếu cần oracle → `ASK`.
- Không ghi đè input; không đổi state nếu không có quyền.
- Không áp quota số lượng cứng — dùng ngôn ngữ định tính ("đủ", "toàn bộ … áp dụng được").

## Verdict — quy tắc quyết định

| Nhóm | Khi nào | Cách xử lý |
|---|---|---|
| PASS | Đủ thông tin và đạt checklist | Ghi nhận đạt |
| FIX | Đủ thông tin nhưng sai format / trace / consistency | Viết bản sửa cụ thể |
| ASK | Thiếu thông tin / cần nghiệp vụ / rule treo | Chuyển người quyết |

## Đầu vào theo trường hợp
### Trường hợp 1 — <stage/gate>
- Vào: `<file-1>` · `<file-2>`
- Máy kiểm: <check 1> · <check 2>
- ASK khi: <điều kiện cần người trả lời>

## Các bước
1. Xác định tham số.
2. Nạp đúng input + knowledge cần dùng.
3. Chạy checklist theo từng mục.
4. **Ghi kết quả MỖI BƯỚC ra MỘT FILE riêng** trong output (xem mục dưới).
5. Gắn nhãn từng phát hiện: `PASS / FIX / ASK`.
6. `FIX` → viết bản sửa đề xuất; `ASK` → ghi rõ cần ai/thông tin gì.
7. Cập nhật `_index.md`. Không đổi state file nếu không có quyền.

## Output — MỖI BƯỚC MỘT FILE (không gộp 1 file)
Skill ghi TỪNG bước/deliverable thành file riêng, KHÔNG dồn tất cả vào một file lớn:

```
output/<task-slug>/
  ├─ 01_<ten-buoc>.md
  ├─ 02_<ten-buoc>.md
  ├─ 03_<ten-buoc>.md
  └─ _index.md      # liệt kê file đã sinh + verdict PASS/FIX/ASK từng bước
```

Vì sao tách file:
- Agent phía sau chỉ đọc đúng file nó cần, không phải parse cả báo cáo lớn.
- Dễ **trace** (mỗi file 1 deliverable) và dễ **resume/checkpoint** khi chạy lại.
- Không ghi đè, review được từng phần độc lập.

## Format mỗi file kết quả
```md
# <Tên deliverable>  ·  <task-slug>
Reviewer/Owner: <role> · Nguồn: <file đã đọc> · Verdict: <PASS/FIX/ASK>

## Nội dung
<đúng format của deliverable này>

## FIX (nếu có)
| # | Vị trí | Vấn đề | Bản sửa đề xuất |
|---|---|---|---|

## ASK (nếu có)
| # | Vị trí | Cần gì | Chuyển cho ai |
|---|---|---|---|
```