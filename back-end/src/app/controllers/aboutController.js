class AboutController {
  index(req, res) {
    res.render("about");
  }
}
module.exports = new AboutController();
