const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const auth = require("../middleware/auth");

router.post("/admin", userController.addAdmin);
router.post("/admin/user", auth.verifyAdmin, userController.addUser);
router.post("/login", userController.loginUser);
router.get("/products/:userId", userController.getProductByUserId);
router.put("/user/:id", userController.updateUserbyId);
router.post("/product/:userId", userController.addProductByUserId);
router.put(
  "/products/:userId",
  userController.updateProductByUserIdandProductId
);
router.get("/get/sort", auth.verifyAdmin, userController.getAllProduct);

module.exports = router;
