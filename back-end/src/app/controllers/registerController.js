const Account = require("../models/Login");
// const bcrypt = require('bcrypt');
class registerController {
  index(req, res) {
    res.render("register");
  }
  SignUp(req, res, next) {
    const signInfo = req.body;
    Account.checkReg(signInfo).then(function (check) {
      if (check) res.render("login");
      else {
        res.redirect("back");
      }
    });
  }
}
module.exports = new registerController();
