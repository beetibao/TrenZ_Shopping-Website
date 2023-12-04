const express = require("express");
const router = express.Router();
const AdminController = require("../app/controllers/adminController");
/*const methodOverride = require('method-override')
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));*/

router.use("/admin_statusOrder", AdminController.index1);
router.use("/admin_listProduct", AdminController.index);
router.use("/admin_listUser", AdminController.index2);
router.get("/createProduct", AdminController.createProduct);
router.post("/storeProduct", AdminController.storeProduct);

router.get("/editProduct/:id", AdminController.editProduct);
router.put("/updateProduct", AdminController.updateProduct);
router.delete("/deleteProduct/:id", AdminController.deleteProduct);

router.get("/editOrder/:id", AdminController.editOrder);
router.put("/updateOrder", AdminController.updateOrder);
router.delete("/deleteOrder/:id", AdminController.deleteOrder);
module.exports = router;
