class LoginController {
  //[GET] /news
  index(req, res) {
    res.render("login");
  }
  //[GET] /news/:slug
  check(req, res) {
    res.send("NEWS DETAIL!!!");
  }
}
module.exports = new LoginController();
