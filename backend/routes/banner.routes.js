// routes/banner.routes.js
const express = require('express');
const router = express.Router();
const bannerCtrl = require('../controllers/banner.controller');

// GET /banners
router.get('/', bannerCtrl.getActiveBanners);

module.exports = router;
