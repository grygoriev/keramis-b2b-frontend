// productFeature.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productFeatureSchema = new Schema({
	productId: { type: Schema.Types.ObjectId, ref: 'Product' },
	featureId: { type: Schema.Types.ObjectId, ref: 'Feature' },
	featureValueId: { type: Schema.Types.ObjectId, ref: 'FeatureValue' }
});

module.exports = mongoose.model('ProductFeature', productFeatureSchema);
