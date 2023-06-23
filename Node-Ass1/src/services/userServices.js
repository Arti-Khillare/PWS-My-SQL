const userModel = require("../models/userModel");

exports.getAllUsers = async () => {
  return await userModel.find();
};

exports.registerUser = async (userBody) => {
  return await userModel.create(userBody)
};

exports.createUser = async (userBody) => {
  return await userModel.create(userBody);
};

exports.getUserById = async (id) => {
  return await userModel.findById( {_id: id}, {isDeleted : false});
};

exports.updateUser = async (id, userBody) => {
  return await userModel.findByIdAndUpdate(
    { _id: id, isDeleted : false },
    { $set: userBody },
    { new: true }
  );
};

exports.deleteUser = async (id) => {
  return await userModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
};


exports.getUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

exports.checkUserExist = async (userId) => {
  return await userModel.findOne({ _id : userId});
};

