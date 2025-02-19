// src/api/ordersApi.js
import axiosInstance from './axiosInstance';

/**
 * Получить список заказов (GET /orders/)
 */
export async function getOrders(lang) {
	const response = await axiosInstance.get(`/orders/orders/`, {
		params: { lang }, // например ?lang=ru или ?lang=uk
	});
	return response.data;
}

/**
 * Обновить статус заказа (PATCH /orders/<id>/status/)
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
	return response.data; // возвращает созданный заказ
}
