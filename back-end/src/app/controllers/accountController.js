const Account = require("../models/Account");
const multer = require('multer');

class AccountController {
    index(req, res, next) {
        res.render("user/account");
    }
    edit(req, res, next) {
        res.render("user/edit");
    }
    changePassword(req, res, next) {
        res.render("user/changePass");
    }
    orderHistory(req, res, next) {
        res.render("user/orderHistory");
    }
}
module.exports = new AccountController();