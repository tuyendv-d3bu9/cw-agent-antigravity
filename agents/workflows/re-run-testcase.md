# RUNBOOK — Chạy lại sau khi có câu trả lời BA / sau verdict FIX

> File này để **CHẠY**. Trỏ: *"Đọc `workflows/re-run-testcase.md` và thực hiện."*
> Bản đồ toàn hệ thống: `workflows/WORKFLOW.md`.
>
> Dùng khi pipeline **đã chạy một lần** và bị dừng ở `ASK` hoặc `FIX`. Đây là vòng 2 của
> **vòng knowledge** (`WORKFLOW.md` §4) — mục tiêu là ít `[GIẢ ĐỊNH]` và ít `ASK` hơn lần 1.

**Tham số**

| Tham số | Giá trị mặc định |
|---|---|
| `task-slug` | `function-d` |
| `feature knowledge` | `knowledge/function-d.md` |
| `bước bắt đầu lại` | bước thấp nhất bị ảnh hưởng (xác định ở §2) |

---

## 1. Trước khi chạy lại — cập nhật knowledge THỦ CÔNG

Đây là bước **của con người**, agent không làm thay. Không làm bước này thì chạy lại vô nghĩa —
agent sẽ hỏi lại đúng câu cũ.

Mở `knowledge/<task-slug>.md`:

- [ ] **Mục 7** — với mỗi `MR-xx` BA đã trả lời: điền cột `Trả lời của BA`, đổi `Trạng thái`
      `New` → `Confirmed` (hoặc `TREO` / `Rejected`). **Không xoá dòng cũ.**
- [ ] **Mục 3** — rule nào đã `Confirmed` thì thêm thành `BR-xx` mới, nguồn ghi
      `Phản hồi BA/PO (<ngày>)`, trạng thái `Confirmed`
- [ ] **Mục 8** — mỗi `[GIẢ ĐỊNH]` được chốt: ghi giả định ban đầu, kết luận chính thức, ai chốt, ngày
- [ ] **Mục 9** — hằng số nghiệp vụ mới biết (format mã, độ dài, timezone, quy tắc làm tròn…)
- [ ] **Mục 10** — trace nguồn cho các `BR-xx` vừa thêm
- [ ] Cập nhật dòng `Cập nhật lần cuối`

Nếu câu trả lời là **quy ước cả dự án** (không riêng feature này) → ghi vào
`knowledge/_project.md` thay vì file feature.

---

## 2. Xác định bước bắt đầu lại

Không chạy lại từ `01` nếu không cần. Quy tắc: **chạy lại từ bước thấp nhất bị ảnh hưởng**.

| Thứ vừa đổi trong knowledge | Chạy lại từ | Vì sao |
|---|---|---|
| Thêm/sửa `BR-xx` ở mục 3 | `01` | Business Rules là đầu vào của cả pipeline; risk matrix phải tính lại |
| Chỉ đổi `Trạng thái` của `MR-xx` ở mục 7 (không thêm rule mới) | `02` | `01` không đọc mục 7 |
| Thêm hằng số ở mục 9 (format mã, timezone, làm tròn) | `01` nếu ảnh hưởng risk · nếu không thì `05` và `09` | Hằng số chủ yếu chi phối test case + dataset |
| Đổi `knowledge/_project.md` | `01` | Mục 3 của `_project.md` là đầu vào Business Context của skill 01 |
| Verdict `FIX` ở một bước cụ thể | **đúng bước đó** | `FIX` = đủ thông tin, chỉ sai format/trace → không cần chạy lại bước trước |

Xác định xong thì mọi bước **sau** bước đó cũng phải chạy lại, vì đầu vào đã đổi.

---

## 3. Khối lệnh chạy

```
Đọc trước:
  shared/QA_STANDARD.md
  knowledge/_project.md
  knowledge/function-d.md          <-- đã cập nhật ở §1
  workflows/WORKFLOW.md
  OUTPUT/function-d/_index.md      <-- xem lần trước dừng ở đâu

task-slug = function-d
bước bắt đầu lại = <điền theo bảng §2>

Trước khi chạy: backup thư mục OUTPUT/function-d/ hiện có sang OUTPUT/function-d.bak/
Không xoá file cũ trước khi backup.

Chạy lại từ bước đã chọn, tuần tự tới hết nhánh A. Sau MỖI bước: ghi file output,
cập nhật OUTPUT/function-d/_index.md, in verdict.

BẮT BUỘC ở lần chạy lại:
- Mọi rule đã Confirmed trong knowledge KHÔNG được đưa lại thành missing rule / open question.
- Mọi giả định đã chốt ở mục 8 KHÔNG được gắn lại [GIẢ ĐỊNH].
- Mọi hằng số có ở mục 9 hoặc _project.md KHÔNG được gắn [CONTEXT_MISSING].
Vi phạm 3 điều trên = agent không đọc knowledge → dừng, báo tôi.

Cuối cùng: in bảng so sánh lần 1 vs lần 2 (xem §4).
```

---

## 4. Bảng so sánh 2 lần chạy — thước đo knowledge có tác dụng

| Chỉ số | Lần 1 | Lần này | Kỳ vọng |
|---|---|---|---|
| Số `[GIẢ ĐỊNH]` |  |  | Giảm |
| Số `[CONTEXT_MISSING]` |  |  | Giảm |
| Số `[SEVERITY_CONFIDENCE_LOW]` |  |  | Giảm |
| Số Open Question / Missing Rule còn `New` |  |  | Giảm |
| Số `BR-xx` đã `Confirmed` |  |  | Tăng |
| Verdict cuối nhánh A |  |  | Tiến về `PASS` |

Chỉ số **không giảm** → hoặc knowledge chưa được cập nhật đủ (§1), hoặc agent không đọc knowledge.
Kiểm dòng "Đọc trước" trong khối lệnh trước khi kết luận là lỗi agent.

---

## 5. Lỗi hay gặp

| Hiện tượng | Nguyên nhân | Xử lý |
|---|---|---|
| Chạy lại nhưng số `ASK` không giảm | Chưa làm §1 — knowledge vẫn còn `New` | Cập nhật knowledge trước, đây là bước của người |
| Agent hỏi lại đúng câu BA đã trả lời | Không đọc `knowledge/<slug>.md`, hoặc trạng thái vẫn `New` | Kiểm dòng "Đọc trước" + kiểm cột `Trạng thái` |
| Mất output lần 1 để so sánh | Chạy lại mà không backup | Luôn backup sang `OUTPUT/<slug>.bak/` trước khi chạy |
| Chạy lại từ `01` cho mọi thay đổi | Không tra bảng §2 | Đổi trạng thái mục 7 thì chỉ cần từ `02` |
| Rule cũ bị mất khỏi knowledge | Agent hoặc người xoá dòng thay vì đổi trạng thái | `shared/QA_STANDARD.md` §8 — luật ghi: không xoá dòng cũ |
