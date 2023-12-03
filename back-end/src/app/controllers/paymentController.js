const Payment = require("../models/Payment");
const Cart = require("../models/Product");
class PaymentController {
  //[GET] /home

  index(req, res, next) {
    Cart.showToCart(global.carts, global.cart_total).then(function (
      listsProduct
    ) {
      const total = listsProduct[0].reduce(
        (sum, item) => sum + item.totalprice,
        0
      );
      const discount = 25000;

      res.render("payment", {
        products: listsProduct[0],
        total,
        discount,
        finalPrice: total - discount,
      });
    });
  }

  addPayment(req, res, next) {
    Payment.addPayment(req.body).then(function (order) {
      // global.carts = [];
      // global.cart_total = 0;
      res.redirect("/");
    });
  }
  showPayment(req, res, next) {
    var id = req.params.id;
    var size = req.query.size;
    var quantity = req.query.quantity;
    Payment.showPayment(id, size, quantity).then(function (product) {
      res.render("payment", { products: product, total: product[0].total });
    });
  }

  detailPayment(req, res, next) {
    Payment.detailPayment().then(function (orderInfo) {
      console.log(global.carts);
      const total_product = global.carts.reduce(
        (sum, item) => sum + item.totalprice,
        0
      );
      console.log(orderInfo);
      var transport_price;
      if (orderInfo.transport == "Giao hàng nhanh") {
        transport_price = 50100;
      } else {
        transport_price = 60000;
      }
      var final_price = total_product + transport_price - 25000;
      res.render("orderDetail", {
        order_info: orderInfo,
        products_order: global.carts,
        total_product: total_product,
        transport_price: transport_price,
        final_price: final_price,
      });
    });
  }
}
module.exports = new PaymentController();
