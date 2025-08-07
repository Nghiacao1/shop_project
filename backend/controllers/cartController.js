const Cart = require('../models/CartItem');
exports.addToCart = (req, res) => {
  Cart.addToCart(req.body);
  res.json({ message: 'Added to cart' });
};
exports.getCart = (req, res) => res.json(Cart.getCart());
exports.clearCart = (req, res) => {
  Cart.clearCart();
  res.json({ message: 'Cart cleared' });
};
