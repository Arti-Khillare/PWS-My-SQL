const User = require("../models/userModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const roleModel = require("../models/roleModel");
const jwt = require("jsonwebtoken");
// const Joi = require('@hapi/joi');
const Joi = require("joi-oid");

const registerSchema = Joi.object({
  role: Joi.string(),
  fname: Joi.string().min(3).required(),
  lname: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  role_id: Joi.objectId().required(),
});

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const addAdmin = async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res
      .status(400)
      .send({ status: false, msg: "email is already registered" });
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  let roleId = req.body.role_id;
  let role = await roleModel.findById(roleId);
  if (!role) {
    return res.status(400).send({ message: "role is not found" });
  }

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
    role_id: roleId,
    role: role.roles,
  });

  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(400).send(error.details[0].msg);
      return;
    } else {
      const saveAdmin = await User.create(user);
      res
        .status(200)
        .send({
          status: true,
          msg: "User created successfully",
          data: saveAdmin,
        });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", data: err.msg });
    console.log(err);
  }
};

const addUser = async (req, res) => {
  const roleFromToken = req.body.role;
  if (req.role != roleFromToken) {
    return res
      .status(400)
      .send({ status: false, message: "Unauthrized Access" });
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send({ status: false, msg: "email is already registered" });
    return;
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  let roleId = req.body.role_id;
  let role = await roleModel.findById(roleId);

  if (!role) {
    return res.status(400).send({ message: "role is not found" });
  }

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
    role_id: roleId,
    role: role.roles,
  });

  try {
    //validation of user input
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(400).send(error.details[0].msg);
      return;
    } else {
      if (roleFromToken === "Admin") {
        const saveUser = await User.create(user);
        res
          .status(200)
          .send({
            status: true,
            msg: "User created successfully",
            data: saveUser,
          });
      } else {
        res.status(200).send({ status: false, msg: "check role" });
      }
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", data: err.msg });
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;

    const chectexistUser = await User.findOne({ email: email });
    if (chectexistUser) {
      const checkPassword = await bcrypt.compare(
        password,
        chectexistUser.password
      );
      if (!checkPassword) {
        return res
          .status(400)
          .send({ status: false, message: `password or email is incorrect` });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: `email or password is incorrect` });
    }

    const token = jwt.sign(
      {
        userid: chectexistUser._id,
        role: chectexistUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
      },
      "secretKey"
    );
    //res.setHeader("Authorization", token);
    res.setHeader("x-access-token", token);
    const tokenData = {
      userId: chectexistUser._id,
      role: chectexistUser.role,
      token: token,
    };
    res
      .status(200)
      .send({ status: true, msg: "login successfully", data: tokenData });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", data: err.msg });
    console.log(err);
  }
};

const getProductByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const userExist = await User.findById({ _id: userId });

    if (!userExist) {
      return res
        .status(400)
        .send({ status: false, message: " user data not found" });
    }

    const productExist = await Product.find({ userId: userId });

    if (!productExist) {
      return res
        .status(400)
        .send({ status: false, message: "product data not found" });
    }
    return res
      .status(200)
      .send({
        status: true,
        message: "all products by userId",
        data: productExist,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};

const updateUserbyId = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const userExist = await User.findById({ _id: id });

    if (!userExist) {
      return res
        .status(400)
        .send({ status: false, message: " user data not found" });
    }

    const updateDetails = await User.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "update user successfully",
        data: updateDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};

const addProductByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const userExist = await User.findById({ _id: userId });

    if (!userExist) {
      return res
        .status(400)
        .send({ status: false, message: " user data not found" });
    }

    const addProduct = await Product.findOneAndUpdate(
      { userId: userId },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "add product by userId",
        data: addProduct,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};

const updateProductByUserIdandProductId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.body.productId;
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const userExist = await User.findById({ _id: userId });

    if (!userExist) {
      return res
        .status(400)
        .send({ status: false, message: " user data not found" });
    }

    const productExist = await Product.findById(productId);

    if (!productExist) {
      return res
        .status(400)
        .send({ status: false, message: " product data not found" });
    }

    const updateDetails = await Product.findOneAndUpdate(
      { userId: userId },
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: " updated successfully",
        data: updateDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const roleFromToken = req.body.role;
    if (req.role != roleFromToken) {
      return res
        .status(400)
        .send({ status: false, message: "Unauthrized Access" });
    }
    let price = req.query.price;
    let rating = req.query.rating;
    let orderBy = req.query.orderBy;
    let limit = req.query.limit;
    let skip = req.query.skip;
    let sort = req.query.sort;
    let sortObj = {};
    sortObj["sort"] = orderBy === "asc" ? 1 : -1;
    const result = await Product.find({ price: price, rating: rating })
      .select()
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .exec();

    return res
      .status(200)
      .send({
        status: true,
        message: "get prouduct details based on sort",
        data: result,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Error", err: err.message });
  }
};
module.exports = {
  addAdmin,
  addUser,
  loginUser,
  getProductByUserId,
  updateUserbyId,
  addProductByUserId,
  updateProductByUserIdandProductId,
  getAllProduct,
};
