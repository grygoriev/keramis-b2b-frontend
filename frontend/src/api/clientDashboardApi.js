// src/api/clientDashboardApi.js
import axiosInstance from './axiosInstance';

/** GET /pricing/my-discounts/ */
export async function fetchMyDiscounts() {
	const { data } = await axiosInstance.get('/pricing/my-discounts/');
	return data;          // { client, user, discounts:[] }
}

/** GET /api/auth/my-client-balance/ */
export async function fetchMyBalance() {
	const { data } = await axiosInstance.get('/api/auth/my-client-balance/');
	return data;          // [ {currency,balance}, … ]
}
