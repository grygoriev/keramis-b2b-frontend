// src/api/discountsApi.js
import axiosInstance from './axiosInstance.js';

/**
 * Получить список ценовых групп
 * Эндпоинт: /pricing/price-groups/
 * Возвращает [{ id, name, code }, ...]
 */
export async function getPriceGroups() {
	return axiosInstance.get('/pricing/price-groups/');
}

/**
 * Получить список скидок
 * Эндпоинт: /pricing/group-discounts/
 * Возвращает [{ id, client_group, price_group, discount_percent }, ...]
 */
export async function getGroupDiscounts() {
	return axiosInstance.get('/pricing/group-discounts/');
}

/**
 * Обновить данные скидки (PATCH)
 * @param {number} discountId - ID записи скидки
 * @param {object} payload - { client_group?: number, price_group?: number, discount_percent?: number }
 */
export async function updateGroupDiscount(discountId, payload) {
	return axiosInstance.patch(`/pricing/group-discounts/${discountId}/`, payload);
}

/**
 * Создать новую запись скидки (POST)
 * @param {object} payload - { client_group, price_group, discount_percent }
 */
export async function createGroupDiscount(payload) {
	return axiosInstance.post('/pricing/group-discounts/', payload);
}

/**
 * Удалить запись скидки (DELETE)
 * @param {number} discountId - ID записи скидки
 */
export async function deleteGroupDiscount(discountId) {
	return axiosInstance.delete(`/pricing/group-discounts/${discountId}/`);
}
