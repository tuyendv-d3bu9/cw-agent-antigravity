# <Tên tính năng> — Feature Knowledge

> **Knowledge = AI DỰA TRÊN TRI THỨC GÌ.** File này là tri thức nền **per-feature** (dữ kiện của
> 1 tính năng), tích luỹ dần qua các lần chạy.
> KHÔNG chứa các bước thực thi (đó là `skills/`) hay danh tính (đó là `AGENT.md`).
>
> **Cách dùng**: copy file này thành `knowledge/<feature-slug>.md`. Skill `01` và `02` ghi vào đây.
> Các skill sau đọc nó thay vì bắt bạn dán lại tài liệu gốc mỗi lần.

Feature slug: `<feature-slug>` · Nguồn: `INPUT/<file>.md` · Cập nhật lần cuối: `<YYYY-MM-DD>`

---

## 1. FEATURE OVERVIEW
_[1–2 câu]_

## 2. ACTOR & USER ROLE
_[ai dùng, quyền hạn]_

## 3. BUSINESS RULES
> Chỉ đưa vào đây rule đã **xác nhận**. Rule còn treo để ở mục 7.

| ID | Nội dung rule | Nguồn (file / mục) | Trạng thái |
|---|---|---|---|
| BR-01 |  |  | Confirmed |

## 4. HAPPY PATH
_[step-by-step]_

## 5. ALTERNATE FLOWS
_[luồng phụ / ngoại lệ]_

## 6. OUT OF SCOPE
_[không thuộc phạm vi]_

## 7. OPEN QUESTIONS & MISSING RULES
> Trạng thái mặc định `New`. Người duyệt chuyển: `Confirmed` / `TREO` / `Rejected`.
> 06W (định nghĩa chuẩn: `shared/QA_STANDARD.md` §4) — ghi cột `Loại (06W)` theo dạng `Wx (Tên)`:
> `W1 (input lạ)` · `W2 (state lạ)` · `W3 (data lạ)` · `W4 (timing)` · `W5 (who else actor)` · `W6 (what happens after)`.

| ID | Mô tả gap | Loại (06W) | Rủi ro | Câu hỏi cho BA | Trả lời của BA | Trạng thái |
|---|---|---|---|---|---|---|
| MR-01 |  |  |  |  |  | New |

## 8. GIẢ ĐỊNH ĐÃ CHỐT
> Mỗi lần BA/PO trả lời một `[GIẢ ĐỊNH]`, chuyển nó xuống đây. Lần chạy sau agent dùng luôn,
> không phải giả định lại.

| # | Giả định ban đầu | Kết luận chính thức | Ai chốt | Ngày |
|---|---|---|---|---|
| 1 |  |  |  |  |

## 9. DOMAIN CONSTANT của feature này
> Hằng số nghiệp vụ agent cần để sinh data/test case sát thực tế.

| Hằng số | Giá trị | Nguồn |
|---|---|---|
| _[vd format mã]_ |  |  |
| _[vd khoảng giá trị hợp lệ]_ |  |  |

## 10. TRACEABILITY
> Mọi rule/gap ở trên phải trace được về file nguồn.

| Item | Nguồn (file / mục) |
|---|---|
| BR-01 |  |
| MR-01 |  |
