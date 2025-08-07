const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');

// Đăng ký
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Kiểm tra email tồn tại
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi server' });

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Thêm người dùng
      const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Lỗi khi tạo tài khoản' });

        res.status(201).json({ message: 'Đăng ký thành công', userId: result.insertId });
      });
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Đăng nhập
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const user = results[0];

    // So sánh mật khẩu đã băm
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    res.json({ message: 'Đăng nhập thành công', user: { id: user.id, name: user.name, email: user.email } });
  });
});

module.exports = router;
