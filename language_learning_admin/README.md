# Language Learning Admin

Trang quản trị cho hệ thống học ngôn ngữ, xây dựng bằng React, TypeScript, Vite, Material UI, React Router, TanStack Query và Axios.

## Chạy dự án

```bash
npm install
npm run dev
```

Sao chép `.env.example` thành file môi trường phù hợp và thay `VITE_API_BASE_URL` bằng URL API thực tế.

## Cấu trúc chính

- `src/app`: provider toàn ứng dụng, router và theme.
- `src/components`: component dùng chung theo nhóm chức năng.
- `src/features`: nghiệp vụ độc lập của từng module quản trị.
- `src/layouts`: khung giao diện admin và xác thực.
- `src/lib`: Axios client và TanStack Query client.
- `src/types`: kiểu dữ liệu dùng chung và kiểu response API.
- `src/utils`: tiện ích không phụ thuộc giao diện.

`ProtectedRoute` đang kiểm tra access token tại khóa `access_token` trong `localStorage`. Sau khi tích hợp API đăng nhập, lưu token vào khóa này hoặc thay bằng auth store của dự án.

## Kiểm tra chất lượng

```bash
npm run lint
npm run build
```
