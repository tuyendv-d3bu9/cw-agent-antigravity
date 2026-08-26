# EXPLORATORY CHARTER — Session-Based Testing Technique
Nguồn: Module 3 — Bài 3.4 (Exploratory Testing with AI — Charter-based)

## Mục đích
Chuẩn hóa cách sinh Exploratory Charter để định hướng các phiên kiểm thử thăm dò
do CON NGƯỜI thực hiện — tránh việc thăm dò tùy hứng, không mục tiêu, không đo được.

## Định nghĩa — Charter vs Test Case scripted (phải phân biệt nghiêm)

|  | Exploratory Charter | Test Case scripted |
|---|---|---|
| Bản chất | Sứ mệnh + vùng khám phá, do người test điều khiển | Kịch bản cố định từng bước |
| Độ chi tiết | Định hướng (không steps chi tiết) | Steps/Precondition/Expected đầy đủ |
| Khi nào dùng | Vùng rủi ro cao, logic mơ hồ, tính năng mới | Regression, execution có thể lặp lại |

## Cấu trúc bắt buộc 05 trường của 1 Charter
1. **Mission** — mục tiêu khám phá: "Khám phá … để phát hiện …".
2. **Area** — khu vực/màn hình/luồng dữ liệu cụ thể trong phạm vi thăm dò.
3. **Risk** — rủi ro chính Charter nhắm tới (trace về Risk Area/Rule nguồn).
4. **Time-box** — khung thời gian một phiên, thực tế cho con người (gợi ý 30–90 phút).
5. **Notes** — điểm cần chú ý, biến thể dữ liệu nên thử, câu hỏi mở cần trả lời.

## Nguyên tắc chọn Charter theo Risk
- Mỗi Charter tập trung **một** rủi ro khác biệt; không gộp nhiều rủi ro.
- Ưu tiên rủi ro cao (Likelihood × Impact) trước.
- Bao phủ đầy đủ các rủi ro cao theo bản chất nghiệp vụ — dùng ngôn ngữ định tính
  ("đủ mọi rủi ro cao áp dụng được"), KHÔNG áp quota số lượng cứng.
- Rủi ro/vùng cần góc nhìn ngoài dữ liệu đã cho: gắn `[GIẢ ĐỊNH]` kèm lý do.

## Ràng buộc (hard constraint)
- KHÔNG kịch bản hóa: cấm viết Steps/Precondition/Expected chi tiết như Test Case.
- Time-box phải khả thi cho một phiên người thực hiện, không phi thực tế.
- Trường Risk phải trace được về Risk Area/Rule nguồn.

## Human-Final
Phạm vi thăm dò thực tế, độ sâu và thời lượng cuối cùng do người test chốt — agent
chỉ đề xuất Charter, không thay con người quyết định điều tra tới đâu.

## Liên kết với FACT
- F (Factual): rủi ro & vùng khám phá bám sát Risk Area/Requirement gốc, không bịa.
- C (Complete): đủ 05 trường mỗi Charter; bao phủ đầy đủ rủi ro cao.
- T (Testable): Mission đủ rõ để biết cần khám phá gì và khi nào coi là "đã đủ".
