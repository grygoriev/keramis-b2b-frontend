// src/api/axiosInstance.js
import axios from 'axios';
import store from '../store/index.js';
import { logout } from '../store/authSlice.js';

// Функция для получения CSRF-токена
function getCookie(name) {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return match[2];
	return null;
}

// Создаем инстанс axios
const axiosInstance = axios.create({
	// baseURL: 'http://localhost:8000',
	baseURL: 'http://localhost:3001',
	timeout: 10000,
	withCredentials: true, // отправлять/принимать cookie
});

// -- Запрос interceptor для CSRF
axiosInstance.interceptors.request.use(
	(config) => {
		const csrf = getCookie('csrftoken');
		if (csrf) {
			config.headers['X-CSRFToken'] = csrf;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// -- Ответ interceptor, чтобы поймать 401 Unauthorized
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Сервер вернул 401 → значит, нет/протух accessToken.
			// 1) Делаем logout в Redux
			store.dispatch(logout());
			// 2) Удаляем role и username из localStorage
			localStorage.removeItem('role');
			localStorage.removeItem('username');
			// 3) Редирект на /login
			// window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
