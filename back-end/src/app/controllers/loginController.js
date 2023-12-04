const Account = require("../models/Login");
// const bcrypt = require('bcrypt');
class loginController {
  // Kiem tra tai khoan va mat khau dang nhap
  index(req, res) {
    res.render("login");
  }
  SignIn(req, res) {
    const loginInfo = req.body;
    Account.checkAuth(loginInfo).then(function (check) {
      console.log(check);
      if (check == 0) {
        res.render("home", { username: loginInfo.username });
      } else if (check == 1) {
        res.render("admin/admin_statusOrder", { username: loginInfo.username });
      } else {
        res.redirect("back");
      }
    });
  }
}
module.exports = new loginController();
