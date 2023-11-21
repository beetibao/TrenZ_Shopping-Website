const Products = require("../models/Site");
class SiteController {
  //[GET] /home
  index(req, res, next) {
    Products.getProducts()
      .then((products) => {
        res.render("home", { products: products });
      })
      .catch(next);
  }
  //[GET] /home/:id
  show(req, res, next) {
    Products.getProductById(req.params.id)
      .then((id_product) => {
        res.render("product/detailProduct", { id_product: id_product });
      })
      .catch(next);
  }

  //[GET] /search
  search(req, res) {
    res.render("search");
  }

  about(req, res) {
    res.render("about");
  }
}
module.exports = new SiteController();
