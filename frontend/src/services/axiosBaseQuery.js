// src/services/axiosBaseQuery.js

import axiosInstance from '../api/axiosInstance';

/**
 * Кастомный baseQuery для RTK Query, внутри вызывает axiosInstance.
 *
 * Аргумент queryArg:
 *   {
 *     url: string,
 *     method?: 'GET' | 'POST' | 'PATCH' | 'DELETE',
 *     data?: any,   // тело запроса
 *     params?: any, // query-параметры
 *   }
 *
 * Возвращаемый объект:
 *   { data }  или { error }
 *
 */
export const axiosBaseQuery =
	() =>
		async ({ url, method = 'GET', data, params }, { getState, signal }, extraOptions) => {
			try {
				const result = await axiosInstance.request({
					url,
					method,
					data,
					params,
					// Любые доп. поля, типа headers
				});
				return { data: result.data };
			} catch (axiosError) {
				// axiosError.response?.status / axiosError.response?.data
				return {
					error: {
						status: axiosError.response?.status,
						data: axiosError.response?.data,
					},
				};
			}
		};
