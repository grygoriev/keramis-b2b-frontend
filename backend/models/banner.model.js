// models/banner.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
	imagePath: { type: String, default: null }, // путь к файлу (или URL)
	link_url: { type: String, default: null },
	title: { type: String, required: true },
	description: { type: String, default: '' },
	sort_order: { type: Number, default: 0 },
	start_date: { type: Date, default: null },
	end_date: { type: Date, default: null }
});

module.exports = mongoose.model('Banner', bannerSchema);
