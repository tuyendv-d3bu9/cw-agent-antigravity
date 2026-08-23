# Skill: 05-test-case-generation

> Tuân thủ `shared/QA_STANDARD.md` (verdict · guard · FACT · chuỗi biên §6).

## Mục đích
Expand toàn bộ Test Idea gắn nhãn "Giữ" thành Test Case hoàn chỉnh **8 trường**, sẵn sàng import
trực tiếp vào Test Management Tool (Jira Xray, TestRail, Zephyr).

## Đầu vào
- `output/<task-slug>/04_test_idea_report.md` — danh sách Test Idea "Giữ".
- `output/<task-slug>/01_requirement_risk_summary.md` — Business Rules để trace.
- `output/<task-slug>/03_viewpoint_report.md` — Viewpoint để trace.

## KHÔNG được (riêng skill này)
- Tạo test case ngoài phạm vi Test Idea "Giữ" hoặc rule hiện có (Scope Creep).
- Tạo test case "mồ côi" — không trace về `BR-xx` và viewpoint cụ thể.
- Dùng placeholder mơ hồ trong `Test Data` ("nhập chuỗi bất kỳ", "abc", "test data", "[email]").
- Gộp nhiều thao tác vào một step.

## Các bước
1. **Expand toàn diện** — mọi Test Idea "Giữ" đều thành Test Case, đủ 8 trường, đúng thứ tự,
   không đổi tên trường. Không tự cắt bớt số lượng.
2. **Traceability 100%** — mỗi test case trace về đúng một `BR-xx` và một viewpoint, ghi ở `Tags`.
3. **Phủ biên & validation** — với mọi field có khoảng min/max hoặc rule định dạng/độ dài, áp
   chuỗi biên chuẩn `shared/QA_STANDARD.md` §6. Nếu một mốc biên thuộc rule đã xác định nhưng
   **chưa có Test Idea nguồn** → ghi `[GAP — chuyển 06-coverage-review bổ sung]`, không lặng lẽ bỏ qua.
4. **Pre-output Quality Audit** — tự rà và loại bỏ 5 lỗi thường gặp:

   | Lỗi | Dấu hiệu |
   |---|---|
   | Expected Result mơ hồ | Thiếu trạng thái / thông điệp / kết quả định lượng cụ thể |
   | Test Data chung chung | Từ ngữ ước lệ, placeholder thiếu giá trị thực thi |
   | Steps bị gộp hành động | Một bước chứa nhiều thao tác, khó tái hiện |
   | Thiếu Precondition | Không mô tả trạng thái hệ thống/tài khoản trước khi thực hiện |
   | Scope Creep | Ca kiểm thử không xuất phát từ Test Idea "Giữ" hoặc rule hiện có |

## Định dạng trường bắt buộc
| Trường | Quy tắc |
|---|---|
| `TC_ID` | `[MODULE]-[3 chữ số]` — vd `AUTH-001`, `PAY-012` |
| `Title` | Bắt đầu bằng `Verify` / `Validate` / `Confirm` + hành động + điều kiện |
| `Precondition` | Trạng thái hệ thống, dữ liệu nền, quyền hạn user trước khi bắt đầu |
| `Test Steps` | Đánh số 1,2,3… · mỗi step đúng 01 thao tác · tối đa 8 steps |
| `Test Data` | Giá trị tường minh, cụ thể — cấm placeholder |
| `Expected Result` | Cụ thể, có tiêu chí đo lường để phân định Pass/Fail |
| `Priority` | High / Medium / Low |
| `Tags` | `Rule#[ID]`, `Viewpoint#[ID/Tên]`, `Module#[Tên]`, `[Automated/Manual]` |

## Format output
Ghi ra `output/<task-slug>/05_test_case_spec.md`:

```markdown
# TEST CASE SPECIFICATION

## [MODULE_NAME] — TEST CASES

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

*(Tiếp tục cho toàn bộ Test Idea "Giữ")*
```
