// === RTK-Query : мониторинг цен конкурентов =========================
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const priceControlApi = createApi({
	reducerPath: 'priceControlApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['PriceMonitor'],
	endpoints: (builder) => ({
		// GET /pricing/competitor-prices/aggregate/
		getPriceMonitor: builder.query({
			query: ({
				client,
				product,
				vendor,
				diffCategory, // -1 | 1 | undefined
			}) => ({
				url: '/pricing/competitor-prices/aggregate/',
				method: 'GET',
				params: {
					...(client ? { client } : {}),
					...(product ? { product } : {}),
					...(vendor ? { vendor } : {}),
					...(diffCategory ? { diff_category: diffCategory } : {}),
				},
			}),
			providesTags: [{ type: 'PriceMonitor', id: 'LIST' }],
		}),
	}),
});

export const { useGetPriceMonitorQuery } = priceControlApi;
