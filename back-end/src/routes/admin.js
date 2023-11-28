const express = require("express");
const router = express.Router();
const AdminController = require("../app/controllers/adminController");

router.use("/admin_statusOrder", AdminController.index);
router.use("/admin_listProduct", AdminController.index1);
router.use("/admin_listUser", AdminController.index2);

module.exports = router;