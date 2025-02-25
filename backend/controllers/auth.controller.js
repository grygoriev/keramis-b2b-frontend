const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../utils/jwt');
const ClientGroup = require('../models/clientGroup.model');

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

exports.listClients = async (req, res) => {
	try {
		// 1) Находим всех пользователей (кроме internal_manager),
		//    и сразу делаем populate('client_group', 'name'),
		//    чтобы взять только поле "name" из ClientGroup.
		const users = await User.find({
			role: { $ne: 'internal_manager' }
		})
			.sort({ username: 1 })
			.populate('client_group', 'name');

		// 2) Маппим _id -> id. Если u.client_group — объект, берём u.client_group.name.
		const mapped = users.map((u) => ({
			id: u._id,
			username: u.username,
			email: u.email,
			role: u.role,
			client_group: u.client_group ? u.client_group._id : null,
			client_group_name: u.client_group ? u.client_group.name : null,
			createdAt: u.createdAt,
		}));

		return res.json(mapped);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: 'Server error' });
	}
};

exports.listClientGroups = async (req, res) => {
	try {
		const groups = await ClientGroup.find({}).sort({ name: 1 });
		// Маппим _id -> id
		const mapped = groups.map(g => ({
			id: g._id,
			name: g.name
		}));
		return res.json(mapped);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: 'Server error' });
	}
};

exports.updateClient = async (req, res) => {
	try {
		const { clientId } = req.params;

		// 1) Ищем пользователя по _id=clientId
		let user = await User.findById(clientId);
		if (!user) {
			return res.status(404).json({ detail: "User not found" });
		}

		// 2) Из тела запроса берём поля, которые можно обновлять:
		// например, role, client_group (id), email...
		const { role, client_group, email, first_name, last_name } = req.body;

		// Пример: запрещаем ставить role='internal_manager', если хотите
		if (role && role === 'internal_manager') {
			// или любые другие проверки
			return res.status(400).json({ detail: "Setting role=internal_manager is not allowed" });
		}

		// обновляем роль, если передали
		if (role) {
			user.role = role;
		}

		// обновляем группу, если передали
		if (client_group) {
			// проверим, есть ли такая группа?
			const groupDoc = await ClientGroup.findById(client_group);
			if (!groupDoc) {
				return res.status(400).json({ detail: "Invalid client_group id" });
			}
			user.client_group = groupDoc._id;
		} else if (client_group === null) {
			// если хотим убрать группу
			user.client_group = null;
		}

		if (email) {
			user.email = email;
		}

		if (first_name !== undefined) {
			user.first_name = first_name;
		}

		if (last_name !== undefined) {
			user.last_name = last_name;
		}

		// 3) Сохраняем
		await user.save();

		// 4) Формируем ответ (id вместо _id)
		// или использовать toObject()
		const updated = {
			id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			client_group: user.client_group,
			first_name: user.first_name,
			last_name: user.last_name
		};

		return res.json(updated);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: "Server error" });
	}
};
