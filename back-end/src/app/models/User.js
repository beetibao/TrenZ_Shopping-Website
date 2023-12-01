const mssql = require("mssql");
//const bcrypt = require("bcrypt");

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

class User {
  static async getUserByUsername(username) {
    try {
      await mssql.connect(config);
      const request = new mssql.Request();
      request.input('username', mssql.VarChar, username);
      const result = await request.query(`SELECT * FROM [dbo].[user] WHERE username = @username`);
      return result.recordset[0];
    } catch (error) {
      console.error(error);
      throw error;
    } 
  }

  static async updatePassword(username, oldPassword, newPassword) {
    try {
      await mssql.connect(config);
      
      // Lấy thông tin người dùng dựa trên username
      const user = await this.getUserByUsername(username);
      
      // So sánh mật khẩu cũ với mật khẩu đã hash trong DB
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        throw new Error('Mật khẩu cũ không khớp');
      }
  
      // Hash mật khẩu mới và cập nhật nó vào DB
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const request = new mssql.Request();
      request.input('username', mssql.VarChar, username);
      request.input('hashedPassword', mssql.VarChar, hashedPassword);
      await request.query(`UPDATE [dbo].[user] SET password = @hashedPassword WHERE username = @username`);
  
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}  

module.exports = User;