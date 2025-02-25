// src/api/clientsApi.js
import axiosInstance from './axiosInstance.js';

/**
 * Получить список клиентов
 * @param {string} langParam - Код языка (ru/uk/...)
 * @returns {Promise} Promise с данными о клиентах
 */
export async function getClients(langParam) {
	return axiosInstance.get('/api/auth/clients/', {
		params: { lang: langParam },
	});
}

/**
 * Получить список клиентских групп
 * @returns {Promise} Promise с данными о группах
 */
export async function getClientGroups() {
	return axiosInstance.get('/api/auth/client-groups/');
}

/**
 * Обновить данные клиента (например, роль, группу и т.д.)
 * @param {number|string} clientId - ID клиента
 * @param {object} payload - поля, которые нужно обновить. Например: { role: 'client_admin' }
 * @returns {Promise} Promise результата запроса
 */
export async function updateClient(clientId, payload) {
	return axiosInstance.patch(`/api/auth/clients/${clientId}/`, payload);
}
