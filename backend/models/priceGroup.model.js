// models/priceGroup.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceGroupSchema = new Schema({
	name: { type: String, required: true, unique: true },
	code: { type: String, required: true, unique: true }, // "retail", "wholesale"
});

module.exports = mongoose.model('PriceGroup', priceGroupSchema);
