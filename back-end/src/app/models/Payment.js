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
    const detail_order = global.carts.map((item) => [
      item.id,
      item.size || "S",
      item.quantity,
      item.totalprice,
    ]);

    const total_product = global.carts.reduce(
      (sum, item) => sum + item.totalprice,
      0
    );
    var transport_price;
    if (params.detail == "Giao hàng nhanh") {
      transport_price = 50100;
    } else {
      transport_price = 60000;
    }
    var final_price = total_product + transport_price - 25000;

    request.input("order_id", mssql.Int, maxId + 1);
    request.input("user_id", mssql.NVarChar(50), String(params.user_id));
    request.input("name", mssql.NVarChar(50), params.name);
    request.input("address", mssql.NVarChar(500), params.address);
    request.input("total", mssql.Int, final_price);
    request.input("phone", mssql.NVarChar(15), params.phone);
    request.input("detail", mssql.NVarChar(500), JSON.stringify(detail_order));
    request.input("payment_method", mssql.NVarChar(50), params.payment_method);
    request.input("transport", mssql.NVarChar(50), params.detail);
    request.input("status", mssql.NVarChar(50), params.status);
    request.input("created_at", mssql.Date, params.created_at);

    const result = await request.query(
      `INSERT INTO [dbo].[order] (order_id, user_id, name, address, total, phone, detail, payment_method,transport, status, created_at) 
      VALUES (@order_id, @user_id, @name, @address, @total, @phone, @detail, @payment_method,@transport, @status, @created_at)`
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function showPayment(id, size, quantity) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      `SELECT * FROM [dbo].[product] WHERE id = '${id}'`
    );

    global.carts = [
      {
        id: result.recordset[0].id,
        name: result.recordset[0].name,
        price: result.recordset[0].price,
        image: result.recordset[0].img,
        size: size,
        quantity: quantity,
        totalprice: result.recordset[0].price * quantity,
        total: result.recordset[0].price * quantity,
      },
    ];
    return global.carts;
  } catch (error) {
    console.log(error);
  }
}

async function detailPayment() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      `SELECT TOP 1 * FROM [dbo].[order] ORDER BY [order_id] DESC`
    );
    return result.recordset[0];
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getPayment,
  addPayment,
  showPayment,
  detailPayment,
};
