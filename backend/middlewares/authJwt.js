const jwt = require('jsonwebtoken');

module.exports = function authJwt(req, res, next) {
	const token = req.cookies.accessToken;
	if (!token) {
		return res.status(401).json({ detail: 'Unauthorized' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ detail: 'Invalid token' });
	}
};
