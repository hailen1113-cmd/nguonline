# Ngủ Online

Một phòng duy nhất, 80 giường. Mở trang, bấm “Gõ NGU để vào phòng”, nhập tên. Nhân vật đi từ cửa tới giường; dùng NẰM, NGỒI, KÉO CHĂN. Bấm bánh răng để thử bình luận, quà, like, bật/tắt đèn hoặc xóa người demo.

Trạng thái được lưu cục bộ trong trình duyệt. Những người demo luôn có nhãn; không phải người xem thật. Trang là màn hình game dành cho streamer, không phải máy chủ multiplayer chia sẻ trạng thái giữa nhiều thiết bị. Để người xem điều khiển qua TikTok, nối WebSocket của bộ nhận sự kiện. Game không tự đăng nhập TikTok.

Ví dụ sự kiện:

```json
{"type":"comment","userId":"123","username":"Minh Anh","comment":"ngu"}
```

Lệnh: ngu / vao, nam, ngoi, lan, chan, roi. Có thể dùng chữ có dấu. Cùng userId chỉ có một nhân vật. Cổng JavaScript: `window.receiveTikTokEvent(event)`. Các sự kiện khác: join, leave, like, gift, follow, share. Đầy 80 giường thì hiển thị thông báo, không tạo phòng khác.

Nguồn: index.html, sleep.css, sleep.js. Hình ảnh: room.png và beds.png. Các tệp game boss cũ còn lại không được trang này tải.

Hình được tạo bằng công cụ imagegen tích hợp, lấy ảnh thiết kế đã được duyệt làm tham chiếu. room.png: yêu cầu giữ góc nhìn, cửa sổ, cửa vào, sàn gỗ, ánh sáng tím/đèn vàng và bỏ toàn bộ giường, nhân vật, chữ/UI để tạo lớp nền sạch. beds.png: atlas 2×2 nền trong suốt gồm giường trống, giường có nam đang ngủ, giường có nữ đang ngủ, nhân vật mặc đồ ngủ đứng quay lưng; giữ phong cách/góc nhìn của thiết kế. Bản tương tác bám bố cục và phong cách ảnh mẫu; không phải bản sao từng pixel vì giường và nhân vật đã được dựng thành các lớp riêng.

Đã kiểm tra cú pháp JavaScript; thử trên trình duyệt: vào bằng bình luận, gửi lệnh trùng không tăng số người, ngồi dậy, rời phòng trả lại giường. Kết nối TikTok thực tế chưa được kiểm thử vì chưa có máy chủ sự kiện.

## Sửa thao tác nằm / ngồi / kéo chăn

- Ngồi: dùng sprite ngồi mở mắt riêng cho nam/nữ, bỏ lớp nhân vật đứng quay lưng ghép chồng. Ẩn zZ khi ngồi.
- Kéo chăn: chuyển về nằm, lưu `covered=true`, hiển thị sprite đắp chăn cao. Ngồi dậy bỏ trạng thái này. Nằm tiếp vẫn giữ chăn nếu đã đắp.
- Bấm nhanh: xử lý ngay trạng thái mới nhất, hủy animation trước của cùng nhân vật; mỗi người chỉ có một bong bóng lời nói.
- Đang đi tới giường: ghi nhớ lệnh gần nhất và thực hiện sau khi tới; rời phòng trong lúc đi sẽ hủy di chuyển và lệnh chờ.
- Kiểm tra logic bằng `work/check-sleep-actions.cjs` tại thư mục chat; thử trên trình duyệt tư thế ngồi/nằm, kéo chăn từ ngồi, chuỗi bấm nhanh, lệnh khi đang đi, tải lại giữ trạng thái chăn, kiểm tra console không có lỗi.

Asset mới `bed-actions.png` được tạo bằng imagegen tích hợp, tham chiếu `beds.png`. Prompt: atlas 2×2 nền trong suốt, cùng khung giường/góc nhìn/phong cách; ô trên trái nam ngồi mở mắt tựa gối, trên phải nữ ngồi mở mắt tựa gối, dưới trái nam nằm ngủ đắp chăn tím tới cằm, dưới phải nữ nằm ngủ đắp chăn hồng tới cằm; mỗi ô đúng một giường và một người, không chữ/lưới/nền.


## Nối TikTok LIVE

Cần Node.js 20+. Trong thư mục này chạy:

```powershell
npm install
$env:TIKTOK_USERNAME="ten_creator_khong_co_dau"
npm start
```

Mở game, vào ⚙ Bảng điều khiển, giữ địa chỉ `ws://127.0.0.1:8786/events` rồi bấm Kết nối. `TIKTOK_USERNAME` là username creator đang LIVE, không gồm `@`. Bridge chỉ nghe trên máy này; không cần đặt mật khẩu/cookie TikTok. Connector không chính thức; giao thức có thể thay đổi và ký kết nối mặc định dùng dịch vụ Euler Stream. Nếu cần API key, đặt `SIGN_API_KEY` trong terminal, không đưa key vào game hoặc repo. Chưa thể xác nhận sự kiện LIVE thật nếu chưa có username creator đang phát trực tiếp.

## Flow LIVE đã bổ sung

- Bridge mặc định nhận LIVE của @hailen1113. MEMBER → join → nhân vật đi tới giường và nằm ngủ. Nếu TikTok không gửi thông báo vào phòng, bình luận ngu/vao để nhận giường.
- Phòng mới không có demo; dữ liệu demo cũ bị bỏ qua khi tải. Nút thêm demo vẫn có để thử riêng.
- Mỗi userId có một nhân vật; tối đa 80 giường. Đầy phòng thì báo đầy, không xếp hàng.
- Mặc định trả giường sau 30 phút không có tương tác; chọn 15/30/60/120 phút ở bảng điều khiển. Đây là thời gian không tương tác, không phải phát hiện chắc chắn người xem đã rời LIVE. Người xem yên lặng có thể hết hạn; bình luận ngu để vào lại. Nhân vật chủ máy được giữ lại.
- Bridge thử nối TikTok lại sau 30 giây khi chưa LIVE/mất kết nối. Game nối lại bridge sau 3 giây và nhớ địa chỉ sau lần kết nối thành công. Bấm Ngắt kết nối dừng tự nối ở game.
- Chạy START-TIKTOK.cmd, giữ username mặc định; mở game bằng HTTP và bấm Kết nối một lần. Các lần tải lại sau sẽ tự nối.
- Đã kiểm tra logic game, luồng bình luận mô phỏng qua WebSocket và kết nối bridge thành công với LIVE @hailen1113. Chưa xác nhận một bình luận thật từ người xem điều khiển nhân vật.
- Mở http://127.0.0.1:8765/?live=1 để game tự nối bridge. Máy chủ web phải phục vụ thư mục game tại cổng 8765. Nếu LIVE Studio từ chối Link cục bộ, dùng Window capture của cửa sổ Chrome, ẩn thanh trình duyệt và cắt viền để chỉ phát game.
