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
    console.log(product_id);
    Cart.addProductToCart(product_id, carts).then(function (listsProduct) {
      carts = listsProduct[0];
      cart_total = listsProduct[1];
      console.log("thêm sản phẩm thành công" + carts.length);
      res.redirect("back");
    });
  }
  checkout(req, res, next) {
    Cart.showToCart(global.carts, global.cart_total).then(function (listsProduct) {
      res.render("cart", {
        title: "Giỏ hàng",
        product: listsProduct[0],
        total: listsProduct[1],
      });
    });
  }
  update(req, res, next) {
    var product_id = req.params.product;
    var action = req.query.action;
    for (let i = 0; i < carts.length; i++) {
      if (global.carts[i].id == product_id) {
        switch (action) {
          case "add":
            global.carts[i].quantity++;
            global.carts[i].totalprice = global.carts[i].price * global.carts[i].quantity;
            global.cart_total += Number(global.carts[i].price);
            break;
          case "remove":
            global.carts[i].quantity--;
            global.carts[i].totalprice = carts[i].price * global.carts[i].quantity;
            cart_total -= Number(global.carts[i].price);
            if (global.carts[i].quantity < 1) {
              global.carts.splice(i, 1);
            }
            break;
          case "clear":
            global.cart_total -= Number(global.carts[i].totalprice);
            global.carts.splice(i, 1);
            if (global.carts.length == 0) {
              global.cart_total = 0;
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
