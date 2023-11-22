const express = require("express");
const router = express.Router();
const productController = require("../app/controllers/productController");

router.use("/createProduct", productController.create);
router.post("/storeProduct", productController.store);
router.use("/:id", productController.show);
router.use("/", productController.index1);

module.exports = router;
