const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');

exports.checkoutCart = async (req, res) => {
	try {
		const { cart_id } = req.body;
		const cart = await Cart.findOne({ _id: cart_id, userId: req.user.userId });
		if (!cart) {
			return res.status(404).json({ detail: 'Cart not found' });
		}
		const items = await CartItem.find({ cartId: cart._id });
		let total = 0;
		const order = new Order({
			userId: req.user.userId,
			state: 'new',
			total: 0,
			currency: 'UAH'
		});
		await order.save();

		for (let ci of items) {
			// find product, calc price
			// let price = getClientPrice(product, user)???
			// or just product.price for now
			// ...
			let price = 100; // placeholder
			const oi = new OrderItem({
				orderId: order._id,
				productId: ci.productId,
				price,
				quantity: ci.quantity
			});
			total += price * ci.quantity;
			await oi.save();
		}
		order.total = total;
		await order.save();

		// clear cart
		await CartItem.deleteMany({ cartId: cart._id });

		// return order with items
		// populate or manually fetch
		res.status(201).json(order);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};

exports.updateOrderStatus = async (req, res) => {
	try {
		// req.user.role must be 'internal_manager' => or use isInternalManager
		const { orderId } = req.params;
		const { state } = req.body;

		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ detail: 'Order not found' });
		}
		// check if state in allowed
		// ...
		order.state = state;
		await order.save();
		res.json(order);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};
