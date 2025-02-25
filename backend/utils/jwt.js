const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
	const payload = {
		userId: user._id.toString(),
		role: user.role,
		username: user.username
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '1h'
	});
	return token;
}

module.exports = { generateAccessToken };
