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
  storeProduct(req, res, next) {
    let uploadCount = 0;
    const upload = multer({ storage: Admin.getMulterStorage(uploadCount)}).array('img[]', 4);
    
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Lỗi tải file ảnh' });
        return;
      }
      else{
        const folderImage = './src/public/img/backup';
        const test = Admin.uploadImagetoAzure(folderImage);
        if(test){
          console.error('Sai rồi!!!');
        }
      }
      try {
        const formdata = req.body;
        const result = Admin.insertProduct(formdata);
        if(result){
          //alert(`Thêm sản phẩm ${formdata.id} thành công`);
          res.redirect('/admin/admin_statusOrder');
          //res.json({ success: true, message: 'Thêm sản phẩm thành công' });
          //return;
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi thêm sản phẩm' });
      }
      //res.redirect('/admin/admin_statusOrder');
    });
  }
}

module.exports = new AdminController();

