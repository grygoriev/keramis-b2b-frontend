const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupDiscountSchema = new Schema({
	client_group: { type: Schema.Types.ObjectId, ref: 'ClientGroup' },
	price_group: { type: Schema.Types.ObjectId, ref: 'PriceGroup' },
	discount_percent: { type: Number, default: 0 }
});

// unique combo
groupDiscountSchema.index({ client_group: 1, price_group: 1 }, { unique: true });

module.exports = mongoose.model('GroupDiscount', groupDiscountSchema);
