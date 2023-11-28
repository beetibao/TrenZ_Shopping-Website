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

  create(req, res, next) {
    Admin.getUsers(req.query)
      .then((users) => {
        res.render("admin/admin_listUser", { users: users });
      })
      .catch(next);
  }
}
module.exports = new AdminController();