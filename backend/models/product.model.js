const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: String,
	sku_id: { type: String, unique: true },
	url: { type: String, unique: true },
	price: { type: Number, default: 0 },
	status: { type: String, enum: ['active','inactive'], default: 'active' },

	categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
