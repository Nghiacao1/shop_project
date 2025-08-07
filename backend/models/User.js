const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const { name, email, password } = userData;
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], callback);
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    db.query(query, [email], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM users';
    db.query(query, callback);
  },
};

module.exports = User;