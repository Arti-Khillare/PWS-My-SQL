const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const auth = require("../middleware/auth");

router.post("/admin", userController.addAdmin);

router.post("/admin/user", auth.verifyAuth, userController.addUser); //with admin access

router.get("/get/sort", auth.verifyAuth, userController.getAllProducts); //with admin access

router.post("/login", userController.loginUser);

router.get("/products/:userId", auth.verifyAuth, userController.getProductsByUserId);

router.put("/user/:id", auth.verifyAuth, userController.updateUserbyId);

router.post("/product/:userId", auth.verifyAuth, userController.addProductByUserId);

router.put(
  "/products/:userId",
  auth.verifyAuth,
  userController.updateProductByUserIdandProductId
);


module.exports = router;
