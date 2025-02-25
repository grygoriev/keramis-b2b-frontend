// src/api/ordersApi.js
import axiosInstance from './axiosInstance.js';

/**
 * Получить список заказов (GET /orders/orders/)
 * Принимает объект параметров, например: { lang: 'ru', client: 5 }
 */
export async function getOrders(params) {
	const response = await axiosInstance.get('/orders/orders/', {
		params, // отправляет query-параметры, например ?lang=ru&client=5
	});
	return response.data; // массив заказов
}

/**
 * Обновить статус заказа (PATCH /orders/orders/<id>/status/)
 * body: { "state": "confirmed" }
 */
export async function updateOrderStatus(orderId, newState) {
	const response = await axiosInstance.patch(`/orders/orders/${orderId}/status/`, {
		state: newState,
	});
	return response.data; // обновлённый заказ
}

/**
 * Оформить заказ (Checkout) из корзины
 * POST /orders/checkout/
 * body: { cart_id: ... }
 */
export async function checkoutCart(cartId) {
	const response = await axiosInstance.post('/orders/checkout/', {
		cart_id: cartId,
	});
	return response.data; // созданный заказ
}
