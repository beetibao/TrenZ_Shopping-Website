const express = require("express");
const router = express.Router();
const childrenController = require("../app/controllers/productController");
router.use("/:id", childrenController.show);
router.use("/", childrenController.index2);

module.exports = router;
