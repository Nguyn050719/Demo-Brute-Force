# Demo Brute Force - Tiệm Sách Lumina

Dự án này là một trang web bán sách trực tuyến đơn giản (Tiệm Sách Lumina) được tích hợp thêm tính năng mô phỏng tấn công Brute Force (Dò mật khẩu) nhằm mục đích giáo dục và nâng cao nhận thức về an toàn thông tin.

## Cấu trúc dự án

Dự án được chia làm 2 phần:
1. **Backend (Máy chủ):** Viết bằng Node.js, sử dụng Express và cơ sở dữ liệu SQLite. Nhiệm vụ quản lý lưu trữ dữ liệu người dùng, sách và cung cấp giao tiếp API.
2. **Frontend (Giao diện):** Viết bằng React (Vite). Sử dụng để người dùng vào mua sách và bảng điều khiển trực quan cho quản trị mô phỏng việc tấn công.

## Hướng dẫn cài đặt và chạy máy chủ (Dành cho người mới)

Để chạy trang web này trên máy tính của bạn, hãy làm theo các bước sau:

### Bước 1: Cài đặt phần mềm yêu cầu
Đảm bảo máy tính của bạn đã cài đặt **Node.js**. 
Nếu chưa có, hãy vào trang web [https://nodejs.org/](https://nodejs.org/), tải phiên bản **LTS** và cài đặt (Cứ ấn Next đến khi hoàn tất).

### Bước 2: Tải mã nguồn về máy
Tải toàn bộ thư mục dự án này về máy tính của bạn và giải nén.

### Bước 3: Cài đặt thư viện và khởi động máy chủ Backend (Cơ sở dữ liệu)
1. Mở thư mục `backend` trong dự án.
2. Click chuột trái vào thanh địa chỉ (đường dẫn thư mục) ở trên cùng của File Explorer, gõ chữ `cmd` rồi nhấn Enter. Một cửa sổ đen mầu nhiệm sẽ hiện ra.
3. Gõ lệnh sau để cài đặt các thư viện yêu cầu và nhấn Enter:
   ```cmd
   npm install
   ```
4. Sau khi cài đặt xong, gõ lệnh sau để khởi động máy chủ API và cấy dữ liệu ban đầu:
   ```cmd
   node server.js
   ```
   *Lưu ý quan trọng: Bạn phải giữ nguyên cửa sổ màu đen này ở đó, thu nhỏ lại chứ KHÔNG được bấm dấu X tắt đi.*

### Bước 4: Cài đặt thư viện và khởi động giao diện Frontend (Trang web)
1. Mở thư mục `frontend` của dự án.
2. Tương tự bước trước, mở một cửa sổ CMD **MỚI** tại thư mục `frontend` này (gõ `cmd` lên thanh địa chỉ).
3. Gõ lệnh cài đặt thư viện cho giao diện:
   ```cmd
   npm install
   ```
4. Khởi chạy giao diện chính:
   ```cmd
   npm run dev
   ```
5. Khi chạy phân giải xong, trên dòng lệnh sẽ xuất hiện dòng chữ `Local: http://localhost:5173/`. Bạn hãy bôi đen copy đoạn link `http://localhost:5173/` dán vào trình duyệt (Google Chrome, Cốc Cốc, Safari,...) và ấn Enter!

---

## Hướng dẫn sử dụng tính năng Demo Tấn Công Brute Force

1. Mở trang web, nhấn vào **Đăng Nhập** ở góc trên cùng bên phải.
2. Đăng nhập với tài khoản Quản trị viên (Admin):
   - Tên đăng nhập: `admin`
   - Mật khẩu: `password`
3. Sau khi đăng nhập thành công, bạn sẽ tự động được chuyển hướng đến **Bảng Điều Khiển Quản Trị Hệ Thống**.
4. Ở phần bảng màu đỏ bên phải **Demo Tấn Công Brute Force**, hãy nhập tên người dùng mục tiêu. Chúng ta sẽ dùng tên tài khoản `nguyen`.
5. Nhấn **Bắt Đầu** và quan sát: hệ thống sẽ tự động khởi tạo các luồng dò quét, sinh ngẫu nhiên số lượng lớn mật khẩu rồi chuyển sang quét theo danh sách từ điển và bắt thẻ ngân hàng người dùng thành công!

*Tài khoản thẻ thử nghiệm mặc định của dự án:*
- Username: `nguyen` / Password: `H.z050719`
- Username: `user1`, `user2`, v.v... / Password: `123123`
