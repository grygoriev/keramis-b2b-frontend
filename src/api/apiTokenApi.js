// src/api/apiTokenApi.js
import axiosInstance from './axiosInstance';

/**
 * Запросить текущий (действующий) токен пользователя.
 * Эндпоинт: GET /api/auth/my-tokens/
 * Ожидаемый ответ: { "token": "abc123..." } или пустой (если токена нет).
 */
export async function fetchMyToken() {
	return axiosInstance.get('/api/auth/my-tokens/');
}

/**
 * Сгенерировать/перегенерировать токен.
 * Эндпоинт: POST /api/auth/generate-token/
 * Если токен был, он удаляется и создаётся новый.
 * В ответе может ничего не приходить (204), поэтому после вызова
 * нужно повторно запросить fetchMyToken(), чтобы получить новый токен.
 */
export async function generateNewToken() {
	return axiosInstance.post('/api/auth/generate-token/');
}
