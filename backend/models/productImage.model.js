// models/productImage.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productImageSchema = new Schema({
	productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
	imagePath: { type: String, default: null },
	sortOrder: { type: Number, default: 0 },
	isMain: { type: Boolean, default: false }
}, {
	timestamps: true
});

module.exports = mongoose.model('ProductImage', productImageSchema);
