const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
	// user — это объект mongoose, у него _id, role, username
	const payload = {
		userId: user._id.toString(),
		role: user.role,
		username: user.username
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '1h' // или другое время
	});
	return token;
}

module.exports = { generateAccessToken };
