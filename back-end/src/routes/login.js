const express = require("express");
const router = express.Router();
const loginController = require("../app/controllers/loginController");

router.get("/checklog", loginController.check);
router.use("/", loginController.index);

module.exports = router;
