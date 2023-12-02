const Cart = require("../models/Product");
global.carts = [];
global.cart_total = 0;
class CartController {
  index(req, res, next) {
    res.render("cart", { title: "Giỏ hàng" });
  }
  // checkout(req, res, next) {
  //   var product_id = req.params.product;
  //   Cart.getProductById(product_id).then(function (product) {
  //     res.render("cart", {
  //       title: "Thanh toán",
  //       product: product,
  //     });
  //   });
  // }
  add(req, res, next) {
    var product_id = req.params.product;
    var size = req.query.size;
    var quantity = req.query.quantity;
    Cart.addProductToCart(product_id, carts, size, quantity).then(function (
      listsProduct
    ) {
      carts = listsProduct[0];
      cart_total = listsProduct[1];
      console.log("thêm sản phẩm thành công" + carts.length);
      res.redirect("back");
    });
  }
  checkout(req, res, next) {
    Cart.showToCart(global.carts, global.cart_total).then(function (
      listsProduct
    ) {
      res.render("cart", {
        title: "Giỏ hàng",
        product: listsProduct[0],
        total: listsProduct[1],
      });
    });
  }
  update(req, res, next) {
    var product_id = req.params.product;
    var action = req.query.action; //clear
    if (action == "remove") {
      console.log("Đã xóa sản phẩm");
      carts.splice(0, carts.length);
      cart_total = 0;
    }
    for (let i = 0; i < carts.length; i++) {
      if (global.carts[i].id == product_id) {
        switch (action) {
          case "plus":
            carts[i].quantity += 1;
            carts[i].totalprice = Number(carts[i].price) * carts[i].quantity;
            cart_total += Number(carts[i].price);
            break;
          case "minus":
            carts[i].quantity -= 1;
            carts[i].totalprice = Number(carts[i].price) * carts[i].quantity;
            cart_total -= Number(carts[i].price);
            break;
          case "clear":
            console.log("Đã xóa sản phẩm");
            cart_total -= Number(carts[i].totalprice);
            carts.splice(i, 1);
            if (carts.length == 0) {
              cart_total = 0;
            }
            break;
          default:
            console.log("Update");
            break;
        }
        break;
      }
    }
    res.redirect("back");
  }
}

module.exports = new CartController();
