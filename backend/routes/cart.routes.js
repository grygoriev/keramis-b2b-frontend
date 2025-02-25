const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const cartCtrl = require('../controllers/cart.controller');

// GET /orders/carts/
router.get('/carts/', authJwt, cartCtrl.listCarts);
// GET /orders/carts/:cartId
router.get('/carts/:cartId', authJwt, cartCtrl.getCartDetail);
// POST /orders/carts/
router.post('/carts/', authJwt, cartCtrl.createCart);

router.delete('/carts/:cartId', authJwt, cartCtrl.deleteCart);

// POST /orders/cart-items/
router.post('/cart-items/', authJwt, cartCtrl.addItemToCart);
// PATCH /orders/cart-items/:itemId/
router.patch('/cart-items/:itemId', authJwt, cartCtrl.updateCartItem);
// DELETE /orders/cart-items/:itemId/
router.delete('/cart-items/:itemId', authJwt, cartCtrl.deleteCartItem);

module.exports = router;
