// orderItem.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
	orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
	productId: { type: Schema.Types.ObjectId, ref: 'Product' },
	price: { type: Number, default: 0 },
	quantity: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('OrderItem', orderItemSchema);
