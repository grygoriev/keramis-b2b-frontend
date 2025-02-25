// routes/priceGroup.routes.js
const express = require('express');
const router = express.Router();
const PriceGroup = require('../models/priceGroup.model');
const isInternalManager = require('../middlewares/isInternalManager');

// GET /pricing/price-groups/
router.get('/price-groups/', isInternalManager, async (req, res) => {
	try {
		const pg = await PriceGroup.find();
		res.json(pg);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
});

module.exports = router;
