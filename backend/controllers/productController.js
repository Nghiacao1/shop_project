const Product = require('../models/Product');
exports.getProducts = (req, res) => {
  Product.getAllProducts((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

