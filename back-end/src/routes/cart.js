const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/cartController");

router.get("/update/:product", cartController.update);
router.use("/checkout", cartController.checkout);
router.get("/add/:product", cartController.add);
router.use("/", cartController.index);

module.exports = router;
