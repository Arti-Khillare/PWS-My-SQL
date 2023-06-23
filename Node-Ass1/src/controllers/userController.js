const userService = require("../services/userServices");
const productService = require("../services/productServices");
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');

require('dotenv').config;

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({  status: "success", data: users });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    if( await userModel.isEmailTaken(req.body.email)){
      res.status(400).send({status : false, msg : "email is already registered"})
      return
    }
   
    const users = await userService.createUser(req.body);
    res.json({  status: "success", message : "user created successfully", data: users});
    
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const users = await userService.getUserById(req.params.id);
    res.json({  status: "success", data: users });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const users = await userService.updateUser(req.params.id, req.body);
    res.json({  status: "success" , data: users});
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const users = await userService.deleteUser(req.params.id);
    res.json({  status: "success", data: users });
  } catch (err) {
    next(err);
  }
};

exports.getProductsByUserId = async (req, res, next) => {
    try {
      const user = await userService.checkUserExist(req.params.userId)
      if(!user) {
        return res.status(400).send({status : 'failure', message : 'user not found'})
      }
      const product= await productService.isProductExists({userId : req.params.userId})
      return res.status(200).send({ status : 'success', message : 'get product by userId successfully', data : product})
     }
     catch (err) {
      next(err);
     }
};

exports.addProductByUserId = async (req, res, next) => {
  try {
    const user = await userService.checkUserExist( req.params.userId)
    if(!user) {
      return res.status(400).send({status : 'failure', message : 'user not found'})
    }

    const product = await productService.detailstoProduct( req.params.userId, req.body);
    return res.status(201).send({ status : 'success', message : 'successfully added product by using userId', data : product})
  }
  catch (err) {
    next (err);
  }
};

exports.updateProductByUserIdandProductId = async (req, res, next) => {
  try {
    const user = await userService.checkUserExist( req.params.userId)
    if(!user) {
      return res.status(400).send({status : 'failure', message : 'user not found'})
    }

    const product = await productService.detailstoProduct( req.params.userId, req.body);
    return res.status(201).send({ status : 'success', message : 'successfully updated product by using userId', data : product})
  }
  catch (err) {
    next (err);
  }
};

exports.getAllSorted = async (req, res, next) => {
  try {
    const queryParam = req.query;
    let { price, rating, orderBy, limit, skip, sort} = queryParam
    let sortObj = {};
    sortObj["sort"] = orderBy === "asc" ? 1 : -1;
    const result = await productModel.find({price : price, rating : rating})
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
  }
  catch (err) {
    next(err)
  }
}