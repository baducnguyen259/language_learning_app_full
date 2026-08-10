# Các phần tạm bỏ qua

## Media Upload cho Vocabulary

Phần Media Upload đang được tạm hoãn. Mục tiêu của phần này là hỗ trợ tải ảnh và audio cho từ vựng, sau đó lưu URL nhận được vào `Vocabulary.imageUrl` và `Vocabulary.audioUrl`.

### API dự kiến

- `POST /api/admin/media/vocabularies/image`: tải ảnh từ vựng.
- `POST /api/admin/media/vocabularies/audio`: tải audio phát âm.

Hai API phải được bảo vệ bởi `JwtAuthGuard`, `RolesGuard` và chỉ cho phép `UserRole.ADMIN`.

### Package cần bổ sung

```bash
npm install -D @types/multer
```

### Các file cần tạo hoặc hoàn thiện

1. `language_learning_backend/src/modules/media/dto/create_media.dto.ts`
   - Tạo `UploadMediaFileDto`.
   - Khai báo file Swagger với `type: 'string'` và `format: 'binary'`.

2. `language_learning_backend/src/modules/media/dto/media_response.dto.ts`
   - Tạo `MediaUploadResponseDto`.
   - Các field: `url`, `mimeType`, `size`, `originalName`.

3. `language_learning_backend/src/modules/media/media.service.ts`
   - Tạo tên file bằng `randomUUID()`.
   - Không dùng trực tiếp `file.originalname` làm tên lưu trữ.
   - Tạo thư mục bằng `mkdir(..., { recursive: true })`.
   - Ghi `file.buffer` bằng `writeFile()`.
   - Lưu ảnh vào `uploads/vocabularies/images`.
   - Lưu audio vào `uploads/vocabularies/audio`.
   - Trả URL dạng `/uploads/vocabularies/images/<file>` hoặc `/uploads/vocabularies/audio/<file>`.

4. `language_learning_backend/src/modules/media/controllers/admin_media.controller.ts`
   - Dùng `FileInterceptor('file')`.
   - Dùng `ParseFilePipeBuilder` để validate file.
   - Ảnh cho phép: JPEG, PNG, WebP, GIF.
   - Giới hạn ảnh: 5 MB.
   - Audio cho phép: MP3, WAV, OGG, WebM, M4A.
   - Giới hạn audio: 15 MB.
   - Thêm Swagger `@ApiConsumes('multipart/form-data')` và `@ApiBody()`.

5. `language_learning_backend/src/main.ts`
   - Tạo app với `NestExpressApplication`.
   - Dùng `app.useStaticAssets()` để phục vụ thư mục `uploads`.
   - File public được truy cập qua `/uploads/...`, không đi qua prefix `/api`.

### Luồng sử dụng sau khi hoàn thiện

1. Admin tải ảnh hoặc audio qua Media API.
2. Backend validate MIME type và dung lượng.
3. Backend tạo tên file ngẫu nhiên và lưu vào thư mục `uploads`.
4. Backend trả `url` của file.
5. Frontend dùng URL đó khi tạo hoặc cập nhật Vocabulary.

Ví dụ tạo Vocabulary sau khi upload:

```json
{
  "term": "안녕하세요",
  "pronunciation": "annyeonghaseyo",
  "meaning": "Xin chào",
  "imageUrl": "/uploads/vocabularies/images/<file>.webp",
  "audioUrl": "/uploads/vocabularies/audio/<file>.mp3",
  "status": "ACTIVE",
  "lessonId": "<lessonId>"
}
```

### Lưu ý khi triển khai

- Local file storage chỉ phù hợp cho môi trường phát triển hoặc một server duy nhất.
- Khi chạy nhiều server/container, nên chuyển sang object storage như S3.
- Không tin tên file hoặc MIME type do client tự khai báo.
- Không cho phép SVG ở giai đoạn này để giảm rủi ro chèn nội dung không an toàn.
- Cần thêm thư mục upload runtime vào `.gitignore`, nhưng vẫn có thể giữ `uploads/.gitkeep` nếu dự án cần giữ cấu trúc thư mục.

### Trạng thái

- Chưa triển khai Media Upload.
- Chưa thay đổi `MediaService` và `AdminMediaController`.
- Chưa cấu hình static assets trong `main.ts`.
- Vocabulary hiện vẫn có thể lưu `imageUrl` và `audioUrl` dạng chuỗi nếu URL được cung cấp từ nguồn khác.
