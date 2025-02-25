// routes/productImage.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductImage = require('../models/productImage.model');

// Настраиваем multer
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/'); // папка для хранения
	},
	filename: function(req, file, cb) {
		// уникальное имя
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext);
		const finalName = base + '-' + Date.now() + ext;
		cb(null, finalName);
	}
});

const upload = multer({ storage });

router.post('/:productId/images', upload.single('image'), async (req, res) => {
	try {
		const { productId } = req.params;
		// req.file.path => 'uploads/filename.jpg'
		if (!req.file) {
			return res.status(400).json({ detail: 'No file uploaded' });
		}
		// создаем ProductImage doc
		const productImage = new ProductImage({
			productId,
			imagePath: req.file.filename, // или req.file.path
			sortOrder: req.body.sortOrder || 0,
			isMain: !!req.body.isMain
		});
		await productImage.save();
		res.status(201).json(productImage);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
});

module.exports = router;
