const productService = require('../services/productServices');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).send({ status : 'success', message : 'get all products successfully', data : products });
    }
    catch (err) {
        next (err)
    }
};

exports.addProducts = async (req, res, next) => {
    try {
        const products = await productService.addProducts(req.body);
        return res.status(200).send({ status : 'success', message : 'added product successfully', data : products});
    }
    catch (err) {
        next (err)
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        return res.status(200).send({ status : 'success', message : 'Product fetched successfully', data : product});
    }
    catch (err) {
        next (err)
    }
};

exports.updateProductById = async (req, res, next) => {
    try {
        const product = await productService.updateProductById(req.params.id, req.body);
        return res.status(200).send({ status : 'success', message : 'updated product successfully', data : product});
    }
    catch (err) {
        next (err)
    }
};

exports.deleteProductById  = async (req, res, next) => {
    try {
        const product = await productService.deleteProductById(req.params.id);
        return res.status(200).send({ status : 'success', message : 'deleted product successfully', data : product});
    }
    catch (err) {
        next (err)
    }
};

exports.deleteProducts = async (req, res, next) => {
    try {
        const products = await productService.deleteProducts();
        return res.status(200).send({ status : 'success', message : 'deleted products successfully', data : products});
    }
    catch (err) {
        next (err)
    }
};

exports.getPublishedProducts = async (req, res, next) => {
    try {
        const products = await productService.getPublishedProducts( { isDeleted: false, isPublished: true });
        return res.status(200).send({ status : 'success', message : 'fetched published products successfully', data : products});
    }
    catch (err) {
        next (err)
    }
};

exports.getProductByName = async (req, res, next) => {
    try {
        const products = await productService.getProductByName({name : req.query.name}, {isDeleted : false});
        return res.status(200).send({ status : 'success', message : 'fetched products by name successfully', data : products});
    }
    catch (err) {
        next (err)
    }
};