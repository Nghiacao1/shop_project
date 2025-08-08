const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const db = require("../config/db");

router.get('/', productController.getProducts);
// API tìm kiếm sản phẩm
router.get("/search", (req, res) => {
  const keyword = req.query.keyword || "";
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${keyword}%`], (err, results) => {
    if (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results); // ✅ JSON chứ không render view
  });
});
module.exports = router;
