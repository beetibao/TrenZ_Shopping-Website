const Products = require("../models/Product");
class ProductController {
  //[GET] /home

  index(req, res, next) {
    Products.getMenProducts()
      .then((men_products) => {
        res.render("product/product", { products: men_products });
      })
      .catch(next);
  }
  index1(req, res, next) {
    Products.getWomenProducts()
      .then((women_products) => {
        res.render("product/womenProduct", { products: women_products });
      })
      .catch(next);
  }
  index2(req, res, next) {
    Products.getChildrenProducts()
      .then((children_products) => {
        res.render("product/childrenProduct", { products: children_products });
      })
      .catch(next);
  }
  show(req, res, next) {
    Products.getProductById(req.params.id)
      .then((id_product) => {
        res.render("product/detailProduct", { id_product: id_product });
      })
      .catch(next);
  }

  create(req, res, next) {
    res.render("product/createProduct");
  }
  store(req, res, next) {
    //store product to database with createProduct function
    Products.createProduct(req.body)
      .then(() => res.redirect("/"))
      .catch(next);
  }
}
module.exports = new ProductController();
