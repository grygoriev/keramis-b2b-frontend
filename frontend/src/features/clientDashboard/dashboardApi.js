// src/features/clientDashboard/dashboardApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../services/axiosBaseQuery';

export const dashboardApi = createApi({
	reducerPath: 'dashboardApi',
	baseQuery: axiosBaseQuery(),
	endpoints: (b) => ({
		myDiscounts: b.query({
			query: () => ({ url: '/pricing/my-discounts/' }),
			transformResponse: (r) => r, // { client,user,discounts }
		}),

		myBalance: b.query({
			query: () => ({ url: '/api/auth/my-client-balance/' }),
		}),
	}),
});

export const { useMyDiscountsQuery, useMyBalanceQuery } = dashboardApi;
