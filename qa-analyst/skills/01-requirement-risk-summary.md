# Skill: 01-requirement-risk-summary

> Tuân thủ `shared/QA_STANDARD.md` (verdict · guard · FACT · 06W · risk matrix 3x3).

## Mục đích
Chuyển requirement thô thành **Requirement Summary 7 phần** + **Business Criticality & Risk
Analysis 3 phần**. Là cửa ngõ đầu tiên của pipeline — mọi bước sau dựa trên output này.

## Tham số
- `input-type` ∈ `prose` · `user-story` · `wireframe` · `email-chat` — tự nhận diện ở Bước 0.

## Đầu vào
- Tài liệu yêu cầu thô: BRD / SRS / User Story / Wireframe + mô tả UI / email-chat từ BA.
- `knowledge/_project.md` · `knowledge/<feature-slug>.md` nếu đã có (xem `shared/QA_STANDARD.md` §8).

> **Knowledge thắng giả định**: Bước 8/9 dưới đây chỉ gắn `[CONTEXT_MISSING]` cho khía cạnh mà
> **cả** tài liệu đầu vào **và** `knowledge/_project.md` §3 đều không có. Đã có trong knowledge
> thì dùng luôn, ghi rõ nguồn là knowledge.

## KHÔNG được (riêng skill này)
- Sinh viewpoint, test idea hay test case — đó là skill 03/04 và `qa-test-design`.
- Tự suy diễn Business Context. Thiếu dữ liệu bối cảnh → bắt buộc `[CONTEXT_MISSING]`.
- Đánh Severity chỉ dựa trên tài liệu Requirement đơn thuần (xem Bước 10).

## Các bước

| # | Bước | Yêu cầu |
|---|---|---|
| 0 | Nhận diện dạng input | Xác định 1 trong 4 dạng ở `input-type` |
| 1 | Feature Overview | 1–2 câu: mục đích + giá trị cốt lõi cho user |
| 2 | Actor & User Role | Mọi loại user, vai trò phân quyền, system actor có tương tác |
| 3 | Business Rules | Trích **toàn bộ** rule có trong tài liệu. Đánh số `BR-01`, `BR-02`… mỗi rule 1 dòng |
| 4 | Happy Path | Luồng chính thành công, step-by-step, dạng kịch bản kiểm thử được |
| 5 | Alternate Flows | Luồng phụ / rẽ nhánh / ngoại lệ / lỗi được đề cập |
| 6 | Out of Scope | Ghi rõ những gì tài liệu KHÔNG đề cập |
| 7 | Open Questions | **Tối thiểu 5 câu**. Tài liệu càng đầy đủ càng phải dùng 06W (§4) để đào góc khuất |
| 8 | Business Criticality Assessment | Thu thập Business Context phục vụ Risk Analysis. Không có dữ liệu → `[CONTEXT_MISSING]` |
| 9 | Missing Risk Context | Quét đủ 5 khía cạnh (bảng dưới), tổng hợp 3 mục *Available / Missing / Risk Analysis Impact* |
| 10 | Risk Analysis & Prioritization | Ma trận 3x3 (§5) + 3 đánh giá tác động chiến lược |

### Bước 9 — 5 khía cạnh Missing Risk Context
| Khía cạnh | Thiếu gì |
|---|---|
| Missing **User** Context | Phân nhóm, đặc trưng người dùng |
| Missing **Usage** Context | Tần suất sử dụng, tải hệ thống, thời gian cao điểm |
| Missing **Financial** Context | Dòng tiền, giá trị giao dịch, tác động doanh thu |
| Missing **Operational** Context | Quy trình vận hành, SLA, khả năng phục hồi |
| Missing **Criticality** Context | Mức quan trọng của tính năng với tổng thể sản phẩm |

Mỗi khía cạnh ghi: *thiếu dữ liệu nào* | *ảnh hưởng tới Risk Analysis thế nào* | *mức độ HIGH/MED/LOW*.

### Bước 10 — nguồn đánh giá Risk (bắt buộc đủ 4)
Business Rules · Gap Analysis (từ Open Questions / logic trống) · Business Criticality
Assessment · Missing Risk Context Information.

