const express = require("express");
const auth  = require('../middleware/auth');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getProductsByUserId,
  addProductByUserId,
  updateProductByUserIdandProductId,
  getAllSorted
  } = require("../controllers/userController");


router.route("/")
.get(auth.isAuthenticated, auth.isAuthorizedRole, getAllUsers)
.post(auth.isAuthenticated, auth.isAuthorizedRole,createUser);

router.route("/:id")
.get(auth.isAuthenticated, auth.isAuthorizedUser, getUserById)
.put(auth.isAuthenticated, auth.isAuthorizedUser, updateUser)
.delete(auth.isAuthenticated, auth.isAuthorizedUser, deleteUser);

router.route("/products/:userId")
.get(auth.isAuthenticated, auth.isAuthorizedUser, getProductsByUserId)
.post(auth.isAuthenticated, auth.isAuthorizedUser, addProductByUserId)
.put(auth.isAuthenticated, auth.isAuthorizedUser, updateProductByUserIdandProductId);

router.route("/productsort/getsort")
.get(auth.isAuthenticated, auth.isAuthorizedRole, getAllSorted);


module.exports = router;


