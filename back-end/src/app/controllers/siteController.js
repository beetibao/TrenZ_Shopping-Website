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
    let list_keyword = req.query.keyword.split(" ");
    Products.searchProduct(list_keyword)
      .then((products) => {
        res.render("search", {
          products: products,
          keyword: req.query.keyword,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  about(req, res) {
    res.render("about");
  }
}
module.exports = new SiteController();
