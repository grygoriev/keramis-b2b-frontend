// feature.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featureSchema = new Schema({
	code: { type: String, unique: true },
	name: { type: String },
	status: { type: Boolean, default: true },
	multiple: { type: Boolean, default: false },
});

module.exports = mongoose.model('Feature', featureSchema);
