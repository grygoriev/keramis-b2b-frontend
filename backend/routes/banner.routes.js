// routes/banner.routes.js
const express = require('express');
const router = express.Router();
const Banner = require('../models/banner.model');

// GET /banner/ - вернуть актуальные баннеры
router.get('/', async (req, res) => {
	try {
		const now = new Date();
		const banners = await Banner.find({
			$or: [
				{ start_date: null },
				{ start_date: { $lte: now } }
			],
			$or: [
				{ end_date: null },
				{ end_date: { $gte: now } }
			]
		}).sort({ sort_order: 1 });
		// Преобразовать в JSON
		// image_url = assemble absolute URL?
		res.json(banners);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
});

module.exports = router;
