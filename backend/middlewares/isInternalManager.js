module.exports = function isInternalManager(req, res, next) {
	if (!req.user || req.user.role !== 'internal_manager') {
		return res.status(403).json({ detail: 'Forbidden' });
	}
	next();
};
