import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000', // адрес вашего Django-сервера
	timeout: 10000,
});

// Interceptor для добавления токена к заголовкам, если есть
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export default axiosInstance;
