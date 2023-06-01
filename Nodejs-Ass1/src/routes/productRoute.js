const express = require("express");
const router = express.Router();

const productController = require("../controller/productController");

router.post("/addproducts", productController.addProduct);
router.get("/getproducts", productController.getProducts);
router.get("/products/:Id", productController.getProductById);
router.put("/products/:Id", productController.updateProductById);
router.delete("/products/:Id", productController.deleteProductById);
router.delete("/deleteproducts", productController.deleteProducts);
router.get("/get/published", productController.getPublishedProducts);
router.get("/products", productController.getProductbyName);

module.exports = router;
