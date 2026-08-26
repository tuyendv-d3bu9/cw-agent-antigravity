# Skill: 10-dataset-generation  `[MỚI]`

> Tuân thủ `shared/QA_STANDARD.md` (verdict · guard · FACT).

## Mục đích
Sinh dataset **sát nghiệp vụ** (giống dữ liệu thật của dự án, không phải placeholder vô hồn) và
xuất ra định dạng dùng được ngay: CSV / SQL INSERT / JSON.

## Tham số
- `format` ∈ `csv` · `sql` · `json` — chọn theo mục đích tiêu thụ (bảng dưới).
- `volume` — số record mong muốn, do người gọi chỉ định.

## Đầu vào
- `output/<task-slug>/09_data_class_map.md` — Field Map.
- `output/<task-slug>/01_requirement_risk_summary.md` — Business Rules để không vi phạm.

## KHÔNG được (riêng skill này)
- Dùng placeholder mơ hồ (`V001`, `test`, `abc`, `[email]`) — phải là giá trị thực tế.
- Bịa rule / campaign / domain assumption ngoài Requirement → gắn `[GIẢ ĐỊNH]`.
- Đổi tên field/khoá so với Field Map hoặc schema.
- Sinh record biên/âm tính ở đây — đó là skill `11`.

## Nguyên tắc "sát nghiệp vụ"
- Mã/định danh đúng **format thật của dự án**, không dùng tên giả kiểu `V001`.
- Giá trị nằm trong **khoảng phổ biến thực tế** của domain, không chỉ chọn giá trị cực đoan.
- **Logic ngày tháng có nghĩa**: spread hợp lý quanh hiện tại; không đặt mốc xa vô lý, không đặt
  quá khứ trong khi trạng thái là "đang hiệu lực".
- **Đa dạng hoá**: mix các loại/enum, mix range giá trị, có bản ghi "gần tới hạn" và "còn xa hạn".
- Mọi giả định về domain (AOV, mức phổ biến theo campaign…) phải gắn `[GIẢ ĐỊNH]`.

## 5 bẫy khi AI sinh data & cách phòng
| Bẫy | Biểu hiện | Cách phòng |
|---|---|---|
| Data lặp đơn điệu | Nhiều record trùng gần hết giá trị | Yêu cầu rõ "đa dạng hoá" theo từng field |
| Data phi thực tế | Định danh giả, giá trị vượt xa rule | Nêu rõ domain + khoảng hợp lệ trước khi sinh |
| Date logic sai | Mốc thời gian xa vô lý, hoặc quá khứ nhưng vẫn Active | Cung cấp range ngày cụ thể + kiểm tra chéo với trạng thái |
| Giá trị bịa theo kiểu | Enum là "số tiền cố định" nhưng lại điền `%` | Nêu rõ business rule của từng enum |
| Thiếu edge tự nhiên | Không record nào gần ngưỡng | Yêu cầu rõ "gồm bản ghi gần tới hạn" |

## Chọn format theo mục đích
| Format | Dùng khi | Lưu ý bắt buộc |
|---|---|---|
| **CSV** | Import Excel / TestRail, data provider | Header đúng tên field; giá trị có ký tự đặc biệt → wrap trong quotes |
| **SQL INSERT** | Seed trực tiếp test DB | Escape ký tự đặc biệt; date đúng format DB; mỗi record 1 statement |
| **JSON** | API testing (Postman) | Key khớp API schema; nested object cho rule lồng nhau |

**Quy ước chung**: date thống nhất `YYYY-MM-DD` (không mix định dạng) · NULL → CSV để ô trống,
SQL dùng `NULL`, JSON dùng `null` · tên cột/khoá đúng Field Map ở skill 09.

## Các bước
1. Đọc Field Map, xác định field nào cần sinh và khoảng giá trị hợp lệ.
2. Sinh bảng dataset **Valid** theo nguyên tắc "sát nghiệp vụ" + đa dạng hoá.
3. Tự soi lại theo bảng 5 bẫy.
4. Xuất ra `format` được yêu cầu, đúng cú pháp, import/chạy được không cần sửa tay.

## Format output
Ghi ra `output/<task-slug>/10_dataset.md`:

````markdown
# REALISTIC DATASET — [TÊN TÍNH NĂNG]

## 1. Bảng dataset (Valid)
| # | [field 1] | [field 2] | … | Ghi chú |
|---|---|---|---|---|
| 1 | [giá trị thực tế] | … | … | [vd "gần tới hạn"] |

## 2. Giả định đã dùng
| # | Giả định | Vì sao cần | Chờ ai xác nhận |
|---|---|---|---|
| 1 | `[GIẢ ĐỊNH]` […] | […] | BA/PO |

## 3. Export — [csv | sql | json]
```[csv|sql|json]
[nội dung export, đúng cú pháp, dùng được ngay]
```

## 4. Tự soi 5 bẫy
| Bẫy | Đã kiểm | Kết quả |
|---|---|---|
| Data lặp đơn điệu | [x] | [đạt / đã sửa: …] |
| Data phi thực tế | [x] | … |
| Date logic sai | [x] | … |
| Giá trị bịa theo kiểu | [x] | … |
| Thiếu edge tự nhiên | [x] | … |
````

## Chốt chặn
- Không lỗi cú pháp, escape đầy đủ ký tự đặc biệt (FACT — A).
- Dữ liệu ở dạng máy tiêu thụ được ngay: provider / seed / API (FACT — T).
