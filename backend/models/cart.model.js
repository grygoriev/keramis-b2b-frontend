// cart.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	name: { type: String, default: 'Main Cart' }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
