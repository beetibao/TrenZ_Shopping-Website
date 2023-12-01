const Products = require("../models/Product");
class ProductController {
  //[GET] /home

  index(req, res, next) {
    console.log()
    Products.getMenProducts(req.query)
      .then((men_products) => {
        res.render("product/product", { products: men_products });
      })
      .catch(next);
  }
  index1(req, res, next) {
    Products.getWomenProducts(req.query)
      .then((women_products) => {
        res.render("product/womenProduct", { products: women_products });
      })
      .catch(next);
  }
  index2(req, res, next) {
    Products.getChildrenProducts(req.query)
      .then((children_products) => {
        res.render("product/childrenProduct", { products: children_products });
      })
      .catch(next);
  }
  show(req, res, next) {
    Products.getProductById(req.params.id)
      .then((id_product) => {
        res.render("product/detailProduct", {
          id_product: id_product[0],
          relative_products: id_product[1],
        });
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
