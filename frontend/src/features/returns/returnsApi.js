// src/features/returns/returnsApi.js
// === RTK-Query: клиентские возвраты =========================
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../..//services/axiosBaseQuery';

export const returnsApi = createApi({
	reducerPath: 'returnsApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Returns'],
	endpoints: (builder) => ({
		// GET /orders/returns/
		getReturns: builder.query({
			query: ({
				page = 1,
				pageSize = 20,
				ordering,
				returnId,
				after,
				before,
				orderNumber,
				client,
				product,
				manager,
			}) => ({
				url: '/orders/returns/',
				method: 'GET',
				params: {
					page,
					page_size: pageSize,
					...(ordering ? { ordering } : {}),
					...(returnId ? { return_id: returnId } : {}),
					...(after ? { return_date_after: after } : {}),
					...(before ? { return_date_before: before } : {}),
					...(orderNumber ? { order_number: orderNumber } : {}),
					...(client ? { client: client } : {}),
					...(product ? { product: product } : {}),
					...(manager ? { internal_manager: manager } : {}),
				},
			}),

			transformResponse: (resp) => ({
				total: resp.count,
				results: resp.results,
			}),

			providesTags: (resp) =>
				resp?.results
					? [
							...resp.results.map((r) => ({
								type: 'Returns',
								id: r.return_id,
							})),
							{ type: 'Returns', id: 'LIST' },
						]
					: [{ type: 'Returns', id: 'LIST' }],
		}),
	}),
});

export const { useGetReturnsQuery } = returnsApi;
