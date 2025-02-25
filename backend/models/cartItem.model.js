// cartItem.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
	cartId: { type: Schema.Types.ObjectId, ref: 'Cart' },
	productId: { type: Schema.Types.ObjectId, ref: 'Product' },
	quantity: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
