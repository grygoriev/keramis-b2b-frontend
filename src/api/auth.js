// src/api/auth.js
import axiosInstance from './axiosInstance';

export async function loginRequest(username, password) {
	// допустим, бэкенд принимает POST { username, password }
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
