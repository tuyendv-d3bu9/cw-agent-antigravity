# TỔNG HỢP DANH SÁCH DEFECTS TỪ JIRA · SHOPGO
Thời gian đồng bộ: 2026-09-16T08:39:42.076Z · Nguồn: Jira Cloud / Staging

> [!NOTE]
> Đây là dữ liệu mẫu đồng bộ tự động khi chưa nạp thông tin kết nối thực tế tại `.env`.

| Issue Key | Summary | Severity | Status | Component | Ghi chú cho QA |
|---|---|---|---|---|---|
| `SHOPGO-102` | Lỗi không trim khoảng trắng mã giảm giá khi paste từ clipboard | Medium | Closed | VCHR | Cần test kỹ case space đầu/cuối |
| `SHOPGO-145` | Áp mã % vượt quá trần Max Cap vẫn tính nguyên chiết khấu | High | Resolved | VCHR | Chú ý kiểm thử biên giáp trần Max Cap |
| `SHOPGO-208` | Khách chưa login bấm áp mã bị crash màn hình checkout | High | Closed | AUTH/VCHR | Kiểm tra tiền điều kiện xác thực người dùng |
| `SHOPGO-256` | Hủy đơn không thấy voucher hoàn lại về ví người dùng | Critical | Reopened | VCHR/ORDER | Kiểm thử kỹ luồng huỷ và rollback trạng thái mã |

### Hướng dẫn cấu hình kết nối thật:
Tạo file `.env` ở thư mục gốc với các thông số:
```env
JIRA_HOST=https://your-company.atlassian.net
JIRA_EMAIL=qa-lead@shopgo.vn
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=SHOPGO
```