const User = require("../models/User");
//const bcrypt = require('bcrypt');

class ChangePasswordController {
    async changePassword(req, res) {
        try {
            const { username, oldPassword, newPassword } = req.body;

            // In ra các giá trị để debug
            console.log('Username:', username);
            console.log('Old Password:', oldPassword);
            console.log('New Password:', newPassword);


            if (!username || !oldPassword || !newPassword) {
                return res.render("changePassword", { status: { error: "Tất cả các trường là bắt buộc." } });
            }

            const user = await User.getUserByUsername(username);
            if (!user) {
                return res.render("changePassword", { status: { error: "Không tìm thấy người dùng." } });
            }

            console.log('Hashed Password in DB:', user.password);

            const isMatch = user.password.startsWith("$2b$") || user.password.startsWith("$2a$")
                ? await bcrypt.compare(oldPassword, user.password) // Nếu mật khẩu đã băm
                : oldPassword === user.password; // Nếu mật khẩu là dạng văn bản thuần

            if (!isMatch) {
                return res.render("changePassword", { status: { error: "Mật khẩu cũ không chính xác." } });
            }

            // Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await User.updatePassword(username, hashedNewPassword);

            // Thông báo thành công
            console.log('Mật khẩu đã được cập nhật thành công cho người dùng:', username);
            res.render("changePassword", { status: { success: "Mật khẩu đã được thay đổi thành công." } });
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            res.render("changePassword", { status: { error: "Lỗi máy chủ." } });
        }
    }
}

module.exports = new ChangePasswordController();
