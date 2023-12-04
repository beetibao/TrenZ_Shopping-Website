const express = require("express");
const router = express.Router();
const accountController = require("../app/controllers/accountController");


router.get('/edit', accountController.edit);
router.get('/changePassword', accountController.changePassword);
router.get('/orderHistory', accountController.orderHistory);
router.use('/', accountController.index);
module.exports = router;
