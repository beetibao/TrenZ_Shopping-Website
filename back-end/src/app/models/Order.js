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

class Order {
  static async getOrderHistoryByUserId(userId) {
    try {
      await mssql.connect(config);
      const request = new mssql.Request();
      request.input('userId', mssql.VarChar, userId);
      const result = await request.query(`SELECT * FROM [dbo].[order] WHERE user_id = @userId ORDER BY created_at DESC`);
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async addNewOrder(orderData) {
    try {
      await mssql.connect(config);
      const request = new mssql.Request();
      request.input('userId', mssql.VarChar, orderData.user_id);
      request.input('name', mssql.NVarChar, orderData.name);
      request.input('total', mssql.Money, orderData.total);
      request.input('phone', mssql.VarChar, orderData.phone);
      request.input('detail', mssql.NVarChar, JSON.stringify(orderData.detail)); // Vì detail dạng JSON trong cơ sở dữ liệu
      request.input('status', mssql.VarChar, orderData.status || 'Pending'); // Mặc định là 'Pending' nếu không cung cấp
      request.input('created_at', mssql.DateTime, orderData.created_at || new Date()); // Mặc định là thời gian hiện tại
      const result = await request.query(`
        INSERT INTO [dbo].[order] (user_id, name, total, phone, detail, status, created_at) 
        VALUES (@userId, @name, @total, @phone, @detail, @status, @created_at);
      `);
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

module.exports = Order;
