const User = require("../models/userModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");
const roleModel = require("../models/roleModel");
const jwt = require("jsonwebtoken");
// const Joi = require('@hapi/joi');
const Joi = require("joi-oid");

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;

  if (typeof value === "string" && value.trim().length === 0) {
    return false;
  }
  return true;
};

const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().required(),
  userId: Joi.objectId(),
  productImage: Joi.string().required(),
  price: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  createdBy: Joi.objectId(),
});

const addProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    userId: req.body.userId,
    productImage: req.body.productImage,
    price: req.body.price,
    rating: req.body.rating,
    createdBy: req.body.userId,
  });

  //authorization
  if (req.userid !== req.body.userId) {
    return res.status(403).send({ status: false, mesaage: "you are not authorized" })
  }

  try {
    //validation of product input
    const { error } = await productSchema.validateAsync(req.body);
    if (error) {
      res.status(400).send(error.details[0].msg);
      return;
    } else {
      const saveProduct = await Product.create(product);
      res
        .status(200)
        .send({
          status: true,
          msg: "Product added successfully",
          data: saveProduct,
        });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Server Error", err: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    //authorization
    if (req.role !== "User") {
    return res
    .status(403)
    .send({ status: false, mesaage: "you are not authorized" })
    }
    const productsDetails = await Product.find({ isDeleted: false });
    return res
      .status(200)
      .send({
        status: true,
        message: "products details fetched",
        data: productsDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const Id = req.params.Id;

    //validating the Id
    if (!isValidObjectId(Id)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Id" });
    }

    //checking Id exists or not
    const productData = await Product.findById({ _id: Id });

    //authorization
    if (req.role !== "User") {
      return res
      .status(403)
      .send({ status: false, mesaage: "you are not authorized" })
    }

    if (!productData) {
      return res.status(404).send({ status: false, message: "product data not found" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "Product  details", data: productData });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const updateProductById = async (req, res) => {
  const Id = req.params.Id;

  if (!isValidObjectId(Id)) {
    return res
      .status(400)
      .send({ status: false, message: "Invalid Id" });
  }

  //authorization
  if (req.role !== "User") {
    return res
    .status(403)
    .send({ status: false, mesaage: "you are not authorized" })
  }

  try {
    const { error } = await productSchema.validateAsync(req.body);
    if (error) {
      res.status(400).send(error.details[0].msg);
      return;
    } else {
      const updateDetails = await Product.findByIdAndUpdate(
        { _id: Id },
        { $set: req.body },
        { new: true }
      );
      return res
        .status(200)
        .send({
          status: true,
          message: "Product updated successfully",
          data: updateDetails,
        });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};


const deleteProductById = async (req, res) => {
  try {
    const Id = req.params.Id;

    if (!isValidObjectId(Id)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Id" });
    }

    //authorization
   if (req.role !== "User") {
     return res
       .status(403)
       .send({ status: false, mesaage: "you are not authorized" })
   }
    //checking product exists or not
    const productData = await Product.findById({ _id: Id });

    if (!productData) {
      return res.status(404).send({ status: false, message: "product not found" });
    }

    const deleteDetails = await Product.findByIdAndUpdate(
      { _id: Id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "Delete Product by Id successfully",
        data: deleteDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const deleteProducts = async (req, res) => {
  try {
    //authorization
    if (req.role !== "User") {
    return res
      .status(403)
      .send({ status: false, mesaage: "you are not authorized" })
    }
    const deleteDetails = await Product.updateMany(
      { isDeleted: false },
      { $set: { isDeleted: true } },
      { upsert: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "deleted successfully",
        data: deleteDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const getPublishedProducts = async (req, res) => {
  try {

    //authorization
    if (req.role !== "User") {
    return res
      .status(403)
      .send({ status: false, mesaage: "you are not authorized" })
    }

    const filterQuery = { isDeleted: false, isPublished: true };
    const getPublishedData = await Product.find(filterQuery);

    return res
      .status(200)
      .send({
        status: true,
        message: "fetched all published product successfully",
        data: getPublishedData,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Server Error", err: err.message });
  }
};

const getProductsbyName = async (req, res) => {
  try {
    const filterQuery = { isDeleted: false };
    const queryParams = req.query;
    const { name } = queryParams;
    
    if (!isValid(name)) {
      filterQuery["name"] = name;
    }

    //authorization
    if (req.role !== "User") {
    return res
      .status(403)
      .send({ status: false, mesaage: "you are not authorized" })
    }

    const getDataByName = await Product.find(queryParams, filterQuery);
    return res
      .status(200)
      .send({
        status: true,
        message: "product details fetched with name successfully",
        data: getDataByName,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Server Error", err: err.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  deleteProducts,
  getPublishedProducts,
  getProductsbyName,
};
