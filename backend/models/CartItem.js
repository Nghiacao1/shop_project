let cart = [];
exports.addToCart = (product) => cart.push(product);
exports.getCart = () => cart;
exports.clearCart = () => { cart = []; };
