const Cart = require("../models/Product");
let carts = [];
let cart_total = 0;
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
      setTimeout(function () {
        res.redirect("back");
      }, 5000);
    });
  }
  checkout(req, res, next) {
    Cart.showToCart(carts, cart_total).then(function (listsProduct) {
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
      if (carts[i].id == product_id) {
        switch (action) {
          case "add":
            carts[i].quantity++;
            carts[i].totalprice = carts[i].price * carts[i].quantity;
            cart_total += Number(carts[i].price);
            break;
          case "remove":
            carts[i].quantity--;
            carts[i].totalprice = carts[i].price * carts[i].quantity;
            cart_total -= Number(carts[i].price);
            if (carts[i].quantity < 1) {
              carts.splice(i, 1);
            }
            break;
          case "clear":
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
