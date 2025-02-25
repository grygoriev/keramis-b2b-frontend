// controllers/banner.controller.js
const Banner = require('../models/banner.model');

exports.getActiveBanners = async (req, res) => {
	try {
		const now = new Date();
		// (start_date is null OR <= now) AND (end_date is null OR >= now)
		const banners = await Banner.find({
			$or: [{ start_date: null }, { start_date: { $lte: now } }],
			$or: [{ end_date: null }, { end_date: { $gte: now } }]
		}).sort({ sort_order: 1 });

		// image_url = assemble absolute if imagePath stored
		// or if it's just banner.image = full URL
		let data = banners.map((b) => {
			let imageUrl = null;
			if (b.imagePath) {
				imageUrl = `${req.protocol}://${req.get('host')}/uploads/${b.imagePath}`;
			}
			return {
				id: b._id,
				image_url: imageUrl,
				link_url: b.link_url,
				title: b.title,
				description: b.description,
				sort_order: b.sort_order,
				start_date: b.start_date,
				end_date: b.end_date
			};
		});
		res.json(data);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};
