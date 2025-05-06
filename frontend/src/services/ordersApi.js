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
			query: ({
				lang,
				role,
				clientFilter,
				page = 1,
				pageSize = 20,
				state,
				extCode,	// external_order_code
				after,	// YYYY-MM-DD
				before,	// YYYY-MM-DD
				client,	// client
			}) => ({
				url   : '/orders/orders/',
				method: 'GET',
				params: {
					lang,
					page,
					page_size: pageSize,
					...(state   ? { state } : {}),
					...(extCode ? { external_order_code: extCode } : {}),
					...(after   ? { create_datetime_after : after  } : {}),
					...(before  ? { create_datetime_before: before } : {}),
					...(client  ? { client } : {}),
				},
			}),

			transformResponse: (resp) => ({
				total: resp.count,
				next: resp.next,
				prev: resp.previous,
				results: resp.results,
			}),
			// Для рефетча при обновлении
			providesTags: (resp) =>
				resp?.results
					? [
							...resp.results.map((o) => ({ type: 'Orders', id: o.id })),
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

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
