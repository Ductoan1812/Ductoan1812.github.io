# 🚀 Hướng dẫn Deploy Portfolio lên GitHub Pages

## Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Đặt tên repository: `your-username.github.io` (thay `your-username` bằng tên GitHub của bạn)
4. Chọn **Public**
5. **KHÔNG** tích vào "Add a README file"
6. Click **"Create repository"**

## Bước 2: Upload files lên GitHub

### Cách 1: Upload trực tiếp qua web
1. Vào repository vừa tạo
2. Click **"uploading an existing file"**
3. Kéo thả các file: `index.html`, `styles.css`, `script.js`, `README.md`
4. Thêm commit message: "Initial portfolio upload"
5. Click **"Commit changes"**

### Cách 2: Sử dụng Git commands
```bash
# Khởi tạo git repository
git init

# Thêm remote origin
git remote add origin https://github.com/your-username/your-username.github.io.git

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial portfolio upload"

# Push lên GitHub
git push -u origin main
```

## Bước 3: Kích hoạt GitHub Pages

1. Vào repository trên GitHub
2. Click tab **"Settings"**
3. Scroll xuống phần **"Pages"** (bên trái)
4. Trong **"Source"**, chọn **"Deploy from a branch"**
5. Chọn branch **"main"** và folder **"/ (root)"**
6. Click **"Save"**

## Bước 4: Truy cập Portfolio

- Portfolio sẽ có địa chỉ: `https://your-username.github.io`
- Có thể mất 5-10 phút để deploy hoàn tất
- Refresh trang để kiểm tra

## 🔧 Tùy chỉnh Portfolio

### Thay đổi thông tin cá nhân:
1. Mở file `index.html`
2. Tìm và thay đổi:
   - Tên: `<span>Nông Đức Toàn</span>`
   - Email: `Toan.tq.hy.24@gmail.com`
   - LinkedIn: `https://linkedin.com/in/your-profile`
   - GitHub: `@yourusername`

### Thêm dự án mới:
1. Copy một `.project-card` trong `index.html`
2. Thay đổi:
   - Tên dự án
   - Mô tả
   - Công nghệ sử dụng
   - Links GitHub/Demo

### Thay đổi màu sắc:
1. Mở file `styles.css`
2. Tìm các biến màu:
   - `#6366f1` (màu chính)
   - `#ff6b6b` (màu accent)
   - Thay đổi theo ý muốn

## 📱 Kiểm tra Responsive

- Mở Developer Tools (F12)
- Click icon mobile/tablet
- Kiểm tra trên các kích thước màn hình khác nhau

## 🔄 Cập nhật Portfolio

Mỗi khi thay đổi:
```bash
git add .
git commit -m "Update portfolio"
git push
```

## 🎯 Tips để Portfolio nổi bật

1. **Thêm ảnh dự án thật**: Thay placeholder bằng ảnh screenshot game
2. **Video demo**: Embed video YouTube/Vimeo vào project cards
3. **Live links**: Thêm links đến game đã publish
4. **Testimonials**: Thêm feedback từ khách hàng/đồng nghiệp
5. **Blog section**: Viết về kinh nghiệm phát triển game

## 🚨 Lưu ý quan trọng

- Repository phải có tên `username.github.io` để GitHub Pages hoạt động
- File chính phải là `index.html` trong root folder
- Đảm bảo tất cả links trong code đều đúng
- Test portfolio trên nhiều trình duyệt khác nhau

## 🆘 Troubleshooting

**Portfolio không hiển thị:**
- Kiểm tra tên repository có đúng format không
- Đợi 10-15 phút sau khi enable GitHub Pages
- Kiểm tra Settings → Pages có đúng branch không

**CSS không load:**
- Kiểm tra đường dẫn file CSS trong HTML
- Đảm bảo file `styles.css` đã được upload

**JavaScript không hoạt động:**
- Mở Developer Console (F12) để xem lỗi
- Kiểm tra đường dẫn file JS trong HTML

---

🎉 **Chúc mừng!** Portfolio của bạn đã sẵn sàng để ứng tuyển vị trí Game Developer!
