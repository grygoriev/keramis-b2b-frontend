const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const ClientGroup = require('../models/clientGroup.model');
const { mapOrder } = require('../mappers/orderMapper');

exports.listOrders = async (req, res) => {
	try {
		const user = req.user; // { userId, role }
		let query = {};
		if (user.role !== 'internal_manager') {
			query.userId = user.userId;
		}

		// 1) Ищем заказы
		const orders = await Order.find(query).sort({ createdAt: -1 });

		// 2) Собираем orderIds
		const orderIds = orders.map((o) => o._id);

		// 3) Загружаем все OrderItem, c populate('productId', 'name url')
		const allItems = await OrderItem.find({ orderId: { $in: orderIds } })
			.populate('productId', 'name url');

		// 4) Группируем items
		const itemsByOrderId = {};
		for (let it of allItems) {
			const oidStr = it.orderId.toString();
			if (!itemsByOrderId[oidStr]) {
				itemsByOrderId[oidStr] = [];
			}
			itemsByOrderId[oidStr].push(it);
		}

		// 5) map
		let result = [];
		for (let o of orders) {
			let oItems = itemsByOrderId[o._id.toString()] || [];
			result.push(mapOrder(o, oItems));
		}

		return res.json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ detail: "Server error" });
	}
};

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
		const { orderId } = req.params;
		const { state } = req.body;

		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ detail: 'Order not found' });
		}
		order.state = state;
		await order.save();
		res.json(order);
	} catch (err) {
		res.status(500).json({ detail: 'Server error' });
	}
};
