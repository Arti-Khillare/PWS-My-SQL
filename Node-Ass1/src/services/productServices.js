const productModel = require('../models/productModel');

exports.getAllProducts = async () => {
    return await productModel.find();
};

exports.addProducts = async (productBody) => {
    return await productModel.create(productBody)
};

exports.getProductById = async (id) => {
    return await productModel.findById({ _id: id, isDeleted : false})
};

exports.updateProductById = async (id, productBody) => {
    return await productModel.findByIdAndUpdate(
        { _id : id, isDeleted : false},
        {$set : productBody, isPublished : true},
        { new : true}
    )
};

exports.deleteProductById = async (id) => {
    return await productModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
    )
};

exports.deleteProducts = async () => {
    return await productModel.updateMany(
        { isDeleted: false },
        { $set: { isDeleted: true } },
        { upsert: true }
    );
};

exports.getPublishedProducts = async (filterQuery) => {
    return await productModel.find(filterQuery)
};

exports.getProductByName = async (queryParam, filterQuery) => {
    return await productModel.find(queryParam, filterQuery)
};

exports.isProductExists = async (userId) => {
    return await productModel.find(userId)
};

exports.detailstoProduct = async (userId, productBody) => {
    return await productModel.findOneAndUpdate(
      { userId: userId },
      { $set: productBody },
      { new: true }
    )
};

