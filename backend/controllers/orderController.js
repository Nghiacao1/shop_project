const Order = require('../models/Order');
const Cart = require('../models/CartItem');
exports.createOrder = (req, res) => {
  const cartItems = Cart.getCart();
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderData = {
    customer_name: req.body.customer_name,
    total,
    items: JSON.stringify(cartItems)
  };
  Order.createOrder(orderData, (err, result) => {
    if (err) return res.status(500).json(err);
    Cart.clearCart();
    res.json({ message: 'Order placed!', orderId: result.insertId });
  });
};
