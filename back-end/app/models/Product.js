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
async function getMenProducts() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      "SELECT TOP 8 * FROM [dbo].[product] WHERE category = 'Nam'"
    );

    const products = result.recordset;
    return products;
  } catch (error) {
    console.log(error);
  }
}
async function getWomenProducts() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      "SELECT TOP 8 * FROM [dbo].[product] WHERE category = N'Nữ'"
    );

    const products = result.recordset;
    return products;
  } catch (error) {
    console.log(error);
  }
}
async function getChildrenProducts() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      "SELECT TOP 8 * FROM [dbo].[product] WHERE category = N'Trẻ em'"
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

//create new product
async function createProduct(product) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(
      `INSERT INTO [dbo].[product] (id, name, category, price, amount, description) VALUES ('${product.id}', '${product.name}', '${product.category}', '${product.price}', '${product.amount}', '${product.description}')`
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getMenProducts,
  getWomenProducts,
  getChildrenProducts,
  getProductById,
  createProduct,
};
