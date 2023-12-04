const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/paymentController");

router.post("/addPayment", paymentController.addPayment);
router.get("/detail", paymentController.detailPayment);
router.get("/:id", paymentController.showPayment);
router.use("/", paymentController.index);

module.exports = router;
