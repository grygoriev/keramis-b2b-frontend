// src/api/auth.js
import axiosInstance from './axiosInstance.js';

/**
 * Регистрация нового пользователя
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} confirm_password
 * @param recaptchaToken
 * @returns {Promise<object>} объект с полями { role, username, ...}
 */
export async function registerRequest(
	username,
	email,
	password,
	confirm_password,
	recaptchaToken = null,
) {
	const payload = {
		username,
		email,
		password,
		confirm_password,
	};

	if (recaptchaToken) {
		payload.recaptcha_token = recaptchaToken;
	}

	const response = await axiosInstance.post('/api/auth/register/', payload);
	return response.data;
}

/**
 * Логин
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>}
 */
export async function loginRequest(username, password) {
	const response = await axiosInstance.post('/api/auth/login/', {
		username,
		password,
	});
	return response.data;
}

/** Логаут */
export async function logoutRequest() {
	// Вызываем POST /api/auth/logout, передавая cookie
	// thanks to withCredentials:true in axiosInstance, cookie отправится
	const response = await axiosInstance.post('/api/auth/logout/');
	return response.data; // { detail: "logged out" }
}
