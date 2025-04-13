# ListenE - Website Luyện Nghe Tiếng Anh Trực Tuyến

**ListenE** là nền tảng học tiếng Anh tập trung vào kỹ năng *nghe* thông qua phương pháp **Nghe – Chép**, giúp người học cải thiện khả năng nghe hiểu một cách chủ động và có hệ thống.

## 🎯 Mục Tiêu
- Cung cấp nền tảng luyện nghe phân cấp rõ ràng (Topic → Session → Track → Segment).
- Tự động chấm điểm nội dung nghe và kiểm tra lỗi sai từng từ.
- Hỗ trợ người học luyện nghe hiệu quả với các công cụ như: lưu lịch sử, bài yêu thích, thống kê tiến trình, và thử thách hàng tuần.

## 🚀 Công Nghệ Sử Dụng
- **Frontend:** React + TypeScript, triển khai qua Vercel.
- **Backend:** ASP.NET Core API (C#), triển khai với Docker.
- **Database:** MySQL + Entity Framework.
- **Khác:** Redis, Cloudinary, Google OAuth, MailKit, Docker.

## ⚙️ Kiến Trúc Hệ Thống
- **Client - Server RESTful API**.
- Backend theo kiến trúc phân tầng (API - Core - Data), áp dụng Clean Architecture.

## 🧩 Các Module Chính

### 1. Xác thực và phân quyền
- Đăng ký / Đăng nhập (Google + Email)
- Quên mật khẩu qua email
- Phân quyền User, Manager, Admin

### 2. Luyện Nghe
- Danh mục phân cấp: Topic → Session → Track → Segment
- Nghe audio từng câu, gõ nội dung và kiểm tra lỗi sai từng từ
- Tùy chọn tốc độ phát, auto-play, toggle transcript

### 3. Người Dùng
- Lưu bài yêu thích, lịch sử nghe
- Xem thống kê luyện tập (từ đúng/sai theo ngày)
- Bình luận bài nghe

### 4. Thử Thách Hàng Tuần (Weekly Challenge)
- Một track duy nhất, chỉ được nghe một lần
- Tự động chấm điểm theo số từ đúng và thời gian hoàn thành
- Bảng xếp hạng theo điểm số