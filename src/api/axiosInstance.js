import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000', // адрес вашего Django-сервера
	timeout: 10000,
	withCredentials: true,
});

function getCookie(name) {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return match[2];
	return null;
}

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

export default axiosInstance;
