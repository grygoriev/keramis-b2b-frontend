const Category = require('../models/category.model');
const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');
const ProductFeature = require('../models/productFeature.model');
const Feature = require('../models/feature.model');
const FeatureValue = require('../models/featureValue.model');

// GET /catalog/categories/tree/
exports.getCategoryTree = async (req, res) => {
	try {
		const rootCats = await Category.find({ parentId: null, status: true });

		const buildTree = async (cat) => {
			const children = await Category.find({ parentId: cat._id, status: true });
			let childrenData = [];
			for (let child of children) {
				childrenData.push(await buildTree(child));
			}
			return {
				id: cat._id,
				slug: cat.slug,
				name: cat.name,
				icon: cat.icon,
				children: childrenData
			};
		};

		let result = [];
		for (let rc of rootCats) {
			result.push(await buildTree(rc));
		}
		res.json(result);
	} catch (err) {
		res.status(500).json({ detail: "Server error" });
	}
};

// GET /catalog/categories/:slug/detail/
exports.getCategoryDetail = async (req, res) => {
	try {
		const { slug } = req.params;
		const category = await Category.findOne({ slug, status: true });
		if (!category) {
			return res.status(404).json({ detail: "Category not found" });
		}

		// Хлебные крошки - упрощённо
		let breadcrumbs = [
			{ slug: category.slug, name: category.name }
		];

		// Ищем товары (status='active')
		const products = await Product.find({ categoryId: category._id, status: 'active' });

		// Для каждого product -> ищем главное изображение (isMain=true) или первое по sortOrder
		// Затем возвращаем в поле "image_filename"
		const productList = [];
		for (let p of products) {
			// Ищем картинки
			const images = await ProductImage.find({ productId: p._id }).sort({ sortOrder: 1 });
			let mainImg = images.find((img) => img.isMain) || images[0];

			// Формируем абсолютный URL (если нужно). imagePath хранит имя файла в папке /uploads
			let mainImgUrl = null;
			if (mainImg && mainImg.imagePath) {
				mainImgUrl = `${req.protocol}://${req.get('host')}/uploads/${mainImg.imagePath}`;
			}

			productList.push({
				id: p._id,
				slug: p.url,
				name: p.name,
				price: p.price,
				image_filename: mainImgUrl || null
			});
		}

		res.json({
			category: { id: category._id, slug: category.slug, name: category.name },
			breadcrumbs,
			products: productList
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ detail: "Server error" });
	}
};

// GET /catalog/products/:slug/detail/
exports.getProductDetail = async (req, res) => {
	try {
		const { slug } = req.params;
		const product = await Product.findOne({ url: slug, status: 'active' });
		if (!product) {
			return res.status(404).json({ detail: "Product not found" });
		}

		// 1) Загружаем изображения
		const images = await ProductImage.find({ productId: product._id }).sort({ sortOrder: 1 });
		// Преобразуем в массив объектов { url, is_main, sort_order }, etc.
		let imagesData = images.map((img) => {
			let fullUrl = null;
			if (img.imagePath) {
				fullUrl = `${req.protocol}://${req.get('host')}/uploads/${img.imagePath}`;
			}
			return {
				url: fullUrl,
				is_main: img.isMain,
				sort_order: img.sortOrder
			};
		});

		// Главное изображение (image_filename) - isMain или первое
		let mainImg = images.find((img) => img.isMain) || images[0];
		let mainImgUrl = null;
		if (mainImg && mainImg.imagePath) {
			mainImgUrl = `${req.protocol}://${req.get('host')}/uploads/${mainImg.imagePath}`;
		}

		// Хлебные крошки
		let breadcrumbs = [];

		// 2) Загружаем productFeature
		const pfList = await ProductFeature.find({ productId: product._id });

		// Собираем в JS-объект: featureId -> { feature, values:[] }
		// затем подтянем Feature, FeatureValue
		let featuresMap = {};
		for (let pf of pfList) {
			let feature = await Feature.findById(pf.featureId);
			let fvalue = await FeatureValue.findById(pf.featureValueId);

			if (!featuresMap[feature._id]) {
				featuresMap[feature._id] = {
					id: feature._id,
					name: feature.name,
					status: feature.status,
					multiple: feature.multiple,
					values: []
				};
			}
			featuresMap[feature._id].values.push(fvalue.value);
		}

		// Трансформируем в массив
		// если multiple=false => value= (single)
		let featuresArray = [];
		for (let fId in featuresMap) {
			let fData = featuresMap[fId];
			if (fData.multiple) {
				featuresArray.push({
					id: fData.id,
					status: fData.status,
					name: fData.name,
					value: fData.values
				});
			} else {
				featuresArray.push({
					id: fData.id,
					status: fData.status,
					name: fData.name,
					value: fData.values[0] || ''
				});
			}
		}

		res.json({
			product: {
				id: product._id,
				slug: product.url,
				name: product.name,
				price: product.price,
				description: product.description || null,
				image_filename: mainImgUrl,
				images: imagesData,
				features: featuresArray
			},
			breadcrumbs
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ detail: "Server error" });
	}
};
