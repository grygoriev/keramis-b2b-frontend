import axiosInstance from './axiosInstance';

export async function loginRequest(username, password) {
	// допустим, бэкенд принимает POST { username, password }
	const response = await axiosInstance.post('/api/auth/login/', {
		username,
		password,
	});
	return response.data;
}
