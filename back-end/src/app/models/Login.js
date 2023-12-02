const mssql = require("mssql");
const config = {
    user: "trenz",
    password: "nhom1_2023",
    server: "trenz.database.windows.net",
    database: "database",
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
};
// Kiểm tra tài khoản mật khẩu có tồn tại trong database hay không
async function checkAuth(logInfo) {
    try {
        console.log(global.username);
        await mssql.connect(config);
        const request = new mssql.Request();
        const result = await request.query(`SELECT * FROM [dbo].[user] WHERE username ='${logInfo.username}'`);
        const user = result.recordset;
        if (user.length == 1)
        {   
            console.log(user[0].password.length,logInfo.password.length);
            if (user[0].password === logInfo.password)
                return 0;
            else {
                return 2;
            }
        }
        else {
            const result_admin = await request.query(`SELECT * FROM [dbo].[admin] WHERE username ='${logInfo.username}'`);
            const admin = result_admin.recordset;
            if (admin.length == 1)
            {   
                console.log(admin[0].password.length,logInfo.password.length);
                if (admin[0].password === logInfo.password)
                    return 1;
                else {
                    return 2;
                }
            }
            else {return 2;}
        }
    } catch (error) {
        console.log(error);
    }
};
// Kiểm tra tài khoản số điện thoại và email đã tồn tại trong database hay chưa
async function checkReg(signInfo) {
    try {
        await mssql.connect(config);
        const request = new mssql.Request();
        const result = await request.query(`SELECT * FROM [dbo].[user] WHERE username ='${signInfo.username}'`);
        const user = result.recordset;
        if (user.length == 0)
        {   
            var takeid = await request.query(`SELECT * FROM [dbo].[user] WHERE ID=(SELECT MAX(ID) FROM [dbo].[user])`);
            var idn = takeid.recordset;
            console.log(signInfo, signInfo.username,idn[0].id+1);
            request.input('id', mssql.Int, idn[0].id+1);
            request.input('username', mssql.NVarChar(50), signInfo.username);
            request.input('password', mssql.NVarChar(50), signInfo.password);
            request.input('phone', mssql.NVarChar(15), signInfo.phone);
            request.input('email', mssql.NVarChar(50), signInfo.email);
            request.query(`
                INSERT INTO [dbo].[user] (id, username, password, phone, email)
                VALUES (@id, @username, @password, @phone, @email)
            `);
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};


module.exports = {checkAuth, checkReg};