const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');

exports.listCarts = async (req, res) => {
	try {
		// req.user.userId (из JWT)
		const carts = await Cart.find({ userId: req.user.userId });
		// populate items? up to you
		return res.json(carts);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.createCart = async (req, res) => {
	try {
		const name = req.body.name || 'Main Cart';
		const cart = new Cart({
			userId: req.user.userId,
			name
		});
		await cart.save();
		// ...
		return res.status(201).json(cart);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.deleteCart = async (req, res) => {
	try {
		const { cartId } = req.params;
		const cart = await Cart.findOne({ _id: cartId, userId: req.user.userId });
		if (!cart) {
			return res.status(404).json({ detail: 'Cart not found' });
		}
		// удаляем cart + items
		await CartItem.deleteMany({ cartId: cart._id });
		await cart.deleteOne();
		return res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.addItemToCart = async (req, res) => {
	try {
		const { cart_id, product_id, quantity } = req.body;
		const cart = await Cart.findOne({ _id: cart_id, userId: req.user.userId });
		if (!cart) {
			return res.status(404).json({ detail: 'Cart not found' });
		}
		let item = await CartItem.findOne({ cartId: cart._id, productId: product_id });
		if (item) {
			item.quantity += (quantity || 1);
			await item.save();
		} else {
			item = new CartItem({
				cartId: cart._id,
				productId: product_id,
				quantity: quantity || 1
			});
			await item.save();
		}
		return res.status(201).json(item);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.updateCartItem = async (req, res) => {
	try {
		const { itemId } = req.params;
		const { quantity } = req.body;
		// find item by _id = itemId => also check cart's userId => join
		let item = await CartItem.findOne({ _id: itemId }).populate('cartId');
		if (!item || (item.cartId.userId.toString() !== req.user.userId)) {
			return res.status(404).json({ detail: 'CartItem not found' });
		}
		item.quantity = quantity;
		await item.save();
		return res.json(item);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.deleteCartItem = async (req, res) => {
	try {
		const { itemId } = req.params;
		const item = await CartItem.findOne({ _id: itemId }).populate('cartId');
		if (!item || (item.cartId.userId.toString() !== req.user.userId)) {
			return res.status(404).json({ detail: 'CartItem not found' });
		}
		await item.deleteOne();
		return res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};
