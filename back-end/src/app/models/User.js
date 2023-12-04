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
  static async updateUserProfile(username, profileDetails) {
    try {
      await mssql.connect(config);
      const request = new mssql.Request();
      request.input('username', mssql.VarChar, username);
      
      // Bạn cần chỉ định các trường cụ thể bạn muốn cập nhật, ví dụ như name, phone, etc.
      // Đảm bảo rằng bạn đã thêm các trường này vào cơ sở dữ liệu của bạn
      request.input('name', mssql.VarChar, profileDetails.name);
      request.input('phone', mssql.VarChar, profileDetails.phone);
      request.input('address', mssql.VarChar, profileDetails.address);
      request.input('email', mssql.VarChar, profileDetails.email);

      await request.query(`
        UPDATE [dbo].[user] 
        SET 
          name = @name, 
          phone = @phone, 
          address = @address, 
          email = @email
        WHERE username = @username
      `);

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}  

module.exports = User;