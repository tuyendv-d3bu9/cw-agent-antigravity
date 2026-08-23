# RCTFC — Cấu Trúc Prompt Chuẩn (Role / Context / Task / Format / Constraint)
Nguồn: Module 1 — Bài 1.3 (Prompt Engineering cho Testing)

## Mục đích
Đây là khung BẮT BUỘC khi QA Leader soạn prompt cho bất kỳ Agent nào (Analyst,
và các agent phát sinh sau này). Một prompt thiếu bất kỳ thành phần nào trong
5 thành phần dưới đây được coi là prompt KHÔNG ĐẠT chuẩn — QA Leader phải viết
lại trước khi giao cho Analyst.

## 5 thành phần bắt buộc (đủ, đúng thứ tự khi trình bày)

| # | Thành phần | Mô tả | Câu hỏi tự kiểm tra |
|---|---|---|---|
| R | **Role** (Vai trò) | Đặt AI vào vai trò cụ thể để định hướng cách phản hồi | Prompt có nói rõ AI đóng vai gì, bao nhiêu năm kinh nghiệm, chuyên môn gì không? |
| C | **Context** (Bối cảnh) | Thông tin nền: tính năng, hệ thống, business rule liên quan | Prompt có đủ domain context để AI không phải đoán không? |
| T | **Task** (Nhiệm vụ) | Mô tả rõ ràng AI cần làm gì | Task có đo lường được không (số lượng, phạm vi cụ thể)? |
| F | **Format** (Định dạng) | Chỉ định format output mong muốn | Có nói rõ bảng/markdown/số cột/tên field không? |
| C | **Constraint** (Giới hạn) | Giới hạn scope, loại bỏ thứ không cần | Có nói rõ KHÔNG bao gồm gì, không được bịa gì không? |

## Ví dụ minh họa (chuẩn so sánh — Analyst dùng làm baseline)

**❌ Prompt kém (thiếu cả 5 thành phần):**
> "Viết test case cho tính năng đăng nhập"
→ Vấn đề: không role, không context, không format, không constraint → AI tự đoán tất cả → output chung chung.

**✅ Prompt tốt (đủ RCTFC):**
> "Bạn là Senior QA Engineer [R]. Tôi đang test tính năng Đăng nhập của app
> web với field Email (required), Password (min 8 ký tự) [C]. Sinh 8 test
> case gồm: happy path, negative case và boundary value [T]. Format bảng:
> TC_ID │ Title │ Precondition │ Steps │ Expected │ Priority [F]. Không bao
> gồm test case cho forgot password [C]."

## 4 dạng Prompt — chọn dạng phù hợp khi QA Leader soạn cho từng loại task

| Dạng | Khi nào dùng | Đặc điểm |
|---|---|---|
| Zero-shot | Task quen thuộc, AI đủ context chung | Không cần ví dụ mẫu |
| Few-shot | Cần output đúng format cụ thể/domain đặc thù | Cung cấp 1–3 ví dụ mẫu trước khi yêu cầu |
| Chain-of-thought | Task phức tạp, cần phân tích từng bước | Yêu cầu AI liệt kê từng bước trước khi kết luận |
| Template-based | Task lặp lại nhiều lần với input khác nhau | Dùng {{placeholder}} — chỉ thay biến mỗi lần dùng |

**Quy ước chọn dạng cho các bước trong Module 02:**
- Requirement Summary → Chain-of-thought (7 bước cố định)
- Missing Rule Finder (06W) → Chain-of-thought + 5W1H
- Test Case Generator → Few-shot + Template-based (cần đúng format Jira/TestRail)
- Coverage Gap Analyzer → Chain-of-thought (3 bước cố định)

## Nguyên tắc viết prompt hiệu quả (QA Leader áp dụng khi soạn)
- Cụ thể hơn luôn tốt hơn: thay "viết test case" bằng "sinh 8 test case cho
  field Email gồm happy path và negative case".
- Một prompt = một nhiệm vụ rõ ràng — không nhồi nhiều việc vào 1 prompt.
- Cung cấp ví dụ mẫu khi cần format cụ thể (few-shot).
- Luôn có Constraint chặn AI bịa thông tin ngoài input được cung cấp.

## Checklist trước khi QA Leader giao prompt cho Analyst
- [ ] Có đủ 5 thành phần R-C-T-F-C, không thiếu thành phần nào.
- [ ] Task có ràng buộc số lượng cụ thể (VD: ≥5, ≥20...), không mơ hồ "vài".
- [ ] Format có nêu rõ tên field/số cột, khớp với `testcase-format-standard.md`
      hoặc file knowledge liên quan.
- [ ] Constraint có câu chặn hallucination: "Chỉ dùng thông tin được cung cấp,
      không bịa thêm."