const express = require("express");
const router = express.Router();

const productController = require("../controller/productController");
const auth = require('../middleware/auth');

router.post("/addproducts", auth.verifyAuth, productController.addProduct);

router.get("/getproducts", auth.verifyAuth, productController.getProducts);

router.get("/products/:Id", auth.verifyAuth, productController.getProductById);

router.put("/products/:Id", auth.verifyAuth, productController.updateProductById);

router.delete("/products/:Id", auth.verifyAuth, productController.deleteProductById);

router.delete("/deleteproducts", auth.verifyAuth, productController.deleteProducts);

router.get("/get/published", auth.verifyAuth, productController.getPublishedProducts);

router.get("/products", auth.verifyAuth, productController.getProductsbyName);

module.exports = router;
