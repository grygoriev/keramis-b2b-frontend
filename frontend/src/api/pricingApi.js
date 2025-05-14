// src/api/pricingApi.js
import axiosInstance from './axiosInstance';

/**
 * GET /pricing/currency-rates/
 * [
 *   { id: 7, currency_id: 'PLN', currency_rate_data: '2025-04-24', currency_rate: '11.0753' },
 *   ...
 * ]
 */
export async function getCurrencyRates() {
	const resp = await axiosInstance.get('/pricing/currency-rates/');
	return resp.data;           // массив
}
