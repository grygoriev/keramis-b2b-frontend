// featureValue.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featureValueSchema = new Schema({
	featureId: { type: Schema.Types.ObjectId, ref: 'Feature' },
	value: { type: String },
});
featureValueSchema.index({ featureId: 1, value: 1 }, { unique: true });

module.exports = mongoose.model('FeatureValue', featureValueSchema);
