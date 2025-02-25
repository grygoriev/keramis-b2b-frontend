const Category = require('../models/category.model');
const Product = require('../models/product.model');

exports.getCategoryTree = async (req, res) => {
	try {
		// Предположим, parentId=null => корень
		const rootCats = await Category.find({ parentId: null, status: true });

		const buildTree = async (cat) => {
			// ищем детей
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

exports.getCategoryDetail = async (req, res) => {
	try {
		const { slug } = req.params;
		const category = await Category.findOne({ slug, status: true });
		if (!category) {
			return res.status(404).json({ detail: "Category not found" });
		}
		// Хлебные крошки (если нет MPTT, делаем упрощённо):
		let breadcrumbs = [
			{ slug: category.slug, name: category.name }
		];

		// Ищем товары
		const products = await Product.find({ categoryId: category._id, status: 'active' });

		res.json({
			category: { id: category._id, slug: category.slug, name: category.name },
			breadcrumbs,
			products: products.map((p) => ({
				id: p._id,
				slug: p.url,
				name: p.name,
				price: p.price,
			}))
		});
	} catch (err) {
		res.status(500).json({ detail: "Server error" });
	}
};

exports.getProductDetail = async (req, res) => {
	try {
		const { slug } = req.params;
		const product = await Product.findOne({ url: slug, status: 'active' });
		if (!product) {
			return res.status(404).json({ detail: "Product not found" });
		}

		// images? if you store them in product.images as array?
		// or have separate model?

		res.json({
			product: {
				id: product._id,
				slug: product.url,
				name: product.name,
				price: product.price,
			},
			breadcrumbs: []
		});
	} catch (err) {
		res.status(500).json({ detail: "Server error" });
	}
};
