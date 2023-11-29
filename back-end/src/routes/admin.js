const express = require("express");
const router = express.Router();
const AdminController = require("../app/controllers/adminController");

router.use("/admin_statusOrder", AdminController.index1);
router.use("/admin_listProduct", AdminController.index);
router.use("/admin_listUser", AdminController.index2);
router.get("/createProduct", AdminController.createProduct);
router.post("/storeProduct", AdminController.storeProduct);
//router.use("/editProduct", AdminController.editProduct);
//router.use("/deleteProduct", AdminController.deleteProduct);

module.exports = router;