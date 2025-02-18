// src/api/ordersApi.js
import axiosInstance from './axiosInstance';

/**
 * Получить список заказов (GET /orders/)
 */
export async function getOrders() {
	const response = await axiosInstance.get('/orders/');
	return response.data; // массив заказов
}

/**
 * Обновить статус заказа (PATCH /orders/<id>/status/)
 * body: { "state": "confirmed" }
 */
export async function updateOrderStatus(orderId, newState) {
	const response = await axiosInstance.patch(`/orders/${orderId}/status/`, {
		state: newState
	});
	return response.data; // обновлённый заказ
}
