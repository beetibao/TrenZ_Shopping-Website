const express = require("express");
const router = express.Router();
const loginController = require("../app/controllers/loginController");

router.post('/checklog',loginController.SignIn);
router.get('/', loginController.index);
module.exports = router;
