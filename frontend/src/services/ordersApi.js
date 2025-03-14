// src/services/ordersApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const ordersApi = createApi({
	reducerPath: 'ordersApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Orders'], // если хотим делать invalidatesTags
	endpoints: (builder) => ({
		// 1) Получить список заказов
		getOrders: builder.query({
			query: ({ lang, role, clientFilter }) => {
				// Формируем params
				const params = { lang };
				if (role === 'internal_manager' && clientFilter) {
					params.client = clientFilter;
				}
				return {
					url: '/orders/orders/',
					method: 'GET',
					params,
				};
			},
			// Для рефетча при обновлении
			providesTags: (result) =>
				result
					? [
						...result.map((order) => ({ type: 'Orders', id: order.id })),
						{ type: 'Orders', id: 'LIST' },
					]
					: [{ type: 'Orders', id: 'LIST' }],
		}),

		// 2) Обновление статуса заказа (PATCH /orders/orders/:id/status/)
		updateOrderStatus: builder.mutation({
			query: ({ orderId, newState }) => ({
				url: `/orders/orders/${orderId}/status/`,
				method: 'PATCH',
				data: { state: newState },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Orders', id: arg.orderId },
				{ type: 'Orders', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetOrdersQuery,
	useUpdateOrderStatusMutation,
} = ordersApi;
