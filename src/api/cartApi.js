// src/api/cartApi.js
import axiosInstance from './axiosInstance';

/**
 * Получить список корзин текущего пользователя
 * GET /orders/carts/
 */
export async function getCarts(lang) {
	const response = await axiosInstance.get('/orders/carts/', {
		params: { lang }, // например ?lang=ru или ?lang=uk
	});
	return response.data; // массив [{id, name, items:[...]}]
}

/**
 * Создать новую корзину
 * POST /orders/carts/  { name?: string }
 */
export async function createCart(name) {
	const response = await axiosInstance.post('/orders/carts/', { name });
	return response.data; // {id, name, items:[]}
}

/**
 * Удалить корзину
 * @param cartId
 * @returns {Promise<number>}
 */
export async function deleteCart(cartId) {
	// вызываем DELETE /orders/carts/<cartId>/
	const response = await axiosInstance.delete(`/orders/carts/${cartId}/`);
	return response.status;
}

/**
 * Добавить товар в корзину
 * POST /orders/cart-items/ { "cart_id", "product_id", "quantity" }
 */
export async function addItemToCart(cartId, productId, quantity = 1) {
	const response = await axiosInstance.post('/orders/cart-items/', {
		cart_id: cartId,
		product_id: productId,
		quantity,
	});
	return response.data; // {id, product, quantity}
}

/**
 * Удалить товар из корзины
 * DELETE /orders/cart-items/<item_id>/
 */
export async function deleteCartItem(itemId) {
	const response = await axiosInstance.delete(`/orders/cart-items/${itemId}/`);
	return response.status;
}

/**
 * Обновляем количество товара
 * @param itemId
 * @param quantity
 * @returns {Promise<any>}
 */
export async function updateCartItem(itemId, quantity) {
	// Нужен эндпоинт PATCH /orders/cart-items/<itemId>/ { "quantity": ... }
	const response = await axiosInstance.patch(`/orders/cart-items/${itemId}/`, {
		quantity: quantity,
	});
	return response.data; // {id, product, quantity} (обновлённая инфа)
}

/**
 * Оформить заказ (checkout) из корзины
 * POST /orders/checkout/ { "cart_id": ... }
 */
export async function checkoutCart(cartId) {
	const response = await axiosInstance.post('/orders/checkout/', {
		cart_id: cartId,
	});
	return response.data; // возвращает данные о заказе
}
