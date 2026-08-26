# Deliverables Index · function-d

| STT | File Deliverable | Skill / Chủ quản | Verdict | Trạng thái | Ghi chú |
|---|---|---|---|---|---|
| 01 | [`01_requirement_risk_summary.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/01_requirement_risk_summary.md) | `agents/qa-analyst/skills/01-requirement-risk-summary.md` | **PASS** | Hoàn thành | 14 Business Rules, 7 Alternate Flows, 6 Open Questions đã xác nhận, 6 Risk items |
| 02 | [`02_missing_rule_report.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/02_missing_rule_report.md) | `agents/qa-analyst/skills/02-missing-rule-06w.md` | **PASS** | Hoàn thành | 12 Missing Rules (MR-01 → MR-12) qua 06W, 12 câu hỏi clarification |
| 03 | [`03_viewpoint_report.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/03_viewpoint_report.md) | `agents/qa-analyst/skills/03-viewpoint-selection.md` | **PASS** | Hoàn thành | Phủ 8/8 Viewpoint chuẩn, Ma trận Zero-Overlap, Ánh xạ 7 Risk Areas |
| 04 | [`04_test_idea_report.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/04_test_idea_report.md) | `agents/qa-analyst/skills/04-test-idea-design.md` | **PASS** | Hoàn thành | 42 Test Ideas: 38 Giữ / 4 Bỏ, áp dụng EP, BVA, Decision Table, State Transition |

---

### Sẵn sàng bàn giao cho các Agent tiếp theo:
- **`agents/qa-test-design`**: Sử dụng 38 Test Ideas `Giữ` từ [`04_test_idea_report.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/04_test_idea_report.md) để sinh Test Case 8 trường chuẩn (`05-test-case-generation`) và đối chiếu độ bao phủ (`06-coverage-review`).
- **`agents/qa-test-data`**: Sử dụng các mốc biên từ [`03_viewpoint_report.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/03_viewpoint_report.md) và Domain Constants từ [`knowledge/function-d.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/knowledge/function-d.md) để chuẩn bị dataset.
- **`agents/qa-exploratory`**: Khai thác các kẽ hở logic từ [`02_missing_rule_report.md`](file:///c:/Users/tuyendv7517/Documents/Research/CWTechAcademy/gitlab/cw-agent-antigravity/OUTPUT/function-d/02_missing_rule_report.md) để xây dựng kịch bản kiểm thử thăm dò (Session-based testing).
