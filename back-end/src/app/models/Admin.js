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
const multer = require('multer');
const path = require('path');

let uploadCount = 0;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg"){
      cb(null, './src/public/img/backup');
    }
    else{
      cb(new Error ('Không phải ảnh jpeg'), false);
    }
  },

  filename: function (req, file, cb) {
    const fileId = req.body.id;
    const ext = path.extname(file.originalname);
    const newFileName = fileId + (uploadCount > 0 ? '_' + uploadCount : '') + ext;
    uploadCount++;

    if (uploadCount === 4) {
      uploadCount = 0;
    }
    cb(null, newFileName);
  }
});

const upload = multer({ storage: storage }).array('img[]', 4);


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

async function insertProduct(dataform) {
  try {
    // Lấy những data cần thiết và xử lý dữ liệu nhập
    console.log(dataform.description);
    const sizeS = parseInt(dataform.sizeS);
    const sizeM = parseInt(dataform.sizeM);
    const sizeL = parseInt(dataform.sizeL);
    const sizeXL = parseInt(dataform.sizeXL);
    const sizeXXL = parseInt(dataform.sizeXXL);

    const amount = sizeS + sizeM + sizeL + sizeXL + sizeXXL;
    const size = {
      "S": sizeS,
      "M": sizeM,
      "L": sizeL,
      "XL": sizeXL,
      "XXL": sizeXXL
    };
    const img = `https://imgtrenz.blob.core.windows.net/blob/${dataform.id}.jpg`
    const sub_img = [`https: //imgtrenz.blob.core.windows.net/blob/${dataform.id}_1.jpg`, 
                      `https://imgtrenz.blob.core.windows.net/blob/${dataform.id}_2.jpg`, 
                      `https://imgtrenz.blob.core.windows.net/blob/${dataform.id}_3.jpg`]
    
    const newProduct = {
      id: dataform.id, 
      name: dataform.name, 
      category : dataform.category, 
      price: parseInt(dataform.price), 
      amount: amount, 
      size: size, 
      modified_at: new Date().toLocaleDateString(), 
      description: dataform.description, 
      img: img,
      sub_img: sub_img
    }
    
    console.log(newProduct);

    await mssql.connect(config);
    const request = new mssql.Request();
    
    /*const result = await request.query(`
      INSERT INTO [dbo].[product] (id, name, category, price, amount, size, modified_at, description, img, sub_img)
      VALUES ('${newProduct.id}', '${newProduct.name}', '${newProduct.category}', '${price}', '${amount}', 
      '${size}', '${new Date().toLocaleDateString()}', '${newProduct.description}', '${img}', '${sub_img}')`);*/

    //return result;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

function uploadImage(req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Lỗi tải file ảnh' });
      return;
    }
    //console.log("Upload thành công!");
  });
}

function formatDate(date) {
  const formattedDate = new Date(date).toLocaleDateString();
  return formattedDate;
}

module.exports = {
  getOrders,
  getProducts,
  getUsers,
  uploadImage,
  insertProduct
}