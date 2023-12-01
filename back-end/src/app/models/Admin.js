const mssql = require("mssql");
const path = require('path');
const multer = require('multer');
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");

const connStr = "DefaultEndpointsProtocol=https;AccountName=imgtrenz;AccountKey=MdmHogfd2wV3DKJC7Gp5SHKCqR1QwHLlXQFYxYAuVYAgbmY5iNC0Z9vv8DkiPP3RizD4xxW1NJki+AStELnrXQ==;EndpointSuffix=core.windows.net"; 
const containerName = "blob"; 

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);

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
    const result = await request.query(`SELECT * FROM [dbo].[product] ORDER BY modified_at DESC`);

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
    //console.log(dataform.description);
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
    const sub_img = `['https://imgtrenz.blob.core.windows.net/blob/${dataform.id}.jpg', 'https://imgtrenz.blob.core.windows.net/blob/${dataform.id}_1.jpg', 'https://imgtrenz.blob.core.windows.net/blob/${dataform.id}_2.jpg', 'https://imgtrenz.blob.core.windows.net/blob/${dataform.id}_3.jpg']`
    
    const newProduct = {
      id: dataform.id, 
      name: dataform.name, 
      category : dataform.categoryform, 
      price: parseInt(dataform.price), 
      amount: amount, 
      size: JSON.stringify(size), 
      modified_at: new Date().toLocaleDateString(), 
      description: dataform.description, 
      img: img,
      sub_img: sub_img
    }
    
    console.log(newProduct);

    await mssql.connect(config);
    const request = new mssql.Request();
    request.input('id', mssql.NVarChar(50), newProduct.id);
    request.input('name', mssql.NVarChar(100), newProduct.name);
    request.input('category', mssql.NVarChar(50), newProduct.category);
    request.input('price', mssql.Int, newProduct.price);
    request.input('amount', mssql.Int, newProduct.amount);
    request.input('size', mssql.NVarChar(50), newProduct.size);
    request.input('modified_at', mssql.Date, newProduct.modified_at);
    request.input('description', mssql.NVarChar(650), newProduct.description);
    request.input('img', mssql.NVarChar(100), newProduct.img);
    request.input('sub_img', mssql.NVarChar(250), newProduct.sub_img);

    const result = await request.query(`
    INSERT INTO [dbo].[product] (id, name, category, price, amount, size, modified_at, description, img, sub_img)
    VALUES (@id, @name, @category, @price, @amount, @size, @modified_at, @description, @img, @sub_img)
    `);
    
    /* 
    const result = await request.query(`
      INSERT INTO [dbo].[product] (id, name, category, price, amount, size, modified_at, description, img, sub_img)
      VALUES ('${newProduct.id}', '${newProduct.name}', '${newProduct.category}', '${newProduct.price}', '${newProduct.amount}', 
      '${newProduct.size}', '${new Date().toLocaleDateString()}', '${newProduct.description}', '${newProduct.img}', '${newProduct.sub_img}')`), {
      });*/
    
    return result;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

function formatDate(date) {
  const formattedDate = new Date(date).toLocaleDateString();
  return formattedDate;
}

function getMulterStorage(uploadCount) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === "image/jpeg") {
        cb(null, './src/public/img/backup');
      } else {
        cb(new Error('Không phải ảnh jpeg'), false);
      }
    },

    filename: function (req, file, cb) {
      const fileId = req.body.id;
      const ext = path.extname(file.originalname);
      const newFileName = fileId + (uploadCount > 0 ? '_' + uploadCount : '') + ext;
      uploadCount++;
      cb(null, newFileName);
    }
  });
}

async function uploadImagetoAzure(folderImage) {
  try {
    const files = fs.readdirSync(folderImage);

    for (const file of files) {
      const filePath = `${folderImage}/${file}`;
      if (fs.statSync(filePath).isFile() && /\.(jpg|jpeg)$/i.test(file)) {
        const blockBlobClient = containerClient.getBlockBlobClient(file);

        const options = { blobHTTPHeaders: { blobContentType: "image/jpeg" } };

        await blockBlobClient.uploadFile(filePath, options);

        //console.log(`Đã upload ${file} thành công.`);
      }
    }
  } catch (error) {
    console.error("Upload file thất bại", error);
  }
}

module.exports = {
  getOrders,
  getProducts,
  getUsers,
  getMulterStorage,
  insertProduct,
  uploadImagetoAzure
}