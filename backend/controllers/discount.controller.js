// discount.controller.js
const GroupDiscount = require('../models/groupDiscount.model');

exports.createGroupDiscount = async (req, res) => {
	try {
		// req.body => { client_group, price_group, discount_percent }
		const gd = new GroupDiscount(req.body);
		await gd.save();
		return res.status(201).json(gd);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.updateGroupDiscount = async (req, res) => {
	try {
		const { discountId } = req.params;
		const gd = await GroupDiscount.findById(discountId);
		if (!gd) {
			return res.status(404).json({ detail: 'Not found' });
		}
		// apply partial updates
		if (req.body.client_group !== undefined) gd.client_group = req.body.client_group;
		if (req.body.price_group !== undefined) gd.price_group = req.body.price_group;
		if (req.body.discount_percent !== undefined) gd.discount_percent = req.body.discount_percent;
		await gd.save();
		return res.json(gd);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.deleteGroupDiscount = async (req, res) => {
	try {
		const { discountId } = req.params;
		await GroupDiscount.findByIdAndDelete(discountId);
		return res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.getGroupDiscounts = async (req, res) => {
	try {
		const list = await GroupDiscount.find();
		return res.json(list);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};
