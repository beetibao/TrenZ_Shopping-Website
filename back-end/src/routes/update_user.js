const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const config = {
    user: "trenz",
    password: "nhom1_2023",
    server: "trenz.database.windows.net",
    database: "database",
};
app.put('/update-user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { fullName, phone, address, email } = req.body;

    try {
        let pool = await mssql.connect(config);
        await pool.request()
            .input('userId', mssql.Int, userId)
            .input('fullName', mssql.NVarChar, fullName)
            .input('phone', mssql.NVarChar, phone)
            .input('address', mssql.NVarChar, address)
            .input('email', mssql.NVarChar, email)
            .query('UPDATE Users SET fullName = @fullName, phone = @phone, address = @address, email = @email WHERE id = @userId');

        res.send('Thông tin người dùng đã được cập nhật.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
