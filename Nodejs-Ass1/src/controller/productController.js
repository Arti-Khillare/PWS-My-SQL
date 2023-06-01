const User = require("../models/userModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");
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

  try {
    //validation of user input
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
      .send({ status: false, message: "Error", err: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const productDetails = await Product.find({ isDeleted: false });
    return res
      .status(200)
      .send({
        status: true,
        message: "product details fetched",
        data: productDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", err: err.msg });
  }
};

const getProductById = async (req, res) => {
  try {
    const Id = req.params.Id;

    //validating the Id
    if (!isValidObjectId(Id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid  userId" });
    }

    //checking Id exists nor not
    const productData = await Product.findById({ _id: Id });

    if (!productData) {
      return res.status(404).send({ status: false, message: "data not found" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "Product  details", data: productData });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", err: err.msg });
  }
};

const updateProductById = async (req, res) => {
  const Id = req.params.Id;

  if (!isValidObjectId(Id)) {
    return res
      .status(400)
      .send({ status: false, message: "please enter valid  userId" });
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
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};
const deleteProductById = async (req, res) => {
  try {
    const Id = req.params.Id;

    if (!isValidObjectId(Id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid  userId" });
    }
    //checking Id exists nor not
    const productData = await Product.findById({ _id: Id });

    if (!productData) {
      return res.status(404).send({ status: false, message: "data not found" });
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
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};

const deleteProducts = async (req, res) => {
  try {
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
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};

const getPublishedProducts = async (req, res) => {
  try {
    const filterQuery = { isDeleted: false, isPublished: true };
    const getPublishedData = await Product.find(filterQuery);

    return res
      .status(200)
      .send({
        status: true,
        message: "get published product successfully",
        data: getPublishedData,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", err: err.message });
  }
};

const getProductbyName = async (req, res) => {
  try {
    const filterQuery = { isDeleted: false };
    const queryParams = req.query;
    const { name } = queryParams;
    // const name = req.query.name
    // filterQuery["name"] = name
    if (!isValid(name)) {
      filterQuery["name"] = name;
    }

    const getDataByName = await Product.find(queryParams, filterQuery);
    return res
      .status(200)
      .send({
        status: true,
        message: "details fetched with name successfully",
        data: getDataByName,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", err: err.message });
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
  getProductbyName,
};
