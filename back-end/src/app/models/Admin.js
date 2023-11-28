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

// Get order in database
async function getOrders() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(`SELECT * FROM [dbo].[order] ORDER BY created_at DESC`);
    const orders = result.recordset.map(order => {
      order.created_at = formatDate(order.created_at);
      return order;
    });
    
    return orders;
  } catch (error) {
    console.log(error);
  }
}
async function getProducts() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query(`SELECT * FROM [dbo].[product]`);

    const products = result.recordset.map(product => {
      product.modified_at = formatDate(product.modified_at);
      return product;
    });
    
    return products;
  } catch (error) {
    console.log(error);
  }
}
async function getUsers() {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.query("SELECT * FROM [dbo].[user]");

    const users = result.recordset;
    
    return users;
  } catch (error) {
    console.log(error);
  }
}
// format date
function formatDate(date) {
  const formattedDate = new Date(date).toLocaleDateString();
  return formattedDate;
}

module.exports = {
  getOrders,
  getProducts,
  getUsers
}