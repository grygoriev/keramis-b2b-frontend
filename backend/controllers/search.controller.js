const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');

exports.searchProducts = async (req, res) => {
	try {
		const q = (req.query.q || '').trim();
		let query = { status: 'active' };

		if (q) {
			query.$or = [
				{ name: { $regex: q, $options: 'i' } },
				{ sku_id: { $regex: q, $options: 'i' } }
			];
		}
		// sort, pagination etc...
		// db query
		let products = await Product.find(query);
		// for pagination, maybe skip/limit + totalCount

		// Подгружаем главное изображение:
		let productList = [];
		for (let p of products) {
			let images = await ProductImage.find({ productId: p._id }).sort({ sortOrder: 1 });
			let mainImg = images.find((img) => img.isMain) || images[0];
			let mainImgUrl = null;
			if (mainImg && mainImg.imagePath) {
				mainImgUrl = `${req.protocol}://${req.get('host')}/uploads/${mainImg.imagePath}`;
			}

			productList.push({
				id: p._id,
				sku_id: p.sku_id,
				name: p.name,
				price: p.price,
				discounted_price: null, // если нужна логика скидки - отдельно
				image_filename: mainImgUrl,
				slug: p.url,
				// ...
			});
		}

		// Формируем ответ
		// count, next, previous, products
		res.json({
			count: productList.length,
			next: null,
			previous: null,
			products: productList
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
			// ...
		}));
		return res.json(data);
	} catch (err) {
		res.status(500).json({ detail: "Server error" });
	}
};
