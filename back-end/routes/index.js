const childrenRouter = require("./childrenProduct");
const productRouter = require("./product");
const siteRouter = require("./site");
const womenRouter = require("./women");
const aboutRouter = require("./about");
function route(myWeb) {
  myWeb.use("/about", aboutRouter);
  myWeb.use("/childrenProduct", childrenRouter);
  myWeb.use("/womenProduct", womenRouter);
  myWeb.use("/product", productRouter);
  myWeb.use("/home", siteRouter);
}

module.exports = route;
