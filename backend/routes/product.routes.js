// routes/product.routes.js
const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller.js');

// GET /catalog/products/?fv_product_list=promo
router.get('/', productCtrl.listProducts);

module.exports = router;
