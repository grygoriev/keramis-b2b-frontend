const express = require('express');
const router = express.Router();
const catalogCtrl = require('../controllers/catalog.controller');

// GET /catalog/categories/tree/
router.get('/categories/tree', catalogCtrl.getCategoryTree);

// GET /catalog/categories/:slug/detail/
router.get('/categories/:slug/detail', catalogCtrl.getCategoryDetail);

// GET /catalog/products/:slug/detail/
router.get('/products/:slug/detail', catalogCtrl.getProductDetail);

module.exports = router;
