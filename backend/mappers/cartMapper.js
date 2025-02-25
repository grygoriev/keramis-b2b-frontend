// mappers/cartMapper.js

/**
 * mapCartItem: Преобразуем CartItem документ в объект
 *   { id, productId, quantity, ... }
 */
function mapCartItem(cartItemDoc) {
	let productName = '';
	let productUrl = '';
	if (cartItemDoc.productId) {
		productName = cartItemDoc.productId.name; // product.name
		productUrl = cartItemDoc.productId.url;   // product.url
	}

	return {
		id: cartItemDoc._id,
		productId: cartItemDoc.productId?._id || cartItemDoc.productId,
		product_name: productName,
		product_url: productUrl,
		quantity: cartItemDoc.quantity
	};
}

/**
 * mapCart: Преобразуем Cart документ + массив CartItem в объект
 *   { id, userId, name, items: [...], createdAt, ... }
 */
function mapCart(cartDoc, itemsDocs = []) {
	return {
		id: cartDoc._id,
		userId: cartDoc.userId,
		name: cartDoc.name,
		createdAt: cartDoc.createdAt,
		updatedAt: cartDoc.updatedAt,
		items: itemsDocs.map(mapCartItem)
	};
}

/**
 * mapCarts: если нужно преобразовать массив Cart
 *   вместе с каждым списком items
 */
function mapCarts(cartDocs, itemsByCartIdMap) {
	return cartDocs.map((cartDoc) => {
		const cartItems = itemsByCartIdMap[cartDoc._id] || [];
		return mapCart(cartDoc, cartItems);
	});
}

module.exports = {
	mapCart,
	mapCarts
};
