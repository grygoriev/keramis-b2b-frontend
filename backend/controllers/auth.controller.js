const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/jwt');

exports.register = async (req, res) => {
	try {
		const { username, email, password, confirm_password } = req.body;
		if (password !== confirm_password) {
			return res.status(400).json({ detail: "Passwords do not match." });
		}
		const existing = await User.findOne({ username });
		if (existing) {
			return res.status(400).json({ detail: "Username already taken." });
		}
		const hashed = await bcrypt.hash(password, 10);
		const user = new User({
			username,
			email,
			password: hashed,
			role: 'client_user'
		});
		await user.save();

		// генерим accessToken
		const accessToken = generateAccessToken(user);

		// ставим httpOnly cookie
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'Strict',
			path: '/',
			maxAge: 3600 * 1000
		});

		return res.status(201).json({
			role: user.role,
			username: user.username,
			email: user.email
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ detail: "Server error" });
	}
};

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ detail: "Invalid credentials" });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ detail: "Invalid credentials" });
		}
		const accessToken = generateAccessToken(user);

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'Strict',
			path: '/',
			maxAge: 3600 * 1000
		});

		return res.json({
			role: user.role,
			username: user.username
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ detail: "Server error" });
	}
};

exports.logout = (req, res) => {
	res.cookie('accessToken', '', {
		httpOnly: true,
		secure: false,
		sameSite: 'Strict',
		path: '/',
		maxAge: 0
	});
	return res.json({ detail: "logged out" });
};
