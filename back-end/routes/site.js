const express = require("express");
const router = express.Router();
const siteController = require("../app/controllers/siteController");

router.use("/about", siteController.about);
// router.use("/search", siteController.search);
router.use("/:id", siteController.show);
router.use("/", siteController.index);

module.exports = router;
