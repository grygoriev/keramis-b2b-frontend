const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: ['internal_manager','client_admin','client_manager','client_user'],
		default: 'client_user'
	},
	client_group: { type: Schema.Types.ObjectId, ref: 'ClientGroup', default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
