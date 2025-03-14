const mongoose = require('mongoose');

async function connectDB(uri) {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('MongoDB connected');
	} catch (err) {
		console.error('Error connecting MongoDB', err);
		process.exit(1);
	}
}

module.exports = connectDB;
