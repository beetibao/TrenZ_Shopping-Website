const childrenRouter = require("./childrenProduct");
const productRouter = require("./product");
const siteRouter = require("./site");
const womenRouter = require("./women");
const aboutRouter = require("./about");
const cartRouter = require("./cart");
const paymentRouter = require("./payment");
const adminRouter = require("./admin");
const loginRouter = require("./login");
const registerRouter = require("./register");

function route(myWeb) {
  myWeb.use("/payment", paymentRouter);
  myWeb.use("/login", loginRouter);
  myWeb.use("/register", registerRouter);
  // myWeb.use("/changePassword", changePasswordRouter)
  myWeb.use("/admin", adminRouter);
  myWeb.use("/cart", cartRouter);
  myWeb.use("/about", aboutRouter);
  myWeb.use("/childrenProduct", childrenRouter);
  myWeb.use("/womenProduct", womenRouter);
  myWeb.use("/product", productRouter);
  myWeb.use("/", siteRouter);
}

module.exports = route;
