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
const expressLayouts = require('express-ejs-layouts');


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', authRoutes);

app.use(expressLayouts);
app.set('layout', 'layout'); // file layout.ejs trong thư mục views
// Set EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend')); // thư mục chứa file *.ejs

// Serve static files cho frontend (css, js, img, ...)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve static files cho admin dashboard (css, js, img,...)
app.use('/admin', express.static(path.join(__dirname, '../frontend_admin')));

// Route riêng cho admin login (file html tĩnh)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend_admin/login_admin.html'));
});

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

app.get('/cart', (req, res) => {
  res.render('cart', { cartItems: [] });  
});
app.get('/login', (req, res) => {
  res.render('login');  
});
app.get('/register', (req, res) => {
  res.render('register');  
});
// Fallback route cho frontend: tất cả đường dẫn khác (ngoại trừ api, admin)
// sẽ render trang index.ejs (hoặc bạn có thể tùy chỉnh render trang khác)
app.get('*splat', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  // Nếu không phải api hay admin thì trả về trang index.ejs
  res.render('index'); // mặc định tìm file index.ejs trong folder views
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
