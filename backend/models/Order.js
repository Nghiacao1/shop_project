const db = require('../config/db');
exports.createOrder = (data, cb) => {
  db.query('INSERT INTO orders SET ?', data, cb);
};
