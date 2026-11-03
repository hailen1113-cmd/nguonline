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

