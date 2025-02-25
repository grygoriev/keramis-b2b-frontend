const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
	status: { type: Boolean, default: true },
	icon: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
