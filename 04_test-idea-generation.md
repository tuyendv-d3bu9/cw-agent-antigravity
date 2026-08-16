# TEST IDEA GENERATION — Prompt Chain & Filtering
Nguồn: Module 2 — Bài 2.4 (AI-Generated Test Ideas)

## Mục đích
Chuẩn hóa cách Analyst sinh Test Idea từ Viewpoint, và cách filter trước khi
expand thành Test Case đầy đủ — tránh việc mỗi học viên filter theo cảm tính
khác nhau.

## Phân biệt Test Idea vs Test Case (Analyst phải tuân thủ nghiêm)

|  | Test Idea | Test Case |
|---|---|---|
| Định nghĩa | Ý tưởng kiểm tra — 1 câu | Kịch bản đầy đủ, có steps + expected result |
| Độ chi tiết | 1 câu mô tả | Nhiều trường: ID/Title/Precondition/Steps/Expected/Priority |
| Khi nào dùng | Brainstorm, coverage check | Execution, regression, submit Jira/TestRail |

## Prompt Chain — 5 bước cố định thứ tự (KHÔNG được nhảy bước)

1. Requirement Summary (dùng `requirement-summary-template.md`)
2. Viewpoint Generation (dùng `viewpoint-library.md`)
3. Test Idea Generation — mỗi viewpoint sinh 5–10 test idea
4. Human Filtering — tester review, loại duplicate, chọn top idea quan trọng
5. Test Case Expansion — top idea → full test case (dùng
   `testcase-format-standard.md`)

## Tiêu chí Filter — checklist cố định (dùng cho verdict Giữ/Bỏ)

**Giữ lại idea nếu thỏa ít nhất 1 trong các điều kiện:**
- Trực tiếp kiểm tra business rule đã được xác định trong Requirement Summary
- Rủi ro cao nếu không test (business impact lớn)
- Chưa có test case nào trong suite hiện tại cover
- Có thể viết expected result rõ ràng, verify được

**Bỏ idea nếu thỏa bất kỳ điều kiện nào:**
- Trùng lặp hoàn toàn với idea khác đã có
- Quá trivial — hiển nhiên đúng, không thể fail
- Ngoài scope của sprint/release hiện tại (đối chiếu Out of Scope ở Requirement Summary)
- Idea quá mơ hồ, không thể định nghĩa expected result

## Ràng buộc số lượng (hard constraint)
- Mỗi viewpoint: sinh 5–10 test idea, không dưới 5.
- Tổng test idea với ≥4 viewpoint: tối thiểu 20 (khớp Assignment 2).
- Sau bước Filter, Analyst phải xuất bảng đầy đủ: `# | Test Idea | Viewpoint |
  Giữ/Bỏ | Lý do filter` — lý do filter bắt buộc trích từ checklist trên,
  không viết tự do.

## Liên kết với FACT
- C (Complete): đủ ≥20 test idea, đủ ≥4 viewpoint đã cover.
- T (Testable): mỗi idea giữ lại phải viết được expected result rõ ràng khi expand.