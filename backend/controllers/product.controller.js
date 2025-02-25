// controllers/product.controller.js
const Product = require('../models/product.model');
const ProductFeature = require('../models/productFeature.model');
const Feature = require('../models/feature.model');
const FeatureValue = require('../models/featureValue.model');
const ProductImage = require('../models/productImage.model');

exports.listProducts = async (req, res) => {
	try {
		// Если ?fv_product_list=promo, то мы фильтруем товары,
		// иначе возвращаем все.
		const fvValue = req.query.fv_product_list;  // строка, например 'promo'
		let productIds = null;

		if (fvValue) {
			// 1) Находим Feature с code='product_list'
			const feature = await Feature.findOne({ code: 'product_list' });
			if (!feature) {
				// если нет такой характеристики, можно вернуть пустой массив
				return res.json([]);
			}

			// 2) Находим FeatureValue, где featureId=feature._id и value=fvValue
			const fv = await FeatureValue.findOne({ featureId: feature._id, value: fvValue });
			if (!fv) {
				return res.json([]);
			}

			// 3) Находим ProductFeature, где featureId=feature._id и featureValueId=fv._id
			const pfs = await ProductFeature.find({
				featureId: feature._id,
				featureValueId: fv._id
			});

			// 4) Собираем список productIds
			productIds = pfs.map((pf) => pf.productId);
		}

		// 5) Ищем товары.
		// Если productIds===null => значит без фильтра, берём все.
		let query = { status: 'active' };
		if (productIds) {
			query._id = { $in: productIds };
		}

		const products = await Product.find(query);

		// 6) Для каждого товара - подгружаем главное изображение
		let result = [];
		for (let p of products) {
			// Ищем ProductImage (isMain=true) или первое
			const images = await ProductImage.find({ productId: p._id }).sort({ sortOrder: 1 });
			let mainImg = images.find((img) => img.isMain) || images[0];

			let mainImgUrl = null;
			if (mainImg && mainImg.imagePath) {
				// Собираем абсолютный URL
				mainImgUrl = `${req.protocol}://${req.get('host')}/uploads/${mainImg.imagePath}`;
			}

			result.push({
				id: p._id,
				sku_id: p.sku_id,
				name: p.name,
				price: p.price,
				image_filename: mainImgUrl,
				slug: p.url
			});
		}

		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: 'Server error' });
	}
};
