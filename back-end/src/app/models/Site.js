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
async function getProducts() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      "SELECT TOP 8 * FROM [dbo].[product] ORDER BY NEWID()"
    );

    const products = result.recordset;
    return products;
  } catch (error) {
    console.log(error);
  }
}
async function getProductById(id) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      `SELECT * FROM [dbo].[product] WHERE id = '${id}'`
    );
    const product = result.recordset;
    return product;
  } catch (error) {
    console.log(error);
  }
}
async function searchProduct(list_keywords) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    var list_keyword = "";
    for (var i = 0; i < list_keywords.length; i++) {
      if (i == 0) {
        list_keyword += `[name] LIKE N'%${list_keywords[i]}%'`;
      } else {
        list_keyword += ` AND [name] LIKE N'%${list_keywords[i]}%'`;
      }
    }
    const result = await request.query(
      `SELECT * FROM [dbo].[product] WHERE ${list_keyword}`
    );
    const product = result.recordset;
    return product;
  } catch (error) {
    console.log(error);
  }
}

//create new produc
module.exports = {
  getProducts,
  getProductById,
  searchProduct,
};
