const express = require('express');
const mssql = require('mssql');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const config = {
    user: "trenz",
    password: "nhom1_2023",
    server: "trenz.database.windows.net",
    database: "database",
  };

app.post('/change-password', async (req, res) => {
const { userId, oldPassword, newPassword } = req.body;

try {
    let pool = await mssql.connect(config);
    let user = await pool.request()
                            .input('userId', mssql.Int, userId)
                            .query('SELECT * FROM Users WHERE id = @userId');

    if (user.recordset.length === 0) {
        return res.status(404).send('Người dùng không tồn tại');
    }

    const userRecord = user.recordset[0];
    const match = await bcrypt.compare(oldPassword, userRecord.password);

    if (!match) {
        return res.status(401).send('Mật khẩu cũ không đúng');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.request()
                .input('newPassword', mssql.NVarChar, hashedPassword)
                .input('userId', mssql.Int, userId)
                .query('UPDATE Users SET password = @newPassword WHERE id = @userId');

    res.send('Mật khẩu đã được cập nhật');
} catch (err) {
    console.error(err);
    res.status(500).send('Lỗi máy chủ');
}
});

const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server đang chạy trên port ${PORT}`);
});
