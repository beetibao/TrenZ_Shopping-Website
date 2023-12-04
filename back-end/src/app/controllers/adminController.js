const Admin = require("../models/Admin");
const multer = require('multer');

class AdminController {

  index(req, res, next) {
    console.log()
    Admin.getProducts(req.query)
      .then((products) => {
        res.render("admin/admin_listProduct", { products: products });
      })
      .catch(next);
  }
 
  index1(req, res, next) {
    Admin.getOrders(req.query)
      .then((orders) => {
        res.render("admin/admin_statusOrder", { orders: orders });
      })
      .catch(next);
  }

  index2(req, res, next) {
    Admin.getUsers(req.query)
      .then((users) => {
        res.render("admin/admin_listUser", { users: users });
      })
      .catch(next);
  }
  //[GET] admin/createProduct
  createProduct(req, res) {
    res.render("admin/createProduct");
  }

  //[POST] admin/storeProduct
  async storeProduct(req, res) {
    let uploadCount = 0;
    const upload = await multer({ storage: Admin.getMulterStorage(uploadCount)}).array('img[]', 4);
    
    upload (req, res, function (err) {
      if (err) {
        return res
            .status(404)
            .send({
                statusCode: 404,
                message: `Lỗi upload ảnh`,
                alert: `Lỗi upload ảnh`,});
      }
      else{
        const folderImage = './src/public/img/backup';
        Admin.uploadImagetoAzure(folderImage);
      }
      try {
        const formdata = req.body;
        console.log(formdata);
        const result = Admin.insertProduct(formdata);
        if(result){
        res
            .status(200)
            .send({
                statusCode: 200,
                message: `Thêm sản phẩm thành công`,
                alert: `Thêm sản phẩm thành công`,
                });
        }} 
        catch (error) {
          return res
            .status(400)
            .send({
                statusCode: 400,
                message: `Thêm sản phẩm không thành công`,
                alert: `Thêm sản phẩm không thành công`,
                redirect: 'admin_statusOrder'});
          }
    });
  }

    // [Get] /admin/editProduct/:id
    async editProduct(req, res, next) {
      const productId = req.params.id;

      Admin.getProductById(productId)
        .then((product) => {
          res.render("admin/editProduct", { product: product });
        })
        .catch(next)
    }

    // [PUT] /admin/editProduct/:id
  async updateProduct(req, res) {
    try{
        const changeInfo = req.body;
        //console.log('ket qua',changeInfo);
        const result = await Admin.changeProductById(changeInfo);
        if(result){
          res
          .status(200)
          .send({
              statusCode: 200,
              message: `Sửa sản phẩm thành công`,
              alert: `Sửa sản phẩm thành công`});
          }
      }
      catch(error){
        return res
        .status(500)
        .send({
            statusCode: 500,
            message: `Không thể sửa sản phẩm`,
            alert: `Không thể sửa sản phẩm`,
            redirect: 'admin/admin_listProduct'});
      }
    }

    async deleteProduct(req, res) {
      const productId = req.params.id; 
      try {
        const result = await Admin.deleteProduct(productId);
        if (result) {
          return res
            .status(200)
            .send({
              statusCode: 200,
              message: `Sản phẩm đã được xóa thành công`,
              redirect: 'admin/admin_listProduct'
          });
        } else {
          return res
            .status(404)
            .send({
              statusCode: 404,
              message: `Không tìm thấy sản phẩm để xóa`,
              redirect: 'admin/admin_listProduct'
          });
        }
      } catch (error) {
        return res
          .status(500)
          .send({
            statusCode: 500,
            message: `Không thể xóa sản phẩm`
        });
      }
    }

    editOrder(req, res, next) {
      const OrderId = req.params.id;
      //console.log(OrderId);
      Admin.getOrderById(OrderId)
        .then((order) => {
          res.render("admin/editOrder", { order: order });
        })
        .catch(next)
    }

    // [PUT] /admin/:id
    async updateOrder(req, res) {
      try{
        const changeInfo = req.body;
        console.log(changeInfo);
        const result = await Admin.changeOrderById(changeInfo);
        if(result)
          return res
            .status(200)
            .send({
              statusCode: 200,
              message: `Đơn hàng đã được sửa thành công`
          });
      }
      catch(error){
        return res
        .status(500)
        .send({
            statusCode: 500,
            message: `Không thể sửa sản phẩm`,
            alert: `Không thể sửa sản phẩm`,
            redirect: 'admin/admin_listProduct'});
      }
    }

    async deleteOrder(req, res) {
      const orderId = req.params.id; 
      console.log(orderId);
      try {
        const result = await Admin.deleteOrder(orderId);
        if (result) {
          return res
            .status(200)
            .send({
              statusCode: 200,
              message: `Đơn hàng đã được xóa thành công`,
              redirect: 'admin/admin_statusOrder'
          });
        } else {
          return res
            .status(404)
            .send({
              statusCode: 404,
              message: `Không tìm thấy đơn hàng để xóa`,
              redirect: 'admin/admin_statusOrder'
          });
        }
      } catch (error) {
        return res
          .status(500)
          .send({
            statusCode: 500,
            message: `Không thể xóa đơn hàng`
        });
      }
    }
}


module.exports = new AdminController();

