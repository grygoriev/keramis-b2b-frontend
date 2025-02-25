const express = require('express');
const router = express.Router();
const searchCtrl = require('../controllers/search.controller');

// GET /catalog/search/products/?q=...
router.get('/products', searchCtrl.searchProducts);
// GET /catalog/search/autocomplete/?q=...
router.get('/autocomplete', searchCtrl.searchAutocomplete);

module.exports = router;
