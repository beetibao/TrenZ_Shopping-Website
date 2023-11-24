const express = require('express');
const mssql = require('mssql');

const app = express();
app.use(express.json());

const config = {
    user: "trenz",
    password: "nhom1_2023",
    server: "trenz.database.windows.net",
    database: "database",
  };
  app.get('/order-history/:userId', async (req, res) => {
    try {
        let pool = await mssql.connect(config);
        let result = await pool.request()
                               .input('userId', mssql.Int, req.params.userId)
                               .query('SELECT * FROM Orders WHERE UserId = @userId');
        
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});