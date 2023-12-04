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

async function getOrderById(id) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    const result = await request.input('orderID', mssql.NVarChar(50), id)
                                .query(`SELECT * FROM [dbo].[order] WHERE order_id = @orderID`);
 
    const order = result.recordset[0];
    //console.log('test',order);
    return order;

  } catch (error) {
    console.log(error);
  }
}

async function changeOrderById(changeInfo) {
  try {

    const newInfo = {
      id: changeInfo.id,
      name: changeInfo.name,
      status: changeInfo.status,
      address: changeInfo.address
    }
    //console.log('tedt',newInfo);
    await mssql.connect(config);
    const request = new mssql.Request();

    request.input('id', mssql.Int, newInfo.order_id);
    request.input('name', mssql.NVarChar(50), newInfo.name);
    request.input('status', mssql.NVarChar(50), newInfo.status);
    request.input('address', mssql.NVarChar(500), newInfo.address);
    
    const result = await request.query(`
      UPDATE [dbo].[order] 
      SET name = @name,
        status = @status, 
        address = @address 
      WHERE order_id = @id`);
    
      return result;
  } catch (error) {
    console.log(error);
  }
}

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
    const result = await request.query(`SELECT * FROM [dbo].[user]`);

    const users = result.recordset;
    
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function insertProduct(dataform) {
  try {

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
    
    return result;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    
    const result = await request.query(`
      DELETE FROM [dbo].[product] WHERE id = '${productId}'`);

    return true;
  } catch (error) {
    throw new Error('Không thể xóa sản phẩm !');
  }
}

async function deleteOrder(orderId) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    
    const result = await request.query(`
      DELETE FROM [dbo].[order] WHERE order_id = '${orderId}'`);
    
    return true;
  } catch (error) {
    throw new Error('Không thể xóa sản phẩm !');
  }
}

async function getProductById(id) {
  try {
    await mssql.connect(config);
    const request = new mssql.Request();
    //console.log('test',id);
    const result = await request.input('productId', mssql.NVarChar(50), id)
                                .query(`SELECT * FROM [dbo].[product] WHERE id = @productId`);
    console.log(result);
    if (result.recordset.length > 0) {
      const product = result.recordset[0];
      const size_parse = JSON.parse(product.size);

      product.sizeS = size_parse.S;
      product.sizeM = size_parse.M;
      product.sizeL = size_parse.L;
      product.sizeXL = size_parse.XL;
      product.sizeXXL = size_parse.XXL;

      console.log(product);
      return product;

    } else {
      console.log(`Không tìm thấy sản phẩm: ${id}`);
      return null; 
    }
  } catch (error) {
    console.log('Không thể truy cập', error);
    throw error; 
  }
}

async function changeProductById(changeInfo) {
  try {
    const sizeS = parseInt(changeInfo.sizeS);
    const sizeM = parseInt(changeInfo.sizeM);
    const sizeL = parseInt(changeInfo.sizeL);
    const sizeXL = parseInt(changeInfo.sizeXL);
    const sizeXXL = parseInt(changeInfo.sizeXXL);

    const amount = sizeS + sizeM + sizeL + sizeXL + sizeXXL;
    const size = {
      "S": sizeS,
      "M": sizeM,
      "L": sizeL,
      "XL": sizeXL,
      "XXL": sizeXXL
    };

    const newInfo = {
      id: changeInfo.id, 
      name: changeInfo.name, 
      price: parseInt(changeInfo.price), 
      amount: amount, 
      size: JSON.stringify(size), 
      modified_at: new Date().toLocaleDateString(), 
      description: changeInfo.description 
    };
    console.log('test',newInfo);
    await mssql.connect(config);
    const request = new mssql.Request();
  
    request.input('id', mssql.NVarChar(50), newInfo.id);
    request.input('name', mssql.NVarChar(100), newInfo.name);
    request.input('price', mssql.Int, newInfo.price);
    request.input('amount', mssql.Int, newInfo.amount);
    request.input('size', mssql.NVarChar(50), newInfo.size);
    request.input('modified_at', mssql.Date, newInfo.modified_at);
    request.input('description', mssql.NVarChar(650), newInfo.description);
    
    const result = await request.query(`
      UPDATE [dbo].[product] 
      SET name = @name,
        price = @price, 
        amount = @amount,
        size = @size,
        modified_at = @modified_at,
        description = @description 
      WHERE id = @id`);

    return result;

  } catch (error) {
    console.log(error);
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

      }
    }
  } catch (error) {
    console.error("Upload file thất bại", error);
  }
}

  
module.exports = {
  getProductById,
  getOrders,
  getProducts,
  getUsers,
  getMulterStorage,
  insertProduct,
  uploadImagetoAzure,
  changeProductById,
  deleteProduct,
  getOrderById,
  changeOrderById,
  deleteOrder
}