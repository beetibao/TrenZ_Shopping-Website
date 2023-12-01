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
async function getMenProducts(params) {
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

async function getWomenProducts(params) {
  try {
    const minPrice = parseFloat(params.min) * 1000;
    const maxPrice = parseFloat(params.max) * 1000;
    await mssql.connect(config);
    const request = new mssql.Request();
    let query = "SELECT * FROM [dbo].[product] WHERE category = N'Nữ'";

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

async function getChildrenProducts(params) {
  try {
    const minPrice = parseFloat(params.min) * 1000;
    const maxPrice = parseFloat(params.max) * 1000;
    await mssql.connect(config);
    const request = new mssql.Request();
    let query = "SELECT * FROM [dbo].[product] WHERE category = N'Trẻ em'";

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
async function getProductById(id) {
  try {
    var product_category = id.slice(0, 1);
    await mssql.connect(config);
    const request = new mssql.Request();
    const result_1 = await request.query(
      `SELECT * FROM [dbo].[product] WHERE id = '${id}'`
    );
    const result_2 = await request.query(
      `SELECT TOP 6 * FROM [dbo].[product] WHERE [id] LIKE '${product_category}%' ORDER BY NEWID()`
    );
    const product = result_1.recordset;
    const category_products = result_2.recordset;
    return [product, category_products];
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

//CART
async function addProductToCart(id, list_cart, size_prd, quantity) {
  try {
    const quantity_prd = Number(quantity);
    await mssql.connect(config);
    const request = new mssql.Request();
    const product = await request.query(
      `SELECT * FROM [dbo].[product] WHERE id = '${id}'`
    );
    productItem = product.recordset;
    if (list_cart == undefined) {
      list_cart = [];
      list_cart.push({
        id: productItem[0].id,
        name: productItem[0].name,
        image: productItem[0].img,
        size: size_prd,
        price: productItem[0].price,
        quantity: quantity_prd,
        totalprice: productItem[0].price * quantity_prd,
      });
    } else {
      var newItem = true;
      for (var i = 0; i < list_cart.length; i++) {
        if (list_cart[i].size == size_prd && list_cart[i].id == id) {
          list_cart[i].quantity += quantity_prd;
          totalprice = list_cart[i].price * list_cart[i].quantity;
          list_cart[i].totalprice = totalprice;
          newItem = false;
          break;
        } else if (list_cart[i].size != size_prd && list_cart[i].id == id) {
          continue;
        }
      }
      if (newItem) {
        list_cart.push({
          id: productItem[0].id,
          name: productItem[0].name,
          image: productItem[0].img,
          size: size_prd,
          price: productItem[0].price,
          quantity: quantity_prd,
          totalprice: productItem[0].price * quantity_prd,
        });
      }
    }
    var total_order = 0;
    for (var i = 0; i < list_cart.length; i++) {
      total_order += Number(list_cart[i].totalprice);
    }
    return [list_cart, total_order];
  } catch (error) {
    console.log(error);
  }
}
async function showToCart(cart_products, cart_total) {
  try {
    list_cart = cart_products;
    total_order = cart_total;
    let list_items = [list_cart, total_order];
    return list_items;
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
  addProductToCart,
  showToCart,
};
