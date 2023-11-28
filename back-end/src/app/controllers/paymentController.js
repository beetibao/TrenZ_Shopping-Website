const Payment = require("../models/Payment");
const Cart = require("../models/Product");
class PaymentController {
  //[GET] /home

  index(req, res, next) {
    Cart.showToCart(global.carts, global.cart_total).then(function (listsProduct) {
      const total = listsProduct[0].reduce((sum, item) => sum + item.totalprice, 0);
      const discount = 25000;

      res.render("payment/payment", { products: listsProduct[0], total, discount, finalPrice: total - discount });
    });
  }

  addPayment(req, res, next) {
    Payment.addPayment(req.body).then(function(order) {
      res.json({ success: true });
    });
  }
}
module.exports = new PaymentController();
