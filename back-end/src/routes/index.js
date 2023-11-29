const childrenRouter = require("./childrenProduct");
const productRouter = require("./product");
const siteRouter = require("./site");
const womenRouter = require("./women");
const aboutRouter = require("./about");
const cartRouter = require("./cart");
const changePasswordRouter = require("./changePassword");
function route(myWeb) {
  myWeb.use("/changePassword", changePasswordRouter)
  myWeb.use("/cart", cartRouter);
  myWeb.use("/about", aboutRouter);
  myWeb.use("/childrenProduct", childrenRouter);
  myWeb.use("/womenProduct", womenRouter);
  myWeb.use("/product", productRouter);
  myWeb.use("/", siteRouter);
}

module.exports = route;
