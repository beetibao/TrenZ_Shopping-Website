const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/paymentController");

router.use("/", paymentController.index);

module.exports = router;
