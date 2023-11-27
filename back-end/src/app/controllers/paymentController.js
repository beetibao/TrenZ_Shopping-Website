const Payment = require("../models/Payment");
const Cart = require("../models/Product");
class PaymentController {
  //[GET] /home

  index(req, res, next) {
    Cart.showToCart(global.carts, global.cart_total).then(function (listsProduct) {
        res.render("payment/payment", { products: listsProduct[0] });
    });
  }
}
module.exports = new PaymentController();
