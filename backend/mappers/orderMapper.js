// mappers/orderMapper.js

function mapOrderItem(orderItemDoc) {
	let productName = '';
	let productUrl = '';
	if (orderItemDoc.productId) {
		productName = orderItemDoc.productId.name;
		productUrl = orderItemDoc.productId.url; // если хотите
	}

	return {
		id: orderItemDoc._id,
		productId: orderItemDoc.productId?._id || orderItemDoc.productId,
		product_name: productName,
		product_url: productUrl,
		price: orderItemDoc.price,
		quantity: orderItemDoc.quantity
	};
}

function mapOrder(orderDoc, itemsDocs = []) {
	return {
		id: orderDoc._id,
		userId: orderDoc.userId,
		state: orderDoc.state,
		total: orderDoc.total,
		currency: orderDoc.currency,
		createdAt: orderDoc.createdAt,
		updatedAt: orderDoc.updatedAt,
		items: itemsDocs.map(mapOrderItem)
	};
}

module.exports = {
	mapOrder
};
