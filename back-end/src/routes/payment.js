const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/paymentController");

router.post("/addPayment", paymentController.addPayment);
router.use("/", paymentController.index);

module.exports = router;
