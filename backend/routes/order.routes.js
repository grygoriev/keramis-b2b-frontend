const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const isInternalManager = require('../middlewares/isInternalManager');
const orderCtrl = require('../controllers/order.controller');

router.post('/checkout/', authJwt, orderCtrl.checkoutCart);
// GET /orders/orders/
router.get('/orders/', authJwt, orderCtrl.listOrders);

router.patch('/orders/:orderId/status/', authJwt, isInternalManager, orderCtrl.updateOrderStatus);

module.exports = router;
