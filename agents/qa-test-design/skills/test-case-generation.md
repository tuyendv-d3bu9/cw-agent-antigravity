# Skill: test-case-generation

> Tuân thủ `shared/QA_STANDARD.md` (verdict · guard · FACT · chuỗi biên §6).

## Mục đích
Expand toàn bộ Test Idea gắn nhãn "Giữ" thành Test Case hoàn chỉnh **8 trường**, sẵn sàng import
trực tiếp vào Test Management Tool (Jira Xray, TestRail, Zephyr).

## Đầu vào
- `OUTPUT/<task-slug>/04_test_idea_report.md` — danh sách Test Idea "Giữ".
- `OUTPUT/<task-slug>/01_requirement_risk_summary.md` — Business Rules để trace.
- `OUTPUT/<task-slug>/03_viewpoint_report.md` — Viewpoint để trace.

## KHÔNG được (riêng skill này)
- Tạo test case ngoài phạm vi Test Idea "Giữ" hoặc rule hiện có (Scope Creep).
- Tạo test case "mồ côi" — không trace về `BR-xx` và viewpoint cụ thể.
- Dùng placeholder mơ hồ trong `Test Data` ("nhập chuỗi bất kỳ", "abc", "test data", "[email]").
- Gộp nhiều thao tác vào một step.

## Các bước thực hiện

### 1. Phân loại theo quy mô (Scale Detection)
- **Quy mô nhỏ (≤ 50 Test Cases)**: Thực hiện sinh trực tiếp 8 trường vào `05_test_case_spec.md`.
- **Quy mô lớn (> 50 hoặc hàng trăm / hàng nghìn Test Cases)**: **BẮT BUỘC** áp dụng mô hình 3 giai đoạn: Blueprint JSON ➔ Chia Lô (Batching) ➔ Gộp (Merge).

### 2. Chi tiết quy trình Quy mô lớn (> 50 Test Cases)

#### Giai đoạn 5.1: Sinh Bản thiết kế khung (`05_test_blueprint.json`)
Ghi danh mục toàn bộ Test Ideas đã duyệt vào `OUTPUT/<task-slug>/05_test_blueprint.json`:
```json
[
  {
    "tc_id": "VCHR-001",
    "module": "VCHR",
    "rule_id": "BR-01",
    "viewpoint_id": "VP-01",
    "purpose": "Verify áp mã voucher hết hạn tại trang thanh toán",
    "priority": "High",
    "batch": 1
  }
]
```
> *Tác dụng: Khung thiết kế JSON cực kỳ gọn nhẹ (~30 token/item), giúp định hình trọn vẹn 500 - 1.000 test case mà không bao giờ bị tràn token hoặc trùng lặp mã.*

#### Giai đoạn 5.2: Chia lô sinh chi tiết (`Chunked Batching`)
- Chia file Blueprint thành các lô (khuyến nghị **50 test cases / batch**).
- Ghi mỗi lô vào thư mục: `OUTPUT/<task-slug>/testcases/batch_01.md`, `batch_02.md`...
- Mỗi test case trong batch được expand đầy đủ **8 trường chuẩn**, không viết tắt, không placeholder.

#### Giai đoạn 5.3: Gộp tổng thể (`Assembly`)
- Chạy lệnh tiện ích để tự động gộp các file `batch_*.md` thành `05_test_case_spec.md`:
  ```bash
  npm run testcases:merge <task-slug>
  ```

---

## Định dạng 8 trường bắt buộc
| Trường | Quy tắc |
|---|---|
| `TC_ID` | `[MODULE]-[001]` — vd `VCHR-001`, `PAY-012` |
| `Title` | Bắt đầu bằng `Verify` / `Validate` / `Confirm` + hành động + điều kiện |
| `Precondition` | Trạng thái hệ thống, dữ liệu nền, quyền hạn user trước khi bắt đầu |
| `Test Steps` | Đánh số 1, 2, 3… · mỗi step đúng 01 thao tác · tối đa 8 steps |
| `Test Data` | Giá trị tường minh, cụ thể — cấm placeholder |
| `Expected Result` | Cụ thể, có tiêu chí đo lường để phân định Pass/Fail |
| `Priority` | High / Medium / Low |
| `Tags` | `Rule#[ID]`, `Viewpoint#[ID/Tên]`, `Module#[Tên]`, `[Automated/Manual]` |

## Format output (Mỗi Test Case)

```markdown
### TC_ID: [MODULE]-[001]
- **Title**: [Verify/Validate/Confirm] + [hành động] + [điều kiện]
- **Precondition**:
  - [trạng thái hệ thống / dữ liệu nền / quyền hạn]
- **Test Steps**:
  1. [hành động 1]
  2. [hành động 2]
- **Test Data**:
  - [Tên trường]: [giá trị cụ thể]
- **Expected Result**:
  - [trạng thái UI / thông báo / thay đổi DB / mã phản hồi]
- **Priority**: [High/Medium/Low]
- **Tags**: Rule#[ID], Viewpoint#[ID/Tên], Module#[Tên], [Automated/Manual]
```