## Format output
Ghi ra `output/<task-slug>/01_requirement_risk_summary.md`, giữ nguyên thứ tự 10 phần:

```markdown
# REQUIREMENT & RISK ANALYSIS REPORT
**Dạng tài liệu nhận diện**: [Prose Document | User Story | Wireframe + Mô tả | Email/Chat Thread]

## 1. FEATURE OVERVIEW
[1–2 câu]

## 2. ACTOR & USER ROLE
- [Actor/Role]: [vai trò/quyền hạn]

## 3. BUSINESS RULES
- BR-01: [nội dung]
- BR-02: [nội dung]

## 4. HAPPY PATH
1. [bước 1]  2. [bước 2]  3. [kết quả mong đợi]

## 5. ALTERNATE FLOWS
### AF-01: [tên luồng]
1. [bước 1]

## 6. OUT OF SCOPE
- [ngoài phạm vi 1]

## 7. OPEN QUESTIONS
- Q1: [câu hỏi]   … (≥5 câu, kết hợp 06W)

## 8. BUSINESS CRITICALITY ASSESSMENT
- **Trạng thái dữ liệu bối cảnh**: [Đầy đủ | [CONTEXT_MISSING]]
- **Bối cảnh nghiệp vụ ghi nhận**: [nội dung, hoặc [CONTEXT_MISSING]]

## 9. MISSING RISK CONTEXT INFORMATION
### 9.1 Chi tiết theo khía cạnh
- **Missing User Context**: [dữ liệu thiếu | ảnh hưởng | HIGH/MED/LOW]
- **Missing Usage Context**: …
- **Missing Financial Context**: …
- **Missing Operational Context**: …
- **Missing Criticality Context**: …

### 9.2 Tổng hợp
- **Available Context**: […]
- **Missing Context**: […]
- **Risk Analysis Impact**: […]

## 10. RISK ANALYSIS & PRIORITIZATION
### 10.1 Nguồn đánh giá Risk
- **Business Rules**: [số lượng & độ phức tạp]
- **Gap Analysis**: [vùng trống logic từ Open Questions / Alternate Flows]
- **Business Criticality Assessment**: [mức quan trọng ghi nhận được]
- **Missing Risk Context Information**: [mức ảnh hưởng của dữ liệu bị thiếu]

### 10.2 Ma trận Đánh giá Rủi ro (3x3)
| Mã rủi ro | Likelihood | Impact | Risk Level | Severity | Cờ tin cậy | Lý do (5 yếu tố Impact) |
|:---|:---|:---|:---|:---|:---|:---|
| RK-01: [tên] | [HIGH/MED/LOW] | [HIGH/MED/LOW] | [CRITICAL/HIGH/MED/LOW] | [Critical/Major/Minor] | [SEVERITY_CONFIDENCE_HIGH \| SEVERITY_CONFIDENCE_LOW] | [giải thích] |

### 10.3 Đánh giá tác động chiến lược
- **Impact to Risk Analysis**: [độ chính xác & toàn diện của bức tranh rủi ro]
- **Impact to Test Prioritization**: [thứ tự ưu tiên thực thi theo Risk Level]
- **Impact to Coverage Strategy**: [vùng nào Deep Testing/Automation, vùng nào Sanity/Smoke]
```

## Ghi knowledge
Sau khi xuất báo cáo, cập nhật `knowledge/<feature-slug>.md` (tạo từ `knowledge/_template.md`
nếu chưa có):

| Mục knowledge | Lấy từ |
|---|---|
| 1 Feature Overview · 2 Actor · 4 Happy Path · 5 Alternate Flows · 6 Out of Scope | phần 1, 2, 4, 5, 6 của báo cáo |
| 3 Business Rules | phần 3 — trạng thái `Confirmed` nếu ghi rõ trong tài liệu |
| 7 Open Questions | phần 7 — trạng thái `New` |
| 9 Domain constant | hằng số nghiệp vụ trích được (format mã, khoảng giá trị, đơn vị) |
| 10 Traceability | nguồn của từng `BR-xx` |

## Chốt chặn
- Đủ 10 phần, đúng thứ tự, không gộp.
- Hoàn thành trọn vẹn báo cáo này **trước khi** chuyển sang skill 02.
