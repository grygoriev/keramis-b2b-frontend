const Product = require('../models/product.model');

exports.searchProducts = async (req, res) => {
	try {
		const q = (req.query.q || '').trim();
		let filtered = Product.find({ status: 'active' });

		if (q) {
			// simple text search
			filtered = filtered.find({ $or: [
					{ name: { $regex: q, $options: 'i' } },
					{ sku_id: { $regex: q, $options: 'i' } }
				]});
		}

		return res.json({
			count: 0,
			next: null,
			previous: null,
			products: []
		});
	} catch (err) {
		res.status(500).json({ detail: "Server error" });
	}
};

exports.searchAutocomplete = async (req, res) => {
	try {
		const q = (req.query.q || '').trim();
		let query = Product.find({ status: 'active' });
		if (q) {
			query = query.find({ $or: [
					{ name: { $regex: q, $options: 'i' } },
					{ sku_id: { $regex: q, $options: 'i' } }
				]});
		}
		query = query.limit(20); // top 20
		const results = await query.exec();
		// Возвращаем массив
		const data = results.map((p) => ({
			id: p._id,
			sku_id: p.sku_id,
			name: p.name,
			price: p.price,
			slug: p.url,
		}));
		return res.json(data);
	} catch (err) {
		res.status(500).json({ detail: "Server error" });
	}
};
