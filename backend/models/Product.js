const db = require('../config/db');
exports.getAllProducts = (cb) => {
  db.query('SELECT * FROM products', cb);
};
