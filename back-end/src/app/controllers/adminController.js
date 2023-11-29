const Admin = require("../models/Admin");

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
  storeProduct(req, res) {
    try {
      const formdata = req.body;
      Admin.uploadImage(req, res);
      //const formdata = ;
      console.log(formdata);
      Admin.insertProduct(formdata);
      res.json({ success: true, message: 'Thêm sản phẩm thành công' });
      } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi tải ảnh hoặc thêm sản phẩm' });
    }
  }
}

module.exports = new AdminController();

