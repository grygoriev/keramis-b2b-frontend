const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const { mapCarts } = require('../mappers/cartMapper');
const { mapCart } = require('../mappers/cartMapper');

exports.listCarts = async (req, res) => {
	try {
		const userId = req.user.userId;
		const carts = await Cart.find({ userId });

		// Оптимизированный вариант:
		// 1) Собрать все cartIds
		const cartIds = carts.map(c => c._id);
		// 2) Найти CartItem с populate('productId')
		const allItems = await CartItem.find({ cartId: { $in: cartIds } })
			.populate('productId', 'name url');
		// указываем поля: 'name url', чтоб не тянуть все поля из Product

		// 3) Группируем items
		const itemsByCartId = {};
		for (let it of allItems) {
			const cIdStr = it.cartId.toString();
			if (!itemsByCartId[cIdStr]) {
				itemsByCartId[cIdStr] = [];
			}
			itemsByCartId[cIdStr].push(it);
		}

		// 4) маппим carts => [{id, userId, name, items: [..] }]
		const result = mapCarts(carts, itemsByCartId);

		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: "Server error" });
	}
};

exports.getCartDetail = async (req, res) => {
	try {
		const { cartId } = req.params;
		const userId = req.user.userId;
		const cart = await Cart.findOne({ _id: cartId, userId });
		if (!cart) {
			return res.status(404).json({ detail: "Cart not found." });
		}

		// грузим items + populate
		const items = await CartItem.find({ cartId: cart._id })
			.populate('productId', 'name url');

		const mapped = mapCart(cart, items);
		return res.json(mapped);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: "Server error" });
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
