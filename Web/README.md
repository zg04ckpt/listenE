# ListenE - Ứng dụng học tiếng Anh qua luyện nghe

ListenE là một ứng dụng web giúp người dùng cải thiện kỹ năng tiếng Anh thông qua các bài tập luyện nghe và tương tác.

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

- Node.js (phiên bản 16.x trở lên)
- npm (thường đi kèm với Node.js) hoặc yarn
- Git

## Cài đặt

1. Clone dự án về máy:

```bash
git clone <repository-url>
cd ListenE
```

2. Cài đặt các dependencies:

```bash
npm install
# hoặc nếu bạn dùng yarn
yarn install
```

## Cấu hình môi trường

1. Tạo file `.env` trong thư mục gốc của dự án:

```bash
cp .env.example .env
```

2. Cập nhật các biến môi trường trong file `.env`:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=ListenE
```

## Chạy dự án

### Môi trường development

```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

### Build cho production

```bash
npm run build
# hoặc
yarn build
```

### Preview bản build

```bash
npm run preview
# hoặc
yarn preview
```

## Cấu trúc thư mục

```
src/
├── api/          # Chứa các API calls
├── assets/       # Chứa hình ảnh, fonts, etc.
├── components/   # Các components tái sử dụng
├── hooks/        # Custom React hooks
├── layouts/      # Layout components
├── pages/        # Các trang của ứng dụng
├── provider/     # Context providers
├── routes/       # Cấu hình routing
├── sections/     # Các section components
├── theme/        # Cấu hình theme
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

## Công nghệ sử dụng

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Router
- Framer Motion
- Axios

## Tính năng chính

- Học tiếng Anh qua các bài tập luyện nghe
- Hệ thống bài tập đa dạng (Part 1, Part 2, Part 3, Part 4)
- Theo dõi tiến độ học tập
- Đánh dấu bài tập yêu thích
- Giao diện người dùng thân thiện và responsive

## Hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình cài đặt hoặc sử dụng, vui lòng:

1. Kiểm tra các issues đã có
2. Tạo issue mới với mô tả chi tiết về vấn đề
3. Liên hệ với team phát triển

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp từ cộng đồng. Để đóng góp:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được cấp phép theo [MIT License](LICENSE).
