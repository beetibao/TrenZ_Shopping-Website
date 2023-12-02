const mssql = require("mssql");
const config = {
  user: "trenz",
  password: "nhom1_2023",
  server: "trenz.database.windows.net",
  database: "database",
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};
async function getPayment(params) {
  try {
    const minPrice = parseFloat(params.min) * 1000;
    const maxPrice = parseFloat(params.max) * 1000;
    await mssql.connect(config);
    const request = new mssql.Request();
    let query = `SELECT * FROM [dbo].[product] WHERE category = 'Nam'`;

    if (params.max && params.min) {
      query += ` AND CAST(price AS INT) BETWEEN ${minPrice} AND ${maxPrice}`;
    }

    if (params.min && !params.max) {
      query += ` AND CAST(price AS INT) >= ${minPrice}`;
    }

    if (params.max && !params.min) {
      query += ` AND CAST(price AS INT) <= ${maxPrice}`;
    }

    if (params.size) {
      query += ` AND JSON_VALUE(size, '$.${params.size}') > 0`;
    }

    if (params.sort) {
      switch (params.sort) {
        case "all_clothing":
          break;
        case "ex_clothing":
          query += ` ORDER BY CAST(price AS INT) DESC`;
          break;
        case "cheap_clothing":
          query += ` ORDER BY CAST(price AS INT) ASC`;
          break;
        case "latest_clothing":
          query += ` ORDER BY modified_at DESC`;
          break;
      }
    }
    const result = await request.query(query);

    let currentPageProducts = result.recordset;
    if (params.page) {
      let itemsPerPage = 20;
      switch (params.page) {
        case "1":
          itemsPerPage = 20;
          break;
        case "2":
          itemsPerPage = 20;
          break;
        case "3":
          itemsPerPage = 10;
          break;
      }
      const products = result.recordset;
      const startIndex = (params.page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, products.length);
      currentPageProducts = products.slice(startIndex, endIndex);
    }
    return currentPageProducts;
  } catch (error) {
    console.log(error);
  }
}

async function addPayment(params) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();

    const orderList = await request.query("SELECT * FROM [dbo].[order]");
    const maxId = Math.max(
      ...orderList.recordsets[0].map((item) => item.order_id),
      0
    );

    const products = global.carts.map((item) => item.id);
    const detail = global.carts.map((item) => [
      item.id,
      item.size || "S",
      item.quantity,
      item.totalprice,
    ]);
    console.log(params.user_id, typeof params.user_id);
    request.input("order_id", mssql.Int, maxId + 1);
    request.input("user_id", mssql.NVarChar(50), String(params.user_id));
    request.input("name", mssql.NVarChar(50), params.name);
    request.input("address", mssql.NVarChar(50), params.address);
    request.input("total", mssql.Int, params.total);
    request.input("phone", mssql.Int, params.phone);
    request.input("detail", mssql.NVarChar(50), JSON.stringify(detail));
    request.input("payment_method", mssql.NVarChar(50), params.payment_method);
    request.input("status", mssql.NVarChar(50), params.status);
    request.input("created_at", mssql.Date, params.created_at);

    const result = await request.query(
      `INSERT INTO [dbo].[order] (order_id, user_id, name, address, total, phone, detail, payment_method, status, created_at) 
      VALUES (@order_id, @user_id, @name, @address, @total, @phone, @detail, @payment_method, @status, @created_at)`
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getPayment,
  addPayment,
};
