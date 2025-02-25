const jwt = require('jsonwebtoken');

module.exports = function authJwt(req, res, next) {
	const token = req.cookies.accessToken; // берем токен из куки
	if (!token) {
		return res.status(401).json({ detail: 'Unauthorized' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// decoded => { userId, role, username, iat, exp }
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ detail: 'Invalid token' });
	}
};
