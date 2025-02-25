// order.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ORDER_STATUSES = ['new','confirmed','paid','shipped','completed','returned','to_pay'];

const orderSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	state: { type: String, enum: ORDER_STATUSES, default: 'new' },
	total: { type: Number, default: 0 },
	currency: { type: String, default: 'UAH' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
