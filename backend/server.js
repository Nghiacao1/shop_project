const path = require("path");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const db = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// API routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', authRoutes);

// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend")));
// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, '../frontend_admin')));

// API: Lấy danh sách sản phẩm
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// API: Thêm sản phẩm
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, name, price });
  });
});

// API: Xoá sản phẩm
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Xoá thành công' });
  });
});

// ✅ Fallback chỉ dùng cho frontend routes (tránh chặn /api)
app.get('*splat', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  } else if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '../frontend_admin/login_admin.html'));
  } else {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
