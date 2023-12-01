const express = require('express');
const router = express.Router();
const ChangePasswordController = require('../app/controllers/ChangePasswordController');

// GET request - hiển thị form thay đổi mật khẩu
router.get('/', (req, res) => {
    res.render('changePassword', { status: {} }); // đảm bảo truyền một object status trống
});

// POST request - xử lý dữ liệu form
router.post('/', ChangePasswordController.changePassword);

module.exports = router;
