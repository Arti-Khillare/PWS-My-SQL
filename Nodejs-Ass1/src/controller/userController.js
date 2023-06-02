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
  const isemailExist = await User.findOne({ email: req.body.email });
  if (isemailExist) {
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
          msg: "AdminUser created successfully",
          data: saveAdmin,
        });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
    //console.log(err);
  }
};

const addUser = async (req, res) => {
  const roleFromToken = req.body.role;
  if (req.role != roleFromToken) {
    return res
      .status(400)
      .send({ status: false, message: "Unauthrized Access" });
  }

  const isemailExist = await User.findOne({ email: req.body.email });
  if (isemailExist) {
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
        res.status(400).send({ status: false, msg: "user is not allowed as it doesnt have access" });
      }
    }
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
    //console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;

    const checkExistUser = await User.findOne({ email: email });
    if (checkExistUser) {
      const checkPassword = await bcrypt.compare(
        password,
        checkExistUser.password
      );
      if (!checkPassword) {
        return res
          .status(400)
          .send({ status: false, message: `password or email is incorrect` });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: `user with email:${email} not exist` });
    }

    const token = jwt.sign(
      {
        userid: checkExistUser._id,
        role: checkExistUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
      },
      "secretKey"
    );
    res.setHeader("x-access-token", token);
    const tokenData = {
      userId: checkExistUser._id,
      role: checkExistUser.role,
      token: token,
    };
    res
      .status(200)
      .send({ status: true, msg: "login successfully", data: tokenData });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
    console.log(err);
  }
};

const getProductsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid userId" });
    }

    //authorization
    if (req.userid !== userId) {
      return res.status(403).send({ status: false, mesaage: "you are not authorized" })
    }

    const isuserExist = await User.findById({ _id: userId });

    if (!isuserExist) {
      return res
        .status(400)
        .send({ status: false, message: "user not found" });
    }

    const isproductExist = await Product.find({ userId: userId });

    if (!isproductExist) {
      return res
        .status(400)
        .send({ status: false, message: "product data not found" });
    }
    return res
      .status(200)
      .send({
        status: true,
        message: "fetched all products by userId",
        data: isproductExist,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const updateUserbyId = async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid id" });
    }

    //authorization
    if (req.userid !== id) {
      return res.status(403).send({ status: false, mesaage: "you are not authorized" })
    }

    const isuserExist = await User.findById({ _id: id });

    if (!isuserExist) {
      return res
        .status(400)
        .send({ status: false, message: "user not found" });
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
        message: "updated user successfully",
        data: updateDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const addProductByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid userId" });
    }

    //authorization
    if (req.userid !== userId) {
      return res.status(403).send({ status: false, mesaage: "you are not authorized" })
    }

    const isuserExist = await User.findById({ _id: userId });

    if (!isuserExist) {
      return res
        .status(400)
        .send({ status: false, message: "user not found" });
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
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const updateProductByUserIdandProductId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.body.productId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invali userId" });
    }

    //authorization
    if (req.userid !== userId) {
      return res.status(403).send({ status: false, mesaage: "you are not authorized" })
    }

    const isuserExist = await User.findById({ _id: userId });

    if (!isuserExist) {
      return res
        .status(400)
        .send({ status: false, message: "user not found" });
    }

    const productExist = await Product.findById(productId);

    // if (!productExist || productExist.userId != userId) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "product not found" });
    // }

    if(productExist) {
      if(productExist.userId != userId) {
        return res
        .status(400)
        .send({status:false, message:"this product is not belongs to this userid "})
      }
    }
    else {
      return res
        .status(400)
        .send({ status: false, message: "product not found" });
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
        message: "product updated successfully",
        data: updateDetails,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const roleFromToken = req.body.role;
    if (req.role != roleFromToken) {
      return res
        .status(400)
        .send({ status: false, message: "Unauthorized Access" });
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
        message: "fetched product details based on sort successfully",
        data: result,
      });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error", err: err.message });
  }
};

module.exports = {
  addAdmin,
  addUser,
  loginUser,
  getProductsByUserId,
  updateUserbyId,
  addProductByUserId,
  updateProductByUserIdandProductId,
  getAllProducts,
};
